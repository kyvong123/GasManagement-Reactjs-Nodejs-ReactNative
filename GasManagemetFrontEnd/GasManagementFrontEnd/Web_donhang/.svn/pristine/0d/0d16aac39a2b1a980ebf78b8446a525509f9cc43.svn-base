import React, { Component } from 'react';
import Constants from "Constants";
import moment from 'moment';
import getUserCookies from 'getUserCookies';
import DatePicker from "react-datepicker";
import callApi from './../../../util/apiCaller';
import { GETLOCATION_EXPORTDETAIL } from './../../../config/config';
import sendNotification from "./../../../../api/sendNotification";
import openNotificationWithIcon from "./../../../helpers/notification";
import {
    Select,
    Form,
    Input,
    Popconfirm,
    // DatePicker,
    Icon,
    TimePicker,
    message,
    Checkbox,
    Table,
    Radio,
    Modal,
    Tag
} from 'antd';
import vi from 'antd/es/date-picker/locale/vi_VN';
import 'moment/locale/vi';
import showToast from "showToast";
import './export-order-manage.scss';
import "react-datepicker/dist/react-datepicker.css";
import Highlighter from 'react-highlight-words';
import { push } from 'react-router-redux';
import getLocationTransInvoiceDetail from '../../../../api/getLocationTransInvoiceDetail';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
const { Option } = Select;
// const selectRef = useRef();

export default class PopupInfoExportOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: false,
            open: false,
            disable: false,
            disabled: false,
            status: null,
            lat: "",
            long: "",
            drivers: "",
            locationDriver: {},
            display: "",
            id: "",
            code: "",
            driver: "",
            license_plate: "",
            weight_empty: "",
            weight_after_pump: "",
            note: "",
            idDriver: "",
            nameDriver: "",
            wareHouseId: "",
            startHour: "",
            order: "",
            date: "",
            idOrderTank: "",
            wareHouseName: "",
            userName: "",
            userId: "",
            wareHouse: "",
            idDriverr: null,
            idUser: "",
            nameDriverr: "",
            orderIdd: "",
            findOrder: "name",
            orderCode: "",
            codeAndName: "",
            ExportOrderDetail: [],
            listDriver: [],
            listWareHouse: [],
            listCustomer: [],
            listOrderTank: [],
            orderId: [],
            user: [],

            reveiver: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.ExportOrderDetail) {

            const ExportOrderDetail = nextProps.ExportOrderDetail;

            let receiver = ""
            if (nextProps.ExportOrderDetail) {
                if (nextProps.ExportOrderDetail.exportOrderDetail) {
                    if (nextProps.ExportOrderDetail.exportOrderDetail[0][0]) {
                        receiver = nextProps.ExportOrderDetail.exportOrderDetail[0][0].customergasId.branchname
                    }
                }
            }

            this.setState({
                id: ExportOrderDetail.id,
                code: ExportOrderDetail.code,
                listOrderTank: nextProps.orderId,
                userId: nextProps.ExportOrderId,
                user: ExportOrderDetail.userId,
                wareHouse: nextProps.wareHouseName,
                weight_empty: ExportOrderDetail.empty,
                weight_after_pump: ExportOrderDetail.full,
                nameDriver: ExportOrderDetail.nameDriver === "" ? nextProps.nameDriverr : ExportOrderDetail.nameDriver,
                date: ExportOrderDetail.deliveryDate,
                startHour: ExportOrderDetail.deliveryHours,
                license_plate: ExportOrderDetail.licensePlate === "" ? "" : ExportOrderDetail.licensePlate,
                userName: nextProps.userName,
                note: ExportOrderDetail.node,
                idDriver: nextProps.idDriver,
                idUser: nextProps.idUser,
                nameDriverr: nextProps.nameDriverr,
                wareHouseId: nextProps.idWareHouse,
                orderIdd: nextProps.orderIdd,
                status: nextProps.status,
                receiver
            });
        }
    }
    async getDeliveryDetailMap(id) {
        this.setState({ open: true });
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        // console.log("latLong", id);
        await callApi("GET", GETLOCATION_EXPORTDETAIL.replace("{id}", id), token).then(res => {
            // console.log("getlocation", res);
            if (res.data.success === false) {
                showToast("Không có vị trí của tài xế giao đơn");
                this.setState({
                    lat: "",
                    long: "",
                    locationDriver: "",
                    drivers: ""
                });
                return false;
            } else {
                res.data.ExportOrderLocation.map(v => {
                    this.setState({
                        lat: v.lat,
                        long: v.long,
                        locationDriver: { lat: parseFloat(v.lat), long: parseFloat(v.long) },
                        drivers: res.data.Carrier.name
                    });
                });
            }
        });
    }
    handleOk = (e) => {
        this.setState({ open: false });
    }
    handleCancel = (e) => {
        this.setState({ open: false });
    }
    render() {
        const { checkbox, code, listDriver, nameDriver, listWareHouse, listCustomer, license_plate, listOrderTank, weight_empty, weight_after_pump, date, startHour, note, userName, nameDriverr, errorDriver, errorLicense, errorWareHouse, errorUser, errorEmpty, errorFull, errorDate, errorOrder, errorNote, errorTime, disable, status, locationDriver, receiver } = this.state;
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                defaultZoom={16}
                defaultCenter={{
                    lat: parseFloat(locationDriver.lat) ? parseFloat(locationDriver.lat) : 0,
                    lng: parseFloat(locationDriver.long) ? parseFloat(locationDriver.long) : 0
                }}
            >
                {props.isMarkerShown &&
                    <MarkerWithLabel
                        position={{
                            lat: parseFloat(locationDriver.lat) ? parseFloat(locationDriver.lat) : 0,
                            lng: parseFloat(locationDriver.long) ? parseFloat(locationDriver.long) : 0
                        }}
                        labelAnchor={new google.maps.Point(0, 0)}
                        labelStyle={{ backgroundColor: "white", fontSize: "0.8rem", padding: "5px" }}
                    >
                        <div>{this.state.drivers}</div>
                    </MarkerWithLabel>
                }
            </GoogleMap>
        ));
        // const columns = [
        //     {
        //         title: 'Mã đơn hàng',
        //         dataIndex: 'orderCode',
        //         key: 'orderCode',
        //     },
        //     {
        //         title: 'Tên khách hàng',
        //         dataIndex: 'nameCustomerGas',
        //         key: 'nameCustomerGas',
        //     },
        //     {
        //         title: 'Từ ngày',
        //         dataIndex: 'fromdeliveryDate',
        //         key: 'fromdeliveryDate',
        //     },
        //     {
        //         title: 'Đến ngày',
        //         dataIndex: 'todeliveryDate',
        //         key: 'todeliveryDate',
        //     },
        //     {
        //         title: 'Giờ giao',
        //         dataIndex: 'deliveryHours',
        //         key: 'deliveryHours',
        //     },
        //     {
        //         title: 'Khối lượng',
        //         dataIndex: 'quantity',
        //         key: 'quantity',
        //         render: (text) => <p> {text + " tấn"}</p>
        //     },
        //     {
        //         title: 'Trạng thái',
        //         dataIndex: 'status',
        //         key: 'status',
        //         render: (text) => {
        //             return text === "INIT" ? <Tag color="blue">Khởi tạo</Tag>
        //             : text === "DELIVERING" ? <Tag color="orange">Đang giao</Tag>
        //                 : text === "PROCESSING" ? <Tag color="gold">Đang xử lý</Tag>
        //                     : text === "DELIVERED" ? <Tag color="purple">Đã giao</Tag>
        //                         : text === "CONFIRMED" ? <Tag color="green">Đã duyệt</Tag>
        //                             : text === "CANCELLED" ? <Tag color="red">Đã hủy</Tag>
        //                                 : "";
        //         }
        //     },
        //     {
        //         title: 'Thao tác',
        //         dataIndex: 'id',
        //         key: 'id',
        //         // fixed: 'right',
        //         width: 150,
        //         render: (idd) => {
        //             return (
        //                 <div className="text-center statuss">
        //                     <a
        //                         className="text-info"
        //                         onClick={() => this.getDeliveryDetailMap(idd)}
        //                     >
        //                         Xem bản đồ
        //                     </a>
        //                 </div>
        //             );
        //         }
        //     }
        // ];
        const columns = [
            {
                title: 'Mã đơn hàng',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width: 200,
                render: (text) => <span> {text}</span>
            },
            {
                title: 'Tên khách hàng',
                dataIndex: 'nameCustomerGas',
                key: 'nameCustomerGas',
                width: 200,
                render: (text) => <span> {text}</span>
            },
            {
                title: "Kho xuất",
                dataIndex: "warehouseId",
                key: "warehouseId",
                width: 200,
                render: (text, record) => <span> {record.warehouseId.name ? record.warehouseId.name : record.wareHouseId.name}</span>
            },
            {
                title: "Nơi nhận",
                dataIndex: "branchname",
                key: "branchname",
                width: 200,
                render: (text, record) => <span> {record.customergasId.branchname}</span>
            },
            {
                title: "Ngày giao",
                dataIndex: "fromdeliveryDate",
                key: "fromdeliveryDate",
                width: 300,
                render: (text, record) => <span> {record.fromdeliveryDate + " - " + record.todeliveryDate}</span>
            },
            {
                title: "Giờ giao",
                dataIndex: "deliveryHours",
                key: "deliveryHours",
                width: 200,
                render: (text) => <span> {text}</span>
            },
            {
                title: "Khối lượng",
                dataIndex: "quantity",
                key: "quantity",
                width: 200,
                render: (text) => <span> {text + " tấn"}</span>
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 100,
                render: (text) => {
                    return text === "INIT" ? (
                        <Tag color="blue">Khởi tạo</Tag>
                    ) : text === "DELIVERING" ? (
                        <Tag color="orange">Đang giao</Tag>
                    ) : text === "PROCESSING" ? (
                        <Tag color="gold">Đang xử lý</Tag>
                    ) : text === "DELIVERED" ? (
                        <Tag color="cyan">Đã giao</Tag>
                    ) : text === "CONFIRMED" ? (
                        <Tag color="green">Đã duyệt</Tag>
                    ) : text === "CANCELLED" ? (
                        <Tag color="red">Đã hủy</Tag>
                    ) : text === "PENDING" ? (
                        <Tag color="purple">Đang chờ duyệt</Tag>
                    ) : ("");
                },
            },
            {
                title: 'Thao tác',
                dataIndex: 'id',
                key: 'id',
                // fixed: 'right',
                width: 150,
                render: (idd) => {
                    return (
                        <div className="text-center statuss">
                            <a
                                className="text-info"
                                onClick={() => this.getDeliveryDetailMap(idd)}
                            >
                                Xem bản đồ
                                </a>
                        </div>
                    );
                }
            }
        ];
        return (
            <div className="modal fade" id="info-export-order" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header table__head rounded-0">
                            <h4 className="modal-title text-white">Thông tin chi tiết</h4>
                            <button type="reset" className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="text-white">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row d-flex justify-content-between mt-3">
                                <div className="col-md-12">
                                    <h5>Thông tin chung</h5>
                                </div>
                                <div className="col-md-6 mt-4"></div>
                                <div className="col-md-6 mb-2">
                                    <label>Mã xuất:</label>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={code}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Tài xế:</label>
                                    <Input
                                        type="text"
                                        name="nameDriver"
                                        readOnly
                                        value={nameDriver}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Số xe:</label><br />
                                    <Input
                                        type="text"
                                        name="license_plate"
                                        readOnly
                                        value={license_plate}
                                    />
                                </div>
                                <div className="col-md-6 mt-3 mb-3">
                                    <p>Trọng lượng rỗng</p>
                                    <Input
                                        type="text"
                                        name="weight_empty"
                                        readOnly
                                        value={weight_empty}
                                    />
                                </div>
                                <div className="col-md-6 mt-3 mb-3">
                                    <p>Trọng lượng sau khi bơm:</p>
                                    <Input
                                        type="text"
                                        name="weight_after_pump"
                                        readOnly
                                        value={weight_after_pump}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p>Thời gian giao</p>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={date}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p>Giờ giao:</p>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={startHour}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Kho xuất:</label><br />
                                    <Input
                                        type="text"
                                        readOnly
                                        value={this.state.wareHouse}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Nơi nhận:</label><br />
                                    <Input
                                        type="text"
                                        readOnly
                                        value={receiver}
                                    />
                                </div>
                                <div className="col-md-12 mt-3" disabled={disable}>
                                    <Table
                                        columns={columns}
                                        dataSource={listOrderTank}
                                        scroll={{ x: 1500 }}
                                        bordered
                                    />
                                </div>
                                <div className="col-md-12 mt-2 text-center" style={{ display: "grid" }}>
                                    <p>Ghi chú:</p>
                                    <textarea
                                        cols="70"
                                        rows="5"
                                        className="text-center"
                                        name="note"
                                        readOnly
                                        value={note}
                                    ></textarea>
                                </div>
                                <div className="col-md-12 mt-4 d-flex justify-content-center">
                                    <button
                                        type="reset"
                                        className="btn btn-secondary"
                                        data-dismiss="modal"
                                    >
                                        <i className="fa fa-window-close" aria-hidden="true"></i> Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title="Bản đồ chi tiết"
                    visible={this.state.open}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    zIndex={2000}
                >
                    <MyMapComponent
                        isMarkerShown
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkVHLujkgnqgqAktD5xqcKurzWB8t55Pk&callback=initMap&libraries=geometry,places&v=weekly"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </Modal>
            </div>
        )
    }
}
