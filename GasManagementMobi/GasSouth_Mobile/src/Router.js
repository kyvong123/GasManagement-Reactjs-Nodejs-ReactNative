import React from "react";
import { connect } from "react-redux";
import {
  Scene,
  Router,
  Reducer,
  Overlay,
  Modal,
  Drawer,
  Stack,
  Lightbox,
  ActionConst,
  Actions,
} from "react-native-router-flux";
import customNavBarCustomer from "./components/CustomStatisticCustomerNavBar";
import FilterCustomer from "./screensManager/StastisticDeliveryManager/FilterCustomer";
import FilterStatisticJarError from "./screensManager/StatisticJarErrorManager/FilterStatisticJarError";
import StackViewStyleInterpolator from "react-navigation-stack/lib/module/views/StackView/StackViewStyleInterpolator";
import Alarm from "./screens/Alarm";
import homeAlarm from "./screens/homeAlarm";
import DrawerContent from "./components/DrawerContent";
import MyLightBox from "./components/MyLightBox";
import ErrorModal from "./components/ErrorModal";
import CustomNavbar from "./components/CustomNavBar";
import CustomNavbar_New from "./components/CustomNavbar_New";

import Info from "./screens/Info";
import Login from "./screens/Login";
import Product from "./screens/Product";
import Scan from "./screens/Scan";
import Qrcode from "./screens/Qrcode";
import ScanManual from "./screens/ScanManual";
import ScanResults from "./screens/ScanResults";
import Statistic from "./screens/Statistic";
import PageEmpty from "./screens/PageEmpty";
import Home from "./screens/Home";
import Report from "./screens/Report";
import ManufactureInfo from "./screens/manufactureInfo";
import Alert from "./screens/Alert";
import Summary from "./screens/Summary";
import Shipper from "./screens/Shipper";
import ReportList from "./screens/ReportList";
import DailyReport from "./screens/DailyReport";
import StatisticManager from "./screensManager/StatisticManager";
import StatisticManagerVer2 from "./screensManager/StatisticManagerVer2";
import StatisticDetails from "./screensManager/StatisticDetails";
import StatisticDetailsVer2 from "./screensManager/StatisticDetailsVer2";
import OrderDetails from "./screens/OrderDetails";
import OrderDetailsTank from "./screens/OrderDetailsTank";
import GetLocationsipping from "./screens/GetLocationsiping";
//import OrderManagement from './screens/OrderManagement';
import OrderManagement from "./screens/Order/OrderManager";
import OrderManagementTank from "./screens/OrderManagementTank";
import Customer from "./screens/Customer";
import TurnBack from "./screens/TurnBack";
import StatisticCustomer from "./screensManager/StastisticDeliveryManager/StatisticCustomer";
import StatisticJarError from "./screensManager/StatisticJarErrorManager/StatisticJarError";
import Driver from "./screens/Driver";
import DriverTank from "./screens/DriverTank";
import DriverTankDetail from "./screens/DriverTankDetail";
import DetailForDriver from "./screens/DetailForDriver";
import ExportCylinderEmpty from "./screens/ExportCylinderEmpty";
import ShipperTypeforPartner from "./screens/ShipperTypeforPartner";
import ChooseCamera from "./screens/ChooseCamera";
import ChangePassword from "./screens/ChangePassword";
import Branch from "./screens/Branch";
import LinerChart from "./screens/LinerChart";
import InventoryChart from "./screens/InventoryChart";
import Signature from "./screens/Signature";
import ChecklistForUsingSystemOfCylinder from "./screens/ChecklistForUsingSystemOfCylinder";
import MonthlyChecklist from "./screens/MonthlyChecklist";
import TankCheckingRecord from "./screens/TankCheckingRecord";
import ValveFlangeRecord from "./screens/ValveFlangeRecord";
import VaporizerCheckingRecord from "./screens/VaporizerCheckingRecord";
import EarthingSystemRecord from "./screens/EarthingSystemRecord";
import FireFightingRecord from "./screens/FireFightingRecord";
import CreateOrder from "./screens/CreateOrder";
import CreateOrderTank from "./screens/CreateOrderTank";
import ConfirmOrderTank from "./screens/ConfirmOrderTank";
import CreateNewOrders from "./screens/Order/CreateOrder/CreateNewOrders";
import CreateNewOrderSuccessFull from "./screens/Order/CreateOrder/CreateNewOrderSuccessFull";
import OrderInfomationScreen from "./screens/OrderInfomationScreen";
import StoreInfoScreen from "./screens/StoreInfoScreen";
import UserInfomationScreen from "./screens/UserInfomationScreen";
import DialogOrderInfoScreen from "./screens/DialogOrderInfoScreen";
import OrderStatus from "./screens/OrderStatus";
import CancelDetail from "./screens/CancelDetail";
import UpdateOrderStatus from "./screens/UpdateOrderStatus";
import ExportByDriver from "./screens/ExportByDriver";
import TurnbackByDriver from "./screens/TurnbackByDriver";
import Filter from "./screens/Filter";
import FilterOrderScreen from "./screens/Order/FilterOrderScreen";
import Station from "./screens/Station";
import FluctuationSurplus from "./screens/FluctuationSurplus";
import ExportHistory from "./screens/ExportHistory";
import OrderDetail_NewVersion from "./screens/OrderDetail_NewVersion";
import Reflux from "./screens/Reflux";
import DriverScan from "./screens/DriverScan";
import DriverProductInfo from "./screens/DriverProductInfo";
import DriverOtherGasCylinder from "./screens/DriverOtherGasCylinder";
import DriverListSerial from "./screens/DriverListSerial";
import DriverDelivery from "./screens/Delivery";
import DriverDeliveryScan from "./screens/Delivery/DriverDeliveryScan";
import DriverDeliveryProductInfo from "./screens/Delivery/DriverDeliveryProductInfo";
import DriverDeliveryListSerial from "./screens/Delivery/DriverDeliveryListSerial";
import DriverDeliverySubmit from "./screens/Delivery/DeliverySubmit";
import DriverListOrder_V2 from "./screens/Delivery/DriverListOrder_V2";
import VehicleInventory_FormSubmit from "./screens/VehicleInventory/VehicleInventory_FormSubmit";
import TruckDeliveryScan from "./screens/Truck/TruckDeliveryScan";
import TruckDeliveryProductInfo from "./screens/Truck/TruckDeliveryProductInfo";
import TruckDeliveryListSerial from "./screens/Truck/TruckDeliveryListSerial";
import TruckDeliverySubmit from "./screens/Truck/TruckDeliverySubmit";
import TruckListOrder from "./screens/Truck/TruckListOrder";
import TruckDeliveryScanManual from "./screens/Truck/TruckDeliveryScanManual";
import returnTruckSubmit from "./screens/returnTruckSubmit";
import TruckOrderStatistics from "./screens/Truck/TruckOrderStatistics";
import TruckStatisticDetail from "./screens/Truck/TruckStatisticDetail";

//import Chart from './screens/Chart'; hoapd tam thoi comment lai do chua biet ai lam file nay

import { setLanguage, getLanguage } from "./helper/auth";

import { useSelector, useDispatch } from "react-redux";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { defaultProps } from "@ant-design/react-native/lib/search-bar/PropsType";
import ChooseInfoUser from "./screens/Order/CreateOrder/ChooseInfoUser";
import CustomNavBa_Null from "./components/CustomNavBa_Null";
import DriverScanManual from "./screens/DriverScanManual";
import UpdateOrderDetailScreen from "./screens/Order/UpdateOrderDetailScreen";
import DriverDeliveryScanManual from "./screens/Delivery/DriverDeliveryScanManual";
import { SHIPPING_TYPE } from "./constants";
import StatisticJarErrorDetails from "./screensManager/StatisticJarErrorManager/StatisticJarErrorDetails";
import StatisticRevenue from "./screensManager/StastisticRevenueManager/StatisticRevenue";
import FilterStatisticRevenue from "./screensManager/StastisticRevenueManager/FilterStatisticRevenue";
import StatisticRevenueDetails from "./screensManager/StastisticRevenueManager/StatisticRevenueDetails";
import FilterStatisticRevenueDetails from "./screensManager/StastisticRevenueManager/FilterStatisticRevenueDetails";
import StatisticManagerVer3 from "./screensManager/StatisticManagerVer3";
import StatisticManagerWarehouse from "./screensManager/StatisticManagerWareHouse/StatisticManagerWarehouse";
import WarehouseAccount from "./screensManager/WareHouseManager/WarehouseAccount";
import SummaryManager from "./screensManager/WareHouseManager/SummaryManager";

const translationGetters = {
  en: () => require("./languages/en.json"),
  vi: () => require("./languages/vi.json"),
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

const reducerCreate = (params) => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
};

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
});
const onBackPress = () => {};

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

const RouterComponent = (props) => {
  // const currentTypeDelivery = useSelector(state => state.deliveryReducer.currentTypeDelivery);
  return (
    <Router createReducer={reducerCreate} backAndroidHandler={onBackPress}>
      <Overlay key="overlay">
        <Modal key="modal" hideNavBar transitionConfig={transitionConfig}>
          <Stack key="application" type={ActionConst.RESET} initial>
            <Scene key="info" hideNavBar component={Info} />
            <Scene
              key="scan"
              navBar={CustomNavbar}
              component={Scan}
              title={translate(
                "SCAN",
                chooseLanguageConfig(props.languageCode)
              )}
            />
            {/* <Scene key="QrCode" navBar={CustomNavbar} component={Qrcode} title={translate('SCAN', chooseLanguageConfig(props.languageCode))} /> */}
            <Scene
              key="scanManual"
              navBar={CustomNavbar}
              component={ScanManual}
              title={translate(
                "LOOK_UP_MANUALLY",
                chooseLanguageConfig(props.languageCode)
              )}
            />
            <Scene
              key="result2"
              navBar={CustomNavbar}
              component={ScanResults}
              title={translate(
                "PRODUCT_INFORMATION",
                chooseLanguageConfig(props.languageCode)
              )}
              back
            />
            <Scene
              key="report"
              navBar={CustomNavbar}
              component={Report}
              title={translate(
                "REPORT",
                chooseLanguageConfig(props.languageCode)
              )}
            />
            <Scene
              key="ManufactureInfo"
              navBar={CustomNavbar}
              component={ManufactureInfo}
              title={translate(
                "BRAND_INFORMATION",
                chooseLanguageConfig(props.languageCode)
              )}
            />
            <Scene
              key="product"
              navBar={CustomNavbar}
              component={Product}
              title={translate(
                "PRODUCT_INFORMATION",
                chooseLanguageConfig(props.languageCode)
              )}
            />
          </Stack>
          <Scene
            key="login"
            hideNavBar={true}
            navBar={CustomNavbar}
            component={Login}
          />
          <Lightbox key="app" type={ActionConst.RESET}>
            <Drawer
              drawer
              hideNavBar
              key="drawer"
              contentComponent={DrawerContent}
              drawerWidth={300}
            >
              <Scene
                key="home"
                component={Home}
                navBar={CustomNavbar}
                title={translate(
                  "HOME",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="FilterOrderScreen"
                component={FilterOrderScreen}
                navBar={NULL_Navbar}
                // title={translate(
                //   'FILTER',
                //   chooseLanguageConfig(props.languageCode),
                // )}
              />
              <Scene
                key="scanAdmin"
                navBar={CustomNavbar}
                component={Scan}
                title={translate(
                  "SCAN",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="pageEmpty"
                component={PageEmpty}
                navBar={CustomNavbar}
                title={translate(
                  "UNDER_CONSTRUCTION",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="scanManual"
                hideNavBar={false}
                navBar={CustomNavbar}
                component={ScanManual}
                title={translate(
                  "LOOK_UP_MANUALLY",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="result2"
                hideNavBar={false}
                navBar={CustomNavbar}
                component={ScanResults}
                title={translate(
                  "PRODUCT_INFORMATION",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              {/* ================================================================= */}
              <Stack key="filter" hideNavBar>
                <Scene
                  key="FILTER"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Filter}
                  title={translate(
                    "FILTER",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="STATION"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Station}
                  title={translate(
                    "STATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              {/* ================================================================= */}
              <Stack key="TURN_BACK" hideNavBar>
                <Scene
                  key="chooseDriverTab"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={TurnBack}
                  title={translate(
                    "TURN_BACK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="EXPORT_CYLINDER_EMPTY" hideNavBar>
                <Scene
                  key="chooseActionExportCylinderEmpty"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ExportCylinderEmpty}
                  title={translate(
                    "EXPORT_THE_SHELL",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="ChooseCameraExport"
                  navBar={CustomNavbar}
                  component={ChooseCamera}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="TURN_BACK_MARKET" hideNavBar>
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Scan}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="scanManual"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanManual}
                  title={translate(
                    "LOOK_UP_MANUALLY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="shipper"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Shipper}
                  title={translate(
                    "SHIPPING_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                {/*<Scene key="scan" hideNavBar component={Product} title={translate('PRODUCT_INFORMATION',chooseLanguageConfig(props.languageCode))} productAction='importCyclinder'/>*/}
                <Scene
                  key="turnBackSummary"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Summary}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="turnbackByDriver"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={TurnbackByDriver} /* Cuong them vao */
                  title={translate(
                    "TURNBACK_BY_DRIVER",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="EXPORT_PARTNER" hideNavBar>
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  hideNavBar={false}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={Scan}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scanManual"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanManual}
                  title={translate(
                    "LOOK_UP_MANUALLY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="exportSummary"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Summary}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="shipperTypeForPartner"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ShipperTypeforPartner}
                  title={translate(
                    "SHIPPER_SHIPPING_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="TURN_BACK_STATION" hideNavBar>
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Scan}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="scanManual"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanManual}
                  title={translate(
                    "LOOK_UP_MANUALLY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="shipper"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Shipper}
                  title={translate(
                    "SHIPPING_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                {/*<Scene key="scan" hideNavBar component={Product} title={translate('PRODUCT_INFORMATION',chooseLanguageConfig(props.languageCode))} productAction='importCyclinder'/>*/}
                <Scene
                  key="turnBackSummary"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Summary}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="IMPORT" hideNavBar>
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Scan}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="scanManual"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanManual}
                  title={translate(
                    "LOOK_UP_MANUALLY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="shipper"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Shipper}
                  title={translate(
                    "SHIPPING_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                {/*<Scene key="scan" hideNavBar component={Product} title={translate('PRODUCT_INFORMATION',chooseLanguageConfig(props.languageCode))} productAction='importCyclinder'/>*/}
                <Scene
                  key="importSummary"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Summary}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="exportByDriver"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ExportByDriver} /* Cuong them vao */
                  title={translate(
                    "EXPORT_BY_DRIVER",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="EXPORT" hideNavBar>
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Scan}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="scanManual"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanManual}
                  title={translate(
                    "LOOK_UP_MANUALLY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="shipper"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Shipper}
                  title={translate(
                    "SHIPPING_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="customer"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Customer}
                  title={translate(
                    "BUYER_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                {/*<Scene key="scan" hideNavBar component={Product} title={translate('PRODUCT_INFORMATION',chooseLanguageConfig(props.languageCode))} productAction='importCyclinder'/>*/}
                <Scene
                  key="exportSummary"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Summary}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack key="EXPORT_PARENT_CHILD" hideNavBar>
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Scan}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="scanManual"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanManual}
                  title={translate(
                    "LOOK_UP_MANUALLY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="shipper"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Shipper}
                  title={translate(
                    "SHIPPING_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="customer"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Customer}
                  title={translate(
                    "BUYER_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                {/*<Scene key="scan" hideNavBar component={Product} title={translate('PRODUCT_INFORMATION',chooseLanguageConfig(props.languageCode))} productAction='importCyclinder'/>*/}
                <Scene
                  key="exportSummary"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={Summary}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>

              <Scene
                key="reportList"
                navBar={CustomNavbar}
                component={ReportList}
                title={translate(
                  "SEE_THE_REPORT",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="signature"
                navBar={CustomNavbar}
                component={Signature} /* Cuong them vao */
                title={translate(
                  "delivery_history",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="changePassword"
                navBar={CustomNavbar}
                component={ChangePassword} /* Cuong them vao */
                title={translate(
                  "CHANGE_THE_PASSWORD",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="ChecklistForUsingSystemOfCylinder"
                navBar={CustomNavbar}
                component={
                  ChecklistForUsingSystemOfCylinder
                } /* Cuong them vao */
                title={translate(
                  "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
                  chooseLanguageConfig(props.languageCode)
                )}
              />

              <Scene
                key="TankCheckingRecord"
                navBar={CustomNavbar}
                component={TankCheckingRecord} /* Cuong them vao */
                title={translate(
                  "TANK_CHECKING_RECORD",
                  chooseLanguageConfig(props.languageCode)
                )}
              />

              {/* kho xe */}
              <Stack key={"wareHouse"}>
                <Scene
                  key="warehouseAccount"
                  component={WarehouseAccount}
                  navBar={CustomNavbar}
                  title={translate(
                    "EXPORT_CYLINDER_TO",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="ChooseCamera"
                  hideNavBar={false}
                  title={translate(
                    "SELECT",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={ChooseCamera}
                  navBar={CustomNavbar}
                />
                <Scene
                  key="scan"
                  navBar={CustomNavbar}
                  component={Scan}
                  title={translate(
                    "SCAN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="result2"
                  navBar={CustomNavbar}
                  component={ScanResults}
                  title={translate(
                    "PRODUCT_INFORMATION",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  back
                />
                <Scene
                  key="SummaryManager"
                  hideNavBar={false}
                  title={translate(
                    "THE_SERIAL_WAS_MANIPULATED",
                    chooseLanguageConfig(props.languageCode)
                  )}
                  component={SummaryManager}
                  navBar={CustomNavbar}
                />
              </Stack>

              <Stack key="statisticsReport">
                <Scene
                  key="statisticManager"
                  component={StatisticManager}
                  navBar={CustomNavbar}
                  title={translate(
                    "Statistics_Report",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="statisticManagerVer2"
                  component={StatisticManagerVer2}
                  navBar={CustomNavbar}
                  title={translate(
                    "Statistics_Report_Ver2",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="statisticManagerVer3"
                  component={StatisticManagerVer3}
                  navBar={CustomNavbar}
                  title={translate(
                    "Statistics_Report_Ver3",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="StatisticManagerWarehouse"
                  component={StatisticManagerWarehouse}
                  navBar={CustomNavbar}
                  title={translate(
                    "VEHICLE_INVENTORY_STATISTICS",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="StatisticDetails"
                  component={StatisticDetails}
                  navBar={CustomNavbar}
                  title={translate(
                    "Statistics_Report",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="StatisticDetailsVer2"
                  component={StatisticDetailsVer2}
                  navBar={CustomNavbar}
                  title={translate(
                    "Statistics_Report_Ver2",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="branch"
                  navBar={CustomNavbar}
                  component={Branch} /* Cuong them vao */
                  title={translate(
                    "BRANCH_SOUTHERN",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>

              <Stack>
                <Scene
                  key="statisticCustomer"
                  component={StatisticCustomer}
                  navBar={customNavBarCustomer}
                  title={translate(
                    "STATISTICAL_DELIVERY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="filterCustomer"
                  component={FilterCustomer}
                  navBar={CustomNavbar}
                  title={translate(
                    "FILTER",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="statisticJarError"
                  component={StatisticJarError}
                  navBar={CustomNavBa_Null}
                  // title={translate(
                  //   'STATISTICAL_JAR_ERROR',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="filterStatisticJarError"
                  component={FilterStatisticJarError}
                  navBar={NULL_Navbar}
                  // title={translate(
                  //   'FILTER',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="statisticJarErrorDetails"
                  component={StatisticJarErrorDetails}
                  navBar={CustomNavBa_Null}
                  // title={translate(
                  //   'STATISTICAL_JAR_ERROR',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="statisticRevenue"
                  component={StatisticRevenue}
                  navBar={CustomNavBa_Null}
                  // title={translate(
                  //   'STATISTICAL_JAR_ERROR',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="filterStatisticRevenue"
                  component={FilterStatisticRevenue}
                  navBar={NULL_Navbar}
                  // title={translate(
                  //   'FILTER',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="statisticRevenueDetails"
                  component={StatisticRevenueDetails}
                  navBar={CustomNavBa_Null}
                  // title={translate(
                  //   'STATISTICAL_JAR_ERROR',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="filterStatisticRevenueDetails"
                  component={FilterStatisticRevenueDetails}
                  navBar={NULL_Navbar}
                  // title={translate(
                  //   'FILTER',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
              </Stack>

              <Stack key="CHECKLST" hideNavBar>
                <Scene
                  key="MonthlyChecklist"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={MonthlyChecklist} /* Cuong them vao */
                  title={translate(
                    "MONTHLY_CHECKLIST",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="TankCheckingRecord"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={TankCheckingRecord} /* Cuong them vao */
                  title={translate(
                    "TANK_CHECKING_RECORD",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="ValveFlangeRecord"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={ValveFlangeRecord} /* Cuong them vao */
                  title={translate(
                    "VALVE_FLANGE_AND_COMPONENTS_ON_PIPELINE_RECORD",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="VaporizerCheckingRecord"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={VaporizerCheckingRecord} /* Cuong them vao */
                  title={translate(
                    "VAPORIZER_CHECKING_RECORD",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="EarthingSystemRecord"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={EarthingSystemRecord} /* Cuong them vao */
                  title={translate(
                    "EARTHING_SYSTEM_CHECKING_RECORD",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="FireFightingRecord"
                  hideNavBar={false}
                  navBar={CustomNavbar}
                  component={FireFightingRecord} /* Cuong them vao */
                  title={translate(
                    "FIRE_FIGHTING_CHECKING_RECORD",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack
                key="ORDERS"
                title={translate(
                  "CREATE_NEW_ORDERS",
                  chooseLanguageConfig(props.languageCode)
                )}
              >
                <Scene
                  key="orderScreen"
                  navBar={CustomNavbar}
                  component={CreateNewOrders}
                  title={translate(
                    "CREATE_NEW_ORDERS",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="CreateNewOrderSuccessFull"
                  navBar={CustomNavBa_Null}
                  component={CreateNewOrderSuccessFull}
                  // title={translate(
                  //   'CREATE_NEW_ORDERS',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="orderInfoUserScreen"
                  navBar={CustomNavBa_Null}
                  component={ChooseInfoUser}
                  // title={translate(
                  //   'CREATE_NEW_ORDERS',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="orderInfoScreen"
                  navBar={CustomNavbar}
                  component={OrderInfomationScreen}
                  title={translate(
                    "CREATE_NEW_ORDERS",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />

                {/* linh */}
                <Scene
                  key="storeInfo"
                  navBar={CustomNavbar}
                  component={StoreInfoScreen}
                  title={translate(
                    "CREATE_NEW_ORDERS",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />

                <Scene
                  key="userInfoScreen"
                  navBar={CustomNavbar}
                  component={UserInfomationScreen}
                  title={translate(
                    "CREATE_NEW_ORDERS",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>

              <Scene
                key="CreateOrder"
                navBar={CustomNavbar}
                component={CreateOrder} /* Cuong them vao */
                title={translate(
                  "CREATE_ORDER",
                  chooseLanguageConfig(props.languageCode)
                )}
              />

              <Scene
                key="OrderStatus"
                navBar={CustomNavbar}
                component={OrderStatus} /* Cuong them vao */
                title={translate(
                  "ORDER_STATUS",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="LinerChart"
                navBar={CustomNavbar}
                component={LinerChart} /* Cuong them vao */
                title={translate(
                  "THỐNG KÊ",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Stack>
                {/* <Scene
                key="OrderManagement"
                navBar={CustomNavbar}
                component={OrderManagement} 
                /* Cuong them vao 
                title={translate(
                  'ORDER_MANAGEMENT',
                  chooseLanguageConfig(props.languageCode)
                )}
              /> */}
                <Scene
                  key="OrderManagement"
                  navBar={NULL_Navbar}
                  component={OrderManagement} /* Cuong them vao */
                  // title={translate(
                  //   'ORDER_MANAGEMENT',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="OrderDetailNewVersion"
                  component={OrderDetail_NewVersion}
                  navBar={NULL_Navbar}
                  // title={translate(
                  //   'ORDER_DETAIL',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="UpdateOrderDetailScreen"
                  component={UpdateOrderDetailScreen}
                  navBar={NULL_Navbar}
                  // title={translate(
                  //   'ORDER_DETAIL',
                  //   chooseLanguageConfig(props.languageCode),
                  // )}
                />
                <Scene
                  key="OrderDetails"
                  navBar={CustomNavbar}
                  component={OrderDetails} /* Cuong them vao */
                  title={translate(
                    "ORDER_DETAIL",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="GetLocationsipping"
                  navBar={CustomNavbar}
                  component={GetLocationsipping}
                  title={translate(
                    "ORDER_DETAIL",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="Alarm"
                  navBar={CustomNavbar}
                  component={Alarm}
                  title={translate(
                    "ALARM",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="homeAlarm"
                  navBar={CustomNavbar}
                  component={homeAlarm}
                  title={translate(
                    "ALARM",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack>
                <Scene
                  key="OrderManagementTank"
                  navBar={CustomNavbar}
                  component={OrderManagementTank}
                  title={translate(
                    "ORDER_MANAGEMENT_TANK_TRUCK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="OrderDetailsTank"
                  navBar={CustomNavbar}
                  component={OrderDetailsTank}
                  title={translate(
                    "ORDER_DETAIL_TANK_TRUCK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="CreateOrderTank"
                  navBar={CustomNavbar}
                  component={CreateOrderTank}
                  title={translate(
                    "CREATE_NEW_ORDERS_TANK_TRUCK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="ConfirmOrderTank"
                  navBar={CustomNavbar}
                  component={ConfirmOrderTank}
                  title={translate(
                    "CREATE_NEW_ORDERS_TANK_TRUCK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack>
                <Scene
                  key="FluctuationSurplus"
                  navBar={CustomNavbar}
                  component={FluctuationSurplus}
                  title={translate(
                    "FLUCTUATION_SURPLUS",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack>
                <Scene
                  key="ExportHistory"
                  navBar={CustomNavbar}
                  component={ExportHistory}
                  title={translate(
                    "EXPORT_HISTORY",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>
              <Stack>
                <Scene
                  key="Driver"
                  navBar={CustomNavbar}
                  component={Driver}
                  title={translate(
                    "DRIVER_TAB",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />

                <Scene
                  key="DetailForDriver"
                  navBar={CustomNavbar}
                  component={DetailForDriver}
                  title={translate(
                    "ORDER_DETAIL",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>

              <Stack
                key="DriverTank"
                title={translate(
                  "DRIVER_TANK",
                  chooseLanguageConfig(props.languageCode)
                )}
              >
                <Scene
                  key="DriverTank"
                  navBar={CustomNavbar}
                  component={DriverTank}
                  title={translate(
                    "DRIVER_TANK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="DriverTankDetail"
                  navBar={CustomNavbar}
                  component={DriverTankDetail}
                  title={translate(
                    "ORDER_DETAIL",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
              </Stack>

              <Scene
                key="UpdateOrderStatus"
                navBar={CustomNavbar}
                component={UpdateOrderStatus} /* Cuong them vao */
                title={translate(
                  "UPDATE_ORDER_STATUS",
                  chooseLanguageConfig(props.languageCode)
                )}
              />

              <Scene
                key="alert"
                navBar={CustomNavbar}
                component={Alert}
                title={translate(
                  "SEND_REPORT_TO_BUSINESSES",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Scene
                key="product"
                navBar={CustomNavbar}
                component={Product}
                title={translate(
                  "PRODUCT_INFORMATION",
                  chooseLanguageConfig(props.languageCode)
                )}
              />
              <Stack>
                <Scene
                  key="Reflux"
                  navBar={CustomNavbar}
                  component={Reflux}
                  title={translate(
                    "TURN_BACK",
                    chooseLanguageConfig(props.languageCode)
                  )}
                />
                <Scene
                  key="driverScan"
                  component={DriverScan}
                  navBar={CustomNavbar}
                  title="Quét mã bình trả"
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />
                <Scene
                  key="driverDeliveryScan"
                  component={DriverDeliveryScan}
                  navBar={CustomNavbar}
                  // title={`Quét mã ${currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? "bình giao" : "vỏ giao"}`}
                  title={`Quét serial để giao hàng`}
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />
                <Scene
                  key="driverScanManual"
                  component={DriverScanManual}
                  navBar={CustomNavbar}
                  title="Nhập serial thủ công"
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />

                <Scene
                  key="driverProductInfo"
                  component={DriverProductInfo}
                  navBar={NULL_Navbar}
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />
                <Scene
                  key="driverOtherGasCylinder"
                  component={DriverOtherGasCylinder}
                  navBar={NULL_Navbar}
                  title="Hồi lưu vỏ khác"
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />
                <Scene
                  key="driverListSerial"
                  component={DriverListSerial}
                  navBar={NULL_Navbar}
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />
                {/* //////////// DELIVERY ////////////// */}
                <Scene
                  key="delivery"
                  component={DriverDelivery}
                  navBar={CustomNavbar}
                  title="Giao hàng"
                />
                <Scene
                  key="driverDeliveryScanManual"
                  component={DriverDeliveryScanManual}
                  navBar={CustomNavbar}
                  title="Nhập serial thủ công"
                />
                <Scene
                  key="driverDeliveryProductInfo"
                  component={DriverDeliveryProductInfo}
                  navBar={NULL_Navbar}
                />
                <Scene
                  key="driverDeliveryListSerial"
                  component={DriverDeliveryListSerial}
                  navBar={NULL_Navbar}
                />
                <Scene
                  key="driverDeliverySubmit"
                  component={DriverDeliverySubmit}
                  navBar={NULL_Navbar}
                  title="Submit giao hàng abc"
                />
                <Scene
                  key="driverListOrder_V2"
                  component={DriverListOrder_V2}
                  navBar={NULL_Navbar}
                  title=""
                />
                {/* Tài xế hồi lưu kho */}
                <Scene
                  key="VehicleInventory_FormSubmit"
                  component={VehicleInventory_FormSubmit}
                  navBar={NULL_Navbar}
                  title=""
                />
                {/* //////////// TRUCK ////////////// */}
                <Scene
                  key="truckDeliveryScan"
                  component={TruckDeliveryScan}
                  navBar={CustomNavbar}
                  // title={`Quét mã ${currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? "bình giao" : "vỏ giao"}`}
                  title={`Quét serial để giao hàng`}
                  // title={translate('SCAN', chooseLanguageConfig(props.languageCode))} s
                />
                <Scene
                  key="truckDeliveryScanManual"
                  component={TruckDeliveryScanManual}
                  navBar={CustomNavbar}
                  title="Nhập serial thủ công"
                />
                <Scene
                  key="truckDeliveryProductInfo"
                  component={TruckDeliveryProductInfo}
                  navBar={NULL_Navbar}
                />
                <Scene
                  key="truckDeliveryListSerial"
                  component={TruckDeliveryListSerial}
                  navBar={NULL_Navbar}
                />
                <Scene
                  key="truckDeliverySubmit"
                  component={TruckDeliverySubmit}
                  navBar={NULL_Navbar}
                  title="Submit giao hàng abc"
                />
                <Scene
                  key="truckListOrder"
                  component={TruckListOrder}
                  navBar={NULL_Navbar}
                  title=""
                />
                <Scene
                  key="returnTruckSubmit"
                  component={returnTruckSubmit}
                  navBar={NULL_Navbar}
                  title="Submit hồi lưu abc"
                />
                <Scene
                  key="TruckOrderStatistics"
                  component={TruckOrderStatistics}
                  navBar={NULL_Navbar}
                  title="Thống kê đơn hàng"
                />
                <Scene
                  key="TruckStatisticDetail"
                  component={TruckStatisticDetail}
                  navBar={NULL_Navbar}
                  title="Chi tiết giao hàng"
                />
              </Stack>
            </Drawer>
            <Scene key="LightBox" component={MyLightBox} />
          </Lightbox>
          <Scene key="error" component={ErrorModal} />
        </Modal>
      </Overlay>
    </Router>
  );
};

const NULL_Navbar = () => <></>;

export const mapStateToProps = (state) => ({
  languageCode: state.language.languageCode,
});

export default connect(mapStateToProps, null)(RouterComponent);
