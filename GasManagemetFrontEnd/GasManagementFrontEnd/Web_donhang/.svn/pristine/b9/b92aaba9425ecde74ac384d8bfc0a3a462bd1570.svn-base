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
import { NAMEDRIVE } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getUserCookies from './../../../helpers/getUserCookies';
import { Select } from "antd";
const Option = Select.Option;

class ImportDriverStationPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: [],
            nameDriver: "",
            idDriver: "",
            listDriver: []
        };
    }

    async addHistory(driver, license_plate, cylinders, type, from_id, idDriver, sign) {

        // Call api
        this.setState({ isLoading: true });
        const user = await createHistoryAPI(driver, license_plate, cylinders, Constant.IMPORT_STATION, null, type, '', from_id, '', '', '', '', '', '', '', idDriver, sign);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
            if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY) {
                showToast('Nhập hàng thành công!', 3000);
                const modal = $("#import-driver");
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

    handleChangeDriver = (value) => {
        this.setState({
            idDriver: value,
        });
    };

    async componentDidMount() {
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
    }

    async submit(event) {

        event.preventDefault();
        let { listDriver } = this.state;
        let index = listDriver.findIndex(l => l.id === this.state.idDriver);
        let nameDriver = listDriver[index].name;
        // var products=await this.getAllCylenders();
        var cylinders = [];
        for (let i = 0; i < this.props.product_parse.length; i++) {
            cylinders.push(this.props.product_parse[i].id);
        }

        let data = this.form.getValues();
        data.idDriver = listDriver[index].id;
        let sign = "Web signature";
        await this.addHistory(nameDriver, data.license_plate, cylinders, Constant.IMPORT_TYPE, data.factory, data.idDriver, sign);
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
            <div className="modal fade" id="import-driver" tabIndex="-1">
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
                                                <Input className="form-control" type="text" name="license_plate" id="license_plate" validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Thương nhân sở hữu</label>
                                                <Select className="form-control"
                                                    name="factory"
                                                    validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listStationImports.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
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

export default ImportDriverStationPopup;