import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FlipCard from 'react-native-flip-card';
import Swiper from 'react-native-deck-swiper';

export const Gray300 = '#E0E0E0'
export const Gray100 = '#F5F5F5'
export const Gray50 = '#FAFAFA'
export const White = '#FFFFFF'
export const Red = '#CE1126'
export const Green = '#007A3D'

export const { width, height } = Dimensions.get('window');

function StudyCard(props) {
  return (
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
});

export default StudyCard;
