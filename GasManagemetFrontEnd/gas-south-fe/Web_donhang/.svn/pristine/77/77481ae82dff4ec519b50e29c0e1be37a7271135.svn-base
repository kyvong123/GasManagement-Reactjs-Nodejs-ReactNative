import React from "react";
import { Link } from "react-router";
import ProTypes from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import email from "email";
import ReactCustomLoading from "ReactCustomLoading";

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
  }

  render() {
    // const a = 5
    return (
      <Form ref={(c) => (this.form = c)} className="form-type-material">
        <ReactCustomLoading isLoading={this.props.isLoading} />
        {/*<div>*/}
        {/*    <label>5</label>*/}
        {/*</div>*/}
        <div className="form-group">
          <label htmlFor="email">Địa chỉ Email</label>
          <br />
          <Input
            type="text"
            name="email"
            className="seednet-input-block"
            placeholder="Nhập địa chỉ Email"
            id="email"
            validations={[required]}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <br />
          <Input
            name="password"
            type="password"
            className="seednet-input-block"
            placeholder="Nhập mật khẩu"
            id="password"
            validations={[required]}
          />
        </div>

        <div className="form-group flexbox">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" checked />
            <label className="custom-control-label">Ghi nhớ đăng nhập</label>
          </div>
          {/* <Link to='/forgot-password'><a className="text-muted hover-primary fs-13" >Quên mật
                        khẩu?</a></Link> */}
        </div>
        <div
          className={
            this.props.loginResult
              ? "alert alert-danger d-none"
              : "alert alert-danger"
          }
          role="alert"
        >
          Thông tin không chính xác
        </div>
        <div className="form-group">
          <Button
            className="btn btn-block btn-bold log-in__btn"
            type="submit"
            onClick={(event) => {
              this.props.login(
                this.form.getValues().email,
                this.form.getValues().password
              );
              event.preventDefault();
            }}
          >
            ĐĂNG NHẬP
          </Button>
        </div>
      </Form>
    );
  }
}

MyForm.proTypes = {
  login: ProTypes.func.isRequired,
  loginResult: ProTypes.bool.isRequired,
  messageError: ProTypes.string.isRequired,
  isLoading: ProTypes.bool.isRequired,
};

export default MyForm;
