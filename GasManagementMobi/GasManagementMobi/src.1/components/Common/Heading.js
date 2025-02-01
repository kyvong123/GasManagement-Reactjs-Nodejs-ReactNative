import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

const propTypes = {
    type:PropTypes.string,
    children: PropTypes.string
};

const styles = {
    container: {
        justifyContent: 'center'
    },
    pageHeadingStyle: {
        fontSize: 16
    },
    sectionHeadingStyle:{
        fontSize: 16
    },
    textStyle: {
        fontSize: 16,
        // paddingLeft: 6,
        fontWeight: '500',
        color: COLOR.BLACK
    }
};
const Heading = ({type,children}) => (
    <View style={styles.container}>
        <Text style={[styles.textStyle,
        type==='page'?styles.pageHeadingStyle:'',
        type==='section'?styles.sectionHeadingStyle:'']}>
            {children}
        </Text>
    </View>
  );

Heading.propTypes = propTypes;
export default Heading;

