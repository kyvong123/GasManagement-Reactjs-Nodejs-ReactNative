import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Button, Flex, List, WhiteSpace } from "@ant-design/react-native/lib/";
import { Actions } from "react-native-router-flux";
import isEmpty from "lodash/isEmpty";
import Modal from "react-native-modal";
import { TextField } from "react-native-material-textfield";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import { COLOR } from "../constants";
import {
  addCylinder,
  fetchCylinder,
  updateCylinders,
  deleteCylinders,
  typeForPartner,
  getDuplicateCylinder,
} from "../actions/CyclinderActions";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-community/async-storage";
import { getPosition, getUserType } from "../helper/utils";
import addLocalCyclinder from "./../api/addLocalCyclinder";
import moment from "moment";
import {
  DELIVERING,
  EXPORT,
  EXPORT_PARENT_CHILD,
  FACTORY,
  IMPORT,
  IN_CUSTOMER,
  IN_FACTORY,
  TURN_BACK,
  DELIVER,
  EXPORT_CYLINDER_WAREHOUSE_STEP1,
} from "../types";
import saver from "../utils/saver";

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { cylinders } from "../helper/selector";
import TextButton from "../components/TextButton";

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

const COLOR_ENUM = {
  ["Pink"]: translate("PINK"),
  ["Red"]: translate("RED"),
  ["Green"]: translate("GREEN"),
  ["Blue"]: translate("BLUE"),
  ["Grey"]: translate("GREY"),
  ["6 Colors"]: translate("6_COLORS"),
};
const { width } = Dimensions.get("window");
const Item = List.Item;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  titleCustom: {
    fontSize: 15,
    // padding: 10,
    // marginRight: 20,
    color: COLOR.WHITE,
  },
  titleCustomHeader: {
    fontSize: 15,
    padding: 10,
    marginRight: 20,
    color: COLOR.WHITE,
  },
  title: {
    //marginTop: 10,
    padding: 10,
    backgroundColor: "#009347",
    color: COLOR.WHITE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  itemStyle: {
    color: COLOR.BLUE,
    fontSize: 15,
  },
  determine: {
    color: COLOR.WHITE,
    //fontWeight: 'bold',
    //textDecorationLine: 'underline',
    fontSize: 30,
  },
  warning: {
    color: COLOR.RED,
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 20,
    textAlign: "center",
  },
  btnScan: {
    backgroundColor: COLOR.LIGHTBLUE,
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
  },
  btnReport: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  txtEmpty: {
    textAlign: "center",
    color: COLOR.BLUE,
    fontSize: 20,
    padding: 20,
  },
  txtScan: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 20,
  },
  txtSerials: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
    padding: 20,
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
  txtSerial: {
    color: COLOR.ORANGE,
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
  btnStamp: {
    backgroundColor: "#F6921E",
    height: 50,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  txtBtnStamp: {
    fontSize: 18,
    textAlign: "center",
    color: COLOR.WHITE,
  },
});

// <Item extra={<Text style={styles.itemStyle}>12345</Text>}><Text style={styles.itemStyle}>Tên sản phẩm</Text></Item>
//let lastCylinders = []
class ScanResults extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      currentTO: false,
      openModal: this.props.cyclinderAction == TURN_BACK ? true : false,
      idCyclinder: this.props.cyclinder.id,
      weight: null,
      weightExpot: null,
      // serial: this.props.cyclinder.serial,
      serial: this.props.serial[0],
      weightDefault: 0,
      listSerial: [],
      checkdata: false,
      type2: 2,
      type3: 3,
      cnt: 0,
      cylindersReturn: [],
    };
  }

  tryAgain = async () => {
    //lastCylinders.push(this.props.lastCylinders)
    Actions.scan();
  };

  ShowAlert(id, cyclinderAction, childOf) {
    if (cyclinderAction === EXPORT) {
      Alert.alert(
        "Thông báo",
        "Mã bình không đủ điều kiện xuất, bạn có muốn xuất bình trùng không?",
        [
          {
            text: "Đồng ý",
            onPress: () => {
              if (this.props.dupCylinder.Cylinder) {
                this.props.addCylinder(this.props.dupCylinder.Cylinder.id);
              }
            },
          },
          {
            text: "Không",
            style: "cancel",
          },
        ]
      );
    } else if (cyclinderAction === TURN_BACK) {
      Alert.alert(
        "Cảnh báo",
        "Bình trùng sẽ đào tạo hệ thống các trạm giữ lại để kiểm tra việc in mã có đúng không, và chờ rà soát(vì số lượng sẽ không nhiều)",
        [
          {
            text: "Đồng ý",
            onPress: () => {
              if (this.props.dupCylinder) {
                this.props.addCylinder(this.props.dupCylinder.Cylinder.id);
              }
            },
          },
          {
            text: "Không",
            style: "cancel",
          },
        ]
      );
    } else if (cyclinderAction === IMPORT) {
      Alert.alert(
        "Thông báo",
        "Mã bình không đủ điều kiện nhập, bạn có muốn nhận bình trùng không?",
        [
          {
            text: "Đồng ý",
            onPress: () => {
              if (this.props.dupCylinder) {
                this.props.addCylinder(this.props.dupCylinder.Cylinder.id);
              }
            },
          },
          {
            text: "Không",
            style: "cancel",
          },
        ]
      );
    }
  }

  addCylinderById = async () => {
    const { cyclinder, cyclinderAction } = this.props;

    // if (cyclinder.placeStatus !== DELIVERING) {
    //     Actions.scan();
    //     return;
    // }
    // if (cyclinder.placeStatus === IN_CUSTOMER && cyclinderAction !== TURN_BACK) {
    //     Actions.scan();
    //     return;
    // }
    if (cyclinderAction === TURN_BACK) {
      if (this.props.cyclinder.authorize) {
        //console.log("got to this")
        if (cyclinder.placeStatus !== DELIVERING) {
          if (cyclinder.placeStatus !== IN_FACTORY) {
            //console.log("got to this 2")
            if (!this.state.weight) {
              // console.log('hello'+"got to this 1")
              await addLocalCyclinder.addItem(
                cyclinder.id,
                cyclinder.serial,
                cyclinder.weight
              );
            } else {
              // console.log('hello'+"got to this 2")
              await addLocalCyclinder.addItem(
                cyclinder.id,
                cyclinder.serial,
                this.state.weight
              );
            }
            const { id } = this.props.cyclinder;
            this.props.addCylinder(id);
          }
        }
        Actions.scan();
        return;
      }
    }

    if (this.props.cyclinder.authorize) {
      // if (this.props.userType === FACTORY && saver.getTypeCyclinder() !== "" && this.props.cyclinder.status === "FULL") {
      //     Actions.scan({status: "FULL"});
      // } else if (this.props.userType === FACTORY && saver.getTypeCyclinder() === "" && this.props.cyclinder.status === "EMPTY") {
      //     Actions.scan({status: "EMPTY"});
      // } else {
      if (!this.state.weightExpot) {
        await addLocalCyclinder.addItem(
          cyclinder.id,
          cyclinder.serial,
          this.state.weightDefault
        );
      } else {
        await addLocalCyclinder.addItem(
          cyclinder.id,
          cyclinder.serial,
          this.state.weightExpot
        );
      }
      const { id } = this.props.cyclinder;
      this.props.addCylinder(id);
      Actions.scan();
      //}
      //Actions.scan();
      return;
    }
    //lastCylinders.push(this.props.lastCylinders)
    //Actions.scan();
  };
  handleImport = async () => {
    const { cyclinder, cyclinderAction, typeForPartnerReducer, userInfor } =
      this.props;
    // Alert.alert(
    //   translate("DO_YOU_WANT_FINISH"),
    //   [
    //     {
    //       text: translate("YES"),
    //       onPress: async () => {

    //       },
    //     },
    //     {

    //     },
    //   ],
    //   { cancelable: false }
    // );
    Alert.alert(
      translate("notification"),
      "Bạn có chắc muốn kết thúc nhập?",
      [
        {
          text: "Có",
          onPress: async () => {
            if (cyclinder.placeStatus !== DELIVERING) {
              Actions.importSummary();
              return;
            } else if (
              cyclinder.placeStatus === IN_CUSTOMER &&
              cyclinderAction !== TURN_BACK
            ) {
              Actions.importSummary();
              return;
            } else if (!this.props.cyclinder.authorize) {
              Actions.importSummary();
            } else if (
              this.state.currentTO &&
              userInfor.userRole !== "Deliver"
            ) {
              Actions.importSummary();
            } else {
              const { id } = this.props.cyclinder;
              this.props.addCylinder(id);
              if (!this.state.weightExpot) {
                await addLocalCyclinder.addItem(
                  cyclinder.id,
                  cyclinder.serial,
                  this.state.weightDefault
                );
              } else {
                await addLocalCyclinder.addItem(
                  cyclinder.id,
                  cyclinder.serial,
                  this.state.weightExpot
                );
              }
              !!typeForPartnerReducer
                ? Actions.exportSummary({ cyclinder: cyclinder })
                : Actions.importSummary();
            }
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
  handleExport = () => {
    const { cyclinder, cyclinderAction, typeForPartnerReducer } = this.props;
    if (cyclinder.placeStatus === DELIVERING) {
      Actions.exportSummary();
    } else if (
      cyclinder.placeStatus === IN_CUSTOMER &&
      cyclinderAction !== TURN_BACK
    ) {
      Actions.exportSummary();
    } else if (
      this.props.userInfor.userRole == "Warehouse" &&
      this.props.cyclinder.authorize
    ) {
      console.log("đây: ", this.props);
      const { id } = this.props.cyclinder;
      this.props.addCylinder(id);
      Actions.exportSummary({ cyclinder: cyclinder });
    } else if (cyclinder.current.id !== this.props.user) {
      Actions.exportSummary();
    } else {
      if (this.props.cyclinder.authorize) {
        const { id } = this.props.cyclinder;
        this.props.addCylinder(id);
        Actions.exportSummary({ cyclinder: cyclinder });
      }
    }
  };
  handleTurnBack = async () => {
    const { cyclinder } = this.props;

    Alert.alert(
      translate("notification"),
      "Bạn có muốn hoàn thành?",
      [
        {
          text: "Có",
          onPress: async () => {
            if (
              cyclinder.placeStatus === DELIVERING ||
              cyclinder.placeStatus === IN_FACTORY
            ) {
              if (cyclinder.length == 0) {
                return;
              } else {
                Actions.push("turnBackSummary");
                return;
              }
            }

            if (cyclinder.placeStatus === IN_FACTORY) {
              if (cyclinder.length == 0) {
                return;
              } else {
                Actions.push("turnBackSummary");
                return;
              }
            }
            //  cylindersReturn.map(item=>{
            //     if(cyclinder.id!==item.c)

            //  })

            if (!this.state.weight) {
              await addLocalCyclinder.addItem(
                cyclinder.id,
                cyclinder.serial,
                cyclinder.weight
              );
            } else {
              let check = await addLocalCyclinder.addItem(
                cyclinder.id,
                cyclinder.serial,
                this.state.weight
              );

              if (check) {
                this.setState({ openModal: false });
              }
            }
            const { id } = this.props.cyclinder;

            if (this.props.cyclinder.authorize) {
              this.props.addCylinder(id);
              Actions.push("turnBackSummary");
              return;
            }
            Actions.push("turnBackSummary");
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

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.cyclinder.histories !== "undefined" &&
      nextProps.cyclinder.histories.length > 0
    ) {
      if (
        nextProps.cyclinder.histories[nextProps.cyclinder.histories.length - 1]
          .to !== null
      ) {
        if (
          nextProps.cyclinder.histories[
            nextProps.cyclinder.histories.length - 1
          ].to.id !== this.props.user
        ) {
          this.setState({ currentTO: true });
        } else {
          saver.setArrCyclinder(nextProps.cyclinder);
        }
      } else {
        const resultHistory = nextProps.cyclinder.histories[
          nextProps.cyclinder.histories.length - 1
        ].toArray.find((x) => x.id === this.props.user);
        {
          if (typeof resultHistory === "undefined") {
            this.setState({ currentTO: true });
          } else {
            saver.setArrCyclinder(nextProps.cyclinder);
          }
        }
      }
    }
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount = async () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        "change",
        this.handleChangeLanguage(languageCode)
      );
    }
  };

  handleBackButtonClick() {
    //alert("hehehe")
    if (this.props.cyclinderAction) {
      return true;
    }
    this.props.navigation.goBack(null);
    return true;
  }
  handleDestroy = () => {
    Actions.push("scan");
    this.props.deleteCylinders();
    this.props.typeForPartner("");
  };
  handleSubmit = (e) => {
    const { cyclinder, cyclinderAction } = this.props;
    e.preventDefault();

    const updatedSerial = this.state.serial;
    if (cyclinderAction === "") {
      this.setState({ serial: updatedSerial }, () =>
        this.props.fetchCylinder([updatedSerial], this.state.type3)
      );
    } else {
      this.setState({ serial: updatedSerial }, () =>
        this.props.fetchCylinder([updatedSerial], this.state.type2)
      );
    }
  };

  componentDidMount = async () => {
    const { cyclinder, cyclinderAction } = this.props;

    const updatedSerial = this.state.serial;
    let getData = await addLocalCyclinder.getItem();
    this.setState({ cylindersReturn: getData });

    if (cyclinderAction === "") {
      this.props.fetchCylinder([updatedSerial], this.state.type3);
    } else {
      this.props.fetchCylinder([updatedSerial], this.state.type2);
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
      console.log(error);
    }
  };

  // componentDidUpdate = async () => {
  //   const { cyclinder, cyclinderAction } = this.props;
  //   if (!this.state.weightDefault) {
  //     let a = 0;
  //     switch (cyclinder.cylinderType) {
  //       case "CYL45KG":
  //         a = cyclinder.weight + 45;
  //         break;
  //       case "CYL50KG":
  //         a = cyclinder.weight + 50;
  //         break;
  //       default:
  //         a = cyclinder.weight + 12;
  //         break;
  //     }
  //     await this.setState({
  //       weightDefault: a,
  //     });
  //     //console.log("Hung3 ", this.state.weightDefault)
  //   }
  // };

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.cyclinder !== prevProps.cyclinder) {
      let a = 0;
      switch (this.props.cyclinder.category?.mass) {
        case 45:
          a = this.props.cyclinder.weight + 45;
          break;
        case 50:
          a = this.props.cyclinder.weight + 50;
          break;
        default:
          a = this.props.cyclinder.weight + 12;
          break;
      }
      // console.log("checkaaaaaaaaaaaaaaaaaaaaaaaaaaaa",this.props.cyclinder.category.mass)
      this.setState({
        weightDefault: a,
        checkdata: true,
      });
    }
    if (this.props.cyclindererr !== prevProps.cyclindererr) {
      this.setState({
        checkdata: false,
      });
    }
  }

  handleChangeLanguage = (lgnCode) => {
    //setLanguage(lgnCode);
    chooseLanguageConfig(lgnCode);
  };

  renderStatus = (cyclinder) => {
    if (cyclinder.placeStatus === DELIVERING) {
      const dataTo = cyclinder.histories[cyclinder.histories.length - 1];
      if (dataTo.to !== null) {
        if (dataTo.to.id === this.props.user) {
          return (
            <Item
              extra={
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.itemStyle,
                      { textAlign: "right", justifyContent: "flex-end" },
                    ]}
                  >
                    {cyclinder.placeStatus !== IN_CUSTOMER
                      ? getPosition(cyclinder.placeStatus) +
                        " " +
                        translate("FROM") +
                        " " +
                        cyclinder.current.name +
                        " " +
                        translate("TO") +
                        " " +
                        getUserType(dataTo.to.userType) +
                        " " +
                        dataTo.to.name
                      : getPosition(cyclinder.placeStatus)}
                  </Text>
                </View>
              }
            >
              <View>
                <Text style={[styles.itemStyle, { width: 100 }]}>
                  {translate("STATUS")}{" "}
                </Text>
              </View>
            </Item>
          );
        }
        return (
          <Item
            extra={
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.itemStyle,
                    { textAlign: "right", justifyContent: "flex-end" },
                  ]}
                >
                  {cyclinder.placeStatus !== IN_CUSTOMER
                    ? getPosition(cyclinder.placeStatus) +
                      " " +
                      translate("FROM") +
                      " " +
                      cyclinder.current.name //+ " đến " + getUserType(dataTo.to.userType) + " " + dataTo.to.name
                    : getPosition(cyclinder.placeStatus)}
                </Text>
              </View>
            }
          >
            <View>
              <Text style={[styles.itemStyle, { width: 100 }]}>
                {translate("STATUS")}{" "}
              </Text>
            </View>
          </Item>
        );
      } else {
        const resultHistory = dataTo.toArray.find(
          (x) => x.id === this.props.user
        );

        if (typeof resultHistory === "undefined") {
          return (
            <Item
              extra={
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.itemStyle,
                      { textAlign: "right", justifyContent: "flex-end" },
                    ]}
                  >
                    {cyclinder.placeStatus !== IN_CUSTOMER
                      ? getPosition(cyclinder.placeStatus) +
                        " " +
                        translate("FROM") +
                        " " +
                        cyclinder.current.name //+ " đến " + getUserType(dataTo.toArray[0].userType)
                      : getPosition(cyclinder.placeStatus)}
                  </Text>
                </View>
              }
            >
              <View>
                <Text style={[styles.itemStyle, { width: 100 }]}>
                  {translate("STATUS")}{" "}
                </Text>
              </View>
            </Item>
          );
        } else {
          return (
            <Item
              extra={
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.itemStyle,
                      { textAlign: "right", justifyContent: "flex-end" },
                    ]}
                  >
                    {cyclinder.placeStatus !== IN_CUSTOMER
                      ? getPosition(cyclinder.placeStatus) +
                        " " +
                        translate("FROM") +
                        " " +
                        cyclinder.current.name +
                        " " +
                        translate("TO") +
                        " " +
                        getUserType(resultHistory.userType) +
                        " " +
                        resultHistory.name
                      : getPosition(cyclinder.placeStatus)}
                  </Text>
                </View>
              }
            >
              <View>
                <Text style={[styles.itemStyle, { width: 100 }]}>
                  {translate("STATUS")}
                </Text>
              </View>
            </Item>
          );
        }
      }
    } else if (cyclinder.placeStatus === "IN_FACTORY") {
      return (
        <Item
          extra={
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.itemStyle,
                  { textAlign: "right", justifyContent: "flex-end" },
                ]}
              >
                {cyclinder.placeStatus !== IN_CUSTOMER
                  ? getPosition(cyclinder.placeStatus) +
                    " " +
                    (cyclinder.current
                      ? cyclinder.current.name
                      : cyclinder.factory.name)
                  : getPosition(cyclinder.placeStatus)}
              </Text>
            </View>
          }
        >
          <View>
            <Text style={[styles.itemStyle, { width: 100 }]}>Trạng thái </Text>
          </View>
        </Item>
      );
    } else if (cyclinder.placeStatus === "IN_CUSTOMER") {
      return (
        <Item
          extra={
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.itemStyle,
                  { textAlign: "right", justifyContent: "flex-end" },
                ]}
              >
                {translate("IN_CUSTOMER")}
              </Text>
            </View>
          }
        >
          <View>
            <Text style={[styles.itemStyle, { width: 100 }]}>
              {translate("STATUS")}
            </Text>
          </View>
        </Item>
      );
    } else {
      return (
        <Item
          extra={
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.itemStyle,
                  { textAlign: "right", justifyContent: "flex-end" },
                ]}
              >
                {cyclinder.placeStatus !== IN_CUSTOMER
                  ? getPosition(cyclinder.placeStatus) +
                    ": " +
                    (cyclinder.current !== null ? cyclinder.current.name : "")
                  : getPosition(cyclinder.placeStatus)}
              </Text>
            </View>
          }
        >
          <View>
            <Text style={[styles.itemStyle, { width: 100 }]}>
              {translate("STATUS")}
            </Text>
          </View>
        </Item>
      );
    }
  };

  checkDate = (day) => {
    let firstDate;

    if (moment(day).isValid()) {
      //console.log("IsoDate", day)

      // const vnDate = moment(day).format('DD/MM/YYYY');
      // this.setState({checkedDate: vnDate})

      firstDate = new Date(day);
    } else {
      // start conver dd/mm/yyyy to mm/dd/yyyy
      let dateParts = day.split("/");

      // month is 0-based, that's why we need dataParts[1] - 1
      firstDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    }

    //console.log("firstDate", firstDate);

    // begin check 60 days
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    let today = new Date();
    //console.log("hankd_today", today);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();

    const secondDate = new Date(mm + "/" + dd + "/" + yyyy);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    if (firstDate > secondDate && diffDays > 60) {
      return { color: COLOR.LIGHTBLUE };
    } else {
      return {
        color: "red",
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 20,
      };
    }
  };

  renderDate = (date) => {
    if (moment(date).isValid()) {
      return moment(date).format("DD/MM/YYYY");
    } else {
      let temp = date.split("/");
      return temp[1] + "/" + temp[2];
    }
  };

  renderHeader = () => {
    const { serial, cyclinder } = this.props;
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={styles.title}>
          <View>
            <TextInput
              style={{
                height: 40,
                width: Platform.OS === "ios" ? 320 : 260,
                marginRight: 10,
              }}
              value={this.state.serial}
              onChangeText={(val) =>
                this.setState({ serial: val.toUpperCase() })
              }
            />
          </View>
          <View
            style={{
              flex: 1,
              // flexWrap: "wrap",
              flexDirection: "row-reverse",
            }}
          >
            <TouchableOpacity
              onPress={(e) => this.handleSubmit(e)}
              style={{ marginLeft: 5 }}
            >
              <Icon size={30} name="ios-search" color={COLOR.WHITE}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await saver.setTypeCamera(false);
                Actions.popTo("scan");
              }}
              style={{ marginRight: 5 }}
            >
              <Icon1 name="scan1" size={30} color={COLOR.WHITE}></Icon1>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.title}>
          <View>
            <Text style={{ fontSize: 16, color: COLOR.WHITE, width: 200 }}>
              {translate("LPG_BOTTLE_SERIES")}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexWrap: "wrap",
              flexDirection: "row-reverse",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: COLOR.WHITE,
                textAlign: "right",
              }}
            >
              {this.state.serial}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderInfo = () => {
    const { cyclinder, cyclinderAction, userInfor, serial } = this.props;

    //console.log('userInfor', userInfor);
    var dateBought = "";
    if (cyclinder.placeStatus === IN_CUSTOMER) {
      if (
        typeof cyclinder.histories !== "undefined" &&
        cyclinder.histories.length > 0
      ) {
        dateBought = moment(
          cyclinder.histories[cyclinder.histories.length - 1].createdAt
        ).format("DD-MM-YYYY");
      }
    }

    return (
      <View>
        <List>
          <Item
            extra={
              <Text style={[styles.itemStyle, { flex: 1, textAlign: "right" }]}>
                Công ty Cổ phần Kinh doanh Khí Miền Nam (Gas South)
              </Text>
            }
          >
            <Text style={[styles.itemStyle, { width: 200 }]}>
              {translate("GENUINE_PRODUCTS_OF")}
            </Text>
          </Item>

          <Item
            extra={
              <Text style={this.checkDate(cyclinder.checkedDate)}>
                {this.renderDate(cyclinder.checkedDate)}
              </Text>
            }
          >
            <Text style={styles.itemStyle}>{translate("DETERMINERS")}</Text>
          </Item>
          <Item
            extra={
              <Text style={styles.itemStyle}>
                {(cyclinder.color !== "undefined" ? cyclinder.color : "Gray") +
                  " - " +
                  (cyclinder.valve ? cyclinder.valve : "")}
              </Text>
            }
          >
            <Text style={styles.itemStyle}>{translate("COLOR_VALVE")}</Text>
          </Item>
          <Item
            extra={<Text style={styles.itemStyle}>{cyclinder.weight}</Text>}
          >
            <Text style={styles.itemStyle}>{translate("WEIGHT")} (kg)</Text>
          </Item>

          {this.renderStatus(cyclinder)}

          {cyclinder.placeStatus === IN_CUSTOMER ? (
            <Item
              extra={
                <Text style={styles.itemStyle}>
                  {cyclinder.current !== null ? cyclinder.current.name : ""}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>{translate("SOLD_AT")} </Text>
            </Item>
          ) : null}
          {cyclinder.placeStatus === IN_CUSTOMER ? (
            <Item extra={<Text style={styles.itemStyle}>{dateBought}</Text>}>
              <Text style={styles.itemStyle}>{translate("DATE")} </Text>
            </Item>
          ) : null}

          {cyclinderAction === "TURN_BACK" ? (
            <Item
              extra={
                <TextInput
                  style={{ width: 150 }}
                  defaultValue={cyclinder.weight.toString()}
                  valve={cyclinder.weight}
                  mode="outlined"
                  keyboardType="numeric"
                  value={this.state.weight}
                  onChangeText={(weight) => {
                    this.setState({ weight });
                  }}
                />
              }
            >
              <Text style={styles.itemStyle}>
                {translate("reflux_weight")} (kg)
              </Text>
            </Item>
          ) : null}
          {cyclinderAction === IMPORT ? (
            <Item
              extra={
                <TextInput
                  style={{ width: 150 }}
                  defaultValue={this.state.weightDefault.toString()}
                  //valve={cyclinder.weight}
                  mode="outlined"
                  keyboardType="numeric"
                  value={this.state.weightExpot}
                  onChangeText={(weightExpot) => {
                    this.setState({ weightExpot });
                  }}
                  //onChangeText={text => this.setState({ text })}
                />
              }
            >
              <Text style={styles.itemStyle}>{"Cân nặng của bình"} (kg)</Text>
            </Item>
          ) : null}

          {cyclinder.placeStatus === DELIVERING &&
          cyclinderAction === "TURN_BACK" ? (
            <Item>
              <Text style={styles.warning}>
                {translate("THIS_CYLINDER_IS_DELIVERIED")}
              </Text>
            </Item>
          ) : null}

          {cyclinder.placeStatus === IN_FACTORY &&
          cyclinderAction === "TURN_BACK" ? (
            <Item>
              <Text style={styles.warning}>
                {translate("THIS_CYLINDER_IS_IN_FACTORY")}
              </Text>
            </Item>
          ) : null}

          {cyclinder.placeStatus === IN_CUSTOMER ? (
            <Item>
              <Text style={styles.warning}>
                {translate("CHECK_CYLINDER_INFORMATION")}
              </Text>
            </Item>
          ) : null}

          {this.props.cyclinderAction !== "" ? (
            <View>
              {cyclinder.authorize ? null : (
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {translate("GAS_CYLINDER_IS_NOT_IN_YOUR_SYSTEM")}
                </Text>
              )}
              {cyclinder.placeStatus === DELIVERING &&
              (cyclinderAction === EXPORT ||
                cyclinderAction === EXPORT_PARENT_CHILD) ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {translate("YOU_CANNOT_CONTINUE_EXPORTING")}
                </Text>
              ) : null}
              {cyclinder.placeStatus !== DELIVERING &&
              cyclinderAction === IMPORT ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {translate("YOU_CANNOT_CONTINUE_IMPORTING")}
                </Text>
              ) : null}
              {this.state.currentTO &&
              cyclinderAction === IMPORT &&
              userInfor.userRole !== "Deliver" ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {translate("GAS_CYLINDERS_ARE_NOT_SHIPPED_TO_YOU")}
                </Text>
              ) : null}
              {cyclinder.placeStatus === IN_CUSTOMER &&
              cyclinderAction !== TURN_BACK ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {translate("THIS_CYLINDER_IS_IN_CUSTOMER")}
                </Text>
              ) : null}
              {cyclinder.current.id !== this.props.user &&
              (cyclinderAction === EXPORT ||
                cyclinderAction === EXPORT_PARENT_CHILD) ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {translate("GAS_CYLINDER_IS_NOT_AT_YOU")}
                </Text>
              ) : null}
            </View>
          ) : null}
        </List>
        <View style={{ paddingTop: 10 }}>
          {cyclinderAction === IMPORT && (
            <Fragment>
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    !cyclinder.authorize ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    cyclinder.placeStatus !== DELIVERING ||
                    (this.state.currentTO && userInfor.userRole !== "Deliver")
                      ? this.tryAgain()
                      : this.addCylinderById();
                  }}
                >
                  <Text style={styles.txtButton}>
                    {!cyclinder.authorize ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    cyclinder.placeStatus !== DELIVERING ||
                    (this.state.currentTO && userInfor.userRole !== "Deliver")
                      ? translate("RETRY")
                      : translate("IMPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
              <WhiteSpace />
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.handleImport}
                >
                  <Text style={styles.txtButton}>
                    {translate("FINISH_IMPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          )}
          {cyclinderAction == EXPORT_CYLINDER_WAREHOUSE_STEP1 && (
            <Fragment>
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={
                    !cyclinder.authorize ||
                    cyclinder.placeStatus === DELIVERING ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    (this.props.userInfor.userRole !== "Warehouse" &&
                      cyclinderAction !== EXPORT_CYLINDER_WAREHOUSE_STEP1)
                      ? this.tryAgain
                      : this.addCylinderById
                  }
                >
                  <Text style={styles.txtButton}>
                    {!cyclinder.authorize ||
                    cyclinder.placeStatus === DELIVERING ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    (this.props.userInfor.userRole !== "Warehouse" &&
                      cyclinderAction !== EXPORT_CYLINDER_WAREHOUSE_STEP1)
                      ? translate("RETRY")
                      : translate("EXPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
              <WhiteSpace />
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.handleExport}
                >
                  <Text style={styles.txtButton}>
                    {translate("FINISH_EXPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          )}
          {cyclinderAction === EXPORT && (
            <Fragment>
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={
                    !cyclinder.authorize ||
                    cyclinder.placeStatus === DELIVERING ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    (cyclinder.current.id !== this.props.user &&
                      (cyclinderAction === EXPORT ||
                        cyclinderAction === EXPORT_PARENT_CHILD))
                      ? this.tryAgain
                      : this.addCylinderById
                  }
                >
                  <Text style={styles.txtButton}>
                    {!cyclinder.authorize ||
                    cyclinder.placeStatus === DELIVERING ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    (cyclinder.current.id !== this.props.user &&
                      (cyclinderAction === EXPORT ||
                        cyclinderAction === EXPORT_PARENT_CHILD))
                      ? translate("RETRY")
                      : translate("EXPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
              <WhiteSpace />
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.handleExport}
                >
                  <Text style={styles.txtButton}>
                    {translate("FINISH_EXPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          )}
          {cyclinderAction === "EXPORT_PARENT_CHILD" && (
            <Fragment>
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={
                    !cyclinder.authorize ||
                    cyclinder.placeStatus === DELIVERING ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    (cyclinder.current.id !== this.props.user &&
                      (cyclinderAction === EXPORT ||
                        cyclinderAction === EXPORT_PARENT_CHILD))
                      ? this.tryAgain
                      : this.addCylinderById
                  }
                >
                  <Text style={styles.txtButton}>
                    {!cyclinder.authorize ||
                    cyclinder.placeStatus === DELIVERING ||
                    cyclinder.placeStatus === IN_CUSTOMER ||
                    (cyclinder.current.id !== this.props.user &&
                      (cyclinderAction === EXPORT ||
                        cyclinderAction === EXPORT_PARENT_CHILD))
                      ? translate("RETRY")
                      : translate("EXPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
              <WhiteSpace />
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.handleExport}
                >
                  <Text style={styles.txtButton}>
                    {translate("FINISH_EXPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          )}
          {cyclinderAction === TURN_BACK && (
            <Fragment>
              <Flex justify="center">
                {cyclinder.authorize ? (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={this.addCylinderById}
                  >
                    <Text style={styles.txtButton}>
                      {translate("CONTINUE")}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btn} onPress={this.tryAgain}>
                    <Text style={styles.txtButton}>{translate("RETRY")}</Text>
                  </TouchableOpacity>
                )}
              </Flex>
              <WhiteSpace />
              <Flex justify="center">
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.handleTurnBack}
                >
                  <Text style={styles.txtButton}>
                    {translate("FINISH_IMPORT")}
                  </Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          )}
        </View>
      </View>
    );
  };
  // goToScanManual = () => Actions.replace('scanManual')
  goToScanManual = () => Actions.push("scan", { checkScreen: true });
  renderEmpty = () => {
    const { scanResults } = this.props;
    return (
      <ScrollView style={styles.container}>
        <Flex justify="center" direction="column">
          <Text style={styles.txtEmpty}>{translate("NO_SERIAL_FOUND")}: </Text>
          <View style={styles.txtSerials}>
            {scanResults.map((item, i) => (
              <Text style={styles.txtSerial} key={i}>
                {item.trim()};{" "}
              </Text>
            ))}
          </View>
        </Flex>
        <Flex justify="center" direction="column">
          <Flex.Item>
            <TouchableOpacity
              style={styles.btnScan}
              onPress={this.goToScanManual}
            >
              <Text style={styles.txtScan}>{translate("RETRY")}</Text>
            </TouchableOpacity>
          </Flex.Item>
          <WhiteSpace />
          <Flex.Item>
            <TouchableOpacity
              style={styles.btnScan}
              onPress={() => Actions.scanManual()}
            >
              <Text style={styles.txtScan}>
                {translate("ENTER_THE_CODE_MANUALLY")}
              </Text>
            </TouchableOpacity>
          </Flex.Item>
        </Flex>
      </ScrollView>
    );
  };
  renderButtons = () => {
    //096AB2
    const { cyclinder } = this.props;
    if (this.props.cyclinderAction) {
      return null;
    }

    // console.log("this.props.cyclinderAction", this.props.cyclinderAction);
    if (cyclinder.manufacture) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
              <View
                style={{
                  backgroundColor: "#009347",
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Text style={[styles.title, { fontSize: 18 }]}>
                  {translate("TRADEMARK")}
                </Text>
              </View>

              <View>
                <Text
                  style={[
                    styles.titleCustomHeader,
                    { color: "#096AB2", flex: 1 },
                  ]}
                >
                  Sản phẩm của Gas South
                </Text>
              </View>
            </View>
            <Image
              resizeMode="contain"
              style={{
                height: 50,
                width: 100,
                textAlign: "right",
                position: "absolute",
                top: 0,
                right: 10,
                zIndex: 999999,
              }}
              source={{
                uri:
                  cyclinder.manufacture.logo !== ""
                    ? cyclinder.manufacture.logo
                    : "",
              }}
            />
          </View>
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.titleCustom,
                  { color: "#096AB2", marginRight: 20 },
                ]}
              >
                {translate("ADDRESS")}
              </Text>
              <Text
                style={[
                  styles.titleCustom,
                  {
                    flex: 1,
                    color: "#096AB2",
                    flexWrap: "wrap",
                    textAlign: "left",
                  },
                ]}
              >
                {cyclinder.manufacture.address !== ""
                  ? cyclinder.manufacture.address
                  : ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row", paddingTop: 10 }}>
              <Text
                style={[
                  styles.titleCustom,
                  { color: "#096AB2", marginRight: 20 },
                ]}
              >
                {translate("HOTLINE")}
              </Text>
              <Text style={[styles.titleCustom, { color: "#096AB2" }]}>
                {cyclinder.manufacture.phone !== ""
                  ? cyclinder.manufacture.phone
                  : ""}
              </Text>
            </View>
          </View>
          {cyclinder.placeStatus !== "IN_FACTORY" ? (
            <View style={styles.btnReport}>
              <Button type="warning" onPress={Actions.report}>
                {translate("SEND_FEEDBACK")}
              </Button>
              <TouchableOpacity
                style={styles.btnStamp}
                onPress={Actions.ManufactureInfo}
              >
                <Text style={styles.txtBtnStamp}>
                  {translate("STAMPS_BRANDS")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", marginRight: 20 }}>
            <View style={{ backgroundColor: "#FFFFFF", flex: 1, height: 100 }}>
              <View style={{ backgroundColor: "#096AB2", height: 50 }}>
                <Text style={[styles.titleCustom]}>{translate("BRAND")}</Text>
              </View>
              <View>
                <Text style={[styles.titleCustom, { color: "#096AB2" }]}>
                  {translate("MANUFACTURERS_NAME")}
                </Text>
              </View>
            </View>
            <Image style={{ width: 100, right: 0 }} source={{ uri: "" }} />
          </View>
          <View style={{ flexDirection: "row", marginRight: 20 }}>
            <View>
              <Text style={[styles.titleCustom, { color: "#096AB2" }]}>
                {translate("ADDRESS")}
              </Text>
            </View>
            <View style={{ flex: 1, flexWrap: "wrap" }}>
              <Text style={[styles.titleCustom, { color: "#096AB2" }]}>-</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={[styles.titleCustom, { color: "#096AB2" }]}>
                {translate("HOTLINE")}
              </Text>
            </View>
            <View>
              <Text style={[styles.titleCustom, { color: "#096AB2" }]}>-</Text>
            </View>
          </View>
          <View style={styles.btnReport}>
            <Button type="warning" onPress={Actions.report}>
              {translate("SEND_FEEDBACK")}
            </Button>
          </View>
        </View>
      );
    }
  };

  render() {
    const { cyclinder, loading, serial, cyclindererr } = this.props;
    if (loading) {
      return (
        <List renderHeader={this.renderHeader()}>
          <Item>
            <ActivityIndicator size="large" color={COLOR.BLUE} />
          </Item>
        </List>
      );
    }

    if (!this.state.checkdata) {
      return this.renderHeader();
    }

    return (
      <ScrollView style={styles.container}>
        {this.renderHeader()}
        {this.renderInfo()}
        {this.renderButtons()}
      </ScrollView>
    );
  }
}

export const mapStateToProps = (state) => ({
  //cyclinder:(state.cylinders.cyclinderAction===TURN_BACK && state.cylinders.cyclinder.hasDuplicate)?state.cyclinderdupturn.cyclinder:state.cylinders.cyclinder ,
  cyclinder: state.cylinders.cyclinder,
  dupCylinder: state.cylinders.dupCylinder,
  cyclinderdup: state.cylinders.cyclinderdupturn,
  cyclindererr: state.cylinders.error,
  cyclinderAction: state.cylinders.cyclinderAction,
  scanResults: state.cylinders.scanResults,
  loading: state.cylinders.loading,
  user: state.auth.hasOwnProperty("user") ? state.auth.user.id : "",
  userType: state.auth.hasOwnProperty("user") ? state.auth.user.userType : "",
  userInfor: state.auth.hasOwnProperty("user") ? state.auth.user : "",
  typeForPartnerReducer: state.cylinders.typeForPartner,
  listCustomer: state.customer.resulListCustomer,
});
export default connect(mapStateToProps, {
  fetchCylinder,
  addCylinder,
  updateCylinders,
  deleteCylinders,
  typeForPartner,
  getDuplicateCylinder,
})(ScanResults);
