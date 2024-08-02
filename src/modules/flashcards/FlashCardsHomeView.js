import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
} from 'react-native';

import { Text } from '../../components/StyledText';
import { Button, RadioGroup } from '../../components';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import {createDeckTable, dropDeckTable, getDBConnection, getDeckItems, saveDecks} from './SqliteData';


const basicCards = [...Array(5).keys()].map((_, idx) => ({
  term: `the term ${idx}`,
  definition: `the definition ${idx}`,
}));

const cardSetNames = [...Array(50).keys()].map((_, idx) => `Set ${idx}`);

const cardSets = cardSetNames.map(cn => ({
  cards: basicCards.map(c => ({term: `${cn} ${c.term}`, definition: `${cn} ${c.definition}`})),
  name: cn,
}))

export default function FlashCardsHomeScreen({ isExtended, setIsExtended, navigation, loadCards, loadCardsAsync }) {
  const [query, setQuery] = useState('');
  const [decks, setDecks] = useState([]);

  console.log('decks');
  console.log(decks);

  useEffect(() => {
    (async () => {
      try {
        const db = await getDBConnection();
        await dropDeckTable(db);
        const initDecks = [{ name: 'Bio1' }, { name: 'CS1' }, { name: 'Math1' }];
        await createDeckTable(db);
        const storedDecks = await getDeckItems(db);
        if (storedDecks.length) {
          setDecks(storedDecks);
        } else {
          await saveDecks(db, initDecks);
          const storedDecks = await getDeckItems(db);
          setDecks(storedDecks);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const renderCardNameItem = ({ item }) => {
    return (
      <Button
        key={item}
        style={styles.button}
        caption={item}
        onPress={() => {
          const selectedSet = cardSets.find(c => c.name === item);
          if (selectedSet) {
            loadCards(selectedSet.cards);
            navigation.navigate('Study Session');
          }
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.section}>
          <View style={styles.cardSetNamesTitleBox}>
            <Text>
              <Icon name="documents" size={25} color="white" />
            </Text>
            <Text style={styles.cardSetNamesTitle}>Decks</Text>
              <TextInput
                placeholder='Search Decks'
                style={styles.searchBox}
                value={query}
                onChangeText={setQuery}
              />
          </View>
          <View style={styles.cardSetNames}>
          <FlatList
            keyExtractor={item => item}
            style={{ backgroundColor: '#000000', paddingHorizontal: 15 }}
            data={cardSetNames.filter(cn => cn.toLowerCase().includes(query.toLowerCase()))}
            renderItem={renderCardNameItem}
          />
          </View>
          <Button
            style={[styles.button]}
            primary
            caption="Import Cards"
            onPress={() => {}}
          />
          <Button
            style={[styles.button]}
            primary
            caption="Settings"
            onPress={() => {
              navigation.navigate('Settings');
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cardSetNames: {
    flex: 1,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  cardSetNamesTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    marginLeft: 4,
  },
  cardSetNamesTitleBox: {
    flexDirection: 'row',
    flexBasis: 'auto',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 4,
  },
  searchBox: {
    backgroundColor: "#FFFFFF",
    marginLeft: 10,
    flexGrow: 3,
    marginRight: 10,
  }
});
