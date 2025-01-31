import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { Component } from "react"


import SignatureCapture from 'react-native-signature-capture';
import { CURRENT_SIGNATURE } from '../types';
import { storeSignatureAction, setShowOverlayDisableSignatureAction } from '../actions/CurrentSignature';
import { testAction } from '../actions/TestActions';

class DriverSignature extends Component {

    constructor(props) {
        super(props)
        this.state = {
            base64: ''
        }

        this._onSaveEvent = this._onSaveEvent.bind(this);
    }

    render() {
        return (
            <>
                <Text style={{ textAlign: 'center', marginTop: 10 }}>Khách hàng ký xác nhận</Text>
                {console.log("isShowOverlayDisableSignature////", this.props.isShowOverlayDisableSignature)}
                <View style={[styles.signContainer, { flex: 1, flexDirection: "column" }]}>
                    <SignatureCapture
                        style={[styles.signature]}
                        ref="sign"
                        onSaveEvent={this._onSaveEvent}
                        onDragEvent={this._onDragEvent}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        backgroundColor="#ffffff"
                        strokeColor="#000000"
                        minStrokeWidth={4}
                        maxStrokeWidth={4}
                        viewMode={"portrait"} />
                    {this.props.isShowOverlayDisableSignature ? <View style={styles.signOverlay}><Text style={{ marginRight: 5, paddingLeft: 10, color: '#a6a5a4' }}>Chữ ký đã lưu</Text></View> : null}
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => {
                            this.saveSign();
                        }}
                    >
                        <Text style={styles.text}>Lưu chữ ký</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => {

                            this.resetSign();
                        }} >
                        <Text style={styles.text}>Xóa chữ ký</Text>
                    </TouchableOpacity>

                </View>
            </>
        );
    }

    saveSign() {
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.props.setShowOverlayDisableSignatureAction(false);
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        // console.log(result.encoded);
        console.log("THISSSSSSS", this)
        this.setState({ base64: result.encoded }, () => {
            this.props.storeSignatureAction(this.state.base64);
            this.props.setShowOverlayDisableSignatureAction(true);
        });

    }
    _onDragEvent() {
        // This callback will be called when the user enters signature
        // console.log("dragged");
    }
}

const styles = StyleSheet.create({
    text: {
        color: "#ffffff",
        fontWeight: "900"
    },
    signContainer: {
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 20,
        height: 400,
        marginTop: 10,
    },
    signature: {
        height: '94%',
        width: '94%',
        marginLeft: 10,
        marginTop: 2
    },
    signOverlay: {
        height: '100%',
        width: '100%',
        color: '#ff5e00',
        backgroundColor: 'rgba(0,0,0,0.01)',
        position: 'absolute',

    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 45,
        backgroundColor: "#ff5e00",
        margin: 10,
        color: "#ffffff",
        borderRadius: 5

    }
});


const mapStateToProps = state => ({
    isShowOverlayDisableSignature: state.currentSignatureReducer.isShowOverlayDisableSignature,
    SignBase64: state.currentSignatureReducer.SignBase64
});

export default connect(mapStateToProps, { storeSignatureAction, testAction, setShowOverlayDisableSignatureAction })(DriverSignature);