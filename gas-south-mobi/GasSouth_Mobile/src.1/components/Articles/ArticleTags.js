import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { CardRowSection} from '../Common';
import {COLOR} from '../../constants';

const styles = {
    wrapperStyle : {
        flexWrap: 'wrap',
        position: 'relative',
        backgroundColor: COLOR.BACKGROUNDGRAY,
        paddingTop: 32,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24
    },
    containStyle : {
        marginBottom: 16,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    labelStyle:{
        fontSize: 12,
        color: COLOR.MEDIUMGRAY
    },
    tagContentStyle:{
        fontSize: 12,
        color: COLOR.BLACK
    }
};
const ArticleTag = ({label, value}) => {
    const {containStyle, labelStyle, tagContentStyle} = styles;
    return (
        <View style={containStyle}><Text style={labelStyle}>{label}: </Text><Text style={tagContentStyle}>{value}</Text></View>
    );
};

const ArticleTags = ({data}) => (
        <CardRowSection style={styles.wrapperStyle}>
            {Object.keys(data).map(info => <ArticleTag key={data[info]} label={info} value={data[info]} />)}
        </CardRowSection>
    );
ArticleTag.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,    
};
ArticleTags.propTypes = {
    data: PropTypes.object
};

export default ArticleTags;
