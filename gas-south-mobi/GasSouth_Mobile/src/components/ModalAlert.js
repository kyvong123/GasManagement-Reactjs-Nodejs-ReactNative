import React, {useState, fowa} from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal';

const ModalAlert = () => {
    return (
        <Modal>
          <View style={{ width: '100%', backgroundColor : '#FFF', justifyContent : 'center', alignItem : 'center',  }}>
            <Text>I am the modal content!</Text>
          </View>
        </Modal>
    )
}

export default ModalAlert

