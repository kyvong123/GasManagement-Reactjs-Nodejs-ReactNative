import React, { Component } from "react";
import Constants from "Constants";
import moment from "moment";
import getUserCookies from "getUserCookies";
import DatePicker from "react-datepicker";
import callApi from "./../../../util/apiCaller";
import {
  GETDRIVE,
  GETALL_WAREHOUSE,
  GETALLCUSTOMERRECEIVE,
  GETALLORDERTANK,
  FINDORDERTANK,
  UPDATEEXPORTORDER,
  FINDORDERTANKBYNAME,
  CONFIRMATIONSTATUS,
  BACKSTATUS,
  CONFIRMATIONORDERSTATUS,
  UPDATEORDEREXPORTDETAIL,
} from "../../../config/config";
import openNotificationWithIcon from "./../../../helpers/notification";
import sendNotification from "./../../../../api/sendNotification";
import {
  Select,
  Form,
  Input,
  Popconfirm,
  // DatePicker,
  Icon,
  TimePicker,
  message,
  Checkbox,
  Table,
  Radio,
  Spin,
  Tag,
} from "antd";
import vi from "antd/es/date-picker/locale/vi_VN";
import "moment/locale/vi";
import showToast from "showToast";
import "./import-order-manage.scss";
import "react-datepicker/dist/react-datepicker.css";
import Highlighter from "react-highlight-words";
const { Option } = Select;
// const selectRef = useRef();

export default class PopupDetailImportOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkbox: false,
      loading: false,
      open: false,
      disable: false,
      disabled: false,
      status: null,
      display: "",
      id: "",
      code: "",
      driver: "",
      license_plate: "",
      weight_empty: "",
      weight_after_pump: "",
      note: "",
      idDriver: "",
      nameDriver: "",
      wareHouseId: "",
      startHour: "",
      order: [],
      errorTime: "",
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
      idOrderTank: "",
      wareHouseName: "",
      userName: "",
      userId: "",
      wareHouse: "",
      idDriverr: null,
      idUser: "",
      nameDriverr: "",
      orderIdd: "",
      findOrder: "name",
      orderCode: "",
      codeAndName: "",
      ExportOrderDetail: [],
      listDriver: [],
      listWareHouse: [],
      listCustomer: [],
      listOrderTank: [],
      orderId: [],
      user: [],
      isLoading: false,

      customerGasAddress: "", // địa chỉ khách hàng nhận
      receiver: "", // tên chi nhánh nhận của khách hàng
      _order: "", // đơn hàng đã chọn
      checkInvalidWeight: false, // kiểm tra đơn hàng đã cập nhật thông tin?
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.ExportOrderDetail) {
      // console.log("nextProps",nextProps)
      let receiver = "";
      if (nextProps.ExportOrderDetail) {
        if (nextProps.ExportOrderDetail.exportOrderDetail) {
          if (nextProps.ExportOrderDetail.exportOrderDetail[0][0]) {
            receiver =
              nextProps.ExportOrderDetail.exportOrderDetail[0][0].customergasId
                .branchname;
          }
        }
      }
      this.setState({
        id: nextProps.ExportOrderDetail.id,
        code: nextProps.ExportOrderDetail.code,
        listOrderTank: nextProps.order,
        userId: nextProps.ExportOrderId,
        user: nextProps.ExportOrderDetail.userId,
        wareHouse: nextProps.wareHouseName,
        weight_empty: nextProps.ExportOrderDetail.empty,
        weight_after_pump: nextProps.ExportOrderDetail.full,
        nameDriver:
          nextProps.ExportOrderDetail.nameDriver === ""
            ? nextProps.nameDriverr
            : nextProps.ExportOrderDetail.nameDriver,
        date: nextProps.ExportOrderDetail.deliveryDate,
        startHour: nextProps.ExportOrderDetail.deliveryHours,
        license_plate:
          nextProps.ExportOrderDetail.licensePlate === ""
            ? ""
            : nextProps.ExportOrderDetail.licensePlate,
        userName: nextProps.userName,
        note: nextProps.ExportOrderDetail.node,
        idDriver: nextProps.idDriver,
        idUser: nextProps.idUser,
        nameDriverr: nextProps.nameDriverr,
        // wareHouseId: nextProps.idWareHouse,
        orderIdd: nextProps.orderIdd,
        status: nextProps.status,

        wareHouseId: nextProps.ExportOrderDetail.wareHouseId
          ? nextProps.ExportOrderDetail.wareHouseId.id
          : "",
        wareHouseName: nextProps.ExportOrderDetail.wareHouseId
          ? nextProps.ExportOrderDetail.wareHouseId.name
          : "",
        order: nextProps.order[0],
        _order: nextProps.order[0],
        receiver,
        checkInvalidWeight: false,

        listDriver: nextProps.listDriver,
        listCustomer: nextProps.listCustomer,
        listWareHouse: nextProps.listWareHouse
      });
      if (nextProps.status === 1) {
        this.setState({ disable: false, display: "inline" });
      } else if (nextProps.status === 2) {
        this.setState({ disable: true, display: "none" });
      } else {
        this.setState({ disable: true, display: "none" });
      }
      this.setState({
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
      });
    }
  }
  async componentDidMount() {
    // let user_cookies = await getUserCookies();
    // let token = "Bearer " + user_cookies.token;
    // let id = user_cookies.user.id;
    // // console.log(token);
    // this.getAllDriver(id, token);
    // this.getAllWareHouse(token);
    // this.getAllCustomer(token);
    // this.getAllOrder(token);
  }
  async onUpdateImportOrder(e, checkUpdateOrder) {
    this.setState({ loading: true });
    e.preventDefault();
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    const {
      id,
      nameDriver,
      license_plate,
      idDriver,
      wareHouseId,
      weight_empty,
      weight_after_pump,
      date,
      startHour,
      note,
      idUser,
      order,
      userId,
    } = this.state;
    let params = {
      ExportOrderId: id,
      nameDriver: nameDriver,
      licensePlate: license_plate,
      driverId: !idDriver ? "" : idDriver,
      wareHouseId: wareHouseId,
      userId: idUser,
      empty: weight_empty,
      full: weight_after_pump,
      deliveryDate: date,
      deliveryHours: startHour,
      node: note,
      ExportOrderDetail: order.id,
    };
    if (license_plate === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng nhập <b style={{ fontWeight: "bold" }}>SỐ XE</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (wareHouseId === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng chọn <b style={{ fontWeight: "bold" }}>KHO NHẬP</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (idUser === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng chọn <b style={{ fontWeight: "bold" }}>NƠI NHẬN</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (!order) {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng chọn <b style={{ fontWeight: "bold" }}>ĐƠN HÀNG</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (weight_empty === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng nhập <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG RỖNG</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (weight_after_pump === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng nhập{" "}
          <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG SAU KHI BƠM</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (weight_after_pump < weight_empty) {
      openNotificationWithIcon(
        "error",
        <span>
          <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG RỖNG</b> phải nhỏ hơn{" "}
          <b style={{ fontWeight: "bold" }}>TRỌNG LƯỢNG SAU KHI BƠM</b>!{" "}
        </span>
      );
      this.setState({ loading: false });
    } else if (date === "" || date === "Invalid date") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng chọn <b style={{ fontWeight: "bold" }}>THỜI GIAN GIAO</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (startHour === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng chọn <b style={{ fontWeight: "bold" }}>GIỜ GIAO</b>
        </span>
      );
      this.setState({ loading: false });
    } else if (note === "") {
      openNotificationWithIcon(
        "error",
        <span>
          {" "}
          Vui lòng nhập <b style={{ fontWeight: "bold" }}>GHI CHÚ</b>
        </span>
      );
      this.setState({ loading: false });
    } else {
      console.log("UPDATE_IMPORT_ORDER_params", params);
      await callApi("POST", UPDATEEXPORTORDER, params, token)
        .then((res) => {
          this.setState({ loading: false });
          console.log("UPDATEEXPORTORDER", res);
          if (res.data.success === true) {
            if (!checkUpdateOrder) {
              let modal = $("#detail-import-order");
              modal.modal("hide");
              openNotificationWithIcon(
                "success",
                <span>Cập nhật thông tin thành công!</span>
              );
              this.props.refresh();
              this.props.onClickEditCylinder(this.state.id);
            } else {
              this.onUpdateOrder();
            }
          } else {
            if (res.data.message === "user không tồn tại!") {
              openNotificationWithIcon(
                "error",
                <span>Tài xế không tồn tại!</span>
              );
            } else if (
              res.data.message ===
              "đơn khối lượng đơn xuất phải nhỏ hơn hoặc bằng trong kho "
            ) {
              if (
                Number(res.data.weight) < Number(this.state._order.quantity)
              ) {
                openNotificationWithIcon(
                  "error",
                  <div>
                    <span>
                      Khối lượng còn lại được nhập cho đơn hàng này là{" "}
                    </span>
                    <b style={{ fontWeight: "bold" }}>{res.data.weight}</b>
                    <span> tấn.</span>
                    <div>
                      <span>(Đơn hàng này đã tồn tại 1 lệnh nhập!)</span>
                    </div>
                  </div>
                );
              } else {
                openNotificationWithIcon(
                  "error",
                  <div>
                    <span>
                      Khối lượng tối đa được nhập cho đơn hàng này là{" "}
                    </span>
                    <b style={{ fontWeight: "bold" }}>{res.data.weight}</b>{" "}
                    <span> tấn.</span>
                    <div>
                      <span>Cập nhật lại thông tin lệnh nhập!</span>
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
            return false;
          }
        })
        .catch((err) => console.log(err));
      this.setState({ loading: false });
    }
  }
  async onUpdateOrder() {
    this.setState({ loading: true });
    let id = this.state.id;
    let _order = this.state._order;
    let listOrderTank = this.state.listOrderTank;
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    if (listOrderTank === "" && _order === "") {
      openNotificationWithIcon("error", <span>Vui lòng chọn đơn hàng!</span>);
      return false;
    }
    let params = {
      id: id,
      orderId:
        _order === "" ? (listOrderTank ? listOrderTank[0].id : "") : _order.id,
      // orderId: order.id,
    };

    console.log("UPDATE_ORDER_EXPORT_DETAIL_params", params);
    await callApi("POST", UPDATEORDEREXPORTDETAIL, params, token)
      .then((res) => {
        console.log("UPDATEORDEREXPORTDETAIL", res);
        if (res.data.success === true) {
          openNotificationWithIcon(
            "success",
            <span>Cập nhật đơn hàng thành công!</span>
          );
          this.props.refresh();
          this.props.onClickEditCylinder(id);
        } else {
          if (
            res.data.message ===
            "đơn khối lượng đơn xuất phải nhỏ hơn hoặc bằng trong kho "
          ) {
            // console.log(Number(res.data.weight),Number(this.state.order.quantity))
            if (Number(res.data.weight) == 0) {
              openNotificationWithIcon(
                "error",
                <div>
                  <span>Đơn hàng đã nhập đủ khối lượng!</span>
                  <div>
                    <span>(Đơn hàng đã tồn tại 1 lệnh nhập!)</span>
                  </div>
                </div>
              );
            } else if (
              Number(res.data.weight) < Number(this.state._order.quantity)
            ) {
              openNotificationWithIcon(
                "error",
                <div>
                  <span>Khối lượng còn lại được nhập cho đơn hàng này là </span>
                  <b style={{ fontWeight: "bold" }}>{res.data.weight}</b>
                  <span> tấn.</span>
                  <div>
                    <span>(Đơn hàng đã tồn tại 1 lệnh nhập!)</span>
                  </div>
                </div>
              );
            } else {
              openNotificationWithIcon(
                "error",
                <div>
                  <span>Khối lượng tối đa được nhập cho đơn hàng này là </span>
                  <b style={{ fontWeight: "bold" }}>{res.data.weight}</b>{" "}
                  <span> tấn.</span>
                  <div>
                    <span>
                      Cập nhật lại thông tin lệnh nhập trước khi thay đổi đơn
                      hàng!
                    </span>
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
        }
      })
      .catch((err) => console.log(err));
    this.setState({ loading: false });
  }

  findOrderTank = async (e) => {
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
    if (this.state.findOrder === "orderCode") {
      if (this.state.codeAndName !== "") {
        this.setState({ isLoading: true });
        await callApi("POST", FINDORDERTANK, params, token).then((res) => {
          this.setState({ isLoading: false });
          let data = [];
          this.setState({ isLoading: false });
          if (res.data.status === true) {
            res.data.OrderTank.map((item) => {
              if (
                item.warehouseId.userId === user_cookies.user.isChildOf &&
                item.warehouseId.code === user_cookies.user.warehouseCode &&
                (item.status === "CONFIRMED" || item.status === "PROCESSING")
              ) {
                data.push({
                  ...item,
                  key: item.id,
                  nameCustomerGas: item.customergasId.name,
                });
              }
            });
            if (data.length === 0) {
              openNotificationWithIcon(
                "error",
                "Không có đơn hàng trùng khớp hoặc tất cả các đơn hàng đã được tạo!"
              );
            }
            this.setState({
              listOrderTank: data,
              codeAndName: "",
            });
          } else {
            openNotificationWithIcon("error", "Không tìm thấy mã đơn hàng");
            this.setState({ codeAndName: "", listOrderTank: [] });
            return false;
          }
        });
      } else {
        openNotificationWithIcon("error", "Hãy nhập mã đơn hàng để tìm kiếm");
        this.setState({ isLoading: false });
      }
    } else {
      if (this.state.orderCode !== "") {
        this.setState({ isLoading: true });
        await callApi("POST", FINDORDERTANKBYNAME, params1, token).then(
          (res) => {
            let data = [];
            this.setState({ isLoading: false });
            if (res.data.status === true) {
              res.data.OrderTank.map((item) => {
                return item.map((v) => {
                  if (
                    v.warehouseId.userId === user_cookies.user.isChildOf &&
                    item.warehouseId.code === user_cookies.user.warehouseCode &&
                    (v.status === "CONFIRMED" || v.status === "PROCESSING")
                  ) {
                    data.push({
                      ...v,
                      key: v.id,
                      nameCustomerGas: v.customergasId.name,
                    });
                  }
                });
              });
              if (data.length === 0) {
                openNotificationWithIcon(
                  "error",
                  "Không có đơn hàng trùng khớp hoặc tất cả các đơn hàng đã được tạo!"
                );
              }
              this.setState({
                listOrderTank: data,
                orderCode: "",
              });
            } else {
              openNotificationWithIcon(
                "error",
                "Không tìm thấy tên khách hàng"
              );
              this.setState({ orderCode: "", listOrderTank: [] });
              return false;
            }
          }
        );
      } else {
        openNotificationWithIcon(
          "error",
          "Hãy nhập tên khách hàng để tìm kiếm"
        );
        this.setState({ isLoading: false });
        return false;
      }
    }
  };
  async getAllDriver(id, token) {
    let prams = {
      id: id,
    };
    await callApi("POST", GETDRIVE, prams, token).then((res) => {
      // console.log("driver", res.data.Carrier);
      this.setState({
        listDriver: res.data.data,
      });
    });
  }
  async getAllWareHouse(token) {
    await callApi("GET", GETALL_WAREHOUSE, token).then((res) => {
      this.setState({
        listWareHouse: res.data.WareHouse,
      });
    });
  }
  async getAllCustomer(token) {
    await callApi("GET", GETALLCUSTOMERRECEIVE, "", token).then((res) => {
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
  onChangeCheckBox = (e) => {
    const { checkbox, idDriver, idDriverr, nameDriver } = this.state;
    this.setState({
      checkbox: e.target.checked,
    });
    if (checkbox === false) {
      this.setState({
        idDriverr: null,
        idDriver: null,
      });
    } else {
      if (nameDriver !== "") {
        this.setState({ nameDriver: "" });
      }
      this.setState({
        idDriverr: this.props.idDriver,
      });
    }
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
      //
    }
  };
  onChangDriverValue = (value) => {
    $("#Driverr")
      .find(".ant-select-selection__placeholder")
      .css("display", "none");
    $("#Driverr")
      .find(".ant-select-selection-selected-value")
      .css("display", "block");
    const { listDriver } = this.state;
    this.setState({
      idDriver: value,
      // nameDriver: "",
    });
    listDriver.map((v) => {
      if (v.id === value) {
        return this.setState({
          // license_plate: v.driverNumber,
          nameDriver: v.name,
        });
      }
    });
    if (value !== "") {
      this.setState({
        errorDriver: "",
        errorLicense: "",
      });
    }
  };
  onChangeWareHouse = (value) => {
    $("#warehouse")
      .find(".ant-select-selection__placeholder")
      .css("display", "none");
    $("#warehouse")
      .find(".ant-select-selection-selected-value")
      .css("display", "block");
    this.setState({
      wareHouseId: value,
    });
    if (value !== "") {
      this.setState({ errorWareHouse: "" });
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
  onChangelistCustomer = (value) => {
    $("#user")
      .find(".ant-select-selection__placeholder")
      .css("display", "none");
    $("#user")
      .find(".ant-select-selection-selected-value")
      .css("display", "block");
    this.setState({
      idUser: value,
    });
    if (value !== "") {
      this.setState({ errorUser: "" });
    }
  };
  async onConfirmationStatus() {
    this.setState({ isLoading: true });
    const { id } = this.state;
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id_user = user_cookies.user.id;
    // let params = {
    //     ExportOrderId: id
    // };
    let resultNotify = await sendNotification(
      "Thông báo có đơn xe bồn",
      "Vận chuyển đơn này",
      this.props.playerId,
      id
    );
    // console.log("resultNotify.data.status", resultNotify.data.status);
    if (resultNotify.data.status === false) {
      this.setState({ isLoading: false });
      openNotificationWithIcon(
        "error",
        <span>Tài xế chưa nhận được thông báo đơn hàng!</span>);
      return false;
    } else {
      openNotificationWithIcon(
        "success",
        <span>Tài xế đã nhận được thông báo đơn hàng!</span>);
    }
    let params1 = {
      exportOrderID: id,
      status: 2,
      updatedBy: id_user,
    };
    await callApi("POST", CONFIRMATIONORDERSTATUS, params1, token).then(
      (res) => {
        // console.log("orderStatus", res);
        console.log("CONFIRMATIONORDERSTATUS", res);
        if (res.data.success === true) {
          openNotificationWithIcon(
            "success",
            <span>Đã xác nhận đơn hàng thành công</span>
          );
          this.props.onClickEditCylinder(this.state.id);
          this.props.refresh();
        } else {
          openNotificationWithIcon(
            "error",
            res.data.message ? res.data.message : res.data.err_msg
          );
        }
      }
    );
    this.setState({ isLoading: false });
  }
  async onBackStatus() {
    this.setState({ isLoading: true });
    const { id } = this.state;
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id_user = user_cookies.user.id;
    let params1 = {
      exportOrderID: id,
      status: 1,
      updatedBy: id_user,
    };
    await callApi("POST", CONFIRMATIONORDERSTATUS, params1, token).then(
      (res) => {
        // console.log("orderStatus", res);
        openNotificationWithIcon(
          "success",
          "Đã hủy xác nhận đơn hàng thành công"
        );
        this.props.onClickEditCylinder(this.state.id);
        this.props.refresh();
        this.setState({ isLoading: false });
      }
    );
  }
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
  onClickDeleteOrder = (id) => {
    const { listOrderTank } = this.state;
    this.setState({
      listOrderTank: listOrderTank.filter((e) => e.id !== id),
      orderIdd: "",
      order: "",
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("Đơn hàng đã chọn", selectedRows[0]);
    // this.setState({ listOrderTank: selectedRows });
    let customerGasAddress,
      userId,
      wareHouseId,
      receiver,
      wareHouseName,
      _order = "";
    if (selectedRows[0]) {
      customerGasAddress = selectedRows[0].customergasId
        ? selectedRows[0].customergasId.address
        : "";
      userId = selectedRows[0].customergasId
        ? selectedRows[0].customergasId.userID
        : "";
      // wareHouseId = selectedRows[0].wareHouseId
      //   ? selectedRows[0].wareHouseId.id
      //   : selectedRows[0].warehouseId.id;
      receiver = selectedRows[0].customergasId
        ? selectedRows[0].customergasId.branchname
        : "";
      wareHouseName = selectedRows[0].wareHouseId
        ? selectedRows[0].wareHouseId.name
        : selectedRows[0].warehouseId.name; // kho xuất
      _order = selectedRows[0];
    }

    this.setState({
      customerGasAddress,
      userId,
      receiver: receiver ? receiver : "Nơi nhận không xác định!",
      // wareHouseId,
      wareHouseName: wareHouseName ? wareHouseName : "Kho xuất không xác định!",
      _order, // đơn hàng chọn
      // wareHouseName: wareHouseName[0] ? wareHouseName[0].name : "Kho xuất không xác định!"
    });
  };

  onReset = () => {
    setTimeout(() => {
      this.setState({
        checkbox: false,
        loading: false,
        open: false,
        disable: false,
        disabled: false,
        status: null,
        display: "",
        display1: "",
        id: "",
        code: "",
        driver: "",
        license_plate: "",
        weight_empty: "",
        weight_after_pump: "",
        note: "",
        idDriver: "",
        nameDriver: "",
        wareHouseId: "",
        startHour: "",
        order: [],
        errorTime: "",
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
        idOrderTank: "",
        wareHouseName: "",
        userName: "",
        userId: "",
        wareHouse: "",
        idDriverr: null,
        idUser: "",
        nameDriverr: "",
        orderIdd: "",
        findOrder: "name",
        orderCode: "",
        codeAndName: "",
        ExportOrderDetail: [],
        listDriver: [],
        listWareHouse: [],
        listCustomer: [],
        listOrderTank: [],
        orderId: [],
        user: [],
        isLoading: false,

        customerGasAddress: "", // địa chỉ khách hàng nhận
        receiver: "", // tên chi nhánh nhận của khách hàng
      });
    }, 1000);
  };


  render() {
    const {
      checkbox,
      code,
      listDriver,
      nameDriver,
      listWareHouse,
      listCustomer,
      license_plate,
      listOrderTank,
      weight_empty,
      weight_after_pump,
      date,
      startHour,
      note,
      userName,
      nameDriverr,
      errorDriver,
      errorLicense,
      errorWareHouse,
      errorUser,
      errorEmpty,
      errorFull,
      errorDate,
      errorOrder,
      errorNote,
      errorTime,
      disable,
      status,
    } = this.state;

    const rowSelection = {
      // onChange: (selectedRowKeys, selectedRows) => {
      //   // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      //   this.setState({
      //     selectedList: selectedRows,
      //     order: selectedRowKeys,
      //   });
      // },
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: disable,
      }),
    };

    const columns = [
      {
        title: "Mã đơn hàng",
        dataIndex: "orderCode",
        key: "orderCode",
        width: 200,
        render: (text) => <span> {text}</span>,
      },
      {
        title: "Tên khách hàng",
        dataIndex: "nameCustomerGas",
        key: "nameCustomerGas",
        width: 200,
        render: (text) => <span> {text}</span>,
      },
      {
        title: "Kho xuất",
        dataIndex: "warehouseId",
        key: "warehouseId",
        width: 200,
        render: (text, record) => (
          <span>
            {" "}
            {record.warehouseId.name
              ? record.warehouseId.name
              : record.wareHouseId.name}
          </span>
        ),
      },
      {
        title: "Nơi nhận",
        dataIndex: "branchname",
        key: "branchname",
        width: 200,
        render: (text, record) => (
          <span> {record.customergasId.branchname}</span>
        ),
      },
      {
        title: "Ngày giao",
        dataIndex: "fromdeliveryDate",
        key: "fromdeliveryDate",
        width: 300,
        render: (text, record) => (
          <span>
            {" "}
            {record.fromdeliveryDate + " - " + record.todeliveryDate}
          </span>
        ),
      },
      {
        title: "Giờ giao",
        dataIndex: "deliveryHours",
        key: "deliveryHours",
        width: 200,
        render: (text) => <span> {text}</span>,
      },
      {
        title: "Khối lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 200,
        render: (text) => <span> {text + " tấn"}</span>,
      },
      {
        title: "Loại hàng",
        dataIndex: "typeproduct",
        key: "typeproduct",
        width: 150,
        render: (text) => {
          return text === "HV" ? (
            <span>Vay</span>
          ) : text === "HB" ? (
            <span>Bán</span>
          ) : text === "HT" ? (
            <span>Trả</span>
          ) : (
            <span>Thuê</span>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 100,
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
      {
        title: "Thao tác",
        dataIndex: "id",
        key: "id",
        // fixed: "right",
        width: 100,
        render: (idd) => {
          return (
            <div className="text-center statuss">
              <a
                className="text-danger"
                onClick={() => this.onClickDeleteOrder(idd)}
                disabled={disable}
              >
                <Icon type="delete" />
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <div
        className="modal fade"
        id="detail-import-order"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header table__head rounded-0">
              <h4 className="modal-title text-white">Chỉnh sửa lệnh nhập</h4>
              <button type="reset" className="close" data-dismiss="modal">
                <span aria-hidden="true" className="text-white">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <Spin tip="Đang tải..." spinning={this.state.loading}>
                <Form
                  className="form-border"
                  onSubmit={(event) => this.onUpdateImportOrder(event, false)}
                >
                  <div className="row d-flex justify-content-between mt-3">
                    <div className="col-md-12">
                      <h5>Thông tin chung</h5>
                    </div>
                    <div className="col-md-6 mt-4">
                      <Checkbox
                        onChange={this.onChangeCheckBox}
                        disabled={disable}
                      >
                        Xe ngoài
                      </Checkbox>
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Mã nhập:</label>
                      <Input type="text" value={code} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label>Tài xế:</label>
                      {checkbox === true && (
                        <Input
                          type="text"
                          name="nameDriver"
                          onChange={this.onChangeInputText}
                          value={nameDriver}
                          readOnly={disable}
                        />
                      )}
                      {checkbox === false && (
                        <Select
                          placeholder={nameDriver}
                          onChange={this.onChangDriverValue}
                          id="Driverr"
                          style={{ width: "100%" }}
                          disabled={disable}
                        // ref={selectRef}
                        >
                          <Option value="0" disabled>
                            {nameDriver}
                          </Option>
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
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorDriver}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Số xe:</label>
                      <br />
                      {checkbox === true && (
                        <Input
                          type="text"
                          name="license_plate"
                          onChange={this.onChangeInputText}
                          value={license_plate}
                          readOnly={disable}
                        />
                      )}
                      {checkbox === false && (
                        <Input
                          type="text"
                          name="license_plate"
                          onChange={this.onChangeInputText}
                          value={license_plate}
                          readOnly={disable}
                        />
                      )}
                      {errorLicense !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorLicense}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6 mt-3 mb-3">
                      <p>Trọng lượng rỗng</p>
                      <Input
                        type="number"
                        name="weight_empty"
                        onChange={this.onChangeInputText}
                        value={weight_empty}
                        readOnly={disable}
                        min={0}
                      />
                      {errorEmpty !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorEmpty}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6 mt-3 mb-3">
                      <p>Trọng lượng sau khi bơm:</p>
                      <Input
                        type="number"
                        name="weight_after_pump"
                        onChange={this.onChangeInputText}
                        value={weight_after_pump}
                        readOnly={disable}
                        min={0}
                      />
                      {errorFull !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorFull}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <p>Thời gian giao</p>
                      <DatePicker
                        // locale={vi}
                        onChange={this.handleChangeDate}
                        value={date}
                        style={{ width: "100%" }}
                        readOnly={disable}
                      />
                      {errorDate !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorDate}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <p>Giờ giao:</p>
                      <TimePicker
                        format="HH:mm"
                        open={this.state.open}
                        onOpenChange={this.handleOpenChange}
                        onChange={this.handleChangeHour}
                        style={{ width: "100%" }}
                        value={moment(startHour, "HH:mm")}
                        disabled={disable}
                      />
                      {errorTime !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorTime}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Kho xuất:</label>
                      <br />
                      {/* <Select
                        placeholder={this.state.wareHouse}
                        style={{ width: "100%" }}
                        id="warehouse"
                        onChange={this.onChangeWareHouse}
                        disabled={disable}
                      >
                        <Option value="0" disabled>
                          {this.state.wareHouse}
                        </Option>
                        <Option value="">Chọn</Option>
                        {listWareHouse
                          ? listWareHouse.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })
                          : ""}
                      </Select>
                      {errorWareHouse !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorWareHouse}
                        </p>
                      ) : (
                          ""
                        )} */}
                      <Input
                        type="text"
                        name="wareHouseName"
                        value={this.state.wareHouseName}
                        style={{ width: "100%" }}
                        readOnly
                      // onClick={e => this.state.wareHouseId === "" ? document.getElementById("btn-search-order").click() : ""}
                      ></Input>
                    </div>
                    <div className="col-md-6">
                      <label>Nơi nhận:</label>
                      <br />
                      {/* <Select
                        placeholder={userName}
                        id="user"
                        onChange={this.onChangelistCustomer}
                        style={{ width: "100%" }}
                        disabled={disable}
                      >
                        <Option value="0" disabled>
                          {userName}
                        </Option>
                        <Option value="">Chọn</Option>
                        {listCustomer
                          ? listCustomer.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })
                          : ""}
                      </Select>
                      {errorUser !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorUser}
                        </p>
                      ) : (
                          ""
                        )} */}
                      <Input
                        type="text"
                        name="receiver"
                        value={this.state.receiver}
                        style={{ width: "100%" }}
                        readOnly
                      // onClick={e => this.state.userId === "" ? document.getElementById("btn-search-order").click() : ""}
                      ></Input>
                    </div>
                    <div
                      className="col-md-12 mt-3 text-center"
                      style={{ display: "grid" }}
                    >
                      <p>Ghi chú:</p>
                      <textarea
                        cols="70"
                        rows="5"
                        className="text-center"
                        name="note"
                        onChange={this.onChangeInputText}
                        value={note}
                        readOnly={disable}
                      ></textarea>
                      {errorNote !== "" ? (
                        <p
                          className="mt-1"
                          style={{ width: "100%", color: "red" }}
                        >
                          {errorNote}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-12 mt-4 d-flex justify-content-center">
                      <div>
                        <button
                          type="submit"
                          className="btn btn-info mr-2"
                          style={{ display: this.state.display }}
                        >
                          <i
                            className="fa fa-pencil-square-o"
                            aria-hidden="true"
                          ></i>{" "}
                          Cập nhật thông tin
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </Spin>
              <Spin tip="Đang tải..." spinning={this.state.loading}>
                <Form
                  className="form-border"
                  onSubmit={(event) => this.findOrderTank(event)}
                >
                  <div className="row d-flex justify-content-between mt-3">
                    <div className="col-md-12 mt-2">
                      <h6>Tìm kiếm theo:</h6>
                      <Radio.Group
                        onChange={this.onChangeRadio}
                        value={this.state.findOrder}
                        disabled={disable}
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
                            disabled={disable}
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
                            disabled={disable}
                          />
                        )}

                        <button
                          type="submit"
                          className="btn btn-warning border-0 rounded mr-1"
                          disabled={disable}
                        >
                          Tìm kiếm <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                    {errorOrder !== "" ? (
                      <div className="col-md-12 mt-1">
                        <p style={{ width: "100%", color: "red" }}>
                          {errorOrder}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="col-md-12 mt-1" disabled={disable}>
                      <Table
                        columns={columns}
                        dataSource={listOrderTank}
                        rowSelection={{ type: "radio", ...rowSelection }}
                        scroll={{ x: 1700 }}
                        bordered
                        loading={this.state.isLoading}
                      />
                    </div>
                    <div className="col-md-12 mt-4 d-flex justify-content-center">
                      <div>
                        <button
                          type="button"
                          className="btn btn-info mr-2"
                          onClick={(event) =>
                            this.onUpdateImportOrder(event, true)
                          }
                          style={{ display: this.state.display }}
                        >
                          <i
                            className="fa fa-pencil-square-o"
                            aria-hidden="true"
                          ></i>{" "}
                          Cập nhật đơn hàng
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
                <div className="col-md-12 mt-4 d-flex justify-content-center">
                  <div>
                    <button type="button" className="btn btn-light mr-2">
                      <i className="fa fa-print"></i> In phiếu
                    </button>
                    {status === 1 ? (
                      <button
                        type="button"
                        className="btn mr-2 edit-import-manager"
                        onClick={() => this.onConfirmationStatus()}
                      >
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>{" "}
                        Xác nhận
                      </button>
                    ) : status === 2 ? (
                      <button
                        type="button"
                        className="btn btn-light text-danger mr-2"
                        onClick={() => this.onBackStatus()}
                      >
                        <i className="fa fa-undo" aria-hidden="true"></i> Bỏ xác
                        nhận
                      </button>) : ("")
                    }
                    <button
                      type="reset"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={() => this.onReset()}
                    >
                      <i className="fa fa-window-close" aria-hidden="true"></i>{" "}
                      Đóng
                    </button>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
