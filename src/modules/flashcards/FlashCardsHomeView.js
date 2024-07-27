import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
} from 'react-native';

import { Text } from '../../components/StyledText';
import { Button, RadioGroup } from '../../components';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const basicCards = [...Array(5).keys()].map((_, idx) => ({
  term: `the term ${idx}`,
  definition: `the definition ${idx}`,
}));

const cardSetNames = [...Array(50).keys()].map((_, idx) => `Set ${idx}`);

const cardSets = cardSetNames.map(cn => ({
  cards: basicCards.map(c => ({term: `${cn} ${c.term}`, definition: `${cn} ${c.definition}`})),
  name: cn,
}))

export default function FlashCardsHomeScreen({ isExtended, setIsExtended, navigation, isDefinitionFirst, isDefinitionFirstSet, loadCards, loadCardsAsync }) {

  const [selectedFirstIndex, setSelectedFirstIndex] = useState(isDefinitionFirst ? 1 : 0);

  const setIsDefinitionFirst = (index) => {
    setSelectedFirstIndex(index);
    isDefinitionFirstSet(index === 1);
  };

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
          <View style={[styles.radioFirst]}>
            <RadioGroup
              selectedIndex={selectedFirstIndex}
              items={['term', 'definition']}
              onChange={setIsDefinitionFirst}
            />
          </View>
          <View style={styles.cardSetNamesTitleBox}>
            <Text>
              <Icon name="view-list" size={25} color="white" />
              <Text style={styles.cardSetNamesTitle}>Cards</Text>
            </Text>
          </View>
          <ScrollView style={styles.cardSetNames}>
          <FlatList
            keyExtractor={item => item}
            style={{ backgroundColor: '#000000', paddingHorizontal: 15 }}
            data={cardSetNames}
            renderItem={renderCardNameItem}
          />
          </ScrollView>
          <Button
            style={[styles.button]}
            primary
            caption="Import Cards"
            onPress={() => {}}
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
  radioFirst: {
    height: 50,
    width: 150,
  },
  cardSetNamesTitle: {
    color: '#FFFFFF',
    fontSize: 30,
  },
  cardSetNamesTitleBox: {
    display: 'flex',
  }
});
