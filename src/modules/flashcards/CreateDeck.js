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

  const [selectedFirstIndex, setSelectedFirstIndex] = useState(isDefinitionFirst ? 1 : 0);
  const [deckName, setDeckName] = useState('');
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(0);
  const [selectedFileIndex, setSelectedFileIndex] = useState(-1);
  /** @type {import('../interfaces').useState<RNFS.ReadDirItem[]>} */
  const [fileChoices, setFileChoices] = useState([]);

  useEffect(() => {
    (async () => {
      const path = folderMetadata[selectedFolderIndex].value;
      // TODO: consider making this recursive on sub dirs instead of just top level files
      const files = (await RNFS.readDir(path)).filter(f => f.isFile());
      setFileChoices(files);
    })();
  }, [selectedFolderIndex]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.section}>
          <Dropdown
            placeholder="Select a folder..."
            selectedIndex={selectedFolderIndex}
            items={folderMetadata.map(f => f.label)}
            onSelect={(v) => setSelectedFolderIndex(v)}
          />
          <Dropdown
            placeholder="Select a file..."
            selectedIndex={selectedFileIndex}
            items={fileChoices.map(f => f.name)}
            onSelect={(v) => setSelectedFileIndex(v)}
          />
          <TextInput
            placeholder='Deck Name'
            style={styles.deckNameInput}
            value={deckName}
            onChangeText={setDeckName}
          />
          <Button
            style={[styles.button]}
            primary
            caption="Submit"
            onPress={() => {
              (async () => {
                // TODO: if home page doesnt refresh then manage decks in redux and refresh the getDecks at the end of this for the home page
                // TODO: add loading disable of form fields
                // TODO: Add feedback of successful deck creation
                // TODO: Add feedback of failed deck creation
                // TODO: add validation to ensure no decks have the same name
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
                .then(() => console.log('successful'))
                .catch((e) => {
                  console.log(e);
                  console.log('failed');
                })
                .finally(() => console.log('submit completed'));
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
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  deckNameInput: {
    backgroundColor: "#FFFFFF",
  },
});
