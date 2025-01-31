import "./ModalFilterShip.scss";
import { createOrderSupplierFetch } from "../../hooks/createOrderSupplierFetch";
import { useState, useEffect } from "react";
import * as FaIcon from "react-icons/fa";
import Item from "antd/lib/list/Item";
import ToastMessage from "../../../helpers/ToastMessage";
import { ToastContainer } from "react-toastify";
import Select from 'react-select'


import getAreaByStationId from "../../../../api/getAreaByStationId";
import orderManagement from "../../../../api/orderManagementApi";
import getAllStatisticSell from "../../../../api/getAllStatisticSell";
function ModalFilterShip({
   hadleClose, 
   startDate, 
   endDate, 
   getData,
   userRole ,
   stationId,
   setStation,
   areaId,
   setAreaId,
   customerTypeId,
   setCustomerTypeId,
   customerId,
   setCustomerId
  }) {
  const { menuFacture, station, area } = createOrderSupplierFetch();
  const [areaList, setAreaList] = useState([]);
  const [listCustomer, setListCustomer] = useState([]);
  const [isStation, setIsStation] = useState("");
  const [isArea, setIsArea] = useState("");

  const [customer, setCustomer] = useState("");
  const [valueType, setValueType] = useState("");
  const [customerType, setCustomerType] = useState([
    { id: "", name: "Chọn" },
    { id: "Industry", name: "Khách hàng công nghiệp bình" },
    { id: "Distribution", name: "Tổng đại lý" },
    { id: "Agency", name: "Đại lý" },
  ]);
  useEffect(() => {
   
      setIsStation(stationId);
      setIsArea("no");
      const getAreaList=async()=>{
        const res = await getAreaByStationId(stationId);
        setAreaList(res.data.data);
      };
      if(userRole!="Dieu_do_tram"){
        getAreaList();
      }
      const getCustomerId=async()=>{

        let params = {
          customerType: customerTypeId,
          isChildOf: stationId,
        };
        const res = await orderManagement.getTypeCustomer(params);
        if (res) {
          setListCustomer(res.data);
          setCustomer(customerId);
        }
      };
      if(customerTypeId!=""&&stationId!=""){
        getCustomerId();
      }
  },[])
  const handleChange = async (e, type) => {
    if (type === "Tram") {
      setIsStation(e.target.value);
      setStation(e.target.value);
      setCustomerId("");
      setCustomer("");
      setListCustomer([]);
      const res = await getAreaByStationId(e.target.value);
      setAreaList(res.data.data);
    } else if (type === "Khuvuc") {
      setIsArea(e.target.value);
      setAreaId(e.target.value)
    } else if (type === "typeKH") {
      setValueType(e.target.value);
      setCustomerTypeId(e.target.value);
      setCustomerId("");
      setCustomer("");
      let params = {
        customerType: e.target.value,
        isChildOf: isStation,
      };
      const res = await orderManagement.getTypeCustomer(params);
      if (res) {
        setListCustomer(res.data);
      }
    } else {
      setCustomer(e.value);
      setCustomerId(e.value);
    }
  };

  const handleAcess = async () => {
    console.log(listCustomer);
    if(isStation !== "" || customer !== "") {
      let res = await getAllStatisticSell(
        startDate,
        endDate,
        listCustomer[0] ? listCustomer[0].userRole : undefined,
        listCustomer[0] ? listCustomer[0].userType : undefined,
        isStation,
        customer
      );
      if (res.data) {
        getData(res.data);
      }
      hadleClose();
    }
    if (valueType !== "" && isStation === "" && customer !== "") {
      let res = await getAllStatisticSell(
        startDate,
        endDate,
        "SuperAdmin",
        valueType
      );
      if (res.data) {
        getData(res.data);
      }
      hadleClose();
    }
  };
  return (
    <div className="wrapper-filter">
      <div className="content-filter">
        <div className="row" style={{ marginLeft: "32px" }}>
            {userRole!="Dieu_do_tram" &&
              <div className="item-filter col-6">
                <label className="title" style={{ marginRight: "90px" }}>
                  Trạm
                </label>
                <select
                  className="select-option"
                  onChange={(e) => handleChange(e, "Tram")}
                >
                  <option value={""}>Chọn</option>
                  {station &&
                    station.map((item, i) => (
                      <option key={i} value={item.id} selected={item.id==stationId}>
                        {item.name}
                      </option>
                    ))}
                </select>
               </div>}
          
          {userRole!="Dieu_do_tram" &&
            <div className="item-filter col-6">
              <label className="title" style={{ marginRight: "90px" }}>
                Khu vực
              </label>
              <select
                className="select-option"
                onChange={(e) => handleChange(e, "Khuvuc")}
              >
                <option value={""}>Chọn</option>
                {areaList &&
                  areaList.map((item, i) => (
                    <option key={i} value={item.id} selected={item.id==areaId}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          }
          <div className="item-filter col-6">
            <label className="title">Loại khách hàng</label>
            <select
              className="select-option"
              onChange={(e) => handleChange(e, "typeKH")}
            >
              {customerType &&
                customerType.map((item, i) => (
                  <option key={i} value={item.id} selected={item.id==customerTypeId}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="item-filter col-6">
            <label className="title" style={{ marginRight: "90px" }}>
              Khách hàng
            </label>
            {/* <select
              className="select-option"
              onChange={(e) => handleChange(e, "KH")}
            >
              <option value={""}>Chọn</option>
              {listCustomer &&
                listCustomer.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select> */}

            <form style={{width: '250px', position : 'relative'}}>
              <Select
                defaultValue={customer}
                value={customer}
                placeholder={"Chọn khách hàng"}
                onChange={(e) => handleChange(e, "KH")}
                id="name-customer"
                options = { listCustomer &&
                  listCustomer.length > 0 && listCustomer.map(item => ({label: item.name, value: item.id}))}
               >
              </Select>
            </form>

          </div>
        </div>
        <div className="d-flex" style={{ justifyContent: "center" }}>
          <button className="btn-action-click " onClick={hadleClose}>
            Đóng
          </button>
          <button
            className="btn-action-click  btn-action-access"
            onClick={() => handleAcess()}
          >
            Áp dụng
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ModalFilterShip;
