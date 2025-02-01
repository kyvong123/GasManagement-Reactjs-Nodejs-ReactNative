import React, { Component } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  BackHandler,
  SafeAreaView,
} from "react-native";
//  import {Picker } from '@react-native-community/picker';

// thu vien moi
import OneSignal from "react-native-onesignal"; // Import package from node modules one signal

import { Flex, WhiteSpace } from "@ant-design/react-native/lib/";
import { COLOR } from "../constants";
import TextButton from "../components/TextButton";
import { Actions } from "react-native-router-flux";
import { loginUserSuccess } from "../actions/AuthActions";
import { getToken, getUserInfo } from "../helper/auth";
import { changeCyclinderAction } from "../actions/CyclinderActions";
import saver from "../utils/saver";
import Modal from "react-native-modal";
import IconInoic from "react-native-vector-icons/Ionicons";
import IconFe from "react-native-vector-icons/Feather";

import { changeLanguage } from "../actions/LanguageActions";

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import CustomStatusBar from "../components/CustomStatusBar";

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

const { height, width } = Dimensions.get("window");

const logo = require("../static/images/logo.png");
const logo2 = require("../static/images/logo2.jpg");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  logo: {
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  btnScan: {
    backgroundColor: "#26914d",
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  txtScan: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 20,
  },
  btnLogin: {
    fontSize: 20,
    height: 40,
    marginTop: 20,
    color: "#F6921E",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  selectLanguageStyle: {
    alignItems: "flex-end",
    marginTop: 20,
    marginRight: 20,
  },
});

class Info extends Component {
  constructor() {
    super();
    chooseLanguageConfig("vi");
    this.state = {
      hasToken: false,
      backClickCount: 0,
      languageCode: "vi",
      isModalVisible: false,
    };
  }

  componentWillMount = async () => {
    await BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton()
    );

    // one signal
    //  OneSignal.setLogLevel(6, 0);
  };

  _spring() {
    this.setState({ backClickCount: 1 });
  }
  componentWillUnmount = async () => {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton()
    );
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        "change",
        this.handleChangeLanguage(languageCode)
        //console.log("haooamxhsak "+languageCode),
      );
    }
  };
  handleBackButton = () => {
    this.state.backClickCount === 1 ? BackHandler.exitApp() : this._spring();
    return true;
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  async componentDidMount() {
    /////////////////////////

    OneSignal.setAppId("8f2c576d-d40e-4e63-a95b-e64064a8e353");

    OneSignal.setLogLevel(6, 0);

    // // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.setAppId("YOUR_ONESIGNAL_APP_ID", {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    // OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    // OneSignal.promptForPushNotificationsWithUserResponse(this.myiOSPromptCallback);
    OneSignal.promptForPushNotificationsWithUserResponse();

    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.addEventListener('ids', this.onIds);
    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      const notification = openedEvent.notification;
      console.log("Opened notification:", notification);
      // Xử lý khi người dùng mở thông báo
      this.onOpened;
    });

    try {
      const token = await getToken();
      const user = await getUserInfo();
      if (token && user) {
        this.props.loginUserSuccess({ user, token });
        this.setState({ hasToken: true });
      }
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          "change",
          this.handleChangeLanguage(languageCode)
        );
        //console.log("mjuiookll ",languageCode);
      }
    } catch (error) {
      console.log("can not load token");
    }
  }
  onOpened(openResult) {
    // HERE I WANT TO NAVIGATE TO ANOTHER SCREEN INSTEAD OF HOME SCREEN
    this.isNotification = true;

    let data = openResult.notification.payload.additionalData;
    let inFocus = openResult.notification.isAppInFocus;
    if (openResult.notification.payload.title === "Thông báo đơn hàng") {
      Actions.OrderManagement();
    }
    if (openResult.notification.payload.title === "Thông báo đơn vận chuyển") {
      Actions["DetailForDriver"]({
        data: openResult.notification.payload.additionalData.iddata,
      });

      //   Actions.DetailForDriver(openResult.notification.payload.additionalData.iddata)
    }
    if (
      openResult.notification.payload.title === "Thông báo đơn hàng đang giao"
    ) {
      // Actions.GetLocationsiping(openResult.notification.payload.additionalData.iddata)

      Actions["GetLocationsiping"]({
        orderShippingID: openResult.notification.payload.additionalData.iddata,
      });
    }
    if (openResult.notification.payload.title === "Thông báo có đơn xe bồn") {
      Actions["DriverTankDetail"]({
        exportOrderID: openResult.notification.payload.additionalData.iddata,
      });
    }
    // Actions.filter();
  }

  handleChangeLanguage = (lgnCode) => {
    setLanguage(lgnCode);
    this.setState({ languageCode: lgnCode });
    //console.log(languageCode);
    chooseLanguageConfig(lgnCode);
    this.props.changeLanguage(lgnCode);
  };

  handleLogin = () => {
    // const user = await getUserInfo();
    const { hasToken } = this.state;
    hasToken ? Actions.app() : Actions.login();
  };

  render() {
    const { languageCode } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.selectLanguageStyle}>
          <CustomStatusBar backgroundColor="white" barStyle="dark-content" />
          <TouchableOpacity
            onPress={this.toggleModal}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              resizeMode={"cover"}
              style={{
                width: 25,
                height: 25,
              }}
              source={
                languageCode == "vi"
                  ? require("./../static/images/vietnam.png")
                  : require("./../static/images/united-kingdom.png")
              }
            />
            <Text style={{ marginLeft: 5, fontSize: 15 }}>
              {languageCode == "vi" ? "Tiếng việt" : "English"}
            </Text>
            <IconInoic
              name="ios-arrow-down"
              size={15}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>

          <Modal
            onBackdropPress={() => {
              this.setState({ isModalVisible: false });
            }}
            isVisible={this.state.isModalVisible}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                padding: 20,
                height: 200,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  marginLeft: 10,
                  marginBottom: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {translate("SELECT_YOUR_LANGUAGE")}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() => {
                  this.handleChangeLanguage("vi");
                }}
              >
                <Image
                  resizeMode={"cover"}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={require("./../static/images/vietnam.png")}
                />
                <Text style={{ marginLeft: 10, fontSize: 17 }}>Tiếng việt</Text>

                {languageCode == "vi" ? (
                  <IconFe
                    name="check"
                    size={25}
                    color={"#2196f3"}
                    style={{ marginLeft: 10 }}
                  />
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() => {
                  this.handleChangeLanguage("en");
                }}
              >
                <Image
                  resizeMode={"cover"}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={require("./../static/images/united-kingdom.png")}
                />
                <Text style={{ marginLeft: 10, fontSize: 17 }}>English</Text>
                {languageCode == "en" ? (
                  <IconFe
                    name="check"
                    size={25}
                    color={"#2196f3"}
                    style={{ marginLeft: 10 }}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <View style={styles.logo}>
          <Image
            style={{ resizeMode: "contain", height: 242, width: 186 }}
            // style={{ resizeMode: 'contain'}}
            source={logo2}
          />
        </View>

        <Flex justify="center">
          <TouchableOpacity
            style={styles.btnScan}
            onPress={() => {
              saver.setTypeCamera(false);
              Actions.scan();
              this.props.changeCyclinderAction("");
            }}
          >
            <Text style={styles.txtScan}>
              {translate("RETRIEVE_AUTOMATICALLY")}
            </Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace />
        <Flex justify="center">
          <TextButton onPress={this.handleLogin} style={styles.btnLogin}>
            {translate("LOGIN")}
          </TextButton>
        </Flex>
        {/* <Flex justify="center">
          <Picker
            selectedValue={languageCode}
            style={{ height: 50, width: 150 }}
            //onValueChange={(itemValue, itemIndex) => this.setState({languageCode: itemValue})}
            onValueChange={(itemValue) => this.handleChangeLanguage(itemValue)}
          >
            <Picker.Item label="VIE" value="vi" />
            <Picker.Item label="ENG" value="en" />
          </Picker>
        </Flex> */}
      </SafeAreaView>
    );
  }
}
export const mapStateToProps = (state) => ({
  cyclinderAction: state.cylinders.cyclinderAction,
});

export default connect(mapStateToProps, {
  loginUserSuccess,
  changeCyclinderAction,
  changeLanguage,
})(Info);
