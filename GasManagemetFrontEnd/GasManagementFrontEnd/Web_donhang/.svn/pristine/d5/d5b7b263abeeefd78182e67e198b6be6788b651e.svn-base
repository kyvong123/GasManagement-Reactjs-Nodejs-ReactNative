//Nhập hồi lưu - nhập hồi lưu - Bước 1
import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";

import Constants from "Constants";

import ReactCustomLoading from "ReactCustomLoading";
import getCylinderDuplicate from "../../../../api/getCylinderDuplicate";
import autoCreateCylinder from "../../../../api/autoCreateCylinder"
import getUserCookies from "getUserCookies";
import { Select, Tabs, Button, Progress } from "antd";
import { DownloadOutline } from "@ant-design/icons";
const { TabPane } = Tabs;
const { Option } = Select;
var fileReader;

class ExportFactoryStationPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      percent: 0,
      content: "",
      listProducts: [],
      error: "",
      loading: false,
      listDuplicate: [],
      listCylinder: [],
      disableTab1: false,
      disableTab2: false,
      disableTab3: true,
      listErr: [],
      listOk: [],
      errCyl_delivering: [],
      errCyl_current: [],
      errCyl_inFactory: [],
      errCyl_inFixer: [],
      errCyl_notCreated: [],
      //listFactoryImport: []
    };
  }

  async submit(event) {}

  async submitTextFile(event) {
    event.preventDefault();
  }
  handleSelect = async (value) => {
    let array = this.state.listCylinder;
    for (let i = 0; i < this.state.listDuplicate.length; i++) {
      this.state.listDuplicate[i].duplicateCylinders.map((v) => {
        if (v.id === value) {
          array[i] = value;
        }
      });
    }
    await this.setState({
      listCylinder: array,
    });
    this.props.getListCylinderDuplicate(this.state.listCylinder);
  };
  handleFileUpload(event) {
    this.setState({
      loading: true,
      disableTab1: true,
      disableTab2: true,
      disableTab3: true,
    });
    let that = this;
    let file = event.target.files[0];

    fileReader = new FileReader();
    fileReader.onload = async function(event) {
      let result = event.target.result;
      let arraynew = result
        .trim()
        .split("\n")
        .map((item) => item.replace(/\r|\n/gi, ""))
        .filter((item) => item != "");
      let cylinders_list = [];
      //
      let couting={};
        let ab=[];
        arraynew.forEach((str)=>{
          couting[str] = (couting[str]|| 0)+1;
        });  
        if(Object.keys(couting).length!== arraynew.length){
         let str;
          for(str in couting){
            if(couting.hasOwnProperty(str)){
              if(couting[str] > 1){
              let a =str +' có ' + couting[str] + ' lần trùng';
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
        errCyl_current = [],
        errCyl_delivering = [],
        errCyl_inFactory = [],
        errCyl_inFixer = [],
        err_msg = "",
        success = false,
        success_cylinders = [],
        success_idCylinders = [],
        errCyl_notCreated = [],
        errCyl_notInSystem = [],
        tempStatus = 200;

      if (array_id.length < 100) {
        let temp = await getInformationFromCylinders(array_id, "TURN_BACK");
        if (temp.status !== 200) {
          showToast("Xảy ra rỗi khi kết nối tới máy chủ");
        }
        if (temp.data.err_msg) {
          errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
          errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
          errCyl_current = errCyl_current.concat(temp.data.errCyl_current);
          errCyl_delivering = errCyl_delivering.concat(temp.data.errCyl_delivering);
          errCyl_inFactory = errCyl_inFactory.concat(temp.data.errCyl_inFactory);
          errCyl_inFixer = errCyl_inFixer.concat(temp.data.errCyl_inFixer);
          success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
          success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
          if (temp.data.success) {
            success = temp.data.success;
          }
        } else {
          let tempIf = temp.data.map((item) => item.serial);
          success_cylinders = success_cylinders.concat(tempIf);
          let tempIf2 = temp.data.map((item) => item.id);
          success_idCylinders = success_idCylinders.concat(tempIf2);
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

          let temp = await getInformationFromCylinders(array, "TURN_BACK");
          if (temp.status !== 200) {
            showToast("Xảy ra rỗi khi kết nối tới máy chủ");
            break;
          }
          if (temp.data.err_msg) {
            errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
            errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
            errCyl_current = errCyl_current.concat(temp.data.errCyl_current);
            errCyl_delivering = errCyl_delivering.concat(temp.data.errCyl_delivering);
            errCyl_inFactory = errCyl_inFactory.concat(temp.data.errCyl_inFactory);
            errCyl_inFixer = errCyl_inFixer.concat(temp.data.errCyl_inFixer);
            success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
            success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
            if (temp.data.success) {
              success = temp.data.success;
            }
          } else {
            let tempIf = temp.data.map((item) => item.serial);
            success_cylinders = success_cylinders.concat(tempIf);

            let tempIf2 = temp.data.map((item) => item.id);
            success_idCylinders = success_idCylinders.concat(tempIf2);
          }
        }
        that.setState({ percent: 0 });
      }

      resultSearch = {
        data: {
          errCyl_current: errCyl_current,
          errCyl_delivering: errCyl_delivering,
          errCyl_inFactory: errCyl_inFactory,
          errCyl_inFixer: errCyl_inFixer,
          err_msg: err_msg,
          success: success,
          success_cylinders: success_cylinders,
          success_idCylinders: success_idCylinders,
          errCyl_notCreated: errCyl_notCreated,
          errCyl_notInSystem: errCyl_notInSystem,
        },
        status: tempStatus,
      };

      if (resultSearch.status === 200) {
        that.props.getListProducts([]);
        //Kiểm tra và lấy mã bình không đạt
        that.setState({
          loading: false,
          listProducts: [],
        });

        if (
          resultSearch.data.errCyl_delivering.length ||
          resultSearch.data.errCyl_current.length ||
          resultSearch.data.errCyl_inFactory.length ||
          resultSearch.data.errCyl_inFixer.length ||
          errCyl_notCreated.length ||
          errCyl_notInSystem.length ||
          ab.length
        ) {
          let err1 = "",
            err2 = "",
            err3 = "",
            err4 = "",
            err5 = "",
            err6='',
            errorShow = "";
          const regex = /#/gi;

          if (errCyl_delivering.length) {
            err1 = `Có ${errCyl_delivering.length} bình đang vận chuyển.#`;
          }
          if (errCyl_current.length) {
            err2 = `Có ${errCyl_current.length} đã hồi lưu.#`;
          }
          if (errCyl_inFixer.length) {
            err3 = `Có ${errCyl_inFixer.length} ở nhà máy khác.#`;
          }
          if (errCyl_inFactory.length) {
            err4 = `Có ${errCyl_inFactory.length} ở trạm khác.#`;
          }
          if (errCyl_notCreated.length) {
            err5 = `Có ${errCyl_notCreated.length + errCyl_notInSystem.length} mã chưa chưa khai báo.#`;
          }
          if(ab.length){
            err6 = ab.toString();
          }
          errorShow = (err1 + err2 + err3 + err4 + err5+err6).replace(regex, "\n").trim();
          that.setState({
            error: errorShow,
            listErr: errCyl_delivering
              .concat(errCyl_current)
              .concat(errCyl_inFactory)
              .concat(errCyl_inFixer)
              .concat(errCyl_notCreated)
              .concat(errCyl_notInSystem),
            disableTab2: false,
            errCyl_delivering: errCyl_delivering,
            errCyl_current: errCyl_current,
            errCyl_inFixer: errCyl_inFixer,
            errCyl_inFactory: errCyl_inFactory,
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
        }
        //Gọi API lấy bình trùng
        let temp = errCyl_delivering
          .concat(errCyl_current)
          .concat(errCyl_inFixer)
          .concat(errCyl_inFactory);
        let result = await getCylinderDuplicate(temp, "TURN_BACK");
        if (result.data.listDuplicate.length !== 0) {
          that.setState({
            listDuplicate: result.data.listDuplicate,
            disableTab3: false,
          });
        }
      } else {
        that.setState({
          loading: false,
          percent: 0,
        });
        showToast("Lỗi đường truyền, vui lòng thử lại");
      }
    };
    fileReader.readAsText(file);
  }

  handleDownload = () => {
    if (this.state.listErr.length !== 0) {
      const element = document.createElement("a");
      const file = new Blob(
        [
          "--Bình đã hồi lưu--: ",
          "\r\n",
          this.state.errCyl_current,
          "\r\n\r\n",
          "--Bình đang vận chuyển--: ",
          "\r\n",
          this.state.errCyl_delivering,
          "\r\n\r\n",
          "--Bình đang ở trạm khác--: ",
          "\r\n",
          this.state.errCyl_inFactory,
          "\r\n\r\n",
          "--Bình đang ở nhà máy--: ",
          "\r\n",
          this.state.errCyl_inFixer,
          "\r\n\r\n",
          "--Bình chưa khai báo--: ",
          "\r\n",
          this.state.errCyl_notCreated,
        ],
        { type: "text/plain;charset=utf-8" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "Mã không đạt.txt";
      document.body.appendChild(element);
      element.click();
    }
  };
  handleSuccessDownload = () => {
    if (this.state.listOk.length !== 0) {
      const element = document.createElement("a");
      const file = new Blob([this.state.listOk], {
        type: "text/plain;charset=utf-8",
      });
      element.href = URL.createObjectURL(file);
      element.download = "Mã đạt.txt";
      document.body.appendChild(element);
      element.click();
    }
  };
  handleUpload = async () => {
    let that = this
    let user_cookies = await getUserCookies();
    let result = await autoCreateCylinder(user_cookies.user.id, this.state.errCyl_notCreated)
    if (result.data.success === true){
      showToast("Upload bình chưa khai báo thành công")
    }
    else {
      showToast(result.data.message)
    }
  }
  handleContinue = async () => {
    let errCyl_current = this.state.errCyl_current
    let errCyl_delivering = this.state.errCyl_delivering
    let errCyl_inFactory = this.state.errCyl_inFactory
    let errCyl_inFixer = this.state.errCyl_inFixer
    this.props.cylinderNotPass(
      {errCyl_current, errCyl_delivering, errCyl_inFactory, errCyl_inFixer}
    )
  }
  render() {
    return (
      <div className="modal fade" id="export-cylinder-type-new" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading}>
          <Progress percent={this.state.percent} status="active" />
        </ReactCustomLoading>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nhập Bình - Bước 1 - Nhập File</h5>
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
                onSubmit={(event) => this.submitTextFile(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Hãy nhập tập tin từ đầu đọc</label>
                        <div style={{ display: "flex" }}>
                          <Input
                            accept=".txt"
                            className="form-control"
                            type="file"
                            name="upload_file"
                            onChange={(event) => this.handleFileUpload(event)}
                            validations={[required]}
                          />
                          <input type="reset" />
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
                          <Button type="success" icon={<DownloadOutline />} size="large" onClick={this.handleSuccessDownload}>
                            Download
                          </Button>
                          <table className="table table-striped table-bordered seednet-table-keep-column-width mt-1" cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px">#STT</th>
                                <th className="w-120px text-center">Mã Bình</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listProducts.length !== 0
                                ? this.state.listProducts.map((store, index) => {
                                    return (
                                      <tr>
                                        <td scope="row" className="text-center">
                                          {index + 1}
                                        </td>
                                        <td scope="row" className="text-center">
                                          {store.serial}
                                        </td>
                                      </tr>
                                    );
                                  })
                                : this.state.listOk
                                ? this.state.listOk.map((store, index) => {
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
                        <TabPane tab="Bình không đạt" key="2" disabled={this.state.disableTab2}>
                          <Button type="success" icon={<DownloadOutline />} size="large" onClick={this.handleDownload}>
                            Download
                          </Button>
                          <table className="table table-striped table-bordered seednet-table-keep-column-width mt-1" cellSpacing="0">
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
                                <th className="w-120px text-center align-middle">Chọn số serial</th>
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
                                    <td scope="row" className="text-center">
                                      <Select defaultValue="--Chọn--" onChange={(value) => this.handleSelect(value)}>
                                        {value.duplicateCylinders
                                          ? value.duplicateCylinders.map((value, index) => {
                                              return (
                                                <Option value={value.id} key={index}>
                                                  {value.serial}
                                                </Option>
                                              );
                                            })
                                          : ""}
                                      </Select>
                                    </td>
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
                    // disabled={
                    //   this.state.disableTab3 === false
                    //     ? this.state.listCylinder.length !== this.state.listDuplicate.length
                    //     : this.state.listOk.length === 0 && this.state.listProducts.length === 0 && this.state.listDuplicate.length === 0
                    // }
                    className="btn btn-primary"
                    onClick={() => {
                      const modal = $("#export-cylinder-type-new");
                      modal.modal("hide");
                      this.handleContinue()
                    }}
                    type="submit"
                    data-toggle="modal"
                    data-target="#turn-back-driver"
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

export default ExportFactoryStationPopup;
