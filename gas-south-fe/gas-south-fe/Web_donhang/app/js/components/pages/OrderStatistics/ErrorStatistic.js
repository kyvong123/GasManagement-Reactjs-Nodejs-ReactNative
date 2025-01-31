
import moment from "moment";
import React, { Component, Fragment, useEffect, useState } from "react";
import getUserCookies from "getUserCookies";
import { DatePicker, Space } from "antd";
import axios from 'axios';
import "./Index.scss";
import * as FaIcon from "react-icons/fa";
import ModalErrorItem from "./ModalErrorItem";
import getListReason from "../../../../api/getListReason";
import getQuantityReason from "../../../../api/getQuantityReason";
import getAllErrReason from "../../../../api/getAllErrReason";
import { SERVERAPI } from "../../../config/config";

const { RangePicker } = DatePicker;
function ErrorStatistics() {
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [open, setOpen] = useState(false);
    const [listReason, setListReason] = useState([]);
    const [quantityReason, setQuantityReason] = useState([]);
    const [allReason, setAllReason] = useState([]);
    const [heading, setheading] = useState("");
    const [idError, setIdError] = useState("");

    const [selectYear, setSelectYear] = useState(moment().year());
    const [selectYearQuarter, setSelectYearQuarter] = useState(moment().year());
    const [startYear, setStartYear] = useState(moment().year());
    const [endYear, setEndYear] = useState(moment().year());
    const [startMonth, setStartMonth] = useState(moment().month() + 1);
    const [endMonth, setEndMonth] = useState(moment().month() + 1);

    useEffect(() => {
        const getUser = async () => {
            let user_cookie = await getUserCookies();
            // // Lấy danh sách lỗi
            // if(user_cookie){
            //     let res = await getListReason();
            //     if(res.data.success){
            //         setListReason(res.data.data);
            //     }
            //     else {
            //         console.log(res.data.message);
            //     }
            // }

        }
        getUser();
    }, [])

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

    function handleTime(value) {
        // setStartMonth(value[0].getMonth() + 1)
        // setStartYear(value[0].getFullYear())
        // setEndMonth(value[1].getMonth() + 1)
        // setEndYear(value[1].getFullYear())

        console.log('gia tri:', moment(value[0]).format("DD/MM/YYYY"))

        // setSelectYear(value[1].getFullYear());
        // setSelectYearQuarter(value[1].getFullYear());
        // setStartTime(value[0]);
        // setEndTime(value[1]);

    }

    const handleChangeDateStart = (date) => {
        setStartTime(date);
        if (
            !moment()
                .startOf("day")
                .isSame(date)
        ) {
            setToggleState(-1);
        }
    };
    const handleChangeDateEnd = (date) => {
        setEndTime(date);
        if (
            !moment()
                .endOf("day")
                .isSame(date)
        ) {
            setToggleState(-1);
        }
    };
    const handleClickSeen = async () => {
        let user_cookie = await getUserCookies();
        let startDate = startTime.toISOString();
        let endDate = endTime.toISOString();

        const UserInfo = user_cookie.user;
        let url = null
        if (UserInfo.userType === "Tong_cong_ty" || UserInfo.userType === "SuperAdmin") {
            //truong phong kinh doanh
            url = `${SERVERAPI}history/error?From=${startDate}&To=${endDate}`
        } else if (UserInfo.userType === "Tram" || UserInfo.userType === "Factory") {
            //truong tram
            url = `${SERVERAPI}history/error?From=${startDate}&To=${endDate}&stationId=${UserInfo.id}`
        }
        try {
            const response = await axios.get(`${url}`, {
                headers: {
                    "Authorization": `Bearer ${user_cookie.token}`
                }
            })
            console.log("data:", response.data.data)
            setListReason(response.data.data)
            return response.data;
        } catch (error) {
            console.warn(error);
            return null;
        }


        // // Lấy số lượng bình lỗi
        //     if(user_cookie){
        //         let res = await getQuantityReason({startDate, endDate});
        //         if(res.data.success){
        //             setQuantityReason(res.data.data);
        //         }
        //         else {
        //             console.log(res.data.message);
        //         }
        //     }
        // // lấy chi tiết bình lỗi
        //       if(user_cookie){
        //     let res = await getAllErrReason({startDate, endDate});
        //     if(res.data.success){
        //         setAllReason(res.data.data);
        //     }
        //     else {
        //         setAllReason([]);
        //     }
        //          }
    }

    // gọi lại hàm lấy chi tiết bình lỗi
    const handleReason = async () => {
        let user_cookie = await getUserCookies();
        let startDate = startTime.toISOString();
        let endDate = endTime.toISOString();
        if (user_cookie) {
            let res = await getAllErrReason({ startDate, endDate });
            if (res.data.success) {
                setAllReason(res.data.data);
            }
            else {
                setAllReason([]);
            }
        }
    }

    const handleOpenModal = (name, id) => {
        setOpen(true);
        setheading(name);
        setIdError(id);

    }
    const handleClose = () => {
        setOpen(false);
    }
    return (
        <div className="wrapper-errorstatictis">
            {open ? <ModalErrorItem handleClose={handleClose} handleReason={handleReason} name={heading} allReason={allReason} idError={idError} /> : ""}
            <div>
                <h1 className="heading">BÁO CÁO THỐNG KÊ BÌNH LỖI</h1>
                <div className="container-header">
                    <div className="col-12 d-flex mt-3">
                        <h2 className="sub-heading">Thời gian</h2>
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

                            {/* <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} /> */}

                            <DatePicker
                                placeholder="chọn ngày"
                                onChange={(date) => handleChangeDateStart(date)}
                                value={startTime}
                                className="date"
                                defaultValue={startTime}
                                format="DD/MM/YYYY"
                            // suffixIcon={<FaIcon.FaCalendarDay className="black" />}
                            />

                            <DatePicker
                                placeholder="chọn ngày"
                                onChange={(date) => handleChangeDateEnd(date)}
                                value={endTime}
                                className="date"
                                defaultValue={endTime}
                                format="DD/MM/YYYY"
                            // suffixIcon={<FaIcon.FaCalendarDay className="black" />}
                            />



                        </div>
                    </div>
                    <button className="btn-seen" onClick={() => handleClickSeen()}>Xem</button>
                    <div className="content-error">
                        <ul className="list-error">
                            {listReason.map((item, idx) => (
                                <li key={idx} onClick={() => handleOpenModal(item.name, item._id)}>
                                    <h4 className="title">{item.name}</h4>
                                    <div className="block-quantity">
                                        <h6 className="sub-quantity">Sl: {item.amount} </h6>

                                        {/* {quantityReason.map((ele, i) => (
                                                <h6 className="quantity">
                                                    {ele.code === item.code ? ele.amount : ""}
                                                </h6>
                                            ))} */}

                                        <span></span>
                                    </div>
                                    <FaIcon.FaReplyAll className="icon-detail" />
                                </li>
                            ))}
                            <li>
                                <h4 className="title">Tổng số lỗi:</h4>
                                <h6 className="quantity">{listReason.reduce((total, curr) => total + curr.amount, 0)}</h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorStatistics;