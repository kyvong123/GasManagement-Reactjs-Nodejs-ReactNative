import React from 'react';
import { Text, View, Modal, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import CardRowSection from './CardRowSection';
import TextButton from './TextButton';
import { COLOR } from '../../constants';

const {width} = Dimensions.get('window');
const Confirm = ({ children, visible, onAccept, onDecline, acceptText, declineText }) => {
  const { containerStyle, textStyle, textWrapperStyle, buttonWrapperStyle, wrapperStyle, buttonDeclineStyle, buttonAcceptStyle } = styles;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={containerStyle}>
        <View style={wrapperStyle}>
          <CardRowSection style={textWrapperStyle}>
            <Text style={textStyle}>
              {children}
            </Text>
          </CardRowSection>

          <CardRowSection  style={buttonWrapperStyle}>
            <View style={{width: 69, height: 36, marginRight: 8}}><TextButton style={buttonDeclineStyle} onPress={onDecline}>{declineText}</TextButton></View>
            <View style={{width: 69, height: 36}}><TextButton style={buttonAcceptStyle} onPress={onAccept}>{acceptText}</TextButton></View>
          </CardRowSection>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  textWrapperStyle: {
    alignItems: 'flex-start',
    paddingBottom: 16,
    borderRadius: 5,
  },
  buttonWrapperStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: 'flex-end',
    borderRadius: 5
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonAcceptStyle: {
    color: COLOR.RED
  },
  buttonDeclineStyle: {
    color: COLOR.BLACK
  },
  wrapperStyle: {
    alignItems: 'flex-end',
    borderRadius: 5,
    margin: width*0.1,
    padding: 16,
    backgroundColor: COLOR.WHITE
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    // backgroundColor: 'red',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
};
Confirm.propTypes = {
  children:PropTypes.string,
  acceptText: PropTypes.string,
  declineText: PropTypes.string,
  visible:PropTypes.bool,
  onAccept:PropTypes.func,
  onDecline:PropTypes.func
};
export default Confirm;
