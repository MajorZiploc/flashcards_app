import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
  SafeAreaView,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Text } from '../../components/StyledText';
import { Button, Dropdown, RadioGroup } from '../../components';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import {getDBConnection, getDecks, saveCards, saveDecks} from './SqliteData';
import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
import OurModal from './OurModal';

const defaultCardDelimiter = ' - ';

export default function CreateDeck() {

  /** @type {import('../interfaces').useState<string | undefined>} */
  const [deckName, setDeckName] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [errorMessage, setErrorMessage] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [successfulUploadMessage, setSuccessfulUploadMessage] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [fileContent, setFileContent] = useState();
  /** @type {import('../interfaces').useState<string>} */
  const [cardDelimiter, setCardDelimiter] = useState(defaultCardDelimiter);
  /** @type {import('../interfaces').useState<boolean>} */
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectFile = () => {
    (async () => {
      const [{name, uri}] = await pick({ mode: 'import', allowMultiSelection: false, type: [types.plainText] });
      console.log('name, uri');
      console.log(name, uri);
      if (!name) throw "invalid file - file has no name";
      // TODO: this creates a copy in the apps storage - would be nice to delete this copy after getting the file content
      const [docContent] = await keepLocalCopy({
        files: [
          {
            uri,
            fileName: name,
          },
        ],
        destination: 'documentDirectory',
      })
      console.log('docContent');
      console.log(docContent);
      if (docContent.status === 'success') {
        const fileSize = await RNFS.stat(docContent.localUri).then(stat => stat.size);
        if (fileSize > 5 * 1024 * 1024) throw 'File size exceeds 5MB limit';
        const _fileContent = await RNFS.readFile(docContent.localUri);
        console.log(_fileContent)
        // TODO: consider storing the localUri instead of whole fileContent here - then read file (hopefully as a stream) in the submit action when creating the deck
        setFileContent(_fileContent);
        setDeckName(name);
      }
    })().catch((err) => {
      if (err.toString().includes('user canceled')) {
        // User cancelled the picker
      } else {
        setErrorMessage('Error uploading file:', err);
      }
    });
  }

  const onPressSubmit = () => {
    (async () => {
      // TODO: if home page doesnt refresh then manage decks in redux and refresh the getDecks at the end of this for the home page
      // TODO: add loading disable of form fields
      if (!deckName) throw 'Must specify a deck name!';
      if (!fileContent) throw 'no file was selected because no file content was found';
      const _cardDelimiter = cardDelimiter || defaultCardDelimiter;
      const db = await getDBConnection();
      const existingConflictingDecks = await getDecks(db, [deckName]);
      if (existingConflictingDecks.length > 0) throw `Deck named: ${deckName} already exists`;
      await saveDecks(db, [{name: deckName}]);
      const deck = (await getDecks(db, [deckName]))[0];
      const cards = fileContent.split("\n").filter(line => line.includes(_cardDelimiter)).filter((l, idx) => idx < 4).map(line => {
        const splitLine = line.split(_cardDelimiter);
        const term = splitLine[0];
        const definition = splitLine.splice(1).join(_cardDelimiter);
        return {term, definition};
      });
      await saveCards(db, cards, deck);
    })()
      .then(() => {
        console.log('successful')
        setErrorMessage(undefined);
        setSuccessfulUploadMessage(`successfully uploaded deck: ${deckName}!`);
      })
      .catch((e) => {
        console.log(e);
        console.log('failed');
        setErrorMessage(e);
        setSuccessfulUploadMessage(undefined);
      })
      .finally(() => console.log('submit completed'));
  }

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <OurModal modalVisible={modalVisible} setModalVisible={setModalVisible} message={errorMessage} subMessage={successfulUploadMessage} style={styles.errorModal} />
      ) : successfulUploadMessage ? (
        <OurModal modalVisible={modalVisible} setModalVisible={setModalVisible} message={successfulUploadMessage} style={styles.infoModal} />
      ) : <></>}
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.section}>
          <Text>Term to Definition Delimiter (Separator)</Text>
          <TextInput
            placeholder='(Default: " - ")'
            style={styles.deckNameInput}
            value={cardDelimiter}
            onChangeText={setCardDelimiter}
          />
          <Button
            style={[styles.button]}
            disabled={false}
            caption="Pick File"
            onPress={() => {
              onSelectFile();
            }}
          />
          <TextInput
            placeholder='Deck Name'
            style={styles.deckNameInput}
            value={deckName}
            onChangeText={setDeckName}
          />
          <Button
            style={[styles.button]}
            disabled={false}
            caption="Submit"
            onPress={() => {
              onPressSubmit();
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
  successfulUploadSection: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#01b901',
  },
  successfulUploadText: {
    color: '#000000',
  },
  errorSection: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#a11212',
  },
  errorText: {
    color: '#c7cfcc',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#c7cfcc',
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  deckNameInput: {
    backgroundColor: "#FFFFFF",
    color: '#000000',
  },
  errorModal: {
    backgroundColor: '#efa3a9',
  },
  infoModal: {
    backgroundColor: 'white',
  },
});
