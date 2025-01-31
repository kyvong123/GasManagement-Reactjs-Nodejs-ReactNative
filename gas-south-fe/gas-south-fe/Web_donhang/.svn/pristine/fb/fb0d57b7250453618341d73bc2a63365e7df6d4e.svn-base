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
import { NAMEDRIVE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import createHistoryAPI from "createHistoryAPI";
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading";
import exportCylinderDuplicate from "../../../../api/exportCylinderDuplicate"
const Option = Select.Option;

function getList() {
  return new Promise(function (resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}

class ExportDriverFactoryPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
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
    };
  }

  onSubmit = (event) => {
    this.setState({ isLoading: true });
    getList().then((list) => {
      this.setState({
        isLoading: false,
        list,
        show: false,
      });
    });
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
        license_plate,
        cylinders,
        Constant.EXPORT_FACTORY,
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
        flow
      );
      this.setState({ isLoading: false });
      //console.log('register',user);
      if (user) {
        if (
          user.status === Constant.HTTP_SUCCESS_CREATED ||
          user.status === Constant.HTTP_SUCCESS_BODY
        ) {
          this.setState({ loading: false });
          showToast("Xuất hàng thành công!", 3000);
          const modal = $("#export-driver");
          modal.modal("hide");
          setTimeout(function () {
            window.location.reload()
          }, 2000);
          return true;
        } else {
          this.setState({ loading: false });
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
    }
    else {
      if (this.props.listCylinderDuplicate.length !== 0) {
        const result = await exportCylinderDuplicate(
          driverName,
          license_plate,
          cylinders,
          Constant.EXPORT_FACTORY,
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
        )
        if (result) {
          if (result.status === 201) {
            this.setState({
              loading: false,
            })
            const modal = $("#export-driver-type-cylinder");
            modal.modal('hide');
            showToast("Xuất hàng thành công")
            setTimeout(function () {
              window.location.reload()
            }, 2000);
          }
          else {
            this.setState({
              loading: false,
            })
            let res = confirm(result.data.err_msg + ". Bạn có muốn xem danh sách mã bình không?")
            if (res === true) {
              const element = document.createElement("a");
              const file = new Blob([result.data.err_cylinders],
                { type: 'text/plain;charset=utf-8' });
              element.href = URL.createObjectURL(file);
              element.download = "Mã bình trùng.txt";
              document.body.appendChild(element);
              element.click();
            }
            const modal = $("#export-driver-type-cylinder");
            modal.modal('hide');
            setTimeout(function () {
              window.location.reload()
            }, 2000);
          }
        }
        else {
          showToast("Xảy ra lỗi trong quá trình xuất bình trùng")
        }
      }
      else {
        const user = await createHistoryAPI(
          driverName,
          license_plate,
          successCylinders,
          Constant.EXPORT_FACTORY,
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
          cylinerIneligible
        )
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
          if (
            user.status === Constant.HTTP_SUCCESS_CREATED ||
            user.status === Constant.HTTP_SUCCESS_BODY
          ) {
            this.setState({ loading: false });
            showToast("Xuất hàng thành công!", 3000);
            const modal = $("#export-driver");
            modal.modal("hide");
            setTimeout(function () {
              window.location.reload()
            }, 2000);
            return true;
          } else {
            this.setState({ loading: false });
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
    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      console.log("testdata", res.data);
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

  async submit(event) {
    console.log("propssss", this.props)
    let listIdSuccess = this.props.listIdSuccess.concat(this.props.cylinderNotCreate)
    this.setState({ loading: true });
    event.preventDefault();
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
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
    }
    else {
      if (this.props.listCylinderDuplicate) {
        for (let i = 0; i < this.props.listCylinderDuplicate.length; i++) {
          cylinderImex.push(
            {
              id: this.props.listCylinderDuplicate[i],
              status: "FULL",
              condition: "NEW"
            }
          )
        }
      }
      if (listIdSuccess) {
        for (let i = 0; i < listIdSuccess.length; i++) {
          cylinderImex.push(
            {
              id: listIdSuccess[i],
              status: "FULL",
              condition: "NEW"
            }
          )
        }
      }
    }
    let data = this.form.getValues();
    //console.log(data["numberGeneral1"]);
    let toArray = [];
    let numberArray = [];
    let generalList = this.state.GeneralResults;
    let agencyList = this.state.AgencyResults;
    let industryList = this.state.IndustryResults
    let idImex = Date.now();
    let typeImex = "OUT";
    let flow = "EXPORT";

    if (agencyList.length === 0 && generalList.length === 0 && industryList.length === 0) {
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      for (let i = 0; i < generalList.length; i++) {
        toArray.push(generalList[i].value);
        if (data["numberGeneral" + i])
          numberArray.push(data["numberGeneral" + i]);
        else numberArray.push(0);
      }
      for (let i = 0; i < agencyList.length; i++) {
        toArray.push(agencyList[i].value);
        if (data["numberAgency" + i])
          numberArray.push(data["numberAgency" + i]);
        else numberArray.push(0);
      }
      for (let i = 0; i < industryList.length; i++) {
        toArray.push(industryList[i].value);
        if (data["numberIndustry" + i])
          numberArray.push(data["numberIndustry" + i]);
        else numberArray.push(0);
      }
    }

    await this.addHistory(
      nameDriver,
      data.license_plate,
      this.props.product_parse.length !== 0 ? cylinders : this.props.listCylinderDuplicate,
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
    console.log("hahahhahaha", this.props);
    return (
      <div
        className="modal fade"
        id="export-driver"
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
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        <Select
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
                        </Select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe </label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          validations={[required]}
                        />
                      </div>
                    </div>

                    {/*<div className="col-md-12">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Loại xuất </label>*/}
                    {/*        <Select onClick={() => {*/}
                    {/*            this.setState({isShowDropdown: this.form.getValues().type_export})*/}
                    {/*        }} className="form-control"*/}
                    {/*                name="type_export"*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="0">-- Chọn --</option>*/}
                    {/*            <option value="2">Xuất cho thương nhân mua bán</option>*/}
                    {/*            <option value="3">Xuất cho Hệ Thống CH Bán Lẻ</option>*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*{this.props.userType === Constant.FACTORY && (*/}
                    {/*    <div className="col-md-12">*/}
                    {/*        <div className="form-group">*/}
                    {/*            <label>"Địa điểm xuất bình"</label>*/}
                    {/*            <Select*/}
                    {/*                options={this.props.listExportPlace}*/}
                    {/*                onChange={this.handleChangeExportType.bind(this)}*/}
                    {/*                placeholder="Chọn..."*/}
                    {/*                value={this.state.listExportPlaceData}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {this.props.userType === Constant.GENERAL ? (
                      ""
                    ) : (
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Tổng đại lý</label>
                            <SelectMulti.Creatable
                              multi={true}
                              options={this.props.listFactoryExports.filter(
                                (x) => x.userType === Constant.GENERAL && !x.customerType
                              )}
                              onChange={this.handleChangeGeneral.bind(this)}
                              placeholder="Chọn..."
                              value={this.state.GeneralResults}
                              promptTextCreator={() => {
                                return;
                              }}
                            />
                          </div>
                        </div>
                      )}

                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Hệ Thống CH Bán Lẻ</label>

                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(
                            (x) => x.userType === Constant.AGENCY
                          )}
                          onChange={this.handleChangeAgency.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.AgencyResults}
                          promptTextCreator={() => {
                            return;
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                    <div className="form-group">
                        <label>Khách hàng công nghiệp</label>

                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(
                            (x) => x.customerType === "Industry"
                          )}
                          onChange={this.handleChangeIndustry.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.IndustryResults}
                          promptTextCreator={() => {
                            return;
                          }}
                        />
                      </div>
                    </div>
                    {this.props.userType === Constant.GENERAL ? (
                      ""
                    ) : (
                        <div className="col-md-4">
                          <table
                            className="table table-striped table-bordered seednet-table-keep-column-width"
                            cellSpacing="0"
                          >
                            <tbody className="display-block display-tbody">
                              {this.state.GeneralResults.map((store, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {store.name}
                                    </td>
                                    <td scope="row" className="text-center">
                                      <Input
                                        name={"numberGeneral" + index}
                                        placeholder={"Nhập số lượng"}
                                        validations={[required]}
                                        className="form-control"
                                        type="number"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    <div className="col-md-4">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.AgencyResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberAgency" + index}
                                    placeholder={"Nhập số lượng"}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-4">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.IndustryResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberIndustry" + index}
                                    placeholder={"Nhập số lượng"}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* {this.state.isShowDropdown==='1' && (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Trạm chiết nạp</label>
                                                <Select className="form-control"
                                                        name="station"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listStationUser.map((item, index) => <option value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
                                        </div>)} */}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button
                    className="btn btn-primary"
                    type="submit"
                    onClick={this.onSubmit}
                    disabled={this.state.isLoading}
                  >
                    {this.state.isLoading ? "Loading..." : "Lưu"}
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "50px" }}
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

export default ExportDriverFactoryPopup;
