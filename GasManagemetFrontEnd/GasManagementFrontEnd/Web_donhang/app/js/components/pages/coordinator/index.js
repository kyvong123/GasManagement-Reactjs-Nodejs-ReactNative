import React, { Component } from "react";
import Constants from "Constants";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import {
  GETALLTRANSINVOICE,
  GETALLCARRIER,
  GETLISTSTATION,
  DELETE_TRANSINVOICE,
} from "../../../config/config";
import getTransInvoiceDetailAPI from "../../../../api/getTransInvoiceDetailAPI";
import getLocationTransInvoiceDetail from "../../../../api/getLocationTransInvoiceDetail";
import moment from "moment";
import { Link } from "react-router";
import {
  Checkbox,
  Input,
  Form,
  Select,
  Icon,
  Popconfirm,
  Table,
  Tag,
  message,
} from "antd";
import "./coordinator.scss";
import { array } from "prop-types";
import PopupCoodinatorMap from "./popupCoodinatorMap";
import openNotificationWithIcon from "../../../helpers/notification";

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

class Coordinator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCoordinator: [],
      listCoodinatorDetail: [],
      listDriver: [],
      listStation: [],
      checkAll: false,
      check: false,
      disabled: true,
      otherDisabled: "disabled",
      bordered: true,
      selectRow: [],
      note: "",
      idStore: "",
      nameStore: "",
      nameDriver: "",
      date: "",
      timeDeli: "",
      codee: "",
      locationDriver: {},
      lat: 0,
      long: 0,
      trangThai: "",
      maDieuPhoi: "",
      arrListCoorDinator: null,
    };
  }
  async onClickDeleteTransInvoice() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;

    let arr = [];
    this.state.selectRow.map((s) => {
      arr.push({
        transInvoiceId: s.id,
      });
      this.setState({
        listCoordinator: this.state.listCoordinator.filter(
          (e) => e.id !== s.id
        ),
      });
    });
    let params = {
      TransInvoice: arr,
      deletedBy: arr.length === 0 ? "" : id,
    };
    if (params.deletedBy === "") {
      message.error("Vui lòng chọn đơn điều phối để xóa!");
    } else {
      await callApi("POST", DELETE_TRANSINVOICE, params, token).then((res) => {
        console.log("RES", res);
        console.log("arr", params);
        if (res.data.success === true) {
          message.success(res.data.message);
          return true;
        } else {
          message.error("Vui lòng chọn đơn điều phối để xóa!");
          return false;
        }
      });
    }
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    await this.getAllTransInvoiceOfCarrier(id, token);
    await this.getAllDriver(id, token);
    await this.getListStation(id, token);
  }
  async getAllTransInvoiceOfCarrier(id, token) {
    await callApi("GET", GETALLTRANSINVOICE, id, token).then((res) => {
      if (res.data.success === true) {
        this.setState({
          listCoordinator: res.data.TransInvoices,
        });
      }
    });
  }
  async getAllDriver(id, token) {
    await callApi("GET", GETALLCARRIER, id, token).then((res) => {
      this.setState({
        listDriver: res.data.Carrier,
      });
    });
  }
  async getTransInvoiceDetail(id) {
    var res = await getTransInvoiceDetailAPI(id);
    const { listDriver, listStation, listCoordinator, idStore } = this.state;
    let arr = [];

    listCoordinator.map((l) => {
      listDriver.map((d) => {
        if (l.id === id) {
          this.setState({
            nameDriver: d.name,
            idStore: l.userId,
            codee: l.code,
            date: l.deliveryDate,
            timeDeli: l.deliveryHours,
            note: l.note,
          });
          return true;
        } else {
          return false;
        }
      });
      listStation.map((s) => {
        if (s.id === l.userId) {
          this.setState({
            nameStore: s.name,
          });
          return true;
        } else {
          return false;
        }
      });
    });

    res.data.TransInvoiceDetail.map((values) => {
      return values.map((v) => {
        arr.push(v);
        this.setState({
          listCoodinatorDetail: arr,
        });
      });
    });
  }
  async getListStation(id, token) {
    await callApi(
      "GET",
      GETLISTSTATION + `?id=${id}&userType=${"General"}`,
      token
    ).then((res) => {
      if (res.data.success === true) {
        this.setState({
          listStation: res.data.data,
        });
      }
    });
  }
  async getTransInvoiceDetailMap(id) {
    const res = await getLocationTransInvoiceDetail(id);
    if (res.data.success === true) {
      res.data.TransLocationInvoice.map((m) => {
        this.setState({
          lat: m.lat,
          long: m.long,
          locationDriver: { lat: parseFloat(m.lat), long: parseFloat(m.long) },
        });
      });
    }
  }
  onChangeInputHandle = (e) => {
    this.setState({
      trangThai: e,
    });
  };
  onChangeMaDieuPhoi = (e) => {
    this.setState({
      maDieuPhoi: e.target.value,
    });
  };
  searchTheoMaDieuPhoi = (arr) => {
    let searchMaDieuPhoiArr = [];
    for (let coordinator of arr) {
      let maDieuPhoi = String(coordinator.code).toLowerCase();
      let maDieuPhoiSearch = String(this.state.maDieuPhoi).toLowerCase();

      if (maDieuPhoi.indexOf(maDieuPhoiSearch) !== -1) {
        searchMaDieuPhoiArr.push(coordinator);
      }
    }
    return searchMaDieuPhoiArr;
  };
  searchTheoTrangThai = (arr) => {
    let trangThai = +this.state.trangThai;
    let arrCoordinatorSearch = arr.filter((coordinator) => {
      // console.log(coordinator.status);
      return coordinator.status === trangThai;
    });
    return arrCoordinatorSearch;
  };
  searchOrder = () => {
    let trangThai = +this.state.trangThai;
    if (trangThai === 0) {
      let arr = this.searchTheoMaDieuPhoi(this.state.listCoordinator);
      this.setState({
        arrListCoorDinator: arr,
      });
    } else {
      let arrTrangThai = this.searchTheoTrangThai(this.state.listCoordinator);
      let arr = this.searchTheoMaDieuPhoi(arrTrangThai);
      this.setState({
        arrListCoorDinator: arr,
      });
    }
  };
  resetHandle = () => {
    this.setState({
      trangThai: "",
      maDieuPhoi: "",
      arrListCoorDinator: null,
    });
  };
  render() {
    const {
      arrListCoorDinator,
      listCoordinator,
      bordered,
      disabled,
      selectRow,
      otherDisabled,
      listCoodinatorDetail,
    } = this.state;
    console.log("disabled", arrListCoorDinator);
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
        this.setState({
          disabled: selectedRowKeys ? false : true,
          selectRow: selectedRows,
        });
      },
    };
    const columns = [
      {
        title: "Ngày Tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (created) => {
          return moment(created).format("DD/MM/YYYY HH:mm");
        },
      },
      {
        title: "Mã Điều Phối",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Ngày Cập Nhật",
        dataIndex: "updateAt",
        key: "updateAt",
      },
      {
        title: "Trạng Thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          let color;

          const colorr =
            status == "2"
              ? (color = "volcano")
              : status == "1"
                ? (color = "geekblue")
                : (color = "green");
          status =
            status == "1"
              ? "Khởi Tạo"
              : status == "2"
                ? "Đang Giao"
                : "Hoàn Thành";
          return (
            <Tag color={colorr} key={status}>
              {status}
            </Tag>
          );
        },
      },
      {
        title: "Người Giao",
        dataIndex: "carrierId.name",
        key: "carrierId.name",
      },
      {
        title: "Ghi Chú",
        dataIndex: "note",
        key: "note",
      },
      {
        title: "Thao Tác",
        dataIndex: "id",
        key: "id",
        render: (record) => {
          return (
            <a
              data-toggle="modal"
              data-target="#detail-coodinator-modal"
              onClick={() => this.getTransInvoiceDetail(record)}
            >
              Xem chi tiết
            </a>
          );
        },
      },
    ];
    return (
      <div className="main-content" id="coordinator">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>
                <Icon type="sync" className="fa" /> Điều phối đơn hàng
              </h4>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <Form
                        ref={(c) => {
                          this.form = c;
                        }}
                      >
                        <div className="d-flex">
                          <Input
                            type="text"
                            placeholder="Mã Điều Phối"
                            className="form-control mr-1"
                            style={{ width: "150px" }}
                            onChange={this.onChangeMaDieuPhoi}
                          />

                          <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: "200px" }}
                            className="form-control mr-1"
                            placeholder="Trạng Thái"
                            onChange={this.onChangeInputHandle}
                          >
                            <Option value="0">--Chọn--</Option>
                            <Option value="1">Khởi Tạo</Option>
                            <Option value="2">Đang giao</Option>
                            <Option value="3">Hoàn Thành</Option>
                          </Select>
                          <button
                            type="button"
                            className="btn btn-warning border-0 rounded mr-1"
                            onClick={this.searchOrder}
                          >
                            Tìm kiếm <i className="fa fa-search"></i>
                          </button>
                          <button
                            type="reset"
                            className="btn btn-light border-0 rounded"
                            onClick={this.resetHandle}
                          >
                            Nhập lại <Icon type="sync" className="fa" />
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <Table
                      columns={columns}
                      dataSource={
                        arrListCoorDinator === null
                          ? listCoordinator
                          : arrListCoorDinator
                      }
                      rowSelection={rowSelection}
                      bordered={bordered}
                      rowKey="id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="col-md-6 coordinator__create">
              <div className="d-flex">
                <Link
                  className="btn btn-success rounded mr-1"
                  to="/coordinator-create"
                >
                  <i className="fa fa-plus"></i> Tạo mới
                </Link>
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  onConfirm={() => this.onClickDeleteTransInvoice()}
                  okText="Có"
                  cancelText="Không"
                  disabled={disabled}
                >
                  <a className="btn btn-danger rounded text-white">
                    <i className="fa fa-trash"></i> Xóa
                  </a>
                </Popconfirm>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="detail-coodinator-modal"
          tabindex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header table__head rounded-0">
                <h4 className="modal-title text-white">
                  Đơn điều phối chi tiết
                </h4>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true" className="text-white">
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group border rounded p-2">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width text-center"
                        cellSpacing="0"
                      >
                        <thead className="table__head">
                          <tr>
                            <th className="align-middle">STT</th>
                            <th className="align-middle">Mã đơn hàng</th>
                            <th className="align-middle">Khách hàng</th>
                            <th className="align-middle">Tổng tiền</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {listCoodinatorDetail.map((detail, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.orderCode}</td>
                                <td>{detail.customerId.name}</td>
                                <td>{detail.total} đ</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    data-toggle="modal"
                                    data-target="#coodinator-detail-map"
                                    data-dismiss="modal"
                                    onClick={() =>
                                      this.getTransInvoiceDetailMap(detail.id)
                                    }
                                  >
                                    Xem bản đồ
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-12 m-0">
                    <div className="form-group border rounded p-2 coordinate-create__info">
                      <h5>Thông tin</h5>
                      <div className="row">
                        <div className="col-md-6 d-flex mt-3 mb-4 align-items-center justify-content-around">
                          <label>Mã</label>
                          <Input
                            type="text"
                            disabled
                            value={this.state.codee}
                          />
                        </div>
                        <div className="col-md-6 d-flex mt-3 mb-4 align-items-center justify-content-around">
                          <label>Cửa hàng</label>
                          <Input
                            type="text"
                            disabled
                            value={this.state.nameStore}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 d-flex mb-4 align-items-center justify-content-around">
                          <label>Người giao</label>
                          <Input
                            type="text"
                            disabled
                            value={this.state.nameDriver}
                          />
                        </div>
                        <div className="col-md-6 d-flex mb-4 align-items-center justify-content-between"></div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 d-flex mb-4 align-items-center justify-content-around">
                          <label>Ngày giao</label>
                          <Input
                            type="text"
                            value={moment(this.state.date).format("DD/MM/YYYY")}
                            disabled
                          />
                        </div>
                        <div className="col-md-6 d-flex mb-4 align-items-center justify-content-around">
                          <label>Giờ giao</label>
                          <Input
                            type="text"
                            value={this.state.timeDeli}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-12 text-center">
                        <label>Ghi chú</label>
                        <br />
                        <Input
                          type="text"
                          value={this.state.note}
                          style={{ width: "400px", height: "80px" }}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PopupCoodinatorMap
          nameDriver={this.state.nameDriver}
          lat={this.state.lat}
          long={this.state.long}
          locationDriver={this.state.locationDriver}
        />
      </div>
    );
  }
}
export default Coordinator;
