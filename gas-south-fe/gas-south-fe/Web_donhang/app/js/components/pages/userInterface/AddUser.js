import React, { Component } from "react";
import getUserCookies from "getUserCookies";
import "react-datepicker/dist/react-datepicker.css";
import { ADDUSERSYSTEM } from "../../../config/config";
import getAllUserType from "../../../../api/getAllUserTypeAPI";
import getAllUserSystem from "./../../../../api/getAllUserSystem";
import callAPI from "../../../util/apiCaller";
import { DatePicker, Input } from "antd";
import moment from "moment";
import Constants from "Constants";
import showToast from "showToast";
class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetForm: false,
      listUserType: [],
      isShowPass: false,
      isChecked: false,
      isSpace: false,

      values: {
        username: "",
        status: 1,
        fullname: "",
        birthday: "",
        address: "",
        mobile: "",
        email: "",
        sex: 1,
        userTypeId: "",
        profileimage: "",
        password: "",
      },

      errors: {
        username: "",
        status: "",
        fullname: "",
        birthday: "",
        address: "",
        mobile: "",
        email: "",
        sex: "",
        userTypeId: "",
        profileimage: "",
        password: "",
      },
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.getAllUserType();
  }
  async getAllUserType() {
    // this.setState({ isLoading: true });
    const listusertype = await getAllUserType();
    setTimeout(() => {
      if (listusertype) {
        if (listusertype.status === Constants.HTTP_SUCCESS_BODY) {
          this.setState({
            listUserType: listusertype.data.userType,
            isLoading: false,
          });
          // message.success('Lấy dữ liệu thành công!');
          showToast("Lấy dữ liệu thành công!", 3000);
        } else {
          // message.error(listusertype.data.message
          //   ? listusertype.data.message
          //   : listusertype.data.err_msg)
          showToast(
            listusertype.data.message
              ? listusertype.data.message
              : listusertype.data.err_msg,
            2000
          );
        }

        //this.setState({image_link: profile.data.company_logo});
      } else {
        // message.error('Xảy ra lỗi trong quá trình lấy dữ liệu!');
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
      }
    }, 1000);
  }
  refresh() {
    // this.forceUpdate(async () => {
    //     let user_cookies = await getUserCookies();
    //     let token = "Bearer " + user_cookies.token;
    //     await this.getAllUser();
    // });
    this.setState({
      values: {
        username: "",
        status: 1,
        fullname: "",
        birthday: "",
        address: "",
        mobile: "",
        email: "",
        sex: 1,
        userTypeId: "",
        profileimage: "",
        password: "",
      }
    })
  }
  async getAllUser() {
    this.setState({
      isloading: true,
    });
    const dataUsers = await getAllUserSystem();
    if (dataUsers.data.SystemUser) {
      this.setState({
        listUserSystem: dataUsers.data.SystemUser,
        isloading: false,
      });
    } else {
      this.setState({
        listUserSystem: [],
        isloading: false,
      });
    }
  }
  reloadPopup = () => {
    this.setState({
      values: {
        username: "",
        status: 1,
        fullname: "",
        birthday: "",
        address: "",
        mobile: "",
        email: "",
        sex: 1,
        userTypeId: "",
        profileimage: "",
        password: "",
      },
    });
  };
  handleOnChange = (event) => {
    const { name, value } = event.target;
    const values = { ...this.state.values };
    this.setState({
      values: {
        ...values,
        [name]: value,
      },
    });
  };

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  fileChangedHandler = (event) => {
    let idCardBase64 = "";
    this.getBase64(event.target.files[0], (result) => {
      idCardBase64 = result;
      this.setState({
        values: {
          ...this.state.values,
          profileimage: idCardBase64,
        },
      });
    });
    setTimeout(() => {
      console.log("image", this.state.values.profileimage);
    }, 1000);
  };
  // let regexSpace = /\s/;
  // if (regexSpace.test(this.state.values.username)) {
  //   this.setState({
  //     isSpace: true,
  //   });
  // }
  validate = (name, value) => {
    if (name === "username") {
      if (!value) {
        return "Tên tài khoản không được bỏ trống!";
      }
      if (/\s/.test(value)) {
        return "Tên tài khoản không được bỏ có dấu cách!";
      }

    }

    if (name === "fullname") {
      return value ? "" : "Họ tên không được bỏ trống!";
    }
    if (name === "sex") {
      return value ? "" : "Giới tính không được bỏ trống!";
    }
    if (name === "status") {
      return value ? "" : "Trạng thái không được bỏ trống!";
    }
    if (name === "birthday") {
      return value ? "" : "Vui lòng chọn ngày sinh!";
    }
    // if (name === "mobile") {
    //   // if (!value) {
    //   //   return "Số điện thoại không được bỏ trống!";
    //   // }
    //   if (!/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(value)) {
    //     return "Chỉ bao gồm số";
    //   }

    // }
    // if (name === "address") {
    //   return value ? "" : "Địa chỉ không được bỏ trống!";
    // }
    // if (name === "mobile") {
    //   // if (!value) {
    //   //   return "Email không được bỏ trống!";
    //   // }
    //   if (!/ /g.test(value)) {
    //     return "Định dạng email k hợp lệ";
    //   }
    // }
    if (name === "userTypeId") {
      return value ? "" : "Loại người dùng không được bỏ trống!";
    }
    // if (name === "profileimage") {
    //   return value ? "" : "Hình ảnh không được bỏ trống!";
    // }
    if (name === "password") {
      if (!value) {
        return "Mật khẩu không được bỏ trống!";
      }
      if (value.trim().length >= 6 && value.trim().length <= 24) {
        return "";
      } else {
        return "Mật khẩu từ 6-24 và bao gôm một số!";
      }
    }
  };

  handleOnChangeDate = (date) => {
    let getDate = moment(date).format("DD/MM/YYYY");
    const values = { ...this.state.values };
    this.setState({
      values: {
        ...values,
        birthday: getDate,
      },
    });
  };
  handleOnChangeSex = (event) => {
    const { name, value } = event.target;
    let parseNumber = Number(value);
    const values = { ...this.state.values };
    this.setState({
      values: {
        ...values,
        sex: parseNumber,
      },
    });
  };
  handleBlur = (evt) => {
    const { name, value } = evt.target;
    const error = this.validate(name, value);
    const state = this.state;
    this.setState(
      {
        errors: {
          ...state.errors,
          [name]: error,
        },
      },
      () => { }
    );
  };


  handleSubmit = () => {

    let hasError = false;

    for (let key in this.state.values) {
      const error = this.validate(key, this.state.values[key]);
      if (error) {
        const state = this.state;
        this.setState((state) => {
          return {
            errors: {
              ...state.errors,
              [key]: error,
            },
          };
        });
        hasError = true;
      }
    }
    if (hasError) {
      // alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    // this.refresh();
    //   // Gọi Api thêm user
    this.addUserSystem();

    this.setState({
      resetForm: true,
    });
    // this.handleOnChange = (e) =>{
    //   const { name, value } = e.target;
    //   value = "";
    //   const values = { ...this.state.values };
    //   this.setState({
    //     values: {
    //       ...values,
    //       [name]: value,
    //     },
    //   });
    // }
  };
  //   refresh() {
  //     this.forceUpdate(async () => {
  //         let user_cookies = await getUserCookies();
  //         let token = "Bearer " + user_cookies.token;
  //         await this.getAllUser(token);
  //     });
  // }
  async addUserSystem() {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let {
      fullname,
      username,
      birthday,
      status,
      sex,
      profileimage,
      userTypeId,
      email,
      mobile,
      address,
      password,
    } = this.state.values;

    let params = {
      fullname: fullname,
      username: username,
      birthday: birthday,
      status: status,
      sex: sex,
      profileimage: profileimage,
      userTypeId: userTypeId,
      email: email,
      mobile: mobile,
      address: address,
      password: password,
    };
    await callAPI("POST", ADDUSERSYSTEM, params, token)
      .then((res) => {
        if (res) {
          console.log(res)
          if (res.data.status === true) {
            showToast("Thêm thành công!");
            this.AddChecked(true);
            let modal = $("#add-user");
            modal.modal("hide");
            this.refresh();
          }
          else {
            if (res.data.message === "Password must be 6-24 characters, including letters and digits") {
              showToast("Mật khẩu từ 6-24 ký tự và bao gồm 1 số");
            } else {
              showToast(
                res.data.message
                  ? res.data.message
                  : res.data.err_msg,
                2000
              );
            }
          }
        } else {
          showToast("Xảy ra lỗi trong quá trình thêm dữ liệu!");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  AddChecked = (checked) => {
    this.props.OnChecked(checked);
  };
  render() {
    return (
      <div
        className="modal fade"
        id="add-user"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                <i className="fa fa-star mr-1"></i>Thêm mới người dùng
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="modal-body p-0">
              <div className="container">
                <div className="row modal-userInfo-content ">
                  <div className="col-12 text-center">
                    <h4 className=" display-4">Thông tin người dùng</h4>
                  </div>
                  <div className="col-6">
                    <div className="modal-userInfo">
                      <div className="form-group mb-2">
                        <span className="mb-2">
                          Họ tên
                          <span className="mr-1" style={{ color: "red" }}>
                            *
                          </span>
                        </span>
                        <input
                          type="text"
                          placeholder="Họ tên"
                          className="form-control"
                          name="fullname"
                          onChange={this.handleOnChange}
                          // required
                          value={this.state.values.fullname}
                          onBlur={this.handleBlur}
                        />
                        {this.state.errors.fullname ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.fullname}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-group mb-2 fj-date">
                        <span className="mb-1" style={{ display: "block" }}>
                          Ngày sinh
                          <span style={{ color: "red" }}>*</span>
                          (dd/mm//yy)
                        </span>
                        <DatePicker
                          format="DD/MM/YYYY"
                          defaultValue={moment()}
                          style={{ width: "370px", height: "40px" }}
                          onChange={this.handleOnChangeDate}
                          onBlur={this.handleBlur}
                        />

                        {this.state.errors.birthday ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.birthday}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="form-group mb-2">
                        <span>
                          Giới tính <span style={{ color: "red" }}>*</span>
                        </span>
                        <select
                          name="sex"
                          onChange={this.handleOnChangeSex}
                          className="form-control"
                        // onBlur={this.handleBlur}
                        >
                          <option value="1">Nam</option>
                          <option value="2">Nữ</option>
                        </select>

                        {this.state.errors.sex ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.sex}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="modal-userInfo">
                      <div className="form-group mb-2">
                        <span>Số điện thoại</span>
                        <input
                          type="tel"
                          placeholder="Số điện thoại"
                          className="form-control"
                          name="mobile"
                          value={this.state.values.mobile}
                          onChange={this.handleOnChange}
                          onBlur={this.handleBlur}
                        />
                        {this.state.errors.mobile ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.mobile}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="form-group mb-2">
                        <span>Email</span>
                        <input
                          type="email"
                          placeholder="Email"
                          className="form-control"
                          name="email"
                          value={this.state.values.email}
                          onChange={this.handleOnChange}
                          onBlur={this.handleBlur}
                        />
                        {this.state.errors.email ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.email}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="form-group mb-2">
                        <span>Địa chỉ</span>
                        <input
                          type="text"
                          placeholder="Địa chỉ"
                          className="form-control"
                          name="address"
                          value={this.state.values.address}
                          onChange={this.handleOnChange}
                          onBlur={this.handleBlur}
                        />
                        {this.state.errors.address ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.address}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin đăng nhập  */}
                <div className="row modal-userLogin-content">
                  <div className="col-12 text-center">
                    <h4 className="display-4">Thông tin đăng nhập</h4>
                  </div>
                  <div className="col-6">
                    <div className="modal-userLogin">
                      <div className="form-group mb-2">
                        <span>
                          Tên đăng nhập <span style={{ color: "red" }}>*</span>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tên đăng nhập"
                          name="username"
                          value={this.state.values.username}
                          onChange={this.handleOnChange}
                          onBlur={this.handleBlur}
                        />
                        {this.state.errors.username ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.username}</span>
                          </div>
                        ) : (
                          ""
                        )}
                        {this.state.isSpace ? (
                          <div className="alert alert-danger">
                            <span>Tên đăng nhập không được có dấu cách</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-group showpass mb-2">
                        <span>
                          Mật khẩu <span style={{ color: "red" }}>*</span>
                        </span>
                        <div className="password-input">
                          <input
                            type={this.state.isShowPass ? "text" : "password"}
                            className="form-control"
                            placeholder="Nhập mật khẩu"
                            name="password"
                            value={this.state.values.password}
                            onChange={this.handleOnChange}
                            onBlur={this.handleBlur}
                          />
                          <span
                            onClick={() => {
                              this.setState({
                                isShowPass: !this.state.isShowPass,
                              });
                            }}
                            className="eye-show"
                          >
                            <i className="fa fa-eye-slash"></i>
                          </span>
                        </div>
                        {this.state.errors.password ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.password}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="modal-userLogin">
                      <div className="form-group mb-2">
                        <span>
                          Loại người dùng{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                        <select
                          name="userTypeId"
                          onChange={this.handleOnChange}
                          placeholder="Chọn loại người dùng"
                          className="form-control"
                          onBlur={this.handleBlur}
                        >
                          {this.state.listUserType.map((userType, index) => {
                            return (
                              <option key={index} value={userType.id}>
                                {userType.name}
                              </option>
                            );
                          })}
                          {/* <option value="User">User</option>
                             <option value="Admin">Admin</option> */}
                        </select>
                        {this.state.errors.userTypeId ? (
                          <div className="alert alert-danger">
                            <span>{this.state.errors.userTypeId}</span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="hidden-phone mb-4">
                        <span>
                          Hình Ảnh
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </span>

                        <input
                          type="file"
                          data-provide="dropify"
                          onChange={(event) => this.fileChangedHandler(event)}
                        // validations={[required]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                // onClick={this.handleResetValues}
                type="reset"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={this.reloadPopup}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={this.handleSubmit}
                style={{ backgroundColor: "#009347" }}
                className="btn btn-primary"
              >
                Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AddUser;
