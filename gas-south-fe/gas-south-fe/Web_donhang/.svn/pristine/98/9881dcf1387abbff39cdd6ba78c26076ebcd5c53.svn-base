import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import deleteUserAPI from "deleteUserAPI";
import getAllBranch from "../../../../api/getAllBranch";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Select } from 'antd';
import Button from "react-validation/build/button";
import required from "required";
import email from "email";
import isUppercase from "isUppercase";
import getUserCookies from "getUserCookies";
import axios from 'axios';
import { ADDBRANCH } from 'config';
import { Radio } from 'antd';
import { Row, Col } from "antd";
import { Tabs } from 'antd';
import getAllStation from "../../../../api/getAllStation"
import getAllGeneral from "../../../../api/getListGeneral"
import getAllAgency from "../../../../api/getListAgency"
import getListCustomerByType from "../../../../api/getListCustomerByType";
import Agency_General from "./Agency_General"
const { TabPane } = Tabs;
const { Option } = Select;
class Branch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStationOwn: [],
      listStationRent: [],
      usingType: '',
      userType: '',
      userRole: '',
      listBranch: [],
      listStation: [],
      listAgency: [],
      listGeneral: [],
      errorCheck: "Bắt buộc nhập (*)",
      userEdit: {},
      industrialCustomers:[]
    };
  }
  onChangeType = e => {
    this.setState({
      usingType: e.target.value
    });
    // console.log("usingType", this.state.usingType)
  };
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
    // console.log("getUserCookies", user_cookies.user.userType)
    const listStationOwn = await getAllBranch(user_cookies.user.id, "Own");
    const listStationRent = await getAllBranch(user_cookies.user.id, "Rent");
    // console.log("listBranch", listStationOwn.data)
    this.setState({
      listStationOwn: listStationOwn.data.data,
      listStationRent: listStationRent.data.data,
      userType: user_cookies.user.userType,
      userRole: user_cookies.user.userRole
    })
    this.getBranch();
  }

  async getBranch() {
    var user_cookies = await getUserCookies();
    let data = await getAllStation(user_cookies.user.id);
    let arr = []
    data.data.data.map((v, i) => {
      arr.push({
        label: v.name,
        value: i,
        id: v.id,
        userTypes: v.userType

      })
    })
    this.setState({
      listBranch: arr

    })

  }

  async submitBranch(event) {
    event.preventDefault();
    let data = this.form.getValues();
    console.log("databranch", data)
    if(data.prefix !== ""){
      this.setState({
        errorCheck: ""
      });
    } else{
      this.setState({
        errorCheck: "Bắt buộc nhập (*)"
      });
    }
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      const params = {
        "name": data.namebranch,
        "owner": user_cookies.user.id,
        // "factory": user_cookies.user.userType === 'Factory' ? user_cookies.user.id : "",
        "email": data.emailbranch,
        "address": data.address,
        "LAT": data.lat,
        "LNG": data.lng,
        "userType": "Factory",
        "userRole": "Owner",
        "createdBy": user_cookies.user.id,
        "isChildOf": user_cookies.user.id,
        "stationType": this.state.usingType,
        "prefix": data.prefix
      };

      await axios.post(
        ADDBRANCH,
        params, {
        headers: {

          "Authorization": "Bearer " + user_cookies.token
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        }
      })
        .then(function (response) {
          // console.log("datatessssssst", response)
          if (response.status == 200 || response.status == 201) {
            showToast("Tạo trạm thành công");
            this.setState({
              errorCheck: ""
            });
          }
          window.location.reload();
        })
        .catch(function (err) {
          showToast("Vui lòng nhập đầy đủ thông tin");
          console.log(err);

        });


      return data;
    }
    else {
      return "Expired Token API";
    }
  }
  async handleDetail(e) {
    // console.log("eaa", e)
    let agency = await getAllAgency(e)
    let general = await getListCustomerByType(e,"Distribution");

    let industry = await getListCustomerByType(e,"Industry");
    // console.log("Industry",industry);
    this.setState({
      listAgency: agency.data.data,
      listGeneral: general.data.data,
      industrialCustomers:industry.data.data
    });
    console.log("handleDetail", general.data.data)
    // console.log("handleDetail1", general)
  }
  async handleChangeBranch(value) {
    let arrstation = []
    // console.log("handleChangeBranch", value)

    let data = await getAllBranch(value)

    data.data.data.map((v, i) => {
      arrstation.push({
        label: v.name,
        email: v.email,
        address: v.address,
        lat: v.LAT,
        lng: v.LNG,
        id: v.id
      })
    })
    await this.setState({
      listStation: arrstation
    })
    // console.log("listStation", this.state.listStation)
  }
  newTable = async () => {
    // await this.setState({
    //   userEdit: null,
    // })
    await this.setState({
      isCreateMode: true
    })
  }
  render() {

    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Trạm</h4>
              <div className="row">
                {this.state.userType !== "Factory" ?
                  <button
                    onClick={
                      // this.setState({ userEdit: {}, isCreateMode: true })
                      this.newTable
                    }
                    style={{ marginLeft: "20px" }}
                    className="btn btn-sm btn-create"
                    data-toggle="modal"
                    data-target="#create-branch"
                  >
                    Tạo Trạm
                </button> :
                  ""
                }

                {/*   <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#create-location-store">Tạo mới
                                </button>*/}
              </div>
            </div>
          </div>
          {this.state.userType !== "Factory" ?
            <div className="card-body">
              <Row>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Trạm trực thuộc" key="1">
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
                                    Tên Trạm
                                </th>

                                  <th className="w-100px text-center align-middle">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.listStationOwn ? this.state.listStationOwn.map((store, index) => {
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

                                      {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                                      {/*     <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
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
                  </TabPane>
                  <TabPane tab="Trạm chiết thuê" key="2">
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
                                    Tên Trạm
                          </th>

                                  <th className="w-100px text-center align-middle">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.listStationRent ? this.state.listStationRent.map((store, index) => {
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
                  </TabPane>

                </Tabs>
                {/* Biểu đồ cột */}


                {/* Biểu đồ tròn */}

              </Row>

            </div>
            :
            <div className="col-lg-12 ml-1">
              <Select defaultValue="Chọn chi nhánh"
                style={{ width: 200 }}
                onChange={this.handleChangeBranch.bind(this)}
              >
                {
                  this.state.listBranch.map((v, i) => {
                    console.log("this.state.listBranch", v)
                    return (
                      <Option value={v.id} key={v.id}>{v.label}</Option>
                    )
                  })
                }

              </Select>
              <div className="table-responsive-xl mt-3">
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
                            <th className="w-120px text-center align-middle">Tên Trạm</th>
                            <th className="w-100px text-center align-middle">Địa chỉ</th>
                            <th className="w-100px text-center align-middle">Tọa độ LAT</th>
                            <th className="w-100px text-center align-middle">Tọa độ LNG</th>
                            <th className="w-100px text-center align-middle">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.listStation ? this.state.listStation.map((store, index) => {
                            console.log("this.state.listStation1", store)
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {index + 1}
                                </td>
                                <td scope="row" className="text-center">
                                  {store.email == null ? "" : store.email}
                                </td>
                                <td scope="row" className="text-center">
                                  {store.label == null ? "" : store.label}
                                </td>
                                <td scope="row" className="text-center">
                                  {store.address == null ? "" : store.address}
                                </td>
                                <td scope="row" className="text-center">
                                  {store.lat == null ? "" : store.lat}
                                </td>
                                <td scope="row" className="text-center">
                                  {store.lng == null ? "" : store.lng}
                                </td>
                                <td onClick={() => this.handleDetail(store.id)} scope="row" className="text-center">
                                  <button className="btn btn-primary" data-toggle="modal" data-target="#agency_general">
                                    Xem chi tiết
                                        </button>

                                </td>
                              </tr>
                            );
                          })
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          }

        </div>
        {<AddUserPopupContainer
          isCreateMode={this.state.isCreateMode}
          isEditForm={this.state.userEdit}
          isGeneralPage={true}
        //   refresh={this.refresh.bind(this)}
        />}
        <div className="modal fade" id="create-branch" tabIndex="-1" >
          <div className="modal-dialog modal-lg" >
            <div className="modal-content" >
              <div className="modal-header">
                <h5 className="modal-title">
                  Tạo Trạm
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
                  onSubmit={(event) => this.submitBranch(event)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Tên trạm</label>
                          <Input
                            // disabled={!this.props.isCreateMode}
                            disabled={this.props.isEditForm}
                            className="form-control"
                            type="text"
                            name="namebranch"

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
                            name="emailbranch"

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
                          <label>Chọn trạm</label>
                          <div className="form-group">
                            <Radio.Group
                              onChange={this.onChangeType}
                              value={this.state.usingType}
                              validations={[required]}
                            >
                              <Radio value="Own">Trạm trực thuộc</Radio>
                              <Radio value="Rent">Trạm chiết thuê</Radio>
                            </Radio.Group>
                          </div>
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
                                  ? this.props.isEditForm.prefix
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
        <Agency_General
          listAgency={this.state.listAgency}
          listGeneral={this.state.listGeneral}
          IndustrialCustomers={this.state.industrialCustomers}                    
        />
      </div>

    );
  }
}

export default Branch;
