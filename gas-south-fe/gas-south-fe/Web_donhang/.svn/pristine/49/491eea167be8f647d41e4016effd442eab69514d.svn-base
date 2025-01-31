import React, { Component, Fragment } from "react";
import Axios from "axios";
import { DatePicker, TimePicker, Tooltip, Tag, Input, Modal, message, notification, Table } from "antd";
import moment from "moment";
import getUserCookies from "getUserCookies";
import showToast from "showToast";
import getAllCustomer from "../../../../api/getAllCustomer";
import getWareHouseById from "../../../../api/getWareHouseByIdAPI";
import getAllWareHouse from "../../../../api/getAllWareHouseAPI";
import getAllCustomerReceive from "../../../../api/getAllCustomerReceive";
import updateOrderTankTruck from "../../../../api/updateOrderTankTruckAPI";
import orderApprovalAPI from "../../../../api/approvalOderAPI";
import orderCancelAPI from "../../../../api/cancelOrderAPI";
import getHistoryNoteByOrderTankIdAPI from "../../../../api/getHistoryNoteByOrderTankIdAPI";
import getHistoryNoteByOrderTankIdIdAPI from "../../../../api/getHistoryNoteByOrderTankIdAPI";
import { Redirect, Link } from 'react-router';
import getCustomerByCode from "../../../../api/getCustomerByCodeAPI";
import getAllExportOrderByOrderTankIdAPI from "../../../../api/getAllExportOrderByOrderTankIdAPI";
import callApi from "./../../../util/apiCaller";
import {  GETEXPORTORDERID } from "./../../../config/config";

class OrderTankTruck_item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameWareHouse: "",
      namePlaceReceive: "",
      customerGas: {},
      wareHouseArr: [],
      placeReceiveArr: [],
      fileName: [],

      orderCode: "", //Mã đơn hàng
      orderTankId: "", //id đơn hàng
      customergasId: "", //id khách hàng
      customergasCode: "", // Mã code khách hàng
      customergasName: "", //Tên khách hàng
      userId: "", //Id kho nhận
      warehouseId: "", //Id kho giao
      quantity: "", //Khối lượng
      divernumber: "", //Biển số xe
      typeproduct: "", //Loại hàng
      fromdeliveryDate: "", //Từ ngày
      todeliveryDate: "", //Đến ngày
      deliveryHours: "", //giờ giao
      status: "", //Trạng thái đơn hàng
      reminderschedule: "", //Lịch nhắc
      note: "", // Ghi chú

      image: [], //Mảng id hình ảnh cần chỉnh sữa
      imagechange: [], //Mảng hình ảnh chỉnh sữa
      customerData: [], //Mảng khách hàng
      searchCustomerArr: [], //Mảng khách hàng tìm kiếm
      flad: 0,
      orderrrr: "",

      userType: "",
      userRole: "",
      reason: "", // lý do hủy đơn

      listExportOrderByOrderTank: [],

      isLoading: false,
    };
  }
  setValueModalUpdate = async () => {
    this.setState({
      orderCode: this.props.order.orderCode,
      orderTankId: this.props.order.id,
      customergasId: this.props.order.customergasId.id,
      customergasCode: this.props.order.customergasId.code,
      customergasName: this.props.order.customergasId.name,
      userId: this.props.order.userId,
      warehouseId: this.props.order.warehouseId.id,
      quantity: this.props.order.quantity,
      divernumber: this.props.order.divernumber,
      typeproduct: this.props.order.typeproduct,
      fromdeliveryDate: this.props.order.fromdeliveryDate,
      todeliveryDate: this.props.order.todeliveryDate,
      deliveryHours: this.props.order.deliveryHours,
      status: this.props.order.status,
      reminderschedule: this.props.order.reminderschedule,
      note: this.props.order.note[0] ? this.props.order.note[0].note : "",
    });
    await this.getNameWareHouseById(this.props.order.warehouseId.id);
    await this.getNamePlaceReceive();
    await this.loadBase64ToFileName();
    await this.renderImg();
  };
  //thay đổi giá trị input
  onChangeHandlerInput = async (e) => {
    let { name, value } = e.target;
    if (name === "note") {
      if (value.length === 0) {
        value = " ";
      }
    }
    await this.setState(
      {
        ...this.state,
        [name]: value,
      },
      () => {
        console.log(this.state);
      }
    );
    if (name === "customergasCode") {
      this.searchCustomerByInput();
    }
  };

  //
  onChangeApprove = async (e) => {
    let { name, value } = e.target;
    await this.setState(
      {
        ...this.state,
        [name]: value,
      },
      () => {
        console.log(this.state);
      }
    );
    if (name === "customergasCode") {
      this.searchCustomerByInput();
    }
  };

  //Load tất cả khách hàng
  getAllCustomerGas = async () => {
    const data = await getAllCustomer();
    if (data.status === 200) {
      this.setState({
        customerData: data.data.GetCustomer,
      });
    } else {
      showToast(data.message);
    }
  };
  //Render Khách hàng
  renderCustomer = (customerArr) => {
    return customerArr.map((customer, index) => {
      return (
        <tr key={index}>
          <td>{customer.code}</td>
          <td>{customer.name}</td>
        </tr>
      );
    });
  };
  //load CustomerGas Real
  //Tìm customer theo input
  searchCustomerByInput = async () => {
    let searchCustomerArrUpdate = [];
    for (let customerCode of this.state.customerData) {
      let codeCustomer = String(customerCode.code);
      let codeSearch = String(this.state.customergasCode);

      if (codeCustomer.indexOf(codeSearch) !== -1) {
        searchCustomerArrUpdate.push(customerCode);
      }
    }
    console.log(searchCustomerArrUpdate[0].id);
    await this.setState({
      searchCustomerArr: searchCustomerArrUpdate,
      customergasId: searchCustomerArrUpdate[0].id,
    });
  };
  //Tìm kiếm khách hàng theo code
  searchCustomerByCode = async (code) => {
    let customerDataUpdate = [];
    const data = await getCustomerByCode(code);
    if (data.status === 200 && data.data.success === true) {
      customerDataUpdate.push(data.data.CustomerGas);
      await this.setState({
        searchCustomerArr: customerDataUpdate,
      });
      showToast("Đã tìm thấy customer");
    } else {
      showToast(data.data.message);
    }
  };
  // ----------------------------
  //Tìm tên kho hàng theo id
  getNameWareHouseById = async (warehouseId) => {
    let data = await getWareHouseById(warehouseId);
    if (data.status === 200 && data.data.status === true) {
      this.setState({
        nameWareHouse: data.data.WareHouse.name,
      });
    } else {
      this.setState({
        nameWareHouse: "Không tìm thấy thông tin kho!",
      });
    }
  };
  //Load tất cả kho hàng
  getAllWareHouse = async () => {
    const data = await getAllWareHouse();
    if (data.status === 200 && data.data.status === true) {
      this.setState({
        wareHouseArr: data.data.WareHouse,
      });
    } else {
      showToast(data.message);
    }
  };
  // Render kho giao
  renderWareHouse = () => {
    return this.state.wareHouseArr.map((wareHouse, index) => {
      return (
        <option value={wareHouse.id} key={index}>
          {wareHouse.name}
        </option>
      );
    });
  };
  // -----------------------------
  // Load tất cả nơi nhận
  getAllPlaceReceive = async () => {
    const data = await getAllCustomerReceive();
    if (data.status === 200 && data.data.success === true) {
      this.setState({
        placeReceiveArr: data.data.data,
      });
    }
    // else {
    //   showToast(data.message);
    // }
  };
  // Render nơi nhận
  renderPlaceReceive = () => {
    // console.log(this.state.placeReceiveArr);
    return this.state.placeReceiveArr.map((placeReceive, index) => {
      return (
        <option value={placeReceive.id} key={index}>
          {placeReceive.name}
        </option>
      );
    });
  };
  //Tìm nơi nhận theo id
  getNamePlaceReceive = async () => {
    let name = await this.state.placeReceiveArr.find((placeReceive) => {
      return placeReceive.id === this.props.order.userId;
    });
    if (name) {
      await this.setState({
        namePlaceReceive: name.name,
      });
    }
  };
  // -----------------------------
  // Thêm files hình ảnh
  onChangeHandler = (e) => {
    let { files } = e.target;
    let filesSelected = files;
    let dataFileName = [...this.state.fileName];
    let imageChangeUpdate = [...this.state.imagechange];
    console.log(imageChangeUpdate);
    if (filesSelected.length > 0) {
      let seft = this;
      for (let i = 0; i < filesSelected.length; i++) {
        let fileToLoad = filesSelected[i];
        // console.log(fileToLoad.name);
        let fileReader = new FileReader();
        fileReader.readAsDataURL(fileToLoad);
        fileReader.onload = function (fileLoadedEvent) {
          let srcData = fileLoadedEvent.target.result; // <--- data: base64
          dataFileName.push(srcData);
          imageChangeUpdate.push(srcData);
          // console.log(dataSrcImgUpdate);
          seft.setState({
            fileName: dataFileName,
            imagechange: imageChangeUpdate,
          });
        };
      }
    }
  };
  //Render hình ảnh
  renderImg = (checkView) => {
    let imgFolder = `data:image/jpeg;base64,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`;
    return this.state.fileName.map((img, index) => {
      return (
        <div
          className="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-4 listAnh mb-2"
          key={index}
        >
          {img === "" ? (
            ""
          ) : img.indexOf("image") !== -1 ? (
            <img
              src={img}
              height={150}
              style={{
                border: "1px solid #666",
                boxShadow: "1px 1px 3px 3px #888888",
              }}
            />
          ) : (
                <img
                  src={imgFolder}
                  height={150}
                  style={{
                    border: "1px solid #666",
                    boxShadow: "1px 1px 3px 3px #888888",
                  }}
                />
              )}
          {!checkView ? 
          (<i
            className="fa fa-trash-o"
            onClick={() => this.deleteItemImg(img)}
          ></i>) : ""}
        </div>
      );
    });
  };
  //Xoá hình ảnh
  deleteItemImg = (data) => {
    let dataSrcImgUpdate = [...this.state.fileName];
    let dataSrcImgUpdateDelete = [...this.state.imagechange];

    let indexDelete = this.state.fileName.findIndex(
      (srcImg) => srcImg === data
    );
    let indexDeleteChange = this.state.imagechange.findIndex(
      (srcImg) => srcImg === data
    );
    dataSrcImgUpdate.splice(indexDelete, 1);
    dataSrcImgUpdateDelete[indexDeleteChange] = "";
    this.setState({
      fileName: dataSrcImgUpdate,
      imagechange: dataSrcImgUpdateDelete,
    });
  };
  //Load base64 cho fileName
  loadBase64ToFileName = () => {
    let fileNameLoad = [];
    let idImageArr = [];
    for (const img of this.props.imageArr) {
      if (img.filename !== "") {
        fileNameLoad.push(img.filename);
        idImageArr.push(img.id);
      }
    }
    // console.log("id img", idImageArr);
    // console.log("file name", fileNameLoad);
    this.setState({
      fileName: fileNameLoad,
      image: idImageArr,
      imagechange: fileNameLoad,
    });
  };
  // Onchange ngày tháng : từ ngày
  onchangeDatePickerFrom = (date, dateString) => {
    let dateToFormat = date.format("L");
    this.setState({
      fromdeliveryDate: dateToFormat,
    });
  };
  //Tới ngày
  onchangeDatePickerTo = (date, dateString) => {
    let dateToFormat = date.format("L");
    this.setState({
      todeliveryDate: dateToFormat,
    });
  };
  //giờ giao
  onchangeDatePickerTimer = (date, dateString) => {
    this.setState({
      deliveryHours: dateString,
    });
  };
  // Lịch nhắc
  onchangeDatePickerReminderschedule = (date, dateString) => {
    let dateToFormat = date.format("L");
    this.setState({
      reminderschedule: dateToFormat,
    });
  };
  // ----------------------------
  //Cập nhật order tank id
  updateOrderTankById = async (index) => {
    let getUser = await getUserCookies();
    let token = getUser.token;
    console.log(token);
    let {
      orderTankId,
      orderCode,
      customergasId,
      userId,
      warehouseId,
      quantity,
      divernumber,
      typeproduct,
      fromdeliveryDate,
      todeliveryDate,
      deliveryHours,
      status,
      reminderschedule,
      note,
      image,
      imagechange,
    } = this.state;
    const data = await updateOrderTankTruck(
      orderTankId,
      orderCode,
      customergasId,
      userId,
      warehouseId,
      quantity,
      divernumber,
      typeproduct,
      fromdeliveryDate,
      todeliveryDate,
      deliveryHours,
      status,
      reminderschedule,
      note,
      image,
      imagechange
    );
    console.log(data);
    if (data.data.status === true) {
      let modal = $("#modalUpdate" + index);
      modal.modal("hide");
      this.onCheckApproval(true);
      notification["success"]({
        message: 'Cập nhật đơn hàng thành công!',
        description:
          'Vui lòng đợi...',
      });
    } else {
      showToast(
        data.data.message
          ? data.data.message
          : data.data.err_msg,
        2000
      );
    }

  };

  /* -----------------------------------------------------------Hủy/duyệt đơn hàng ------------------------------------------------- */


  // Duyệt đơn hàng
  orderApprove = async (index) => {
    let orderTankArr = [];
    let { orderTankId } = this.state;
    let status = "";
    if (
      this.state.userRole === "SuperAdmin" &&
      this.state.userType === "Accounting"
    ) {
      status = "PENDING";
    } else if (
      this.state.userRole === "SuperAdmin" &&
      this.state.userType === "Manager"
    ) {
      status = "CONFIRMED";
    }
    orderTankArr.push({ orderTankId });
    const orderApprove = await orderApprovalAPI(orderTankArr, status);
    if (orderApprove) {
      if (orderApprove.data.status === true) {
        let modal = $("#approval-order-" + index);
        modal.modal("hide");
        this.onCheckApproval(true);
        notification["success"]({
          message: 'Duyệt đơn thành công!',
          description:
            'Vui lòng đợi...',
        });
      } else {
        showToast(
          orderApprove.data.message
            ? orderApprove.data.message
            : orderApprove.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình cập nhật dữ liệu!");
    }
  };

  // Hủy đơn hàng
  orderCancel = async (e, index) => {
    e.preventDefault();
    let orderTankArr = [];
    let { orderTankId, reason } = this.state;
    let status = "CANCELLED";
    orderTankArr.push({ orderTankId });
    console.log("cancelled", orderTankArr, status, reason);
    const orderCancel = await orderCancelAPI(orderTankArr, status, reason);
    if (orderCancel) {
      console.log("orderCancel", orderCancel);
      if (orderCancel.data.status === true) {
        let modal = $("#cancel-order-" + index);
        modal.modal("hide");
        this.onCheckApproval(true);
        notification["success"]({
          message: 'Hủy đơn thành công!',
          description:
            'Đơn đã hủy xem ở cuối danh sách!',
        });
      } else {
        showToast(
          orderCancel.data.message
            ? orderCancel.data.message
            : orderCancel.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình cập nhật dữ liệu!");
    }
  };

  // re-render table
  onCheckApproval = (checked) => {
    this.props.onChecked(checked);
  };

  //xem lý do hủy
  getHistoryNoteByOrderTankId = async (orderTankId) => {
    const historyNoteByOrderTankId = await getHistoryNoteByOrderTankIdIdAPI(
      orderTankId
    );
    if (historyNoteByOrderTankId) {
      console.log("historyNoteByOrderTankId", historyNoteByOrderTankId);
      if (historyNoteByOrderTankId.data.status === true) {
        Modal.error({
          title: "Lý do hủy",
          content: (
            <span style={{ color: "black" }}>
              {historyNoteByOrderTankId.data.HistoryNote.note}
            </span>
          ),
        });
      } else {
        let error = historyNoteByOrderTankId.data.message
          ? historyNoteByOrderTankId.data.message
          : historyNoteByOrderTankId.data.err_msg;
        Modal.error({
          title: "Lỗi",
          content: <span style={{ color: "black" }}>{error}</span>,
        });
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
  };

  info(titles, messages) {
    Modal.info({
      title: titles,
      content: <span style={{ color: "black" }}>{messages}</span>,
    });
  }

  success(titles, messages) {
    Modal.success({
      title: titles,
      content: <span style={{ color: "black" }}>{messages}</span>,
    });
  }

  /* -----------------------------------------------------------Hủy/duyệt đơn hàng------------------------------------------------- */


  /* ---------------------- Lấy danh sách exportOrder theo ordertankId ---------------*/

  getAllExportOrderByOrderTankIdAPI = async () => {
    await this.setState({
      isLoading: true,
    })
    let listExportOrderByOrderTank = [];
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    const data = await getAllExportOrderByOrderTankIdAPI(this.props.order.id);
    console.log(data)
    if (data) {
      this.setState({
        isLoading: false,
      })
      if (data.data.success === true && data.data.ExportOrder) {
        for (let item of data.data.ExportOrder) {
          let params = {
            ExportOrderId: item.exportOrderId.id,
          }
          await callApi("POST", GETEXPORTORDERID, params, token).then((res) => {
            if (res) {
              if (res.data._dataExportOrder.length) {
                listExportOrderByOrderTank.push(res.data._dataExportOrder[0])
              }
            }
          });
        }
        await this.setState({
          listExportOrderByOrderTank,
        });
      } else {
        if (data.data.message === "Cannot read property 'type' of null") {
          showToast("Không có dữ liệu!")
        } else {
          showToast(data.data.message);
        }
      }
    }
  };

  /* ---------------------- Lấy danh sách exportOrder theo ordertankId ---------------*/

  componentDidUpdate(prevProps) {
    if (this.props.order !== prevProps.order) {
      this.getNameWareHouseById(this.props.order.warehouseId.id);
    }
  }

  async componentDidMount() {
    const user = await getUserCookies();
    if (user) {
      this.setState({
        userType: user.user.userType,
        userRole: user.user.userRole,
      });
    }
    await this.getNameWareHouseById(this.props.order.warehouseId.id);
    await this.getAllWareHouse();
    await this.getAllPlaceReceive();
    await this.getNamePlaceReceive();
    await this.loadBase64ToFileName();
    await this.getAllCustomerGas();
  }

  render() {
    let { order, index, imageArr, handleDelete } = this.props;
    const dateFormat = "DD/MM/YYYY";
    const timeFormat = "HH:mm";
    const columns = [
      {
        dataIndex: "type",
        key: "type",
        width: 150,
        render: (text, record) => {
          return  text === "X" ? <span>Xuất</span> :  <span>Nhập</span>
        }
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (text, record) => {
          let color;
          let tus = record.status;
          return tus === 1 ? (
            <Tag color="blue">Khởi tạo</Tag>
          ) : tus === 2 ? (
            <Tag color="orange">Đã xác nhận</Tag>
          ) : tus === 3 ? (
            <Tag color="green">Hoàn thành</Tag>
          ) : <Tag color="red">Đã hủy</Tag>
        },
      },
      {
        title: "Mã xuất",
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (text, record) =>  <span>{text}</span>
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "ordercode",
        key: "ordercode",
        width: 150,
        render: (text, record) =>  <span>{record.exportOrderDetail[0][0].orderCode}</span>
      },
      {
        title: "Mã khách hàng",
        dataIndex: "userId",
        key: "userId",
        width: 150,
        render: (text, record) =>  <span>{record.exportOrderDetail[0][0].customergasId.code}</span>
      },
      {
        title: "Tên khách hàng",
        dataIndex: "nameUser",
        key: "nameUser",
        width: 150,
        render: (text, record) =>  <span>{record.exportOrderDetail[0][0].customergasId.name}</span>
      },
      {
        title: "Kho xuất",
        dataIndex: "wareHouseId",
        key: "wareHouseId",
        width: 150,
        render: (text, record) =>  <span>{record.wareHouseId.name}</span>
      },
      {
        title: "Khối lượng (tấn)",
        dataIndex: "weight",
        key: "weight",
        width: 150,
        render: (text, record) =>  <span>{record.full - record.empty}</span>
      },
      {
        title: "Ngày giao",
        dataIndex: "deliveryDate",
        key: "deliveryDate",
        width: 150,
        render: (text, record) =>  <span>{text}</span>
      },
      {
        title: "Giờ giao",
        dataIndex: "deliveryHours",
        key: "deliveryHours",
        width: 150,
        render: (text, record) =>  <span>{text}</span>
      },
      {
        title: "Tài xế",
        dataIndex: "nameDriver",
        key: "nameDriver",
        width: 150,
        render: (text, record) =>  <span>{record.driverId.name}</span>
      },
      {
        title: "Số xe",
        dataIndex: "licensePlate",
        key: "licensePlate",
        width: 150,
        render: (text, record) =>  <span>{text}</span>
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 150,
        render: (text, record) =>  <span>{record.node}</span>
      },
    ];

    // INIT kinh doanh khởi tạo
    // PENDING kế toán đã duyệt, chờ giám đốc duyệt
    // CONFIRMED giám đốc đã duyệt
    // PROCESSING kho tạo lệnh xuất
    // DELIVERING tài xế đang giao
    // DEVILERED tài xế đã giao
    // CANCELED đơn đã bị hủy

    return (
      <Fragment>
        <td>{index + 1}</td>
        <td>{order.customergasId ? order.customergasId.code : ""}</td>
        <td>{order.customergasId ? order.customergasId.name : ""}</td>
        <td>{this.state.nameWareHouse}</td>
        <td>{order.orderCode}</td>
        <td>
          {order.fromdeliveryDate} - {order.todeliveryDate}
        </td>
        <td>
          {order.typeproduct === "HV"
            ? "Vay"
            : order.typeproduct === "HB"
              ? "Bán"
              : order.typeproduct === "HT"
                ? "Trả"
                : "Thuê"}
        </td>
        <td>{order.quantity} tấn</td>
        <td>{order.note[0] ? order.note[0].note : ""}</td>
        <td>
          {order.status === "INIT" ? (
            <Tag
              color="blue"
              onClick={() =>
                this.success(<span>Đã khởi tạo</span>, <span>Đơn hàng đã được khởi tạo!</span>)
              }
            >
              Khởi tạo
            </Tag>
          ) : order.status === "DELIVERING" ? (
            <Tag
              color="orange"
              onClick={() => this.info(<span>Đang giao</span>, <span>Đơn hàng đang được giao!</span>)}
            >
              Đang giao
            </Tag>
          ) : order.status === "PENDING" ? (
            <Tag
              color="purple"
              onClick={() => {
                this.info(<span>Đang chờ duyệt</span>, <span>Đơn hàng đang chờ giám đốc duyệt!</span>)
              }
              }
            >
              Đang chờ duyệt
            </Tag>
          ) : order.status === "DELIVERED" ? (
            <Tag
              color="cyan"
              onClick={() =>
                this.success(<span>Đã giao</span>, <span>Đơn hàng đã được giao thành công!</span>)
              }
            >
              Đã giao
            </Tag>
          ) : order.status === "CONFIRMED" ? (
            <Tag
              color="green"
              onClick={() =>
                this.success(<span>Đã duyệt</span>, <span>Đơn hàng đã được duyệt!</span>)
              }
            >
              Đã duyệt
            </Tag>
          ) : order.status === "CANCELLED" ? (
            <Tag
              color="red"
              onClick={() => this.getHistoryNoteByOrderTankId(order.id)}
            >
              Đã hủy
            </Tag>
          ) : order.status === "PROCESSING" ? (
            <Tag
              color="gold"
              onClick={() =>
                this.success(<span>Đang xử lý đơn hàng</span>, <span>Đơn hàng đang được kho xử lý!</span>)
              }
            >
              Đang xử lý
            </Tag>
          ) : ("")}
        </td>
        <td>
          <Tooltip placement="top" title="Xem chi tiết">
            <i
              className="fa fa-eye"
              data-toggle="modal"
              data-target={"#view-order-" + index}
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={this.setValueModalUpdate}
            ></i>
          </Tooltip>
          {(this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Accounting") ||
            (this.state.userRole === "SuperAdmin" &&
              this.state.userType === "Manager") ? (
              <React.Fragment>
                {order.status === "CANCELLED" || // đơn đã hủy
                  order.status === "PROCESSING" || 
                  order.status === "DELIVERING" || // đơn đang giao
                  order.status === "DELIVERED" || // đơn đã giao
                  order.status === "CONFIRMED" || // giám đốc đã duyệt
                  (this.state.userRole === "SuperAdmin" &&
                    this.state.userType === "Accounting" &&
                    order.status === "PENDING") || // kế toán đã duyệt
                  (this.state.userRole === "SuperAdmin" &&
                    this.state.userType === "Manager" &&
                    order.status === "INIT") ? ( // kế toán chưa duyệt
                    ""
                  ) : (
                    <Tooltip placement="top" title="Duyệt">
                      <i
                        className="fa fa-check-circle"
                        data-toggle="modal"
                        data-target={"#approval-order-" + index}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={this.setValueModalUpdate}
                      ></i>
                    </Tooltip>
                  )}
                {order.status === "CANCELLED" || // đơn đã hủy
                  order.status === "PROCESSING" || 
                  order.status === "DELIVERING" || // đơn đang giao
                  order.status === "DELIVERED" || // đơn đã giao
                  order.status === "CONFIRMED" || // giám đốc đã duyệt
                  (this.state.userRole === "SuperAdmin" &&
                    this.state.userType === "Manager" &&
                    order.status === "INIT") || // kế toán chưa duyệt
                  (this.state.userRole === "SuperAdmin" &&
                    this.state.userType === "Accounting" &&
                    order.status === "PENDING") ? ( // kế toán đã duyệt
                    ""
                  ) : (
                    <Tooltip placement="top" title="Hủy">
                      <i
                        className="fa fa-ban"
                        data-toggle="modal"
                        data-target={"#cancel-order-" + index}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={this.setValueModalUpdate}
                      ></i>
                    </Tooltip>
                  )}
              </React.Fragment>
            ) : (
              ""
            )}

          {order.status === "DELIVERING" ||
           order.status === "PROCESSING" || 
            order.status === "PENDING" ||
            order.status === "DELIVERED" ||
            order.status === "CONFIRMED" ||
            order.status === "CANCELLED" ? "" : (
              <Tooltip placement="top" title="Chỉnh sửa">
                <i
                  className="fa fa-pencil"
                  data-toggle="modal"
                  data-target={"#modalUpdate" + index}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={this.setValueModalUpdate}
                ></i>
              </Tooltip>
            )}

          {order.status === "DELIVERING" ||
            order.status === "PROCESSING" || 
            order.status === "PENDING" ||
            order.status === "DELIVERED" ||
            order.status === "CONFIRMED" ||
            order.status === "CANCELLED" ? "" : (
              <Tooltip placement="top" title="Xóa">
                <i
                  className="fa fa-trash"
                  data-toggle="modal"
                  data-target={"#" + index}
                  style={{ cursor: "pointer" }}
                ></i>
              </Tooltip>
            )}
          {order.status === "PROCESSING" || 
            order.status === "DELIVERING" || // đơn đang giao
            order.status === "DELIVERED" || // đơn đã giao
            order.status === "CONFIRMED"
            ? (
              <Tooltip placement="top" title="Lịch sử xuất/nhập hàng">
                <i
                  className="fa fa-history"
                  data-toggle="modal"
                  data-target={"#history-export-" + index}
                  style={{ cursor: "pointer" }}
                  onClick={this.getAllExportOrderByOrderTankIdAPI}
                ></i>
              </Tooltip>) : ""}

        </td>

        {/* Modal duyệt đơn hàng */}
        <div
          className="modal fade"
          id={"approval-order-" + index}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Duyệt đơn hàng</h5>
              </div>
              <div className="modal-body">
                {'Duyệt đơn hàng "'}
                <span style={{ color: "Red" }}>{order.orderCode}</span>
                {'" ?'}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  // data-dismiss="modal"
                  onClick={() => this.orderApprove(index)}
                >
                  Duyệt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* //Modal hủy đơn hàng */}
        <div
          className="modal fade"
          id={"cancel-order-" + index}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hủy đơn hàng</h5>
              </div>
              <form onSubmit={(e) => this.orderCancel(e, index)}>
                <div className="modal-body">
                  <div>
                    <span style={{ fontSize: "larger", fontWeight: "bold" }}>
                      {'Bạn muốn hủy đơn hàng "'}
                      <span style={{ color: "Red" }}>{order.orderCode}</span>
                      {'" ?'}
                    </span>
                  </div>
                  <div className="mt-5" style={{ marginTop: "2rem" }}>
                    <label style={{ color: "#5a5858", fontSize: "inherit" }}>
                      Lý do hủy<label style={{ color: "red" }}>*</label> :
                    </label>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <textarea
                            id="reason"
                            name="reason"
                            className="form-control"
                            rows="3"
                            onChange={this.onChangeHandlerInput}
                            value={this.state.reason ? this.state.reason : ""}
                            style={{ marginBottom: "30px" }}
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => this.setState({ reason: "" })}
                  >
                    Từ chối
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"

                  // data-dismiss="modal"
                  // onClick={() => this.orderCancel(index)}
                  >
                    Xác nhận
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* //Modal xoá */}
        <div
          className="modal fade"
          id={index}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xoá đơn hàng</h5>
              </div>
              <div className="modal-body">
                Bạn có muốn xoá đơn hàng của khách hàng:
                <span style={{ color: "Red" }}>
                  {" "}
                  {order.customergasId ? order.customergasId.name : ""} ?
                </span>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={() => handleDelete(order.id)}
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal update */}
        <div
          className="modal fade"
          id={"modalUpdate" + index}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xxl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cập nhật đơn hàng</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  {/* Mã code khách hàng */}
                  <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Mã khách hàng:</label>
                      <div className="row">
                        <div className="col-10 pr-1">
                          <input
                            type="text"
                            name="customergasCode"
                            id="customergasCode"
                            className="form-control"
                            value={this.state.customergasCode}
                            style={{
                              width: "100%",
                              display: "inline-block",
                              // //borderColor: "#928b8b",
                            }}
                            onChange={this.onChangeHandlerInput}
                            required
                          />
                        </div>
                        <div className="col-2 pl-0">
                          <button
                            type="button"
                            className="btn m-0"
                            style={{
                              width: "100%",
                              fontWeight: "bold",
                              marginTop: "-2px",
                              padding: "2px",
                              height: "33px",
                              //borderColor: "#928b8b",
                            }}
                            data-toggle="modal"
                            data-target="#modelId"
                            data-dismiss="modal"
                          >
                            ...
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tên khách hàng */}
                  <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>
                        Tên khách hàng:
                      </label>
                      <input
                        type="text"
                        name="tenKH"
                        id="tenKH"
                        className="form-control"
                        value={
                          this.state.searchCustomerArr.length === 1
                            ? this.state.searchCustomerArr[0].name
                            : order.customergasId
                              ? order.customergasId.name
                              : ""
                        }
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  {/* Nơi nhận */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Nơi nhận:</label>
                      {/* <select
                        name="userId"
                        className="form-control"
                        id="userId"
                        style={{ height: "33px" }}
                        onChange={this.onChangeHandlerInput}
                      >
                        <option value={this.state.namePlaceReceive}>
                          {this.state.namePlaceReceive}
                        </option>
                        {this.renderPlaceReceive()}
                      </select> */}
                      <input
                        type="text"
                        name="customerAdress"
                        id="customerAdress"
                        className="form-control"
                        value={this.state.searchCustomerArr.length === 1
                          ? this.state.searchCustomerArr[0].address
                          : order.customergasId
                            ? order.customergasId.address
                            : ""}
                        placeholder="Chọn mã khách hàng"
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  {/* Kho giao */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Kho giao:</label>
                      <select
                        name="warehouseId"
                        className="form-control"
                        id="warehouseId"
                        style={{
                          // borderColor: "#928b8b",
                          height: "33px",
                        }}
                        onChange={this.onChangeHandlerInput}
                      >
                        <option value={this.state.nameWareHouse} selected>
                          {this.state.nameWareHouse}
                        </option>
                        {this.renderWareHouse()}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  {/* Mã đơn hàng */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Mã đơn hàng:</label>
                      <input
                        type="text"
                        name="orderCode"
                        id="orderCode"
                        className="form-control"
                        value={this.state.orderCode}
                        style={{
                          display: "inline-block",
                          // borderColor: "#928b8b",
                        }}
                        readOnly
                        onChange={this.onChangeHandlerInput}
                      />
                    </div>
                  </div>
                  {/* Khối lượng */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Khối lượng:</label>
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        className="form-control"
                        value={this.state.quantity}
                        required
                        onChange={this.onChangeHandlerInput}
                      />
                    </div>
                  </div>
                  {/* Biển số xe */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Biển số xe:</label>
                      <input
                        type="text"
                        name="divernumber"
                        id="divernumber"
                        className="form-control"
                        value={this.state.divernumber}
                        style={
                          {
                            // borderColor: "#928b8b",
                          }
                        }
                        required
                        onChange={this.onChangeHandlerInput}
                      />
                    </div>
                  </div>
                  {/* Loại hàng */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Loại hàng:</label>
                      <select
                        className="form-control"
                        name="typeproduct"
                        id="typeproduct"
                        style={{
                          // borderColor: "#928b8b",
                          height: "33px",
                        }}
                        onChange={this.onChangeHandlerInput}
                      >
                        <option>
                          {order.typeproduct === "HB"
                            ? "Bán"
                            : order.typeproduct === "HV"
                              ? "Vay"
                              : order.typeproduct === "HT"
                                ? "Trả"
                                : "Thuê"}
                        </option>
                        <option value="HB">Bán</option>
                        <option value="HV">Vay</option>
                        <option value="HT">Trả</option>
                        <option value="HTK">Thuê</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Ngày giao */}
                  <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                    <label style={{ color: "#5a5858" }}>Ngày giao:</label>
                    <div className="row inputNgayGiao">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <div
                          className="form-group"
                          style={{ display: "inline" }}
                        >
                          <DatePicker
                            onChange={this.onchangeDatePickerFrom}
                            defaultValue={moment(
                              order.fromdeliveryDate,
                              dateFormat
                            )}
                            format={dateFormat}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <div className="form-group">
                          <DatePicker
                            onChange={this.onchangeDatePickerTo}
                            defaultValue={moment(
                              order.todeliveryDate,
                              dateFormat
                            )}
                            format={dateFormat}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Giờ giao */}
                  <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Giờ giao:</label>
                      <div className="row pr-1">
                        <div className="col-12 pr-0">
                          <TimePicker
                            format={timeFormat}
                            defaultValue={moment(
                              order.deliveryHours,
                              timeFormat
                            )}
                            style={{ width: "100%" }}
                            onChange={this.onchangeDatePickerTimer}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Đặt lịch nhắc */}
                  <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Đặt lịch nhắc:</label>
                      <div className="row pr-1">
                        <div className="col-12 pr-0">
                          <DatePicker
                            onChange={this.onchangeDatePickerReminderschedule}
                            defaultValue={moment(
                              order.reminderschedule,
                              dateFormat
                            )}
                            format={dateFormat}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Thêm ảnh */}
                  <Fragment>
                    <div className="col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12">
                      <label style={{ color: "#5a5858" }}>Thêm file ảnh:</label>
                      <div className="custom-file boxThemAnh">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile04"
                          onChange={this.onChangeHandler}
                          multiple
                          style={{ border: "1px solid #000" }}
                        />
                        <br></br>
                        <label
                          className="custom-file-label"
                          htmlFor="inputGroupFile04"
                        >
                          Chọn hoặc kéo thả vào đây
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12 p-3">
                      <div className="boxAnh p-2">
                        <h3>Ảnh</h3>
                        <div className="row">{this.renderImg(false)}</div>
                        {/* {this.renderImg()} */}
                      </div>
                    </div>
                  </Fragment>
                </div>
                {/* Ghi chú */}
                <div className=" mt-5">
                  <label style={{ color: "#5a5858" }}>Ghi chú:</label>
                  <div className="row">
                    <div className="col-12 px-5">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="note"
                          rows="6"
                          onChange={this.onChangeHandlerInput}
                          value={this.state.note}
                          maxLength="256"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ alignSelf: "center" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={(e) => this.updateOrderTankById(index)}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Khách hàng */}
        <div
          className="modal fade"
          id="modelId"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mã code khách hàng</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <input
                        type="text"
                        name="customergasCode"
                        id="customergasCode"
                        className="form-control"
                        value={String(this.state.customergasCode)}
                        placeholder="Mời nhập mã khách hàng"
                        required
                        onChange={this.onChangeHandlerInput}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <input
                        type="text"
                        name="tenKH"
                        id="tenKH"
                        className="form-control"
                        placeholder={
                          this.state.searchCustomerArr.length === 1
                            ? this.state.searchCustomerArr[0].name
                            : order.customergasId
                              ? order.customergasId.name
                              : ""
                        }
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <button
                      className="btn btn-success w-100"
                      onClick={() =>
                        this.searchCustomerByCode(this.state.customergasCode)
                      }
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="font-weight-bold">Mã khách hàng</th>
                          <th className="font-weight-bold">Tên khách hàng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.searchCustomerArr.length < 1 &&
                          this.state.customergasCode === ""
                          ? this.renderCustomer(this.state.customerData)
                          : this.state.searchCustomerArr.length < 1 &&
                            this.state.customergasCode !== "" &&
                            this.state.customergasCode ===
                            order.customergasId.code
                            ? this.renderCustomer([order.customergasId])
                            : this.state.searchCustomerArr.length < 1 &&
                              this.state.customergasCode !== ""
                              ? "Không có customer cần tìm..."
                              : this.renderCustomer(this.state.searchCustomerArr)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  data-toggle="modal"
                  data-target={"#modalUpdate" + index}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal xem chi tiết */}
        <div
          className="modal fade"
          id={"view-order-" + index}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xxl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xem chi tiết đơn hàng</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  {/* Mã code khách hàng */}
                  <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Mã khách hàng:</label>
                      <div className="row">
                        <div className="col-12 pr-1">
                          <input
                            type="text"
                            name="customergasCode"
                            id="customergasCode"
                            className="form-control"
                            value={this.state.customergasCode}
                            style={{
                              width: "100%",
                              display: "inline-block",
                              textAlign: "center"
                              // //borderColor: "#928b8b",
                            }}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tên khách hàng */}
                  <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>
                        Tên khách hàng:
                      </label>
                      <input
                        type="text"
                        name="tenKH"
                        id="tenKH"
                        className="form-control"
                        value={order.customergasId ? order.customergasId.name : ""}
                        readOnly
                        style={{ textAlign: "center" }}
                      />
                    </div>
                  </div>
                  {/* Nơi nhận */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Nơi nhận:</label>
                      <input
                        type="text"
                        name="customerAdress"
                        id="customerAdress"
                        className="form-control"
                        value={order.customergasId
                          ? order.customergasId.address
                          : ""}
                        readOnly
                        style={{ textAlign: "center" }}
                      />
                    </div>
                  </div>
                  {/* Kho giao */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Kho giao:</label>
                      <select
                        name="warehouseId"
                        className="form-control"
                        id="warehouseId"
                        style={{
                          // borderColor: "#928b8b",
                          height: "33px",
                          textAlign: "center"
                        }}
                      >
                        <option value={this.state.nameWareHouse} selected>
                          {this.state.nameWareHouse}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  {/* Mã đơn hàng */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Mã đơn hàng:</label>
                      <input
                        type="text"
                        name="orderCode"
                        id="orderCode"
                        className="form-control"
                        value={this.state.orderCode}
                        style={{
                          display: "inline-block",
                          // borderColor: "#928b8b",
                          center: "center"
                        }}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* Khối lượng */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Khối lượng:</label>
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        className="form-control"
                        value={this.state.quantity}
                        readOnly
                        style={{ textAlign: "center" }}
                      />
                    </div>
                  </div>
                  {/* Biển số xe */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Biển số xe:</label>
                      <input
                        type="text"
                        name="divernumber"
                        id="divernumber"
                        className="form-control"
                        value={this.state.divernumber}
                        style={{ textAlign: "center" }}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* Loại hàng */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Loại hàng:</label>
                      <select
                        className="form-control"
                        name="typeproduct"
                        id="typeproduct"
                        style={{
                          // borderColor: "#928b8b",
                          height: "33px",
                          textAlign: "center"
                        }}
                      >
                        <option>
                          {order.typeproduct === "HB"
                            ? "Bán"
                            : order.typeproduct === "HV"
                              ? "Vay"
                              : order.typeproduct === "HT"
                                ? "Trả"
                                : "Thuê"}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Ngày giao */}
                  <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                    <label style={{ color: "#5a5858" }}>Ngày giao:</label>
                    <div className="row inputNgayGiao">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <div
                          className="form-group"
                          style={{ display: "inline", textAlignLast: "center" }}
                        >
                          <Input
                            value={order.fromdeliveryDate}
                            readOnly
                          >
                          </Input>

                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <div className="form-group">
                          <Input
                            value={order.todeliveryDate}
                            readOnly
                            style={{ textAlign: "center" }}
                          >
                          </Input>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Giờ giao */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Giờ giao:</label>
                      <div className="row pr-1">
                        <div className="col-12 pr-0">
                          <Input
                            value={order.deliveryHours}
                            readOnly
                            style={{ textAlign: "center" }}>
                          </Input>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Đặt lịch nhắc */}
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6">
                    <div className="form-group">
                      <label style={{ color: "#5a5858" }}>Đặt lịch nhắc:</label>
                      <div className="row pr-3">
                        <div className="col-12 pr-0">
                          <Input
                          value={order.reminderschedule}
                          readOnly
                          style={{ textAlignLast: "center" }}
                          ></Input>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Thêm ảnh */}
                  <Fragment>
                    <div className="col-xl-12 p-3">
                      <div className="boxAnh p-2">
                        <h3>Ảnh</h3>
                        <div className="row">{this.renderImg(true)}</div>
                        {/* {this.renderImg()} */}
                      </div>
                    </div>
                  </Fragment>
                </div>
                {/* Ghi chú */}
                <div className=" mt-5">
                  <label style={{ color: "#5a5858" }}>Ghi chú:</label>
                  <div className="row">
                    <div className="col-12 px-5">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="note"
                          value={this.state.note}
                          maxLength="256"
                          readOnly
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ alignSelf: "center" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal xem lịch sử xuất/nhập hàng */}
        <div
          className="modal fade"
          id={"history-export-" + index}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modelTitleId"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xxl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Lịch sử xuất/nhập hàng</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body" id="history-export">
                <Table
                rowKey={record => record.id}
                columns={columns}
                bordered={true}
                dataSource={this.state.listExportOrderByOrderTank}
                loading={this.state.isLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 2000 }}
                />
              </div>
              <div className="modal-footer" style={{ alignSelf: "center" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default OrderTankTruck_item;
