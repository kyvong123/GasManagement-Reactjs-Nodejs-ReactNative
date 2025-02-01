import React, { Component } from 'react'
import { Text, StyleSheet, View, Animated, Image } from 'react-native'


export default class SplashScreen extends Component {

    state = {
        animatedValue: new Animated.Value(0),
        animatedYValue: new Animated.Value(-100)
    }

    componentDidMount() {
        this._fadeAnimation()
        this._TransitionAnimation()
    }

    _fadeAnimation() {
        Animated.timing(this.state.animatedValue, {
            toValue: 1,
            duration: 2000,
            // useNativeDriver: true
        }).start();
    }

    _TransitionAnimation() {
        Animated.timing(this.state.animatedYValue, {
            toValue: 0,
            duration: 1500,
            // useNativeDriver: true
        }).start();
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[styles.image, {
                        opacity: this.state.animatedValue,
                        top: this.state.animatedYValue,
                        // position : 'absolute'
                    }]}
                >
                    <Image style={styles.image} resizeMode={'contain'} source={require('./../static/images/logo.png')} />
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    image: {

    }
})
