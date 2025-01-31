import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
//import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import Constant from "Constants";
import showToast from "showToast";

import createHistoryAPI from "createHistoryAPI";
import { NAMEDRIVE, GETDRIVERIMPORTCYLINDER } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getUserCookies from './../../../helpers/getUserCookies';
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading"
import importCylinderDuplicate from "../../../../api/importCylinderDuplicates"
const Option = Select.Option;

function getList() {
  return new Promise(function (resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}
class ImportDriverFactoryPopup extends React.Component {

  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: '',
      listProducts: [],
      typeImport: "",
      nameDriver: "",
      idDriver: "",
      listDriver: [],
      isLoading: false,
      show: false,
      list: [],
      loading: false,
      nameExportDriver: [],
      idExportPlace: "",
      idImportDriver: "",
      nameImportDriver: ""
    };
  }

  onSubmit = event => {
    this.setState({ isLoading: true });
    getList().then(list => {
      this.setState({
        isLoading: false,
        list,
        show: false
      });
    });
  };
  async addHistory(driver, license_plate, cylinders, type, stationId, idDriver, sign, fromId, cylinderImex, idImex, typeImex, flow, successCylinders) {

    // Call api
    this.setState({ isLoading: true });
    console.log(stationId);
    if (this.props.product_parse.length !== 0 && this.props.listCylinderDuplicate.length === 0) {
      const user = await createHistoryAPI(
        driver,
        license_plate,
        cylinders,
        Constant.IMPORT_FACTORY,
        '',
        type,
        stationId,
        fromId,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
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
        if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY && !user.data.hasOwnProperty("err_msg")) {
          showToast('Nhập hàng thành công!', 3000);
          const modal = $("#import-driver");
          modal.modal('hide');
          setTimeout(function () {
            window.location.reload()
          }, 2000);
          //this.props.refresh();
          return true;
        } else {
          showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình tạo bình ");
        return false;
      }
    }
    else {
      const result = await importCylinderDuplicate(
        driver,
        license_plate,
        cylinders,
        Constant.IMPORT_FACTORY,
        '',
        type,
        stationId,
        fromId,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow,
        successCylinders,
        this.props.listNotPass
      )
      if (result) {
        if (result.status === 201) {
          this.setState({
            loading: false,
          })
          const modal = $("#import-driver-type-cylinder");
          modal.modal('hide');
          showToast("Nhập hàng thành công")
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
          const modal = $("#import-driver-type-cylinder");
          modal.modal('hide');
          setTimeout(function () {
            window.location.reload()
          }, 2000);
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình nhập bình trùng")
      }
    }
    //this.setState({registerSuccessful: false});
  }

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };
  handleChangeExportDriver = (value, name) => {
    console.log("iiiii", value)
    this.setState({
      idImportDriver: value,
      nameImportDriver: name.props.name
    });
  }
  handleChangeExportPlace = (value) => {
    this.props.listExportPlace.map((l, index) => {
      if (l.id === value) {
        this.setState({
          nameExportDriver: l.drivers,
          idExportPlace: value
        })
      }
    })

  }
  async componentDidUpdate(prevProps) {
    if (this.props.product_parse !== prevProps.product_parse) {
      console.log("did update", this.props.product_parse);
    }
  }

  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      "id": user_cookie.user.id,
      "isChildOf": user_cookie.user.isChildOf
    }
    await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(res => {
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [{
            name: "Bạn chưa có tài xế",
            id: 'null'
          }]
        })
      }
      else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState({
          listDriver: res.data.data
        }, () => console.log(this.state.listDriver))
      }
    })
    console.log("data nhan lai", this.props.product_parse);
  }

  async submit(event) {
    this.setState({ loading: true })
    event.preventDefault();
    let { listDriver } = this.state;
    let index, nameDriver
    // var products=await this.getAllCylenders();
    var cylinders = [];
    let cylinderImex = [];
    if (this.props.listCylinderDuplicate.length === 0) {
      index = listDriver.findIndex(l => l.id === this.state.idDriver);
      nameDriver = listDriver[index].name;
      for (let i = 0; i < this.props.product_parse.length; i++) {
        cylinders.push(this.props.product_parse[i].id);
        cylinderImex.push(
          {
            id: this.props.product_parse[i].id,
            status: "FULL",
            condition: "NEW"
          }
        )
      }
    }
    else {
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

    let data = this.form.getValues();
    if (this.props.listCylinderDuplicate.length === 0) {
      data.idDriver = listDriver[index].id;
    }
    let sign = "Web signature";
    let idImex = Date.now();
    let typeImex = "IN";
    let flow = "IMPORT";
    await this.addHistory(
      this.props.listCylinderDuplicate.length !== 0 ? this.state.nameImportDriver:nameDriver,
      data.license_plate,
      this.props.listCylinderDuplicate.length !== 0 ? this.props.listCylinderDuplicate:cylinders,
      Constant.IMPORT_TYPE,
      data.station,
      this.props.listCylinderDuplicate.length !== 0 ? this.state.idImportDriver:data.idDriver,
      sign,
      this.props.listCylinderDuplicate.length !== 0 ? this.state.idExportPlace:this.props.product_parse[0].histories[this.props.product_parse[0].histories.length - 1].from.id,
      cylinderImex,
      idImex,
      typeImex,
      flow,
      this.props.listIdSuccess
    );
    await this.setState({ loading: false })
    return;
  }

  async handleChangeTypeImport(event) {
    this.setState({ typeImport: event.target.value })
  }

  render() {
    return (
      <div className="modal fade" id="import-driver" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nhập Bình - Bước 2 - Thông Tin Tài Xế</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form ref={c => {
                this.form = c
              }} className="card" onSubmit={(event) => this.submit(event)}>
                <div className="card-body">
                  <div className="row">
                    {this.props.listExportPlace ?
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Nhập từ</label>
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn nơi xuất..."
                            optionFilterProp="children"
                            onChange={(value) => this.handleChangeExportPlace(value)}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {this.props.listExportPlace ? this.props.listExportPlace.map((l, index) => {
                              console.log("aaaa", l, index)
                              return (<Option key={index} value={l.id}>{l.name}</Option>)
                            }) : ""}
                          </Select>
                        </div>
                      </div>
                      : ""}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        {this.props.listExportPlace ?
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn tài xế..."
                            optionFilterProp="children"
                            onChange={(value, name) => this.handleChangeExportDriver(value, name)}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {this.state.nameExportDriver.map((l, index) => {
                              return <Option key={index} name={l.name} value={l.id}>{l.name}</Option>
                            })}
                          </Select>
                          :
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
                              return <Option key={index} value={l.id}>{l.name}</Option>
                            })}
                          </Select>
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe </label>
                        <Input className="form-control" type="text" name="license_plate"
                          id="license_plate" validations={[required]} />
                      </div>
                    </div>
                    {/*<div className="col-md-6">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Loại nhập</label>*/}
                    {/*        <Select className="form-control"*/}
                    {/*                name="import_type"*/}
                    {/*                onChange={(event) => this.handleChangeTypeImport(event)}*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="">-- Chọn --</option>*/}
                    {/*            <option value={Constant.TURN_BACK_TYPE}>Nhập hồi lưu</option>*/}
                    {/*            <option value={Constant.IMPORT_TYPE}>Nhập từ trạm chiết</option>*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}


                    {/*</div>*/}
                    {/*{this.props.typeImport === Constant.IMPORT_TYPE ? <div className="col-md-6">*/}
                    {/*    <label>Trạm chiết</label>*/}
                    {/*    <Select className="form-control"*/}
                    {/*            name="station"*/}
                    {/*            validations={[required]}>*/}
                    {/*        <option value="">-- Chọn --</option>*/}
                    {/*        {this.props.listTurnBackStations.map((item) => <option*/}
                    {/*            value={item.id}>{item.name}</option>)}*/}

                    {/*    </Select>*/}
                    {/*</div> : null}*/}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit"
                    onClick={this.onSubmit}
                    disabled={this.state.isLoading}>{this.state.isLoading ? "Loading..." : "Lưu"}</Button>
                  <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                    style={{ marginLeft: "10px" }}>Đóng
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

export default ImportDriverFactoryPopup;
