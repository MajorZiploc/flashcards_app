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

const folderMetadata = [
  {
    label: 'External Directory (App dir)',
    value: RNFS.ExternalDirectoryPath,
  },
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
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [fileContent, setFileContent] = useState();

  useEffect(() => {
    (async () => {
      const path = folderMetadata[selectedFolderIndex].value;
      // TODO: consider making this recursive on sub dirs instead of just top level files
      const files = (await RNFS.readDir(path)).filter(f => f.isFile());
      setFileChoices(files);
    })();
  }, [selectedFolderIndex]);

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
      if (selectedFileIndex == null || selectedFileIndex < 0) throw 'Must specify a file!';
      const db = await getDBConnection();
      const existingConflictingDecks = await getDecks(db, [deckName]);
      if (existingConflictingDecks.length > 0) throw `Deck named: ${deckName} already exists`;
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
          <Button
            style={[styles.button]}
            disabled={false}
            caption="Pick File"
            onPress={() => {
              onSelectFile();
            }}
          />
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
