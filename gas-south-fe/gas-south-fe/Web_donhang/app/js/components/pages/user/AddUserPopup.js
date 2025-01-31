import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import { Select as SelectANTD } from "antd";
import Button from "react-validation/build/button";
import required from "required";
import email from "email";
import isUppercase from "isUppercase";
import getUserCookies from "getUserCookies";
import axios from "axios";
import { SERVERAPI } from "../../../config/config";
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
const CUSTOMERTYPE_ENUM = [
  {
    key: "Industry",
    value: "Khách hàng công nghiệp",
  },
  {
    key: "General",
    value: "Tổng đại lý",
  },
  {
    key: "Agency",
    value: "Đại lý",
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
      groups: [],
      group: "",
      roleSelected: [],
      isFocusSelect: false,
      codetax: "",
      customerType: ""
    };
  }

  async componentDidMount() {

    // let data = this.form.getValues();
    // console.log("datatesst", data);
    var user_cookies = await getUserCookies();
    if (user_cookies) {
      let res = await axios.get(SERVERAPI + "customers/groups", {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      });
      this.setState({
        userType: user_cookies.user.userType,
        userRole: user_cookies.user.userRole,
        groups: res.data.data,
        roleSelected: this.props.isEditForm.personRole
      });
    }
  }

  async submit(event) {
    event.preventDefault();
    // let data = this.form.getValues();
    // console.log('chooseeee:::', this.state.customerType)
    // return
    if (this.props.isCreateMode) {
      var user_cookies = await getUserCookies();
      let isChildOf = "";
      if (user_cookies) {
        isChildOf = user_cookies.user.id;
      }

      let data = this.form.getValues();
      // console.log("data form", data);
      let result;
      if (this.props.isStationPage) {
        result = await this.props.addUser(data.email, data.name, data.address, "", "Station", isChildOf, "", this.state.checked, data.codebranch, data.prefix, "", this.state.group);
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
          data.prefix,
          "",
          this.state.group
        );
      } else if (this.props.isPersonnelPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Personnel",
          isChildOf,
          "",
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix,
          "",
          this.state.group,
          this.state.roleSelected
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
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.codebranch ? data.codebranch : 0,
          data.prefix,
          "",
          this.state.group
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
          data.prefix,
          "",
          this.state.group
        );
      } else if (this.props.isCustomerManagement) {
        if (!this.state.customerType) {
          alert('Vui lòng chọn loại khách hàng')
          return
        }
        if (this.state.customerType === 'General') {
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
            data.codetax ? data.codetax : 0,
            data.prefix,
            "",
            this.state.group,
            "",
            data.phone
          );
        } else if (this.state.customerType === 'Agency') {
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
            data.codetax ? data.codetax : 0,
            data.prefix,
            "",
            this.state.group,
            "",
            data.phone
          );
        } else if (this.state.customerType === 'Industry') {
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
            data.codetax ? data.codetax : 0,
            data.prefix,
            customerType,
            this.state.group,
            "",
            data.phone
          );
        }
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
          data.prefix,
          "",
          this.state.group
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
          customerType,
          this.state.group
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
          data.prefix,
          "",
          this.state.group
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
          data.prefix,
          "",
          this.state.group
        );
      } else {
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
          data.prefix,
          "",
          this.state.group
        );
      }
      if (result) {
        const modal = $("#create-user");
        modal.modal("hide");
        window.location.reload();

      }
    } else {
      var user_cookies = await getUserCookies();

      let data = this.form.getValues();
      let result;
      let group = this.state.group;
      let _userType
      let _customerType
      if (this.state.customerType && this.props.isCustomerManagement && data.codetax) {
        _userType = (this.state.customerType === 'General' || this.state.customerType === 'Industry') ? 'General' : this.state.customerType === 'Agency' ? 'Agency' : ''
        _customerType = this.state.customerType === 'Industry' ? 'Industry' : ''
      }

      if (group == "") {
        if (this.props.isCustomerManagement && data.codetax) {
          result = await this.props.updateUser(this.props.isEditForm.id, data.name, data.address, data.password, data.lat, data.lng, data.code, data.codetax, data.prefix, this.props.isEditForm.group, null, _userType, _customerType, data.phone);
        } else {
          result = await this.props.updateUser(this.props.isEditForm.id, data.name, data.address, data.password, data.lat, data.lng, data.code, data.codebranch, data.prefix, this.props.isEditForm.group, this.state.roleSelected);
        }
      } else {
        if (this.props.isCustomerManagement && data.codetax) {
          result = await this.props.updateUser(this.props.isEditForm.id, data.name, data.address, data.password, data.lat, data.lng, data.code, data.codetax, data.prefix, group, null, _userType, _customerType, data.phone);
        } else {
          result = await this.props.updateUser(this.props.isEditForm.id, data.name, data.address, data.password, data.lat, data.lng, data.code, data.codebranch, data.prefix, group, this.state.roleSelected);
        }
      }
      if (result) {
        const modal = $("#create-user");
        modal.modal("hide");
        // this.props.refresh();
        window.location.reload();
      }
    }
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
  handleChange = (value) => {
    this.setState({ roleSelected: value });
  }
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
    if (nextProps && nextProps.isEditForm) {
      this.handleClear(nextProps.isEditForm);
    } else {
      await this.setState({
        email: "",
        name: "",
        address: "",
        code: "",
        password: "",
        group: "",
      });
    }
  }

  handleClear = async (userEdit) => {
    this.setState({
      email: userEdit.email,
      name: userEdit.name,
      address: userEdit.address,
      code: userEdit.code,
      id: userEdit.id,
      password: "",
      prefix: userEdit.prefix,
      group: userEdit.group,
      roleSelected: userEdit.personRole
    });
  };
  handleChangeCodeTax = (e) => {
    this.setState({ codetax: e.target.value })
  }
  render() {
    const that = this
    // console.log("edit form", this.props.isEditForm);
    // console.log("view form", this.props.isViewForm);
    const formData = !!this.props.isEditForm ? this.props.isEditForm : !!this.props.isViewForm ? this.props.isViewForm : null

    let { password, roleSelected } = this.state;
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
                          ? "Tạo Mới Hệ Thống Đại lý"
                          : this.props.isFactoryChildPage
                            ? "Tạo Mới Công ty - Chi nhánh trực thuộc"
                            : this.props.isFixerPage
                              ? "Tạo Mới Nhà Máy Sửa Chữa"
                              : this.props.isIndustryPage
                                ? "Tạo Mới Khách Hàng Công Nghiệp Bình"
                                : ""
                    : this.props.isBranchPage
                      ? "adawda"
                      : this.props.isFactoryPage
                        ? "Chỉnh Sửa Thông Tin Thương Nhân Sở Hữu"
                        : (this.props.isGeneralPage || this.props.isPersonnelPage)
                          ? "Chỉnh Sửa Thông Tin"
                          : this.props.isAgencyPage
                            ? "Chỉnh Sửa Thông Tin Hệ Thống Đại lý"
                            : this.props.isFactoryChildPage
                              ? "Chỉnh Sửa Thông Tin Công ty - Chi nhánh trực thuộc"
                              : this.props.isFixerPage
                                ? "Chỉnh Sửa Thông Tin Nhà Máy Sửa Chữa"
                                : this.props.isIndustryPage
                                  ? "Chỉnh Sửa Thông Tin Khách Hàng Công Nghiệp Bình"
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
                          <label>{`${this.props.isCustomerManagement ? 'Tên đăng nhập' : 'Địa chỉ Email'}`} </label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={!!this.props.isEditForm || this.props.isCustomerManagement}
                            className="form-control"
                            type="text"
                            name="email"
                            id="email"
                            value={formData ? formData.email : this.props.isCustomerManagement ? `${this.state.codetax}@pgs.com.vn` : ""}
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
                              ? (this.props.isGeneralPage || this.props.isCustomerManagement)
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
                                : (this.props.isGeneralPage || this.props.isCustomerManagement)
                                  ? "Tên khách hàng"
                                  : this.props.isAgencyPage
                                    ? "Tên khách hàng"
                                    : this.props.isFactoryChildPage
                                      ? "Tên công ty con/ Chi nhánh"
                                      : this.props.isFixerPage
                                        ? "Tên nhà máy"
                                        : this.props.isIndustryPage
                                          ? "Tên khách hàng"
                                          : this.props.isPersonnelPage
                                            ? "Tên nhân sự"
                                            : ""}
                          </label>
                          <Input
                            disabled={!!this.props.isViewForm && !this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="name"
                            id="name"
                            value={formData ? formData.name : ""}
                            validations={[required]}
                          />
                        </div>
                      </div>
                      {this.props.isPersonnelPage && <div className="col-md-6">
                        <h6>Chức năng</h6>
                        <div className="form-group">
                          <SelectANTD
                            mode="multiple"
                            style={{
                              position: 'relative',
                              width: '100%',
                            }}
                            placeholder="Chọn"
                            defaultValue={this.state.roleSelected}
                            value={this.state.roleSelected}
                            onChange={this.handleChange}
                            optionLabelProp="label"
                            onFocus={() => { this.setState({ isFocusSelect: true }) }}
                            onBlur={() => { this.setState({ isFocusSelect: false }) }}
                          >
                            <SelectANTD.Option value="create" label="Tạo mới">
                              Tạo mới
                            </SelectANTD.Option>
                            <SelectANTD.Option value="edit" label="Chỉnh sửa">
                              Chỉnh sửa
                            </SelectANTD.Option>
                            <SelectANTD.Option value="remove" label="Xoá">
                              Xoá
                            </SelectANTD.Option>
                          </SelectANTD>
                          <div style={{ position: 'absolute', right: 20, top: 33 }}>
                            {this.state.isFocusSelect ?
                              <i className="fa-solid fa-magnifying-glass"></i> :
                              <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>}
                          </div>

                        </div>
                      </div>}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Địa chỉ</label>
                          <Input
                            disabled={!!this.props.isViewForm && !this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="address"
                            id="address"
                            value={formData ? formData.address : ""}
                            validations={[required]}
                          />
                        </div>
                      </div>

                      {(this.props.isCreateMode && !this.props.isPersonnelPage) && (
                        <div className="col-md-6">
                          <div className="form-group">
                            {/* <label>Mã kho</label> */}
                            <label>
                              {this.props.isCreateMode
                                ? (this.props.isGeneralPage || this.props.isCustomerManagement)
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
                          <Input disabled={!!this.props.isViewForm && !this.props.isEditForm} className="form-control" type="number" name="lat" id="lat" value={formData ? formData.LAT : ""} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Tọa độ LNG</label>
                          <Input disabled={!!this.props.isViewForm && !this.props.isEditForm} className="form-control" type="number" name="lng" id="lng" value={formData ? formData.LNG : ""} />
                        </div>
                      </div>
                      {(!this.props.isPersonnelPage && !this.props.isCustomerManagement) && <div className="col-md-6">
                        <div className="form-group">
                          <label>Mã chi nhánh </label>
                          <Input
                            className="form-control"
                            type="text"
                            name="codebranch"
                            //id="code"
                            value={!!this.props.isEditForm ? this.props.isEditForm.codebranch : ""}
                          />
                        </div>
                      </div>}
                      {(this.props.isCustomerManagement) && <div className="col-md-6">
                        <div className="form-group">
                          <label>Mã số thuế </label>
                          <Input
                            disabled={!!formData}
                            className="form-control"
                            type="text"
                            name="codetax"
                            onChange={this.handleChangeCodeTax}
                            validations={[required]}
                            value={formData ? formData.codetax : this.state.codetax}
                          />
                        </div>
                      </div>}
                      {(this.props.isCreateMode === false && !this.props.isViewForm) && (
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
                      {(this.state.userType === "Factory" || this.state.userType === "Region") && this.state.userRole === "SuperAdmin" && !this.props.isPersonnelPage ? (
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
                        this.props.isPersonnelPage ||
                        this.props.isAgencyPage ||
                        this.props.isFixerPage ||
                        this.props.isDrivePage ||
                        this.props.isIndustryPage ||
                        this.props.isInspectorPage ||
                        this.props.isCustomerManagement ||
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
                      {
                        this.props.isCustomerManagement &&
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Loại khách hàng</label>
                            {/* <Select disabled={
                              !!this.props.isViewForm} value={!!formData ?
                                (formData.userType == 'Agency' ? 2 : formData.userType == 'General' && formData.customerType == 'Industry' ? 0 : 1) : ''}
                              validations={[required]} className="form-control" name="customerType">
                              <option value="">-- Chọn --</option>
                              {CUSTOMERTYPE_ENUM.map((item, index) => (
                                <option value={index}>{item.value}</option>
                              ))}
                            </Select> */}
                            <select disabled={!!this.props.isViewForm} className="form-control" name="customerType" onChange={(e) => this.onChange(e)} >
                              <option value="" >-- Chọn --</option>
                              {CUSTOMERTYPE_ENUM.map((item, index) => {
                                const isChose = formData ? (formData.userType == 'Agency' ? 'Agency' : formData.userType == 'General' && formData.customerType == 'Industry' ? 'Industry' : 'General') : false
                                return (
                                  <option key={index} selected={formData ? isChose == item.key : false} value={item.key}>{item.value}</option>
                                )
                              })}
                            </select>
                          </div>
                        </div>
                      }
                      {this.props.isStationPage ||
                        this.props.isFactoryPage ||
                        this.props.isGeneralPage ||
                        this.props.isPersonnelPage ||
                        this.props.isAgencyPage ||
                        this.props.isFixerPage ||
                        this.props.isDrivePage ||
                        this.props.isIndustryPage ||
                        this.props.isInspectorPage ||
                        !!this.props.isViewForm ||
                        this.props.isFactoryChildPage ? null : <div className="col-md-6">
                        <div className="form-group">
                          <label>Nhóm khách hàng</label>
                          <select className="form-control" name="group" onChange={(e) => this.onChange(e)}>
                            <option value="" >-- Chọn --</option>
                            {this.state.groups.map((item, index) => (
                              <option key={index} selected={formData ? formData.group == item.id : false} value={item.id}>{item.name}</option>
                            ))}
                          </select>
                          {/* selected={this.props.isEditForm? this.state.group==item.id: false} */}
                        </div>
                      </div>}
                      {(this.props.isCustomerManagement) && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {"Số điện thoại"}
                            </label>
                            <Input
                              disabled={!!this.props.isViewForm}
                              className="form-control"
                              type="text"
                              name="phone"
                              id="phone"
                              value={this.props.isEditForm ? this.props.isEditForm.phone : formData ? formData.phone : ""}
                            // validations={[required]}
                            />
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
                    {!this.props.isViewForm && <Button type="submit" className="btn btn-primary">Lưu</Button>}
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
