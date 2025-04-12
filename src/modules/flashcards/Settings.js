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
      <View style={styles.basicBackground}>
        <View style={styles.section}>
      <ImageBackground
        source={require('../../../assets/images/study_sama_uwu_idle.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
      </ImageBackground>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '80%',
    height: '50%',
    position: 'absolute',
    // objectFit: 'scale-down',
    backgroundRepeat: 'no-repeat',
    // backgroundSize: 'contain',
    zIndex: -1,
    // backgroundSize: '1%',
    // top: '50%',
    left: '25%',
    bottom: '45%',
    // right: '50%',
  },
  basicBackground: {
    flex: 1,
    marginHorizontal: -20,
    backgroundColor: '#44a88d',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#577277',
  },
  radioFirst: {
    height: 50,
    width: 150,
    marginBottom: 10,
  },
});
