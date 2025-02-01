import React, { Component } from "react";
import "./indec.scss";
import getUserCookies from "../../helpers/getUserCookies";
import axios from "axios";
import { Row, Col, Select } from "antd";
import { CHANGEPASSWORD } from './../../config/config';
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      value: {
        oldPassWord: "",
        newPassWord: "",
        newPassWordAgain: "",
        email: ''
      },
      errors: {
        newPassWord: "",
        newPassWordAgain: "",
      },
      formValid: false,
      newPassWordValid: false,
      newPassWordAgainValid: false,


    };
  }
  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };
  onSave = async (e) => {
    e.preventDefault();
    let { oldPassWord, newPassWord, newPassWordAgain } = this.state;
    if (!oldPassWord || !newPassWordAgain || !newPassWord) {
      alert("vui lòng nhập đầy đủ thông tin");
    } else if (newPassWord !== newPassWordAgain) {
      alert("Bạn nhập 2 mật khẩu mới không giống nhau");
    } else {
      let data;
      var user_cookie = await getUserCookies();
      if (user_cookie) {
        let params = {
          "email": user_cookie.user.email,
          "password": oldPassWord,
          "new_password": newPassWord,
          "new_password_confirm": newPassWordAgain,
        };
        await axios
          .post(CHANGEPASSWORD, params, {
            headers: {
              Authorization: "Bearer " + user_cookie.token,
              /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            },
          })
          .then(function (response) {
            //console.log(response);
            alert("Đổi mật khẩu thành công");
            window.location.href = "/#/login"
          })
          .catch(function (err) {
            alert("Mật khẩu cũ sai. Vui lòng xem lại");
          });

        return data;
      } else {
        alert("Bạn chưa đăng nhập");
        return "Expired Token API";
      }
    }
  };
  async componentWillMount() {
    var user_cookie = await getUserCookies();
    this.setState({
      email: user_cookie.user.email
    })
  }

  handleErrors = e => {
    let { name, value } = e.target;
    let message = value === "" ? "Xin vui lòng nhập vô đây" : "";
    let { newPassWordValid, newPassWordAgainValid } = this.state;
    var pattern = new RegExp(
      "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
      "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
      "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
    );
    var number = /^[0-9]+$/;
    switch (name) {
      case "newPassWord":
        newPassWordValid = message === "" ? true : false;
        if (value && (value.length < 6 && value.match(pattern) && value.match(number))) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
          newPassWordValid = false;

        } else if (value && value.match(number)) {

          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

          newPassWordValid = true;

        } else if (value && value.match(pattern)) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

          newPassWordValid = true;
        } else if (value && value.length < 6) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

          newPassWordValid = true;
        }
        break;

      case "newPassWordAgain":
        newPassWordAgainValid = message === "" ? true : false;
        if (value && (value.length < 6 && value.match(pattern) && value.match(number))) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
          newPassWordValid = false;
        } else if (value && value.length < 6) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
          newPassWordValid = true;
        } else if (value && value.match(pattern)) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
          newPassWordValid = false;
        } else if (value && value.match(number)) {
          message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
          newPassWordValid = false;
        }
    }
    this.setState({
      errors: { ...this.state.errors, [name]: message },
      newPassWordValid,
      newPassWordAgainValid
    }, () => {
      this.FormValidation();

    })
  }

  FormValidation = () => {
    this.setState({
      formValid: this.state.newPassWordValid && this.state.newPassWordAgainValid
    })
  }
  render() {
    return (
      <div className="div-form-change-pass">
        <Row>
          <Col xs={2} md={5} lg={7}></Col>
          <Col xs={20} md={14} lg={10}>
            <form onSubmit={this.onSave} className="form-chang-pass">
              <h4>Đổi mật khẩu</h4>
              <div className="text-input">
                <label className="label">{this.state.email}</label>
                <div className="form-group">
                  <div className="input">
                    <label>Nhập mật khẩu cũ</label>
                    <input
                      onChange={this.onChange}
                      type="password"
                      className="form-control"
                      placeholder="Nhập mật khẩu"
                      name="oldPassWord"

                    />
                  </div>

                  <div className="input">
                    <label>Nhập mật khẩu mới</label>
                    <input
                      onChange={this.onChange}
                      type="password"
                      className="form-control"
                      placeholder="Nhập mật khẩu mới"
                      name="newPassWord"
                      onBlur={this.handleErrors}
                      onKeyUp={this.handleErrors}
                    />
                    {this.state.errors.newPassWord === "" ? "" : (<div className="alert alert-danger">{this.state.errors.newPassWord}</div>)}

                  </div>
                  <div className="input">
                    <label>Nhập lại mật khẩu mới</label>
                    <input
                      onChange={this.onChange}
                      type="password"
                      className="form-control"
                      placeholder="Nhập lại mật khẩu mới"
                      name="newPassWordAgain"
                      onBlur={this.handleErrors}
                      onKeyUp={this.handleErrors}
                    />
                    {this.state.errors.newPassWordAgain === "" ? "" : (<div className="alert alert-danger">{this.state.errors.newPassWordAgain}</div>)}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary"
                  disabled={!this.state.formValid}
                >
                  Đổi mật khẩu
              </button>
              </div>



            </form>
          </Col>
          <Col xs={2} md={5} lg={7}></Col>
        </Row>
      </div>
    );
  }
}

export default ChangePassword;


