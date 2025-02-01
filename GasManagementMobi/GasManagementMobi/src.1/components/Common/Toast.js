import React, { Component } from 'react';
import { View, Text, Dimensions, Animated } from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {hideToast} from '../../containers/App/AppActions';
import {COLOR} from '../../constants';

const propTypes = {
    message: PropTypes.string,
    duration: PropTypes.number,
    type: PropTypes.string,
    hideToast: PropTypes.func,
    isShow: PropTypes.bool
};
const {height, width} = Dimensions.get('window');
const styles = {
    containerStyle: {
        // flex: 1,
        position: 'absolute',
        padding: 10,
        margin: 10,
        top: height-160,
        height: 60,
        width: width-20,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#299929',
        zIndex: 999
    },
    errorStyle: {
        backgroundColor: '#e2604f',
        borderColor: 'red'
    },
    warmingStyle: {
        backgroundColor: '#edbd5e',
        borderColor: '#e09a0d'
    },
    TextErrorStyle: {
        color: COLOR.RED
    },
    TextWarmingStyle: {
        color: '#e09a0d'
    },
    toastStyle: {
        color: '#299929',
    },
    iconStyle:{
        borderColor: 'red'
    }
};

class Toast extends Component {
    // constructor(props) {
    //     super(props);
    //     this.animatedValue = new Animated.Value(-width);
    // }
    // animate() {
    //     this.animatedValue.setValue(-width);
    //     Animated.timing(
    //       this.animatedValue,
    //       {
    //         toValue: 0,
    //         duration: 1000
    //       }
    //     ).start(() => this.reverseAnimate());
    //   }
    // reverseAnimate(){
    //     setTimeout(() => {
    //         Animated.timing(
    //         this.animatedValue,
    //         {
    //             toValue: width,
    //             duration: 1000
    //         }
    //         ).start();
    //     },1000);
    // }
    renderIcon(){
        const {type} = this.props;
        if(type === 'error'){
            return <Icon size={30} color='red'>close</Icon>;
        }
        if(type === 'warm'){
            return <Icon size={30} color='#e09a0d'>error_outline</Icon>;
        }
        return <Icon size={30} color='#299929'>done</Icon>;
    }
    render() {
        const {message, duration, isShow, type} = this.props;
        const {toastStyle, containerStyle, errorStyle, warmingStyle, TextErrorStyle, TextWarmingStyle} = styles;
        if(!isShow || !message){
            return null;
        }
        setTimeout(() => {
            this.props.hideToast();
        }, duration);
        return (
            <View style={[
                containerStyle, 
                type === 'error'? errorStyle : null,
                type === 'warm'? warmingStyle : null,
               ]}>
               {this.renderIcon()}
                <Text style={[
                    toastStyle,
                    type === 'error'? TextErrorStyle : null,
                    type === 'warm'? TextWarmingStyle : null]}>{message}</Text>
            </View>
        );
    }
}

Toast.propTypes = propTypes;
const mapStateToProps = (state) => ({
    message: state.get('AppReducer').get('toast').get('toastMessage'),
    duration: state.get('AppReducer').get('toast').get('toastDuration'),
    isShow: state.get('AppReducer').get('toast').get('isShowToast'),
    type: state.get('AppReducer').get('toast').get('type'),
});
export default connect(mapStateToProps,{hideToast})(Toast);