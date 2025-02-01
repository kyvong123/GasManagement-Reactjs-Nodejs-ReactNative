import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import InputReason from "../Detail-Order/InputReason";
import { Formik, Form, Field } from "formik";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createOrderFetch } from "../../../hooks/createOrderFetch";
import { toast } from "react-toastify";
import orderManagement from "../../../../../api/orderManagementApi";
import sendNotification from "../../../../../api/sendNotification";
import ToastMessage from "../../../../helpers/ToastMessage";
import callApi from "../../../../util/apiCaller";
import getUserCookies from "getUserCookies";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Toast from "../../../../helpers/ToastMessage";
import { SERVERAPI } from "../../../../config/config";
import "./UpdateOrderDDT.css"
import { themeContext } from "../../orderManagement/context/Provider";

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
const ContainerDetail = styled.div`
  margin-bottom: 6px;
  margin-left: 8px;
  h4 {
    font-size: 18px;
    margin-bottom: 6px;
    font-weight: 700;
  }
  .list {
    display: flex;
    column-gap: 55px;
    span {
      font-weight: 400;
      color: black;
      font-size: 18px;
    }
  }
`;
const UpdateOrderWrapper = styled.div`
  display: flex;
  column-gap: 30px;
  margin-left: 0;
  .order-item {
    font-weight: 500;
    width: 125px;
    height: 35px;
    border: 2px solid black;
    border-radius: 5px;
    padding: 2px 4px;
  }
  .order-item:last-child {
    padding-left: 8px;
  }
`;
const UpdateOrderDDT = ({
  status,
  datadetail,
  data,
  setIsUpdate,
  setDataOrder,
}) => {
  const { valves, colors } = createOrderFetch();

  // id: string,
  // quantity: number,
  // manufacture: string, /// thương hiệu
  // categoryCylinder: string, // loại bình
  // colorGas: string, // màu bình
  // valve: string, // loại van gas
  const [orderItems, setOrderItems] = useState([]);
  const [devicePlayId, setDevicePlayId] = useState("");


  const valueContext = useContext(themeContext);


  useEffect(() => {
    setDevicePlayId(data.customers.playerID + "," + data.customers.playerIDWeb);
    setOrderItems((preState) => {
      return datadetail.map((order) => {
        return {
          id: order.id,
          quantity: order.quantity,
          quantityOld: order.quantity,
          manufactureName: order.manufacture.name,
          manufacture: order.manufacture.id,
          categoryCylinder: order.categoryCylinder.name,
          categoryCylinderId: order.categoryCylinder.id,
          colorGas: order.colorGas.id,
          valve: order.valve.id,
          price: order.price,
        }
      });
    });
  }, [datadetail]);


  const [countDataDetails, setCountDataDetails] = useState(() => {
    const orderDetails = [];
    datadetail.forEach((order) => {
      orderDetails.push({
        id: order.id,
        quantity: order.quantity,
        manufactureName: order.manufacture.name,
        manufacture: order.manufacture.id,
        categoryCylinder: order.categoryCylinder.name,
        colorGas: order.colorGas.id,
        valve: order.valve.id,
      });
    });
    return orderDetails
  });
  const [listData, setListData] = useState(countDataDetails);
  const [initialValues, setInitialValues] = useState(() => {
    const orderDetails = [];
    listData.forEach((order) => {
      orderDetails.push({
        id: order.id,
        quantity: order.quantity,
        manufacture: order.manufacture,
        categoryCylinder: order.categoryCylinder,
        colorGas: order.colorGas,
        valve: order.valve,
      });
    });
    return {
      orderDetail: orderDetails,
    };
  });
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
  const handleAddOrder = (id) => {

    setOrderItems(preState => {
      const currentOrderItem = preState.find((item) => item.id === id);

      const newOrderItem = {
        ...currentOrderItem,
        id: `newOrderItem_${uuidv4()}`,
        quantity: 0,
        colorGas: "",
        valve: "",
      }

      const newState = [
        ...preState,
        newOrderItem
      ];

      return newState;
    });

  };
  const handleDeleteOrder = (id) => {
    setOrderItems(preState => {
      return preState.filter(item => {
        return item.id !== id;
      });
    });
  };
  const handleInputQuantityChange = (index, e) => {
    let quantity = parseInt(e.currentTarget.value);
    if (quantity < 0) {
      ToastMessage("error", " Số lượng không được âm!  ");
      return;
    }
    let total = 0;
    let arr = [...orderItems];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].manufacture === arr[index].manufacture
        && arr[i].categoryCylinderId === arr[index].categoryCylinderId
        && i != index) {
        total = total + arr[i].quantity;
      }
    }
    let sum2 = 0
    datadetail.map((item) => {
      if (item.manufacture.id === arr[index].manufacture
        && item.categoryCylinder.id === arr[index].categoryCylinderId) {
        sum2 = sum2 + item.quantity;
      }
    });
    if (total + quantity > sum2) {
      ToastMessage("error", " Số lượng không hợp lý !  ");
      return;
    };
    setOrderItems(preState => {

      const newState = [
        ...preState,
      ];
      newState[index].quantity = quantity;
      return newState;
    });

  }
  const handleValveChange = (index, e) => {

    let valve = (e.currentTarget.value).toString();

    setOrderItems(preState => {

      const newState = [
        ...preState,
      ];
      let arr = newState.filter((item) => {
        return item.colorGas === newState[index].colorGas && item.categoryCylinderId === newState[index].categoryCylinderId
          && item.manufacture === newState[index].manufacture && item.valve === valve;
      })
      if (arr.length > 0) {
        ToastMessage("error", "Không chọn trùng Sản phẩm");
        newState[index].valve = "";
        return newState
      }
      newState[index].valve = valve;

      return newState;
    });
  }

  const handleColorChange = (index, e) => {

    let colorGas = (e.currentTarget.value).toString();

    setOrderItems(preState => {

      const newState = [
        ...preState,
      ];
      let arr = newState.filter((item) => {
        return item.colorGas === colorGas && item.categoryCylinderId === newState[index].categoryCylinderId
          && item.manufacture === newState[index].manufacture && item.valve === newState[index].valve;
      })
      if (arr.length > 0) {
        ToastMessage("error", "Không chọn trùng sản phẩm");
        newState[index].colorGas = "";
        return newState

      }

      newState[index].colorGas = colorGas;

      return newState;
    });
  }



  const validate = (values) => {
    const errors = {};
    if (values.orderDetail) {
      for (var i = 0; i < values.orderDetail.length; i++) {
        for (var j = i + 1; j < values.orderDetail.length; j++) {
          if (
            values.orderDetail[i].manufacture ===
            values.orderDetail[j].manufacture &&
            values.orderDetail[i].categoryCylinder ===
            values.orderDetail[j].categoryCylinder &&
            values.orderDetail[i].colorGas === values.orderDetail[j].colorGas &&
            values.orderDetail[i].valve === values.orderDetail[j].valve
          ) {
            let position = i;
            if (j === values.orderDetail.length - 1) {
              position = j;
            }
            errors.isSame = {
              nameError: "Vui lòng không chọn trùng loại sản phẩm ",
              position: position,
            };
          }
        }

      }
    }

    return errors;
  };
  const updateOrder = async (idDetail, idOrder, body) => {
    try {
      const token = await getUserCookies();
      const UserID = token.user.id;
      const url = `${SERVERAPI}orderDetail/update`;

      const res = await axios.put(url, body, {
        headers: {
          Authorization: "Bearer " + token.token
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
  }
  const updateOrderNew = async (body) => {
    try {
      const token = await getUserCookies();

      const url = `${SERVERAPI}orderDetail/createOrderDetail`;

      const res = await axios.post(url, body, {
        headers: {
          Authorization: "Bearer " + token.token
        },
      });
      if (res) {
        console.log(res);
      }
      return res;

    } catch (error) {
      console.log(error);
    }
  }

  const sendOrder = async (idOrder, note) => {
    try {
      let user_cookies = await getUserCookies();
      if (!user_cookies) {
        return;
      }
      const url = `${SERVERAPI}orderGS/acpOrderdieudotramguicomplete`;
      const res = await axios.put(url, note, {
        headers: {
          Authorization: "Bearer " + user_cookies.token
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

  const renderProduct = () => {
    return (
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values) => {
          let isEmp = false;
          orderItems.map((item) => {
            if (item.colorGas == "" || item.valve == "") {
              isEmp = true;
            }
          })
          if (isEmp) {
            ToastMessage("error", "Nhập đầy đủ thông tin");
          } else {
            let isCheckVersion = await checkVersion();
            if (isCheckVersion == data.updatedAt) {
              if (totalValue(datadetail) === totalValue(orderItems)) {
                orderItems.map((item) => {
                  let body = {
                    orderGSId: data.id,
                    manufacture: item.manufacture,
                    categoryCylinder: item.categoryCylinderId,
                    colorGas: item.colorGas,
                    valve: item.valve,
                    quantity: item.quantity,
                    price: item.price,
                  }
                  if (item.id.includes("newOrderItem_")) {

                    updateOrderNew(body);

                  } else {

                    updateOrder(item.id, data.id, body);
                  }
                });

                await sendOrder(data.id, {
                  note:
                    "Điều độ trạm gửi xác nhận\n" +
                    document.getElementById("_note-text").textContent,
                });
                sendNotification(
                  "Bạn có đơn hàng cần xác nhận lại !",
                  data.orderCode,
                  devicePlayId,
                  data.id
                );
                ToastMessage("success", "Điều độ trạm gửi thành công");
                location.reload();

              } else {
                ToastMessage("error", "Nhập giá trị không hợp lí !");
              }
            } else {
              ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
              location.reload();
            }

          }



        }}
      >
        {(formik) => {
          if (formik.errors.isSame) {
            ToastMessage("error", formik.errors.isSame.nameError);

            formik.values.orderDetail[formik.errors.isSame.position]["valve"] =
              "";
            formik.setErrors({});
          }

          if (formik.errors.quantity) {
            ToastMessage("error", formik.errors.quantity.error);

            formik.values.orderDetail[formik.errors.quantity.position][
              "quantity"
            ] = "";
            formik.setErrors({});
          }
          return (
            <Form id="formDDT">

              {orderItems.map((product, index) => {
                return (
                  <ContainerDetail>
                    <h4>
                      THƯƠNG HIỆU:
                      {product.manufactureName} - LOẠI:{" "}
                      {product.categoryCylinder} - Tổng: {product.quantityOld}
                    </h4>
                    <div className="row ">
                      <div className="col-md-6">
                        <UpdateOrderWrapper className="row ">
                          <div className="">
                            <select
                              as="select"
                              className="order-item"
                              name={`orderDetail[${index}].colorGas`}
                              onChange={(e) => handleColorChange(index, e)}
                              style={index < datadetail.length ? (datadetail[index].colorGas.id == product.colorGas ? { color: "black" } : { color: "blue" }) : ({ color: "blue" })}
                            >
                              <option
                                value=""
                                selected={product.colorGas == ""}
                              >
                                Chọn màu bình
                              </option>
                              {
                                colors.map((color) => (
                                  <option
                                    key={color.id}
                                    value={color.id}
                                    selected={product.colorGas === color.id}
                                  >
                                    {color.name}
                                  </option>
                                ))
                              }


                            </select>
                            <p
                              className={product.colorGas == "" ? "mess-err" : "mes-hide"}
                            >
                              Vui lòng chọn màu khác
                            </p>
                          </div>
                          <div className="">
                            <select
                              as="select"
                              className="order-item"
                              name={`orderDetail[${index}].valve`}
                              style={index < datadetail.length ? (datadetail[index].valve.id == product.valve ? { color: "black" } : { color: "blue" }) : ({ color: "blue" })}

                              onChange={(e) => handleValveChange(index, e)}
                            >
                              <option
                                value=""
                                selected={product.valve == ""}
                              >

                                Chọn loại van
                              </option>
                              {
                                valves.map((valve) => (
                                  <option
                                    key={valve.id}
                                    value={valve.id}
                                    selected={product.valve === valve.id}
                                  >
                                    {valve.name}
                                  </option>
                                ))
                              }


                            </select>
                            <p
                              className={product.valve == "" ? "mess-err" : "mes-hide"}
                            >
                              Vui lòng chọn Van khác
                            </p>
                          </div>
                          <div className="">
                            <input
                              className="order-item"
                              type="number"
                              placeholder="Số lượng"
                              name={`orderDetail[${index}].quantity`}
                              defaultValue={product.quantity}
                              value={product.quantity}
                              style={index < datadetail.length ? (datadetail[index].quantity == product.quantity ? { color: "black" } : { color: "blue" }) : ({ color: "blue" })}

                              onChange={(e) => handleInputQuantityChange(index, e)}
                            />
                          </div>
                        </UpdateOrderWrapper>
                      </div>
                      {index < datadetail.length ?
                        (<div
                          className="order_info_address_add"
                          onClick={() => handleAddOrder(product.id)
                          }
                        >
                          <FaPlus />
                        </div>)
                        :
                        (
                          <div
                            className="order_info_address_add"
                            onClick={() => handleDeleteOrder(product.id)
                            }
                          >
                            <FaMinus />
                          </div>
                        )
                      }


                    </div>
                  </ContainerDetail>
                );
              })}
            </Form>
          );
        }}
      </Formik>
    );
  };


  const totalValue = (listOrder) => {
    let total = 0;
    for (let i = 0; i < listOrder.length; i++) {
      total = total + listOrder[i].quantity;
    }
    return total;
  };

  return (
    <Wrapper>
      <Header>
        <h3>Thông tin đặt hàng:</h3>
        <span>Số lượng: {totalValue(datadetail)}</span>
      </Header>
      {renderProduct()}
      {status == "GUI_DUYET_LAI" ? <InputReason /> : ""}
    </Wrapper>
  );
};

export default UpdateOrderDDT;
