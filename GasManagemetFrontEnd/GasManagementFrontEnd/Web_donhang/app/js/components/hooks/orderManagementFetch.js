import { useEffect, useRef, useState } from "react";
import orderManagement from "../../../api/orderManagementApi";
import moment from "moment";
import getAreaByStationId from "../../../api/getAreaByStationId";
import getUserCookies from "../../helpers/getUserCookies";
export const orderManagementFetch = () => {
  const [loading, setLoading] = useState(false);
  const [countOrderStatus, setCountOrderStatus] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderSortList, setOrderSortList] = useState([]);
  const [dateStart, setDateStart] = useState(moment().startOf("day"));
  const [dateEnd, setDateEnd] = useState(moment().endOf("day"));
  const [orderCode, setOrderCode] = useState("");
  const [isClickSearch, setIsClickSearch] = useState(false);
  const isSearchRef = useRef(false);
  const [orderType, setOrderType] = useState("khong");
  const [unseenCount, setUnseenCount] = useState(0);
  const [lastParams, setLastParams] = useState({});
  const [unseendList, setUnseenList] = useState({});
  const [optionDate, setOptionDate] = useState("1");
  const [areaByStation, setAreaByStation] = useState([]);
  const [customer, setCustomer] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [typeCustomer, setTypeCustomer] = useState("");
  const [objectId, setObjectId] = useState("");
  const [choseArea, setChoseArea] = useState("");
  const [customerTypeList, setCustomerTypeList] = useState([]);
  const [userRole, setUserRole] = useState();
  const [userType, setUserType] = useState();
  //render value
  //#region function
  useEffect(() => {
    const getOrderList = async () => {
      setLoading(true);
      const params = {
        // orderCode: orderCode,
        From:
          (dateStart && dateStart._d.toISOString()) ||
          moment()
            .startOf("day")
            .toISOString(),
        To:
          (dateEnd && dateEnd._d.toISOString()) ||
          moment()
            .startOf("day")
            .toISOString(),
      };

      if (orderCode && orderCode !== "") params = { ...params, orderCode };
      
      const res = await orderManagement.search(params);
      if (res && res.data) {
        setOrderList(res.data);
        setOrderSortList(res.data);
        setCountOrderStatus(res.data);
      }
      setLastParams(params);
      setLoading(false);
    };
    const get_UserCookies = async () => {
      const user_cookies = await getUserCookies();
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
      if (user_cookies.user.userType === "Factory") {
        setCustomerId(user_cookies.user.id);
      } else if (user_cookies.user.userType === "Tram") {
        setCustomerId(user_cookies.user.isChildOf);
      }
      if (
        user_cookies.user.userType === "Tram" ||
        user_cookies.user.userType === "Factory"
      ) {
        let areaList = [];
        areaList = await getAreaByStationId(user_cookies.user.isChildOf);
        setAreaByStation(areaList.data.data);
        setObjectId(user_cookies.user.isChildOf);
      }
    };
    get_UserCookies();
    getOrderList();
  }, []);

  const searchOrder = async () => {
    setLoading(true);
    if (
      (orderCode === "" && dateStart === undefined && dateEnd === undefined) ||
      (orderCode === "" && (dateStart === undefined || dateEnd === undefined))
    ) {
      setLoading(false);
      return;
    }
    const params = {
      // orderCode: orderCode,
      ...lastParams,
      From:
        (dateStart && dateStart._d.toISOString()) ||
        moment()
          .startOf("day")
          .toISOString(),
      To:
        (dateEnd && dateEnd._d.toISOString()) ||
        moment()
          .startOf("day")
          .toISOString(),
    };

    if (orderCode && orderCode !== "") params = { ...params, orderCode };
    
    const res = await orderManagement.search(params);
    if (res && res.data) {
      setOrderList(res.data);
      setOrderSortList(res.data);
      setCountOrderStatus(res.data);
    } else {
      setOrderList([]);
      setOrderSortList([]);
      setCountOrderStatus([]);
    }
    setLastParams(params);
    setLoading(false);
  };

  const handleTodayTimeChange = (e) => {
    switch (e.target.value) {
      case "1":
        setDateStart(moment().startOf("day"));
        setDateEnd(moment().endOf("day"));
        break;
      case "2":
        setDateStart(moment().startOf("week"));
        setDateEnd(moment().endOf("week"));
        break;
      case "3":
        setDateStart(moment().startOf("month"));
        setDateEnd(moment().endOf("month"));
        break;
      case "4":
        setDateStart(
          moment()
            .startOf("month")
            .add(-1, "months")
        );
        setDateEnd(
          moment()
            .add(-1, "months")
            .endOf("month")
        );
        break;
      case "5":
        setDateStart("");
        setDateEnd("");
    }
    setOptionDate(e.target.value)
  };
  const handleChangeStation = async (e) => {
    let areaList;
    setObjectId(e.target.value);
    areaList = await getAreaByStationId(e.target.value);
    setAreaByStation(areaList.data.data);
  };
  const handleChangeCustomerType = async (e) => {
    console.log(userType, "sđấkdnqựdkn");
    setTypeCustomer(e.target.value);
    if (
      userType === "Tram" ||
      userType === "Factory" ||
      userType === "Tong_cong_ty"
    ) {
      let params = {
        customerType: e.target.value,
        isChildOf: customerId,
      };

      const res = await orderManagement.getTypeCustomer(params);
      if (res && res.data) {
        setCustomerTypeList(res.data);
      }
    }
  };
  const handleChangeArea = (e) => {
    console.log(e.target.value);
    setChoseArea(e.target.value);
  };
  const handleChangeCustomer = (e) => {
    console.log("adnad", e.currentTarget.value);
    setCustomer(e.target.value);
  };
  const handleChangeStartDay = (e) => {
    setDateStart(e);
    setOptionDate("5");
  };
  const handleChangeEndDay = (e) => {
    setDateEnd(e);
    setOptionDate("5");
  };
  const handleFilterClick = async () => {
    let params = {};
    setLoading(true);

    if (dateStart && dateEnd) {

      params = { ...params, From: dateStart.toISOString() };
      params = { ...params, To: dateEnd.toISOString() };

      if (objectId !== "") params = { ...params, station: objectId };
      if (customerId !== "") params = { ...params, station: customerId };
      if (choseArea !== "") params = { ...params, area: choseArea };
      if (customer !== "") params = { ...params, objectId: customer };
      setLastParams(params);

      try {
        const res = await orderManagement.search(params);
        if (res) {
          if (res.data && res.data.length > 0) {
            setOrderList(res.data);
            setOrderSortList(res.data);
            setCountOrderStatus(res.data);
          } else {
            setOrderList([]);
            setOrderSortList([]);
            setCountOrderStatus([]);
          }
        }
      } catch (e) {
        console.log("error", e);
      }
    } else {
      console.log("warning", "Vui lòng chọn ngày");
    }
    setLoading(false);
  };
  const handleResetFilter = () => {
    setOptionDate("1");
    setDateStart(moment().startOf("day"));
    setDateEnd(moment().endOf("day"));
    setTypeCustomer("");
    setChoseArea("");
    setCustomer("");
    setCustomerTypeList([]);
    if (userRole === "Truong_tram" && userType === "Tram") {
      setObjectId(objectId);
    } else {
      setObjectId("");
    }
  };
  const loadUnseen = async () => {
    const res = await orderManagement.getUnseen(lastParams);
    let newList = {};

    if (res && res.success) {
      setUnseenCount(res.data);
      if (res.unseenOrder) {
        const list = res.unseenOrder;
        list.forEach((e) => {
          newList[e._id] = 1;
        });
      }
    }
    setUnseenList(newList);
    // console.log(unseendList.current);
  };
  // search
  useEffect(() => {
    if (!isSearchRef.current) {
      isSearchRef.current = true;
      return;
    }
    searchOrder();
  }, [isClickSearch]);
  useEffect(() => {
    const divUnseen = document.getElementById("value-unseen");
    if (divUnseen === null) {
      console.log("nulll");
    } else {
      divUnseen.textContent = unseenCount;
    }
  }, [unseenCount]);
  useEffect(() => {
    loadUnseen();
  }, [lastParams]);
  //#endregion
  return {
    orderType,
    orderList,
    orderSortList,
    orderCode,
    dateStart,
    dateEnd,
    isClickSearch,
    countOrderStatus,
    loading,
    lastParams,
    unseendList,
    areaByStation,
    customer,
    customerId,
    typeCustomer,
    objectId,
    choseArea,
    optionDate,
    customerTypeList,
    userRole,
    userType,
    setUserRole,
    setUserType,
    setCustomerId,
    setAreaByStation,
    setCustomer,
    setTypeCustomer,
    setObjectId,
    setChoseArea,
    setCustomerTypeList,
    setOptionDate,
    setOrderCode,
    setDateStart,
    setDateEnd,
    setOrderType,
    setIsClickSearch,
    setOrderList,
    setOrderSortList,
    setCountOrderStatus,
    setLoading,
    setUnseenCount,
    setLastParams,
    setUnseenList,
    loadUnseen,

    handleChangeCustomerType,
    handleChangeArea,
    handleChangeCustomer,
    handleChangeStartDay,
    handleChangeEndDay,
    handleTodayTimeChange,
    handleChangeStation,
    handleResetFilter,
    handleFilterClick,
  };
};
