import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../helper/auth";
import statisticsApi from "../api/statistics2";
import TextButton from "../components/TextButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/AntDesign";
import DropDownPicker from "react-native-dropdown-picker";
import {
  formatNumber,
  translate,
  translateStatistic,
  handleStationExportEmptyCylinder,
  translateBranchName,
  handleStatisticNameY,
  renderTotalX,
  handleDataAllStations,
  getDetailStatisticBinhKhi,
  getDetailStatisticAll,
  handleResponseAllDataRegion,
  getDetailStatisticRedion,
  handleDataRegionDetailAll,
  handleExportDataStation,
  handleReturnDataStation,
  handleCreateData,
  handleImportCylinderData,
  handleExportCylinderData,
} from "./FunctionManagerVer3";
import moment from "moment";
import { KeyboardAvoidingView, Select } from "native-base";
import { lowerCase } from "lodash";
import { styles } from "./styles";
import { COLOR } from "../constants";

const statistic_times = [
  {
    _id: 1,
    time: "TODAY",
  },
  {
    _id: 2,
    time: "YESTERDAY",
  },
  {
    _id: 3,
    time: "THISWEEK",
  },
  {
    _id: 4,
    time: "THISMONTH",
  },
];

const statisticOptionsForAll = [
  {
    label: "Tất cả",
    value: "All",
    key: 1,
  },
  {
    label: "Khai báo",
    value: "create",
    key: 2,
  },
  {
    label: "Xuất vỏ",
    value: "exportEmptyCylinder",
    key: 3,
  },
  {
    label: "Nhập vỏ",
    value: "importEmptyCylinder",
    key: 4,
  },
  {
    label: "Xuất bình",
    value: "exportCylinder",
    key: 5,
  },
];

const statisticForRegion = [
  {
    label: "Tất cả",
    value: "All",
    key: 1,
  },
  {
    label: "Khai báo",
    value: "create",
    key: 2,
  },
  {
    label: "Xuất vỏ",
    value: "exportEmptyCylinder",
    key: 3,
  },
  {
    label: "Nhập vỏ",
    value: "importEmptyCylinder",
    key: 4,
  },
  {
    label: "Xuất bình",
    value: "exportCylinder",
    key: 5,
  },
  {
    label: "Hồi lưu bình đầy",
    value: "returnFullCylinder",
  },
];

const statisticOptionsForBinhKhi = [
  {
    label: "Tất cả",
    value: "All",
    key: 1,
  },
  {
    label: "Khai báo",
    value: "declaration",
    key: 2,
  },
  {
    label: "Xuất vỏ",
    value: "exportEmptyCylinder",
    key: 3,
  },
  {
    label: "Tồn kho",
    value: "inventoryCylinder",
    key: 4,
  },
];

export const cylinderTypes = ["B6", "B12", "B20", "2303B45", "BINH_100"];

const widthScreen = Dimensions.get("window").width;
const screenTextSize = 17;

export default function StatisticManagerVer3() {
  const userInfo = useSelector((state) => state.auth.user);
  let dateStartTmp = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;

  const [totalAmountOfInit, setTotalAmountOfInit] = useState(0);
  const [listChildren, setListChildren] = useState([]);
  const [isVisibleBranch, setIsVisibleBranch] = useState(false);
  const [branchValue, setBranchValue] = useState(null);
  const [listBranchs, setListBranchs] = useState([]);
  const [timeDefaultSelected, setTimeDefaultSelected] = useState("TODAY");
  const [statisticOptions, setStatisticOptions] = useState([]);
  const [startDate, setstartDate] = useState(
    String(new Date(dateStartTmp).toISOString()).substring(0, 10) +
      "T17:00:00.000Z"
  );
  const [endDate, setEndDate] = useState(
    String(new Date().toISOString()).substring(0, 10) + "T16:59:59.999Z"
  );
  const [isVisibleDateTimePicker, setIsVisibleDateTimePicker] = useState(false);
  const [type, setType] = useState();
  const [isVisibleRoll, setIsVisibleRoll] = useState(true);

  const [listStation, setListStation] = useState([]);
  const [isVisibleStation, setIsVisibleStation] = useState(false);
  const [stationValue, setStationValue] = useState(null);
  const [stationValueSmall, setStationValueSmall] = useState(null);

  const [isVisibleDropDownStation, setIsVisibleDropDownStation] =
    useState(false);
  const [isVisibleDropDownStatistic, setIsVisibleDropDownStatistic] =
    useState(false);

  const [isVisibleStatistic, setIsVisibleStatistic] = useState(false);
  const [statisticValue, setStatisticValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [displayData, setDisplayData] = useState([]);

  const [dataColumn, setDataColumn] = useState([
    "createdCylinder",
    "exportEmptyCylinder",
    "importEmptyCylinder",
    "exportCylinder",
    "returnFullCylinder",
  ]);

  const listBinhKhi = ["Declaration", "Export", "Inventory"];

  const [table, setTable] = useState();
  const [dataTotalX, setDataTotalX] = useState({});
  const [dataTotalY, setDataTotalY] = useState();
  const [displayDataStation, setDisplayDataStation] = useState([]);
  const [dataTotalFixer, setDataTotalFixer] = useState();
  const [displayDataFixer, setDisplayDataFixer] = useState();
  const [selectedStatistics, setSelectedStatistics] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const dataColumnFixer = ["create", "exportShellToFixer", "inventory"];

  const dataColumnStation = [
    "create",
    "numberExport",
    "exportShellToElsewhere",
    "importShellFromFixer",
    "importShellFromElsewhere",
    "turnback",
    "inventory",
  ];

  const [customers, setCustomers] = useState([
    {
      label: "Tất cả",
      value: "All",
    },
    {
      label: "Trạm",
      value: "Station",
    },
  ]);

  const [from, setFrom] = useState([
    {
      label: "Tất cả",
      value: "All",
    },
    {
      label: "Bình Khí",
      value: "5f01b04a5452a61194c9e2c3",
    },
    {
      label: "Trạm",
      value: "Station",
    },
  ]);
  const [isVisibleToCustomer, setisVisibleToCustomer] = useState(false);
  const [customerValue, setCustomerValue] = useState();

  const [isVisibleSmallStation, setIsVisibleSmallStation] = useState(false);
  const [exportStations, setExportStations] = useState([]);
  const [exportCustomer, setExportCustomer] = useState([]);
  const [fromValue, setFromValue] = useState("");
  const [isVisibleFrom, setIsVisibleFrom] = useState(false);
  const [isVisibleTotalX, setIsVisibleTotalX] = useState(true);

  const scrollRef = useRef();

  const onPressTouch = () => {
    scrollRef.current?.scrollToEnd({
      animated: true,
    });
  };

  useEffect(() => {
    getListChildren();
    getTotalInitCylinders();
    getAllStations();
    setStatisticValue("All");
    getListStations(userInfo.id);
    setstartDate(
      String(new Date(dateStartTmp).toISOString()).substring(0, 10) +
        "T17:00:00.000Z"
    );
    setEndDate(
      String(new Date().toISOString()).substring(0, 10) + "T16:59:59.999Z"
    );
  }, []);

  const chooseStatisticTime = (time) => {
    setTimeDefaultSelected(time);
    switch (time) {
      case "TODAY":
        let newStartDate = new Date().setHours(0, 0, 0, 0);
        newStartDate = new Date(newStartDate).toISOString();
        let newEndDate = new Date().setHours(23, 59, 59, 999);
        newEndDate = new Date(newEndDate).toISOString();
        setstartDate(newStartDate);
        setEndDate(newEndDate);
        break;
      case "YESTERDAY":
        let newPreviousStartDate =
          new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
        newPreviousStartDate = new Date(newPreviousStartDate).setHours(
          0,
          0,
          0,
          0
        );
        newPreviousStartDate = new Date(newPreviousStartDate).toISOString();
        setstartDate(newPreviousStartDate);
        let newPreviousEndDate = new Date(newPreviousStartDate).setHours(
          23,
          59,
          59,
          999
        );
        newPreviousEndDate = new Date(newPreviousEndDate).toISOString();
        setEndDate(newPreviousEndDate);
        break;
      case "THISWEEK":
        let newFirstDayOfWeek = new Date().getDay() || 7;
        let newEndDate2 = new Date().setHours(23, 59, 59, 999);
        newEndDate2 = new Date(newEndDate2).toISOString();
        newFirstDayOfWeek =
          newFirstDayOfWeek != 1
            ? new Date().setHours(-24 * (newFirstDayOfWeek - 1))
            : new Date();
        newFirstDayOfWeek = new Date(newFirstDayOfWeek).setHours(0, 0, 0, 0);
        newFirstDayOfWeek = new Date(newFirstDayOfWeek).toISOString();
        setstartDate(newFirstDayOfWeek);
        setEndDate(newEndDate2);
        break;
      case "THISMONTH":
        let newFirstDateOfMonth = new Date().setDate(1);
        newFirstDateOfMonth = new Date(newFirstDateOfMonth).setHours(
          0,
          0,
          0,
          0
        );
        newFirstDateOfMonth = new Date(newFirstDateOfMonth).toISOString();
        setstartDate(newFirstDateOfMonth);
        let newLastDateOfMonth = moment(newFirstDateOfMonth).endOf("month");
        newLastDateOfMonth = new Date(newLastDateOfMonth).toISOString();
        setEndDate(newLastDateOfMonth);
        break;
    }
  };

  const timePickerBtn = (type, date) => {
    const formatDate = (date) => {
      if (date != translate("START_DATE") && date != translate("END_DATE")) {
        return moment(date).format("DD/MM/YYYY");
      } else {
        return date;
      }
    };
    return (
      <TouchableOpacity
        onPress={() => {
          setIsVisibleDateTimePicker(true);
          setType(type);
        }}
      >
        <Text>{formatDate(date)}</Text>
      </TouchableOpacity>
    );
  };

  const getTotalInitCylinders = async () => {
    let token = await getToken();
    await statisticsApi
      .getTotalInitCylinders(userInfo.id, token)
      .then((data) => {
        const total = data.data.data.numberCreated;
        setTotalAmountOfInit(total);
      });
  };

  const getListChildren = async () => {
    let token = await getToken();
    if (userInfo.userRole === "SuperAdmin" && userInfo.userType === "Fixer") {
      const itemBranch = {
        label: userInfo.name,
        value: userInfo.id,
        userType: userInfo.userType,
        userRole: userInfo.userRole,
      };
      setListBranchs([itemBranch]);
      setBranchValue(userInfo.id);
      setListChildren([userInfo]);
      setTable(["NEW", "OLD"]);
      setStatisticOptions(statisticOptionsForBinhKhi);
      setIsVisibleDropDownStatistic(true);
    }
    if (userInfo.userRole === "SuperAdmin" && userInfo.userType === "Region") {
      const list = await statisticsApi
        .getListChildren(
          {
            isChildOf: userInfo.id,
          },
          token
        )
        .then((data) => {
          if (data && data.data.success) {
            const listNewChildren = [
              { label: "Tất cả", value: "All", userType: "", userRole: "" },
            ];
            const res = data.data.data;
            setListChildren([userInfo]);
            res.forEach((element) => {
              const child = {
                label: element.name,
                value: element.id,
                userType: element.userType,
                userRole: element.userRole,
              };
              listNewChildren.push(child);
            });
            return listNewChildren;
          }
        });
      setListStation(list);
      setStationValue("All");
      const itemBranch = {
        label: userInfo.name,
        value: userInfo.id,
        userType: userInfo.userType,
        userRole: userInfo.userRole,
      };
      setListBranchs([itemBranch]);
      setBranchValue(userInfo.id);
      // setTable(["NEW", "OLD"]);
      setStatisticOptions(statisticForRegion);
      setIsVisibleDropDownStatistic(true);
      setIsVisibleDropDownStation(true);
    } else {
      const listNewChildren = [
        { label: "Tất cả", value: "All", userType: "", userRole: "" },
      ];
      await statisticsApi
        .getListChildren(
          {
            isChildOf: userInfo.id,
          },
          token
        )
        .then((data) => {
          if (data && data.data.success) {
            const res = data.data.data.filter((value) => {
              return (
                (value.userRole === "SuperAdmin" &&
                  value.userType === "Region") ||
                (value.userRole === "SuperAdmin" && value.userType === "Fixer")
              );
            });
            setListChildren(res);
            res.forEach((element) => {
              const child = {
                label: element.name,
                value: element.id,
                userType: element.userType,
                userRole: element.userRole,
              };
              listNewChildren.push(child);
            });

            setListBranchs(listNewChildren);
          }
        });
    }
  };

  const getAllStations = async () => {
    const token = await getToken();
    await statisticsApi
      .getListStations("all", userInfo.userType, token)
      .then((data) => {
        if (data && data.data.success) {
          const response = handleDataAllStations(data.data.data);
          setExportStations(response);
        }
      });

    await statisticsApi
      .getListStations("allKhachHang", userInfo.userType, token)
      .then((data) => {
        if (data && data.data.success) {
          const response = handleDataAllStations(data.data.data);
          setExportCustomer(response);
        }
      });
  };

  const calTotalX = (data, dataColumn) => {
    let dictTmp = {};
    dataColumn.map((statistic) => {
      let dictChild = {};
      cylinderTypes.map((type) => {
        dictChild[type] = 0;
      });
      dictChild["Total"] = 0;
      if (statistic == "exportCylinder" || statistic == "returnFullCylinder") {
        dictChild["TotalKg"] = 0;
      }
      dictTmp[statistic] = dictChild;
    });

    data.map((child) => {
      dataColumn.map((statistic) => {
        cylinderTypes.map((type) => {
          child.detail.map((detail) => {
            if (detail.code.includes(type)) {
              dictTmp[statistic][type] = dictTmp[statistic][type] || 0;
              detail.statistic[statistic] = detail.statistic[statistic] || 0;
              dictTmp[statistic][type] += detail.statistic[statistic];
            }
          });
        });
      });
    });

    let totalYDict = calTotalY(data, dataColumn);
    data.map((child) => {
      dataColumn.map((statistic) => {
        dictTmp[statistic]["Total"] += totalYDict[child.name][statistic];
        if (
          statistic == "exportCylinder" ||
          statistic == "returnFullCylinder"
        ) {
          dictTmp[statistic]["TotalKg"] = dictTmp[statistic]["TotalKg"] || 0;
          totalYDict[child.name][statistic + "kg"] =
            totalYDict[child.name][statistic + "kg"] || 0;
          dictTmp[statistic]["TotalKg"] +=
            totalYDict[child.name][statistic + "kg"];
        }
      });
    });

    return dictTmp;
  };

  const calTotalY = (data, dataColumn) => {
    let dictTmp = {};
    data.map((child) => {
      let dictChild = {};
      dataColumn.map((statistic) => {
        dictChild[statistic] = 0;
        if (
          statistic == "exportCylinder" ||
          statistic == "returnFullCylinder"
        ) {
          dictChild[statistic + "kg"] = 0;
        }
      });
      dictTmp[child.name] = dictChild;
    });

    data.map((child) => {
      dataColumn.map((statistic) => {
        child.detail.map((value) => {
          dictTmp[child.name][statistic] += value.statistic[statistic];
          if (
            statistic == "exportCylinder" ||
            statistic == "returnFullCylinder"
          ) {
            if (child.name === "Bình Khí") {
              dictTmp[child.name][statistic + "kg"] = 0;
            } else {
              if (value.name) {
                dictTmp[child.name][statistic + "kg"] =
                  dictTmp[child.name][statistic + "kg"] || 0;
                value.statistic[statistic] = value.statistic[statistic] || 0;
                const res =
                  value.statistic[statistic] *
                  parseInt(value.name?.split(" ")[1]);
                dictTmp[child.name][statistic + "kg"] += res;
              }
            }
          }
        });
      });
    });
    return dictTmp;
  };

  const handleStatistic = (statistic) => {
    // dành cho việc đổi kiểu thống kê
    changeBranch();
    setIsVisibleSmallStation(false);
    const branch = listChildren.find((branch) => branch.id == branchValue);
    if (
      branch &&
      branch.userType == "Fixer" &&
      branch.userRole == "SuperAdmin"
    ) {
      switch (statisticValue) {
        case "All":
          setTable(["NEW", "OLD"]);
          setDisplayData([]);
          break;
        case "inventoryCylinder":
          setTable(["inventoryCylinder"]);
          setDisplayData([]);
          break;
        case "exportEmptyCylinder":
          setTable(["exportEmptyCylinder"]);
          setDisplayData([]);
          setCustomerValue("All");
          break;
        case "declaration":
          setTable(["declaration"]);
          setDisplayData([]);
          break;
      }
    } else if (
      branch &&
      branch.userType == "Region" &&
      branch.userRole == "SuperAdmin"
    ) {
      switch (statisticValue) {
        case "All":
          setTable(dataColumn);
          setCustomerValue("All");
          setFromValue("All");
          break;
        case "create":
          setTable(["createdCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          break;
        case "exportEmptyCylinder":
          setTable(["exportEmptyCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          setCustomers([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "trạm",
              value: "Station",
            },
          ]);
          break;
        case "importEmptyCylinder":
          setTable(["importEmptyCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          setFrom([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "Bình khí",
              value: "",
            },
            {
              label: "Trạm",
              value: "Station",
            },
          ]);
          break;
        case "exportCylinder":
          setTable(["exportCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          setCustomers([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "Khách hàng",
              value: "Station",
            },
          ]);
          break;
        case "returnFullCylinder":
          setTable(["returnFullCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          setFrom([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "Khách hàng",
              value: "Station",
            },
            // {
            //   label: "Xe",
            //   value: "5f01b04a5452a61194c9e2c3",
            // },
          ]);
          break;
      }
    } else {
      switch (statistic) {
        case "All":
          setTable(dataColumn);
          setCustomerValue("All");
          setFromValue("All");
          break;
        case "create":
          setTable(["createdCylinder"]);
          setFromValue("All");
          setCustomerValue("All");
          break;
        case "exportEmptyCylinder":
          setTable(["exportEmptyCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          setCustomers([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "Trạm",
              value: "Station",
            },
          ]);
          // const data = handleStationExportEmptyCylinder(
          //   displayData,
          //   "exportEmptyCylinderToName"
          // );
          // const data = handleStationExportEmptyCylinder()
          // setExportStations(data);
          break;
        case "importEmptyCylinder":
          setTable(["importEmptyCylinder"]);
          setFromValue("All");
          setCustomerValue("All");
          const dataImportEmptyCylinder = handleStationExportEmptyCylinder(
            displayData,
            "importEmptyCylinderFrom"
          );
          setFrom([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "Bình khí",
              value: "",
            },
            {
              label: "Trạm",
              value: "Station",
            },
          ]);
          break;
        case "exportCylinder":
          setCustomerValue("All");
          setFromValue("All");
          setTable(["exportCylinder", "returnFullCylinder"]);
          setCustomers([
            {
              label: "Tất cả",
              value: "All",
            },
            {
              label: "Khách hàng",
              value: "Station",
            },
          ]);
          break;
        case "returnFullCylinder":
          setTable(["returnFullCylinder"]);
          setCustomerValue("All");
          setFromValue("All");
          break;
      }
    }
  };

  const changeBranch = () => {
    const branch = listChildren.find((child) => child.id == branchValue);
    if (
      branch &&
      branch.userType == "Fixer" &&
      branch.userRole == "SuperAdmin"
    ) {
      switch (statisticValue) {
        case "create":
          setStatisticValue("declaration");
          break;
        case "declaration":
          setStatisticValue("declaration");
          break;
        case "exportEmptyCylinder":
          setStatisticValue("exportEmptyCylinder");
          break;
        case "inventoryCylinder":
          setStatisticValue("inventoryCylinder");
          break;
        default:
          setStatisticValue("All");
          break;
      }
    } else if (
      branch &&
      branch.userType == "Region" &&
      branch.userRole == "SuperAdmin"
    ) {
      switch (statisticValue) {
        case "All":
          setStatisticValue("All");
          break;
        case "create":
          setStatisticValue("create");
          break;
        case "exportEmptyCylinder":
          setStatisticValue("exportEmptyCylinder");
          break;
        case "importEmptyCylinder":
          setStatisticValue("importEmptyCylinder");
          break;
        case "exportCylinder":
          setStatisticValue("exportCylinder");
          break;
        case "returnFullCylinder":
          setStatisticValue("returnFullCylinder");
          break;
        default:
          setStatisticValue("All");
          break;
      }
    } else {
      switch (statisticValue) {
        case "All":
          setStatisticValue("All");
          break;
        case "create":
          setStatisticValue("create");
          break;
        case "exportEmptyCylinder":
          setStatisticValue("exportEmptyCylinder");
          break;
        case "importEmptyCylinder":
          setStatisticValue("importEmptyCylinder");
          break;
        case "exportCylinder":
          setStatisticValue("exportCylinder");
          break;
        default:
          setStatisticValue("All");
          break;
      }
    }
  };

  const handleStatisticOptions = () => {
    // dành cho việc đổi chi nhánh
    const branch = listChildren.find((child) => child.id == branchValue);
    changeBranch();
    if (
      branch &&
      branch.userType == "Fixer" &&
      branch.userRole == "SuperAdmin"
    ) {
      setStatisticOptions(statisticOptionsForBinhKhi);
      switch (statisticValue) {
        case "All":
          setDisplayData([]);
          setTable(["NEW", "OLD"]);
          break;
        case "inventoryCylinder":
          setDisplayData([]);
          setTable(["inventoryCylinder"]);
          break;
        case "exportEmptyCylinder":
          setDisplayData([]);
          setTable(["exportEmptyCylinder"]);
          break;
        case "declaration":
          setDisplayData([]);
          setTable(["declaration"]);
          break;
      }
    } else if (
      branch &&
      branch.userType == "Region" &&
      branch.userRole == "SuperAdmin"
    ) {
      setStatisticOptions(statisticForRegion);
      setStationValue("All");
      setDisplayData([]);
      setTable(dataColumn);
    } else {
      setStatisticOptions(statisticOptionsForAll);
      setDisplayData([]);
      setTable(dataColumn);
    }
  };

  const getListStations = (id) => {
    const childs = listChildren.find((child) => child.id === id);
    const _listStations = [];
    const label = translate("ALL");
    const child = { label: label, value: "All" };
    _listStations.push(child);
    if (id == "All") {
      setIsVisibleDropDownStatistic(true);
      setIsVisibleDropDownStation(false);
    } else {
      if (childs && childs?.listChild) {
        const _listChild = childs.listChild;
        _listChild.map((item) => {
          const child = { label: item.name, value: item.id };
          _listStations.push(child);
        });
        setListStation(_listStations);
        if (_listChild.length > 0) {
          setIsVisibleDropDownStation(true);
        } else {
          setIsVisibleDropDownStation(false);
          setIsVisibleDropDownStatistic(true);
        }
      }
    }
  };

  const handleData = (data) => {
    console.log("???: ", data);
    let statistic = {};
    table.map((st) => {
      statistic[st] = 0;
    });
    let _data = data;
    _data.map((item) => {
      let children = new Set(item.detail.map((child) => child.code));
      cylinderTypes.map((type) => {
        const mass = type.length > 3 ? 100 : Number.parseInt(type.slice(-2));
        if (!children.has(type)) {
          item.detail.push({ code: type, mass: mass, statistic: statistic });
        }
      });
    });

    let checkList = 0;
    data.map((child) => {
      child.detail.sort((a, b) => a.mass - b.mass);
      if (!child?.name) {
        const name = listStation.find(
          (item) => item.value == stationValueSmall
        )?.label;
        child.name = name;
      }

      child.detail.map((item) => {
        table.map((type) => {
          if (item.statistic[type] > 0) {
            checkList++;
          }
        });
      });
    });
    console.log("_data: ", data);
    return checkList > 0 ? _data : [];
    // return _data;
  };

  const handleDataBinhKhi = (data) => {
    const branch = listChildren.find((child) => child.id == branchValue);
    if (
      branch &&
      branch.userType == "Fixer" &&
      branch.userRole == "SuperAdmin"
    ) {
      if (statisticValue == "All") {
        const _data = data;
        let i = 0;
        _data.data = [];
        listBinhKhi.map((statistic) => {
          const child = {};
          child.name = statistic;
          child.id = i;
          i++;
          child.detail = [];

          const children = new Set(_data[statistic].map((item) => item.code));
          cylinderTypes.map((type) => {
            const mass =
              type.length > 3 ? 100 : Number.parseInt(type.slice(-2));
            if (!children.has(type)) {
              child.detail.push({
                code: type,
                mass: mass,
                statistic: { NEW: 0, OLD: 0 },
              });
            } else {
              const finder = data[statistic].find((item) =>
                item.code.includes(type)
              );
              if (finder?.exportEmptyCylinderObject) {
                const numberOld = finder.numberOld;
                // exportEmptyCylinderObject.reduce(
                //   (accumulator, current) => {
                //     if (
                //       current.hasOwnProperty("oldQuantity") &&
                //       Object.keys(current).length > 0
                //     ) {
                //       return accumulator + (current?.object?.quantity || 0);
                //     } else {
                //       return accumulator;
                //     }
                //   },
                //   0
                // );
                const numberNew = finder.numberNew;
                // exportEmptyCylinderObject.reduce(
                //   (accumulator, current) => {
                //     if (
                //       current.hasOwnProperty("newQuantity") &&
                //       Object.keys(current).length > 0
                //     ) {
                //       return accumulator + (current?.object?.quantity || 0);
                //     } else {
                //       return accumulator;
                //     }
                //   },
                //   0
                // );
                const _child = {
                  ...finder,
                  mass: mass,
                  statistic: { NEW: numberNew, OLD: numberOld },
                };
                child.detail.push(_child);
              } else {
                const _child = {
                  ...finder,
                  mass: mass,
                  statistic: { NEW: finder?.numberNew, OLD: finder?.numberOld },
                };
                child.detail.push(_child);
              }
            }
          });
          _data.data.push(child);
        });

        let checkList = 0;
        _data.data?.map((child) => {
          child.detail?.map((detail) => {
            if (detail.statistic?.OLD > 0 || detail.statistic?.NEW > 0) {
              checkList++;
            }
          });
        });

        console.log(_data.data);
        return checkList > 0 ? _data.data : [];
      } else {
        const _data = data;
        _data.data = [];
        let i = 0;
        let statistic = "";
        if (statisticValue == "exportEmptyCylinder") {
          statistic = "Export";
        } else if (statisticValue == "declaration") {
          statistic = "Declaration";
        } else {
          statistic = "Inventory";
        }

        let items = [];
        const finder = new Set(_data[statistic]?.map((item) => item.code));
        cylinderTypes?.map((type, index) => {
          const item = _data[statistic].find((i) => i.code.includes(type));
          if (item?.exportEmptyCylinderObject) {
            const numberNew = item.numberNew;
            // exportEmptyCylinderObject.reduce(
            //   (accumulator, current) => {
            //     if (
            //       current.hasOwnProperty("newQuantity") &&
            //       Object.keys(current).length > 0
            //     ) {
            //       return accumulator + (current?.object?.quantity || 0);
            //     } else {
            //       return accumulator;
            //     }
            //   },
            //   0
            // );
            if (finder.has(type)) {
              const child = {
                code: type,
                id: index,
                name: item.name,
                statistic: { [statisticValue]: numberNew },
              };
              items.push(child);
            } else {
              let name = "";
              if (type == "B6") {
                name = "Bình 6kg";
              } else if (type == "B12") {
                name = "Bình 12kg";
              } else if (type == "B20") {
                name = "Bình 20kg";
              } else if (type == "BINH_100") {
                name = "Bình 100kg";
              } else {
                name = "Bình 45kg";
              }
              const child = {
                code: type,
                id: index,
                name: name,
                statistic: { [statisticValue]: 0 },
              };
              items.push(child);
            }
          } else {
            if (finder.has(type)) {
              const child = {
                code: type,
                id: index,
                name: item.name,
                statistic: { [statisticValue]: item?.numberNew },
              };
              items.push(child);
            } else {
              let name = "";
              if (type == "B6") {
                name = "Bình 6kg";
              } else if (type == "B12") {
                name = "Bình 12kg";
              } else if (type == "B20") {
                name = "Bình 20kg";
              } else if (type == "BINH_100") {
                name = "Bình 100kg";
              } else {
                name = "Bình 45kg";
              }
              const child = {
                code: type,
                id: index,
                name: name,
                statistic: { [statisticValue]: 0 },
              };
              items.push(child);
            }
          }
        });

        _data.data.push({ name: "NEW", id: i, detail: items });
        i++;
        items = [];
        cylinderTypes?.map((type, index) => {
          const item = _data[statistic].find((i) => i.code.includes(type));
          if (item?.exportEmptyCylinderObject) {
            const numberOld = item.numberOld;
            // exportEmptyCylinderObject.reduce(
            //   (accumulator, current) => {
            //     if (
            //       current.hasOwnProperty("oldQuantity") &&
            //       Object.keys(current).length > 0
            //     ) {
            //       return accumulator + (current?.object?.quantity || 0);
            //     } else {
            //       return accumulator;
            //     }
            //   },
            //   0
            // );
            if (finder.has(type)) {
              const child = {
                code: type,
                id: index,
                name: item.name,
                statistic: { [statisticValue]: numberOld },
              };
              items.push(child);
            } else {
              let name = "";
              if (type == "B6") {
                name = "Bình 6kg";
              } else if (type == "B12") {
                name = "Bình 12kg";
              } else if (type == "B20") {
                name = "Bình 20kg";
              } else if (type == "BINH_100") {
                name = "Bình 100kg";
              } else {
                name = "Bình 45kg";
              }
              const child = {
                code: type,
                id: index,
                name: name,
                statistic: { [statisticValue]: 0 },
              };
              items.push(child);
            }
          } else {
            if (finder.has(type)) {
              const child = {
                code: type,
                id: index,
                name: item.name,
                statistic: { [statisticValue]: item?.numberOld },
              };
              items.push(child);
            } else {
              let name = "";
              if (type == "B6") {
                name = "Bình 6kg";
              } else if (type == "B12") {
                name = "Bình 12kg";
              } else if (type == "B20") {
                name = "Bình 20kg";
              } else if (type == "BINH_100") {
                name = "Bình 100kg";
              } else {
                name = "Bình 45kg";
              }
              const child = {
                code: type,
                id: index,
                name: name,
                statistic: { [statisticValue]: 0 },
              };
              items.push(child);
            }
          }
        });
        _data.data.push({ name: "OLD", id: i, detail: items });

        let checklist = 0;
        _data.data.map((child) => {
          child.detail.map((item) => {
            table.map((type) => {
              if (item.statistic[type] > 0) {
                checklist++;
              }
            });
          });
        });

        return checklist > 0 ? _data.data : [];
      }
    }
  };

  const handleDisplayData = async (condition) => {
    setIsLoading(true);
    let token = await getToken();
    // if (
    //   (userInfo.userRole == "SuperAdmin" && userInfo.userType == "Factory") ||
    //   (userInfo.userRole == "SuperAdmin" && userInfo.userType == "Region")
    // ) {
    const branch = listChildren.find((child) => child.id == branchValue);
    if (
      branch &&
      branch.userType == "Fixer" &&
      branch.userRole == "SuperAdmin"
    ) {
      // setTable(["NEW", "OLD"]);
      await statisticsApi
        .getAggregateRepairFactory(
          branchValue,
          startDate,
          endDate,
          "NEW",
          token
        )
        .then((data) => {
          console.log("data new: ", data);
          if (data && data.data.success && data.data.returnData.length > 0) {
            if (
              statisticValue == "exportEmptyCylinder" &&
              customerValue == "Station" &&
              stationValueSmall !== ""
            ) {
              const result = getDetailStatisticBinhKhi(
                data.data.returnData[0],
                statisticValue,
                stationValueSmall
              );
              setDisplayData(result);
              setDataTotalX(calTotalX(result, table));
              setDataTotalY(calTotalY(result, table));
            } else {
              const result = handleDataBinhKhi(data.data.returnData[0]);
              setDisplayData(result);
              setDataTotalX(calTotalX(result, table));
              setDataTotalY(calTotalY(result, table));
            }
          }
        });
    } else if (
      branch &&
      branch.userType == "Region" &&
      branch.userRole == "SuperAdmin"
    ) {
      // thống kê vt gas trường hợp thống kê toàn bộ chi nhánh
      if (stationValue == "All") {
        // thống kê trường hợp kiểu thống kê là tất cả, khai báo
        if (
          statisticValue == "All" ||
          statisticValue == "create" ||
          stationValueSmall == "All" ||
          (customerValue == "All" && fromValue == "All")
        ) {
          await statisticsApi
            .getStationDetail(
              branchValue,
              "byItsChildren",
              startDate,
              endDate,
              token
            )
            .then((data) => {
              console.log("Data Region: ", data);
              if (data && data.data.success) {
                const res = handleCreateData(
                  data.data.data,
                  listStation,
                  dataColumn
                );
                setDisplayData(handleData(res));
                setDataTotalX(calTotalX(res, dataColumn));
                setDataTotalY(calTotalY(res, dataColumn));
              }
            });
        } else {
          // thống kê vt gas các trường hợp còn lại
          await statisticsApi
            .getStationDetail(
              branchValue,
              "byItsChildren",
              startDate,
              endDate,
              token
            )
            .then((data) => {
              console.log("Data Region: ", data);
              if (data && data.data.success) {
                const res = handleCreateData(
                  data.data.data,
                  listStation,
                  dataColumn
                );
                console.log("kết quả đây: ", res);
                const response = getDetailStatisticRedion(
                  res,
                  statisticValue,
                  stationValueSmall
                );
                console.log("response: ", response);
                setDisplayData(handleData(response));
                setDataTotalX(calTotalX(response, dataColumn));
                setDataTotalY(calTotalY(response, dataColumn));
              }
            });
        }
      } else {
        // thống kê vt gas trường hợp thống kê từng trạm con
        await statisticsApi
          .getStationDetail(stationValue, "byItself", startDate, endDate, token)
          .then((data) => {
            console.log("Data Region 1: ", data, statisticValue);
            if (data && data.data.success) {
              const res = data.data.data;
              // thống kê tất cả từng trạm con
              if (statisticValue == "All") {
                const responseHandle = handleDataRegionDetailAll(
                  res[0],
                  cylinderTypes
                );
                console.log(responseHandle);
                setDisplayData(responseHandle);
                setDataTotalX(calTotalX(res, dataColumn));
                setDataTotalY(calTotalY(res, dataColumn));
              } else if (statisticValue == "exportEmptyCylinder") {
                if (customerValue == "All" && fromValue == "All") {
                  const responseHandle = handleExportDataStation(
                    res[0],
                    exportStations,
                    statisticValue
                  );
                  console.log(responseHandle);
                  setDisplayData(handleData(responseHandle));
                  setDataTotalY(calTotalY(responseHandle, table));
                  setDataTotalX(calTotalX(responseHandle, table));
                } else {
                  const response = getDetailStatisticRedion(
                    res,
                    statisticValue,
                    stationValueSmall
                  );
                  console.log("response: ", response);
                  setDisplayData(response);
                  setDataTotalY(calTotalY(response, table));
                  setDataTotalX(calTotalX(response, table));
                }
              } else if (statisticValue == "returnFullCylinder") {
                if (customerValue == "All" && fromValue == "All") {
                  // thống kê hồi lưu của trạm con, tất cả
                  const response = handleReturnDataStation(res[0], "all");
                  setDisplayData(response);
                  setDataTotalY(calTotalY(response, table));
                  setDataTotalX(calTotalX(response, table));
                } else {
                  // thống kê hồi lưu của trạm con từ 1 khách hàng
                  const response = handleReturnDataStation(
                    res[0],
                    stationValueSmall
                  );
                  setDisplayData(response);
                  setDataTotalY(calTotalY(response, table));
                  setDataTotalX(calTotalX(response, table));
                }
              } else if (statisticValue == "create") {
                // thống kê khai báo của 1 trạm con
                const response = handleCreateData(res);
                // console.log("fff: ", response);
                setDisplayData(handleData(response));
                setDataTotalX(calTotalX(response, table));
                setDataTotalY(calTotalY(response, table));
              } else if (statisticValue == "importEmptyCylinder") {
                // thống kê nhập bình
                if (fromValue == "All") {
                  // const response =
                  handleImportCylinderData(res[0]);
                } else {
                  console.log("eeeeeee");
                }
              } else if (statisticValue == "exportCylinder") {
                // thống kê xuất bình trạm
                if (customerValue == "All") {
                  const response = handleExportCylinderData(
                    res[0],
                    exportCustomer,
                    "all"
                  );
                  setDisplayData(response);
                  setDataTotalX(calTotalX(response, table));
                  setDataTotalY(calTotalY(response, table));
                } else {
                  const response = handleExportCylinderData(
                    res[0],
                    exportCustomer,
                    stationValueSmall
                  );
                  setDisplayData(response);
                  setDataTotalX(calTotalX(response, table));
                  setDataTotalY(calTotalY(response, table));
                }
              }
            }
          });
      }
    } else if (branchValue == "All") {
      await statisticsApi
        .getAggregate(userInfo.id, startDate, endDate, token)
        .then((data) => {
          console.log("data la: => ", data);
          if (data && data.data.success) {
            if (
              statisticValue != "All" &&
              (customerValue != "All" || fromValue != "All") &&
              statisticValue != "create" &&
              (customerValue == "Station" ||
                fromValue == "Station" ||
                fromValue == "5f01b04a5452a61194c9e2c3") &&
              stationValue !== ""
            ) {
              setDisplayData([]);
              const res = getDetailStatisticAll(
                data.data.data,
                statisticValue,
                stationValueSmall
              );
              console.log("res: ", res);
              setDisplayData(res);
              setDataTotalX(calTotalX(res, dataColumn));
              setDataTotalY(calTotalY(res, dataColumn));
            } else {
              const res = data.data.data;
              setDisplayData(handleData(res));
              setDataTotalX(calTotalX(data.data.data, dataColumn));
              setDataTotalY(calTotalY(data.data.data, dataColumn));
            }
          }
        });
    } else {
      setDisplayData([]);
    }

    setIsLoading(false);
  };

  const handleFastStatistic = (branch, statistic) => {
    const currentUser = listBranchs.find((item) => item.value == branch.id);
    const station = listStation.find((item) => item.value == branch.id);
    let stt = "";
    if (statistic == "createdCylinder") {
      if (currentUser?.userType == "Fixer") {
        stt = "declaration";
      }
      stt = "create";
    } else {
      stt = statistic;
    }
    // else if (statistic == "exportEmptyCylinder") {

    // } else if (statistic == "importEmptyCylinder") {

    // } else if (statistic == "exportCylinder") {

    if (currentUser && currentUser.value) {
      setBranchValue(branch.id);
      setStationValue("All");
      setDisplayData([]);
      setStatisticValue(stt);
    } else if (!currentUser && !station) {
    } else {
      setStationValue(branch.id);
      setStatisticValue("All");
      changeBranch();
      setDisplayData([]);
    }
  };

  const translateStatisticStation = (statistic) => {
    switch (statistic) {
      case "create":
        return translate("CREATED_SHELL");
      case "exportCylinder":
        return translate("EXPORTED_CYLINDERS");
      case "massExport":
        return translate("WEIGHT");
      case "turnback":
        return translate("TURNBACK_SHELL");
      case "inventory":
        return translate("INVENTORY_SHELL");
      case "exportShellToElsewhere":
        return translate("EXPORT_SHELL_TO_ELSEWHERE");
      case "exportShellToFixer":
        return translate("EXPORT_SHELL_TO_FIXER");
      case "importShellFromElsewhere":
        return translate("EXPORT_SHELL_FROM_ELSEWHERE");
      case "importShellFromFixer":
        return translate("EXPORT_SHELL_FROM_FIXER");
      case "cancel":
        return translate("CANCEL");
    }
  };

  const translateCylinder = (cylinder) => {
    switch (cylinder) {
      case "B6":
        return translate("6_CYLINDER");
      case "B12":
        return translate("12_CYLINDER");
      case "B20":
        return translate("20_CYLINDER");
      case "2303B45":
        return translate("45_CYLINDER");
      case "BINH_100":
        return translate("100_CYLINDER");
    }
  };

  const getData = () => {
    setDisplayData([]);
    handleDisplayData("NEW");
  };

  return (
    <>
      {listBranchs.length > 0 ? (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          scrollEnabled={isVisibleRoll}
          style={styles.container}
        >
          <View style={styles.timeSection}>
            <Text style={styles.txtTimeTitle}>{translate("TIME")}</Text>
            <View style={styles.timeSectionOption}>
              {
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={statistic_times}
                  renderItem={({ item }) => (
                    <TextButton
                      onPress={() => chooseStatisticTime(item.time)}
                      btnStyle={
                        timeDefaultSelected == item.time
                          ? styles.btnStyleActive
                          : styles.btnStyleUnActive
                      }
                      style={styles.txtTime}
                      children={translate(item.time)}
                    />
                  )}
                />
              }
            </View>

            <DateTimePickerModal
              mode="date"
              isVisible={isVisibleDateTimePicker}
              maximumDate={new Date()}
              onCancel={() => setIsVisibleDateTimePicker(false)}
              onConfirm={(date) => {
                setIsVisibleDateTimePicker(false);
                switch (type) {
                  case "startDate":
                    let newDateStart = new Date(date).setHours(0, 0, 0, 0);
                    newDateStart = new Date(newDateStart).toISOString();
                    setstartDate(newDateStart);
                    const selectedDate = date.getDate();
                    const currentDate = new Date().getDate();
                    const newEndate = new Date(endDate).getDate();
                    if (selectedDate !== currentDate) {
                      setTimeDefaultSelected("");
                    }
                    if (
                      selectedDate === currentDate &&
                      newEndate === currentDate
                    ) {
                      setTimeDefaultSelected("TODAY");
                    }
                    break;
                  case "endDate":
                    let newDateEnd = new Date(date).setHours(23, 59, 59, 999);
                    newDateEnd = new Date(newDateEnd).toISOString();
                    setEndDate(newDateEnd);
                    const _selectedDate = date.getDate();
                    const _currentDate = new Date().getDate();
                    const newStartDate = new Date(startDate).getDate();
                    if (_selectedDate != _currentDate) {
                      setTimeDefaultSelected("");
                    }
                    if (
                      _selectedDate === _currentDate &&
                      newStartDate === _currentDate
                    ) {
                      setTimeDefaultSelected("TODAY");
                    }
                    break;
                }
              }}
              value={new Date().setHours(23, 59, 59, 999)}
            />

            <View style={styles.datePickerSection}>
              {timePickerBtn("startDate", startDate)}
              <Text>~</Text>
              {timePickerBtn("endDate", endDate)}
              <Icon name={"calendar"} size={20} color="gray" />
            </View>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.txtTotal}>
              {translate("TOTAL_LPG_BOTTLE_INITIALIZATION")}:{" "}
              {formatNumber(totalAmountOfInit)}
            </Text>
          </View>

          <View style={styles.statisticOptionsSection}>
            <View style={styles.optionSection}>
              <Text style={styles.txtOption}>{translate("BRANCH")}</Text>
              <DropDownPicker
                style={styles.dropdownStyle}
                items={listBranchs}
                open={isVisibleBranch}
                onClose={() => setIsVisibleRoll(true)}
                setOpen={() => {
                  setIsVisibleBranch(!isVisibleBranch);
                  setIsVisibleRoll(false);
                }}
                setValue={(value) => {
                  setDisplayData([]);
                  setBranchValue(value);
                }}
                onChangeValue={(value) => {
                  handleStatisticOptions();
                  getListStations(value);
                }}
                placeholder={translate("SELECT")}
                dropDownContainerStyle={styles.dropStyle}
                placeholderStyle={styles.placeholderStyle}
                value={branchValue}
              />
            </View>

            {isVisibleDropDownStation ? (
              <View style={styles.optionSection}>
                <Text style={styles.txtOption}>{translate("STATION")}</Text>
                <DropDownPicker
                  style={styles.dropdownStyle}
                  items={listStation}
                  open={isVisibleStation}
                  onChangeValue={(value) => setStationValue(value)}
                  setOpen={() => {
                    setIsVisibleStation(!isVisibleStation);
                    setIsVisibleRoll(false);
                  }}
                  setValue={(value) => {
                    setStationValue(value);
                    setDisplayData([]);
                  }}
                  onClose={() => {
                    setIsVisibleRoll(true);
                  }}
                  placeholder={translate("SELECT")}
                  dropDownContainerStyle={styles.dropStyle}
                  placeholderStyle={styles.placeholderStyle}
                  value={stationValue}
                />
              </View>
            ) : null}

            {isVisibleDropDownStatistic || stationValue ? (
              <View style={styles.optionSection}>
                <Text style={styles.txtOption}>{translate("STATISTICS")}</Text>
                <DropDownPicker
                  style={styles.dropdownStyle}
                  items={statisticOptions}
                  open={isVisibleStatistic}
                  setOpen={() => {
                    setIsVisibleStatistic(!isVisibleStatistic);
                    setIsVisibleRoll(false);
                  }}
                  setValue={(value) => {
                    setStatisticValue(value);
                    setDisplayData([]);
                  }}
                  onClose={() => {
                    setIsVisibleRoll(true);
                  }}
                  onChangeValue={(value) => {
                    handleStatistic(value);
                  }}
                  placeholder={translate("SELECT")}
                  dropDownContainerStyle={styles.dropStyle}
                  placeholderStyle={styles.placeholderStyle}
                  value={statisticValue}
                />
              </View>
            ) : null}
          </View>

          {(statisticValue == "exportEmptyCylinder" ||
            statisticValue == "exportCylinder") && (
            <View style={styles.optionSection}>
              <Text style={styles.txtOption}>
                {statisticValue == "exportCylinder"
                  ? translate("TO_CUSTOMER")
                  : translate("TO")}
              </Text>
              <DropDownPicker
                style={styles.dropdownStyle}
                items={customers}
                open={isVisibleToCustomer}
                dropDownContainerStyle={styles.dropStyle}
                setOpen={() => {
                  setisVisibleToCustomer(!isVisibleToCustomer);
                  setIsVisibleRoll(false);
                }}
                onClose={() => {
                  setIsVisibleRoll(true);
                }}
                value={customerValue}
                placeholder=""
                setValue={(value) => {
                  setCustomerValue(value);
                  setDisplayData([]);
                }}
                showArrowIcon={false}
              />
            </View>
          )}

          {(table == "importEmptyCylinder" ||
            table == "returnFullCylinder") && (
            <View style={styles.optionSection}>
              <Text style={styles.txtOption}>{translate("FROM")}</Text>
              <DropDownPicker
                style={styles.dropdownStyle}
                items={from}
                open={isVisibleFrom}
                setOpen={() => {
                  setIsVisibleFrom(!isVisibleFrom);
                  setIsVisibleRoll(false);
                }}
                setValue={(value) => {
                  setFromValue(value);
                  setDisplayData([]);
                }}
                onClose={() => {
                  setIsVisibleRoll(true);
                }}
                onChangeValue={(value) => {
                  value != "All" && value != "Station"
                    ? setStationValueSmall(value)
                    : null;
                }}
                placeholder={translate("SELECT")}
                dropDownContainerStyle={styles.dropStyle}
                placeholderStyle={styles.placeholderStyle}
                value={fromValue}
              />
            </View>
          )}

          {((statisticValue == "exportEmptyCylinder" &&
            customerValue == "Station") ||
            (statisticValue == "importEmptyCylinder" &&
              fromValue == "Station") ||
            (statisticValue == "returnFullCylinder" &&
              fromValue == "Station") ||
            (statisticValue == "exportCylinder" &&
              customerValue == "Station")) && (
            <View style={styles.optionSection}>
              <Text style={styles.txtOption}>
                {statisticValue == "exportCylinder" ||
                statisticValue == "returnFullCylinder"
                  ? translate("CUSTOMER")
                  : translate("STATION")}
              </Text>
              <DropDownPicker
                searchable={true}
                searchPlaceholder="Tìm trạm..."
                style={styles.dropdownStyle}
                items={
                  statisticValue == "exportCylinder" ||
                  statisticValue == "returnFullCylinder"
                    ? exportCustomer
                    : exportStations
                }
                open={isVisibleSmallStation}
                setOpen={() => {
                  setIsVisibleSmallStation(!isVisibleSmallStation);
                  setIsVisibleRoll(false);
                }}
                setValue={(value) => {
                  setStationValueSmall(value);
                  setDisplayData([]);
                }}
                onClose={() => {
                  setIsVisibleRoll(true);
                }}
                onChangeValue={(value) => {
                  const x = getDetailStatisticBinhKhi(
                    displayData,
                    statisticValue,
                    stationValueSmall
                  );
                }}
                onChangeSearchText={onPressTouch}
                placeholder={translate("SELECT")}
                dropDownContainerStyle={styles.dropStyle}
                placeholderStyle={styles.placeholderStyle}
                value={stationValueSmall}
              />
            </View>
          )}

          <View style={styles.btnShowSection}>
            <TextButton
              onPress={() => getData()}
              style={styles.btnShow}
              children={translate("SHOW_STATISTIC")}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator
              style={{ height: 300 }}
              size="large"
              color={"#009347"}
            />
          ) : (
            <View
              style={[
                displayData.length > 0
                  ? styles.StatisticSection
                  : { height: 250 },
              ]}
            >
              {
                displayData.length > 0 ? (
                  stationValue != "All" &&
                  statisticValue == "All" &&
                  listBranchs.find((item) => item.value == branchValue)
                    ?.userType == "Region" ? (
                    <View style={[{ width: widthScreen }]}>
                      <View style={styles.rowStyle}>
                        <View
                          style={[
                            styles.elementStyle,
                            {
                              backgroundColor: "#009347",
                              height: widthScreen / 7 + 48,
                              width: widthScreen / 4,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.elementText,
                              { color: "#fff", fontWeight: "bold" },
                            ]}
                          >
                            {
                              listStation.find(
                                (item) => item.value == stationValue
                              )?.label
                            }
                          </Text>
                        </View>

                        <View>
                          <View style={styles.articleStyle}>
                            <Text
                              style={[
                                styles.elementText,
                                { color: "#fff", fontWeight: "bold" },
                              ]}
                            >
                              Loại bình
                            </Text>
                          </View>
                          <View style={styles.rowStyle}>
                            {cylinderTypes.map((value) => {
                              return (
                                <View
                                  style={[
                                    styles.elementStyle,
                                    {
                                      backgroundColor: "#009347",
                                      width: widthScreen / 8,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.elementText,
                                      { color: "#fff", fontWeight: "bold" },
                                    ]}
                                  >
                                    {translateCylinder(value)}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>

                        <View
                          style={[
                            styles.elementStyle,
                            {
                              backgroundColor: "#009347",
                              height: widthScreen / 7 + 48,
                              width: widthScreen / 8,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.elementText,
                              { color: "#fff", fontWeight: "bold" },
                            ]}
                          >
                            {translate("TOTAL")}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.columnGroup}>
                        <View style={styles.columnLeftGroup}>
                          <TouchableOpacity
                            style={[
                              styles.elementStyle,
                              { width: widthScreen / 4 },
                            ]}
                          >
                            <Text
                              style={[
                                styles.elementText,
                                { fontWeight: "bold" },
                              ]}
                            >
                              Khai báo mới
                            </Text>
                          </TouchableOpacity>
                          <View style={styles.smallColumnGroup}>
                            <TouchableOpacity
                              style={[
                                styles.elementStyle,
                                {
                                  width: widthScreen / 8 - 1,
                                  height: widthScreen / 3,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { fontWeight: "bold" },
                                ]}
                              >
                                Xuất bình
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.insideGroup}>
                              <View
                                style={[
                                  styles.elementStyle,
                                  { width: widthScreen / 8 },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.elementText,
                                    { fontWeight: "bold" },
                                  ]}
                                >
                                  Số lượng
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.elementStyle,
                                  { width: widthScreen / 8 },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.elementText,
                                    { fontWeight: "bold" },
                                  ]}
                                >
                                  Khối lượng LPG (Kg)
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.smallColumnGroup}>
                            <TouchableOpacity
                              style={[
                                styles.elementStyle,
                                {
                                  width: widthScreen / 8 - 1,
                                  height: widthScreen / 3,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { fontWeight: "bold" },
                                ]}
                              >
                                Hồi lưu bình đầy
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.insideGroup}>
                              <View
                                style={[
                                  styles.elementStyle,
                                  { width: widthScreen / 8 },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.elementText,
                                    { fontWeight: "bold" },
                                  ]}
                                >
                                  Số lượng
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.elementStyle,
                                  { width: widthScreen / 8 },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.elementText,
                                    { fontWeight: "bold" },
                                  ]}
                                >
                                  Khối lượng LPG (Kg)
                                </Text>
                              </View>
                            </View>
                          </View>

                          <TouchableOpacity
                            style={[
                              styles.elementStyle,
                              { width: widthScreen / 4 },
                            ]}
                          >
                            <Text
                              style={[
                                styles.elementText,
                                { fontWeight: "bold" },
                              ]}
                            >
                              Xuất vỏ
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.elementStyle,
                              { width: widthScreen / 4 },
                            ]}
                          >
                            <Text
                              style={[
                                styles.elementText,
                                { fontWeight: "bold" },
                              ]}
                            >
                              Nhập vỏ
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={displayData}
                          horizontal={false}
                          renderItem={({ item }) => (
                            <View style={[styles.rowStyle]}>
                              {item.map((number) => (
                                <View
                                  style={[
                                    styles.elementStyle,
                                    {
                                      width: widthScreen / 8,
                                    },
                                  ]}
                                >
                                  <Text style={styles.elementText}>
                                    {number}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                          keyExtractor={() => Math.random()}
                        />
                      </View>
                    </View>
                  ) : (
                    table?.map((statistic) => {
                      return (
                        <View style={styles.tableStyle}>
                          {branchValue != "All" &&
                            stationValue != "All" &&
                            statisticValue == "returnFullCylinder" &&
                            fromValue != "All" && (
                              <View>
                                <View
                                  style={[
                                    styles.elementStyle,
                                    {
                                      width: widthScreen / 8,
                                      backgroundColor: COLOR.GREEN_MAIN,
                                      height: widthScreen / 7 + 48,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.elementText,
                                      {
                                        color: COLOR.WHITE,
                                        fontWeight: "bold",
                                      },
                                    ]}
                                  >
                                    Từ
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.elementStyle,
                                    { flex: 1, width: widthScreen / 8 },
                                  ]}
                                >
                                  <Text style={styles.elementText}>
                                    {
                                      exportCustomer.find(
                                        (customer) =>
                                          customer.value == stationValueSmall
                                      )?.label
                                    }
                                  </Text>
                                </View>
                              </View>
                            )}

                          <View>
                            <View style={styles.rowStyle}>
                              <View
                                style={[
                                  styles.elementStyle,
                                  {
                                    backgroundColor: "#009347",
                                    height: widthScreen / 7 + 48,
                                    width:
                                      (statistic == "exportCylinder" ||
                                        statistic === "returnFullCylinder") &&
                                      (stationValue == "All" ||
                                        statisticValue == "All" ||
                                        (statisticValue ==
                                          "exportEmptyCylinder" ||
                                        statisticValue == "exportCylinder"
                                          ? customerValue == "All" ||
                                            customerValue == "Station"
                                          : fromValue == "Station"))
                                        ? widthScreen / 8
                                        : widthScreen / 7,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.elementText,
                                    { color: "#fff", fontWeight: "bold" },
                                  ]}
                                >
                                  {/* Tên Đơn vị */}
                                  {branchValue != "All" &&
                                  stationValue != "All" &&
                                  listBranchs.find(
                                    (item) => item.value == branchValue
                                  )?.userType != "Fixer" &&
                                  statisticValue == "exportEmptyCylinder"
                                    ? `Từ: ${
                                        listStation.find(
                                          (item) => item.value == stationValue
                                        )?.label
                                      }`
                                    : translateBranchName(
                                        branchValue,
                                        listBranchs,
                                        stationValue,
                                        exportStations,
                                        exportCustomer,
                                        statisticValue,
                                        fromValue
                                      )}
                                </Text>
                              </View>

                              <View>
                                <View style={styles.articleStyle}>
                                  <Text
                                    style={[
                                      styles.elementText,
                                      { color: "#fff", fontWeight: "bold" },
                                    ]}
                                  >
                                    {translateStatistic(statistic)}
                                  </Text>
                                </View>
                                <View style={styles.rowStyle}>
                                  {cylinderTypes.map((value) => {
                                    return (
                                      <View
                                        style={[
                                          styles.elementStyle,
                                          {
                                            backgroundColor: "#009347",
                                            width:
                                              (statistic == "exportCylinder" ||
                                                statistic ===
                                                  "returnFullCylinder") &&
                                              (stationValue == "All" ||
                                                statisticValue == "All" ||
                                                (statisticValue ==
                                                  "exportEmptyCylinder" ||
                                                statisticValue ==
                                                  "exportCylinder"
                                                  ? customerValue == "All" ||
                                                    customerValue == "Station"
                                                  : fromValue == "Station"))
                                                ? widthScreen / 8
                                                : widthScreen / 7,
                                          },
                                        ]}
                                      >
                                        <Text
                                          style={[
                                            styles.elementText,
                                            {
                                              color: "#fff",
                                              fontWeight: "bold",
                                            },
                                          ]}
                                        >
                                          {translateCylinder(value)}
                                        </Text>
                                      </View>
                                    );
                                  })}
                                </View>
                              </View>

                              <View
                                style={[
                                  styles.elementStyle,
                                  {
                                    backgroundColor: "#009347",
                                    height: widthScreen / 7 + 48,
                                    width:
                                      (statistic == "exportCylinder" ||
                                        statistic === "returnFullCylinder") &&
                                      (stationValue == "All" ||
                                        statisticValue == "All" ||
                                        (stationValue ==
                                          "exportEmptyCylinder" ||
                                        statisticValue == "exportCylinder"
                                          ? customerValue == "All" ||
                                            customerValue == "Station"
                                          : false))
                                        ? widthScreen / 8
                                        : widthScreen / 7,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.elementText,
                                    { color: "#fff", fontWeight: "bold" },
                                  ]}
                                >
                                  {(statistic === "exportCylinder" ||
                                    statistic === "returnFullCylinder") &&
                                  (stationValue == "All" ||
                                    statisticValue == "All" ||
                                    (stationValue == "exportEmptyCylinder" ||
                                    statisticValue == "exportCylinder"
                                      ? customerValue == "All" ||
                                        customerValue == "Station"
                                      : false))
                                    ? translate("TOTAL3")
                                    : translate("TOTAL")}
                                </Text>
                              </View>
                              {(statistic == "exportCylinder" ||
                                statistic === "returnFullCylinder") &&
                              (stationValue == "All" ||
                                statisticValue == "All" ||
                                (stationValue == "exportEmptyCylinder" ||
                                statisticValue == "exportCylinder"
                                  ? customerValue == "All" ||
                                    customerValue == "Station"
                                  : false)) ? (
                                <View
                                  style={[
                                    styles.elementStyle,
                                    {
                                      backgroundColor: "#009347",
                                      height: widthScreen / 7 + 48,
                                      width: widthScreen / 8,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.elementText,
                                      { color: "#fff", fontWeight: "bold" },
                                    ]}
                                  >
                                    {translate("TOTAL_WEIGHT_LPG")} (kg)
                                  </Text>
                                </View>
                              ) : null}
                            </View>

                            <FlatList
                              data={displayData}
                              keyExtractor={(item) => item.id}
                              renderItem={({ item }) => {
                                return (
                                  <View style={styles.rowStyle}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        handleFastStatistic(item, statistic);
                                      }}
                                      style={[
                                        styles.elementStyle,
                                        {
                                          width:
                                            (statistic == "exportCylinder" ||
                                              statistic ===
                                                "returnFullCylinder") &&
                                            (stationValue == "All" ||
                                              statisticValue == "All" ||
                                              (statisticValue ==
                                                "exportEmptyCylinder" ||
                                              statisticValue == "exportCylinder"
                                                ? customerValue == "All" ||
                                                  customerValue == "Station"
                                                : fromValue == "Station"))
                                              ? widthScreen / 8
                                              : widthScreen / 7,
                                        },
                                      ]}
                                    >
                                      <Text style={styles.elementText}>
                                        {handleStatisticNameY(
                                          branchValue,
                                          item,
                                          listBranchs,
                                          statisticValue,
                                          stationValue,
                                          exportStations,
                                          stationValueSmall
                                        )}
                                      </Text>
                                    </TouchableOpacity>

                                    {item.detail
                                      .sort((a, b) => a.mass - b.mass)
                                      .map((value) => {
                                        return (
                                          <View
                                            style={[
                                              styles.elementStyle,
                                              {
                                                width:
                                                  (statistic ==
                                                    "exportCylinder" ||
                                                    statistic ===
                                                      "returnFullCylinder") &&
                                                  (stationValue == "All" ||
                                                    statisticValue == "All" ||
                                                    (stationValue ==
                                                      "exportEmptyCylinder" ||
                                                    statisticValue ==
                                                      "exportCylinder"
                                                      ? customerValue ==
                                                          "All" ||
                                                        customerValue ==
                                                          "Station"
                                                      : fromValue == "Station"))
                                                    ? widthScreen / 8
                                                    : widthScreen / 7,
                                              },
                                            ]}
                                          >
                                            <Text style={styles.elementText}>
                                              {formatNumber(
                                                value.statistic[statistic]
                                              )}
                                            </Text>
                                          </View>
                                        );
                                      })}
                                    <View
                                      style={[
                                        styles.elementStyle,
                                        {
                                          width:
                                            (statistic == "exportCylinder" ||
                                              statistic ===
                                                "returnFullCylinder") &&
                                            (stationValue == "All" ||
                                              statisticValue == "All" ||
                                              (stationValue ==
                                                "exportEmptyCylinder" ||
                                              statisticValue == "exportCylinder"
                                                ? customerValue == "All" ||
                                                  customerValue == "Station"
                                                : false))
                                              ? widthScreen / 8
                                              : widthScreen / 7,
                                        },
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.elementText,
                                          { fontWeight: "bold" },
                                        ]}
                                      >
                                        {formatNumber(
                                          dataTotalY[item.name][statistic]
                                        )}
                                      </Text>
                                    </View>

                                    {(statistic == "exportCylinder" ||
                                      statistic === "returnFullCylinder") &&
                                    (stationValue == "All" ||
                                      statisticValue == "All" ||
                                      (stationValue == "exportEmptyCylinder" ||
                                      statisticValue == "exportCylinder"
                                        ? customerValue == "All" ||
                                          customerValue == "Station"
                                        : false)) ? (
                                      <View
                                        style={[
                                          styles.elementStyle,
                                          { width: widthScreen / 8 },
                                        ]}
                                      >
                                        <Text
                                          style={[
                                            styles.elementText,
                                            { fontWeight: "bold" },
                                          ]}
                                        >
                                          {formatNumber(
                                            dataTotalY[item.name][
                                              statistic + "kg"
                                            ]
                                          )}
                                        </Text>
                                      </View>
                                    ) : null}
                                  </View>
                                );
                              }}
                            />

                            {branchValue != "All" &&
                            listBranchs.find(
                              (item) => item.value == branchValue
                            )?.userType != "Fixer" &&
                            stationValue != "All" &&
                            (statisticValue == "exportEmptyCylinder" ||
                              statisticValue == "returnFullCylinder" ||
                              statisticValue ==
                                "exportCylinder") ? null : renderTotalX(
                                branchValue,
                                statisticValue,
                                listBranchs
                              ) ? (
                              <View style={styles.rowStyle}>
                                <View
                                  style={[
                                    styles.elementStyle,
                                    {
                                      width:
                                        statistic == "exportCylinder" ||
                                        statistic === "returnFullCylinder"
                                          ? widthScreen / 8
                                          : widthScreen / 7,
                                    },
                                  ]}
                                >
                                  <Text style={styles.elementText}>
                                    {translate("TOTAL")}
                                  </Text>
                                </View>

                                {branchValue != "All" &&
                                stationValue != "All" &&
                                listBranchs.find(
                                  (item) => item.value == branchValue
                                )?.userType != "Fixer" &&
                                customerValue != "All" &&
                                statisticValue == "exportEmptyCylinder"
                                  ? null
                                  : cylinderTypes.map((value) => {
                                      return (
                                        <View
                                          style={[
                                            styles.elementStyle,
                                            {
                                              width:
                                                statistic == "exportCylinder" ||
                                                statistic ===
                                                  "returnFullCylinder"
                                                  ? widthScreen / 8
                                                  : widthScreen / 7,
                                            },
                                          ]}
                                        >
                                          <Text style={styles.elementText}>
                                            {formatNumber(
                                              dataTotalX[statistic][value]
                                            )}
                                          </Text>
                                        </View>
                                      );
                                    })}

                                <View
                                  style={[
                                    styles.elementStyle,
                                    {
                                      width:
                                        statistic == "exportCylinder" ||
                                        statistic === "returnFullCylinder"
                                          ? widthScreen / 8
                                          : widthScreen / 7,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.elementText,
                                      { fontWeight: "bold" },
                                    ]}
                                  >
                                    {formatNumber(
                                      dataTotalX[statistic]["Total"]
                                    )}
                                  </Text>
                                </View>

                                {statistic === "exportCylinder" ||
                                statistic === "returnFullCylinder" ? (
                                  <View
                                    style={[
                                      styles.elementStyle,
                                      { width: widthScreen / 8 },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.elementText,
                                        { fontWeight: "bold" },
                                      ]}
                                    >
                                      {formatNumber(
                                        dataTotalX[statistic]["TotalKg"]
                                      )}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                            ) : null}
                          </View>
                        </View>
                      );
                    })
                  )
                ) : displayDataStation.length > 0 ? (
                  dataColumnStation.map((statistic) => {
                    return (
                      <View style={styles.tableStationStyle}>
                        <TouchableOpacity
                          onPress={() => {
                            if (selectedStatistics.includes(statistic)) {
                              let listTmp = selectedStatistics.filter(
                                (value) => {
                                  return value != statistic;
                                }
                              );
                              setSelectedStatistics(listTmp);
                            } else {
                              setSelectedStatistics([
                                ...selectedStatistics,
                                statistic,
                              ]);
                            }
                          }}
                          style={[
                            styles.articleStationStyle,
                            {
                              backgroundColor: selectedStatistics.includes(
                                statistic
                              )
                                ? "#cbe8ba"
                                : "#fff1d7",
                            },
                          ]}
                        >
                          <Text style={{ fontWeight: "bold", color: "#000" }}>
                            {translateStatisticStation(statistic)}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={[
                                styles.elementText,
                                { fontWeight: "bold", paddingHorizontal: 10 },
                              ]}
                            >
                              {formatNumber(
                                dataTotalY[displayDataStation[0].name][
                                  statistic
                                ]
                              )}
                            </Text>
                            <Icon
                              name={
                                selectedStatistics.includes(statistic)
                                  ? "up"
                                  : "down"
                              }
                              size={17}
                              color={"#000"}
                            />
                          </View>
                        </TouchableOpacity>

                        {selectedStatistics.includes(statistic) ? (
                          <>
                            <FlatList
                              data={displayDataStation}
                              keyExtractor={(item) => item.id}
                              renderItem={({ item }) => {
                                return (
                                  <View>
                                    {item.detail.map((value) => {
                                      return (
                                        <View
                                          style={styles.elementStationStyle}
                                        >
                                          <Text style={styles.elementText}>
                                            {value.name}
                                          </Text>
                                          <Text style={styles.elementText}>
                                            {formatNumber(
                                              value.statistic[statistic]
                                            )}
                                          </Text>
                                        </View>
                                      );
                                    })}
                                  </View>
                                );
                              }}
                            />
                            {statistic === "exportCylinder" ||
                            statistic === "returnFullCylinder" ? (
                              <View style={styles.elementStationStyle}>
                                <Text
                                  style={[
                                    styles.elementText,
                                    { fontWeight: "bold" },
                                  ]}
                                >
                                  {translate("TOTAL_WEIGHT")}
                                </Text>
                                <Text
                                  style={[
                                    styles.elementText,
                                    { fontWeight: "bold" },
                                  ]}
                                >
                                  {formatNumber(
                                    dataTotalY[displayDataStation[0].name][
                                      statistic + "kg"
                                    ]
                                  )}
                                </Text>
                              </View>
                            ) : null}
                          </>
                        ) : null}
                      </View>
                    );
                  })
                ) : displayDataFixer ? (
                  <View>
                    <View style={styles.fixerTabsSection}>
                      {table.map((tab) => {
                        return (
                          <TouchableOpacity
                            style={[
                              styles.fixerTabStyle,
                              {
                                borderBottomWidth:
                                  tab.id === selectedTab ? 2 : 0,
                              },
                            ]}
                            onPress={() => {
                              handleDisplayData(tab.type);
                              setSelectedTab(tab.id);
                            }}
                          >
                            <Text style={styles.elementText}>{tab.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {dataColumnFixer.map((statistic) => {
                      return (
                        <View style={styles.tableStyle}>
                          <View
                            style={[
                              styles.elementStyle,
                              {
                                backgroundColor: "#009347",
                                width: widthScreen,
                                height: 40,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.elementText,
                                { color: "#fff", fontWeight: "bold" },
                              ]}
                            >
                              {translateStatisticStation(statistic)}
                            </Text>
                          </View>
                          <View style={styles.rowStyle}>
                            <View
                              style={[
                                styles.elementStyle,
                                {
                                  backgroundColor: "#009347",
                                  width: widthScreen / 3,
                                  height: 40,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { color: "#fff", fontWeight: "bold" },
                                ]}
                              >
                                {translate("CYLINDERS_TYPE")}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.elementStyle,
                                {
                                  backgroundColor: "#009347",
                                  width: widthScreen / 3,
                                  height: 40,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { color: "#fff", fontWeight: "bold" },
                                ]}
                              >
                                {translate("BRAND")}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.elementStyle,
                                {
                                  backgroundColor: "#009347",
                                  width: widthScreen / 3,
                                  height: 40,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { color: "#fff", fontWeight: "bold" },
                                ]}
                              >
                                {translate("TOTAL")}
                              </Text>
                            </View>
                          </View>

                          <View>
                            {cylinderTypes.map((type) => {
                              return (
                                <View style={styles.rowStyle}>
                                  <View
                                    style={[
                                      styles.elementStyle,
                                      {
                                        width: widthScreen / 3,
                                        height:
                                          displayDataFixer[statistic][type]
                                            .length * 25,
                                      },
                                    ]}
                                  >
                                    <Text style={styles.elementText}>
                                      {type}
                                    </Text>
                                  </View>
                                  <View style={{ flexDirection: "column" }}>
                                    {displayDataFixer[statistic][type].map(
                                      (value) => {
                                        return (
                                          <View
                                            style={[
                                              styles.elementStyle,
                                              {
                                                width: widthScreen / 3,
                                                height: 25,
                                              },
                                            ]}
                                          >
                                            <Text
                                              style={[
                                                styles.elementText,
                                                { fontSize: 13 },
                                              ]}
                                            >
                                              {value["manufactureName"]}
                                            </Text>
                                          </View>
                                        );
                                      }
                                    )}
                                  </View>
                                  <View style={{ flexDirection: "column" }}>
                                    {displayDataFixer[statistic][type].map(
                                      (value) => {
                                        return (
                                          <View
                                            style={[
                                              styles.elementStyle,
                                              {
                                                width: widthScreen / 3,
                                                height: 25,
                                              },
                                            ]}
                                          >
                                            <Text style={styles.elementText}>
                                              {formatNumber(value[statistic])}
                                            </Text>
                                          </View>
                                        );
                                      }
                                    )}
                                  </View>
                                </View>
                              );
                            })}
                          </View>

                          <View style={styles.rowStyle}>
                            <View
                              style={[
                                styles.elementStyle,
                                {
                                  paddingHorizontal: 10,
                                  width: (widthScreen * 2) / 3,
                                  height: 40,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { fontWeight: "bold" },
                                ]}
                              >
                                {translate("TOTAL")}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.elementStyle,
                                {
                                  width: (widthScreen * 1) / 3,
                                  height: 40,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.elementText,
                                  { fontWeight: "bold" },
                                ]}
                              >
                                {formatNumber(dataTotalFixer[statistic])}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      height: 50,
                      justifyContent: "center",
                    }}
                  >
                    <Text>{translate("NULL_DATA")}</Text>
                  </View>
                )
                // (
                //   <View style={styles.StatisticSection}>
                //     <Text>{translate("NO_RESULT")}</Text>
                //   </View>
                // )
              }
            </View>
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator
          style={{ height: 100 }}
          size="large"
          color={"#009347"}
        />
      )}
    </>
  );
}
