import React from 'react';
import AddProductPopup from "./AddProductPopup";

import getAllUserApi from 'getAllUserApi';
import { push } from "react-router-redux";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import showToast from "showToast";
import importProductsFromExcelAPI from "importProductsFromExcelAPI";
import { connect } from "react-redux";
import { Radio } from 'antd';
import required from "required";
import Select from "react-select";
import Constants from "Constants";
import getDestinationUserAPI from "getDestinationUserAPI";
import getAllManufacturer from "getAllManufacturer";

import { lang } from 'moment';

let file = null;

class AddProductExcelPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            messageErr: "",
            chooseType: [
                { value: 0, label: "Tại thương nhân sở hữu", name: "Thương nhân sở hữu" },
                { value: 1, label: "Tại sửa chữa", name: "Sửa chữa" },
                { value: 2, label: "Tại Công ty - Chi nhánh trực thuộc", name: "Công ty - Chi nhánh trực thuộc" }
            ],
            dataChoose: 0,
            ListUserSubmitID: "",
            ListCtyCon: "",
            ListChildCompany: "",
            usingType: "",
            manufacture: "",
            listManufacturers: [],
        }
    }

    async componentDidMount() {
        await this.getAllManufacturer();
    }

    handleFileUpload = (event) => {
        file = event.target.files[0];
        
    }

    handleChangeGeneral = (langValue) => {
        this.setState({ dataChoose: langValue.value, ListUserSubmitID: "" });

    }
    
    handleChangeFixer = (langValue) => {
        this.setState({ ListUserSubmit: langValue, ListUserSubmitID: langValue.id },
            () => {
            });
    }

    onChangeType = e => {
        this.setState({
            usingType: e.target.value
        });
    };

    handleChangeCty = (langValue) => {
        this.setState({
            ListCtyCon: langValue,
            ListChildCompany: langValue.id
        })
    }

    handleChangeManufacture = (langValue) => {
        this.setState({
            manufacture: langValue
        })
    }

    async getAllManufacturer() {
        const dataUsers = await getAllManufacturer(Constants.GENERAL);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listManufacturers: dataUsers.data });
                let listArrManufacture = [];
                for (let i = 0; i < dataUsers.data.length; i++)
                {
                    listArrManufacture.push({
                            value: dataUsers.data[i].id,
                            label: dataUsers.data[i].name,
                            ...dataUsers.data[i],
                    })
                }
                this.setState({
                    listManufacturers: listArrManufacture
                })
            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }
            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }
    async submit(event) {
        event.preventDefault();
        if (!file) showToast('Vui lòng chọn file!', 3000);
        this.setState({ isLoading: true });
        const result = await importProductsFromExcelAPI(file, this.state.ListUserSubmitID, this.state.ListChildCompany, this.state.usingType, this.state.manufacture.id);
        this.setState({ isLoading: false });
        if (result && result.status === 200) {
            if (result.data.status === false && result.data.err !== "") {
                const dataErr = result.data.err.replace(/;/g, "\n")
                this.setState({ messageErr: dataErr })
                //showToast(dataErr, 3000);
            }
            else {
                this.setState({ message: 'Tất cả mã nhập vào hệ thống đều thành công' })
                //showToast('Tất cả mã nhập vào hệ thống đều thành công', 3000);
                this.props.refresh();
            }
            window.location.reload();
            return;
        }
        else {
            showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
        }
        $("#import-product").modal('hide');
        return;
    }

    onreload = () => {
        window.location.reload()

    }


    render() {
        return (
            <div className="modal fade" id="import-product" tabIndex="-1" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Đưa Sản Phẩm Vào Bằng File Excel</h5>
                            <button type="button" className="close" data-dismiss="modal" onClick={this.onreload} >
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
                                                <label>File</label>
                                                <div style={{ display: "flex" }}>
                                                    <Input
                                                        className="form-control"
                                                        type="file"
                                                        name="upload_file"
                                                        onChange={e => this.handleFileUpload(e)}
                                                        validations={[required]} />
                                                    <input type="reset" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Phân loại</label>
                                                <div className="form-group">
                                                    <Radio.Group
                                                        onChange={this.onChangeType}
                                                        value={this.state.usingType}
                                                        validations={[required]}
                                                    >
                                                        <Radio value="New">Bình sản xuất mới</Radio>
                                                        <Radio value="Old">Bình sửa chữa</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Thương hiệu</label>
                                                <div className="form-group">
                                                    <Select
                                                        onChange={this.handleChangeManufacture.bind(this)}
                                                        placeholder="Chọn..."
                                                        options={this.state.listManufacturers}
                                                        value={this.state.manufacture}>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Chọn vị trí bình</label>
                                                <Select
                                                    options={this.state.chooseType}
                                                    onChange={this.handleChangeGeneral.bind(this)}
                                                    placeholder="Chọn..."
                                                    value={this.state.dataChoose}
                                                />
                                            </div>
                                        </div>
                                        {this.state.dataChoose === 1 ? (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Danh sách sửa chữa</label>
                                                <Select
                                                    options={this.props.listUserFixer}
                                                    onChange={this.handleChangeFixer.bind(this)}
                                                    placeholder="Chọn..."
                                                    value={this.state.ListUserSubmitID}
                                                />
                                            </div>
                                        </div>) : null}
                                        {this.state.dataChoose === 2 ? (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Danh sách Công ty - Chi nhánh trực thuộc</label>
                                                <Select
                                                    options={this.props.listUsersPartner}
                                                    onChange={this.handleChangeCty.bind(this)}
                                                    placeholder="Chọn..."
                                                    value={this.state.ListChildCompany}
                                                />
                                            </div>
                                        </div>) : null}
                                        
                                    </div>

                                    {this.state.messageErr !== "" ? (<div className="row">
                                        <label style={{
                                            color: "#f96868",
                                            fontSize: 12,
                                            whiteSpace: "pre-line"
                                        }}>{this.state.messageErr}</label>
                                    </div>) : null}
                                    {this.state.message !== "" ? (<div className="row">
                                        <label style={{
                                            color: "#15c377",
                                            fontSize: 12,
                                            whiteSpace: "pre-line"
                                        }}>{this.state.message}</label>
                                    </div>) : null}
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary">OK</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                        style={{ marginLeft: "10px" }} onClick={this.onreload}>Đóng
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

export default connect()(AddProductExcelPopup)
