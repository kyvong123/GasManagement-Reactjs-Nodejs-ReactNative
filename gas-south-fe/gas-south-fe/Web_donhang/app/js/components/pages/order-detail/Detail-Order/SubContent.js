import React, { useContext } from "react";
import styled from "styled-components";
import getUserCookies from "getUserCookies";
import InputReason from "./InputReason";
import { useEffect, useState } from "react";
import { InforOrderContex } from "../shippingContext";
import orderManagement from "../../../../../api/orderManagementApi";



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
const SubContent = ({ status, datadetail, id }) => {
  const [deliveredNotQuantity, setDeliveredNotQuantity] = useContext(
    InforOrderContex
  );
  const [deliveryed, setDelivery] = useState([]);

  const [userType, setUserType] = useState("");

  //Quantity not delivered
  const totalQuanDelivered = deliveredNotQuantity.reduce(
    (total, curr) => total + curr.count,
    0
  );

  useEffect(() => {
    const getUser = async () => {
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserType(user_cookie.user.userType);
        let data = await orderManagement.getDriverInfor(id);
        if (data.success) {
          let ship = 0;
          data.data.map((item) => {
            if (item.shippingType === "GIAO_HANG"){
              const getData = async () => {
                let dataInfo = await orderManagement.getShippingInfor(item.id);
                if (
                  dataInfo.success &&
                  dataInfo.data &&
                  dataInfo.data.length > 0
                ) {
                  setDelivery(dataInfo.data)
                }
              };
              getData();
            } 
          });
          
        }
        } else {
          console.log("error user_cookie");
        }
    };
    getUser();  
  },[]);


  

  const sortProduct = (list) => {
    let value = list.sort((a, b) => {
      const va = a.manufacture.name; // + " " + a.categoryCylinder.name;
      const vb = b.manufacture.name; // + " " + b.categoryCylinder.name;
      const res = va.localeCompare(vb);
      return res;
    });

    value = value.sort((a, b) => {
      
      if(a.manufacture.name !== b.manufacture.name) return 0;

      const va = a.categoryCylinder.name;
      const vb = b.categoryCylinder.name;
      const res = va.localeCompare(vb);
      console.log(res, va, vb);
      return res;
    })

    return value
  }

  const renderProduct = () => {
    if(!datadetail) return [];

    return sortProduct(datadetail)
      .map((product) => {
        return (
          <ContainerDetail>
            <h4>
              THƯƠNG HIỆU: {product.manufacture.name} - LOẠI:{" "}
              {product.categoryCylinder.name}
              {userType === "Tram" || userType === "Factory"
                ? ""
                : ` - ĐƠN GIÁ: ${
                    product.price
                      ? product.price.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "Chưa có đơn giá"
                  }`}
              {/* {product.price
              ? product.price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              : "Chưa có đơn giá"} */}
            </h4>
            <div className="row">
              <div className="col-md-2">
                <span className="font-medium small-font ">
                  Màu: {product.colorGas.name}
                </span>
              </div>
              <div className="col-md-2">
                <span className="font-medium small-font ">
                  Van: {product.valve.name}
                </span>
              </div>
              <div className="col-md-2">
                <span className="font-medium small-font ">
                  Số lượng: {product.quantity}
                </span>
              </div>
              {userType === "Tram" || userType === "Factory" ? (
                ""
              ) : (
                <div className="col-md-6">
                  <span className="font-medium small-font ">
                    Thành tiền:{" "}
                    {product.price
                      ? (product.price * product.quantity).toLocaleString(
                          "it-IT",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )
                      : "Chưa có đơn giá"}
                  </span>
                </div>
              )}
            </div>
          </ContainerDetail>
        );
      });
  };
  // console.log(datadetail[1].quantity)
  const totalValue = () => {
    let total = 0;
    if (datadetail) {
      for (let i = 0; i < datadetail.length; i++) {
        total = total + datadetail[i].quantity;
      }
    }
    return total;
  };
  const totalTong = () => {
    let total = 0;
    if (datadetail) {
      for (let i = 0; i < datadetail.length; i++) {
        total = total + datadetail[i].price * datadetail[i].quantity;
      }
    }
    return total.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
  };

 

  // useEffect(()=>{
  //   setData(()=>{
  //     return {
  //       sum: 451,
  //     }
  //   });
  // });

  return (
    <Wrapper>
      <Header>
        <h3 style={{color:"#e80909"}}>Thông tin đặt hàng:</h3>
        <span>Số lượng: {totalValue().toLocaleString()}</span>
        {userType === "Tram" || userType === "Factory" ? (
          ""
        ) : (
          <span>Tổng: {totalTong()}</span>
        )}
        <span>Số lượng chưa giao: {(totalValue()-(deliveryed.reduce((total, curr)=>total + curr.count,0))).toLocaleString()}  </span>
      </Header>
      {renderProduct()}
      {/* {status=="GUI_DUYET_LAI"?<InputReason/>:""} */}
    </Wrapper>
  );
};

export default SubContent;
