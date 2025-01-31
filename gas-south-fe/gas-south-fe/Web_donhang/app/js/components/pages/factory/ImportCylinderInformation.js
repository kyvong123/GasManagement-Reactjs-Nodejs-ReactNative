// Nhập hồi lưu - Bước 1
import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";
import Constant from "Constants";
import ReactCustomLoading from "ReactCustomLoading";
import getCylinderDuplicate from "../../../../api/getCylinderDuplicate";
import getExportPlace from "../../../../api/getExportPlaces";
import autoCreateCylinder from "../../../../api/autoCreateCylinder"
import getUserCookies from "getUserCookies";
import { Select, Tabs, Progress, Button } from "antd";
import { DownloadOutline } from "@ant-design/icons";
const { TabPane } = Tabs;
const { Option } = Select;
var fileReader;

class ImportCylinderInformation extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      percent: 0,
      content: "",
      listProducts: [],
      error: "",
      inputKey: Date.now(),
      file: null,
      loading: false,
      listDuplicate: [],
      listCylinder: [],
      disableTab1: false,
      disableTab2: false,
      disableTab3: true,
      listErr: [],
      listOk: [],
      errCyl_notDelivering: [],
      errCyl_notCorrectDestination: [],
      errCyl_notCreated: [],
    };
  }
  handleFileUpload(event, isCheck) {
    this.setState({
      loading: true,
      disableTab1: true,
      disableTab2: true,
      disableTab3: true,
      errCyl_notCreated: []
    });
    let that = this;
    let file = null;
    event.preventDefault();
    if (isCheck) {
      this.fileInput.value = null;
      this.setState({
        file,
        error: "",
        listProducts: [],
        loading: false,
      });
    } else {
      file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onload = async function (event) {
        let result = event.target.result;
        let arraynew = result
          .trim()
          .split("\n")
          .map((item) => item.replace(/\r|\n/gi, ""))
          .filter((item) => item != "");
        let cylinders_list = [];
        //
        let couting = {};
        let ab = [];
        arraynew.forEach((str) => {
          couting[str] = (couting[str] || 0) + 1;
        });
        if (Object.keys(couting).length !== arraynew.length) {
          let str;
          for (str in couting) {
            if (couting.hasOwnProperty(str)) {
              if (couting[str] > 1) {
                let a = str + ' có ' + couting[str] + ' lần trùng';
                ab.push(a);
              }
            }
          }
        }
        //ham loc bình trùng
        const array_id = Object.keys(couting);
        //
        let onePerCern = Math.floor(array_id.length / 100);
        let resultSearch,
          errCyl_notDelivering = [],
          errCyl_notCorrectDestination = [],
          errCyl_inFactory = [],
          errCyl_inFixer = [],
          errCyl_notCreated = [],
          errCyl_notInSystem = [],
          success_cylinders = [],
          success_idCylinders = [],
          successCylinders = [],
          tempStatus = 200,
          success = false

        if (array_id.length < 100) {
          let temp = await getInformationFromCylinders(array_id, "IMPORT");
          if (temp.status !== 200) {
            showToast("Xảy ra rỗi khi kết nối tới máy chủ");
          }
          if (temp.data.err_msg) {
            errCyl_notDelivering = errCyl_notDelivering.concat(temp.data.errCyl_notDelivering);
            errCyl_notCorrectDestination = errCyl_notCorrectDestination.concat(temp.data.errCyl_notCorrectDestination);
            errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
            errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
            errCyl_inFactory = errCyl_inFactory.concat(temp.data.errCyl_inFactory);
            errCyl_inFixer = errCyl_inFixer.concat(temp.data.errCyl_inFixer);
            success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
            success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
            successCylinders = temp.data.successCylinders;
            if (temp.data.success) {
              success = temp.data.success;
            }
          } else {
            let tempIf = temp.data.map((item) => item.serial);
            success_cylinders = success_cylinders.concat(tempIf);

            let tempIf2 = temp.data.map((item) => item.id);
            success_idCylinders = success_idCylinders.concat(tempIf2);

            let tempIf3 = temp.data;
            successCylinders = successCylinders.concat(tempIf3);
          }
          tempStatus = temp.status;
        } else {
          for (let i = 0; i < 100; i += 10) {
            let array;

            if (i === 90) {
              array = array_id.slice(i * onePerCern, array_id.length);
            } else {
              array = array_id.slice(i * onePerCern, (i + 10) * onePerCern);
            }

            that.setState({ percent: i + 10 });

            let temp = await getInformationFromCylinders(array, "IMPORT");
            if (temp.status !== 200) {
              tempStatus = temp.status;
              showToast("Xảy ra rỗi khi kết nối tới máy chủ");
              break;
            }

            if (temp.data.hasOwnProperty("err_msg")) {
              errCyl_notDelivering = errCyl_notDelivering.concat(temp.data.errCyl_notDelivering);
              errCyl_notCorrectDestination = errCyl_notCorrectDestination.concat(temp.data.errCyl_notCorrectDestination);
              errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
              errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
              errCyl_inFactory = errCyl_inFactory.concat(temp.data.errCyl_inFactory);
              errCyl_inFixer = errCyl_inFixer.concat(temp.data.errCyl_inFixer);
              success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
              success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
              let tempIf = temp.data.successCylinders;
              successCylinders = successCylinders.concat(tempIf);
            } else {
              let tempIf = temp.data.map((item) => item.serial);
              success_cylinders = success_cylinders.concat(tempIf);
              let tempIf2 = temp.data.map((item) => item.id);
              success_idCylinders = success_idCylinders.concat(tempIf2);
              let tempIf3 = temp.data;
              successCylinders = successCylinders.concat(tempIf3);
            }
          }
          that.setState({ percent: 0 });
        }

        resultSearch = {
          data: {
            errCyl_notDelivering: errCyl_notDelivering,
            errCyl_notCorrectDestination: errCyl_notCorrectDestination,
            errCyl_notCreated: errCyl_notCreated,
            errCyl_notInSystem: errCyl_notInSystem,
            errCyl_inFactory: errCyl_inFactory,
            errCyl_inFixer: errCyl_inFixer,
            success_cylinders: success_cylinders,
            success_idCylinders: success_idCylinders,
            successCylinders: successCylinders,
            success: success,
          },
          status: tempStatus,
        };

        if (resultSearch.status === 200) {
          that.setState({
            loading: false,
            listProducts: [],
          });

          if (errCyl_notDelivering.length || errCyl_notCorrectDestination.length ||
            resultSearch.data.errCyl_inFactory.length ||
            resultSearch.data.errCyl_inFixer.length || errCyl_notCreated.length || errCyl_notInSystem.length || ab.length) {
            let err1 = "",
              err2 = "",
              err3 = "",
              err4 = "",
              err5 = "",
              err6 = "",
              errorShow = "";
            const regex = /#/gi;

            console.log("Cyan Test Pass");
            if (errCyl_notDelivering.length) {
              err1 = `Có ${errCyl_notDelivering.length} mã chưa xuất nên không thể nhập.#`;
            }
            if (errCyl_notCorrectDestination.length) {
              err2 = `Có ${errCyl_notCorrectDestination.length} mã không thể nhập vì không xuất cho doanh nghiệp sở tại.#`;
            }
            if (errCyl_notCreated.length + errCyl_notInSystem.length) {
              err3 = `Có ${errCyl_notCreated.length} mã chưa khai báo.#`;
            }
            if (ab.length) {
              err4 = ab.toString();
            }
            if (errCyl_inFixer.length) {
              err5 = `Có ${errCyl_inFixer.length} mã ở nhà máy khác.#`;
            }
            if (errCyl_inFactory.length) {
              err6 = `Có ${errCyl_inFactory.length} mã ở trạm khác.#`;
            }
            errorShow = (err1 + err2 + err3 + err4 + err5 + err6).replace(regex, "\n").trim();
            that.setState({
              error: errorShow,
              listErr: errCyl_notCorrectDestination
                .concat(errCyl_notDelivering)
                .concat(errCyl_notCreated)
                .concat(errCyl_notInSystem)
                .concat(errCyl_inFactory)
                .concat(errCyl_inFixer),
              disableTab2: false,
              errCyl_inFixer: errCyl_inFixer,
              errCyl_inFactory: errCyl_inFactory,
              errCyl_notDelivering: errCyl_notDelivering,
              errCyl_notCorrectDestination: errCyl_notCorrectDestination,
              errCyl_notCreated: errCyl_notCreated.concat(errCyl_notInSystem),
            });
          }
          //Kiểm tra và lấy mã bình đạt
          if (resultSearch.data.success_cylinders.length !== 0) {
            that.setState({
              listOk: resultSearch.data.success_cylinders,
              disableTab1: false,
            });
            //lấy id bình đạt
            that.props.getSuccessIdCylinders(resultSearch.data.success_idCylinders);
            let tempGetDriver = successCylinders.filter((item) => item !== undefined);
            that.props.getListProducts(tempGetDriver);
          }
          //Gọi API lấy danh sách bình trùng
          let temp = errCyl_notCorrectDestination.concat(errCyl_notDelivering).concat(errCyl_inFixer)
            .concat(errCyl_inFactory);
          let result = await getCylinderDuplicate(temp);
          let arr = [];
          result.data.listDuplicate.map((value) => {
            arr.push(value.id);
          });
          that.props.getListCylinderDuplicate(arr);
          if (result.data.listDuplicate.length !== 0) {
            that.setState({
              listDuplicate: result.data.listDuplicate,
              disableTab3: false,
            });
          }
          //showToast(resultSearch.data.err_msg);
        } else {
          that.setState({ loading: false });
          showToast("Lỗi đường truyền, vui lòng thử lại");
        }
      };
      fileReader.readAsText(file);
    }
  }

  handleDownload = () => {
    if (this.state.listErr.length !== 0) {
      const element = document.createElement("a");
      const file = new Blob(
        [
          "--Bình chưa xuất--: ",
          "\r\n",
          this.state.errCyl_notDelivering,
          "\r\n\r\n",
          "--Bình đang không thể nhập vì xuất cho trạm khác--: ",
          "\r\n",
          this.state.errCyl_notCorrectDestination,
          "\r\n\r\n",
          "--Bình chưa khai báo--: ",
          "\r\n",
          this.state.errCyl_notCreated,
          "\r\n\r\n",
          "--Bình đang ở trạm khác--: ",
          "\r\n",
          this.state.errCyl_inFactory,
          "\r\n\r\n",
          "--Bình đang ở nhà máy--: ",
          "\r\n",
          this.state.errCyl_inFixer,
        ],
        { type: "text/plain;charset=utf-8" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "Mã không đạt.txt";
      document.body.appendChild(element);
      element.click();
    }
  };

  async getExportPlace() {
    let id = "",
      listId = [];
    this.state.listDuplicate.map((value) => {
      value.duplicateCylinders.map((value) => {
        listId.push(value.copy);
        id = listId.join();
      });
    });
    let result = await getExportPlace(id);
    if (result.data.data.length !== 0) {
      this.props.getExportPlace(result.data.data);
    } else {
      showToast(result.data.message);
    }
  }
  handleUpload = async () => {
    let user_cookies = await getUserCookies();
    let result = await autoCreateCylinder(user_cookies.user.id, this.state.errCyl_notCreated)
    if (result.data.success === true) {
      showToast("Upload bình chưa khai báo thành công")
    }
    else {
      showToast(result.data.message)
    }
  }
  handleContinue = async () => {
    this.props.cylinderNotPass(this.state.errCyl_notDelivering.concat(this.state.errCyl_notCorrectDestination))
  }
  handleResetInput = () => {
    this.setState({
      error: "",
      errCyl_notCreated: [],
      listOk: [],
      listErr: [],
      listDuplicate: []
    })
  }
  render() {
    const { typeExportCylinder, isFactory } = this.props;
    // console.log(typeExportCylinder, isFactory)
    return (
      <div className="modal fade" id="import-cylinder-information" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading}>
          <Progress percent={this.state.percent} status="active" />
        </ReactCustomLoading>

        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{`Nhập Vỏ - Bước 1 - Nhập File`}</h5>
              <button type="reset" className="close" data-dismiss="modal" onChange={() => {this.setState({errCyl_inFactory: [], errCyl_notCorrectDestination: [], errCyl_notCreated: [], errCyl_notDelivering: []})}}>
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
                        <label>Hãy nhập tập tin từ đầu đọc</label>
                        <div style={{ display: "flex" }}>
                          <input
                            accept=".txt"
                            className="form-control"
                            type="file"
                            name="upload_file"
                            ref={(input) => {
                              this.fileInput = input;
                            }}
                            onChange={(event) => this.handleFileUpload(event)}
                            validations={[required]}
                          />
                          <input onClick={this.handleResetInput} type="reset" />
                        </div>
                      </div>
                      {this.state.error !== "" ? (
                        <div>
                          <label style={{ color: "red", whiteSpace: "pre" }}>{this.state.error}</label>
                        </div>
                      ) : null}
                    </div>
                    <div className="row custom-scroll-table">
                      <Tabs>
                        <TabPane tab="Bình đạt" key="1" disabled={this.state.disableTab1}>
                          <table className="table table-striped table-bordered seednet-table-keep-column-width" cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px">#STT</th>
                                <th className="w-120px text-center">Mã Bình</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listOk.map((store, index) => {
                                return (
                                  <tr>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {store}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </TabPane>
                        <TabPane tab="Bình không đạt" key="2" disabled={this.state.disableTab2}>
                          <Button type="success" icon={<DownloadOutline />} size="large" onClick={this.handleDownload}>
                            Download
                          </Button>
                          <table className="table table-striped table-bordered seednet-table-keep-column-width" cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px">#STT</th>
                                <th className="w-120px text-center">Mã Bình</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listErr.length !== 0
                                ? this.state.listErr.map((store, index) => {
                                  return (
                                    <tr>
                                      <td scope="row" className="text-center">
                                        {index + 1}
                                      </td>
                                      <td scope="row" className="text-center">
                                        {store}
                                      </td>
                                    </tr>
                                  );
                                })
                                : ""}
                            </tbody>
                          </table>
                        </TabPane>
                        <TabPane tab="Bình trùng" key="3" disabled={this.state.disableTab3}>
                          <table className="table table-striped table-bordered seednet-table-keep-column-width" cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px align-middle">#STT</th>
                                <th className="w-120px text-center align-middle">Số serial</th>
                                {/* <th className="w-120px text-center align-middle">Xem số serial</th> */}
                              </tr>
                            </thead>
                            <tbody className="custom-scroll-table">
                              {this.state.listDuplicate.map((value, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {value.serial}
                                    </td>
                                    {/* <td scope="row" className="text-center">
                                <Select defaultValue="--Chọn--"
                                  onChange={(value) => this.handleSelect(value)}
                                >
                                  {value.duplicateCylinders ?
                                    value.duplicateCylinders.map((value, index) => {
                                      console.log("hhhhh", value)
                                      return (
                                        <Option value={value.id} key={index}>{value.serial}</Option>
                                      )
                                    }) : ""}
                                </Select>
                              </td> */}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </TabPane>
                        <TabPane tab="Bình chưa khai báo" key="4" >
                          <table className="table table-striped table-bordered seednet-table-keep-column-width" cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px align-middle">#STT</th>
                                <th className="w-120px text-center align-middle">Số serial</th>

                              </tr>
                            </thead>
                            <tbody className="custom-scroll-table">
                              {this.state.errCyl_notCreated.map((value, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {value}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="text-center">
                            <Button className="center" type="success" size="large" onClick={this.handleUpload}>
                              UPLOAD
                            </Button>
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <button
                    // disabled={this.state.listOk.length === 0 && this.state.listProducts.length === 0 && this.state.listDuplicate.length === 0}
                    className="btn btn-primary"
                    onClick={(event) => {
                      this.handleFileUpload(event, true);
                      this.handleContinue()
                      const modal = $("#import-cylinder-information");
                      modal.modal("hide");
                      this.getExportPlace();
                    }}
                    type="button"
                    data-toggle="modal"
                    data-target={
                      this.state.errCyl_notDelivering.length + this.state.errCyl_notCorrectDestination.length + this.state.errCyl_notCreated.length ?
                      typeExportCylinder === Constant.TO_FIX ?
                          isFactory ?
                           "#import_factory_fixer"
                          : "#import-driver-type-fixer"
                        : "#import-driver-type-cylinder"
                      : ""
                    }
                  >
                    Tiếp Tục
                  </button>
                  <button className="btn btn-secondary" type="reset" data-dismiss="modal" style={{ marginLeft: "10px" }}>
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

export default ImportCylinderInformation;
