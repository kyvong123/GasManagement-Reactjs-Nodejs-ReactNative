import React, { Component } from "react";
import getUserCookies from "getUserCookies";
import callAPI from "../../../util/apiCaller";
import { UPDATEUSERSYSTEM } from "../../../config/config";
import getAllUserType from "../../../../api/getAllUserTypeAPI";
import Constants from "Constants";
import showToast from "showToast";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from "antd";
import moment from "moment";
import { event } from "jquery";
class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateList: [],
      listUserType: [],
      isCheck: false,
      values: {
        username: "",
        status: 1,
        fullname: "",
        birthday: "",
        address: "",
        mobile: "",
        email: "",
        sex: 1,
        userTypeId: "",
        profileimage: "",
        systemUserId: "",
        userTypename: "",
      },

      errors: {
        username: "",
        status: "",
        fullname: "",
        birthday: "",
        address: "",
        mobile: "",
        email: "",
        sex: "",
        userTypeId: "",
        profileimage: "",
      },
    };
  }
  componentDidMount() {
    this.getAllUserType();
  }
  async getAllUserType() {
    // this.setState({ isLoading: true });
    const listusertype = await getAllUserType();
    setTimeout(() => {
      if (listusertype) {
        if (listusertype.status === Constants.HTTP_SUCCESS_BODY) {
          this.setState({
            listUserType: listusertype.data.userType,
            isLoading: false,
          });
          // message.success('Lấy dữ liệu thành công!');
          showToast("Lấy dữ liệu thành công!", 3000);
        } else {
          // message.error(listusertype.data.message
          //   ? listusertype.data.message
          //   : listusertype.data.err_msg)
          showToast(
            listusertype.data.message
              ? listusertype.data.message
              : listusertype.data.err_msg,
            2000
          );
        }

        //this.setState({image_link: profile.data.company_logo});
      } else {
        // message.error('Xảy ra lỗi trong quá trình lấy dữ liệu!');
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
      }
    }, 1000);
  }
  async componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.dataUpdate) {
      this.setState({
        values: {
          username: nextProps.dataUpdate.username,
          status: 1,
          fullname: nextProps.dataUpdate.fullname,
          birthday: nextProps.dataUpdate.birthday,
          address: nextProps.dataUpdate.address,
          mobile: nextProps.dataUpdate.mobile,
          email: nextProps.dataUpdate.email,
          sex: 1,
          profileimage: nextProps.dataUpdate.profileimage,
          systemUserId: nextProps.dataUpdate.id,

        },
      });
      if (nextProps.dataUpdate && nextProps.dataUpdate.userTypeId) {
        this.setState({
          userTypeId: nextProps.dataUpdate.userTypeId.id ? nextProps.dataUpdate.userTypeId.id : "",
          userTypename: nextProps.dataUpdate.userTypeId.name ? nextProps.dataUpdate.userTypeId.name : "",
        })
      }
    } else {
      this.setState({
        value: {
          username: "",
          status: 1,
          fullname: "",
          birthday: "",
          address: "",
          mobile: "",
          email: "",
          sex: 1,
          userTypeId: "",
          profileimage: "",
        },
      });
    }
  }

  onChange = (e) => {
    // let target = e.target;
    // let name = target.name;
    // let value = target.value;
    let { name, value } = e.target;
    // if(e.target.name === 'birthday'){
    //   this.setState({
    //     values:{
    //       ...this.state.values,
    //       birthday : moment(date).format("DD/MM/YYYY"),
    //     }
    //   } , ()=>{
    //   })
    // }
    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
    });
  };
  onChangeDate = (evt) => {
    let getDate = moment(evt).format("DD/MM/YYYY");
    // const { name, value } = evt.target;

    this.setState({
      values: {
        ...this.state.values,
        birthday: getDate,
      },
    });
  };

  handleSubmit = () => {
    this.updateUser();
  };
  async updateUser() {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    // let userSystemId = user_cookies.user.id;
    let updateBy = user_cookies.user.id;
    let {
      username,
      fullname,
      birthday,
      email,
      status,
      sex,
      address,
      mobile,
      profileimage,
      userTypeId,
      systemUserId,
    } = this.state.values;
    let params = {
      username: username,
      status: 1,
      fullname: fullname,
      birthday: birthday,
      address: address,
      mobile: mobile,
      email: email,
      sex: 1,
      userTypeId: userTypeId,
      profileimage: profileimage,
      updateBy: updateBy,
      systemUserId: systemUserId,
    };
    await callAPI("POST", UPDATEUSERSYSTEM, params, token).then((response) => {
      if (response.data.status === false) {
        // alert("Cập nhật thất bại");
      } else {
        showToast("Cập nhật thành công!");

        // alert("Cập nhật thành công");
        window.location.reload(false);
      }
    });
  }

  onChangeselect = (evet) => {
    const { name, value } = evet.target;
    this.setState({
      values: {
        ...this.state.values,
        userTypeId: value,
      },
    });
  };
  render() {
    const { dataUpdate } = this.props;

    let {
      username,
      fullname,
      birthday,
      email,
      status,
      sex,
      address,
      mobile,
      profileimage,
      userTypeId,
    } = this.state.values;
    return (
      <div className="modal fade" id="update-user" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fa fa-star mr-1"></i>Cập nhật người dùng
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
            // labelCol={{ span: 4 }}
            // wrapperCol={{ span: 14 }}
            // layout="horizontal"
            // initialValues={}
            // onValuesChange={onFormLayoutChange}
            // size={componentSize}
            >
              <div className="modal-body p-0">
                <div className="container">
                  <div className="row modal-userInfo-content mb-3">
                    <div className="col-12 text-center">
                      <h4 className=" display-4">Thông tin người dùng</h4>
                    </div>
                    <div className="col-6">
                      <div className="modal-userInfo ">
                        <Form.Item className="lnd_input">
                          <label className="mb-0 d-block">
                            Họ tên <span style={{ color: "red" }}>*</span>
                          </label>
                          <Input
                            placeholder="Họ tên"
                            name="fullname"
                            onChange={this.onChange}
                            value={fullname}
                          />
                        </Form.Item>
                        <Form.Item>
                          <label className="mb-0 d-block">
                            Ngày sinh <span style={{ color: "red" }}>*</span>
                          </label>
                          <DatePicker
                            format="DD/MM/YYYY"
                            placeholder={birthday}
                            name="birthday"
                            // value={birthday}
                            // value={}
                            // defaultValue={moment()}

                            onChange={this.onChangeDate}
                          />
                        </Form.Item>
                        <Form.Item className="ant-form-item-custom">
                          <label className="mb-0 d-block">
                            Giới tính<span style={{ color: "red" }}>*</span>
                          </label>
                          <Select
                            name="sex"
                            placeholder="Nam"
                            onChange={this.onChange}
                          >
                            <Select.Option value="1">Nam</Select.Option>
                            <Select.Option value="2">Nữ</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="modal-userInfo">
                        <Form.Item>
                          <label className="mb-0">
                            Số điện thoại<span style={{ color: "red" }}></span>
                          </label>
                          <Input
                            placeholder="Số điện thoại"
                            value={mobile}
                            name="mobile"
                            onChange={this.onChange}
                          />
                        </Form.Item>
                        <Form.Item>
                          <label className="mb-0">
                            Email<span>*</span>
                          </label>
                          <Input
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={this.onChange}
                          />
                        </Form.Item>
                        <Form.Item>
                          <label className="mb-0">
                            Địa chỉ<span style={{ color: "red" }}></span>
                          </label>
                          <Input
                            placeholder="Địa chỉ"
                            name="address"
                            value={address}
                            onChange={this.onChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="row modal-userLogin-content ">
                    <div className="col-12 text-center">
                      <h4 className="mb-0 display-4">Thông tin đăng nhập</h4>
                    </div>
                    <div className="col-6">
                      <div className="modal-userLogin">
                        <Form.Item>
                          <label className="mb-0">
                            Tên đăng nhập<span style={{ color: "red" }}>*</span>
                          </label>
                          <Input
                            placeholder="Tên đăng nhập"
                            disabled
                            value={username}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="modal-userLogin">
                        <Form.Item className="ant-form-item-custom">
                          <label className="mb-0 d-block">
                            Loại người dùng
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            onChange={this.onChangeselect}
                            name="userTypeId"
                            className="form-control"
                            value={this.state.values.userTypeId}
                          >
                            <option value="">
                              {/* */}
                              Chọn
                            </option>
                            {this.state.listUserType.map((userType, index) => {
                              return (
                                <option key={index} value={userType.id}>
                                  {userType.name}
                                </option>
                              );
                            })}
                          </select>
                        </Form.Item>
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
                  Cập nhật người dùng
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
const HorizontalForm = Form.create({ name: "edit-user" })(UpdateUser);
export default HorizontalForm;
