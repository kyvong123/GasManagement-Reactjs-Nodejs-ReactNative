
// Import libraries for making a component
import React from 'react';
import { Image, View, TouchableOpacity, Platform, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import {COLOR} from '../../constants';
import { isIPhoneX } from '../../helpers/Utils';

const logo = require('../.././static/images/logo.png');


// Make a component
const NavBarSwitchDomain = () => {
  const { viewStyle, logoStyle, iconStyle, leftGroupStyle, backStyle } = styles;
  const renderLeft = () => (
      <View style={iconStyle}>
        <TouchableOpacity onPress={() => Actions.app()}>
          <View style={leftGroupStyle}>
            <Icon size={24} color='white'>close</Icon>
            <Text style={backStyle}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
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
    ...Platform.select({
      ios: {
        top: isIPhoneX()?38:28
      },
      android: {top: 17}
    })
  },
  leftGroupStyle: {
    // padding: 15,
    // paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backStyle: {
    color: COLOR.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 16
  }
};
// Make the component available to other parts of the app
export default NavBarSwitchDomain;
