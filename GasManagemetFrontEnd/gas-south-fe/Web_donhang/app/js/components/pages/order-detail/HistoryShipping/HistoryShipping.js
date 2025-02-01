import React, { Fragment, useEffect, useState, useContext } from "react";
import { MdLocalShipping } from "react-icons/md";
import moment from "moment";
import "./HistoryShipping.scss";
import orderManagement from "../../../../../api/orderManagementApi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {InforOrderContex} from '../shippingContext';

export default function HistoryShipping({ id, data}) {
  const [inforDriver, setInforDriver] = useState([]);

  const [inforShippingBinh, setInforShippingBinh] = useState([]);
  const [inforShippingVo, setInforShippingVo] = useState([]);
  const [inforRefluxBinh, setInforRefluxBinh] = useState([]);
  const [inforRefluxVo, setInforRefluxVo] = useState([]);
  const [inforRefluxKhac, setInforRefluxKhac] = useState([]);

  const [showList, SetShowList] = useState(false);
  const [deliveredNotQuantity, setDeliveredNotQuantity] = useContext(InforOrderContex);

  useEffect(() => {
    setDeliveredNotQuantity(inforShippingVo)
  },[inforShippingVo])
  useEffect(() => { 
    try {
      const getInfor = async () => {
        let dataArray = [];
        let data = await orderManagement.getDriverInfor(id);
        if (data.success && data.data.length > 0) {

          setInforDriver(data.data);
          dataArray = [...data.data];
          // for(const i of dataArray){

          // }
          dataArray.map((item) => {
            if (item.shippingType === "GIAO_HANG") {
              const getData = async () => {
                let dataInfo = await orderManagement.getShippingInfor(item.id);
                if (
                  dataInfo.success &&
                  dataInfo.data &&
                  dataInfo.data.length > 0
                ) {
                  setInforShippingBinh(dataInfo.data);
                }
              };
              getData();
            } else if (item.shippingType === "TRA_BINH_DAY") {
              const getData = async () => {
                let dataInfo = await orderManagement.getShippingInfor(item.id);
                if (
                  dataInfo.success &&
                  dataInfo.data &&
                  dataInfo.data.length > 0
                ) {
                  setInforRefluxBinh(dataInfo.data);
                }
              };
              getData();
            } else if (item.shippingType === "GIAO_VO") {
              const getData = async () => {
                let dataInfo = await orderManagement.getShippingInfor(item.id);
                if (
                  dataInfo.success &&
                  dataInfo.data &&
                  dataInfo.data.length > 0
                ) {
                  setInforShippingVo(dataInfo.data);
                }
              };
              getData();
            } else if (item.shippingType === "TRA_VO") {
              const getData = async () => {
                let dataInfo = await orderManagement.getShippingInfor(item.id);
                if (
                  dataInfo.success &&
                  dataInfo.data &&
                  dataInfo.data.length > 0
                ) {
                  setInforRefluxVo(dataInfo.data);
                }
              };
              getData();
            } else if (item.shippingType === "TRA_VO_KHAC") {
              const getData = async () => {
                let dataInfo = await orderManagement.getShippingInfor(item.id);
                if (
                  dataInfo.success &&
                  dataInfo.data &&
                  dataInfo.data.length > 0
                ) {
                  setInforRefluxKhac(dataInfo.data);
                }
              };
              getData();
            }
          });
        }
      };
      getInfor();
    } catch (error) {
      console.log(error);
    }
  }, []);


  


  const handleShowList = () => {
    SetShowList(!showList);
    
  };
  if (inforDriver && inforDriver.length > 0) {
    return (
      <div className="history-shipping mt-3 mb-3">
        <div
          className="header-content d-flex align-content-center"
          style={{ gap: "5px" }}
        >
          <div className="icon">
            <MdLocalShipping />
          </div>
          <div
            className="d-flex align-content-center justify-content-between"
            style={{ width: "100%" }}
          >
            <h4 className="shipping-title">Lịch sử giao nhận</h4>
            <div
              onClick={() => handleShowList()}
              style={{
                cursor: "pointer",
                fontSize: "18px",
                paddingTop: "10px",
              }}
            >
              {showList ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
        </div>
        {showList ? (
          <div className="history-wrapper">
            <div className="history-delivery row">
              {inforDriver.map((driver, index) => (
                <div className="col-6 content-shipping" key={index}>
                  <h4>Tài xế: {driver.driverName}</h4>
                  <h5 className="heading-shipping">
                    Biển số xe: {driver.transport} ---
                    {moment(driver.createdAt).format("HH:mm - DD/MM/YYYY")}
                  </h5>
                  {data.orderType === "DON_BINH" &&
                  driver.shippingType === "GIAO_HANG" ? (
                    <div className="detail-shipping">
                      <h4>
                        Thông tin giao hàng: Số lượng:{" "}
                        {inforShippingBinh &&
                          inforShippingBinh.reduce(
                            (total, curr) => total + curr.count,
                            0
                          )}
                      </h4>
                      <div>
                        {inforShippingBinh &&
                          inforShippingBinh.map((item, i) => (
                            <div className="detail-delivery" key={i}>
                              <span>
                                {item._id.manufactureName} - {item._id.name}
                              </span>
                              <span className="sup_detail">
                                Màu: {item._id.color} - Van: {item._id.valve} -
                                Số lượng: {item.count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : driver.shippingType === "TRA_VO" ? (
                    <div className="detail-shipping">
                      <h4>
                        Thông tin trả vỏ: Số lượng:{" "}
                        {inforRefluxVo &&
                          inforRefluxVo.reduce(
                            (total, curr) => total + curr.count,
                            0
                          )}
                      </h4>
                      <div>
                        {inforRefluxVo &&
                          inforRefluxVo.map((item, i) => (
                            <div className="detail-delivery" key={i}>
                              <span>
                                {item._id.manufactureName} - {item._id.name}
                              </span>
                              <span className="sup_detail">
                                Màu: {item._id.color} - Van: {item._id.valve} -
                                Số lượng: {item.count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : driver.shippingType === "TRA_BINH_DAY" ? (
                    <div className="detail-shipping">
                      <h4>
                        Hồi lưu bình đầy: Số lượng:{" "}
                        {inforRefluxBinh &&
                          inforRefluxBinh.reduce(
                            (total, curr) => total + curr.count,
                            0
                          )}
                      </h4>
                      <div>
                        {inforRefluxBinh &&
                          inforRefluxBinh.map((item, i) => (
                            <div className="detail-delivery" key={i}>
                              <span>
                                {item._id.manufactureName} - {item._id.name}
                              </span>
                              <span className="sup_detail">
                                Màu: {item._id.color} - Van: {item._id.valve} -
                                Số lượng: {item.count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : driver.shippingType === "TRA_VO_KHAC" ? (
                    <div className="detail-shipping">
                      <h4>
                        Trả vỏ khác: Số lượng:{" "}
                        {inforRefluxKhac &&
                          inforRefluxKhac.reduce(
                            (total, curr) => total + curr.count,
                            0
                          )}
                      </h4>
                      <div>
                        {inforRefluxKhac &&
                          inforRefluxKhac.map((item, i) => (
                            <div className="detail-delivery" key={i}>
                              <span>
                                {item._id.manufactureName} - {item._id.name}
                              </span>
                              <span className="sup_detail">
                                Màu: {item._id.color} - Van: {item._id.valve} -
                                Số lượng: {item.count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : driver.shippingType === "GIAO_VO" ? (
                    <div className="detail-shipping">
                      <h4>
                        Thông tin giao vỏ: Số lượng:{" "}
                        {inforShippingVo &&
                          inforShippingVo.reduce(
                            (total, curr) => total + curr.count,
                            0
                          )}
                      </h4>
                      <div>
                        {inforShippingVo &&
                          inforShippingVo.map((item, i) => (
                            <div className="detail-delivery" key={i}>
                              <span>
                                {item._id.manufactureName} - {item._id.name}
                              </span>
                              <span className="sup_detail">
                                Màu: {item._id.color} - Van: {item._id.valve} -
                                Số lượng: {item.count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
  return "";
}
