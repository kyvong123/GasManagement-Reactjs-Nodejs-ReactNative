import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {COLOR} from '../constants';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
 
const BaseModal = ({ children, verticalPercent, horizontalPercent, hideClose }) => {
  const height = verticalPercent ? deviceHeight * verticalPercent : deviceHeight;
  const width = horizontalPercent ? deviceHeight * horizontalPercent : deviceWidth;
const styles = {
  leftGroupStyle: {
    padding: 15,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.GREEN
  },
  backStyle: {
    color: COLOR.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 16
  }
};

const renderClose = () => {
  const { leftGroupStyle, backStyle } = styles;
  if (!hideClose) {
    return (
      <View style={leftGroupStyle}>
        <TouchableOpacity onPress={Actions.pop}>Close</TouchableOpacity>
        <TouchableOpacity onPress={Actions.pop}><Text style={backStyle}>Close</Text></TouchableOpacity>
      </View>
    );
  }
  return null;
};

  return (
    <View style={[styles.container, { height, width }]}>
      {renderClose()}
      {children}
    </View>
  );
};

BaseModal.propTypes = {
  children: PropTypes.any,
  verticalPercent: PropTypes.number,
  horizontalPercent: PropTypes.number,
  hideClose: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR.WHITE,
  },
  closeBtnContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
});

export default BaseModal;