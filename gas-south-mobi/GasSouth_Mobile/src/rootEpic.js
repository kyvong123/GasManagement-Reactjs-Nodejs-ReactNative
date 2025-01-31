import { combineEpics } from "redux-observable";
import AuthEpics from "./languages/epics/AuthEpics";
import ListStation from "./languages/epics/ListStationEpic";
import CyclinderEpics from "./languages/epics/CyclinderEpics";
import ExportEpics from "./languages/epics/ExportEpics";
import ReportsEpics from "./languages/epics/ReportEpics";
import ManufactureEpics from "./languages/epics/ManufactureEpics";
import CurrentInventoryEpics from "./languages/epics/CurrentInventoryEpics";
import LanguageEpics from "./languages/epics/LanguageEpics";
import InspectorEpics from "./languages/epics/InspectorEpics";
import OrderEpics from "./languages/epics/OrderEpics";
import PrintEpics from "./languages/epics/PrintEpics";
import ListManufacture from "./languages/epics/ListMaufatureEpic";
import CustomerAction from "./languages/epics/CustomerEpics";
// import CurrentInventoryEpics from './epics/CurrentInventoryEpics';
// import StatisticEpics from './epics/StatisticEpics';

const rootEpic = combineEpics(
  ...AuthEpics,
  ...ExportEpics,
  ...CyclinderEpics,
  ...ReportsEpics,
  ...ManufactureEpics,
  ...LanguageEpics,
  ...InspectorEpics,
  ...OrderEpics,
  ...PrintEpics,
  ...CurrentInventoryEpics,
  ...ListStation,
  ...ListManufacture,
  ...CustomerAction
);
export default rootEpic;
