import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {SearchInput, CardRowSection, CardColumnSection} from '../../Common';
import {COLOR} from '../../../constants';
import { queryChanged } from '../../../containers/Filters/FilterActions';

const iconSearch = require('../../../static/images/icon_search.png');

const {width} = Dimensions.get('window');
const propTypes = {
    queryChanged: PropTypes.func,
    onFocus: PropTypes.func,
    handleSearch: PropTypes.func
};
const styles = {
    containerStyle: {
        backgroundColor: COLOR.WHITE,
    },
    textSection:{
        backgroundColor: COLOR.GREEN,
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    iconSection:{
        backgroundColor: COLOR.GREEN,
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 30
    },
    textStyle:{
        color: COLOR.WHITE,
        fontSize: 20
    },
    // searchWrapper: {
    //     backgroundColor: COLOR.WHITE,
    //     padding: 12,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     borderRadius: 5,
    //     borderWidth: 1,
    //     borderColor: '#283b434f'
    // },
    iconSearchStyle: {
        paddingRight: 16
    },
    wrapperStyle: {
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        width
    }
};
class SearchGroup extends Component {
    render(){
        const { containerStyle } = styles;
        return (
            // <View style={styles.wrapperStyle} onLayout={(e)=>console.log(e.nativeEvent.layout.height)}>
            <View style={styles.wrapperStyle}>
                <CardColumnSection style={containerStyle}>
                    {/* <TouchableOpacity onPress={this.handleSearch} style={styles.searchWrapper}>
                        <Icon size={24} style={styles.iconSearchStyle} color='gray'>search</Icon>
                        <Text>Search knowledge base</Text>
                    </TouchableOpacity> */}
                    <SearchInput 
                    handleSearch={this.props.handleSearch}
                    placeholder='Search knowledge base'
                    onFocus={this.props.onFocus}
                    focus={false}
                    showBorder={true}/>
                </CardColumnSection>
            </View>
        );
    }
};

SearchGroup.propTypes = propTypes;

export default connect(null,{queryChanged})(SearchGroup);
