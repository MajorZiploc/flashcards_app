import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';

import { Text } from '../../components/StyledText';
import { Button } from '../../components';

export default function FlashCardsHomeScreen({ isExtended, setIsExtended, navigation }) {
  // const rnsUrl = 'https://reactnativestarter.com';
  // const handleClick = () => {
  //   Linking.canOpenURL(rnsUrl).then(supported => {
  //     if (supported) {
  //       Linking.openURL(rnsUrl);
  //     } else {
  //       console.log(`Don't know how to open URI: ${rnsUrl}`);
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.section}>
          <Text size={20} white>
            TODO: make this a dynamic table of study card options
          </Text>
          <Button
            style={[styles.demoButton]}
            primary
            caption="Study Cards 01"
            onPress={() => navigation.navigate('StudySession')}
          />
          <Button
            style={[styles.demoButton]}
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
  demoButton: {
    marginTop: 8,
    marginBottom: 8,
  },
});
