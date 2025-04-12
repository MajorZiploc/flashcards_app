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
import Icon from 'react-native-vector-icons/AntDesign';
import {getDBConnection, getDecks, saveCards, saveDecks} from './SqliteData';
import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
import OurModal from './OurModal';

const defaultCardDelimiter = ' - ';

export default function CreateDeck() {

  /** @type {import('../interfaces').useState<string | undefined>} */
  const [deckName, setDeckName] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [errorMessage, setErrorMessage] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [successfulUploadMessage, setSuccessfulUploadMessage] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [fileContent, setFileContent] = useState();
  /** @type {import('../interfaces').useState<string | undefined>} */
  const [cardDelimiter, setCardDelimiter] = useState();
  /** @type {import('../interfaces').useState<boolean>} */
  const [modalVisibleSubmitInfo, setModalVisibleSubmitInfo] = useState(false);
  /** @type {import('../interfaces').useState<boolean>} */
  const [modalVisibleQuestionInfo, setModalVisibleQuestionInfo] = useState(false);

  const onSelectFile = () => {
    (async () => {
      const [{name, uri}] = await pick({ mode: 'import', allowMultiSelection: false, type: [types.plainText] });
      if (!name) throw "invalid file - file has no name";
      // TODO: this creates a copy in the apps storage - would be nice to delete this copy after getting the file content
      const [docContent] = await keepLocalCopy({
        files: [
          {
            uri,
            fileName: name,
          },
        ],
        destination: 'documentDirectory',
      })
      if (docContent.status === 'success') {
        const fileSize = await RNFS.stat(docContent.localUri).then(stat => stat.size);
        if (fileSize > 5 * 1024 * 1024) throw 'File size exceeds 5MB limit';
        const _fileContent = await RNFS.readFile(docContent.localUri);
        // TODO: consider storing the localUri instead of whole fileContent here - then read file (hopefully as a stream) in the submit action when creating the deck
        setFileContent(_fileContent);
        if (!deckName) setDeckName(name);
      }
    })().catch((err) => {
      if (err.toString().includes('user canceled')) {
        // User cancelled the picker
      } else {
        setErrorMessage('Error uploading file:', err);
      }
    });
  }

  const onPressSubmit = () => {
    (async () => {
      // TODO: if home page doesnt refresh then manage decks in redux and refresh the getDecks at the end of this for the home page
      // TODO: add loading disable of form fields
      if (!deckName) throw 'Must specify a deck name!';
      if (!fileContent) throw 'no file was selected because no file content was found';
      const _cardDelimiter = cardDelimiter || defaultCardDelimiter;
      const db = await getDBConnection();
      const existingConflictingDecks = await getDecks(db, [deckName]);
      if (existingConflictingDecks.length > 0) throw `Deck named: ${deckName} already exists`;
      await saveDecks(db, [{name: deckName}]);
      const deck = (await getDecks(db, [deckName]))[0];
      const cards = fileContent.split("\n").filter(line => line.includes(_cardDelimiter)).filter((l, idx) => idx < 4).map(line => {
        const splitLine = line.split(_cardDelimiter);
        const term = splitLine[0];
        const definition = splitLine.splice(1).join(_cardDelimiter);
        return {term, definition};
      });
      await saveCards(db, cards, deck);
    })()
      .then(() => {
        setErrorMessage(undefined);
        setSuccessfulUploadMessage(`successfully uploaded deck: ${deckName}!`);
        setModalVisibleSubmitInfo(true);
        setFileContent(undefined);
        setDeckName(undefined);
      })
      .catch((e) => {
        setErrorMessage(e);
        setSuccessfulUploadMessage(undefined);
        setModalVisibleSubmitInfo(true);
      }).finally(() => {
        setModalVisibleSubmitInfo(true);
      });
  }

  const onPressQuestion = () => {
    setModalVisibleQuestionInfo(true);
  };

  const messageQuestion = (<View>
    <Text style={styles.questionInfoTitle}>
      Expects plain text files where a single line represents a flash card.
    </Text>
    <Text style={styles.questionInfoTitle}>
      NOTE: Splits term and definition on first ' - ' seen (or your perfered delimiter)
    </Text>
    <Text style={styles.questionInfoTitle}>
      Expected format example:
    </Text>
  </View>)

  const subMessageQuestion = (<View>
    <Text style={styles.questionInfoBody}>
      term1 - definition1
    </Text>
    <Text style={styles.questionInfoBody}>
      multi word - definition that contains a - dash
    </Text>
  </View>);

  return (
    <View style={styles.container}>
      <OurModal modalVisible={modalVisibleQuestionInfo} setModalVisible={setModalVisibleQuestionInfo} message={messageQuestion} subMessage={subMessageQuestion} style={styles.infoModal} />
      {errorMessage ? (
        <OurModal modalVisible={modalVisibleSubmitInfo} setModalVisible={setModalVisibleSubmitInfo} message={errorMessage} subMessage={successfulUploadMessage} style={styles.errorModal} />
      ) : successfulUploadMessage ? (
        <OurModal modalVisible={modalVisibleSubmitInfo} setModalVisible={setModalVisibleSubmitInfo} message={successfulUploadMessage} style={styles.infoModal} />
      ) : <></>}
      <View style={styles.basicBackground}>
        <View style={styles.section}>
          <ImageBackground
            source={require('../../../assets/images/study_sama_uwu_idle.png')}
            style={styles.bgImage}
            resizeMode="cover"
          >
          </ImageBackground>
          <TouchableOpacity
            style={styles.questionButton}
            onPress={onPressQuestion}
          >
            <Icon name="questioncircle" size={25} color="#ebede9" />
          </TouchableOpacity>
          <View style={styles.fieldSection}>
            <Text style={styles.labelHeader}>Term to Definition Delimiter (Separator)</Text>
            <TextInput
              placeholder='(Default: " - ")'
              style={styles.fieldInput}
              value={cardDelimiter}
              onChangeText={setCardDelimiter}
              placeholderTextColor={'#777777'}
            />
          </View>
          <View style={styles.fieldSection}>
            <Button
              style={[styles.button]}
              bgColor="#253a5e"
              disabled={false}
              caption="Pick File"
              onPress={() => {
                onSelectFile();
              }}
            />
          </View>
          <View style={styles.fieldSection}>
            <Text style={styles.labelHeader}>Deck Name</Text>
            <TextInput
              placeholder=''
              style={styles.fieldInput}
              value={deckName}
              onChangeText={setDeckName}
            />
          </View>
          <Button
            style={[styles.button, {marginTop: 50}]}
            bgColor="#253a5e"
            disabled={false}
            caption="Submit"
            onPress={() => {
              onPressSubmit();
            }}
          />
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
  basicBackground : {
    flex: 1,
    marginHorizontal: -20,
    backgroundColor: '#44a88d',
  },
  successfulUploadSection: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#01b901',
  },
  successfulUploadText: {
    color: '#000000',
  },
  errorSection: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#a11212',
  },
  errorText: {
    color: '#c7cfcc',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#577277',
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: "#ebede9",
    color: '#000000',
  },
  errorModal: {
    backgroundColor: '#efa3a9',
  },
  infoModal: {
    backgroundColor: 'white',
  },
  labelHeader: {
    fontSize: 18,
    color: '#ebede9',
  },
  fieldSection: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 10,
  },
  questionButton: {
    marginLeft: 10,
    padding: 5,
  },
  questionInfoTitle: {
    color: '#000000',
    fontSize: 16,
  },
  questionInfoBody: {
    color: '#000000',
    fontSize: 14,
  },
});
