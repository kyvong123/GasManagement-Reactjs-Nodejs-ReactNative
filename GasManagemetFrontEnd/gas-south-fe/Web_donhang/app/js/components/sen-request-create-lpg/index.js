import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from "react-validation/build/select";
import Select from "react-select";
import Button from "react-validation/build/button";
import required from "required";
import isUppercase from "isUppercase";
import showToast from "showToast";
import { Radio } from 'antd';
import Constants from "Constants";
import getUserCookies from "./../../helpers/getUserCookies";
import getAllManufacturer from "getAllManufacturer";
import { IMPORTCYLINDERBYEXCEL } from './../../config/config';
import { GETLISTMANUFACTURE } from './../../config/config';
import callApi from "./../../util/apiCaller";
import sendReqCreFromExcelAPI from "./../../../api/sendRequestCreateCylinder";
let file = null;
class RequestExcel extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      usingType: "",
      manufacture: "",
      listManufacturers: [],
      message: "",
      messageErr: ""
    };
  }

  onChangeType = e => {
    this.setState({
        usingType: e.target.value
    });
  };

  async componentDidMount() {
    const user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let param = {
      isChildOf: user_cookies.user.isChildOf
    }
    await callApi("POST", GETLISTMANUFACTURE, param, token).then(res=>{
      console.log("ressss", res.data);
      if(res.data) {
        if (res.data.status === true) {
          console.log("Lay thuong hieu thanh cong!");
          let listArrManufacture = [];
          for (let i = 0; i < res.data.data.length; i++)
          {
              listArrManufacture.push({
                    value: res.data.data[i].id,
                    label: res.data.data[i].name,
                    ...res.data.data[i],
              })
          }
          this.setState({
            listManufacturers: listArrManufacture
          })
        }
        else {
          showToast(res.data.data.message ? res.data.data.message : res.data.data.err_msg, 2000);
          }
          //this.setState({image_link: profile.data.company_logo});
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    })
  }

  handleChangeManufacture = (langValue) => {
    this.setState({
        manufacture: langValue
    })
  }

  handleFileUpload(event) {
    file = event.target.files[0];
  }

  //cmt
  async submit(event) {
    event.preventDefault();
    if (!file) 
      showToast("Vui lòng chọn file!", 3000);
    else 
    {
      const user_cookies = await getUserCookies();
      /*let data = new FormData();
      
      data.append('upload_file', file);
      data.append('id_ReqTo',user_cookies.user.owner);
      data.append('classification',this.state.usingType);
      data.append('manufacture',this.state.manufacture.id);
      for (var p of data) {
        console.log("ppppp",p);
      }
      console.log("dadddda", data)
      console.log("dadddda111", user_cookies.user.owner)
      console.log("dadddda222", this.state.usingType)


      let token = "Bearer " + user_cookies.token;
      await callApi("POST", IMPORTCYLINDERBYEXCEL, data, token).then(res=>{
        //console.log(user_cookies.user.owner);
          console.log(res.data);
                
          if(res.data.err)
          {
            alert(res.data.err);
          }
          else if(!res.data.err){
            alert("Tạo thành công");
          };
          if (res) {
            const modal = $("#create-request-excel");
            modal.modal("hide");
          }
          window.location.reload();
      })
    }
    //console.log(user_cookies);*/
      console.log(user_cookies);
      const result = await sendReqCreFromExcelAPI(file, user_cookies.user.owner, this.state.usingType, this.state.manufacture.id);
      console.log('result', result);
      if (result && result.status === 200) {
        if (result.data.status === false && result.data.err !== "") {
            const dataErr = result.data.err.replace(/;/g, "\n")
            this.setState({ messageErr: dataErr })
            //showToast(dataErr, 3000);
        }
        else {
            this.setState({ message: 'Tất cả mã nhập vào hệ thống để gửi yêu cầu đều thành công' })
            //showToast('Tất cả mã nhập vào hệ thống đều thành công', 3000);
            console.log('result', result);
        }
        window.location.reload();
        return;
      }
      else 
      {
          showToast("Xảy ra lỗi trong quá trình gửi request. Vui lòng kiểm tra lại dữ liệu", 2000);
      }
      $("#create-request-excel").modal('hide');
      return;
    }
  }

  render() {
    return (
      <div className="modal fade" id="create-request-excel" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo bình</h5>
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
                        <label>Chọn file excel </label>
                        <div style={{display: "flex"}}>
                          <Input
                            //  disabled={this.props.isEditForm}
                            className="form-control"
                            type="file"
                            name="fileexcel"
                            id="fileexcel"
                            onChange={this.handleFileUpload}
                            validations={[required]}
                          />
                          <input type="reset"/>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Phân loại</label>
                            <div className="form-group">
                                <Radio.Group
                                    onChange={this.onChangeType}
                                    value={this.state.usingType}
                                    validations={[required]}
                                >
                                    <Radio value="New">Bình sản xuất mới</Radio>
                                    <Radio value="Old">Bình sửa chữa</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Thương hiệu</label>
                            <div className="form-group">
                                <Select
                                    onChange={this.handleChangeManufacture.bind(this)}
                                    placeholder="Chọn..."
                                    options={this.state.listManufacturers}
                                    value={this.state.manufacture}>
                                </Select>
                            </div>
                        </div>
                    </div>
                  </div>
                  {this.state.messageErr !== "" 
                  ? (<div className="row">
                      <label style={{
                          color: "#f96868",
                          fontSize: 12,
                          whiteSpace: "pre-line"
                      }}>
                        {this.state.messageErr}
                      </label>
                  </div>) 
                  : null}
                  {this.state.message !== "" 
                  ? (<div className="row">
                      <label style={{
                          color: "#15c377",
                          fontSize: 12,
                          whiteSpace: "pre-line"
                      }}>
                        {this.state.message}
                      </label>
                    </div>) 
                  : null}
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary">Lưu</Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    Đóng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestExcel;
