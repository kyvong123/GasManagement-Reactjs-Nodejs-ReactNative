import React, { Component } from "react";
import { Row, Col, Pagination, Divider } from "antd";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import "./Shipping.scss";
import Constants from "Constants";
import showToast from "showToast";

import PopupShippingEdit from "./popupShippingEdit";
import PopupShippingDetailBegin from "./popupShippingDetailBegin";
import PopupShippingMap from "./popupShippingMap";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import { GETALLSHIPPINGORDER } from "../../../config/config";
import getShippingOrder from "../../../../api/getShippingOrder";
class ShippingManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAllDriveShip: [],
      listDriveShipDetail: "",
      listCustomerDetail: [],
      listDriver: [],
      nameDriver: "",
      licensePlate: "",
      listShippingText: [],
      listShippingCustomer: [],
      listShippingOrder: [],
      listShippingDriver: [],
      idShippingOrder: "",
      orderCode: "",
      orderId: "",
      noteOrder: "",
      shippingOrderDetail: [],
      count: 0,
      nameDrivers: "",
      /*
Đặt biến để phân trang (Pagination)
*/
      currentPage: 1,
      numberPages: 1,
      itemsPerPages: 10,
    };
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    console.log("idhoa", id);
    console.log("tokenhoa", token);
    await this.getAllShippingOrder(id, token);
  }
  async handleonClickMap(name) {
    console.log("namename", name)
    this.setState({
      nameDrivers: name
    })
  }
  async handleonClick(id) {
    let data = await getShippingOrder(id);
    data.data.ShippingOrder.map(v => {
      this.setState({
        nameDriver: v.nameDriver,
        licensePlate: v.licensePlate,
        idShippingOrder: v.id,
      })

    })
    this.setState({
      //nameDriver: data.data.ShippingOrder.nameDriver,
      //licensePlate: data.data.ShippingOrder.licensePlate,
      //idShippingOrder: data.data.ShippingOrder.id,
      noteOrder: data.data.ShippingOrder.note,
      shippingOrderDetail: data.data.shippingOrderDetail
    });
    let count = data.data.shippingTextDetail[0].length;
    this.setState({
      listShippingDriver: data.data.ShippingOrder,
      listShippingText: data.data.shippingTextDetail,
      listShippingCustomer: data.data.ShippingCustomerDetail,
      count: count,
    });
    let arr = [];
    let total = 0;
    data.data.shippingOrderDetail.map((v, i) => {
      v.map((m) => {
        // m.orderId.listCylinder.map((n) => {
        for (let i = 0; i < m.orderId.listCylinder.length; i++) {
          total += parseInt(m.orderId.listCylinder[i].numberCylinders);
        }
        arr.push({
          numberCylinders: total,
          id: m.orderId.orderCode,
          agencyId: m.orderId.agencyId,
          deliveryDate: m.orderId.deliveryDate,
          orderId: m.orderId.id,
          idshippingOrderDetail: m.id,
          namekh: m.namekh,
          provinceId: m.provinceId === null ? "" : m.provinceId,
        });
        this.setState({
          orderCode: m.orderId.orderCode,
          orderId: m.id,
        });
        // });
      });
    });
    this.setState({
      listShippingOrder: arr,
    });
  }
  async getAllShippingOrder(id, token) {
    let params = {
      userId: id,
    };
    await callApi("GET", GETALLSHIPPINGORDER + id, '', token).then((res) => {
      console.log('getAllShippingOrder_', res)
      this.setState({
        listAllDriveShip: res.data.ShippingOrder,
        numberPages: Math.ceil(
          res.data.ShippingOrder.length / this.state.itemsPerPages
        ),
      });
    });
  }
  render() {
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col xs={1}></Col>
          <Col xs={22}>
            <h4>Quản lý vận chuyển</h4>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={22}>
            <table
              className="table text-center table-hover mt-md-3 table-striped table-bordered seednet-table-keep-column-width"
              id="tableManager"
              cellSpacing="0"
            >
              <thead className="table__head">
                <tr>
                  <th scope="col">Tài xế</th>
                  <th scope="col">Biển số xe</th>
                  <th scope="col">Số lượng bình</th>
                  <th scope="col">Ngày giao</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Thao tác</th>
                  <th scope="col">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {this.state.listAllDriveShip
                  .slice(
                    (this.state.currentPage - 1) * this.state.itemsPerPages,
                    this.state.currentPage * this.state.itemsPerPages
                  )
                  .map((drive, index) => {
                    return (
                      <tr key={index}>
                        <td>{drive.nameDriver}</td>
                        <td>{drive.licensePlate}</td>
                        <td>{drive.numbercylinder}</td>
                        <td>{drive.deliveryDate}</td>
                        <td>
                          {drive.status === 1 ?
                            "Khởi tạo" : (drive.status === 2 ?
                              "Đang giao hàng" : (drive.status === 3 ?
                                "Hoàn thành" : ""))}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary w-100"
                            data-toggle="modal"
                            data-target="#shipping-detail-modal"
                            type="button"
                            onClick={() => {
                              this.handleonClick(drive.id);
                            }}

                          >
                            Xem
                          </button>
                          <button
                            className="btn btn-sm btn-danger mt-1 w-100"
                            data-toggle="modal"
                            data-target="#shipping-edit-modal"
                            type="button"
                            onClick={() => {
                              this.handleonClick(drive.id);
                            }}

                          >
                            Sửa
                          </button>
                          {/* <button
                            className="btn btn-sm btn-success mt-1 w-100"
                            data-toggle="modal"
                            data-target="#shipping-map"
                            type="button"
                            onClick={() => {
                              this.handleonClickMap(drive.nameDriver);
                            }}

                          >
                            Xem bản đồ
                          </button> */}
                        </td>
                        <td>{drive.note}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Divider orientation="center">
          <Pagination
            defaultCurrent={1}
            defaultPageSize={this.state.itemsPerPages}
            total={this.state.numberPages * this.state.itemsPerPages}
            onChange={(onPage) => this.setState({ currentPage: onPage })}
          />
        </Divider>
        {/* <PopupShippingDetail
          nameDriver={this.state.nameDriver}
          licensePlate={this.state.licensePlate}
          listShippingText={this.state.listShippingText}
          listShippingCustomer={this.state.listShippingCustomer}
          listShippingOrder={this.state.listShippingOrder}
        /> */}
        <PopupShippingDetailBegin
          noteOrder={this.state.noteOrder}
          orderId={this.state.orderId}
          orderCode={this.state.orderCode}
          idShippingOrder={this.state.idShippingOrder}
          licensePlate={this.state.licensePlate}
          nameDriver={this.state.nameDriver}
          listShippingDriver={this.state.listShippingDriver}
          listShippingCustomer={this.state.listShippingCustomer}
          listShippingOrder={this.state.listShippingOrder}
          listShippingText={this.state.listShippingText}
        >
        </PopupShippingDetailBegin>
        <PopupShippingEdit
          count={this.state.count}
          noteOrder={this.state.noteOrder}
          orderId={this.state.orderId}
          orderCode={this.state.orderCode}
          idShippingOrder={this.state.idShippingOrder}
          licensePlate={this.state.licensePlate}
          nameDriver={this.state.nameDriver}
          listShippingDriver={this.state.listShippingDriver}
          listShippingCustomer={this.state.listShippingCustomer}
          listShippingOrder={this.state.listShippingOrder}
          listShippingText={this.state.listShippingText}
          shippingOrderDetail={this.state.shippingOrderDetail}
        />
        <PopupShippingMap
          nameDrivers={this.state.nameDrivers}
        />
      </div>
    );
  }
}

export default (ShippingManager);