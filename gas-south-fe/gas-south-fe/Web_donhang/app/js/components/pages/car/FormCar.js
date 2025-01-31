import React, { Component } from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import isUppercase from "isUppercase";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { ADDTRUCK, UPDATETRUCK, VEHICLE_TRUCK } from "../../../config/config";
import addVehicleApi from "addVehicleApi";
import Constants from "Constants";
import showToast from "showToast";
import { forEach } from "lodash";
import updateVehicleApi from "updateVehicleApi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddCar extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      visible: false,
      vehicleId: '',
      email: '',
      code: '',
      license_plate: "",
      load_capacity: "",
      id: "",
      userId: "",
      listUsers: [],
      listTruck: [],
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };
  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  async submit(event) {
    event.preventDefault();
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    let { vehicleId, email, code, license_plate, load_capacity, } = this.state;
    if (this.props.isCreateMode) {
      const params = {
        "email": email,
        // "password": "A123!@#",
        "name": license_plate + ' - ' + load_capacity,
        "userType": "Vehicle",
        "userRole": "Truck",
        "isChildOf": id,
        "owner": id,
        "code": code,
        "license_plate": license_plate,
        "load_capacity": load_capacity,
      }

      const res = await addVehicleApi(params);

      if (res.status === 200) {
        toast.success('Tạo xe thành công', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const modal = $("#create-user");
        modal.modal("hide");
        this.setState({
          email: '',
          code: '',
          license_plate: '',
          load_capacity: '',
        });
      } else {
        toast.error('Gặp lỗi khi tạo xe', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      const params = {
        vehicleId,
        code,
        license_plate,
        load_capacity,
      }

      const res = await updateVehicleApi(params);

      if (res.status === 200 && res.data.success) {
        toast.success('Cập nhật thành công', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        this.props.getVehicles(id);

        const modal = $("#create-user");
        modal.modal("hide");
      } else {
        toast.error('Cập nhật thất bại', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    }
  }

  componentDidMount() {
    if (!this.props.isCreateMode) {
      const {
        id: vehicleId = '',
        email = '',
        code = '',
        license_plate = '',
        load_capacity = '',
      } = this.props.userEdit

      this.setState({
        vehicleId,
        email,
        code,
        license_plate,
        load_capacity,
      })
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.userEdit !== prevProps.userEdit) {
      if (!this.props.isCreateMode) {
        const {
          id: vehicleId = '',
          email = '',
          code = '',
          license_plate = '',
          load_capacity = '',
        } = this.props.userEdit

        this.setState({
          vehicleId,
          email,
          code,
          license_plate,
          load_capacity,
        })
      }
    }
  }

  handleClear = () => {
    this.setState({
      email: '',
      code: '',
      license_plate: '',
      load_capacity: '',
    })
  }

  render() {
    return (
      <div className="modal fade" id="create-user" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {this.props.isCreateMode
                  ? "Tạo Xe Mới"
                  : "Chỉnh sửa thông tin xe"}
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                id="carModal"
                className="card"
                onSubmit={(event) => {
                  this.submit(event);
                }}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="email"
                          id="email"
                          disabled={!this.props.isCreateMode}
                          value={this.state.email}
                          onChange={this.onChange}
                          placeholder={
                            this.props.isCreateMode
                              ? null
                              : this.props.userEdit.email
                          }
                          validations={[required]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Code</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="code"
                          id="code"
                          disabled={!this.props.isCreateMode}
                          value={this.state.code}
                          onChange={this.onChange}
                          placeholder={
                            this.props.isCreateMode
                              ? null
                              : this.props.userEdit.code
                          }
                          validations={[required]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển Số</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          disabled={!this.props.isCreateMode}
                          value={this.state.license_plate}
                          onChange={this.onChange}
                          placeholder={
                            this.props.isCreateMode
                              ? null
                              : this.props.userEdit.license_plate
                          }
                          validations={[required]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Trọng Tải Xe</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="load_capacity"
                          id="load_capacity"
                          value={this.state.load_capacity}
                          onChange={this.onChange}
                          placeholder={
                            this.props.isCreateMode
                              ? null
                              : this.props.userEdit.load_capacity
                          }
                          validations={[required]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" id="button">
                    Lưu
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={this.handleClear}
                  >
                    Đóng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCar;
