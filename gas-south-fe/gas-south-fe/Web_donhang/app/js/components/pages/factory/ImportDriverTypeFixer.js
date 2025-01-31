import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
//import getAllPartner from "getPartner";
import SelectMulti from "react-select";

import { NAMEDRIVE, GETDRIVERIMPORTCYLINDER } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getUserCookies from './../../../helpers/getUserCookies';
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading"
import importCylinderDuplicate from "../../../../api/importCylinderDuplicates"
import getFixerStation from "../../../../api/getFixerStation"
const Option = Select.Option;


class ImportDriverTypeFixer extends React.Component {

  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: '',
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      typeUser: [],
      ListUserSubmit: "",
      ListUserSubmitID: "",
      nameDriver: "",
      idDriver: "",
      listDriver: [],
      userTypeFixer: "",
      loading: false,
      nameExportDriver: [],
      idExportPlace: "",
      idImportDriver: "",
      nameImportDriver: "",
      listFixerStation: "",
      from: ""
    };
  }

  async addHistory(driver, license_plate, cylinders, number_cylinder, idDriver, sign, fromId, cylinderImex, idImex, typeImex, flow, successCylinders) {
    const { typeExportCylinder } = this.props
    // Call api

    //var toId = isFixer ? parentRoot : this.state.ListUserSubmitID

    this.setState({ isLoading: true });
    if (this.props.listCylinderDuplicate.length === 0) {
      const user = await createHistoryAPI(
        driver,
        license_plate,
        cylinders,
        Constants.IMPORT_TYPE,
        this.state.ListUserSubmitID,
        '',
        number_cylinder,
        fromId ? fromId : this.state.from,
        '', '', '', '', '',
        typeExportCylinder,
        '',
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow,
        this.props.listNotPass
      );
      this.setState({ isLoading: false, loading: false });
      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast('Nhập hàng thành công!', 3000);
          this.props.handleChangeTypeExportCylinderEmpty()
          const modal = $("#import-driver-type-fixer");
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

      //this.setState({registerSuccessful: false});
    } else {
      const result = await importCylinderDuplicate(
        driver,
        license_plate,
        cylinders,
        Constants.IMPORT_TYPE,
        this.state.ListUserSubmitID,
        '',
        number_cylinder,
        fromId ? fromId : this.state.from,
        '', '', '', '', '',
        typeExportCylinder,
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
      this.setState({
        loading: false,
        isLoading: false
      })
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

  }

  handleChangeGeneral = (langValue) => {
    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id
    });
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
  handleChangeFixerStation = (value) => {
    this.setState({
      from: value
    })
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
  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let result = await getFixerStation(user_cookie.user.id)
    if (result.data.success === true) {
      const station = result.data.data.filter((value) =>
        value.userRole === "Owner" && value.userType === "Factory"
      )
      this.setState({
        listFixerStation: station
      })
    }
    this.setState({
      userTypeFixer: user_cookie.user.userType
    })
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
  }

  async submit(event) {
    this.setState({ loading: true })
    event.preventDefault();
    //let { listDriver } = this.state;
    let index, nameDriver;
    var cylinders = [];
    let cylinderImex = [];
    if (this.props.listCylinderDuplicate.length === 0) {
      index = this.props.listDriverStation.findIndex(l => l.id === this.state.idDriver);
      if (this.props.listDriverStation.length !== 0) {
        nameDriver = this.props.listDriverStation[index].name;
      }
      for (let i = 0; i < this.props.product_parse.length; i++) {
        cylinders.push(this.props.product_parse[i].id);
        cylinderImex.push(
          {
            id: this.props.product_parse[i].id,
            status: "EMPTY",
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
            status: "EMPTY",
            condition: "NEW"
          }
        )
      }
    }
    let idImex = Date.now();
    let typeImex = "IN";
    let flow = "IMPORT_CELL";
    let data = this.form.getValues();
    if (this.props.listCylinderDuplicate.length === 0) {
      if (this.props.listDriverStation.length !== 0) {
        data.idDriver = this.props.listDriverStation[index].id;
      }
    }
    let sign = "Web signature";
    await this.addHistory(
      this.props.listCylinderDuplicate.length !== 0 ? this.state.nameImportDriver : (typeof nameDriver === "string" ? nameDriver : data.driver),
      data.license_plate,
      this.props.listCylinderDuplicate.length !== 0 ? this.props.listCylinderDuplicate : cylinders,
      data.number_cylinder,
      this.props.listCylinderDuplicate.length !== 0 ? this.state.idImportDriver : data.idDriver,
      sign,
      this.props.listCylinderDuplicate.length !== 0 ? this.state.idExportPlace : (this.props.product_parse.length !== 0 ? this.props.product_parse[0].histories[0].from.id : ""),
      cylinderImex,
      idImex,
      typeImex,
      flow,
      this.props.listIdSuccess
    );
    return;
  }
  handeload = () => {
    //window.location.reload()
  }
  render() {
    const { typeExportCylinder } = this.props
    // console.log("this.props.listDriverStationaabb", this.props.listDriverStation)
    const nameExport = "Thương Nhân Sở Hữu"
    return (
      <div className="modal fade" id="import-driver-type-fixer" tabIndex="-1" >
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg" >
          <div className="modal-content">
            <div className="modal-header"  >
              <h5 className="modal-title">{`Nhập ${typeExportCylinder === 'TO_FIX' ? 'Vỏ' : 'Bình'} - Bước 2 - Thông Tin Tài Xế`}</h5>
              <button type="button" className="close" data-dismiss="modal"
                onClick={this.handeload}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form ref={c => {
                this.form = c
              }} className="card"

                onSubmit={(event) => this.submit(event, this.props.typeExportCylinder)}>
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
                      :
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Nhập từ</label>
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Chọn nơi xuất..."
                            optionFilterProp="children"
                            onChange={(value) => this.handleChangeFixerStation(value)}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {this.state.listFixerStation ? this.state.listFixerStation.map((l, index) => {
                              return (<Option key={index} value={l.id}>{l.name}</Option>)
                            }) : ""}
                          </Select>
                        </div>
                      </div>
                    }
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
                          : (this.props.listDriverStation.length !== 0 ?
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
                              {this.props.listDriverStation.map((l, index) => {
                                return <Option key={index} value={l.id}>{l.name}</Option>
                              })}
                            </Select>
                            : <Input className="form-control" type="text" name="driver"
                              id="driver" validations={[required]} />
                          )
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
                    {this.state.userTypeFixer !== "Fixer" ? <div className="col-md-6">
                      <div className="form-group">
                        <label>{nameExport}</label>
                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.typeExportCylinder !== Constants.TO_FIX ? this.props.listUsersPartner : this.props.listUsersPartner}
                          onChange={this.handleChangeGeneral.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.ListUserSubmit}
                        />
                      </div>
                    </div> : ""}

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Số Lượng Bình Không Mã</label>
                        <Input className="form-control" type="number" name="number_cylinder"
                          id="number_cylinder" />
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">Lưu</Button>
                  <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={this.handeload}
                  >Đóng
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

export default ImportDriverTypeFixer;
