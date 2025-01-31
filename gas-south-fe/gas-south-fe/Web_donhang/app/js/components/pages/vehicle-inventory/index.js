import "./vehicleInventory.scss";
import { DatePicker, } from 'antd';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import moment from 'moment';
import { VEHICLE_TRUCK, SERVERAPI } from "../../../config/config";
import axios from "axios";
import getUserCookies from "../../../helpers/getUserCookies";
const vehicleInventory = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [startDate, setStartDate] = useState(moment().endOf('day'));
    const [endDate, setEndDate] = useState(moment().endOf('day'));
    const [carId, setCarId] = useState("");
    const [listCar, setListCar] = useState([]);
    const [dataHistory, setDataHistory] = useState([]);
    const [dataStatistics, setDataStatistics] = useState([]);

    useEffect(() => {
        const getListCar = async () => {
            let user_Cookies = await getUserCookies();
            if (user_Cookies) {
                let res = await axios.get(VEHICLE_TRUCK + `?id=${user_Cookies.user.id}`, {
                    headers: {
                        Authorization: "Bearer " + user_Cookies.token,
                    },
                });

                if (res.data.success) {
                    setListCar(res.data.data);
                    if (res.data.data.length > 0) {
                        setCarId(res.data.data[0].id)
                    }
                }

            }
        }
        getListCar();
    }, [])
    useEffect(() => {
        getStatistics();
        getHistory();
    }, [startDate, endDate, carId])

    const getStatistics = async () => {
        let user_Cookies = await getUserCookies();
        if (user_Cookies) {
            let fromDate = startDate._d.toISOString();
            let toDate = endDate._d.toISOString();
            let res = await axios.get(SERVERAPI + `statistics/vehicle/turn-back?vehicleId=${carId}&startDate=${fromDate}&endDate=${toDate}`,
                {
                    headers: {
                        Authorization: "Bearer " + user_Cookies.token,
                    },
                }
            );
            if (res.data.success) {
                console.log("BBB", res);
                let listdata = res.data.data;
                let manufacture = [];
                listdata.map((item) => {
                    if (!manufacture.includes(item._id.manufactureName)) {
                        manufacture.push(item._id.manufactureName);
                    }
                });
                let data = [];

                manufacture.map((item) => {
                    let a = listdata.filter((ite) => ite._id.manufactureName == item && ite._id.categoryName == "Bình 6Kg")
                        .reduce((sum, curr) => sum + curr.count, 0);
                    let b = listdata.filter((ite) => ite._id.manufactureName == item && ite._id.categoryName == "Bình 12Kg")
                        .reduce((sum, curr) => sum + curr.count, 0);
                    let c = listdata.filter((ite) => ite._id.manufactureName == item && ite._id.categoryName == "Bình 20Kg")
                        .reduce((sum, curr) => sum + curr.count, 0);
                    let d = listdata.filter((ite) => ite._id.manufactureName == item && ite._id.categoryName == "Bình 45Kg")
                        .reduce((sum, curr) => sum + curr.count, 0);
                    data.push({ "name": item, "a": a, "b": b, "c": c, "d": d })
                })
                setDataStatistics(data);
            }
        }
    };
    const getHistory = async () => {
        let user_Cookies = await getUserCookies();
        if (user_Cookies) {
            let fromDate = startDate._d.toISOString();
            let toDate = endDate._d.toISOString();
            let res = await axios.get(SERVERAPI + `statistics/vehicle/histories-turn-back?vehicleId=${carId}&startDate=${fromDate}&endDate=${toDate}`,
                {
                    headers: {
                        Authorization: "Bearer " + user_Cookies.token,
                    },
                }
            );
            if (res.data.success) {
                setDataHistory(res.data.data);
            }
        }
    };
    const handleSetDate = (index) => {
        setActiveIndex(index);
        switch (index) {
            case 0: {
                setStartDate(moment().startOf("day"));
                setEndDate(moment().endOf("day"));
                break;
            }
            case 1: {
                setStartDate(moment().startOf("week"));
                setEndDate(moment().endOf("week"));
                break;
            }
            case 2: {
                setStartDate(moment().startOf("month"));
                setEndDate(moment().endOf("month"));
                break;
            }
            case 3: {
                setStartDate(moment().add(-1, "months").startOf("month"));
                setEndDate(moment().add(-1, "months").endOf("month"));
                break;
            }
        }
    }
    const handleCar = (e) => {
        setCarId(e.value);
    };
    const downloadExcel = async (id) => {
        let data;
        let user_cookies = await getUserCookies();
        if (user_cookies) {
            let params = {
                "id": id,
            };

            let res = await axios.get(
                SERVERAPI + "vehicle/histories-turn-back/excel", {
                params,
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                }
                , responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            let filename = `Lich_su_hoi_luu.xlsx`;
            link.setAttribute('download', filename); //or any other extension
            document.body.appendChild(link);
            link.click();
        }
    }
    return (
        <div className="vehicle-inventory">
            <div className="button-head">
                <button className={`button  ${activeIndex === 0 ? "active" : null}`}
                    onClick={() => handleSetDate(0)} >
                    Hôm này
                </button>
                <button className={`button  ${activeIndex === 1 ? "active" : null}`}
                    onClick={() => handleSetDate(1)} >
                    Tuần này
                </button>
                <button className={`button  ${activeIndex === 2 ? "active" : null}`}
                    onClick={() => handleSetDate(2)}>
                    Tháng này
                </button>
                <button className={`button  ${activeIndex === 3 ? "active" : null}`}
                    onClick={() => handleSetDate(3)}>
                    Tháng trước
                </button>
                <div className="chose-date">
                    <DatePicker
                        className="date"
                        value={startDate}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                    />
                    <DatePicker
                        className="date"
                        value={endDate}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                    />
                </div>
            </div>
            <div className="search-export">
                <div className="export">
                    <button className="export_btn red_btn">
                        Xem báo cáo
                    </button>
                    <button className="export_btn green_btn">
                        Xuất excel
                    </button>
                </div>
                <div className="search">
                    <span id="span-xe">Xe :</span>
                    <form style={{ width: "250px", position: "relative" }}>
                        <Select
                            isClearable={false}
                            defaultValue={""}
                            value={carId}
                            placeholder={"Trạm chưa có xe"}
                            onChange={(e) => handleCar(e)}
                            options={
                                listCar.length > 0 &&
                                listCar.map((item) => ({
                                    label: item.name,
                                    value: item.id,
                                }))
                            }
                        // menuPortalTarget={document.body}
                        />
                    </form>
                </div>
            </div>
            <div className="table-conten">
                <table>
                    <thead>
                        <tr>
                            <td className="greenyellow_btn" colSpan={5}>SỐ VỎ HỒI LƯU TỪ KHÁCH HÀNG VỀ XE TẢI</td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>Thương hiệu</td>
                            <td colSpan={4}>Loại Bình</td>
                        </tr>
                        <tr>
                            <td>Bình 6</td>
                            <td>Bình 12</td>
                            <td>Bình 20</td>
                            <td>Bình 45</td>
                        </tr>
                    </thead>
                    <tbody>

                        {dataStatistics.map((item) => (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.a}</td>
                                <td>{item.b}</td>
                                <td>{item.c}</td>
                                <td>{item.d}</td>
                            </tr>
                        )
                        )}
                        <tr>
                            <td>Tổng</td>
                            <td>{dataStatistics.reduce((total, curr) => total + curr.a, 0)}</td>
                            <td>{dataStatistics.reduce((total, curr) => total + curr.b, 0)}</td>
                            <td>{dataStatistics.reduce((total, curr) => total + curr.c, 0)}</td>
                            <td>{dataStatistics.reduce((total, curr) => total + curr.d, 0)}</td>

                        </tr>

                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <td className="greenyellow_btn" colSpan={5}>LỊCH SỬ HỒI LƯU</td>
                        </tr>

                        <tr>
                            <td>Hồi lưu từ</td>
                            <td>Xe</td>
                            <td>Ngày giờ</td>
                            <td>Số lượng</td>
                            <td>Tải Excel</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataHistory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.customerName}</td>
                                <td>{item.vehicle}</td>
                                <td>{moment(item.date).format("DD/MM/YYYY")}</td>
                                <td>{item.count}</td>
                                <td>
                                    <button className="white_btn" onClick={() => downloadExcel(item._id)}>
                                        Tải xuống
                                    </button>
                                </td>
                            </tr>
                        )
                        )}



                    </tbody>
                </table>
            </div>




        </div>
    );
};

export default vehicleInventory;