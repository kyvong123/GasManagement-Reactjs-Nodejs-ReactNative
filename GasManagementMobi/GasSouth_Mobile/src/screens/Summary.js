import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { List, Button, Flex, WhiteSpace } from "@ant-design/react-native/lib/";
import { Actions } from "react-native-router-flux";
import isEmpty from "lodash/isEmpty";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { COLOR } from "../constants";
import {
  deleteCylinders,
  typeForPartner,
  reportCyclinderSuccess,
  addCylinder,
} from "../actions/CyclinderActions";
import addLocalCyclinder from "./../api/addLocalCyclinder";
import { getPosition } from "../helper/utils";

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

const { width } = Dimensions.get("window");
const Item = List.Item;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#009347",
    color: COLOR.WHITE,
  },
  productList: {
    padding: 10,
  },
  sum: {
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
    color: COLOR.ORANGE,
  },
  serial: {
    color: COLOR.BLUE,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#009347",
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  btnCancel: {
    backgroundColor: COLOR.RED,
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  txtButton: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
});

// <Item extra={<Text style={styles.itemStyle}>12345</Text>}><Text style={styles.itemStyle}>Tên sản phẩm</Text></Item>
class Summary extends Component {
  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          "change",
          this.handleChangeLanguage(languageCode)
        );
      }
    } catch (error) {
      console.log(error);
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

  renderProducts = () => {
    const { cylinders } = this.props;
    return (
      <View style={styles.productList}>
        {this.props.cyclinder.serial}
        {cylinders.map((item) => {
          return (
            <Text style={styles.serial} key={item}>
              {item}
            </Text>
          );
        })}
      </View>
    );
  };
  renderEmpty = () => (
    <View style={styles.productList}>
      <Text style={styles.title}>
        {translate("NO_SERIAL_HAS_BEEN_ENTERED_YET")}
      </Text>
      <Text
        style={{
          color: "red",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {typeof this.props.status !== "undefined"
          ? this.props.status === "FULL"
            ? translate("FULL_TANK_CANNOT_EXPORT_GAS_STATION")
            : translate("EMPTY_CYLINDER_CANNOT_BE_SOLD")
          : null}
      </Text>
      <Fragment>
        <WhiteSpace />
        <Flex justify="center">
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => Actions.reset("app")}
          >
            <Text style={styles.txtButton}>{translate("CANCLE")}</Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace />
        <Flex justify="center">
          <TouchableOpacity
            style={styles.btn}
            onPress={() => Actions.push("scan")}
          >
            <Text style={styles.txtButton}>{translate("CONTINUE")}</Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace />
        <Flex justify="center">
          <TouchableOpacity
            style={styles.btn}
            onPress={this.handleLoadScannedCylinders}
          >
            <Text style={styles.txtButton}>
              {translate("LOAD_SCANNED_CYLINDER")}
            </Text>
          </TouchableOpacity>
        </Flex>
      </Fragment>
    </View>
  );
  handleDestroy = () => {
    Actions.reset("app");
    this.props.deleteCylinders();
    this.props.typeForPartner("");
  };
  handleLoadScannedCylinders = () => {
    Alert.alert(
      translate("notification"),
      translate("DO_YOU_WANT_TO_LOAD_SCANNED_CYLINDERS"),
      [
        {
          text: "Có",
          onPress: async () => {
            await addLocalCyclinder.getItem().then((list) => {
              if (list.length > 0) {
                list.map((value) => {
                  this.props.addCylinder(value.id);
                });
              }
            });
          },
        },
        {
          text: "Không",
          onPress: () => console.log("Cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  renderActions = (cyclinderAction) => {
    const { typeForPartnerReducer, userInfor } = this.props;
    // if(summaryAction === 'importCyclinder') {
    //   return (
    //     <Fragment>
    //       <Flex justify='center'>
    //         <TouchableOpacity style={styles.btn} onPress={Actions.shipper} >
    //           <Text style={styles.txtButton}>Tiếp tục</Text>
    //         </TouchableOpacity>
    //       </Flex>
    //       <WhiteSpace />
    //       <Flex justify='center'>
    //         <TouchableOpacity style={styles.btn} onPress={Actions.home} >
    //           <Text style={styles.txtButton}>Hủy</Text>
    //         </TouchableOpacity>
    //       </Flex>
    //   </Fragment>
    //   )
    // }
    return (
      <Fragment>
        <Flex justify="center">
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              userInfor.userRole === "Deliver" &&
              cyclinderAction === "TURN_BACK"
                ? Actions.turnbackByDriver()
                : userInfor.userRole === "Deliver" &&
                  cyclinderAction === "IMPORT"
                ? Actions.exportByDriver()
                : typeForPartnerReducer
                ? Actions.replace("shipperTypeForPartner")
                : Actions.replace("shipper")
            }
          >
            <Text style={styles.txtButton}>{translate("CONTINUE")}</Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace />
        <Flex justify="center">
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={this.handleDestroy}
          >
            <Text style={styles.txtButton}>{translate("CANCLE")}</Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace />
        <Flex justify="center">
          <TouchableOpacity
            style={styles.btn}
            onPress={this.handleLoadScannedCylinders}
          >
            <Text style={styles.txtButton}>
              {translate("LOAD_SCANNED_CYLINDER")}
            </Text>
          </TouchableOpacity>
        </Flex>
      </Fragment>
    );
  };

  render() {
    const { cyclinderAction, cylinders } = this.props;
    if (!cyclinderAction || !cylinders || cylinders.length < 1) {
      return this.renderEmpty();
    }

    // {this.renderProducts()}
    return (
      <ScrollView>
        <Text style={styles.sum}>
          {translate("TOTAL_NUMBER_OF_LPG_CYLINDERS_WERE_MANIPULATED")}:{" "}
          {cylinders.length}
        </Text>
        <Text
          style={{
            color: "red",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          {typeof this.props.status !== "undefined"
            ? this.props.status === "FULL"
              ? translate("FULL_TANK_CANNOT_EXPORT_GAS_STATION")
              : translate("EMPTY_CYLINDER_CANNOT_BE_SOLD")
            : null}
        </Text>
        {this.renderActions(cyclinderAction)}
      </ScrollView>
    );
  }
}

export const mapStateToProps = (state) => ({
  loading: state.cylinders.loading,
  cyclinderAction: state.cylinders.cyclinderAction,
  cylinders: state.cylinders.cylinders,
  typeForPartnerReducer: state.cylinders.typeForPartner,
  userInfor: state.auth.user,
});

export default connect(mapStateToProps, {
  deleteCylinders,
  typeForPartner,
  addCylinder,
})(Summary);
