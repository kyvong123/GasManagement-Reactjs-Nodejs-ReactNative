import React, { Component } from "react";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import moment from "moment";
import { Link } from "react-router";
import {
  GETALLEXPORTORDER,
  DELETEEXPORTORDER,
  GETEXPORTORDERID,
  GETDRIVE,
  GETALL_WAREHOUSE,
  GETALLCUSTOMERRECEIVE,
} from "./../../../config/config";
import {
  Row,
  Form,
  Input,
  Popconfirm,
  DatePicker,
  Icon,
  Table,
  message,
  Tag,
} from "antd";
import "./import-order-manage.scss";
import openNotificationWithIcon from "../../../helpers/notification";
import PopupDetailImportOrder from "./popupDetailImportOrder";
import PopupInfoImportOrder from "./popupInfoImportOrder";

class ImportOrderManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportOrder: [],
      isLoading: false,
      ExportOrderDetail: [],
      orderId: [],
      ExportOrderId: "",
      wareHouseName: "",
      userName: "",
      idDriver: "",
      idUser: "",
      nameDriverr: "",
      idWareHouse: "",
      orderIdd: "",
      nameCustomerGas: "",
      status: null,

      listDriver: [],
      listWareHouse: [],
      listCustomer: [],
    };
  }
  refresh() {
    this.forceUpdate(async () => {
      let user_cookies = await getUserCookies();
      let token = "Bearer " + user_cookies.token;
      await this.getAllExportOrder(token);
    });
  }
  refresh1() {
    this.forceUpdate(async (value) => {
      await this.onClickEditCylinder(value);
    });
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;

    this.getAllExportOrder(token);
    this.getAllDriver(id, token);
    this.getAllWareHouse(token);
    this.getAllCustomer(token);
  }
  async getAllExportOrder(token) {
    this.setState({ isLoading: true });
    let data = [];
    await callApi("GET", GETALLEXPORTORDER, token).then((res) => {
      console.log("ExportOrderId", res);
      res.data._dataExportOrder.map((v, i) => {
        if (v.type === "N") {
          return data.push({
            key: i + 1,
            status: v.status,
            code: v.code,
            id: v.exportId,
            ordercode: v.ordercode,
            userId: v.customerCode,
            nameUser: v.customerName,
            wareHouseId: v.wareHouseName,
            weight: v.full - v.empty,
            deliveryDate: v.deliveryDate,
            deliveryHours: v.deliveryHours,
            note: v.node,
            type: v.type,
            nameDriver: !v.driverId ? v.nameDriver : v.driverId,
            licensePlate: v.licensePlate === "" ? "" : v.licensePlate,
          });
        }
      });
      this.setState({
        exportOrder: data,
        isLoading: false,
      });
    });
  }
  async onClickDelCylinder(id) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = {
      ExportOrderId: id,
    };
    await callApi("POST", DELETEEXPORTORDER, params, token).then((res) => {
      if (res.data.success === true) {
        openNotificationWithIcon("success", "Xóa thành công");
        this.refresh();
      } else {
        openNotificationWithIcon("error", "Có lỗi xảy ra vui lòng thử lại");
        return false;
      }
    });
  }
  onClickEditCylinder = async (value) => {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = {
      ExportOrderId: value,
    };
    $(".ant-select-selection__placeholder").css("display", "block");
    $(".ant-select-selection-selected-value").css("display", "none");
    await callApi("POST", GETEXPORTORDERID, params, token).then((res) => {
      if (res) {
        if (res.status === 200) {
          console.log("GETEXPORTORDERID",res.data._dataExportOrder)
          let data = [];
          let data1 = [];
          let data2 = [];
          let data3 = [];
          res.data._dataExportOrder.map((v) => {
            // console.clear();
            // v.exportOrderDetail.map((i, s) => {
            //   i.map((g) => {
            //     g.map((f) => {
            //       data.push({
            //         ...f,
            //         key: s,
            //         nameCustomerGas: f.customergasId.name,
            //       });
            //     });
            //   });
            // });
            let orderDetail = v.exportOrderDetail[0][0]
            data.push({
              ...orderDetail,
              wareHouseId: v.wareHouseId,
              key: orderDetail.id,
              nameCustomerGas: orderDetail.customergasId.name
            })
            data1.push(v.wareHouseId);
            data2.push(v.userId);
            data3.push(v.driverId);
            this.setState({
              ExportOrderDetail: v,
              ExportOrderId: value,
              orderId: data,
              status: v.status,
              playerId: !v.driverId ? "" : v.driverId.playerID,
            });
          });
          data1.map((v) => {
            return this.setState({
              wareHouseName: v.name,
              idWareHouse: v.id,
            });
          });
          data2.map((v) => {
            return this.setState({
              userName: v.name,
              idUser: v.id,
            });
          });
          data3.map((v) => {
            return this.setState({
              idDriver: v.id,
              nameDriverr: v.name,
            });
          });
        } else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg
          );
        }
      }
    });
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
  
  render() {
    const { exportOrder } = this.state;
    const columns = [
      {
        title: "STT",
        dataIndex: "key",
        key: "key",
        width: 60,
        // fixed: "left",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 80,
        // fixed: "left",
        render: (text) => {
          return text === 1 ? (
            <Tag color="blue">Khởi tạo</Tag>
          ) : text === 2 ? (
            <Tag color="orange">Đã xác nhận</Tag>
          ) : text === 3 ? (
            <Tag color="green">Hoàn thành</Tag>
          ) : <Tag color="red">Đã hủy</Tag>
        },
      },
      {
        title: "Mã nhập",
        dataIndex: "code",
        key: "code",
        width: 150,
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "ordercode",
        key: "ordercode",
        width: 150,
      },
      {
        title: "Mã khách hàng",
        dataIndex: "userId",
        key: "userId",
        width: 150,
      },
      {
        title: "Tên khách hàng",
        dataIndex: "nameUser",
        key: "nameUser",
        width: 150,
      },
      {
        title: "Kho xuất",
        dataIndex: "wareHouseId",
        key: "wareHouseId",
        width: 150,
      },
      {
        title: "Khối lượng (tấn)",
        dataIndex: "weight",
        key: "weight",
        width: 150,
        render: (weight) => {
          return weight + " tấn";
        },
      },
      {
        title: "Ngày giao",
        dataIndex: "deliveryDate",
        key: "deliveryDate",
        width: 150,
      },
      {
        title: "Giờ giao",
        dataIndex: "deliveryHours",
        key: "deliveryHours",
        width: 150,
      },
      {
        title: "Tài xế",
        dataIndex: "nameDriver",
        key: "nameDriver",
        width: 150,
      },
      {
        title: "Số xe",
        dataIndex: "licensePlate",
        key: "licensePlate",
        width: 150,
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 150,
      },
      {
        title: "Thao tác",
        dataIndex: "id",
        key: "id",
        // fixed: "right",
        width: 150,
        render: (idd) => {
          return (
            <div className="text-center statuss">
              <a
                className="text-info"
                data-toggle="modal"
                data-target="#info-import-order"
                onClick={() => this.onClickEditCylinder(idd)}
              >
                <Icon type="eye" />
              </a>
              <a
                className="text-success"
                data-toggle="modal"
                data-target="#detail-import-order"
                onClick={() => this.onClickEditCylinder(idd)}
              >
                <Icon type="edit" />
              </a>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                icon={
                  <Icon type="question-circle-o" style={{ color: "red" }} />
                }
                onConfirm={() => this.onClickDelCylinder(idd)}
                okText="Có"
                cancelText="Không"
              >
                <a className="text-danger">
                  <Icon type="delete" />
                </a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return (
      <div className="main-content" id="ExportOrderManagement">
        <div className="card">
          <div className="card-title d-flex justify-content-between">
            <h4>Quản lý lệnh nhập</h4>
            <div>
              <button className="btn btn-success mr-2">In lệnh nhập</button>
              <Link to="/create-import-order-management" className="p-0">
                <button className="btn btn-warning" type="button">
                  Tạo mới lệnh nhập
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ padding: "inherit" }}>
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-md-12">
                    <Table
                      className="text-center"
                      columns={columns}
                      dataSource={exportOrder}
                      loading={this.state.isLoading}
                      scroll={{ x: 2000 }}
                      bordered
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PopupDetailImportOrder
          ExportOrderDetail={this.state.ExportOrderDetail}
          ExportOrderId={this.state.ExportOrderId}
          order={this.state.orderId}
          wareHouseName={this.state.wareHouseName}
          userName={this.state.userName}
          idDriver={this.state.idDriver}
          idUser={this.state.idUser}
          nameDriverr={this.state.nameDriverr}
          idWareHouse={this.state.idWareHouse}
          orderIdd={this.state.orderIdd}
          status={this.state.status}
          refresh={this.refresh.bind(this)}
          refresh1={this.refresh1.bind(this)}
          onClickEditCylinder={this.onClickEditCylinder}
          playerId={this.state.playerId}
          listDriver={this.state.listDriver}
          listWareHouse={this.state.listWareHouse}
          listCustomer={this.state.listCustomer}
        />
        <PopupInfoImportOrder
          ExportOrderDetail={this.state.ExportOrderDetail}
          ExportOrderId={this.state.ExportOrderId}
          orderId={this.state.orderId}
          wareHouseName={this.state.wareHouseName}
          userName={this.state.userName}
          idDriver={this.state.idDriver}
          idUser={this.state.idUser}
          nameDriverr={this.state.nameDriverr}
          idWareHouse={this.state.idWareHouse}
          orderIdd={this.state.orderIdd}
          status={this.state.status}
          onClickEditCylinder={this.onClickEditCylinder}
        />
      </div>
    );
  }
}

export default ImportOrderManagement;
