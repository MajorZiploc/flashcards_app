import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components';

function StudySession({ loadCards, loadCardsAsync, cards }) {
  useEffect(() => {
    loadCardsAsync([1,2,3]);
  }, []);
  return (
    <View style={styles.container}>
      <Text>Welcome to the Study Session!</Text>
      <Text size={20} white>
        {cards?.join(", ")}
      </Text>
      <Button
        style={[styles.demoButton]}
        primary
        caption="Test Button"
        onPress={() => {
          loadCardsAsync(cards?.map(c => c + 1));
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
  demoButton: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default StudySession;
