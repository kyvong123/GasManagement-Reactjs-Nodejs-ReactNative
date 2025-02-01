import Constant from "Constants";
import React, { Fragment, useEffect, useState } from "react";
import * as FaIcon from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import orderManagement from "../../../../api/orderManagementApi";
import { handleShowDate } from "../../../helpers/handleDate";
import { createOrderFetch } from "../../hooks/createOrderFetch";
import Modal from "../../modal";
import "react-toastify/dist/ReactToastify.css";
import "../order-detail/InforOrder.css";
import deleteOrderDetailItem from "../../../../api/deleteOrderDetailItem";
import getUserCookies from "getUserCookies";
import './ModalEditOder.scss';

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
const ModalEditOrder = (props) => {
  const { open, handleClose, status, data, role } = props;

  const { valves, colors, menuFacture, category } = createOrderFetch();

  const [dataOrder, setDataOrder] = useState([]);
  const [sumQuantity, setSumQuantity] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [manufactureErr, setManufactureErr] = useState(false);
  const [cylinderErr, setCylinderErr] = useState(false);
  const [colorErr, setColorErr] = useState(false);
  const [valveErr, setValveErr] = useState(false);
  const [quantityErr, setQuantityErr] = useState(false);
  const [indexDel, setIndexDel] = useState("1");
  const [userId, setUserId] = useState();
  const [reLoad, setReLoad] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      setSumQuantity(0);
      let total = 0;
      let orderItems = [];
      let orderItem = {
        id: "",
        quantity: 0,
        manufacture: "",
        categoryCylinder: "",
        colorGas: "",
        valve: "",
      };
      setDataOrder([]);
      const dataOrderDetail = await orderManagement.detailOrder(data.id);
      setDataOrder(dataOrderDetail.data);
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
      }
      setOrderDetails(orderItems);
      setSumQuantity(total);
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserId(user_cookie.user.id);
      } else {
        console.log("No user cookie");
      }
    };
    getRole();
  }, [data.id, reLoad]);
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

  const handleCancelClick = () => {
    handleClose();
  };
  const handleSaveClick = () => {
    if (manufactureErr || cylinderErr || colorErr || valveErr || quantityErr) {
      toast.error(
        manufactureErr
          ? "Kiểm tra lại thương hiệu !"
          : cylinderErr
            ? "Kiểm tra lại loại bình !"
            : colorErr
              ? "Kiểm tra lại màu sắc !"
              : valveErr
                ? "Kiểm tra lại loại van !"
                : quantityErr
                  ? "Kiểm tra lại số lượng !"
                  : "Thông tin nhập vào không hợp lệ !",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    } else {
      console.log( "mang real: ", dataOrder);
    }
    console.log("danh sách đặt hàng", dataOrder);
  };
  const handleChangeManufacture = (e, index) => {
    // let newDataOrder = [...orderDetails];
    // newDataOrder[index].manufacture = e.target.value;
    // setDataOrder([...newDataOrder])
    let result = newDataOrder.filter((data) => {
      return (
        data.manufacture === newDataOrder[index].manufacture &&
        data.categoryCylinder === newDataOrder[index].categoryCylinder &&
        data.colorGas === newDataOrder[index].colorGas &&
        data.valve === newDataOrder[index].valve
      );
    });
    if (result.length > 1) {
      $("#" + index + "manufacture" + " option[value='0']").prop(
        "selected",
        "selected"
      );
      $("#" + index + "manufacture")
        .css("background-color", "red")
        .css("color", "white");
      toast.error("Thông tin này đã có!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setOrderDetails([...orderDetails]);
      setManufactureErr(true);
    } else {
      $("#" + index + "manufacture")
        .css("background-color", "white")
        .css("color", "black");
      setOrderDetails([...newDataOrder]);
      setManufactureErr(false);
    }
  };
  const handleChangeCategory = (index, event) => {
    let newDataOrder = orderDetails;
    let category = event.target.value;
    newDataOrder[index].categoryCylinder = category;
    let result = newDataOrder.filter((data) => {
      return (
        data.manufacture === newDataOrder[index].manufacture &&
        data.categoryCylinder === newDataOrder[index].categoryCylinder &&
        data.colorGas === newDataOrder[index].colorGas &&
        data.valve === newDataOrder[index].valve
      );
    });
    if (result.length > 1) {
      $("#" + index + "category" + " option[value='0']").prop(
        "selected",
        "selected"
      );
      $("#" + index + "category")
        .css("background-color", "red")
        .css("color", "white");
      toast.error("Thông tin này đã có!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setOrderDetails(orderDetails);
      setCylinderErr(true);
    } else {
      $("#" + index + "category")
        .css("background-color", "white")
        .css("color", "black");
      setOrderDetails(newDataOrder);
      setCylinderErr(false);
    }
  };
  const handleChangeColor = (index, event) => {
    let newDataOrder = orderDetails;
    let colorGas = event.target.value;
    newDataOrder[index].colorGas = colorGas;
    let result = newDataOrder.filter((data) => {
      return (
        data.manufacture === newDataOrder[index].manufacture &&
        data.categoryCylinder === newDataOrder[index].categoryCylinder &&
        data.colorGas === newDataOrder[index].colorGas &&
        data.valve === newDataOrder[index].valve
      );
    });
    if (result.length > 1) {
      $("#" + index + "color" + " option[value='0']").prop(
        "selected",
        "selected"
      );
      $("#" + index + "color")
        .css("background-color", "red")
        .css("color", "white");
      toast.error("Thông tin này đã có!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setOrderDetails(orderDetails);
      setColorErr(true);
    } else {
      $("#" + index + "color")
        .css("background-color", "white")
        .css("color", "black");
      setOrderDetails(newDataOrder);
      setColorErr(false);
    }
  };
  const handleChangeValve = (index, event) => {
    let newDataOrder = orderDetails;
    let valve = event.target.value;
    newDataOrder[index].valve = valve;
    let result = newDataOrder.filter((data) => {
      return (
        data.manufacture === newDataOrder[index].manufacture &&
        data.categoryCylinder === newDataOrder[index].categoryCylinder &&
        data.colorGas === newDataOrder[index].colorGas &&
        data.valve === newDataOrder[index].valve
      );
    });
    if (result.length > 1) {
      $("#" + index + "valve" + " option[value='0']").prop(
        "selected",
        "selected"
      );
      $("#" + index + "valve")
        .css("background-color", "red")
        .css("color", "white");
      toast.error("Thông tin này đã có!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setOrderDetails(orderDetails);
      setValveErr(true);
    } else {
      $("#" + index + "valve")
        .css("background-color", "white")
        .css("color", "black");
      setOrderDetails(newDataOrder);
      setValveErr(false);
    }
  };
  const handleChangeQuantity = (index, event) => {
    let newDataOrder = orderDetails;
    let sum = 0;
    let quantity = parseInt(event.target.value);
    newDataOrder[index].quantity = quantity;
    newDataOrder.map((data) => (sum = sum + data.quantity));
    if (sum <= sumQuantity) {
      $("input").removeClass("quantityInput_err");
      setQuantityErr(false);
      setOrderDetails(newDataOrder);
    } else {
      $("#" + index + "quantityInput").addClass("quantityInput_err");
      toast.error("Số lượng nhập vào lớn hơn số lượng đặt hàng!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setQuantityErr(true);
    }
  };
  const handleAddOrderDetail =() => {
    let cloneArr = [...dataOrder];
    let item = {
      id: "",
      quantity: 0,
      manufacture: "",
      categoryCylinder: "",
      colorGas: "",
      valve: "",
    }
    cloneArr.push(item);
    setDataOrder([...cloneArr]);

  }
  const handleDelOrderDetail = async (index) => {
    console.log(index);
      console.log("id đơn hàng", indexDel);
      console.log(quantityErr);
      let res = await deleteOrderDetailItem(indexDel, userId);
      if (res.data.success) {
        setReLoad(!reLoad);
        $("#modalOrderDetail").modal("hide");
  
      } else {
        console.log("xoa that bai", res);
      }
      $("#modalOrderDetail").modal("hide");
      // let cloneArr = [...dataOrder]
      // cloneArr.splice(index, 1)
      // setDataOrder([...cloneArr])
      
  };

  const handleRemoveOrderDetail = (data, index) => {
    console.log("dataaaaa",data.id);
    setQuantityErr('abbae')
    setIndexDel(data.id);
    $("#modalOrderDetail").modal("show");      
    // handleDelOrderDetail(index);
  };
  return (
    <Fragment>
      <div
        class="modal fade"
        id="modalOrderDetail"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Xác nhận
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Bạn có muốn xóa chi tiết đơn hàng này ?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Đóng
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onClick={() => handleDelOrderDetail(indexDel)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} handleClose={handleClose}>
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
                      {data.supplier.name}
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
                      <div className="row">
                        <div className="col-md-2 pl-3">
                          <select
                            id={`${index}manufacture`}
                            // value = {data.manufacture}
                            onChange={(e) => handleChangeManufacture(e, index)}
                            className="form-control border border-dark rounded"
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
                        </div>
                        <div className="col-md-2 pl-3">
                          <select
                            id={`${index}category`}
                            onChange={(e) => handleChangeCategory(index, e)}
                            className="form-control border border-dark rounded"
                          >
                            <option value="0">Loại bình</option>
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
                        </div>
                        <div className="col-md-2 pl-3">
                          <select
                            id={`${index}color`}
                            onChange={(e) => handleChangeColor(index, e)}
                            className="form-control border border-dark rounded"
                          >
                            <option value="0">Màu sắc</option>
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
                        </div>
                        <div className="col-md-2 pl-3">
                          <select
                            id={`${index}valve`}
                            onChange={(e) => handleChangeValve(index, e)}
                            className="form-control border border-dark rounded"
                          >
                            <option value="0">Loại van</option>
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
                        </div>
                        <div className="col-md-1 pl-3">
                          <input
                            id={`${index}quantityInput`}
                            className="form-control border border-dark rounded"
                            placeholder="Số lượng"
                            type="number"
                            defaultValue={parseInt(data.quantity)}
                            onChange={(e) => handleChangeQuantity(index, e)}
                            min={1}
                          />
                          {/* class show_error vs hide_error  */}
                        </div>
                        <div className="col-md-3 pl-3">
                          <div className="row">
                            <div className="col-md-1 p-0">
                              {index === 0 ? (
                                <FaIcon.FaPlusCircle
                                  className="fa_icon"
                                  onClick={handleAddOrderDetail}
                                />
                              ) : (
                                <FaIcon.FaMinusCircle
                                  className="fa_icon"
                                  onClick={() => handleRemoveOrderDetail(data, index)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                   
              </div>
              <div className="btn-action">
                <button className="btn btn-success" onClick={() => handleSaveClick()}>
                  Lưu lại 
                </button>
                <button className="btn btn-warning" onClick={handleClose}>Huỷ</button>
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

export default ModalEditOrder;
