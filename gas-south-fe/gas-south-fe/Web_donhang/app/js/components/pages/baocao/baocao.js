import React from "react";
import { Button, Input, Col, Icon, Form, Option, Select } from "antd";
import "./index.scss";
import { SEND_REPORT } from "../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "getUserCookies";
import showToast from "showToast";
class baocao extends React.Component {
  constructor(props) {
    super(props);
    // this.form = null;
    this.state = {
      title: "",
      content: "",
      valueAPI: "CH",
      appname: "Gassouth",
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeAPI = this.changeAPI.bind(this);
    this.changeApp = this.changeApp.bind(this);
  }
  changeAPI(value) {
    this.setState({ valueAPI: value });
  }
  changeApp(value) {
    this.setState({ appname: value });
  }
  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }
  handleChangeContent(event) {
    this.setState({ content: event.target.value });
  }

  async handleSubmit(event) {
    console.log(this.state.appname);
    let params = {
      appname: this.state.appname,
      title: this.state.title,
      data: this.state.content,
      type: this.state.valueAPI,
    };
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;

    if (this.state.title.length > 5 && this.state.content.length > 10) {
      await callApi("POST", SEND_REPORT, params, token).then(
        // console.log(params),
        (res) => {
          console.log("Thanh cong", res);
          showToast("Gửi Thành Công", 5000);
        }
      );
    } else {
      showToast(
        "Vui lòng nhập tiêu đề hơn 5 ký tự và nội dung hơn 10 ký tự",
        3000
      );
    }

    await this.setState({ title: "", content: "" });
  }

  render() {
    console.log(this.state.appname);
    const { Option } = Select;
    const { TextArea } = Input;
    const lableStyle = {
      width: "10%",
      //paddingLeft: "20px",
      margin: "4px",
    };
    const colStyle = {
      display: "flex",
      height: "60px",
      padding: "6px",
      paddingLeft: "25px",
      border: "0.5px solid DarkGrey",
      width: "100%",
      background: "#009347",
    };
    const buttonStyle = {
      width: "140px",
      // padding: "6px",
      marginTop: "4px",
    };
    const colStyleN = {
      display: "flex",
      height: "100px",
      padding: "5px",
      paddingLeft: "25px",
      border: "0.5px solid DarkGrey",
      width: "100%",
      background: "#009347",
    };
    const inputTitle = {
      height: "40px",
      width: "50%",
      marginTop: "4px",
    };
    return (
      <div className="main-content">
        <div className="card-title">
          <div className="flexbox">
            <h4>Gửi Thông Báo</h4>
            <div className="content">
              Chọn gửi thông báo đến:
              <Select
                style={{ width: 200 }}
                className="ml-2"
                name="status"
                onChange={this.changeApp}
                defaultValue="Gassouth"
              >
                <Option value="Gassouth">Gassouth</Option>
                <Option value="GasOnline">GasOnline</Option>
                <Option value="Driver">Driver</Option>
              </Select>
            </div>
            <div className="content">
              Chọn loại thông báo
              <Select
                style={{ width: 200 }}
                className="ml-2"
                name="status"
                onChange={this.changeAPI}
                defaultValue="CH"
              >
                <Option value="CH">Thông Báo</Option>
                <Option value="KM">Thông báo khuyến mãi</Option>
              </Select>
            </div>
          </div>
        </div>
        <Form
          ref={(c) => {
            this.form = c;
          }}
          className="card"
          onSubmit={this.handleSubmit}
        >
          <Col style={colStyle} row={6}>
            <lable style={lableStyle} row={6}>
              <h6 style={{ color: "white" }}>Tiêu Đề</h6>
            </lable>
            <Input
              value={this.state.title}
              style={inputTitle}
              onChange={this.handleChangeTitle}
            ></Input>
          </Col>

          <Col style={colStyleN}>
            <label style={lableStyle}>
              <h6 style={{ color: "white" }}>Nội Dung</h6>
            </label>
            <TextArea
              className="textArea"
              row={2}
              value={this.state.content}
              onChange={this.handleChangeContent}
            ></TextArea>
          </Col>

          <Button
            type="submit"
            style={buttonStyle}
            onClick={() => this.handleSubmit(event)}
            className="buttonStyle"
          >
            <Icon type="export" className="fa" />
            Gửi Thông Báo
          </Button>
        </Form>
      </div>
    );
  }
}

export default baocao;
