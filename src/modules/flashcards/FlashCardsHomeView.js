import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';

import { Text } from '../../components/StyledText';
import { Button, RadioGroup } from '../../components';

const basicCards = [
  {
    term: 'the term1',
    definition: 'the definition1',
  },
  {
    term: 'the term2',
    definition: 'the definition2',
  }
];

const firstSet = "firstSet";
const secondSet = "secondSet";

const cardSetNames = [firstSet, secondSet];

const cardSets = {
  [firstSet]: {
    cards: basicCards.map(c => ({term: `${firstSet} ${c.term}`, definition: `${firstSet} ${c.definition}`})),
  },
  [secondSet]: {
    cards: basicCards.map(c => ({term: `${secondSet} ${c.term}`, definition: `${secondSet} ${c.definition}`})),
  },
};

export default function FlashCardsHomeScreen({ isExtended, setIsExtended, navigation, isDefinitionFirst, isDefinitionFirstSet, loadCards, loadCardsAsync }) {

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
          {cardSetNames.map(cn => (
            <Button
              key={cn}
              style={[styles.button]}
              primary
              caption={cn}
              onPress={() => {
                loadCards(cardSets[cn].cards);
                navigation.navigate('Study Session');
              }}
            />
          ))}
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
