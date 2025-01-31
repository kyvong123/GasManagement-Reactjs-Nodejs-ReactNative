// Xuất Vỏ Bình - Bước 2
import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import getAllPartnerAPI from "getPartnerAPI";
import getDestinationUserAPI from "getDestinationUserAPI";
import getListStation from "../../../../api/getListStation"
import { NAMEDRIVE } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getUserCookies from './../../../helpers/getUserCookies';
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading";
import getAllStation from "../../../../api/getAllBranch"
import exportCylinderDuplicate from "../../../../api/exportCylinderDuplicate"
const Option = Select.Option;

function getList() {
  return new Promise(function (resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}
class ExportDriverTypeCylinderPopup extends React.Component {

  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: '',
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
    console.log("isLoading", isLoading)
  };

  async addHistory(driver, license_plate, typeExportCylinder, number_array, toArray, cylindersWithoutSerial, cylinders, idDriver, sign, cylinderImex, idImex, typeImex, flow, successCylinders, cylinerIneligible) {
    // Call api
    console.log(this.state.ListUserSubmitID);
    this.setState({ isLoading: true });
    if (this.props.product_parse.length !== 0) {
      const user = await createHistoryAPI(
        driver,
        license_plate,
        cylinders,
        Constants.EXPORT_TYPE,
        this.state.ListUserSubmitID,
        '',
        cylindersWithoutSerial,
        '',
        toArray,
        number_array,
        '',
        '',
        '',
        this.props.typeExportCylinder,
        '',
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow,

      );
      this.setState({ isLoading: false });
      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast('Xuất hàng thành công!', 3000);
          this.props.handleChangeTypeExportCylinderEmpty()
          const modal = $("#export-driver-type-cylinder");

          modal.modal('hide');
          $("#export-driver-type-cylinder").modal('hide');
          setTimeout(function () {
            window.location.reload()
          }, 2000);
          return true;
        } else {
          showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình tạo bình ");
        return false;
      }
      this.setState({ ListUserSubmit: [] });
    }
    else {
      if (this.props.listCylinderDuplicate.length !== 0) {
        const result = await exportCylinderDuplicate(
          driver,
          license_plate,
          cylinders,
          Constants.EXPORT_TYPE,
          this.state.ListUserSubmitID,
          '',
          cylindersWithoutSerial,
          '',
          toArray,
          number_array,
          '',
          '',
          '',
          this.props.typeExportCylinder,
          '',
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
          driver,
          license_plate,
          successCylinders,
          Constants.EXPORT_TYPE,
          this.state.ListUserSubmitID,
          '',
          cylindersWithoutSerial,
          '',
          toArray,
          number_array,
          '',
          '',
          '',
          this.props.typeExportCylinder,
          '',
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
          if (user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) {
            showToast('Xuất hàng thành công!', 3000);
            this.props.handleChangeTypeExportCylinderEmpty()
            const modal = $("#export-driver-type-cylinder");

            modal.modal('hide');
            $("#export-driver-type-cylinder").modal('hide');
            setTimeout(function () {
              window.location.reload()
            }, 2000);
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
    }

  }
  handleChangeBranch = async (e) => {
    let data = await getAllStation(e)

    this.setState({
      listStations: data.data.data
    })
    console.log("handleChangeBranch", this.state.listStations)
  }
  handleChangeStation = async (e, id) => {
    console.log("handleChangeStation", id)
    let toArray = []
    await id.map(v => {
      toArray.push(
        v.props.id
      )

    })
    this.setState({
      getStation: e,
      toArray: toArray
    })
    console.log("v.props.id", this.state.toArray)
  }
  handleChangeGeneral = async (langValue) => {
    console.log("handleChangeGeneral", langValue)
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

  async componentDidMount() {

    console.log("Constants.TO_FIX", Constants.TO_FIX)
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      "id": user_cookie.user.id
    }
    await callApi("POST", NAMEDRIVE, params, token).then(res => {
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
    let arr = []
    let arrbranch = []
    let data = await getListStation(user_cookie.user.id, "Fixer");
    if (data.data.success === true){
      data.data.data.map(v => {
        arr.push({
          label: v.name,
          value: v.id,
          id: v.id
        })
      })
    }
    else {
      showToast(data.data.message)
    }
    let databranch = await getListStation(user_cookie.user.id, "Region");
    if (databranch.data.success === true){
      databranch.data.data.map(v => {
        arrbranch.push({
          label: v.name,
          value: v.id,
  
        })
      })
    } 
    else {
      showToast(data.data.message)
    } 
    this.setState({
      listStation: arr,
      listBranch: arrbranch
    })

  }

  async submit(event) {
    let listIdSuccess = this.props.listIdSuccess.concat(this.props.cylinderNotCreate)
    this.setState({ loading: true })
    event.preventDefault();
    let { listDriver } = this.state;
    let index = listDriver.findIndex(l => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    var cylinders = [];
    let cylinderImex = [];
    console.log("this.propss", this.props)
    if (this.props.product_parse.length !== 0) {
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
      if (this.props.listCylinderDuplicate) {
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
      if (listIdSuccess) {
        for (let i = 0; i < listIdSuccess.length; i++) {
          cylinderImex.push(
            {
              id: listIdSuccess[i],
              status: "EMPTY",
              condition: "NEW"
            }
          )
        }
      }
    }
    let data = this.form.getValues();
    data.idDriver = listDriver[index].id;
    let sign = "Web signature";
    console.log(data);
    let toArray = [];
    let numberArray = [];
    let listUserSubmit = this.state.ListUserSubmit;
    let idImex = Date.now();
    let typeImex = "OUT";

    let flow = "EXPORT_CELL";
    if (listUserSubmit.length === 0 && !this.state.getStation) {
      this.setState({ loading: false })
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    }
    else {
      if (this.props.typeExportCylinder === Constants.BUY) {
        for (let i = 0; i < this.state.getStation.length; i++) {
          toArray = this.state.toArray
          numberArray.push(data['numberGeneral' + i]);
        }
      }
      else {
        for (let i = 0; i < listUserSubmit.length; i++) {
          toArray.push(listUserSubmit[i].value);
          numberArray.push(data['numberGeneral' + i]);
        }
      }
    }
    await this.addHistory(
      nameDriver,
      data.license_plate,
      "",
      numberArray,
      toArray,
      data.number_cylinder,
      this.props.product_parse.length !== 0 ? cylinders : this.props.listCylinderDuplicate,
      data.idDriver,
      sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,
      listIdSuccess,
      this.props.listNotPass
    );
    await this.setState({ loading: false })
    console.log("event123", event)
    return;
  }
  render() {
    // console.log("data expot 1:",this.props.allChildOf);
    // console.log("data expot 2:",this.props.listUserFixer);
    const nameExport = this.props.typeExportCylinder === Constants.RENT ? "Đối tác cho thuê" :
      this.props.typeExportCylinder === Constants.BUY ? "Đối tác bán đứt/ Công ty - Chi nhánh trực thuộc" :
        this.props.typeExportCylinder === Constants.RETURN_CYLINDER ? "Xuất trả" : "Sửa chữa";
    return (
      <div className="modal fade" id="export-driver-type-cylinder" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xuất Vỏ Bình - Bước 2 - Thông Tin Tài Xế</h5>
              <button type="button" className="close" data-dismiss="modal"
                onClick={() => this.setState({ ListUserSubmit: [] })}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form ref={c => {
                this.form = c
              }} className="card" onSubmit={(event) => this.submit(event, this.props.typeExportCylinder)}>
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
                            return <Option key={index} value={l.id}>{l.name}</Option>
                          })}
                        </Select>
                      </div>


                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe </label>
                        <Input className="form-control" type="text" name="license_plate"
                          id="license_plate" validations={[required]} />
                      </div>
                    </div>
                    {this.props.typeExportCylinder === Constants.TO_FIX
                      || this.props.typeExportCylinder === Constants.RENT

                      ?
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{nameExport}</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={this.props.typeExportCylinder === Constants.TO_FIX ?
                              this.state.listStation : this.props.listUsersPartner}
                            onChange={this.handleChangeGeneral.bind(this)}
                            placeholder="Chọn..."
                            value={this.state.ListUserSubmit}
                          />
                        </div>
                      </div>
                      : ""
                    }

                    {this.props.typeExportCylinder === Constants.BUY ?
                      <div className="col-md-6">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{nameExport}</label>
                            <Select onChange={(e) => this.handleChangeBranch(e)}>
                              {this.state.listBranch.map((v, i) => {
                                return (
                                  <Option
                                    value={v.value}
                                    key={v.value}>
                                    {v.label}
                                  </Option>
                                )
                              })}
                            </Select>

                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Trạm</label>
                            <Select
                              onChange={(e, id) => this.handleChangeStation(e, id)}
                              mode="multiple"
                            >
                              {this.state.listStations.map((v, i) => {
                                console.log("listStationss", v)
                                return (
                                  <Option
                                    value={v.name}
                                    id={v.id}
                                    key={i}>
                                    {v.name}
                                  </Option>
                                )
                              })}
                            </Select>
                          </div>
                        </div>
                      </div>

                      : ""
                    }


                    {this.props.typeExportCylinder !== Constants.TO_FIX ? null :
                      (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Số lượng bình không mã</label>
                            <Input className="form-control" type="number"
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
                        cellSpacing="0">
                        <tbody className="display-block display-tbody">
                          {this.props.typeExportCylinder === Constants.BUY ?
                            this.state.getStation.map((store, index) => {
                              return (<tr key={index}>
                                <td scope="row" className="text-center">{store}</td>
                                <td scope="row" className="text-center"><Input
                                  name={"numberGeneral" + index} placeholder={"Nhập số lượng"}
                                  validations={[required]} className="form-control"
                                  type="number" /></td>
                              </tr>)
                            })
                            :
                            this.state.ListUserSubmit.map((store, index) => {
                              return (<tr key={index}>
                                <td scope="row" className="text-center">{store.name}</td>
                                <td scope="row" className="text-center"><Input
                                  name={"numberGeneral" + index} placeholder={"Nhập số lượng"}
                                  validations={[required]} className="form-control"
                                  type="number" /></td>
                              </tr>)
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit" onClick={this.onSubmit}
                    disabled={this.state.isLoading}>{this.state.isLoading ? "Loading..." : "Lưu"}</Button>
                  <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                    onClick={() => this.setState({ ListUserSubmit: [] })}
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

export default ExportDriverTypeCylinderPopup;
