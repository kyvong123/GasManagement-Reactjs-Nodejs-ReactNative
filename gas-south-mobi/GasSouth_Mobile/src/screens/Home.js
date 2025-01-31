import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Image,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import GridView from "react-native-super-grid";
import { Actions } from "react-native-router-flux";
import { isEqual } from "lodash";
import { getUserType, getUserRole } from "../helper/roles";
import {
  changeCyclinderAction,
  deleteCylinders,
  typeForPartner,
} from "../actions/CyclinderActions";
import { fetchUsers } from "../actions/AuthActions";
import { COLOR } from "../constants";
import Images from "../constants/image";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import saver from "../utils/saver";
import {
  EXPORT,
  EXPORT_CYLINDER_EMPTY,
  EXPORT_PARTNER,
  DELIVER,
  INSPECTOR,
  FACTORY,
  SUPER_ADMIN,
  SALESMANAGER,
  TNL,
  DDTM,
  KT,
  PGD,
  DDT,
  KTVB,
  TONG_CONG_TY,
  TRAM,
  TRUONG_TRAM,
  KT_TRAM,
  TRUCK,
} from "../types";
import addLocalCyclinder from "./../api/addLocalCyclinder";
import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import CustomStatusBar from "../components/CustomStatusBar";
import { getLstWareHouses, setOrder } from "../actions/OrderActions";

/*const languageStatus = {}
export default languageStatus*/

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
const itemWith = width / 2;

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    height: 60,
    flexDirection: "row",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  itemName: {
    flex: 9,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    width: 250,
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  itemIcon: {
    flex: 1,
    //backgroundColor: 'blue',
    justifyContent: "center",
    alignItems: "center",
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      user: this.props.user,
      backClickCount: 0,
    };
    //Remove this method to stop OneSignal Debugging
    // one signal
  }

  // static getDerivedStateFromProps = (props, state) => {
  //   // const items = getUserType(this.props.roles)
  //   if (
  //     !isEqual(props.user, state.user)
  //   ) {
  //     return {
  //       items: getUserType(props.user.role)
  //     };
  //   }
  //   return null;
  // }
  componentDidMount = async () => {
    this.props.deleteCylinders();
    this.props.fetchUsers();
    //this.props.getLstWareHouses(this.props.user.isChildOf);

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
  navigateAction = (action, type, typeForPartner = "") => {
    this.props.changeCyclinderAction(action);
    saver.setDataCyclinder(action);
    saver.setTypeCyclinder(type);
    this.props.typeForPartner("");
    if (type === "STATION" && action === EXPORT) {
      Actions[EXPORT_CYLINDER_EMPTY]();
      return;
    }
    if (typeForPartner) {
      this.props.typeForPartner(typeForPartner);
      Actions[EXPORT_PARTNER]();
      return;
    }
    const isFactory = this.props.user.userType == "Factory";
    let addAction = action;
    let params = {};
    if (action == "statisticManager") {
      if (this.props.user.userType == "Fixer") {
        addAction = "statisticDetailManager";
        params = { ...this.props.user, namewh: this.props.user.name };
        return Actions["statisticManager"](params);
      } else if (this.props.user.userType == "Region") {
        addAction = "statisticDetailManager";
        params = {
          ...this.props.user,
          data: this.props.user,
          namewh: this.props.user.name,
        };
        return Actions["statisticManager"](params);
      } else if (
        this.props.user.userType == "Factory" &&
        this.props.user.userRole == "Owner"
      ) {
        addAction = "statisticDetailManager";
        params = {
          ...this.props.user,
          // userType: 'Fixer', userRole: 'SuperAdmin',
          data: { ...this.props.user },
        };
        return Actions["statisticManager"](params);
      } else if (
        this.props.user.userType == "Agency" ||
        this.props.user.userType == "General"
      ) {
        addAction = "statisticDetailManager";
        params = {
          ...this.props.user,
          namewh: this.props.user.name,
          userType: "Region",
          userRole: "SuperAdmin",
          data: { ...this.props.user },
        };
        return Actions[addAction](params);
      }
    }

    if (action == "statisticManagerVer2") {
      if (this.props.user.userType == "Fixer") {
        addAction = "statisticDetailManagerVer2";
        params = { ...this.props.user, namewh: this.props.user.name };
        return Actions["statisticManagerVer2"](params);
      } else if (this.props.user.userType == "Region") {
        addAction = "statisticDetailManagerVer2";
        params = {
          ...this.props.user,
          data: this.props.user,
          namewh: this.props.user.name,
        };
        return Actions["statisticManagerVer2"](params);
      } else if (
        this.props.user.userType == "Factory" &&
        this.props.user.userRole == "Owner"
      ) {
        addAction = "statisticDetailManagerVer2";
        params = {
          ...this.props.user,
          // userType: 'Fixer', userRole: 'SuperAdmin',
          data: { ...this.props.user },
        };
        return Actions["statisticManagerVer2"](params);
      } else if (
        this.props.user.userType == "Agency" ||
        this.props.user.userType == "General"
      ) {
        addAction = "statisticDetailManagerVer2";
        params = {
          ...this.props.user,
          namewh: this.props.user.name,
          userType: "Region",
          userRole: "SuperAdmin",
          data: { ...this.props.user },
        };
        return Actions[addAction](params);
      }
    }
    if (action == "statisticManagerVer3") {
      if (this.props.user.userType == "Fixer") {
        addAction = "statisticDetailManagerVer3";
        params = { ...this.props.user, namewh: this.props.user.name };
        return Actions["statisticManagerVer3"](params);
      } else if (this.props.user.userType == "Region") {
        addAction = "statisticDetailManagerVer3";
        params = {
          ...this.props.user,
          data: this.props.user,
          namewh: this.props.user.name,
        };
        return Actions["statisticManagerVer3"](params);
      } else if (
        this.props.user.userType == "Factory" &&
        this.props.user.userRole == "Owner"
      ) {
        addAction = "statisticDetailManagerVer3";
        params = {
          ...this.props.user,
          // userType: 'Fixer', userRole: 'SuperAdmin',
          data: { ...this.props.user },
        };
        return Actions["statisticManagerVer3"](params);
      } else if (
        this.props.user.userType == "Agency" ||
        this.props.user.userType == "General"
      ) {
        addAction = "statisticDetailManagerVer3";
        params = {
          ...this.props.user,
          namewh: this.props.user.name,
          userType: "Region",
          userRole: "SuperAdmin",
          data: { ...this.props.user },
        };
        return Actions[addAction](params);
      }
    }

    if (action == "StatisticManagerWarehouse") {
      if (this.props.user.userType == "Fixer") {
        addAction = "StatisticManagerWarehouse";
        params = { ...this.props.user, namewh: this.props.user.name };
        return Actions["StatisticManagerWarehouse"](params);
      } else if (this.props.user.userType == "Region") {
        addAction = "StatisticManagerWarehouse";
        params = {
          ...this.props.user,
          data: this.props.user,
          namewh: this.props.user.name,
        };
        return Actions["StatisticManagerWarehouse"](params);
      } else if (
        this.props.user.userType == "Factory" &&
        this.props.user.userRole == "Owner"
      ) {
        addAction = "StatisticManagerWarehouse";
        params = {
          ...this.props.user,
          // userType: 'Fixer', userRole: 'SuperAdmin',
          data: { ...this.props.user },
        };
        return Actions["StatisticManagerWarehouse"](params);
      } else if (
        this.props.user.userType == "Agency" ||
        this.props.user.userType == "General"
      ) {
        addAction = "StatisticManagerWarehouse";
        params = {
          ...this.props.user,
          namewh: this.props.user.name,
          userType: "Region",
          userRole: "SuperAdmin",
          data: { ...this.props.user },
        };
        return Actions[addAction](params);
      }
    }
    return Actions[addAction](params);
  };

  componentWillMount() {
    // addLocalCyclinder.removeItem();
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );
  }

  componentWillUnmount = async () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButton.bind(this)
    );

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

  _spring() {
    this.setState({ backClickCount: 1 });
  }

  handleBackButton = () => {
    this.state.backClickCount === 1 ? BackHandler.exitApp() : this._spring();
    return true;
  };

  handleBackButton = () => {
    this.state.backClickCount === 1 ? BackHandler.exitApp() : this._spring();
    return true;
  };

  functionClickButton(item) {
    if (
      !item.hasOwnProperty("type") &&
      !item.hasOwnProperty("typeForPartner")
    ) {
      this.navigateAction(item.action, "", "");
    } else if (
      item.hasOwnProperty("type") &&
      !item.hasOwnProperty("typeForPartner")
    ) {
      this.navigateAction(item.action, item.type, "");
    } else if (
      !item.hasOwnProperty("type") &&
      item.hasOwnProperty("typeForPartner")
    ) {
      this.navigateAction(item.action, "", item.typeForPartner);
    } else {
      this.navigateAction(item.action, item.type, item.typeForPartner);
    }
  }

  handleRole() {
    if (
      this.props.user.userType === FACTORY &&
      this.props.user.userRole === SUPER_ADMIN
    ) {
      console.log("userTye: FACTORY - userRole: SUPER_ADMIN");
      return getUserRole(SUPER_ADMIN);
    } else if (this.props.user.userRole === DELIVER) {
      // let role = this.props.user.userRole
      console.log("driver_role");
      return getUserRole(DELIVER);
    } else if (this.props.user.userRole === INSPECTOR) {
      console.log("inspector_role");
      return getUserRole(INSPECTOR);
    } else if (
      (this.props.user.userType === TONG_CONG_TY &&
        this.props.user.userRole === TNL) ||
      (this.props.user.userType === TONG_CONG_TY &&
        this.props.user.userRole === DDTM)
    ) {
      //TNL_DDTM
      return getUserRole(TNL);
    } else if (this.props.user.userRole === TRUCK) {
      console.log("Truck_role");
      return getUserRole(TRUCK);
    } else if (
      (this.props.user.userType === TONG_CONG_TY &&
        this.props.user.userRole === KT) ||
      (this.props.user.userType === TONG_CONG_TY &&
        this.props.user.userRole === KTVB) ||
      (this.props.user.userType === TONG_CONG_TY &&
        this.props.user.userRole === PGD) ||
      (this.props.user.userType === TRAM && this.props.user.userRole === DDT)
    ) {
      //đại diên thươn mại, tổ nhận lệnh, kế toán, phó giám đốc, điều độ trạm
      console.log("DDTM_TNL_KT_role");
      return getUserRole(KT);
    } else if (
      this.props.user.userType === TONG_CONG_TY &&
      this.props.user.userRole === SALESMANAGER
    ) {
      //trưởng phòng kinh doanh
      console.log("SalesManager_role");
      return getUserRole(SALESMANAGER);
    } else if (
      this.props.user.userType === TRAM &&
      this.props.user.userRole === TRUONG_TRAM
    ) {
      //trưởng trạm
      console.log("SalesManager_role");
      return getUserRole(TRUONG_TRAM);
    } else if (
      this.props.user.userType === TRAM &&
      this.props.user.userRole === KT_TRAM
    ) {
      //kế toán trạm
      console.log("SalesManager_role");
      return getUserRole(KT_TRAM);
    } else {
      return getUserType(this.props.user.userType);
    }
  }

  renderItem(item) {
    return (
      <TouchableOpacity onPress={() => this.functionClickButton(item.item)}>
        <View
          style={[styles.itemContainer, { backgroundColor: item.item.code }]}
        >
          <Text style={styles.itemName}>{translate(item.item.name)}</Text>
          <View style={styles.itemIcon}>
            <Icons name={item.item.iconName} size={30} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    // Taken from https://flatuicolors.com/
    // const items = [
    //   { name: 'Kiểm tra thông tin', code: '#1abc9c', action: Actions.scan },
    //   { name: 'Xem báo cáo thống kê', code: '#16a085' },
    //   { name: 'Gửi thông báo', code: '#3498db' },
    //   { name: 'Xem phản hồi từ người tiêu dùng', code: '#9b59b6' },
    // ];

    // const items = this.state.items
    if (!this.props.user) {
      return null;
    }
    if (this.props.user.userRole) {
      console.log("home_userRole", this.props.user.userRole);
    }
    return (
      <ScrollView>
        <View>
          <CustomStatusBar backgroundColor="#009347" barStyle="light-content" />
          <Image style={{ width: width, height: 150 }} source={Images.BANNER} />
        </View>
        <GridView
          itemDimension={itemWith}
          data={this.handleRole()}
          style={styles.gridView}
          renderItem={(item) => {
            if (
              (this.props.user.userType == "General" ||
                this.props.user.userType == "Agency") &&
              item.name == "CREATE_ORDER"
            ) {
              return this.renderItem(item);
            } else return item.name != "CREATE_ORDER" && this.renderItem(item);
          }}
        />
      </ScrollView>
    );
  }
}

export const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  listWarehouse: state.order.result_getWareHouse,
});

export default connect(mapStateToProps, {
  changeCyclinderAction,
  deleteCylinders,
  fetchUsers,
  typeForPartner,
  getLstWareHouses,
})(Home);
