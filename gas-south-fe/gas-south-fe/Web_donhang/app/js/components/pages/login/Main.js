import React from "react";
import { Link } from "react-router";
import FormContainer from "./FormContainer.js";
import "./main.scss";
import OneSignal from 'react-onesignal';

class Main extends React.Component {
  constructor(props) {
    super(props);    
  }

  
  render() {
    const  sendNote=()=>{
      // OneSignal.init({
      //   appId: "8f2c576d-d40e-4e63-a95b-e64064a8e353"
      // });
    }
    return (
      <main className="main-login-container">
        <div className="main-logo-login">
          <img src="assets/img/gas-south-logo.png" alt="LOGO" />
        </div>
        {sendNote()}
        <div className="form-login">
          <div className="login">
            <h2 style={{ fontWeight: "bold" }}> Đăng nhập</h2>
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
