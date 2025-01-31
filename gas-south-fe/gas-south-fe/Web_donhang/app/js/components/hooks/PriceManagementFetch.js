import moment from "moment";
import { useEffect, useRef, useState } from "react";
import priceManagement from "../../../api/PriceManagerAPI";
import getUserCookies from "../../../js/helpers/getUserCookies";
import ToastMessage from "../../helpers/ToastMessage";

export const priceManagementFetch = () => {
  const [manufacture, setManufacture] = useState([]);
  const [station, setStation] = useState([]);
  const [nameCustomer, setNameCustomer] = useState([]);
  const [categoryCylinder, setCategoryCylinder] = useState([]);
  const [listPrice, setListPrice] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [userID, setUserID] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemCheck, setItemCheck] = useState([]);
  const [itemCheckFilter, setItemCheckFilter] = useState([]);
  //render value

  const getListPrice = async () => {
    setLoading(true);
    const res = await priceManagement.getAllPrice();
    setLoading(false);
    if (res && res.data) {
      setListPrice(res.data);
      setFilterData(res.data);
    }
  };
  const getUserInfor = async () => {
    let user_cookies = await getUserCookies();
    if (user_cookies && user_cookies.user) {
      setUserID(user_cookies.user.id);
    } else {
      setUserID("");
    }
  };
  const getMenuFacture = async () => {
    const res = await priceManagement.getManufacture();
    if (res && res.data) {
      setManufacture(res.data);
    }
  };
  const getStation = async () => {
    const res = await priceManagement.getStation();
    if (res && res.data) {
      setStation(res.data);
    } else {
      setStation([]);
    }
  };
  const getCategoryCylinder = async () => {
    const res = await priceManagement.getCategoryCylinder();
    if (res && res.data) {
      setCategoryCylinder(res.data);
    } else {
      setCategoryCylinder([]);
    }
  };
  const checkTimeCreate = (time, items) => {
    let res = true;
    console.log(time);
    if (time === null || typeof time === "undefined" || time === "")
      return true;
    items.forEach((item) => {
      let valueSort = itemCheckFilter.filter(
        (i) =>
          i.TenTram === item.nameStation && item.idCustomer === i.idKhachHang
      );

      if (valueSort.length === 0) return true;

      valueSort = valueSort.map((i) => ({
        ...i,
        NgayBatDau: moment(
          i.NgayBatDau,
          i.NgayBatDau.length <= 10 ? "YYYY-MM-DD" : undefined
        ).startOf("day"),
        NgayKetThuc: moment(
          i.NgayKetThuc,
          i.NgayKetThuc.length <= 10 ? "YYYY-MM-DD" : undefined
        ).endOf("day"),
      }));

      valueSort.every((e) => {
        if (time.isBetween(e.NgayBatDau, e.NgayKetThuc, undefined, "[]")) {
          ToastMessage(
            "error",
            `Giá của ${
              e.TenKhachHang
            } đã tồn tại trong khoảng thời gian ${e.NgayBatDau.format(
              "DD/MM/YYYY"
            )} - ${e.NgayKetThuc.format("DD/MM/YYYY")}`
          );
          res = false;
          return false;
        }
        return true;
      });
    });
    return res;
  };
  const checkTimeUpdate = (time, item) => {
    let res = true;
    console.log(time.toISOString());
    if (time === null || typeof time === "undefined" || time === "")
      return true;
    let valueSort = itemCheck.filter(
      (i) => i.typePriceId !== item.typePriceId
    );

    if (valueSort.length === 0) return true;

    valueSort = valueSort.map((i) => ({
      ...i,
      NgayBatDau: moment(
        i.NgayBatDau,
        i.NgayBatDau.length <= 10 ? "YYYY-MM-DD" : undefined
      ).startOf("day"),
      NgayKetThuc: moment(
        i.NgayKetThuc,
        i.NgayKetThuc.length <= 10 ? "YYYY-MM-DD" : undefined
      ).endOf("day"),
    }));
    
    valueSort.every((e) => {
      if (time.isBetween(e.NgayBatDau, e.NgayKetThuc, undefined, "[]")) {
        ToastMessage(
          "error",
          `Giá của ${
            e.TenKhachHang
          } đã tồn tại trong khoảng thời gian ${e.NgayBatDau.format(
            "DD/MM/YYYY"
          )} - ${e.NgayKetThuc.format("DD/MM/YYYY")}`
        );
        res = false;
        return false;
      }
      return true;
    });
    return res;
  };
  const addItemCheck = (item, type, idThuongHieu) => {
    const value = listPrice.filter(
      (i) =>
        i.TenTram === item.nameStation &&
        item.idCustomer === i.idKhachHang &&
        (type ? i.LoaiGia === type : true) &&
        (idThuongHieu ? i.idThuongHieu === idThuongHieu : true)
    );

    if (value.length > 0) setItemCheck((prev) => [...prev, ...value]);
  };
  const sortItemCheck = (idThuongHieu) => {
    const value = itemCheck.filter(
      (i) => i.idThuongHieu === idThuongHieu && i.TenLoaiBinh.includes("12")
    );
    setItemCheckFilter(value);
  };
  const removeItemCheck = (item) => {
    setItemCheck((prev) =>
      prev.filter(
        (i) =>
          i.TenTram !== item.nameStation || item.idCustomer !== i.idKhachHang
      )
    );
  };
  const resetItemCheck = () => {
    setItemCheck([]);
    setItemCheckFilter([]);
  };
  useEffect(() => {
    try {
      getListPrice();
      getCategoryCylinder();
      getMenuFacture();
      getStation();
      getUserInfor();
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    if (isRefresh) {
      getListPrice();
      setIsRefresh(false);
    }
  }, [isRefresh]);
  return {
    manufacture,
    station,
    nameCustomer,
    categoryCylinder,
    userID,
    listPrice,
    filterData,
    isRefresh,
    setListPrice,
    setIsRefresh,
    loading,
    itemCheck,
    checkTimeCreate,
    addItemCheck,
    removeItemCheck,
    sortItemCheck,
    itemCheckFilter,
    resetItemCheck,
    checkTimeUpdate,
  };
};
