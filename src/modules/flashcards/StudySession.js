import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from '../../components';
import FlipCard from 'react-native-flip-card'

export const Gray300 = '#E0E0E0'
export const Gray100 = '#F5F5F5'
export const Gray50 = '#FAFAFA'
export const White = '#FFFFFF'
export const Red = '#CE1126'
export const Green = '#007A3D'

export const { width, height } = Dimensions.get('window');

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
      <FlipCard
        style={styles.flipCard}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
      >
        <View style={styles.flipSide}>
          <Text style={styles.face}>question</Text>
        </View>
        <View style={styles.flipSide}>
          <Text style={styles.back}>answer</Text>
        </View>
      </FlipCard>
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
  flipCard: {
    backgroundColor: White,
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 5,
      width: 5,
    },
    width: width - 20,
    height: height - 200,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0,
  },
  flipSide: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  face: {
    fontSize: 25,
    textAlign: 'center',
    width: width - 40,
    color: Red,
  },
  back: {
    fontSize: 25,
    textAlign: 'center',
    width: width - 40,
    color: Green,
  },
});

export default StudySession;
