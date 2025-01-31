import React, { Component } from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import Constant from "Constants";
import required from "required";
import showToast from "showToast";
//import searchShippingOrderCode from '../../../../api/searchShippingOrderCode';
//import deleteShippingCustomerAPI from '../../../../api/deleteShippingCustomerAPI';
import callApi from './../../../util/apiCaller';
import getUserCookies from "./../../../helpers/getUserCookies";
import { GETTYPECUSTOMER, UPDATEDRIVERSHIPPINGORDER, GETDRIVE, UPDATESHIPPINGORDERDETAIL, DELETESHIPPINGORDERNOTE, UPDATESHIPPINGCUSTOMERDETAIL } from "../../../config/config";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import openNotificationWithIcon from "./../../../helpers/notification";
import { Select, Tabs, BackTop, Checkbox, Popconfirm } from "antd";
import PopupShippingMap from "./popupShippingMap";
import getShippingOrderLocation from "../../../../api/getShippingOrderLocation"
import { orderBy } from 'lodash';
//import PopupEnterTurn from "./popupEnterTurn";
//import updateShippingTextDetail from '../../../../api/updateShippingTextDetail'
var fileReader;
const Option = Select.Option;

class PopupShippingDetailBegin extends Component {
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
            checkTurnback: "",
            latLocation: "",
            longLocation: ""
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.listShippingOrder) {
            this.setState({
                idDriver: nextProps.nameDriver,
                shippingorderId: nextProps.idShippingOrder,
                licensePlate: nextProps.licensePlate,
                listOrder: nextProps.listShippingOrder,
                orderCode: nextProps.orderCode,
                orderId: nextProps.orderId,
                note: nextProps.noteOrder,
                listShippingCustomer: nextProps.listShippingCustomer,
                listShippingText: nextProps.listShippingText
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
            isChildOf: id,
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
            isChildOf: id,
            customerType: "Industry"
        };
        let params = {
            reqListCustomer
        };
        await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
            // console.log("khach hang cong nghiep", res.data);
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
            isChildOf: id,
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
        await this.getDistributionAgencyCustomer(id, token);
        await this.getIndustryCustomer(id, token);
        await this.getRestaurantCustomer(id, token);
        await this.getAllDriver(id, token);
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
        const data = await searchShippingOrderCode(findIdOrder);
        if (listOrder.length > this.props.listShippingOrder.length) {
            showToast("Chỉ chọn được một đơn hàng", 2000);
            return false;
        } else {
            data.data.data.map((order, i) => {
                order.listCylinder.map((v) => {
                    for (let i = 0; i < listOrder.length; i++) {
                        if (findIdOrder == listOrder[i].id) {
                            showToast("Trùng mã đơn hàng, vui lòng nhập lại!", 2000);
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
                                orderId: order.id
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
        await this.setState({
            GeneralResults: e.target.value,
        });
        await this.getListBranch(this.state.GeneralResults);
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
    handleOnChangeCheck = (e) => {
        this.setState({
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
        this.setState({
            [name]: value,
        });
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
        console.log("arr1", arr1);
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
                openNotificationWithIcon("error", res.data.message);
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
                orderId: v.orderId
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
                console.log("res.data.update", res.data);
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
                console.log("res.data.update", res.data);
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
                console.log("res.data.update", res.data);
                return false;
            }
        })
    }
    async getAllDriver(id, token) {
        let prams = {
            "id": id
        };
        await callApi("POST", GETDRIVE, prams, token).then(res => {
            this.setState({
                listDriver: res.data.data
            })
        })
    }
    async handleOnclickReset() { }
    async handleOnclick(event) {
        this.setState({
            checkclick: false
        })
        let array
        let shippingorderId = this.state.shippingorderId
        console.log("this.state.listUp123123", this.state.listUpdateShipping)
        console.log("this.state.listUp1231234", this.state.listShippingText)
        let data = await updateShippingTextDetail(shippingorderId, this.state.listUpdateShipping);
        console.log("", data)

        if (data.data.success == true) {
            this.state.listShippingText.map(v => {
                array = v;
            })

            this.setState({
                checkdata: data.data.success,
                listAllShipping: array.concat(this.state.listUpdateShipping)
            })
        }
        console.log("listAllShipping", this.state.listAllShipping)

    }
    async handleonClickMap(value) {
        let result = await getShippingOrderLocation(value)
        if (result.data.success === true) {
            showToast("Lấy thông tin vị trí đơn hàng thành công")
            result.data.ShippingOrderLocation.map(value => {
                console.log("result.ShippingOrderLocation", value)
                this.setState({
                    latLocation: value.lat ? value.lat : null,
                    longLocation: value.long ? value.long : null
                })
            })
        }
        else {
            this.setState({
                latLocation: null,
                longLocation: null
            })
            showToast("Lấy thông tin vị trí đơn hàng thất bại")
        }
    }
    async handleFileUpload(event) {
        let cylinders_list = [];
        let that = this;
        let file = event.target.files[0];
        console.log("event.target.files[0]", event.target.files[0])
        console.log("event.target.files[0]11", event.target.files[0].name)
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

            console.log("cylinders_list", cylinders_list)

            that.setState({
                listShipping: cylinders_list
            })
            console.log("listShipping", that.state.listShipping)

            console.log("that.state.shippingorderId1111", that.state.fileName)
            var user_cookies = await getUserCookies();
            let userId = user_cookies.user.id
            let listUpdateShipping = []
            cylinders_list.map(v => {
                listUpdateShipping.push({
                    "serial": v,
                    "fileName": that.state.fileName,
                    "createdBy": userId,
                    "isTurnback": this.state.checkTurnback
                })
            })


            that.setState({
                listUpdateShipping: listUpdateShipping
            })
            console.log("this.state.listUpdateShipping", listUpdateShipping)
        };
        fileReader.readAsText(file);


    }
    render() {

        const { nameDriver, licensePlate, idDriver, listDriver, listShippingCustomer } = this.state;
        const { listShippingText, listShippingOrder } = this.props;

        console.log("listOrderrrr", this.props);
        const checked = this.state.checked ? true : false;
        const checkDisabled = this.state.disabled ? true : false;
        return (
            <div>
                <div className="modal fade" id="shipping-detail-modal" tabIndex="-1" style={{ overflowY: "auto" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xem thông tin vận chuyển</h5>
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-12 col-lg-12">
                                                    <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                                        <Form
                                                            ref={(c) => {
                                                                this.form = c;
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                {/* <label>Danh sách bình</label>

                                                                <Input
                                                                    className="form-control"
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
                                                                <input type="reset" value="Đặt lại"
                                                                    onClick={this.handleOnclickReset()}
                                                                    disabled={this.state.disabledCylinder} /> */}
                                                            </div>
                                                            <table
                                                                className="table text-center table-striped table-bordered seednet-table-keep-column-width mt-md-2"
                                                                cellSpacing="0"
                                                            >
                                                                <thead className="table__head">
                                                                    <tr>
                                                                        <th className="text-center w-70px align-middle">STT</th>
                                                                        <th className="w-150px" scope="col">Mã bình</th>
                                                                        <th scope="col">Tên file</th>
                                                                        <th scope="col">Bình hồi lưu</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.checkclick == false && this.state.checkdata !== true ?

                                                                        this.state.listShippingText.map((store, index) => {
                                                                            return store.map((v, i) => {
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
                                                                                this.state.listUpdateShipping.map((store, index) => {

                                                                                    return (<tr key={index}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{store.serial}</td>
                                                                                        <td>{store.fileName}</td>
                                                                                    </tr>);

                                                                                })
                                                                                :
                                                                                (
                                                                                    this.state.checkdata == true ?
                                                                                        this.state.listAllShipping.map((store, index) => {

                                                                                            return (<tr key={index}>
                                                                                                <td>{index + 1}</td>
                                                                                                <td>{store.serial}</td>
                                                                                                <td>{store.fileName}</td>
                                                                                            </tr>);

                                                                                        })
                                                                                        :
                                                                                        ""
                                                                                )
                                                                        )
                                                                    }


                                                                </tbody>
                                                            </table>
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                {/* <Checkbox
                                                                    className="text-align-left"
                                                                    
                                                                onChange={this.handleCheckbox}
                                                                >
                                                                    <label>Chọn bình hồi lưu</label>
                                                                </Checkbox> */}
                                                                {/* <button
                                                                    type="button"
                                                                    className="btn btn-danger pr-3 pl-3 mr-2"
                                                                    onClick={() => this.onClickDisabledCylinder()}
                                                                >
                                                                    Sửa
                                                            </button>
                                                                <button className="btn btn-info pr-3 pl-3"
                                                                    onClick={(event) => this.handleOnclick(event)}
                                                                    disabled={this.state.disabledCylinder}>
                                                                    Cập nhật</button> */}
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-lg-12">
                                                    <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                                        <Form
                                                            ref={(c) => {
                                                                this.form = c;
                                                            }}
                                                            onSubmit={(event) => this.submitDriver(event)}
                                                        >
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="form-group d-flex align-items-center justify-content-md-end">
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
                                                                <div className="col-md-6">
                                                                    <div className="form-group d-flex align-items-center justify-content-md-between">
                                                                        <label>Tài xế</label>
                                                                        <Input
                                                                            className="form-control"
                                                                            type="text"
                                                                            value={this.props.nameDriver}
                                                                            disabled
                                                                        />

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group d-flex align-items-center justify-content-md-between">
                                                                        <label>Biển số xe</label>
                                                                        <Input
                                                                            className="form-control"
                                                                            type="text"
                                                                            value={this.props.licensePlate}
                                                                            disabled
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="form-group d-flex align-items-center justify-content-end">
                                                                        {/* <button
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
                                                                    </button> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                            <Form
                                                ref={(c) => {
                                                    this.form = c;
                                                }}
                                                onSubmit={(event) => this.submitShippingCustomerDetail(event)}
                                            >
                                                <div className="row">
                                                    {/* {this.props.userType === Constant.GENERAL ? ("") : (
                                                        <div className="col-md-6">
                                                            <div className="form-group d-flex align-items-center justify-content-md-between">
                                                                <label>Chọn loại khách hàng</label>
                                                                <Select
                                                                    showSearch
                                                                    placeholder={this.props.t('CHOOSE')}
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
                                                                <div className="form-group d-flex align-items-center justify-content-md-between">
                                                                    <label>Chọn khách hàng</label>
                                                                    <select
                                                                        className="form-control"
                                                                        placeholder={this.props.t('CHOOSE')}
                                                                        disabled={this.state.disabledCustomer}
                                                                        onChange={e => this.handleChangeGeneral(e)}
                                                                        value={this.state.GeneralResults}
                                                                        style={{ width: '350px', borderRadius: "5px" }}
                                                                    >
                                                                        <option value="">{this.props.t('CHOOSE')}.</option>
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
                                                                <div className="form-group d-flex align-items-center justify-content-md-between">
                                                                    <label>Chọn khách hàng</label>
                                                                    <select
                                                                        className="form-control"
                                                                        placeholder={this.props.t('CHOOSE')}
                                                                        disabled={this.state.disabledCustomer}
                                                                        onChange={e => this.handleChangeGeneral(e)}
                                                                        value={this.state.GeneralResults}
                                                                        style={{ width: '350px', borderRadius: "5px" }}
                                                                    >
                                                                        <option value="">{this.props.t('CHOOSE')}.</option>
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
                                                    <div className="col-md-6">
                                                        <div className="form-group d-flex align-items-center justify-content-md-between">
                                                            <label>Nhập số lượng</label>
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
                                                        </div>
                                                    </div> */}
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <h5>Danh sách khách hàng</h5>
                                                            <table
                                                                className="table table-striped table-bordered seednet-table-keep-column-width text-center"
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

                                                                                </td>
                                                                            </tr>);
                                                                        });
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group d-flex align-items-center justify-content-end">
                                                            {/* <button type="button" className="btn btn-danger pr-3 pl-3 mr-2" onClick={this.onClickDisabledCustomer}>Sửa</button>
                                                            <button type="submit" className="btn btn-info pr-3 pl-3" disabled={this.state.disabledCustomer}>Cập nhật</button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group border p-3" style={{ borderRadius: "5px" }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h5>Danh sách đơn hàng</h5>
                                                <div className="d-flex justify-content-between" style={{ width: "350px" }}>
                                                    {/* <input
                                                        className="form-control mr-3"
                                                        type="text"
                                                        id="findIdOrder"
                                                        name="findIdOrder"
                                                        placeholder="Tìm mã đơn hàng..."
                                                        disabled={this.state.disabledOrder}
                                                        style={{ borderRadius: "5px" }}
                                                        onChange={this.onChangeTextValue}
                                                        value={this.state.findIdOrder}
                                                    /> */}

                                                    {/* <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                        disabled={this.state.disabledOrder}
                                                        onClick={(e) => this.onClickFindIdOrder(e)}
                                                    >
                                                        Chọn đơn hàng
                                                </button> */}
                                                </div>
                                            </div>
                                            <Form
                                                onSubmit={(event) => this.submitShippingOrderDetail(event)}
                                            >
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
                                                            <th scope="col">Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.listOrder.map((cus, index) => {
                                                            console.log("cuss", cus)
                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ fontSize: "0.9rem" }}>{cus.id}</td>
                                                                    <td style={{ fontSize: "0.9rem" }}>{cus.namekh}</td>
                                                                    <td style={{ fontSize: "0.9rem" }}>{cus.deliveryDate}</td>
                                                                    <td style={{ fontSize: "0.9rem" }}>{cus.numberCylinders}</td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-sm btn-success mt-1 w-100"
                                                                            data-toggle="modal"
                                                                            data-target="#shipping-map"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                this.handleonClickMap(cus.idshippingOrderDetail);
                                                                            }}

                                                                        >
                                                                            Xem bản đồ
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <div className="form-group d-flex align-items-center justify-content-end">
                                                    {/* <button
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
                                                    </button> */}
                                                </div>
                                            </Form>

                                        </div>
                                    </div>
                                    <div className="col-md-12">
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
                                            {/* <button
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
                                                        style={{ padding: "5px", borderRadius: "0px", width: "800px" }}
                                                    ></textarea>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-info"
                                                    >
                                                        Cập nhật ghi chú
                                                </button>
                                                </div>
                                            </Form> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                {/* <PopupEnterTurn
                    idCustomer={this.state.shippingorderId}
                /> */}
                <PopupShippingMap
                    nameDrivers={this.props.nameDriver}
                    latLocation={this.state.latLocation}
                    longLocation={this.state.longLocation}
                />
            </div>
        )
    }
}
export default (PopupShippingDetailBegin);