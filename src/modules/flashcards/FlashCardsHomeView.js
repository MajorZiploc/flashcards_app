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
import {createCardTable, createDeckTable, dropCardTable, dropDeckTable, getCards, getDBConnection, getDecks, saveCards, saveDecks, deleteDecks} from './SqliteData';
import RNFS from 'react-native-fs';
import OurModal from './OurModal';

/**
 * @typedef {import('../interfaces').DBCard} DBCard
 * @typedef {import('../interfaces').DBDeck} DBDeck
 */

const basicCards = [...Array(5).keys()].map((_, idx) => ({
  term: `the term ${idx}`,
  definition: `the definition ${idx}`,
}));

const cardSetNames = [...Array(50).keys()].map((_, idx) => `Set ${idx}`);

const cardSets = cardSetNames.map(cn => ({
  cards: basicCards.map(c => ({term: `${cn} ${c.term}`, definition: `${cn} ${c.definition}`})),
  name: cn,
}))

export default function FlashCardsHomeScreen({ isExtended, setIsExtended, navigation, loadCards, loadCardsAsync, decks, deckListSet, }) {
  const [query, setQuery] = useState('');
  /** @type {import('../interfaces').useState<DBDeck[]>} */
  const [_decks, setDecks] = useState([]);
  /** @type {import('../interfaces').useState<boolean>} */
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);

  console.log('decks1');
  console.log(_decks);

  const fetchDecks = () => {
    (async () => {
      try {
        // const filePath = RNFS.DownloadDirectoryPath + "/autoTestCards.txt";
        // const fileContent = basicCards.map(card => `${card.term} - ${card.definition}`).join("\n");
        // await RNFS.writeFile(filePath, fileContent, "utf8");
        const db = await getDBConnection();
        // await dropDeckTable(db);
        // const initDecks = [{ name: 'Bio1' }, { name: 'CS1' }, { name: 'Math1' }];
        await createDeckTable(db);
        await createCardTable(db);
        const storedDecks = await getDecks(db);
        console.log('storedDecks');
        console.log(storedDecks);
        deckListSet(storedDecks);
        setDecks(storedDecks);
        
        // if (storedDecks.length) {
        //   deckListSet(storedDecks);
        // } else {
        //   // await saveDecks(db, initDecks);
        //   // const storedDecks = await getDecks(db);
        //   // deckListSet(storedDecks);
        // }
      } catch (error) {
        console.error(error);
      }
    })();
  }

  useEffect(() => {
    fetchDecks();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (!_decks) return;
  //     try {
  //       const db = await getDBConnection();
  //       await dropCardTable(db);
  //       const initCards = basicCards;
  //       await createCardTable(db);
  //       for (const deck of _decks) {
  //         await saveCards(db, initCards, deck);
  //       }
  //       for (const deck of _decks) {
  //         const dbCards = await getCards(db, deck.id);
  //         console.log('dbCards');
  //         console.log(dbCards);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, [_decks]);

  const onSubmitDelete = (item) => () => {
    (async () => {
      const selectedDeck = _decks.find(deck => deck.name === item);
      if (selectedDeck) {
        const db = await getDBConnection();
        await deleteDecks(db, [selectedDeck.id]);
        fetchDecks();
      }
    })().finally(() => {
      setModalVisibleDelete(false);
    });
  };

  const renderCardNameItem = ({item}) => {
    return (
      <View style={styles.cardContainer}>
        <OurModal modalVisible={modalVisibleDelete} setModalVisible={setModalVisibleDelete} message={'Delete Deck'} subMessage={'Are you sure?'} onSubmit={onSubmitDelete(item)} closeText={'Cancel'} submitText={'Delete'} />
        <TouchableOpacity
          style={styles.cardButton}
        >
          <View>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity
            style={styles.deckActionButton}
            onPress={() => {
              setModalVisibleDelete(true);
            }}
          >
            <Icon name="trash" size={25} color="black" />
          </TouchableOpacity>
          {/* <TouchableOpacity */}
          {/*   style={styles.deckActionButton} */}
          {/*   onPress={() => { */}
          {/*     // Stub for edit logic */}
          {/*   }} */}
          {/* > */}
          {/*   <Icon name="edit" size={25} color="black" /> */}
          {/* </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.deckActionButton}
            onPress={() => {
              (async () => {
                const selectedDeck = _decks.find(deck => deck.name === item);
                if (selectedDeck) {
                  const db = await getDBConnection();
                  const cards = await getCards(db, selectedDeck.id);
                  loadCards(cards);
                  navigation.navigate('Study Session');
                }
              })();
            }}
          >
            <Icon name="controller-play" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>
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
            keyExtractor={(item, idx) => `${item}-${idx}`}
            style={{ backgroundColor: '#c7cfcc', paddingHorizontal: 15 }}
            data={(_decks ?? []).filter(deck => deck.name.toLowerCase().includes(query.toLowerCase())).map(deck => deck.name)}
            renderItem={renderCardNameItem}
          />
          </View>
          <Button
            style={[styles.button]}
            primary
            caption="Create Deck"
            onPress={() => {
              navigation.navigate('Create Deck');
            }}
          />
          <Button
            style={[styles.button]}
            primary
            caption="Settings"
            onPress={() => {
              navigation.navigate('Settings');
            }}
          />
          <Button
            style={[styles.button]}
            primary
            caption="Refresh Decks"
            onPress={() => {
              fetchDecks();
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
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    elevation: 2,
  },
  cardButton: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#000',
  },
  deckActionButton: {
    marginLeft: 10,
    padding: 5,
  },
});
