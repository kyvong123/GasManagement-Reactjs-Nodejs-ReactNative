import React, { useState, useEffect, useContext } from "react";
import Modal from "../../modal";
import "./ModalFilter.scss";
import moment from "moment";
import { createOrderSupplierFetch } from "../../hooks/createOrderSupplierFetch";
import { DatePicker } from "antd";
import getUserCookies from "getUserCookies";
import getAreaByStationId from "../../../../api/getAreaByStationId";
import orderManagement from "../../../../api/orderManagementApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { themeContext } from "./context/Provider";

const OptionDate = ({value, label, handleTodayTimeChange, defaultChecked = false}) => {
  return (
    <div className="col-md-3 d-flex align-items-center">
      <input
        type="radio"
        className="form-check-input"
        id="default-time"
        name="time"
        value={value}
        checked={defaultChecked}
        onChange={handleTodayTimeChange}
      />
      <label className="form-check-label text-center">{label}</label>
    </div>
  );
}

const ModalFilter = (props) => {
  const { open, handleCloseModal, setIsFilter } = props;

  const {
    dateStart,
    dateEnd,
    optionDate,
    handleChangeCustomerType,
    handleChangeArea,
    handleChangeCustomer,
    handleChangeStartDay,
    handleChangeEndDay,
    handleTodayTimeChange,
    handleChangeStation,
    setCustomerTypeList,
    typeCustomer,
    objectId,
    choseArea,
    areaByStation,
    customerTypeList,
    handleResetFilter,
    handleFilterClick,
    userType,
    userRole,
    customerId,
    customer,
  } = useContext(themeContext);

  const dateFormat = "DD/MM/YYYY";
  const { station } = createOrderSupplierFetch();

  const customerType = [
    { id: "", name: "Tất cả" },
    { id: "Industry", name: "Khách hàng công nghiệp bình" },
    { id: "Distribution", name: "Tổng đại lý" },
    { id: "Agency", name: "Đại lý" },
  ];

  const handleClickBtnFilter = () => {
    if (
      objectId === "" &&
      customerId === "" &&
      choseArea === "" &&
      customer === "" &&
      dateStart.isSame(moment().startOf("day")) &&
      dateEnd.isSame(moment().endOf("day"))
    )
      setIsFilter(false);
    else setIsFilter(true);
    handleFilterClick();
    handleCloseModal();
  };

  useEffect(() => {
    const getCustomerList = async () => {
      let params = {
        type: "", //value cua tong dai ly
        objectId: "", // id cua tram
        area: "", // id khu vuc
      };
      try {
        if (!typeCustomer || !objectId || !choseArea) {
          return;
        }

        let params = {
          customerType: typeCustomer,
          isChildOf: objectId,
        };

        const res = await orderManagement.getTypeCustomer(params);
        if (res && res.data) {
          setCustomerTypeList(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCustomerList();
  }, [typeCustomer, objectId, choseArea]);
  
  return (
    <Modal open={open} handleClose={handleCloseModal} isWhite>
      <div className="container_cus">
        <div className="container">
          <div className="modal_time_title">Thời gian:</div>
          <div className="row pl-5">
            <OptionDate
              value="1"
              label="Hôm nay"
              handleTodayTimeChange={handleTodayTimeChange}
              defaultChecked={optionDate === "1"}
            />
            <OptionDate
              value="2"
              label="Tuần này"
              handleTodayTimeChange={handleTodayTimeChange}
              defaultChecked={optionDate === "2"}
            />
            <OptionDate
              value="3"
              label="Tháng này"
              handleTodayTimeChange={handleTodayTimeChange}
              defaultChecked={optionDate === "3"}
            />
            <OptionDate
              value="4"
              label="Tháng trước"
              handleTodayTimeChange={handleTodayTimeChange}
              defaultChecked={optionDate === "4"}
            />
          </div>
          <div className="row pl-5 mt-4">
            <OptionDate
              value="5"
              label="Tùy chọn"
              handleTodayTimeChange={handleTodayTimeChange}
              defaultChecked={optionDate === "5"}
            />
            <div className="col-md-3 d-flex align-items-center date_cus">
              <DatePicker
                style={{
                  height: "42px",
                  "border-radius": "5px",
                  color: "black",
                  "font-weight": "500",
                }}
                className="date_time_picker"
                value={dateStart}
                defaultValue={dateStart}
                format={dateFormat}
                onChange={handleChangeStartDay}
                placeholder="Chọn ngày bắt đầu"
              />
            </div>
            <div className="col-md-3 date_cus">
              <DatePicker
                style={{
                  height: "42px",
                  borderRadius: "5px",
                  color: "black",
                  fontWeight: "500",
                }}
                className="date_time_picker"
                value={dateEnd}
                defaultValue={dateEnd}
                format={dateFormat}
                onChange={handleChangeEndDay}
                placeholder="Chọn ngày kết thúc"
              />
            </div>
          </div>
        </div>
      </div>
      {userType === "Tong_cong_ty" &&
      (userRole === "To_nhan_lenh" ||
        userRole === "Pho_giam_docKD" ||
        userRole === "Truong_phongKD" ||
        userRole === "Giam_doc" ||
        userRole === "phongKD" ||
        userRole === "Ke_toan" ||
        userRole === "Ke_toan_vo_binh") ? (
        <div className="container pl-5">
          <div className="row">
            <div className="col-md-6">
              <div className="modal_time_title">Trạm:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={handleChangeStation}
                value={objectId || ""}
              >
                <option value="">Tất cả</option>
                {station &&
                  station.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <div className="modal_time_title ">Khu vực:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={handleChangeArea}
                value={choseArea || ""}
              >
                <option value="">Tất cả</option>
                {areaByStation &&
                  areaByStation.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <div className="modal_time_title ">Loại khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={handleChangeCustomerType}
                name="select1"
                value={typeCustomer || ""}
              >
                {customerType &&
                  customerType.map((d, i) => (
                    <option key={i} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6 ">
              <div className="modal_time_title ">Khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onClick={handleChangeCustomer}
              >
                <option value="">--Chọn--</option>
                {customerTypeList &&
                  customerTypeList.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="row margin_customer">
            <div className="col-md-6 d-flex flex-row-reverse">
              <button
                className="btn-warning btn_customer  btn_customer--warning"
                onClick={handleResetFilter}
              >
                Xóa bộ lọc
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn-success btn_customer  btn_customer--success"
                onClick={handleClickBtnFilter}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : userType === "Tram" || userType === "Factory" ? (
        <div className="container pl-5">
          <div className="row">
            <div className="col-md-6">
              <div className="modal_time_title ">Khu vực:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={handleChangeArea}
                value={choseArea || ""}
              >
                <option value="">Tất cả</option>
                {areaByStation &&
                  areaByStation.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6">
              <div className="modal_time_title ">Loại khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={handleChangeCustomerType}
                name="select1"
                value={typeCustomer || ""}
              >
                {customerType &&
                  customerType.map((d, i) => (
                    <option key={i} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6 ">
              <div className="modal_time_title ">Khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onClick={handleChangeCustomer}
              >
                <option value="">--Chọn--</option>
                {customerTypeList &&
                  customerTypeList.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <div style={{ display: "none" }}>
                <div className="modal_time_title">Trạm:</div>
                <select
                  className="form-control border border-dark w-75 drop-down-cus rounded select"
                  onChange={handleChangeStation}
                >
                  <option value="">Tất cả</option>
                  {station &&
                    station.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          <div className="row margin_customer">
            <div className="col-md-6 d-flex flex-row-reverse">
              <button
                className="btn-warning btn_customer  btn_customer--warning"
                onClick={handleResetFilter}
              >
                Xóa bộ lọc
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn-success btn_customer  btn_customer--success"
                onClick={handleFilterClick}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Modal>
  );
};

export default ModalFilter;
