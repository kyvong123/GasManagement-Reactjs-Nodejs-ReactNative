import { combineReducers } from "redux";
import app from "./reducers/AppReducer";
import cylinders from "./reducers/CyclinderReducer";
import auth from "./reducers/AuthReducer";
import listStation from './reducers/ListStationReducer'
import report from "./reducers/ReportReducer";
import exportPlaces from "./reducers/ManufactureReducer";
import language from "./reducers/LanguageReducer";
import inspector from "./reducers/InspectorReducer";
import order from "./reducers/OrderReducer";
import print from "./reducers/PrintReducer";
import statistic from "./reducers/StatisticReducer";
import exports from "./reducers/ExportReducer";
import customer from './reducers/CustomerReducer';
import currentInventory from "./reducers/CurrentInventoryReducer";
import listmanufaceture from './reducers/ListManufactureReducer';
import testReducer from "./reducers/TestReducer";
import listOrderReducer from "./reducers/listOrderReducer";
import refluxReducer from "./reducers/RefluxReducer";
import deliveryReducer from './reducers/DriverDeliveryReducer';
import currentSignatureReducer from './reducers/CurrentSignatureReducer';
import truckDeliveryReducer from "./reducers/TruckDeliveryReducer";
export default combineReducers({
  app,
  auth,
  cylinders,
  report,
  exportPlaces,
  language,
  inspector,
  order,
  print,
  customer,
  statistic,
  exports,
  currentInventory,
  listStation,
  listmanufaceture,
  testReducer,
  refluxReducer,
  deliveryReducer,
  currentSignatureReducer,
  listOrderReducer,
  truckDeliveryReducer,
});
