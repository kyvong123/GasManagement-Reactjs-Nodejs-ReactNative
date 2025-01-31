import React, { Component } from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddCar from "./FormCar";
import getUserCookies from "getUserCookies";
import { GETTRUCK, DELETETRUCK } from "../../../config/config";
import { Table, Popconfirm } from "antd";
import callApi from "./../../../util/apiCaller";
import getExcelVehicleApi from "getExcelVehicleApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import getVehicleApi from 'getVehicleApi';
import deleteVehicleApi from 'deleteVehicleApi';

class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      listTruck: [],
      listVehicle: [],
      editId: "",
      user_type: "",
      userId: "",
      userEdit: {
        license_plate: "",
        load_capacity: "",
      },
      isCreateMode: true,
      check: false,
    };
  }

  refresh() {
    this.forceUpdate(async () => {
      await this.getAllUser();
      //this.setState({userEdit:{}});
    });
  }

  handleButtonListExcel = async () => {
    let user_cookies = await getUserCookies();
    let id = user_cookies.user.id;
    await getExcelVehicleApi(id);
  };

  async deleteUser(id) {
    console.log("idtruck", id);
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = { TruckID: id };
    return callApi("POST", DELETETRUCK, params, token).then((res) => {
      console.log(res);
      showToast(res.data.message);
    });
  }

  async editUser(userEdit) {
    await this.setState({ userEdit, isCreateMode: false }, () => {
      this.setState({
        check: true,
      });
    });
    console.log(userEdit);
  }

  getVehicles = async (id) => {
    const res = await getVehicleApi({ id });
    if (res.status === 200) {
      this.setState({ listVehicle: res.data.data });
    }
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let id = user_cookies.user.id;

    const res = await this.getVehicles(id);
  }

  addUser = async () => {
    let listTruck = [];
    this.state.listUsers.map((item, index) => {
      listTruck.push(item.license_plate);
    });
    await this.setState({
      isCreateMode: true,
      check: false,
    });
    await this.setState({
      userEdit: null,
    });
    this.setState({
      listTruck,
    });
  };

  handleDelete = async (item) => {
    let user_cookies = await getUserCookies();
    let id = user_cookies.user.id;

    const {
      id: vehicleId
    } = item

    const res = await deleteVehicleApi({ vehicleId });

    if (res.status === 200) {
      toast.success('Xóa xe thành công', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      this.getVehicles(id);
    } else {
      toast.error('Không xóa được xe', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  render() {
    const data = [];
    const columns = [
      {
        title: "#STT",
        dataIndex: "index",
        key: "index",
        align: "center",
        render: (text, record, index) => (
          <div style={{ color: "black" }}>{index + 1}</div>
        ),
      },
      {
        title: "Biển Số Xe",
        dataIndex: "license_plate",
        key: "license_plate",
        align: "center",
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Trọng Tải Xe",
        dataIndex: "load_capacity",
        key: "load_capacity",
        align: "center",
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Thao Tác",
        key: "btn",
        align: "center",
        render: (item) => (
          <div>
            <Popconfirm
              title="Xác Nhận Xóa Xe ?"
              onConfirm={() => {
                this.handleDelete(item);
              }}
              okText="Xóa"
              cancelText="Hủy"
            >
              <a>
                <i className="ti-trash"></i>
              </a>
            </Popconfirm>
            <a
              className="table-action hover-primary"
              data-toggle="modal"
              data-target="#create-user"
              onClick={() => {
                this.editUser(item);
              }}
            >
              <i className="ti-pencil"></i>
            </a>
          </div>
        ),
      },
    ];

    return (
      <div className="main-content">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Xe</h4>
              <div className="row">
                <button
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-success"
                  data-toggle="modal"
                  onClick={() => this.handleButtonListExcel()}
                >
                  Xuất Danh Sách Excel
                </button>
                <button
                  onClick={this.addUser}
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-user"
                >
                  Tạo Xe Mới
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <Table
                      dataSource={this.state.listVehicle}
                      bordered
                      columns={columns}
                    ></Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddCar
          isCreateMode={this.state.isCreateMode}
          userEdit={this.state.userEdit}
          listUsers={this.state.listUsers}
          check={this.state.check}
          listTruck={this.state.listTruck}
          getVehicles={this.getVehicles}
        />
      </div>
    );
  }
}

export default Car;
