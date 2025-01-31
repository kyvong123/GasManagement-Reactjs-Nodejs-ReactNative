import { Button, DatePicker, Select, Table, Typography, Checkbox, Tabs, Modal, Form } from "antd";
import moment from "moment";
import React, { Component, Fragment, useEffect, useState } from "react";
import getUserCookies from "getUserCookies";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";
import getAllBranch from "../../../../api/getAllStation";
import getAllStation from "../../../../api/getAllBranch";
import getDashboard from "../../../../api/getDashboard";
import getAggregateDashboard from "../../../../api/getAggregateDashboard";
import getExportChart from "../../../../api/getExportChart";
import getDashboardFixer from "../../../../api/getDashboardFixer";
import detailDashboardFixer from "../../../../api/detailDashboardFixer";
import getDetailCylindersImexExcels from "../../../../api/getDetailCylindersImexExcels";
import exportExcel from "../../../../api/exportExcel";
import ReactCustomLoading from "ReactCustomLoading";
import showToast from "showToast";
// import callApi from "./../../util/apiCaller";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { urlDetailHistoryImport_New, urlSeeDetailDataExport_New, urlDetailStatistialBranch } from "../../../config/config-reactjs";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Line, ComposedChart } from "recharts";
import "./statistical.scss";
const { Option } = Select;
const { TabPane } = Tabs;
// const { Text } = Typography;
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";
const monthFormat = "YYYY/MM";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
const customFormat = (value) => {
  return `custom format: ${value.format(dateFormat)}`;
};

function Statistical() {
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [getBranch, setBranch] = useState([]);
  const [getStation, setStation] = useState([]);
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [listStationDashboard, setStationDashboard] = useState([]);
  const [typeCylinder, setTypeCylinder] = useState([]);
  const [listCreate, setListCreate] = useState([]);
  const [listExport, setListExport] = useState([]);
  const [listTurnback, setListTurnback] = useState([]);
  const [listInventory, setListInventory] = useState([]);
  const [selectYear, setSelectYear] = useState(moment().year());
  const [selectYearQuarter, setSelectYearQuarter] = useState(moment().year());
  const [listChart, setListChart] = useState([]);
  const [listQuarterChart, setListQuarterChart] = useState([]);
  const [typeMonthChart, setTypeMonthChart] = useState([]);
  const [typeQuarterChart, setTypeQuarterChart] = useState([]);
  const [idBranch, setIdBranch] = useState("");
  const [idStation, setIdStation] = useState("");
  const [nameBranch, setNameBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [massMonthLine, setMassMonthLine] = useState([]);
  const [massQuarterLine, setMassQuarterLine] = useState([]);
  const [userTypeFixer, setUserTypeFixer] = useState("");
  const [userRoleFixer, setUserRoleFixer] = useState("");
  const [newCylinder, setNewCylinder] = useState([]);
  const [newExportedCylinder, setNewExportedCylinder] = useState([]);
  const [newInventoryCylinder, setNewInventoryCylinder] = useState([]);
  const [oldCylinder, setOldCylinder] = useState([]);
  const [oldExportedCylinder, setOldExportedCylinder] = useState([]);
  const [oldInventoryCylinder, setOldInventoryCylinder] = useState([]);
  const [checkModal, setCheckModal] = useState("");
  const [id, setId] = useState("");
  const [detailNewCylinder, setDetailNewCylinder] = useState([]);
  const [detailExportCylinder, setDetailExportCylinder] = useState([]);
  const [detailInventoryCylinder, setDetailInventoryCylinder] = useState([]);
  const [visible, setVisible] = useState(false);
  const [checkChangeTab, setCheckChangeTab] = useState("1");
  const [typeExcel, setTypeExcel] = useState("");
  const [nameStation, setNameStation] = useState("");
  const [startYear, setStartYear] = useState(moment().year());
  const [endYear, setEndYear] = useState(moment().year());
  const [startMonth, setStartMonth] = useState(moment().month() + 1);
  const [endMonth, setEndMonth] = useState(moment().month() + 1);
  async function getUser() {
    //Phân quyền
    let user_cookies = await getUserCookies();
    console.log("user_cookies", user_cookies.user.userType);
    if (user_cookies) {
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
    }
    // Lấy danh sách chi nhánh
    if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Factory") {
      let resultBranch = await getAllBranch(user_cookies.user.id);
      if (resultBranch.data) {
        setBranch(resultBranch.data.data);
      }
    }

    // Lấy danh sách trạm
    if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Region") {
      let resultStation = await getAllStation(user_cookies.user.id);
      if (resultStation.data) {
        setStation(resultStation.data.data);
      }
    }
  }
  function formatNumbers(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  function formatNumber(array) {
    let result = array.map((item) => {
      const arr = Object.keys(item);
      const length = arr.length;
      let temp = item;
      for (let i = 0; i < length; i++) {
        if (typeof item[arr[i]] == "number") {
          temp[arr[i]] = temp[arr[i]].toLocaleString("nl-BE");
        }
      }
      return temp;
    });

    return result;
  }

  useEffect(() => {
    getUser();
  }, [setUserRole, setUserType, setBranch, setStation]);

  function handleTime(value) {

    setStartMonth(value[0]._d.getMonth() + 1)
    setStartYear(value[0]._d.getFullYear())
    setEndMonth(value[1]._d.getMonth() + 1)
    setEndYear(value[1]._d.getFullYear())

    setSelectYear(value[1]._d.getFullYear());
    setSelectYearQuarter(value[1]._d.getFullYear());
    setStartTime(value[0]);
    setEndTime(value[1]);
  }
  // Lấy ngày hiện tại
  function handleThisTime() {
    var el = document.getElementsByClassName("btn-history");
    el[0].classList.add("active");
    el[1].classList.remove("active");
    el[2].classList.remove("active");
    el[3].classList.remove("active");
    setStartTime(moment());
    setEndTime(moment());
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  // Lấy ngày hôm qua
  function handleYesterday() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).addClass("active");
      }
      if (item === 2) {
        $(this).removeClass("active");
      }
      if (item === 3) {
        $(this).removeClass("active");
      }
    });
    setStartTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
    setEndTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  //Lấy ngày trong tuần
  function handleThisWeek() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).removeClass("active");
      }
      if (item === 2) {
        $(this).addClass("active");
      }
      if (item === 3) {
        $(this).removeClass("active");
      }
    });
    setStartTime(moment().startOf("week"));
    setEndTime(moment().endOf("week"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  //Lấy ngày trong tháng
  function handleThisMonth() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).removeClass("active");
      }
      if (item === 2) {
        $(this).removeClass("active");
      }
      if (item === 3) {
        $(this).addClass("active");
      }
    });
    setStartTime(moment().startOf("month"));
    setEndTime(moment().endOf("month"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }

  async function handleChangeExcel(value) {
    setTypeExcel(value);
  }
  //Lấy danh sách trạm
  async function handleChangeBranch(value, name) {
    setNameStation("");
    setNameBranch(name.props.name.name ? name.props.name.name : name.props.name);
    setUserTypeFixer(name.props.name.userType);
    setUserRoleFixer(name.props.name.userRole);
    await setStationDashboard([]);
    await setListChart([]);
    await setListQuarterChart([]);
    await setIdBranch(value);

    if (value !== "all") {
      let resultStation = await getAllStation(value);
      if (resultStation.data.success === true) {
        setStation(resultStation.data.data);
      } else {
        setStation([]);
      }
    }
  }

  async function handleChangeStation(value) {
    if (value === "all") {
      await setNameStation("Tất cả");
      await setIdStation("all");
    } else {
      await setNameStation(value.name);
      await setIdStation(value.id);
    }

    await setListChart([]);
    await setListQuarterChart([]);
    await setStationDashboard([]);
    await setIdBranch(null);
  }
  async function handlePreYear() {
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function (item, index) {
      if (item === 4) {
        $(this).removeClass("active");
      }
      if (item === 5) {
        $(this).addClass("active");
      }
    });
    setSelectYear(moment().year() - 1);
  }
  async function handleCurrentYear() {
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function (item, index) {
      if (item === 4) {
        $(this).addClass("active");
      }
      if (item === 5) {
        $(this).removeClass("active");
      }
    });
    setSelectYear(moment().year());
  }

  async function handlePreYearQuarter() {
    setStartTime("")
    setEndTime("")
    $(".btn-history").each(function (item, index) {
      if (item === 6) {
        $(this).removeClass("active");
      }
      if (item === 7) {
        $(this).addClass("active");
      }
    });
    setSelectYearQuarter(moment().year() - 1);
  }
  async function handleCurrentYearQuarter() {
    setStartTime("")
    setEndTime("")
    $(".btn-history").each(function (item, index) {
      if (item === 6) {
        $(this).addClass("active");
      }
      if (item === 7) {
        $(this).removeClass("active");
      }
    });
    setSelectYearQuarter(moment().year());
  }

  async function handleYear(value) {
    setSelectYear(value);
  }
  async function handleYearQuarter(value) {
    setSelectYearQuarter(value);
  }

  async function getQuarterChart(target, statisticalType, dataType, year, filter, startDate, endDate) {
    let color = ["#66BE02", "#23772F", "#037aff", "#FF6600"];
    let array = [];
    let type = [];
    let mass = [];
    let result = await getExportChart(target, statisticalType, dataType, year, filter, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      result.data.data[0].detail.map((value, index) => {
        type.push({
          name: value.name,
          color: color[index],
        });
        mass.push({
          name: "Tổng KL",
          color: color[index],
        });
      });
      result.data.data.map((value) => {
        let objectChart = {
          name: "Quý " + value.quarter,
          "Tổng KL": value.totalMass,
        };
        value.detail.map((v) => {
          Object.assign(objectChart, {
            [v.name]: v.statistic.numberExport,
          });
        });
        array.push(objectChart);
      });
    }
    setListQuarterChart(array);
    setTypeQuarterChart(type);
    setMassQuarterLine(mass);
  }

  async function handleQuarterChart() {
    let user_cookies = await getUserCookies();
    if (startTime === '' && endTime === '') {
      $('.chart-note-quater').text(function () {
        return "Biểu đồ xuất bình theo quý trong năm " + selectYearQuarter;
      })
    } else {
      $('.chart-note-quater').text(function () {
        return "Biểu đồ xuất bình theo quý từ tháng " + startMonth + '/' + startYear + '-' + endMonth + '/' + endYear;
      })
    }
    if (userRole === "SuperAdmin" && userType === "Factory") {
      if (!nameBranch) {
        showToast("Vui lòng chọn Chi Nhánh");
      } else {
        setLoading(true);
        if (idBranch === "all") {
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else if (idBranch !== ("all" && null)) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getQuarterChart(idBranch, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
          } else {
            await getQuarterChart(idBranch, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
          }
        } else if (idBranch === null && idStation) {
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      }
    }

    if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
    }

    if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else {
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      } else {
        showToast("Vui lòng chọn trạm");
      }
    }
    if (userRole === "Owner" && userType === "Factory") {
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
    }
  }

  async function getMonthChart(target, statisticalType, dataType, year, filter, startDate, endDate) {
    let color = ["#66BE02", "#23772F", "#037aff", "#FF6600"];
    let array = [];
    let type = [];
    let mass = [];
    let result = await getExportChart(target, statisticalType, dataType, year, filter, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      result.data.data[0].detail.map((value, index) => {
        type.push({
          name: value.name,
          color: color[index],
        });
        mass.push({
          name: "Tổng KL",
          color: color[index],
        });
      });
      result.data.data.map((value) => {
        let objectChart = {
          name: "Tháng " + value.month,
          "Tổng KL": value.totalMass,
        };
        value.detail.map((v) => {
          Object.assign(objectChart, {
            [v.name]: v.statistic.numberExport,
          });
        });
        array.push(objectChart);
      });
    }
    setListChart(array);
    setTypeMonthChart(type);
    setMassMonthLine(mass);
  }
  async function handleMonthChart() {
    let user_cookies = await getUserCookies();
    if (startTime === '' && endTime === '') {
      $('.chart-note-p').text(function () {
        return "Biểu đồ xuất bình theo tháng trong năm " + selectYear;
      })
    } else {
      $('.chart-note-p').text(function () {
        return "Biểu đồ xuất bình theo tháng từ tháng " + startMonth + '/' + startYear + '-' + endMonth + '/' + endYear;
      })
    }
    if (userRole === "SuperAdmin" && userType === "Factory") {
      if (!nameBranch) {
        showToast("Vui lòng chọn Chi Nhánh");
      } else {
        setLoading(true);
        if (idBranch === "all") {
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
        } else if (idBranch !== ("all" && null)) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getMonthChart(idBranch, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
          } else {
            await getMonthChart(idBranch, "byItsChildren", "month", selectYear, "", startTime, endTime);
          }
        } else if (idBranch === null && idStation) {
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
        }
      }
    }

    if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
    }

    if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
        } else {
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
        }
      } else {
        showToast("Vui lòng chọn trạm");
      }
    }
    if (userRole === "Owner" && userType === "Factory") {
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "", startTime, endTime);
    }
  }

  async function handleChangeTab(value) {
    setCheckChangeTab(value);
  }
  async function handleSeeNew(record) {
    setCheckModal("1");
    setId(record.id);
    let detailNewCylinder = [];
    setVisible(true);
    let resultDetail = await detailDashboardFixer(
      idBranch,
      startTime,
      endTime,
      checkChangeTab === "1" ? "NEW" : "OLD",
      "IN",
      record.id ? record.id : null,
      "CREATE"
    );
    if (resultDetail.data.success === true) {
      resultDetail.data.Cylinders.map((value, index) => {
        detailNewCylinder.push({
          index: index + 1,
          id: value.id,
          serial: value.serial,
          color: value.color,
          valve: value.valve,
          weight: value.weight,
          checkedDate: value.checkedDate,
          category: value.category,
          manufacture: value.manufacture,
        });
      });
      detailNewCylinder = formatNumber(detailNewCylinder);

      setDetailNewCylinder(detailNewCylinder);
    }
  }

  async function handleSeeExported(record) {
    setCheckModal("2");
    setId(record.id);
    let detailExportCylinder = [];
    setVisible(true);
    let resultDetail = await detailDashboardFixer(
      idBranch,
      startTime,
      endTime,
      checkChangeTab === "1" ? "NEW" : "OLD",
      "OUT",
      record.id ? record.id : null,
      "EXPORT_CELL"
    );
    if (resultDetail.data.success === true) {
      resultDetail.data.Cylinders.map((value, index) => {
        detailExportCylinder.push({
          index: index + 1,
          id: value.id,
          serial: value.serial,
          color: value.color,
          valve: value.valve,
          weight: value.weight,
          checkedDate: value.checkedDate,
          category: value.category,
          manufacture: value.manufacture,
        });
      });
      detailExportCylinder = formatNumber(detailExportCylinder);

      setDetailExportCylinder(detailExportCylinder);
    }
  }

  async function handleNotData() {
    alert("Không có dữ liệu");
  }
  async function handleSeeInventory(record) {
    setCheckModal("3");
    setId(record.id);
    let detailInventoryCylinder = [];
    setVisible(true);
    let resultDetail = await detailDashboardFixer(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", null, record.id ? record.id : null);
    if (resultDetail.data.success === true) {
      resultDetail.data.Cylinders.map((value, index) => {
        detailInventoryCylinder.push({
          index: index + 1,
          id: value.id,
          serial: value.serial,
          color: value.color,
          valve: value.valve,
          weight: value.weight,
          checkedDate: value.checkedDate,
          category: value.category,
          manufacture: value.manufacture,
        });
      });
      detailInventoryCylinder = formatNumber(detailInventoryCylinder);
      setDetailInventoryCylinder(detailInventoryCylinder);
    }
  }

  async function getOldFixerDashboard(target, startDate, endDate, statisticalType) {
    let sumold = 0;
    let sumexported = 0;
    let suminventory = 0;
    let resultDashboard = await getDashboardFixer(target, startDate, endDate, statisticalType);
    setLoading(false);
    if (resultDashboard.data.success === true) {
      // Tính tổng số lượng bình khai báo mới
      resultDashboard.data.Declaration.map((value) => {
        sumold += value.number;
      });
      let sumOldCylinder = {
        name: "Tổng",
        number: sumold,
      };
      // Tính tổng số lượng bình đã xuất
      resultDashboard.data.Export.map((value) => {
        sumexported += value.number;
      });
      let sumExportedCylinder = {
        name: "Tổng",
        number: sumexported,
      };
      // Tính tổng số lượng bình tồn kho
      resultDashboard.data.Inventory.map((value) => {
        suminventory += value.number;
      });
      let sumInventoryCylinder = {
        name: "Tổng",
        number: suminventory,
      };

      // Ghép object Tổng vào mảng
      resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumOldCylinder;
      resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
      resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

      resultDashboard.data.Declaration = formatNumber(resultDashboard.data.Declaration);
      resultDashboard.data.Export = formatNumber(resultDashboard.data.Export);
      resultDashboard.data.Inventory = formatNumber(resultDashboard.data.Inventory);

      setOldCylinder(resultDashboard.data.Declaration);
      setOldExportedCylinder(resultDashboard.data.Export);
      setOldInventoryCylinder(resultDashboard.data.Inventory);
    }
  }
  async function getNewFixerDashboard(target, startDate, endDate, statisticalType) {
    let sumnew = 0;
    let sumexported = 0;
    let suminventory = 0;
    let resultDashboard = await getDashboardFixer(target, startDate, endDate, statisticalType);
    setLoading(false);
    if (resultDashboard.data.success === true) {
      // Tính tổng số lượng bình khai báo mới
      resultDashboard.data.Declaration.map((value) => {
        sumnew += value.number;
      });
      let sumNewCylinder = {
        name: "Tổng",
        number: sumnew,
      };
      // Tính tổng số lượng bình đã xuất
      resultDashboard.data.Export.map((value) => {
        sumexported += value.number;
      });
      let sumExportedCylinder = {
        name: "Tổng",
        number: sumexported,
      };
      // Tính tổng số lượng bình tồn kho
      resultDashboard.data.Inventory.map((value) => {
        suminventory += value.number;
      });
      let sumInventoryCylinder = {
        name: "Tổng",
        number: suminventory,
      };

      // Ghép object Tổng vào mảng
      resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumNewCylinder;
      resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
      resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

      resultDashboard.data.Declaration = formatNumber(resultDashboard.data.Declaration);
      resultDashboard.data.Export = formatNumber(resultDashboard.data.Export);
      resultDashboard.data.Inventory = formatNumber(resultDashboard.data.Inventory);

      setNewCylinder(resultDashboard.data.Declaration);
      setNewExportedCylinder(resultDashboard.data.Export);
      setNewInventoryCylinder(resultDashboard.data.Inventory);
    }
  }
  async function getAllDashboard(target, statisticalType, startDate, endDate, nameBranch) {
    let typeCylinder = [];
    let cutCreate = {};
    let cutTurnback = {};
    let cutInventory = {};
    let cutExport = {};
    let arrayCreate = [{ branch: "Tổng" }];
    let arrayTurnback = [{ branch: "Tổng" }];
    let arrayExport = [{ branch: "Tổng" }];
    let arrayInventory = [{ branch: "Tổng" }];
    let result = await getAggregateDashboard(target, statisticalType, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      // Lấy danh sách loại bình
      result.data.data[0].detail.map((value) => {
        typeCylinder.push({
          dataIndex: value.code,
          title: value.name,
        });
      });
      setTypeCylinder(typeCylinder);
      console.log("qqqq", result.data.data);

      result.data.data.map((value, index) => {
        let sumCreate = 0;
        let sumTurnback = 0;
        let sumExport = 0;
        let sumInventory = 0;
        let sumMassExport = 0;
        let a = result.data.data[index].name;
        let objectCreate = { branch: a };
        let objectExport = { branch: a };
        let objectTurnback = { branch: a };
        let objectInventory = { branch: a };

        value.detail.map((v) => {
          //
          sumCreate += v.statistic.create;
          Object.assign(objectCreate, {
            [v.code]: v.statistic.create,
            tongBinh: sumCreate,
          });
          cutCreate = Object.assign(arrayCreate[0], {
            [v.code]: arrayCreate[0][v.code] ? arrayCreate[0][v.code] + v.statistic.create : v.statistic.create,
            tongBinh: arrayCreate[0].tongBinh ? arrayCreate[0].tongBinh + v.statistic.create : v.statistic.create,
          });
          //
          sumExport += v.statistic.numberExport;
          sumMassExport += v.statistic.massExport;
          Object.assign(objectExport, {
            [v.code]: v.statistic.numberExport,
            tongBinh: sumExport,
            tongkhoiLuong: sumMassExport,
          });
          cutExport = Object.assign(arrayExport[0], {
            [v.code]: arrayExport[0][v.code] ? arrayExport[0][v.code] + v.statistic.numberExport : v.statistic.numberExport,
            tongBinh: arrayExport[0].tongBinh ? arrayExport[0].tongBinh + v.statistic.numberExport : v.statistic.numberExport,
            tongkhoiLuong: arrayExport[0].tongkhoiLuong ? arrayExport[0].tongkhoiLuong + v.statistic.massExport : v.statistic.massExport,
          });
          //
          sumTurnback += v.statistic.turnback;
          Object.assign(objectTurnback, {
            [v.code]: v.statistic.turnback,
            tongBinh: sumTurnback,
          });
          cutTurnback = Object.assign(arrayTurnback[0], {
            [v.code]: arrayTurnback[0][v.code] ? arrayTurnback[0][v.code] + v.statistic.turnback : v.statistic.turnback,
            tongBinh: arrayTurnback[0].tongBinh ? arrayTurnback[0].tongBinh + v.statistic.turnback : v.statistic.turnback,
          });
          //
          sumInventory += v.statistic.inventory;
          Object.assign(objectInventory, {
            [v.code]: v.statistic.inventory,
            tongBinh: sumInventory,
          });
          cutInventory = Object.assign(arrayInventory[0], {
            [v.code]: arrayInventory[0][v.code] ? arrayInventory[0][v.code] + v.statistic.inventory : v.statistic.inventory,
            tongBinh: arrayInventory[0].tongBinh ? arrayInventory[0].tongBinh + v.statistic.inventory : v.statistic.inventory,
          });
        });
        arrayCreate.push(objectCreate);
        arrayExport.push(objectExport);
        arrayTurnback.push(objectTurnback);
        arrayInventory.push(objectInventory);
      });
    }
    arrayCreate.shift();
    arrayCreate[arrayCreate.length] = cutCreate;
    arrayCreate = formatNumber(arrayCreate);
    setListCreate(arrayCreate);

    arrayExport.shift();
    arrayExport[arrayExport.length] = cutExport;
    arrayExport = formatNumber(arrayExport);
    setListExport(arrayExport);

    arrayTurnback.shift();
    arrayTurnback[arrayTurnback.length] = cutTurnback;
    arrayTurnback = formatNumber(arrayTurnback);
    setListTurnback(arrayTurnback);

    arrayInventory.shift();
    arrayInventory[arrayInventory.length] = cutInventory;
    arrayInventory = formatNumber(arrayInventory);
    setListInventory(arrayInventory);
  }
  async function getTableDashboard(target, statisticalType, startDate, endDate, nameBranch) {
    let array = [];
    let sumObject, sumChildObject;

    let sumCancel = 0;
    let sumCreate = 0;
    let sumExportShellToElsewhere = 0;
    let sumExportShellToFixer = 0;
    let sumImportShellFromElsewhere = 0;
    let sumImportShellFromFixer = 0;
    let sumInventory = 0;
    let sumMassExport = 0;
    let sumNumberExport = 0;
    let sumTurnback = 0;
    let sumReturnFullCylinder = 0;

    let sumChildCancel,
      sumChildCreate,
      sumChildExportShellToElsewhere,
      sumChildExportShellToFixer,
      sumChildImportShellFromElsewhere,
      sumChildImportShellFromFixer,
      sumChildInventory,
      sumChildMassExport,
      sumChildNumberExport,
      sumChildTurnback,
      sumChildReturnFullCylinder;

    let result = await getDashboard(target, statisticalType, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      result.data.data.map((value) => {
        sumChildCancel = 0;
        sumChildCreate = 0;
        sumChildExportShellToElsewhere = 0;
        sumChildExportShellToFixer = 0;
        sumChildImportShellFromElsewhere = 0;
        sumChildImportShellFromFixer = 0;
        sumChildInventory = 0;
        sumChildMassExport = 0;
        sumChildNumberExport = 0;
        sumChildTurnback = 0;
        sumChildReturnFullCylinder = 0;

        console.log("vava", value);
        value.detail.map((v) => {
          // Tính tổng cho chi nhánh và trạm
          sumCancel += v.statistic.cancel;
          sumCreate += v.statistic.create;
          sumExportShellToElsewhere += v.statistic.exportShellToElsewhere;
          sumExportShellToFixer += v.statistic.exportShellToFixer;
          sumImportShellFromElsewhere += v.statistic.importShellFromElsewhere;
          sumImportShellFromFixer += v.statistic.importShellFromFixer;
          sumInventory += v.statistic.inventory;
          sumMassExport += v.statistic.massExport;
          sumNumberExport += v.statistic.numberExport;
          sumTurnback += v.statistic.turnback;
          sumReturnFullCylinder += v.statistic.returnFullCylinder;
          //Tính tổng cho từng trạm ở trên chi nhánh
          sumChildCancel += v.statistic.cancel;
          sumChildCreate += v.statistic.create;
          sumChildExportShellToElsewhere += v.statistic.exportShellToElsewhere;
          sumChildExportShellToFixer += v.statistic.exportShellToFixer;
          sumChildImportShellFromElsewhere += v.statistic.importShellFromElsewhere;
          sumChildImportShellFromFixer += v.statistic.importShellFromFixer;
          sumChildInventory += v.statistic.inventory;
          sumChildMassExport += v.statistic.massExport;
          sumChildNumberExport += v.statistic.numberExport;
          sumChildTurnback += v.statistic.turnback;
          sumChildReturnFullCylinder += v.statistic.returnFullCylinder;
          // THỐNG KÊ Ở TRẠM
          if ((userRole === "Owner" && userType === "Factory") || (userRole === "SuperAdmin" && userType === "Factory" && idBranch === null && idStation)) {
            // Tạo object tính tổng
            sumObject = {
              name: "Tổng",
              cancel: sumCancel,
              create: sumCreate,
              exportShellToElsewhere: sumExportShellToElsewhere,
              exportShellToFixer: sumExportShellToFixer,
              importShellFromElsewhere: sumImportShellFromElsewhere,
              importShellFromFixer: sumImportShellFromFixer,
              inventory: sumInventory,
              massExport: sumMassExport,
              numberExport: sumNumberExport,
              turnback: sumTurnback,
              returnFullCylinder: sumReturnFullCylinder,
            };

            array.push({
              name: v.name,
              cancel: v.statistic.cancel,
              create: v.statistic.create,
              exportShellToElsewhere: v.statistic.exportShellToElsewhere,
              exportShellToFixer: v.statistic.exportShellToFixer,
              importShellFromElsewhere: v.statistic.importShellFromElsewhere,
              importShellFromFixer: v.statistic.importShellFromFixer,
              inventory: v.statistic.inventory,
              massExport: v.statistic.massExport,
              numberExport: v.statistic.numberExport,
              turnback: v.statistic.turnback,
              returnFullCylinder: v.statistic.returnFullCylinder,
            });
          }
          // THỐNG KÊ Ở CHI NHÁNH
          else if (
            (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" && userType === "Factory" && idBranch !== ("all" && null))
          ) {
            // Tạo object tính tổng
            sumObject = {
              id: array.length,
              branchName: nameBranch,
              stationName: "TỔNG",
              name: "",
              cancel: sumCancel,
              create: sumCreate,
              exportShellToElsewhere: sumExportShellToElsewhere,
              exportShellToFixer: sumExportShellToFixer,
              importShellFromElsewhere: sumImportShellFromElsewhere,
              importShellFromFixer: sumImportShellFromFixer,
              inventory: sumInventory,
              massExport: sumMassExport,
              numberExport: sumNumberExport,
              turnback: sumTurnback,
              returnFullCylinder: sumReturnFullCylinder,
            };
            // Tạo object con để tính tổng
            sumChildObject = {
              id: array.length,
              branchName: nameBranch,
              stationName: value.name,
              name: "Tổng",
              cancel: sumChildCancel,
              create: sumChildCreate,
              exportShellToElsewhere: sumChildExportShellToElsewhere,
              exportShellToFixer: sumChildExportShellToFixer,
              importShellFromElsewhere: sumChildImportShellFromElsewhere,
              importShellFromFixer: sumChildImportShellFromFixer,
              inventory: sumChildInventory,
              massExport: sumChildMassExport,
              numberExport: sumChildNumberExport,
              turnback: sumChildTurnback,
              returnFullCylinder: sumChildReturnFullCylinder,
            };

            array.push({
              id: index + 1,
              branchName: nameBranch,
              stationName: value.name,
              name: v.name,
              cancel: v.statistic.cancel,
              create: v.statistic.create,
              exportShellToElsewhere: v.statistic.exportShellToElsewhere,
              exportShellToFixer: v.statistic.exportShellToFixer,
              importShellFromElsewhere: v.statistic.importShellFromElsewhere,
              importShellFromFixer: v.statistic.importShellFromFixer,
              inventory: v.statistic.inventory,
              massExport: v.statistic.massExport,
              numberExport: v.statistic.numberExport,
              turnback: v.statistic.turnback,
              returnFullCylinder: v.statistic.returnFullCylinder,
            });

            console.log(array);
          }
        });
        // if (userRole === "SuperAdmin" && ((userType === "Region") || userType === "Factory")) {
        // if (userRole === "SuperAdmin" && userType === "Region") {
        //   array[array.length] = sumChildObject;
        // }
        if (userRole === "SuperAdmin" && ((userType === "Region" && idStation === "all") || userType === "Factory")) {
          // if (userRole === "SuperAdmin" && userType === "Region") {
          if (sumChildObject) {
            array[array.length] = sumChildObject;
          }
        }
      });

      // Ghép object Tổng vào mảng
      array[array.length] = sumObject;
      array = formatNumber(array);
      setStationDashboard(array);
    }
  }
  async function handleSeeExcel() {
    if (checkModal === "1") {
      const data = await getDetailCylindersImexExcels(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", "IN", id, "CREATE");
    } else if (checkModal === "2") {
      const data = await getDetailCylindersImexExcels(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", "OUT", id, "EXPORT_CELL");
    } else if (checkModal === "3") {
      const data = await getDetailCylindersImexExcels(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", null, id, null);
    }
  }
  async function exportExcelDashboard(target_ids, action_type, parent_root, start_date, end_date) {
    let result = await exportExcel(target_ids, action_type, parent_root, start_date, end_date);
    setLoading(false);
  }
  async function handleExportExcel() {
    let user_cookies = await getUserCookies();
    if (typeExcel === "") {
      showToast("Vui lòng chọn kiểu xuất excel")
    }
    else {
      if (userRole === "Owner" && userType === "Factory") {
        setLoading(true);
        exportExcelDashboard([user_cookies.user.id], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
      } else if (userRole === "SuperAdmin" && userType === "Fixer") {

      } else if (userRole === "SuperAdmin" && userType === "Region") {
        if (idStation) {
          setLoading(true);
          if (idStation === "all") {
            exportExcelDashboard([user_cookies.user.id], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          } else {
            exportExcelDashboard([idStation], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          }
        } else {
          showToast("Vui lòng chọn trạm");
        }
      } else if (!nameBranch) {
        showToast("Vui lòng chọn Chi Nhánh");
      } else {
        if (userRole === "SuperAdmin" && userType === "Factory") {
          setLoading(true);
          if (idBranch === "all") {
            exportExcelDashboard([user_cookies.user.id], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          } else if (idBranch !== ("all" && null)) {
            exportExcelDashboard([idBranch], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          } else if (idBranch === null && idStation) {
            exportExcelDashboard([idStation], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          }
        }
      }
    }
  }
  async function handleSeeDashboard() {
    let user_cookies = await getUserCookies();
    if (userRole === "Owner" && userType === "Factory") {
      setLoading(true);
      await getTableDashboard(user_cookies.user.id, "byItself", startTime, endTime);
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "", startTime, endTime);
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);

    } else if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
    } else if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getTableDashboard(user_cookies.user.id, "byItsChildren", startTime, endTime, user_cookies.user.name);
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else {
          await getTableDashboard(idStation, "byItself", startTime, endTime, user_cookies.user.name);
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      } else {
        showToast("Vui lòng chọn trạm");
      }
    } else if (!nameBranch) {
      showToast("Vui lòng chọn Chi Nhánh");
    } else {
      if (userRole === "SuperAdmin" && userType === "Factory") {
        setLoading(true);
        if (idBranch === "all") {
          await getAllDashboard(user_cookies.user.id, "", startTime, endTime);
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else if (idBranch !== ("all" && null)) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getNewFixerDashboard(idBranch, startTime, endTime, "NEW");
            await getOldFixerDashboard(idBranch, startTime, endTime, "OLD");
            await getMonthChart(idBranch, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
            await getQuarterChart(idBranch, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
          } else {
            await getTableDashboard(idBranch, "byItsChildren", startTime, endTime, nameBranch);
            await getMonthChart(idBranch, "byItsChildren", "month", selectYear, "", startTime, endTime);
            await getQuarterChart(idBranch, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
          }
        } else if (idBranch === null && idStation) {
          await getTableDashboard(idStation, "byItself", startTime, endTime);
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      }
    }
  }

  let getFullYear = new Date().getFullYear();
  let arrYear = [];
  for (let i = 2000; i <= getFullYear; i++) {
    arrYear.push(i);
  }

  let index = 0;

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    value = formatNumbers(value);
    return (
      <text x={x + width / 2} y={y} fill="red" textAnchor="middle" dy={-6}>
        {value}
      </text>
    );
  };

  const type_excel_station = [
    {
      name: "Khai báo mới",
      key: "CREATE",
    },
    {
      name: "Xuất vỏ",
      key: "EXPORT_CELL",
    },
    {
      name: "Nhập vỏ",
      key: "IMPORT_CELL",
    },
    {
      name: "Xuất bình",
      key: "EXPORT",
    },
    {
      name: "Hồi lưu",
      key: "TURN_BACK",
    },
  ];
  const type_excel_fixer = [
    {
      name: "Khai báo mới",
      key: "CREATE",
    },
    {
      name: "Xuất vỏ",
      key: "EXPORT_CELL",
    },
    {
      name: "Nhập vỏ",
      key: "IMPORT_CELL",
    },
  ];

  const columns_khaibaobinhmoi = [
    {
      title: "KHAI BÁO VỎ MỚI",
      children: [
        { title: "Loại bình", dataIndex: "name" },
        { title: "Số lượng", dataIndex: "number" },
        {
          title: "Thao tác",
          render: (text, record, index) =>
            newCylinder.length >= 1 && record.number !== 0 ? (
              <Button type="primary" htmlType="submit" onClick={() => handleSeeNew(record)}>
                Xem
              </Button>
            ) : (
              <Button type="primary" onClick={() => handleNotData(record)}>
                Xem
              </Button>
            ),
        },
      ],
    },
  ];
  const columns_binhdaxuat = [
    {
      title: "VỎ ĐÃ XUẤT",
      children: [
        { title: "Loại bình", dataIndex: "name" },
        { title: "Số lượng", dataIndex: "number" },
        {
          title: "Thao tác",
          render: (text, record, index) =>
            newExportedCylinder.length >= 1 && record.number !== 0 ? (
              <Button type="primary" htmlType="submit" onClick={() => handleSeeExported(record)}>
                Xem
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" onClick={() => handleNotData(record)}>
                Xem
              </Button>
            ),
        },
      ],
    },
  ];
  const columns_binhtonkho = [
    {
      title: "VỎ TỒN KHO",
      children: [
        { title: "Loại bình", dataIndex: "name" },
        { title: "Số lượng", dataIndex: "number" },
        {
          title: "Thao tác",
          render: (text, record, index) =>
            newInventoryCylinder.length >= 1 && record.number !== 0 ? (
              <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory(record)}>
                Xem
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" onClick={() => handleNotData(record)}>
                Xem
              </Button>
            ),
        },
      ],
    },
  ];
  const columns_details = [
    {
      title: "Danh Sách Chi Tiết Bình LPG",
      align: "center",
      children: [
        { title: "STT", dataIndex: "index", align: "center" },
        { title: "Số Seri", dataIndex: "serial", align: "center" },
        { title: "Màu sắc", dataIndex: "color", align: "center" },
        { title: "Loại van", dataIndex: "valve", align: "center" },
        { title: "Cân nặng", dataIndex: "weight", align: "center" },
        {
          title: "Ngày kiểm định",
          // dataIndex: "checkedDate",
          align: "center",
          render: (record, index) => {
            const moment = require("moment");
            const isCorrectFormat = (dateString, format) => {
              return moment(dateString, format, true).isValid();
            };
            return (
              <div>{isCorrectFormat(record.checkedDate, "DD/MM/YYYY") === true ? record.checkedDate : moment(record.checkedDate).format("DD/MM/YYYY")}</div>
            );
          },
        },
        { title: "Thương hiệu", dataIndex: "manufacture", align: "center" },
        { title: "Loại bình", dataIndex: "category", align: "center" },
      ],
    },
  ];
  // console.log("sstate" , renderCustomBarLabel);
  const columns = [
    {
      title: "Loại bình",
      dataIndex: "name",
      fixed: "left",
      width: 120,
      align: "center",
    },
    {
      title: "Khai báo mới",
      dataIndex: "create",
      width: 130,
      align: "center",
    },
    {
      title: "Nhập vỏ",
      width: 600,
      dataIndex: "nhapVo",
      align: "center",

      children: [
        {
          title: "Nhập từ Bình Khí",
          dataIndex: "importShellFromFixer",
          // key: "building",
          width: 200,
          align: "center",
        },
        {
          title: "Nhập từ Trạm Khác",
          dataIndex: "importShellFromElsewhere",
          key: "tramKhac",
          width: 200,
          align: "center",
        },
        {
          title: "Hồi Lưu",
          dataIndex: "turnback",
          key: "hoiLuu",
          width: 200,
          align: "center",
        },
        {
          title: "Hồi Lưu bình đầy",
          dataIndex: "returnFullCylinder",
          key: "hoiLuuBinhDay",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "Xuất Vỏ",
      width: 400,
      dataIndex: "xuatVo",
      children: [
        {
          title: "Xuất Bình Khí",
          dataIndex: "exportShellToFixer",
          width: 200,
          align: "center",
        },
        {
          title: "Xuất Cho Trạm Khác",
          dataIndex: "exportShellToElsewhere",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "Xuất bình",
      dataIndex: "xuatHang",
      width: 400,
      children: [
        {
          title: "Số Lượng",
          dataIndex: "numberExport",
          width: 200,
          align: "center",
        },
        {
          title: "Khối Lượng (KG)",
          dataIndex: "massExport",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "Vỏ thanh lý",
      dataIndex: "cancel",
      width: 120,
      align: "center",
    },
    {
      title: "Tồn",
      dataIndex: "inventory",
      fixed: "right",
      width: 100,
      align: "center",
    },
  ];

  const customData = (data) => {
    let result = [];
    let result1 = [];
    const dataGroupByAdress = groupBy(data, (item) => item.branchName);
    //  console.log("dataGroupByAdress"  , dataGroupByAdress);
    forEach(dataGroupByAdress, (values, key) => {
      // console.log("values" , values);
      // console.log("key" , key);
      let datatesst = values.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            startAddress: true,
            lengthAdress: values.length,
          };
        }
        return item;
      });
      result = [...result, ...datatesst];
    });

    const dataGroupByCountry = groupBy(result, (item) => item.stationName);
    forEach(dataGroupByCountry, (values, key) => {
      let datatesst1 = values.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            startCountry: true,
            lengthCountry: values.length,
          };
        }
        return item;
      });
      result1 = [...result1, ...datatesst1];
    });
    return result1;
  };
  let DATA = customData(listStationDashboard);
  console.log("DATA", DATA);
  let collumns_branch = [];
  // console.log("result", result);
  if (userRole === "SuperAdmin" && userType === "Region") {
    collumns_branch = [
      {
        title: "Trạm",
        dataIndex: "stationName",
        fixed: "left",
        align: "center",
        width: 80,
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (row.startCountry) {
            obj.props.rowSpan = row.lengthCountry;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "Loại bình",
        dataIndex: "name",
        width: 120,
        align: "center",
        fixed: "left",
      },
      {
        title: "Khai báo mới",
        dataIndex: "create",
        width: 130,
        align: "center",
      },
      {
        title: "Nhập vỏ",
        width: 600,
        dataIndex: "nhapVo",
        align: "center",
        children: [
          {
            title: "Nhập từ Bình Khí",
            dataIndex: "importShellFromFixer",
            // key: "building",
            width: 200,
            align: "center",
          },
          {
            title: "Nhập từ Trạm Khác",
            dataIndex: "importShellFromElsewhere",
            key: "tramKhac",
            width: 200,
            align: "center",
          },
          {
            title: "Hồi Lưu",
            dataIndex: "turnback",
            key: "hoiLuu",
            width: 200,
            align: "center",
          },
          {
            title: "Hồi Lưu bình đầy",
            dataIndex: "returnFullCylinder",
            key: "hoiLuuBinhDay",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xuất Vỏ",
        width: 400,
        dataIndex: "xuatVo",
        children: [
          {
            title: "Xuất Bình Khí",
            dataIndex: "exportShellToFixer",
            width: 200,
            align: "center",
          },
          {
            title: "Xuất Cho Trạm Khác",
            dataIndex: "exportShellToElsewhere",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xuất bình",
        dataIndex: "xuatHang",
        width: 400,
        children: [
          {
            title: "Số Lượng",
            dataIndex: "numberExport",
            width: 200,
            align: "center",
          },
          {
            title: "Khối Lượng (KG)",
            dataIndex: "massExport",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Vỏ thanh lý",
        dataIndex: "cancel",
        width: 120,
        align: "center",
      },
      {
        title: "Vỏ tồn tại trạm",
        dataIndex: "inventory",
        fixed: "right",
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
  } else {
    collumns_branch = [
      {
        title: "Chi nhánh",
        dataIndex: "branchName",
        fixed: "left",
        align: "center",
        width: 120,
        fixed: "left",
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (row.startAddress) {
            obj.props.rowSpan = row.lengthAdress;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "Trạm",
        dataIndex: "stationName",
        fixed: "left",
        align: "center",
        width: 80,
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (row.startCountry) {
            obj.props.rowSpan = row.lengthCountry;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "Loại bình",
        dataIndex: "name",
        width: 120,
        align: "center",
        fixed: "left",
      },
      {
        title: "Khai báo mới",
        dataIndex: "create",
        width: 130,
        align: "center",
      },
      {
        title: "Nhập vỏ",
        width: 600,
        dataIndex: "nhapVo",
        align: "center",
        children: [
          {
            title: "Nhập từ Bình Khí",
            dataIndex: "importShellFromFixer",
            // key: "building",
            width: 200,
            align: "center",
          },
          {
            title: "Nhập từ Trạm Khác",
            dataIndex: "importShellFromElsewhere",
            key: "tramKhac",
            width: 200,
            align: "center",
          },
          {
            title: "Hồi Lưu",
            dataIndex: "turnback",
            key: "hoiLuu",
            width: 200,
            align: "center",
          },
          {
            title: "Hồi Lưu bình đầy",
            dataIndex: "returnFullCylinder",
            key: "hoiLuuBinhDay",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xuất Vỏ",
        width: 400,
        dataIndex: "xuatVo",
        children: [
          {
            title: "Xuất Bình Khí",
            dataIndex: "exportShellToFixer",
            width: 200,
            align: "center",
          },
          {
            title: "Xuất Cho Trạm Khác",
            dataIndex: "exportShellToElsewhere",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xuất bình",
        dataIndex: "xuatHang",
        width: 400,
        children: [
          {
            title: "Số Lượng",
            dataIndex: "numberExport",
            width: 200,
            align: "center",
          },
          {
            title: "Khối Lượng (KG)",
            dataIndex: "massExport",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Vỏ thanh lý",
        dataIndex: "cancel",
        width: 120,
        align: "center",
      },
      {
        title: "Vỏ tồn tại trạm",
        dataIndex: "inventory",
        fixed: "right",
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
  }
  let arr = [];
  const columns_parent1 = [
    {
      title: "CHI NHÁNH",
      dataIndex: "branch",
    },
    {
      title: "SỐ VỎ KHAI BÁO MỚI",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
  ];

  const columns_parent2 = [
    {
      title: "CHI NHÁNH",
      dataIndex: "branch",
    },
    {
      title: "XUẤT BÌNH",
      children: typeCylinder,
    },
    {
      title: "TỔNG SỐ BÌNH (BÌNH)",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "KHỐI LƯỢNG (KG)",
      dataIndex: "tongkhoiLuong",
    },
  ];
  const columns_parent3 = [
    {
      title: "CHI NHÁNH",
      dataIndex: "branch",
    },
    {
      title: "SỐ VỎ HỒI LƯU",
      children: typeCylinder,
    },
    {
      title: "TỔNG SỐ VỎ",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
  ];
  const columns_parent4 = [
    {
      title: "CHI NHÁNH",
      dataIndex: "branch",
    },
    {
      title: "SỐ VỎ TỒN KHO",
      children: typeCylinder,
    },
    {
      title: "TỔNG SỐ VỎ",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
  ];
  return (
    <div className="section-statistical" id="statistical">
      <ReactCustomLoading isLoading={loading} />
      <div className="section-statistical__report">
        <h1>BÁO CÁO THỐNG KÊ</h1>
        <div className="section-statistical__report__title">
          <div className="container-fluid">
            <div className="row border rouded">
              <div className="col-12 d-flex mt-3">
                <h2>Thời gian</h2>
                <button className="btn-history active" onClick={handleThisTime}>
                  Hôm nay
                </button>
                <button className="btn-history" onClick={handleYesterday}>
                  Hôm qua
                </button>
                <button className="btn-history" onClick={handleThisWeek}>
                  Tuần này
                </button>
                <button className="btn-history" onClick={handleThisMonth}>
                  Tháng này
                </button>
                <div className="RangePicker--custom">
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                </div>
              </div>
              <div className="col-12 d-flex my-5">
                <h5>Kiểu xuất excel</h5>
                <div className="select--custom">
                  <Select placeholder="Chọn" style={{ width: 120 }} onChange={handleChangeExcel}>
                    {(userRole === "SuperAdmin" && userType === "Fixer") ||
                      (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer")
                      ? type_excel_fixer.map((value, index) => {
                        return (
                          <Option key={index} value={value.key}>
                            {value.name}
                          </Option>
                        );
                      })
                      :
                      type_excel_station.map((value, index) => {
                        return (
                          <Option key={index} value={value.key}>
                            {value.name}
                          </Option>
                        );
                      })
                    }
                  </Select>
                </div>
                {userRole === "SuperAdmin" && userType === "Factory" ? (
                  <div className="d-flex mx-4">
                    <h5>Chi nhánh</h5>
                    <div className="select--custom">
                      <Select placeholder="Chọn" style={{ minWidth: 150 }} onChange={(value, name) => handleChangeBranch(value, name)}>
                        <Option value="all" name="all">
                          <b>Tất cả</b>
                        </Option>
                        {getBranch.map((value, index) => {
                          return (
                            <Option name={value} key={index} value={value.id}>
                              {value.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {getStation.length !== 0 ? (
                  <div className="d-flex">
                    <h5>Trạm</h5>
                    <div className="select--custom">
                      <Select placeholder="Chọn" value={nameStation} style={{ minWidth: 150 }} onChange={handleChangeStation}>
                        {userType === "Region" && userRole === "SuperAdmin" ? (
                          <Option value="all" name="all">
                            <b>Tất cả</b>
                          </Option>
                        ) : (
                          ""
                        )}
                        {getStation
                          ? getStation.map((value, index) => {
                            return (
                              <Option key={index} value={value}>
                                {value.name}
                              </Option>
                            );
                          })
                          : ""}
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div>
                  <button className="btn-export" onClick={handleExportExcel}>
                    Xuất excel
                  </button>
                  <button className="btn-see-report" onClick={handleSeeDashboard}>
                    Xem báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-statistical__report__body">
          {/*Tài khoản Mẹ*/}
          {userRole === "SuperAdmin" && userType === "Factory" && idBranch === "all" ? (
            <div className="container-fluid">
              <div className="row">
                <div className="col-6">
                  <Table bordered dataSource={listCreate} columns={columns_parent1} pagination={false} />
                </div>
                <div className="col-6">
                  <Table bordered dataSource={listExport} columns={columns_parent2} pagination={false} />
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-6">
                  <Table bordered dataSource={listTurnback} columns={columns_parent3} pagination={false} />
                </div>
                <div className="col-6">
                  <Table bordered dataSource={listInventory} columns={columns_parent4} pagination={false} />
                </div>
              </div>
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" && userType === "Factory" && userTypeFixer === "Region" && idBranch !== ("all" && null)) ? (
            <div className="section-statistical__report__body">
              <div className="container">
                <Table dataSource={DATA} columns={collumns_branch} size="small" bordered scroll={{ x: 2100, y: 480 }} pagination={false} />
              </div>
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" && userType === "Factory" && userTypeFixer === "Fixer" && idBranch !== ("all" && null)) ? (
            <div className="section-statistical__report__body">
              <div className="container">
                <Tabs defaultActiveKey="1" onChange={handleChangeTab}>
                  <TabPane tab="Bình mới" key="1">
                    <div className="section-statistical__report__body mt-2">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-4">
                            <Table columns={columns_khaibaobinhmoi} dataSource={newCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhdaxuat} dataSource={newExportedCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhtonkho} dataSource={newInventoryCylinder} pagination={false} bordered />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="Bình sửa chữa" key="2">
                    <div className="section-statistical__report__body mt-2">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-4">
                            <Table columns={columns_khaibaobinhmoi} dataSource={oldCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhdaxuat} dataSource={oldExportedCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhtonkho} dataSource={oldInventoryCylinder} pagination={false} bordered />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
                <Modal centered visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} width={1000}>
                  <div className="section-statistical__report">
                    <div className="section-statistical__report__body">
                      <div className="container-fluid">
                        <Table
                          dataSource={
                            checkModal === "1"
                              ? detailNewCylinder
                              : checkModal === "2"
                                ? detailExportCylinder
                                : checkModal === "3"
                                  ? detailInventoryCylinder
                                  : ""
                          }
                          columns={columns_details}
                          pagination={true}
                          bordered
                        />
                        <Form.Item>
                          <Button type="primary" size="large" onClick={() => handleSeeExcel()}>
                            Xuất excel
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          ) : (userRole === "Owner" && userType === "Factory") || (userRole === "SuperAdmin" && userType === "Factory" && idBranch === null && idStation) ? (
            <div className="section-statistical__report__body">
              <div className="container">
                <Table columns={columns} dataSource={listStationDashboard} scroll={{ x: 1700 }} bordered />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="chart">
            <ResponsiveContainer width="100%" height={600}>
              <ComposedChart
                width={1200}
                height={600}
                data={listChart}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                {/* <YAxis /> */}
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => new Intl.NumberFormat("nl-BE").format(value)} />
                <Legend />
                {typeMonthChart.map((value, index, arr) => {
                  if (arr.length - 1 === index) {
                    return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={40} stackId="a" fill={value.color} label={renderCustomBarLabel} />;
                  } else return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={40} stackId="a" fill={value.color} />;
                })}
                {!((userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") || (userRole === "SuperAdmin" && userType === "Fixer"))
                  ? massMonthLine.map((value, index, arr) => {
                    if (arr.length - 1 === index) {
                      return <Line yAxisId="right" type="monotone" dataKey={value.name} stroke="blue" />;
                    }
                  })
                  : ""}
              </ComposedChart>
            </ResponsiveContainer>
            <div className="chart-note">
              <p className="chart-note-p">
                Biểu đồ xuất bình theo tháng từ tháng {startMonth}/{startYear} - {endMonth}/{endYear}
              </p>
              <div className="chart-note__time ">
                <div className="d-flex">
                  <span>Thời gian</span>
                  <button className="btn-history active" onClick={handleCurrentYear}>
                    Năm nay
                  </button>
                  <button className="btn-history" onClick={handlePreYear}>
                    Năm trước
                  </button>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    placeholder="Chọn năm"
                    optionFilterProp="children"
                    onChange={handleYear}
                    value={selectYear}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {arrYear.map((item, index) => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                  <button onClick={handleMonthChart} className="btn-see">
                    Xem
                  </button>
                </div>
              </div>
            </div>

            <ComposedChart
              width={800}
              height={600}
              data={listQuarterChart}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value) => new Intl.NumberFormat("nl-BE").format(value)} />
              <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
              {typeQuarterChart.map((value, index, arr) => {
                if (arr.length - 1 === index) {
                  return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={60} stackId="a" fill={value.color} label={renderCustomBarLabel} />;
                } else {
                  return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={60} stackId="a" fill={value.color} />;
                }
              })}
              {!((userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") || (userRole === "SuperAdmin" && userType === "Fixer"))
                ? massQuarterLine.map((value, index, arr) => {
                  if (arr.length - 1 === index) {
                    return <Line yAxisId="right" type="monotone" dataKey={value.name} stroke="blue" />;
                  }
                })
                : ""}
            </ComposedChart>
            <div className="chart-note">
              <p className="chart-note-quater">
                Biểu đồ xuất bình theo quý từ tháng {startMonth}/{startYear} - {endMonth}/{endYear}
              </p>
              <div className="chart-note__time ">
                <div className="d-flex">
                  <span style={{ lineHeight: "35px" }}>Thời gian</span>
                  <button className="btn-history active" onClick={handleCurrentYearQuarter}>
                    Năm nay
                  </button>
                  <button className="btn-history" onClick={handlePreYearQuarter}>
                    Năm trước
                  </button>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    placeholder="Chọn năm"
                    optionFilterProp="children"
                    onChange={handleYearQuarter}
                    value={selectYearQuarter}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {arrYear.map((item, index) => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                  <button onClick={handleQuarterChart} className="btn-see">
                    Xem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistical;
