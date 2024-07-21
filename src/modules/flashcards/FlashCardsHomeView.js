import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';

import { Text } from '../../components/StyledText';
import { Button, RadioGroup } from '../../components';

export default function FlashCardsHomeScreen({ isExtended, setIsExtended, navigation, isDefinitionFirst, isDefinitionFirstSet }) {

  const [selectedFirstIndex, setSelectedFirstIndex] = useState(isDefinitionFirst ? 1 : 0);

  const setIsDefinitionFirst = (index) => {
    setSelectedFirstIndex(index);
    isDefinitionFirstSet(index === 1);
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
          <Text size={20} white>
            TODO: make this a dynamic table of study card options
          </Text>
          <Button
            style={[styles.button]}
            primary
            caption="Study Cards 01"
            onPress={() => {
              navigation.navigate('StudySession')
            }}
          />
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
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioFirst: {
    height: 50,
    width: 150,
  },
});
