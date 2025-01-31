// Import libraries for making a component
import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import {COLOR} from '../../../constants';
import { isIPhoneX } from '../../../helpers/Utils';


const propTypes= {
    hadnleApplyClick: PropTypes.func,
    handleClearAllClick: PropTypes.func,
};
const styles = {
    viewStyle: {
        backgroundColor: COLOR.GREEN,
        flexDirection: 'row',
        alignItems: 'center',
        height: isIPhoneX()?80:60,
        ...Platform.select({
        ios: {
          paddingTop: 20
        },
        android: {}
      }),
        position: 'relative'
    },
    leftGroupStyle: {
        padding: 15,
        paddingLeft: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backStyle: {
        color: COLOR.WHITE,
        fontSize: 18,
        fontWeight: '500',
        paddingLeft: 16
    },
    wrapper: {
        flex: 1,
        // backgroundColor: 'red',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    textStyle:{
        // paddingLeft: 10,
        color: COLOR.WHITE,
        fontSize: 18,
        fontWeight: '500',
        paddingLeft: 16
    }
};

class FilterHeader extends Component {
  renderLeft (){
    const { leftGroupStyle, backStyle } = styles;
    return (
        <TouchableOpacity onPress={Actions.pop}>
          <View style={leftGroupStyle}>
            <Icon size={24} color='white'>arrow_back</Icon>
            <Text style={backStyle}>Back</Text>
          </View>
        </TouchableOpacity>
    );
  };
  renderRight(){
    const {wrapper, textStyle} = styles;
    return (
        <View style={wrapper}>
            <TouchableOpacity onPress={this.props.handleClearAllClick} >
                <Text style={textStyle}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.hadnleApplyClick}>
                <Text style={textStyle}>Apply</Text>
            </TouchableOpacity>
        </View>
    );
  };
  render() {

    const { viewStyle } = styles;
    return (
      <View style={viewStyle}>
        {this.renderLeft()}
        {this.renderRight()}
      </View>
    );
  }
}

FilterHeader.propTypes= propTypes;
// Make the component available to other parts of the app
export default FilterHeader;
