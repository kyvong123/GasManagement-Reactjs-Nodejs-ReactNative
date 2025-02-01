import React from 'react';
import { Form, Input, Icon, Button, Checkbox, Select, Card, Table, Tag } from "antd";
import moment from 'moment';
import showToast from "showToast";
import "./index.scss";
import getOrderTankByCustomerGasIdAPI from "./../../../../api/getOrderTankByCustomerGasIdAPI";
import getWareHouseByIdAPI from "./../../../../api/getWareHouseByIdAPI";
import GetStationByIdAPI from "./../../../../api/getStationByIdAPI";

class ViewCustomer extends React.Component {
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
                phone: '',
                email: '',
                taxcode: '',
                note: '',
                createdAt: '',
                updatedAt: '',
                branchname: '',
                contactname: '',
                LAT: '',
                LNG: ''
            },
            orderTank: [],
            wareHouse: {},
            isLoading: false
        };
    }

    async componentDidMount() {
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.customerById) {
            this.setState({
                object: {
                    id: nextProps.customerById.id ? nextProps.customerById.id : '',
                    name: nextProps.customerById.name ? nextProps.customerById.name : '',
                    contactname: nextProps.customerById.contactname ? nextProps.customerById.contactname : '',
                    email: nextProps.customerById.email ? nextProps.customerById.email : '',
                    code: nextProps.customerById.code ? nextProps.customerById.code : '',
                    address: nextProps.customerById.address ? nextProps.customerById.address : '',
                    userId: nextProps.customerById.userId ? nextProps.customerById.userId : '',
                    phone: nextProps.customerById.phone ? nextProps.customerById.phone : '',
                    taxcode: nextProps.customerById.taxcode ? nextProps.customerById.taxcode : '',
                    note: nextProps.customerById.note ? nextProps.customerById.note : '',
                    createdAt: nextProps.customerById.createdAt ? nextProps.customerById.createdAt : '',
                    updatedAt: nextProps.customerById.updatedAt ? nextProps.customerById.updatedAt : '',
                    branchname: nextProps.customerById.branchname ? nextProps.customerById.branchname : '',
                    LAT: nextProps.customerById.LAT ? nextProps.customerById.LAT : '',
                    LNG: nextProps.customerById.LNG ? nextProps.customerById.LNG : '',
                }
            })

            await this.getOrderTankByCustomerGasId(nextProps.customerById.id ? nextProps.customerById.id : '')
        }
    }

    async getOrderTankByCustomerGasId(customergasId) {
        let _temp = [];
        this.setState({ isLoading: true });
        const orderTank = await getOrderTankByCustomerGasIdAPI(customergasId);
        if (orderTank) {
            if (orderTank.data.status === true) {
                for (const element of orderTank.data.OrderTank[0]) {
                    let wareHouse = await this.getWareHouseById(element.warehouseId);
                    if (wareHouse) { element.warehouseName = wareHouse.name }
                    else { element.warehouseName = "" }
                    _temp.push(element);
                }
            } else {
                if (orderTank.data.message === "Lỗi...Không tìm thấy Order Tank.") { _temp = [] }
                else {
                    orderTank.data.message
                        ? orderTank.data.message
                        : orderTank.data.err_msg
                }
            }
            this.setState({
                orderTank: _temp,
            });
        } else {
            showToast("Xảy ra lỗi trong quá trình xóa dữ liệu!");
        }
        this.setState({ isLoading: false });
    }

    async getWareHouseById(warehouseId) {
        const wareHouse = await getWareHouseByIdAPI(warehouseId);
        if (wareHouse) {
            if (wareHouse.data.status === true) {
                return wareHouse.data.WareHouse
            } else {
                showToast(
                    wareHouse.data.message
                        ? wareHouse.data.message
                        : wareHouse.data.err_msg
                );
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình xóa dữ liệu!");
        }
    }

    // async getStationByIdAPI(id) {
    //     const stationInfo = await GetStationByIdAPI(id);
    //     if (stationInfo) {
    //       if (stationInfo.data.status === true) {
    //         return stationInfo.data.data.name;
    //       } else {
    //           if(stationInfo.data.message === "Lay thong tin user that bai"){

    //           }
    //           else{
    //             showToast(
    //                 stationInfo.data.message
    //                   ? stationInfo.data.message
    //                   : stationInfo.data.err_msg
    //               );
    //           }
    //       }
    //     } else {
    //       showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    //     }
    //     return null;
    //   }


    render() {
        let { id, name, code, address, userId, email, contactname, branchname, phone, taxcode, note, createdAt, updatedAt, LAT, LNG } = this.state.object;
        // console.log("selected customer", this.state.object)
        // console.log("orderTank", this.state.orderTank)
        const columns = [
            {
                title: 'STT',
                key: "index",
                align: 'center',
                width: 100,
                render: (text, record, index) => <div style={{ color: 'black' }}>{index + 1}</div>,
                fixed: 'left'
            },
            {
                title: 'Mã đơn',
                align: 'center',
                dataIndex: 'orderCode',
                width: 300,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Khối lượng (tấn)',
                align: 'center',
                dataIndex: 'quantity',
                width: 200,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Loại sản phẩm',
                align: 'center',
                dataIndex: 'typeproduct',
                width: 200,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Tên kho',
                align: 'center',
                dataIndex: 'warehouseName',
                width: 300,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Ngày giao',
                align: 'center',
                width: 400,
                render: (text, record) => <div style={{ color: 'black', fontSize: '14px' }}>{"Từ " + record.fromdeliveryDate + " đến " + record.todeliveryDate}</div>,
                // fixed: 'left'
            },
            {
                title: 'Ghi chú',
                align: 'center',
                dataIndex: 'note',
                width: 200,
                render: text => <div style={{ color: 'black', fontSize: '14px' }}>{text}</div>,
                // fixed: 'left'
            },
            {
                title: 'Trạng thái',
                align: 'center',
                dataIndex: 'status',
                width: 200,
                render: text => 
                    text === "INIT" ? <Tag color="blue">Khởi tạo</Tag>
                        : text === "DELIVERING" ? <Tag color="orange">Đang giao</Tag>
                            : text === "PROCESSING" ? <Tag color="gold">Đang xử lý</Tag>
                                : text === "DELIVERED" ? <Tag color="purple">Đã giao</Tag>
                                    : text === "CONFIRMED" ? <Tag color="green">Đã duyệt</Tag>
                                        : text === "CANCELLED" ? <Tag color="red">Đã hủy</Tag>
                                            : "",
                // fixed: 'left'
            }
        ];
        return (
            <div className="modal fade" id="view-customer" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon type="" className="icon_star" theme="filled" />Xem chi tiết khách hàng</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" id="form_body">
                            <div className="site-card-border-less-wrapper">
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <Card title="Thông tin khách hàng" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Mã khách hàng</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={code} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Tên khách hàng</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={name} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Địa chỉ</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={address} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Mã số thuế</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={taxcode} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Chi nhánh </label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={branchname} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row" style={{ display: "none" }}>
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label" >Ghi chú</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={note} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Ngày tạo</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={moment(createdAt).format('L LTS A')} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Ngày cập nhật</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={(updatedAt !== "") ? moment(updatedAt, "x").format("L LTS A") : ""} readOnly></Input>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="col-md-6 ">
                                        <Card title="Thông tin liên hệ" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Tên </label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={contactname} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Điện thoại </label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={phone} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Email </label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={email} readOnly></Input>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">Ghi chú</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={note} readOnly></Input>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">LAT </label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={LAT} readOnly></Input>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label htmlFor="input_value" className="col-sm-5 col-form-label">LNG</label>
                                                <div className="col-sm-7">
                                                    <Input type="text" className="form-control" style={{ color: "black", backgroundColor: "white" }} value={LNG} readOnly></Input>
                                                </div>
                                            </div>
                                            
                                        </Card>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 __header"><h5 style={{ fontWeight: "bold" }}>Lịch sử đơn hàng</h5></div>
                                    <div className="col-md-12">
                                        <Table
                                            rowKey={record => record.id}
                                            loading={this.state.isLoading}
                                            columns={columns}
                                            dataSource={this.state.orderTank ? this.state.orderTank : []}
                                            bordered
                                            pagination={{ defaultPageSize: 5, hideOnSinglePage: true }}
                                            scroll={{ x: 1600 }}
                                            className="view-customer-table"
                                        >
                                        </Table>
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
        )
    }
}

export default ViewCustomer;