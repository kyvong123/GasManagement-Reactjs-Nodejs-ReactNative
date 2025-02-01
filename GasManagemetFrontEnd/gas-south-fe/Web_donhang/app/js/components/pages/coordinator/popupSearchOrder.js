import React, { Component } from 'react';
import Constants from "Constants";
import { Link } from 'react-router';
import moment from 'moment';
import getUserCookies from 'getUserCookies';
import callApi from './../../../util/apiCaller';
import { GETORDER_OF_ORDERGASDETAIL } from '../../../config/config';
import { Radio, Input, Form, Select, Icon, DatePicker, Table, Button } from 'antd';
import vi from 'antd/es/date-picker/locale/vi_VN';
import 'moment/locale/vi';
import Highlighter from 'react-highlight-words';
import './coordinator.scss';

const { RangePicker } = DatePicker;
const Option = Select.Option;

class PopupSearchOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchedColumn: '',
            codeAndName: '',
            startDate: '',
            endDate: '',
            order: '',
            name: '',
            disabled: true,
            findOrder: 'name',
            display: 'none',
            findOrderByOrderCode: [],
            findOrderByName: [],
            selectedList: []
        }
    }
    async findOrderGasDetail(event) {
        event.preventDefault();
        const { codeAndName, startDate, endDate, findOrder } = this.state;
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;

        await callApi(
            "GET",
            GETORDER_OF_ORDERGASDETAIL + `?${findOrder}=${codeAndName}&dateStart=${startDate}&dateEnd=${endDate}`,
            token
        ).then(res => {
            if (res.data.success === true) {
                if (findOrder === "orderCode") {
                    let arr = [];
                    arr.push({
                        key: res.data.OrderGas.orderCode,
                        id: res.data.OrderGas.id,
                        orderCode: res.data.OrderGas.orderCode,
                        createdAt: moment(res.data.OrderGas.createdAt).format("DD/MM/YYYY HH:mm"),
                        customerId: res.data.OrderGas.customerId,
                        total: res.data.OrderGas.total
                    });
                    this.setState({
                        findOrderByOrderCode: arr,
                    });
                } else {
                    console.log("sssss", res)
                    this.setState({
                        findOrderByName: res.data.OrderGas
                    })
                }
            } else {
                this.setState({
                    errorFind: res.data.message,
                    display: "block"
                });
            }
            console.log("RESDATA", res.data);
        }
        );
        console.log("url", `?${findOrder}=${codeAndName}&dateStart=${startDate}&dateEnd=${endDate}`)
    }
    handleChangeValue = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value,
            errorFind: ""
        });
    }
    onChangeTime = (dates) => {
        this.setState({
            startDate: dates[0] ? moment(dates[0]).toISOString() : "",
            endDate: dates[0] ? moment(dates[1]).toISOString() : "",
            errorFind: ""
        });

    }
    onChangeRadio = (e) => {
        this.setState({
            findOrder: e.target.value,
            codeAndName: ""
        });
    }
    render() {
        const { findOrderByOrderCode, findOrderByName, disabled, selectedList } = this.state;
        console.log("findOrrderByCode", findOrderByOrderCode)
        console.log("findOrrderByName", findOrderByName)

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.props.handleRowSelectTion(selectedRows);
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selectedList: selectedRows,
                    disabled: selectedRows ? false : true,
                });
            }
        };
        const columns = [
            {
                title: 'Mã đơn hàng',
                dataIndex: 'orderCode',
                key: 'orderCode',
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
            },
            {
                title: 'Khách hàng',
                dataIndex: 'customerId.name',
                key: 'customerId.name',
            },
            {
                title: 'Tổng tiền',
                dataIndex: 'total',
                key: 'total',
            }
        ];
        const columns1 = [
            {
                title: 'Mã đơn hàng',
                dataIndex: 'orderCode',
                key: 'ordercode',
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (createdAt) => {
                    return moment(createdAt).format("DD/MM/YYYY HH:mm");
                }
            },
            {
                title: 'Khách hàng',
                dataIndex: 'customerId.name',
                key: 'customerId.name',
            },
            {
                title: 'Tổng tiền',
                dataIndex: 'total',
                key: 'total',
                render: (total) => {
                    return total + " đ";
                }
            }
        ];
        return (
            <div className="modal fade" id="search-order-modals" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header table__head rounded-0">
                            <h4 className="modal-title text-white">Tìm kiếm</h4>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="text-white">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <Form
                                            onSubmit={(event) => this.findOrderGasDetail(event)}
                                        >
                                            <h5>Tìm kiếm theo:</h5>
                                            <Radio.Group onChange={this.onChangeRadio} value={this.state.findOrder}>
                                                <Radio value="name">Tên khách hàng</Radio>
                                                <Radio value="orderCode">Mã đơn hàng</Radio>
                                            </Radio.Group>
                                            <div className="d-flex mt-3">
                                                {this.state.findOrder === "orderCode" ? (
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập mã đơn hàng"
                                                        className="form-control mr-1"
                                                        style={{ width: "250px" }}
                                                        onChange={(e) => this.handleChangeValue(e)}
                                                        name="codeAndName"
                                                        id="codeAndName"
                                                        value={this.state.codeAndName}
                                                    />
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập tên khách hàng"
                                                        className="form-control mr-1"
                                                        style={{ width: "250px" }}
                                                        onChange={(e) => this.handleChangeValue(e)}
                                                        name="codeAndName"
                                                        id="codeAndName"
                                                        value={this.state.codeAndName}
                                                    />
                                                )}

                                                <RangePicker
                                                    ranges={{
                                                        "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
                                                        "Tháng hiện tại": [
                                                            moment().startOf("month"),
                                                            moment().endOf("month"),
                                                        ],
                                                    }}
                                                    showTime={{
                                                        defaultValue: [moment('00:00', 'HH:mm'), moment('23:59:', 'HH:mm')],
                                                        format: "HH:mm"
                                                    }}
                                                    format="DD/MM/YYYY HH:mm"
                                                    locale={vi}
                                                    onChange={this.onChangeTime}
                                                />

                                            </div>
                                            {this.state.errorFind !== "" ? (
                                                <div
                                                    className="badge badge-danger mt-3"
                                                    style={{ display: this.state.display }}
                                                >
                                                    {this.state.errorFind}
                                                </div>
                                            ) : (
                                                ""
                                            )
                                            }
                                            <div className="d-flex mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-warning border-0 rounded mr-1"
                                                >
                                                    Tìm kiếm <i className="fa fa-search"></i>
                                                </button>
                                                <button
                                                    type="reset"
                                                    className="btn btn-light border-0 rounded"
                                                >
                                                    Nhập lại <Icon type="sync" className="fa" />
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                                <div className="col-md-12 mt-2">
                                    <div className="form-group mb-0">
                                        <button
                                            type="button"
                                            className="btn table__head"
                                            data-dismiss="modal"
                                            disabled={disabled}
                                        >
                                            <i className="fa fa-plus"></i> Chọn
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        {this.state.findOrder === "orderCode" ? (
                                            <Table
                                                columns={columns}
                                                dataSource={findOrderByOrderCode}
                                                rowSelection={rowSelection}
                                                bordered
                                            />
                                        ) : (
                                            <Table
                                                columns={columns1}
                                                dataSource={findOrderByName}
                                                rowSelection={rowSelection}
                                                rowKey="keyyyy"
                                                bordered
                                            />
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default PopupSearchOrder;