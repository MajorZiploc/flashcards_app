import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import FlipCard from 'react-native-flip-card';

export const Gray300 = '#E0E0E0'
export const Gray100 = '#F5F5F5'
export const Gray50 = '#FAFAFA'
export const White = '#ebede9'
export const Red = '#CE1126'
export const Green = '#007A3D'

export const { width, height } = Dimensions.get('window');

/**
 * @typedef {import('../interfaces').StudyCard} StudyCard
 */

/**
 * @param {{cardData: StudyCard, idx: number, cardCount: number}} props
 * @returns {React.ReactElement}
 */
function StudyCard(props) {
  const { cardData, idx, cardCount } = props;
  if (!cardData) return <></>;
  return (
    <ScrollView>
      <View>
        <Text style={styles.cardStats}>{idx + 1} of {cardCount}</Text>
      </View>
      <FlipCard
        style={styles.flipCard}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
      >
        <View style={styles.flipSide}>
          <Text style={styles.face}>{cardData.front}</Text>
        </View>
        <View style={styles.flipSide}>
          <Text style={styles.back}>{cardData.back}</Text>
        </View>
      </FlipCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  cardStats: {
    color: '#000000',
  },
});

export default StudyCard;
