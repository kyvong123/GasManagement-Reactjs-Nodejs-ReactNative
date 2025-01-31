import Constant from "Constants";
import React, { Fragment, useEffect, useState } from "react";
import * as FaIcon from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import orderManagement from "../../../../api/orderManagementApi";
import getPriceOder from "../../../../api/getPriceOder";
import {
  ODERDETAIL,
  UPDATE_ORDERDETAIL,
  SERVERAPI,
} from "../../../config/config";
import { handleShowDate } from "../../../helpers/handleDate";
import { createOrderFetch } from "../../hooks/createOrderFetch";
import Modal from "../../modal";
import moment from "moment";
import showToast from "showToast";
import "react-toastify/dist/ReactToastify.css";
import "../order-detail/InforOrder.css";
import ToastMessage from "../../../helpers/ToastMessage";
import axios from "axios";
import getUserCookies from "getUserCookies";
import "./ModalEditOder.scss";
import ModelDeleteOrder from "./ModelDeleteOrder";
import callApi from "./../../../util/apiCaller";
import UpdateOrderDDT from "../order-detail/updateOrder/UpdateOrderDDT";
import { array, object } from "prop-types";
import sendNotification from "../../../../api/sendNotification";

const Wrapper = styled.div`
  margin-left: 30px;
  margin-top: 12px;
`;
const Header = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  column-gap: 36px;
  h3,
  span {
    font-size: 22px;
    margin-bottom: 0;
    color: #000000d9;
  }
  h3 {
    font-weight: 500;
  }
  span {
    font-weight: 700;
  }
`;
const ModalEditOrder2 = (props) => {
  const { open, handleClose, status, data, role } = props;
  const { valves, colors, menuFacture, category } = createOrderFetch();

  const [dataOrder, setDataOrder] = useState([]);
  const [sumQuantity, setSumQuantity] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [idOder, setIdOrder] = useState();
  const [userId, setUserId] = useState();
  const [userType, setUserType] = useState("");
  const [clickDelete, setClickDelete] = useState(false);
  const [indexOder, setIndexOder] = useState();
  const [gsId, setGsId] = useState();
  const [clickSave, setClickSave] = useState(false);
  const [dsPrice, setDSPrice] = useState([]);
  const [noteOrder, setNoteOrder] = useState(data.note);
  const [device, setDevice] = useState("");


  useEffect(() => {
    const getRole = async () => {
      setSumQuantity(0);
      let total = 0;
      let orderItems = [...dataOrder];
      let orderItem = {
        id: "",
        quantity: 0,
        manufacture: "",
        categoryCylinder: "",
        colorGas: "",
        valve: "",
        price: "",
      };
      const token = await getUserCookies();
      let getDevice = await axios.post(
        `${SERVERAPI}user/getInforById`,
        { id: data.customers.id },
        {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        }
      );
      if (getDevice) {
        setDevice(
          getDevice.data.data.playerID + "," + getDevice.data.data.playerIDWeb
        );
      }
      const dataOrderDetail = await orderManagement.detailOrder(data.id);
      setDataOrder(dataOrderDetail.data);
      if (dataOrderDetail.data) {
        for (let i = 0; i < dataOrderDetail.data.length; i++) {
          total = total + dataOrderDetail.data[i].quantity;
          orderItem = {
            id: dataOrderDetail.data[i].id,
            quantity: dataOrderDetail.data[i].quantity,
            manufacture: dataOrderDetail.data[i].manufacture.id,
            categoryCylinder: dataOrderDetail.data[i].categoryCylinder.id,
            colorGas: dataOrderDetail.data[i].colorGas.id,
            valve: dataOrderDetail.data[i].valve.id,
          };
          orderItems.push(orderItem);
          setGsId(dataOrderDetail.data[0].orderGSId);
        }
      }
      setOrderDetails([...orderItems]);
      setSumQuantity(total);
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserId(user_cookie.user.id);
        setUserType(user_cookie.user.userType);
      } else {
        console.log("No user cookie");
      }
      //Lấy danh sách đơn giá
      let customerId = "";
      let cylinderType = "";
      if (user_cookie.user.userType === "Tong_cong_ty") {
        customerId = dataOrderDetail.data[0].orderGSId.customers;
      } else {
        customerId = user_cookie.user.id;
      }
      if (data.orderType === "DON_BINH") {
        cylinderType = "BINH";
      } else {
        cylinderType = "VO";
      }
      const res = await getPriceOder(
        moment(data.delivery[0].deliveryDate).format("DD/MM/YYYY"),
        customerId,
        cylinderType
      );
      if (res.data) {
        setDSPrice(res.data.data);
      }
    };
    getRole();
  }, [data.id]);

  const renderProduct = () => {
    return (
      data.delivery &&
      data.delivery.map((product, index) => {
        return (
          <div key={index} className="date-text">
            {handleShowDate(product.deliveryDate)}
          </div>
        );
      })
    );
  };
  const renderStatusOrder = () => {
    let color;
    if (Constant.ORDER_STATUS.find((o) => o.key === status) !== undefined) {
      color = Constant.ORDER_STATUS.find((o) => o.key === status).color;
    }
    return (
      <h3 className="date-text margin-right200" style={{ color: color }}>
        {Constant.ORDER_STATUS.find((o) => o.key === status) &&
          Constant.ORDER_STATUS.find((o) => o.key === status).value}
      </h3>
    );
  };
  const validate = (e, i, type) => {
    let d = [...dataOrder];
    if (d.length >= 1) {
      if (type == "manufacture") {
        d[i].manufacture = e.target.value;
      } else if (type == "cylinder") {
        d[i].categoryCylinder = e.target.value;
      } else if (type == "color") {
        d[i].colorGas = e.target.value;
      } else if (type == "valve") {
        d[i].valve = e.target.value;
      } else {
        d[i].quantity = e.target.value;
      }
      for (let j = 0; j < d.length; j++) {
        const manufacture =
          typeof d[i].manufacture == "object"
            ? d[i].manufacture.id
            : d[i].manufacture;
        const manufacturej =
          typeof d[j].manufacture == "object"
            ? d[j].manufacture.id
            : d[j].manufacture;
        const categoryCylinder =
          typeof d[i].categoryCylinder == "object"
            ? d[i].categoryCylinder.id
            : d[i].categoryCylinder;
        const categoryCylinderj =
          typeof d[j].categoryCylinder == "object"
            ? d[j].categoryCylinder.id
            : d[j].categoryCylinder;
        const colorGasi =
          typeof d[i].colorGas == "object" ? d[i].colorGas.id : d[i].colorGas;
        const colorGasj =
          typeof d[j].colorGas == "object" ? d[j].colorGas.id : d[j].colorGas;
        const valve =
          typeof d[i].valve == "object" ? d[i].valve.id : d[i].valve;
        const valvej =
          typeof d[j].valve == "object" ? d[j].valve.id : d[j].valve;

        if (
          i != j &&
          d[i].manufacture &&
          d[i].categoryCylinder &&
          d[i].colorGas &&
          d[i].valve &&
          manufacture == manufacturej &&
          categoryCylinder == categoryCylinderj &&
          colorGasi == colorGasj &&
          valve == valvej
        ) {
          return false;
        }
      }

      return true;
    }
  };

  useEffect(() => {
    console.log("dataOrder", dataOrder);
  }, [dataOrder]);

  const handleSaveClick = async () => {
    let isCheckVersion = await checkVersion();
    if (isCheckVersion == props.data.updatedAt) {

      setClickSave(true);
      let isCheck = true;
      const user_cookies = await getUserCookies();
      const token = "Bearer " + user_cookies.token;
      const userID = user_cookies.user.id;

      for (let i = 0; i < dataOrder.length; i++) {
        if (
          dataOrder[i].manufacture.id == "" ||
          dataOrder[i].categoryCylinder.id == "" ||
          dataOrder[i].colorGas == "" ||
          dataOrder[i].valve == "" ||
          dataOrder[i].manufacture == "" ||
          dataOrder[i].categoryCylinder == "" ||
          dataOrder[i].colorGas == "" ||
          dataOrder[i].valve == "" ||
          dataOrder[i].quantity == 0 ||
          dataOrder[i].price == ""
        ) {
          isCheck = false;
          ToastMessage("error", "Thất bại");
          break;
        }
      }
      if (isCheck) {
        Promise.all(
          dataOrder.map((item) => {
            {
              if (item.id) {
                let params = {
                  manufacture:
                    typeof item.manufacture == "object"
                      ? item.manufacture.id
                      : item.manufacture,
                  categoryCylinder:
                    typeof item.categoryCylinder == "object"
                      ? item.categoryCylinder.id
                      : item.categoryCylinder,
                  colorGas:
                    typeof item.colorGas == "object"
                      ? item.colorGas.id
                      : item.colorGas,
                  valve:
                    typeof item.valve == "object" ? item.valve.id : item.valve,
                  quantity: item.quantity,
                  price: item.price,
                  note: noteOrder,
                };
                console.log("idGS", gsId);
                callApi(
                  "PUT",
                  UPDATE_ORDERDETAIL +
                  `?idDetail=${item.id}&userid=${userID}&id=${gsId.id}`,
                  params,
                  token
                ).then((res) => {
                  if (res.data.success) {
                    console.log(res.data.success);
                  } else {
                    console.log("Cập nhật bị lỗi! Vui lòng thử lại.");
                    return false;
                  }
                });
              } else {
                let params = {
                  orderGSId: gsId.id,
                  manufacture:
                    typeof item.manufacture == "object"
                      ? item.manufacture.id
                      : item.manufacture,
                  categoryCylinder:
                    typeof item.categoryCylinder == "object"
                      ? item.categoryCylinder.id
                      : item.categoryCylinder,
                  colorGas:
                    typeof item.colorGas == "object"
                      ? item.colorGas.id
                      : item.colorGas,
                  valve:
                    typeof item.valve == "object" ? item.valve.id : item.valve,
                  quantity: item.quantity,
                  price: item.price,
                };

                callApi("POST", ODERDETAIL, params, token).then((res) => {
                  console.log("res", res);
                  if (res) {
                    console.log(res.data.success);
                  } else {
                    console.log("Cập nhật bị lỗi! Vui lòng thử lại.");
                    return false;
                  }
                });
              }
            }
          })
        );
        ToastMessage("success", "Cập nhật thành công");
        setTimeout(() => handleClose(), 1000);
        // location.reload();
      }
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };
  const checkVersion = async () => {
    let token = await getUserCookies();
    let res = await axios.get(SERVERAPI + "orderGS/status", {
      headers: {
        Authorization: "Bearer " + token.token,
      },
      params: {
        orderId: data.id,
      },
    });
    return res.data.data.updatedAt;
  }
  const updateOrder = async (idDetail, idOrder, body) => {
    try {
      const token = await getUserCookies();
      const UserID = token.user.id;
      const url = `${SERVERAPI}orderDetail/update`;

      const res = await axios.put(url, body, {
        headers: {
          Authorization: "Bearer " + token.token,
        },
        params: {
          idDetail: idDetail,
          id: idOrder,
          userid: UserID,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  const updateOrderNew = async (body) => {
    try {
      const token = await getUserCookies();

      const url = `${SERVERAPI}orderDetail/createOrderDetail`;

      const res = await axios.post(url, body, {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      if (res) {
        console.log(res);
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  const sendOrder = async (idOrder, note) => {
    try {
      let user_cookies = await getUserCookies();
      if (!user_cookies) {
        console.log("Invalid token API");
        return;
      }
      const url = `${SERVERAPI}orderGS/acpOrderdieudotramguicomplete`;
      const res = await axios.put(url, note, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
        params: {
          id: idOrder,
          userid: user_cookies.user.id,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  const isEmpty = (arr) => {
    let isEmp = true;
    arr.map((item) => {
      if (item.colorGas == "" || item.valve == "" || item.quantity == 0) {
        isEmp = false;
      }
    });
    return isEmp;
  };
  const handleSendCustomer = async () => {
    let isEmp = isEmpty(dataOrder);
    if (isEmp) {
      let isCheckVersion = await checkVersion();
      if (isCheckVersion == props.data.updatedAt) {
        dataOrder.map((item) => {
          let body = {
            orderGSId: data.id,
            manufacture: item.manufacture.id,
            categoryCylinder: item.categoryCylinder.id,
            colorGas:
              typeof item.colorGas == "object" ? item.colorGas.id : item.colorGas,
            valve: typeof item.valve == "object" ? item.valve.id : item.valve,
            quantity: item.quantity,
            price: item.price,
          };
          if (item.id) {
            updateOrder(item.id, data.id, body);
          } else {
            updateOrderNew(body);
          }
        });
        await sendOrder(data.id, {
          note: noteOrder,
        });
        sendNotification(
          "Bạn có  đơn hàng cần duyệt lại !",
          data.orderCode,
          device,
          data.id
        );
        ToastMessage("success", "Tổ nhận lệnh gửi thành công");
        setTimeout(() => location.reload(), 2000);
      } else {
        ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
        location.reload();
      }
    } else {
      ToastMessage("error", "Nhập đầy đủ thông tin");
    }
  };

  // Lấy giá
  const getPrice = (data, obj, type) => {
    if (type === "manufacture") {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].priceDetail.length; j++) {
          if (
            obj.manufacture === data[i].priceDetail[j].manufacture &&
            obj.categoryCylinder.id === data[i].priceDetail[j].categoryCylinder
          ) {
            return data[i].priceDetail[j].price;
          }
        }
      }
    } else if (type === "cylinder") {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].priceDetail.length; j++) {
          if (
            obj.manufacture.id === data[i].priceDetail[j].manufacture &&
            obj.categoryCylinder === data[i].priceDetail[j].categoryCylinder
          ) {
            return data[i].priceDetail[j].price;
          }
        }
      }
    }
    return 0;
  };
  const handleChange = (e, index, type) => {
    if (validate(e, index, type) == false) {
      e.target.value = "";
      ToastMessage("error", "Vui lòng không chọn trùng sản phẩm");
    }
    if (type == "manufacture") {
      let arr = [...dataOrder];
      arr[index].manufacture = e.target.value;
      if (arr[index].categoryCylinder.id) {
        let value = getPrice(dsPrice, arr[index], type);
        if (value) {
          arr[index].price = value;
        } else {
          arr[index].price = "";
          ToastMessage("error", "Sản phẩm này chưa có đơn giá");
        }
        setDataOrder([...arr]);
      } else {
        let kt;
        if (arr[index].manufacture && arr[index].categoryCylinder) {
          for (let i = 0; i < dsPrice.length; i++) {
            let dsDG = dsPrice[i].priceDetail.filter(
              (ele) =>
                ele.manufacture == arr[index].manufacture &&
                ele.categoryCylinder == arr[index].categoryCylinder
            );
            if (dsDG.length >= 1) {
              arr[index].price = dsDG[0].price;
              setDataOrder([...arr]);
              kt = true;
              break;
            } else {
              arr[index].price = "";
              setDataOrder([...arr]);
              kt = false;
            }
          }
          if (kt == false) {
            ToastMessage("error", "Sản phẩm này chưa có đơn giá");
          }
        }
      }
    } else if (type == "cylinder") {
      console.log(e.target.value);
      let arr = [...dataOrder];
      arr[index].categoryCylinder = e.target.value;
      if (arr[index].manufacture.id) {
        let value = getPrice(dsPrice, arr[index], type);
        if (value) {
          arr[index].price = value;
        } else {
          arr[index].price = "";
          ToastMessage("error", "Sản phẩm này chưa có đơn giá");
        }
        setDataOrder([...arr]);
      } else {
        let kt;
        if (arr[index].categoryCylinder && arr[index].manufacture) {
          for (let i = 0; i < dsPrice.length; i++) {
            let dsDG = dsPrice[i].priceDetail.filter(
              (ele) =>
                ele.manufacture == arr[index].manufacture &&
                ele.categoryCylinder == arr[index].categoryCylinder
            );
            if (dsDG.length >= 1) {
              arr[index].price = dsDG[0].price;
              setDataOrder([...arr]);
              kt = true;
              break;
            } else {
              arr[index].price = "";
              setDataOrder([...arr]);
              kt = false;
            }
          }
          if (kt == false) {
            ToastMessage("error", "Sản phẩm này chưa có đơn giá");
          }
        }
      }
    } else if (type == "color") {
      let arr = [...dataOrder];
      arr[index].colorGas = e.target.value;
      setDataOrder([...arr]);
    } else if (type == "valve") {
      let arr = [...dataOrder];
      arr[index].valve = e.target.value;
      setDataOrder([...arr]);
    }
  };

  const handleInputQuantityChange = (index, e) => {
    let quantity = parseInt(e.currentTarget.value);
    if (quantity < 0) {
      ToastMessage("error", " Số lượng không được âm!  ");
      return;
    }
    let arr = [...dataOrder];
    if (role === "TO_NHAN_LENH") {
      let sum = 0;
      arr.map((item, i) => {
        if (
          item.manufacture === arr[index].manufacture &&
          item.categoryCylinder === arr[index].categoryCylinder &&
          i != index
        ) {
          sum = sum + item.quantity;
        }
      });
      let sum2 = 0;
      data.orderDetail.map((item) => {
        if (
          item.manufacture === arr[index].manufacture.id &&
          item.categoryCylinder === arr[index].categoryCylinder.id
        ) {
          sum2 = sum2 + item.quantity;
        }
      });
      if (sum + quantity > sum2) {
        ToastMessage("error", "Số lượng không hợp lí");
        return;
      }
    }
    setDataOrder((preState) => {
      let newState = [...preState];
      newState[index].quantity = quantity;
      console.log("log", newState);
      return newState;
    });
  };

  const handleNote = (e) => {
    setNoteOrder(e.currentTarget.value);
  };

  const handleRemoveOrderDetail = (data, i) => {
    setIdOrder(data.id);
    setClickDelete(true);
    setIndexOder(i);
  };
  const handleAddOrderDetail = async (index) => {
    let cloneArr = [...dataOrder];
    let item = {
      quantity: 0,
      manufacture: cloneArr[index].manufacture,
      categoryCylinder: cloneArr[index].categoryCylinder,
      colorGas: "",
      valve: "",
      price: cloneArr[index].price,
    };
    cloneArr.push(item);
    setDataOrder([...cloneArr]);
    console.log(cloneArr);
  };

  const handleOpenModal = () => {
    setClickDelete(false);
  };
  const DeleteModal = (indexOder) => {
    console.log(dataOrder);
    console.log("INDEX", indexOder);
    let cloneArr = [...dataOrder];
    cloneArr.splice(indexOder, 1);
    console.log(cloneArr);
    setDataOrder([...cloneArr]);
  };

  return (
    <Fragment>
      <Modal open={open} handleClose={handleClose}>
        {clickDelete ? (
          <ModelDeleteOrder
            idOder={idOder}
            userId={userId}
            close={handleOpenModal}
            deleteModal={DeleteModal}
            indexOder={indexOder}
          />
        ) : (
          ""
        )}
        <div className="container">
          <div className="row">
            <div className="infor-order__container modal_edit_order custom-scrollbar">
              <div className="code-wrap ">
                <h3 className="text-[22px] font-semibold text-black">
                  {data.orderCode}
                </h3>
                {renderStatusOrder()}
              </div>
              <div className="row">
                {status === "GUI_DUYET_LAI" ||
                  status === "TU_CHOI_LAN_2" ||
                  status === "DON_HANG_MOI" ||
                  status === "DANG_DUYET" ||
                  status === "DA_DUYET" ||
                  status === "DA_HOAN_THANH" ||
                  status === "KHONG_DUYET" ||
                  (status === "TO_NHAN_LENH_DA_DUYET" &&
                    role === "TO_NHAN_LENH") ? (
                  <div className="col-md-4">
                    <h3 className="text-[22px] font-semibold text-black">
                      {data.customers.name}
                    </h3>
                  </div>
                ) : (
                  ""
                )}
                <div className="col-md-4">
                  <FaIcon.FaRegCalendarAlt className="ordered-icon " />
                  <span className=" date-text  ">
                    Ngày tạo: {handleShowDate(data.createdAt)}
                  </span>
                </div>
                {status === "GUI_DUYET_LAI" ||
                  status === "TU_CHOI_LAN_2" ||
                  status === "DON_HANG_MOI" ||
                  status === "DANG_DUYET" ||
                  status === "DA_DUYET" ||
                  status === "KHONG_DUYET" ||
                  (status === "TO_NHAN_LENH_DA_DUYET" &&
                    role === "TO_NHAN_LENH") ? (
                  <div className="col-md-4">
                    <div className="row">
                      <div className="date-text col-md-6 d-flex">
                        <div className="ml-auto">
                          <FaIcon.FaRegCalendarAlt className="ordered-icon" />
                          Ngày giao:
                        </div>
                      </div>
                      <div className="col-md-6">{renderProduct()}</div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="address-wrap ">
                <FaIcon.FaMapMarkerAlt className="ordered-icon" />
                <span className="date-text ">{data.customers.address}</span>
              </div>
              <div className="row">
                <Wrapper>
                  <Header>
                    <h3>Thông tin đặt hàng:</h3>
                    <span>Số lượng: {sumQuantity}</span>
                  </Header>
                </Wrapper>
              </div>
              {dataOrder &&
                dataOrder.map((data, index) => {
                  return (
                    <div key={index} className="mt-2 order_detail_list">
                      <div className="wrapper_detail">
                        <div>
                          <select
                            id={`${index}manufacture`}
                            className={
                              data.manufacture.id == "" ||
                                (data.manufacture == "" && clickSave == true)
                                ? "detail error form-control border border-dark rounded"
                                : "detail form-control border border-dark rounded"
                            }
                            value={data.manufacture.id}
                            onChange={(e) =>
                              handleChange(e, index, "manufacture")
                            }
                            disabled
                          >
                            <option value="">Thương hiệu</option>
                            {menuFacture &&
                              menuFacture.map((d, i) => (
                                <option
                                  value={d.id}
                                  key={i}
                                  selected={
                                    data.manufacture.id === d.id ? true : false
                                  }
                                >
                                  {d.name}
                                </option>
                              ))}
                          </select>
                          <p
                            className={
                              data.manufacture.id == "" ||
                                (data.manufacture == "" && clickSave == true)
                                ? "mess err"
                                : "mess"
                            }
                          >
                            Vui lòng chọn thương hiệu
                          </p>
                        </div>
                        <div>
                          <select
                            id={`${index}category`}
                            className={
                              data.categoryCylinder.id == "" ||
                                (data.categoryCylinder == "" && clickSave == true)
                                ? "detail error form-control border border-dark rounded"
                                : "detail form-control border border-dark rounded"
                            }
                            onChange={(e) => handleChange(e, index, "cylinder")}
                            value={data.categoryCylinder.id}
                            disabled
                          >
                            <option value="">Loại bình</option>
                            {category &&
                              category.map((d, i) => (
                                <option
                                  value={d.id}
                                  key={i}
                                  selected={
                                    data.categoryCylinder.id === d.id
                                      ? true
                                      : false
                                  }
                                >
                                  {d.name}
                                </option>
                              ))}
                          </select>
                          <p
                            className={
                              data.categoryCylinder.id == "" ||
                                (data.categoryCylinder == "" && clickSave == true)
                                ? "mess err"
                                : "mess"
                            }
                          >
                            Vui lòng chọn lọai bình
                          </p>
                        </div>
                        <div>
                          <select
                            id={`${index}color`}
                            className={
                              data.colorGas.id == "" ||
                                (data.colorGas == "" && clickSave == true)
                                ? "detail error form-control border border-dark rounded"
                                : "detail form-control border border-dark rounded"
                            }
                            onChange={(e) => handleChange(e, index, "color")}
                            style={
                              index < orderDetails.length
                                ? typeof data.colorGas == "object"
                                  ? props.data.orderDetail[index].colorGas ==
                                    data.colorGas.id
                                    ? { color: "black" }
                                    : {}
                                  : props.data.orderDetail[index].colorGas ==
                                    data.colorGas
                                    ? { color: "black" }
                                    : {}
                                : {}
                            }
                            value={data.colorGas.id}
                          >
                            <option value="">Màu sắc</option>
                            {colors &&
                              colors.map((d, i) => (
                                <option
                                  value={d.id}
                                  key={i}
                                  selected={
                                    data.colorGas.id === d.id ? true : false
                                  }
                                >
                                  {d.name}
                                </option>
                              ))}
                          </select>
                          <p
                            className={
                              data.colorGas.id == "" ||
                                (data.colorGas == "" && clickSave == true)
                                ? "mess err"
                                : "mess"
                            }
                          >
                            Vui lòng chọn màu
                          </p>
                        </div>
                        <div>
                          <select
                            id={`${index}valve`}
                            className={
                              data.valve.id == "" ||
                                (data.valve == "" && clickSave == true)
                                ? "detail error form-control border border-dark rounded"
                                : "detail form-control border border-dark rounded"
                            }
                            value={data.valve.id}
                            style={
                              index < orderDetails.length
                                ? typeof data.valve == "object"
                                  ? props.data.orderDetail[index].valve ==
                                    data.valve.id
                                    ? { color: "black" }
                                    : {}
                                  : props.data.orderDetail[index].valve ==
                                    data.valve
                                    ? { color: "black" }
                                    : {}
                                : {}
                            }
                            onChange={(e) => handleChange(e, index, "valve")}
                          >
                            <option value="">Loại van</option>
                            {valves &&
                              valves.map((d, i) => (
                                <option
                                  value={d.id}
                                  key={i}
                                  selected={
                                    data.valve.id === d.id ? true : false
                                  }
                                >
                                  {d.name}
                                </option>
                              ))}
                          </select>
                          <p
                            className={
                              data.valve.id == "" ||
                                (data.valve == "" && clickSave == true)
                                ? "mess err"
                                : "mess"
                            }
                          >
                            Vui lòng chọn loại van
                          </p>
                        </div>
                        <div className="col-md-1 pl-3">
                          <input
                            id={`${index}quantityInput`}
                            className={
                              data.quantity == 0 && clickSave == true
                                ? "error form-control border border-dark rounded"
                                : "form-control border border-dark rounded"
                            }
                            placeholder="Số lượng"
                            type="number"
                            value={data.quantity}
                            style={
                              index < orderDetails.length
                                ? props.data.orderDetail[index].quantity ==
                                  data.quantity
                                  ? { color: "black" }
                                  : { color: "blue" }
                                : { color: "blue" }
                            }
                            defaultValue={parseInt(data.quantity)}
                            min={1}
                            onChange={(e) =>
                              handleInputQuantityChange(index, e)
                            }
                          />
                        </div>

                        <input
                          className="input-prices"
                          placeholder="Đơn giá"
                          value={data.price ? data.price : "Đơn giá"}
                          disabled
                        ></input>

                        <div>
                          <div>
                            <div className="col-md-1 p-0">
                              {index < orderDetails.length ? (
                                <FaIcon.FaPlusCircle
                                  className="fa_icon"
                                  onClick={() => handleAddOrderDetail(index)}
                                />
                              ) : (
                                <FaIcon.FaMinusCircle
                                  className="fa_icon"
                                  onClick={() =>
                                    handleRemoveOrderDetail(data, index)
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              <textarea
                className="input-reason-form"
                name="name"
                value={noteOrder}
                onChange={(e) => handleNote(e)}
                rows={4}
              />
            </div>
            <div className="btn-actionrow">
              {role === "TO_NHAN_LENH" ? (
                <button
                  className="btn btn-success"
                  onClick={() => handleSendCustomer()}
                >
                  Gửi lại KH
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleSaveClick()}
                >
                  Lưu lại
                </button>
              )}
              <button className="btn btn-warning" onClick={handleClose}>
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
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
    </Fragment>
  );
};

export default ModalEditOrder2;
