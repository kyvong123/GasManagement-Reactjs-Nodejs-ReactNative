import React from 'react';
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Checkbox, Select, Card } from "antd";
import "./index.scss";
import moment from "moment";

class ViewInventory extends React.Component {

    constructor(props) {
        super(props);
        this.options = [];
        this.state = {
            object: {
                id: '',
                name: '',
                code: '',
                address: '',
                userId: '',
                mininventory: '',
                namecontact: '',
                mobilecontact: '',
                emailcontact: '',
                note: '',
                isSupplier: false,
                createdAt: '',
                updatedAt: '',
                stationName: '',
            }
        };
    }

    async componentDidMount() { }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.dataFromParent) {
            this.setState({
                object: {
                    id: nextProps.dataFromParent.id ? nextProps.dataFromParent.id : '',
                    name: nextProps.dataFromParent.name ? nextProps.dataFromParent.name : '',
                    code: nextProps.dataFromParent.code ? nextProps.dataFromParent.code : '',
                    address: nextProps.dataFromParent.address ? nextProps.dataFromParent.address : '',
                    userId: nextProps.dataFromParent.userId ? nextProps.dataFromParent.userId : '',
                    mininventory: nextProps.dataFromParent.mininventory ? nextProps.dataFromParent.mininventory : '',
                    namecontact: nextProps.dataFromParent.namecontact ? nextProps.dataFromParent.namecontact : '',
                    mobilecontact: nextProps.dataFromParent.mobilecontact ? nextProps.dataFromParent.mobilecontact : '',
                    emailcontact: nextProps.dataFromParent.emailcontact ? nextProps.dataFromParent.emailcontact : '',
                    note: nextProps.dataFromParent.note ? nextProps.dataFromParent.note : '',
                    isSupplier: nextProps.dataFromParent.isSupplier ? nextProps.dataFromParent.isSupplier : '',
                    createdAt: nextProps.dataFromParent.createdAt ? nextProps.dataFromParent.createdAt : '',
                    updatedAt: nextProps.dataFromParent.updatedAt ? nextProps.dataFromParent.updatedAt : '',
                    stationName: nextProps.dataFromParent.stationName ? nextProps.dataFromParent.stationName : '',
                }
            })
        }
    }

    /* ==================================================== API =============================================*/

    /* ==================================================== /API =============================================*/


    /* ==================================================== /Another Function =============================================*/


    /* ==================================================== /Another Function =============================================*/


    render() {
        let {
            id,
            name,
            code,
            address,
            userId,
            mininventory,
            namecontact,
            mobilecontact,
            emailcontact,
            note,
            isSupplier,
            createdAt,
            updatedAt,
            stationName
        } = this.state.object;
        return (
            <div className="modal fade" id="view-inventory" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon type="" className="icon_star" theme="filled" />Xem chi tiết kho</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" id="form_body">
                            {/* <div className="container"> */}
                                {/* <form> */}
                                <div className="site-card-border-less-wrapper">
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <Card title="Thông tin kho" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                                <div className="form-group row">
                                                    <label htmlFor="input_name" className="col-sm-4 col-form-label">Tên kho</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_name" value={name} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_code" className="col-sm-4 col-form-label">Mã kho</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_code" value={code} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_stationId" className="col-sm-4 col-form-label">Chi nhánh</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_stationId" value={stationName} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_mininventory" className="col-sm-4 col-form-label">Khối lượng chứa của kho (tấn)</label>
                                                    <div className="col-sm-8">
                                                        <Input type="number" className="form-control" id="input_mininventory" value={Number(mininventory)} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_address" className="col-sm-4 col-form-label">Địa chỉ</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_address" value={address} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="check_isSupplier" className="col-sm-4 col-form-label" style={{ paddingRight: '0px' }}>Kho nhà cung cấp</label>
                                                    <div className="col-sm-8" style={{ paddingLeft: '36px', paddingTop: '6px' }}>
                                                        <input type="checkbox" name="isSupplier" className="form-check-input" id="check_isSupplier" checked={isSupplier} readOnly></input>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                        <div className="col-md-6 ">
                                            <Card title="Thông tin liên hệ" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                                <div className="form-group row">
                                                    <label htmlFor="input_namecontact" className="col-sm-4 col-form-label">Tên </label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_namecontact" value={namecontact} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_mobilecontact" className="col-sm-4 col-form-label">Điện thoại</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_mobilecontact" value={mobilecontact} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_emailcontact" className="col-sm-4 col-form-label">Email</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_emailcontact" value={emailcontact} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_ghichu" className="col-sm-4 col-form-label">Ghi chú</label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_note" value={note} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_createdAt" className="col-sm-4 col-form-label">Ngày tạo </label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_createdAt" value={moment(createdAt).format('L LTS A')} readOnly></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_updatedAt" className="col-sm-4 col-form-label">Ngày cập nhật </label>
                                                    <div className="col-sm-8">
                                                        <Input type="text" className="form-control" id="input_updatedAt" value={(updatedAt !== "") ? moment(updatedAt, "x").format("L LTS A") : ""} readOnly></Input>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="modal-footer">
                            <div className="form-group row " id="form_footer">
                                <footer className="card-footer text-center footer_form">
                                    <Button
                                        type="danger"
                                        data-dismiss="modal"
                                        style={{ marginLeft: "10px" }}>Đóng</Button>
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ViewInventory;
