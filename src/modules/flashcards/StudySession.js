import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from '../../components';
import Swiper from 'react-native-deck-swiper';
import StudyCard from './StudyCard';

function StudySession({ loadCards, loadCardsAsync, cards, isDefinitionFirst }) {
  const [studyCards, setStudyCards] = useState([]);

  useEffect(() => {
    loadCardsAsync([
      {
        definition: 'the definition1',
        term: 'the term1'
      },
      {
        definition: 'the definition2',
        term: 'the term2'
      }
    ]);
  }, []);

  useEffect(() => {
    setStudyCards((cards ?? []).map(c => ({...c, front: isDefinitionFirst ? c.definition : c.term, back: isDefinitionFirst ? c.term : c.definition})));
  }, [cards, isDefinitionFirst]);

  return (
    <View style={styles.container}>
      <StudyCard />
      <Text>Welcome to the Study Session!</Text>
      <Text size={20}>{`${isDefinitionFirst}`}</Text>
      {(studyCards ?? []).map(c => (
        <Text key={c.front} size={20} white>
          {`${c.front} - ${c.back}`}
        </Text>
      ))}
      <Button
        style={[styles.button]}
        primary
        caption="Test Button"
        onPress={() => {
          loadCardsAsync(cards?.map(c => ({term: c.term + '1', definition: c.definition + '1'})));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default StudySession;
