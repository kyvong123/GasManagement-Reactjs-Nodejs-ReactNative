import React, { Component } from "react";
import {
  Button,
  Radio,
  Form,
  Input,
  Select,
  DatePicker,
  Icon,
  message,
} from "antd";
import Constants from "Constants";
import vi from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import "moment/locale/vi";
import showToast from "showToast";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import getDestinationUserAPI from "getDestinationUserAPI";
import getAllManufacturer from "getAllManufacturer";
import getAllTypeGas from "getAllTypeGas";
import getAllUserApi from "getAllUserApi";
import openNotificationWithIcon from "./../../../helpers/notification";
import { UPDATE_CYLINDERGAS } from "./../../../config/config";
const { Option } = Select;

export default class EditCylinderGas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idCylinder: "",
      cylinderType: "",
      color: "",
      valve: "",
      weight: "",
      checkedDate: "",
      status: "",
      emptyOrFull: "",
      currentImportPrice: "",
      usingType: "",
      user_type: "",
      user_role: "",
      serial: "",
      select: "",
      checkCongtyCon: 1,
      value: 1,
      listconttyconn: "",
      activePage: 1,
      options: [],
      options2: [],
      doitacc: "",
      factory: "",
      manufacture: "",
      typegas: "",
      img_url: "",
      idCardBase64: "",
      listUserFixer: [],
      listTypeGas: [],
      category: "",
      listStation: [],
      listFactoryUser: [],
      listGeneralUser: [],
      listAgencyUser: [],
      listManufacturers: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.cylinderGas) {
      this.setState({
        serial: nextProps.cylinderGas.serial,
        color: nextProps.cylinderGas.color,
        checkedDate: moment(nextProps.cylinderGas.checkedDate).format(
          "YYYY-MM-DD"
        ),
        weight: nextProps.cylinderGas.weight,
        usingType: nextProps.cylinderGas.classification,
        valve: nextProps.cylinderGas.valve,
        manufacture: nextProps.cylinderGas.manufacture,
        img_url: nextProps.cylinderGas.img_url,
        typegas: nextProps.cylinderGas.category,
        idCylinder: nextProps.cylinderGas.idCylinder,
      });
    }
  }
  async getAllTypeGas() {
    const dataUsers = await getAllTypeGas(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        let listArrTypeGas = [];
        for (let i = 0; i < dataUsers.data.data.length; i++) {
          listArrTypeGas.push({
            value: dataUsers.data.data[i].id,
            label: dataUsers.data.data[i].name,
            ...dataUsers.data.data[i],
          });
        }

        this.setState({
          listTypeGas: listArrTypeGas,
        });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async getAllManufacturer() {
    const dataUsers = await getAllManufacturer(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listManufacturers: dataUsers.data });
        console.log("listManu", this.state.listManufacturers);
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async getAllUser() {
    const dataUsers = await getAllUserApi();
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        let userLists = dataUsers.data;
        let userFactory = dataUsers.data.filter(
          (x) => x.userType === Constants.FACTORY
        );
        let userAgency = dataUsers.data.filter(
          (x) => x.userType === Constants.AGENCY
        );
        let userGeneral = dataUsers.data.filter(
          (x) => x.userType === Constants.GENERAL
        );
        this.setState({
          listUsers: userLists,
          listFactoryUser: userFactory,
          listGeneralUser: userGeneral,
          listAgencyUser: userAgency,
        });
        //filter 3 type
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async updateProduct(e) {
    e.preventDefault();
    const user_cookies = await getUserCookies();
    const token = "Bearer " + user_cookies.token;
    const {
      color,
      valve,
      usingType,
      checkedDate,
      idCylinder,
      select,
      typegas,
      manufacture,
      idCardBase64,
      weight,
    } = this.state;
    let params = {
      cylinder_id: idCylinder,
      color: color,
      checked_date: checkedDate,
      weight: +weight,
      classification: usingType,
      valve: valve,
      img_url: idCardBase64,
    };
    await callApi("POST", UPDATE_CYLINDERGAS, params, token).then((res) => {
      console.log("res", res);
      if (res) {
        showToast("Cập nhật thành công");
        window.location.reload();
      } else {
        showToast("Cập nhật bị lỗi! Vui lòng thử lại.");
        return false;
      }
    });
  }

  onChangeType = (e) => {
    this.setState({
      usingType: e.target.value,
    });
  };

  onChangeSelectManu = (value) => {
    this.setState({
      manufacture: value,
    });
  };

  onChangeValue = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  async getListFixer() {
    const dataUsers = await getDestinationUserAPI(
      Constants.FACTORY,
      "",
      Constants.OWNER
    );

    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({
          options: dataUsers.data.map((user) => {
            return {
              value: user.id,
              label: user.name,
            };
          }),
        });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async getList() {
    const dataUsers = await getDestinationUserAPI(Constants.FIXER);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({
          options2: dataUsers.data.map((user) => {
            return {
              value: user.id,
              label: user.name,
            };
          }),
        });
      } else {
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  async componentDidMount() {
    const user_cookies = await getUserCookies();
    this.setState(
      {
        user_type: user_cookies.user.userType,
        user_role: user_cookies.user.userRole,
      },
      () => {}
    );
    this.getAllUser();
    this.getAllManufacturer();
    await this.getListFixer();
    await this.getList();
    await this.getAllTypeGas();
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });

    let idCardBase64 = "";
    this.getBase64(event.target.files[0], (result) => {
      idCardBase64 = result;
      this.setState({ idCardBase64 });
    });
  };

  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const {
      value,
      color,
      valve,
      serial,
      weight,
      img_url,
      idCardBase64,
    } = this.state;
    console.log("date", this.state.checkedDate);
    return (
      <div
        className="modal fade"
        id="edit-product"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header table__head rounded-0">
              <h4 className="modal-title text-white">Chỉnh sửa sản phẩm</h4>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true" className="text-white">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(e) => this.updateProduct(e)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Mã</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="serial"
                          disabled
                          value={serial}
                        />
                      </div>
                      <div className="form-group" style={{ height: "60.8px" }}>
                        <label>Phân loại</label>
                        <div className="form-group">
                          <Radio.Group
                            onChange={this.onChangeType}
                            value={this.state.usingType}
                          >
                            <Radio value="New">Bình mới</Radio>
                            <Radio value="Old">Bình cũ</Radio>
                          </Radio.Group>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Màu sắc</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="color"
                          id="color"
                          onChange={this.onChangeValue}
                          value={color}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Trọng lượng vỏ bình</label>
                        <Input
                          className="form-control"
                          type="number"
                          name="weight"
                          id="weight"
                          onChange={this.onChangeValue}
                          value={weight}
                        />
                      </div>
                      <div className="form-group">
                        <label>Thương hiệu</label>
                        <Select
                          className="form-control"
                          name="manufacture"
                          onChange={this.onChangeSelectManu}
                          value={this.state.manufacture}
                          disabled
                        >
                          <Option value="">-- Chọn --</Option>
                          {this.state.listManufacturers.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="form-group">
                        <label>Loại van</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="valve"
                          id="color"
                          onChange={this.onChangeValue}
                          value={valve}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 text-center m-auto">
                      <div className="form-group">
                        <label>Hình ảnh bình</label>
                        <div className="div-image">
                          <img
                            src={idCardBase64 !== "" ? idCardBase64 : img_url}
                          />
                          <div className="button-input">
                            <button class="btn btn-primary">
                              <Icon type="edit" />
                              Thay đổi
                              <Input
                                type="file"
                                className="input-file-image"
                                name="logo"
                                onChange={(event) =>
                                  this.handleFileChange(event)
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="card-footer text-center">
                  <button type="submit" className="btn btn-primary">
                    Lưu
                  </button>

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
