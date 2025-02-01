
// Import libraries for making a component
import React from 'react';
import { Image, View, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import {COLOR} from '../../constants';
import { isIPhoneX } from '../../helpers/Utils';

const logo = require('../.././static/images/logo.png');


// Make a component
const NavBarWithLogo = ({back}) => {
  const { viewStyle, logoStyle, iconStyle } = styles;
  const renderLeft = () =>{
    if (!back) {
      return null;
    }
    return (
      <View style={iconStyle}>
        <TouchableOpacity onPress={Actions.pop}>
          <Icon size={20} color='white'>arrow_back</Icon>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={viewStyle}>
      {renderLeft()}
      <View style={logoStyle} >
        <Image source={logo}/>
      </View>
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: COLOR.GREEN,
    // justifyContent: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: isIPhoneX()?80:60,
    position: 'relative',
    ...Platform.select({
      ios: {paddingTop: 20},
      android: {}
    })
    // marginBottom: 15
  },
  logoStyle: {
    justifyContent: 'center'
  },
  iconStyle: {
    position: 'absolute',
    left: 15,
    top: 30
  }
};
NavBarWithLogo.propTypes= {
  back: PropTypes.bool.isRequired
};
// Make the component available to other parts of the app
export default NavBarWithLogo;
