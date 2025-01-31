import React, { Component } from "react";
import Constants from "Constants";
import moment from "moment";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import { FINDORDERTANK, FINDORDERTANKBYNAME } from "../../../config/config";
import openNotificationWithIcon from "./../../../helpers/notification";
import {
  Radio,
  Input,
  Form,
  Select,
  Icon,
  DatePicker,
  Table,
  Button,
  Tag
} from "antd";
import vi from "antd/es/date-picker/locale/vi_VN";
import "moment/locale/vi";
import "./import-order-manage.scss";
import showToast from "showToast";
import Highlighter from "react-highlight-words";
import { push } from "react-router-redux";
import getAllOrderTankAPI from "./../../../../api/getAllOrderTankAPI";

export default class PopupSearchImportOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      orderCode: "",
      findOrder: "name",
      codeAndName: "",
      selectedRow: "",
      selectedList: [],
      listOrderTank: [],
      isLoading: false
    };
  }
  async componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({ listOrderTank: nextProps.orderTank });
    }
    await this.getListOrderTank()
  }
  // async componentDidMount(){
  //     let user_cookies = await this.getUserCookies();
  //     let token = "Bearer " + user_cookies.token;
  // }

  async getListOrderTank() {
    let temp = []
    this.setState({ isLoading: true })
    let listOrderTank = await getAllOrderTankAPI();
    let user_cookies = await getUserCookies();
    if (listOrderTank) {
      this.setState({ isLoading: false })
      if (listOrderTank.data.status === true) {
        for (const item of listOrderTank.data.OrderTank) {
          if ((item.status === "CONFIRMED" || item.status === "PROCESSING") && item.warehouseId.code === user_cookies.user.warehouseCode && item.warehouseId.userId === user_cookies.user.isChildOf) {
            temp.push({
              ...item,
              key: item.id,
              name: item.customergasId.name,
            });
          }
        }
        this.setState({ listOrderTank: temp })
      } else {
        showToast("Không tìm danh sách đơn hàng!");
      }
    }
  }

  async findOrderTank(e) {
    e.preventDefault();
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    const { orderCode, codeAndName } = this.state;
    let params = {
      orderCode: codeAndName,
    };
    let params1 = {
      name: orderCode,
    };
    if (codeAndName !== "") {
      this.setState({ isLoading: true })
      await callApi("POST", FINDORDERTANK, params, token).then((res) => {
        let data = [];
        this.setState({ isLoading: false })
        if (res.data.status === true) {
          res.data.OrderTank.map(item => {
            if ((item.status === "CONFIRMED" || item.status === "PROCESSING") && item.warehouseId.code === user_cookies.user.warehouseCode && item.warehouseId.userId === user_cookies.user.isChildOf) {
              data.push({
                ...item,
                key: item.id,
                name: item.customergasId.name,
              });
            }
          });
          if (data.length === 0) {
            showToast("Không có đơn hàng trùng khớp hoặc tất cả các đơn hàng đã được tạo!")
          }
          this.setState({
            listOrderTank: data,
            orderCode: ""
          });
        } else {
          showToast("Không tìm thấy mã đơn hàng");
          this.setState({ listOrderTank: [] });
          return false;
        }
      });
    } else if (orderCode !== "") {
      this.setState({ isLoading: true })
      await callApi("POST", FINDORDERTANKBYNAME, params1, token).then((res) => {
        let data = [];
        this.setState({ isLoading: false })
        if (res.data.status === true) {
          console.log(res)
          res.data.OrderTank.map((item) => {
            return item.map((v) => {
              if ((v.status === "CONFIRMED" || v.status === "PROCESSING") && v.warehouseId.code === user_cookies.user.warehouseCode && v.warehouseId.userId === user_cookies.user.isChildOf) {
                data.push({
                  ...v,
                  key: v.id,
                  name: v.customergasId.name,
                });
              }
            });
          });
          if (data.length === 0) {
            showToast("Không có đơn hàng trùng khớp hoặc tất cả các đơn hàng đã được tạo!")
          }
          this.setState({
            listOrderTank: data,
            orderCode: ""
          });
        } else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg
          );
          return false;
        }
      });
    } else {
      showToast("Vui lòng nhập từ khóa!");
    }
  }
  handleChangeValue = (e) => {
    const { findOrder } = this.state;
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
    if (findOrder === "orderCode") {
      this.setState({
        orderCode: "",
      });
    } else {
      this.setState({
        codeAndName: "",
      });
    }
  };
  onChangeRadio = (e) => {
    const { findOrder } = this.state;
    this.setState({
      findOrder: e.target.value,
    });
    if (findOrder === "orderCode") {
      this.setState({
        orderCode: "",
      });
    } else {
      this.setState({
        codeAndName: "",
      });
    }
  };
  exportTable = () => {
    this.props.handleKeySelectTion(this.state.selectedRow);
    this.props.handleRowSelectTion(this.state.selectedList);
  };

  onReset = async () => {
    if (this.state.findOrder === "orderCode") {
      this.setState({ codeAndName: "", listOrderTank: [] });
    } else {
      this.setState({ orderCode: "", listOrderTank: [] });
    }
    await this.getListOrderTank()
  };

  render() {
    const { disabled, listOrderTank } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedList: selectedRows,
          selectedRow: selectedRowKeys,
          disabled: selectedRows ? false : true,
        });
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      }),
    };
    const columns = [
      {
        title: "Mã đơn hàng",
        dataIndex: "orderCode",
        key: "orderCode",
        render: (text) => <span> {text}</span>
      },
      {
        title: "Tên khách hàng",
        dataIndex: "name",
        key: "name",
        render: (text) => <span> {text}</span>
      },
      {
        title: "Kho xuất",
        dataIndex: "warehouseId",
        key: "warehouseId",
        render: (text, record) => <span> {record.warehouseId.name}</span>
      },
      {
        title: "Nơi nhận",
        dataIndex: "branchname",
        key: "branchname",
        render: (text, record) => <span> {record.customergasId.branchname}</span>
      },
      {
        title: "Ngày giao",
        dataIndex: "fromdeliveryDate",
        key: "fromdeliveryDate",
        render: (text, record) => <span> {record.fromdeliveryDate + " - " + record.todeliveryDate}</span>
      },
      {
        title: "Giờ giao",
        dataIndex: "deliveryHours",
        key: "deliveryHours",
        render: (text) => <span> {text}</span>
      },
      {
        title: "Khối lượng",
        dataIndex: "quantity",
        key: "quantity",
        render: (text) => <span> {text + " tấn"}</span>
      },
      {
        title: "Loại hàng",
        dataIndex: "typeproduct",
        key: "typeproduct",
        width: 150,
        render: (text) => {
          return text === "HV" ? <span>Vay</span>
            : text === "HB" ? <span>Bán</span>
              : text === "HT" ? <span>Trả</span>
                : <span>Thuê</span>
        }
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
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
    ];

    return (
      <div
        className="modal fade"
        id="search-import-order"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header table__head rounded-0">
              <h4 className="modal-title text-white">Tìm kiếm</h4>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true" className="text-white">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <Form onSubmit={(event) => this.findOrderTank(event)}>
                      <h5>Tìm kiếm theo:</h5>
                      <Radio.Group
                        onChange={this.onChangeRadio}
                        value={this.state.findOrder}
                      >
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
                            name="orderCode"
                            id="orderCode"
                            value={this.state.orderCode}
                          />
                        )}

                        <button
                          type="submit"
                          className="btn btn-warning border-0 rounded mr-1"
                        >
                          Tìm kiếm <i className="fa fa-search"></i>
                        </button>
                        <button
                          type="reset"
                          className="btn btn-secondary border-0 rounded"
                          onClick={this.onReset}
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
                      onClick={() => this.exportTable()}
                      disabled={disabled}
                    >
                      <i className="fa fa-plus"></i> Chọn
                    </button>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <Table
                      columns={columns}
                      dataSource={listOrderTank}
                      rowSelection={{ type: "radio", ...rowSelection }}
                      scroll={{ x: 1400 }}
                      bordered
                      loading={this.state.isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
