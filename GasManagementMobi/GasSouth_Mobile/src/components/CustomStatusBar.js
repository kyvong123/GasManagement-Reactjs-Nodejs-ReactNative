import React from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
    Platform,
} from 'react-native';

const CustomStatusBar = ({backgroundColor, ...props}) => {
    return(
        <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props} />
        </View>
    );
}

const BAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight
    },
});

export default CustomStatusBar;