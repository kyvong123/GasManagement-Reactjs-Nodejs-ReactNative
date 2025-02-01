import React from 'react';
import { View, Text, Image, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../../constants';
import { Spinner } from '../../Common';

const {width} = Dimensions.get('window');
const propTypes = {
    metaData: PropTypes.object,
    loading: PropTypes.bool,
    translateY: PropTypes.object
};

const styles = {
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 0,
        paddingTop: 40,
        paddingBottom: 0,
        // minHeight: 190,
        backgroundColor: COLOR.WHITE
    },
    imageStyle:{
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 16,
        marginRight: 16,
        // width: width-32,
        height: 80,
        resizeMode: Image.resizeMode.contain
    },
    nameStyle:{
        fontSize: 18,
        color: COLOR.BLACK,
        // paddingBottom: 11
        textAlign: 'center'
    },
};

const renderSiteName = (metaData) => {
    const {nameStyle } = styles;
    if(!metaData.siteName && !metaData.companyName){
        return null;
    }
    if(metaData.siteName){
        return <Text numberOfLines={1} ellipsizeMode ={'tail'} style={nameStyle}>{metaData.siteName}</Text>;
    }
    return <Text numberOfLines={1} ellipsizeMode ={'tail'} style={nameStyle}>{metaData.companyName}</Text>;
};

const renderLogo = (logoUrl) => {
    if(!logoUrl){
        return null;
    }
    const { imageStyle } = styles;
    return <Image source={{uri: logoUrl}} style={imageStyle} />;
};

const HeaderInfo = ({metaData, loading, translateY}) => {
    const {container } = styles;
    if(loading){
        return <View style={container}><Spinner/></View>;
    }
    if(!metaData){
        return null;
    }
    const logoUrl = metaData.companyLogo;
    return (
        <Animated.View style={[container, {transform: [{translateY}]}]}>
            {renderLogo(logoUrl)}
            {renderSiteName(metaData)}
        </Animated.View>
  );
};

HeaderInfo.propTypes = propTypes;

export default HeaderInfo;

