import "./Index.scss";
import * as xlsx from "xlsx";
//api
import api from "./API";
import axios from "axios";
import { GET_STATISTICSELL } from "../../../config/config";

//library
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import getUserCookies from "../../../helpers/getUserCookies";
import getAllStatisticSell from "../../../../api/getAllStatisticSell";
import Moment from "moment";
import ModalFilterShip from "./ModalFilterShip";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { createDownLoadData } from "./ExportExcel";

import "./ModalFilterShip.scss";
//icon
import { FaFilter } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";

import TableExcel from "./Table";
import Spin from "antd/lib/spin";
function OrderStatistics() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [station, setStation] = useState("");
  const [areaId, setAreaId] = useState("");
  const [customerTypeId, setCustomerTypeId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState("");

  const [listData, setListData] = useState([]);
  const [shipBinh, setShipBinh] = useState([]);
  const [shipVo, setShipVo] = useState([]);
  const [fluxVo, setFluxVo] = useState([]);
  const [fluxKhac, setFluxKhac] = useState([]);
  const [fluxBinh, setFluxBinh] = useState([]);
  const tableHead = ["Thương hiệu", "Loại bình", "Số lượng", "LPG(Kg)"];
  const [dateStart, setDateStart] = useState(
    Moment()
      .format()
      .slice(0, 10)
  );
  const [dateEnd, setDateEnd] = useState(
    Moment()
      .add(1, "days")
      .format()
      .slice(0, 10)
  );
  useEffect(() => {
    const getuserInfo = async () => {
      let user_Cookies = await getUserCookies();
      if (user_Cookies) {
        setUserType(user_Cookies.user.userType);
        setUserRole(user_Cookies.user.userRole);
        setUserId(user_Cookies.user.id);
        if (user_Cookies.user.userRole === "Dieu_do_tram") {
          setStation(user_Cookies.user.isChildOf);
        }
      }
    };
    getuserInfo();
  }, []);

  const renderData = async (
    dateStart,
    dateEnd,
    userRole,
    userType,
    station,
    userId
  ) => {
    setLoading(true);
    console.log("load");
    const res = await getAllStatisticSell(
      dateStart,
      dateEnd,
      userRole,
      userType,
      station,
      userId
    );
    console.log("done");
    setLoading(false);
    getData(res.data);
  };

  useEffect(() => {
    const getUser = async () => {
      let user_Cookies = await getUserCookies();
      if (user_Cookies) {
        if (
          user_Cookies.user.userType === "Agency" ||
          user_Cookies.user.userType === "General"
        ) {
          renderData(
            dateStart,
            dateEnd,
            user_Cookies.user.userRole,
            user_Cookies.user.userType,
            user_Cookies.user.isChildOf,
            user_Cookies.user.id
          );
        } else {
          if (user_Cookies.user.userRole === "Dieu_do_tram") {
            if (customerId) {
              renderData(
                dateStart,
                dateEnd,
                "SuperAdmin",
                "General",
                user_Cookies.user.isChildOf,
                customerId
              );
            } else {
              setLoading(true);
              let res = await axios.get(
                GET_STATISTICSELL +
                `?fromDate=${dateStart}&toDate=${dateEnd}&stationId=${user_Cookies.user.isChildOf}`,
                {
                  headers: {
                    Authorization: "Bearer " + user_Cookies.token,
                  },
                }
              );
              getData(res.data);
              setLoading(false);
            }
          } else {
            if (customerId) {
              renderData(
                dateStart,
                dateEnd,
                "SuperAdmin",
                "General",
                station,
                customerId
              );
            } else {
              if (station) {
                setLoading(true);
                let res = await axios.get(
                  GET_STATISTICSELL +
                  `?fromDate=${dateStart}&toDate=${dateEnd}&stationId=${station}`,
                  {
                    headers: {
                      Authorization: "Bearer " + user_Cookies.token,
                    },
                  }
                );
                getData(res.data);
                setLoading(false);
              } else {
                setLoading(true);
                let res = await axios.get(
                  GET_STATISTICSELL +
                  `?fromDate=${dateStart}&toDate=${dateEnd}`,
                  {
                    headers: {
                      Authorization: "Bearer " + user_Cookies.token,
                    },
                  }
                );
                getData(res.data);
                setLoading(false);
              }
            }
          }
        }
      }
    };
    getUser();
  }, [dateStart, dateEnd]);
  const handleChangeDateStart = (e) => {
    let dateEnd = Moment(e)
      .endOf("months")
      .format()
      .slice(0, 10);
    setDateStart(e);
    setDateEnd(dateEnd);
  };
  const handleChangeDateEnd = (e) => {
    setDateEnd(e);
  };
  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));
  const handleChangeTime = (index) => {
    if (index === activeIndex) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
    if (index === 0) {
      if (isActive) {
        setDateEnd(
          Moment()
            .add(1, "days")
            .format()
            .slice(0, 10)
        );
        setDateStart(
          Moment()
            .format()
            .slice(0, 10)
        );
      }
    }
    if (index === 1) {
      if (isActive) {
        setDateEnd(
          Moment()
            .endOf("isoWeeks")
            .format()
            .slice(0, 10)
        );
        setDateStart(
          Moment()
            .startOf("isoWeeks")
            .format()
            .slice(0, 10)
        );
      }
    }
    if (index === 2) {
      if (isActive) {
        setDateEnd(
          Moment()
            .endOf("months")
            .format()
            .slice(0, 10)
        );
        setDateStart(
          Moment()
            .startOf("months")
            .format()
            .slice(0, 10)
        );
      }
    }
    // if (index === 0) {
    //   if (isActive) {
    //     setDateEnd(
    //       Moment()
    //         .add(1, "days")
    //         .format()
    //         .slice(0, 10)
    //     );
    //     setDateStart(
    //       Moment()
    //         .format()
    //         .slice(0, 10)
    //     );
    //   }
    // }
    if (index === 3) {
      if (isActive) {
        setDateEnd(
          Moment()
            .subtract(1, "months")
            .endOf("months")
            .format()
            .slice(0, 10)
        );
        setDateStart(
          Moment()
            .startOf("months")
            .subtract(1, "months")
            .format()
            .slice(0, 10)
        );
      }
    }
  };
  const handleFilter = async () => {
    setOpenModal(true);
    if (userType === "Agency" || userType === "General") {
      renderData(dateStart, dateEnd, userRole, userType, station, userId);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const getData = (data) => {
    setListData(data.data);
    if (data) {
      setShipBinh(
        data.data.filter((ele) => ele._id.shippingType === "GIAO_HANG")
      );

      setFluxVo(data.data.filter((ele) => ele._id.shippingType === "TRA_VO"));
      setShipVo(data.data.filter((ele) => ele._id.shippingType === "GIAO_VO"));
      setFluxBinh(
        data.data.filter((ele) => ele._id.shippingType === "TRA_BINH_DAY")
      );
      setFluxKhac(
        data.data.filter((ele) => ele._id.shippingType === "TRA_VO_KHAC")
      );
    }
  };
  const HandleExportExcel = (data) => {
    // const table = document.getElementById("my-table-id");
    // const wb = xlsx.utils.table_to_book(table);
    // xlsx.writeFile(wb, "SheetJSTable.xlsx");
    // console.log(wb);
    // console.log("SSSSSSS:",data);
    createDownLoadData(data);
  };
  return (
    <div className="order-statistics">
      <div className="order-statistics container">
        <div className="row">
          <div className="content mt-2 " style={{ padding: "0 20px" }}>
            <div className="container">
              <div className="content-header d-flex">
                <div className="btn-change-time col-6 d-flex">
                  <button
                    className={`item col  ${activeIndex === 0 ? "active" : null
                      }`}
                    onClick={() => handleChangeTime(0)}
                  >
                    Hôm nay
                  </button>
                  <button
                    className={`item col  ${activeIndex === 1 ? "active" : null
                      }`}
                    onClick={() => handleChangeTime(1)}
                  >
                    Tuần này
                  </button>
                  <button
                    className={`item col  ${activeIndex === 2 ? "active" : null
                      }`}
                    onClick={() => handleChangeTime(2)}
                  >
                    Tháng này
                  </button>
                  <button
                    className={`item col  ${activeIndex === 3 ? "active" : null
                      }`}
                    onClick={() => handleChangeTime(3)}
                  >
                    Tháng trước
                  </button>
                </div>
                <div className="select-date col d-flex">
                  <form className={useStyles.container} noValidate>
                    <TextField
                      id="datetime-local"
                      label="Tháng bắt đầu"
                      type="date"
                      onChange={(e) => handleChangeDateStart(e.target.value)}
                      value={dateStart}
                      className={useStyles.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                  <form className={useStyles.container} noValidate>
                    <TextField
                      id="datetime-local"
                      label="Tháng kết thúc"
                      type="date"
                      onChange={(e) => handleChangeDateEnd(e.target.value)}
                      value={dateEnd}
                      className={useStyles.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                </div>
                <div className="button-group col d-flex">
                  <div className="btn-filter btn-item">
                    <FaFilter
                      className="icon"
                      style={
                        userRole === "Dieu_do_tram"
                          ? customerId
                            ? { color: "red" }
                            : {}
                          : customerId || station
                            ? { color: "red" }
                            : {}
                      }
                      onClick={() => handleFilter()}
                    />
                  </div>
                  {/* <div className="btn-item">
                    <RiFileExcel2Fill
                      onClick={() => HandleExportExcel()}
                      className="icon"
                    />
                  </div> */}
                </div>
                {userType === "General" || userType === "Agency" ? (
                  ""
                ) : openModal ? (
                  <ModalFilterShip
                    hadleClose={handleCloseModal}
                    startDate={dateStart}
                    endDate={dateEnd}
                    getData={getData}
                    userRole={userRole}
                    stationId={station}
                    setStation={setStation}
                    areaId={areaId}
                    setAreaId={setAreaId}
                    customerTypeId={customerTypeId}
                    setCustomerTypeId={setCustomerTypeId}
                    customerId={customerId}
                    setCustomerId={setCustomerId}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spin
                  style={{ marginTop: "30px" }}
                  tip="Đang tải dữ liệu..."
                  size="large"
                />
              </div>
            ) : (
              <div>
                {listData && listData.length >= 1 ? (
                  <div className="row wrapper-table-darbord">
                    {shipBinh && shipBinh.length > 0 ? (
                      <div className="col-6">
                        <label className="title-sub-table">
                          Nhập hàng
                          <RiFileExcel2Fill
                            onClick={() => HandleExportExcel(shipBinh)}
                            className="icon"
                          />
                        </label>
                        <table class="table table-bordered" id="my-table-id">
                          <thead>
                            <tr className="title-table">
                              {tableHead.map((item, i) => (
                                <th key={i}>{item}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <th style={{ padding: "0" }}>
                              {shipBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.manufactureName}
                                </tr>
                              ))}
                            </th>
                            <th style={{ padding: "0" }}>
                              {shipBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.name}
                                </tr>
                              ))}
                              <tr className="detail">TỔNG: </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {shipBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {shipBinh.reduce(
                                  (total, curr) => total + curr.count,
                                  0
                                )}
                              </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {shipBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.mass * item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {shipBinh.reduce(
                                  (total, curr) =>
                                    total + curr.count * curr._id.mass,
                                  0
                                )}
                              </tr>
                            </th>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      ""
                    )}
                    {shipVo && shipVo.length > 0 ? (
                      <div className="col-6">
                        <label className="title-sub-table">
                          Giao vỏ
                          <RiFileExcel2Fill
                            onClick={() => HandleExportExcel(shipVo)}
                            className="icon"
                          />
                        </label>
                        <table class="table table-bordered">
                          <thead>
                            <tr className="title-table">
                              {tableHead.map((item, i) => (
                                <th key={i}>{item}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <th style={{ padding: "0" }}>
                              {shipVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.manufactureName}
                                </tr>
                              ))}
                            </th>
                            <th style={{ padding: "0" }}>
                              {shipVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.name}
                                </tr>
                              ))}
                              <tr className="detail">TỔNG: </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {shipVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {shipVo.reduce(
                                  (total, curr) => total + curr.count,
                                  0
                                )}
                              </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {shipVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.mass * item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {shipVo.reduce(
                                  (total, curr) =>
                                    total + curr.count * curr._id.mass,
                                  0
                                )}
                              </tr>
                            </th>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      ""
                    )}
                    {fluxVo && fluxVo.length > 0 ? (
                      <div className="col-6">
                        <label className="title-sub-table">
                          Trả vỏ
                          <RiFileExcel2Fill
                            onClick={() => HandleExportExcel(fluxVo)}
                            className="icon"
                          />
                        </label>
                        <table class="table table-bordered">
                          <thead>
                            <tr className="title-table">
                              {tableHead.map((item, i) => (
                                <th key={i}>{item}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <th style={{ padding: "0" }}>
                              {fluxVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.manufactureName}
                                </tr>
                              ))}
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.name}
                                </tr>
                              ))}
                              <tr className="detail">TỔNG: </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {fluxVo.reduce(
                                  (total, curr) => total + curr.count,
                                  0
                                )}
                              </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxVo.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.mass * item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {fluxVo.reduce(
                                  (total, curr) =>
                                    total + curr.count * curr._id.mass,
                                  0
                                )}
                              </tr>
                            </th>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      ""
                    )}
                    {fluxBinh && fluxBinh.length > 0 ? (
                      <div className="col-6">
                        <label className="title-sub-table">
                          Hồi lưu bình đầy
                          <RiFileExcel2Fill
                            onClick={() => HandleExportExcel(fluxBinh)}
                            className="icon"
                          />
                        </label>
                        <table class="table table-bordered">
                          <thead>
                            <tr className="title-table">
                              {tableHead.map((item, i) => (
                                <th key={i}>{item}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <th style={{ padding: "0" }}>
                              {fluxBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.manufactureName}
                                </tr>
                              ))}
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.name}
                                </tr>
                              ))}
                              <tr className="detail">TỔNG: </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {fluxBinh.reduce(
                                  (total, curr) => total + curr.count,
                                  0
                                )}
                              </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxBinh.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.mass * item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {fluxBinh.reduce(
                                  (total, curr) =>
                                    total + curr.count * curr._id.mass,
                                  0
                                )}
                              </tr>
                            </th>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      ""
                    )}
                    {fluxKhac && fluxKhac.length > 0 ? (
                      <div className="col-6">
                        <label className="title-sub-table">
                          Trả vỏ khác
                          <RiFileExcel2Fill
                            onClick={() => HandleExportExcel(fluxKhac)}
                            className="icon"
                          />
                        </label>
                        <table class="table table-bordered">
                          <thead>
                            <tr className="title-table">
                              {tableHead.map((item, i) => (
                                <th key={i}>{item}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <th style={{ padding: "0" }}>
                              {fluxKhac.map((item, i) => (
                                <tr className="detail" key={i}>
                                  Khác
                                </tr>
                              ))}
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxKhac.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.name}
                                </tr>
                              ))}
                              <tr className="detail">TỔNG: </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxKhac.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {fluxKhac.reduce(
                                  (total, curr) => total + curr.count,
                                  0
                                )}
                              </tr>
                            </th>
                            <th style={{ padding: "0" }}>
                              {fluxKhac.map((item, i) => (
                                <tr className="detail" key={i}>
                                  {item._id.mass * item.count}
                                </tr>
                              ))}
                              <tr className="detail">
                                {fluxKhac.reduce(
                                  (total, curr) =>
                                    total + curr.count * curr._id.mass,
                                  0
                                )}
                              </tr>
                            </th>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <h3 className="footer"> Không có đơn hàng nào !</h3>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatistics;
