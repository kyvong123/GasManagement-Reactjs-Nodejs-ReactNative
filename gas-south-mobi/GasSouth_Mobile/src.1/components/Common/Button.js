import React from 'react';
import { Text, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

/**
 * button component
 * @param {*} onPress
 * @param {*} children 
 * @param {*} size 
 * @param {*} type 
 * @param {*} disabled 
 * usage: <Button size="medium" type="secondary" disabled={true}>Disabled</Button>
 */



const caculateContainerStyle = (type, isDisabled) => {
  let result = {};
  if(type === 'secondary'){
    result = { ...result,
      backgroundColor: COLOR.WHITE
    };
  }
  if(isDisabled){
    result = { ...result,
      backgroundColor: COLOR.GRAY
    };
    if(type === 'secondary'){
      result = { ...result,
        backgroundColor: COLOR.WHITE
      };
    }
  }
  return result;
};
const caculateTextStyle = (type, size, isDisabled) => {
  let result = {};
  if(type === 'secondary'){
    result = { ...result,
      color: COLOR.BLACK
    };
  }
  if(isDisabled){
    result = { ...result,
      color: COLOR.WHITE
    };
    if(type === 'secondary'){
      result = { ...result,
        color: 'gray'
      };
    }
  }
  if(size==='medium'){
    result = { ...result,
      paddingTop: 11,
      paddingBottom: 11
    };
  }
  return result;
};
const Button = ({ onPress, children, size, type, disabled }) => {
  const { buttonStyle, textStyle } = styles;
  return (
    <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      buttonStyle,caculateContainerStyle(type,disabled)]}
    >
      <Text style={[
        textStyle,caculateTextStyle(type,size,disabled)
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: COLOR.WHITE,
    lineHeight: 14,
    fontSize: 14,
    fontWeight: '500',
    // backgroundColor: 'red',
    // minHeight: 30,
    // paddingTop: 14,
    paddingBottom: 5
  },
  buttonStyle: {
    flex: 1,
    // minHeight: 48,
    // maxHeight: 48,
    // height: 48,
    justifyContent: 'center',
    // alignSelf: 'center',
    backgroundColor: COLOR.GREEN,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    // marginLeft: 5,
    // marginRight: 5,
    ...Platform.select({
      ios: {
        height: 40,
        padding: 2
      },
      android: {
        height: 48,
      },
    })
  }
};
Button.propTypes = {
  onPress: PropTypes.func,
  size: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.string
};
export default Button;