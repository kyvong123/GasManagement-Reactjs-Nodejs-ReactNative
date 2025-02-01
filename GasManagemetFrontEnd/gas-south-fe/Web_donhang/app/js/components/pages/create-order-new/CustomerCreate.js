import React, { Suspense, useEffect, useState } from "react";
import { DatePicker } from "antd";
import "antd/lib/date-picker/style/css";
import { createOrderCustomerFetch } from "../../hooks/createOrderCustomerFetch";
import "react-toastify/dist/ReactToastify.css";
import "./CreateOrderNew.css";
import * as FaIcon from "react-icons/fa";
import moment from "moment";
import getPriceOder from "../../../../api/getPriceOder";
import ToastMessage from "../../../helpers/ToastMessage";
import { data } from "jquery";
import getUserCookies from "getUserCookies";
import axiosClient from "../../../../api/axiosClient";

const CustomerCreate = ({
  customer,
  handlePrice,
  cylinderType,
  handleNewPrice,
  clickCreateOrder,
  valueOfUser,
  setValueOfUser,
  valueDate,
  setValueDate,
  handleChangeDate,
  handleChangeAddress,
  isReset,
  placeOfDelivery,
}) => {
  const { location } = createOrderCustomerFetch();
  const [_location, set_location] = useState([]);
  const [orderArray1, setOderArray1] = useState([
    {
      deliveryAddress: "",
      deliveryDate: "",
    },
  ]);
  const [dateChange, setDateChange] = useState([{ deliveryDate: "" }]);
  const [ngay, setNgay] = useState();
  // const varLocation = location.address;
  
  const loadLocation = async () => {
    const res = await axiosClient.post(
      "/user/getInforById",
      {
        id: customer.idChildOf,
      },
      {
        headers: {
          Authorization: "Bearer " + customer.token,
        },
      }
    );
    if(res.status) {
      set_location([res.data.address])
      setOderArray1([
        {
          deliveryAddress: res.data.address,
          deliveryDate: "",
        },
      ]);
    }
  }

  const rerenderLocation = () => {
    if (placeOfDelivery !== "CUSTOMER") loadLocation();
    else {
      set_location(location.address);
      setOderArray1([
        {
          deliveryAddress: location.address[0],
          deliveryDate: "",
        },
      ]);
    }
  }

  useEffect(() => {
    rerenderLocation();
  }, [placeOfDelivery, location]);

  useEffect(() => {
    setOderArray1([
      {
        deliveryAddress: _location[0],
        deliveryDate: "",
      },
    ]);
    setValueDate([{ value: "" }]);
    // setLocation({ address: varLocation, area: "" });
  }, [isReset]);

  useEffect(() => {
    // Lấy đơn giá theo Vo
    if (cylinderType) {
      const getPrice = async () => {
        let res = await getPriceOder(ngay, customer.id, cylinderType);
        if (res.data.success) {
          handlePrice(res.data.data);
        } else {
          ToastMessage("error", "Không tìm thấy bảng giá");
          handlePrice([]);
        }
      };
      getPrice();
    } else {
      return;
    }
  }, [cylinderType, handleNewPrice]);

  useEffect(() => {
    setValueOfUser({
      ...valueOfUser,
      delivery: orderArray1,
    });
  }, [orderArray1]);

  const onChangeAddress = (e, index) => {
    handleChangeAddress(e, index);
    let cloneArr = [...orderArray1];
    cloneArr[index].deliveryAddress = e.target.value;
    setOderArray1([...cloneArr]);
  };
  const onChangeDate = async (date, index) => {
    let cloneArr = [...orderArray1];
    if (!cloneArr[index].deliveryAddress) {
      cloneArr[index].deliveryAddress = _location[0];
      setOderArray1([...cloneArr]);
    }
    handleChangeDate(date, index);
    cloneArr[index].deliveryDate = date.toISOString();
    setOderArray1([...cloneArr]);
    let arrDate = [...dateChange];
    arrDate[index].deliveryDate = date.toISOString();
    setDateChange([...arrDate]);
    setNgay(arrDate[0].deliveryDate);
    // Lấy đơn giá theo Oder
    if (cylinderType) {
      let res = await getPriceOder(
        arrDate[0].deliveryDate,
        customer.id,
        cylinderType
      );
      if (res.data.success) {
        handlePrice(res.data);
      } else {
        ToastMessage("error", "Không tìm thấy bảng giá");
        handlePrice([]);
      }
    } else {
      let res = await getPriceOder(arrDate[0].deliveryDate, customer.id, "BINH");
      if (res.data.success) {
        handlePrice(res.data.data);
      } else {
        ToastMessage("error", "Không tìm thấy bảng giá");
        handlePrice([]);
      }
    }
  };

  const handleAddOrder = () => {
    let arr = [...orderArray1];
    let item = {
      deliveryAddress: _location[0],
      deliveryDate: "",
    };
    arr.push(item);
    setOderArray1([...arr]);

    //Date
    let cloneArr = [...dateChange];
    let item2 = {
      deliveryDate: "",
    };
    cloneArr.push(item2);
    setDateChange([...cloneArr]);
  };
  const handleOnClickXoa = (index) => {
    let cloneArr = [...orderArray1];
    cloneArr.splice(index, 1);
    setOderArray1([...cloneArr]);
  };

  return (
    <div style={{ marginBottom: "60px" }}>
      <div className="order_info">
        <div className="order_info_address">
          <label>Nơi nhận hàng</label>
          <label>Ngày giao hàng:</label>
        </div>
        {orderArray1.map((data, index) => (
          <div className="order_info_date">
            <div className="form-valid">
              <select
                className={
                  data.deliveryAddress == "" && clickCreateOrder == true
                    ? "address-delivery error"
                    : "address-delivery"
                }
                value={data.deliveryAddress}
                onChange={(e) => onChangeAddress(e, index)}
              >
                {_location.length > 0 ? (
                  _location.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))
                ) : (
                  <option value="">Địa chỉ nhận hàng</option>
                )}

                {/* <option value="">Địa chỉ nhận hàng</option>
                {
                  location.address.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))
                } */}
              </select>
              <p
                className={
                  data.deliveryAddress == "" && clickCreateOrder == true
                    ? "msg-error actives"
                    : "msg-error"
                }
              >
                Vui lòng chọn địa chỉ nhận hàng
              </p>
            </div>
            <div>
              <div className="form-valid formdate">
                <DatePicker
                  value={valueDate[index] ? valueDate[index].value : ""}
                  className={
                    (!valueDate[index] || !valueDate[index].value) &&
                    clickCreateOrder
                      ? `datePicker${index} error errordate`
                      : `datePicker${index}`
                  }
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                  onChange={(date) => onChangeDate(date, index)}
                />
                <p
                  className={
                    (!valueDate[index] || !valueDate[index].value) &&
                    clickCreateOrder == true
                      ? "msg-error actives abc"
                      : "msg-error"
                  }
                >
                  Vui lòng chọn ngày
                </p>
              </div>

              <div className="icon-action-popup2 btn_action2">
                {index === 0 ? (
                  <FaIcon.FaPlusCircle
                    className="icon-action icon-them "
                    onClick={() => handleAddOrder()}
                  />
                ) : (
                  <FaIcon.FaMinusCircle
                    key={index}
                    className="icon-action icon-xoa "
                    onClick={() => handleOnClickXoa(index)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCreate;
