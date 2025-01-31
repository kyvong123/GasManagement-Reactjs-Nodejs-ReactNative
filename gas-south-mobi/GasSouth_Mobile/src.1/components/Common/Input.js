import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, Text, Platform } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';
/**
 * Input component
 * @param {*} TextInput props
 * @param {*} type(check,search,error)
 * @param {*}  
 * @param {*} disabled 
 * usage: <Input placeholder='Text input active' error='Error message here'></Input>
 */

const Input = (props) => {
  const { inputStyle,
    // containerStyle, 
    iconStyle, 
    iconSearchStyle, 
    inputSearchStyle,
    inputGroupStyle,
    // errorMessageStyle,
    disabledStyle,
    multilineStyle } = styles;

  const {disabled, type, multiline} = props;
  return (
    // <View style={containerStyle}>
      <View style={inputGroupStyle}>
        {type === 'search' ? <Icon style={iconSearchStyle} size={24} color='gray'>search</Icon>: null}
        <TextInput
          underlineColorAndroid='transparent'
          editable={!disabled}
          {...props}
          style={[
            inputStyle, 
            type === 'search'? inputSearchStyle : null,
            disabled ? disabledStyle : null,
            multiline? multilineStyle: null
           ]}
        />
        {type === 'check' ? <Icon style={iconStyle} size={14} color='blue'>check</Icon>: null}
        {/* {type === 'error' && <Icon style={iconStyle} size={14} color='red'>close</Icon>} */}
      </View>
    // </View>
  );
};
const styles = {
  inputStyle: {
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 2,
    color: COLOR.BLACK,
    ...Platform.select({
      ios: {},
      android: {
        paddingBottom: 9
      }
    }),
    paddingRight: 32,
    paddingLeft: 14,
    fontSize: 14,
    lineHeight: 23,
    flex: 1,
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.LIGHTGRAY
  },
  disabledStyle: {
    backgroundColor: COLOR.LIGHTGRAY
  },
  inputGroupStyle: {
    // mimHeight: 40,
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  errorMessageStyle: {
    fontSize: 10,
    paddingLeft: 2,
    color: COLOR.RED
  },
  inputSearchStyle: {
    paddingRight: 14,
    paddingLeft: 45
  },
  iconStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 14
  },
  iconSearchStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 14,
    zIndex: 10
  },
  multilineStyle: {
    ...Platform.select({
      ios: {
        paddingTop: 10
      },
      android: {}
    })
  }
};
Input.propTypes = {
  label:PropTypes.string,
  value:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  error: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  onChangeText:PropTypes.func,
  placeholder:PropTypes.string,
  secureTextEntry:PropTypes.bool
};
export default Input;
