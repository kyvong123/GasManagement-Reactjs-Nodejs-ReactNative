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
import { ADDTRUCK, UPDATETRUCK } from "./../../../config/config";
import getAllUserApi from "getAllUserApi";
import Constants from "Constants";
import showToast from "showToast";
import { forEach } from "lodash";

class AddCar extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      visible: false,
      license_plate: "",
      load_capacity: "",
      // password: "Abc123",
      // userType: "Deliver",
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
    let { license_plate, load_capacity, userId, userType } = this.state;
    if (this.props.isCreateMode) {
      if (this.props.listTruck.includes(license_plate) === false) {
        let isChildOf = user_cookies.user.id;
        let params = {
          userId: isChildOf,
          license_plate: license_plate,
          load_capacity: load_capacity,
        };
        await callApi("POST", ADDTRUCK, params, token).then((res) => {
          alert("Tạo thành công");
          window.location.reload();
          const modal = $("#create-user");
          modal.modal("hide");
        });
      } else {
        this.setState({
          license_plate: "",
          load_capacity: "",
        });
        showToast("Trùng biển số xe");
      }
    } else {
      let params1 = {};
      params1 = {
        truckId: this.props.userEdit.id,
        license_plate: license_plate,
        load_capacity: load_capacity,
      };

      let checkAdd = false;
      for (let i = 0; i < this.props.listUsers.length; i++) {
        if (this.props.listUsers[i].license_plate === params1.license_plate) {
          checkAdd = true;
          break;
        }
      }
      if (checkAdd) {
        showToast("Trùng Biển Số");
        this.setState({
          license_plate: "",
          load_capacity: "",
        });
      } else {
        await callApi("POST", UPDATETRUCK, params1, token).then((res) => {
          console.log("res update xe", res);
          alert("Cập Nhật Thành Công");
          window.location.reload();
          const modal = $("#create-user");
          modal.modal("hide");
        });
      }
    }
  }
  componentDidMount() {
  }

  handleClear = () => {
    this.setState({
      license_plate:'',
      load_capacity:'',
    })
  }

  render() {
    let {
      load_capacity,
      license_plate,
      addressHD,
      addressGH,
      idName,
      idBranch,
      nameBranch,
      lat,
      lng,
    } = this.state;
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
                        <label>Biển Số</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
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
