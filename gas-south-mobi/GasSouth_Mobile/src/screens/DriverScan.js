import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View, StyleSheet, Alert, ToastAndroid, ActivityIndicator, Dimensions, TouchableOpacity, } from "react-native";
import { RNCamera } from "react-native-camera";
import ImageResizer from "react-native-image-resizer";
import ImageEditorAnd from "@react-native-community/image-editor";
import RNFS from 'react-native-fs'
import { fetchCylinder } from "../actions/CyclinderActions";
import withNetInfo from "../helper/withNetinfo";
import { Actions } from "react-native-router-flux";
import Svg, { Rect } from "react-native-svg";
import { COLOR } from "../constants";
import saver from "../utils/saver";
import QRCodeScanner from "react-native-qrcode-scanner";

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";

const translationGetters = {
    en: () => require("../languages/en.json"),
    vi: () => require("../languages/vi.json"),
};

const chooseLanguageConfig = (lgnCode) => {
    let fallback = { languageTag: "vi" };
    if (Object.keys(translationGetters).includes(lgnCode)) {
        fallback = { languageTag: lgnCode };
    }

    const { languageTag } = fallback;

    translate.cache.clear();

    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);

const { width, height } = Dimensions.get("window");
const cropData = {
    offset: { x: 30, y: 80 },
    size: { width: width, height: height / 8 },
};

class DriverScan extends Component {
    state = {
        loading: false,
        uri: "",
        path: "",
        checkScreen: false,
        stopCamera: true,
        focusedScreen: false,

    };
    showResult = async (results) => {
        if (
            !results ||
            !results.textAnnotations ||
            results.textAnnotations.length === 0
        ) {
            Alert.alert(
                translate("NO_SERIAL_FOUND"),
                translate("PLEASE_TRY_AGAIN"),
                [
                    {
                        // text: translate("SCAN_SERIAL"),
                        text: "QUÉT LẠI",
                        onPress: async () => {
                            this.setState(
                                async () => await saver.setTypeCamera(false),
                                Actions.refresh("driverScan")
                            );
                        },
                    },
                    {
                        text: translate("MANUAL_SCANNING"),
                        onPress: () => {
                            this.setState({ checkScreen: true }, () => Actions['driverScanManual']({}));
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            const serialList = results.textAnnotations.reduce((prev, curr) => {
                if (curr.description) {
                    return prev.concat(
                        curr.description
                            .toUpperCase()
                            .replace(/\s/g, "")
                            .replace("O", "0")
                    );
                }
                return prev;
            }, []);
            Actions.push("driverProductInfo", { serial: serialList, titleScreen: this.props.titleScreen });
            this.setState({ checkScreen: true, stopCamera: false })
        }
        return prev;
    };

    componentDidMount = async () => {
        if (this.props.checkScreen === true) {
            this.setState({ checkScreen: false });
        }
        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener(
                    "change",
                    this.handleChangeLanguage(languageCode)
                );
            }
        } catch (error) {
            console.log("loi", error);
        }

        // --- --- Kiểm tra trạng thái màn hình --- --- //
        // Nếu không focus (sử dụng) màn hình thì loại bỏ component react-native-camera
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true })
        );
        navigation.addListener('willBlur', () =>
            this.setState({ focusedScreen: false })
        );

        let isFocused = navigation.isFocused();
        if (isFocused) {
            this.setState({ focusedScreen: true })
        }
        else {
            this.setState({ focusedScreen: false })
        }
    };

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener(
                "change",
                this.handleChangeLanguage(languageCode)
            );
        }
    };

    handleChangeLanguage = (lgnCode) => {
        chooseLanguageConfig(lgnCode);
    };

    onSuccess = async (e) => {
        Actions.push("driverProductInfo", { serial: e.data, typeScreen: this.props.typeScreen });

        this.setState({ checkScreen: true, stopCamera: false });
    };

    render() {
        const { focusedScreen } = this.state;
        return (
            <View style={styles.container}>
                {saver.getTypeCamera() === false ? (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            { alignItems: "center", justifyContent: "center", zIndex: 99 },
                        ]}
                    >
                        <Svg width={width} height={height - 120}>
                            <Rect
                                x="20"
                                y="100"
                                width={width - 40}
                                height="150"
                                fill="#fff"
                                strokeWidth="3"
                                stroke={COLOR.BLUE}
                                opacity="0.1"
                            />
                        </Svg>
                    </View>
                ) : null}
                {saver.getTypeCamera() === false ? (
                    <RNCamera
                        captureAudio={false}
                        ref={(ref) => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        androidCameraPermissionOptions={{
                            title: "Permission to use camera",
                            message: "We need your permission to use your camera",
                            buttonPositive: "Ok",
                            buttonNegative: "Cancel",
                        }}
                    />
                ) : (
                    <QRCodeScanner
                        onRead={this.onSuccess}
                        reactivate={this.state.stopCamera}
                        reactivateTimeout={10}
                        ref={(node) => {
                            this.scanner = node;
                        }}
                    />
                )}
                {saver.getTypeCamera() === false ? (
                    <View style={styles.actionGroups}>
                        {!this.state.loading ? (
                            <>
                                <TouchableOpacity
                                    style={styles.manualBtn}
                                    onPress={() => {
                                        this.setState({ checkScreen: true }, () => Actions['driverScanManual']({}));
                                    }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{translate("MANUAL_SCANNING")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.capture}
                                    onPress={() => { this.takePicture() }}
                                />
                            </>
                        ) : (
                            <ActivityIndicator size="large" color="#0000ff" />
                        )}
                    </View>
                ) : null}
            </View>
        );
    }

    crop = (path) => {
        ImageEditorAnd.cropImage(
            path,
            cropData).then(
                async (successURI) => {
                    await RNFS.readFile(successURI, 'base64')
                        .then(async res => {
                            let result = await checkForLabels(res)
                            await this.showResult(result.responses[0])
                        }).catch(error => { console.log(error, 'image error') })
                },
                (error) => console.log("ImageEditor.cropImage", error.message)
            )
    };

    takePicture = async function () {
        if (this.camera) {
            try {
                const options = {
                    quality: 0.15,
                    base64: true,
                    skipProcessing: true,
                };
                const data = await this.camera.takePictureAsync(options);

                const resizeData = await resizeImage(data.uri);

                await this.crop(resizeData.uri);
            } catch (error) {
                console.log(error);
                ToastAndroid.show("Please try again!", ToastAndroid.SHORT);
            }
        }
    };
}

// according to https://cloud.google.com/vision/docs/supported-files, recommended image size for labels detection is 640x480
const resizeImage = async (path, width = 480, height = 360) =>
    ImageResizer.createResizedImage(path, width, height, "JPEG", 70);

const checkForLabels = async (base64) => {
    //   https://cloud.google.com/vision/docs/detecting-text
    const api =
        "https://vision.googleapis.com/v1p4beta1/images:annotate?key=AIzaSyBA5umQ7ehlzI8lv2W-9fPJVPqqrl3_2dg";
    try {
        const response = await fetch(api, {
            method: "POST",
            body: JSON.stringify({
                requests: [
                    {
                        image: {
                            content: base64,
                        },
                        features: [
                            {
                                type: "TEXT_DETECTION",
                                maxResults: 2,
                            },
                        ],
                    },
                ],
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return null;
    }
};
export const mapStateToProps = (state) => ({
    isLoading: state.cylinders.loading,
    user: state.auth,
    cyclinderAction: state.cylinders.cyclinderAction,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    actionGroups: {
        width,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 100,
    },
    preview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    capture: {
        flex: 0,
        backgroundColor: "#fff",
        borderRadius: 50,
        height: 70,
        width: 70,
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderWidth: 15,
    },
    manualBtn: {
        flex: 0,
        width: 150,
        height: 30,
        marginBottom: 25,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    }
});

export default connect(mapStateToProps, { fetchCylinder })(withNetInfo(DriverScan));
