import React, { Component } from "react";
import { Form, Button, Input, Select } from "antd";
import axios from "axios";
import showToast from "showToast";
import { CREATESYSTEMPAGE } from "../../../config/config"
import { GET_SYSTEMPAGEBYLEVEL } from "./../../../../api/getSystemPageByLevelAPI";
const { Option } = Select;
import { SERVERAPI } from '../../../config/config'
export default class FormAddNew extends Component {
  state = {
    listSystemPage: "",
    listParentId: "",
    uniqueParentId: "",
    disableParentId: true,
    name: "",
    controllerName: "",
    actionName: "",
    url: "",
    status: "",
    orderNo: "",
    parentId: "",
    level: "",
  };

  onChange = (value) => {
    console.log(value);
    if (value == 1 || value == 2) {
      this.getSystemPageByLevel(value);
    } else {
      this.setState({ disableParentId: true });
    }
    this.setState({
      level: value,
      parentId: "",
    });
  };

  onChangeParentId = (value) => {
    this.setState({
      parentId: value,
    });
  };

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //------------Call Api-------------//

  getSystemPageByLevel = (level) => {
    return axios({
      method: "GET",
      url: SERVERAPI + `/systemPage/getSystemPageByLevel/?level=${level -
        1}`,
    })
      .then((res) => {
        console.log(res.data.SystemPage);
        this.setState({
          listSystemPage: res.data.SystemPage,
          disableParentId: false,
        });
        let newArray = [];
        for (let i = 0; i < res.data.SystemPage.length; i++) {
          newArray.push({
            id: res.data.SystemPage[i].id,
            name: res.data.SystemPage[i].name,
          });
        }
        console.log("newArray", newArray);
        this.setState({
          uniqueParentId: [...new Set(newArray)],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createSystemPage = () => {
    let params = {
      name: this.state.name,
      controllerName: this.state.controllerName,
      actionName: this.state.actionName,
      url: this.state.url,
      status: this.state.status,
      orderNo: this.state.orderNo,
      parentId: this.state.parentId,
      level: this.state.level,
    };
    console.log(params);
    return axios({
      method: "POST",
      url: CREATESYSTEMPAGE,
      data: params,
    })
      .then((res) => {
        if (res.data.success === false) {
          showToast("Hãy Nhập Đầy Đủ Thông Tin");
        } else {
          showToast("Tạo Thành Công");
          console.log(res);
          const modal = $("#create-controll");
          modal.modal("hide");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //--------Other Func--------//

  render() {
    console.log(this.state.uniqueParentId);
    console.log(this.state.parentId);
    let { uniqueParentId } = this.state;
    return (
      <div className="modal fade" id="create-controll" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo Mới</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                id="AddControllModal"
                className="card"
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Level</label>
                        <Select
                          style={{ width: 349 }}
                          placeholder="Select Level"
                          optionFilterProp="children"
                          onChange={this.onChange}
                        >
                          <Option value="0">0 - (Module)</Option>
                          <Option value="1">1 - (Chức Năng)</Option>
                          <Option value="2">2 - (Tính Năng)</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Parent Id</label>
                        <Select
                          style={{ width: 349 }}
                          placeholder="Select parent"
                          optionFilterProp="children"
                          onChange={this.onChangeParentId}
                        >
                          {uniqueParentId === "" ? (
                            <Option value={null}>Null</Option>
                          ) : this.state.disableParentId === true ? (
                            <Option value={null}>Null</Option>
                          ) : (
                            uniqueParentId.map((item) => {
                              return (
                                <Option value={item.id} key={item.id}>
                                  {item.name}
                                </Option>
                              );
                            })
                          )}
                        </Select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Name</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="name"
                          onChange={this.handleOnChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Controller Name</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="controllerName"
                          onChange={this.handleOnChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Action Name</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="actionName"
                          onChange={this.handleOnChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Url</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="url"
                          onChange={this.handleOnChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="status"
                          onChange={this.handleOnChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Order No</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="orderNo"
                          onChange={this.handleOnChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="card-footer text-center">
                  <Button
                    className="btn btn-primary"
                    id="button"
                    onClick={this.createSystemPage}
                  >
                    Lưu
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
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
