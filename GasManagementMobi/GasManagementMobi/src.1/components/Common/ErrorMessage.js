import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

const ErrorMessage = (props) => (
    <View style={styles.container}>
      <Text numberOfLines={3} ellipsizeMode ={'tail'} style={styles.error}>{props.children}</Text>
    </View>
  );

const styles = {
  container: {
    paddingTop: 14
  },
  error: {
    fontSize: 14,
    color: COLOR.RED
  }
};
ErrorMessage.propTypes = {
  style: PropTypes.object,
  children: PropTypes.string
};

export default ErrorMessage;
