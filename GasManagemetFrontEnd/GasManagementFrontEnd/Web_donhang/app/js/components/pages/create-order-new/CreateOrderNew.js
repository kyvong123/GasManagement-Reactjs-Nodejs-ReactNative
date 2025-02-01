import React, { useEffect, useState } from "react";
import "./CreateOrderNew.css";
import CustomerCreate from "./CustomerCreate";
import AdminCreate from "./AdminCreate";
import { createOrderFetch } from "../../hooks/createOrderFetch";
import handleShowDisplay from "../orderManagement/handleShowDisplay";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrderCustomerFetch } from "../../hooks/createOrderCustomerFetch";
import orderManagement from "../../../../api/orderManagementApi";
import sendNotification from "../../../../api/sendNotification";
import getIdDevice from "../../../../api/getIdDevice";
import getUserCookies from "getUserCookies";

import { handleDelivery } from "./handleDelivery";
import ToastMessage from "../../../helpers/ToastMessage";
import * as FaIcon from "react-icons/fa";
import moment from "moment";

const CreateOrderNew = () => {
  const { location } = createOrderCustomerFetch();
  const { valves, colors, menuFacture, category } = createOrderFetch();
  const [userRole, setUserRole] = useState(0);
  const [click, setClick] = useState(false);
  const [customer, setCustomer] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [supplier, setSupplier] = useState("");
  const [dsPrice, setDSPrice] = useState([]);
  const [price, setPrice] = useState(false);
  const [createOrderDate, setCreateOrderDate] = useState(moment());
  const [cylinderType, setCylingderType] = useState("");
  const [orderType, setOrderType] = useState("KHONG");
  const [placeOfDelivery, setPlaceOfDelivery] = useState("CUSTOMER");
  const [isReset, setIsReset] = useState(false);
  const [countOrderDetails, setCountOrderDetails] = useState([
    {
      manufacture: "",
      categoryCylinder: "",
      colorGas: "",
      valve: "",
      quantity: "",
      price: "",
    },
  ]);

  const {
    valueOfUser,
    setValueOfUser,
    valueDate,
    setValueDate,
    handleChangeDate,
    handleChangeAddress,
    orderArray,
    setOrderArray,
    handleAdd,
    handleDelete,
  } = handleDelivery();
  
  useEffect(() => {
    handleShowDisplay().then((data) => {
      setUserRole(data);
      $("#1new_order").css("background-color", "red");
    });
    const getUser = async () => {
      let user_cookies = await getUserCookies();
      if (user_cookies) {
        setCustomer({
          id: user_cookies.user.id,
          idChildOf: user_cookies.user.isChildOf,
          token: user_cookies.token,
        });
      }
     
    };
    getUser();
  }, []);

  const handleResetForm = () => {
    setCountOrderDetails([
      {
        manufacture: "",
        categoryCylinder: "",
        colorGas: "",
        valve: "",
        quantity: "",
        price: "",
      },
    ]);
    setClick(false);
  };

  const handleAddOrder = () => {
    let arr = [...countOrderDetails];
    let item = {
      manufacture: "",
      categoryCylinder: "",
      colorGas: "",
      valve: "",
      quantity: "",
      price: "",
    };
    arr.push(item);
    setCountOrderDetails([...arr]);
  };
  
  const handleOnClickXoa = (idx) => {
    let cloneArr = [...countOrderDetails];
    cloneArr.splice(idx, 1);
    setCountOrderDetails([...cloneArr]);
  };

  const validate = (e, i, type) => {
    if (countOrderDetails.length >= 1) {
      for (var j = 0; j < countOrderDetails.length; j++) {
        if (type == "manufacture") {
          if (
            i !== j &&
            countOrderDetails[i].categoryCylinder &&
            countOrderDetails[i].colorGas &&
            countOrderDetails[i].valve &&
            e.target.value == countOrderDetails[j].manufacture &&
            countOrderDetails[i].categoryCylinder ==
              countOrderDetails[j].categoryCylinder &&
            countOrderDetails[i].valve &&
            countOrderDetails[i].valve == countOrderDetails[j].valve
          ) {
            return false;
          }
        } else if (type == "cylinder") {
          if (
            i !== j &&
            countOrderDetails[i].manufacture &&
            countOrderDetails[i].colorGas &&
            e.target.value == countOrderDetails[j].categoryCylinder &&
            countOrderDetails[i].manufacture ==
              countOrderDetails[j].manufacture &&
            countOrderDetails[i].valve == countOrderDetails[j].valve
          ) {
            return false;
          }
        } else if (type == "colorGas") {
          if (
            i !== j &&
            countOrderDetails[i].manufacture &&
            countOrderDetails[i].categoryCylinder &&
            countOrderDetails[i].valve &&
            e.target.value == countOrderDetails[j].colorGas &&
            countOrderDetails[i].manufacture ==
              countOrderDetails[j].manufacture &&
            countOrderDetails[i].categoryCylinder ==
              countOrderDetails[j].categoryCylinder &&
            countOrderDetails[i].valve == countOrderDetails[j].valve
          ) {
            return false;
          }
        } else {
          if (
            i !== j &&
            countOrderDetails[i].manufacture &&
            countOrderDetails[i].categoryCylinder &&
            countOrderDetails[i].colorGas &&
            e.target.value == countOrderDetails[j].valve &&
            countOrderDetails[i].manufacture ==
              countOrderDetails[j].manufacture &&
            countOrderDetails[i].categoryCylinder ==
              countOrderDetails[j].categoryCylinder &&
            countOrderDetails[i].colorGas == countOrderDetails[j].colorGas
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSelectChangeManufacture = (e, i, type) => {
    if (validate(e, i, type) == false) {
      e.target.value = "";
      ToastMessage("error", "Vui lòng không chọn trùng sản phẩm");
    }
    if (type == "manufacture") {
      let newArr = [...countOrderDetails];
      newArr[i].manufacture = e.target.value;
      setCountOrderDetails([...newArr]);
      setPrice(!price);
      let kt = true;
      if (e.target.value && countOrderDetails[i].categoryCylinder) {
        for (let j = 0; j < dsPrice.length; j++) {
          const dsDH = dsPrice[j].priceDetail.filter(
            (ele) =>
              ele.manufacture === e.target.value &&
              ele.categoryCylinder == countOrderDetails[i].categoryCylinder
          );
          if (dsDH.length >= 1) {
            kt = true;
            newArr[i].price = dsDH[0].price;
            setCountOrderDetails([...newArr]);
            break;
          } else {
            kt = false;
            newArr[i].price = "";
            setCountOrderDetails([...newArr]);
          }
        }
        if (kt === false) {
          ToastMessage("error", "Đơn hàng này chưa có giá");
        }
      }
    } else if (type == "cylinder") {
      let newArr = [...countOrderDetails];
      newArr[i].categoryCylinder = e.target.value;
      setCountOrderDetails([...newArr]);
      setPrice(!price);
      let kt = true;
      if (e.target.value && countOrderDetails[i].manufacture) {
        for (let j = 0; j < dsPrice.length; j++) {
          const dsDH = dsPrice[j].priceDetail.filter(
            (ele) =>
              ele.manufacture === countOrderDetails[i].manufacture &&
              ele.categoryCylinder == e.target.value
          );
          if (dsDH.length >= 1) {
            kt = true;
            newArr[i].price = dsDH[0].price;
            setCountOrderDetails([...newArr]);
            break;
          } else {
            kt = false;
            newArr[i].price = "";
            setCountOrderDetails([...newArr]);
          }
        }
        if (kt === false) {
          ToastMessage("error", "Đơn hàng này chưa có giá");
        }
      }
    } else if (type == "colorGas") {
      let newArr = [...countOrderDetails];
      newArr[i].colorGas = e.target.value;
      setCountOrderDetails([...newArr]);
    } else {
      let newArr = [...countOrderDetails];
      newArr[i].valve = e.target.value;
      setCountOrderDetails([...newArr]);
    }
  };

  const handleChangeQuantity = (e, i) => {
    let arr = [...countOrderDetails];
    arr[i].quantity = e.target.value;
    setCountOrderDetails([...arr]);
  };

  // Lấy giá
  const getPrice = (price, obj) => {
    for (let i = 0; i < price.length; i++) {
      for (let j = 0; j < price[i].priceDetail.length; j++) {
        if (
          obj.manufacture === price[i].priceDetail[j].manufacture &&
          obj.categoryCylinder === price[i].priceDetail[j].categoryCylinder
        ) {
          return price[i].priceDetail[j].price;
        }
      }
    }

    return 0;
  };

  // danh sách giá sản phẩm
  const handlePrice = (price) => {
    setDSPrice(price);
    // lấy giá mới sau khi đổi ngày khác
    let dsArr = [...countOrderDetails];
    if (price.length >= 1) {
      for (let k = 0; k < dsArr.length; k++) {
        let value = getPrice(price, dsArr[k]);
        if (value) {
          dsArr[k].price = value;
        }
      }
      setCountOrderDetails([...dsArr]);
    } else {
      dsArr[0].price = "";
      setCountOrderDetails([...dsArr]);
    }
  };

  const handleCreatOder = () => {  
      setClick(true);
  };
  const handleChangeCustomer = (customer) => {
    setNewCustomer(customer);
  };
  const handleSuplier = (idSuplier) => {
    setSupplier(idSuplier);
  };
  const handleChoseMV = () => {
    setCylingderType("VO");
    setOrderType("MUON_VO")
  };
  const handleChoseCV = () => {
    setCylingderType("VO");  
    setOrderType("COC_VO") 
  };
  const handleChoseDB = () => {
    setCylingderType("BINH");
    setOrderType("KHONG")
  };
 
  return (
    <React.Fragment>
      <Formik
        initialValues={{
          delivery: [{ deliveryAddress: "", deliveryDate: "" }],
          note: "",
          orderType: "",
          orderDetails: [
            {
              manufacture: "",
              categoryCylinder: "",
              colorGas: "",
              valve: "",
              quantity: "",
            },
          ],
          area: "",
          customers: "",
          supplier: "",
        }}
        // validate={validate}
        onSubmit={async (values, action) => {
          try {           
            let paramsObjectId;
            let idChildOf;
            let upDateValues;
            if (userRole === 1 || userRole === 2 || userRole === 7) {
              const idCustomer = await getUserCookies();
              

              if (idCustomer.user.userType === "Tong_cong_ty") {
                paramsObjectId = newCustomer;
                idChildOf = supplier;
              } else {
                paramsObjectId = idCustomer.user.id;
                idChildOf = idCustomer.user.isChildOf;
              }
              upDateValues = {
                ...values,
                ...valueOfUser,
                customers: paramsObjectId,
                orderType:orderType,
                supplier: idChildOf,
                orderDetails: countOrderDetails,
                placeOfDelivery: placeOfDelivery
              };


              if(!valueOfUser.area || valueOfUser.area === "") {
                upDateValues['area'] = location.area
              }

              if (createOrderDate && userRole === 2)
                upDateValues = { ...upDateValues, dateCreated: createOrderDate };
              const res = await orderManagement.createOrder(upDateValues);
              if (res) {
                if (res.success) {
                  ToastMessage("success", res.message);
                  // setCylingderType("");
                  action.resetForm();
                  handleResetForm();
                  setValueOfUser({
                    delivery: [
                      {
                        deliveryAddress: "",
                        deliveryDate: "",
                      },
                    ],
                    area: "",
                    orderType:"",
                    customers: "",
                    supplier: "",
                  });
                  // setOrderType("KHONG")
                  // send thông báo mobile
                   
                  let getDevice = await getIdDevice("Tong_cong_ty", "To_nhan_lenh");
                  if (getDevice) {
                    getDevice.data.data.map((item)=>{
                    let playId=item.playerID+","+item.playerIDWeb;
                    sendNotification(
                      "Đơn hàng mới",
                      res.data.orderCode,
                      playId,
                      res.data.id
                    );  
                    });
                  }
                  
                  
                  setIsReset(!isReset);
                } else {
                  
                  ToastMessage("error", "Thêm đơn hàng thất bại");
                }
              }
            } 
            else {
              upDateValues = {
                ...values,
                ...valueOfUser,
                placeOfDelivery: placeOfDelivery,
              };
              console.log("s",upDateValues);

              const res = await orderManagement.createOrder(upDateValues);
             
              if (res) {
                if (res.success) {
                  ToastMessage("success", res.message);
                  // setCylingderType("");
                  action.resetForm();
                  handleResetForm();
                  // setOrderType("KHONG")
                  setValueOfUser({
                    delivery: [
                      {
                        deliveryAddress: "",
                        deliveryDate: "",
                      },
                    ],
                    area: "",
                    orderType:"",
                    customers: "",
                    supplier: "",
                  });
                  // setOrderType("KHONG")
                  // setCylingderType("BINH");
                  setIsReset(!isReset);
                } else {
                  ToastMessage("error", "Thêm đơn hàng thất bại");
                }
              }
            }
          } catch (err) {
            action.resetForm();
            console.log(err);
          }
        }}


        validator={() => ({})}
      >
        {(formik) => {
          let handleRemoveOrderDetail = (i) => {
            //remove order detail
            let newOrderDetailArr = [...countOrderDetails];
            const valuesClone = [...formik.values.orderDetails];
            if (newOrderDetailArr.length > 1) {
              newOrderDetailArr.splice(i, 1);
              valuesClone.splice(i, 1);
              setCountOrderDetails(newOrderDetailArr);
              formik.setValues({
                ...formik.values,
                orderDetails: valuesClone,
              });
            }
          };
          if (formik.errors.isSame) {
            ToastMessage("error", formik.errors.isSame);

            formik.values.orderDetails[formik.touched.orderDetails.length - 1][
              "valve"
            ] = "";
            formik.setErrors({});
          }
          if (formik.errors.quantity) {
            ToastMessage("error", formik.errors.quantity.error);

            formik.values.orderDetails[formik.errors.quantity.position][
              "quantity"
            ] = "";
            formik.setErrors({});
          }

          return (
            <Form id="form-creat_order" className="create_order">
              <div className="order_container">
                <div className="order_title">
                  <h2>Tạo đơn hàng mới</h2>
                </div>
                <div className="create-order-icon">
                  <Link to="/orderManagement" className="link">
                    <AiOutlineClose> </AiOutlineClose>
                  </Link>
                </div>
                <form className="order_info_vobinh small">
                  <div>
                    <input
                      defaultChecked={true}
                      name="pos"
                      id="id-kh"
                      type="radio"
                      onChange={() => setPlaceOfDelivery("CUSTOMER")}
                    />
                    <label for="id-kh">Giao hàng ở địa chỉ khách</label>
                  </div>
                  <div>
                    <input
                      name="pos"
                      id="id-tram"
                      type="radio"
                      onChange={() => setPlaceOfDelivery("STATION")}
                    />
                    <label for="id-tram">Giao hàng ở trạm</label>
                  </div>
                </form>
                {userRole === 1 && (
                  <CustomerCreate
                    customer={customer}
                    handlePrice={handlePrice}
                    cylinderType={cylinderType}
                    // hadleNewPrice={handleGetNewPrice}
                    placeOfDelivery={placeOfDelivery}
                    countOrderDetails={countOrderDetails}
                    isReset={isReset}
                    valueOfUser={valueOfUser}
                    setValueOfUser={setValueOfUser}
                    valueDate={valueDate}
                    setValueDate={setValueDate}
                    handleChangeDate={handleChangeDate}
                    handleChangeAddress={handleChangeAddress}
                    clickCreateOrder={click}
                    orderArray={orderArray}
                    setOrderArray={setOrderArray}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    handleNewPrice={price}
                  />
                )}

                {userRole === 2 || userRole === 7 ? (
                  <AdminCreate
                    handlePrice={handlePrice}
                    cylinderType={cylinderType}
                    handleChangeCustomer={handleChangeCustomer}
                    handleSuplier={handleSuplier}
                    isReset={isReset}
                    valueOfUser={valueOfUser}
                    placeOfDelivery={placeOfDelivery}
                    setValueOfUser={setValueOfUser}
                    valueDate={valueDate}
                    setValueDate={setValueDate}
                    handleChangeDate={handleChangeDate}
                    handleChangeAddress={handleChangeAddress}
                    orderArray={orderArray}
                    setOrderArray={setOrderArray}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    userRole={userRole}
                    setCreateOrderDate={setCreateOrderDate}
                    createOrderDate={createOrderDate}
                    handleNewPrice={price}
                  />
                ) : (
                  ""
                )}
                {countOrderDetails.map((data, index) => (
                  <div key={index} className="order_info_detail">
                    <div
                      id={`${index}new_order`}
                      className="order_info_detail_value"
                    >
                      <div className="select-form ">
                        <Field
                          className={
                            data.manufacture == "" && click == true
                              ? "order_info_detail_title_thuonghieu error_form"
                              : "order_info_detail_title_thuonghieu"
                          }
                          name={`orderDetails[${index}].manufacture`}
                          as="select"
                          value={data.manufacture}
                          onChange={(e) =>
                            handleSelectChangeManufacture(
                              e,
                              index,
                              "manufacture"
                            )
                          }
                        >
                          <option value="">Chọn thương hiệu</option>
                          {menuFacture.map((d, i) => (
                            <option key={i} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </Field>
                        <p
                          className={
                            data.manufacture == "" && click == true
                              ? "msg-error actives"
                              : "msg-error"
                          }
                        >
                          Vui lòng chọn thương hiệu
                        </p>
                      </div>
                      <div className="select-form">
                        <Field
                          id={`test`}
                          className={
                            data.categoryCylinder == "" && click == true
                              ? "order_info_detail_title_loaibinh error_form"
                              : "order_info_detail_title_loaivan "
                          }
                          name={`orderDetails[${index}].categoryCylinder`}
                          as="select"
                          value={data.categoryCylinder}
                          onChange={(e) =>
                            handleSelectChangeManufacture(e, index, "cylinder")
                          }
                        >
                          <option value="">Chọn loại bình</option>
                          {category.map((d, i) => (
                            <option key={i} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </Field>
                        <p
                          className={
                            data.categoryCylinder == "" && click == true
                              ? "msg-error actives"
                              : "msg-error"
                          }
                        >
                          Vui lòng chọn loại bình
                        </p>
                      </div>
                      <div className="select-form">
                        <Field
                          className={
                            data.colorGas == "" && click == true
                              ? "order_info_detail_title_mausac error_form"
                              : "order_info_detail_title_mausac "
                          }
                          name={`orderDetails[${index}].colorGas`}
                          as="select"
                          value={data.colorGas}
                          onChange={(e) =>
                            handleSelectChangeManufacture(e, index, "colorGas")
                          }
                        >
                          <option value="">Chọn màu</option>
                          {colors.map((d, i) => (
                            <option key={i} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </Field>
                        <p
                          className={
                            data.colorGas == "" && click == true
                              ? "msg-error actives"
                              : "msg-error "
                          }
                        >
                          Vui lòng chọn màu
                        </p>
                      </div>
                      <div className="select-form">
                        <Field
                          className={
                            data.valve == "" && click == true
                              ? "order_info_detail_title_loaivan error_form"
                              : "order_info_detail_title_loaivan "
                          }
                          name={`orderDetails[${index}].valve`}
                          as="select"
                          value={data.valve}
                          onChange={(e) =>
                            handleSelectChangeManufacture(e, index, "valve")
                          }
                        >
                          <option className="cx-loai" value="">
                            Chọn loại van
                          </option>
                          {valves.map((d, i) => (
                            <option key={i} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </Field>
                        <p
                          className={
                            data.valve == "" && click == true
                              ? "msg-error actives"
                              : "msg-error "
                          }
                        >
                          Vui lòng chọn loại van
                        </p>
                      </div>
                      <div className="input-quantity">
                        <Field
                          className={
                            data.quantity == "" && click == true
                              ? "order_info_detail_title_soluong error_form"
                              : "order_info_detail_title_soluong "
                          }
                          type="number"
                          placeholder="Số lượng"
                          value={data.quantity}
                          onChange={(e) => handleChangeQuantity(e, index)}
                          name={`orderDetails[${index}].quantity`}
                          defaultChecked
                        />

                        <p
                          className={
                            data.quantity == "" && click == true
                              ? "msg-error actives"
                              : "msg-error "
                          }
                        >
                          Thêm số lượng
                        </p>
                      </div>
                      <div>
                        <input
                          className={
                            data.manufacture &&
                            data.categoryCylinder &&
                            data.price === "" &&
                            price === true
                              ? "input-price error_form"
                              : "input-price"
                          }
                          placeholder="Đơn giá"
                          disabled
                          value={data.price ? data.price : "Đơn giá"}
                        ></input>
                      </div>
                      <div className="icon-action-popup2">
                        {index === 0 ? (
                          <FaIcon.FaPlusCircle
                            className="icon-action icon-them"
                            onClick={() => handleAddOrder()}
                          />
                        ) : (
                          <FaIcon.FaMinusCircle
                            key={index}
                            className="icon-action icon-xoa"
                            onClick={() => handleOnClickXoa(index)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="order_info_vobinh">
                  <div>
                    <input
                      name="orderType"
                      type="radio"
                      value="BINH"
                      checked={orderType === "KHONG"}
                      onClick={() => handleChoseDB()}
                    />
                    <label>Đơn đổi vỏ</label>
                  </div>
                  <div>
                    <input
                      name="orderType"
                      type="radio"
                      value="COC_VO"
                      checked={orderType === "COC_VO"}
                      onClick={() => handleChoseCV()}
                    />
                    <label>Đơn cọc vỏ</label>
                  </div>
                  <div>
                    <input
                      name="orderType"
                      type="radio"
                      value="MUON_VO"
                      checked={orderType === "MUON_VO"}
                      onClick={() => handleChoseMV()}
                    />
                    <label>Đơn mượn vỏ</label>
                  </div>
                </div>
                <div className="order_ghichu">
                  <Field
                    as="textarea"
                    name="note"
                    placeholder="Ghi chú"
                  ></Field>
                </div>
                <div className="btn-container">
                  <button
                    type="submit"
                    className="btn-create-new-order"
                    onClick={() => handleCreatOder()}
                  >
                    Tạo đơn hàng
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <ToastContainer />
    </React.Fragment>
  );
};

export default CreateOrderNew;
