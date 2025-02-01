import React from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {BaseModal} from '../../components/Common';

const ErrorModal = () => (
  <BaseModal hideClose>
    <View flex={1} style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
      <Text>Error Modal</Text>
      <Text>Slides up from the bottom, and covers the entire screen with no transparency</Text>
      <Button title="Close" onPress={Actions.pop} />
    </View>
  </BaseModal>
);


export default ErrorModal;