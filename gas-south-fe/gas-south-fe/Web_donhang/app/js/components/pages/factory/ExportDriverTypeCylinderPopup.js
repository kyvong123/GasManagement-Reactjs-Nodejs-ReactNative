// Xuất Vỏ Bình - Bước 2
import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import getAllPartnerAPI from "getPartnerAPI";
import getDestinationUserAPI from "getDestinationUserAPI";
import getListStation from "../../../../api/getListStation";
import { NAMEDRIVE, GETWAREHOUSE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading";
import getAllStation from "../../../../api/getAllBranch";
import exportCylinderDuplicate from "../../../../api/exportCylinderDuplicate";
import PopupComponent from "../dashBoard/PopupComponent";
const Option = Select.Option;

function getList() {
  return new Promise(function(resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}
class ExportDriverTypeCylinderPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      idKhoXe: "",
      license_plate: "",
      listTenKhoXe: [],
      content: "",
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      typeUser: [],
      ListUserSubmit: [],
      ListUserSubmitID: "",
      nameDriver: "",
      idDriver: "",
      listDriver: [],
      isLoading: false,
      show: false,
      list: [],
      listStation: [],
      loading: false,
      listBranch: [],
      listStations: [],
      getStation: [],
      toArray: [],
      userId: "",
    };
  }
  handleComfirmExport = () => {
    let text = "Bạn có muốn xuất trực tiếp đến đơn vị sửa chữa này ?";
    if (confirm(text) == true) {
      text = "You pressed OK!";
      this.onSubmitDirect();
    } else {
      text = "You canceled!";
      console.log(text);
    }
  };
  onSubmit = (nameExport) => {
    try {
      const data = this.form.getValues();
      if (!this.state.idDriver) throw "Phải nhập tên tài xế !";
      if (!this.state.license_plate) throw "Phải nhập biển số xe !";
      if (!this.state.listStations.length && !this.state.ListUserSubmit.length)
        throw `Phải nhập ${nameExport} !`;
      if (
        !this.state.getStation.length &&
        this.props.typeExportCylinder === Constants.BUY
      )
        throw "Phải nhập trạm !";
      this.setState({ isLoading: true });
      getList().then((list) => {
        this.setState({
          isLoading: false,
          list,
          show: false,
        });
      });
      this.submit();
    } catch (e) {
      this.setState({ isLoading: false });
      showToast(e);
    }
  };
  onSubmitDirect = () => {
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

  async addHistory(
    driver,
    license_plate,
    typeExportCylinder,
    number_array,
    toArray,
    cylindersWithoutSerial,
    cylinders,
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
    // console.log(this.state.ListUserSubmitID);
    this.setState({ isLoading: true });
    if (this.props.product_parse.length !== 0) {
      const user = await createHistoryAPI(
        driver,
        this.state.license_plate,
        cylinders,
        Constants.EXPORT_TYPE,
        this.state.ListUserSubmitID,
        "",
        cylindersWithoutSerial,
        "",
        toArray,
        number_array,
        "",
        "",
        "",
        this.props.typeExportCylinder,
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
          user.status === Constants.HTTP_SUCCESS_CREATED ||
          user.status === Constants.HTTP_SUCCESS_BODY
        ) {
          showToast("Xuất hàng thành công!", 3000);
          this.props.handleChangeTypeExportCylinderEmpty();
          const modal = $("#export-driver-type-cylinder");

          modal.modal("hide");
          $("#export-driver-type-cylinder").modal("hide");
          setTimeout(function() {
            window.location.reload();
          }, 2000);
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
      // this.setState({ ListUserSubmit: [] });
    } else {
      if (this.props.listCylinderDuplicate.length !== 0) {
        const result = await exportCylinderDuplicate(
          driver,
          this.state.license_plate,
          cylinders,
          Constants.EXPORT_TYPE,
          this.state.ListUserSubmitID,
          "",
          cylindersWithoutSerial,
          "",
          toArray,
          number_array,
          "",
          "",
          "",
          this.props.typeExportCylinder,
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
            }, 2000);
            return true;
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
            }, 2000);
            return false;
          }
        } else {
          showToast("Xảy ra lỗi trong quá trình xuất bình trùng");
          return false;
        }
      } else {
        const user = await createHistoryAPI(
          driver,
          this.state.license_plate,
          successCylinders,
          Constants.EXPORT_TYPE,
          this.state.ListUserSubmitID,
          "",
          cylindersWithoutSerial,
          "",
          toArray,
          number_array,
          "",
          "",
          "",
          this.props.typeExportCylinder,
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
            user.status === Constants.HTTP_SUCCESS_CREATED ||
            user.status === Constants.HTTP_SUCCESS_BODY
          ) {
            showToast("Xuất hàng thành công!", 3000);
            this.props.handleChangeTypeExportCylinderEmpty();
            const modal = $("#export-driver-type-cylinder");

            modal.modal("hide");
            $("#export-driver-type-cylinder").modal("hide");
            setTimeout(function() {
              window.location.reload();
            }, 2000);
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
      }
    }
  }
  // xu ly import cho nơi nhận ( dùng khi xuất Trực tiếp : Tram => Fixer ; Tram => Tram)
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
    const { typeExportCylinder } = this.props;
    // Call api
    //var toId = isFixer ? parentRoot : this.state.ListUserSubmitID
    this.setState({ isLoading: true, loading: true });
    let user;
    if (toId && successCylinders.length !== 0) {
      user = await createHistoryAPI(
        driver,
        this.state.license_plate,
        successCylinders,
        "IMPORT_DIRECT",
        toId,
        type,
        stationId,
        fromId,
        "",
        "",
        "",
        "",
        "",
        typeExportCylinder,
        "",
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow
      );
    }
    this.setState({ isLoading: false, loading: false });
    //console.log('register',user);
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_CREATED ||
        user.status === Constants.HTTP_SUCCESS_BODY
      ) {
        showToast("Nhập hàng thành công!", 3000);
        this.props.handleChangeTypeExportCylinderEmpty();
        const modal = $("#import-driver-type-fixer");
        modal.modal("hide");
        setTimeout(function() {
          window.location.reload();
        }, 2000);
        //this.props.refresh();
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast(
        "Nhập trực tiếp không thành công, vui lòng nhập lại khi đến đơn vị nhận"
      );
      return false;
    }
  }
  handleChangeBranch = async (e) => {
    let data = await getAllStation(e);

    this.setState({
      listStations: data.data.data,
    });
    // console.log("handleChangeBranch", this.state.listStations)
  };
  handleChangeStation = async (e, id) => {
    // console.log("handleChangeStation", id)
    let toArray = [];
    await id.map((v) => {
      toArray.push(v.props.id);
    });
    this.setState({
      getStation: e,
      toArray: toArray,
    });
    // console.log("v.props.id", this.state.toArray)
  };
  handleChangeGeneral = async (langValue) => {
    // console.log("handleChangeGeneral", langValue)
    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,
    });
  };

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async componentDidMount() {
    // console.log("Constants.TO_FIX", Constants.TO_FIX)
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      id: user_cookie.user.id,
    };
    let params_khoxe = {
      id: "all",
    };
    let result = await callApi("POST", GETWAREHOUSE, params_khoxe, token);
    if (result)
      this.setState({
        listTenKhoXe: result.data.data.map((item) => {
          return { value: item.id, label: item.name };
        }),
      });
    this.setState({ userId: user_cookie.user.id });
    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
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
    let arr = [];
    let arrbranch = [];
    let data = await getListStation(user_cookie.user.id, "Fixer");
    if (data.data.success === true) {
      data.data.data.map((v) => {
        arr.push({
          label: v.name,
          value: v.id,
          id: v.id,
        });
      });
    } else {
      showToast(data.data.message);
    }
    let databranch = await getListStation(user_cookie.user.id, "Region");
    if (databranch.data.success === true) {
      databranch.data.data.map((v) => {
        arrbranch.push({
          label: v.name,
          value: v.id,
        });
      });
    } else {
      showToast(data.data.message);
    }
    this.setState({
      listStation: arr,
      listBranch: arrbranch,
    });
  }

  async submit(typeExport = false) {
    let listIdSuccess = this.props.listIdSuccess.concat(
      this.props.cylinderNotCreate
    );
    this.setState({ loading: true });
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    var cylinders = [];
    let cylinderImex = [];
    // console.log("this.propss", this.props)
    if (this.props.product_parse.length !== 0) {
      for (let i = 0; i < this.props.product_parse.length; i++) {
        cylinders.push(this.props.product_parse[i].id);
        cylinderImex.push({
          id: this.props.product_parse[i].id,
          status: "EMPTY",
          condition: "NEW",
        });
      }
    } else {
      if (this.props.listCylinderDuplicate) {
        for (let i = 0; i < this.props.listCylinderDuplicate.length; i++) {
          cylinderImex.push({
            id: this.props.listCylinderDuplicate[i],
            status: "EMPTY",
            condition: "NEW",
          });
        }
      }
      if (listIdSuccess) {
        for (let i = 0; i < listIdSuccess.length; i++) {
          cylinderImex.push({
            id: listIdSuccess[i],
            status: "EMPTY",
            condition: "NEW",
          });
        }
      }
    }
    let data = this.form.getValues();
    data.idDriver = listDriver[index].id;
    let sign = "Web signature";
    // console.log(data);
    let toArray = [];
    let numberArray = [];
    let listUserSubmit = this.state.ListUserSubmit;
    let idImex = Date.now();
    let typeImex = "OUT";

    let flow = "EXPORT_CELL";
    if (listUserSubmit.length === 0 && !this.state.getStation) {
      this.setState({ loading: false });
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      if (this.props.typeExportCylinder === Constants.BUY) {
        for (let i = 0; i < this.state.getStation.length; i++) {
          toArray = this.state.toArray;
          numberArray.push(data["numberGeneral" + i]);
        }
      } else {
        for (let i = 0; i < listUserSubmit.length; i++) {
          toArray.push(listUserSubmit[i].value);
          numberArray.push(data["numberGeneral" + i]);
        }
      }
    }
    if (typeExport) {
      if (toArray.length > 1) {
        showToast("Chỉ được xuất trực tiếp cho 1 đơn vị");
        this.setState({ loading: false });
        return;
      }

      const exportResult = await this.addHistory(
        nameDriver,
        this.state.license_plate,
        "",
        numberArray,
        toArray,
        data.number_cylinder,
        this.props.product_parse.length !== 0
          ? cylinders
          : this.props.listCylinderDuplicate,
        data.idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow,
        listIdSuccess,
        this.props.listNotPass
      );
      //sau khi xuat xong thi Nhap
      if (exportResult) {
        if (this.props.listIdNotpass) {
          listIdSuccess = listIdSuccess.concat(this.props.listIdNotpass);
          for (let i = 0; i < this.props.listIdNotpass.length; i++) {
            cylinderImex.push({
              id: this.props.listIdNotpass[i],
              status: "EMPTY",
              condition: "NEW",
            });
          }
        }
        typeImex = "IN";
        flow = "IMPORT_CELL";
        await this.addHistoryImport(
          nameDriver,
          this.state.license_plate,
          this.props.listCylinderDuplicate.length !== 0
            ? this.props.listCylinderDuplicate
            : cylinders,
          Constants.IMPORT_TYPE,
          data.station,
          this.state.idDriver,
          sign,
          this.state.userId,
          cylinderImex,
          idImex,
          typeImex,
          flow,
          listIdSuccess,
          toArray[0]
        );
      }
      return;
    }
    await this.addHistory(
      nameDriver,
      this.state.license_plate,
      "",
      numberArray,
      toArray,
      data.number_cylinder,
      this.props.product_parse.length !== 0
        ? cylinders
        : this.props.listCylinderDuplicate,
      data.idDriver,
      sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,
      listIdSuccess,
      this.props.listNotPass
    );
    return;
  }
  render() {
    // console.log("data expot 2:",this.props.listUserFixer);
    const nameExport =
      this.props.typeExportCylinder === Constants.RENT
        ? "Đối tác cho thuê"
        : this.props.typeExportCylinder === Constants.BUY
        ? "Nơi nhận"
        : this.props.typeExportCylinder === Constants.RETURN_CYLINDER
        ? "Xuất trả"
        : "Sửa chữa";
    return (
      <div
        className="modal fade"
        id="export-driver-type-cylinder"
        tabIndex="-1"
        style={{ overflowY: "auto" }}
      >
        {this.state.loading} && (
        <ReactCustomLoading isLoading={this.state.loading} />)
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Xuất Vỏ Bình - Bước 2 - Thông Tin Tài Xế
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => this.setState({ ListUserSubmit: [] })}
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
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Chọn biển số xe..."
                          optionFilterProp="children"
                          onChange={(value) => {
                            this.setState({
                              license_plate: value,
                              idKhoXe: value,
                            });
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
                        </Select>
                      </div>
                    </div>
                    {this.props.typeExportCylinder === Constants.TO_FIX ||
                    this.props.typeExportCylinder === Constants.RENT ? (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{nameExport}</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={
                              this.props.typeExportCylinder === Constants.TO_FIX
                                ? this.state.listStation
                                : this.props.listUsersPartner
                            }
                            onChange={this.handleChangeGeneral.bind(this)}
                            placeholder="Chọn..."
                            value={this.state.ListUserSubmit}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {this.props.typeExportCylinder === Constants.BUY ? (
                      <div className="col-md-6">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{nameExport}</label>
                            <Select
                              onChange={(e) => this.handleChangeBranch(e)}
                            >
                              {this.state.listBranch.map((v, i) => {
                                return (
                                  <Option value={v.value} key={v.value}>
                                    {v.label}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Trạm</label>
                            <Select
                              onChange={(e, id) =>
                                this.handleChangeStation(e, id)
                              }
                              mode="multiple"
                            >
                              {this.state.listStations.map((v, i) => {
                                // console.log("listStationss", v)
                                return (
                                  <Option value={v.name} id={v.id} key={i}>
                                    {v.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {this.props.typeExportCylinder !==
                    Constants.TO_FIX ? null : (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Số lượng bình không mã</label>
                          <Input
                            className="form-control"
                            type="number"
                            name="number_cylinder"
                            id="number_cylinder"
                            //validations={[required]}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.props.typeExportCylinder === Constants.BUY
                            ? this.state.getStation.map((store, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {store}
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
                              })
                            : this.state.ListUserSubmit.map((store, index) => {
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
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={this.handleComfirmExport}
                    disabled={this.state.isLoading}
                    style={{ marginBottom: "25px" }}
                  >
                    {this.state.isLoading ? "Loading..." : "Xuất Trực Tiếp"}
                  </Button>
                  <div col-12></div>
                  <button
                    onClick={() => this.setState({ ListUserSubmit: [] })}
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

export default ExportDriverTypeCylinderPopup;
