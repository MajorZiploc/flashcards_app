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

export default function Settings({ isDefinitionFirst, isDefinitionFirstSet, isShuffled, isShuffledSet }) {

  const [selectedFirstIndex, setSelectedFirstIndex] = useState(isDefinitionFirst ? 1 : 0);
  const [selectedIsShuffled, setSelectedIsShuffled] = useState(isShuffled ? 1 : 0);

  const setIsDefinitionFirst = (index) => {
    setSelectedFirstIndex(index);
    isDefinitionFirstSet(index === 1);
  };

  const setIsShuffled = (index) => {
    setSelectedIsShuffled(index);
    isShuffledSet(index === 1);
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
          <View style={[styles.radioFirst]}>
            <RadioGroup
              selectedIndex={selectedIsShuffled}
              items={['in order', 'shuffled']}
              onChange={setIsShuffled}
            />
          </View>
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
    backgroundColor: '#c7cfcc',
  },
  radioFirst: {
    height: 50,
    width: 150,
    marginBottom: 10,
  },
});
