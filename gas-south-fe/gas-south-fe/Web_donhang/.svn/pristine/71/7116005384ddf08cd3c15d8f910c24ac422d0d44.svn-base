import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import deleteUserAPI from "deleteUserAPI";
import getUserCookies from "getUserCookies";
import getAllStation from "../../../../api/getAllStation";
import { GETALLSTATION } from 'config';
import { ADDALLSTATION } from 'config';
import axios from 'axios';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
class Stations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      user_type: "",
      userEdit: {},
      isCreateMode: true,
      isCreateThanhtra: true,
      listStation: [],
      errorCheck: "Bắt buộc nhập (*)"
    };
  }
  refresh() {
    this.forceUpdate(async () => {
      await this.getAllUser();
      //this.setState({userEdit:{}});
    });
  }
  async deleteUser(id) {
    var answer = window.confirm("Bạn có chắc chắn muốn xóa");
    if (answer) {
      const user = await deleteUserAPI(id);

      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast("Xóa Thành Công!", 3000);
          this.refresh();
          return true;
        } else {
          showToast(
            user.data.message ? user.data.message : user.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
        return false;
      }
    }
  }
  async editUser(userEdit) {

    await this.setState({ userEdit });
    await this.setState({
      isCreateMode: false
    });

  }
  async componentDidMount() {
    var user_cookies = await getUserCookies();
    const listStation = await getAllStation(user_cookies.user.id);
    console.log("listStation", listStation.data.data)
    this.setState({
      listStation: listStation.data.data
    })

  }
  componentWillUnmount() {
      this.setState = (state,callback)=>{
          return;
      };
  }
  async submit(event) {
    event.preventDefault();
    let data = this.form.getValues();
    console.log("datatesst", data.address)
    if(data.prefix !== ""){
      this.setState({
        errorCheck: ""
      });
    } else{
      this.setState({
        errorCheck: "Bắt buộc nhập (*)"
      });
    }
    var user_cookies = await getUserCookies();
    if (user_cookies) {
      const params = {
        "name": data.namestation,
        // "factory": user_cookies.user.userType === 'Factory' ? user_cookies.user.id : "",
        "email": data.email,
        "address": data.address,
        "LAT": data.lat,
        "LNG": data.lng,
        "userType": "Region",
        "userRole": "SuperAdmin",
        "createdBy": user_cookies.user.id,
        "isChildOf": user_cookies.user.id,
        "prefix": data.prefix
      };

      await axios.post(
        ADDALLSTATION,
        params, {
        headers: {

          "Authorization": "Bearer " + user_cookies.token
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        }
      })
        .then(function (response) {
          console.log("tessssssst", response)        
          if (response.status == 200 || response.status == 201) {
            showToast("Tạo thành công")
          }
          window.location.reload()

        })
        .catch(function (err) {
          showToast("Vui lòng nhập đầy đủ thông tin.");
          console.log(err);

        });


      return data;
    }
    else {
      return "Expired Token API";
    }
  }

  newTable = async () => {
    // await this.setState({
    //   userEdit: {},
    // })
    await this.setState({
      isCreateMode: true
    })
  }
  render() {
    console.log("hehehehehe", this.state)

    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Chi nhánh</h4>
              <div className="row">
                <button
                  onClick={
                    // this.setState({ userEdit: {}, isCreateMode: true })
                    this.newTable
                  }
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-user1"
                >
                  Tạo Chi nhánh
                </button>
                {/*   <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#create-location-store">Tạo mới
                                </button>*/}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          {/*<th className="w-120px text-center">Mã </th>*/}
                          <th className="w-120px text-center align-middle">Email </th>
                          <th className="w-120px text-center align-middle">
                            Tên Chi nhánh
                          </th>

                          <th className="w-100px text-center align-middle">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listStation ? this.state.listStation.map((store, index) => {
                          return (
                            <tr key={index}>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>

                              {/*<td scope="row" className="text-center">{store.id}</td>*/}
                              <td scope="row" className="text-center">
                                {store.email == null ? "" : store.email}
                              </td>
                              <td scope="row" className="text-center">
                                {store.name == null ? "" : store.name}
                              </td>

                              <td className="text-center table-actions">
                                {this.state.user_type === "SuperAdmin" && (
                                  <a
                                    className="table-action hover-primary"
                                    data-toggle="modal"
                                    data-target="#view-report"
                                    onClick={() => {
                                      this.deleteUser(store.id);
                                    }}
                                  >
                                    <i className="ti-trash"></i>
                                  </a>
                                )}
                                <a
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#create-user"
                                  onClick={() => {
                                    this.editUser(store);
                                  }}
                                >
                                  <i className="ti-pencil"></i>
                                </a>
                              </td>
                            </tr>
                          );
                        })
                          : ''}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {<AddUserPopupContainer
          isCreateMode={this.state.isCreateMode}
          isEditForm={this.state.userEdit}
          isGeneralPage={true}
        //   refresh={this.refresh.bind(this)}
        />}

        <div className="modal fade" id="create-user1" tabIndex="-1" >
          <div className="modal-dialog modal-lg" >
            <div className="modal-content" >
              <div className="modal-header">
                <h5 className="modal-title">
                  Tạo mới chi nhánh
                  {this.props.isCreateMode
                    ? (this.props.isFactoryPage ? "Tạo Mới Thương Nhân Sở Hữu" : this.props.isGeneralPage ? "Tạo Mới Trạm" : this.props.isAgencyPage ? "Tạo Mới Hệ Thống CH Bán Lẻ" : this.props.isFactoryChildPage ? "Tạo Mới Công ty - Chi nhánh trực thuộc" : this.props.isFixerPage ? "Tạo Mới Nhà Máy Sửa Chữa" : "")
                    : (this.props.isFactoryPage ? "Chỉnh Sửa Thông Tin Thương Nhân Sở Hữu" : this.props.isGeneralPage ? "Chỉnh Sửa Thông Tin Tổng đại lý" : this.props.isAgencyPage ? "Chỉnh Sửa Thông Tin Hệ Thống CH Bán Lẻ" : this.props.isFactoryChildPage ? "Chỉnh Sửa Thông Tin Công ty - Chi nhánh trực thuộc" : this.props.isFixerPage ? "Chỉnh Sửa Thông Tin Nhà Máy Sửa Chữa" : "")}
                </h5>
                <button type="button" className="close" data-dismiss="modal"
                  onClick={this.reloadPopup}
                >
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
                          <label>Tên</label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="namestation"

                            value={
                              this.props.isEditForm
                                ? this.props.isEditForm.email
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Địa chỉ Email </label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="email"
                            name="email"

                            value={
                              this.props.isEditForm
                                ? this.props.isEditForm.email
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Địa chỉ</label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="address"

                            value={
                              this.props.isEditForm
                                ? this.props.isEditForm.email
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Tọa độ LAT</label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="lat"

                            value={
                              this.props.isEditForm
                                ? this.props.isEditForm.email
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Tọa độ LNG</label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="lng"

                            value={
                              this.props.isEditForm
                                ? this.props.isEditForm.email
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                            <label>Mã tiền tố</label>
                            <Input 
                              type="text"
                              name="prefix"
                              className="form-control"
                              disabled={this.props.isEditForm}
                              value={
                                this.props.isEditForm
                                  ? this.props.isEditForm.email
                                  : ""
                              }
                            />
                            {this.state.errorCheck !== "" ? (
                              <span style={{color: "red"}}>{this.state.errorCheck}</span>
                            ): ("")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <footer className="card-footer text-center">
                    <Button className="btn btn-primary" >Lưu</Button>
                    <button
                      className="btn btn-secondary"
                      type="reset"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                      onClick={this.reloadPopup}
                    >
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

export default Stations;
