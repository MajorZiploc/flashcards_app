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

const folderMetadata = [
  {
    label: 'Downloads',
    value: RNFS.DownloadDirectoryPath,
  },
  {
    label: 'Documents',
    value: RNFS.DocumentDirectoryPath,
  },
  {
    label: 'External Storage',
    value: RNFS.ExternalStorageDirectoryPath,
  },
];

export default function CreateDeck({ isDefinitionFirst, isDefinitionFirstSet }) {

  /** @type {import('../interfaces').useState<string | undefined>} */
  const [deckName, setDeckName] = useState();
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(0);
  const [selectedFileIndex, setSelectedFileIndex] = useState(-1);
  /** @type {import('../interfaces').useState<number>} */
  const [updateCount, setUpdateCount] = useState(1);
  /** @type {import('../interfaces').useState<RNFS.ReadDirItem[]>} */
  const [fileChoices, setFileChoices] = useState([]);
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [errorMessage, setErrorMessage] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [successfulUploadMessage, setSuccessfulUploadMessage] = useState();

  useEffect(() => {
    (async () => {
      const path = folderMetadata[selectedFolderIndex].value;
      // TODO: consider making this recursive on sub dirs instead of just top level files
      const files = (await RNFS.readDir(path)).filter(f => f.isFile());
      setFileChoices(files);
    })();
  }, [selectedFolderIndex]);

  const onPressSubmit = () => {
    (async () => {
      // TODO: if home page doesnt refresh then manage decks in redux and refresh the getDecks at the end of this for the home page
      // TODO: add loading disable of form fields
      if (!deckName) throw 'Must specify a deck name!';
      if (selectedFileIndex == null || selectedFileIndex < 0) throw 'Must specify a file!';
      const existingConflictingDecks = await getDecks(db, [deckName]);
      if (existingConflictingDecks.length > 0) throw `Deck named: ${deckName} already exists`;
      const db = await getDBConnection();
      await saveDecks(db, [{name: deckName}]);
      const deck = (await getDecks(db, [deckName]))[0];
      const file = fileChoices[selectedFileIndex];
      const content = await RNFS.readFile(file.path);
      const cards = content.split("\n").filter(line => line.includes(' - ')).filter((l, idx) => idx < 4).map(line => {
        const splitLine = line.split(' - ');
        const term = splitLine[0];
        const definition = splitLine.splice(1).join(' - ');
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
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {errorMessage && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        {successfulUploadMessage && (
          <View style={styles.successfulUploadSection}>
            <Text style={styles.successfulUploadText}>{successfulUploadMessage}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Dropdown
            key={updateCount}
            placeholder="Select a folder..."
            selectedIndex={selectedFolderIndex}
            items={folderMetadata.map(f => f.label)}
            onSelect={(idx) => {
              if (idx < 0) return;
              setSelectedFolderIndex(idx);
              setDeckName('');
              setSelectedFileIndex(-1);
              setUpdateCount(uc => uc + 1);
            }}
          />
          <Dropdown
            key={updateCount * -1}
            placeholder="Select a file..."
            selectedIndex={selectedFileIndex}
            items={fileChoices.map(f => f.name)}
            onSelect={(idx) => {
              if (idx < 0) return;
              setSelectedFileIndex(idx);
              setDeckName(fileChoices[idx].name);
              setUpdateCount(uc => uc + 1);
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
  },
});
