// Xuất vỏ bình nhà máy sửa chữa - Bước 2

import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "../../../../api/createHistoryAPI";
import SelectMulti from "react-select";
import { NAMEDRIVE } from "./../../../config/config";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from './../../../util/apiCaller';
import { Select } from "antd";
import getAllBranch from "../../../../api/getAllBranch"
import getAllStation from "../../../../api/getAllStation"
import ReactCustomLoading from "ReactCustomLoading";
import exportCylinderDuplicate from "../../../../api/exportCylinderDuplicate"

const Option = Select.Option;


class ExportCylinders extends React.Component {

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
      driverName: "",
      idDriver: "",
      listDriver: [],
      listStation: [
        {
          value: "",
          name: "Chọn trạm"
        }
      ],
      listBranch: [
        {
          value: "",
          name: "Chọn chi nhánh"
        }
      ],
      //check:"",
      listCheck: [],
      toArray: [],
      Loading: false,
    };
  }
  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async addHistory(driver, license_plate, cylinders, number_array, toArray, idDriver,
    sign, cylinderImex, successCylinders, cylinerIneligible) {
    this.setState({ isLoading: true });
    const { typeExportCylinder } = this.props
    const { ListUserSubmitID } = this.state
    // Call api
    console.log(this.state.ListUserSubmitID);
    console.log('register:::: ', typeExportCylinder);
    this.setState({ isLoading: true });
    if (this.props.product_parse.length !== 0) {
      const user = await createHistoryAPI(
        driver,
        license_plate,
        cylinders,
        Constants.EXPORT_TYPE,
        ListUserSubmitID,
        '',
        '',
        '',
        toArray,
        number_array,
        '',
        '',
        '',
        "TO_FIX",
        '',
        idDriver,
        sign,
        cylinderImex,
        Date.now(),
        "OUT",
        "EXPORT_CELL"
      );
      // alert("Thanh cong");
      this.setState({ isLoading: true });

      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast('Xuất hàng thành công!', 3000);
          this.setState({ Loading: false });
          // this.props.handleChangeTypeExportCylinderEmpty()
          const modal = $("#export_fixer_popup");
          modal.modal('hide');
          $("#export-cylinders").modal('hide');
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
    else {
      if (this.props.listCylinderDuplicate.length !== 0) {
        const result = await exportCylinderDuplicate(
          driver,
          license_plate,
          cylinders,
          Constants.EXPORT_TYPE,
          ListUserSubmitID,
          '',
          '',
          '',
          toArray,
          number_array,
          '',
          '',
          '',
          "TO_FIX",
          '',
          idDriver,
          sign,
          cylinderImex,
          Date.now(),
          "OUT",
          "EXPORT_CELL",
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
          ListUserSubmitID,
          '',
          '',
          '',
          toArray,
          number_array,
          '',
          '',
          '',
          "TO_FIX",
          '',
          idDriver,
          sign,
          cylinderImex,
          Date.now(),
          "OUT",
          "EXPORT_CELL",
          cylinerIneligible
        )
        this.setState({ isLoading: true });

        //console.log('register',user);
        if (user) {
          if (user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) {
            showToast('Xuất hàng thành công!', 3000);
            this.setState({ Loading: false });
            // this.props.handleChangeTypeExportCylinderEmpty()
            const modal = $("#export_fixer_popup");
            modal.modal('hide');
            $("#export-cylinders").modal('hide');
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
    //this.setState({registerSuccessful: false});
  }

  async componentDidMount() {
    let user_cookie = await getUserCookies();

    let token = "Bearer " + user_cookie.token;
    let params = {
      id: user_cookie.user.id,
    };

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
    console.log("hum", user_cookie.user.parentRoot)
    const test = await getAllStation(user_cookie.user.parentRoot);
    let listbranch = []
    test.data.data.map(v => {
      if (v.userType !== "Fixer") {
        listbranch.push({
          value: v.name,
          id: v.id,
          ...v,
        });
      }

    })
    this.setState({
      listBranch: listbranch
    })
    console.log("listBranch", this.state.listBranch)
  }

  handleChangeGeneral = async (langValue) => {
    event.preventDefault();

    console.log("changevalue", langValue)

    const data1 = await getAllBranch(langValue);
    console.log("testdata1", data1)
    let listarr = []
    data1.data.data.map(v => {
      console.log("huhu", v)
      listarr.push({
        value: v.name,
        id: v.id,
        ...v,
      });
    })
    this.setState({
      listStation: listarr
    })


    console.log("ccc", this.state.listStation)

    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,

    });
    console.log("ListUserSubmit", this.state.ListUserSubmit)


  }
  handleChangeStation = async (langValue, id) => {

    console.log("langValue111", langValue)
    console.log("langValue1112", id)
    let toArray = []
    await id.map(v => {
      toArray.push(
        v.props.id
      )

    })
    this.setState({
      listCheck: langValue,
      toArray: toArray
    })
    console.log("v.props.id", this.state.toArray)
  }

  async submit(event) {
    let listIdSuccess = this.props.listIdSuccess.concat(this.props.cylinderNotCreate)
    event.preventDefault();
    this.setState({ Loading: true });
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    let cylinders = [];
    let cylinderImex = [];
    console.log("qqqq", this.props)
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
    let toArray = [];
    let numberArray = [];
    let listcheck = this.state.listCheck;
    if (!listcheck) {
      this.setState({ Loading: false })
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {

      toArray = this.state.toArray
      numberArray.push(data['numberGeneral']);


    }
    await this.addHistory(
      nameDriver,
      data.license_plate,
      this.props.product_parse.length !== 0 ? cylinders : this.props.listCylinderDuplicate,
      numberArray,
      toArray,
      data.idDriver,
      sign,
      cylinderImex,
      listIdSuccess,
      this.props.listNotPass
    );
    await this.setState({ Loading: false })
    return;
  }

  render() {

    //console.log("hahaha",this.props.typeExportCylinder);
    const nameExport = "Công ty con - chi nhánh trực thuộc";
    return (
      <div className="modal fade" id="export-cylinders" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.Loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xuất vỏ bình - Bước 2 - Thông Tin Tài Xế</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form ref={c => {
                this.form = c
              }} className="card" onSubmit={(event) => this.submit(event, this.props.typeExportCylinder)}>
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
                        <Input className="form-control" type="text" name="license_plate"
                          id="license_plate" validations={[required]} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Công ty con - Chi nhánh trực thuộc</label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          name="branch"
                          onChange={this.handleChangeGeneral.bind(this)}


                        >
                          {this.state.listBranch.map((l, index) => {
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
                        <label>Trạm</label>
                        <Select
                          mode="multiple"
                          showSearch
                          name="station"
                          id="station"
                          style={{ width: "100%" }}
                          placeholder="Chọn trạm..."
                          onChange={this.handleChangeStation.bind(this)}
                        //option={this.state.listStation}
                        >
                          {this.state.listStation.map((l, index) => {
                            return (
                              <Option key={index} value={l.value} id={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0">
                        <tbody className="display-block display-tbody">
                          {this.state.listCheck.map(v => {
                            return (
                              <tr>
                                <td scope="row" className="text-center">{v}</td>
                                <td scope="row" className="text-center"><Input
                                  name={"numberGeneral"} placeholder={"Nhập số lượng"}
                                  validations={[required]} className="form-control"
                                  type="number" /></td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="col-md-6">
                                            <table
                                                className="table table-striped table-bordered seednet-table-keep-column-width"
                                                cellSpacing="0">
                                                <tbody className="display-block display-tbody">
                                                    {this.state.ListUserSubmit.map((store, index) => {

                                                        return (<tr key={index}>
                                                            <td scope="row" className="text-center">{store.name}</td>
                                                            <td scope="row" className="text-center"><Input
                                                                name={"numberGeneral" + index} placeholder={"Nhập số lượng"}
                                                                validations={[required]} className="form-control"
                                                                type="number" /></td>
                                                        </tr>)


                                                    })}

                                                </tbody>
                                            </table>
                                        </div> */}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  {this.state.Loading === false ?
                    <Button
                      className="btn btn-primary"
                      type="submit"
                    >
                      {this.state.Loading === true
                        ? "Loading..."
                        : "Lưu"}
                    </Button> :
                    <button className="btn btn-primary" disabled="true">
                      Lưu
                                    </button>
                  }


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

export default ExportCylinders;
