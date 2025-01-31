import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  ImageStore,
  ImageEditor,
} from "react-native";
import { RNCamera } from "react-native-camera";
import ImageResizer from "react-native-image-resizer";
import ImageEditorAnd from "@react-native-community/image-editor";
//const RNFS = require('react-native-fs');
import RNFS from "react-native-fs";
import { fetchCylinder } from "../actions/CyclinderActions";
import withNetInfo from "../helper/withNetinfo";
import { Actions } from "react-native-router-flux";
import Svg, { Rect } from "react-native-svg";
import { COLOR } from "../constants";
import saver from "../utils/saver";
import { from } from "rxjs";
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
  // size: {width: width + 200, height: 200},
};
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});

class Scan extends Component {
  state = {
    loading: false,
    uri: "",
    path: "",
    checkScreen: false,
    stopCamera: true,
    focusedScreen: false,
  };
  showResult = async (results) => {
    //Alert.alert('show_RESULTS')
    //console.log("results", results);
    if (
      !results ||
      !results.textAnnotations ||
      results.textAnnotations.length === 0
    ) {
      Alert.alert(
        translate("NO_SERIAL_FOUND"),
        translate("PLEASE_TRY_AGAIN"),
        [
          //{text: 'Th? l?i', onPress: () => this.setState({checkScreen: false})},
          // !!this.props.cyclinderAction ? {
          //     text: translate('SCAN_QR'), onPress: () => {
          //         this.setState({checkScreen: true},
          //             async () => await saver.setTypeCamera(true),
          //         Actions.push("scan"))
          //     }
          // } : null,
          {
            text: translate("SCAN_SERIAL"),
            onPress: async () => {
              this.setState(
                async () => await saver.setTypeCamera(false),
                Actions.refresh("scan")
              );
            },
          },
          {
            text: translate("MANUAL_SCANNING"),
            onPress: () => {
              this.setState({ checkScreen: true }, () => Actions.scanManual());
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      const serialList = results.textAnnotations.reduce((prev, curr) => {
        if (curr.description) {
          return prev.concat(
            curr.description.toUpperCase().replace(/\s/g, "").replace("O", "0")
          );
        }
        return prev;
      }, []);
      console.log("serialList", serialList);
      // await this.props.fetchCylinder(serialList)
      //ToastAndroid.show("begin_push", ToastAndroid.SHORT);
      Actions.push("result2", { serial: serialList });
      this.setState({ checkScreen: true, stopCamera: false });
    }
    // return prev;
  };

  componentDidMount = async () => {
    // console.log("tessssshghjgjhgjhsst");
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
    navigation.addListener("willFocus", () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener("willBlur", () =>
      this.setState({ focusedScreen: false })
    );

    let isFocused = navigation.isFocused();
    if (isFocused) {
      this.setState({ focusedScreen: true });
    } else {
      this.setState({ focusedScreen: false });
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
    //setLanguage(lgnCode);
    chooseLanguageConfig(lgnCode);
  };

  onSuccess = async (e) => {
    //  await this.props.fetchCylinder([e.data])
    // console.log('hoalogserial',e.data);
    Actions.push("result2", { serial: e.data });

    this.setState({ checkScreen: true, stopCamera: false });
    //this.scanner.reactivate();
  };

  render() {
    //console.log("tessssssst");
    const { focusedScreen } = this.state;

    if (focusedScreen) {
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
              // onTextRecognized={({ texts }) => {
              //   console.log("RNCamera_onTextRecognized", texts);
              // }}
            />
          ) : (
            <QRCodeScanner
              onRead={this.onSuccess}
              reactivate={this.state.stopCamera}
              reactivateTimeout={10}
              //flashMode={QRCodeScanner.Constants.FlashMode.torch}
              ref={(node) => {
                this.scanner = node;
              }}
              // bottomContent={
              //     <TouchableOpacity style={styles.buttonTouchable}>
              //         <Text style={styles.buttonText}>OK. Got it!</Text>
              //     </TouchableOpacity>
              // }
            />
          )}
          {saver.getTypeCamera() === false ? (
            <View style={styles.actionGroups}>
              {!this.state.loading ? (
                <>
                  <TouchableOpacity
                    style={styles.manualBtn}
                    onPress={() => {
                      this.setState({ checkScreen: true }, () =>
                        Actions.scanManual()
                      );
                    }}
                  >
                    <Text style={{ color: "gray" }}>
                      {translate("MANUAL_SCANNING")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.capture}
                    onPress={() => {
                      this.takePicture();
                    }}
                  />
                </>
              ) : (
                <ActivityIndicator size="large" color="#0000ff" />
              )}
            </View>
          ) : null}
        </View>
      );
    } else {
      //console.log("ddddddddddddd");
      return <View></View>;
    }
  }

  crop = (path) => {
    // ToastAndroid.show("begin_cropImage", ToastAndroid.SHORT);
    // ImageEditor.cropImage(
    //   path,
    //   cropData,
    //   async (successURI) => {
    //     console.log("begin_cropImage", path, cropData);
    //     if (Platform.OS === "ios") {
    //       ImageStore.getBase64ForTag(
    //         successURI,
    //         async (successStore) => {
    //           let base64String = successStore;
    //           let result = await checkForLabels(base64String);
    //           await this.showResult(result.responses[0]);
    //         },
    //         (error) => console.log("ImageEditor", error.message)
    //       );
    //     } else {
    //       const base64String = await ImgToBase64.getBase64String(successURI);
    //       //console.log('base64String', base64String);
    //       let result = await checkForLabels(base64String);
    //       await this.showResult(result.responses[0]);
    //     }
    //     this.setState({
    //       loading: false,
    //     });
    //   },
    //   (error) => console.log("ImageEditor.cropImage", error.message)
    // )
    //console.log("begin_cropImage");
    ImageEditorAnd.cropImage(path, cropData).then(
      async (successURI) => {
        // console.log("begin_cropImage", path, cropData);
        // ImageStore.getBase64ForTag(
        //   successURI,
        //   async (successStore) => {
        //     let base64String = successStore;
        //     let result = await checkForLabels(base64String);
        //     await this.showResult(result.responses[0]);
        //   },
        //   (error) => console.log("ImageEditor", error.message)
        // );
        await RNFS.readFile(successURI, "base64")
          .then(async (res) => {
            console.log("ReadOK");
            // console.log(res)
            let result = await checkForLabels(res);
            await this.showResult(result.responses[0]);
          })
          .catch((error) => {
            console.log(error, "image error");
          });
      },
      (error) => console.log("ImageEditor.cropImage", error.message)
    );
  };

  takePicture = async function () {
    //console.log("BEGIN_takePicture");
    if (this.camera) {
      // if (!this.state.loading) {
      //     this.setState({
      //         loading: true,
      //     });

      try {
        //this.camera.zoom(10);
        const options = {
          quality: 0.15,
          base64: true,
          //pauseAfterCapture:true
          skipProcessing: true,
          //fixOrientation: true,
        };
        //ToastAndroid.show("BEGIN_takePictureAsync", ToastAndroid.SHORT);
        const data = await this.camera.takePictureAsync(options);
        //console.log('data_takePictureAsync', data);

        //ToastAndroid.show("BEGIN_resizeImage", ToastAndroid.SHORT);
        const resizeData = await resizeImage(data.uri);
        //console.log('resizeData_takePictureAsync', resizeData)

        await this.crop(resizeData.uri);
        // await this.crop(data.uri);
        // this.setState({
        //     loading: false,
        // });
      } catch (error) {
        console.log(error);

        ToastAndroid.show("Please try again!", ToastAndroid.SHORT);
        //     this.setState({
        //         loading: false,
        //     });
        // }
      }
    }
  };
}

//const outputPath = `${RNFS.DocumentDirectoryPath}`;
// according to https://cloud.google.com/vision/docs/supported-files, recommended image size for labels detection is 640x480
const resizeImage = async (path, width = 480, height = 360) =>
  ImageResizer.createResizedImage(path, width, height, "JPEG", 70);

// API call to google cloud
const checkForLabels = async (base64) => {
  //   https://cloud.google.com/vision/docs/detecting-text
  const api =
    "https://vision.googleapis.com/v1p4beta1/images:annotate?key=AIzaSyBA5umQ7ehlzI8lv2W-9fPJVPqqrl3_2dg";
  //ToastAndroid.show("BEGIN_CALL_GOOGLE_API", ToastAndroid.SHORT);
  //Alert.alert('BEGIN_CALL_GOOGLE_API')
  console.log("BEGIN_CALL_GOOGLE_API");
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
    //ToastAndroid.show("DONE!!!!", ToastAndroid.SHORT);
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
export default connect(mapStateToProps, { fetchCylinder })(withNetInfo(Scan));
