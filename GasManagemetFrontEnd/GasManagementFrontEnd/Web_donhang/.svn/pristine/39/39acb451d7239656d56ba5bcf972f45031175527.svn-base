import React, { Component, useState, useEffect, useRef } from "react";
import { DatePicker, Select, Table, Typography, Modal, Button, Form } from "antd";
import getDashboardFixer from "../../../../api/getDashboardFixer";
import detailDashboardFixer from "../../../../api/detailDashboardFixer";
import getDetailCylindersImexExcels from "../../../../api/getDetailCylindersImexExcels";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import getUserCookies from "getUserCookies";
import moment from "moment";
const { RangePicker } = DatePicker;
import "./statistialBranch.css";
//import {urlDetailStatistialBranch} from "../../../config/config-reactjs";
function statistialBranch() {
    const dateFormat = "DD/MM/YYYY";
    const monthFormat = "YYYY/MM";
    const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
    const data_khaibaobinhmoi = [
        { loaibinh: "6kg", soLuong: "20" },
        { loaibinh: "12kg", soLuong: "20" },
        { loaibinh: "12.5kg", soLuong: "20" },
        { loaibinh: "20kg", soLuong: "20" },
        { loaibinh: "20kg", soLuong: "20" },
        { loaibinh: "Tổng", soLuong: "100" },
    ];
    const columns = [
        {
            title: "Danh Sách Chi Tiết VỎ",
            align: "center",
            children: [
                { title: "STT", dataIndex: "index", align: "center" },
                { title: "Số Seri", dataIndex: "serial", align: "center" },
                { title: "Màu sắc", dataIndex: "color", align: "center" },
                { title: "Loại van", dataIndex: "valve", align: "center" },
                { title: "Cân nặng", dataIndex: "weight", align: "center" },
                {
                    title: "Ngày kiểm định",
                    dataIndex: "checkedDate",
                    align: "center",
                    render: (record, index) => {
                        const moment = require("moment");
                        const isCorrectFormat = (dateString, format) => {
                            return moment(dateString, format, true).isValid();
                        };
                        return (
                            <div>
                                {isCorrectFormat(record.checkedDate, "DD/MM/YYYY") === true
                                    ? record.checkedDate
                                    : moment(record.checkedDate).format("DD/MM/YYYY")}
                            </div>
                        );
                    },
                },
                { title: "Thương hiệu", dataIndex: "manufacture", align: "center" },
                { title: "Loại bình", dataIndex: "category", align: "center" },
            ],
        },
    ];
    const columns_khaibaobinhmoi = [
        {
            title: "KHAI BÁO VỎ MỚI",
            children: [
                { title: "Loại bình", align: 'center',dataIndex: "name",render:(text, record, index)=>{
                    return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.name}</div>;
                } },
                {
                    title: "Số lượng",
                    dataIndex: "number",
                    render: (text, record, index) => {
                        return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}}>{record.number.toLocaleString("nl-BE")}</div>;
                    },
                },
                {
                    title: "Thao tác",
                    align: 'center',
                    render: (text, record, index) =>
                        newCylinder.length >= 1 && record.number !== 0 ? (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeNew(record)}>
                                Xem
                            </Button>
                        ) : (
                            <Button type="primary" onClick={() => handleSeeInventory1(record)}>
                                Xem
                            </Button>
                        ),
                },
                //{ title: "Thao tác", render: () => <a href={urlDetailStatistialBranch}>Xem</a> },
            ],
        },
    ];
    const columns_binhdaxuat = [
        {
            title: "VỎ ĐÃ XUẤT",
            align: 'center',
            children: [
                { title: "Loại bình", align: 'center',dataIndex: "name",render:(text, record, index)=>{
                    return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.name}</div>;
                } },
                {
                    title: "Số lượng",
                    align: 'center',
                    dataIndex: "number",
                    render: (text, record, index) => {
                        return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}}>{record.number.toLocaleString("nl-BE")}</div>;
                    },
                },
                {
                    title: "Thao tác",
                    align: 'center',
                    render: (text, record, index) =>
                        exportedCylinder.length >= 1 && record.number !== 0 ? (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeExported(record)}>
                                Xem
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory1(record)}>
                                Xem
                            </Button>
                        ),
                },
                //{ title: "Thao tác", render: () =><a href={urlDetailStatistialBranch}>Xem</a>}
            ],
        },
    ];
    const columns_binhtonkho = [
        {
            title: "VỎ TỒN KHO",
            children: [
                { title: "Loại bình", align: 'center',dataIndex: "name",render:(text, record, index)=>{
                    return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}} >{record.name}</div>;
                } },
                {
                    title: "Số lượng",
                    dataIndex: "number",
                    align: 'center',
                    render: (text, record, index) => {
                        return <div style={inventoryCylinder.length-1===index?{ fontWeight: 'bold' }:{}}>{record.number.toLocaleString("nl-BE")}</div>;
                    },
                },
                {
                    title: "Thao tác",
                    align: 'center',
                    render: (text, record, index) =>
                        inventoryCylinder.length >= 1 && record.number !== 0 ? (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory(record)}>
                                Xem
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory1(record)}>
                                Xem
                            </Button>
                        ),
                },
                //{ title: "Thao tác", render: () => <a href={urlDetailStatistialBranch}>Xem</a> },
            ],
        },
    ];
    const [itemsPerPages,setItemsPerPages]=useState(10);
    const[numberPages,setNumberPages]=useState(0);
    const [startTime, setStartTime] = useState(moment());
    const [systemTime, setSystemTime] = useState(new Date(0).toISOString());
    const [isLoading, setLoading] = useState(true);
    const [endTime, setEndTime] = useState(moment());
    const [newCylinder, setNewCylinder] = useState([]);
    const [exportedCylinder, setExportedCylinder] = useState([]);
    const [inventoryCylinder, setInventoryCylinder] = useState([]);
    const [detailNewCylinder, setDetailNewCylinder] = useState([]);
    const [detailExportCylinder, setDetailExportCylinder] = useState([]);
    const [checkModal, setCheckModal] = useState("");
    const [id, setId] = useState("");
    const [detailInventoryCylinder, setDetailInventoryCylinder] = useState([]);
    const [visible, setVisible] = useState(false);
    const refForm = useRef();
    useEffect(() => {
        async function history(startTime, endTime) {
            let user_cookies = await getUserCookies();
            let sumnew = 0;
            let sumexported = 0;
            let suminventory = 0;
            console.log("user_cookies", systemTime);
            let resultDashboard = await getDashboardFixer(user_cookies.user.id, startTime, endTime, "OLD");
            if (resultDashboard.data.success === true) {
                // Tính tổng số lượng bình khai báo mới
                resultDashboard.data.Declaration.map((value) => {
                    sumnew += value.number;
                });
                let sumNewCylinder = {
                    name: "Tổng",
                    number: sumnew,
                };
                // Tính tổng số lượng bình đã xuất
                resultDashboard.data.Export.map((value) => {
                    sumexported += value.number;
                });
                let sumExportedCylinder = {
                    name: "Tổng",
                    number: sumexported,
                };
                // Tính tổng số lượng bình tồn kho
                resultDashboard.data.Inventory.map((value) => {
                    suminventory += value.number;
                });
                let sumInventoryCylinder = {
                    name: "Tổng",
                    number: suminventory,
                };

                // Ghép object Tổng vào mảng
                // console.log("resultDashboard",resultDashboard.data.Declaration);
                resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumNewCylinder;
                // console.log("resultDashboard",resultDashboard.data.Declaration);
                resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
                resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

                setNewCylinder(resultDashboard.data.Declaration);
                setExportedCylinder(resultDashboard.data.Export);
                setInventoryCylinder(resultDashboard.data.Inventory);
                setLoading(false);
            }
        }
        history(startTime, endTime);
    }, []);
    //Get this Day
    function handleThisTime() {
        //Javascript
        var el = document.getElementsByClassName("btn-history");
        el[0].classList.add("active");
        el[1].classList.remove("active");
        el[2].classList.remove("active");
        el[3].classList.remove("active");
        setStartTime(moment());
        setEndTime(moment());
        setActiveTime(true);
    }
    //Get by Yesterday
    function handleYesterday() {
        //Jquey
        $(".btn-history").each(function(item, index) {
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
        setStartTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
        setEndTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
    }
    //Get this week
    function handleThisWeek() {
        $(".btn-history").each(function(item, index) {
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
    }
    //Get this month
    function handleThisMonth() {
        $(".btn-history").each(function(item, index) {
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
    }
    //Chance time DataPicker
    function handleTime(value) {
        setStartTime(value[0]);
        setEndTime(value[1]);
    }
    async function handleSeeDashboard() {
        setLoading(true);
        let sumnew = 0;
        let sumexported = 0;
        let suminventory = 0;
        let user_cookies = await getUserCookies();
        let resultDashboard = await getDashboardFixer(user_cookies.user.id, startTime, endTime, "OLD");
        if (resultDashboard.data.success === true) {
            // Tính tổng số lượng bình khai báo mới
            resultDashboard.data.Declaration.map((value) => {
                sumnew += value.number;
            });
            let sumNewCylinder = {
                name: "Tổng",
                number: sumnew,
            };
            // Tính tổng số lượng bình đã xuất
            resultDashboard.data.Export.map((value) => {
                sumexported += value.number;
            });
            let sumExportedCylinder = {
                name: "Tổng",
                number: sumexported,
            };
            // Tính tổng số lượng bình tồn kho
            resultDashboard.data.Inventory.map((value) => {
                suminventory += value.number;
            });
            let sumInventoryCylinder = {
                name: "Tổng",
                number: suminventory,
            };

            // Ghép object Tổng vào mảng
            console.log("resultDashboard", resultDashboard.data.Declaration);
            resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumNewCylinder;
            console.log("resultDashboard", resultDashboard.data.Declaration);
            resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
            resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

            setNewCylinder(resultDashboard.data.Declaration);
            setExportedCylinder(resultDashboard.data.Export);
            setInventoryCylinder(resultDashboard.data.Inventory);
        }
        setLoading(false);
    }
    async function handleSeeNew(record) {
        setLoading(true);
        setCheckModal("1");
        setId(record.id);
        let detailNewCylinder = [];
        let user_cookies = await getUserCookies();
        setVisible(true);
        let resultDetail = await detailDashboardFixer(user_cookies.user.id, startTime, endTime, "OLD", "IN", record.id ? record.id : null, "CREATE");
        console.log("resultDetail", resultDetail);
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailNewCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setNumberPages(Math.ceil(resultDetail.data.Cylinders_Count / itemsPerPages));

            setDetailNewCylinder(detailNewCylinder);
        }
        setLoading(false);
    }
    async function handleSeeInventory1() {
        alert("Không có dữ liệu");
    }
    async function handleSeeInventory(record) {
        setLoading(true);
        setCheckModal("3");
        setId(record.id);
        let detailInventoryCylinder = [];
        let user_cookies = await getUserCookies();
        setVisible(true);
        let resultDetail = await detailDashboardFixer(user_cookies.user.id, startTime, endTime, "OLD", null, record.id, null);
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailInventoryCylinder.push({
                    index: index,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailInventoryCylinder(detailInventoryCylinder);
            setNumberPages(Math.ceil(resultDetail.data.Cylinders_Count / itemsPerPages));

        }
        setLoading(false);
    }
    async function handleSeeExported(record) {
        setLoading(true);
        setCheckModal("2");
        setId(record.id);
        let detailExportCylinder = [];
        let user_cookies = await getUserCookies();
        setVisible(true);
        let resultDetail = await detailDashboardFixer(user_cookies.user.id, startTime, endTime, "OLD", "OUT", record.id, "EXPORT_CELL");
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailExportCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailExportCylinder(detailExportCylinder);
            setNumberPages(Math.ceil(resultDetail.data.Cylinders_Count / itemsPerPages));

        }
        setLoading(false);
    }
    function handleSubmit() {
        // alert("Lấy dữ liệu xuất excel thành công");
        const table = refForm.current.querySelectorAll("table");
        //  console.log("refInput",refForm.current.querySelectorAll("table"));
        var i;
        for (i = 0; i < table.length; i++) {
            // console.log(table[i]);
            if (i === 3) {
                table[i].setAttribute("id", "table-to-xls");
            }
        }
    }
    async function handleSeeExcel() {
        let user_cookies = await getUserCookies();
        if (checkModal === "1") {
            const data = await getDetailCylindersImexExcels(user_cookies.user.id, startTime, endTime, "OLD", "IN", id, "CREATE");
        } else if (checkModal === "2") {
            const data = await getDetailCylindersImexExcels(user_cookies.user.id, startTime, endTime, "OLD", "OUT", id, "EXPORT_CELL");
        } else if (checkModal === "3") {
            const data = await getDetailCylindersImexExcels(user_cookies.user.id, startTime, endTime, "OLD", null, id, null);
        }
    }
    async  function  handleChangePage  (onPage){
        setLoading(true);
    if( checkModal==="1"){
        let detailNewCylinder = [];
        let user_cookies = await getUserCookies();
        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            startTime,
            endTime,
            "OLD",
            "IN",
            id ? id : null,
            "CREATE",
            onPage,
            itemsPerPages
        );
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailNewCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailNewCylinder(detailNewCylinder);
        }
        setLoading(false);   
    }    
    if( checkModal==="2"){
        let detailExportCylinder = [];
        let user_cookies = await getUserCookies();
            let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            startTime,
            endTime,
            "OLD",
            "OUT",
            id,
            "EXPORT_CELL",
            onPage,
            itemsPerPages
        );
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailExportCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailExportCylinder(detailExportCylinder);
        }
        setLoading(false);    
    }
    if( checkModal==="3"){
        let detailInventoryCylinder = [];
        let user_cookies = await getUserCookies();
        let resultDetail = await detailDashboardFixer(
            user_cookies.user.id,
            startTime,
            endTime,
            "OLD",
            null,
            id,
            null,
            onPage,
            itemsPerPages
        );
        console.log("resultDetail",resultDetail);
        if (resultDetail.data.success === true) {
            resultDetail.data.Cylinders.map((value, index) => {
                detailInventoryCylinder.push({
                    index: index + 1,
                    id: value.id,
                    serial: value.serial,
                    color: value.color,
                    valve: value.valve,
                    weight: value.weight,
                    checkedDate: value.checkedDate,
                    category: value.category,
                    manufacture: value.manufacture,
                });
            });
            setDetailInventoryCylinder(detailInventoryCylinder);
        }
        setLoading(false);     
    }
        
    }
    return (
        <form ref={refForm} onSubmit={handleSubmit}>
            <div className="section-statistical">
                <div className="section-statistical">
                    <div className="section-statistical__report">
                        <h1>Báo cáo thống kê bình sữa chữa </h1>
                        <div className="section-statistical__report__title">
                            <div className="container-fluid">
                                <div className="row border rouded">
                                    <div className="col-12 d-flex mt-3">
                                        <h2>Thời gian</h2>
                                        <button
                                            // className={activeTime===false?"btn-history active":"btn-history"}
                                            className="btn-history active"
                                            onClick={handleThisTime}
                                        >
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
                                        <div>
                                            <button className="btn-see" onClick={handleSeeDashboard}>
                                                Xem
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="section-statistical__report__body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-4">
                                        <Table columns={columns_khaibaobinhmoi} dataSource={newCylinder}
                                         pagination={false} 
                                        bordered loading={isLoading} />
                                    </div>
                                    <div className="col-4">
                                        <Table 
                                        columns={columns_binhdaxuat} dataSource={exportedCylinder}
                                        pagination={false} 
                                        bordered loading={isLoading} />
                                    </div>
                                    <div className="col-4">
                                        <Table 
                                        columns={columns_binhtonkho} 
                                        dataSource={inventoryCylinder} 
                                        pagination={false}
                                        bordered loading={isLoading} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal centered visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} width={1000}>
                    <div className="section-statistical__report">
                        <div className="section-statistical__report__body">
                            <div className="container-fluid">
                                <Table
                                    dataSource={
                                        checkModal === "1"
                                            ? detailNewCylinder
                                            : checkModal === "2"
                                            ? detailExportCylinder
                                            : checkModal === "3"
                                            ? detailInventoryCylinder
                                            : ""
                                    }
                                    columns={columns}
                                    pagination={
                                        {
                                            defaultCurrent:1,
                                            defaultPageSize:itemsPerPages,
                                            total:numberPages * itemsPerPages,
                                            onChange:(onPage) => handleChangePage(onPage)
                                        }
                                }
                                    bordered
                                />
                                <Form.Item>
                                    <Button type="primary" size="large" onClick={() => handleSeeExcel()}>
                                        Xuất excel
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </form>
    );
}

export default statistialBranch;
