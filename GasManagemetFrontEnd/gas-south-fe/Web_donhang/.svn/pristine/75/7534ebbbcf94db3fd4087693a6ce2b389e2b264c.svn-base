import React, { Component } from "react";
import "./priceSetting.scss";
import callApi from "./../../../util/apiCaller";
import { GETALLPROVINCE } from "./../../../config/config";
import getUserCookies from "getUserCookies";
import $ from "jquery";
import showToast from "showToast";
import moment from "moment";
import {
  InputNumber,
  Row,
  Col,
  Popconfirm,
  DatePicker,
  Table,
  Modal,
  Button,
  Input,
  Form,
} from "antd";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import axios from "axios";
import ModalUpdatePrice from "./updatePrice";

export default class PriceSetting extends Component {
  state = {
    listPrice: [],
    listRegion: [],
    region: "",
    regionId: "",
    applyDay: "",
    listTypeGas: [],
    cylinderCode: "",
    cylinderId: "",
    price: '',
    dateItem: "",
    visible: false,
    codeItem: "",
    priceItem: "",
    regionNameItem: "",
    updateItem: "",
  };

  // ----------------------Call API----------------------

  async getListRegion(id, token) {
    await callApi("GET", GETALLPROVINCE, id, token).then((res) => {
      this.setState({
        listRegion: res.data.region,
      });
    });
  }

  async getListPrice(id, token) {
    let GETLISTPRICE = "http://14.161.1.28:1338/price/getAllPrice";
    await callApi("GET", GETLISTPRICE, id, token).then((res) => {
      this.setState({
        listPrice: res.data.Price,
      });
    });
  }

  getListCylinder(id, token) {
    return axios({
      method: "GET",
      url: `http://14.161.1.28:1338/categoryCylinder/list?id=${id}`,
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        this.setState({
          listTypeGas: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async addCylinder(cylind) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let data = cylind;
    let ADDCYLINDER = "http://14.161.1.28:1338/price/create";
    return callApi("POST", ADDCYLINDER, data, token).then((res) => {
      if (res.data.success) {
        showToast("Thêm Thành Công");
        this.getListPrice();
      } else if (
        res.data.message === "dateApply is not defined. Please check out again."
      ) {
        showToast("Chọn Ngày Áp Dụng");
      } else if (
        res.data.message ===
        "dateApply smaller than day apply before that. Please check out again."
      ) {
        showToast("Nhập Ngày Áp Dụng Lớn Hơn");
      } else {
        showToast("Sản Phẩm Đã Tồn Tại");
      }
    });
  }

  async deletePrice(id) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = { priceID: id };
    let DELETEPRICE = "http://14.161.1.28:1338/price/cancelPrice";
    return callApi("POST", DELETEPRICE, params, token).then((res) => {
      showToast("Xóa Thành Công");
    });
  }

  async updatePriceAPI(data) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let UPDATEPRICE = "http://14.161.1.28:1338/price/updatePrice";
    return callApi("POST", UPDATEPRICE, data, token).then((res) => {
      showToast("Cập Nhật Thành Công");
      this.getListPrice();
    });
  }

  // async updatePrice()

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    let regionId = [];
    let cylinderId = [];
    $("#chooseRegion").change(function() {
      let idRegion = $(this)
        .find(":selected")
        .data("reg");
      regionId.unshift(idRegion);
      if (regionId.length === 2) {
        regionId.pop();
      }
    });
    this.setState({ regionId: regionId });
    $("#chooseTypeGas").change(function() {
      let idcylinder = $(this)
        .find(":selected")
        .data("cyl");
      cylinderId.unshift(idcylinder);
      if (cylinderId.length === 2) {
        cylinderId.pop();
      }
    });
    this.setState({ cylinderId: cylinderId });
    await this.getListRegion(id, token);
    await this.getListPrice(id, token);
    await this.getListCylinder(id, token);
  }

  // ----------------------End Call API----------------------

  // ----------------------Function Modal--------------------

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (updatePrice) => {
    updatePrice = { priceId: this.state.updateItem, price: this.state.price };
    console.log(updatePrice);
    console.log(typeof updatePrice.price);
    if (
      typeof updatePrice.price === "string" ||
      typeof updatePrice.price === "undefined"
    ) {
      showToast("Vui Lòng Nhập Giá Tiền");
    } else {
      this.updatePriceAPI(updatePrice);
      this.setState({
        visible: false,
        price:'',
      });
    }
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  // ----------------------End Function Modal--------------------
  // ---------------------Function--------------------------

  handleChange = (date, dateString) => {
    this.setState({ applyDay: date });
  };

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnClick = (e) => {
    e.preventDefault();
    if (
      typeof this.state.price === "object" ||
      typeof this.state.price === "undefined"
    ) {
      showToast("Hãy nhập giá tiền");
    } else if (this.state.region === "" || this.state.cylinderCode === "") {
      showToast("Hãy chọn Vùng Miền Và Loại Bình");
    } else {
      let arrDetail = [];
      arrDetail.push({
        regionId: this.state.regionId[0],
        categorycylinderId: this.state.cylinderId[0],
        price: this.state.price,
        dateApply: this.state.applyDay,
      });
      this.addCylinder(arrDetail[0]);
    }
  };

  handleDelete = (item) => {
    let deleteItem = item.id;
    this.deletePrice(deleteItem);
    this.setState((prevState) => ({
      listPrice: prevState.listPrice.filter((elm) => elm.id !== deleteItem),
    }));
  };

  handleUpdate = (item) => {
    let updateItem = item.id;
    let dateItem = item.dateApply;
    let codeItem = item.code;
    let priceItem = item.price;
    let regionNameItem = item.regionName;
    this.setState({
      visible: true,
      dateItem: dateItem,
      codeItem,
      priceItem,
      regionNameItem,
      updateItem,
    });
  };

  onChange = (value) => {
    console.log(typeof value);
    if (typeof value === "string") {
      this.setState({ price: "" });
    } else {
      this.setState({ price: value });
    }
  };

  disabledDate = (current) => {
    const weekStart = moment('2001',"YYYY").startOf('week');
    return !weekStart.isSameOrBefore(current)
  }

  // ---------------------End Function--------------------------

  render() {
    const columns = [
      {
        title: "Loại Bình",
        dataIndex: "code",
        key: "code",
        align: "center",
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        align: "center",
        render: (text) => <div>{Intl.NumberFormat().format(text)} VND</div>,
      },
      {
        title: "Ngày Áp Dụng",
        dataIndex: "dateApply",
        key: "dateApply",
        align: "center",
        render: (text) => <div>{moment(text).format("l")}</div>,
      },
      {
        title: "Vùng Miền",
        dataIndex: "regionName",
        key: "regionName",
        align: "center",
      },
      {
        title: "Thao Tác",
        key: "btn",
        align: "center",
        render: (item) => (
          <div>
            <Popconfirm
              title={"Xác nhận xóa giá bình ?"}
              onConfirm={() => this.handleDelete(item)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <a className="delete_link">
                <i className="fa fa-trash delete_icon"></i>
              </a>
            </Popconfirm>
            <a className="update_link" onClick={() => this.handleUpdate(item)}>
              <i className="ti-pencil"></i>
            </a>
          </div>
        ),
      },
    ];
    const dateFormat = "DD/MM/YYYY";
    let { listRegion, listTypeGas, listPrice } = this.state;
    console.log(this.state.price);
    console.log(this.state.regionId);
    return (
      <div className="main-content" id="tuan__CSS">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Thiết lập bảng giá</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group row region">
                <label className="col-form-label">Chọn Vùng:</label>
                <select
                  id="chooseRegion"
                  name="region"
                  onChange={this.handleOnChange}
                >
                  <option disabled selected>
                    --Chọn Vùng Miền--
                  </option>
                  {listRegion.map((item, index) => {
                    return (
                      <option key={index} value={item.name} data-reg={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group row region choose__detail-tank">
                <Col className="gutter-row" span={6}>
                  <label className="col-form-label">Chọn Loại:</label>
                  <select
                    id="chooseTypeGas"
                    name="cylinderCode"
                    onChange={this.handleOnChange}
                  >
                    <option disabled selected>
                      --Loại Bình--
                    </option>
                    {listTypeGas.map((item, index) => {
                      return (
                        <option
                          key={index}
                          value={item.code}
                          data-cyl={item.id}
                        >
                          {item.code}
                        </option>
                      );
                    })}
                  </select>
                </Col>

                <Col className="gutter-row" span={6}>
                  <div className="item__middle">
                    <label className="col-form-label">Giá:</label>
                    <InputNumber
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder="Hãy Nhập Giá"
                      onChange={this.onChange}
                    />
                  </div>
                </Col>

                <Col className="gutter-row" span={6}>
                  <div className="item__right">
                    <label className="col-form-label">Ngày áp dụng:</label>
                    <DatePicker
                      disabledDate={this.disabledDate}
                      placeholder="Chọn Ngày"
                      format={dateFormat}
                      onChange={this.handleChange}
                    />
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div className="detail__right">
                    <div className="form-group row">
                      <button
                        className="btn btn-success"
                        onClick={this.handleOnClick}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </div>
        <Table dataSource={listPrice} bordered columns={columns}></Table>

        <Modal
          title="Cập Nhật Giá"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Đóng
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Lưu
            </Button>,
          ]}
        >
          <Form className="card formUpdatePrice">
            <ModalUpdatePrice
              codeItem={this.state.codeItem}
              priceItem={this.state.priceItem}
              regionNameItem={this.state.regionNameItem}
              dateItem={this.state.dateItem}
              updateItem={this.state.updateItem}
              price={this.state.price}
              changeValue={this.onChange}
            />
          </Form>
        </Modal>
      </div>
    );
  }
}
