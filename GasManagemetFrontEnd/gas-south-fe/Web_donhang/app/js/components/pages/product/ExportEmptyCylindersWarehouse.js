// Xuất vỏ bình nhà máy sửa chữa - Bước 2

import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "../../../../api/createHistoryAPI";
import SelectMulti from "react-select";
import { NAMEDRIVE, GETWAREHOUSE } from "./../../../config/config";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { Select } from "antd";
import getAllBranch from "../../../../api/getAllBranch";
import getAllStation from "../../../../api/getAllStation";
import ReactCustomLoading from "ReactCustomLoading";
import exportCylinderDuplicate from "../../../../api/exportCylinderDuplicate";
import PopupComponent from "../dashBoard/PopupComponent";

const Option = Select.Option;

class ExportEmptyCylindersWarehouse extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      license_plate: "",
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      typeUser: [],
      ListUserSubmit: [],
      ListUserSubmitID: "",
      driverName: "",
      idDriver: "",
      listTenKhoXe: [],
      listDriver: [],
      listStation: [
        {
          value: "",
          name: "Chọn trạm",
        },
      ],
      listBranch: [
        {
          value: "",
          name: "Chọn chi nhánh",
        },
      ],
      //check:"",
      listCheck: [],
      toArray: [],
      isLoading: false,
      userId: "",
      userType: "",
    };
  }
  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async addHistory(
    driver,
    license_plate,
    cylinders,
    number_array,
    toArray,
    idDriver,
    sign,
    cylinderImex,
    successCylinders,
    cylinerIneligible
  ) {
    const { typeExportCylinder } = this.props;
    const { ListUserSubmitID } = this.state;
    // Call api
    this.setState({ isLoading: true });
    if (this.props.product_parse.length !== 0) {
      const user = await createHistoryAPI(
        driver,
        this.state.license_plate,
        cylinders,
        Constants.EXPORT_EMPTY_WAREHOUSE,
        ListUserSubmitID,
        "",
        "",
        "",
        toArray,
        number_array,
        "",
        "",
        "",
        "TO_FIX",
        "",
        idDriver,
        sign,
        cylinderImex,
        Date.now(),
        "OUT",
        "EXPORT_CELL"
      );
      // alert("Thanh cong");
      this.setState({ isLoading: false });

      //
      if (user) {
        if (
          user.status === Constants.HTTP_SUCCESS_CREATED ||
          user.status === Constants.HTTP_SUCCESS_BODY
        ) {
          showToast("Xuất hàng thành công!", 3000);
          // this.setState({ isLoading: false });
          // this.props.handleChangeTypeExportCylinderEmpty()
          const modal = $("#export_fixer_popup");
          modal.modal("hide");
          $("#export-cylinders").modal("hide");
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
    } else {
      if (this.props.listCylinderDuplicate.length !== 0) {
        const result = await exportCylinderDuplicate(
          driver,
          license_plate,
          cylinders,
          Constants.EXPORT_EMPTY_WAREHOUSE,
          ListUserSubmitID,
          "",
          "",
          "",
          toArray,
          number_array,
          "",
          "",
          "",
          "TO_FIX",
          "",
          idDriver,
          sign,
          cylinderImex,
          Date.now(),
          "OUT",
          "EXPORT_CELL",
          successCylinders,
          cylinerIneligible
        );
        this.setState({ isLoading: false });
        if (result) {
          if (result.status === 201) {
            const modal = $("#export-driver-type-cylinder-warehouse");
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
            const modal = $("#export-driver-type-cylinder-warehouse");
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
        // them 1
        const user = await createHistoryAPI(
          driver,
          this.state.license_plate,
          successCylinders,
          Constants.EXPORT_EMPTY_WAREHOUSE,
          this.state.idKhoXe,
          "",
          "",
          this.state.idKhoXe,
          toArray,
          number_array,
          "",
          "",
          "",
          "TO_FIX",
          "",
          idDriver,
          sign,
          cylinderImex,
          Date.now(),
          "OUT",
          "EXPORT_CELL",
          cylinerIneligible
        );
        this.setState({ isLoading: false });

        //
        if (user) {
          if (
            user.status === Constants.HTTP_SUCCESS_CREATED ||
            user.status === Constants.HTTP_SUCCESS_BODY
          ) {
            showToast("Xuất hàng thành công!", 3000);
            // this.props.handleChangeTypeExportCylinderEmpty()
            const modal = $("#export-driver-type-cylinder-warehouse");
            modal.modal("hide");
            $("#export-cylinders").modal("hide");
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
    //this.setState({registerSuccessful: false});
  }
  // xu ly import cho nơi nhận ( dùng khi xuất Trực tiếp : Fixer => Tram)
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
    toId = this.state.idKhoXe
  ) {
    // Call api
    //var toId = isFixer ? parentRoot : this.state.ListUserSubmitID
    this.setState({ isLoading: true });
    let user;
    if (toId && successCylinders.length !== 0) {
      user = await createHistoryAPI(
        driver,
        this.state.license_plate,
        successCylinders,
        "IMPORT_DIRECT",
        idDriver,
        type,
        this.state.idKhoXe,
        fromId,
        "",
        "",
        "",
        "",
        "",
        "TO_FIX",
        "",
        idDriver,
        sign,
        cylinderImex,
        idImex,

        typeImex,
        flow
      );
    }
    this.setState({ isLoading: false });
    //
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
    this.setState({
      userId: user_cookie.user.id,
      userType: user_cookie.user.userType,
    });
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
        //
        this.setState({
          listDriver: res.data.data,
        });
      }
    });

    const test = await getAllStation(user_cookie.user.parentRoot);
    let listbranch = [];
    test.data.data.map((v) => {
      if (v.userType !== "Fixer") {
        listbranch.push({
          value: v.name,
          id: v.id,
          ...v,
        });
      }
    });
    this.setState({
      listBranch: listbranch,
    });
  }

  handleChangeGeneral = async (langValue) => {
    event.preventDefault();

    const data1 = await getAllBranch(langValue);

    let listarr = [];
    data1.data.data.map((v) => {
      //
      listarr.push({
        value: v.name,
        id: v.id,
        ...v,
      });
    });
    this.setState({
      listStation: listarr,
    });

    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,
    });
  };
  handleChangeStation = async (langValue, id) => {
    let toArray = [];
    toArray.push(idKhoXe);
    this.setState({
      listCheck: langValue,
      toArray: toArray,
    });
  };
  onSubmitDirect = () => {
    this.submit(true);
  };
  onSubmit = () => {
    this.submit();
  };
  async submit(typeExport = false) {
    let listIdSuccess = this.props.listIdSuccess.concat(
      this.props.cylinderNotCreate
    );
    // event.preventDefault();
    this.setState({ isLoading: true });
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    let cylinders = [];
    let cylinderImex = [];
    //
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
    let toArray = [];
    let numberArray = [];
    let listcheck = this.state.listCheck;
    if (!listcheck) {
      this.setState({ isLoading: false });
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      toArray = this.state.toArray;
      numberArray.push(1);
    }
    if (typeExport) {
      if (toArray.length > 1) {
        showToast("Chỉ được xuất trực tiếp cho 1 khách hàng");
        this.setState({ isLoading: false });
        return;
      }
      const exportResult = await this.addHistory(
        nameDriver,
        this.state.license_plate,
        this.props.product_parse.length !== 0
          ? cylinders
          : this.props.listCylinderDuplicate,
        numberArray,
        toArray,
        data.idDriver,
        sign,
        cylinderImex,
        listIdSuccess,
        this.props.listNotPass
      );
      if (true) {
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
        let idImex = Date.now();
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
          "IN",
          "IMPORT_CELL",
          listIdSuccess,
          toArray[0]
        );
      }
      return;
    }
    await this.addHistory(
      nameDriver,
      this.state.license_plate,
      this.props.product_parse.length !== 0
        ? cylinders
        : this.props.listCylinderDuplicate,
      numberArray,
      toArray,
      data.idDriver,
      sign,
      cylinderImex,
      listIdSuccess,
      this.props.listNotPass
    );
  }

  render() {
    //
    const nameExport = "Công ty con - chi nhánh trực thuộc";
    return (
      <div
        className="modal fade"
        id="export-driver-type-cylinder-warehouse"
        tabIndex="-1"
      >
        <ReactCustomLoading isLoading={this.state.isLoading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Xuất vỏ bình - Bước 2 - Thông Tin Tài Xế
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
              >
                <div className="card-body custom-scroll-table">
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
                        </Select>
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
                    {this.state.isLoading ? "isLoading..." : "Xuất kho xe"}
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
        <PopupComponent
          title={"Xuất Trực Tiếp"}
          content={"Bạn có muốn xuất trực tiếp đến đơn vị sửa chữa không ?"}
          handleYes={this.onSubmitDirect}
        />
      </div>
    );
  }
}

export default ExportEmptyCylindersWarehouse;
