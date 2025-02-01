import React, { Component } from 'react';
import Constants from "Constants";
import { Link } from 'react-router';
import { 
    Switch, 
    Input, 
    Form, 
    Select, 
    Icon, 
    DatePicker, 
    TimePicker, 
    Button,
    message
} from 'antd';
import './coordinator.scss';
import PopupSearchOrder from './popupSearchOrder';
import vi from 'antd/es/date-picker/locale/vi_VN';
import moment from "moment";
import 'moment/locale/vi';
import getUserCookies from 'getUserCookies';
import openNotificationWithIcon from "./../../../helpers/notification";
import { GETALLCARRIER,  GETLISTSTATION, CREATETRANSINVOICE, SENDNOTIFICATION } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getOrderGasByCode from '../../../../api/getOrderGasByCode';

const Option = Select.Option;

class CoordinatorCreate extends Component {
    constructor(props){
        super(props);
        this.state = {
            listDriver: [],
            listStation: [],
            listOrderGas: [],
            listCoordinator: [],
            findId: "",
            errorListOrderGas: "",
            errorCode: "",
            errorStore: "",
            errorDriver: "",
            errorDate: "",
            errorTime: "",
            note: "",
            idStore: "",
            idDriver: "",
            date: "",
            codee: "",
            startHour: new Date(),
            open: false,
            disabled: true,
            checkDeliveryTime: true,
        }
    }
    handleChangeDate = (date) => {
        if(date !== "") {
            this.setState({
                date: date,
                errorDate: ""
            });            
        }

    }
    handleOpenChange = (open) => {
        this.setState({ open });
    }

    handleClose = () => this.setState({ open: false });

    handleDataChange = () => {
        this.setState({
            checkDeliveryTime: !this.state.checkDeliveryTime
        })
    }

    handleChangeHour = (time) => {
        console.log("gio", time);
        const _time = new Date(time.toISOString());
        const hour = _time.getHours();
        const minute = _time.getMinutes();
        if(time !== ""){
            this.setState({
                startHour: hour + ":" + minute,
                errorTime: ""
            });            
        }

    };
    
    async componentDidMount() {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        await this.getAllDriver(id, token);
        await this.getListStation(id, token);
        await this.onChangeCodeValue();
        await this.getAllTransInvoiceOfCarrier(id, token);
    }
    async getAllTransInvoiceOfCarrier(id, token) {
        await callApi("GET", GETALLTRANSINVOICE, id, token).then(res => {
            if(res.data.success === true){
                this.setState({
                    listCoordinator: res.data.TransInvoices
                });
            }
        });
    }
    async onCreateTransInvoice(event) {
        event.preventDefault();
        const { note, idStore, idDriver, listOrderGas, codee, date, driverPlayerID, listDriver, startHour, listCoordinator } = this.state;

        let index = listCoordinator.findIndex(e => e.code === codee);
        let transInvoiceDetails = [];
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        let playerID = "";
        listDriver.map(v => {
            if(v.id === idDriver){
                playerID = v.playerID
            }
        })
        console.log("dreverID", driverPlayerID);
        listOrderGas.map((store, index) => {
            transInvoiceDetails.push({
                orderGasId: store.id,
                lat: store.customerId.lat,
                long: store.customerId.long,
                note: note,
                createdBy: id
            })
        })
        let params = {
            TransInvoice: {
                code: index === -1 ? codee : "",
                deliveryDate: date,
                deliveryHours: startHour,
                carrierId: idDriver,
                userId: idStore,
                createdBy: id,
                note: note,
            },
            TransInvoiceDetail: transInvoiceDetails
        };
        let parms = {
            title: "Bạn có đơn hàng cần giao",
            data: note,
            appname: "Driver",
            device: playerID
        };
        await callApi("POST", CREATETRANSINVOICE, params, token).then(res => {
            console.log("CREATE", res);
            if(res.data.success === true){
                message.success('Tạo đơn điều phối thành công');
                location.replace("#/coordinator");

            } else{
                if(res.data.message === "code is not defined. Please check out again."){
                    this.setState({
                        errorCode: "Vui lòng tạo mã điều phối",
                    });
                }
                else if(res.data.message === "deliveryDate is not defined. Please check out again."){
                    this.setState({
                        errorDate: "Vui lòng chọn ngày giao",
                    });
                } else if(res.data.message === "carrierId is not defined. Please check out again."){
                    this.setState({
                        errorDriver: "Vui lòng chọn tài xế",
                    })
                } else {
                    this.setState({
                        errorStore: "Vui lòng chọn cửa hàng"
                    })
                }
                return false;
            }
        });
        if(codee !== "" && date !== "" && idStore !== "" && transInvoiceDetails){
            await callApi("POST", SENDNOTIFICATION, parms, token).then(ress => {
                if(ress){
                    console.log("ress", ress);
                }
            });
            return true;       
        } else{
            return false;
        }
       
    }
    async getOrderGasByCode(event) {
        event.preventDefault();
        const { findId } = this.state;
        let res = await getOrderGasByCode(findId);
        console.log("GETTRANSINVOICEBYID", res.data.OrderGas);
        if(res.data.success === true){
            res.data.OrderGas.map(v =>{
                this.setState({
                    findId: "",
                    listOrderGas: [...this.state.listOrderGas, v]           
                })
            })
        } else {
            this.setState({
                findId: "",
                errorListOrderGas: "Không đúng mã đơn hàng, vui lòng nhập lại"
            })
        }

    }
    async getAllDriver(id, token) {
        await callApi("GET", GETALLCARRIER, id, token).then(res => {
            this.setState({
                listDriver: res.data.Carrier,
            });
            console.log("listDriver", this.state.listDriver)
        });
    }
    async getListStation(id, token) {
        await callApi("GET", GETLISTSTATION + `?id=${id}&userType=${"General"}`, token).then(res => {
            if(res.data.success === true){
                this.setState({
                    listStation: res.data.data
                });
                  
            }
            console.log("ListStation", this.state.listStation)
        });
    }
    onFindId = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }
    handleRowSelectTion = (value) => {
        this.setState({
            listOrderGas: value
        });
    }
    onChangeCodeValue = (e) => {
        let numFirst = Math.floor((Math.random() * 99999) + 1);
        let numAfter = Math.floor((Math.random() * 99999) + 1);
        let madieuphoi = ("DP" + numFirst + "-" + numAfter).toString();
        this.setState({
          codee: madieuphoi,
        });
        if(this.state.codee !== ""){
            this.setState({
                disabled: false,
                errorCode: ""
            });
        }        
    }
    onChangeNameValue = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }
    onChangDriverValue = (value) => {
        this.setState({
            idDriver: value
        });
        if(value !== ""){
            this.setState({
                disabled: false,
                errorDriver: ""
            });
        }    
    }
    onChangStoreValue = (value) => {
        this.setState({
            idStore: value
        });    
        if(value !== ""){
            this.setState({
                disabled: false,
                errorStore: ""
            });
        }   
    }
    render() {
        const { listDriver, listStation, listOrderGas, note, date, errorListOrderGas } = this.state;
        console.log("listDriver", listDriver);
        console.log("listOrrderGas", listOrderGas);
        return (
            <div className="main-content" id="coordinator-create">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>
                                <Link to="/coordinator" className="p-1 bg-white"><Icon type="arrow-left" className="fa" /></Link> 
                                Tạo điều phối đơn hàng
                            </h4>
                        </div>
                    </div>
                    <Form
                        onSubmit={(event) => this.onCreateTransInvoice(event)}
                    >
                        <div className="card-body">
                            <div className="table-responsive-xl">
                                <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                    <div className="row">
                                        <div className="col-md-7 m-0">
                                            <div className="form-group border rounded p-2">
                                                <div className="d-flex justify-content-between">
                                                    <Input 
                                                        type="text" 
                                                        placeholder="Nhập mã đơn hàng" 
                                                        className="form-control mr-1" 
                                                        style={{ width: "150px"}}
                                                        name="findId"
                                                        id="findId"
                                                        onChange={this.onFindId}
                                                        value={this.state.findId.trim()}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="d-none"
                                                        onClick={(event) => this.getOrderGasByCode(event)}
                                                    >
                                                        Tìm mã đơn hàng
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className="btn btn-success border-0 rounded mr-1"
                                                        data-toggle="modal"
                                                        data-target="#search-order-modals"
                                                    >
                                                        <i className="fa fa-search"></i> Chọn đơn hàng
                                                    </button>                                           
                                                </div>
                                                {errorListOrderGas !== "" ? (
                                                <div 
                                                    className="alert alert-danger"
                                                    style={{
                                                        fontSize: "0.9rem",
                                                        padding: "5px 10px",
                                                        margin: "10px 0px 0px",
                                                        width: "300px"
                                                    }}
                                                >
                                                    {errorListOrderGas}
                                                </div>
                                                ) : ("")}
                                                <table
                                                    className="table table-sm table-striped table-bordered seednet-table-keep-column-width text-center mt-2"
                                                    cellSpacing="0"
                                                >
                                                    <thead className="table__head">
                                                        <tr>
                                                            <th scope="col" className="w-60px align-middle">STT</th>
                                                            <th scope="col" className="align-middle">Mã đơn hàng</th>
                                                            <th scope="col" className="align-middle">Khách hàng</th>
                                                            <th scope="col" className="align-middle">Tổng tiền</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listOrderGas.map((store, index) => {
                                                            return(
                                                                <tr key={index}>
                                                                    <td>{index+1}</td>
                                                                    <td>{store.orderCode}</td>
                                                                    <td>{store.customerId.name}</td>
                                                                    <td>{store.total} đ</td>
                                                                </tr>
                                                            );
                                                        })}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-5 m-0">
                                            <div className="form-group border rounded p-2 coordinate-create__info">
                                                <h5>Thông tin</h5>
                                                <div className="col-md-12 d-flex mt-3 mb-4 align-items-center justify-content-center">
                                                    <label>Mã</label>
                                                    <Input 
                                                        type="text"
                                                        name="codee"
                                                        id="codee"
                                                        onChange={this.onChangeCodeValue}
                                                        style={{width: "281px"}}
                                                        placeholder="Mã điều phối"
                                                        value={this.state.codee}
                                                    />
                                                </div>
                                                
                                                {this.state.errorCode !== "" ? (
                                                    <div className="col-md-12 text-right" style={{padding: "0px 64px"}}>
                                                        <p 
                                                            className="badge badge-danger"
                                                            style={{width: "281px"}}    
                                                        >
                                                            {this.state.errorCode}
                                                        </p>
                                                    </div> 
                                                ) : ("")}
                                                
                                                <div className="col-md-12 d-flex mt-3 mb-4 align-items-center justify-content-center">
                                                    <label>Cửa hàng</label>
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            option.props.children
                                                                .toLowerCase()
                                                                .indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        placeholder="Chọn cửa hàng"
                                                        style={{width: "281px"}}
                                                        onChange={this.onChangStoreValue}
                                                    >
                                                        <Option value="">--Chọn--</Option>
                                                        {listStation.map((store, index) => {
                                                            return (
                                                                <Option key={index} value={store.id}>{store.name}</Option>
                                                            );
                                                        })}
                                                    </Select>
                                                </div>
                                                {this.state.errorStore !== "" ? (
                                                    <div className="col-md-12 text-right" style={{padding: "0px 64px"}}>
                                                        <p 
                                                            className="badge badge-danger"
                                                            style={{width: "281px"}}    
                                                        >
                                                            {this.state.errorStore}
                                                        </p>
                                                    </div> 
                                                ) : ("")}
                                                <div className="col-md-12 d-flex mb-4 align-items-center justify-content-center">
                                                    <label>Người giao</label>
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            option.props.children
                                                                .toLowerCase()
                                                                .indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        placeholder="Chọn người giao"
                                                        style={{width: "281px"}}
                                                        onChange={this.onChangDriverValue}
                                                    >
                                                        <Option value="">--Chọn--</Option>
                                                        {listDriver.map((store, index) => {
                                                            return(
                                                                <Option key={index} value={store.id}>{store.name}</Option>
                                                            );
                                                        })}
                                                    </Select>
                                                </div>
                                                {this.state.errorDriver !== "" ? (
                                                    <div className="col-md-12 text-right" style={{padding: "0px 64px"}}>
                                                        <p 
                                                            className="badge badge-danger"
                                                            style={{width: "281px"}}    
                                                        >
                                                            {this.state.errorDriver}
                                                        </p>
                                                    </div> 
                                                ) : ("")}
                                                <div className="col-md-12 d-flex mb-4 align-items-center justify-content-center">
                                                    <label>Ngày giao</label>
                                                    <DatePicker 
                                                        onChange={this.handleChangeDate}
                                                        format="DD/MM/YYYY"
                                                        style={{width: "281px"}}
                                                        locale={vi}
                                                    />
                                                </div>
                                                {this.state.errorDate !== "" ? (
                                                    <div className="col-md-12 text-right" style={{padding: "0px 64px"}}>
                                                        <p 
                                                            className="badge badge-danger"
                                                            style={{width: "281px"}}    
                                                        >
                                                            {this.state.errorDate}
                                                        </p>
                                                    </div> 
                                                ) : ("")}
                                                <div className="col-md-12 d-flex mb-4 align-items-center justify-content-center">
                                                    <label>Giờ giao</label>
                                                    <div 
                                                        className="d-flex align-items-center justify-content-between"
                                                        style={{width: "281px"}}
                                                    >
                                                        <Switch onChange={this.handleDataChange} />
                                                        <TimePicker
                                                            clearText
                                                            open={this.state.open}
                                                            onOpenChange={this.handleOpenChange}
                                                            onChange={this.handleChangeHour}
                                                            placeholder="Chọn giờ giao"
                                                            format="HH:mm"
                                                            minuteStep={1}
                                                            disabled={this.state.checkDeliveryTime}
                                                            style={{ width: "80%", fontWeight: "bold" }}
                                                            renderExtraFooter={() => (
                                                                <Button size="small" type="primary" onClick={this.handleClose}>
                                                                  Ok
                                                                </Button>
                                                              )}
                                                        />                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-12 d-flex mb-4 align-items-center justify-content-center">
                                                    <label>Ghi chú</label>
                                                    <textarea
                                                        rows="2"
                                                        id="note"
                                                        name="note"
                                                        onChange={this.onChangeNameValue}
                                                        style={{ padding: "5px", borderRadius: "5px", width: "281px" }}
                                                        value={note}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="col-md-6 coordinator__create">
                                <div className="d-flex">
                                    <button
                                        className="btn btn-success rounded"
                                        disabled={this.state.disabled}
                                    >
                                        <i className="fa fa-save"></i> Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
                <PopupSearchOrder 
                    handleRowSelectTion={this.handleRowSelectTion}
                />
            </div>
        )
    }
}

export default CoordinatorCreate;