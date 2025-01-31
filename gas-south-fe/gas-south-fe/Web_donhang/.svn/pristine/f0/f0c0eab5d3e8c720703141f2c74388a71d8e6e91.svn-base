import React from "react";
import { getCookie } from "redux-cookie";
import { connect } from "react-redux";
import { Link } from "react-router";
import PopupLogOut from "app/js/components/pages/dashBoard/PopupLogOut.js";
import Constant from "Constants";
import { Icon } from "antd";
import {
  urlChangePass,
  urlChangInformationUser,
} from "./../../config/config-reactjs";
import { GETAVATARUSER, URLSERVERIMAGE } from "./../../config/config";
//import getUserCookies from './../../helpers/getUserCookies';
import callApi from "./../../util/apiCaller";
import history from "history";
import "./main2.scss";
import getUserCookies from "getUserCookies";
import iconMenu from "../../../icon/menu.svg";
class Main2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: "",
      userType: "",
      user: { data: { avatar_url: "" }, initLoad: false },
      isMenuIndex: this.detectMenu(),
      title_notification: "",
      time_notification: "",
      description_notification: "",
      isShowMenu: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      avatar: "",
      isShowAgencyGeneral: false,
      isShowDatamanagement: false,
      isShowDriver: false,
      isShowGoogleMap: false,
      isShowThanhtra: false,
      isShowCalender: false,
      isShowUpdateOrder: false,
      isShowUserType: false,
      isShowUser: false,
      isShowOrder: false,
      isShowCreateOrder: false,
      isShowListOrder: false,
      isShowSeeOrder: false,
      isShowShipping: false,
      isShowTurnbackOrder: false,
      isShowControll: false,
      isShowbaocao: false,
      toggle6: false,
      toggle22: false,
      toggle31: false,
      toggle43: false,
      isShowGasCarrier: false,
      isShowInventory: false,
      isShowSetting: false,
      isShowPriceListSetting: false,
      isManagementMenu: false,
      isShowOrderTurnbackTankTruck: false,
      isShowListOrderTankTruck: false,
      isShowCreateOrderTankTruck: false,
      isShowreportExport: false,
      isShowCar: false,
      isStatistical: false,
      isStatisticalBranch: false,
      isStatisticalBranch1: false,
      isHistoryImport: false,
      isShowPage: false,
      isShowDestination: false
    };
  }

  active(index) {
    this.setState({ isMenuIndex: index, currentMenu: index });
    if (index == 6) {
      this.setState({ toggle6: !this.state.toggle6 });
    } else {
      this.setState({ toggle6: false });
    }
    if (index == 22) {
      this.setState({ toggle22: !this.state.toggle22 });
    } else {
      this.setState({ toggle22: false });
    }
    if (index == 31) {
      this.setState({ toggle31: !this.state.toggle31 });
    } else {
      this.setState({ toggle31: false });
    }
    if (index == 43) {
      this.setState({ toggle43: !this.state.toggle43 });
    } else {
      this.setState({ toggle43: false });
    }
  }

  detectMenu() {
    const menu = {
      "/dashboard": 7,
      // '/user': 6,
      "/factory": 1,
      "/general": 2,
      "/agency": 4,
      "/product": 3,
      "/manufacturer": 9,
      "/report": 5,
      // '/staff': 8,
      "/customer": 10,
      "/partner": 11,
      "/fixer": 12,
      "/factory-child": 13,
      "/googlemap": 14,
      "/driver": 15,
      "/thanh-tra": 16,
      "/createCalenderInspector": 17,
      "/createOrder": 18,
      "/updateOrder": 19,
      "/kinhdoanh": 8,
      "/user-type": 21,
      "/listUser": 20,
      "/Order": 22,
      "/seeOrder": 23,
      shipping: 24,
      listOrder: 25,
      turnbackOrder: 26,
      "/coordinator": 27,
      "/controll": 35,
      "/baocao": 30,
      "/create-product": 32,
      "/gasCarrier": 33,
      "/inventory": 34,
      "/setting": 36,
      "/price-list-setting": 37,
      "/management-menu": 38,
      "/orderTankTruck-list": 39,
      "/orderTankTruck-create": 40,
      "/orderTankTruck-returnList": 41,
      "/reportExport": 42,
      "/car": 45,
      "/export-order-management": 44,
      "/statistial": 46,
      "/import-order-management": 47,
      "/statistics-branch ": 50,
      "/statistics-branchSC ": 51,
      "/history-export": 52,
      "/industrial-customer": 55,
      "/list-page": 53,
      "/findDestination": 56,
    };
    let path = this.props.location.pathname;

    let index = menu[path] ? menu[path] : 3;

    return index;

    // console.log(index);
  }

  updateInfoNotification = (title, time, description) => {
    this.setState({
      title_notification: title,
      time_notification: time,
      description_notification: description,
    });
  };

  async componentDidMount() {
    await this.getUser();
    // console.log("ádas" , this.state.user.user.userRole);
    // console.log("ádas" , this.state.user.user.userType);
    // this.addScript("assets/js/core.min.js", "core");
    this.addScript("assets/js/app.js", "app");
    this.addScript("assets/js/script.js", "script");
    this.addScript("assets/js/index.js", "index");
    //console.log(this.state.user.user.name);
    let user_cookies = await getUserCookies();
    // console.log( "user_cookies11111", user_cookies);
    if (user_cookies) {
      this.setState({
        userRole: user_cookies.user.userRole,
        userType: user_cookies.user.userType,
      });
    }
  }

  addScript(src, myClass) {
    const newScript = document.createElement("script");
    newScript.setAttribute("class", myClass);
    newScript.setAttribute("src", src + "?n=" + Math.random().toString());
    newScript.setAttribute("type", "text/javascript");
    newScript.async = false;

    const getScript = document.querySelector("." + myClass);
    if (getScript !== null) {
      // getScript.parentNode.replaceChild(newScript, getScript);
      return;
    }

    document.getElementsByTagName("body")[0].appendChild(newScript);
  }

  async getUser() {
    const { dispatch } = this.props;
    const user = await dispatch(getCookie("user"));
    //console.log(user.user);
    if (typeof user !== "undefined") {
      this.setState({ user: JSON.parse(user) });
      //console.log(this.state.user.user.email)
      //console.log(this.state.user.token);
      let token = "Bearer " + this.state.user.token;
      let params = {
        email: this.state.user.user.email,
      };
      await callApi("POST", GETAVATARUSER, params, token).then((res) => {
        this.setState({
          avatar: res.data.data ? URLSERVERIMAGE + res.data.data : "",
        });
      });
      console.log(this.state.user.user.userType === Constant.FACTORY);
      console.log(
        "this.state.user.user.userRole",
        this.state.user.user.userRole
      );
      //tạm thời
      if (
        this.state.user.user.userType === "Manager" &&
        this.state.user.user.userRole === "SuperAdmin"
      ) {
        this.setState({
          isShowMenu: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          isShowInventory:false,
          isShowOrderTurnbackTankTruck:true,
          isShowOrder:true,
          isShowreportExport:true
        })
         return;
      }if (
        this.state.user.user.userType === "Accounting" &&
        this.state.user.user.userRole === "SuperAdmin"
      ) {
        this.setState({
          isShowMenu: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
          ],
          isShowInventory:false,
          isShowOrderTurnbackTankTruck:true,
          isShowOrder:true,
          isShowreportExport:true
        })
         return;
      }if (
        this.state.user.user.userType === "Sales" &&
        this.state.user.user.userRole === "SuperAdmin"
      ) {
        this.setState({
          isShowMenu: [
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          isShowInventory:true,
          isShowOrderTurnbackTankTruck:true,
          isShowOrder:true,
          isShowreportExport:true
        })
         return;
      }if (
        this.state.user.user.userType === "Station" &&
        this.state.user.user.userRole === "SuperAdmin"
      ) {
        this.setState({
          isShowMenu: [
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
          ],
          isShowOrder:true,
          isShowreportExport:true,
        })
        return;
      }
      if (
        this.state.user.user.userType === "Warehouse" &&
        this.state.user.user.userRole === "SuperAdmin"
      ) {
        this.setState({
          isShowCar: true,
          isShowInventory:true,
          isShowOrderTurnbackTankTruck:true,
          isShowOrder:true,
          isShowreportExport:true,
          isShowDriver:true,
          });
          // return;
      }if (
        this.state.user.user.userType === Constant.FACTORY &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector" &&
        this.state.user.user.userRole !== "SuperAdmin"
      ) {
        this.setState({
          isShowSeeOrder: true,
          isShowShipping: true,
        });
      }
      if (
        this.state.user.user.userType === Constant.SUPERADMIN ||
        this.state.user.user.userType === Constant.GOVERMENT
      ) {
        this.setState({
          isShowMenu: [
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          isShowDriver: true,
          isShowControll: true,
          isShowGoogleMap: true,
          isShowThanhtra: true,
          isShowCalender: true,
          isShowUpdateOrder: false,
          isShowAgencyGeneral: false,
          isShowUserType: true,
          isShowUser: false,
          isShowbaocao: true,
          isShowGasCarrier: true,
          isShowInventory: true,
          isShowSetting: true,
          isManagementMenu: true,
          isShowCreateOrderTankTruck: true,
          isShowListOrderTankTruck: true,
          isShowOrderTurnbackTankTruck: true,
          isShowreportExport: true,
          isShowPriceListSetting: true,
          isShowCar: true,
          isStatistical: true,
          isStatisticalBranch: true,
          isStatisticalBranch1: true,
          isHistoryImport: true,
          isShowPage: true,
          isShowDestination: true
        });
      } else if (
        this.state.user.user.userType === Constant.FACTORY &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector"
      ) {
        if (this.state.user.user.userRole === "SuperAdmin") {
          this.setState({
            isShowMenu: [
              false,
              false,
              false,
              true,
              false,
              false,
              true,
              true,
              true,
              true,
              false,
              false,
              true,
              true,
              true,
            ],
            isShowDriver: false,
            isShowControll: false,
            isShowGoogleMap: true,
            isShowThanhtra: false,
            isShowCalender: false,
            isShowSeeOrder:true,
            // isShowCreateOrder: true,
            isShowAgencyGeneral: false,
            isShowUserType: true,
            isShowUser: true,
            isShowOrder: false,
            isShowCreateOrder: true,
            isShowListOrder: false,
            isShowTurnbackOrder: true,
            isShowbaocao: true,
            isShowGasCarrier: false,
            isShowInventory: false,
            isShowSetting: false,
            isShowPriceListSetting: false,
            isManagementMenu: false,
            isShowCreateOrderTankTruck: true,
            isShowListOrderTankTruck: true,
            isShowOrderTurnbackTankTruck: false,
            isShowreportExport: true,
            isShowCar: false,
            isStatistical: true,
            isStatisticalBranch: false,
            isStatisticalBranch1: false,
            isHistoryImport: true,
            isShowPage: true,
            //isShowShipping: false,

          });
        } else {
          this.setState({
            isShowMenu: [
              false,
              false,
              false,
              false,
              true,
              true,
              true,
              true,
              true,
              false,
              false,
              false,
              false,
              false,
            ],
            isShowGasCarrier: false,
            isShowShipping:false,
            // isShowMenu: [true, false, false, true, true, true, true, true, false, false, false, false, true, false],
            isShowDriver: true,
            isShowControll: false,
            isShowGoogleMap: true,
            isShowThanhtra: false,
            isShowCalender: false,
            isShowCreateOrder: true,
            isShowListOrder:false,
            isShowUpdateOrder: false,
            isShowAgencyGeneral: false,
            isShowUserType: true,
            isShowUser: true,
            isShowbaocao: false,
            // isShowGasCarrier: true,
            isShowInventory: false,
            isShowSetting: false,
            isManagementMenu: false,
            isShowCreateOrderTankTruck: true,
            isShowListOrderTankTruck: true,
            isShowOrderTurnbackTankTruck: false,
            isShowCar: false,
            isShowPriceListSetting: false,
            isStatistical: true,
            isStatisticalBranch: false,
            isStatisticalBranch1: false,
            isHistoryImport: true,
            isShowPage: true,
            isShowOrder:true,
            isShowreportExport:false
          });
        }
      } else if (
        this.state.user.user.userType === Constant.STATION &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector"
      ) {
        this.setState({
          isShowMenu: [
            true,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            true,
            false,
          ],
          isShowDriver: true,
          isShowControll: true,
          isShowGoogleMap: true,
          isShowThanhtra: false,
          isShowCalender: true,
          isShowCreateOrder: false,
          isShowUpdateOrder: true,
          isShowAgencyGeneral: false,
          isShowUserType: true,
          isShowUser: true,
          isShowbaocao: true,
          isShowGasCarrier: true,
          isShowInventory: true,
          isShowSetting: true,
          isManagementMenu: true,
          isShowCreateOrderTankTruck: true,
          isShowListOrderTankTruck: true,
          isShowOrderTurnbackTankTruck: true,
          isShowreportExport: true,
          isShowCar: true,
          isShowPriceListSetting: true,
          isStatistical: true,
          isStatisticalBranch: true,
          isStatisticalBranch1: true,
          isHistoryImport: true,
          isShowPage: true,
        });
      } else if (
        this.state.user.user.userType === Constant.GENERAL &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector"
      ) {
        this.setState({
          isShowMenu: [
            true,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
          ],
          isShowDriver: true,
          isShowControll: false,
          isShowGoogleMap: false,
          isShowThanhtra: false,
          isShowCalender: false,
          isShowCreateOrder: false,
          isShowUpdateOrder: false,
          isShowAgencyGeneral: true,
          isShowUser: true,
          isShowbaocao: false,
          isShowGasCarrier: false,
          isShowInventory: false,
          isShowSetting: false,
          isManagementMenu: false,
          isShowCreateOrderTankTruck: true,
          isShowListOrderTankTruck: true,
          isShowOrderTurnbackTankTruck: false,
          isShowreportExport: true,
          isShowCar: false,
          isShowPriceListSetting: false,
          isStatistical: false,
          isStatisticalBranch: false,
          isStatisticalBranch1: false,
          isHistoryImport: true,
          isShowPage: true,
        });
      } else if (
        this.state.user.user.userType === Constant.FIXER &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector"
      ) {
        this.setState({
          isShowMenu: [
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
          ],
          isShowOrder:false,
          isShowListOrder:false,
          isShowDriver: true,
          isShowControll: false,
          isShowGoogleMap: false,
          isShowThanhtra: false,
          isShowCalender: false,
          isShowCreateOrder: false,
          isShowUpdateOrder: false,
          isShowAgencyGeneral: false,
          isShowUserType: true,
          isShowUser: true,
          isShowbaocao: false,
          isShowGasCarrier: false,
          isShowInventory: false,
          isShowSetting: false,
          isManagementMenu: false,
          isShowCreateOrderTankTruck: true,
          isShowListOrderTankTruck: true,
          isShowOrderTurnbackTankTruck: false,
          isShowreportExport: false,
          isShowCar: false,
          isShowPriceListSetting: false,
          isStatistical: false,
          isStatisticalBranch: true,
          isStatisticalBranch1: true,
          isHistoryImport: true,
          isShowPage: true,
          isShowSeeOrder:true
        });
      } else if (
        this.state.user.user.userType === Constant.AGENCY &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector"
      ) {
        if (this.state.user.user.parentRoot === "")
          this.setState({
            isShowMenu: [
              false,
              false,
              false,
              false,
              false,
              false,
              true,
              false,
              true,
              true,
              true,
            ],
            isShowDriver: true,
            isShowControll: true,
            isShowGoogleMap: false,
            isShowThanhtra: false,
            isShowCalender: false,
            isShowCreateOrder: false,
            isShowUpdateOrder: false,
            isShowDatamanagement: false,
            isShowAgencyGeneral: false,
            isShowUserType: true,
            isShowUser: true,
            isShowbaocao: true,
            isShowGasCarrier: true,
            isShowInventory: true,
            isShowSetting: true,
            isManagementMenu: true,
            isShowCreateOrderTankTruck: true,
            isShowListOrderTankTruck: true,
            isShowOrderTurnbackTankTruck: true,
            isShowreportExport: true,
            isShowCar: true,
            isShowPriceListSetting: true,
            isStatistical: true,
            isStatisticalBranch: true,
            isStatisticalBranch1: true,
            isHistoryImport: true,
            isShowPage: true,
          });
        else
          this.setState({
            isShowMenu: [
              true,
              false,
              false,
              false,
              false,
              false,
              true,
              false,
              false,
              false,
              false,
            ],
            isShowDriver: false,
            isShowControll: false,
            isShowGoogleMap: false,
            isShowThanhtra: false,
            isShowCalender: false,
            isShowCreateOrder: false,
            isShowUpdateOrder: false,
            isShowDatamanagement: false,
            isShowAgencyGeneral: false,
            isShowUserType: false,
            isShowUser: false,
            isShowbaocao: false,
            isShowGasCarrier: false,
            isShowInventory: false,
            isShowSetting: false,
            isManagementMenu: false,
            isShowCreateOrderTankTruck: false,
            isShowListOrderTankTruck: false,
            isShowOrderTurnbackTankTruck: false,
            isShowreportExport: true,
            isShowCar: false,
            isShowPriceListSetting: false,
            isStatistical: false,
            isStatisticalBranch: false,
            isStatisticalBranch1: false,
            isHistoryImport: true,
            isShowPage: true,
          });
      } else if (
        this.state.user.user.userType === Constant.NORMAL &&
        this.state.user.user.userRole !== "Deliver" &&
        this.state.user.user.userRole !== "Inspector"
      ) {
        this.setState({
          isShowMenu: [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
          ],
          isShowDriver: true,
          isShowControll: true,
          isShowGoogleMap: true,
          isShowThanhtra: false,
          isShowCalender: false,
          isShowCreateOrder: false,
          isShowUpdateOrder: true,
          isShowAgencyGeneral: false,
          isShowUserType: true,
          isShowUser: true,
          isShowbaocao: true,
          isShowGasCarrier: true,
          isShowInventory: true,
          isShowSetting: true,
          isManagementMenu: true,
          isShowCreateOrderTankTruck: true,
          isShowListOrderTankTruck: true,
          isShowOrderTurnbackTankTruck: true,
          isShowreportExport: true,
          isShowCar: true,
          isShowPriceListSetting: true,
          isStatistical: true,
          isStatisticalBranch: true,
          isStatisticalBranch1: true,
          isHistoryImport: true,
          isShowPage: true,
        });
      } else if (
        this.state.user.user.userRole === "Deliver" ||
        this.state.user.user.userRole === "Inspector"
      ) {
        this.setState({
          isShowMenu: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          isShowDriver: false,
          isShowControll: false,
          isShowGoogleMap: false,
          isShowThanhtra: false,
          isShowCalender: false,
          isShowCreateOrder: false,
          isShowUpdateOrder: false,
          isShowAgencyGeneral: false,
          isShowUserType: false,
          isShowUser: false,
          isShowbaocao: false,
          isShowGasCarrier: false,
          isShowInventory: false,
          isShowSetting: true,
          isManagementMenu: true,
          isShowCreateOrderTankTruck: false,
          isShowListOrderTankTruck: false,
          isShowOrderTurnbackTankTruck: false,
          isShowreportExport: true,
          isStatistical: true,
          isShowCar: false,
          isShowPriceListSetting: false,
          isStatisticalBranch: true,
          isStatisticalBranch1: true,
          isHistoryImport: true,
          isShowPage: false,
        });
      } else if (
        this.state.user.user.userType === "Region" &&
        this.state.user.user.userRole === "SuperAdmin"
      ) {
        this.setState({
          isShowMenu: [
            false,
            false,
            false,
            true,
            false,
            false,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            true,
            false,
          ],
          isShowDriver: true,
          isShowControll: false,
          isShowGoogleMap: true,
          isShowThanhtra: false,
          isShowCalender: false,
          isShowCreateOrder: true,
          isShowOrder: true,
          isShowAgencyGeneral: false,
          isShowUserType: true,
          isShowUser: true,
          isShowSeeOrder: true,
          isShowShipping: false,
          isShowbaocao: false,
          isShowPriceListSetting: false,
          isShowGasCarrier: false,
          isShowInventory: false,
          isShowSetting: false,
          isManagementMenu: false,
          isShowCreateOrderTankTruck: true,
          isShowListOrderTankTruck: true,
          isShowOrderTurnbackTankTruck: false,
          isShowreportExport: false,
          isShowCar: true,
          isStatistical: true,
          isStatisticalBranch: false,
          isStatisticalBranch1: false,
          isHistoryImport: true,
          isShowPage: true,
          isShowListOrder: false
        });
      }
    }
  }

  setNotificationLoad() {
    var currentState = false;
    this.setState({ initLoad: !currentState });
  }

  Notes = ({ history, location, notes }) => {
    let redirectedFlashMessage = {};
    const { pathname, search, state } = location;

    if (state && state.flashMessage) {
      redirectedFlashMessage = state.flashMessage;

      // copy state cũ
      const clonedState = { ...state };
      // xóa flashMessage từ state được copy
      delete clonedState.flashMessage;
      // thay thế location hiện tại bằng location mới
      // với pathname, search từ location hiện tại
      // và state đã xóa flashMessage
      history.replace({ pathname, search, state: clonedState });
    }
  };

  reloadPage() {
    window.location.reload();
  }
  handleOpen(){
    $('body').addClass('sidebar-open').prepend('<div class="app-backdrop backdrop-sidebar"></div>');
  }
  render() {
    console.log("ádas", this.state.userRole);

    // console.log("a1111" , this.state.userType);
    console.log("Phan quyen", this.state.user.user);
    const currentMenu = this.state.currentMenu;
    const toggleOn6 = this.state.toggle6;
    const toggleOn22 = this.state.toggle22;
    const toggleOn31 = this.state.toggle31;
    const toggleOn43 = this.state.toggle43;
    return (
      <div>
        <aside
          className="sidebar sidebar-icons-right sidebar-icons-boxed sidebar-expand-lg"
          style={{ backgroundColor: "#009347" }}
        >
          <header className="sidebar-header">
            <a className="logo-icon" /*href="../index.html"*/>
              <img
                src="assets/img/gas-south-logo.png"
                alt="logo icon"
                onClick={() => this.reloadPage()}
              />
            </a>
          </header>

          <nav className="sidebar-navigation" style={{ overflow: "auto" }}>
            <ul className="menu">
              {!(this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")&&
                <li
                data-toggle="collapse"
                data-target="#products"
                className="collapsed menu-item"
                style={!this.state.isShowMenu[8] ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 6
                    ? "menu-item active1"
                    : "menu-item"
                }
              >
                <Link className="menu-link" onClick={() => this.active(6)}>
                  <i className="fa fa-suitcase" aria-hidden="true"></i>
                  <span className="kinhdoanh">Quản trị dữ liệu</span>
                  <i
                    className={
                      currentMenu == 6 && toggleOn6 == true
                        ? "fa fa-minus"
                        : "fa fa-plus"
                    }
                  ></i>
                </Link>
              </li>
              
              }
              


              <div
                className={
                  currentMenu == 6
                    ? "sub-menu collapse show"
                    : "sub-menu collapse"
                }
                id="products"
              >
                <li
                  style={!this.state.isShowMenu[9] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 9
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 9 })}
                    to="/manufacturer"
                    className="menu-link "
                  >
                    <i className="fa fa-diamond" aria-hidden="true"></i>
                    <span className="title">{Constant.MANUFACTURER_TITLE}</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[13] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 13
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 13 })}
                    to="/factory-child"
                    className="menu-link"
                  >
                    <i className="fa fa-building" aria-hidden="true"></i>
                    <span className="title">Trạm</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[11] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 11
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(11)}
                    to="/partner"
                    className="menu-link"
                  >
                    <i className="fa fa-handshake-o" aria-hidden="true"></i>
                    <span className="title">{Constant.PARTNER}</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[12] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 12
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 12 })}
                    to="/fixer"
                    className="menu-link"
                  >
                    <i className="fa fa-cogs" aria-hidden="true"></i>
                    {/* <span className="title">{Constant.FIX_TITLE}</span> */}
                    <span className="title">Nhà Máy Sản Xuất, Sửa Chữa</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[2] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 1
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 1 })}
                    to="/factory"
                    className="menu-link"
                  >
                    <i className="fa fa-user-plus" aria-hidden="true"></i>
                    <span className="title">{Constant.FACTORY_TITLE}</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[14] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 2
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 2 })}
                    to="/stations"
                    className="menu-link"
                  >
                    <i className="fa fa-users" aria-hidden="true"></i>
                    <span className="title">Chi nhánh trực thuộc</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[4] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 55
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 55 })}
                    to="/industrial-customer"
                    className="menu-link"
                  >
                    <i className="fa fa-industry" aria-hidden="true"></i>
                    <span className="title">Khách Hàng Công Nghiệp</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[4] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 2
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 2 })}
                    to="/general"
                    className="menu-link"
                  >
                    <i className="fa fa-users" aria-hidden="true"></i>
                    <span className="title">Hệ Thống Phân Phối</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowMenu[5] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 4
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(4)}
                    to="/agency"
                    className="menu-link "
                  >
                    <i className="fa fa-cart-plus" aria-hidden="true"></i>
                    <span className="title">{Constant.AGENCY_TITLE}</span>
                  </Link>
                </li>
              </div>
              <li
                style={!this.state.isStatistical ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 46
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(46)}
                  to="/statistial"
                  className="menu-link"
                >
                  <i className="fa fa-bar-chart" aria-hidden="true"></i>
                  <span className="title">Báo cáo thống kê</span>
                </Link>
              </li>
              <li
                style={
                  !this.state.isShowAgencyGeneral ? { display: "none" } : {}
                }
                className={
                  this.state.isMenuIndex === 4
                    ? "menu-item active1"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(4)}
                  to="/agency"
                  className="menu-link "
                >
                  <i className="fa fa-cart-plus" aria-hidden="true"></i>
                  <span className="title">Cửa hàng bán lẻ</span>
                </Link>
              </li>

              {/*<li style={!this.state.isShowMenu[3] ? {display: "none"} : {}}*/}
              {/*    className={this.state.isMenuIndex === 7 ? "menu-item active" : "menu-item"}>*/}
              {/*    <Link onClick={() => this.setState({isMenuIndex: 7})} to="/station"*/}
              {/*          className="menu-link">*/}

              {/*        <span className="title">{Constant.STATION_TITLE}</span>*/}

              {/*    </Link>*/}
              {/*</li>*/}

              {!((this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")
              ||((this.state.userType==="Station" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Sales" && this.state.userRole==="SuperAdmin"))
              
              )&& (

                  <li
                  style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 3
                      ? "menu-item active"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(3)}
                    to="/product"
                    className="menu-link "
                  >
                    <i className="fa fa-free-code-camp" aria-hidden="true"></i>
                    {this.state.userRole=== "SuperAdmin" && this.state.userType=== "Fixer" && 
                    (
                      <span className="title">Quản trị Dữ Liệu Vỏ</span> 
                    )}
                    {!(this.state.userRole=== "SuperAdmin" && this.state.userType=== "Fixer") && 
                    (
                      <span className="title">{Constant.PRODUCT_TITLE}</span> 
                    )}
                  </Link>
                </li>
              )}
                

                {!((this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")
              ||((this.state.userType==="Station" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Sales" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Region" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="General" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Agency" && this.state.userRole==="SuperAdmin"))
              )&& (
              <li
                  style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 44
                      ? "menu-item active"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(44)}
                    to="/duplicatecylinder"
                    className="menu-link "
                  >
                    <i className="fa fa-columns" aria-hidden="true"></i>
                    <span className="title">Quản lý vỏ trùng</span>
                  </Link>
                </li>
                )}
              {this.state.userRole === "SuperAdmin" &&
                this.state.userType === "Fixer" ? (
                  <li
                    style={
                      !this.state.isStatisticalBranch ? { display: "none" } : {}
                    }
                    className={
                      this.state.isMenuIndex === 50
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      onClick={() => this.active(50)}
                      to="/statistial-branch"
                      className="menu-link"
                    >
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      <span className="title">Báo cáo thống kê bình mới</span>
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                {(this.state.userRole === "SuperAdmin" &&
                this.state.userType === "Fixer") ? (
                  <li
                    style={
                      !this.state.isStatisticalBranch1 ? { display: "none" } : {}
                    }
                    className={
                      this.state.isMenuIndex === 51
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      onClick={() => this.active(51)}
                      to="/statistial-branchSC"
                      className="menu-link"
                    >
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      <span className="title">Báo cáo thống kê bình SC</span>
                    </Link>
                  </li>
                ) : (
                  ""
                )} 
              {!((this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")
              ||((this.state.userType==="Station" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Sales" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Factory" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Factory" && this.state.userRole==="Owner"))
              ||((this.state.userType==="Region" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Fixer" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="General" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType==="Agency" && this.state.userRole==="SuperAdmin")))&& (                
              <li
                style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 32
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active({ isMenuIndex: 32 })}
                  to="/create-product"
                  className="menu-link "
                >
                  <i className="fa fa-fire-extinguisher" aria-hidden="true"></i>
                  <span className="title">Khai Báo Bình LPG - GAS</span>
                </Link>
              </li>
              )}

              {!(this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")&& (
                  <li
                  style={!this.state.isShowMenu[0] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 7
                      ? "menu-item active"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(7)}
                    to="/dashboard"
                    className="menu-link"
                  >
                    <i className="fa fa-bar-chart" aria-hidden="true"></i>
                    <span className="title">{Constant.DASHBOARD_TITLE}</span>
                  </Link>
                </li>
  
              )}
              <li
                style={!this.state.isShowGoogleMap ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 14
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(14)}
                  to="/googlemap"
                  className="menu-link"
                >
                  <Icon type="global" className="fa" />
                  <span className="title">Bản đồ phân phối</span>
                </Link>
              </li>

              <li
                data-toggle="collapse"
                data-target="#order"
                className="collapsed menu-item"
                style={!this.state.isShowOrder ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 22
                    ? "menu-item active1"
                    : "menu-item"
                }
              >
                <Link className="menu-link" onClick={() => this.active(22)}>
                  <i className="fa fa-suitcase" aria-hidden="true"></i>
                  <span className="order">
                    {(this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")
                    ||((this.state.userType==="Station" && this.state.userRole==="SuperAdmin"))
                    ||(this.state.userType==="Sales" && this.state.userRole==="SuperAdmin")
                    ||(this.state.userType==="Manager" && this.state.userRole==="SuperAdmin")
                    ||(this.state.userType==="Accounting" && this.state.userRole==="SuperAdmin")?"Báo cáo":"Đơn Hàng"}</span>
                  <i
                    className={
                      currentMenu == 22 && toggleOn22 == true
                        ? "fa fa-minus"
                        : "fa fa-plus"
                    }
                  ></i>
                </Link>
              </li>

              <div
                className={
                  currentMenu == 22
                    ? "sub-menu collapse show"
                    : "sub-menu collapse"
                }
                id="order"
              >
                <li
                  style={
                    !this.state.isShowCreateOrder ? { display: "none" } : {}
                  }
                  className={
                    this.state.isMenuIndex === "18"
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: "18" })}
                    to="/createOrder"
                    className="menu-link "
                    style={{ backgroundColor: "white" }}
                  >
                    <i className="fa fa-diamond" aria-hidden="true"></i>
                    <span className="title">Tạo đơn hàng</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowSeeOrder ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === "25"
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: "25" })}
                    to="/seeOrder"
                    className="menu-link"
                    style={{ backgroundColor: "white" }}
                  >
                    <i className="fa fa-building" aria-hidden="true"></i>
                    <span className="title">Xem đơn hàng</span>
                  </Link>
                </li>
                {/* <li
                  style={!this.state.isShowSeeOrder ? { display: "none" } : {}}
                  className={
                  this.state.isMenuIndex === "23"
                    ? "menu-item active"
                    : "menu-item"
                  }
                >
                <Link
                  onClick={() => this.active(23)}
                  to="/seeOrder"
                  className="menu-link"
                >
                  <Icon type="shopping" className="fa" />
                  <span className="title">{this.state.userRole==="SuperAdmin" && this.state.userType==="Factory" ?"Xem đơn vỏ":"Xem đơn hàng"}</span>
                </Link>
              </li> */}

                <li
                  style={
                    !this.state.isShowTurnbackOrder ? { display: "none" } : {}
                  }
                  className={
                    this.state.isMenuIndex === "26"
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: "26" })}
                    to="/turnbackOrder"
                    className="menu-link"
                    style={{ backgroundColor: "white" }}
                  >
                    <i className="fa fa-cogs" aria-hidden="true"></i>
                    {/* <span className="title">{Constant.FIX_TITLE}</span> */}
                    <span className="title">Danh sách hồi lưu</span>
                  </Link>
                </li>

                <li
                  style={
                    !this.state.isShowreportExport ? { display: "none" } : {}
                  }
                  className={
                    this.state.isMenuIndex === "42"
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: "42" })}
                    to="/reportExport"
                    className="menu-link"
                    style={{ backgroundColor: "white" }}
                  >
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                    <span className="title">Báo cáo xuất/nhập/tồn</span>
                  </Link>
                </li>
              </div>

              {/* <li style={!this.state.isShowCreateOrder ? { display: "none" } : {}}
                                className={this.state.isMenuIndex === 18 ? "menu-item active" : "menu-item"} >
                                <Link onClick={() => this.setState({ isMenuIndex: 18 })} to="/createOrder"
                                    className="menu-link" >

                                     <Icon type="thanh-tra" /> 
                                    <Icon type="shopping-cart" className="fa" />
                                    <span style={{ fontFamily: 'roboto', textTransform: 'capitalize' }}>Tạo đơn hàng </span>
                                </Link>

                            </li> */}

              <li
                style={!this.state.isShowCalender ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 17
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(17)}
                  to="/createCalenderInspector"
                  className="menu-link"
                >
                  {/* <Icon type="thanh-tra" /> */}
                  <Icon type="calendar" className="fa" />
                  <span
                    style={{
                      fontFamily: "roboto",
                      textTransform: "capitalize",
                    }}
                  >
                    Tạo lịch bảo trì{" "}
                  </span>
                </Link>
              </li>
              <li
                style={!this.state.isShowDestination ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 56
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(56)}
                  to="/findDestination"
                  className="menu-link"
                >
                  {/* <Icon type="thanh-tra" /> */}
                  <Icon type="calendar" className="fa" />
                  <span
                    style={{
                      fontFamily: "roboto",
                      textTransform: "capitalize",
                    }}
                  >
                    Tìm điểm đến
                  </span>
                </Link>
              </li>
              <li
                style={!this.state.isShowThanhtra ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 16
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(16)}
                  to="/thanh-tra"
                  className="menu-link"
                >
                  {/* <Icon type="thanh-tra" /> */}
                  <i className="fa fa-bug"></i>
                  <span
                    style={{
                      fontFamily: "roboto",
                      textTransform: "capitalize",
                    }}
                  >
                    {" "}
                    Người kiểm tra, bảo trì{" "}
                  </span>
                </Link>
              </li>

              {!(
               (this.state.userType==="Manager" && this.state.userRole==="SuperAdmin")
              || (this.state.userType==="Sales" && this.state.userRole==="SuperAdmin")
              || (this.state.userType==="Accounting" && this.state.userRole==="SuperAdmin")
              || (this.state.userType==="Station" && this.state.userRole==="SuperAdmin")
              || (this.state.userType==="Factory" && this.state.userRole==="Owner")
              || (this.state.userType==="Factory" && this.state.userRole==="SuperAdmin")
              || (this.state.userType==="Region" && this.state.userRole==="SuperAdmin")
              ||((this.state.userType==="Fixer" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType=== "General" && this.state.userRole==="SuperAdmin"))
              ||((this.state.userType=== "Agency" && this.state.userRole==="SuperAdmin")))&&(
                <li
                className={
                  this.state.isMenuIndex === 27
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(27)}
                  to="/coordinator"
                  className="menu-link"
                >
                  <Icon type="sync" className="fa" />
                  <span className="title">{Constant.COORDINATOR_TITLE}</span>
                </Link>
              </li>
              )}

              {((this.state.userRole==="SuperAdmin" && this.state.userType==="Factory") 
              || (this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer")) && (
                  <li
                  style={!this.state.isShowSeeOrder ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === "23"
                      ? "menu-item active"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(23)}
                    to="/seeOrder"
                    className="menu-link"
                  >
                    <Icon type="shopping" className="fa" />
                    <span className="title">{((this.state.userRole==="SuperAdmin" && this.state.userType==="Factory") 
                    || (this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer")) ?"Xem đơn vỏ":"Xem đơn hàng"}</span>
                  </Link>
                </li>
              )}
              <li
                style={!this.state.isShowShipping ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === "24"
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(24)}
                  to="/shipping"
                  className="menu-link"
                >
                  <Icon type="snippets" className="fa" />
                  <span className="title">Quản lý vận chuyển</span>
                </Link>
              </li>
              <li
                style={!this.state.isShowDriver ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 15
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(15)}
                  to="/driver"
                  className="menu-link"
                >
                  <Icon type="car" className="fa" />
                  <span className="title">Tài xế</span>
                </Link>
              </li>
              <li
                style={!this.state.isShowGasCarrier ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 33
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(33)}
                  to="/gasCarrier"
                  className="menu-link"
                >
                  <i className="fa fa-motorcycle" aria-hidden="true"></i>
                  <span className="title">Tài xế giao gas</span>
                </Link>
              </li>
              <li
                data-toggle="collapse"
                data-target="#control"
                className="collapsed menu-item"
                style={!this.state.isShowControll ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 31
                    ? "menu-item active1"
                    : "menu-item"
                }
              >
                <Link onClick={() => this.active(31)} className="menu-link">
                  <Icon type="fork" className="fa" />
                  <span>Phân Quyền</span>
                  <i
                    className={
                      currentMenu == 31 && toggleOn31 == true
                        ? "fa fa-minus"
                        : "fa fa-plus"
                    }
                  ></i>
                </Link>
              </li>

              <div
                className={
                  currentMenu == 31
                    ? "sub-menu collapse show"
                    : "sub-menu collapse"
                }
                id="control"
              >
                <li
                  style={!this.state.isShowUserType ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 35
                      ? "menu-item active"
                      : "menu-item"
                  }
                  style={{ backgroundColor: "white" }}
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 35 })}
                    to="/controll"
                    className="menu-link"
                  >
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <span className="title">Phân Quyền</span>
                  </Link>
                </li>

                <li
                  style={!this.state.isShowUserType ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 21
                      ? "menu-item active"
                      : "menu-item"
                  }
                  style={{ backgroundColor: "white" }}
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 21 })}
                    to="/user-type"
                    className="menu-link"
                  >
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <span className="title">Loại người dùng</span>
                  </Link>
                </li>
                <li
                  style={!this.state.isShowUser ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 20
                      ? "menu-item active"
                      : "menu-item"
                  }
                  style={{ backgroundColor: "white" }}
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 20 })}
                    to="/listUser"
                    className="menu-link"
                  >
                    <Icon type="user" className="fa" />
                    <span className="title">Quản Lý Người Dùng</span>
                  </Link>
                </li>
                <li
                  style={!this.state.isShowPage ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 53
                      ? "menu-item active"
                      : "menu-item"
                  }
                  style={{ backgroundColor: "white" }}
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: 53 })}
                    to="/list-page"
                    className="menu-link"
                  >
                    <i class="fa fa-clone" aria-hidden="true"></i>
                    <span className="title">Quản Lý Trang</span>
                  </Link>
                </li>
              </div>
              <li
                style={
                  !this.state.isShowPriceListSetting ? { display: "none" } : {}
                }
                className={
                  this.state.isMenuIndex === 37
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(37)}
                  to="/price-list-setting"
                  className="menu-link"
                >
                  <i class="fa fa-book fa-fw" aria-hidden="true"></i>
                  <span className="title">Thiết Lập Bảng Giá</span>
                </Link>
              </li>

              <li
                style={!this.state.isShowCar ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 45
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(45)}
                  to="/car"
                  className="menu-link"
                >
                  <Icon type="robot" className="fa" />
                  <span className="title">Quản Lý Xe</span>
                </Link>
              </li>

              <li
                style={!this.state.isShowInventory ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 34
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(34)}
                  to="/inventory"
                  className="menu-link"
                >
                  <i className="fa fa-archive" aria-hidden="true"></i>
                  <span className="title">Quản lý kho</span>
                </Link>
              </li>

              {/* <li style={!this.state.isShowMenu[1] ? { display: "none" } : {}}
                                className={this.state.isMenuIndex === 6 ? "menu-item active" : "menu-item"}>
                                <Link onClick={() => this.setState({ isMenuIndex: 6 })} to="/user"
                                    className="menu-link">

                                    <span className="title">{Constant.USER_TITLE}</span>

                                </Link>
                            </li> */}

                {!(this.state.userType==="Warehouse" && this.state.userRole==="SuperAdmin")&&(
                    <li
                    style={!this.state.isShowMenu[7] ? { display: "none" } : {}}
                    className={
                      this.state.isMenuIndex === 5
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      onClick={() => this.active(5)}
                      to="/report"
                      className="menu-link "
                    >
                      <i className="fa fa-comments" aria-hidden="true"></i>
                      <span className="title">{Constant.REPORT_TITLE}</span>
                    </Link>
                  </li>
    
                )}
              
              {/* <li style={!this.state.isShowMenu[8] ? { display: "none" } : {}}
                                className={this.state.isMenuIndex === 8 ? "menu-item active" : "menu-item"}>
                                <Link onClick={() => this.setState({ isMenuIndex: 8 })} to='/staff'
                                    className="menu-link ">
                                    <i className="fa fa-handshake-o" aria-hidden="true"></i>
                                    <span className="title">{Constant.STAFF_TITLE}</span>

                                </Link>
                            </li> */}

              <li
                style={!this.state.isShowMenu[10] ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 10
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(10)}
                  to="/customer"
                  className="menu-link "
                >
                  <i className="fa fa-address-book" aria-hidden="true"></i>
                  <span className="title">{Constant.CUSTOMER_TITLE}</span>
                </Link>
              </li>

              <li
                style={!this.state.isShowUpdateOrder ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 19
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(19)}
                  to="/updateOrder"
                  className="menu-link"
                >
                  {/* <Icon type="thanh-tra" /> */}
                  <Icon type="shopping-cart" className="fa" />
                  <span
                    style={{
                      fontFamily: "roboto",
                      textTransform: "capitalize",
                    }}
                  >
                    Xem đơn hàng{" "}
                  </span>
                </Link>
              </li>

              <li
                style={!this.state.isShowbaocao ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 30
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(30)}
                  to="/baocao"
                  className="menu-link"
                >
                  <Icon type="notification" className="fa" />
                  <span className="title">Gửi Thông Báo</span>
                </Link>
              </li>

              <li
                style={!this.state.isManagementMenu ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 38
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(38)}
                  to="/management-menu"
                  className="menu-link"
                >
                  <Icon type="menu-unfold" className="fa" />
                  <span className="title">Quản lý Menu</span>
                </Link>
              </li>
              <li
                style={!this.state.isShowSetting ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 36
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(36)}
                  to="/setting"
                  className="menu-link"
                >
                  <Icon type="setting" className="fa" />
                  <span className="title">Cài Đặt</span>
                </Link>
              </li>
              
                <li
                data-toggle="collapse"
                data-target="#orderTankTruck"
                className="collapsed menu-item"
                style={
                  !this.state.isShowOrderTurnbackTankTruck
                    ? { display: "none" }
                    : {}
                }
                className={
                  this.state.isMenuIndex === 43
                    ? "menu-item active1"
                    : "menu-item"
                }
              >
                <Link className="menu-link" onClick={() => this.active(43)}>
                  <i className="fa fa-suitcase" aria-hidden="true"></i>
                  <span className="order">Đơn Hàng Xe Bồn</span>
                  <i
                    className={
                      currentMenu == 43 && toggleOn43 == true
                        ? "fa fa-minus"
                        : "fa fa-plus"
                    }
                  ></i>
                </Link>
              </li>    
               
              <div
                className={
                  currentMenu == 43
                    ? "sub-menu collapse show"
                    : "sub-menu collapse"
                }
                id="orderTankTruck"
              >
          {!((this.state.userRole==="SuperAdmin" && this.state.userType==="Accounting")
          || (this.state.userRole==="SuperAdmin" && this.state.userType==="Manager")
          || (this.state.userRole==="SuperAdmin" && this.state.userType==="Warehouse")) && (
                <li
                // style={
                //   !this.state.isShowCreateOrderTankTruck
                //     ? { display: "none" }
                //     : {}
                // }
                className={
                  this.state.isMenuIndex === "40"
                    ? "menu-item active1"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.setState({ isMenuIndex: "40" })}
                  to="/orderTankTruck-create"
                  className="menu-link "
                  style={{ backgroundColor: "white" }}
                >
                  <i className="fa fa-diamond" aria-hidden="true"></i>
                  <span className="title">Tạo đơn hàng xe bồn</span>
                </Link>
              </li>
          )}
                

                <li
                  // style={
                  //   !this.state.isShowListOrderTankTruck
                  //     ? { display: "none" }
                  //     : {}
                  // }
                  className={
                    this.state.isMenuIndex === "39"
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: "39" })}
                    to="/orderTankTruck-list"
                    className="menu-link"
                    style={{ backgroundColor: "white" }}
                  >
                    <i className="fa fa-building" aria-hidden="true"></i>
                    <span className="title">Danh sách đơn hàng xe bồn</span>
                  </Link>
                </li>

                <li
                  // style={
                  //   !this.state.isShowOrderTurnbackTankTruck
                  //     ? { display: "none" }
                  //     : {}
                  // }
                  className={
                    this.state.isMenuIndex === "41"
                      ? "menu-item active1"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.setState({ isMenuIndex: "41" })}
                    to="/orderTankTruck-BienDongGasDu"
                    className="menu-link"
                    style={{ backgroundColor: "white" }}
                  >
                    <i className="fa fa-cogs" aria-hidden="true"></i>
                    {/* <span className="title">{Constant.FIX_TITLE}</span> */}
                    <span className="title">Thống kê biến động gas dư</span>
                  </Link>
                </li>
              </div>
              {!((this.state.userRole==="SuperAdmin" &&this.state.userType==="Station" )
                ||(this.state.userRole==="SuperAdmin" &&this.state.userType==="Sales")
                ||(this.state.userRole==="SuperAdmin" &&this.state.userType==="Factory")
                ||((this.state.userType==="Factory" && this.state.userRole==="Owner"))
                ||((this.state.userType==="Region" && this.state.userRole==="SuperAdmin"))
                ||((this.state.userType==="Fixer" && this.state.userRole==="SuperAdmin"))
                ||((this.state.userType==="General" && this.state.userRole==="SuperAdmin"))
                ||((this.state.userType==="Agency" && this.state.userRole==="SuperAdmin")))&& (
                  <li
                  style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                  className={
                    this.state.isMenuIndex === 44
                      ? "menu-item active"
                      : "menu-item"
                  }
                >
                  <Link
                    onClick={() => this.active(44)}
                    to="/export-order-management"
                    className="menu-link "
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                    <span className="title">Quản Lý Lệnh Xuất</span>
                  </Link>
                </li>
              )}

              
              {!(this.state.userRole === "SuperAdmin" &&
                this.state.userType === "Fixer") ? (
                  <li
                    style={
                      !this.state.isStatisticalBranch ? { display: "none" } : {}
                    }
                    className={
                      this.state.isMenuIndex === 50
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      onClick={() => this.active(50)}
                      to="/statistial-branch"
                      className="menu-link"
                    >
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      <span className="title">Báo cáo thống kê bình mới</span>
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                
              {!(this.state.userRole === "SuperAdmin" &&
                this.state.userType === "Fixer") ? (
                  <li
                    style={
                      !this.state.isStatisticalBranch1 ? { display: "none" } : {}
                    }
                    className={
                      this.state.isMenuIndex === 51
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      onClick={() => this.active(51)}
                      to="/statistial-branchSC"
                      className="menu-link"
                    >
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      <span className="title">Báo cáo thống kê bình SC</span>
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              {(this.state.userRole === "SuperAdmin" &&
                this.state.userType === "Fixer") ||
                (this.state.userRole === "Owner" &&
                  this.state.userType === "Factory") ? (
                  <li
                    style={!this.state.isHistoryImport ? { display: "none" } : {}}
                    className={
                      this.state.isMenuIndex === 52
                        ? "menu-item active"
                        : "menu-item"
                    }
                  >
                    <Link
                      onClick={() => this.active(52)}
                      to="/history-export"
                      className="menu-link"
                    >
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      <span className="title">
                        {this.state.userRole === "Owner" &&
                          this.state.userType === "Factory"
                          ? "Lịch sử xuất - nhập"
                          :this.state.userRole === "SuperAdmin" &&
                          this.state.userType === "Fixer"?"Lịch sử xuất Vỏ": "Lịch sử xuất Bình"}
                      </span>
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              {!((this.state.userRole==="SuperAdmin"&& this.state.userType==="Sales")
               ||(this.state.userRole==="SuperAdmin" &&this.state.userType==="Factory")
               ||((this.state.userType==="Factory" && this.state.userRole==="Owner"))
               ||((this.state.userType==="Region" && this.state.userRole==="SuperAdmin"))
               ||((this.state.userType==="Fixer" && this.state.userRole==="SuperAdmin"))
               ||((this.state.userType==="General" && this.state.userRole==="SuperAdmin"))
               ||((this.state.userType=== "Agency" && this.state.userRole==="SuperAdmin")))&& (
                 <li
                 style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                 className={
                   this.state.isMenuIndex === 47
                     ? "menu-item active"
                     : "menu-item"
                 }
               >
                 <Link
                   onClick={() => this.active(47)}
                   to="/import-order-management"
                   className="menu-link "
                 >
                   <i className="fa fa-sign-in" aria-hidden="true"></i>
                   <span className="title">Quản Lý Lệnh Nhập</span>
                 </Link>
               </li> 
              )}

                {(this.state.userRole==="SuperAdmin"&& this.state.userType==="Factory") &&
               ( <li
                style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 57
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(57)}
                  to="/supportmanagement"
                  className="menu-link "
                >
                  <i className="fa fa-sign-in" aria-hidden="true"></i>
                  <span className="title">Quản Lý câu hỏi thường gặp</span>
                </Link>
              </li>)}
              <li
                style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 58
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <a
                  onClick={() => this.active(58)}
                  href="/#/usermanual"
                  className="menu-link "
                >
                  <i className="fa fa-info-circle" aria-hidden="true"></i>
                  <span className="title">Hướng dẫn sử dụng</span>
                </a>
              </li>
              <li
                style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
                className={
                  this.state.isMenuIndex === 59
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link
                  onClick={() => this.active(59)}
                  to="/cac-cau-hoi-thuong-gap"
                  className="menu-link "
                >
                  <i className="fa fa-question-circle-o" aria-hidden="true"></i>
                  <span className="title">Các câu hỏi thường gặp</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <header className="topbar">
          <div className="topbar-left">
          <span className="topbar-btn sidebar-toggler">
							<a className="logo-icon" style={{ display: "none" }}>
								<img class="iconMenu" src={iconMenu} alt="icon-menu" onClick={this.handleOpen}/>
								{/* <span className="fs-16 seednet-mobile-none">SeedNET</span> */}
							</a>
						</span>
            <div className="d-none d-md-block topbar-menu">
              <nav
                className="topbar-navigation ps-container ps-theme-default"
                data-ps-id="dd6e876c-e9c9-a4f2-6dfd-1a320277e825"
              >
                <ul className="menu">
                  {/* <li style={!this.state.isShowMenu[0] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 0 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 0})} to="/dashboard"*/}
                  {/*          className="menu-link">*/}

                  {/*        <i className="fa fa-bar-chart" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.DASHBOARD_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[1] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 6 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 6})} to="/user"*/}
                  {/*          className="menu-link">*/}

                  {/*        <span className="title">{Constant.USER_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}

                  {/*<li style={!this.state.isShowMenu[2] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 1 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 1})} to="/factory"*/}
                  {/*          className="menu-link">*/}
                  {/*<i className="fa fa-user-plus" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.FACTORY_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*/!*<li style={!this.state.isShowMenu[3] ? {display: "none"} : {}}*!/*/}
                  {/*/!*    className={this.state.isMenuIndex === 7 ? "menu-item active" : "menu-item"}>*!/*/}
                  {/*/!*    <Link onClick={() => this.setState({isMenuIndex: 7})} to="/station"*!/*/}
                  {/*/!*          className="menu-link">*!/*/}

                  {/*/!*        <span className="title">{Constant.STATION_TITLE}</span>*!/*/}

                  {/*/!*    </Link>*!/*/}
                  {/*/!*</li>*!/*/}

                  {/*<li style={!this.state.isShowMenu[4] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 2 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 2})} to="/general"*/}
                  {/*          className="menu-link">*/}
                  {/*<i className="fa fa-users" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.GENERAL_TITLE}</span>*/}
                  {/*    </Link>*/}
                  {/*</li>*/}

                  {/*<li style={!this.state.isShowMenu[5] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 4 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 4})} to="/agency"*/}
                  {/*          className="menu-link ">*/}
                  {/*<i className="fa fa-cart-plus" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.AGENCY_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}

                  {/*<li style={!this.state.isShowMenu[6] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 3 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 3})} to='/product'*/}
                  {/*          className="menu-link ">*/}
                  {/*<i className="fa fa-free-code-camp" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.PRODUCT_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[7] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 5 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 5})} to='/report'*/}
                  {/*          className="menu-link ">*/}
                  {/*        <span className="title">{Constant.REPORT_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[8] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 8 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 8})} to='/staff'*/}
                  {/*          className="menu-link ">*/}

                  {/*        <span className="title">{Constant.STAFF_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[9] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 9 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 9})} to='/manufacturer'*/}
                  {/*          className="menu-link ">*/}
                  {/*<i className="fa fa-diamond" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.MANUFACTURER_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[10] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 10 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 10})} to='/customer'*/}
                  {/*          className="menu-link ">*/}
                  {/*<i className="fa fa-address-book" aria-hidden="true"></i>*/}
                  {/*        <span className="title">{Constant.CUSTOMER_TITLE}</span>*/}

                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[11] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 11 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 11})} to="/partner"*/}
                  {/*          className="menu-link">*/}

                  {/*        <span className="title">{Constant.PARTNER}</span>*/}
                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[12] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 12 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 12})} to="/fixer"*/}
                  {/*          className="menu-link">*/}

                  {/*        <span className="title">{Constant.FIX_TITLE}</span>*/}
                  {/*    </Link>*/}
                  {/*</li>*/}
                  {/*<li style={!this.state.isShowMenu[13] ? {display: "none"} : {}}*/}
                  {/*    className={this.state.isMenuIndex === 13 ? "menu-item active" : "menu-item"}>*/}
                  {/*    <Link onClick={() => this.setState({isMenuIndex: 13})} to="/factory-child"*/}
                  {/*          className="menu-link">*/}

                  {/*        <span className="title">{Constant.FACTORY_CHILD}</span>*/}
                  {/*    </Link>*/}
                  {/*</li>*/}
                </ul>
              </nav>
            </div>
          </div>

          <div className="topbar-right">
            <ul className="topbar-btns">
              <li className="dropdown">
                <span className="topbar-btn" data-toggle="dropdown">
                  <img className="avatar" src={this.state.avatar} alt="..." />
                  <span
                    className="seednet-mobile-none"
                    style={{ marginLeft: "5px" }}
                  >
                    <span className="fs-16">
                      <label>
                        {this.state.user.user ? this.state.user.user.name : ""}
                      </label>
                      <i
                        className="fa fa-angle-down"
                        style={{ marginLeft: "5px", color: "#009347" }}
                      ></i>
                    </span>
                  </span>
                </span>
                <div className="dropdown-menu dropdown-menu-right">
                  {/*     <Link to="/profile-staff?type=2" className="dropdown-item"><i
                                        className="ti-lock"></i> Đổi mật khẩu </Link>*/}
                  <a
                    className="dropdown-item"
                    href="javascript:void(0);"
                    data-toggle="modal"
                    data-target="#modal-small"
                  >
                    <i className="ti-power-off"></i> Đăng xuất
                  </a>
                  <a className="dropdown-item" href={urlChangePass}>
                    <Icon type="edit" /> Đổi mật khẩu
                  </a>
                  <a className="dropdown-item" href={urlChangInformationUser}>
                    <Icon type="edit" /> Cập nhật thông tin
                  </a>
                </div>
              </li>

              {/* <li className="d-md-block w-30px">
                                <a href="#qv-messages-notification" data-toggle="quickview"
                                   onClick={() => this.setNotificationLoad()} className="topbar-btn has-new"><i
                                    className="ti-bell"></i></a>
                            </li> */}
            </ul>
          </div>
        </header>

        <main className="main-container" id="mainContent">
          {this.props.children}
          {/* <NotificationContainer updateInfoNotification={this.updateInfoNotification.bind(this)}
                                           initialLoadNoti={this.state.initLoad}/>*/}
        </main>

        <footer className="site-footer seednet-footer">
          <div className="row">
            <div className="col-md-6">
              {/*<p className="text-center text-md-left">Copyright © 2018
                                        <a href="http://thetheme.io/theadmin"> GasTracking</a>. All rights reserved.</p>*/}
            </div>

            <div className="col-md-6">
              <ul className="nav nav-primary nav-dotted nav-dot-separated justify-content-center justify-content-md-end">
                <li className="nav-item">
                  <a className="nav-link" href="../help/articles.html">
                    Giới thiệu
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="/cac-cau-hoi-thuong-gap">
                    Hỏi đáp
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/#/usermanual">Hướng dẫn sử dụng</a>
                </li>
              </ul>
            </div>
          </div>
        </footer>

        <div
          id="qv-global"
          className="quickview"
          data-url="../assets/data/quickview-notification.html"
        >
          <div className="spinner-linear">
            <div className="line"></div>
          </div>
        </div>

        <PopupLogOut />
        {/*  <Pricing/>
                <PopupNotification title_notification={this.state.title_notification}
                                   time_notification={this.state.time_notification}
                                   description_notification={this.state.description_notification}*/}
        {/* /> */}
      </div>
    );
  }
}

export default connect()(Main2);
