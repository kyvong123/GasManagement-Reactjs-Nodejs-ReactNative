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
import { Radio } from "antd";
import Constants from "Constants";
import getUserCookies from "./../../helpers/getUserCookies";
import getAllManufacturer from "getAllManufacturer";
import { IMPORTCYLINDERBYEXCEL } from "./../../config/config";
import { GETLISTMANUFACTURE } from "./../../config/config";
import callApi from "./../../util/apiCaller";
import sendReqCreFromExcelAPI from "./../../../api/sendRequestCreateCylinder";
import importCylinderBySubsidiaryAPI from "./../../../api/importCylinderBySubsidiaryAPI";
import importCylinderDuplicate from "./../../../api/importCylinderDuplicate";
import getAllTypeGas from "getAllTypeGas";
import ReactCustomLoading from "ReactCustomLoading";
import "./createCylinder.scss"
let file = null;
function getList() {
  return new Promise(function (resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}
// Fix table head
function tableFixHead(e) {
  const el = e.target,
    sT = el.scrollTop;
  el.querySelectorAll("thead th").forEach(th =>
    th.style.transform = `translateY(${sT}px)`
  );
}
document.querySelectorAll(".tableFixHead").forEach(el =>
  el.addEventListener("scroll", tableFixHead)
);
class CreateCylindersInSubsidiary extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      usingType: "Old",
      manufacture: "",
      typegas: "",
      listManufacturers: [],
      message: "",
      messageErr: "",
      isLoading: false,
      show: false,
      list: [],
      listTypeGas: [],
      Loading: false,
      check: false,
      listDuplicate: [],
      errorCylinders: [],
      userType: "",
      userRole: ""
    };
  }

  onSubmit = () => {
    this.setState({ isLoading: true });
    getList().then((list) => {
      this.setState({
        isLoading: false,
        list,
        show: false,
      });
    });
  };
  onChangeType = (e) => {
    this.setState({
      usingType: e.target.value,
    });
  };

  async componentDidMount() {
    const user_cookies = await getUserCookies();
    this.setState({
      userType: user_cookies.user.userType,
      userRole: user_cookies.user.userRole
    })
    console.log("user_cookies", user_cookies);
    let token = "Bearer " + user_cookies.token;
    let param = {
      isChildOf: user_cookies.user.parentRoot,
    };

    await callApi("POST", GETLISTMANUFACTURE, param, token).then((res) => {
      console.log("ressss", res.data);
      if (res.data) {
        if (res.data.status === true) {
          let listArrManufacture = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listArrManufacture.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i],
            });
          }
          this.setState({
            listManufacturers: listArrManufacture,
          });
        } else {
          showToast(
            res.data.data.message
              ? res.data.data.message
              : res.data.data.err_msg,
            2000
          );
        }
        //this.setState({image_link: profile.data.company_logo});
      } else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
    const data = await getAllTypeGas();

    if (data.data) {
      if (data.data.status === true) {
        let listTypeGas = [];
        for (let i = 0; i < data.data.data.length; i++) {
          listTypeGas.push({
            value: data.data.data[i].id,
            label: data.data.data[i].name,
            ...data.data.data[i],
          });
        }
        console.log("!", listTypeGas);
        this.setState({
          listTypeGas: listTypeGas,
        });
      }
    }
  }

  handleChangeManufacture = (langValue) => {
    this.setState({
      manufacture: langValue,
    });
  };
  handleChangeTypeGas = (langValue) => {
    this.setState({
      typegas: langValue,
    });
  };

  handleFileUpload(event) {
    file = event.target.files[0];
  }

  //cmt
  async submit(event) {
    this.setState({ Loading: true });
    // console.log("êrerererer", this.state.typegas);
    event.preventDefault();
    if (!file) { 
      showToast("Phải chọn tập tin !", 3000);
      this.setState({ Loading: false, isLoading: false });
    } 
    else {
      const user_cookies = await getUserCookies();

      // console.log(user_cookies);
      const result = await importCylinderBySubsidiaryAPI(
        file,
        /* user_cookies.user.owner, */ this.state.usingType,
        this.state.manufacture.id,
        this.state.typegas.id
      );
      // console.log('result', result);
      if (result && result.status === 200) {
        if (result.data.status === false && result.data.err !== "") {
          const dataErr = result.data.err.replace(/;/g, "\n");
          this.setState({ messageErr: dataErr });
          this.setState({ Loading: false });
          const lengthErr = result.data.errorCylinders.length
          if (lengthErr > 0) {
            let check = confirm(`Có ${lengthErr} mã bình  báo bị lỗi, bạn có muốn xem chi tiết bình lỗi?`)
            if (check === true) {
              this.setState({
                check: true,
                errorCylinders: result.data.errorCylinders
              })
            }
          }
          // let check = confirm('Mã bình đã có trên hệ thống, bạn có muốn khai báo lên không?')
          // if (check === true) {
          //   this.setState({
          //     check: true,
          //     listDuplicate: result.data.duplicateCylinders,
          //   })
          // }
        } else {
          this.setState({
            message: "Tất cả mã nhập vào hệ thống đều thành công",
          });
          showToast('Tất cả mã nhập vào hệ thống đều thành công', 3000);
          // console.log('result', result);
          setTimeout(this.closeForm, 2000);

          this.setState({ Loading: false });
          const modal = $("#create-cylinder-subsidiary");
          modal.modal("hide");
          // this.closeForm;
        }
        // window.location.reload();
        return;
      } else {
        showToast(
          "Xảy ra lỗi trong quá trình gửi request. Vui lòng kiểm tra lại dữ liệu",
          3000
        );
        this.setState({ Loading: false });
      }

      //   $("#create-cylinder-subsidiary").modal('hide');
      return;
    }
  }
  async submitDuplicate(event) {
    this.setState({ Loading: true });
    event.preventDefault();
    const result = await importCylinderDuplicate(
      this.state.listDuplicate,
      this.state.usingType,
      this.state.manufacture.id,
      this.state.typegas.id
    );
    try {
      if (result.data.status === true) {
        this.setState({
          Loading: false,
          check: false
        });
        const modal = $("#create-cylinder-subsidiary");
        modal.modal("hide");
        showToast("Tạo mã bình trùng thành công")
      }
      else if (result.data.resCode === "ERROR-00091") {
        this.setState({
          Loading: false,
          check: false
        });
        const modal = $("#create-cylinder-subsidiary");
        modal.modal("hide");
        showToast(result.data.err_msg)
      }
      else {
        this.setState({
          Loading: false,
          check: false
        });
        showToast(result.data.err_msg)
      }
    }
    catch (error) {
      showToast(error.message)
    }

  }

  closeForm1 = () => {
    // console.log('THIS', this)

    const modal = $("#create-cylinder-subsidiary");
    modal.modal("hide");

    this.setState({ message: "", messageErr: "" });
  };
  closeForm2 = () => {
    // console.log('THIS', this)

    const modal = $("#create-cylinder-subsidiary");
    modal.modal("hide");

    this.setState({ message: "", messageErr: "", check: false });
  };

  render() {
    return (
      <div className="modal fade" id="create-cylinder-subsidiary" tabIndex="-1">
        {this.state.check === false ?
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tự khai báo, tạo bình</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.closeForm}
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
                  <ReactCustomLoading isLoading={this.state.Loading} />
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Chọn file excel </label>
                          <div style={{ display: "flex" }}>
                            <Input
                              //  disabled={this.props.isEditForm}
                              className="form-control"
                              type="file"
                              name="fileexcel"
                              id="fileexcel"
                              onChange={this.handleFileUpload}
                              validations={[required]}
                            />
                            <input type="reset" />
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-md-6">
                        <div className="form-group">
                          <label>Phân loại</label>
                          <div className="form-group">
                            <Radio.Group
                              onChange={this.onChangeType}
                              value={this.state.usingType}
                              validations={[required]}
                            >
                              {this.state.userType === "Factory" && this.state.userRole === "Owner" ?
                                <Radio disabled value="New">Bình sản xuất mới</Radio> :
                                <Radio value="New">Bình sản xuất mới</Radio>
                              }
                              <Radio value="Old">Bình sửa chữa</Radio>
                            </Radio.Group>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    {/* <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Thương hiệu</label>
                          <div className="form-group">
                            <Select
                              onChange={this.handleChangeManufacture.bind(this)}
                              placeholder="Chọn..."
                              options={this.state.listManufacturers}
                              value={this.state.manufacture}
                            ></Select>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Loại bình</label>
                          <div className="form-group">
                            <Select
                              onChange={this.handleChangeTypeGas.bind(this)}
                              placeholder="Chọn..."
                              options={this.state.listTypeGas}
                              value={this.state.typegas}
                            ></Select>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {this.state.messageErr !== "" ? (
                      <div className="row">
                        <label
                          style={{
                            color: "#f96868",
                            fontSize: 12,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {this.state.messageErr}
                        </label>
                      </div>
                    ) : null}
                    {this.state.message !== "" ? (
                      <div className="row">
                        <label
                          style={{
                            color: "#15c377",
                            fontSize: 12,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {this.state.message}
                        </label>
                      </div>
                    ) : null}
                  </div>

                  <footer className="card-footer text-center">
                    {this.state.Loading == false ? (
                      <Button
                        className="btn btn-primary"
                        onClick={() => this.onSubmit()}
                        disabled={this.state.isLoading}
                      >
                        {this.state.isLoading ? "Loading..." : "Lưu"}
                      </Button>
                    ) : (
                      <button className="btn btn primary" disabled="true">
                        Lưu
                      </button>
                    )}

                    <button
                      className="btn btn-secondary"
                      type="reset"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                      onClick={this.closeForm1}
                    >
                      Đóng
                    </button>
                  </footer>
                </Form>
              </div>
            </div>
          </div>
          :
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Danh sách mã bình bị trùng</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.closeForm2}
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
                  onSubmit={(event) => this.submitDuplicate(event)}
                >
                  <ReactCustomLoading isLoading={this.state.Loading} />
                  <div className="card-body tableFixHead">
                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          {/*<th className="w-120px text-center align-middle">Mã</th>*/}
                          <th className="w-120px text-center align-middle">Số serial</th>
                          <th className="w-120px text-center align-middle">Màu sắc</th>
                          <th className="w-240px text-center align-middle">Loại Van</th>
                          <th className="w-120px text-center align-middle">Hạn kiểm định</th>
                          <th className="w-120px text-center align-middle">Trọng lượng vỏ</th>
                        </tr>
                      </thead>
                      <tbody className="custom-scroll-table">
                        {this.state.errorCylinders.map((value, index) => {
                          return (
                            <tr>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>
                              <td scope="row" className="text-center">
                                {value.serial}
                              </td>
                              <td scope="row" className="text-center">
                                {value.color}
                              </td>
                              <td scope="row" className="text-center">
                                {value.valve}
                              </td>
                              <td scope="row" className="text-center">
                                {value.checkedDate}
                              </td>
                              <td scope="row" className="text-center">
                                {value.weight}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <footer className="card-footer text-center">
                    {/* {this.state.Loading == false ? (
                      <Button
                        className="btn btn-primary"
                        onClick={this.onSubmit}
                        disabled={this.state.isLoading}
                      >
                        {this.state.isLoading ? "Loading..." : "Lưu"}
                      </Button>
                    ) : (
                      <button className="btn btn primary" disabled="true">
                        Lưu
                      </button>
                    )} */}

                    <button
                      className="btn btn-secondary"
                      type="reset"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                      onClick={this.closeForm2}
                    >
                      Đóng
                    </button>
                  </footer>
                </Form>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default CreateCylindersInSubsidiary;
