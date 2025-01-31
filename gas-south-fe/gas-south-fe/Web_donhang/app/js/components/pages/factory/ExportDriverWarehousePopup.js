import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from "react-select";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
import TagAutocomplete from "TagAutoComplete";
import getUserCookies from "./../../../helpers/getUserCookies";
import { NAMEDRIVE, GETWAREHOUSE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import createHistoryAPI from "createHistoryAPI";
import getCylinderBySerialAPI from "../../../../api/getCylinderBySerialAPI";
import { Select as Select2 } from "antd";
import Select from "react-select";
import ReactCustomLoading from "ReactCustomLoading";
import exportCylinderDuplicate from "../../../../api/exportCylinderDuplicate";
import importCylinderDuplicate from "../../../../api/importCylinderDuplicates";
import PopupComponent from "../dashBoard/PopupComponent";
const Option = Select.Option;

function getList() {
  return new Promise(function(resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}

class ExportDriverWarehousePopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      license_plate: "",
      idKhoXe: "",
      listTenKhoXe: [],
      content: "",
      listProducts: [],
      isShowNumber: false,
      listExportPlaceData: "",
      AgencyResults: [],
      GeneralResults: [],
      IndustryResults: [],
      listExportPlaceDataID: "",
      driverName: "",
      idDriver: "",
      listDriver: [],
      isLoading: false,
      show: false,
      list: [],
      loading: false,
      userId: "",
      isExportDirect: false,
    };
  }
  handleComfirmExport = () => {
    let text = "Bạn có muốn xuất trực tiếp đến khách hàng này ?";
    if (confirm(text) == true) {
      text = "You pressed OK!";
      this.onSubmitDirect();
    } else {
      text = "You canceled!";
      console.log(text);
    }
  };
  onSubmit = () => {
    try {
      // const data = this.form.getValues();
      // if (!this.state.idDriver) throw "Phải nhập tên tài xế !";
      // if (!data.license_plate) throw "Phải nhập biển số xe !";
      // if (!this.state.GeneralResults.length) throw "Phải nhập tổng đại lý !";
      // if (!this.state.AgencyResults.length) throw "Phải nhập hệ thống đại lý !";
      // if (!this.state.IndustryResults.length) throw "Phải nhập khách hàng công nghiệp !";
      this.setState({ isLoading: true, loading: true });
      getList().then((list) => {
        this.setState({
          isLoading: false,
          list,
          show: false,
        });
      });
      this.submit();
    } catch (e) {
      this.setState({ isLoading: false, loading: false });
      showToast(e);
    }
  };
  onSubmitDirect = (event) => {
    this.setState({ isLoading: true });
    getList().then((list) => {
      this.setState({
        isLoading: false,
        list,
        show: false,
      });
    });
    this.submit(true);
  };

  handleChangeGeneral = (langValue) => {
    this.setState({ GeneralResults: langValue });
  };
  handleChangeAgency = (langValue) => {
    this.setState({ AgencyResults: langValue });
  };
  handleChangeIndustry = (langValue) => {
    this.setState({ IndustryResults: langValue });
  };
  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async addHistory(
    driverName,
    license_plate,
    cylinders,
    to_array,
    number_array,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow,
    successCylinders,
    cylinerIneligible
  ) {
    // Call api
    this.setState({ isLoading: true });
    if (this.props.product_parse.length !== 0) {
      const user = await createHistoryAPI(
        driverName,
        this.state.license_plate,
        cylinders,
        Constant.EXPORT_WAREHOUSE,
        "",
        "",
        "",
        "",
        idKhoXe,
        number_array,
        "",
        "",
        "",
        "",
        "",
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow
      );
      this.setState({ isLoading: false, loading: false });
      //console.log('register',user);
      if (user) {
        if (
          user.status === Constant.HTTP_SUCCESS_CREATED ||
          user.status === Constant.HTTP_SUCCESS_BODY
        ) {
          showToast("Xuất hàng thành công!", 3000);
          const modal = $("#export-driver-warehouse");
          modal.modal("hide");
          setTimeout(function() {
            window.location.reload();
          }, 1000);
          return true;
        } else {
          showToast(
            user.data.message ? user.data.message : user.data.err_msg,
            1000
          );
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình tạo bình ");
        return false;
      }
    } else {
      if (this.props.listCylinderDuplicate.length !== 0) {
        const result = await exportCylinderDuplicate(
          driverName,
          this.state.license_plate,
          cylinders,
          Constant.EXPORT_WAREHOUSE,
          "",
          "",
          "",
          "",
          to_array,
          number_array,
          "",
          "",
          "",
          "",
          "",
          idDriver,
          sign,
          cylinderImex,
          idImex,
          typeImex,
          flow,
          successCylinders,
          cylinerIneligible
        );
        this.setState({ isLoading: false, loading: false });
        if (result) {
          if (result.status === 201) {
            const modal = $("#export-driver-type-cylinder");
            modal.modal("hide");
            showToast("Xuất hàng thành công");
            setTimeout(function() {
              window.location.reload();
            }, 1000);
          } else {
            let res = confirm(
              result.data.err_msg + ". Bạn có muốn xem danh sách mã bình không?"
            );
            if (res === true) {
              const element = document.createElement("a");
              const file = new Blob([result.data.err_cylinders], {
                type: "text/plain;charset=utf-8",
              });
              element.href = URL.createObjectURL(file);
              element.download = "Mã bình trùng.txt";
              document.body.appendChild(element);
              element.click();
            }
            const modal = $("#export-driver-type-cylinder");
            modal.modal("hide");
            setTimeout(function() {
              window.location.reload();
            }, 1000);
          }
        } else {
          showToast("Xảy ra lỗi trong quá trình xuất bình trùng");
        }
      } else {
        const user = await createHistoryAPI(
          driverName,
          this.state.license_plate,
          successCylinders,
          Constant.EXPORT_WAREHOUSE,
          this.state.idKhoXe,
          "",
          "",
          "",
          to_array,
          number_array,
          "",
          "",
          "",
          "",
          "",
          idDriver,
          sign,
          cylinderImex,
          idImex,
          typeImex,
          flow,
          cylinerIneligible
        );
        this.setState({ isLoading: false, loading: false });
        //console.log('register',user);
        if (user) {
          if (
            user.status === Constant.HTTP_SUCCESS_CREATED ||
            user.status === Constant.HTTP_SUCCESS_BODY
          ) {
            showToast("Xuất hàng thành công!", 3000);
            const modal = $("#export-driver-warehouse");
            modal.modal("hide");
            setTimeout(function() {
              window.location.reload();
            }, 1000);
            return true;
          } else {
            showToast(
              user.data.message ? user.data.message : user.data.err_msg,
              1000
            );
            return false;
          }
        } else {
          showToast("Xảy ra lỗi trong quá trình tạo bình ");
          return false;
        }
      }
    }
    //this.setState({registerSuccessful: false});
  }
  // xu ly import cho nơi nhận ( dùng khi xuất Trực tiếp: Tram <=>customer <=>customer)
  async addHistoryImport(
    driver,
    license_plate,
    cylinders,
    type,
    stationId,
    idDriver,
    sign,
    fromId,
    cylinderImex,
    idImex,
    typeImex,
    flow,
    successCylinders,
    toId = ""
  ) {
    // Call api
    this.setState({ isLoading: true });
    // console.log(this.props.product_parse, '||', toId, '&', successCylinders.length, '&&', this.props.listCylinderDuplicate.length);
    if (
      (this.props.product_parse.length !== 0 ||
        (toId && successCylinders.length !== 0)) &&
      this.props.listCylinderDuplicate.length === 0
    ) {
      const user = await createHistoryAPI(
        driver,
        this.state.license_plate,
        successCylinders,
        "IMPORT_DIRECT",
        this.state.idKhoXe,
        type,
        this.state.idKhoXe,
        fromId,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow
      );
      this.setState({ isLoading: false, loading: false });
      //console.log('register',user);
      if (user) {
        if (
          user.status === Constant.HTTP_SUCCESS_CREATED ||
          (user.status === Constant.HTTP_SUCCESS_BODY &&
            !user.data.hasOwnProperty("err_msg"))
        ) {
          showToast("Nhập hàng thành công!", 3000);
          setTimeout(function() {
            window.location.reload();
          }, 2000);
          this.props.refresh();
          return true;
        } else {
          showToast(
            user.data.message ? user.data.message : user.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình tạo bình ");
        return false;
      }
    } else {
      const result = await importCylinderDuplicate(
        driver,
        this.state.license_plate,
        cylinders,
        "IMPORT_DIRECT",
        idKhoXe,
        type,
        stationId,
        fromId,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow,
        successCylinders,
        this.props.listNotPass
      );
      this.setState({
        isLoading: false,
        loading: false,
      });
      if (result) {
        if (result.status === 201) {
          // const modal = $("#import-driver-type-cylinder");
          // modal.modal('hide');
          showToast("Nhập hàng thành công");
          setTimeout(function() {
            window.location.reload();
          }, 2000);
        } else {
          let res = confirm(
            result.data.err_msg + ". Bạn có muốn xem danh sách mã bình không?"
          );
          if (res === true) {
            const element = document.createElement("a");
            const file = new Blob([result.data.err_cylinders], {
              type: "text/plain;charset=utf-8",
            });
            element.href = URL.createObjectURL(file);
            element.download = "Mã bình trùng.txt";
            document.body.appendChild(element);
            element.click();
          }
          const modal = $("#import-driver-type-cylinder");
          modal.modal("hide");
          setTimeout(function() {
            window.location.reload();
          }, 2000);
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình nhập bình trùng");
      }
    }
    //this.setState({registerSuccessful: false});
  }
  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      id: user_cookie.user.id,
    };

    let params_khoxe = {
      id: "all",
    };
    this.setState({ userId: user_cookie.user.id });
    let result = await callApi("POST", GETWAREHOUSE, params_khoxe, token);
    if (result)
      this.setState({
        listTenKhoXe: result.data.data.map((item) => {
          return { value: item.id, label: item.name };
        }),
      });
    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      // console.log("testdata", res.data);
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [
            {
              name: "Bạn chưa có tài xế",
              id: "null",
            },
          ],
        });
      } else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          },
          () => console.log(this.state.listDriver)
        );
      }
    });
  }
  async submit(typeExport = false) {
    let listIdSuccess = this.props.listIdSuccess.concat(
      this.props.cylinderNotCreate
    );
    this.setState({ loading: true });
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name || "Không xác định";
    //// var products=await this.getAllCylenders();
    var cylinders = [];
    let cylinderImex = [];
    if (this.props.product_parse.length !== 0) {
      for (let i = 0; i < this.props.product_parse.length; i++) {
        cylinders.push(this.props.product_parse[i].id);
        cylinderImex.push({
          id: this.props.product_parse[i].id,
          status: "FULL",
          condition: "NEW",
        });
      }
    } else {
      if (this.props.listCylinderDuplicate) {
        for (let i = 0; i < this.props.listCylinderDuplicate.length; i++) {
          cylinderImex.push({
            id: this.props.listCylinderDuplicate[i],
            status: "FULL",
            condition: "NEW",
          });
        }
      }
      if (listIdSuccess) {
        for (let i = 0; i < listIdSuccess.length; i++) {
          cylinderImex.push({
            id: listIdSuccess[i],
            status: "FULL",
            condition: "NEW",
          });
        }
      }
    }
    let data = this.form.getValues();
    let toArray = [];
    let numberArray = [];
    let generalList = this.state.GeneralResults;
    let agencyList = this.state.AgencyResults;
    let industryList = this.state.IndustryResults;
    let idImex = Date.now();
    let typeImex = "OUT";
    let flow = "EXPORT";

    toArray.push(this.state.idKhoXe);

    if (typeExport) {
      await this.addHistory(
        nameDriver,
        data.license_plate,
        this.props.product_parse.length !== 0
          ? cylinders
          : this.props.listCylinderDuplicate,
        toArray,
        numberArray,
        this.state.idDriver,
        "Xuat hang tren Web",
        cylinderImex,
        idImex,
        typeImex,
        flow,
        listIdSuccess,
        this.props.listNotPass
      );
      // Sau khi xuat xong se goi API nhap o day
      await this.addHistoryImport(
        nameDriver,
        data.license_plate,
        this.props.product_parse.length !== 0
          ? cylinders
          : this.props.listCylinderDuplicate,
        Constant.IMPORT_TYPE,
        data.station,
        this.state.idDriver,
        "Web signature",
        this.state.userId,
        cylinderImex,
        idImex,
        "IN",
        "IMPORT",
        listIdSuccess,
        toArray[0]
      );
      return;
    }
    await this.addHistory(
      nameDriver,
      data.license_plate,
      this.props.product_parse.length !== 0
        ? cylinders
        : this.props.listCylinderDuplicate,
      toArray,
      numberArray,
      this.state.idDriver,
      "Xuat hang tren Web",
      cylinderImex,
      idImex,
      typeImex,
      flow,
      listIdSuccess,
      this.props.listNotPass
    );
    return;
  }

  handleChangeExportType = (langValue) => {
    this.setState({
      listExportPlaceData: langValue,
      listExportPlaceDataID: langValue.id,
    });
  };

  render() {
    return (
      <div
        className="modal fade"
        id="export-driver-warehouse"
        tabIndex="-1"
        style={{ overflowY: "auto" }}
      >
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Xuất Bình - Bước 2 - Thông Tin Tài Xế
              </h5>
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
                id="card_export_direct"
                // onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body custom-scroll-table">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        <Select2
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Chọn tài xế..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriver.map((l, index) => {
                            return (
                              <Option key={index} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select2>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe </label>
                        <Select2
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Biển số xe"
                          optionFilterProp="children"
                          onChange={(value, name) => {
                            this.setState({
                              license_plate: name.props.children,
                            });
                            this.setState({ idKhoXe: value });
                          }}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listTenKhoXe.map((l, index) => {
                            return (
                              <Option key={index} value={l.value}>
                                {l.label}
                              </Option>
                            );
                          })}
                        </Select2>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={this.onSubmit}
                    disabled={this.state.isLoading}
                    style={{ marginBottom: "25px" }}
                  >
                    {this.state.isLoading ? "Loading..." : "Xuất kho xe"}
                  </Button>
                  <div col-12></div>
                  <button
                    className="btn btn-secondary mt-1"
                    type="reset"
                    data-dismiss="modal"
                  >
                    Đóng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
        {/* <PopupComponent title={"Xuất Trực Tiếp"} content={"Bạn có muốn xuất trực tiếp đến khách hàng này ?"} handleYes={this.onSubmitDirect} /> */}
      </div>
    );
  }
}

export default ExportDriverWarehousePopup;
