import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import Constant from "Constants";
import showToast from "showToast";
import ExportCylinderDriverPopup from "./ExportCylinderDriverPopup"
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import ReactCustomLoading from "ReactCustomLoading";



class ExportDriverFactoryStationPopup extends React.Component {

  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: '',
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      loading: false,
    };
  }

  async addHistory(driver, license_plate, cylinders, to_id) {

    // Call api
    this.setState({ isLoading: true });
    const user = await createHistoryAPI(driver, license_plate, cylinders, Constant.EXPORT_FACTORY, to_id);
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY) {
        showToast('Xuất hàng thành công!', 3000);
        const modal = $("#export-driver-station-new");
        modal.modal('hide');
        //this.props.refresh();
        return true;
      }
      else {
        showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
        return false;
      }
    }
    else {
      showToast("Xảy ra lỗi trong quá trình tạo bình ");
      return false;
    }

    //this.setState({registerSuccessful: false});
  }
  handleChangeGeneral = (langValue) => {
    this.setState({ GeneralResults: langValue });

  }
  handleChangeAgency = (langValue) => {
    this.setState({ AgencyResults: langValue });

  }
  componentDidMount() {

  }
  async submit(event) {
    this.setState({ loading: true })
    event.preventDefault();
    // var products=await this.getAllCylenders();
    var cylinders = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
    }

    let data = this.form.getValues();
    await this.addHistory(data.driver, data.license_plate, cylinders, data.station);
    await this.setState({ loading: false })

    // if (this.state.position.length === 0) {
    //     showToast('Chưa chọn vị trí!', 3000);
    //     return;
    // }
    /*  let data= this.form.getValues();
      let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
      if(result)
      {
          const modal = $("#create-staff");
          modal.modal('hide');

      }
*/
    return;
  }

  async submitTextFile(event) {
    /* if (!file) showToast('Vui lòng chọn file!', 3000);
     this.setState({isLoading: true});
     const result = await importProductsFromExcelAPI(file);
     this.setState({isLoading: false});
     console.log(result);
     if (result && result.status === 200) {
         if (typeof (result) !== 'undefined') {
             showToast('Đưa vào thành công!', 3000);
             this.props.refresh();
         }
         else {
             //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
         }
         return;
     } else {
         showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
     }
     return;
     $("#import-product").modal('hide');
     return;*/
  }


  render() {
    return (
      <div className="modal fade" id="export-driver-station-new" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xuất Vỏ Bình Về Trạm Chiết - Bước 2 - Thông Tin Tài Xế</h5>
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        <Input className="form-control" type="text" name="driver" validations={[required]} />
                      </div>


                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe </label>
                        <Input className="form-control" type="text" name="license_plate" id="license_plate" validations={[required]} />
                      </div>
                    </div>

                    {/*<div className="col-md-6">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Trạm chiết nạp</label>*/}
                    {/*        <Select className="form-control"*/}
                    {/*                name="station"*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="">-- Chọn --</option>*/}
                    {/*            {this.props.listExportStations.map((item, index) => <option value={item.id} key={index}>{item.name}</option>)}*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Bán đứt</label>
                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(x => x.userType === Constant.GENERAL)}
                          onChange={this.handleChangeGeneral.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.GeneralResults}
                          promptTextCreator={() => {
                            return;
                          }}

                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Cho Thuê</label>

                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(x => x.userType === Constant.AGENCY)}
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
                        <label>Sửa chữa</label>
                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(x => x.userType === Constant.GENERAL)}
                          onChange={this.handleChangeGeneral.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.GeneralResults}
                          promptTextCreator={() => {
                            return;
                          }}

                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0">
                        <tbody className="display-block display-tbody">
                          {this.state.GeneralResults.map((store, index) => {

                            return (<tr>
                              <td scope="row" className="text-center">{store.name}</td>
                              <td scope="row" className="text-center"><Input
                                name={"numberGeneral" + index} placeholder={"Nhập số lượng"}
                                validations={[required]} className="form-control"
                                type="number" /></td>
                            </tr>)


                          })}

                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-4">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0">
                        <tbody className="display-block display-tbody">
                          {this.state.AgencyResults.map((store, index) => {
                            return (<tr>
                              <td scope="row" className="text-center">{store.name}</td>
                              <td scope="row" className="text-center"><Input
                                name={'numberAgency' + index} placeholder={"Nhập số lượng"}
                                validations={[required]} className="form-control"
                                type="number" /></td>
                            </tr>)


                          })}

                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-4">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0">
                        <tbody className="display-block display-tbody">
                          {this.state.AgencyResults.map((store, index) => {
                            return (<tr>
                              <td scope="row" className="text-center">{store.name}</td>
                              <td scope="row" className="text-center"><Input
                                name={'numberAgency' + index} placeholder={"Nhập số lượng"}
                                validations={[required]} className="form-control"
                                type="number" /></td>
                            </tr>)


                          })}

                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">Lưu</Button>
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

export default ExportDriverFactoryStationPopup;