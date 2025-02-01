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
import ReactCustomLoading from "ReactCustomLoading"
import turnbackCylinderDuplicate from "../../../../api/turnbackCylinderDuplicate"
const Option = Select.Option;
function getList() {
    return new Promise(function (resolve) {
        setTimeout(() => resolve([1, 2, 3]), 3000);
    });
}
class TurnBackDriverFactoryPopup extends React.Component {

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
            listDuplicate: []
        };
    }
    onSubmit = () => {
        try {
            const data = this.form.getValues();
            // if (!this.state.idDriver) throw "Phải nhập tên tài xế !";
            // if (!data.license_plate) throw "Phải nhập biển số xe !";
            // if (!data.number_cylinder) throw "Phải điền số lượng !";
            this.setState({ isLoading: true, loading: true });
            // getList().then((list) => {
            // this.setState({
            //     isLoading: false,
            //     loading: false,
            //     list,
            //     show: false
            // });
            getList().then(list => {
                
            this.setState({
                isLoading: false,
                loading: false,
                list,
                show: false
            });
            const modal = $("#turn-back-driver-full");
            modal.modal("hide");
            
        });
        }
        catch (e)
        {
            this.setState({ isLoading: false, loading: false });
            showToast(e);
        }
        
    };
    handleChangeDriver = (value) => {
        this.setState({
            idDriver: value,
        });
    };

    async addHistory(driver, license_plate, cylinders, type, stationId, numberOfCylinder, idDriver, sign, cylinderImex, idImex, typeImex, flow, successCylinders) {

        // Call api
        this.setState({ isLoading: true });
        console.log(stationId);
        if (this.props.product_parse.length !== 0) {
            const user = await createHistoryAPI(
                driver,
                license_plate,
                cylinders,
                Constant.IMPORT_FACTORY,
                '',
                type,
                numberOfCylinder,
                '',
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
                "",
                this.props.listNotPass
            );
            await this.setState({ loading: false })
            this.setState({ isLoading: false });
            //console.log('register',user);
            if (user) {
                if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY && !user.data.hasOwnProperty("err_msg")) {
                    showToast('Nhập hàng thành công!', 3000);
                    const modal = $("#turn-back-driver");
                    modal.modal('hide');
                    setTimeout(function () {
                        window.location.reload()
                    }, 2000)
                    return true;
                }
                else {
                    showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                    const modal = $("#turn-back-driver");
                    modal.modal('hide');
                    // setTimeout(function () {
                    //     window.location.reload()
                    // }, 2000)
                    return false;
                }
            }
            else {
                showToast("Xảy ra lỗi trong quá trình tạo bình ");
                return false;
            }
        }
        else {
            if (this.props.listCylinderDuplicate.length !== 0) {
                const result = await turnbackCylinderDuplicate(
                    driver,
                    license_plate,
                    cylinders,
                    Constant.IMPORT_FACTORY,
                    '',
                    type,
                    numberOfCylinder,
                    '',
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
                        const modal = $("#turn-back-driver");
                        modal.modal('hide');
                        showToast("Nhập hàng thành công")
                        setTimeout(function () {
                            window.location.reload()
                        }, 2000)

                    }
                    else {
                        this.setState({
                            loading: false,
                        })
                        const modal = $("#turn-back-driver");
                        modal.modal('hide');
                        showToast(result.data.err_msg)
                        // setTimeout(function () {
                        //     window.location.reload()
                        // }, 2000)
                    }
                }
                else {
                    showToast("Xảy ra lỗi trong quá trình hồi lưu bình trùng")
                }
            }
            else {
                const user = await createHistoryAPI(
                    driver,
                    license_plate,
                    successCylinders,
                    Constant.IMPORT_FACTORY,
                    '',
                    type,
                    numberOfCylinder,
                    '',
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
                    "",
                    this.props.listNotPass
                );
                await this.setState({ loading: false })
                this.setState({ isLoading: false });
                //console.log('register',user);
                if (user) {
                    if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY && !user.data.hasOwnProperty("err_msg")) {
                        showToast('Nhập hàng thành công!', 3000);
                        const modal = $("#turn-back-driver");
                        modal.modal('hide');
                        setTimeout(function () {
                            window.location.reload()
                        }, 2000)
                        return true;
                    }
                    else {
                        showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                        const modal = $("#turn-back-driver");
                        modal.modal('hide');
                        // setTimeout(function () {
                        //     window.location.reload()
                        // }, 2000)
                        return false;
                    }
                }
                else {
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
    /*handleObjectDataChild = async (childValue) => {
        handleObjectDataChildCTC
    };*/

    submit = async (event) => {
        // this.setState({ loading: true })
        //console.log("data nhan lai", this.props.product_parse[0].histories[0].from.id);

        event.preventDefault();

        // var products=await this.getAllCylenders();
        let { listDriver } = this.state;
        let index = listDriver.findIndex(l => l.id === this.state.idDriver);
        let nameDriver = listDriver[index].name;
        var cylinders = [];
        let cylinderImex = [];

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
            if (this.props.listIdSuccess) {
                for (let i = 0; i < this.props.listIdSuccess.length; i++) {
                    cylinderImex.push(
                        {
                            id: this.props.listIdSuccess[i],
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
        let idImex = Date.now();
        let typeImex = "IN";
        let flow = "TURN_BACK";

        await this.addHistory(
            nameDriver,
            data.license_plate,
            this.props.product_parse.length !== 0 ? cylinders : this.props.listCylinderDuplicate,
            Constant.TURN_BACK_TYPE,
            data.station,
            data.number_cylinder,
            data.idDriver,
            sign,
            cylinderImex,
            idImex,
            typeImex,
            flow,
            this.props.listIdSuccess
        );
        return;
    }

    render() {
        return (
            <div className="modal fade" id="turn-back-driver" tabIndex="-1">
                <ReactCustomLoading isLoading={this.state.loading} />
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nhập Hồi Lưu - Bước 2 - Thông Tin Tài Xế</h5>
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
                                        {/*<div className="col-md-6">*/}
                                        {/*    <div className="form-group">*/}
                                        {/*        <label>Loại nhập</label>*/}
                                        {/*        <Select className="form-control"*/}
                                        {/*                name="import_type"*/}
                                        {/*                onChange={(event) => this.handleChangeTypeImport(event)}*/}
                                        {/*                validations={[required]}>*/}
                                        {/*            <option value="">-- Chọn --</option>*/}
                                        {/*            <option value={Constant.TURN_BACK_TYPE}>Nhập hồi lưu </option>*/}
                                        {/*            <option value={Constant.IMPORT_TYPE}>Nhập từ trạm chiết </option>*/}
                                        {/*        </Select>*/}
                                        {/*    </div>*/}


                                        {/*</div>*/}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Số Lượng</label>
                                                <Input className="form-control" type="text" name="number_cylinder"
                                                    id="number_cylinder" />
                                            </div>
                                        </div>
                                        {/*{this.state.typeImport === Constant.IMPORT_TYPE ?<div className="col-md-6">*/}
                                        {/*    <label>Trạm chiết</label>*/}
                                        {/*    <Select className="form-control"*/}
                                        {/*            name="station"*/}
                                        {/*            validations={[required]}>*/}
                                        {/*        <option value="">-- Chọn --</option>*/}
                                        {/*        {this.props.listTurnBackStations.map((item) => <option value={item.id}>{item.name}</option>)}*/}

                                        {/*    </Select>*/}
                                        {/*</div> :null}*/}
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" type="submit" onClick={this.onSubmit}
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

export default TurnBackDriverFactoryPopup;
