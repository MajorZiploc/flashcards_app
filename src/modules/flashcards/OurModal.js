import React  from 'react';
import {Modal, StyleSheet, Text, View, Button} from 'react-native';

const OurModal = ({modalVisible, setModalVisible, message, style, subMessage, onSubmit, closeText, submitText}) => {
  const _closeText = closeText || 'Close';
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, style]}>
          {message.constructor.name === 'String' ? (
            <Text style={[styles.modalText, styles.modalTitle]}>{message}</Text>
          ) : message
          }
          {subMessage && subMessage.constructor.name === 'String' ? (
            <Text style={[styles.modalText, styles.modalBody]}>{subMessage}</Text>
          ) : subMessage
          }
          <View style={styles.buttons}>
            <Button
              title={_closeText}
              style={[styles.button, styles.buttonClose]}
              disabled={false}
              caption={_closeText}
              onPress={() => setModalVisible(!modalVisible)}
            />
            {submitText && onSubmit && (<>
              <View style={{margin: 20}}></View>
              <Button
                title={submitText}
                style={[styles.button, styles.buttonClose]}
                disabled={false}
                caption={submitText}
                onPress={onSubmit}
              />
            </>)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000000'
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalBody: {
    fontSize: 14,
  },
});

export default OurModal;
