import React, { Component } from "react";
import { Form, Input } from "antd";
import getUserCookies from "getUserCookies";
import { UPDATEPASSWORD } from "../../../config/config";
import callAPI from "../../../util/apiCaller";
import showToast from "showToast";
import { error } from "jquery";
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPass: false,
      isShowPass1: false,
      isShowPass2: false,
      isPassDifferent : false,
      values: {
        username: "",
        systemUserId: "",
        password: "",
        newpassword: "",
        confirmnewpassword: "",
      },
      errors: {
        // systemUserId: "",
        password: "",
        newpassword: "",
        confirmnewpassword: "",
      },
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.dataUpdate) {
      this.setState({
        values: {
          username: nextProps.dataUpdate.username,
          systemUserId: nextProps.dataUpdate.id,
          password: "",
          newpassword: "",
          confirmnewpassword: "",
        },
      });
    }
  }

  validate = (name, value) => {
    if (name === "password") {
      if(!value){
        return "Mật khẩu không được bỏ trống!"
      }
      if(value.trim().length >= 6 && value.trim().length <=24 ){
        return ""
      }else{
        return "Mật khẩu từ 6-24 và bao gôm một số!";
      }
    }
    if (name === "newpassword") {
      if(!value){
        return "Mật khẩu không được bỏ trống!"
      }
      if(value.trim().length >= 6 && value.trim().length <=24 ){
        return ""
      }else{
        return "Mật khẩu từ 6-24 và bao gôm một số!";
      }
    }
    if (name === "confirmnewpassword") {
      if(!value){
        return "Mật khẩu không được bỏ trống!"
      }
      if(value.trim().length >= 6 && value.trim().length <=24 ){
        return ""
      }else{
        return "Mật khẩu từ 6-24 và bao gôm một số!";
      }
    }
  };
  handleBlur = (evt) => {
    const { name, value } = evt.target;
    // console.log(name, value);
    const error = this.validate(name, value);
    const state = this.state;
    this.setState(
      {
        errors: {
          ...state.errors,
          [name]: error,
        },
      },
      () => {}
    );
  };
  onChange = (e) => {
    let { name, value } = e.target;
    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
    });
  };


  handleSubmit = (e) => {
    let hasError = false;
    let values  = this.state.values;
    for (let key in this.state.values) {
      const erorr = this.validate(key, this.state.values[key]);
      // console.log("error" , erorr);
      if (erorr) {
        const state = this.state;
        this.setState((state) => {
          return {
            errors: {
              ...state.errors,
              [key]: erorr,
            },
          };
        });
      }
      // console.log("error" , this.state.errors);
      hasError = true;
    }
    if (hasError) {
      showToast("Vui lòng kiểm tra lại thông tin!");
      // alert("123")
    } 
    if(values.newpassword !== values.confirmnewpassword){
        this.setState({
          isPassDifferent : !this.state.isPassDifferent
        })
      return;
    }
    
      this.CreateNewPassword();
    
  };

  async CreateNewPassword() {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let {
      systemUserId,
      password,
      newpassword,
      confirmnewpassword,
    } = this.state.values;
    let params = {
      systemUserId: systemUserId,
      password: password,
      newpassword: newpassword,
      confirmnewpassword: confirmnewpassword,
    };
    await callAPI("POST", UPDATEPASSWORD, params, token).then((response) => {
      console.log("response update", response);
      if( response.data.message === "Password is incorrect. Please check out again."){
        showToast("Mật khẩu cũ không đúng");
      }if(response.data.message==="New Password must be 6-24 characters, including letters and digits"){
        showToast("Mật khẩu bao gồm 6-24 ký tự và một số");
      }
      if (response.data.status === false) {
        showToast("Đổi mật khẩu thất bại!");
      } else {
        showToast("Đổi mật khẩu thành công!");
        window.location.reload(false);
      }
    });
  }
  render() {
    let { username } = this.state.values;
    // console.log("error", this.state.errors);
    // console.log("error", this.state.values);
    return (
      <div className="modal fade" id="change-password" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fa fa-star mr-1"></i>Thay đổi mật khẩu
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
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <div className="modal-body p-0">
                <div className="container">
                  <div className="row modal-userInfo-content mb-3">
                    <div className="col-12 text-center">
                      <h4 className=" display-4">Thay đổi thông tin</h4>
                    </div>
                    <div className="col-12">
                      <div className="modal-userInfo ">
                        <div className="row">
                          <div className="col-6">
                            <Form.Item className="lnd_input ">
                              <label className="mb-0 d-block">
                              Tên đăng nhập <span style={{color : "red"}}>*</span>
                              </label>
                              <Input
                              placeholder="Tên đăng nhập"
                              name="username"
                              onChange={this.onChange}
                              value={username}
                              disabled
                              />
                            </Form.Item>
                          </div>
                          <div className="col-6">
                            <Form.Item className="lnd_input showpass">
                              <label className="mb-0 d-block">
                              Mật khẩu cũ<span style={{color : "red"}}>*</span>
                              </label>
                              <div className="password-input">
                                <Input
                                placeholder="Nhập mật khẩu cũ"
                                name="password"
                                onChange={this.onChange}
                                // onChange={this.onChange}
                                onBlur={this.handleBlur}
                                type={this.state.isShowPass ? "text" : "password"}
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
                              <div className="alert alert-danger alert alert-danger--custom">
                              <span>{this.state.errors.password}</span>
                              </div>
                              ) : (
                              ""
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="modal-userInfo ">
                        <div className="row">
                              <div className="col-6">
                                <Form.Item className="lnd_input showpass">
                                <label className="mb-0 d-block">
                                Mật khẩu mới <span style={{color : "red"}}>*</span>
                                </label>
                                <div className="password-input">
                                  <Input
                                  placeholder="Nhập mật khẩu mới"
                                  name="newpassword"
                                  onChange={this.onChange}
                                  onBlur={this.handleBlur}
                                  type={this.state.isShowPass1 ? "text" : "password"}
                                  />
                                  <span
                                  onClick={() => {
                                  this.setState({
                                  isShowPass1: !this.state.isShowPass1,
                                  });
                                  }}
                                  className="eye-show"
                                  >
                                  <i className="fa fa-eye-slash"></i>
                                  </span>
                                </div>
                                {this.state.errors.newpassword ? (
                                <div className="alert alert-danger alert alert-danger--custom">
                                <span>{this.state.errors.newpassword}</span>
                                </div>
                                ) : (
                                ""
                                )}
                              </Form.Item>
                              </div>
                              <div className="col-6">
                                  <Form.Item className="lnd_input showpass">
                                    <label className="mb-0 d-block">
                                    Nhập lại mật khẩu mới<span style={{color : "red"}}>*</span>
                                    </label>
                                    <div className="password-input">
                                    <Input
                                    placeholder=" Nhập lại mật khẩu mới"
                                    name="confirmnewpassword"
                                    onChange={this.onChange}
                                    onBlur={this.handleBlur}
                                    type={this.state.isShowPass2 ? "text" : "password"}
                                    />
                                    <span
                                    onClick={() => {
                                    this.setState({
                                    isShowPass2: !this.state.isShowPass2,
                                    });
                                    }}
                                    className="eye-show"
                                    >
                                    <i className="fa fa-eye-slash"></i>
                                    </span>
                                    </div>
                                    {this.state.errors.confirmnewpassword ? (
                                    <div className="alert alert-danger alert alert-danger--custom">
                                    <span>{this.state.errors.confirmnewpassword}</span>
                                    </div>
                                    ) : (
                                    ""
                                    )}
                                    {this.state.isPassDifferent ? <div className="alert alert-danger alert alert-danger--custom">
                                    <span>Mật khẩu mới không trùng khớp!</span>
                                    </div> :"" }
                                  </Form.Item>
                              </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={this.handleSubmit}
                  style={{ backgroundColor: "#009347" }}
                  className="btn btn-primary"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default ChangePassword;
