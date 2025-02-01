import React, { Component } from "react";
import "./indec.scss";
import getUserCookies from "../../helpers/getUserCookies";
//import axios from "axios";
import { Row, Col } from "antd";
import { CHANGINFOREUSER } from "../../config/config";
import axios from 'axios';
import callApi from "../../util/apiCaller";
import { GETAVATARUSER, URLSERVERIMAGE, GETUSERINFOR } from '../../config/config';
//import { browserHistory } from 'react-router';
class ChangeInformationUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      nameUser: "",
      address: "",
      avatar: "",
      srcImage: "",
      selectedFile: null,

    };
  }
  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    // console.log(value)
    this.setState({
      [name]: value,
    });
  };
  // getBase64(file, cb) {
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     cb(reader.result);
  //   };
  //   reader.onerror = function (error) {
  //     console.log("Error: ", error);
  //   };
  // }
  fileChangedHandler = (event) => {
    //this.setState({selectedFile: event.target.files[0]})

    // let idCardBase64 = "";
    // this.getBase64(event.target.files[0], (result) => {
    //   idCardBase64 = result;
    //   this.setState({ avatar:idCardBase64 },()=>console.log(this.state.avatar));
    // });
    let srcImage = URL.createObjectURL(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0],
      srcImage: srcImage
    })
  };
  onSave = async (e) => {
    e.preventDefault();
    //let {history}=this.props;
    let { nameUser, address, selectedFile } = this.state;
    if (!nameUser || !address) {
      alert("vui lòng nhập đầy đủ thông tin");
    }
    else {
      let form_data = new FormData();
      var user_cookie = await getUserCookies();
      if (user_cookie) {
        form_data.append("avatar", selectedFile);
        form_data.append("email", user_cookie.user.email);
        form_data.append("name", nameUser);
        form_data.append("address", address);
        let token = "Bearer " + user_cookie.token;
        let config = {
          headers: {
            Authorization: token,
            'content-type': 'multipart/form-data',
          },
        }
        await axios.post(CHANGINFOREUSER, form_data, config)
          .then(async (res) => {

            let params = {
              id: user_cookie.user.id
            }
            await callApi("POST", GETUSERINFOR, params, token).then(res1 => {
              //console.log(res1.data.data)
              this.setState({
                srcImage: res1.data.data ? URLSERVERIMAGE + res1.data.data.avatar : '',
                email: res1.data.data.email,
                nameUser: res1.data.data.name
              })
              alert("Cập nhật thành công");
              // window.location.reload(false);
            })
            //window.location.reload(false);
            //history.goBack();
          }).catch(err => alert(err.message));
      } else {
        alert("Bạn chưa đăng nhập");
        return "Expired Token API";
      }
    }
  };
  async componentDidMount() {
    var user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      "email": user_cookie.user.email
    }
    await callApi('POST', GETAVATARUSER, params, token).then(res => {
      console.log(res.data);
      this.setState({
        srcImage: res.data.data ? URLSERVERIMAGE + res.data.data : ''
      })
    })
    let paramsId = {
      id: user_cookie.user.id
    }
    await callApi("POST", GETUSERINFOR, paramsId, token).then(res1 => {
      console.log("user infor:", res1.data.data)
      this.setState({
        srcImage: res1.data.data ? URLSERVERIMAGE + res1.data.data.avatar : '',
        email: res1.data.data.email,
        nameUser: res1.data.data.name,
        address: res1.data.data.address
      })
    })
  }
  render() {
    let { nameUser, address, srcImage } = this.state;
    return (
      <div className="div-form-change-user">
        <Row>
          <Col xs={2} md={5} lg={7}></Col>
          <Col xs={20} md={14} lg={10}>
            <form onSubmit={this.onSave} className="form-chang-user">
              <h4>Thay đổi thông tin</h4>
              <div className="text-input">
                <label className="label">{this.state.email}</label>
                <div className="form-group">
                  <div className="input div-img-in-but">
                    <label>Thay đổi ảnh đại diện</label>
                    <div className="div-image-upload">
                      <img src={srcImage}></img>
                      <div className="button-input">
                        <input
                          // onChange={this.onChange}
                          type="file"
                          className="form-control"
                          name="avatar"
                          onChange={(event) =>
                            this.fileChangedHandler(event)
                          }
                        />
                        <button class="btn btn-default">Tải ảnh lên</button>

                      </div>
                    </div>
                  </div>

                  <div className="input">
                    <label>Tên</label>
                    <input
                      onChange={this.onChange}
                      type="type"
                      className="form-control"
                      value={nameUser}
                      name="nameUser"
                    />
                  </div>
                  <div className="input">
                    <label>Địa chỉ</label>
                    <input
                      onChange={this.onChange}
                      type="text"
                      className="form-control"
                      name="address"
                      value={address}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Lưu lại
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

export default ChangeInformationUser;
