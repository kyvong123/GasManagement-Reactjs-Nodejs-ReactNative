import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import pluralize from 'pluralize';

import { COLOR } from '../../constants';

const propTypes = {
    handleClick: PropTypes.func,
    showInfo: PropTypes.func,
    data: PropTypes.object.isRequired
};
const styles= {
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    infoStyle:{
        flex: 4
    },
    // logoStyle:{
    //     width: 48,
    //     height: 48,
    //     marginRight: 16,
    //     borderRadius: 24,
    //     backgroundColor: COLOR.LIGHTGRAY
    // },
    nameStyle:{
        color: COLOR.DARKGRAY,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4
    },
    articleCountWrapper: {
        backgroundColor: '#80858d',
        padding: 8,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 8,
        borderRadius: 12,
        minWidth: 24
    },
    articleCountText:{
        color: COLOR.WHITE,
        fontSize: 12,
    },
    detailStyle:{
        fontSize: 12,
        color: COLOR.DARKGRAY,
    },
    rightGroupStyle:{
        justifyContent: 'flex-end',
        flex: 1,
        flexDirection: 'row'
    },
};

const ServiceItem =  ({data, handleClick, showInfo}) =>{
    const numberOfArticles = data.numberOfArticles || 0;
    return (
        <TouchableOpacity onPress={()=>handleClick(data.id)}>
            <View style={styles.containerStyle}>
                <View style={styles.infoStyle}>
                    {!!data.name && <Text ellipsizeMode='tail' numberOfLines={1} style={styles.nameStyle}>{data.name}</Text>}
                    <Text style={styles.detailStyle}>{`${numberOfArticles} ${pluralize('article',numberOfArticles)}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>showInfo(data.id)} style={styles.rightGroupStyle}>
                    <Icon size={24} color='gray'>info_outline</Icon>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      );
};   


ServiceItem.propTypes = propTypes;

export default ServiceItem;
