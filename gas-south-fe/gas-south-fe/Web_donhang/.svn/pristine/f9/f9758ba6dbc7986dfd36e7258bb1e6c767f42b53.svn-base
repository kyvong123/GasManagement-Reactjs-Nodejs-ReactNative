import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import email from "email";
import isUppercase from "isUppercase";
import getUserCookies from "getUserCookies";
import axios from "axios";
import showToast from "showToast";

const USERTYPE_ENUM = [
  {
    key: "SuperAdmin",
    value: "Quản trị viên",
  },
  {
    key: "Staff",
    value: "Nhân viên",
  },
];

class AddUserPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      name: "",
      email: "",
      namebranch: "",
      emailbranch: "",
      content: "",
      checked: false,
      password: "",
      prefix: "",
      code: "",
      value: {
        password: "",
        email: "",
      },
      errors: {
        password: "",
        email: "",
      },
      formValid: false,
      newpassword: false,
      newemail: false,
      userType: "",
      userRole: "",
    };
  }

  async componentDidMount() {
    let data = this.form.getValues();
    console.log("datatesst", data);
    var user_cookies = await getUserCookies();
    if (user_cookies) {
      this.setState({
        userType: user_cookies.user.userType,
        userRole: user_cookies.user.userRole,
      });
    }
  }

  async submit(event) {
    event.preventDefault();
    if (this.props.isCreateMode) {
      var user_cookies = await getUserCookies();
      let isChildOf = "";
      if (user_cookies) {
        isChildOf = user_cookies.user.id;
      }

      let data = this.form.getValues();
      console.log("data form", data);
      let result;
      if (this.props.isStationPage) {
        result = await this.props.addUser(data.email, data.name, data.address, "", "Station", isChildOf, "", this.state.checked, data.codebranch, data.prefix);
      } else if (this.props.isFactoryPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Factory",
          isChildOf,
          "",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isDrivePage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Driver",
          isChildOf,
          "",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isInspectorPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "ThanhTra",
          isChildOf,
          "",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isGeneralPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "General",
          isChildOf,
          "",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isAgencyPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Agency",
          isChildOf,
          "",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isFixerPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Fixer",
          isChildOf,
          USERTYPE_ENUM[parseInt(data.userType)].key,
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isFactoryChildPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Factory",
          isChildOf,
          "Owner",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      } else if (this.props.isIndustryPage) {
        let customerType = "Industry";
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "General",
          isChildOf,
          "SuperAdmin",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix,
          customerType
        );
      }
      // else if (this.props.isRegionPage) {
      //   result = await this.props.addUser(
      //     data.email,
      //     data.name,
      //     data.address,
      //     "",
      //     "Factory",
      //     isChildOf,
      //     "Owner",
      //     this.state.checked,
      //     data.code,
      //     data.lat ? data.lat : 0,
      //     data.lng ? data.lng : 0
      //   );
      // }
      else {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          USERTYPE_ENUM[parseInt(data.userType)].key,
          isChildOf,
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix
        );
      }

      if (result) {
        const modal = $("#create-user");
        modal.modal("hide");
      }
    } else {
      var user_cookies = await getUserCookies();

      let data = this.form.getValues();
      let result;
      result = await this.props.updateUser(this.props.isEditForm.id, data.name, data.address, data.password, data.lat, data.lng, data.codebranch, data.prefix);

      if (result) {
        const modal = $("#create-user");
        modal.modal("hide");
      }
    }
    //window.location.reload();
    return;
  }

  reloadPopup() {
    window.location.reload();
  }

  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  handleChangeSelect = () => {
    this.setState({ checked: !this.state.checked });
  };

  handleErrorEmail = (e) => {
    let { name, value } = e.target;
    let { newemail } = this.state;
    value === "" ? "Xin Vui lòng nhập vô đây" : "";
    let message = value;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    message === "" ? true : false;
    newemail = message;
    if (value === "") {
      message = "";
    } else if (!filter.test(email.value)) {
      message = "Định dạng email không đúng và yêu cầu nhập lại.";
      // email.focus;
      newemail = false;
    } else {
      message = "";
      document.getElementById();
      newemail = true;
    }
    this.setState(
      {
        errors: { ...this.state.errors, [name]: message },
        newemail,
      },
      () => {
        this.FormValidation();
      }
    );
  };

  handleErrors = (e) => {
    let { name, value } = e.target;
    let message = value === "" ? "Xin Vui lòng nhập vô đây" : "";
    let { newpassword } = this.state;
    var pattern = new RegExp(
      "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
        "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
        "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
    );
    var number = /^[0-9]+$/;

    newpassword = message === "" ? true : false;
    if (value && value.length < 6 && value.match(pattern) && value.match(number)) {
      message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = false;
    } else if (value && value.match(number)) {
      message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    } else if (value && value.match(pattern)) {
      message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    } else if (value && value.length < 6) {
      message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    }

    this.setState(
      {
        errors: { ...this.state.errors, [name]: message },
        newpassword,
      },
      () => {
        this.FormValidation();
      }
    );
  };

  FormValidation = () => {
    this.setState({
      formValid: this.state.newpassword,
    });
  };

  //    checkEmail = () => {
  //     var email = document.getElementById('email');
  //     var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  //     if (!filter.test(email.value)) {
  //         alert('Hay nhap dia chi email hop le.\nExample@gmail.com');
  //         email.focus;
  //         return false;
  //     }
  //     else
  //     {
  //         alert('OK roi day, Email nay hop le.');
  //     }
  // }
  async componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.userEdit) {
      this.handleClear();
    } else {
      await this.setState({
        email: "",
        name: "",
        address: "",
        code: "",
        password: "",
      });
    }
  }

  handleClear = async (userEdit) => {
    alert("ok");
    await this.setState({
      email: userEdit.email,
      name: userEdit.name,
      address: userEdit.address,
      code: userEdit.code,
      id: userEdit.id,
      password: "",
      prefix: userEdit.prefix,
    });
  };

  render() {
    let { password } = this.state;
    return (
      <div>
        <div className="modal fade" id="create-user" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {this.props.isCreateMode
                    ? this.props.isFactoryPage
                      ? "Tạo Mới Thương Nhân Sở Hữu"
                      : this.props.isGeneralPage
                      ? "Tạo Mới Tổng đại lý"
                      : this.props.isAgencyPage
                      ? "Tạo Mới Hệ Thống CH Bán Lẻ"
                      : this.props.isFactoryChildPage
                      ? "Tạo Mới Công ty - Chi nhánh trực thuộc"
                      : this.props.isFixerPage
                      ? "Tạo Mới Nhà Máy Sửa Chữa"
                      : this.props.isIndustryPage
                      ? "Tạo Mới Khách Hàng Công Nghiệp"
                      : ""
                    : this.props.isBranchPage
                    ? "adawda"
                    : this.props.isFactoryPage
                    ? "Chỉnh Sửa Thông Tin Thương Nhân Sở Hữu"
                    : this.props.isGeneralPage
                    ? "Chỉnh Sửa Thông Tin"
                    : this.props.isAgencyPage
                    ? "Chỉnh Sửa Thông Tin Hệ Thống CH Bán Lẻ"
                    : this.props.isFactoryChildPage
                    ? "Chỉnh Sửa Thông Tin Công ty - Chi nhánh trực thuộc"
                    : this.props.isFixerPage
                    ? "Chỉnh Sửa Thông Tin Nhà Máy Sửa Chữa"
                    : this.props.isIndustryPage
                    ? "Chỉnh Sửa Thông Tin Khách Hàng Công Nghiệp"
                    : ""}
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
                  className="card"
                  onSubmit={(event) => this.submit(event)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Địa chỉ Email </label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="email"
                            id="email"
                            value={this.props.isEditForm ? this.props.isEditForm.email : ""}
                            validations={[required, isUppercase, email]}
                            // onClick={this.checkEmail}
                            onBlur={this.handleErrorEmail ? "Tạo Mới Người Dùng" : ""}
                            onKeyUp={this.handleErrorEmail ? "Tạo Mới Người Dùng" : ""}
                          />

                          {this.state.errors.email === "" ? "" : <div className="alert alert-danger">{this.state.errors.email}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            {this.props.isCreateMode
                              ? this.props.isGeneralPage
                                ? "Tên khách hàng"
                                : this.props.isAgencyPage
                                ? "Tên khách hàng"
                                : this.props.isFactoryChildPage
                                ? "Tên công ty con/ Chi nhánh"
                                : this.props.isFixerPage
                                ? "Tên nhà máy"
                                : this.props.isIndustryPage
                                ? "Tên khách hàng"
                                : "Tên thương nhân sở hữu"
                              : this.props.isFactoryPage
                              ? "Chỉnh Sửa Thông Tin Thương Nhân Sở Hữu"
                              : this.props.isGeneralPage
                              ? "Tên khách hàng"
                              : this.props.isAgencyPage
                              ? "Tên khách hàng"
                              : this.props.isFactoryChildPage
                              ? "Tên công ty con/ Chi nhánh"
                              : this.props.isFixerPage
                              ? "Tên nhà máy"
                              : this.props.isIndustryPage
                              ? "Tên khách hàng"
                              : ""}
                          </label>
                          <Input
                            className="form-control"
                            type="text"
                            name="name"
                            id="name"
                            value={!!this.props.isEditForm ? this.props.isEditForm.name : ""}
                            validations={[required]}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Địa chỉ</label>
                          <Input
                            className="form-control"
                            type="text"
                            name="address"
                            id="address"
                            value={!!this.props.isEditForm ? this.props.isEditForm.address : ""}
                            validations={[required]}
                          />
                        </div>
                      </div>

                      {this.props.isCreateMode && (
                        <div className="col-md-6">
                          <div className="form-group">
                            {/* <label>Mã kho</label> */}
                            <label>
                              {this.props.isCreateMode
                                ? this.props.isGeneralPage
                                  ? "Mã khách hàng"
                                  : this.props.isAgencyPage
                                  ? "Mã khách hàng"
                                  : this.props.isFactoryChildPage
                                  ? "Mã chi nhánh"
                                  : this.props.isFixerPage
                                  ? "Mã chi nhánh"
                                  : this.props.isIndustryPage
                                  ? "Mã khách hàng"
                                  : "Mã thương nhân sở hữu"
                                : ""}
                            </label>
                            <Input
                              className="form-control"
                              type="text"
                              name="code"
                              id="code"
                              value={this.props.isEditForm ? this.props.isEditForm.code : ""}
                              validations={[required]}
                            />
                          </div>
                        </div>
                      )}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Tọa độ LAT</label>
                          <Input className="form-control" type="number" name="lat" id="lat" value={!!this.props.isEditForm ? this.props.isEditForm.LAT : ""} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Tọa độ LNG</label>
                          <Input className="form-control" type="number" name="lng" id="lng" value={!!this.props.isEditForm ? this.props.isEditForm.LNG : ""} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Mã chi nhánh</label>
                          <Input
                            className="form-control"
                            type="text"
                            name="codebranch"
                            //id="code"
                            value={!!this.props.isEditForm ? this.props.isEditForm.code : ""}
                          />
                        </div>
                      </div>
                      {this.props.isCreateMode === false && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Mật Khẩu</label>
                            <Input
                              className="form-control"
                              type="password"
                              name="password"
                              id="password"
                              onChange={this.onChange}
                              onBlur={this.handleErrors}
                              onKeyUp={this.handleErrors}
                              value={password}
                            />
                            {this.state.errors.password === "" ? "" : <div className="alert alert-danger">{this.state.errors.password}</div>}
                          </div>
                        </div>
                      )}
                      {(this.state.userType === "Factory" || this.state.userType === "Region") && this.state.userRole === "SuperAdmin" ? (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Mã tiền tố</label>
                            <Input className="form-control" type="text" name="prefix" value={this.props.isEditForm ? this.props.isEditForm.prefix : ""} />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {this.props.isFixerPage ? (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Quyền</label>
                            <Select className="form-control" name="userType">
                              <option value="">-- Chọn --</option>
                              {USERTYPE_ENUM.map((item, index) => (
                                <option value={index}>{item.value}</option>
                              ))}
                            </Select>
                            {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} />*/}
                          </div>
                        </div>
                      ) : null}
                      {this.props.isStationPage ||
                      this.props.isFactoryPage ||
                      this.props.isGeneralPage ||
                      this.props.isAgencyPage ||
                      this.props.isFixerPage ||
                      this.props.isDrivePage ||
                      this.props.isIndustryPage ||
                      this.props.isInspectorPage ||
                      this.props.isFactoryChildPage ? null : (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Loại người dùng </label>
                            <Select className="form-control" name="userType">
                              <option value="">-- Chọn --</option>
                              {USERTYPE_ENUM.map((item, index) => (
                                <option value={index}>{item.value}</option>
                              ))}
                            </Select>
                            {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} />*/}
                          </div>
                        </div>
                      )}
                      {this.props.isCreateMode && (
                        <div className="col-md-6">
                          <div
                            className="form-group"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: 32,
                            }}
                          >
                            <label>Trực thuộc</label>
                            <input
                              style={{ marginLeft: "5px", marginBottom: "5px" }}
                              type="checkbox"
                              onChange={() => this.handleChangeSelect()}
                              value={this.state.checked}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/*<div className="form-group">*/}
                    {/*<label>Các vị trí</label>*/}
                    {/*<TagAutoComplete getPosition={this.getPosition.bind(this)}*/}
                    {/*data={this.state.job_titles}/>*/}
                    {/*</div>*/}
                  </div>

                  <footer className="card-footer text-center">
                    <Button className="btn btn-primary">Lưu</Button>
                    <button className="btn btn-secondary" type="reset" data-dismiss="modal" style={{ marginLeft: "10px" }}>
                      Đóng
                    </button>
                  </footer>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddUserPopup;
