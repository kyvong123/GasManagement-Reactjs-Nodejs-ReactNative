import React from "react";
import { connect } from "react-redux";
import PopupLogOut from "./PopupLogOut";
import { getCookie, setCookie } from "redux-cookie";
import getReportByUserAPI from "getReportByUserAPI";
import getHistoryImportAPI from "getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import moment from "moment";
import getUserCookies from "getUserCookies";
import UltiHelper from "UltiHelper";
import GetReportChartApi from "getReportChart";
import getReportPieChartAPI from "getReportPieChart";
import ShowPieChart from "./showPieChart";
import ShowBarChart from "./showBarChart";
import getAllBranch from "../../../../api/getAllBranch";

import {
  urlSeeDetailDataExport,
  urlDetailHistoryImport,
} from "./../../../config/config-reactjs";
import "./dashboard.scss";
//dai
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Sector,
  Cell,
  Text,
  ResponsiveContainer,
  Line,
  LabelList,
} from "recharts";
import Select from "react-select";
import updateAllowReportApi from "updateUserAllowReportApi";
import DatePicker, { registerLocale } from "react-datepicker";
// import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import YearPicker from "react-year-picker";
import showToast from "showToast";
import Switch from "react-switch";
import getReportChildsAPI from "getReportChilds";
import Constants from "Constants";
import TableDataInfo from "./tableDataInfo";
import getChildAndNumberImportAPI from "getChildAndNumberImport";
import getChildAndNumberExportAPI from "../../../../api/getChildAndNumberExport";
import apiReportTurnBackInfoAPI from "apiReportTurnBackInfo";
import callDataTurnBackInfoAPI from "callDataTurnBackInfo";
import { Row, Col } from "antd";
import getReportExcelByTargetAndDateTimeAPI from "getReportExcelByTargetAndDateTimeAPI";
import callApi from "../../../util/apiCaller";
import { TOPEXPORTCYLINDER } from "./../../../config/config";
import getToTalCylinderCreate from "../../../../api/getTotalCylinderCreate";
import getAllStation from "../../../../api/getAllStation";
import { Checkbox } from "antd";
import ReactCustomLoading from "ReactCustomLoading";
let COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#62e0f6",
  "#92b4b0",
  "#d22ac2",
  "#4a889c",
  "#40d3a6",
  "#71d892",
  "#b2e447",
  "#ee5592",
  "#4b79e6",
];
const RADIAN = Math.PI / 180;

const data = [{ name: "Chưa có Data", value: 1 }];

let ACTION_REPORT_TYPE = [
  { value: "IMPORT", label: "Nhập Bình" },
  { value: "EXPORT", label: "Xuất Bình" },
  { value: "IMPORT_CELL", label: "Nhập vỏ" },
  { value: "EXPORT_CELL", label: "Xuất Vỏ" },
  { value: "TURN_BACK", label: "Hồi Lưu" },
  { value: "FIX", label: "Xuất Bình Sửa Chữa" },
  { value: "CREATE", label: "Tổng Bình Đã Tạo" },
  { value: "NEWS_CELL", label: "Bình Sản Xuất Mới" },
  { value: "SALE", label: "Xuất Bình" },
];

class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_input_type: "",
      current_input_role: "",
      valueReports: [],
      dataValueReports: null,
      actionTypeReportExcel: "",
      selectedId: "",
      user: null,
      resultImport: { reveneu: 0 },
      resultExport: {},
      user_current: { userType: "" },
      historyImport: [],
      historyExport: [],
      dataPieChart: [],
      dataBarChart: [],
      dataSimpleBarChart: [],
      yearSubmit: "",
      dataArrYear: [],
      startDate: moment(),
      endDate: moment(),
      startDateSubmit: moment(),
      endDateSubmit: moment().format("MM/DD/YYYY"),
      checkDataChart: [],
      valueCheckChart: false,
      namePopup: "",
      checked: true,
      id: "",
      values: "",
      valuesstation: "",
      countnew: "",
      countold: "",
      listStation: [],
      checkbox: "",
      loading: false,

      // Công ty mẹ
      objectData: [
        { label: "Chọn chi nhánh", value: 10 },
        { label: "Tất cả", value: 0 },
        //{ label: "Tổng đại lý", value: 1, name: "General" },
        //{ label: "Hệ Thống Đại lý", value: 2, name: "Agency" },
        //{ label: "Công ty - Chi nhánh trực thuộc", value: 3, name: "Factory" },
        //{ label: "Nhà máy Bình Khí", value: 4, name: "Fixer" }
      ],
      dataChild1: [],
      dataChild2: [],
      dataChild3: [],
      dataChild4: [],
      dataChild5: [],

      objectDataChild: [
        //{ label: "Trạm", value: 0 },
        { label: "Tất cả", value: 0 },
        { label: "Tổng đại lý", value: 1, name: "General" },
        { label: "Hệ Thống Đại lý", value: 2, name: "Agency" },
        { label: "Nhà máy sửa chữa", value: 4, name: "Fixer" },
      ],
      objectDataChildTNMBFAC: [
        //{ label: "Chi nhánh trực thuộc", value: 0 },
        { label: "Hệ Thống Đại lý", value: 1, name: "Agency" },
      ],
      //label: "Chi nhánh trực thuộc", value: 0
      dataObjectChecked: { label: "--Chọn--", value: 100 },
      dataObjectCheckedChild: { label: "Tất cả", value: 0 },
      dataObjectCheckedGENARAL: {},

      dataObjectCheckedID: "",
      dataObjectChecked1: "",
      dataObjectCheckedID1: "",

      dataObjectCheckedIDChild: 0,
      dataObjectCheckedTNMBFAC: "",
      dataObjectCheckedTNMBFACID: "",

      dataObjectCheckedGENARALID: "",
      dataObjectAgencyGeneral: "",
      dataObjectAgencyGeneralID: "",

      itemData: "",
      itemDataObject4: "",
      itemDataObject5: "",
      dataTableChart: "",
      infoReportTurnback: "",
      dataTurnBacks: [],
      allDataImport: [],
      allDataExport: [],
      listTopExportCylinder: [],
      //tạo
      countcylindercreate: "",
      countcylindernew: "",
      countcylinderold: "",
      listcylindercreate: [],
      listcylindernew: [],
      listcylinderold: [],
      //nhập
      countcylinderimport: "",
      listcylinderimport: [],
      listimportnew: [],
      listimportold: [],
      countimportold: "",
      //tồn kho
      countcylinderinventory: "",
      listcylinderinventory: [],
      //đã bán
      countcylindersale: "",
      listcylindersale: [],
      //hồi lưu
      countcylinderturnback: "",
      listcylinderturnback: [],
      //xuất
      countoutold: "",
      listoutnew: [],
      listoutold: [],

      listBranch: [],
      userTypeBranch: "",
      userTypeStation: "",
      idstation: "",
    };
  }

  resetData(step) {
    switch (step) {
      case 1:
        this.setState({
          ataObjectCheckedID: 0,
          dataObjectChecked1: "",
          dataObjectCheckedID1: "",

          dataObjectCheckedIDChild: 0,
          dataObjectCheckedTNMBFAC: "",
          dataObjectCheckedTNMBFACID: "",

          dataObjectCheckedGENARALID: "",
          dataObjectAgencyGeneral: "",
          dataObjectAgencyGeneralID: "",
          dataValueReports: "",
        });
        break;
      case 2:
        this.setState({
          dataObjectCheckedIDChild: 0,
          dataObjectCheckedTNMBFAC: "",
          dataObjectCheckedTNMBFACID: "",

          dataObjectCheckedGENARALID: "",
          dataObjectAgencyGeneral: "",
          dataObjectAgencyGeneralID: "",
          dataValueReports: "",
        });
        break;
      case 3:
        this.setState({
          dataObjectCheckedGENARALID: "",
          dataObjectAgencyGeneral: "",
          dataObjectAgencyGeneralID: "",
          dataValueReports: "",
        });
        break;
    }
  }

  _getRandomColor(index = 0) {
    let today = new Date();
    today.setDate(today.getDate() + index);
    const randomNumber = Math.random(today.getMilliseconds());
    const cc = "#" + ("000000" + randomNumber.toString(16)).substr(-6);
    return cc;
  }

  _getArrayColor(numberLength = 5) {
    let arrayColor = [];
    let i = 0;
    while (i < numberLength) {
      const color = this._getRandomColor(i);
      arrayColor.push(color);
      i++;
    }
    if (arrayColor.length > 0) {
      COLORS = arrayColor;
    }
  }

  translateReportChart = (item) => {
    let reportVN = "";
    switch (item) {
      case "inventoryAtMySelf":
        return (reportVN = "Đang tồn kho");
      case "atResident":
        return (reportVN = "Đã bán cho người dân");
      case "else":
        return (reportVN = "Đang ở nơi khác");
      case "atFactoryChilds":
        return (reportVN = "Tồn tại cty con - CN trực thuộc");
      case "atGeneralChilds":
        return (reportVN = "Tồn tại tổng đại lý");
      case "atAgencyChilds":
        return (reportVN = "Tồn tại đại lý - nhà hàng");
      case "atPartners":
        return (reportVN = "Tồn tại đối tác");
      case "atFixer":
        return (reportVN = "Tồn tại nhà máy sản xuất, sửa chữa");
      case "totalFixer":
        return (reportVN = "Sửa chữa");
      case "totalGeneral":
        return (reportVN = "Tổng ĐL");
      case "totalAgency":
        return (reportVN = "ĐLý-NH");
      case "totalCompanyChild":
        return (reportVN = "CTC-CNTT");
      case "totalBuyPartner":
        return (reportVN = "ĐT mua ");
      case "totalRentPartner":
        return (reportVN = "ĐT cho thuê");
      default:
        return (reportVN = "");
    }
  };
  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {this.state.dataPieChart[index].value}
      </text>
    );
  };
  getReportPieChart = async (
    target_id,
    end,
    statisticalType,
    typeOfChildren,
    searchs1,
    searchs2,
    searchs3
  ) => {
    console.log("statisticalType", statisticalType);
    const data = await getReportPieChartAPI(
      target_id,
      end,
      statisticalType,
      typeOfChildren,
      searchs1,
      searchs2,
      searchs3
    );
    console.log("getReportPieChart", data.data.data);
    const arrPieChart = [];
    const checkArrChart = [];
    if (this.state.dataObjectCheckedID === 0 && this.state.checkbox !== true) {
      for (let itemPieChart of data.data.data) {
        for (let itemPieChart1 of itemPieChart.list) {
          console.log("itemPieChart1", itemPieChart1);
          arrPieChart.push({
            name: itemPieChart1.name,
            value: itemPieChart1.count,
          });
        }
      }
    }
    if (
      this.state.user_current.userRole == "SuperAdmin" &&
      this.state.userTypeBranch == "Fixer" &&
      this.state.checkbox !== true
    ) {
      for (let itemPieChart of dataChart.data.data.cylinders) {
        console.log("itemPieChart1", itemPieChart1);
        arrPieChart.push({
          name: itemPieChart.name,
          value: itemPieChart.count,
        });
      }
    }
    if (this.state.dataObjectCheckedID === 4) {
      for (let itemPieChart of data) {
        console.log("itemPieChart2", itemPieChart);
        for (let itemPieChart1 of itemPieChart.list) {
          arrPieChart.push({
            name: itemPieChart1.name,
            value: itemPieChart1.count,
          });
        }
      }
    }

    arrPieChart.map(async (item) => {
      if (item.value === 0) {
        await checkArrChart.push(item);
      }
    });
    if (checkArrChart.length === arrPieChart.length) {
      this.setState({ checkDataChart: checkArrChart });
    }
    this.setState({
      dataPieChart: arrPieChart,
      dataTableChart: data.data.data,
    });
  };
  giveTop10DataExport = (dataExport) => {
    let top10DataExport = [];
    if (dataExport.length > 10) {
      for (let p = 0; p < 10; p++) {
        top10DataExport.push(dataExport[p]);
      }
    } else if (dataExport.length < 10) {
      for (let p = 0; p < dataExport.length; p++) {
        top10DataExport.push(dataExport[p]);
      }
    }
    return top10DataExport;
  };
  async componentDidMount() {
    // Get user from cookie
    this.getUser();
    this.getAllReports();
    this.getImportHistory();
    this.getBranch();
    var user_cookies = await getUserCookies();
    console.log("123 cookies", user_cookies);
    this.setState({
      user_current: user_cookies.user,
      checked: user_cookies.user.allowReport,
    });
    let token = "Bearer " + user_cookies.token;
    console.log("token", token);
    let params = {
      id: user_cookies.user.id,
    };
    this.setDefaultSelectBoxExcel();
  }
  async ToTalCylinderCreate(
    target,
    startDate,
    endDate,
    statisticalType,
    typesOfChildren,
    actions,
    actions1,
    actions2,
    actions3,
    actions4,
    actions5
  ) {
    console.log("targetid", this.state.user_current.id);

    let data = await getToTalCylinderCreate(
      target,
      startDate,
      endDate,
      statisticalType,
      typesOfChildren,
      actions,
      actions1,
      actions2,
      actions3,
      actions4,
      actions5
    );
    // tạo
    let value = data.data.data.CREATED_CYLINDER;
    console.clear();
    console.log("giatri12", data);
    let news, old, oldout, oldimport, valueimport;
    let arrcylindernew = [];
    let arrcylinderold = [];
    let allcylinder = [];

    this.setState({ loading: false })
    // nhập
    if (
      (this.state.user_current.userRole === "SuperAdmin" &&
        this.state.user_current.userType === "General") ||
      (this.state.user_current.userRole === "SuperAdmin" &&
        this.state.user_current.userType === "Agency")
    ) {
      valueimport = data.data.data.IMPORT_CYLINDER;
    } else {
      valueimport = data.data.data.IMPORT_CELL_CYLINDER;
    }

    let allcylinderimport = [];
    let arrimportnew = [];
    let arrimportold = [];
    // tồn kho
    let valueinventory = data.data.data.INVENTORY_CYLINDER;
    let allcylinderinventory = [];
    let arrinventorynew = [];
    let arrinventoryold = [];
    // đã bán
    let valuesale = data.data.data.SALE_CYLINDER;
    let allcylindersale = [];
    let arrsalenew = [];
    let arrsaleold = [];
    //hồi lưu
    let valueturnback = data.data.data.TURN_BACK_CYLINDER;
    let allcylinderturnback = [];
    let arrturnbacknew = [];
    let arrturnbackold = [];
    // xuất
    let valueout = data.data.data.EXPORT_CELL_CYLINDER;
    let allcylinderout = [];
    let arroutnew = [];
    let arroutold = [];
    //Lấy mảng danh sách bình tạo mới
    if (value.detail.cylinder[0].code == "New") {
      arrcylindernew = value.detail.cylinder[0].detail.cylinder;
    }
    //Lấy mảng danh sách bình nhập mới
    if (valueimport.detail.cylinder[0].code == "New") {
      arrimportnew = valueimport.detail.cylinder[0].detail.cylinder;
    }
    //Lấy mảng danh sách bình tồn kho mới
    if (valueinventory.detail.cylinder[0].code == "New") {
      arrinventorynew = valueinventory.detail.cylinder[0].detail.cylinder;
    }
    //Lấy mảng danh sách bình đã bán mới
    if (valuesale.detail.cylinder[0].code == "New") {
      arrsalenew = valuesale.detail.cylinder[0].detail.cylinder;
    }
    //Lấy mảng danh sách hồi lưu mới
    if (valueturnback.detail.cylinder[0].code == "New") {
      arrturnbacknew = valueturnback.detail.cylinder[0].detail.cylinder;
    }
    //Lấy mảng danh sách bình xuất mới
    if (valueout.detail.cylinder[0].code == "New") {
      arroutnew = valueout.detail.cylinder[0].detail.cylinder;
    }

    //Lấy mảng danh sách bình tạo cũ
    if (value.detail.cylinder[1].code == "Old") {
      arrcylinderold = value.detail.cylinder[1].detail.cylinder;
    }
    //Lấy mảng danh sách bình nhập cũ
    if (valueimport.detail.cylinder[1].code == "Old") {
      arrimportold = valueimport.detail.cylinder[1].detail.cylinder;
    }
    //Lấy mảng danh sách bình tồn kho cũ
    if (valueinventory.detail.cylinder[1].code == "Old") {
      arrinventoryold = valueinventory.detail.cylinder[1].detail.cylinder;
    }
    //Lấy mảng danh sách bình đã bán cũ
    if (valuesale.detail.cylinder[1].code == "Old") {
      arrsaleold = valuesale.detail.cylinder[1].detail.cylinder;
    }
    //Lấy mảng danh sách bình hồi lưu cũ
    if (valueturnback.detail.cylinder[1].code == "Old") {
      arrturnbackold = valueturnback.detail.cylinder[1].detail.cylinder;
    }
    //Lấy mảng danh sách bình xuất cũ
    if (valueout.detail.cylinder[1].code == "Old") {
      arroutold = valueout.detail.cylinder[1].detail.cylinder;
    }

    // Gộp mảng Tổng số bình đã tạo
    arrcylindernew.map((v) => {
      arrcylinderold.map((value) => {
        if (v.code == value.code) {
          let a = v.count + value.count;
          allcylinder.push({
            name: v.name,
            count: a,
          });
        }
      });
    });
    // Gộp mảng Tổng số bình đã nhập
    arrimportnew.map((v) => {
      arrimportold.map((value) => {
        if (v.code == value.code) {
          let a = v.count + value.count;
          allcylinderimport.push({
            name: v.name,
            count: a,
          });
        }
      });
    });
    // Gộp mảng Tổng số bình tồn kho
    arrinventorynew.map((v) => {
      arrinventoryold.map((value) => {
        if (v.code == value.code) {
          let a = v.count + value.count;
          allcylinderinventory.push({
            name: v.name,
            count: a,
          });
        }
      });
    });

    // Gộp mảng Tổng số bình đã bán
    arrsalenew.map((v) => {
      arrsaleold.map((value) => {
        if (v.code == value.code) {
          let a = v.count + value.count;
          allcylindersale.push({
            name: v.name,
            count: a,
          });
        }
      });
    });
    // Gộp mảng Tổng số bình hồi lưu
    arrturnbacknew.map((v) => {
      arrturnbackold.map((value) => {
        if (v.code == value.code) {
          let a = v.count + value.count;
          allcylinderturnback.push({
            name: v.name,
            count: a,
          });
        }
      });
    });
    // Gộp mảng Tổng số bình xuất
    arroutnew.map((v) => {
      arroutold.map((value) => {
        if (v.code == value.code) {
          let a = v.count + value.count;
          allcylinderout.push({
            name: v.name,
            count: a,
          });
        }
      });
    });
    //Lấy Tổng bình tạo cũ và mới
    value.detail.cylinder.map((v) => {
      if (v.code == "New") {
        news = v.count;
      } else {
        old = v.count;
      }
    });

    //Lấy Tổng bình xuất cũ
    valueout.detail.cylinder.map((v) => {
      if (v.code == "Old") {
        oldout = v.count;
      }
    });

    //Lấy Tổng bình nhập cũ
    valueimport.detail.cylinder.map((v) => {
      if (v.code == "Old") {
        oldimport = v.count;
      }
    });
    console.log("arrcylindernew", arrcylindernew);
    this.setState({
      //tạo
      listcylindercreate: allcylinder,
      listcylindernew: arrcylindernew,
      listcylinderold: arrcylinderold,
      countcylindercreate: value.count,
      countcylindernew: news,
      countcylinderold: old,
      //nhập
      countcylinderimport: valueimport.count,
      listcylinderimport: allcylinderimport,
      countimportold: oldimport,
      listimportold: arrimportold,
      //tồn kho
      countcylinderinventory: valueinventory.count,
      listcylinderinventory: allcylinderinventory,
      //đã bán
      countcylindersale: valuesale.count,
      listcylindersale: allcylindersale,
      //hồi lưu
      countcylinderturnback: valueturnback.count,
      listcylinderturnback: allcylinderturnback,
      //xuất
      countoutold: oldout,
      listoutold: arroutold,
    });
  }

  async getBranch() {
    var user_cookies = await getUserCookies();
    let data = await getAllStation(user_cookies.user.id);
    let arr = [];
    data.data.data.map((v, i) => {
      arr.push({
        label: v.name,
        value: i,
        id: v.id,
        userTypes: v.userType,
      });
    });
    this.setState({
      listBranch: arr,
    });
  }
  handleChangeBranch = async (langValue) => {
    let arrstation = [];
    await this.setState({
      id: langValue.id,
      userTypeBranch: langValue.userTypes,
      values: langValue.label,
    });
    let data = await getAllBranch(langValue.id);

    data.data.data.map((v, i) => {
      arrstation.push({
        label: v.name,
        value: i,
        id: v.id,
        userTypes: v.userType,
      });
    });
    this.setState({
      listStation: arrstation,
    });
  };
  handleChangeStation = async (langValue) => {
    await this.setState({
      valuesstation: langValue.label,
      idstation: langValue.id,
      userTypeStation: langValue.userTypes,
    });
  };
  handleCheckbox = async (langValue) => {
    this.setState({
      checkbox: langValue.target.checked,
    });
  };
  async setDefaultSelectBoxExcel() {
    let { user_current } = this.state;
    this.setState({
      current_input_type: user_current.userType,
      current_input_role: user_current.userRole,
    });
    this.filterParamsSelect(user_current.userType, user_current.userRole);
  }

  async getImportHistory() {
    let historyImport = await getHistoryImportAPI("to", 0);
    let sortHistoryImportDecs = [];
    let j = 0;
    for (let i = historyImport.data.length - 1; i >= 0; i--) {
      sortHistoryImportDecs[j] = historyImport.data[i];
      j++;
    }
    let historyExport = await getHistoryImportAPI("from", 0);
    let sortHistoryExportDecs = [];
    let n = 0;
    for (let m = historyExport.data.length - 1; m >= 0; m--) {
      sortHistoryExportDecs[n] = historyExport.data[m];
      n++;
    }
    let top10DataImport = await this.giveTop10DataExport(sortHistoryImportDecs);
    let top10DataExport = await this.giveTop10DataExport(sortHistoryExportDecs);
    this.setState({
      allDataImport: sortHistoryImportDecs,
      allDataExport: sortHistoryExportDecs,
      historyExport: top10DataExport,
      historyImport: top10DataImport,
    });
  }

  async getAllReports(
    startDate = this.state.startDateSubmit,
    endDate = this.state.endDateSubmit
  ) {
    let resultImport = await getReportByUserAPI({ startDate, endDate });
    if (resultImport.status === 200 || resultImport.status === 201) {
      if (resultImport.data.hasOwnProperty("err_msg")) {
        //let resultExport=await getReportByUserAPI("EXPORT");
        showToast(resultImport.data.err_msg);
      } else {
        this.setState({ resultImport: resultImport.data });
      }
    }
  }

  getChildAndNumberImportFunc = async (
    target_id = this.state.user_current.id,
    action,
    begin,
    end,
    statisticalType,
    typeOfChildren,
    search1,
    search2,
    search3,
    search4,
    search5
  ) => {
    let dataChart = await getChildAndNumberExportAPI(
      target_id,
      action,
      begin,
      end,
      statisticalType,
      typeOfChildren,
      search1,
      search2,
      search3,
      search4,
      search5
    );

    // const arr1 = dataChart.data.data.slice(0, 11)
    const arr = [];
    // let a= 0;
    if (dataChart.status === 200 || dataChart.status === 201) {
      if (dataChart.data.hasOwnProperty("err_msg")) {
        showToast(dataChart.data.err_msg);
      } else {
        if (
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.userTypeBranch == "Fixer" &&
            this.state.dataObjectCheckedID !== 0 &&
            this.state.checkbox !== true) ||
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.user_current.userType == "Fixer")
        ) {
          for (let databar of dataChart.data.data.cylinders) {
            for (let data of databar.detail.cylinders) {
              if (data.code == "New") {
                this.setState({
                  countnew: data.count,
                });
              } else {
                this.setState({
                  countold: data.count,
                });
              }
            }
            arr.push({
              name: databar.name,
              //name: this.translateReportChart(itemPieChart),
              "Bình mới": this.state.countnew,
              "Bình cũ": this.state.countold,
              amt: 1200,
            });
          }
          this.setState({ dataBarChart: arr });
        }
        console.log("datatada", this.state.dataBarChart);
        if (
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.userTypeBranch == "Region" &&
            this.state.dataObjectCheckedID !== 0 &&
            this.state.checkbox !== true) ||
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.user_current.userType == "Region")
        ) {
          for (let databar of dataChart.data.data) {
            if (databar.type == "Warehouse") {
              databar.list.map((v) => {
                arr.push({
                  name: v.name,
                  //name: this.translateReportChart(itemPieChart),
                  bình: v.count,
                  amt: 1200,
                });
              });
            }
          }
          this.setState({ dataBarChart: arr });
        }
        if (
          this.state.dataObjectCheckedID === 0 &&
          this.state.user_current.userType !== "Fixer" &&
          this.state.user_current.userRole !== "Owner" &&
          this.state.user_current.userType !== "General" &&
          this.state.user_current.userType !== "Agency"
        ) {
          for (let databar of dataChart.data.data) {
            // a= a+ itemPieChart.count;
            for (let value of databar.list) {
              arr.push({
                name: value.name,
                //name: this.translateReportChart(itemPieChart),
                bình: value.count,
                amt: 1200,
              });
            }
          }
          this.setState({ dataBarChart: arr });
        }
        if (
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.userTypeStation == "Factory" &&
            this.state.checkbox == true &&
            this.state.dataObjectCheckedID !== 0) ||
          (this.state.user_current.userRole == "Owner" &&
            this.state.user_current.userType == "Factory") ||
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.user_current.userType == "General") ||
          (this.state.user_current.userRole == "SuperAdmin" &&
            this.state.user_current.userType == "Agency")
        ) {
          for (let databar of dataChart.data.data.cylinders) {
            arr.push({
              name: databar.name,
              //name: this.translateReportChart(itemPieChart),
              bình: databar.count,
              amt: 1200,
            });
          }
          this.setState({
            dataBarChart: arr,
          });
          console.log(this.state.dataBarChart);
        }

        // if(this.state.user_current.userRole=="SuperAdmin"&&this.state.user_current.userType=="Factory"){
        //   arr.push({
        //     name: value.name,
        //     //name: this.translateReportChart(itemPieChart),
        //     bình: value.count,
        //     amt: 1200
        //   });
        // }
        // //Công ty mẹ
        // if(this.state.user_current.userRole=="SuperAdmin"&&this.state.user_current.userType=="Region"){
        //   arr.push({
        //     name: value.name,
        //     //name: this.translateReportChart(itemPieChart),
        //     bình: value.count,
        //     amt: 1200
        //   });
        // }
      }
    }
  };
  getTopExportCylinder = async () => {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = {
      id: user_cookies.user.id,
    };
    await callApi("POST", TOPEXPORTCYLINDER, params, token).then((res) => {
      const arrTopCylinder = [];
      for (let i = 0; i < 10; i++) {
        arrTopCylinder.push(res.data.data[i]);
      }
      this.setState({
        listTopExportCylinder: arrTopCylinder,
      });
    });
  };
  getUser() {
    const { dispatch } = this.props;
    const user = dispatch(getCookie("user"));
    if (typeof user !== "undefined") this.setState({ user: JSON.parse(user) });
  }

  handleChange = (date, params) => {
    console.log("ssss", date)
    let dateFormat = date.format("MM/DD/YYYY");
    const { endDate, startDate } = this.state;
    if (params === 0) {
      if (date <= endDate || endDate === "") {
        this.setState(
          {
            startDate: date,
            startDateSubmit: dateFormat,
          },
          () => {
            this.handleButtonChangeCalendar();
            this.getAllReports(
              this.state.startDateSubmit,
              this.state.endDateSubmit
            );
          }
        );
        return;
      }

      showToast("Ngày Bắt đầu không được lớn hơn ngày kết thúc");
      return false;
    } else {
      if (date >= startDate || startDate === "") {
        this.setState(
          {
            endDate: date,
            endDateSubmit: dateFormat,
          },
          () => {
            this.getAllReports(
              this.state.startDateSubmit,
              this.state.endDateSubmit
            );
            this.handleButtonChangeCalendar();
          }
        );
        return;
      }
      showToast("Ngày Bắt đầu không được lớn hơn ngày kết thúc");
      return false;
    }
  };
  updateAllowReport = async (checked) => {
    const data = await updateAllowReportApi(checked);
    let user_cookies = await getUserCookies();
    const { dispatch } = this.props;
    user_cookies.user.allowReport = data.data.allowReport;
    await dispatch(setCookie("user", user_cookies));
    console.log(data);
  };

  handleChangeReport = (checked) => {
    console.log(checked);
    this.setState({ checked }, () => {
      this.updateAllowReport(this.state.checked);
    });
  };

  renderButtonIsPublic() {
    if (!!this.state.user) {
      if (
        this.state.user.user.owner ||
        (this.state.user.user.userType === "Factory" &&
          this.state.user.user.userRole === "SuperAdmin")
      ) {
        return null;
      } else
        return (
          <div
            className="form-group"
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <label style={{ width: 150 }}>Mở cho TNSH xem</label>
            <Switch
              onChange={this.handleChangeReport}
              checked={this.state.checked}
            />
          </div>
        );
    } else {
      return null;
    }
  }

  apiReportTurnBackInfoAPIFUC = async (
    target_id = "",
    factory_id = "",
    startDate = this.state.startDateSubmit,
    endDate = this.state.endDateSubmit
  ) => {
    const data = await apiReportTurnBackInfoAPI(
      target_id,
      factory_id,
      startDate,
      endDate
    );
    this.setState({
      infoReportTurnback: data.data,
    });
  };
  getReportPieChartWhenClick = async (
    target_id,
    end,
    statisticalType,
    typeOfChildren,
    searchs1,
    searchs2,
    searchs3,
    searchs4,
    searchs5
  ) => {
    let data = await getReportPieChartAPI(
      target_id,
      end,
      statisticalType,
      typeOfChildren,
      searchs1,
      searchs2,
      searchs3,
      searchs4,
      searchs5
    );

    const arrPieChart = [];
    const checkArrChart = [];

    if (
      this.state.user_current.userRole == "SuperAdmin" &&
      this.state.user_current.userType == "Fixer"
    ) {
      for (let databar of data.data.data.cylinders) {
        for (let data of databar.detail.cylinders) {
          if (data.code == "New") {
            this.setState({
              countnew: data.count,
            });
          } else {
            this.setState({
              countold: data.count,
            });
          }
        }
        arrPieChart.push({
          name: databar.name,
          //name: this.translateReportChart(itemPieChart),
          "Bình mới": this.state.countnew,
          "Bình cũ": this.state.countold,
          amt: 1200,
        });
      }
      this.setState({ dataPieChart: arrPieChart });
    }
    if (
      this.state.dataObjectCheckedID === 0 &&
      this.state.user_current.userType !== "Fixer" &&
      this.state.user_current.userType !== "Region" &&
      this.state.user_current.userRole !== "Owner" &&
      this.state.user_current.userType !== "General" &&
      this.state.user_current.userType !== "Agency"
    ) {
      for (let itemPieChart of data.data.data) {
        for (let itemPieChart1 of itemPieChart.list) {
          arrPieChart.push({
            name: itemPieChart1.name,
            value: itemPieChart1.count,
          });
        }
      }
      this.setState({
        dataPieChart: arrPieChart,
      });
      console.log(this.state.dataPieChart);
    }

    if (
      this.state.user_current.userRole == "SuperAdmin" &&
      this.state.userTypeBranch == "Fixer" &&
      this.state.dataObjectCheckedID !== 0 &&
      this.state.checkbox !== true
    ) {
      for (let databar of data.data.data.cylinders) {
        for (let data of databar.detail.cylinders) {
          if (data.code == "New") {
            this.setState({
              countnew: data.count,
            });
          } else {
            this.setState({
              countold: data.count,
            });
          }
        }
        arrPieChart.push({
          name: databar.name,
          //name: this.translateReportChart(itemPieChart),
          "Bình mới": this.state.countnew,
          "Bình cũ": this.state.countold,
          amt: 1200,
        });
      }
      this.setState({ dataPieChart: arrPieChart });
    }
    if (
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeStation == "Factory" &&
        this.state.dataObjectCheckedID !== 0 &&
        this.state.checkbox == true) ||
      (this.state.user_current.userRole == "Owner" &&
        this.state.user_current.userType == "Factory") ||
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.user_current.userType == "General") ||
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.user_current.userType == "Agency")
    ) {
      for (let itemPieChart of data.data.data.cylinders) {
        arrPieChart.push({
          name: itemPieChart.name,
          //name: this.translateReportChart(itemPieChart),
          value: itemPieChart.count,
        });
      }
      this.setState({
        dataPieChart: arrPieChart,
      });
      console.log(this.state.dataPieChart);
    }
    if (
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeBranch == "Region" &&
        this.state.checkbox !== true) ||
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.user_current.userType == "Region")
    ) {
      for (let itemPieChart of data.data.data) {
        if (itemPieChart.type == "Warehouse") {
          itemPieChart.list.map((v) => {
            arrPieChart.push({
              name: v.name,
              //name: this.translateReportChart(itemPieChart),
              value: v.count,
            });
          });
        }
      }
      this.setState({
        dataPieChart: arrPieChart,
      });
    }

    if (this.state.dataObjectCheckedID === 4) {
      for (let itemPieChart of data.data.data.cylinders) {
        arrPieChart.push({
          name: itemPieChart.name,
          value: itemPieChart.count,
        });
      }
    }
    arrPieChart.map(async (item) => {
      if (item.value === 0) {
        await checkArrChart.push(item);
      }
    });
    if (checkArrChart.length === arrPieChart.length) {
      this.setState({ checkDataChart: checkArrChart });
    } else {
      this.setState({ checkDataChart: [] });
    }
    this.setState({
      dataTableChart: data.data,
    });
  };

  handleButtonChangeCalendar = async () => {
    if (this.state.user_current.userType === "General") {
      await this.apiReportTurnBackInfoAPIFUC(
        this.state.itemDataObject5.id,
        this.state.itemDataObject5.parentRoot,
        this.state.startDateSubmit,
        this.state.endDateSubmit
      );
    } else {
      if (this.state.dataObjectCheckedID1 === "") {
        await this.apiReportTurnBackInfoAPIFUC(
          this.state.user_current.id,
          this.state.user_current.parentRoot,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else if (this.state.dataObjectCheckedIDChild === 0) {
        await this.apiReportTurnBackInfoAPIFUC(
          this.state.itemData.id,
          this.state.itemData.parentRoot,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else if (this.state.dataObjectCheckedIDChild !== 0) {
        if (this.state.dataObjectCheckedTNMBFACID === "") {
          await this.apiReportTurnBackInfoAPIFUC(
            this.state.itemData.id,
            this.state.itemData.parentRoot,
            this.state.startDateSubmit,
            this.state.endDateSubmit
          );
        } else {
          if (this.state.dataObjectCheckedIDChild === 1) {
            if (
              this.state.dataObjectCheckedGENARALID === 0 ||
              this.state.dataObjectAgencyGeneralID === ""
            ) {
              await this.apiReportTurnBackInfoAPIFUC(
                this.state.itemDataObject4.id,
                this.state.itemDataObject4.parentRoot,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            } else {
              await this.apiReportTurnBackInfoAPIFUC(
                this.state.itemDataObject5.id,
                this.state.itemDataObject5.parentRoot,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            }
          } else {
            await this.apiReportTurnBackInfoAPIFUC(
              this.state.itemDataObject4.id,
              this.state.itemDataObject4.parentRoot,
              this.state.startDateSubmit,
              this.state.endDateSubmit
            );
          }
        }
      }
    }
  };
  handleButtonFindDataChart = async () => {
    if (
      this.state.user_current.userRole == "SuperAdmin" &&
      this.state.user_current.userType == "Factory" &&
      this.state.dataObjectCheckedID === ""
    ) {
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        loading: true,
      });
    }
    //Cty mẹ
    console.log(
      "this.state.user_current.userRole",
      this.state.dataObjectCheckedID
    );
    if (this.state.id && this.state.dataObjectCheckedID !== 0) {
      if (
        this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeStation == "Factory" &&
        this.state.checkbox == true
      ) {
        this.getReportPieChartWhenClick(
          this.state.idstation,
          this.state.endDate,
          "byItself",
          "",
          "WEIGHT",
          "ALL",
          "CLASS",
          "New",
          "Old"
        );
        this.getChildAndNumberImportFunc(
          this.state.idstation,
          "EXPORT_CYLINDER",
          this.state.startDate,
          this.state.endDate,
          this.state.dataObjectCheckedID === 0 ? "byItsChildren" : "byItself",
          this.state.dataObjectCheckedID === 0 ? "Region" : undefined,
          "WEIGHT",
          "ALL"
        );
        await this.ToTalCylinderCreate(
          this.state.idstation,
          this.state.startDate,
          this.state.endDate,
          "byItself",
          undefined,
          "CREATED_CYLINDER",
          "IMPORT_CELL_CYLINDER",
          "EXPORT_CELL_CYLINDER",
          "SALE_CYLINDER",
          "TURN_BACK_CYLINDER"
        );
        this.setState({
          loading: false,
        });
      }
      if (
        this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeBranch == "Fixer" &&
        this.state.checkbox !== true
      ) {
        this.getReportPieChartWhenClick(
          this.state.id,
          //this.state.endDate
          this.state.endDate,
          "byItself",
          "",
          "WEIGHT",
          "ALL",
          "CLASS",
          "New",
          "Old"
        );
        this.getChildAndNumberImportFunc(
          this.state.id,
          "OUT_CYLINDER",
          this.state.startDate,
          this.state.endDate,
          this.state.dataObjectCheckedID === 0 ? "byItsChildren" : "byItself",
          this.state.dataObjectCheckedID === 0 ? "Region" : undefined,
          "WEIGHT",
          "ALL",
          "CLASS",
          "New",
          "Old"
        );
        await this.ToTalCylinderCreate(
          this.state.id,
          this.state.startDate,
          this.state.endDate,
          "byItself",
          undefined,
          "CREATED_CYLINDER",
          "IMPORT_CELL_CYLINDER",
          "EXPORT_CELL_CYLINDER",
          "SALE_CYLINDER",
          "TURN_BACK_CYLINDER"
        );
        this.setState({
          loading: false,
        });
      }
      if (
        this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeBranch == "Region" &&
        this.state.checkbox !== true
      ) {
        this.getReportPieChartWhenClick(
          this.state.id,
          //this.state.endDate
          this.state.endDate,
          "byItsChildren",
          "ALL",
          "WEIGHT",
          "ALL"
        );
        this.getChildAndNumberImportFunc(
          this.state.id,
          "EXPORT_CYLINDER",
          this.state.startDate,
          this.state.endDate,
          "byItsChildren",
          "ALL",
          "WEIGHT",
          "ALL"
        );
        await this.ToTalCylinderCreate(
          this.state.id,
          this.state.startDate,
          this.state.endDate,
          "byItsChildren",
          "ALL",
          "CREATED_CYLINDER",
          "IMPORT_CELL_CYLINDER",
          "EXPORT_CELL_CYLINDER",
          "SALE_CYLINDER",
          "TURN_BACK_CYLINDER"
        );
        this.setState({
          loading: false,
        });
      }
    }
    if (
      this.state.user_current.userRole == "Owner" &&
      this.state.user_current.userType == "Factory"
    ) {
      this.getReportPieChartWhenClick(
        this.state.user_current.id,
        //this.state.endDate
        this.state.endDate,
        "byItself",
        "",
        "WEIGHT",
        "ALL",
        "CLASS",
        "New",
        "Old"
      );
      this.getChildAndNumberImportFunc(
        this.state.user_current.id,
        "EXPORT_CYLINDER",
        this.state.startDate,
        this.state.endDate,
        "byItself",
        undefined,
        "WEIGHT",
        "ALL"
      );
      await this.ToTalCylinderCreate(
        this.state.user_current.id,
        this.state.startDate,
        this.state.endDate,
        "byItself",
        undefined,
        "CREATED_CYLINDER",
        "IMPORT_CELL_CYLINDER",
        "EXPORT_CELL_CYLINDER",
        "SALE_CYLINDER",
        "TURN_BACK_CYLINDER"
      );
      this.setState({
        loading: false,
      });
    }
    if (
      this.state.user_current.userRole == "SuperAdmin" &&
      this.state.user_current.userType == "Region"
    ) {
      this.getReportPieChartWhenClick(
        this.state.user_current.id,
        //this.state.endDate
        this.state.endDate,
        "byItsChildren",
        "ALL",
        "WEIGHT",
        "ALL"
      );
      this.getChildAndNumberImportFunc(
        this.state.user_current.id,
        "EXPORT_CYLINDER",
        this.state.startDate,
        this.state.endDate,
        "byItsChildren",
        "ALL",
        "WEIGHT",
        "ALL"
      );
      await this.ToTalCylinderCreate(
        this.state.user_current.id,
        this.state.startDate,
        this.state.endDate,
        "byItsChildren",
        "ALL",
        "CREATED_CYLINDER",
        "IMPORT_CELL_CYLINDER",
        "EXPORT_CELL_CYLINDER",
        "SALE_CYLINDER",
        "TURN_BACK_CYLINDER"
      );
      this.setState({
        loading: false,
      });
    }
    if (
      this.state.user_current.userRole == "SuperAdmin" &&
      this.state.user_current.userType == "Fixer"
    ) {
      this.getReportPieChartWhenClick(
        this.state.user_current.id,
        //this.state.endDate
        this.state.endDate,
        "byItself",
        "",
        "WEIGHT",
        "ALL",
        "CLASS",
        "New",
        "Old"
      );
      this.getChildAndNumberImportFunc(
        this.state.user_current.id,
        "OUT_CYLINDER",
        this.state.startDate,
        this.state.endDate,
        "byItself",
        undefined,
        "WEIGHT",
        "ALL",
        "CLASS",
        "New",
        "Old"
      );
      await this.ToTalCylinderCreate(
        this.state.user_current.id,
        this.state.startDate,
        this.state.endDate,
        "byItself",
        undefined,
        "CREATED_CYLINDER",
        "IMPORT_CELL_CYLINDER",
        "EXPORT_CELL_CYLINDER",
        "SALE_CYLINDER",
        "TURN_BACK_CYLINDER"
      );
      this.setState({
        loading: false,
      });
    }

    if (
      (this.state.user_current.userRole === "SuperAdmin" &&
        this.state.user_current.userType === "General") ||
      (this.state.user_current.userRole === "SuperAdmin" &&
        this.state.user_current.userType === "Agency")
    ) {
      this.getReportPieChartWhenClick(
        this.state.user_current.id,
        //this.state.endDate
        this.state.endDate,
        "byItself",
        "",
        "WEIGHT",
        "ALL",
        "CLASS",
        "New",
        "Old"
      );
      this.getChildAndNumberImportFunc(
        this.state.user_current.id,
        "EXPORT_CYLINDER",
        this.state.startDate,
        this.state.endDate,
        "byItself",
        undefined,
        "WEIGHT",
        "ALL"
      );
      await this.ToTalCylinderCreate(
        this.state.user_current.id,
        this.state.startDate,
        this.state.endDate,
        "byItself",
        undefined,
        "CREATED_CYLINDER",
        "IMPORT_CELL_CYLINDER",
        "EXPORT_CELL_CYLINDER",
        "SALE_CYLINDER",
        "TURN_BACK_CYLINDER",
        "IMPORT_CYLINDER"
      );
      this.setState({
        loading: false,
      });
    } else {
      if (
        this.state.dataObjectCheckedID === 0 &&
        this.state.user_current.userType !== "Fixer" &&
        this.state.user_current.userType !== "Region" &&
        this.state.user_current.userRole !== "Owner" &&
        this.state.user_current.userType !== "General" &&
        this.state.user_current.userType !== "Agency"
      ) {
        this.getReportPieChartWhenClick(
          this.state.user_current.id,
          this.state.endDate,
          this.state.dataObjectCheckedID === 0 ? "byItsChildren" : "byItself",
          this.state.dataObjectCheckedID === 0 ? "Region" : undefined
        );
        this.getChildAndNumberImportFunc(
          this.state.user_current.id,
          "EXPORT_CYLINDER",
          this.state.startDate,
          this.state.endDate,
          this.state.dataObjectCheckedID === 0 ? "byItsChildren" : "byItself",
          this.state.dataObjectCheckedID === 0 ? "Region" : undefined
        );
        await this.ToTalCylinderCreate(
          this.state.user_current.id,
          this.state.startDate,
          this.state.endDate,
          this.state.dataObjectCheckedID === 0 ? "byItsChildren" : "byItself",
          this.state.dataObjectCheckedID === 0 ? "Region" : undefined,
          "CREATED_CYLINDER",
          "IMPORT_CELL_CYLINDER",
          "EXPORT_CELL_CYLINDER",
          "SALE_CYLINDER",
          "TURN_BACK_CYLINDER"
        );
        this.setState({
          loading: false,
        });
        return;
      }
    }
  };

  handleButtonExportExcel = async () => {
    let dataList = [];
    //console.log("this.state.dataObjectCheckedIDChild", this.state.dataObjectCheckedIDChild);
    let { dataValueReports } = this.state;
    if (!dataValueReports) {
      showToast("Vui Lòng Chọn Kiểu Xuất Excel!!");
      return;
    }
    if (this.state.id && this.state.dataObjectCheckedID !== 0) {
      if (
        this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeStation == "Factory" &&
        this.state.checkbox == true
      ) {
        await getReportExcelByTargetAndDateTimeAPI(
          [this.state.idstation],
          this.state.dataValueReports,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else {
        await getReportExcelByTargetAndDateTimeAPI(
          [this.state.id],
          this.state.dataValueReports,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      }
    } else {
      this.setState({
        loading: true
      })
      await getReportExcelByTargetAndDateTimeAPI(
        [this.state.user_current.id],
        this.state.dataValueReports,
        this.state.startDate,
        this.state.endDate
      );
      this.setState({
        loading: false
      })
    }
    // if (this.state.user_current.userType === "General") {
    //   await getReportExcelByTargetAndDateTimeAPI(
    //     [this.state.itemDataObject5.id],
    //     this.state.dataValueReports,
    //     this.state.startDateSubmit,
    //     this.state.endDateSubmit
    //   );
    //   //await this.getReportPieChartWhenClick(this.state.itemDataObject5.id, this.state.itemDataObject5.parentRoot, 1)
    // } else {
    //   if (this.state.dataObjectCheckedID === 0) {
    //     await getReportExcelByTargetAndDateTimeAPI(
    //       [this.state.user_current.id],
    //       this.state.dataValueReports,
    //       this.state.startDateSubmit,
    //       this.state.endDateSubmit
    //     );
    //     return;
    //   }
    //   if (this.state.dataObjectCheckedID1 === "") {
    //     //chưa chọn cấp 1
    //     dataList = this.state.dataChild1.map((item) => {
    //       if (item.value !== "") {
    //         return item.value;
    //       }
    //     });
    //     dataList = dataList.filter((x) => !!x);
    //     await getReportExcelByTargetAndDateTimeAPI(
    //       dataList,
    //       this.state.dataValueReports,
    //       this.state.startDateSubmit,
    //       this.state.endDateSubmit
    //     );
    //   } else if (this.state.dataObjectCheckedIDChild === 0) {
    //     //luc nay đã chọn cấp 1 và chọn cấp 2 tất cả
    //     await getReportExcelByTargetAndDateTimeAPI(
    //       [this.state.itemData.id],
    //       this.state.dataValueReports,
    //       this.state.startDateSubmit,
    //       this.state.endDateSubmit
    //     );
    //   } else if (this.state.dataObjectCheckedIDChild !== 0) {
    //     //luc nay da chon cap 1 va cap 2
    //     if (this.state.dataObjectCheckedTNMBFACID === "") {
    //       dataList = this.state.dataChild3.map((item) => {
    //         if (item.value !== "") {
    //           return item.value;
    //         }
    //       });
    //       dataList = dataList.filter((x) => !!x);
    //       await getReportExcelByTargetAndDateTimeAPI(
    //         dataList,
    //         this.state.dataValueReports,
    //         this.state.startDateSubmit,
    //         this.state.endDateSubmit
    //       );
    //     } else {
    //       if (this.state.dataObjectCheckedIDChild === 1) {
    //         //chon lien tnmb

    //         if (
    //           this.state.dataObjectCheckedGENARALID === 0 ||
    //           this.state.dataObjectCheckedGENARALID === ""
    //         ) {
    //           await getReportExcelByTargetAndDateTimeAPI(
    //             [this.state.dataObjectCheckedTNMBFAC.value],
    //             this.state.dataValueReports,
    //             this.state.startDateSubmit,
    //             this.state.endDateSubmit
    //           );
    //         } else {
    //           if (this.state.dataObjectAgencyGeneralID === "") {
    //             dataList = this.state.dataChild4.map((item) => {
    //               if (item.value !== "") {
    //                 return item.value;
    //               }
    //             });
    //             dataList = dataList.filter((x) => !!x);
    //             await getReportExcelByTargetAndDateTimeAPI(
    //               dataList,
    //               this.state.dataValueReports,
    //               this.state.startDateSubmit,
    //               this.state.endDateSubmit
    //             );
    //           } else
    //             await getReportExcelByTargetAndDateTimeAPI(
    //               [this.state.itemDataObject5.id],
    //               this.state.dataValueReports,
    //               this.state.startDateSubmit,
    //               this.state.endDateSubmit
    //             );
    //         }
    //       } else {
    //         if (
    //           this.state.dataObjectChecked1 === 0 ||
    //           this.state.dataObjectChecked1 === ""
    //         ) {
    //           dataList = this.state.dataChild4.map((item) => {
    //             if (item.value !== "") {
    //               return item.value;
    //             }
    //           });
    //           dataList = dataList.filter((x) => !!x);
    //           await getReportExcelByTargetAndDateTimeAPI(
    //             dataList,
    //             this.state.dataValueReports,
    //             this.state.startDateSubmit,
    //             this.state.endDateSubmit
    //           );
    //         } else {
    //           await getReportExcelByTargetAndDateTimeAPI(
    //             [this.state.itemDataObject4.id],
    //             this.state.dataValueReports,
    //             this.state.startDateSubmit,
    //             this.state.endDateSubmit
    //           );
    //         }
    //       }
    //     }
    //   }
    // }

    // //selectedId
    // console.log(this.state.selectedId);

    // //valueReports
    // console.log(this.state.dataValueReports);

    // //StartDate
    // console.log(this.state.startDateSubmit);
    // //EndDate

    // console.log(this.state.endDateSubmit);
  };

  //TODO đưa vào lúc select đối tượng.
  filterParamsSelect = async (userType, userRole = "") => {
    let valueReports = [];

    switch (userType) {
      case "Factory":
        if (userRole === "SuperAdmin") {
          valueReports = [...ACTION_REPORT_TYPE];
          if (!!valueReports) {
            valueReports[0].label = "Nhập Vỏ";
            valueReports.splice(2, 1);
          }
        } else {
          valueReports = ACTION_REPORT_TYPE.filter(
            (x) =>
              [
                "EXPORT",
                "IMPORT_CELL",
                "FIX",
                "TURN_BACK",
                "CREATE",
                "EXPORT_CELL",
                "NEWS_CELL",
              ].includes(x.value) === true
          );
          valueReports = [...valueReports];
          if (!!valueReports) {
            valueReports[0].label = "Xuất hàng";
            //valueReports[5].label="Xuất vỏ"
          }
        }
        break;
      case "General":
        valueReports = ACTION_REPORT_TYPE.filter(
          (x) =>
            [
              "EXPORT",
              "IMPORT",
              // "TURN_BACK",
              // "IMPORT_CELL",
              // "FIX",
              // "CREATE",
              // "EXPORT_CELL",
              // "NEWS_CELL",
            ].includes(x.value) === true
        );
        valueReports = [...valueReports];
        valueReports[0].label = "Nhập Bình";
        break;
      case "Agency":
        valueReports = ACTION_REPORT_TYPE.filter(
          (x) =>
            [
              "SALE",
              "IMPORT",

            ].includes(x.value) === true
        );
        valueReports = [...valueReports];
        valueReports[0].label = "Nhập Bình";
        break;
      case "Fixer":
        valueReports = ACTION_REPORT_TYPE.filter(
          (x) =>
            [
              "IMPORT_CELL",
              "EXPORT_CELL",
              "TURN_BACK",
              "IMPORT",
              "EXPORT",
              "FIX",
              "CREATE",
              "NEWS_CELL",
            ].includes(x.value) === true
        );
        valueReports = [...valueReports];
        valueReports[0].label = "Nhập Vỏ";
        break;
      default:
        if (userRole === SuperAdmin) {
          valueReports = [...ACTION_REPORT_TYPE];
        } else {
          valueReports = ACTION_REPORT_TYPE.filter(
            (x) =>
              [
                "EXPORT",
                "IMPORT",
                "FIX",
                "TURN_BACK",
                "IMPORT_CELL",
                "EXPORT_CELL",
                "FIX",
                "CREATE",
                "NEWS_CELL",
              ].includes(x.value) === true
          );
        }
        break;
    }
    this.setState({ valueReports });
  };

  //đối tượng 1
  changeDataChoose1 = async (userType = "", user_id) => {
    //{ label: "Chi nhánh trực thuộc", value: "" }
    const arrData = [];
    const data = await getReportChildsAPI(userType, user_id);
    data.data.map((item) => {
      arrData.push({ label: item.name, value: item.id, itemData: item });
    });
    this.setState({ dataChild1: arrData });
    console.log(data);
  };
  handleObjectPickTypeOfReportExcel = async (value) => {
    this.setState({
      actionTypeReportExcel: value.value,
      dataValueReports: value.value,
    });
  };

  //Danh sách chi nhánh
  handleObjectData1 = async (langValue) => {
    this.resetData(2);
    this.setState(
      {
        dataObjectChecked1: langValue,
        dataObjectCheckedID1: langValue.value,
        itemData: langValue.itemData,
        dataObjectCheckedIDChild: 0,
        selectedId: langValue.value,
      },
      () => {
        !!this.state.dataObjectChecked1.itemData
          ? this.filterParamsSelect(
            this.state.dataObjectChecked1.itemData.userType,
            this.state.dataObjectChecked1.itemData.userRole
          )
          : "";
      }
    );
  };
  handleObjectData = async (langValue) => {
    this.resetData(1);
    console.log("lon", langValue);
    this.setState(
      { dataObjectChecked: langValue, dataObjectCheckedID: langValue.value },
      () => {
        console.log("checkdata", this.state.dataObjectCheckedID);
        let { user_current } = this.state;
        switch (this.state.dataObjectCheckedID) {
          case 0:
            this.getReportPieChartWhenClick("", "", 0);

            this.filterParamsSelect(
              user_current.userType,
              user_current.userRole
            );
            break;

          case 3:
            this.changeDataChoose1(langValue.name, this.state.user_current.id);

            this.filterParamsSelect(langValue.name, null);
            break;
          case 4:
            this.changeDataChoose1(langValue.name, this.state.user_current.id);

            this.filterParamsSelect(langValue.name, null);
            break;
          case 5:
            this.changeDataChoose1(langValue.name, this.state.user_current.id);

            this.filterParamsSelect(langValue.name, null);
            break;
        }

        // if (this.state.dataObjectCheckedID !== 0) {

        // } else {

        // }
      }
    );
  };

  handleObjectDataChild = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedChild: langValue,
        dataObjectCheckedIDChild: langValue.value,
      },
      () => {
        this.changeDataChoose4(langValue.name, this.state.itemData.id);
        console.log("lon", langValue);
        if (langValue.value === 0) {
          this.filterParamsSelect(
            !!this.state.dataObjectChecked
              ? this.state.dataObjectChecked.name
              : "Factory",
            ""
          );
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
      }
    );
  };
  handleObjectDataChildCTC = async (langValue) => {
    this.resetData(1);
    console.log("lon", langValue);
    this.setState(
      {
        dataObjectCheckedChild: langValue,
        dataObjectCheckedIDChild: langValue.value,
        //label: "Chi nhánh trực thuộc", value: 0
        dataObjectCheckedTNMBFAC: {},
      },
      () => {
        this.changeDataChoose4(langValue.name, this.state.user_current.id);
        console.log("lon", langValue);
        if (langValue.value === 0) {
          this.getReportPieChartWhenClick("", "", 0);
          let { user_current } = this.state;
          this.filterParamsSelect(user_current.userType, user_current.userRole);
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
        //this.filterParamsSelect(langValue.name,null);
      }
    );
  };
  //đối tượng 4

  changeDataChoose4 = async (userType = "", user_id) => {
    //{ label: "Chi nhánh trực thuộc", value: "" }
    const arrData = [];
    const data = await getReportChildsAPI(userType, user_id);
    data.data.map((item) => {
      arrData.push({ label: item.name, value: item.id, itemData: item });
    });
    //dataChild3 cấp 3
    this.setState({ dataChild3: arrData });
  };
  handleObjectDataChildTNMB = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedTNMBFAC: langValue,
        dataObjectCheckedTNMBFACID: langValue.value,
        itemDataObject4: langValue.itemData,
        selectedId: langValue.value,
      },
      () => {
        !!this.state.dataObjectCheckedTNMBFAC.itemData
          ? this.filterParamsSelect(
            this.state.dataObjectCheckedTNMBFAC.itemData.userType,
            this.state.dataObjectCheckedTNMBFAC.itemData.userRole
          )
          : "";
      }
    );
  };

  //handleObjectDataGENARALFAC
  handleObjectDataGENARALFAC = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedGENARAL: langValue,
        dataObjectCheckedGENARALID: langValue.value,
      },
      () => {
        this.changeDataChoose5(
          langValue.name,
          this.state.dataObjectCheckedTNMBFACID
        );
        if (langValue.value === 0) {
          this.filterParamsSelect(
            !!this.state.dataObjectCheckedChild
              ? this.state.dataObjectCheckedChild.name
              : "Factory",
            ""
          );
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
      }
    );
  };

  //Genaral login
  handleObjectDataGENARAL = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedGENARAL: langValue,
        dataObjectCheckedGENARALID: langValue.value,
      },
      () => {
        this.changeDataChoose5(langValue.name, this.state.user_current.id);
        if (langValue.value === 0) {
          this.filterParamsSelect(user_current.userType, user_current.userRole);
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
      }
    );
  };
  changeDataChoose5 = async (userType = "", user_id) => {
    //{ label: "Chi nhánh trực thuộc", value: "" }
    const arrData = [];
    const data = await getReportChildsAPI(userType, user_id);
    data.data.map((item) => {
      arrData.push({ label: item.name, value: item.id, itemData: item });
    });
    //dataChild4 cấp 4
    this.setState({ dataChild4: arrData });
  };
  handleObjectDataAgencyGeneral = async (langValue) => {
    this.setState(
      {
        dataObjectAgencyGeneral: langValue,
        dataObjectAgencyGeneralID: langValue.value,
        itemDataObject5: langValue.itemData,
        selectedId: langValue.value,
        dataValueReports: "",
      },
      () => {
        !!this.state.dataObjectAgencyGeneral.itemData
          ? this.filterParamsSelect(
            this.state.dataObjectAgencyGeneral.itemData.userType,
            this.state.dataObjectAgencyGeneral.itemData.userRole
          )
          : "";
      }
    );
  };
  callDataTurnBackInfo = async (data) => {
    const dataTurnBack = await callDataTurnBackInfoAPI(data);
    if (dataTurnBack.status === 200 || dataTurnBack.status === 201) {
      this.setState({ dataTurnBacks: dataTurnBack.data });
    }
  };

  renderBarChart() {
    console.log(
      "sdasdasd",
      this.state.itemData,
      this.state.itemDataObject4,
      this.state.itemDataObject5
    );

    if (
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.userTypeBranch == "Fixer" &&
        this.state.dataObjectCheckedID !== 0 &&
        this.state.checkbox !== true) ||
      (this.state.user_current.userRole == "SuperAdmin" &&
        this.state.user_current.userType == "Fixer")
    ) {
      return (
        <div className="card card-body">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              width={500}
              height={300}
              data={this.state.dataBarChart}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Bình mới" stackId="a" fill="green" barSize={20} />
              <Bar dataKey="Bình cũ" stackId="a" fill="red" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label>Biểu đồ xuất hàng</label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card card-body">
          <ShowBarChart dataBarChart={this.state.dataBarChart} />
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              height={500}
              data={this.state.dataBarChart}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                hide="true"
                label={<Text width={10} />}
              ></XAxis>
              <YAxis />
              <Tooltip />
              <Bar dataKey="bình" barSize={20} fill="#33CC00">
                <LabelList dataKey="name" position="bottom" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label>Biểu đồ xuất hàng</label>
          </div>
        </div>
      );
    }
  }

  render() {
    // console.log(
    //   "this.state.dataObjectCheckedID",
    //   this.state.dataObjectCheckedID
    // );

    const { user_current } = this.state;
    const { resultImport, historyExport, historyImport } = this.state;
    console.log("lich su export", this.state);
    //this._getArrayColor(12)
    return (
      <div>
        <main className="main-container container" id="mainContent">
          <ReactCustomLoading isLoading={this.state.loading} />
          <div className="main-content">
            <div className="seednet-header-info allow__btn">
              {this.renderButtonIsPublic()}
            </div>

            <div className="row">
              <div className="card col-lg-12">
                <div className="card-title">
                  <div className="flexbox">
                    <h4>Thống Kê</h4>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-row">
                    <div className="start-date-picker-dashboard date__block col-lg-6 form-group row">
                      <label className="col-form-label start-day">
                        Ngày bắt đầu
                      </label>
                      <DatePicker
                        locale="vi_VN"
                        showPopperArrow={false}
                        selected={this.state.startDate}
                        onChange={(date) => this.handleChange(date, 0)}
                        showMonthDropdown
                        showYearDropdown
                        dateFormat="DD/MM/YYYY"
                        dropdownMode="select"
                      />
                    </div>
                    <div className="end-date-picker-dashboard date__block col-lg-6 form-group row">
                      <label className="start-day col-form-label">
                        Ngày kết thúc
                      </label>
                      <DatePicker
                        locale="vi_VN"
                        showPopperArrow={false}
                        selected={this.state.endDate}
                        onChange={(date) => this.handleChange(date, 1)}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                  </div>

                  <div className="form-row ">
                    {/* <label className="col-form-label">Đối tượng</label> */}
                    <div
                      className="col-lg-6 form-group select-dashboard-input-dashboard"
                      style={{ padding: 0 }}
                    >
                      {user_current.userType === "Factory" &&
                        user_current.userRole === "SuperAdmin" ? (
                        // <div className="select-dashboard-input-dashboard pr-4">

                        <div
                          className="form-group row "
                          style={{ marginLeft: "6px" }}
                        >
                          <label className="col-form-label">Đối tượng</label>
                          <Select
                            options={this.state.objectData}
                            onChange={this.handleObjectData.bind(this)}
                            value={this.state.dataObjectChecked}
                            style={{ marginLeft: "60px" }}
                          />
                        </div>
                      ) : // </div>

                        null}

                      {/* user_current.userType === "Factory" &&
                          user_current.userRole !== "SuperAdmin" ? (
                            // < className="select-dashboard-input-dashboard pr-4">
                            <div
                              className="form-group row "
                              style={{ marginLeft: "6px" }}
                            >
                              <label className=" col-form-label">Đối tượng1</label>
                              <Select
                                options={this.state.objectDataChild}
                                onChange={this.handleObjectDataChildCTC.bind(this)}
                                placeholder="Chọn..."
                                value={this.state.dataObjectCheckedChild}
                                style={{ marginLeft: "60px" }}
                              />
                            </div>
                          ) : */}

                      {/* {this.state.dataObjectCheckedID !== 0 && this.state.dataObjectCheckedID !== 10 ? (
                        <div className="pr-4">
                          <div className="form-group">
                            <label className="col-form-label">Đối tượng1</label>
                            <Select
                              options={this.state.dataChild1}
                              onChange={this.handleObjectData1.bind(this)}
                              placeholder="Chọn..."
                              value={this.state.dataObjectChecked1}
                            />
                          </div>
                        </div>
                      ) : null} */}
                      {this.state.dataObjectCheckedID === 3 &&
                        this.state.dataObjectCheckedID1 !== "" ? (
                        <div className="pr-4">
                          <div className="form-group">
                            {/*<label className="col-form-label">Đối tượng trực thuộc</label>*/}
                            <Select
                              options={this.state.objectDataChild}
                              onChange={this.handleObjectDataChild.bind(this)}
                              placeholder="Chọn..."
                              value={this.state.dataObjectCheckedChild}
                            />
                          </div>
                        </div>
                      ) : null}
                      {this.state.dataObjectCheckedIDChild !== 0 ? (
                        <div className="pr-4">
                          <div className="form-group">
                            {/*<label className="col-form-label">Dữ liệu trực thuộc</label>*/}
                            <Select
                              options={this.state.dataChild3}
                              onChange={this.handleObjectDataChildTNMB.bind(
                                this
                              )}
                              placeholder="Chọn..."
                              value={this.state.dataObjectCheckedTNMBFAC}
                            />
                          </div>
                        </div>
                      ) : null}
                      {this.state.dataObjectCheckedIDChild === 1 &&
                        this.state.dataObjectCheckedTNMBFACID !== "" ? (
                        <div className="pr-4">
                          <div className="form-group">
                            {/*<label className="col-form-label">Lựa chọn đối tượng</label>*/}
                            <Select
                              options={this.state.objectDataChildTNMBFAC}
                              onChange={this.handleObjectDataGENARALFAC.bind(
                                this
                              )}
                              placeholder="Chọn..."
                              value={this.state.dataObjectCheckedGENARAL}
                            />
                          </div>
                        </div>
                      ) : null}
                      {/* {user_current.userType === "General" ? (
                        <div className="pr-4">
                          <div
                            className="form-group row "
                            style={{ marginLeft: "6px" }}
                          >
                            { <label className="col-form-label">Đối tượng tnmb</label> }
                            <label className="col-form-label">Đối tượng1 </label>
                            <Select
                              options={this.state.objectDataChildTNMBFAC}
                              onChange={this.handleObjectDataGENARAL.bind(this)}
                              placeholder="Chọn..."
                              value={this.state.dataObjectCheckedGENARAL}
                              style={{ marginLeft: "56px" }}
                            />
                          </div>
                        </div>
                      ) : null} */}

                      {this.state.dataObjectCheckedGENARALID !== "" ? (
                        <div className="pr-4">
                          <div className="form-group">
                            {/*<label className="col-form-label">Đối tượng trực thuộc</label>*/}
                            <Select
                              options={this.state.dataChild4}
                              onChange={this.handleObjectDataAgencyGeneral.bind(
                                this
                              )}
                              placeholder="Chọn..."
                              value={this.state.dataObjectAgencyGeneral}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {this.state.dataObjectCheckedID === 10 &&
                      this.state.checkbox !== true ? (
                      <div
                        className="col-lg-6 form-group select-dashboard-input-dashboard"
                        style={{ padding: 0 }}
                      >
                        <div
                          className="form-group row "
                          style={{ marginLeft: "6px" }}
                        >
                          <label className="col-form-label">Chi nhánh</label>
                          <Select
                            style={{ marginLeft: "32px" }}
                            options={this.state.listBranch}
                            onChange={this.handleChangeBranch.bind(this)}
                            placeholder="Chọn..."
                            value={{
                              label: this.state.values,
                              value: this.state.values,
                            }}
                          // value={this.state.values}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {(this.state.user_current.userRole == "SuperAdmin" &&
                      this.state.userTypeBranch == "Fixer" &&
                      this.state.dataObjectCheckedID !== 0) ||
                      (this.state.user_current.userRole == "SuperAdmin" &&
                        this.state.userTypeBranch == "Region" &&
                        this.state.dataObjectCheckedID !== 0) ? (
                      <div
                        className="col-lg-6 form-group select-dashboard-input-dashboard"
                        style={{ padding: 0 }}
                      >
                        <div
                          className="form-group row "
                          style={{ marginLeft: "6px" }}
                        >
                          <label className="col-form-label">Trạm</label>
                          <Select
                            style={{ marginLeft: "32px" }}
                            options={this.state.listStation}
                            onChange={this.handleChangeStation.bind(this)}
                            placeholder="Chọn..."
                            value={{
                              label: this.state.valuesstation,
                              value: this.state.valuesstation,
                            }}
                          // value={this.state.values}
                          />
                          <Checkbox
                            className="ml-2 mt-2"
                            onChange={this.handleCheckbox.bind(this)}
                          >
                            Chọn trạm
                          </Checkbox>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-row">
                    <div className="col-lg-6 form-group select-dashboard-input-dashboard">
                      <div className="form-group row">
                        <label className="col-form-label export-excel">
                          Kiểu Xuất Excel
                        </label>
                        <Select
                          options={this.state.valueReports}
                          onChange={this.handleObjectPickTypeOfReportExcel.bind(
                            this
                          )}
                          placeholder="Chọn..."
                          value={this.state.dataValueReports}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-row view__report">
                    <button
                      className="btn btn-primary"
                      onClick={() => this.handleButtonFindDataChart()}
                      type="submit"
                    >
                      Xem thống kê
                    </button>
                    {/* {
                      (user_current.userType === "Factory" && user_current.userRole === "SuperAdmin") ?
                        <button
                          className="btn btn-warning"
                          data-toggle="modal"
                          data-target="#shoe-piechart"
                        >
                          Xem báo cáo
                    </button> : ""
                    } */}

                    <button
                      className="btn btn-success"
                      onClick={() => this.handleButtonExportExcel()}
                      type="submit"
                    >
                      Xuất excel
                    </button>
                  </div>
                </div>
              </div>

              <div className="chart-dashboard col-lg-12 row">
                <div className="col-xs-12 col-lg-6" style={{ paddingLeft: 0 }}>
                  {this.renderBarChart()}
                </div>

                {(this.state.user_current.userRole == "SuperAdmin" &&
                  this.state.userTypeBranch == "Fixer" &&
                  this.state.dataObjectCheckedID !== 0 &&
                  this.state.checkbox !== true) ||
                  (this.state.user_current.userRole == "SuperAdmin" &&
                    this.state.user_current.userType == "Fixer") ? (
                  <div className="card card-body col-lg-6 ">
                    <ResponsiveContainer width="100%" height={500}>
                      <BarChart
                        width={500}
                        height={300}
                        data={this.state.dataPieChart}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="Bình mới"
                          stackId="a"
                          fill="green"
                          barSize={20}
                        />
                        <Bar
                          dataKey="Bình cũ"
                          stackId="a"
                          fill="red"
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <label>Biểu đồ tồn kho</label>
                    </div>
                  </div>
                ) : (
                  <div
                    className="col-lg-6 block__pie_chart "
                    style={{ paddingRight: 0 }}
                  >
                    <div className="card card-body fix-center">
                      <ShowPieChart
                        checkDataChart={this.state.checkDataChart}
                        dataPieChart={this.state.dataPieChart}
                        dataBarChart={this.state.dataBarChart}
                        data={data}
                        renderCustomizedLabel={this.renderCustomizedLabel}
                        COLORS={COLORS}
                        listTopExportCylinder={this.state.listTopExportCylinder}
                      />
                      <ResponsiveContainer height={500} width="100%">
                        <PieChart>
                          <Pie
                            data={
                              this.state.checkDataChart.length === 0
                                ? this.state.dataPieChart
                                : data
                            }
                            labelLine={false}
                            label={this.renderCustomizedLabel}
                            outerRadius={150}
                            cx="50%"
                            cy={180}
                            fill="#FF9900"
                            dataKey="value"
                          >
                            {this.state.checkDataChart.length === 0
                              ? this.state.dataPieChart.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))
                              : data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <label>Biểu đồ tồn kho</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="row ">
                {(this.state.user_current.userRole == "SuperAdmin" &&
                  this.state.userTypeBranch == "Region" &&
                  this.state.dataObjectCheckedID !== 0 &&
                  this.state.checkbox !== true) ||
                  (this.state.user_current.userRole == "SuperAdmin" &&
                    this.state.user_current.userType == "Region") ? (
                  <div className="row">
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình đã tạo
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindercreate}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindercreate.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình đã bán
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindersale}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindersale.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình tồn kho
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderinventory}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderinventory.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số vỏ bình xuất sửa chữa
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countoutold}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listoutold.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số vỏ bình nhập sửa chữa
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countimportold}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listimportold.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình hồi lưu
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderturnback}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderturnback.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {(this.state.user_current.userRole == "SuperAdmin" &&
                  this.state.userTypeBranch == "Fixer" &&
                  this.state.dataObjectCheckedID !== 0 &&
                  this.state.checkbox !== true) ||
                  (this.state.user_current.userRole == "SuperAdmin" &&
                    this.state.user_current.userType == "Fixer") ? (
                  <div className="row ">
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình đã tạo
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindercreate}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindercreate.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình sản xuất mới
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindernew}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindernew.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình sửa chữa
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderold}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderold.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số vỏ bình đã nhập
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderimport}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderimport.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình hồi lưu
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderturnback}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderturnback.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.state.dataObjectCheckedID === 0 &&
                  this.state.checkbox !== true &&
                  this.state.user_current.userType !== "Fixer" &&
                  this.state.user_current.userType !== "Region" &&
                  this.state.user_current.userRole !== "Owner" &&
                  this.state.user_current.userType !== "General" &&
                  this.state.user_current.userType !== "Agency" ? (
                  <div className="row ">
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình đã tạo
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindercreate}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindercreate.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình sản xuất mới
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindernew}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindernew.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình sửa chữa
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderold}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderold.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình hồi lưu
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderturnback}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderturnback.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {(this.state.user_current.userRole == "SuperAdmin" &&
                  this.state.user_current.userType == "General") ||
                  (this.state.user_current.userRole == "SuperAdmin" &&
                    this.state.user_current.userType == "Agency") ? (
                  <div className="row col-lg-12">
                    <div className="col-md-6 col-lg-3">
                      <div className="card card-body">
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            Tổng số bình đã nhập
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {this.state.countcylinderimport}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "65%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {this.state.listcylinderimport.map((v) => {
                      return (
                        <div className="col-md-6 col-lg-3">
                          <div className="card card-body">
                            <h6 className="text-uppercase-h6">
                              <span className="text-uppercase">{v.name}</span>
                            </h6>
                            <br />
                            <p className="fs-28 fw-100">{v.count}</p>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: "65%", height: "4px" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
                {(this.state.user_current.userRole == "SuperAdmin" &&
                  this.state.userTypeStation == "Factory" &&
                  this.state.checkbox == true) ||
                  (this.state.user_current.userRole == "Owner" &&
                    this.state.user_current.userType == "Factory") ? (
                  <div className="row">
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình đã tạo
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylindercreate}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylindercreate.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số vỏ bình đã nhập
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderimport}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderimport.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số vỏ bình xuất sửa chữa
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countoutold}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listoutold.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row col-lg-12">
                      <div className="col-md-6 col-lg-3">
                        <div className="card card-body">
                          <h6 className="text-uppercase-h6">
                            <span className="text-uppercase">
                              Tổng số bình hồi lưu
                            </span>
                          </h6>
                          <br />
                          <p className="fs-28 fw-100">
                            {this.state.countcylinderturnback}
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: "65%", height: "4px" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {this.state.listcylinderturnback.map((v) => {
                        return (
                          <div className="col-md-6 col-lg-3">
                            <div className="card card-body">
                              <h6 className="text-uppercase-h6">
                                <span className="text-uppercase">{v.name}</span>
                              </h6>
                              <br />
                              <p className="fs-28 fw-100">{v.count}</p>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: "65%", height: "4px" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="col-lg-12">
                  <div className="row">
                    {/*Lịch sử nhập hàng trong các tài khoản khác Hệ Thống Đại lý*/}
                    {user_current.userType !== "Agency" && (
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                        <div className="card">
                          <div className="card-header">
                            <h5 className="card-title">
                              <strong>Lịch Sử</strong> Nhập Hàng
                            </h5>
                          </div>
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th className="">Nhập Từ</th>
                                <th className="">Ngày Giờ</th>
                                <th className="">Loại</th>
                                <th className="">Số Lượng Bình</th>
                                <th className="">Xuất Excel</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historyImport.map((item) => {
                                return (
                                  <tr>
                                    <td className="text-muted">
                                      {typeof item.from !== "undefined" &&
                                        item.from !== null
                                        ? item.from.name
                                        : "Người Dân"}
                                    </td>
                                    <td className="text-muted">
                                      {moment(item.createdAt).format(
                                        "DD/MM/YYYY HH:mm"
                                      )}
                                    </td>
                                    <td className="text-muted">
                                      {item.type === "IMPORT"
                                        ? "Nhập Hàng"
                                        : item.type === "TURN_BACK"
                                          ? "Nhập Hồi Lưu"
                                          : ""}
                                    </td>
                                    <td className="text-success">
                                      {item.numberOfCylinder} bình
                                    </td>
                                    <td className="text-muted">
                                      <a
                                        className="btn btn-primary"
                                        style={{ color: "white" }}
                                        download
                                        onClick={async () => {
                                          await getCylinderByHistoryId(
                                            item.id,
                                            "Nhap_Hang_" + item.id
                                          );
                                        }}
                                        type="submit"
                                      >
                                        Tải
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <a href={urlDetailHistoryImport}>Xem thêm</a>
                        </div>
                      </div>
                    )}
                    {user_current.userType !== "Agency" && (
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                        <div className="card">
                          <div className="card-header">
                            <h5 className="card-title">
                              <strong>Lịch Sử</strong> Xuất Hàng
                            </h5>
                          </div>

                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th className="">Ngày Giờ</th>
                                <th className="">Loại</th>
                                <th className="">Số Lượng Bình</th>
                                <th className="">Xuất Excel</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historyExport.map((item) => {
                                let to_dest = "";
                                if (
                                  typeof item.to !== "undefined" &&
                                  item.to !== null
                                ) {
                                  to_dest = item.to.name;
                                } else {
                                  if (
                                    typeof item.toArray !== "undefined" &&
                                    item.toArray !== null &&
                                    item.toArray.length > 0
                                  ) {
                                    for (
                                      let i = 0;
                                      i < item.toArray.length;
                                      i++
                                    ) {
                                      to_dest +=
                                        item.toArray[i].length > 0
                                          ? item.toArray[i].name +
                                          " " +
                                          item.numberArray[i] +
                                          " bình." +
                                          `\n`
                                          : "";
                                    }
                                  } else {
                                    if (
                                      typeof item.customer !== "undefined" &&
                                      item.customer !== null
                                    ) {
                                      to_dest =
                                        "Người Dân : " + item.customer.name;
                                    }
                                  }
                                }

                                return (
                                  <tr>
                                    {/*<td className="text-muted">{to_dest}</td>*/}
                                    <td className="text-muted">
                                      {moment(item.createdAt).format(
                                        "DD/MM/YYYY HH:mm"
                                      )}
                                    </td>
                                    <td className="text-muted">
                                      {item.type === "EXPORT"
                                        ? "Xuất Hàng"
                                        : item.type === "SALE"
                                          ? "Bán Hàng"
                                          : ""}
                                    </td>
                                    <td className="text-success">
                                      {item.numberOfCylinder} bình
                                    </td>
                                    <td className="text-muted">
                                      <a
                                        style={{ color: "white" }}
                                        className="btn btn-success"
                                        download
                                        onClick={async () => {
                                          await getCylinderByHistoryId(
                                            item.id,
                                            "Xuat_Hang_" + item.id
                                          );
                                        }}
                                        type="submit"
                                      >
                                        Tải
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <a href={urlSeeDetailDataExport}>Xem thêm</a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {user_current.userType === "Agency" && (
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          <strong>Lịch Sử</strong> Nhập Hàng
                        </h5>
                      </div>

                      <table className="table table-striped table-hover">
                        <thead>
                          {/* Lịch sử nhập hàng trong đại lý(Hệ Thống Đại lý) */}
                          <tr>
                            <th className="">Nhập Từ</th>
                            <th className="">Ngày Giờ</th>
                            <th className="">Loại</th>
                            <th className="">Số Lượng Bình</th>
                            <th className="">Xuất Excel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyImport.map((item) => {
                            return (
                              <tr>
                                <td className="text-muted">
                                  {typeof item.from !== "undefined" &&
                                    item.from !== null
                                    ? item.from.name
                                    : "Người Dân"}
                                </td>
                                <td className="text-muted">
                                  {moment(item.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </td>
                                <td className="text-muted">
                                  {item.type === "IMPORT"
                                    ? "Nhập Hàng"
                                    : item.type === "TURN_BACK"
                                      ? "Nhập Hồi Lưu"
                                      : ""}
                                </td>
                                <td className="text-success">
                                  {item.numberOfCylinder} bình
                                </td>
                                <td className="text-muted">
                                  <a
                                    className="btn btn-primary"
                                    download
                                    onClick={async () => {
                                      await getCylinderByHistoryId(
                                        item.id,
                                        "Nhap_Hang_" + item.id
                                      );
                                    }}
                                    type="submit"
                                  >
                                    Tải
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {user_current.userType === "Agency" && (
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          <strong>Chi tiết</strong> Xuất Bán
                        </h5>
                      </div>

                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th className="">Nhân Viên Bán</th>
                            <th className="">Xuất Đến</th>
                            <th className="">Ngày Giờ</th>
                            <th className="">Loại</th>
                            <th className="">Số Lượng Bình</th>
                            <th className="">Tổng Tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyExport.map((item) => {
                            let to_dest = "";
                            if (
                              typeof item.to !== "undefined" &&
                              item.to !== null
                            ) {
                              to_dest = item.to.name;
                            } else {
                              if (
                                typeof item.toArray !== "undefined" &&
                                item.toArray !== null &&
                                item.toArray.length > 0
                              ) {
                                for (let i = 0; i < item.toArray.length; i++) {
                                  to_dest +=
                                    item.toArray[i].name +
                                    " " +
                                    item.numberArray[i] +
                                    " bình." +
                                    `\n`;
                                  console.log(to_dest);
                                }
                              } else {
                                if (
                                  typeof item.customer !== "undefined" &&
                                  item.customer !== null
                                ) {
                                  to_dest = "Người Dân : " + item.customer.name;
                                }
                              }
                            }
                            return (
                              <tr>
                                <td className="text-muted">
                                  {typeof item.saler !== "undefined" &&
                                    item.saler !== null
                                    ? item.saler.name
                                    : ""}
                                </td>
                                <td className="text-muted">{to_dest}</td>
                                <td className="text-muted">
                                  {moment(item.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </td>
                                <td className="text-muted">
                                  {item.type === "EXPORT"
                                    ? "Xuất Hàng"
                                    : item.type === "SALE"
                                      ? "Bán Hàng"
                                      : ""}
                                </td>
                                <td className="text-success">
                                  {item.numberOfCylinder} bình
                                </td>
                                <td className="text-success">
                                  {UltiHelper.formatNumber(item.amount)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">
                        <strong>Thông Tin</strong> Tồn Kho
                      </h5>
                    </div>
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th className="">Đang tồn kho</th>
                          <th className="">Đã bán cho người dân</th>
                          <th className="">Đang ở nơi khác</th>
                          <th className="">Tồn tại cty con</th>
                          <th className="">Tồn tại TNMB</th>
                          <th className="">Tồn tại CHBL</th>
                          <th className="">Tồn tại đối tác</th>
                          <th className="">Tồn tại NM Sửa chữa</th>
                        </tr>
                      </thead>
                      {/* <tbody>
                        <tr>
                          <td className="text-muted">
                            {this.state.dataTableChart.inventoryAtMySelf}
                          </td>
                          <td className="text-muted">
                            {this.state.dataTableChart.atResident}
                          </td>
                          <td className="text-muted">
                            {this.state.dataTableChart.else}
                          </td>
                          <td className="text-muted">
                            {this.state.dataTableChart.atFactoryChilds}
                          </td>
                          <td className="text-success">
                            {this.state.dataTableChart.atGeneralChilds}
                          </td>
                          <td className="text-success">
                            {this.state.dataTableChart.atAgencyChilds}
                          </td>
                          <td className="text-success">
                            {this.state.dataTableChart.atPartners}
                          </td>
                          <td className="text-success">
                            {this.state.dataTableChart.atFixer}
                          </td>
                        </tr>
                      </tbody>*/}
                    </table>
                  </div>
                </div>
              </div>
              <div className="report__footer_block">
                {user_current.userType === "Factory" && (
                  <div className="col-lg-3" style={{ paddingLeft: 0 }}>
                    <div
                      className="card card-body"
                      data-toggle="modal"
                      data-target="#table-data-info"
                      onClick={() => {
                        this.callDataTurnBackInfo(
                          this.state.infoReportTurnback
                            .listCylindersFromCustomer
                        );
                        this.setState({ namePopup: "Hồi Lưu Từ Người Dân" });
                      }}
                    >
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Hồi Lưu Từ Người Dân
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {!!this.state.infoReportTurnback
                          .listCylindersFromCustomer
                          ? this.state.infoReportTurnback
                            .listCylindersFromCustomer.length
                          : 0}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: "35%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {user_current.userType === "Factory" && (
                  <div className="col-lg-3">
                    <div
                      className="card card-body"
                      style={{ height: 185 }}
                      data-toggle="modal"
                      data-target="#table-data-info"
                      onClick={() => {
                        this.callDataTurnBackInfo(
                          this.state.infoReportTurnback.listCylindersFromFixer
                        );
                        this.setState({ namePopup: "Hồi Lưu Từ Sửa Chửa" });
                      }}
                    >
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Hồi Lưu Từ Sửa Chữa
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {!!this.state.infoReportTurnback.listCylindersFromFixer
                          ? this.state.infoReportTurnback.listCylindersFromFixer
                            .length
                          : 0}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: "35%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {user_current.userType === "Factory" && (
                  <div className="col-lg-3">
                    <div
                      className="card card-body"
                      style={{ height: 185 }}
                      data-toggle="modal"
                      data-target="#table-data-info"
                      onClick={() => {
                        this.callDataTurnBackInfo(
                          this.state.infoReportTurnback.listCylindersFromRent
                        );
                        this.setState({ namePopup: "Hồi Lưu Từ Cho thuê" });
                      }}
                    >
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Hồi Lưu Từ Cho thuê
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {!!this.state.infoReportTurnback.listCylindersFromRent
                          ? this.state.infoReportTurnback.listCylindersFromRent
                            .length
                          : 0}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: "35%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {user_current.userType === "Factory" && (
                  <div className="col-lg-3" style={{ paddingRight: 0 }}>
                    <div
                      className="card card-body"
                      style={{ height: 185 }}
                      data-toggle="modal"
                      data-target="#table-data-info"
                      onClick={() => {
                        this.callDataTurnBackInfo(
                          this.state.infoReportTurnback.listCylindersFromSale
                        );
                        this.setState({ namePopup: "Hồi Lưu Từ Bán Đứt" });
                      }}
                    >
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Hồi Lưu Từ Bán Đứt
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {!!this.state.infoReportTurnback.listCylindersFromSale
                          ? this.state.infoReportTurnback.listCylindersFromSale
                            .length
                          : 0}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: "35%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <TableDataInfo
              dataProducts={this.state.dataTurnBacks}
              name={this.state.namePopup}
            />
          </div>
        </main>
        <PopupLogOut />
      </div>
    );
  }
}

export default connect()(DashBoard);
