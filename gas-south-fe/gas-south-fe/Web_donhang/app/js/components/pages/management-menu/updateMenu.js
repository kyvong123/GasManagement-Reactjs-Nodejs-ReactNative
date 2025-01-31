import React, { Component } from "react";
import { Input, Select, InputNumber, Checkbox } from "antd";
import getAllMenuSystem from "../../../../api/getAllMenuSystem";
import getAllSystemPage from "../../../../api/getAllSystemPages";
import getSystemPageByLevelAPI from "../../../../api/getSystemPageByLevelAPI";
import getUserCookies from "getUserCookies";
import callApi from "../../../util/apiCaller";
import { UPDATE_SYSTEM_MENU } from "config";
import showToast from "showToast";
const { Option } = Select;
import "./management-menu.scss"

const initialState = {};

class updateMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listMenu: [],
      listSystemPage: [],
      listSystemPagelv0: [],
      listSystemPagelv1: [],
      values: {
        name: "",
        url: "",
        orderNo: "",
        parentId: "0",
        pageId: "",
        clas: "",
        isVisible: false,
        systemPageMenuId: "",
      },
      errors: {
        name: "",
        url: "",
        orderNo: "",
        parentId: "",
        pageId: "",
        clas: "",
      },
    };
    this.update = this.update.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.AddChecked = this.AddChecked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangePageId = this.onChangePageId.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
    this.handelInputNumber = this.handelInputNumber.bind(this);
    this.onChangeMenuParent = this.onChangeMenuParent.bind(this);
    this.handleBlurPageMenu = this.handleBlurPageMenu.bind(this);
    this.handleBlurParentMenu = this.handleBlurParentMenu.bind(this);
    this.handleOnchangeCheckBox = this.handleOnchangeCheckBox.bind(this);
  }


  componentDidMount() {
    this.getAllMenu();
    this.getAllPages();
    let i = this;
    $("#selectPageId").change(function () {
      let url = $(this).find(':selected').data('url');
      // console.log("url", url)
      i.setState(prevState => ({
        values: { ...prevState.values, url }
      }));
    });

  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        values: {
          systemPageMenuId: nextProps.dataUpdate.id,
          name: nextProps.dataUpdate.name,
          url: nextProps.dataUpdate.url,
          orderNo: nextProps.dataUpdate.orderNo,
          parentId: nextProps.dataUpdate.parentId,
          pageId: nextProps.dataUpdate.pageId,
          clas: nextProps.dataUpdate.clas,
          isVisible: nextProps.dataUpdate.isVisible,
        },
        errors: initialState
      });
    }
    else {
      this.setState({ values: initialState, errors: initialState })
    }
  }

  /* ====================================================API Function========================================= */

  async getSystemPageByLevel(level) {
    let systemPageByLevel = await getSystemPageByLevelAPI(level);
    if (systemPageByLevel) {
      if (systemPageByLevel.data.success === true) {
        return systemPageByLevel.data.SystemPage;
      } else {
        showToast(
          systemPageByLevel.data.message
            ? systemPageByLevel.data.message
            : systemPageByLevel.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
  }

  async getAllPages() {
    // this.setState({
    //   isloading: true,
    // });
    // const dataMenu = await getAllSystemPage();

    // if (dataMenu) {
    //   this.setState({
    //     listSystemPage: dataMenu.data.systemPage,
    //     isloading: false,
    //   });
    // }
    const systemPagelv0 = await this.getSystemPageByLevel(0)
    const systemPagelv1 = await this.getSystemPageByLevel(1)

    if (systemPagelv0) {
      this.setState({ listSystemPagelv0: systemPagelv0 })
      if (systemPagelv1) {
        this.setState({ listSystemPagelv1: systemPagelv1 })
      }
    }
  }

  async getAllMenu() {
    this.setState({
      isloading: true,
    });
    const dataMenu = await getAllMenuSystem();
    if (dataMenu) {
      this.setState({
        listMenu: dataMenu.data.getAll,
        isloading: false,
      });
    }

  }

  async update() {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let { systemPageMenuId, name, orderNo, pageId, parentId, url, clas, isVisible, } = this.state.values;
    let params = {
      systemPageMenuId: systemPageMenuId,
      name: name,
      url: url,
      orderNo: Number(orderNo),
      parentId: parentId,
      pageId: pageId,
      clas: clas,
      // isVisible : isVisible
    };
    // console.log("params ", params);
    await callApi("POST", UPDATE_SYSTEM_MENU, params, token)
      .then((res) => {
        console.log("Call api succes", res);
        if (res.data.success === true) {
          showToast("Cập nhật thành công!");
          // let modal = $("#addMenu");
          // modal.modal("hide");
          window.location.reload();
          this.AddChecked(true);
        }
      })
      .catch((err) => {
        console.log("call api fail", err);
      });
  }
  /* ====================================================API Function========================================= */

  /* ====================================================Another Function========================================= */
  AddChecked(ckecked) {
    this.props.OnChecked(ckecked);
  }

  validate = (name, value) => {
    if (name === "name") {
      if (!value) {
        return "Tên menu không được bỏ trống!";
      } else if (value && value.length > 50) {
        return "Tên menu quá dài!";
      } else if (value && value.length < 3) {
        return "Tên menu quá ngắn!";
      }
    }
    if (name === "url") {
      return value ? "" : "Đường dẫn không được bỏ trống!";
    }
    if (name === "clas") {
      return value ? "" : "Icon không được bỏ trống!";
    }
    if (name === "orderNo") {
      return value ? "" : "Số thứ tự không được bỏ trống!";
    }
    if (name === "pageId") {
      if (!value || value === "")
        return "Trang không được bỏ trống!";
    }
  };

  handleOnchange(e) {
    const { name, value } = e.target;
    // console.log(name, value);
    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
    });
  }

  handelInputNumber(e) {
    // console.log(e);
    this.setState({
      values: {
        ...this.state.values,
        orderNo: e,
      },
    });
  }

  onChangeMenuParent(e) {
    let value = e.target.value
    this.setState(prevState => ({
      values: { ...prevState.values, parentId: value }
    }));
  }

  onChangePageId(e) {
    let value = e.target.value
    this.setState(prevState => ({
      values: { ...prevState.values, pageId: value }
    }));
    // this.setState({
    //   values : {
    //     ...this.state.values,
    //     pageId: e,
    //   }
    // });
  }

  handleOnchangeCheckBox(e) {
    this.setState({
      values: {
        ...this.state.values,
        isVisible: e.target.checked,
      },
    });
  }

  handleBlur = (evt) => {
    const { name, value } = evt.target;
    // console.log(name, value);
    const error = this.validate(name, value);
    const state = this.state;
    this.setState(
      {
        errors: {
          ...state.errors,
          [name]: error,
        },
      },
      () => { }
    );
  };

  handleBlurParentMenu = (value) => {
    const name = "parentId"
    const error = this.validate(name, value);
    const state = this.state;
    this.setState(
        {
            errors: {
                ...state.errors,
                parentId: error,
            },
        },
        () => { }
    );
  }

  handleBlurPageMenu = (value) => {
    const name = "pageId"
    const error = this.validate(name, value);
    const state = this.state;
    this.setState(
        {
            errors: {
                ...state.errors,
                pageId: error,
            },
        },
        () => { }
    );
  }


  handleSubmit() {
    let hasError = false;
    for (let key in this.state.values) {
      const error = this.validate(key, this.state.values[key]);
      if (error) {
        const state = this.state;
        this.setState((state) => {
          return {
            errors: {
              ...state.errors,
              [key]: error,
            },
          };
        });
        hasError = true;
      }
    }
    if (hasError) {
    }
    else {
      this.update();
    }
  }

  resetForm(){
    this.setState({errors: initialState, values: initialState})
  }

  /* ====================================================Another Function========================================= */
  render() {
    // console.log("value", this.state.values);
    return (
      <div id="update_Menu">
        <div className="modal fade" id="updateMenu" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Chỉnh sửa menu</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="contain">
                  <div className="row">
                    <div className="col-6">
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p>Tên<span style={{ color: "red" }}>*</span></p>
                        </span>
                        <Input
                          // className="form-control__menu"
                          style={{ width: "250px" }}
                          placeholder="Tên menu"
                          name="name"
                          value={this.state.values.name}
                          onChange={this.handleOnchange}
                          onBlur={this.handleBlur}
                        />
                      </div>
                      {this.state.errors.name ? (
                        <div className="error-message">
                          <span>{this.state.errors.name}</span>
                        </div>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-6">
                      <div className="d-flex mb-2">
                        <span className="mr-3  pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p>Tên menu cha<span style={{ color: "red" }}>*</span></p>
                        </span>
                        {/* <Select
                          showSearch
                          style={{ width: "250px" }}
                          placeholder="Vui lòng chọn"
                          optionFilterProp="children"
                          onChange={this.onChangeMenuParent}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          value={this.state.values.parentId}
                        >
                          <Option value="0">Hủy chọn</Option>
                          <Option value="">Menu đơn</Option>
                          {this.state.listMenu
                            .filter((menu) => menu.parentId === "0")
                            .map((menu, index) => {
                              return (
                                <Option key={index} value={menu.id}>
                                  {menu.name}
                                </Option>
                              );
                            })}
                        </Select> */}

                        <div className="custom-selected-out">
                          <select
                            className="custom-selected"
                            name="parentId"
                            id="selectParentPageId"
                            placeholder="Vui lòng chọn"
                            style={{ width: "250px" }}
                            onChange={this.onChangeMenuParent}
                            onBlur={this.handleBlurParentMenu}
                            value={this.state.values.parentId}>
                            <option value="0">Hủy chọn - Menu Cha</option>
                            <option value="">Menu đơn</option>
                            {this.state.listMenu
                              .filter((menu) => menu.parentId === "0")
                              .map((menu, index) => {
                                return (
                                  <option key={index} value={menu.id}>
                                    {menu.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      {this.state.errors.parentId ? (
                        <div className="error-message">
                          <span>{this.state.errors.parentId}</span>
                        </div>
                      ) : (
                          ""
                        )}
                    </div>

                    {/* <div className="col-6">
                      <div className="d-flex mb-2">
                        <span className="mr-3  pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p> Trang<span style={{ color: "red" }}>*</span> </p>
                        </span>
                        <Select
                          style={{ width: "250px" }}
                          value={this.state.values.pageId}
                          onChange={this.onChangePageId}
                        >
                          {this.state.listSystemPage.map((page, index) => {
                            return (
                              <Option key={index} value={page.id}>
                                {page.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div> */}
                    <div className="col-6">
                      {/* Trang  */}
                      <div className="d-flex mb-2">
                        <span className="mr-3  pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p> Trang<span style={{ color: "red" }}>*</span> </p>
                        </span>
                        <div className="custom-selected-out">
                          <select
                            className="custom-selected"
                            id="selectPageId"
                            style={{ width: "250px" }}
                            onChange={this.onChangePageId}
                            onBlur={this.handleBlurPageMenu}
                            value={this.state.values.pageId}>
                            <option disabled></option>
                            <optgroup label="Module - level 0">
                              {this.state.listSystemPagelv0.map((page, index) => {
                                return (
                                  <option key={page.id} value={page.id} data-url={String(page.url)}>
                                    {page.name}
                                  </option>
                                );
                              })}
                            </optgroup>
                            <option disabled></option>
                            <optgroup label="Function - level 1">
                              {this.state.listSystemPagelv1.map((page, index) => {
                                return (
                                  <option key={page.id} value={page.id} data-url={String(page.url)}>
                                    {page.name}
                                  </option>
                                );
                              })}
                            </optgroup>
                          </select>
                        </div>
                      </div>
                      {this.state.errors.pageId ? (
                        <div className="error-message">
                          <span>{this.state.errors.pageId}</span>
                        </div>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-6">
                      {/* URL  */}
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p>URL </p>
                        </span>
                        <Input
                          style={{ width: "250px" }}
                          placeholder="Nhập url"
                          name="url"
                          value={this.state.values.url}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      {/* STT  */}
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p> STT<span style={{ color: "red" }}>*</span>  </p>
                        </span>
                        <InputNumber
                          style={{ width: "250px" }}
                          min={1}
                          value={this.state.values.orderNo}
                          onChange={this.handelInputNumber}
                        />
                        {this.state.errors.orderNo ? (
                        <div className="error-message">
                          <span>{this.state.errors.orderNo}</span>
                        </div>
                      ) : (
                          ""
                        )}
                      </div>
                      {this.state.errors.orderNo ? (
                        <div className="error-message">
                          <span>{this.state.errors.orderNo}</span>
                        </div>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-6">
                      {/* CSS Class Icon */}
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p> Css Class Icon <span style={{ color: "red" }}>*</span></p>
                        </span>
                        <Input
                          placeholder="fa fa-home"
                          style={{ width: "250px" }}
                          value={this.state.values.clas}
                          name="clas"
                          onChange={this.handleOnchange}
                          onBlur={this.handleBlur}
                        />
                      </div>
                      {this.state.errors.clas ? (
                        <div className="error-message">
                          <span>{this.state.errors.clas}</span>
                        </div>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-6">
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p>  Xuất hiện  </p>
                        </span>
                        <Checkbox
                          checked={this.state.values.isVisible}
                          onChange={this.handleOnchangeCheckBox}
                        ></Checkbox>
                      </div>
                    </div>
                    <div className="col-6">
                      {/* Xuất hiện */}
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }} >
                          <p>Is Dashboard<span style={{ color: "red" }}>*</span></p>
                        </span>
                        <Checkbox></Checkbox>
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
                  onClick={this.resetForm}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default updateMenu;
