import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';

const styles = {
    container:{
        alignItems: 'center',
        padding:10,
        paddingRight: 20,
        height: 50,
        flexDirection: 'row',
        position: 'relative'
    },
    iconStyle: {
        color: COLOR.LIGHTBLACK,
        paddingRight: 32
    },
    textStyle:{
        fontSize: 15,
        color: '#3b434f'
    },
    arrowStyle:{
        position: 'absolute',
        right: 16,
        color: COLOR.MEDIUMGRAY
    }
};
const DrawerItem = ({onPress, icon, name}) => {
    const { container, iconStyle, textStyle, arrowStyle} = styles;
    return (
        <TouchableOpacity onPress={onPress} style={container}>
            <Icon style={iconStyle} size={24} >{icon}</Icon>
            <Text style={textStyle}>{name}</Text>
            <Icon style={arrowStyle} size={24} >keyboard_arrow_right</Icon>
        </TouchableOpacity>
      );
};

DrawerItem.propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default DrawerItem;
