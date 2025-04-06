import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
  SafeAreaView,
  NativeModules,
} from 'react-native';

// using:
import RNFS from 'react-native-fs';
// i can only view directories in RNFS.DownloadDirectoryPath
// none of the files show up
// reacte-native android
// there are files there tho. how do i fix this to where i can see the files and not just the directories?

import FileSystem from 'react-native-fs';

import { Text } from '../../components/StyledText';
import { Button, Dropdown, RadioGroup } from '../../components';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import {getDBConnection, getDecks, saveCards, saveDecks} from './SqliteData';
import { PermissionsAndroid } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const folderName = 'com.flashcards';
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
  {
    label: 'External Directory (App dir)',
    value: RNFS.ExternalDirectoryPath + '/' + folderName,
  },
];

async function createPersistedFolder() {
  try {
    const filesDir = RNFS.ExternalDirectoryPath;
    const folderPath = `${filesDir}/${folderName}`;

    const folderExists = await RNFS.exists(folderPath);
    if (!folderExists) {
      RNFS.mkdir(folderPath)
            .then(() => {
              console.log('Folder created successfully');
            })
            .catch(error => {
              console.error('Error creating folder:', error);
            });
      console.log('Persisted folder created:', folderPath);
    } else {
      console.log('Persisted folder already exists:', folderPath);
    }
    await requestFilePermissions();
  } catch (error) {
    console.error('Error creating persisted folder:', error);
  }
}

createPersistedFolder();

const requestFilePermissions = async () => {

      console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res0');

      // const path = folderMetadata[selectedFolderIndex].value;
      // TODO: consider making this recursive on sub dirs instead of just top level files
      // const res1 = await RNFS.readDir("/storage/emulated/0/Download/Epson_scans")
      // const res1 = await RNFS.readDir(RNFS.CachesDirectoryPath)
      // const res1 = await RNFS.readDir(RNFS.LibraryDirectoryPath)
      // const res1 = await RNFS.readDir(RNFS.ExternalCachesDirectoryPath)
      // const res1 = await RNFS.readDir(RNFS.ExternalDirectoryPath)
      // const res1 = await RNFS.readDir(RNFS.TemporaryDirectoryPath)
      const filesDir = RNFS.ExternalDirectoryPath;
      const folderPath = `${filesDir}/${folderName}`;
      const res1 = await RNFS.readDir(folderPath)
      // const res1 = await RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
      // const res1 = await RNFS.readDir("/storage/emulated/0/Android/media/com.Slack/Notifications")
      console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res1');
      console.log(res1);
       // LOG  [{"ctime": null, "isDirectory": [Function isDirectory], "isFile": [Function isFile], "mtime": 2024-08-22T20:39:45.048Z, "name": "Half_marathons", "path": "/storage/emulated/0/Download/Half_marathons", "size": 8192}, {"ctime": null, "isDirectory": [Function isDirectory], "isFile": [Function isFile], "mtime": 2024-12-30T18:43:01.880Z, "name": "Epson_scans", "path": "/storage/emulated/0/Download/Epson_scans", "size": 3452}]
      // const res2 = (await RNFS.readDir(path)).filter(f => f.isDirectory()).map(p => RNFS.readDir(p.path));
      // const res2 = (await Promise.all((await RNFS.readDir(path)).filter(f => f.isDirectory()).map(p => RNFS.readDir(p.path)))).flatMap(i => i);
      // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res2');
      // console.log(res2);
      // const res3 = (await RNFS.readDir(path))
      // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res3');
      // console.log(res3);
      // const files = (await RNFS.readDir(path)).filter(f => f.isFile());
      // setFileChoices(files);

  try {
    // const x = NativeModules.ManageExternalStorage.requestPermission();
    const x = NativeModules;
    console.log('x');
    console.log(x);
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      // PermissionsAndroid.PERMISSIONS.GET_ACCOUNTS,
      // PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
      {
        title: 'File Access Permission',
        message: 'This app needs access to your storage to read files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    console.log('granted');
    console.log(granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('File access permission granted');
    } else {
      console.log('File access permission denied');
    }
  } catch (err) {
    console.warn(err);
  }

};

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

  // requestFilePermissions();

  useEffect(() => {
    (async () => {
      const path = folderMetadata[selectedFolderIndex].value;
      // TODO: consider making this recursive on sub dirs instead of just top level files
      // const res1 = await RNFS.readDir("/storage/emulated/0/Download/Epson_scans")
      // const res1 = await RNFS.readDir(RNFS.CachesDirectoryPath)
      // const res1 = await RNFS.readDir(RNFS.LibraryDirectoryPath)
      // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res1');
      // console.log(res1);
       // LOG  [{"ctime": null, "isDirectory": [Function isDirectory], "isFile": [Function isFile], "mtime": 2024-08-22T20:39:45.048Z, "name": "Half_marathons", "path": "/storage/emulated/0/Download/Half_marathons", "size": 8192}, {"ctime": null, "isDirectory": [Function isDirectory], "isFile": [Function isFile], "mtime": 2024-12-30T18:43:01.880Z, "name": "Epson_scans", "path": "/storage/emulated/0/Download/Epson_scans", "size": 3452}]
      // const res2 = (await RNFS.readDir(path)).filter(f => f.isDirectory()).map(p => RNFS.readDir(p.path));
      // const res2 = (await Promise.all((await RNFS.readDir(path)).filter(f => f.isDirectory()).map(p => RNFS.readDir(p.path)))).flatMap(i => i);
      // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res2');
      // console.log(res2);
      // const res3 = (await RNFS.readDir(path))
      // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz res3');
      // console.log(res3);
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
            <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.item}>Try permissions</Text>
      <Button title="request permissions" onPress={requestFilePermissions} />
    </SafeAreaView>
  </SafeAreaProvider>
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
