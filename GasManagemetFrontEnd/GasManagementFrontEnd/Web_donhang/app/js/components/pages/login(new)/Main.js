import React from "react";
import { Link } from "react-router";
import FormContainer from "./FormContainer.js";
import "./main.scss";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="main-login-container">
        <div className="main-logo-login">
          <img src="assets/img/gas-south-logo.png" alt="LOGO" />
        </div>

        <div className="form-login">
          <div className="login">
            <h2 style={{ fontWeight: "bold" }}> Đăng nhập (Mới)</h2>
            <p>
              <small> Đăng nhập vào hệ thống bằng tài khoản của bạn. </small>
            </p>

            <FormContainer />
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
