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
      console.log(files);
    })();
  }, [selectedFolderIndex]);

  console.log(fileChoices.map(f => f.name));

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
});
