
import moment from "moment";
import React, { Component, Fragment, useEffect, useState } from "react";
import getUserCookies from "getUserCookies";
import ReactCustomLoading from "ReactCustomLoading";
import showToast from "showToast";
import { DatePicker } from "antd";
import axios from 'axios';



import updateExcellCylinders from "../../../../api/getListManufacturer";
import { GETLISTMANUFACTURE } from "../../../config/config";
import getAllTypeGas from "getAllTypeGas";
import getAllStation from "../../../../api/getAllStation";
import getAllBranch from "../../../../api/getAllBranch";
import getStationByIDAPI from "../../../../api/getStationByIdAPI";
import { GET_TOTALIMPORT, GET_TOTALLIQUIDATION, GET_TOTALEXPORT, GETALLBRANCH } from "../../../config/config";

import './shellStatistical.scss'

const { RangePicker } = DatePicker;
function ShellStatistical({ callApi }) {
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [manufacture, setManufacture] = useState([]);
  const [cylinder, setCylinder] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [DSQuantity, setDSTotalQuantity] = useState([])
  const [quantityShell, setQuantityShell] = useState([])
  const [totalData, setTotalData] = useState([]);
  const [totalDataMe, setTotalDataMe] = useState([])
  const [totalDataShell, setTotalDataShell] = useState([]);
  const [URL, setURL] = useState("")
  const [headingTable, setHeadingTable] = useState("");
  const [station, setStation] = useState([])
  const [branchStation, setBranchStation] = useState([]);
  const [valueStation, setValueStation] = useState("")
  const [valueBranch, setValueBranch] = useState("")
  const [clickSeen, setClickSeen] = useState(false)
  const [userFather, setUserFather] = useState()


  const [selectYear, setSelectYear] = useState(moment().year());
  const [selectYearQuarter, setSelectYearQuarter] = useState(moment().year());
  const [startYear, setStartYear] = useState(moment().year());
  const [endYear, setEndYear] = useState(moment().year());
  const [startMonth, setStartMonth] = useState(moment().month() + 1);
  const [endMonth, setEndMonth] = useState(moment().month() + 1);

  async function getUser() {
    //Phân quyền
    let user_cookies = await getUserCookies();
    if (user_cookies.user.userType === 'Personnel') {
      const user = await getStationByIDAPI(user_cookies.user.isChildOf) // lay info tai khoan cha
      user_cookies.user = user.data.data
      setUserFather(user.data.data)
      // console.log('user:::: ', user_cookies.user)
    }
    setUserRole(user_cookies.user.userRole);
    setUserType(user_cookies.user.userType);
    if (user_cookies.user.userType === "Factory" || user_cookies.user.userType === "Region") {
      setURL(GET_TOTALEXPORT);
      setHeadingTable("VỎ ĐÃ XUẤT")

    }
    else if (user_cookies.user.userType === "Fixer") {
      setURL(GET_TOTALIMPORT);
      setHeadingTable("VỎ ĐÃ NHẬP")

    }
    // Lấy danh sách chi nhánh
    if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Factory") {
      let res = await getAllStation(user_cookies.user.id);
      if (res.data) {
        setStation([...res.data.data]);
      }
    }


    // lấy danh sách trạm 
    if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Region") {
      let res = await getAllBranch(user_cookies.user.id);
      if (res.data) {
        setBranchStation([...res.data.data]);
      }
    }

    // // Lấy danh sách thương hiệu
    // if (user_cookies.user.userRole === "SuperAdmin" || user_cookies.user.userRole === "Owner" &&
    //   user_cookies.user.userType === "Fixer" || user_cookies.user.userType === "Factory") {
    //   let res = await updateExcellCylinders(user_cookies.user.id);
    //   if (res.data) {
    //     setManufacture([...res.data.data]);
    //   }
    // }
    setManufacture([
      {
        name: 'Vỏ GasSouth',
        id: 'GASSOUTH'
      },
      {
        name: 'Vỏ Khác',
        id: 'OTHER'
      },
    ]);
    // Lấy danh sách loại bình
    if (user_cookies.user.userRole === "SuperAdmin" || user_cookies.user.userRole === "Owner" &&
      user_cookies.user.userType === "Fixer" || user_cookies.user.userType === "Factory") {
      let cylinder = await getAllTypeGas(user_cookies.user.id);
      if (cylinder.data) {
        setCylinder(cylinder.data.data);
      }
    }
  }

  useEffect(() => {
    getUser();

  }, [setUserRole, setUserType, setManufacture, setCylinder]);

  function handleTime(value) {
    setStartMonth(value[0].getMonth() + 1)
    setStartYear(value[0].getFullYear())
    setEndMonth(value[1].getMonth() + 1)
    setEndYear(value[1].getFullYear())

    setSelectYear(value[1].getFullYear());
    setSelectYearQuarter(value[1].getFullYear());
    setStartTime(value[0]);
    setEndTime(value[1]);

  }

  // Lấy ngày hiện tại
  function handleThisTime() {
    var el = document.getElementsByClassName("btn-history");
    el[0].classList.add("active");
    el[1].classList.remove("active");
    el[2].classList.remove("active");
    el[3].classList.remove("active");
    setStartTime(moment().startOf("day"));
    setEndTime(moment().endOf("day"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  // Lấy ngày hôm qua
  function handleYesterday() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).addClass("active");
      }
      if (item === 2) {
        $(this).removeClass("active");
      }
      if (item === 3) {
        $(this).removeClass("active");
      }
    });
    setStartTime(moment().subtract(1, "days").startOf('day'), moment().subtract(1, "days"));
    setEndTime(moment().subtract(1, "days").endOf('day'), moment().subtract(1, "days"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  //Lấy ngày trong tuần
  function handleThisWeek() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).removeClass("active");
      }
      if (item === 2) {
        $(this).addClass("active");
      }
      if (item === 3) {
        $(this).removeClass("active");
      }
    });
    setStartTime(moment().startOf("week"));
    setEndTime(moment().endOf("week"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  //Lấy ngày trong tháng
  function handleThisMonth() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).removeClass("active");
      }
      if (item === 2) {
        $(this).removeClass("active");
      }
      if (item === 3) {
        $(this).addClass("active");
      }
    });
    setStartTime(moment().startOf("month"));
    setEndTime(moment().endOf("month"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  const handleClickSeen = async () => {
    setClickSeen(true);
    let id = "";
    let user_cookies = await getUserCookies();
    if (valueStation === "5f01b04a5452a61194c9e2c3") {
      id = "5f01b04a5452a61194c9e2c3";
    }
    else if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Factory" || userType === "Region") {
      id = valueBranch;
    }
    else {
      id = user_cookies.user.id;
    }
    let startDate = startTime._d.toISOString();
    let endDate = endTime._d.toISOString();
    // thống kê nhập vỏ/ xuất vỏ phụ thuộc vào URL
    if (user_cookies) {
      let url = URL + `?id=${id}&startDate=${startDate}&endDate=${endDate}`
      await axios.get(
        url,
        {
          headers: {
            "Authorization": "Bearer " + user_cookies.token
          }
        }
      )
        .then(function (response) {
          // setDSTotalQuantity([...response.data.data])
          convertData(manufacture, cylinder, response.data.data)
        })
        .catch(function (err) {
          console.log(err);
        });
      if (user_cookies.user.userRole === "Owner" && user_cookies.user.userType === "Factory") {
        let urlIm = GET_TOTALIMPORT + `?id=${id}&startDate=${startDate}&endDate=${endDate}`
        await axios.get(
          urlIm,
          {
            headers: {
              "Authorization": "Bearer " + user_cookies.token
            }
          }
        )
          .then(function (response) {
            console.log('data im ne::', response.data.data)

            // setDSTotalQuantity([...response.data.data])
            convertDataMe(manufacture, cylinder, response.data.data)
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    }

    // Thống kê số lượng nhập vỏ tài khoản mẹ
    if (user_cookies) {
      let url = GET_TOTALIMPORT + `?id=${id}&startDate=${startDate}&endDate=${endDate}`
      await axios.get(
        url,
        {
          headers: {
            "Authorization": "Bearer " + user_cookies.token
          }
        }
      )
        .then(function (response) {
          // setDSTotalQuantity([...response.data.data])
          convertDataMe(manufacture, cylinder, response.data.data)
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    // thống kê vỏ thanh lý
    if (user_cookies) {
      let url = GET_TOTALLIQUIDATION + `?id=${id}&startDate=${startDate}&endDate=${endDate}`
      await axios.get(
        url,
        {
          headers: {
            "Authorization": "Bearer " + user_cookies.token
          }
        }
      )
        .then(function (response) {
          // setQuantityShell([...response.data.data])
          const numContract = response.data.data.map((item) => item.numberContract)
          shellData(numContract, cylinder, response.data.data)
        })
        .catch(function (err) {
          console.log(err);
        });

    }
    else {
      return "Expired Token API";
    }
  }


  // lộc số lượng Vỏ đã xuất || vỏ đã nhập(dùng chung)
  const convertData = (manufacture, cylinder, DSQuantity) => {
    let data = []
    for (const item of manufacture) {
      let obj = {};
      obj.id = item.id;
      obj.name = item.name;
      obj.cylinders = [];
      for (const e of cylinder) {
        let ele = {};
        ele.id = e.id;
        ele.name = e.name;
        let dsSoluong = DSQuantity.filter((a) => a.manufacture === item.id && a.cylinderType === e.id);
        ele.quantity = dsSoluong.reduce((total, curr) => total + curr.totalQuantity, 0)
        obj.cylinders.push(ele)
      }
      data.push(obj)
    }
    // console.log('data xuat vo', data)
    return setTotalData([...data])
  }
  //lọc số lượng vỏ nhập ở tài khoản mẹ
  const convertDataMe = (manufacture, cylinder, DSQuantity) => {
    let data = []
    for (const item of manufacture) {
      let obj = {};
      obj.id = item.id;
      obj.name = item.name;
      obj.cylinders = [];
      for (const e of cylinder) {
        let ele = {};
        ele.id = e.id;
        ele.name = e.name;
        let dsSoluong = DSQuantity.filter((a) => a.manufacture === item.id && a.cylinderType === e.id);
        ele.quantity = dsSoluong.reduce((total, curr) => total + curr.totalQuantity, 0)
        obj.cylinders.push(ele)
      }
      data.push(obj)
    }
    return setTotalDataMe([...data])
  }

  // lộc số lượng vỏ thanh lý
  const shellData = (manufacture, cylinder, quantityShell) => {
    let data = []
    for (const item of manufacture) {
      let obj = {};
      obj.id = item;
      obj.name = item;
      obj.cylinders = [];
      for (const e of cylinder) {
        let ele = {};
        ele.id = e.id;
        ele.name = e.name;
        let dsSoluong = quantityShell.filter((a) => a.numberContract == item && a.cylinderType == e.id
        );
        ele.quantity = dsSoluong.reduce((total, curr) => total + curr.totalQuantity, 0)
        obj.cylinders.push(ele)
      }
      data.push(obj)
    }
    return setTotalDataShell([...data])
  }
  const handleChangStation = async (e) => {
    let branch = e.target.value;
    setValueStation(branch)
    let user_cookies = await getUserCookies();
    if (user_cookies.user.userType === 'Personnel') {
      user_cookies.user = userFather
    }
    // Lấy danh sách trạm thuộc chi nhánh
    if (branch != "5f01b04a5452a61194c9e2c3" && user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Factory") {
      let res = await getAllBranch(branch);
      if (res.data) {
        setBranchStation([...res.data.data]);
      }
    }
  }

  const handleChangBranch = (e) => {
    setValueBranch(e.target.value);
    // console.log(e.target.value);
  }
  return (
    <div className="container-statistical">
      <header>
        <h1 className="heading">BÁO CÁO THỐNG KÊ</h1>
        <div className="container-header">
          <div className="col-12 d-flex mt-3">
            <h2>Thời gian</h2>
            <button className="btn-history " onClick={handleThisTime}>
              Hôm nay
            </button>
            <button className="btn-history" onClick={handleYesterday}>
              Hôm qua
            </button>
            <button className="btn-history" onClick={handleThisWeek}>
              Tuần này
            </button>
            <button className="btn-history" onClick={handleThisMonth}>
              Tháng này
            </button>
            <div className="RangePicker--custom">
              <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
            </div>
          </div>
          {userRole === "SuperAdmin" && userType === "Factory" ? (
            <div className="wrapper_station">
              <div className="chinhanh">
                <h2>Chi nhánh</h2>
                <select
                  className="select-station"
                  onChange={(e) => handleChangStation(e)}
                >
                  <option value="">chọn...</option>
                  {station.map((item, idx) => (
                    <option value={item.id} key={idx}>{item.name}</option>
                  ))}
                </select>
              </div>
              {valueStation !== "5f01b04a5452a61194c9e2c3" && valueStation !== "" ? (
                <div className="chinhanh">
                  <h2>Trạm</h2>
                  <select
                    className="select-station"
                    onChange={(e) => handleChangBranch(e)}
                  >
                    <option value="">chọn...</option>
                    {branchStation.map((item, i) => (
                      <option value={item.id} key={i} >{item.name}</option>
                    ))}
                  </select>
                </div>

              ) : ("")

              }


            </div>
          ) : ("")}
          {userRole === "SuperAdmin" && userType === "Region" ? (
            <div className="station-wrapper">
              <h2>Trạm</h2>
              <div>
                <select
                  className={valueBranch == "" && clickSeen == true ? "select-station err" : "select-station"}
                  onChange={(e) => handleChangBranch(e)}
                >
                  <option value="">chọn...</option>
                  {branchStation.map((item, i) => (
                    <option value={item.id} key={i} >{item.name}</option>
                  ))}
                </select>
                <p className={valueBranch == "" && clickSeen == true ? "mess error" : "mess"}>Vui lòng chọn trạm</p>
              </div>
            </div>
          ) : ("")}
          <button className="btn-seen" onClick={() => handleClickSeen()}>Xem</button>
        </div>
      </header>
      <div className="content-statistical">
        <div className="row">
          {(userRole === "SuperAdmin" || userRole === "Owner") && userType === "Factory" ? (
            <div className="col-4">
              <table class="table table-bordered table-content">
                <thead className="table-head">
                  <tr>

                    <th className="heading-table" colspan="3">VỎ ĐÃ NHẬP</th>
                  </tr>
                  <tr>
                    <th scope="col">Loại vỏ</th>
                    <th scope="col">Loại bình</th>
                    <th scope="col">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {totalDataMe.map((item, idx) => (
                    <tr key={idx}>
                      <th className="th-manufacture">{item.name}</th>
                      <th className="th-cylinder">{item.cylinders.map((cylin, idx) => (
                        <tr key={idx}>
                          <th className="th2_cylinder" key={cylin.id}>{cylin.name}</th>
                        </tr>
                      ))}
                      </th>
                      <th className="th-cylinder">{item.cylinders.map((cylin, idx) => (
                        <tr key={idx}>
                          <th className="th2_cylinder" key={cylin.id}>{cylin.quantity}</th>
                        </tr>
                      ))}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          ) : ("")}
          <div className={(userRole === "SuperAdmin" || userRole === "Owner") && userType === "Factory" ? "col-4" : "col-6"}>
            <table class="table table-bordered table-content">
              <thead className="table-head">
                <tr>

                  <th className="heading-table" colspan="3">{headingTable}</th>
                </tr>
                <tr>
                  <th scope="col">Loại vỏ</th>
                  <th scope="col">Loại bình</th>
                  <th scope="col">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {totalData.map((item, idx) => (
                  <tr key={idx}>
                    <th className="th-manufacture">{item.name}</th>
                    <th className="th-cylinder">{item.cylinders.map((cylin, idx) => (
                      <tr key={idx}>
                        <th className="th2_cylinder" key={cylin.id}>{cylin.name}</th>
                      </tr>
                    ))}
                    </th>
                    <th className="th-cylinder">{item.cylinders.map((cylin, idx) => (
                      <tr key={idx}>
                        <th className="th2_cylinder" key={cylin.id}>{cylin.quantity}</th>
                      </tr>
                    ))}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={(userRole === "SuperAdmin" || userRole === "Owner") && userType === "Factory" ? "col-4" : "col-6"}>
            <table class="table table-bordered table-content">
              <thead className="table-head">
                <tr>
                  <th className="heading-table" colspan="3">VỎ THANH LÝ</th>
                </tr>
                <tr>
                  <th scope="col">Số văn bản</th>
                  <th scope="col">Loại bình</th>
                  <th scope="col">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {totalDataShell.map((item, idx) => (
                  <tr key={idx}>
                    <th className="th-manufacture">{item.name}</th>
                    <th className="th-cylinder">
                      {item.cylinders.map((cylin, idx) => (
                        <tr key={idx}>
                          <th className="th2_cylinder" key={cylin.id}>{cylin.name}</th>
                        </tr>
                      ))}
                    </th>
                    <th className="th-cylinder">{item.cylinders.map((cylin, idx) => (
                      <tr key={idx}>
                        <th className="th2_cylinder" key={cylin.id}>{cylin.quantity}</th>
                      </tr>
                    ))}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ShellStatistical;