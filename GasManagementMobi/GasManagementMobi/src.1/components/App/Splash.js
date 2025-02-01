import React, {Component} from 'react';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import {fetchUserInfo} from '../../containers/Auth/AuthActions';
import withNetInfo from '../../helpers/withNetinfo';
import {COLOR} from '../../constants';

const kdBackground = require('../../static/images/Flash_screen.png');

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE
    },
    background: {
        width,
        height,
      }
});
const propTypes = {
    navigation: PropTypes.object,
    checkedSignIn: PropTypes.bool,
    userInfo: PropTypes.object,
    fetchUserInfo: PropTypes.func
};
class Splash extends Component {
    componentWillMount() {
        this.props.fetchUserInfo();
    }
    
    render() {
        const {container, background} = styles;
        return (
            <View style={container}>
                <ImageBackground source={kdBackground} style={background} resizeMode="cover">
                </ImageBackground>
            </View> 
        );
    }
}

Splash.propTypes = propTypes;

export default connect(null, {fetchUserInfo})(withNetInfo(Splash));
