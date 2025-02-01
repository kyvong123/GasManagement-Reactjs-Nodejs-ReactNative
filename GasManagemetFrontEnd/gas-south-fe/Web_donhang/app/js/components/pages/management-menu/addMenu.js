import React, { Component } from "react";
import { Input, Form, Select, InputNumber, Checkbox } from "antd";
const { Option } = Select;
import getAllMenuSystem from "../../../../api/getAllMenuSystem";
import getAllSystemPage from "../../../../api/getAllSystemPages";
import getSystemPageByLevelAPI from "../../../../api/getSystemPageByLevelAPI";
import getUserCookies from "getUserCookies";
import callApi from "../../../util/apiCaller";
import { CREATE_SYSTEM_MENU } from "config";
import showToast from "showToast";
import "./management-menu.scss"
const initialState = {
  name: "",
  url: "",
  orderNo: "",
  parentId: "",
  pageId: "",
  clas: "",
  isVisible: false,
  pageName: "",
}

class addMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      isClick: false,
      listMenu: [],
      listSystemPage: [],
      listSystemPagelv0: [],
      listSystemPagelv1: [],
      test: "",
      values: {
        name: "",
        url: "",
        orderNo: "",
        parentId: "",
        pageId: "",
        clas: "",
        isVisible: false,
        pageName: "",
      },
      errors: {
        name: "",
        url: "",
        orderNo: "",
        parentId: "",
        pageId: "",
        clas: "",
        pageName: "",
      },
    };
    this.resetForm = this.resetForm.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.addSystemMenu = this.addSystemMenu.bind(this);
    this.onChangeSelec2 = this.onChangeSelec2.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnChange1 = this.handleOnChange1.bind(this);
    this.onChangeMenuParent = this.onChangeMenuParent.bind(this);
    this.handleBlurPageMenu = this.handleBlurPageMenu.bind(this);
    this.handleBlurParentMenu = this.handleBlurParentMenu.bind(this);
    this.getSystemPageByLevel = this.getSystemPageByLevel.bind(this);
    this.handleOnChangeCheckBox = this.handleOnChangeCheckBox.bind(this);
  }

  componentDidMount() {
    this.getAllMenu();
    this.getAllPages();
    let i = this;
    $("#selectPageId").change(function () {
      let url = $(this).find(':selected').data('url');
      i.setState(prevState => ({
        values: { ...prevState.values, url }
      }));
    });
  }

  /* ===========================================API Function ======================================*/
  
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

    // console.log(systemPagelv0,systemPagelv1)
  }



  async addSystemMenu() {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let { name, orderNo, pageId, parentId, url, clas, isVisible } = this.state.values;
    let params = {
      name: name,
      url: url.replace("/",""),
      orderNo: Number(orderNo),
      parentId: parentId,
      pageId: pageId,
      clas: clas,
      isVisible: isVisible
    };
    // console.log("Params ", params);
    await callApi("POST", CREATE_SYSTEM_MENU, params, token)
      .then((res) => {
        console.log("Call api succes", res);
        if (res.data.ssuccess === true) {
          showToast("Thêm thành công!");
          let modal = $("#addMenu");
          modal.modal("hide");
          this.AddChecked(true);
        }
      })
      .catch((err) => {
        console.log("call api fail", err);
      });
  }

  /* ===========================================API Function ======================================*/


  /* ===========================================Another Function ======================================*/

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
    // if (name === "url") {
    //   return value ? "" : "Đường dẫn không được bỏ trống!";
    // }
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
    if(name === "parentId"){
      if(!value || value === "please"){
        return "Tên Menu cha không được để trống!";
      }
    }
  };

  onChangeMenuParent(e) {
    let value = e.target.value
    this.setState({
      values: {
        ...this.state.values,
        parentId: value,
      },
    });
  }

  onChangeSelec2(e) {
    let value = e.target.value
    this.setState(prevState => ({
      values: { ...prevState.values, pageId: value }
    }));
  }


  // Get allSystemMenu là của cha
  // Trang là get all systempages
  handleOnChange(e) {
    const { name, value } = e.target;
    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
    });
    if (this.state.values.name) {
      this.setState({
        errors: {
          name: "",
        },
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          name: "",
        },
      });
    }
    if (this.state.values.url) {
      this.setState({
        errors: {
          url: "",
        },
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          url: "",
        },
      });
    }
    if (this.state.values.clas) {
      this.setState({
        errors: {
          clas: "",
        },
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          clas: "",
        },
      });
    }
    // console.log(name, value);
  }

  handleOnChange1(e) {
    const values = { ...this.state.values };
    this.setState({
      values: {
        ...values,
        orderNo: e,
      },
    });
  }

  handleOnChangeCheckBox(e) {
    // console.log("checked", e.target.checked);
    this.setState({
      values: {
        ...this.state.values,
        isVisible: e.target.checked
      }
    })
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

  handleSubmit = (e) => {
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
      // alert("123");
    } else {
      this.addSystemMenu();
    }

    // console.log("params", this.state.values);
  };

  AddChecked(ckecked) {
    this.props.OnChecked(ckecked);
    if (ckecked) {
      this.getAllMenu();
      this.getAllPages();
    }
  }

  resetForm(){
    this.setState({errors: initialState, values: initialState})
  }

  /* ===========================================Another Function ======================================*/

  render() {
    // console.log("click" , this.state.isClick);
    // console.log("value", this.state.values)
    return (
      <div>
        <div
          className="modal fade"
          id="addMenu"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Tạo menu mới
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
              <div className="modal-body">
                <div className="contain">
                  <div className="row">
                    <div className="col-6">
                      {/* Tên  */}
                      <div className="d-flex mb-2">
                        <span
                          className="mr-3 pt-1"
                          style={{ width: "100px", textAlign: "right" }}
                        >
                          <p>
                            Tên<span style={{ color: "red" }}>*</span>
                          </p>
                        </span>
                        <Input
                          style={{ width: "250px" }}
                          placeholder="Tên menu"
                          name="name"
                          onChange={this.handleOnChange}
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
                      {/* Tên Menu Cha  */}
                      <div className="d-flex mb-2">
                        <span
                          className="mr-3  pt-1"
                          style={{ width: "100px", textAlign: "right" }}
                        >
                          <p>
                            Tên menu cha
                            <span style={{ color: "red" }}>*</span>
                          </p>
                        </span>
                        {/* <Select
                          showSearch
                          style={{ width: "250px" }}
                          placeholder="Vui lòng chọn"
                          optionFilterProp="children"
                          onChange={this.onChangeMenuParent}
                          // onFocus={onFocus}
                          // onBlur={onBlur}
                          // onSearch={this.onSearch}
                          filterOption={(Input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(Input.toLowerCase()) >= 0
                          }
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
                            name="parentId"
                            className="custom-selected"
                            id="selectParentPageId"
                            placeholder="Vui lòng chọn"
                            style={{ width: "250px" }}
                            onChange={this.onChangeMenuParent}
                            onBlur={this.handleBlurParentMenu}
                            defaultValue="please">
                            <option disabled value="please">Vui lòng chọn</option>
                            <option disabled></option>
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
                        <span
                          className="mr-3  pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p>Trang<span style={{ color: "red" }}>*</span></p>
                        </span>
                        <Select
                          showSearch
                          style={{ width: "250px" }}
                          placeholder="Chọn Trang"
                          optionFilterProp="children"
                          onChange={this.onChangeSelec2}
                          onSearch={this.onSearch}
                          filterOption={(Input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(Input.toLowerCase()) >= 0
                          }
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
                          <p> Trang <span style={{ color: "red" }}>*</span>  </p>
                        </span>
                        <div className="custom-selected-out">
                          <select
                            className="custom-selected"
                            id="selectPageId"
                            placeholder="Chọn Trang"
                            style={{ width: "250px" }}
                            onChange={this.onChangeSelec2}
                            onBlur={this.handleBlurPageMenu}
                            defaultValue="">
                            <option disabled value="">Chọn trang</option>
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
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }} >
                          <p> URL </p>
                        </span>
                        <Input
                          className="form-control  form-control__menu"
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
                        <span
                          className="mr-3 pt-1"
                          style={{ width: "100px", textAlign: "right" }}
                        >
                          <p>
                            STT<span style={{ color: "red" }}>*</span>
                          </p>
                        </span>
                        <InputNumber
                          style={{ width: "250px" }}
                          min={1}
                          // defaultValue={1}
                          name="orderNo"
                          onChange={this.handleOnChange1}
                          onBlur={this.handleBlur}
                        />
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
                        <span
                          className="mr-3 pt-1"
                          style={{ width: "100px", textAlign: "right" }}
                        >
                          <p>
                            Css Class Icon
                            <span style={{ color: "red" }}>*</span>
                          </p>
                        </span>
                        <Input
                          placeholder="fa fa-home"
                          className="form-control form-control__menu"
                          style={{ width: "250px" }}
                          name="clas"
                          onChange={this.handleOnChange}
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
                          <p>Xuất hiện</p>
                        </span>
                        <Checkbox checked={this.state.values.isVisible} onChange={this.handleOnChangeCheckBox}></Checkbox>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex mb-2">
                        <span className="mr-3 pt-1" style={{ width: "100px", textAlign: "right" }}>
                          <p>Is Dashboard</p>
                        </span>
                        <Checkbox></Checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.resetForm}>Hủy</button>
                <button type="button" onClick={this.handleSubmit} className="btn btn-primary">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default addMenu;
