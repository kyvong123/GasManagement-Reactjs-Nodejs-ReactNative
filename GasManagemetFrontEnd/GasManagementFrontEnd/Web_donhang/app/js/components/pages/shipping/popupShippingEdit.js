import React, { Component } from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import Constant from "Constants";
import required from "required";
import showToast from "../../../../js/helpers/showToast";
import searchShippingOrderCode from '../../../../api/searchShippingOrderCode';
import deleteShippingCustomerAPI from '../../../../api/deleteShippingCustomerAPI';
import callApi from './../../../util/apiCaller';
import getUserCookies from "./../../../helpers/getUserCookies";
import { GETTYPECUSTOMER, UPDATEDRIVERSHIPPINGORDER, GETDRIVE, UPDATESHIPPINGORDERDETAIL, DELETESHIPPINGORDERNOTE, UPDATESHIPPINGCUSTOMERDETAIL, UPDATEORDEROLD } from "../../../config/config";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import openNotificationWithIcon from "./../../../helpers/notification";
import { Select, Tabs, BackTop, Checkbox, Popconfirm, Switch, Pagination, Divider } from "antd";

import { orderBy } from 'lodash';
import PopupEnterTurn from "./popupEnterTurn";
import updateShippingTextDetail from '../../../../api/updateShippingTextDetail';
import getAllProvince from "../../../../api/getAllProvince";

var fileReader;
const Option = Select.Option;

class PopupShippingEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDistributionAgency: [],
            listIndustry: [],
            listRestaurant: [],
            listBranch: [],
            BranchResults: [],
            CustomerResults: [],
            listDriver: [],
            listOrder: [],
            typeCustomer: "",
            GeneralResults: "",
            GeneralResults1: "",
            idDriver: "",
            nameDriver: "",
            licensePlate: "",
            shippingorderId: "",
            checked: false,
            disabledOrder: "disabled",

            disabledCylinder: true,
            disabledDrive: true,
            unDisabledDrive: true,
            disabledCustomer: "disabled",
            findIdOrder: "",
            orderCode: "",
            orderId: "",
            note: "",
            idOrder: [],
            listShipping: [],
            listUpdateShipping: [],
            fileName: "",
            checkclick: false,
            listShippingCustomer: [],
            listShippingText: [],
            listAllShipping: [],
            checkdata: "",
            checkTurnback: false,
            errorCustomerNumber: "",
            errorCustomer: "",
            errorFindIdOrder: "",
            listProvince: [],
            provinceIdBegin: "",
            provinceNameBegin: "",
            orderNew: false,
            listOrderNew: [],
            shippingOrderDetail: [],
            //Đặt biến để phân trang (Pagination)

            currentPage: 1,
            numberPages: 1,
            itemsPerPages: 50,
        }
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.listShippingOrder) {

            let data = await getAllProvince();
            this.setState({
                listProvince: data.data.region
            })
            let listOrderBegin = [];
            nextProps.listShippingOrder.map((item, index) => {
                let dataBegin = this.state.listProvince.filter(item1 => {
                    return item.provinceId === item1.id || item.provinceId === "" || item.provinceId === undefined
                })

                listOrderBegin.push({
                    agencyId: item.agencyId,
                    deliveryDate: item.deliveryDate,
                    id: item.id,
                    namekh: item.namekh,
                    numberCylinders: item.numberCylinders,
                    orderId: item.orderId,
                    provinceId: item.provinceId,
                    nameProvince: item.provinceId === "" ? "" : dataBegin[0].nameProvince,
                });
            });
            this.setState({
                idDriver: nextProps.nameDriver,
                shippingorderId: nextProps.idShippingOrder,
                licensePlate: nextProps.licensePlate,
                listOrder: listOrderBegin,
                orderCode: nextProps.orderCode,
                orderId: nextProps.orderId,
                note: nextProps.noteOrder,
                listShippingCustomer: nextProps.listShippingCustomer,
                listShippingText: nextProps.listShippingText,
                shippingOrderDetail: nextProps.shippingOrderDetail,
            });
            this.setState({
                numberPages:
                    Math.ceil(
                        nextProps.count / this.state.itemsPerPages)
            })
        } else {
            this.setState({
                idDriver: "",
                nameDriver: "",
                licensePlate: "",
            })
        }
    }
    async getDistributionAgencyCustomer(id, token) {
        let reqListCustomer = {
            isChildOf: "5f5b37b1bb976f2ba0cb9f90",
            customerType: "Distribution_Agency"
        };
        let params = {
            reqListCustomer
        };
        await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
            // console.log("khach hang dai ly", res.data);
            if (res.data) {
                if (res.data.success === true) {
                    let listDistributionAgencyTemp = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        listDistributionAgencyTemp.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].name,
                            ...res.data.data[i]
                        })
                    }
                    this.setState({
                        listDistributionAgency: listDistributionAgencyTemp
                    })
                }
                else {
                    showToast(
                        res.data.message
                            ? res.data.message
                            : res.data.err_msg,
                        2000
                    );
                    return false;
                }
            }
            else {
                showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
            }
        });
    }

    async getIndustryCustomer(id, token) {
        let reqListCustomer = {
            isChildOf: "5f5b37b1bb976f2ba0cb9f90",
            customerType: "Industry"
        };
        let params = {
            reqListCustomer
        };
        await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
            console.log("khach hang cong nghiep", res.data);
            if (res.data) {
                if (res.data.success === true) {
                    let listIndustryTemp = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        listIndustryTemp.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].name,
                            ...res.data.data[i]
                        })
                    }
                    this.setState({
                        listIndustry: listIndustryTemp
                    })
                }
                else {
                    showToast(
                        res.data.message
                            ? res.data.message
                            : res.data.err_msg,
                        2000
                    );
                    return false;
                }
            }
            else {
                showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
            }
        });
    }

    async getRestaurantCustomer(id, token) {
        let reqListCustomer = {
            isChildOf: "5f5b37b1bb976f2ba0cb9f90",
            customerType: "Restaurant_Apartment"
        };
        let params = {
            reqListCustomer
        };
        await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
            // console.log("khach hang nha hang", res.data);
            if (res.data) {
                if (res.data.success === true) {
                    let listRestaurantTemp = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        listRestaurantTemp.push({
                            value: res.data.data[i].id,
                            label: res.data.data[i].name,
                            ...res.data.data[i]
                        })
                    }
                    this.setState({
                        listRestaurant: listRestaurantTemp
                    })
                }
                else {
                    showToast(
                        res.data.message
                            ? res.data.message
                            : res.data.err_msg,
                        2000
                    );
                    return false;
                }
            }
            else {
                showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
            }
        });
    }
    async componentDidMount() {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id;
        if (user_cookies.user.userType === "Factory" && user_cookies.user.userRole === "Owner") {
            id = user_cookies.user.isChildOf
        }
        else {
            id = user_cookies.user.id;
        }
        await this.getAllDriver(user_cookies.user.id, token);
        await this.getDistributionAgencyCustomer(id, token);
        await this.getIndustryCustomer(id, token);
        await this.getRestaurantCustomer(id, token);

    }
    async getListBranch(id) {
        let listBranchTemp = [];
        const dataBranch = await getListBranchAPI(id);
        for (let i = 0; i < dataBranch.data.data.length; i++) {
            listBranchTemp.push({
                value: dataBranch.data.data[i].id,
                label: dataBranch.data.data[i].name,
                ...dataBranch.data.data[i]
            });
        }
        this.setState({
            listBranch: listBranchTemp
        });
    }
    async onClickDeleteCustomer(id) {
        const res = await deleteShippingCustomerAPI(id);
        const { listShippingCustomer } = this.state;
        if (res.data.success === true) {
            openNotificationWithIcon("success", "Xóa thành công");
            // window.location.reload(false);
        } else {
            openNotificationWithIcon("error", "Xóa thất bại! Vui lòng kiểm tra lại...");
            return false;
        }
    }
    async onClickFindIdOrder() {
        const { findIdOrder, listOrder, orderCode } = this.state;
        findIdOrder.trim();
        const data = await searchShippingOrderCode(findIdOrder);
        if (listOrder.length > this.props.listShippingOrder.length) {
            showToast("Chỉ chọn được một đơn hàng", 2000);
            return false;
        } else {
            data.data.data.map((order, i) => {
                order.listCylinder.map((v) => {
                    for (let i = 0; i < listOrder.length; i++) {
                        if (findIdOrder === listOrder[i].id) {
                            this.setState({
                                errorFindIdOrder: "Trùng mã đơn hàng, vui lòng nhập lại"
                            });
                            return false;
                        }
                    }
                    this.setState({
                        listOrder: [
                            ...listOrder,
                            {
                                id: order.orderCode,
                                customer: "",
                                agencyId: order.agencyId,
                                deliveryDate: order.deliveryDate,
                                numberCylinders: v.numberCylinders,
                                orderId: order.id,
                                nameProvince: this.state.provinceNameBegin,
                                provinceId: this.state.provinceIdBegin
                            }
                        ]
                    });
                    return true;
                })
            })
            return true;
        }

    }
    handleChangeGeneral = async (e) => {
        if (e.target.value !== "") {
            await this.setState({
                GeneralResults: e.target.value,
                errorCustomer: ""
            });
        } else {
            await this.setState({
                GeneralResults: e.target.value,
            })
        }

        await this.getListBranch(this.state.GeneralResults);
    }
    handleChangeGeneral1 = async (e) => {
        await this.setState({
            GeneralResults1: e.target.value,
        });
        await this.getListBranch(this.state.GeneralResults1);
    }
    handleChangeTypeCustomer = (value) => {
        this.setState({
            typeCustomer: value,
        });
    };
    handleChangeBranch = (langValue) => {
        this.setState({ BranchResults: langValue });
    };
    handleChangeCustomer = (langValue) => {
        this.setState({ CustomerResults: langValue });
    };
    handleChangeCustomer1 = (langValue) => {
        if (this.state.CustomerResults.length >= 1) {
            showToast("Chỉ được chọn một tài xế!", 3000);
            this.setState({ CustomerResults: [] });
        }
        else {
            this.setState({ CustomerResults: langValue });
        }

    }
    handleOnChangeCheck = async (e) => {
        await this.setState({
            checked: e.target.checked
        })
    }
    handleCheckbox = async (e) => {
        await this.setState({
            checkTurnback: e.target.checked
        })
        console.log("checkTurnback", this.state.checkTurnback)
    }
    onClickDisabledCylinder = () => {
        this.setState({
            disabledCylinder: !this.state.disabledCylinder

        });
    }
    onClickDisabledDrive = () => {
        this.setState({
            disabledDrive: !this.state.disabledDrive
        });
    }
    onClickDisabledCustomer = () => {
        this.setState({
            disabledCustomer: !this.state.disabledCustomer
        });
    }
    onClickDisabledOrder = () => {
        this.setState({
            disabledOrder: this.state.disabledOrder === "disabled" ? "" : "disabled"
        });
    }
    onClickEditOrder = async () => {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let data = [];

        this.state.shippingOrderDetail.map((item, index) => {
            for (let i = 0; i < item.length; i++) {
                if (item[i].orderId.id === this.state.listOrderNew[0].orderId) {
                    data.push(item[i]);
                }

            }
        })

        // data.data.data[0].id
        // console.log("data",data);
        // console.log("data",data[0][0].id);
        let params1 =
        {
            "shippingOrderDetailId": data[0].id,
            "provinceId": this.state.listOrderNew[0].provinceId,
        }
        await callApi("POST", UPDATEORDEROLD, params1, token).then((res) => {
            console.log("res.data.status", res.data.status)
            if (res.data.success === true) {
                alert("Cập nhật thành công");
                window.location.reload(false);
            } else {
                // openNotificationWithIcon("error","Đã có lỗi xảy ra")
                openNotificationWithIcon("error", res.data.message);
                window.location.reload(false);
            }
        });
    }

    onClickDeleteOrder = (id) => {
        const { listOrder } = this.state;
        this.setState({
            listOrder: listOrder.filter(e => e.id !== id)
        })
    }
    onChangeTextValue = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        if (value !== "") {
            this.setState({
                [name]: value,
                errorCustomerNumber: "",
            });
        } else {
            this.setState({
                [name]: value
            });
        }

    }
    onChangeOrderValue = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        if (value !== "") {
            this.setState({
                [name]: value.trim(),
                errorFindIdOrder: ""
            });
        } else {
            this.setState({
                [name]: value.trim(),
            });
        }

    }
    onChangeDriver = (value) => {
        this.setState({
            idDriver: value,
        })
    }
    async submitShippingCustomerDetail(event) {
        event.preventDefault();
        const { GeneralResults, shippingorderId, numberCylinder, listShippingCustomer } = this.state;
        var user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let arr1 = [];
        listShippingCustomer.map((v, i) => {
            v.map((n, m) => {
                arr1.push({
                    customerId: n.customerId.id,
                    numberCylinder: n.numberCylinder,
                });
            })

        })
        let params = {
            shippingorderId: shippingorderId,
            ShippingCustomerDetail: [...arr1, { customerId: GeneralResults, numberCylinder: numberCylinder }],
        };

        await callApi("POST", UPDATESHIPPINGCUSTOMERDETAIL, params, token).then((res) => {
            console.log("submitshippingCusstomerDetail", res);
            if (res.data.success === true) {
                openNotificationWithIcon("success", "Cập nhật thành công!");
                // window.location.reload(false);
            } else {
                if (res.data.message === "numberCylinder không xác định!!!") {
                    this.setState({
                        errorCustomerNumber: "Vui lòng nhập số lượng",
                        errorCustomer: "",
                    });
                }
                if (GeneralResults === "") {
                    this.setState({
                        errorCustomerNumber: "",
                        errorCustomer: "Vui lòng nhập đầy đủ thông tin",
                    });
                }
                // openNotificationWithIcon("error", res.data.message);
                return false;
            }
        })
    }
    async submitShippingOrderDetail(event) {
        event.preventDefault();
        var user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        const { shippingorderId, orderId, listOrder } = this.state;
        let arr = [];
        listOrder.map((v, i) => {
            arr.push({
                orderId: v.orderId,
                provinceId: v.provinceId,

            })
        })
        let params = {
            shippingorderId: shippingorderId,
            ShippingOrderDetail: arr,
        }
        await callApi("POST", UPDATESHIPPINGORDERDETAIL, params, token).then((res) => {
            console.log(res);
            if (res.data.success === true) {
                openNotificationWithIcon("success", "Cập nhật thành công!");
                // window.location.reload(false);
            } else {
                openNotificationWithIcon("error", "Cập nhật thất bại! Vui lòng kiểm tra lại.");
                return false;
            }
        })
    }
    async submitDriver(event) {
        event.preventDefault();
        var user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        const { idDriver, licensePlate, listDriver, nameDriver, shippingorderId } = this.state;
        var nameDriverr;
        let params;
        if (idDriver !== this.props.nameDriver) {
            for (let i = 0; i < listDriver.length; i++) {
                if (listDriver[i].id === idDriver) {
                    nameDriverr = listDriver[i].name;
                }
            }
            params = {
                shippingorderId: shippingorderId,
                driverId: idDriver,
                nameDriver: nameDriverr,
                licensePlate: licensePlate,
            }
        } else {
            nameDriverr = nameDriver;
            params = {
                shippingorderId: shippingorderId,
                driverId: null,
                nameDriver: nameDriverr,
                licensePlate: licensePlate,
            }
        }
        await callApi("POST", UPDATEDRIVERSHIPPINGORDER, params, token).then((res) => {
            console.log("res.data.update", res.data);
            if (res.data.success === true) {
                openNotificationWithIcon("success", "Cập nhật thành công!");
                // window.location.reload(false);
            } else {
                openNotificationWithIcon("error", "Cập nhật thất bại! Vui lòng kiểm tra lại.");
                return false;
            }
        })
    }
    async submitNote(event) {
        event.preventDefault();
        var user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        const { note, shippingorderId } = this.state;
        let params = {
            shippingOrderId: shippingorderId,
            note: note
        }
        if (note == '') {
            openNotificationWithIcon("error", "Ghi chú không được để trống");
            return false;
        }

        await callApi("POST", DELETESHIPPINGORDERNOTE, params, token).then((res) => {
            console.log("res.data.note", res);
            if (res.data.success === true) {
                openNotificationWithIcon("success", "Cập nhật thành công!");
            } else {
                openNotificationWithIcon("error", "Cập nhật thất bại! Vui lòng kiểm tra lại.");
                return false;
            }
        })
    }
    async getAllDriver(id, token) {
        let prams = {
            "id": id
        };
        await callApi("POST", GETDRIVE, prams, token).then(res => {
            console.log("res.data.data", res.data.data)
            this.setState({
                listDriver: res.data.data
            })
        })
    }

    async handleOnclick() {
        this.setState({
            checkclick: false
        })

        let shippingorderId = this.state.shippingorderId
        let data = await updateShippingTextDetail(this.state.checkTurnback, shippingorderId, this.state.listUpdateShipping);
        if (data.data.success == true) {


            this.setState({
                checkdata: data.data.success,
                listAllShipping: data.data.ShippingTextDetail
            })
        }
    }
    handleChangePage(event) {
        this.setState({
            // listShippingText :data,
            currentPage: event
        });
        // console.log("evnt1",currentPage);
    }
    async handleFileUpload(event) {
        let cylinders_list = [];
        let that = this;
        let file = event.target.files[0];
        that.setState({
            fileName: event.target.files[0].name,
            checkclick: true
        })
        fileReader = new FileReader();
        fileReader.onload = async function (event) {
            // The file's text will be printed here
            let result = event.target.result;
            let array_id = result.split("\n");


            for (let i = 0; i < array_id.length; i++) {
                if (array_id[i].trim() !== '') {
                    array_id[i].replace('\r', '').replace('\n', '')
                    cylinders_list.push(array_id[i].trim());

                }
            }

            that.setState({
                listShipping: cylinders_list
            })
            var user_cookies = await getUserCookies();
            let userId = user_cookies.user.id
            let listUpdateShipping = []
            cylinders_list.map(v => {
                listUpdateShipping.push({
                    "serial": v,
                    "fileName": that.state.fileName,
                    "createdBy": userId,

                })
            })


            that.setState({
                listUpdateShipping: listUpdateShipping,

            })
        };
        fileReader.readAsText(file);


    }
    handleChangeListProvince = (value, event) => {
        let arrayProvience = [];
        this.setState(
            {
                provinceIdBegin: value,
                provinceNameBegin: event.key
            });
    }
    handleChangeListIdOder = (value, event) => {
        console.log("event11111", event);
        let listOrderNew = this.state.listOrder.filter(item => {
            return item.orderId === value
        })
        console.log("listOrderNew", listOrderNew);
        this.setState(
            {
                listOrderNew: listOrderNew
            });
    }
    handleChangeListIdOderNew = (value, event) => {
        this.state.listOrderNew.map(function (x) {
            x.provinceId = value;
            x.nameProvince = event.key;
            return x
        }
        );

        console.log("this.state.listOrderNew1", this.state.listOrderNew);
    }
    handleDataChange = orderNew => {
        this.setState({ orderNew });
        console.log("this.state.orderNew", this.state.orderNew)
    };
    render() {


        const { nameDriver, licensePlate, idDriver, listDriver, listShippingCustomer } = this.state;
        const { listShippingText, listShippingOrder } = this.props;
        const checked = this.state.checked ? true : false;
        const checkDisabled = this.state.disabled ? true : false;
        return (
            <div>
                <div
                    className="modal fade"
                    id="shipping-edit-modal"
                    tabIndex="-1"
                    role="dialog"
                    style={{ overflowY: "auto" }}
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Quản lý vận chuyển</h5>
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-5 col-lg-12 ">
                                                    <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                                        <Form
                                                            ref={(c) => {
                                                                this.form = c;
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center ">
                                                                <label>Danh sách bình</label>

                                                                <Input
                                                                    className="form-control ml-3"
                                                                    type="file"
                                                                    name="upload_file"
                                                                    accept='.txt'
                                                                    ref={(input) => {
                                                                        this.fileInput = input
                                                                    }}
                                                                    onChange={(event) => this.handleFileUpload(event)}
                                                                    validations={[required]}
                                                                    disabled={this.state.disabledCylinder}
                                                                />
                                                                <input className="ml-3" type="reset" value="Đặt lại"

                                                                    disabled={this.state.disabledCylinder} />
                                                            </div>
                                                            <div className="table-wrapper-scroll-y my-custom-scrollbar">
                                                                <table
                                                                    className="table table-sm text-center table-striped table-bordered seednet-table-keep-column-width mt-md-2"
                                                                    cellSpacing="0" width="100%"
                                                                >
                                                                    <thead className="table__head">
                                                                        <tr>
                                                                            <th className="text-center w-70px align-middle">STT</th>
                                                                            <th scope="col">Mã bình</th>
                                                                            <th scope="col">Tên file</th>
                                                                            <th scope="col">Bình hồi lưu</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {this.state.checkclick == false && this.state.checkdata !== true ?
                                                                            this.state.listShippingText
                                                                                .map((store, index) => {
                                                                                    return store.
                                                                                        slice(
                                                                                            (this.state.currentPage - 1) * this.state.itemsPerPages,
                                                                                            this.state.currentPage * this.state.itemsPerPages)
                                                                                        .map((v, i) => {
                                                                                            return (<tr key={i}>
                                                                                                <td>{i + 1}</td>
                                                                                                <td>{v.serial}</td>
                                                                                                <td>{v.fileName}</td>
                                                                                                <td>{typeof v.isTurnback != "undefined" ? v.isTurnback.toString() : ''}</td>
                                                                                            </tr>);
                                                                                        });
                                                                                })
                                                                            :
                                                                            (
                                                                                this.state.checkclick == true ?
                                                                                    this.state.listUpdateShipping
                                                                                        .slice(
                                                                                            (this.state.currentPage - 1) * this.state.itemsPerPages,
                                                                                            (this.state.currentPage) * this.state.itemsPerPages
                                                                                        )
                                                                                        .map((store, index) => {
                                                                                            //console.log("bbbbbb",v);
                                                                                            return (<tr key={index}>
                                                                                                <td>{index + 1}</td>
                                                                                                <td>{store.serial}</td>
                                                                                                <td>{store.fileName}</td>
                                                                                                <td>{typeof store.isTurnback != "undefined" ? store.isTurnback.toString() : ''}</td>
                                                                                            </tr>);
                                                                                        })
                                                                                    :
                                                                                    (
                                                                                        this.state.checkdata == true ?
                                                                                            this.state.listAllShipping
                                                                                                .slice(
                                                                                                    (this.state.currentPage - 1) * this.state.itemsPerPages,
                                                                                                    this.state.currentPage * this.state.itemsPerPages
                                                                                                )
                                                                                                .map((store, index) => {

                                                                                                    return (<tr key={index}>
                                                                                                        <td>{index + 1}</td>
                                                                                                        <td>{store.serial}</td>
                                                                                                        <td>{store.fileName}</td>
                                                                                                        <td>{typeof store.isTurnback != "undefined" ? store.isTurnback.toString() : ''}</td>
                                                                                                    </tr>);

                                                                                                })
                                                                                            :
                                                                                            ""
                                                                                    )
                                                                            )
                                                                        }


                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                            <Divider orientation="center">
                                                                <Pagination
                                                                    defaultCurrent={1}
                                                                    defaultPageSize={this.state.itemsPerPages}
                                                                    total={this.state.numberPages * this.state.itemsPerPages}
                                                                    onChange={(onPage) => this.handleChangePage(onPage)}
                                                                // this.setState({ currentPage: onPage})
                                                                />
                                                            </Divider>
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                <Checkbox
                                                                    className="text-align-left"

                                                                    onChange={this.handleCheckbox}
                                                                >
                                                                    <label>Chọn bình hồi lưu</label>
                                                                </Checkbox>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger pr-3 pl-3 mr-2"
                                                                    onClick={() => this.onClickDisabledCylinder()}
                                                                >
                                                                    Sửa
                                                                </button>
                                                                <button className="btn btn-info pr-3 pl-3"
                                                                    onClick={() => this.handleOnclick()}
                                                                //disabled={this.state.disabledCylinder}
                                                                >
                                                                    Cập nhật</button>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>
                                                <div className="col-md-7 col-lg-12">
                                                    <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                                        <Form
                                                            ref={(c) => {
                                                                this.form = c;
                                                            }}
                                                            onSubmit={(event) => this.submitDriver(event)}
                                                        >
                                                            <div className="row">
                                                                <div className="col-md-12 col-lg-12">
                                                                    <div className="form-group d-flex align-items-center">
                                                                        <Checkbox
                                                                            className="text-align-right"
                                                                            name="checkCarOut"
                                                                            id="checkCarOut"
                                                                            disabled={this.state.disabledDrive}
                                                                            checked={this.state.checked}
                                                                            onChange={this.handleOnChangeCheck}
                                                                        >
                                                                            <label>Xe ngoài</label>
                                                                        </Checkbox>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 col-lg-12 editDriverr">
                                                                    <div
                                                                        className="form-group d-flex align-items-center"
                                                                    >
                                                                        <label>Tài xế</label>
                                                                        {this.state.checked === true ? (
                                                                            <Input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="nameDriver"
                                                                                id="nameDriver"
                                                                                placeholder="Nhập tài xế..."
                                                                                onChange={this.onChangeTextValue}
                                                                                style={{ width: "250px", borderRadius: "5px" }}
                                                                                value={nameDriver}
                                                                            />
                                                                        ) : <Select
                                                                            showSearch
                                                                            optionFilterProp="children"
                                                                            filterOption={(input, option) =>
                                                                                option.props.children
                                                                                    .toLowerCase()
                                                                                    .indexOf(input.toLowerCase()) >= 0
                                                                            }
                                                                            onChange={this.onChangeDriver}
                                                                            style={{ width: '250px' }}
                                                                            disabled={this.state.disabledDrive}
                                                                            value={idDriver}
                                                                        >
                                                                            {this.state.listDriver.map((driver, index) => {
                                                                                return (
                                                                                    <Option key={index} value={driver.id}>{driver.name}</Option>
                                                                                );
                                                                            })}
                                                                        </Select>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 col-lg-12 editDriverr">
                                                                    <div
                                                                        className="form-group d-flex align-items-center"
                                                                    >
                                                                        <label>Biển số xe</label>
                                                                        <span>
                                                                            <Input
                                                                                className="form-control"
                                                                                type="text"
                                                                                name="licensePlate"
                                                                                id="licensePlate"
                                                                                placeholder="Nhập biển số xe..."
                                                                                style={{ borderRadius: '5px', width: '230px' }}
                                                                                onChange={this.onChangeTextValue}
                                                                                disabled={this.state.disabledDrive}
                                                                                value={licensePlate}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12 col-lg-12">
                                                                    <div className="form-group d-flex align-items-center justify-content-end">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger pr-3 pl-3 mr-2"
                                                                            onClick={() => this.onClickDisabledDrive()}
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-info pr-3 pl-3"
                                                                            disabled={this.state.disabledDrive}
                                                                        >
                                                                            Cập nhật
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-12">
                                        <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                            <Form
                                                ref={(c) => {
                                                    this.form = c;
                                                }}
                                                onSubmit={(event) => this.submitShippingCustomerDetail(event)}
                                            >
                                                <div className="row">
                                                    {this.props.userType === Constant.GENERAL ? ("") : (
                                                        <div className="col-md-6 col-lg-12 editDriverr">
                                                            <div className="form-group d-flex align-items-center">
                                                                <label>Chọn loại khách hàng</label>
                                                                <Select
                                                                    showSearch
                                                                    placeholder='Chọn'
                                                                    optionFilterProp="children"
                                                                    style={{ width: '350px' }}
                                                                    disabled={this.state.disabledCustomer}
                                                                    onChange={this.handleChangeTypeCustomer}
                                                                >
                                                                    <Option value="Distribution_Agency">Đại lý phân phối</Option>
                                                                    <Option value="Industry">Khách hàng công nghiệp bình</Option>
                                                                    <Option value="Restaurant_Apartment">Nhà hàng, tòa nhà</Option>
                                                                </Select>
                                                            </div>
                                                            {this.state.typeCustomer !== "Distribution_Agency" &&
                                                                <div className="form-group d-flex align-items-center">
                                                                    <label>Chọn khách hàng</label>
                                                                    <select
                                                                        className="form-control"
                                                                        placeholder='Chọn'
                                                                        disabled={this.state.disabledCustomer}
                                                                        onChange={e => this.handleChangeGeneral1(e)}
                                                                        style={{ width: '350px', borderRadius: "5px" }}
                                                                    >
                                                                        <option value="">Chọn</option>
                                                                        {this.state.typeCustomer === "Industry" &&
                                                                            this.state.listIndustry.map((l, index) => {
                                                                                return (
                                                                                    <option key={index} value={l.id}>
                                                                                        {l.name}
                                                                                    </option>
                                                                                );
                                                                            })
                                                                        }
                                                                        {this.state.typeCustomer === "Restaurant_Apartment" &&
                                                                            this.state.listRestaurant.map((l, index) => {
                                                                                return (
                                                                                    <option key={index} value={l.id}>
                                                                                        {l.name}
                                                                                    </option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            }
                                                            {this.state.typeCustomer === "Distribution_Agency" &&
                                                                <div className="form-group d-flex align-items-center">
                                                                    <label>Chọn khách hàng</label>
                                                                    <select
                                                                        className="form-control"
                                                                        placeholder='Chọn'
                                                                        disabled={this.state.disabledCustomer}
                                                                        onChange={e => this.handleChangeGeneral(e)}
                                                                        value={this.state.GeneralResults}
                                                                        style={{ width: '350px', borderRadius: "5px" }}
                                                                    >
                                                                        <option value="">Chọn</option>
                                                                        {this.state.listDistributionAgency.map((store, index) => {
                                                                            return (
                                                                                <option key={index} value={store.id}>
                                                                                    {store.name}
                                                                                </option>
                                                                            );
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            }
                                                        </div>
                                                    )}
                                                    <div className="col-md-6 col-lg-12 editDriverr">
                                                        <div className="form-group d-flex">
                                                            <label className="pt-2">Nhập số lượng</label>
                                                            <div className="d-flex flex-column">
                                                                <Input
                                                                    name="numberCylinder"
                                                                    id="numberCylinder"
                                                                    onChange={this.onChangeTextValue}
                                                                    value={this.state.numberCylinder}
                                                                    placeholder={"Nhập số lượng"}
                                                                    //validations={[required]}
                                                                    className="form-control"
                                                                    type="number"
                                                                    style={{ width: "350px" }}
                                                                    disabled={this.state.disabledCustomer}
                                                                />
                                                                {!this.state.errorCustomerNumber ? (
                                                                    ""
                                                                ) : (
                                                                    <div
                                                                        className="badge badge-danger text-wrap mt-2"
                                                                        style={{ fontSize: "0.9rem", width: '350px' }}
                                                                    >
                                                                        {this.state.errorCustomerNumber}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div style={{ clear: "both" }}></div>
                                                        {this.state.typeCustomer !== "Distribution_Agency" &&
                                                            <div className="form-group float-none d-flex">
                                                                <label className="pt-2">Chọn các chi nhánh</label>
                                                                <div className="d-flex flex-column">
                                                                    <select
                                                                        className="form-control"
                                                                        placeholder='Chọn'
                                                                        disabled={this.state.disabledCustomer}
                                                                        onChange={e => this.handleChangeGeneral(e)}
                                                                        value={this.state.GeneralResults}
                                                                        style={{ width: '350px', borderRadius: "5px" }}
                                                                    >
                                                                        <option value="">Chọn</option>
                                                                        {this.state.listBranch.map((l, index) => {
                                                                            return (
                                                                                <option key={index} value={l.id}>
                                                                                    {l.name}
                                                                                </option>
                                                                            );
                                                                        })}
                                                                    </select>
                                                                    {!this.state.errorCustomer ? (
                                                                        ""
                                                                    ) : (
                                                                        <div
                                                                            className="badge badge-danger text-wrap mt-2"
                                                                            style={{ fontSize: "0.9rem", width: '350px' }}
                                                                        >
                                                                            {this.state.errorCustomer}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        }

                                                        <div style={{ clear: "both" }}></div>
                                                    </div>
                                                    <div className="col-md-12 col-lg-12 float-none">
                                                        <div className="form-group table-responsive-xl">
                                                            <h5>Danh sách khách hàng</h5>
                                                            <table
                                                                className="table table-striped table-bordered text-center"
                                                                cellSpacing="0"
                                                            >
                                                                <thead className="table__head">
                                                                    <tr>
                                                                        <th scope="col">Loại khách hàng</th>
                                                                        <th scope="col">Khách hàng</th>
                                                                        <th scope="col">Mã chi nhánh</th>
                                                                        <th scope="col">Số lượng bình</th>
                                                                        <th scope="col">Thao tác</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {listShippingCustomer.map((store, index) => {
                                                                        return store.map((v, i) => {
                                                                            return (<tr key={i}>
                                                                                <td>{v.customerTypekh == 'Industry' ? 'Khách hàng công nghiệp bình' : (v.customerTypekh == 'Distribution_Agency' ? 'Đại lý phân phối' : 'Khách hàng tòa nhà')}</td>
                                                                                <td>{v.customerId.userType == 'Agency' ? v.namekh : v.customerId.name}</td>
                                                                                <td>{v.customerId.userType == 'Agency' ? v.customerId.name : ''}</td>

                                                                                <td>{v.numberCylinder}</td>
                                                                                <td>
                                                                                    <Popconfirm
                                                                                        title='CHECK_DELETE'
                                                                                        onConfirm={() => this.onClickDeleteCustomer(v.id)}
                                                                                        okText="Có"
                                                                                        cancelText="Không"
                                                                                        disabled={this.state.disabledCustomer}
                                                                                    >
                                                                                        <a
                                                                                            className="text-danger"
                                                                                            style={{ cursor: "pointer", fontSize: "1.2rem", backgroundColor: "transparent" }}

                                                                                        >
                                                                                            <i className="fa fa-trash"></i>
                                                                                        </a>
                                                                                    </Popconfirm>
                                                                                </td>
                                                                            </tr>);
                                                                        });
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 col-lg-12">
                                                        <div className="form-group d-flex align-items-center justify-content-end">
                                                            <button type="button" className="btn btn-danger pr-3 pl-3 mr-2" onClick={this.onClickDisabledCustomer}>Sửa</button>
                                                            <button type="submit" className="btn btn-info pr-3 pl-3" disabled={this.state.disabledCustomer}>Cập nhật</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-12">
                                        <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h5 className="m-0">Danh sách đơn hàng</h5>
                                                <div className="d-flex align-items-center justify-content-end">
                                                    {!this.state.errorFindIdOrder ? (
                                                        ""
                                                    ) : (
                                                        <div className="alert alert-danger p-2 m-0 mr-1" style={{ fontSize: "0.8rem" }}>
                                                            {this.state.errorFindIdOrder}
                                                        </div>
                                                    )}
                                                    {this.state.orderNew === false ? <label>Chọn để sửa đơn hàng</label> : <label>Chọn để thêm đơn hàng</label>}
                                                    <Switch checked={this.state.orderNew} onChange={this.handleDataChange} />
                                                    {this.state.orderNew === false &&
                                                        <Select
                                                            style={{ width: "178px" }}
                                                            disabled={this.state.disabledOrder}
                                                            id="customerNameBoss"
                                                            name="customerNameBoss"
                                                            placeholder="Chọn mã giao hàng"
                                                            onSelect={(value, event) => this.handleChangeListProvince(value, event)}
                                                        >
                                                            {this.state.listProvince.map((l, index) => {
                                                                return (
                                                                    <Option key={l.name} value={l.id}>
                                                                        {l.name}
                                                                    </Option>
                                                                );
                                                            })}
                                                        </Select>
                                                    }
                                                    {this.state.orderNew === true && (
                                                        <Select
                                                            showSearch
                                                            placeholder="Chọn tên khách hàng"
                                                            className="form-control control1"
                                                            id="distributionAgent"
                                                            name="distributionAgent"
                                                            style={{
                                                                width: "178px"
                                                            }}
                                                            // onChange={this.onradioChange}
                                                            optionFilterProp="children"
                                                            filterOption={true}
                                                            onSelect={(value, event) => this.handleChangeListIdOder(value, event)}

                                                        // filterOption={(inputValue, option) =>
                                                        //   option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                        // onChange={e => this.onhandClick(e)}
                                                        // value={customerId}
                                                        >
                                                            <Option value="">
                                                                Chọn tên khách hàng
                                                            </Option>
                                                            {this.state.listOrder.map((item, index) => {
                                                                return (
                                                                    (
                                                                        <Option value={item.orderId} key={index}>
                                                                            {item.namekh}
                                                                        </Option>
                                                                    ))

                                                            })}
                                                        </Select>
                                                    )}
                                                    {this.state.orderNew === false && (
                                                        <input
                                                            className="form-control mr-3"
                                                            type="text"
                                                            id="findIdOrder"
                                                            name="findIdOrder"
                                                            placeholder="Nhập mã đơn và bấm chọn"
                                                            disabled={this.state.disabledOrder}
                                                            style={{ borderRadius: "5px", width: "178px" }}
                                                            onChange={this.onChangeOrderValue}
                                                            value={this.state.findIdOrder}
                                                        />
                                                    )}
                                                    {this.state.orderNew === false && (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-success"
                                                            disabled={this.state.disabledOrder}
                                                            onClick={(e) => this.onClickFindIdOrder(e)}
                                                        >
                                                            Chọn đơn hàng
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <Form
                                                onSubmit={(event) => this.submitShippingOrderDetail(event)}
                                            >
                                                {this.state.orderNew === false && (
                                                    <table
                                                        className="table table-striped table-bordered seednet-table-keep-column-width text-center mt-md-2"
                                                        cellSpacing="0"
                                                    >
                                                        <thead className="table__head">
                                                            <tr>
                                                                <th scope="col">Mã đơn hàng</th>
                                                                <th scope="col">Khách hàng</th>
                                                                <th scope="col">Ngày giao hàng</th>
                                                                <th scope="col">Số lượng bình</th>
                                                                <th scope="col">Nơi giao hàng</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.listOrder.map((cus, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.id}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.namekh}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.deliveryDate}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.numberCylinders}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.nameProvince}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                )}
                                                {this.state.orderNew === true && (
                                                    <table
                                                        className="table table-striped table-bordered seednet-table-keep-column-width text-center mt-md-2"
                                                        cellSpacing="0"
                                                    >
                                                        <thead className="table__head">
                                                            <tr>
                                                                <th scope="col">Mã đơn hàng</th>
                                                                <th scope="col">Khách hàng</th>
                                                                <th scope="col">Ngày giao hàng</th>
                                                                <th scope="col">Số lượng bình</th>
                                                                <th scope="col">Nơi giao hàng</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.listOrderNew.map((cus, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.id}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.namekh}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.deliveryDate}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>{cus.numberCylinders}</td>
                                                                        <td style={{ fontSize: "0.9rem" }}>
                                                                            <Select
                                                                                showSearch
                                                                                placeholder="Chọn tên khách hàng"
                                                                                className="form-control control1"
                                                                                // id="distributionAgent"
                                                                                // name="distributionAgent"
                                                                                style={{
                                                                                    width: "178px"
                                                                                }}
                                                                                // onChange={this.onradioChange}
                                                                                optionFilterProp="children"
                                                                                filterOption={true}
                                                                                onSelect={(value, event) => this.handleChangeListIdOderNew(value, event)}

                                                                            // filterOption={(inputValue, option) =>
                                                                            //   option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                                            // onChange={e => this.onhandClick(e)}
                                                                            // value={customerId}
                                                                            >
                                                                                <Option value="">
                                                                                    Chọn tên tỉnh
                                                                                </Option>
                                                                                {this.state.listProvince.map((item, index) => {
                                                                                    return (
                                                                                        (
                                                                                            <Option value={item.id} key={item.id}>
                                                                                                {item.name}
                                                                                            </Option>
                                                                                        ))

                                                                                })}
                                                                            </Select>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                )}
                                                {this.state.orderNew === false && (
                                                    <div className="form-group d-flex align-items-center justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger pr-3 pl-3 mr-2"
                                                            onClick={() => this.onClickDisabledOrder()}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-info pr-3 pl-3"
                                                            disabled={this.state.disabledOrder}
                                                        >
                                                            Cập nhật
                                                        </button>
                                                    </div>
                                                )}
                                                {this.state.orderNew === true && (
                                                    <div className="form-group d-flex align-items-center justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-info pr-3 pl-3 mr-2"
                                                            onClick={() => this.onClickEditOrder()}
                                                        >
                                                            Cập nhật
                                                        </button>
                                                    </div>
                                                )}

                                            </Form>

                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-12">
                                        <div className="pl-3 pr-3 form-group d-flex align-items-center justify-content-between">
                                            {/* <button 
                                            className="btn btn-success"
                                            onClick={() => {
                                                const modals = $("#shipping-edit-modal");
                                                modals.modal('hide');
                                            }}
                                            type="button" 
                                            data-toggle="modal" 
                                            data-target="#enter-return-modal" 
                                            
                                        >
                                            {this.props.t("ENTER_RETURN")}11111
                                        </button> */}
                                            <button
                                                className="btn btn-success"
                                                onClick={() => {
                                                    const modals = $("#shipping-edit-modal");
                                                    modals.modal('hide');
                                                }}
                                                data-toggle="modal"
                                                data-target="#enter-return-modal"
                                                type="button"
                                            >
                                                Nhập hồi lưu
                                            </button>
                                            <Form
                                                ref={(c) => {
                                                    this.form = c;
                                                }}
                                                onSubmit={(event) => this.submitNote(event)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <textarea
                                                        className="mr-3"
                                                        rows="1"
                                                        id="note"
                                                        name="note"
                                                        onChange={this.onChangeTextValue}
                                                        value={this.state.note}
                                                        style={{ padding: "5px", borderRadius: "0px", width: "250px" }}
                                                    ></textarea>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-info"
                                                    >
                                                        Cập nhật ghi chú
                                                    </button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <PopupEnterTurn
                    idCustomer={this.state.shippingorderId}
                />
            </div>
        )
    }
}
export default (PopupShippingEdit);