import React from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';
import { Spinner } from '../Common';

const propTypes = {
    metaData: PropTypes.object,
    loading: PropTypes.bool
};

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        // padding:10,
        paddingTop: 20,
        paddingBottom: 0,
        // borderBottomWidth: 1,
        // borderColor: COLOR.LIGHTGRAY
    },
    imageStyle:{
        marginBottom: 10,
        maxWidth: 256,
        maxHeight: 64,
        // backgroundColor: 'red',
        resizeMode: Image.resizeMode.contain

    },
    nameStyle:{
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.BLACK,
        marginBottom: 4
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

const renderLogo = (logoUrl, logoSize) => {
    if(!logoUrl){
        return null;
    }
    const { imageStyle } = styles;
    return <Image source={{uri: logoUrl}} style={[imageStyle, logoSize?logoSizeStyle(logoSize): null]} />;
};
const logoSizeStyle = (logoSize) => {

    const maxWidth = 256;
    const maxHeight = 64;
    var actualWidth;
    var actualHeight;
    const expectRatio = logoSize.width/logoSize.height;
    if(maxWidth/maxHeight > expectRatio){
        actualHeight = maxHeight;
        actualWidth = actualHeight * expectRatio
    }
    else {
        actualWidth = maxWidth;
        actualHeight = actualWidth / expectRatio;
    }
    return {width: actualWidth, height: actualHeight};
}

const CompanyInfo = ({metaData, loading, logoSize}) => {
    const {container } = styles;
    if(loading){
        return <View style={container}><Spinner/></View>;
    }
    if(!metaData){
        return null;
    }
    const logoUrl = metaData.companyLogo;
    return (
        <View style={container}>
            {renderLogo(logoUrl, logoSize)}
            {renderSiteName(metaData)}
        </View>
  );
};

CompanyInfo.propTypes = propTypes;

export default CompanyInfo;

