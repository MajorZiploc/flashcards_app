import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from '../../components';
import Swiper from 'react-native-deck-swiper';
import StudyCard from './StudyCard';

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
      <Swiper
        cards={studyCards}
        renderCard={(cardData, idx) => <StudyCard cardData={cardData} idx={idx} />}
        onSwipedLeft={index => {
          console.log('onSwipedLeft');
          console.log(index);
        }}
        onSwipedRight={index => {
          console.log('onSwipedRight');
          console.log(index);
        }}
        onSwipedAll={() => {
          console.log("all done!");
        }}
        animateOverlayLabelsOpacity
        animateCardOpacity
        backgroundColor={Gray50}
        horizontalSwipe={true}
        verticalSwipe={false}
        cardVerticalMargin={0}
        cardHorizontalMargin={0}
        marginTop={110}
      >
      </Swiper>
      {/* <Button */}
      {/*   style={[styles.button]} */}
      {/*   primary */}
      {/*   caption="Test Button" */}
      {/*   onPress={() => { */}
      {/*     loadCardsAsync(cards?.map(c => ({term: c.term + '1', definition: c.definition + '1'}))); */}
      {/*   }} */}
      {/* /> */}
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
