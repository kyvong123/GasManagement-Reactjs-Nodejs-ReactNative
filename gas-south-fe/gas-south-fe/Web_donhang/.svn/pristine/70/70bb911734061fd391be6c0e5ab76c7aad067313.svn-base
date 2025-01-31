import React, { Component } from "react";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import moment from "moment";
import showToast from "showToast";
import {
  Select,
  Form,
  Input,
  Popconfirm,
  DatePicker,
  Icon,
  TimePicker,
  message,
  Checkbox,
  Tag,
} from "antd";
import {
  GETDRIVE,
  GETALL_WAREHOUSE,
  GETALLORDERTANK,
  CREATEEXPORTORDER,
  GETALLCUSTOMERRECEIVE,
} from "./../../../config/config";
import openNotificationWithIcon from "./../../../helpers/notification";
import getAllDriversAPI from "./../../../../api/getAllDriversAPI";
import PopupSearchExportOrder from "./popupSearchExportOrder";
import vi from "antd/es/date-picker/locale/vi_VN";
import { Link } from "react-router";
const { Search } = Input;
import "./export-order-manage.scss";
const { Option } = Select;

class CreateExportOrderManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkbox: false,
      open: false,
      code: "",
      driver: "",
      userId: "", // id chi nhánh
      license_plate: "",
      weight_empty: "",
      weight_after_pump: "",
      note: "",
      idDriver: "",
      nameDriver: "",
      wareHouseId: "",
      startHour: "",
      date: "",
      errorTime: "",
      errorDriver: "",
      errorLicense: "",
      errorWareHouse: "",
      errorUser: "",
      errorEmpty: "",
      errorFull: "",
      errorDate: "",
      errorOrder: "",
      errorNote: "",
      idOrderTank: [],
      listDriver: [],
      listWareHouse: [],
      listCustomer: [],
      listOrderTank: [],
      orderTank: [],

      customerGasAddress: "", // địa chỉ khách hàng nhận
      receiver: "", // tên chi nhánh nhận
      wareHouseName: "", // tên kho xuất
      _order: "", // đon hàng đã chọn
    };
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    // console.log(token);
    await this.onChangeCodeValue();
    this.getAllDriver(id, token);
    this.getAllWareHouse(token);
    this.getAllCustomer(token);
    this.getAllOrder(token);
    // if(this.props.location.query.orderTank){
    //     let orderTank = JSON.parse(this.props.location.query.orderTank)
    //     await this.handleKeySelectTion(orderTank.id)
    //     await this.handleRowSelectTion([orderTank])
    // }
  }

  async onSubmitExportOrder(e) {
    e.preventDefault();
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    let {
      code,
      nameDriver,
      license_plate,
      idDriver,
      wareHouseId,
      weight_empty,
      weight_after_pump,
      date,
      startHour,
      note,
      idOrderTank,
      userId,
    } = this.state;
    if (note.length === 0) {
      note = " ";
    }
    let params = {
      code: Number(code),
      nameDriver: nameDriver,
      licensePlate: license_plate,
      driverId: !idDriver ? "" : idDriver,
      wareHouseId: wareHouseId,
      userId: userId,
      empty: weight_empty,
      full: weight_after_pump,
      deliveryDate: date,
      deliveryHours: startHour,
      node: note,
      type: "X",
      ExportOrderDetail: idOrderTank[0],
    };
    await callApi("POST", CREATEEXPORTORDER, params, token).then((res) => {
      console.log("create-export-order", res);
      if (res.data.success === true) {
        openNotificationWithIcon(
          "success",
          <span> Tạo lệnh xuất thành công!</span>
        );
        window.location.href = "#/export-order-management";
      } else {
        if (
          (this.state.checkbox && nameDriver === "") ||
          this.state.idDriver === ""
        ) {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng nhập <b style={{ fontWeight: "bold" }}>TÀI XẾ</b>
            </span>
          );
        } else if (
          license_plate === "" ||
          res.data.message === "không tìm thấy licensePlate"
        ) {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng nhập <b style={{ fontWeight: "bold" }}>SỐ XE</b>
            </span>
          );
        } else if (wareHouseId === "") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng chọn <b style={{ fontWeight: "bold" }}>KHO XUẤT</b>
            </span>
          );
        } else if (userId === "") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng chọn <b style={{ fontWeight: "bold" }}>NƠI NHẬN</b>
            </span>
          );
        } else if (!idOrderTank.length) {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng chọn <b style={{ fontWeight: "bold" }}>ĐƠN HÀNG</b>
            </span>
          );
        } else if (weight_empty === "") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng nhập{" "}
              <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG RỖNG</b>
            </span>
          );
        } else if (weight_after_pump === "") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng nhập{" "}
              <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG SAU KHI BƠM</b>
            </span>
          );
        } else if (weight_after_pump < weight_empty) {
          openNotificationWithIcon(
            "error",
            <span>
              <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG RỖNG</b> phải nhỏ
              hơn <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG SAU KHI BƠM</b>!{" "}
            </span>
          );
        } else if (date === "" || date === "Invalid date") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng chọn <b style={{ fontWeight: "bold" }}>NGÀY GIAO</b>
            </span>
          );
        } else if (startHour === "") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng chọn <b style={{ fontWeight: "bold" }}>GIỜ GIAO</b>
            </span>
          );
        } else if (note === "") {
          openNotificationWithIcon(
            "error",
            <span>
              {" "}
              Vui lòng nhập <b style={{ fontWeight: "bold" }}>GHI CHÚ</b>
            </span>
          );
        } else if (
          res.data.message ===
          "đơn khối lượng đơn xuất phải nhỏ hơn hoặc bằng trong kho "
        ) {
          // openNotificationWithIcon("error", <span> Đơn hàng đã xuất/nhập đủ khối lượng hoặc Khối lượng đơn xuất quá lớn!</span>);
          if (Number(res.data.weight) == 0) {
            openNotificationWithIcon(
              "error",
              <div>
                <span>Đơn hàng đã xuất đủ khối lượng!</span>
                <div>
                  <span>(Đơn hàng đã tồn tại 1 lệnh xuất!)</span>
                </div>
              </div>
            );
          } else if (
            Number(res.data.weight) < Number(this.state._order.quantity)
          ) {
            openNotificationWithIcon(
              "error",
              <div>
                <span>Khối lượng còn lại được xuất cho đơn hàng này là </span>
                <b style={{ fontWeight: "bold" }}>{res.data.weight}</b>
                <span> tấn.</span>
                <div>
                  <span>(Đơn hàng đã tồn tại 1 lệnh xuất!)</span>
                </div>
              </div>
            );
          } else {
            openNotificationWithIcon(
              "error",
              <div>
                <span>
                  Khối lượng tối đa được xuất cho đơn hàng này là{" "}
                </span>
                <b style={{ fontWeight: "bold" }}>{res.data.weight}</b>{" "}
                <span> tấn.</span>
                <div>
                  <span>Cập nhật lại thông tin lệnh xuất!</span>
                </div>
              </div>
            );
          }
        } else {
          openNotificationWithIcon(
            "error",
            res.data.message ? res.data.message : res.data.err_msg
          );
        }
        // openNotificationWithIcon("error", res.data.message);
        return false;
      }
    });
  }
  async getAllDriver(id, token) {
    let prams = {
      id: id,
    };
    await callApi("POST", GETDRIVE, prams, token).then((res) => {
      // console.log("driver", res);
      this.setState({
        listDriver: res.data.data,
      });
    });
  }
  async getAllWareHouse(token) {
    await callApi("GET", GETALL_WAREHOUSE, token).then((res) => {
      // console.log("wareHouse", res);
      this.setState({
        listWareHouse: res.data.WareHouse,
      });
    });
  }
  async getAllCustomer(token) {
    await callApi("GET", GETALLCUSTOMERRECEIVE, "", token).then((res) => {
      // console.log("customer", res);
      this.setState({
        listCustomer: res.data.data,
      });
    });
  }
  async getAllOrder(token) {
    await callApi("GET", GETALLORDERTANK, token).then((res) => {
      // console.log("orderr", res.data);
    });
  }
  handleKeySelectTion = (value) => {
    this.setState({ idOrderTank: value });
  };
  handleRowSelectTion = async (value) => {
    console.log("Đơn hàng đã chọn", value[0]);
    this.setState({ listOrderTank: value });
    let customerGasAddress,
      userId,
      wareHouseId,
      receiver,
      wareHouseName,
      _order = "";
    if (value[0]) {
      customerGasAddress = value[0].customergasId
        ? value[0].customergasId.address
        : "";
      userId = value[0].customergasId ? value[0].customergasId.userID : "";
      wareHouseId = value[0].warehouseId.id;
      // receiver = this.state.listCustomer.filter(item => item.id === userId)
      // wareHouseName = this.state.listWareHouse.filter(item => item.id === wareHouseId)
      wareHouseName = value[0].warehouseId.name;
      receiver = value[0].customergasId.branchname;
      _order = value[0];
    }
    this.setState({
      customerGasAddress,
      userId,
      receiver: receiver ? receiver : "Nơi nhận không xác định!",
      wareHouseId,
      wareHouseName: wareHouseName ? wareHouseName : "Kho không xác định!",
      // wareHouseName: wareHouseName[0] ? wareHouseName[0].name : "Kho xuất không xác định!"
      _order,
    });
  };
  onClickDelOrder = (id) => {
    const { listOrderTank, idOrderTank } = this.state;
    this.setState({
      listOrderTank: listOrderTank.filter((e) => e.id !== id),
      idOrderTank: idOrderTank.filter((e) => e !== id),
      customerGasAddress: "",
      userId: "",
      wareHouseId: "",
      receiver: "",
      wareHouseName: "",
    });
  };
  onChangeCodeValue = (e) => {
    let numFirst = Math.floor(Math.random() * 99999999 + 1);
    let numAfter = Math.floor(Math.random() * 99999999 + 1);
    let malenh = (numFirst + numAfter).toString();
    this.setState({
      code: malenh,
    });
  };
  onChangeCheckBox = (e) => {
    this.setState({
      checkbox: e.target.checked,
      nameDriver: "",
      idDriver: "",
      license_plate: "",
    });
  };
  onChangeInputText = (e) => {
    const { license_plate, weight_empty, weight_after_pump, note } = this.state;
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
    if (license_plate !== "") {
      this.setState({ errorLicense: "" });
    } else if (weight_empty !== "") {
      this.setState({ errorEmpty: "" });
    } else if (weight_after_pump !== "") {
      this.setState({ errorFull: "" });
    } else if (note !== "") {
      this.setState({ errorNote: "" });
    } else {
    }
  };
  onChangDriverValue = (value) => {
    const { listDriver, license_plate } = this.state;
    this.setState({
      idDriver: value,
    });
    // listDriver.map((v) => {
    //   if (v.id === value) {
    //     return this.setState({
    //       license_plate: v.driverNumber,
    //     });
    //   }
    // });
    if (value !== "") {
      this.setState({
        errorDriver: "",
        errorLicense: "",
      });
    }
  };
  onChangelistCustomer = (value) => {
    this.setState({
      userId: value,
    });
    if (value !== "") {
      this.setState({ errorUser: "" });
    }
  };
  onChangeWareHouse = (value) => {
    this.setState({
      wareHouseId: value,
    });
    if (value !== "") {
      this.setState({ errorWareHouse: "" });
    }
  };
  handleChangeDate = (date) => {
    if (date !== "") {
      this.setState({
        date: moment(date).format("DD/MM/YYYY"),
        errorDate: "",
      });
    }
  };
  handleChangeHour = (time) => {
    // console.log("gio", time);
    const _time = new Date(time.toISOString());
    const hour = _time.getHours();
    const minute = _time.getMinutes();
    if (time !== "") {
      this.setState({
        startHour: hour + ":" + minute,
        errorTime: "",
      });
    }
  };
  handleOpenChange = (open) => {
    this.setState({ open });
  };
  render() {
    const {
      checkbox,
      code,
      listDriver,
      listWareHouse,
      listCustomer,
      license_plate,
      listOrderTank,
      errorDriver,
      errorLicense,
      errorWareHouse,
      errorUser,
      errorEmpty,
      errorFull,
      errorDate,
      errorOrder,
      errorNote,
      idOrderTank,
      errorTime,
    } = this.state;
    return (
      <div className="main-content" id="CreateExportOrderManage">
        <div className="card">
          <Form onSubmit={(event) => this.onSubmitExportOrder(event)}>
            <div className="card-title">
              <div className="card-product">
                <div className="card-product-left mt-1">
                  <Link to="/export-order-management" className="p-1 bg-white">
                    <Icon type="arrow-left" className="fa" />
                  </Link>
                  <h4>Tạo lệnh xuất</h4>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive-xl">
                <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                  <div className="row">
                    <div className="col-md-12">
                      <h5>Thông tin chung</h5>
                    </div>
                    <div className="col-md-5 create-export-order-left">
                      <div className="row d-flex justify-content-between mt-3">
                        <div className="col-md-5"></div>
                        <div className="col-md-5 mt-1 mb-2">
                          <Checkbox onChange={this.onChangeCheckBox}>
                            Xe ngoài
                          </Checkbox>
                        </div>
                        <div className="col-md-5">
                          <label>
                            Mã xuất: <label style={{ color: "white" }}>*</label>
                          </label>
                          <Input
                            type="text"
                            onChange={this.onChangeCodeValue}
                            value={code}
                          />
                        </div>
                        <div className="col-md-5">
                          <label>
                            Tài xế:<label style={{ color: "red" }}>*</label>
                          </label>
                          {checkbox === true && (
                            <Input
                              type="text"
                              name="nameDriver"
                              onChange={this.onChangeInputText}
                            />
                          )}
                          {checkbox === false && (
                            <Select
                              placeholder="--Chọn--"
                              onChange={this.onChangDriverValue}
                              style={{ width: "100%" }}
                            >
                              <Option value="">Chọn</Option>
                              {listDriver.map((item, index) => {
                                return (
                                  <Option value={item.id} key={index}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                          {errorDriver !== "" ? (
                            <p
                              className="mt-1 text-right"
                              style={{ width: "100%", color: "red" }}
                            >
                              {errorDriver}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-md-12 d-flex justify-content-between mt-3">
                          <p>
                            Trọng lượng rỗng (tấn):
                            <label style={{ color: "red" }}>*</label>
                          </p>
                          <Input
                            placeholder="Trọng lượng xe vào"
                            type="number"
                            name="weight_empty"
                            onChange={this.onChangeInputText}
                            style={{ width: "270px" }}
                            min={0}
                          />
                        </div>
                        {errorEmpty !== "" ? (
                          <div className="col-md-12 text-right">
                            <p
                              className="mt-1"
                              style={{ width: "100%", color: "red" }}
                            >
                              {errorEmpty}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="col-md-12 d-flex justify-content-between mt-3">
                          <p>
                            Thời gian giao:
                            <label style={{ color: "red" }}>*</label>
                          </p>
                          <DatePicker
                            format="DD/MM/YYYY"
                            locale={vi}
                            onChange={this.handleChangeDate}
                            style={{
                              width: "270px",
                              height: "-webkit-fill-available",
                            }}
                          />
                        </div>
                        {errorDate !== "" ? (
                          <div className="col-md-12 text-right">
                            <p style={{ width: "100%", color: "red" }}>
                              {errorDate}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-md-7 create-export-order-right">
                      <div className="row d-flex justify-content-between mt-5">
                        <div className="col-md-4">
                          <label>
                            Số xe:<label style={{ color: "red" }}>*</label>
                          </label>
                          <br />
                          {checkbox === true && (
                            <Input
                              placeholder="Nhập vào biển số xe"
                              type="text"
                              name="license_plate"
                              onChange={this.onChangeInputText}
                            />
                          )}
                          {checkbox === false && (
                            <Input
                              placeholder="Nhập vào biển số xe"
                              type="text"
                              name="license_plate"
                              onChange={this.onChangeInputText}
                              value={license_plate}
                            />
                          )}
                          {errorLicense !== "" ? (
                            <p
                              className="mt-1 text-right"
                              style={{ width: "100%", color: "red" }}
                            >
                              {errorLicense}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-md-4">
                          <label>
                            Kho xuất:
                            <label style={{ color: "red" }}>*</label>
                          </label>
                          <br />
                          {/* <Select
                                                        placeholder="--Chọn--"
                                                        style={{ width: "100%" }}
                                                        onChange={this.onChangeWareHouse}
                                                    >
                                                        <Option value="">Chọn</Option>
                                                        {listWareHouse.map((item, index) => {
                                                            return (
                                                                <Option key={index} value={item.id}>{item.name}</Option>
                                                            );
                                                        })}
                                                    </Select> */}
                          <Input
                            placeholder="Bấm để chọn đơn hàng"
                            type="text"
                            name="wareHouseName"
                            value={this.state.wareHouseName}
                            style={{ width: "100%" }}
                            readOnly
                            onClick={(e) =>
                              this.state.wareHouseId === ""
                                ? document
                                    .getElementById("btn-search-order")
                                    .click()
                                : ""
                            }
                          ></Input>
                          {errorWareHouse !== "" ? (
                            <p
                              className="mt-1 text-right"
                              style={{ width: "100%", color: "red" }}
                            >
                              {errorWareHouse}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-md-4">
                          <label>
                            Nơi nhận:
                            <label style={{ color: "red" }}>*</label>
                          </label>
                          <br />
                          {/* <Select
                                                        name="userId"
                                                        placeholder="--Chọn--"
                                                        style={{ width: "100%" }}
                                                        onChange={this.onChangelistCustomer}
                                                        value={this.state.userId}
                                                    >
                                                        <Option value="">Chọn</Option>
                                                        {listCustomer.map((item, index) => {
                                                            return (
                                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                                            );
                                                        })}
                                                    </Select> */}
                          <Input
                            placeholder="Bấm để chọn đơn hàng"
                            type="text"
                            name="receiver"
                            value={this.state.receiver}
                            style={{ width: "100%" }}
                            readOnly
                            onClick={(e) =>
                              this.state.userId === ""
                                ? document
                                    .getElementById("btn-search-order")
                                    .click()
                                : ""
                            }
                          ></Input>
                          {errorUser !== "" ? (
                            <p
                              className="mt-1 text-right"
                              style={{ width: "100%", color: "red" }}
                            >
                              {errorUser}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-md-12 d-flex mt-3">
                          <p>
                            Trọng lượng sau khi bơm (tấn):
                            <label style={{ color: "red" }}>*</label>
                          </p>
                          <Input
                            placeholder="Trọng lượng xe ra"
                            type="number"
                            name="weight_after_pump"
                            onChange={this.onChangeInputText}
                            style={{ width: "270px" }}
                            min={0}
                          />
                        </div>
                        {errorFull !== "" ? (
                          <div className="col-md-12 text-left">
                            <p
                              className="mt-1"
                              style={{
                                marginLeft: "259px",
                                width: "30%",
                                color: "red",
                              }}
                            >
                              {errorFull}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="col-md-12 d-flex mt-3">
                          <p>
                            Giờ giao:
                            <label style={{ color: "red" }}>*</label>
                          </p>
                          <TimePicker
                            format="HH:mm"
                            open={this.state.open}
                            onOpenChange={this.handleOpenChange}
                            onChange={this.handleChangeHour}
                            style={{
                              width: "270px",
                              height: "-webkit-fill-available",
                            }}
                          />
                        </div>
                        {errorTime !== "" ? (
                          <div className="col-md-12 text-left">
                            <p
                              className="mt-1"
                              style={{
                                marginLeft: "302px",
                                width: "30%",
                                color: "red",
                              }}
                            >
                              {errorTime}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 mt-5">
                      <button
                        id="btn-search-order"
                        className="btn btn-warning"
                        data-toggle="modal"
                        data-target="#search-export-order"
                        onClick={() => this.setState({ orderTank: [] })}
                        type="button"
                      >
                        {idOrderTank.length ? (
                          <i class="fa fa-retweet" aria-hidden="true">
                            {" "}
                            Thay đổi đơn hàng
                          </i>
                        ) : (
                          <i class="fa fa-plus" aria-hidden="true">
                            {" "}
                            Chọn đơn hàng
                          </i>
                        )}
                      </button>
                      {idOrderTank === "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorOrder}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-12 mt-1">
                      <table
                        className="table table-sm table-striped table-bordered seednet-table-keep-column-width text-center"
                        cellSpacing="0"
                      >
                        <thead className="table__head">
                          <tr>
                            <th scope="col" className="align-middle">
                              Mã đơn hàng
                            </th>
                            <th scope="col" className="align-middle">
                              Tên khách hàng
                            </th>
                            <th scope="col" className="align-middle">
                              Ngày giao
                            </th>
                            <th scope="col" className="align-middle">
                              Giờ giao
                            </th>
                            <th scope="col" className="align-middle">
                              Khối lượng
                            </th>
                            <th scope="col" className="align-middle">
                              Trạng thái
                            </th>
                            <th scope="col" className="align-middle">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {listOrderTank.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.orderCode}</td>
                                <td>{item.name}</td>
                                <td>
                                  {item.fromdeliveryDate +
                                    " - " +
                                    item.todeliveryDate}
                                </td>
                                <td>{item.deliveryHours}</td>
                                <td>{item.quantity + " tấn"}</td>
                                <td>
                                {item.status === "INIT" ? (
                                    <Tag color="blue">Khởi tạo</Tag>
                                  ) : item.status === "PENDING" ? (
                                    <Tag color="purple">Đang chờ duyệt</Tag>
                                  ) : item.status === "DELIVERING" ? (
                                    <Tag color="orange">Đang giao</Tag>
                                  ) : item.status === "PROCESSING" ? (
                                    <Tag color="gold">Đang xử lý</Tag>
                                  ) : item.status === "DELIVERED" ? (
                                    <Tag color="cyan">Đã giao</Tag>
                                  ) : item.status === "CONFIRMED" ? (
                                    <Tag color="green">Đã duyệt</Tag>
                                  ) : item.status === "CANCELLED" ? (
                                    <Tag color="red">Đã hủy</Tag>
                                  ) : ("")}
                                </td>
                                <td>
                                  <div className="text-center statuss">
                                    <Popconfirm
                                      title="Bạn có chắc chắn muốn xóa?"
                                      icon={
                                        <Icon
                                          type="question-circle-o"
                                          style={{ color: "red" }}
                                        />
                                      }
                                      onConfirm={() =>
                                        this.onClickDelOrder(item.id)
                                      }
                                      okText="Có"
                                      cancelText="Không"
                                    >
                                      <a className="text-danger">
                                        <Icon type="delete" />
                                      </a>
                                    </Popconfirm>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-12 mt-5 text-center">
                      <p>Ghi chú</p>
                      <textarea
                        placeholder="Nhập vào ghi chú"
                        cols="70"
                        rows="5"
                        className="text-center"
                        name="note"
                        onChange={this.onChangeInputText}
                      ></textarea>
                      <br />
                      {errorNote !== "" ? (
                        <p
                          className="text-center"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorNote}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-center">
              <button type="submit" className="btn btn-success mr-2">
                Lưu
              </button>
              <Link to="/export-order-management" className="p-0">
                <button type="button" className="btn btn-secondary">
                  Đóng
                </button>
              </Link>
            </div>
          </Form>
        </div>
        <PopupSearchExportOrder
          orderTank={this.state.orderTank}
          handleRowSelectTion={this.handleRowSelectTion}
          handleKeySelectTion={this.handleKeySelectTion}
        />
      </div>
    );
  }
}
export default CreateExportOrderManage;
