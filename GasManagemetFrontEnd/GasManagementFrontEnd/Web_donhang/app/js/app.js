// import scss
import "../scss/styles.scss";

// React Dom
import React from "react";
import ReactDOM from "react-dom";

// Redux
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import store from "store";
const history = syncHistoryWithStore(hashHistory, store);
// Components
import Main from "Main";
import Main2 from "Main2";
import Login from "Login";
import Register from "Register";
import RegisterSuccess from "RegisterSuccess";
import DashBoard from "./components/pages/dashboard(new)/DashBoard";
import requireLogin from "requireLogin";
import Product from "Product";
import General from "General";
import IndustrialCustomer from "./components/pages/general/industrialCustomer";
import Stations from "./components/pages/stations/Stations";
import Personnel from "./components/pages/personnel/Personnel";
import CustomerManagement from "./components/pages/customerManagement/CustomerManagement";
import Branch from "./components/pages/branch/Branch";
import Agency from "Agency";
import Factory from "Factory";
import FactoryChild from "FactoryChild";
import Report from "Report";
import User from "User";
import ListUser from "./components/pages/userInterface";

import CreateUser from "./components/pages/create-user";
import Station from "Station";
import Staff from "Staff";
import Manufacturer from "Manufacturer";
import Customer from "Customer";
import Partner from "Partner";
import Fixer from "Fixer";
import ChangePassword from "./components/changePassword/index";
import ChangeInformationUser from "./components/changeInforUser/index";
import Driver from "./../js/components/pages/driver/index";
import Warehouse from "./../js/components/pages/warehouse/index";
import ThanhTra from "./components/pages/thanh-tra/index";
// import Thanhtra from './../js/components/Thanhtra/index';

import GoogleMapContainer from "./components/googlemap/index";
import DetailDataExport from "./components/pages/seeDetailDataExport/index";
import DatailHistoryDataImport from "./components/pages/seeDatailDataImport/index";
import CreateCalenderInspector from "./components/pages/create-calender-inspector/index";

import UpdateOrder from "./components/pages/updateOrder/index";
import StaffCreate from "./components/pages/create-staff/index";
import UserType from "./components/pages/user-type/index";
import Coordinator from "./components/pages/coordinator";
import CoordinatorCreate from "./components/pages/coordinator/coordinatorCreate";
import CreateOrder from "./components/pages/order/CreateOrder";
import ListOrder from "./components/pages/order/ListOrder";
import TurnbackOrder from "./components/pages/order/TurnbackOrder";
import SeeOrder from "./components/pages/order/SeeOrder";
import ShippingManager from "./components/pages/shipping/ShippingManager";
import FormSale from "./components/pages/Model_sale/FormSale";
import baocao from "./components/pages/baocao/baocao";
import CreateProduct from "./components/pages/create-product";
import GasCarrier from "./components/pages/gas-carrier";
import Main3 from "./components/layout/Main3";
//import * as firebase from 'firebase';
import Setting from "./components/pages/Setting/Setting";
import PriceSetting from "./components/pages/price-list-setting/index";
import ManagementMenu from "./components/pages/management-menu";
import Inventory from "./components/pages/inventory";
import reportExport from "./components/pages/reportExport/reportExport";
import DuplicateCylinder from "./components/pages/duplicate-cylinder/index";
import Car from "./components/pages/car/car";
import ExportOrderManagement from "./components/pages/export-order-management/index";
import CreateExportOrderManage from "./components/pages/export-order-management/createExportOrderManage";
import ImportOrderManagement from "./components/pages/import-order-management";
import CreateImportOrderManage from "./components/pages/import-order-management/createImportOrderManage";
import OrderTankTruck_list from "./components/pages/orderTankTruck/OrderTankTruck_list";
import OrderTankTruck_create from "./components/pages/orderTankTruck/OrderTankTruck_create";
import Statistical from "./components/pages/statistical";
import Statistical_V2 from "./components/pages/statistical_v2";
import StatisticalKhoXe_V2 from "./components/pages/statistical_khoxe";
import urlDetailHistoryImport_New from "./components/pages/statistical/urlDetailHistoryImport_New";
import urlDetailHistoryExport_New from "./components/pages/statistical/urlDetailHistoryExport_New";
import urlDetailStatistialBranch from "./components/pages/statistical/urlDetailStatistialBranch";
import statistialBranch from "./components/pages/statistical/statistialBranch";
import statistialBranchSC from "./components/pages/statistical/statistialBranchSC";
import historyImport from "./components/pages/statistical/historyImport";
import SystemPage from "./components/pages/Model_sale/systemPage";
import OrderTankTruck_BienDongGasDu from "./components/pages/orderTankTruck/OrderTankTruck_bienDongGasDu";
import FindDestination from "./components/findDestination/index";
import blankPage from "./components/pages/blank-page/index";
import loginNew from "./components/pages/login(new)/Login";
import UserManual from "./components/pages/Support/usermanual";
import FrequentlyAskedQuestions from "./components/pages/Support/FrequentlyaskedQuestions";
import SupportManagement from "./components/pages/Support/SupportManagement";
import ShellStatistical from "./components/pages/shellStatistical";
import OrderManagement from "./components/pages/orderManagement";
import vehicleInventory from "./components/pages/vehicle-inventory";
import CreateNewOrder from "./components/pages/create-order-new/CreateOrderNew";
import OrderStatistics from "./components/pages/OrderStatistics/OrderStatistics";
import ErrorStatistics from "./components/pages/OrderStatistics/ErrorStatistic";

import GasPrice from "./components/pages/PriceManagement/PriceGas";
import CylinderPrice from "./components/pages/PriceManagement/PriceCylinders";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Main}>
        <IndexRoute component={Login} />
        <Route path="login" component={Login} />
        {/* <Route path="login" component={loginNew} /> */}
        {/*Register*/}
        <Route path="register" component={Register} />
        <Route path="register-success" component={RegisterSuccess} />

        {/*Dashboard*/}
        {/* <Route path="/dashboard" component={DashBoard} onEnter={requireLogin} /> */}
      </Route>

      <Route component={Main2}>
        <Route
          path="/orderManagement"
          component={OrderManagement}
          onEnter={requireLogin}
        />
        <Route
          path="/vehicle-inventory"
          component={vehicleInventory}
          onEnter={requireLogin}
        />
        <Route
          path="/price-gas-management"
          component={GasPrice}
          onEnter={requireLogin}
        />
        <Route
          path="price-cylinders-management"
          component={CylinderPrice}
          onEnter={requireLogin}
        />
        <Route
          path="/create-new-order"
          component={CreateNewOrder}
          onEnter={requireLogin}
        />
        <Route path="/dashboard" component={DashBoard} onEnter={requireLogin} />
        <Route path="/product" component={Product} onEnter={requireLogin} />
        <Route
          path="/create-product"
          component={CreateProduct}
          onEnter={requireLogin}
        />
        <Route path="/factory" component={Factory} onEnter={requireLogin} />
        <Route
          path="/industrial-customer"
          component={IndustrialCustomer}
          onEnter={requireLogin}
        />
        <Route path="/general" component={General} onEnter={requireLogin} />
        <Route path="/stations" component={Stations} onEnter={requireLogin} />
        <Route path="/personnel" component={Personnel} onEnter={requireLogin} />
        <Route
          path="/customer-management"
          component={CustomerManagement}
          onEnter={requireLogin}
        />
        <Route path="/agency" component={Agency} onEnter={requireLogin} />
        <Route path="/report" component={Report} onEnter={requireLogin} />
        <Route path="/user" component={User} onEnter={requireLogin} />
        <Route path="/station" component={Station} onEnter={requireLogin} />
        <Route path="/staff" component={Staff} onEnter={requireLogin} />
        <Route
          path="/manufacturer"
          component={Manufacturer}
          onEnter={requireLogin}
        />
        <Route path="/customer" component={Customer} onEnter={requireLogin} />
        <Route path="/partner" component={Partner} onEnter={requireLogin} />
        <Route
          path="/factory-child"
          component={Branch}
          onEnter={requireLogin}
        />
        <Route path="/fixer" component={Fixer} onEnter={requireLogin} />
        <Route
          path="/changepassword"
          component={ChangePassword}
          onEnter={requireLogin}
        />
        <Route
          path="/changeinforuser"
          component={ChangeInformationUser}
          onEnter={requireLogin}
        />
        <Route path="/driver" component={Driver} onEnter={requireLogin} />
        <Route path="/warehouse" component={Warehouse} onEnter={requireLogin} />
        <Route
          path="/taomoinguodung"
          component={CreateUser}
          onEnter={requireLogin}
        />
        <Route path="/listUser" component={ListUser} onEnter={requireLogin} />

        <Route
          path="/list-page"
          component={SystemPage}
          onEnter={requireLogin}
        />
        <Route
          path="/coordinator"
          component={Coordinator}
          onEnter={requireLogin}
        />
        <Route
          path="/coordinator-create"
          component={CoordinatorCreate}
          onEnter={requireLogin}
        />

        {/* <Route path="/driver" component={Thanhtra} onEnter={requireLogin} /> */}

        <Route
          path="/googlemap"
          component={GoogleMapContainer}
          onEnter={requireLogin}
        />
        <Route
          path="/seetailddataexport"
          component={DetailDataExport}
          onEnter={requireLogin}
        />
        <Route
          path="/seetailhistoryImport"
          component={DatailHistoryDataImport}
          onEnter={requireLogin}
        />
        <Route path="/thanh-tra" component={ThanhTra} onEnter={requireLogin} />
        <Route
          path="/createCalenderInspector"
          component={CreateCalenderInspector}
          onEnter={requireLogin}
        />
        <Route
          path="/createOrder"
          component={CreateOrder}
          onEnter={requireLogin}
        />
        <Route
          path="/updateOrder"
          component={UpdateOrder}
          onEnter={requireLogin}
        />
        <Route
          path="/create-staff"
          component={StaffCreate}
          onEnter={requireLogin}
        />
        <Route path="/user-type" component={UserType} onEnter={requireLogin} />
        <Route path="/listOrder" component={ListOrder} />
        <Route path="/turnbackOrder" component={TurnbackOrder} />
        <Route path="/seeorder" component={SeeOrder} />
        <Route path="/shipping" component={ShippingManager} />
        <Route path="/controll" component={FormSale} onEnter={requireLogin} />
        <Route path="/baocao" component={baocao} onEnter={requireLogin} />

        <Route
          path="/gasCarrier"
          component={GasCarrier}
          onEnter={requireLogin}
        />
        <Route path="/setting" component={Setting} onEnter={requireLogin} />
        <Route
          path="/price-list-setting"
          component={PriceSetting}
          onEnter={requireLogin}
        />
        <Route
          path="/management-menu"
          component={ManagementMenu}
          onEnter={requireLogin}
        />
        <Route path="/inventory" component={Inventory} onEnter={requireLogin} />
        <Route
          path="/orderTankTruck-list"
          component={OrderTankTruck_list}
          onEnter={requireLogin}
        />
        <Route
          path="/orderTankTruck-create"
          component={OrderTankTruck_create}
          onEnter={requireLogin}
        />
        <Route
          path="/reportExport"
          component={reportExport}
          onEnter={requireLogin}
        />
        <Route
          path="/duplicatecylinder"
          component={DuplicateCylinder}
          onEnter={requireLogin}
        ></Route>
        <Route path="/car" component={Car} onEnter={requireLogin} />
        <Route
          path="/create-export-order-management"
          component={CreateExportOrderManage}
          onEnter={requireLogin}
        />
        <Route
          path="/export-order-management"
          component={ExportOrderManagement}
          onEnter={requireLogin}
        />
        <Route
          path="/import-order-management"
          component={ImportOrderManagement}
          onEnter={requireLogin}
        />
        <Route
          path="/create-import-order-management"
          component={CreateImportOrderManage}
          onEnter={requireLogin}
        />
        <Route
          path="/statistial"
          component={Statistical}
          onEnter={requireLogin}
        />
        <Route
          path="/statistial-v2"
          component={Statistical_V2}
          onEnter={requireLogin}
        />
        <Route
          path="/statistial-khoxe"
          component={StatisticalKhoXe_V2}
          onEnter={requireLogin}
        />
        <Route
          path="/shell-statistics"
          component={ShellStatistical}
          onEnter={requireLogin}
        />
        <Route
          path="/seetailhistoryImport_New"
          component={urlDetailHistoryImport_New}
          onEnter={requireLogin}
        />
        <Route
          path="/seetailddataExport_New"
          component={urlDetailHistoryExport_New}
          onEnter={requireLogin}
        />
        <Route
          path="/statistial-branch"
          component={statistialBranch}
          onEnter={requireLogin}
        />
        <Route
          path="/seedetailstatistialbranch"
          component={urlDetailStatistialBranch}
          onEnter={requireLogin}
        />
        <Route
          path="/history-export"
          component={historyImport}
          onEnter={requireLogin}
        />
        <Route
          path="/statistial-branchSC"
          component={statistialBranchSC}
          onEnter={requireLogin}
        />
        <Route
          path="/orderTankTruck-BienDongGasDu"
          component={OrderTankTruck_BienDongGasDu}
          onEnter={requireLogin}
        />
        <Route
          path="/findDestination"
          component={FindDestination}
          onEnter={requireLogin}
        />
        <Route
          path="/blank-page"
          component={blankPage}
          onEnter={requireLogin}
        />
        <Router
          path="/usermanual"
          component={UserManual}
          onEnter={requireLogin}
        />
        <Router
          path="/cac-cau-hoi-thuong-gap"
          component={FrequentlyAskedQuestions}
          onEnter={requireLogin}
        />
        <Router
          path="/supportmanagement"
          component={SupportManagement}
          onEnter={requireLogin}
        />
        <Router
          path="/order-statistics"
          component={OrderStatistics}
          onEnter={requireLogin}
        />
        <Router
          path="/error-statistics"
          component={ErrorStatistics}
          onEnter={requireLogin}
        />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
