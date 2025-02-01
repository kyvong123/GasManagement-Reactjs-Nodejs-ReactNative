import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
// import { Actions } from "react-native-router-flux";
// import CustomNavBar from "./../components/CustomNavBar";
import {
  Button,
  WingBlank,
  Flex,
  InputItem,
  Card,
  WhiteSpace,
} from "@ant-design/react-native/lib";
//asdasd
import {
  setUserName,
  getUserName,
  setUserPassWord,
  getUserPassWord,
  setIsRemembered,
  getIsRemembered,
  removeRememberMe,
  setLanguage,
  getLanguage,
  // setdeviceid,getdeviceid,
} from "../helper/auth";
import Icon from "react-native-vector-icons/Ionicons";
import { loginUser } from "../actions/AuthActions";
import { COLOR } from "../constants";
import { TextField } from "react-native-material-textfield";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { color } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";

import OneSignal from "react-native-onesignal"; // Import package from node modules one signal
import { getOrderByUserId } from "../api/orders_new";
const translationGetters = {
  en: () => require("../languages/en.json"),
  vi: () => require("../languages/vi.json"),
};

const setI18nConfig = () => {
  const fallback = { languageTag: "vi" };
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
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

const logo = require("../static/images/logo.png");
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  txtError: {
    fontSize: 14,
    color: COLOR.RED,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  btnLogin: {
    backgroundColor: "#009347",
    padding: 20,
    borderRadius: 6,
  },
  txtLogin: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 18,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');
    this.state = {
      email: "",
      password: "",
      submitted: false,
      rememberMe: false,
      playerId: "",
      //languageCode: "",
    };
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.setAppId("8f2c576d-d40e-4e63-a95b-e64064a8e353", {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    // OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback); // myiOSPromptCallback do not anything
    OneSignal.promptForPushNotificationsWithUserResponse();

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationReceivedEvent) => {
        console.log(
          "OneSignal: notification will show in foreground:",
          notificationReceivedEvent
        );
        let notification = notificationReceivedEvent.getNotification();
        console.log("notification: ", notification);
        const data = notification.additionalData;
        console.log("additionalData: ", data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      }
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log("OneSignal: notification opened:", notification);
    });

    // OneSignal.addEventListener("ids", this.onIds);
    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      const notification = openedEvent.notification;
      console.log("Opened notification:", notification);
      // Xử lý khi người dùng mở thông báo
      this.onIds;
    });
  }
  emailFieldRef = React.createRef();
  passwordFieldRef = React.createRef();

  componentDidMount = async () => {
    //   var id = DeviceInfo.getUniqueId();
    //  // this.setState({playerId:id})
    // OneSignal.addEventListener("ids", this.onIds);
    // OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      const notification = openedEvent.notification;
      console.log("Opened notification:", notification);
      // Xử lý khi người dùng mở thông báo
      this.onIds;
      this.onOpened.bind(this);
    });
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          "change",
          this.handleChangeLanguage(languageCode)
        );
      }

      const isRemembered = await getIsRemembered();
      if (isRemembered === "yes") {
        const username = await getUserName();
        const password = await getUserPassWord();
        // const deviceid = await getdeviceid();

        this.setState({ rememberMe: true });
        this.setState({ password: password }, () => {
          this.passwordFieldRef.current.setValue(this.state.password);
        });
        this.setState({ email: username }, () => {
          this.emailFieldRef.current.setValue(this.state.email);
          // this.setState({playerId: deviceid});
        });
      }
    } catch (error) {
      console.log("Errors", error);
    }
  };

  onOpened = async ({ notification }) => {
    // console.log('Tri da chon thong bao1', notification.payload.additionalData);
    console.log(
      "Tri da chon thong bao2",
      notification.payload.additionalData.iddata
    );
    // Actions.ReceiveAssignment({textidxeplich: notification.payload.additionalData.iddata});
    // Actions['OrderDetailNewVersion']({ orderItem: notification.payload.additionalData.iddata })
    // this.props.navigation.navigate('OrderDetailNewVersion', { orderItem: notification.payload.additionalData.iddata });
    if (notification.payload.additionalData.iddata) {
      try {
        const response = await getOrderByUserId();
        if (response.success) {
          const orderItem = response.data.filter(
            (e) => e.id === notification.payload.additionalData.iddata
          );
          this.props.navigation.navigate("OrderDetailNewVersion", {
            orderItem: orderItem[0],
          });
        }
      } catch (err) {
        console.log("LỖI FETCH API,", err);
      }
    }
    // console.log('Tri da chon thong bao2')
  };

  onIds = (device) => {
    this.setState({ playerId: device.userId });
  };
  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    OneSignal.removeEventListener("ids", this.onIds);
    if (languageCode) {
      RNLocalize.addEventListener(
        "change",
        this.handleChangeLanguage(languageCode)
      );
    }
  };

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
  };
  handleChangeLanguage = (lgnCode) => {
    setLanguage(lgnCode);
    //this.setState({languageCode: lgnCode});

    chooseLanguageConfig(lgnCode);
  };

  toggleSwitch = () => {
    const { rememberMe } = this.state;
    this.setState({ rememberMe: !rememberMe });
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password, rememberMe } = this.state;

    if (email && password) {
      if (rememberMe) {
        setUserName(email);
        setUserPassWord(password);
        // setdeviceid(this.state.playerId);//luu thiet bi
        setIsRemembered();
      } else {
        removeRememberMe();
      }
      this.props.loginUser(
        email.toLowerCase().trim(),
        password,
        this.state.playerId
      );
    }
  };

  renderError = (error) => {
    return (
      <WingBlank>
        <WhiteSpace size="lg" />
        <Text style={styles.txtError}>
          {error === "ajax error 500"
            ? translate("CONNECTION_ERROR_PLEASE_CHECK_THE_NETWORK")
            : error}
        </Text>
      </WingBlank>
    );
  };
  renderLayout() {
    const { email, password, submitted, rememberMe, languageCode } = this.state;
    const { isLoading, error } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{ marginLeft: 30, marginTop: 10 }}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Icon size={30} name="ios-arrow-back"></Icon>
        </TouchableOpacity>
        <View style={[styles.container, { alignItems: "flex-start" }]}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.logo}>
              <Image
                // style={{ resizeMode: "contain", height: 130, width: 130 }}
                style={{ resizeMode: "contain" }}
                source={logo}
              />
            </View>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={{ width: "90%", justifyContent: "center" }}>
              <TextField
                style={{ width: "90%" }}
                tintColor="#009347"
                onSubmitEditing={() => this.passwordFieldRef.current.focus()}
                onChangeText={(email) => {
                  this.setState({
                    email,
                  });
                }}
                value={this.state.email}
                label={translate("USERNAME")}
                error={
                  submitted && !email ? translate("USERNAME_IS_REQUIRED") : ""
                }
                ref={this.emailFieldRef}
              />

              <TextField
                style={{ width: "90%" }}
                tintColor="#009347"
                // clear
                onChangeText={(password) => {
                  this.setState({
                    password,
                  });
                }}
                value={this.state.password}
                secureTextEntry={true}
                label={translate("PASSWORD")}
                type="password"
                error={
                  submitted && !password
                    ? translate("PASSWORD_IS_REQUIRED")
                    : ""
                }
                ref={this.passwordFieldRef}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginTop: 10,
              padding: 5,
            }} /*state={styles.checkBox}*/
          >
            <Text
              style={{
                fontSize: 15,
                padding: 5,
                marginLeft: 20,
              }}
            >
              {translate("SAVE_PASSWORD")}
            </Text>

            <Switch
              trackColor={{ false: "#DCDCD8", true: "#ACF6AB" }}
              thumbColor={rememberMe ? "#ECDB97" : "#FFFFFF"}
              onValueChange={this.toggleSwitch}
              value={rememberMe}
              style={{}}
            />

            {/* <Picker
                  selectedValue={languageCode}
                  style={{ height: 50, width: 150 }}
                  //onValueChange={(itemValue, itemIndex) => this.setState({languageCode: itemValue})}
                  onValueChange={(itemValue) => this.handleChangeLanguage(itemValue)}
                >
                  <Picker.Item label="VIE" value="vi" />
                  <Picker.Item label="ENG" value="en" />
                </Picker> */}
          </View>
          {error ? this.renderError(error) : null}
          <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
            <View style={{ width: "90%" }}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#009347" />
              ) : (
                <TouchableOpacity
                  onPress={this.handleSubmit}
                  style={styles.btnLogin}
                >
                  <Text style={styles.txtLogin}>{translate("LOGIN")}</Text>
                </TouchableOpacity>
                // <Button
                //   onPress={this.handleSubmit}
                //   style={styles.btnLogin}
                // >
                //   {translate('LOGIN')}
                // </Button>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  render() {
    if (Platform.OS === "ios") {
      return (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset="40"
          style={{ flex: 1 }}
        >
          {this.renderLayout()}
        </KeyboardAvoidingView>
      );
    }

    return (
      <ScrollView>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "space-between" }}
          keyboardVerticalOffset="40"
          behavior="padding"
          enabled
        >
          {this.renderLayout()}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
function myiOSPromptCallback(permission) {
  // do something with permission value
}
export const mapStateToProps = (state) => ({
  isLoading: state.auth.loading,
  error: state.auth.error,
});

export default connect(mapStateToProps, { loginUser })(Login);
