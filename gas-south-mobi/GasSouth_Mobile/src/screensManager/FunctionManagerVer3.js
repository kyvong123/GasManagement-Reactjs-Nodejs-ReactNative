import React from "react";
import memoize from "lodash.memoize";
import i18n from "i18n-js";
import { cylinderTypes } from "./StatisticManagerVer3";
import { object } from "prop-types";

const formatNumber = (
  amount,
  decimalCount = 0,
  decimal = "",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const translateStatistic = (statistic) => {
  switch (statistic) {
    case "createdCylinder":
      const trsCre = translate("CREATED");
      return trsCre;
    case "exportEmptyCylinder":
      const trsEec = translate("EXPORT_EMPTY_CYLINDER");
      return trsEec;
    case "importEmptyCylinder":
      const trsIc = translate("IMPORT_THE_SHELL");
      return trsIc;
    case "exportCylinder":
      const trsEc = translate("EXPORT_CYLINDER2");
      return trsEc;
    case "returnFullCylinder":
      const trsRfc = translate("RETRACE_FULL_BOTTLE");
      return trsRfc;
    case "NEW":
      return translate("NEW");
    case "OLD":
      return translate("OLD");
    case "inventoryCylinder":
      return translate("IN_STOCK");
    case "exportEmptyCylinder":
      return translate("EXPORT_EMPTY_CYLINDER");
    case "declaration":
      return translate("CREATED");
  }
};

const handleStationExportEmptyCylinder = (data, statistic) => {
  const listStation = [];
  data.map((child) => {
    child.detail.map((detail) => {
      if (
        detail?.statistic[statistic] &&
        detail?.statistic[statistic].length > 0
      ) {
        const names = detail?.statistic[statistic];
        names.map((name) => {
          listStation.push({ label: name, value: "" });
        });
      }
    });
  });
  return listStation;
};

const translateBranchName = (
  value,
  listBranchs,
  stationValue,
  exportStations,
  exportCustomer,
  statisticValue,
  fromValue
) => {
  const branch = listBranchs && listBranchs.find((item) => item.value == value);
  let station =
    exportStations && exportStations.find((item) => item.value == stationValue);

  if (branch.userType == "Region" && stationValue != "All") {
    if (statisticValue == "returnFullCylinder" && fromValue != "All")
      return `Về: ${station?.label}`;
    return station?.label;
  } else if (
    branch &&
    (branch.userType == "Fixer" || branch.userType == "Region") &&
    branch.userRole == "SuperAdmin"
  ) {
    return branch?.label;
  } else {
    return translate("BRANCH");
  }
};

const handleStatisticNameY = (
  value,
  item,
  listBranchs,
  statisticValue,
  stationValue,
  exportStations,
  stationValueSmall
) => {
  const branch = listBranchs && listBranchs.find((item) => item.value == value);
  if (branch && branch.userType == "Fixer" && branch.userRole == "SuperAdmin") {
    return translateBinhKhi(item?.name);
  } else if (
    branch &&
    branch.userType == "Region" &&
    stationValue != "All" &&
    statisticValue == "exportEmptyCylinder"
  ) {
    return `Đến: ${
      exportStations.find((item) => item.value == stationValueSmall)?.label
        ? exportStations.find((item) => item.value == stationValueSmall)?.label
        : item?.name
    }`;
  } else {
    return item?.name;
  }
};

const translateBinhKhi = (name) => {
  switch (name) {
    case "Declaration":
      return translate("CREATED");
    case "Export":
      return translate("EXPORT_EMPTY_CYLINDER");
    case "Inventory":
      return translate("IN_STOCK");
    case "NEW":
      return translate("NEW");
    case "OLD":
      return translate("OLD");
    case "exportEmptyCylinder":
      return translate("EXPORT_EMPTY_CYLINDER");
    case "declaration":
      return translate("CREATED");
  }
};

const renderTotalX = (branchValue, statisticOption, listBranchs) => {
  const branch =
    listBranchs &&
    listBranchs.find((item) => item.value == branchValue)?.userType;
  if (branch === "Fixer" && statisticOption === "All") {
    return false;
  } else {
    return true;
  }
};

const handleDataAllStations = (data) => {
  if (data) {
    const listStations = [];
    data.map((child) => {
      const _child = { label: child.name, value: child.id };
      listStations.push(_child);
    });
    return listStations;
  } else {
    return null;
  }
};

const getDetailStatisticBinhKhi = (
  data, // danh sách tổng
  statistic, // kiểu thống kê
  stationValue // đối tượng được chọn
) => {
  let listResponse = [];
  let newStatistic = "";
  if (statistic == "exportEmptyCylinder") {
    newStatistic = "Export";
  }
  let statisticDetail = [];
  let i = 0;
  let check = 0;
  if (data) {
    const exports = new Set(data[newStatistic]?.map((item) => item.code));

    cylinderTypes.map((type) => {
      const child = data[newStatistic]
        ?.find((item) => item.code.includes(type))
        ?.exportEmptyCylinderObject.filter((item) => {
          return item?.object?.to == stationValue;
        });
      if (exports.has(type) && child) {
        const stt = child.reduce(
          (previousValue, current) =>
            previousValue + current.newQuantity ? current.object.quantity : 0,
          0
        );
        stt > 0 && check++;
        const item = {
          code: type,
          statistic: {
            [statistic]: stt,
          },
        };
        statisticDetail.push(item);
      } else {
        const item = {
          code: type,
          statistic: { [statistic]: 0 },
        };
        statisticDetail.push(item);
      }
    });
    listResponse.push({ name: "NEW", id: i, detail: statisticDetail });
    statisticDetail = [];

    cylinderTypes.map((type) => {
      const child = data[newStatistic]
        ?.find((item) => item.code.includes(type))
        ?.exportEmptyCylinderObject.filter((item) => {
          return item?.object?.to == stationValue;
        });
      if (exports.has(type) && child) {
        const stt = child.reduce((previousValue, current) => {
          return previousValue + current.oldQuantity
            ? current.object.quantity
            : 0;
        }, 0);
        stt > 0 && check++;
        const item = {
          code: type,
          statistic: {
            [statistic]: stt,
          },
        };
        statisticDetail.push(item);
      } else {
        const item = {
          code: type,
          statistic: { [statistic]: 0 },
        };
        statisticDetail.push(item);
      }
    });
    listResponse.push({ name: "OLD", id: i, detail: statisticDetail });

    return check > 0 ? listResponse : [];
  } else {
    return listResponse;
  }
};

const collectObjects = (arr) => {
  let result = [];

  function recurse(subArray) {
    if (Array.isArray(subArray)) {
      for (let element of subArray) {
        if (Array.isArray(element)) {
          recurse(element);
        } else if (typeof element === "object" && element !== null) {
          result.push(element);
        }
      }
    }
  }

  recurse(arr);
  return result;
};

const getDetailStatisticAll = (
  data, // danh sách tổng
  statistic, // kiểu thống kê
  stationValue // đối tượng được chọn
) => {
  const response = [];
  let check = 0;
  if (data) {
    let newStatistic = "";
    if (statistic == "exportEmptyCylinder") {
      newStatistic = "exportEmptyCylinderObject";
    } else if (statistic == "importEmptyCylinder") {
      newStatistic = "importEmptyCylinderObject";
    } else if (statistic == "exportCylinder") {
      newStatistic = "exportCylinderObject";
    }
    data?.map((child, index) => {
      const properties = new Set(child.detail?.map((item) => item.code));
      let listStatistic = [];
      cylinderTypes.map((type) => {
        let finder = child.detail.find((item) => item.code.includes(type))
          ?.statistic[newStatistic];

        finder = collectObjects(finder);

        let name = "";
        if (type == "B6") name = "Bình 6kg";
        else if (type == "B12") name = "Bình 12kg";
        else if (type == "B20") name = "Bình 20kg";
        else if (type == "2303B45") name = "Bình 45kg";
        else name = "Bình 100kg";
        if (properties.has(type) && finder?.length > 0) {
          // finder =
          //   finder?.find((item) => item.length > 0) == undefined
          //     ? []
          //     : finder?.find((item) => item.length > 0);
          const stt = finder.filter((item) => {
            return statistic == "importEmptyCylinder"
              ? item.from == stationValue
              : item.to == stationValue;
          });
          const sum = stt.reduce(
            (previous, current) => previous + current?.quantity,
            0
          );
          const itemStatistic = {
            code: type,
            name: name,
            statistic: { [statistic]: sum },
          };
          listStatistic.push(itemStatistic);
        } else {
          const itemStatistic = {
            code: type,
            name: name,
            statistic: { [statistic]: 0 },
          };
          listStatistic.push(itemStatistic);
        }
      });
      response.push({ id: index, name: child.name, detail: listStatistic });
      listStatistic = [];
    });
    response.map((child) => {
      child.detail.map((detail) => {
        if (detail.statistic[statistic] > 0) {
          check++;
        }
      });
    });

    return check > 0 ? response : [];
  } else {
    return [];
  }
};

const handleResponseAllDataRegion = (data, listStation, dataColumn) => {
  if (data) {
    let newData = data;
    newData[0].detail.map((item) => {
      const id = listStation.find(
        (station) => item.stationName == station.label
      );
      item.name = item.stationName;
      item.id = id.value;
    });
    return newData[0].detail;
  } else {
    return [];
  }
};

const getDetailStatisticRedion = (
  data, // danh sách tổng
  statistic, // kiểu thống kê
  stationValue // đối tượng được chọn
) => {
  const response = [];
  let check = 0;
  if (data) {
    let newStatistic = "";
    if (statistic == "exportEmptyCylinder") {
      newStatistic = "exportEmptyCylinderObject";
    } else if (statistic == "importEmptyCylinder") {
      newStatistic = "importEmptyCylinderObject";
    } else if (statistic == "exportCylinder") {
      newStatistic = "exportCylinderObject";
    } else {
      newStatistic = "returnFullCylinderObject";
    }
    data?.map((child, index) => {
      const properties = new Set(child.detail?.map((item) => item.code));
      let listStatistic = [];
      cylinderTypes.map((type) => {
        let name = "";
        if (type == "B6") name = "Bình 6kg";
        else if (type == "B12") name = "Bình 12kg";
        else if (type == "B20") name = "Bình 20kg";
        else if (type == "2303B45") name = "Bình 45kg";
        else name = "Bình 100kg";
        let finder = child.detail.find((item) => item.code.includes(type))
          ?.statistic[newStatistic];
        if (properties.has(type) && finder) {
          finder = finder?.filter((item) =>
            statistic == "importEmptyCylinder" ||
            statistic == "returnFullCylinder"
              ? item.from == stationValue
              : item.to == stationValue
          );
          const stt = finder.reduce(
            (previousValue, current) => previousValue + current.quantity,
            0
          );
          const itemStatistic = {
            code: type,
            name: name,
            statistic: { [statistic]: stt },
          };
          listStatistic.push(itemStatistic);
        } else {
          const itemStatistic = {
            code: type,
            name: name,
            statistic: { [statistic]: 0 },
          };
          listStatistic.push(itemStatistic);
        }
      });
      response.push({ id: index, name: child.name, detail: listStatistic });
      listStatistic = [];
    });
    response.map((child) => {
      child.detail.map((detail) => {
        if (detail.statistic[statistic] > 0) {
          check++;
        }
      });
    });

    return check > 0 ? response : [];
  } else {
    return [];
  }
};

const sumArray = (array) => {
  return array.reduce((previous, current) => previous + current, 0);
};

const handleDataRegionDetailAll = (data, cylinderTypes) => {
  const newData = [];
  const createArr = [];
  const exportCylinderAmoutArr = [];
  const exportCylinderWeightArr = [];
  const returnCylinderAmoutArr = [];
  const returnCylinderWeightArr = [];
  const exportEmptyCylinderArr = [];
  const importEmptyCylinderArr = [];
  const properties = new Set(data.detail?.map((item) => item.code));

  cylinderTypes.map((type) => {
    let item = data.detail.find((detail) => detail.code == type);
    let create;
    let exportCylinderAmout;
    let exportCylinderWeight;
    let returnCylinderAmout;
    let returnCylinderWeight;
    let exportEmptyCylinder;
    let importEmptyCylinder;
    if (properties.has(type)) {
      create = item.statistic.createdCylinder || 0;
      exportCylinderAmout = item.statistic.exportCylinder || 0;
      exportCylinderWeight =
        (item.statistic.exportCylinder || 0) *
        parseInt(item.name?.split(" ")[1]);
      returnCylinderAmout = item.statistic.returnFullCylinder || 0;
      returnCylinderWeight =
        (item.statistic.returnFullCylinder || 0) *
        parseInt(item.name?.split(" ")[1]);
      exportEmptyCylinder = item.statistic.exportEmptyCylinder || 0;
      importEmptyCylinder = item.statistic.importEmptyCylinder || 0;
    } else {
      create = 0;
      exportCylinderAmout = 0;
      exportCylinderWeight = 0;
      returnCylinderAmout = 0;
      returnCylinderWeight = 0;
      exportEmptyCylinder = 0;
      importEmptyCylinder = 0;
    }
    createArr.push(create);
    exportCylinderAmoutArr.push(exportCylinderAmout);
    exportCylinderWeightArr.push(exportCylinderWeight);
    returnCylinderAmoutArr.push(returnCylinderAmout);
    returnCylinderWeightArr.push(returnCylinderWeight);
    exportEmptyCylinderArr.push(exportEmptyCylinder);
    importEmptyCylinderArr.push(importEmptyCylinder);
  });
  createArr.push(sumArray(createArr));
  exportCylinderAmoutArr.push(sumArray(exportCylinderAmoutArr));
  exportCylinderWeightArr.push(sumArray(exportCylinderWeightArr));
  returnCylinderAmoutArr.push(sumArray(returnCylinderAmoutArr));
  returnCylinderWeightArr.push(sumArray(returnCylinderWeightArr));
  exportEmptyCylinderArr.push(sumArray(exportEmptyCylinderArr));
  importEmptyCylinderArr.push(sumArray(importEmptyCylinderArr));
  newData.push(
    createArr,
    exportCylinderAmoutArr,
    exportCylinderWeightArr,
    returnCylinderAmoutArr,
    returnCylinderWeightArr,
    exportEmptyCylinderArr,
    importEmptyCylinderArr
  );
  return newData;
};

const handleExportDataStation = (data, exportStations, statisticValue) => {
  const properties = new Set(data.detail.map((item) => item.code));
  let statisticCurrent = "";
  if (statisticValue == "exportEmptyCylinder")
    statisticCurrent = "exportEmptyCylinderObject";
  else if (statisticValue == "returnFullCylinder")
    statisticCurrent = "returnFullCylinderObject";

  const dataResponse = [];
  cylinderTypes.map((type) => {
    if (properties.has(type)) {
      const finder = data.detail.find((item) => item.code == type);
      const curr = finder.statistic[statisticCurrent];
      if (Array.isArray(curr)) {
        curr.map((value) => {
          const item = { id: "", name: "", detail: [] };
          const id =
            statisticValue == "exportEmptyCylinder" ||
            statisticValue == "exportCylinder"
              ? value.to
              : value.from;
          const name = exportStations.find((item) => item.value == id)?.label;
          item.id = id;
          item.name = name;

          const sum = curr.reduce(
            (previous, current) =>
              (statisticValue == "exportEmptyCylinder" ||
              statisticValue == "exportCylinder"
                ? current.to
                : current.from) == id
                ? previous + current?.quantity
                : previous + 0,
            0
          );

          const itemDetail = {
            code: type,
            mass: finder.mass,
            name: finder.name,
            id: finder.id,
            statistic: {
              [statisticValue]: sum,
            },
          };

          item.detail.push(itemDetail);

          const checkIsAvailable = dataResponse.find(
            (value) => value.id == item.id
          );
          if (checkIsAvailable) {
            dataResponse
              .find((value) => value.id == item.id)
              .detail.push(itemDetail);
          } else dataResponse.push(item);
        });
      }
    }
  });
  return dataResponse;
};

const handleReturnDataStation = (data, stationValueSmall) => {
  if (data) {
    const dataResponse = [];
    const detail = [];
    const properties = new Set(data.detail.map((item) => item.code));
    cylinderTypes.map((type) => {
      const finder = data.detail.find((item) => item.code == type);
      const users = finder?.statistic?.returnFullCylinderObject;

      let name = "";
      if (type == "B6") name = "Bình 6kg";
      else if (type == "B12") name = "Bình 12kg";
      else if (type == "B20") name = "Bình 20kg";
      else if (type == "2303B45") name = "Bình 45kg";
      else name = "Bình 100kg";

      if (properties.has(type)) {
        let usersAvailable = [];
        if (users && Array.isArray(users) && users.length > 0) {
          usersAvailable = users.filter(
            (user) => user.from == stationValueSmall
          );
        }

        if (usersAvailable.length > 0 || stationValueSmall == "all") {
          const item = {
            code: type,
            id: finder.id,
            name: finder.name,
            statistic: {
              returnFullCylinder: finder.statistic.returnFullCylinder,
            },
          };
          detail.push(item);
        } else {
          const item = {
            code: type,
            id: finder?.id ? finder.id : Math.random(),
            name: name,
            statistic: {
              returnFullCylinder: 0,
            },
          };
          detail.push(item);
        }
      } else {
        const item = {
          code: type,
          id: finder?.id ? finder.id : Math.random(),
          name: name,
          statistic: {
            returnFullCylinder: 0,
          },
        };
        detail.push(item);
      }
    });
    dataResponse.push({ name: "Số lượng", id: Math.random(), detail: detail });

    const detailWeight = [];
    dataResponse[0].detail.map((item) => {
      const weight =
        parseInt(item.name?.split(" ")[1]) * item.statistic.returnFullCylinder;
      detailWeight.push({
        code: item.code,
        id: item.id,
        name: item.name,
        statistic: { returnFullCylinder: weight },
      });
    });

    dataResponse.push({
      name: "Khối lượng LPG (Kg)",
      id: Math.random(),
      detail: detailWeight,
    });

    return dataResponse;
  }
};

const handleCreateData = (data, listStation) => {
  if (data) {
    data.map((item) => {
      const id =
        listStation &&
        listStation.find((value) => value.label == item.detail[0]?.stationName)
          ?.value;
      item.id = id;
      item.name = item.detail[0]?.stationName;
    });

    return data;
  }
};

const handleImportCylinderData = (data) => {
  if (data) {
    const properties = new Set(data.detail.map((item) => item.code));

    cylinderTypes.map((type) => {
      if (properties.has(type)) {
      } else {
      }
    });
  }
};

const handleExportCylinderData = (data, exportCustomer, stationValueSmall) => {
  if (data) {
    const properties = new Set(data.detail.map((item) => item.code));
    const users = [];
    const dataResponse = [];
    data.detail.map((item) => {
      users.push(...item?.statistic?.exportCylinderObject);
    });

    let seenIds = new Set();
    // danh sách những trạm xuất bình đến
    let uniqueArray = [];
    if (stationValueSmall == "all") {
      uniqueArray = users.filter((item) => {
        if (seenIds.has(item.to)) {
          return false;
        } else {
          seenIds.add(item.to);
          return true;
        }
      });
    } else {
      uniqueArray = users.filter((item) => {
        if (seenIds.has(item.to)) {
          return false;
        } else if (item.to != stationValueSmall) {
          return false;
        } else {
          seenIds.add(item.to);
          return true;
        }
      });
    }

    uniqueArray.map((user) => {
      const name = exportCustomer.find(
        (customer) => customer.value == user.to
      )?.label;
      const item = { id: user.to, name: name, detail: [] };
      cylinderTypes.map((type) => {
        if (properties.has(type)) {
          const itemDetail = data.detail.find((item) => item.code == type);
          item.detail.push(itemDetail);
        } else {
          let name = "";
          if (type == "B6") name = "Bình 6kg";
          else if (type == "B12") name = "Bình 12kg";
          else if (type == "B20") name = "Bình 20kg";
          else if (type == "2303B45") name = "Bình 45kg";
          else name = "Bình 100kg";

          item.detail.push({
            id: Math.random(),
            code: type,
            name: name,
            statistic: { exportCylinder: 0 },
          });
        }
      });
      dataResponse.push(item);
    });

    return dataResponse;
  }
};

export {
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
};
