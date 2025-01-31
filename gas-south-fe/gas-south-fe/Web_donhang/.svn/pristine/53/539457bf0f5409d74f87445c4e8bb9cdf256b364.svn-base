import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import Constants from "Constants";
import showToast from "showToast";

import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import getDestinationUserAPI from "getDestinationUserAPI";
import getAllPartnerAPI from "getPartnerAPI";

import { NAMEDRIVE } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getUserCookies from './../../../helpers/getUserCookies';
import { Select } from "antd";
const Option = Select.Option;

class TurnBackDriverInCustomerFactoryPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: [],
            typeImport: "",
            ListUserSubmit:"",
            ListUserIDSubmit:"",
            nameDriver: "",
            idDriver: "",
            listDriver: []
        };
    }

    async addHistory(driver, license_plate, cylinders, type, numberOfCylinder, idDriver, sign) {

        // Call api
        this.setState({isLoading: true});
        const user = await createHistoryAPI(driver, license_plate, null, Constants.TURN_BACK_NOT_IN_SYSTEM, this.state.ListUserIDSubmit, type, numberOfCylinder,'','','','','','',this.props.typeExportCylinder, '', idDriver, sign);
        this.setState({isLoading: false});
        //console.log('register',user);
        if (user) {
            if ((user.status === Constants.HTTP_SUCCESS_CREATED || user.status === Constants.HTTP_SUCCESS_BODY) && !user.data.hasOwnProperty("err_msg")) {
                showToast('Nhập hàng thành công!', 3000);
                const modal = $("#turn-back-driver-in-customer");
                modal.modal('hide');
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
    }

    handleChangeGeneral = (langValue) => {
        console.log(langValue);
        this.setState({ListUserSubmit: langValue,ListUserIDSubmit:langValue.id});
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
        let data = this.form.getValues();
        data.idDriver = listDriver[index].id;
        let sign = "Web signature";
        await this.addHistory(nameDriver, data.license_plate, "", Constants.TURN_BACK_NOT_IN_SYSTEM, data.number_cylinder, data.idDriver, sign);
        return;
    }


    render() {
        const nameExport = this.props.typeExportCylinder === Constants.RENT ? "Cho thuê" : this.props.typeExportCylinder === Constants.BUY ? "Bán đứt" : this.props.typeExportCylinder === Constants.RETURN_CYLINDER ? "Xuất Trả" : "Sửa chữa"
        return (
            <div className="modal fade" id="turn-back-driver-in-customer" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nhập Hồi Lưu Từ Thị Trường - Thông Tin Tài Xế</h5>
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
                                                <Input className="form-control" type="text" name="license_plate"
                                                       id="license_plate" validations={[required]}/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Số Lượng</label>
                                                <Input className="form-control" type="text" name="number_cylinder"
                                                       id="number_cylinder" validations={[required]}/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{nameExport}</label>
                                                <SelectMulti.Creatable
                                                    multi={true}
                                                    options={this.props.typeExportCylinder !== Constants.TO_FIX ? this.props.listUsersPartner : this.props.listUserFixer}
                                                    onChange={this.handleChangeGeneral.bind(this)}
                                                    placeholder="Chọn..."
                                                    value={this.state.ListUserSubmit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" type="submit">Lưu</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                            style={{marginLeft: "10px"}}>Đóng
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

export default TurnBackDriverInCustomerFactoryPopup;