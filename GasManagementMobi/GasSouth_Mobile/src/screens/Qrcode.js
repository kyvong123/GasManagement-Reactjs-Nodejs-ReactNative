import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class ScanScreenQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stopCamera: true,
        };
    }
    onSuccess = (e) => {
        console.log("QRcode", e);
        if (e.data === "hao") {
            this.setState({ stopCamera: false })
        }
        //this.scanner.reactivate();

    }

    render() {
        return (
            <QRCodeScanner
                onRead={this.onSuccess}
                reactivate={this.state.stopCamera}
                reactivateTimeout={10}
                //flashMode={QRCodeScanner.Constants.FlashMode.torch}
                ref={(node) => { this.scanner = node }}
            // bottomContent={
            //     <TouchableOpacity style={styles.buttonTouchable}>
            //         <Text style={styles.buttonText}>OK. Got it!</Text>
            //     </TouchableOpacity>
            // }
            />
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});
