import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

const styles= {
    containerStyle: {
        backgroundColor: COLOR.BACKGROUNDGRAY,
        justifyContent: 'center',
        padding: 16,
        paddingTop: 24
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: COLOR.BLACK
    }
};

const PageTitle = ({children, style}) => {
    const {containerStyle, titleStyle } = styles;
    return (
        <View style={[containerStyle, style]}>
            <Text style={titleStyle}>{children}</Text>
        </View>
    );
};

PageTitle.propTypes = {
    children: PropTypes.string,
    style: PropTypes.object,
};

export default PageTitle;
