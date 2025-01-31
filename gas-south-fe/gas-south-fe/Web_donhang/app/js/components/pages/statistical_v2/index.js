import { Select as Select2, Button, DatePicker, Table, Tabs } from "antd";
import Select from "react-select";
import moment from "moment";
// import getAllBranch from "../../../../api/getAllBranch";
import React, { Component, Fragment, useEffect, useState } from "react";
import getUserCookies from "getUserCookies";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";
import getAllStation from "../../../../api/getAllStation";
import getAllBranch from "../../../../api/getAllBranch";
import getAllListCustomer from "../../../../api/getAllListCustomer";
import getStatisticByStation from "../../../../api/getStatisticByStation";
import getAggregateDashboard from "../../../../api/getAggregateDashboard";
import getStatisticAllRegion from "../../../../api/getStatisticAllRegion";
import getExportChart from "../../../../api/getExportChart";
import getDashboardFixer from "../../../../api/getDashboardFixer";
import getAggregateRepairFactory from "../../../../api/getAggregateRepairFactory";
import detailDashboardFixer from "../../../../api/detailDashboardFixer";
import getDetailCylindersImexExcels from "../../../../api/getDetailCylindersImexExcels";
import exportExcel from "../../../../api/exportExcel";
import ReactCustomLoading from "ReactCustomLoading";
import showToast from "showToast";
import getStationByIDAPI from "../../../../api/getStationByIdAPI";
import callApi from "./../../../util/apiCaller";
import { GETWAREHOUSE } from "../../../config/config";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import {
  urlDetailHistoryImport_New,
  urlSeeDetailDataExport_New,
  urlDetailStatistialBranch,
} from "../../../config/config-reactjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Line,
  ComposedChart,
} from "recharts";
import "./statistical.scss";
import getAllCustomerAPI from "../../../../api/getAllCustomer";
import { element, object } from "prop-types";
import Cookies from "js-cookie";
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

function Statistical_V2() {
  const [idBranchNull, setIdBranchNull] = useState(false);
  const [khachHangHoiLuu, setKhachHangHoiLuu] = useState("");
  const [khachHangXuat, setKhachHangXuat] = useState("");
  const [danhSachKhachHangXuat, setDanhSachKhachHangXuat] = useState([]);
  const [tramXuat, setTramXuat] = useState("");
  const [danhSachTramXuat, setDanhSachTramXuat] = useState([]);
  const [tramNhap, setTramNhap] = useState("");
  const [danhSachTramNhap, setDanhSachTramNhap] = useState([]);
  const [exportEmptyTo, setExportEmptyTo] = useState("all");
  const [importEmptyFrom, setImportEmptyFrom] = useState("all");
  // const [exportFullTo, setExportFullTo] = useState("all");
  const [statisticType, setStatisticType] = useState(0);
  const [statisticTypeList, setStatisticTypeList] = useState([
    { value: 0, label: "Tất cả" },
    { value: 2, label: "Khai báo" },
    { value: 3, label: "Xuất bình" },
    { value: 4, label: "Xuất vỏ" },
    { value: 5, label: "Nhập vỏ" },
  ]);
  const [statisticTypeListBinhKhi, setStatisticTypeListBinhKhi] = useState([
    "Khai báo",
    "Xuất vỏ",
    "Tồn kho",
  ]);
  const [cylinderCount, setCylinderCount] = useState(0);
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [danhSachTramSearch, setDanhSachTramSearch] = useState([]);
  const [getBranch, setBranch] = useState([]);
  const [getStation, setStation] = useState([]);
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [listStationDashboard, setStationDashboard] = useState([]);
  const [typeCylinder, setTypeCylinder] = useState([]);
  const [listTatCaTramSearch, setListTatCaTramSearch] = useState([]);
  const [listCreateTramSearch, setListCreateTramSearch] = useState([]);
  const [listExportTramSearch, setListExportTramSearch] = useState([]);
  const [listExportEmptyTramSearch, setListExportEmptyTramSearch] = useState(
    []
  );
  const [listImportEmptyTramSearch, setListImportEmptyTramSearch] = useState(
    []
  );
  const [
    listReturnFullCylinderTramSearch,
    setListReturnFullCylinderTramSearch,
  ] = useState([]);

  const [listCreate, setListCreate] = useState([]);
  const [listExport, setListExport] = useState([]);
  const [listNewBinhKhi, setListNewBinhKhi] = useState([]);
  const [listOldBinhKhi, setListOldBinhKhi] = useState([]);
  const [listCreatedBinhKhi, setListCreatedBinhKhi] = useState([]);
  const [listExportBinhKhi, setListExportBinhKhi] = useState([]);
  const [listInventoryBinhKhi, setListInventoryBinhKhi] = useState([]);
  const [listExportEmpty, setListExportEmpty] = useState([]);
  const [listImportEmpty, setListImportEmpty] = useState([]);
  const [listTurnback, setListTurnback] = useState([]);
  const [listReturnFullCylinder, setListReturnFullCylinder] = useState([]);
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

  function numberWithCommas(x) {
    x = x && x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1.$2");
    return x;
  }

  async function getUser() {
    //Phân quyền
    let user_cookies = await getUserCookies();
    if (user_cookies.user.userType === "Personnel") {
      const user = await getStationByIDAPI(user_cookies.user.isChildOf);
      user_cookies.user = user.data.data;
      //
    }
    if (user_cookies) {
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
    }
    // Lấy danh sách chi nhánh
    if (
      user_cookies.user.userRole === "SuperAdmin" &&
      user_cookies.user.userType === "Factory"
    ) {
      let resultBranch = await getAllStation(user_cookies.user.id);
      // this.setState({ cylinderCount: resultBranch.cylinderCount });
      setCylinderCount(resultBranch.data.cylinderCount);
      if (resultBranch.data && resultBranch.data.data) {
        setBranch([
          ...[
            {
              value: "all",
              label: "Tất cả",
              userType: "SuperAdmin",
              userRole: "Factory",
            },
          ],
          ...resultBranch.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
              userType: item.userType,
              userRole: item.userRole,
            };
          }),
        ]);
      }
    } else {
      let resultBranch = await getAllStation("5f3ddac307778d13a45e2efa");
      setCylinderCount(resultBranch.data.cylinderCount);
      if (resultBranch.data && resultBranch.data.data) {
        setBranch([
          ...[
            {
              value: "all",
              label: "Tất cả",
              userType: "SuperAdmin",
              userRole: "Factory",
            },
          ],
          ...resultBranch.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
              userType: item.userType,
              userRole: item.userRole,
            };
          }),
        ]);
        let a = 5;
        let b = getBranch();
      }
    }

    // Lấy danh sách trạm
    if (
      user_cookies.user.userRole === "SuperAdmin" &&
      user_cookies.user.userType === "Region"
    ) {
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
    setStartMonth(value[0]._d.getMonth() + 1);
    setStartYear(value[0]._d.getFullYear());
    setEndMonth(value[1]._d.getMonth() + 1);
    setEndYear(value[1]._d.getFullYear());

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
    $(".btn-history").each(function(item, index) {
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
    $(".btn-history").each(function(item, index) {
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
    $(".btn-history").each(function(item, index) {
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

  //Lấy danh sách trạm
  async function handleChangeStatisticType(value) {
    if (value == 0) {
      setTramNhap("");
      setTramXuat("");
      setKhachHangXuat("");
    }

    setStatisticType(value);
    setExportEmptyTo("all");
    // setExportFullTo("all");
    setImportEmptyFrom("all");
    if (value == 4) {
      setTramXuat("all");
      setTramNhap("");
      setKhachHangXuat("");
    } else if (value == 5) {
      setTramNhap("all");
      setTramXuat("");
      setKhachHangXuat("");
    } else if (value == 3) {
      setKhachHangXuat("all");
      setTramNhap("");
      setTramXuat("");
      let user_cookies = await getUserCookies();
      let allCustomer = await getAllBranch("allKhachHang", "Factory");
      let allKhoXe = await callApi(
        "POST",
        GETWAREHOUSE,
        { id: "all" },
        "Bearer " + user_cookies.token
      );
      allKhoXe = allKhoXe.data.data.map((item) => {
        return { value: item.id, label: item.name };
      });
      setDanhSachKhachHangXuat([
        ...[{ value: "all", label: "Tất cả" }],
        ...allCustomer.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      ]);
    } else if (value == 6) {
      setTramNhap("");
      setTramXuat("");
      setKhachHangXuat("");
      setKhachHangHoiLuu("");
      let user_cookies = await getUserCookies();
      let allCustomer = await getAllBranch("allKhachHang", "Factory");
      let allKhoXe = await callApi(
        "POST",
        GETWAREHOUSE,
        { id: "all" },
        "Bearer " + user_cookies.token
      );
      allKhoXe = allKhoXe.data.data.map((item) => {
        return { value: item.id, label: item.name };
      });
      setDanhSachKhachHangXuat([
        ...[{ value: "all", label: "Tất cả" }],
        ...allCustomer.data.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      ]);
    }
  }

  async function handleChangeBranch(value, name) {
    setTramXuat("");
    setTramNhap("");
    setKhachHangXuat("");
    // setNameStation("");
    setNameBranch(name.props.object.label);
    setUserTypeFixer(name.props.object.userType);
    setUserRoleFixer(name.props.object.userRole);
    setStationDashboard([]);
    setListChart([]);
    setListQuarterChart([]);
    setIdBranch(value);
    setIdBranchNull(false);

    if (value !== "all" && name.props.object.userType == "Fixer") {
      setStatisticTypeList([
        { value: 0, label: "Tất cả" },
        { value: 2, label: "Khai báo" },
        { value: 4, label: "Xuất vỏ" },
        { value: 5, label: "Tồn kho" },
      ]);
    } else if (value == "all" || name.props.object.userType == "Region") {
      if (name.props.object.userType == "Region") {
        let resultBranch = await getAllBranch(value);
        if (resultBranch)
          setDanhSachTramSearch([
            ...[{ id: "all", name: "Tất cả" }],
            ...resultBranch.data.data,
          ]);
        setStatisticTypeList([
          { value: 0, label: "Tất cả" },
          { value: 6, label: "Hồi lưu bình đầy" },
          { value: 2, label: "Khai báo" },
          { value: 3, label: "Xuất bình" },
          { value: 4, label: "Xuất vỏ" },
          { value: 5, label: "Nhập vỏ" },
        ]);
      } else
        setStatisticTypeList([
          { value: 0, label: "Tất cả" },
          { value: 2, label: "Khai báo" },
          { value: 3, label: "Xuất bình" },
          { value: 4, label: "Xuất vỏ" },
          { value: 5, label: "Nhập vỏ" },
        ]);
    }
  }

  async function handleChangeLink(value, statisticType) {
    if (!idBranch || idBranch == "all") {
      getBranch.map(async (item) => {
        if (item.label == value) {
          setTramXuat("");
          setTramNhap("");
          setKhachHangXuat("");
          setNameStation("");
          setIdBranch(item.value);
          setIdBranchNull(false);
          setNameBranch(item.label);
          setUserTypeFixer(item.userType);
          setUserRoleFixer(item.userRole);
          setStationDashboard([]);
          setListChart([]);
          setListQuarterChart([]);
          if (item.userType == "Region")
            setStatisticTypeList([
              { value: 0, label: "Tất cả" },
              { value: 2, label: "Khai báo" },
              { value: 6, label: "Hồi lưu bình đầy" },
              { value: 3, label: "Xuất bình" },
              { value: 4, label: "Xuất vỏ" },
              { value: 5, label: "Nhập vỏ" },
            ]);
          else if (item.userType == "Fixer")
            setStatisticTypeList([
              { value: 0, label: "Tất cả" },
              { value: 2, label: "Khai báo" },
              { value: 4, label: "Xuất vỏ" },
              { value: 5, label: "Tồn kho" },
            ]);
          setStatisticType(statisticType);
          // await handleSeeDashboard();
        }
      });
    } else {
      let idTramSearch =
        danhSachTramSearch.find((item) => item.name == value) &&
        danhSachTramSearch.find((item) => item.name == value).id;
      setNameStation(value);
      setIdStation(idTramSearch);
      setIdBranchNull(true);
      setStatisticType(statisticType);
      setListChart([]);
      setListQuarterChart([]);
      setStationDashboard([]);
    }
  }

  async function handleChangeStation(value, name) {
    if (value === "all") {
      await setNameStation("Tất cả");
      await setIdStation("all");
      await setIdBranchNull(false);
    } else {
      await setNameStation(name.props.children);
      await setIdStation(value);
      await setIdBranchNull(true);
    }
    console.log("nameStation", nameStation);

    await setListChart([]);
    await setListQuarterChart([]);
    await setStationDashboard([]);
  }

  async function handleChangeKhachHangXuat(value) {
    setKhachHangXuat(value.value);
  }

  async function handleChangeKhachHangHoiLuu(value) {
    setKhachHangHoiLuu(value.value);
  }

  async function handleChangeTramXuat(value) {
    setTramXuat(value.value);
  }

  async function handleChangeTramNhap(value) {
    setTramNhap(value.value);
  }

  async function handlePreYear() {
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function(item, index) {
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
    $(".btn-history").each(function(item, index) {
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
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function(item, index) {
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
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function(item, index) {
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

  async function getQuarterChart(
    target,
    statisticalType,
    dataType,
    year,
    filter,
    startDate,
    endDate
  ) {
    let color = ["#66BE02", "#23772F", "#037aff", "#FF6600"];
    let array = [];
    let type = [];
    let mass = [];
    let result = await getExportChart(
      target,
      statisticalType,
      dataType,
      year,
      filter,
      startDate,
      endDate
    );
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
            [v.name]: v.statistic.exportCylinder,
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
    if (startTime === "" && endTime === "") {
      $(".chart-note-quater").text(function() {
        return "Biểu đồ xuất bình theo quý trong năm " + selectYearQuarter;
      });
    } else {
      $(".chart-note-quater").text(function() {
        return (
          "Biểu đồ xuất bình theo quý từ tháng " +
          startMonth +
          "/" +
          startYear +
          "-" +
          endMonth +
          "/" +
          endYear
        );
      });
    }
    if (userRole === "SuperAdmin" && userType === "Factory") {
      if (!statisticType) {
        showToast("Vui lòng chọn loại thống kê");
      } else {
        setLoading(true);
        if (idBranch === "all") {
          await getQuarterChart(
            user_cookies.user.id,
            "byItsChildren",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        } else if (idBranch !== "all" && !idBranchNull) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getQuarterChart(
              idBranch,
              "byItself",
              "quarter",
              selectYearQuarter,
              "EXPORT_CELL",
              "",
              startTime,
              endTime
            );
          } else {
            await getQuarterChart(
              idBranch,
              "byItsChildren",
              "quarter",
              selectYearQuarter,
              "",
              startTime,
              endTime
            );
          }
        } else if (idBranchNull && idStation) {
          await getQuarterChart(
            idStation,
            "byItself",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        }
      }
    }

    if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getQuarterChart(
        user_cookies.user.id,
        "byItself",
        "quarter",
        selectYearQuarter,
        "EXPORT_CELL",
        "",
        startTime,
        endTime
      );
    }

    if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getQuarterChart(
            user_cookies.user.id,
            "byItsChildren",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        } else {
          await getQuarterChart(
            idStation,
            "byItself",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        }
      } else {
        showToast("Vui lòng chọn trạm");
      }
    }
    if (userRole === "Owner" && userType === "Factory") {
      await getQuarterChart(
        user_cookies.user.id,
        "byItself",
        "quarter",
        selectYearQuarter,
        "",
        startTime,
        endTime
      );
    }
  }

  async function getMonthChart(
    target,
    statisticalType,
    dataType,
    year,
    filter,
    startDate,
    endDate
  ) {
    let color = ["#66BE02", "#23772F", "#037aff", "#FF6600"];
    let array = [];
    let type = [];
    let mass = [];
    let result = await getExportChart(
      target,
      statisticalType,
      dataType,
      year,
      filter,
      startDate,
      endDate
    );
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
            [v.name]: v.statistic.exportCylinder,
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
    if (startTime === "" && endTime === "") {
      $(".chart-note-p").text(function() {
        return "Biểu đồ xuất bình theo tháng trong năm " + selectYear;
      });
    } else {
      $(".chart-note-p").text(function() {
        return (
          "Biểu đồ xuất bình theo tháng từ tháng " +
          startMonth +
          "/" +
          startYear +
          "-" +
          endMonth +
          "/" +
          endYear
        );
      });
    }
    if (userRole === "SuperAdmin" && userType === "Factory") {
      if (!nameBranch) {
        showToast("Vui lòng chọn Đơn Vị");
      } else {
        setLoading(true);
        if (idBranch === "all") {
          await getMonthChart(
            user_cookies.user.id,
            "byItsChildren",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
        } else if (idBranch !== "all" && !idBranch) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getMonthChart(
              idBranch,
              "byItself",
              "month",
              selectYear,
              "EXPORT_CELL",
              "",
              startTime,
              endTime
            );
          } else {
            await getMonthChart(
              idBranch,
              "byItsChildren",
              "month",
              selectYear,
              "",
              startTime,
              endTime
            );
          }
        } else if (idBranchNull && idStation) {
          await getMonthChart(
            idStation,
            "byItself",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
        }
      }
    }

    if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getMonthChart(
        user_cookies.user.id,
        "byItself",
        "month",
        selectYear,
        "EXPORT_CELL",
        "",
        startTime,
        endTime
      );
    }

    if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getMonthChart(
            user_cookies.user.id,
            "byItsChildren",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
        } else {
          await getMonthChart(
            idStation,
            "byItself",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
        }
      } else {
        showToast("Vui lòng chọn trạm");
      }
    }
    if (userRole === "Owner" && userType === "Factory") {
      await getMonthChart(
        user_cookies.user.id,
        "byItself",
        "month",
        selectYear,
        "",
        startTime,
        endTime
      );
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
    let resultDetail = await detailDashboardFixer(
      idBranch,
      startTime,
      endTime,
      checkChangeTab === "1" ? "NEW" : "OLD",
      null,
      record.id ? record.id : null
    );
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

  async function getNewFixerDashboard(
    target,
    startDate,
    endDate,
    statisticalType
  ) {
    let typeCylinder = [];
    let resultDashboard = await getAggregateRepairFactory(
      target,
      startDate,
      endDate,
      statisticalType
    );
    setLoading(false);
    if (resultDashboard.data.success === true) {
      resultDashboard.data.returnData.forEach((item) => {
        item.Declaration = item.Declaration.filter((element) => element.code);
        item.Export = item.Export.filter((element) => element.code);
        item.Inventory = item.Inventory.filter((element) => element.code);
      });

      if (statisticType == 0) {
        let objectCreateNewBinhKhi = { statisticType: "Khai báo" };
        let objectCreateOldBinhKhi = { statisticType: "Khai báo" };
        let tongBinhCreateNew = 0;
        let tongBinhCreateOld = 0;
        let objectExportNewBinhKhi = { statisticType: "Xuất vỏ" };
        let objectExportOldBinhKhi = { statisticType: "Xuất vỏ" };
        let tongBinhExportNew = 0;
        let tongBinhExportOld = 0;
        let objectInventoryNewBinhKhi = { statisticType: "Tồn kho" };
        let objectInventoryOldBinhKhi = { statisticType: "Tồn kho" };
        let tongBinhInventoryNew = 0;
        let tongBinhInventoryOld = 0;
        resultDashboard.data.returnData.map((item) => {
          item.Declaration.map((element) => {
            let typeCylinderTemp = {
              dataIndex: element.code,
              title: element.name,
              align: "center",
            };
            if (
              !typeCylinder.some((ele) => {
                if (ele.dataIndex == element.code) return true;
              })
            ) {
              typeCylinder.push(typeCylinderTemp);
            }
            objectCreateNewBinhKhi[element.code] = element.numberNew || 0;
            tongBinhCreateNew += element.numberNew || 0;
            objectCreateOldBinhKhi[element.code] = element.numberOld || 0;
            tongBinhCreateOld += element.numberOld || 0;
          });
          objectCreateNewBinhKhi.tongBinhNew = tongBinhCreateNew;
          objectCreateOldBinhKhi.tongBinhOld = tongBinhCreateOld;

          item.Export.map((element) => {
            let typeCylinderTemp = {
              dataIndex: element.code,
              title: element.name,
              align: "center",
            };
            if (
              !typeCylinder.some((ele) => {
                if (ele.dataIndex == element.code) return true;
              })
            ) {
              typeCylinder.push(typeCylinderTemp);
            }

            objectExportNewBinhKhi[element.code] = element.numberNew || 0;
            tongBinhExportNew += element.numberNew || 0;
            objectExportOldBinhKhi[element.code] = element.numberOld || 0;
            tongBinhExportOld += element.numberOld || 0;
          });
          objectExportNewBinhKhi.tongBinhNew = tongBinhExportNew;
          objectExportOldBinhKhi.tongBinhOld = tongBinhExportOld;

          item.Inventory.map((element) => {
            let typeCylinderTemp = {
              dataIndex: element.code,
              title: element.name,
              align: "center",
            };
            if (
              !typeCylinder.some((ele) => {
                if (ele.dataIndex == element.code) return true;
              })
            ) {
              typeCylinder.push(typeCylinderTemp);
            }
            objectInventoryNewBinhKhi[element.code] = element.numberNew || 0;
            tongBinhInventoryNew += element.numberNew || 0;
            objectInventoryOldBinhKhi[element.code] = element.numberOld || 0;
            tongBinhInventoryOld += element.numberOld || 0;
          });
          objectInventoryNewBinhKhi.tongBinhNew = tongBinhInventoryNew;
          objectInventoryOldBinhKhi.tongBinhOld = tongBinhInventoryOld;
        });

        setTypeCylinder(typeCylinder);
        let arrayNewBinhKhi = [
          objectCreateNewBinhKhi,
          objectExportNewBinhKhi,
          objectInventoryNewBinhKhi,
        ];
        arrayNewBinhKhi = formatNumber(arrayNewBinhKhi);
        setListNewBinhKhi(arrayNewBinhKhi);

        let arrayOldBinhKhi = [
          objectCreateOldBinhKhi,
          objectExportOldBinhKhi,
          objectInventoryOldBinhKhi,
        ];
        arrayOldBinhKhi = formatNumber(arrayOldBinhKhi);
        setListOldBinhKhi(arrayOldBinhKhi);
      } else if (statisticType == 2) {
        let objectCreateNewBinhKhi = {
          statisticType: "Bình mới",
        };
        let objectCreateOldBinhKhi = {
          statisticType: "Bình cũ",
        };
        let tongBinhCreateNew = 0;
        let tongBinhCreateOld = 0;
        resultDashboard.data.returnData.map((item) => {
          item.Declaration.map((element) => {
            let typeCylinderTemp = {
              dataIndex: element.code,
              title: element.name,
              align: "center",
            };
            if (
              !typeCylinder.some((ele) => {
                if (ele.dataIndex == element.code) return true;
              })
            ) {
              typeCylinder.push(typeCylinderTemp);
            }
            objectCreateNewBinhKhi[element.code] = element.numberNew || 0;
            tongBinhCreateNew += element.numberNew || 0;
            objectCreateOldBinhKhi[element.code] = element.numberOld || 0;
            tongBinhCreateOld += element.numberOld || 0;
          });
          objectCreateNewBinhKhi.tongBinh = tongBinhCreateNew;
          objectCreateOldBinhKhi.tongBinh = tongBinhCreateOld;
          tongBinhCreateNew = 0;
          tongBinhCreateOld = 0;
        });

        setTypeCylinder(typeCylinder);
        let arrayCreatedBinhKhi = [
          objectCreateNewBinhKhi,
          objectCreateOldBinhKhi,
        ];
        arrayCreatedBinhKhi = formatNumber(arrayCreatedBinhKhi);
        setListCreatedBinhKhi(arrayCreatedBinhKhi);
      } else if (statisticType == 4) {
        if (tramXuat && tramXuat != "all") {
          let tongBinhNew = 0;
          let tongBinhOld = 0;
          resultDashboard.data.returnData.forEach((item) => {
            item.Export = item.Export.filter((element) => {
              if (
                element.exportEmptyCylinderObject &&
                element.exportEmptyCylinderObject.length
              ) {
                element.exportEmptyCylinderObject.map((ele) => {
                  ele.map((value) => {
                    if (value.status == "new" && value.to == tramXuat)
                      tongBinhNew += value.quantity;
                  });
                });
                element.numberNew = tongBinhNew;
                tongBinhNew = 0;
                element.exportEmptyCylinderObject.map((ele) => {
                  ele.map((value) => {
                    if (value.status == "old" && value.to == tramXuat)
                      tongBinhOld += value.quantity;
                  });
                });
                element.numberOld = tongBinhOld;

                tongBinhOld = 0;
                return true;
              }
            });
          });
        } else if (tramXuat && tramXuat == "all") {
          let tongBinhNew = 0;
          let tongBinhOld = 0;
          resultDashboard.data.returnData.forEach((item) => {
            item.Export = item.Export.filter((element) => {
              if (
                element.exportEmptyCylinderObject &&
                element.exportEmptyCylinderObject.length
              ) {
                return true;
              }
            });
          });
        }
        let objectExportNewBinhKhi = {
          statisticType: "Bình mới",
        };
        let objectExportOldBinhKhi = {
          statisticType: "Bình cũ",
        };
        let tongBinhExportNew = 0;
        let tongBinhExportOld = 0;
        resultDashboard.data.returnData.map((item) => {
          item.Export.map((element) => {
            let typeCylinderTemp = {
              dataIndex: element.code,
              title: element.name,
              align: "center",
            };
            if (
              !typeCylinder.some((ele) => {
                if (ele.dataIndex == element.code) return true;
              })
            ) {
              typeCylinder.push(typeCylinderTemp);
            }
            objectExportNewBinhKhi[element.code] = element.numberNew || 0;
            tongBinhExportNew += element.numberNew || 0;
            objectExportOldBinhKhi[element.code] = element.numberOld || 0;
            tongBinhExportOld += element.numberOld || 0;
          });
          objectExportNewBinhKhi.tongBinh = tongBinhExportNew;
          objectExportOldBinhKhi.tongBinh = tongBinhExportOld;
          tongBinhExportNew = 0;
          tongBinhExportOld = 0;
        });

        setTypeCylinder(typeCylinder);
        let arrayExportBinhKhi = [
          objectExportNewBinhKhi,
          objectExportOldBinhKhi,
        ];
        arrayExportBinhKhi = formatNumber(arrayExportBinhKhi);
        setListExportBinhKhi(arrayExportBinhKhi);
      } else if (statisticType == 5) {
        let objectInventoryNewBinhKhi = {
          statisticType: "Bình mới",
        };
        let objectInventoryOldBinhKhi = {
          statisticType: "Bình cũ",
        };
        let tongBinhInventoryNew = 0;
        let tongBinhInventoryOld = 0;

        resultDashboard.data.returnData.map((item) => {
          item.Inventory.map((element) => {
            let typeCylinderTemp = {
              dataIndex: element.code,
              title: element.name,
              align: "center",
            };
            if (
              !typeCylinder.some((ele) => {
                if (ele.dataIndex == element.code) return true;
              })
            ) {
              typeCylinder.push(typeCylinderTemp);
            }
            objectInventoryNewBinhKhi[element.code] = element.numberNew || 0;
            tongBinhInventoryNew += element.numberNew || 0;
            objectInventoryOldBinhKhi[element.code] = element.numberOld || 0;
            tongBinhInventoryOld += element.numberOld || 0;
          });
          objectInventoryNewBinhKhi.tongBinh = tongBinhInventoryNew;
          objectInventoryOldBinhKhi.tongBinh = tongBinhInventoryOld;
        });

        setTypeCylinder(typeCylinder);
        let arrayInventoryBinhKhi = [
          objectInventoryNewBinhKhi,
          objectInventoryOldBinhKhi,
        ];
        arrayInventoryBinhKhi = formatNumber(arrayInventoryBinhKhi);
        setListInventoryBinhKhi(arrayInventoryBinhKhi);
      }
    }
  }
  async function getAllDashboard(
    target,
    statisticalType,
    startDate,
    endDate,
    nameBranch
  ) {
    let typeCylinder = [];
    let cutCreate = {};
    let cutExportEmptyCylinder = {};
    let cutImportEmptyCylinder = {};
    let cutReturnFullCylinder = {};
    let cutExport = {};
    let arrayCreate = [{ branch: "Tổng" }];
    let arrayExportEmptyCylinder = [{ branch: "Tổng" }];
    let arrayImportEmptyCylinder = [{ branch: "Tổng" }];
    let arrayReturnFullCylinder = [{ branch: "Tổng" }];
    let arrayExport = [{ branch: "Tổng" }];
    // let result = await getAggregateDashboard(target, statisticalType, startDate, endDate);
    let result = await getStatisticAllRegion(
      target,
      statisticalType,
      startDate,
      endDate
    );

    setLoading(false);
    if (result.data && result.data.data && result.data.data.length !== 0) {
      if (idBranch == "all" || idBranch == "") {
        if (tramXuat && tramXuat != "all") {
          result.data.data = result.data.data.filter((item) => {
            let kiemTraDung = false;
            if (
              item.detail[0].statistic.exportEmptyCylinderTo &&
              item.detail[0].statistic.exportEmptyCylinderTo.length &&
              item.detail[0].statistic.exportEmptyCylinderTo.some(
                (a) => a.length && a[0].includes(tramXuat)
              )
            ) {
              item.detail[0].statistic.exportEmptyCylinder = item.detail[0].statistic.exportEmptyCylinderObject.reduce(
                (tong, ele) => {
                  if (ele && ele.length) {
                    let tongMang2 = ele.reduce(
                      (tong2, ele2) =>
                        tong2 +
                        (ele2.length && ele2[0].to == tramXuat
                          ? ele2[0].quantity
                          : 0),
                      0
                    );
                    if (tongMang2) kiemTraDung = true;
                    return tong + tongMang2;
                  } else return tong + 0;
                },
                0
              );
              return kiemTraDung;
            }
          });
        } else if (tramXuat && tramXuat == "all") {
          result.data.data = result.data.data.filter((item) => {
            let a = item.detail[0].statistic.exportEmptyCylinde;
            if (item.detail[0].statistic.exportEmptyCylinder != 0) return true;
          });
        }
        if (tramNhap && tramNhap != "all") {
          result.data.data = result.data.data.filter((item) => {
            let kiemTraDung = false;
            if (
              item.detail[0].statistic.importEmptyCylinderFrom &&
              item.detail[0].statistic.importEmptyCylinderFrom.length &&
              item.detail[0].statistic.importEmptyCylinderFrom.some(
                (a) => a.length && a[0].includes(tramNhap)
              )
            ) {
              item.detail[0].statistic.importEmptyCylinder = item.detail[0].statistic.importEmptyCylinderObject.reduce(
                (tong, ele) => {
                  if (ele && ele.length) {
                    let tongMang2 = ele[0].reduce(
                      (tong2, ele2) =>
                        tong2 +
                        (ele2 && ele2.from == tramNhap ? ele2.quantity : 0),
                      0
                    );
                    return tong + tongMang2;
                  }
                },
                0
              );
              kiemTraDung = true;
            }
            return kiemTraDung;
          });
        } else if (tramNhap && tramNhap == "all") {
          result.data.data = result.data.data.filter(
            (item) => item.detail[0].statistic.importEmptyCylinder != 0
          );
        }
        if (khachHangXuat && khachHangXuat != "all") {
          result.data.data = result.data.data.filter((item) => {
            let kiemTraKhachHangXuat = false;
            let element = item.detail[0];
            if (
              element.statistic.exportCylinderObject &&
              element.statistic.exportCylinderObject.length &&
              element.statistic.exportCylinderObject.some(
                (a) =>
                  a.length &&
                  a[0].map((item) => item.to).includes(khachHangXuat)
              )
            ) {
              element.statistic.exportCylinder = element.statistic.exportCylinderObject.reduce(
                (tong, ele) => {
                  if (ele && ele.length) {
                    let tongMang2 = ele[0].reduce(
                      (tong2, ele2) =>
                        tong2 +
                        (ele2 && ele2.to == khachHangXuat ? ele2.quantity : 0),
                      0
                    );
                    return (tong || 0) + tongMang2;
                  }
                },
                0
              );
              kiemTraKhachHangXuat = true;
            }
            return kiemTraKhachHangXuat;
          });
        } else if (khachHangXuat && khachHangXuat == "all") {
          result.data.data = result.data.data.filter(
            (item) => item.detail[0].statistic.exportCylinder != 0
          );
        }
        // Lấy danh sách loại bình
        result.data.data &&
          result.data.data.map((value) => {
            value.detail.map((ele) => {
              if (
                !typeCylinder.some((element) => element.dataIndex == ele.code)
              ) {
                typeCylinder.push({
                  dataIndex: ele.code,
                  title: ele.name,
                  align: "center",
                });
              }
            });
          });
        setTypeCylinder(typeCylinder);
        result.data.data.map((value, index) => {
          let sumCreatedCylinder = 0;
          let sumExportEmptyCylinder = 0;
          let sumImportEmptyCylinder = 0;
          let sumReturnFullCylinder = 0;
          let sumMassExport = 0;
          let sumExport = 0;

          let a = result.data.data[index].name;
          let objectCreate = { branch: a };
          let objectExportEmptyCylinder = { branch: a };
          let objectImportEmptyCylinder = { branch: a };
          let objectReturnFullCylinder = { branch: a };
          let objectExport = { branch: a };

          value.detail.map((v) => {
            //
            v.statistic.createdCylinder = v.statistic.createdCylinder || 0;
            sumCreatedCylinder += v.statistic.createdCylinder;
            Object.assign(objectCreate, {
              [v.code]: v.statistic.createdCylinder,
              tongBinh: sumCreatedCylinder || 0,
            });
            cutCreate = Object.assign(arrayCreate[0], {
              [v.code]: arrayCreate[0][v.code]
                ? arrayCreate[0][v.code] + v.statistic.createdCylinder
                : v.statistic.createdCylinder,
              tongBinh: arrayCreate[0].tongBinh
                ? arrayCreate[0].tongBinh + v.statistic.createdCylinder
                : v.statistic.createdCylinder,
            });
            //
            v.statistic.importEmptyCylinder =
              v.statistic.importEmptyCylinder || 0;
            sumImportEmptyCylinder += v.statistic.importEmptyCylinder;
            Object.assign(objectImportEmptyCylinder, {
              [v.code]: v.statistic.importEmptyCylinder,
              tongBinh: sumImportEmptyCylinder || 0,
            });
            cutImportEmptyCylinder = Object.assign(
              arrayImportEmptyCylinder[0],
              {
                [v.code]: arrayImportEmptyCylinder[0][v.code]
                  ? arrayImportEmptyCylinder[0][v.code] +
                    v.statistic.importEmptyCylinder
                  : v.statistic.importEmptyCylinder,
                tongBinh: arrayImportEmptyCylinder[0].tongBinh
                  ? arrayImportEmptyCylinder[0].tongBinh +
                    v.statistic.importEmptyCylinder
                  : v.statistic.importEmptyCylinder,
              }
            );
            //
            v.statistic.exportEmptyCylinder =
              v.statistic.exportEmptyCylinder || 0;
            sumExportEmptyCylinder += v.statistic.exportEmptyCylinder;
            Object.assign(objectExportEmptyCylinder, {
              [v.code]: v.statistic.exportEmptyCylinder,
              tongBinh: sumExportEmptyCylinder || 0,
            });
            cutExportEmptyCylinder = Object.assign(
              arrayExportEmptyCylinder[0],
              {
                [v.code]: arrayExportEmptyCylinder[0][v.code]
                  ? arrayExportEmptyCylinder[0][v.code] +
                    v.statistic.exportEmptyCylinder
                  : v.statistic.exportEmptyCylinder,
                tongBinh: arrayExportEmptyCylinder[0].tongBinh
                  ? arrayExportEmptyCylinder[0].tongBinh +
                    v.statistic.exportEmptyCylinder
                  : v.statistic.exportEmptyCylinder,
              }
            );
            //

            v.statistic.exportCylinder = v.statistic.exportCylinder || 0;
            sumExport += v.statistic.exportCylinder;
            sumMassExport += v.statistic.massExport || 0;
            Object.assign(objectExport, {
              [v.code]: v.statistic.exportCylinder,
              tongBinh: sumExport || 0,
              tongKhoiLuong: sumMassExport || 0,
            });

            cutExport = Object.assign(arrayExport[0], {
              [v.code]: arrayExport[0][v.code]
                ? arrayExport[0][v.code] + v.statistic.exportCylinder
                : v.statistic.exportCylinder,
              tongBinh: arrayExport[0].tongBinh
                ? arrayExport[0].tongBinh + v.statistic.exportCylinder
                : v.statistic.exportCylinder,
              tongKhoiLuong:
                arrayExport[0].tongKhoiLuong || 0
                  ? (arrayExport[0].tongKhoiLuong || 0) +
                    (v.statistic.massExport || 0)
                  : v.statistic.massExport || 0,
            });
            //
            v.statistic.returnFullCylinder =
              v.statistic.returnFullCylinder || 0;
            sumReturnFullCylinder += v.statistic.returnFullCylinder || 0;
            Object.assign(objectReturnFullCylinder, {
              [v.code]: v.statistic.returnFullCylinder,
              tongBinh: sumReturnFullCylinder || 0,
              tongKhoiLuong: sumReturnFullCylinder * v.mass || 0,
            });
            cutReturnFullCylinder = Object.assign(arrayReturnFullCylinder[0], {
              [v.code]: arrayReturnFullCylinder[0][v.code]
                ? arrayReturnFullCylinder[0][v.code] +
                  v.statistic.returnFullCylinder
                : v.statistic.returnFullCylinder,
              tongBinh: arrayReturnFullCylinder[0].tongBinh
                ? arrayReturnFullCylinder[0].tongBinh +
                  v.statistic.returnFullCylinder
                : v.statistic.returnFullCylinder,
              tongKhoiLuong:
                arrayReturnFullCylinder[0].tongKhoiLuong || 0
                  ? (arrayReturnFullCylinder[0].tongKhoiLuong || 0) +
                    (v.statistic.massReturnFull || 0)
                  : v.statistic.massReturnFull || 0,
            });
            //
          });
          typeCylinder.map((item) => {
            if (!objectCreate[item.dataIndex]) objectCreate[item.dataIndex] = 0;
            if (!objectExportEmptyCylinder[item.dataIndex])
              objectExportEmptyCylinder[item.dataIndex] = 0;
            if (!objectImportEmptyCylinder[item.dataIndex])
              objectImportEmptyCylinder[item.dataIndex] = 0;
            if (!objectExport[item.dataIndex]) objectExport[item.dataIndex] = 0;
            if (!objectReturnFullCylinder[item.dataIndex])
              objectReturnFullCylinder[item.dataIndex] = 0;
          });

          arrayCreate.push(objectCreate);
          arrayExportEmptyCylinder.push(objectExportEmptyCylinder);
          arrayImportEmptyCylinder.push(objectImportEmptyCylinder);
          arrayExport.push(objectExport);
          arrayReturnFullCylinder.push(objectReturnFullCylinder);
        });
      }
    }
    arrayCreate.shift();
    arrayCreate[arrayCreate.length] = cutCreate;
    arrayCreate = formatNumber(arrayCreate);
    setListCreate(arrayCreate);

    arrayExportEmptyCylinder.shift();
    arrayExportEmptyCylinder[
      arrayExportEmptyCylinder.length
    ] = cutExportEmptyCylinder;
    arrayExportEmptyCylinder = formatNumber(arrayExportEmptyCylinder);
    setListExportEmpty(arrayExportEmptyCylinder);

    arrayImportEmptyCylinder.shift();
    arrayImportEmptyCylinder[
      arrayImportEmptyCylinder.length
    ] = cutImportEmptyCylinder;
    arrayImportEmptyCylinder = formatNumber(arrayImportEmptyCylinder);
    setListImportEmpty(arrayImportEmptyCylinder);

    arrayExport.shift();
    arrayExport[arrayExport.length] = cutExport;
    arrayExport = formatNumber(arrayExport);
    setListExport(arrayExport);

    arrayReturnFullCylinder.shift();
    arrayReturnFullCylinder[
      arrayReturnFullCylinder.length
    ] = cutReturnFullCylinder;
    arrayReturnFullCylinder = formatNumber(arrayReturnFullCylinder);
    setListReturnFullCylinder(arrayReturnFullCylinder);
  }
  async function getTableDashboard(
    target,
    statisticalType,
    startDate,
    endDate,
    nameBranch
  ) {
    let typeCylinder = [];
    let cutCreate = {};
    let cutExportEmptyCylinder = {};
    let cutImportEmptyCylinder = {};
    let cutReturnFullCylinder = {};
    let cutExport = {};

    let arrayCreate = [{ branch: "Tổng", tongBinh: 0 }];
    let arrayExportEmptyCylinder = [{ branch: "Tổng", tongBinh: 0 }];
    let arrayImportEmptyCylinder = [{ branch: "Tổng", tongBinh: 0 }];
    let arrayReturnFullCylinder = [
      { branch: "Tổng", tongBinh: 0, tongKhoiLuong: 0 },
    ];
    let arrayExport = [{ branch: "Tổng", tongBinh: 0, tongKhoiLuong: 0 }];

    let result = await getStatisticByStation(
      target,
      statisticalType,
      startDate,
      endDate
    );
    //begin VTGAS
    setLoading(false);
    console.log("data vtgas", result.data.data);
    if (result.data) {
      if (result.data.data && result.data.data.length) {
        if (!idBranchNull) {
          if (tramXuat && tramXuat != "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => {
                let kiemTraDung = false;
                item.detail.map((element) => {
                  if (
                    element &&
                    element.statistic.exportEmptyCylinderObject &&
                    element.statistic.exportEmptyCylinderObject.length
                  ) {
                    element.statistic.exportEmptyCylinder = element.statistic.exportEmptyCylinderObject.reduce(
                      (tong, ele) => {
                        if (ele) {
                          if (ele.to == tramXuat) kiemTraDung = true;
                          return tong + (ele.to == tramXuat ? ele.quantity : 0);
                        }
                      },
                      0
                    );
                  }
                  return element;
                });
                if (kiemTraDung) return true;
              }
            );
          } else if (tramXuat && tramXuat == "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => item.detail[0].statistic.exportEmptyCylinder
            );
          }
          if (tramNhap && tramNhap != "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => {
                let kiemTraDung = false;
                item.detail.map((element) => {
                  if (
                    element &&
                    element.statistic.importEmptyCylinderObject &&
                    element.statistic.importEmptyCylinderObject.length
                  ) {
                    element.statistic.importEmptyCylinder = element.statistic.importEmptyCylinderObject.reduce(
                      (tong, ele) => {
                        if (ele) {
                          if (ele.from == tramNhap) kiemTraDung = true;
                          return (
                            tong + (ele.from == tramNhap ? ele.quantity : 0)
                          );
                        }
                      },
                      0
                    );
                  }
                  return element;
                });
                if (kiemTraDung) return true;
              }
            );
          } else if (tramNhap && tramNhap == "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => item.detail[0].statistic.importEmptyCylinder
            );
          }
          if (khachHangXuat && khachHangXuat != "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => {
                let kiemTraDung = false;
                item.detail.map((element) => {
                  if (element && element.statistic.exportCylinderObject) {
                    element.statistic.exportCylinder = element.statistic.exportCylinderObject.reduce(
                      (tong, ele) => {
                        if (ele) {
                          if (ele && ele.to == khachHangXuat)
                            kiemTraDung = true;
                          return (
                            tong +
                            (ele && ele.to == khachHangXuat ? ele.quantity : 0)
                          );
                        }
                      },
                      0
                    );
                  }
                  return element;
                });
                if (kiemTraDung) return true;
              }
            );
          } else if (khachHangXuat && khachHangXuat == "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => item.detail[0].statistic.exportCylinder
            );
          }

          if (khachHangHoiLuu && khachHangHoiLuu != "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => {
                let kiemTraDung = false;
                item.detail.map((element) => {
                  if (element && element.statistic.returnFullCylinderObject) {
                    element.statistic.returnFullCylinder = element.statistic.returnFullCylinderObject.reduce(
                      (tong, ele) => {
                        if (ele) {
                          if (ele && ele.from == khachHangHoiLuu)
                            kiemTraDung = true;
                          return (
                            tong +
                            (ele && ele.from == khachHangHoiLuu
                              ? ele.quantity
                              : 0)
                          );
                        }
                      },
                      0
                    );
                  }
                  return element;
                });
                if (kiemTraDung) return true;
              }
            );
          } else if (khachHangHoiLuu && khachHangHoiLuu == "all") {
            result.data.data[0].detail = result.data.data[0].detail.filter(
              (item) => item.detail[0].statistic.returnFullCylinder
            );
          }
          // Lấy danh sách loại bình
          result.data.data[0] &&
            result.data.data[0].detail.map((value) => {
              value.detail.map((ele) => {
                if (
                  !typeCylinder.some((element) => element.dataIndex == ele.code)
                ) {
                  typeCylinder.push({
                    dataIndex: ele.code,
                    title: ele.name,
                    align: "center",
                  });
                }
              });
            });
          setTypeCylinder(typeCylinder);

          result.data.data[0].detail.map((value, index) => {
            let sumCreatedCylinder = 0;
            let sumExportEmptyCylinder = 0;
            let sumImportEmptyCylinder = 0;
            let sumReturnFullCylinder = 0;
            let sumMassExport = 0;
            let sumExport = 0;

            let objectCreate = {};
            let objectExportEmptyCylinder = {};
            let objectImportEmptyCylinder = {};
            let objectReturnFullCylinder = {};
            let objectExport = {};
            let a = value.stationName;
            objectCreate = { branch: a, tongBinh: 0 };
            objectExportEmptyCylinder = { branch: a, tongBinh: 0 };
            objectImportEmptyCylinder = { branch: a, tongBinh: 0 };
            objectReturnFullCylinder = {
              branch: a,
              tongBinh: 0,
              tongKhoiLuong: 0,
            };
            objectExport = { branch: a, tongBinh: 0, tongKhoiLuong: 0 };

            value.detail.map((v) => {
              let IndexTong = arrayCreate.findIndex(
                (item) => item.branch == "Tổng"
              );
              objectCreate[v.code] = v.statistic.createdCylinder || 0;
              arrayCreate[IndexTong][v.code] =
                arrayCreate[IndexTong][v.code] || 0;
              arrayCreate[IndexTong][v.code] +=
                v.statistic.createdCylinder || 0;
              objectCreate.tongBinh += v.statistic.createdCylinder || 0;
              arrayCreate[IndexTong].tongBinh += objectCreate.tongBinh;

              objectExportEmptyCylinder[v.code] =
                v.statistic.exportEmptyCylinder || 0;
              objectExportEmptyCylinder.tongBinh +=
                v.statistic.exportEmptyCylinder || 0;
              arrayExportEmptyCylinder[IndexTong][v.code] =
                arrayExportEmptyCylinder[IndexTong][v.code] || 0;
              arrayExportEmptyCylinder[IndexTong][v.code] +=
                v.statistic.exportEmptyCylinder || 0;
              arrayExportEmptyCylinder[IndexTong].tongBinh +=
                objectExportEmptyCylinder.tongBinh;

              objectExport[v.code] = v.statistic.exportCylinder || 0;
              objectExport.tongBinh += v.statistic.exportCylinder || 0;
              objectExport.tongKhoiLuong +=
                v.statistic.exportCylinder * v.mass || 0;
              arrayExport[IndexTong][v.code] =
                arrayExport[IndexTong][v.code] || 0;
              arrayExport[IndexTong][v.code] += v.statistic.exportCylinder || 0;
              arrayExport[IndexTong].tongBinh += objectExport.tongBinh;
              arrayExport[IndexTong].tongKhoiLuong +=
                objectExport.tongKhoiLuong;

              objectImportEmptyCylinder[v.code] =
                v.statistic.importEmptyCylinder || 0;
              objectImportEmptyCylinder.tongBinh +=
                v.statistic.importEmptyCylinder || 0;
              arrayImportEmptyCylinder[IndexTong][v.code] =
                arrayImportEmptyCylinder[IndexTong][v.code] || 0;
              arrayImportEmptyCylinder[IndexTong][v.code] +=
                v.statistic.importEmptyCylinder || 0;
              arrayImportEmptyCylinder[IndexTong].tongBinh +=
                objectImportEmptyCylinder.tongBinh;
              arrayImportEmptyCylinder[IndexTong].tongKhoiLuong +=
                objectImportEmptyCylinder.tongKhoiLuong;

              objectReturnFullCylinder[v.code] =
                v.statistic.returnFullCylinder || 0;
              objectReturnFullCylinder.tongBinh +=
                v.statistic.returnFullCylinder || 0;
              objectReturnFullCylinder.tongKhoiLuong +=
                v.statistic.returnFullCylinder * v.mass || 0;
              arrayReturnFullCylinder[IndexTong][v.code] =
                arrayReturnFullCylinder[IndexTong][v.code] || 0;
              arrayReturnFullCylinder[IndexTong][v.code] +=
                v.statistic.returnFullCylinder || 0;
              arrayReturnFullCylinder[IndexTong].tongBinh +=
                objectReturnFullCylinder.tongBinh;
              arrayReturnFullCylinder[IndexTong].tongKhoiLuong +=
                objectReturnFullCylinder.tongKhoiLuong;
            });

            typeCylinder.map((item) => {
              if (!objectCreate[item.dataIndex])
                objectCreate[item.dataIndex] = 0;
              if (!objectExportEmptyCylinder[item.dataIndex])
                objectExportEmptyCylinder[item.dataIndex] = 0;
              if (!objectImportEmptyCylinder[item.dataIndex])
                objectImportEmptyCylinder[item.dataIndex] = 0;
              if (!objectExport[item.dataIndex])
                objectExport[item.dataIndex] = 0;
              if (!objectReturnFullCylinder[item.dataIndex])
                objectReturnFullCylinder[item.dataIndex] = 0;
            });

            arrayCreate.unshift(objectCreate);
            arrayExportEmptyCylinder.unshift(objectExportEmptyCylinder);
            arrayImportEmptyCylinder.unshift(objectImportEmptyCylinder);
            arrayExport.unshift(objectExport);
            arrayReturnFullCylinder.unshift(objectReturnFullCylinder);
          });
          arrayCreate = formatNumber(arrayCreate);
          setListCreate(arrayCreate);

          arrayExportEmptyCylinder = formatNumber(arrayExportEmptyCylinder);
          setListExportEmpty(arrayExportEmptyCylinder);

          arrayImportEmptyCylinder = formatNumber(arrayImportEmptyCylinder);
          setListImportEmpty(arrayImportEmptyCylinder);

          arrayExport = formatNumber(arrayExport);
          setListExport(arrayExport);

          arrayReturnFullCylinder = formatNumber(arrayReturnFullCylinder);
          setListReturnFullCylinder(arrayReturnFullCylinder);
        } else {
          if (statisticType == 0) {
            result.data.data[0] &&
              result.data.data[0].detail.map((value) => {
                if (
                  !typeCylinder.some(
                    (element) => element.dataIndex == value.code
                  )
                ) {
                  typeCylinder.push({
                    dataIndex: value.code,
                    title: value.name,
                    align: "center",
                  });
                }
              });
            setTypeCylinder(typeCylinder);
            let objectCreate = { statisticType: "Khai báo mới" };
            let objectExport = {
              statisticType: "Số lượng Xuất bình",
            };
            let objectMassExport = {
              statisticType: "Khối lượng Xuất bình",
            };
            let objectReturnFullCylinder = {
              statisticType: "Hồi lưu bình đầy",
            };
            let objectMassReturnFullCylinder = {
              statisticType: "Khối lượng hồi lưu bình đầy",
            };
            let objectExportEmpty = {
              statisticType: "Xuất vỏ",
            };
            objectCreate.tongBinh = 0;
            objectExport.tongBinh = 0;
            objectMassExport.tongBinh = 0;
            objectExportEmpty.tongBinh = 0;
            objectReturnFullCylinder.tongBinh = 0;
            objectMassReturnFullCylinder.tongBinh = 0;
            objectExportEmpty.tongBinh = 0;
            result.data.data[0].detail.map((item) => {
              objectCreate[item.code] =
                item.statistic.createdCylinder &&
                item.statistic.createdCylinder.toString();
              objectCreate.tongBinh += item.statistic.createdCylinder;
              objectExport[
                item.code
              ] = item.statistic.exportCylinder.toString();
              objectExport.tongBinh += item.statistic.exportCylinder;
              objectMassExport[item.code] =
                item.statistic.exportCylinder &&
                (item.mass * item.statistic.exportCylinder).toString();
              objectMassExport.tongBinh +=
                item.mass * item.statistic.exportCylinder;
              objectReturnFullCylinder[item.code] =
                item.statistic.returnFullCylinder &&
                item.statistic.returnFullCylinder.toString();
              objectReturnFullCylinder.tongBinh +=
                item.statistic.returnFullCylinder;
              objectMassReturnFullCylinder[item.code] =
                item.statistic.returnFullCylinder &&
                (item.statistic.returnFullCylinder * item.mass).toString();
              objectMassReturnFullCylinder.tongBinh +=
                item.statistic.returnFullCylinder * item.mass;
              objectExportEmpty[item.code] =
                item.statistic.exportEmptyCylinder &&
                item.statistic.exportEmptyCylinder.toString();
              objectExportEmpty.tongBinh += item.statistic.exportEmptyCylinder;
            });
            let arrayTatCaTramSearch = [
              objectCreate,
              objectExport,
              objectMassExport,
              objectReturnFullCylinder,
              objectMassReturnFullCylinder,
              objectExportEmpty,
            ];
            setListTatCaTramSearch(arrayTatCaTramSearch);
            console.log("list tat ca tram search", listTatCaTramSearch);
          } else {
            if (statisticType == 2) {
              result.data.data[0] &&
                result.data.data[0].detail.map((value) => {
                  if (
                    !typeCylinder.some(
                      (element) => element.dataIndex == value.code
                    )
                  ) {
                    typeCylinder.push({
                      dataIndex: value.code,
                      title: value.name,
                      align: "center",
                    });
                  }
                });
              setTypeCylinder(typeCylinder);

              let objectSoLuongTramSearch = { branch: "Số lượng", tongBinh: 0 };
              let objectKhoiLuongTramSearch = {
                branch: "Khối lượng LPG (Kg)",
                tongBinh: 0,
              };
              result.data.data[0] &&
                result.data.data[0].detail.map((value) => {
                  objectSoLuongTramSearch[value.code] =
                    value.statistic.createdCylinder &&
                    value.statistic.createdCylinder.toString();
                  objectSoLuongTramSearch.tongBinh +=
                    value.statistic.createdCylinder;
                  objectKhoiLuongTramSearch[value.code] =
                    value.statistic.createdCylinder &&
                    (value.statistic.createdCylinder * value.mass).toString();
                  objectKhoiLuongTramSearch.tongBinh +=
                    value.statistic.createdCylinder * value.mass;
                });

              let arrayCreateTramSearch = [
                objectSoLuongTramSearch,
                objectKhoiLuongTramSearch,
              ];
              setListCreateTramSearch(arrayCreateTramSearch);
            } else if (statisticType == 3) {
              // Xuất Bình Tất cả
              if (!khachHangXuat || khachHangXuat == "all") {
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);

                let objectSoLuongTramSearch = {
                  branch: "Số lượng",
                  tongBinh: 0,
                };
                let objectKhoiLuongTramSearch = {
                  branch: "Khối lượng LPG (Kg)",
                  tongBinh: 0,
                };
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    objectSoLuongTramSearch[value.code] =
                      value.statistic.exportCylinder &&
                      value.statistic.exportCylinder.toString();
                    objectSoLuongTramSearch.tongBinh +=
                      value.statistic.exportCylinder;
                    objectKhoiLuongTramSearch[value.code] =
                      value.statistic.exportCylinder &&
                      (value.statistic.exportCylinder * value.mass).toString();
                    objectKhoiLuongTramSearch.tongBinh +=
                      value.statistic.exportCylinder * value.mass;
                  });

                let arrayExportTramSearch = [
                  objectSoLuongTramSearch,
                  objectKhoiLuongTramSearch,
                ];
                setListExportTramSearch(arrayExportTramSearch);
              } else {
                // Xuất bình đến khách hàng

                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);

                let arraytramSearchKhachHangDen = [];
                let objectTramSearchKhachHangDen = {
                  tongBinh: 0,
                  tongKhoiLuong: 0,
                };
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    value.statistic.exportCylinderObject.map((element) => {
                      if (element.to == khachHangXuat) {
                        let denKhachHangId = element.to;
                        let denKhachHangName = danhSachKhachHangXuat.find(
                          (item) => item.value == denKhachHangId
                        ).label;
                        objectTramSearchKhachHangDen.branch = denKhachHangName;
                        objectTramSearchKhachHangDen[value.code] =
                          element.quantity && element.quantity.toString();
                        objectTramSearchKhachHangDen.tongBinh +=
                          element.quantity || 0;
                        objectTramSearchKhachHangDen.tongKhoiLuong +=
                          (element.quantity || 0) * value.mass;
                      }
                    });
                  });
                arraytramSearchKhachHangDen.push(objectTramSearchKhachHangDen);
                setListExportTramSearch(arraytramSearchKhachHangDen);
              }
            } else if (statisticType == 4) {
              // Xuất vỏ Tất cả
              if (!tramXuat || tramXuat == "all") {
                let allBranch = await getAllBranch("all");
                result.data.data[0].detail = result.data.data[0].detail.filter(
                  (value) =>
                    value.statistic.exportEmptyCylinderObject &&
                    value.statistic.exportEmptyCylinderObject.length
                );
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);

                // let objectSoLuongTramSearch = {
                //   branch: "Số lượng",
                //   tongBinh: 0,
                // };
                // let objectKhoiLuongTramSearch = {
                //   branch: "Khối lượng LPG (Kg)",
                //   tongBinh: 0,
                // };
                let arrayExportEmptyTramSearch = [];
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    value.statistic.exportEmptyCylinderObject.map((element) => {
                      if (
                        !arrayExportEmptyTramSearch.some(
                          (ele) => ele.to == element.to
                        )
                      ) {
                        let denKhachHangName = allBranch.data.data.find(
                          (item) => item.id == element.to
                        ).name;
                        let objectTramSearchTemp = {
                          to: element.to,
                          branch: denKhachHangName,
                          tongBinh: 0,
                        };
                        objectTramSearchTemp[value.code] =
                          element.quantity || 0;
                        objectTramSearchTemp.tongBinh += element.quantity || 0;
                        arrayExportEmptyTramSearch.push(objectTramSearchTemp);
                      } else {
                        let findIndex = arrayExportEmptyTramSearch.findIndex(
                          (item) => item.to == element.to
                        );
                        if (
                          !arrayExportEmptyTramSearch[findIndex][value.code]
                        ) {
                          arrayExportEmptyTramSearch[findIndex][value.code] =
                            element.quantity;
                          arrayExportEmptyTramSearch[findIndex].tongBinh +=
                            element.quantity;
                        } else {
                          arrayExportEmptyTramSearch[findIndex][value.code] +=
                            element.quantity;
                          arrayExportEmptyTramSearch[findIndex].tongBinh +=
                            element.quantity;
                        }
                      }
                    });
                  });

                setListExportEmptyTramSearch(arrayExportEmptyTramSearch);
              } else {
                // Xuất vỏ đến trạm
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);

                let arraytramSearchKhachHangDen = [];
                let objectTramSearchKhachHangDen = {
                  tongBinh: 0,
                  tongKhoiLuong: 0,
                };
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    value.statistic.exportEmptyCylinderObject.map((element) => {
                      if (element.to == tramXuat) {
                        let denKhachHangId = element.to;
                        let denKhachHangName = danhSachTramXuat.find(
                          (item) => item.value == denKhachHangId
                        ).label;
                        objectTramSearchKhachHangDen.branch =
                          "Đến: " + denKhachHangName;
                        objectTramSearchKhachHangDen[value.code] =
                          element.quantity && element.quantity.toString();
                        objectTramSearchKhachHangDen.tongBinh +=
                          element.quantity || 0;
                        objectTramSearchKhachHangDen.tongKhoiLuong +=
                          (element.quantity || 0) * value.mass;
                      }
                    });
                  });
                arraytramSearchKhachHangDen.push(objectTramSearchKhachHangDen);
                setListExportEmptyTramSearch(arraytramSearchKhachHangDen);
              }
            } else if (statisticType == 5) {
              // Nhập vỏ Tất cả
              if (!tramNhap || tramNhap == "all") {
                if (result.data.data[0])
                  result.data.data[0].detail = result.data.data[0].detail.filter(
                    (item) =>
                      item.statistic.importEmptyCylinderObject &&
                      item.statistic.importEmptyCylinderObject.length
                  );
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);
                let objectNewTuBinhKhi = {
                  branch: "Bình mới từ Bình Khí",
                  tongBinh: 0,
                };
                let objectOldTuBinhKhi = {
                  branch: "Bình cũ từ Bình Khí",
                  tongBinh: 0,
                };
                let objectTuXuongSon = {
                  branch: "Bình từ Xưởng sơn",
                  tongBinh: 0,
                };

                let objectTuTramKhac = {
                  branch: "Bình từ trạm khác",
                  tongBinh: 0,
                };

                let objectTong = {
                  branch: "Tổng",
                  tongBinh: 0,
                };
                let allBranch = await getAllBranch("all").then(
                  (item) => item.data.data
                );
                result.data.data[0] &&
                  result.data.data[0].detail.map((item) => {
                    // let element = item.statistic.importEmptyCylinderObject;

                    objectNewTuBinhKhi[
                      item.code
                    ] = item.statistic.importEmptyCylinderObject.reduce(
                      (tong, ele) =>
                        allBranch.find((item) => item.id == ele.from).email ==
                          "chinhanhbinhkhi@pgs.com.vn" && ele.status == "new"
                          ? tong + (ele.quantity || 0)
                          : tong + 0,
                      0
                    );
                    objectOldTuBinhKhi[
                      item.code
                    ] = item.statistic.importEmptyCylinderObject.reduce(
                      (tong, ele) =>
                        allBranch.find((item) => item.id == ele.from).email ==
                          "chinhanhbinhkhi@pgs.com.vn" && ele.status == "old"
                          ? tong + (ele.quantity || 0)
                          : tong + 0,
                      0
                    );
                    objectNewTuBinhKhi.tongBinh +=
                      objectNewTuBinhKhi[item.code] || 0;
                    objectOldTuBinhKhi.tongBinh +=
                      objectOldTuBinhKhi[item.code];

                    objectTuXuongSon[
                      item.code
                    ] = item.statistic.importEmptyCylinderObject.reduce(
                      (tong, ele) =>
                        allBranch
                          .find((item) => item.id == ele.from)
                          .name.includes("Xưởng sơn")
                          ? tong + (ele.quantity || 0)
                          : tong + 0,
                      0
                    );
                    objectTuXuongSon.tongBinh +=
                      objectTuXuongSon[item.code] || 0;
                    objectTuTramKhac[
                      item.code
                    ] = item.statistic.importEmptyCylinderObject.reduce(
                      (tong, ele) =>
                        allBranch.find((item) => item.id == ele.from)
                          .userType != "Fixer"
                          ? tong + (ele.quantity || 0)
                          : tong + 0,
                      0
                    );
                    objectTuTramKhac.tongBinh +=
                      objectTuTramKhac[item.code] || 0;
                    objectTong[item.code] =
                      (objectNewTuBinhKhi.tongBinh || 0) +
                      (objectOldTuBinhKhi.tongBinh || 0) +
                      (objectTuXuongSon.tongBinh || 0) +
                      (objectTuTramKhac.tongBinh || 0);
                    objectTong.tongBinh +=
                      (objectNewTuBinhKhi.tongBinh || 0) +
                      (objectOldTuBinhKhi.tongBinh || 0) +
                      (objectTuXuongSon.tongBinh || 0) +
                      (objectTuTramKhac.tongBinh || 0);
                  });
                let arrayImportEmptyCylinder = [
                  objectNewTuBinhKhi,
                  objectOldTuBinhKhi,
                  objectTuXuongSon,
                  objectTuTramKhac,
                  objectTong,
                ];
                setListImportEmptyTramSearch(arrayImportEmptyCylinder);
              } else {
                // Nhập vỏ từ trạm
                if (result.data.data[0])
                  result.data.data[0].detail = result.data.data[0].detail.filter(
                    (item) =>
                      item.statistic.importEmptyCylinderObject &&
                      item.statistic.importEmptyCylinderObject.some(
                        (element) => element.from == tramNhap
                      )
                  );
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);
                let objectNewTuBinhKhi = {
                  branch: "Bình mới từ Bình Khí",
                  tongBinh: 0,
                };
                let objectOldTuBinhKhi = {
                  branch: "Bình cũ từ Bình Khí",
                  tongBinh: 0,
                };
                let objectTuXuongSon = {
                  branch: "Bình từ Xưởng sơn",
                  tongBinh: 0,
                };

                let objectTuTramKhac = {
                  branch: "Bình từ trạm khác",
                  tongBinh: 0,
                };

                let objectTong = {
                  branch: "Tổng",
                  tongBinh: 0,
                };

                let allBranch = await getAllBranch("all").then(
                  (item) => item.data.data
                );
                result.data.data[0] &&
                  result.data.data[0].detail.map((item) => {
                    item.statistic.importEmptyCylinderObject.map((element) => {
                      if (element.from == tramNhap) {
                        // let element = item.statistic.importEmptyCylinderObject;

                        objectNewTuBinhKhi[
                          item.code
                        ] = item.statistic.importEmptyCylinderObject.reduce(
                          (tong, ele) =>
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ) &&
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ).email == "chinhanhbinhkhi@pgs.com.vn" &&
                            ele.status == "new"
                              ? tong + (ele.quantity || 0)
                              : tong + 0,
                          0
                        );
                        objectOldTuBinhKhi[
                          item.code
                        ] = item.statistic.importEmptyCylinderObject.reduce(
                          (tong, ele) =>
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ) &&
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ).email == "chinhanhbinhkhi@pgs.com.vn" &&
                            ele.status == "old"
                              ? tong + (ele.quantity || 0)
                              : tong + 0,
                          0
                        );

                        objectTuXuongSon[
                          item.code
                        ] = item.statistic.importEmptyCylinderObject.reduce(
                          (tong, ele) =>
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ) &&
                            allBranch
                              .find(
                                (item) =>
                                  item.id == ele.from && ele.from == tramNhap
                              )
                              .name.includes("Xưởng sơn")
                              ? tong + (ele.quantity || 0)
                              : tong + 0,
                          0
                        );

                        objectTuTramKhac[
                          item.code
                        ] = item.statistic.importEmptyCylinderObject.reduce(
                          (tong, ele) =>
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ) &&
                            allBranch.find(
                              (item) =>
                                item.id == ele.from && ele.from == tramNhap
                            ).userType != "Fixer"
                              ? tong + (ele.quantity || 0)
                              : tong + 0,
                          0
                        );
                      }
                    });
                    objectNewTuBinhKhi.tongBinh +=
                      objectNewTuBinhKhi[item.code] || 0;
                    objectOldTuBinhKhi.tongBinh +=
                      objectOldTuBinhKhi[item.code];
                    objectTuXuongSon.tongBinh +=
                      objectTuXuongSon[item.code] || 0;
                    objectTuTramKhac.tongBinh +=
                      objectTuTramKhac[item.code] || 0;
                    objectTong[item.code] =
                      (objectNewTuBinhKhi.tongBinh || 0) +
                      (objectOldTuBinhKhi.tongBinh || 0) +
                      (objectTuXuongSon.tongBinh || 0) +
                      (objectTuTramKhac.tongBinh || 0);
                    objectTong.tongBinh +=
                      (objectNewTuBinhKhi.tongBinh || 0) +
                      (objectOldTuBinhKhi.tongBinh || 0) +
                      (objectTuXuongSon.tongBinh || 0) +
                      (objectTuTramKhac.tongBinh || 0);
                  });
                let arrayImportEmptyCylinder = [];
                let userTramNhap = await getAllBranch("all").then((item) =>
                  item.data.data.find((element) => element.id == tramNhap)
                );
                console.log("all branch nhap vo", userTramNhap);
                if (userTramNhap.email == "chinhanhbinhkhi@pgs.com.vn")
                  arrayImportEmptyCylinder = [
                    objectNewTuBinhKhi,
                    objectOldTuBinhKhi,
                    objectTong,
                  ];
                else if (
                  userTramNhap.stationType == "Own" &&
                  userTramNhap.userType == "Fixer"
                )
                  arrayImportEmptyCylinder = [objectTuXuongSon];
                else arrayImportEmptyCylinder = [objectTuTramKhac];
                setListImportEmptyTramSearch(arrayImportEmptyCylinder);
              }
            } else if (statisticType == 6) {
              // Hồi lưu bình đầy tất cả
              if (!khachHangHoiLuu || khachHangHoiLuu == "all") {
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);
                let objectSoLuongTramSearch = {
                  branch: "Số lượng",
                  tongBinh: 0,
                };
                let objectKhoiLuongTramSearch = {
                  branch: "Khối lượng LPG (Kg)",
                  tongBinh: 0,
                };
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    objectSoLuongTramSearch[value.code] =
                      value.statistic.returnFullCylinder &&
                      value.statistic.returnFullCylinder.toString();
                    objectSoLuongTramSearch.tongBinh +=
                      value.statistic.returnFullCylinder || 0;
                    objectKhoiLuongTramSearch[value.code] =
                      value.statistic.returnFullCylinder &&
                      (
                        (value.statistic.returnFullCylinder || 0) * value.mass
                      ).toString();
                    objectKhoiLuongTramSearch.tongBinh +=
                      (value.statistic.returnFullCylinder || 0) * value.mass;
                  });
                objectSoLuongTramSearch.tongBinh =
                  objectSoLuongTramSearch.tongBinh &&
                  objectSoLuongTramSearch.tongBinh.toString();
                let arrayImportEmptyTramSearch = [
                  objectSoLuongTramSearch,
                  objectKhoiLuongTramSearch,
                ];
                setListReturnFullCylinderTramSearch(arrayImportEmptyTramSearch);
              } else {
                // Hồi lưu bình đầy từ khách hàng
                if (result.data.data[0])
                  result.data.data[0].detail = result.data.data[0].detail.filter(
                    (item) =>
                      item.statistic.returnFullCylinderObject &&
                      item.statistic.returnFullCylinderObject.some(
                        (element) => element.from == khachHangHoiLuu
                      )
                  );
                result.data.data[0] &&
                  result.data.data[0].detail.map((value) => {
                    if (
                      !typeCylinder.some(
                        (element) => element.dataIndex == value.code
                      )
                    ) {
                      typeCylinder.push({
                        dataIndex: value.code,
                        title: value.name,
                        align: "center",
                      });
                    }
                  });
                setTypeCylinder(typeCylinder);

                let arraytramSearchKhachHangDen = [];
                let objectTramSearchKhachHangDen = {
                  branch: "Số lượng",
                  tongBinh: 0,
                };
                let objectTramSearchKhachHangDenKL = {
                  branch: "Khối lượng LPG (Kg)",
                  tongBinh: 0,
                };

                if (result.data.data[0])
                  result.data.data[0].detail = result.data.data[0].detail.filter(
                    (value) => {
                      let kiemTraDung = false;
                      value.statistic.returnFullCylinderObject.map(
                        (element) => {
                          if (element && element.from == khachHangHoiLuu) {
                            let denKhachHangId = element.from;
                            let denKhachHangName = danhSachKhachHangXuat.find(
                              (item) => item.value == denKhachHangId
                            ).label;
                            objectTramSearchKhachHangDen.from =
                              "Từ: " + denKhachHangName;
                            objectTramSearchKhachHangDen[value.code] =
                              element.quantity || 0;
                            objectTramSearchKhachHangDen.tongBinh +=
                              element.quantity || 0;
                            objectTramSearchKhachHangDenKL.from =
                              "Từ: " + denKhachHangName;
                            objectTramSearchKhachHangDenKL[value.code] =
                              (element.quantity || 0) * value.mass;
                            objectTramSearchKhachHangDenKL.tongBinh +=
                              (element.quantity || 0) * value.mass;
                            kiemTraDung = true;
                          }
                        }
                      );
                      if (kiemTraDung) return true;
                    }
                  );
                arraytramSearchKhachHangDen = [
                  objectTramSearchKhachHangDen,
                  objectTramSearchKhachHangDenKL,
                ];
                setListReturnFullCylinderTramSearch(
                  arraytramSearchKhachHangDen
                );
              }
            }
          }
        }
      }
    }
  }

  async function handleSeeExcel() {
    if (checkModal === "1") {
      const data = await getDetailCylindersImexExcels(
        idBranch,
        startTime,
        endTime,
        checkChangeTab === "1" ? "NEW" : "OLD",
        "IN",
        id,
        "CREATE"
      );
    } else if (checkModal === "2") {
      const data = await getDetailCylindersImexExcels(
        idBranch,
        startTime,
        endTime,
        checkChangeTab === "1" ? "NEW" : "OLD",
        "OUT",
        id,
        "EXPORT_CELL"
      );
    } else if (checkModal === "3") {
      const data = await getDetailCylindersImexExcels(
        idBranch,
        startTime,
        endTime,
        checkChangeTab === "1" ? "NEW" : "OLD",
        null,
        id,
        null
      );
    }
  }
  async function exportExcelDashboard(
    target_ids,
    action_type,
    parent_root,
    start_date,
    end_date,
    name = "",
    type = ""
  ) {
    let result = await exportExcel(
      target_ids,
      action_type,
      parent_root,
      start_date,
      end_date,
      name,
      type
    );
    setLoading(false);
  }
  async function handleExportExcel() {
    const nameCustom = nameStation ? nameStation : nameBranch;
    let user_cookies = await getUserCookies();
    if (typeExcel === "") {
      showToast("Vui lòng chọn kiểu xuất excel");
    } else {
      if (userRole === "Owner" && userType === "Factory") {
        setLoading(true);
        exportExcelDashboard(
          [user_cookies.user.id],
          typeExcel,
          user_cookies.user.parentRoot,
          startTime,
          endTime,
          nameCustom,
          typeList[typeExcel]
        );
      } else if (userRole === "SuperAdmin" && userType === "Fixer") {
      } else if (userRole === "SuperAdmin" && userType === "Region") {
        if (idStation) {
          setLoading(true);
          if (idStation === "all") {
            exportExcelDashboard(
              [user_cookies.user.id],
              typeExcel,
              user_cookies.user.parentRoot,
              startTime,
              endTime,
              nameCustom,
              typeList[typeExcel]
            );
          } else {
            exportExcelDashboard(
              [idStation],
              typeExcel,
              user_cookies.user.parentRoot,
              startTime,
              endTime,
              nameCustom,
              typeList[typeExcel]
            );
          }
        } else {
          showToast("Vui lòng chọn trạm");
        }
      } else if (
        userRole === "SuperAdmin" &&
        (userType === "Agency" || userType === "General")
      ) {
        setLoading(true);
        exportExcelDashboard(
          [user_cookies.user.id],
          typeExcel,
          user_cookies.user.parentRoot,
          startTime,
          endTime,
          nameCustom
        );
      } else if (!nameBranch) {
        showToast("Vui lòng chọn Đơn Vị");
      } else {
        if (userRole === "SuperAdmin" && userType === "Factory") {
          setLoading(true);
          if (idBranch === "all") {
            exportExcelDashboard(
              [user_cookies.user.id],
              typeExcel,
              user_cookies.user.parentRoot,
              startTime,
              endTime,
              nameCustom,
              typeList[typeExcel]
            );
          } else if (idBranch !== "all" && !idBranchNull) {
            exportExcelDashboard(
              [idBranch],
              typeExcel,
              user_cookies.user.parentRoot,
              startTime,
              endTime,
              nameCustom,
              typeList[typeExcel]
            );
          } else if (idBranchNull && idStation) {
            exportExcelDashboard(
              [idStation],
              typeExcel,
              user_cookies.user.parentRoot,
              startTime,
              endTime,
              nameCustom,
              typeList[typeExcel]
            );
          }
        }
      }
    }
  }

  async function handleSeeDashboard() {
    let user_cookies = await getUserCookies();
    if (userRole === "Owner" && userType === "Factory") {
      setLoading(true);
      await getTableDashboard(
        user_cookies.user.id,
        "byItself",
        startTime,
        endTime
      );
      await getMonthChart(
        user_cookies.user.id,
        "byItself",
        "month",
        selectYear,
        "",
        startTime,
        endTime
      );
      await getQuarterChart(
        user_cookies.user.id,
        "byItself",
        "quarter",
        selectYearQuarter,
        "",
        startTime,
        endTime
      );
    } else if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getMonthChart(
        user_cookies.user.id,
        "byItself",
        "month",
        selectYear,
        "EXPORT_CELL",
        "",
        startTime,
        endTime
      );
      await getQuarterChart(
        user_cookies.user.id,
        "byItself",
        "quarter",
        selectYearQuarter,
        "EXPORT_CELL",
        "",
        startTime,
        endTime
      );
    } else if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getTableDashboard(
            user_cookies.user.id,
            "byItsChildren",
            startTime,
            endTime,
            user_cookies.user.name
          );
          await getMonthChart(
            user_cookies.user.id,
            "byItsChildren",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
          await getQuarterChart(
            user_cookies.user.id,
            "byItsChildren",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        } else {
          await getTableDashboard(
            idStation,
            "byItself",
            startTime,
            endTime,
            user_cookies.user.name
          );
          await getMonthChart(
            idStation,
            "byItself",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
          await getQuarterChart(
            idStation,
            "byItself",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        }
      } else {
        showToast("Vui lòng chọn trạm");
      }
    } else if (
      userRole === "SuperAdmin" &&
      (userType === "Agency" || userType === "General")
    ) {
      setLoading(true);
      await getTableDashboard(
        user_cookies.user.id,
        "byItself",
        startTime,
        endTime
      );
      await getMonthChart(
        user_cookies.user.id,
        "byItself",
        "month",
        selectYear,
        "",
        startTime,
        endTime
      );
      await getQuarterChart(
        user_cookies.user.id,
        "byItself",
        "quarter",
        selectYearQuarter,
        "",
        startTime,
        endTime
      );
      // await getTableDashboard(user_cookies.user.id, "byItself", startTime, endTime, user_cookies.user.name);
      // await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "", startTime, endTime);
      // await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
      // await getTableDashboard(idStation, "byItself", startTime, endTime, user_cookies.user.name);
      // await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
      // await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
    } else if (!nameBranch) {
      showToast("Vui lòng chọn Đơn Vị");
    } else {
      if (userRole === "SuperAdmin" && userType === "Factory") {
        setLoading(true);
        if (idBranch === "all") {
          await getAllDashboard(user_cookies.user.id, "", startTime, endTime);
          await getMonthChart(
            user_cookies.user.id,
            "byItsChildren",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
          await getQuarterChart(
            user_cookies.user.id,
            "byItsChildren",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
        } else if (idBranch !== "all" && !idBranchNull) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getNewFixerDashboard(idBranch, startTime, endTime, "NEW");
            await getMonthChart(
              idBranch,
              "byItself",
              "month",
              selectYear,
              "EXPORT_CELL",
              "",
              startTime,
              endTime
            );
            await getQuarterChart(
              idBranch,
              "byItself",
              "quarter",
              selectYearQuarter,
              "EXPORT_CELL",
              "",
              startTime,
              endTime
            );
          } else {
            await getTableDashboard(
              idBranch,
              "byItsChildren",
              startTime,
              endTime,
              nameBranch
            );
            await getMonthChart(
              idBranch,
              "byItsChildren",
              "month",
              selectYear,
              "",
              startTime,
              endTime
            );
            await getQuarterChart(
              idBranch,
              "byItsChildren",
              "quarter",
              selectYearQuarter,
              "",
              startTime,
              endTime
            );
          }
        } else if (idBranchNull && idStation) {
          await getTableDashboard(idStation, "byItself", startTime, endTime);
          await getMonthChart(
            idStation,
            "byItself",
            "month",
            selectYear,
            "",
            startTime,
            endTime
          );
          await getQuarterChart(
            idStation,
            "byItself",
            "quarter",
            selectYearQuarter,
            "",
            startTime,
            endTime
          );
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
  const type_excel_station_agency = [
    {
      name: "Nhập bình",
      key: "IMPORT",
    },
    {
      name: "Xuất bình",
      key: "EXPORT",
    },
    {
      name: "Bán hàng",
      key: "SALE",
    },
  ];
  const typeList = type_excel_station.reduce(
    (acc, curr) => ((acc[curr.key] = curr.name), acc),
    {}
  ); //shorthand gan object va return lai object
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
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSeeNew(record)}
              >
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
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSeeExported(record)}
              >
                Xem
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleNotData(record)}
              >
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
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSeeInventory(record)}
              >
                Xem
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleNotData(record)}
              >
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
              <div>
                {isCorrectFormat(record.checkedDate, "DD/MM/YYYY") === true
                  ? record.checkedDate
                  : moment(record.checkedDate).format("DD/MM/YYYY")}
              </div>
            );
          },
        },
        { title: "Thương hiệu", dataIndex: "manufacture", align: "center" },
        { title: "Loại bình", dataIndex: "category", align: "center" },
      ],
    },
  ];
  //
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
      dataIndex: "createdCylinder",
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
          dataIndex: "importCylinderFromBinhKhi",
          // key: "building",
          width: 200,
          align: "center",
        },
        {
          title: "Nhập từ Trạm Khác",
          dataIndex: "importCylinderFromElsewhere",
          key: "tramKhac",
          width: 200,
          align: "center",
        },
        {
          title: "Hồi Lưu",
          dataIndex: "turnbackCylinder",
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
          dataIndex: "exportEmptyCylinderToBinhKhi",
          width: 200,
          align: "center",
        },
        {
          title: "Xuất Cho Trạm Khác",
          dataIndex: "exportEmptyCylinderToElsewhere",
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
          dataIndex: "exportCylinder",
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
      dataIndex: "liquidationCylinder",
      width: 120,
      align: "center",
    },
    // {
    //   title: "Tồn",
    //   dataIndex: "inventoryCylinder",
    //   fixed: "right",
    //   width: 100,
    //   align: "center",
    // },
  ];
  const columnsForAgency = [
    {
      title: "Loại bình",
      dataIndex: "name",
      fixed: "left",
      width: 120,
      align: "center",
    },
    {
      title: "Nhập bình",
      width: 600,
      dataIndex: "nhapBinh",
      align: "center",

      children: [
        {
          title: "Nhập từ Bình Khí",
          dataIndex: "importCylinderFromBinhKhi",
          // key: "building",
          width: 200,
          align: "center",
        },
        {
          title: "Nhập từ Trạm Khác",
          dataIndex: "importCylinderFromElsewhere",
          key: "tramKhac",
          width: 200,
          align: "center",
        },
        {
          title: "Hồi Lưu",
          dataIndex: "turnbackCylinder",
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
      title: "Xuất bình",
      dataIndex: "xuatHang",
      width: 400,
      children: [
        {
          title: "Số Lượng",
          dataIndex: "exportCylinder",
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
      title: "Bán hàng",
      dataIndex: "banHang",
      width: 400,
      children: [
        {
          title: "Số Lượng",
          dataIndex: "numberSale",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "Tồn",
      dataIndex: "inventoryCylinder",
      fixed: "right",
      width: 100,
      align: "center",
    },
  ];
  const customData = (data) => {
    let result = [];
    let result1 = [];
    const dataGroupByAdress = groupBy(data, (item) => item.branchName);
    //
    forEach(dataGroupByAdress, (values, key) => {
      //
      //
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
  //
  let collumns_branch = [];
  //
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
        dataIndex: "createdCylinder",
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
            dataIndex: "importCylinderFromBinhKhi",
            // key: "building",
            width: 200,
            align: "center",
          },
          {
            title: "Nhập từ Trạm Khác",
            dataIndex: "importCylinderFromElsewhere",
            key: "tramKhac",
            width: 200,
            align: "center",
          },
          {
            title: "Hồi Lưu",
            dataIndex: "turnbackCylinder",
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
            dataIndex: "exportEmptyCylinderToBinhKhi",
            width: 200,
            align: "center",
          },
          {
            title: "Xuất Cho Trạm Khác",
            dataIndex: "exportEmptyCylinderToElsewhere",
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
            dataIndex: "exportCylinder",
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
        dataIndex: "liquidationCylinder",
        width: 120,
        align: "center",
      },
      {
        title: "Vỏ tồn tại trạm",
        dataIndex: "inventoryCylinder",
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
        dataIndex: "createdCylinder",
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
            dataIndex: "importCylinderFromBinhKhi",
            // key: "building",
            width: 200,
            align: "center",
          },
          {
            title: "Nhập từ Trạm Khác",
            dataIndex: "importCylinderFromElsewhere",
            key: "tramKhac",
            width: 200,
            align: "center",
          },
          {
            title: "Hồi Lưu",
            dataIndex: "turnbackCylinder",
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
            dataIndex: "exportEmptyCylinderToBinhKhi",
            width: 200,
            align: "center",
          },
          {
            title: "Xuất Cho Trạm Khác",
            dataIndex: "exportEmptyCylinderToElsewhere",
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
            dataIndex: "exportCylinder",
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
        dataIndex: "liquidationCylinder",
        width: 120,
        align: "center",
      },
      {
        title: "Vỏ tồn tại trạm",
        dataIndex: "inventoryCylinder",
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
      title:
        idBranch == "all" || idBranch == ""
          ? "ĐƠN VỊ"
          : nameBranch.toUpperCase(),
      dataIndex: "branch",
      align: "center",
      render(text, record) {
        return {
          children: (
            <div
              style={
                text != "Tổng"
                  ? { textDecoration: "underline", cursor: "pointer" }
                  : {}
              }
              onClick={() => handleChangeLink(text, 2)}
              value={text}
            >
              {text}
            </div>
          ),
        };
      },
    },
    {
      title: "KHAI BÁO",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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
      title:
        idBranch == "all" || idBranch == ""
          ? "ĐƠN VỊ"
          : nameBranch.toUpperCase(),
      render(text, record) {
        return {
          children: (
            <div
              style={
                text != "Tổng"
                  ? { textDecoration: "underline", cursor: "pointer" }
                  : {}
              }
              onClick={() => handleChangeLink(text, 4)}
              value={text}
            >
              {text}
            </div>
          ),
        };
      },
      align: "center",
      // style: "text-decoration:underline",
      dataIndex: "branch",
    },
    {
      title: "XUẤT VỎ",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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
  const columns_parent3 = [
    {
      title: "NHẬP VỎ",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parent305 = [
    {
      title:
        idBranch == "all" || idBranch == ""
          ? "ĐƠN VỊ"
          : nameBranch.toUpperCase(),
      align: "center",
      dataIndex: "branch",
      render(text, record) {
        return {
          children: (
            <div
              style={
                text != "Tổng"
                  ? { textDecoration: "underline", cursor: "pointer" }
                  : {}
              }
              onClick={() => handleChangeLink(text, 5)}
              value={text}
            >
              {text}
            </div>
          ),
        };
      },
    },
    {
      title: "NHẬP VỎ",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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
      title:
        idBranch == "all" || idBranch == ""
          ? "ĐƠN VỊ"
          : nameBranch.toUpperCase(),
      align: "center",
      dataIndex: "branch",
      render(text, record) {
        return {
          children: (
            <div
              style={
                text != "Tổng"
                  ? { textDecoration: "underline", cursor: "pointer" }
                  : {}
              }
              onClick={() => handleChangeLink(text, 3)}
              value={text}
            >
              {text}
            </div>
          ),
        };
      },
    },
    {
      title: "XUẤT BÌNH",
      children: typeCylinder,
    },
    {
      title: "TỔNG SỐ LƯỢNG (BÌNH)",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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
      title: "TỔNG KHỐI LƯỢNG LPG (KG)",
      align: "center",
      dataIndex: "tongKhoiLuong",
      width: 100,
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

  const columns_parent5 =
    statisticType != 6
      ? [
          {
            title: "HỒI LƯU BÌNH ĐẦY",
            children: typeCylinder,
          },
          {
            title: "TỔNG SỐ LƯỢNG (BÌNH)",
            align: "center",
            width: 100,
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
            title: "TỔNG KHỐI LƯỢNG LPG (KG)",
            align: "center",
            width: 100,
            dataIndex: "tongKhoiLuong",
          },
        ]
      : [
          {
            title:
              idBranch == "all" || idBranch == ""
                ? "ĐƠN VỊ"
                : nameBranch.toUpperCase(),
            align: "center",
            dataIndex: "branch",
            render(text, record) {
              return {
                children: (
                  <div
                    style={
                      text != "Tổng"
                        ? { textDecoration: "underline", cursor: "pointer" }
                        : {}
                    }
                    onClick={() => handleChangeLink(text, 3)}
                    value={text}
                  >
                    {text}
                  </div>
                ),
              };
            },
          },
          {
            title: "HỒI LƯU BÌNH ĐẦY",
            children: typeCylinder,
          },
          {
            title: "TỔNG SỐ LƯỢNG (BÌNH)",
            align: "center",
            width: 100,
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
            title: "TỔNG KHỐI LƯỢNG LPG (KG)",
            align: "center",
            width: 100,
            dataIndex: "tongKhoiLuong",
          },
        ];

  const columns_parentNewBinhKhi = [
    {
      title: nameBranch.toUpperCase(),
      dataIndex: "statisticType",
      align: "center",
    },
    {
      title: "BÌNH MỚI",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinhNew",
      width: 100,
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

  const columns_parentOldBinhKhi = [
    {
      title: nameBranch.toUpperCase(),
      dataIndex: "statisticType",
      align: "center",
    },
    {
      title: "BÌNH CŨ",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinhOld",
      width: 100,
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

  const columns_parentExportBinhKhi = [
    {
      title: nameBranch.toUpperCase(),
      dataIndex: "statisticType",
      align: "center",
    },
    {
      title: "XUẤT VỎ",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parentInventoryBinhKhi = [
    {
      title: nameBranch.toUpperCase(),
      dataIndex: "statisticType",
      align: "center",
    },
    {
      title: "TỒN KHO",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parentCreatedBinhKhi = [
    {
      title: nameBranch.toUpperCase(),
      dataIndex: "statisticType",
      align: "center",
    },
    {
      title: "KHAI BÁO",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parent1TramSearch = [
    {
      title: nameStation && nameStation != "all" && nameStation.toUpperCase(),
      dataIndex: "branch",
      align: "center",
    },
    {
      title: "KHAI BÁO",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parent1TatCaTramSearch = [
    {
      title: nameStation && nameStation != "all" && nameStation.toUpperCase(),
      dataIndex: "statisticType",
      align: "center",
      // render: (text, row, index) => {
      //   if (index !== 3) {
      //     return {
      //       props: {
      //         rowSpan: 3,
      //       },
      //     };
      //   }
      //   return {
      //     // The target takes all column span
      //     props: {
      //       rowSpan: 1,
      //     },
      //   };
      // },
    },
    {
      title: "LOẠI BÌNH",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parent2TramSearch =
    !tramXuat || tramXuat == "all"
      ? [
          {
            title:
              nameStation && nameStation != "all" && nameStation.toUpperCase(),
            dataIndex: "branch",
            align: "center",
          },
          {
            title: "XUẤT VỎ",
            children: typeCylinder,
          },
          {
            title: "TỔNG",
            align: "center",
            dataIndex: "tongBinh",
            width: 100,
            render(text, record) {
              return {
                props: {
                  style: { fontWeight: "bold" },
                },
                children: <div>{text}</div>,
              };
            },
          },
        ]
      : [
          {
            title:
              nameStation &&
              nameStation != "all" &&
              "Từ: " + nameStation.toUpperCase(),
            dataIndex: "branch",
            align: "center",
          },
          {
            title: "XUẤT VỎ",
            children: typeCylinder,
          },
          {
            title: "TỔNG",
            align: "center",
            dataIndex: "tongBinh",
            width: 100,
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
  const columns_parent3TramSearch = [
    {
      title: "NHẬP VỎ",
      children: typeCylinder,
    },
    {
      title: "TỔNG",
      align: "center",
      dataIndex: "tongBinh",
      width: 100,
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

  const columns_parent305TramSearch =
    !tramNhap || tramNhap == "all"
      ? [
          {
            title:
              nameStation && nameStation != "all" && nameStation.toUpperCase(),
            align: "center",
            dataIndex: "branch",
          },
          {
            title: "NHẬP VỎ",
            children: typeCylinder,
          },
          {
            title: "TỔNG",
            align: "center",
            dataIndex: "tongBinh",
            width: 100,
            render(text, record) {
              return {
                props: {
                  style: { fontWeight: "bold" },
                },
                children: <div>{text}</div>,
              };
            },
          },
        ]
      : [
          {
            title:
              nameStation && nameStation != "all" && nameStation.toUpperCase(),
            align: "center",
            dataIndex: "branch",
            render(text, record) {
              return {
                children: (
                  <div
                    style={
                      text != "Tổng"
                        ? { textDecoration: "underline", cursor: "pointer" }
                        : {}
                    }
                    onClick={() => handleChangeLink(text, 3)}
                    value={text}
                  >
                    {text}
                  </div>
                ),
              };
            },
          },
          {
            title: "NHẬP VỎ",
            children: typeCylinder,
          },
          {
            title: "TỔNG",
            align: "center",
            dataIndex: "tongBinh",
            width: 100,
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

  const columns_parent4TramSearch =
    !khachHangXuat || khachHangXuat == "all"
      ? [
          {
            title:
              nameStation && nameStation != "all" && nameStation.toUpperCase(),
            dataIndex: "branch",
            align: "center",
          },
          {
            title: "XUẤT BÌNH",
            children: typeCylinder,
          },
          {
            title: "TỔNG",
            align: "center",
            dataIndex: "tongBinh",
            width: 100,
            render(text, record) {
              return {
                props: {
                  style: { fontWeight: "bold" },
                },
                children: <div>{text}</div>,
              };
            },
          },
        ]
      : [
          {
            title:
              nameStation && nameStation != "all" && nameStation.toUpperCase(),
            dataIndex: "branch",
            align: "center",
          },
          {
            title: "XUẤT BÌNH",
            children: typeCylinder,
          },
          {
            title: "TỔNG",
            align: "center",
            dataIndex: "tongBinh",
            width: 100,
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
            title: "TỔNG KHỐI LƯỢNG",
            align: "center",
            dataIndex: "tongKhoiLuong",
            width: 100,
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

  const columns_parent5TramSearch =
    !khachHangHoiLuu || khachHangHoiLuu == "all"
      ? [
          {
            title:
              nameStation && nameStation != "all" && nameStation.toUpperCase(),
            dataIndex: "branch",
            align: "center",
          },
          {
            title: "HỒI LƯU BÌNH ĐẦY",
            children: typeCylinder,
            align: "center",
          },
          {
            title: "TỔNG",
            align: "center",
            width: 100,
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
        ]
      : [
          {
            title: "TỪ",
            dataIndex: "from",
            align: "center",
            render: (text, row, index) => {
              const obj = {
                children: text,
                props: {},
              };
              console.log(obj.children, index);
              if (index % 2 === 0) {
                obj.props.rowSpan = 2;
              }
              // These two are merged into above cell
              if (index % 2 === 1) {
                obj.props.rowSpan = 0;
              }
              return obj;
            },
          },
          {
            title:
              nameStation &&
              nameStation != "all" &&
              "Về " + nameStation.toUpperCase(),
            dataIndex: "branch",
            align: "center",
          },
          {
            title: "HỒI LƯU BÌNH ĐẦY",
            children: typeCylinder,
            align: "center",
          },
          {
            title: "TỔNG SỐ LƯỢNG (BÌNH)",
            align: "center",
            width: 100,
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
        <h1>BÁO CÁO THỐNG KÊ TRẠM XƯỞNG</h1>
        <div className="section-statistical__report__title">
          <div className="container-fluid">
            <div
              className="row border rouded"
              // style={{ border: "1px solid black important!" }}
            >
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
                  <RangePicker
                    value={[startTime, endTime]}
                    format={"DD/MM/YYYY"}
                    onChange={handleTime}
                  />
                </div>
              </div>

              <div className="col-12" style={{ marginTop: "35px" }}>
                <h5 style={{ color: "#439750", fontWeight: "bold" }}>
                  Tổng chai LPG được số hóa: {numberWithCommas(cylinderCount)}
                </h5>
              </div>
              <div className="col-12 d-flex my-5">
                <h5>Đơn vị</h5>
                <div className="select--custom">
                  <Select2
                    placeholder="Chọn"
                    style={{ minWidth: 150 }}
                    value={idBranch}
                    onChange={(value, name) => handleChangeBranch(value, name)}
                  >
                    {getBranch.map((value, index) => {
                      return (
                        <Option
                          key={index}
                          value={value.value}
                          object={value}
                          name={value.label}
                        >
                          {value.label}
                        </Option>
                      );
                    })}
                  </Select2>
                </div>

                {userRole === "SuperAdmin" && userType === "Factory" ? (
                  <div className="d-flex mx-4">
                    <h5>Thống kê</h5>
                    <div className="select--custom">
                      <Select2
                        placeholder="Chọn"
                        style={{ minWidth: 150 }}
                        value={statisticType}
                        onChange={(value) => handleChangeStatisticType(value)}
                      >
                        {statisticTypeList.map((value, index) => {
                          return (
                            <Option
                              key={index}
                              value={value.value}
                              object={value}
                              name={value.label}
                            >
                              {value.label}
                            </Option>
                          );
                        })}
                      </Select2>
                      {/* <Select
                        value={statisticType}
                        placeholder="Chọn"
                        style={{
                          width: 50,
                          zIndex: "9999 !important",
                          position: "inherit !important",
                          flex: 1,
                        }}
                        options={statisticTypeList}
                        onChange={(value) => handleChangeStatisticType(value)}
                      ></Select> */}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {statisticType == 4 && (
                  <div className="d-flex">
                    <h5>Đến</h5>
                    <div className="select--custom">
                      <Select
                        placeholder="Chọn"
                        value={exportEmptyTo}
                        style={{ minWidth: 150 }}
                        onChange={async (value) => {
                          let user_cookies = await getUserCookies();
                          if (value.value == "all") {
                            setTramNhap("");
                            setTramXuat("");
                            setKhachHangXuat("");
                          }
                          setExportEmptyTo(value.value);
                          if (value.value == "tram") setTramXuat("all");
                          let allBranch = await getAllBranch("all", "Factory");
                          let allKhoXe = await callApi(
                            "POST",
                            GETWAREHOUSE,
                            { id: "all" },
                            "Bearer " + user_cookies.token
                          );
                          setDanhSachTramXuat([
                            ...[{ value: "all", label: "Tất cả" }],
                            ...allBranch.data.data.map((item) => {
                              return { value: item.id, label: item.name };
                            }),
                          ]);
                        }}
                        options={[
                          { value: "all", label: "Tất cả" },
                          { value: "tram", label: "Trạm" },
                        ]}
                      ></Select>
                    </div>
                  </div>
                )}

                {statisticType == 5 && userTypeFixer != "Fixer" && (
                  <div className="d-flex">
                    <h5>Từ</h5>
                    <div className="select--custom">
                      <Select
                        placeholder="Chọn"
                        value={importEmptyFrom}
                        style={{ minWidth: 150 }}
                        onChange={async (value) => {
                          if (value.value == "all") {
                            setTramNhap("");
                            setTramXuat("");
                            setKhachHangXuat("");
                          }
                          setImportEmptyFrom(value.value);
                          if (value.value == "tram") setTramNhap("Tất cả");
                          let allBranch = await getAllBranch("all", "Factory");

                          setDanhSachTramNhap([
                            ...[{ value: "all", label: "Tất cả" }],
                            ...allBranch.data.data.map((item) => {
                              return { value: item.id, label: item.name };
                            }),
                          ]);
                        }}
                        options={[
                          { value: "all", label: "Tất cả" },
                          { value: "binhkhi", label: "Bình khí" },
                          { value: "tram", label: "Trạm" },
                        ]}
                      ></Select>
                    </div>
                  </div>
                )}

                {statisticType == 3 && (
                  <div className="d-flex">
                    <h5>Đến khách hàng</h5>
                    <div className="select--custom">
                      <Select
                        placeholder="Chọn"
                        value={khachHangXuat}
                        style={{ minWidth: 260 }}
                        onChange={(value) => {
                          handleChangeKhachHangXuat(value);
                        }}
                        options={danhSachKhachHangXuat}
                      ></Select>
                    </div>
                  </div>
                )}

                {statisticType == 6 && (
                  <div className="d-flex">
                    <h5>Từ khách hàng</h5>
                    <div className="select--custom">
                      <Select
                        placeholder="Chọn"
                        value={khachHangHoiLuu}
                        style={{ minWidth: 260 }}
                        onChange={(value) => {
                          handleChangeKhachHangHoiLuu(value);
                        }}
                        options={danhSachKhachHangXuat}
                      ></Select>
                    </div>
                  </div>
                )}

                {exportEmptyTo == "tram" && (
                  <div className="d-flex">
                    <h5>Trạm</h5>
                    <div className="select--custom">
                      <Select
                        placeholder="Chọn"
                        options={danhSachTramXuat}
                        value={tramXuat}
                        style={{ minWidth: 150 }}
                        onChange={(value) => handleChangeTramXuat(value)}
                      ></Select>
                    </div>
                  </div>
                )}

                {importEmptyFrom == "tram" && (
                  <div className="d-flex">
                    <h5>Trạm</h5>
                    <div className="select--custom">
                      <Select
                        placeholder="Chọn"
                        value={tramNhap}
                        style={{ minWidth: 150 }}
                        onChange={(value) => handleChangeTramNhap(value)}
                        options={danhSachTramNhap}
                      ></Select>
                    </div>
                  </div>
                )}

                <div>
                  <button className="btn-export" onClick={handleExportExcel}>
                    Xuất excel
                  </button>
                  <button
                    className="btn-see-report"
                    onClick={handleSeeDashboard}
                  >
                    Xem báo cáo
                  </button>
                </div>
              </div>
              {/* <div class="col-12"></div> */}
              {userTypeFixer == "Region" && (
                <div class="col-12" style={{ marginBottom: "45px" }}>
                  <div className="d-flex">
                    <h5>Trạm</h5>
                    <div className="select--custom">
                      <Select2
                        placeholder="Chọn"
                        value={idStation}
                        style={{ minWidth: 150 }}
                        onChange={(value, name) =>
                          handleChangeStation(value, name)
                        }
                      >
                        {userType === "Region" && userRole === "SuperAdmin" ? (
                          <Option value="all" name="all">
                            <b>Tất cả</b>
                          </Option>
                        ) : (
                          ""
                        )}
                        {danhSachTramSearch
                          ? danhSachTramSearch.map((value, index) => {
                              return (
                                <Option key={index} value={value.id}>
                                  {value.name}
                                </Option>
                              );
                            })
                          : ""}
                      </Select2>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="section-statistical__report__body">
          {/*Tài khoản Mẹ*/}
          {userRole === "SuperAdmin" &&
          userType === "Factory" &&
          idBranch === "all" ? (
            <div className="container-fluid" style={{ textAlign: "center;" }}>
              {statisticType == 0 && (
                <div className="row">
                  <div className="col-6">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreate}
                      columns={columns_parent1}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              {statisticType == 2 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreate}
                      columns={columns_parent1}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              <div className="row mt-5">
                {statisticType == 0 && (
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listExportEmpty}
                      columns={columns_parent2}
                      pagination={false}
                    />
                  </div>
                )}
                {statisticType == 4 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listExportEmpty}
                      columns={columns_parent2}
                      pagination={false}
                    />
                  </div>
                )}
                {statisticType == 0 && (
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listImportEmpty}
                      columns={columns_parent3}
                      pagination={false}
                    />
                  </div>
                )}

                {statisticType == 5 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listImportEmpty}
                      columns={columns_parent305}
                      pagination={false}
                    />
                  </div>
                )}
              </div>

              {(statisticType == 0 || statisticType == 3) && (
                <div className="row mt-5">
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listExport}
                      columns={columns_parent4}
                      pagination={false}
                    />
                  </div>
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listReturnFullCylinder}
                      columns={columns_parent5}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" &&
              userType === "Factory" &&
              userTypeFixer === "Region" &&
              idBranch !== "all" &&
              !idBranchNull) ? (
            <div className="container-fluid" style={{ textAlign: "center;" }}>
              {statisticType == 2 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreate}
                      columns={columns_parent1}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}
              {statisticType == 0 && (
                <div className="row">
                  <div className="col-6">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreate}
                      columns={columns_parent1}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              <div className="row mt-5">
                {statisticType == 4 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listExportEmpty}
                      columns={columns_parent2}
                      pagination={false}
                    />
                  </div>
                )}
                {statisticType == 0 && (
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listExportEmpty}
                      columns={columns_parent2}
                      pagination={false}
                    />
                  </div>
                )}
                {statisticType == 0 && (
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listImportEmpty}
                      columns={columns_parent3}
                      pagination={false}
                    />
                  </div>
                )}

                {statisticType == 5 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listImportEmpty}
                      columns={columns_parent305}
                      pagination={false}
                    />
                  </div>
                )}
              </div>

              {(statisticType == 0 || statisticType == 3) && (
                <div className="row mt-5">
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listExport}
                      columns={columns_parent4}
                      pagination={false}
                    />
                  </div>
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listReturnFullCylinder}
                      columns={columns_parent5}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
              {statisticType == 6 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listReturnFullCylinder}
                      columns={columns_parent5}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" &&
              userType === "Factory" &&
              userTypeFixer === "Fixer" &&
              idBranch !== "all" &&
              !idBranchNull) ? (
            <div className="container-fluid" style={{ textAlign: "center;" }}>
              {statisticType == 0 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listNewBinhKhi}
                      columns={columns_parentNewBinhKhi}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}
              {statisticType == 0 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listOldBinhKhi}
                      columns={columns_parentOldBinhKhi}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
              {statisticType == 2 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreatedBinhKhi}
                      columns={columns_parentCreatedBinhKhi}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              {statisticType == 4 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listExportBinhKhi}
                      columns={columns_parentExportBinhKhi}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              {statisticType == 5 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listInventoryBinhKhi}
                      columns={columns_parentInventoryBinhKhi}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}
            </div>
          ) : (userRole === "Owner" && userType === "Factory") ||
            (userRole === "SuperAdmin" &&
              userType === "Factory" &&
              idBranchNull &&
              idStation) ? (
            <div className="container-fluid" style={{ textAlign: "center;" }}>
              {statisticType == 0 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listTatCaTramSearch}
                      columns={columns_parent1TatCaTramSearch}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              {statisticType == 2 && (
                <div className="row">
                  <div className="col-12">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreateTramSearch}
                      columns={columns_parent1TramSearch}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              <div className="row mt-5">
                {statisticType == 4 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listExportEmptyTramSearch}
                      columns={columns_parent2TramSearch}
                      pagination={false}
                    />
                  </div>
                )}
              </div>

              <div className="row mt-5">
                {statisticType == 5 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listImportEmptyTramSearch}
                      columns={columns_parent305TramSearch}
                      pagination={false}
                    />
                  </div>
                )}
              </div>

              {statisticType == 3 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listExportTramSearch}
                      columns={columns_parent4TramSearch}
                      pagination={false}
                    />
                  </div>
                </div>
              )}

              {statisticType == 6 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listReturnFullCylinderTramSearch}
                      columns={columns_parent5TramSearch}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Agency") ||
            userType === "General" ? (
            <div className="container-fluid" style={{ textAlign: "center;" }}>
              {statisticType == 2 && (
                <div className="row">
                  <div className="col-6">
                    <Table
                      style={{ background: "transparent" }}
                      bordered
                      dataSource={listCreate}
                      columns={columns_parent1}
                      pagination={false}
                    />
                  </div>
                  <div className="col-12"></div>
                </div>
              )}

              <div className="row mt-5">
                {(statisticType == 0 || statisticType == 4) && (
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listExportEmpty}
                      columns={columns_parent2}
                      pagination={false}
                    />
                  </div>
                )}
                {statisticType == 0 && (
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listImportEmpty}
                      columns={columns_parent3}
                      pagination={false}
                    />
                  </div>
                )}

                {statisticType == 5 && (
                  <div className="col-12">
                    <Table
                      bordered
                      dataSource={listImportEmpty}
                      columns={columns_parent305}
                      pagination={false}
                    />
                  </div>
                )}
              </div>

              {(statisticType == 0 || statisticType == 3) && (
                <div className="row mt-5">
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listExport}
                      columns={columns_parent4}
                      pagination={false}
                    />
                  </div>
                  <div className="col-6">
                    <Table
                      bordered
                      dataSource={listReturnFullCylinder}
                      columns={columns_parent5}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
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
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("nl-BE").format(value)
                  }
                />
                <Legend />
                {typeMonthChart.map((value, index, arr) => {
                  if (arr.length - 1 === index) {
                    return (
                      <Bar
                        yAxisId="left"
                        key={index}
                        dataKey={value.name}
                        barSize={40}
                        stackId="a"
                        fill={value.color}
                        label={renderCustomBarLabel}
                      />
                    );
                  } else
                    return (
                      <Bar
                        yAxisId="left"
                        key={index}
                        dataKey={value.name}
                        barSize={40}
                        stackId="a"
                        fill={value.color}
                      />
                    );
                })}
                {!(
                  (userRoleFixer === "SuperAdmin" &&
                    userTypeFixer === "Fixer") ||
                  (userRole === "SuperAdmin" && userType === "Fixer")
                )
                  ? massMonthLine.map((value, index, arr) => {
                      if (arr.length - 1 === index) {
                        return (
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey={value.name}
                            stroke="blue"
                          />
                        );
                      }
                    })
                  : ""}
              </ComposedChart>
            </ResponsiveContainer>
            <div className="chart-note">
              <p className="chart-note-p">
                Biểu đồ xuất bình theo tháng từ tháng {startMonth}/{startYear} -{" "}
                {endMonth}/{endYear}
              </p>
              <div className="chart-note__time ">
                <div className="d-flex">
                  <span>Thời gian</span>
                  <button
                    className="btn-history active"
                    onClick={handleCurrentYear}
                  >
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
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {arrYear.map((item, index) => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <RangePicker
                    value={[startTime, endTime]}
                    format={"DD/MM/YYYY"}
                    onChange={handleTime}
                  />
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
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("nl-BE").format(value)
                }
              />
              <Legend
                iconSize={10}
                width={120}
                height={140}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              {typeQuarterChart.map((value, index, arr) => {
                if (arr.length - 1 === index) {
                  return (
                    <Bar
                      yAxisId="left"
                      key={index}
                      dataKey={value.name}
                      barSize={60}
                      stackId="a"
                      fill={value.color}
                      label={renderCustomBarLabel}
                    />
                  );
                } else {
                  return (
                    <Bar
                      yAxisId="left"
                      key={index}
                      dataKey={value.name}
                      barSize={60}
                      stackId="a"
                      fill={value.color}
                    />
                  );
                }
              })}
              {!(
                (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") ||
                (userRole === "SuperAdmin" && userType === "Fixer")
              )
                ? massQuarterLine.map((value, index, arr) => {
                    if (arr.length - 1 === index) {
                      return (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey={value.name}
                          stroke="blue"
                        />
                      );
                    }
                  })
                : ""}
            </ComposedChart>
            <div className="chart-note">
              <p className="chart-note-quater">
                Biểu đồ xuất bình theo quý từ tháng {startMonth}/{startYear} -{" "}
                {endMonth}/{endYear}
              </p>
              <div className="chart-note__time ">
                <div className="d-flex">
                  <span style={{ lineHeight: "35px" }}>Thời gian</span>
                  <button
                    className="btn-history active"
                    onClick={handleCurrentYearQuarter}
                  >
                    Năm nay
                  </button>
                  <button
                    className="btn-history"
                    onClick={handlePreYearQuarter}
                  >
                    Năm trước
                  </button>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    placeholder="Chọn năm"
                    optionFilterProp="children"
                    onChange={handleYearQuarter}
                    value={selectYearQuarter}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {arrYear.map((item, index) => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <RangePicker
                    value={[startTime, endTime]}
                    format={"DD/MM/YYYY"}
                    onChange={handleTime}
                  />
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

export default Statistical_V2;
