import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import isUppercase from 'isUppercase';

import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from './../../../util/apiCaller';
import { ADDUSERURL, UPDATEUSERURL } from './../../../config/config';
import getAllUserApi from "getAllUserApi";
import Constants from "Constants";
import showToast from "showToast";
// import axios from './axios'

const USERTYPE_ENUM = [
    {
        key: 'SuperAdmin',
        value: 'Quản trị viên'
    },
    {
        key: 'Staff',
        value: 'Nhân viên'
    },

]

class AddThanhtra extends React.Component {

    constructor(props) {
        super(props);

        this.form = null;
        this.state = {
            email: "",
            name: "",
            address: "",
            password: "Abc123",
            userType: "Inspector",
            id: "",
            listUsers: [],
            value: {
                password: "",
                email: ""
            },
            errors: {
                password: "",
                email: ""
            },
            formValid: false,
            newpassword: false,
            newemail: false,
        };
    }
    onChange = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        })
    }

    async submit(event) {
        event.preventDefault();
        var user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let { email, name, address, password, userType, id } = this.state;

        //  Chi so sanh email trong tai khoan hien tai
        //  Can kiem tra email thanh tra so voi tat ca tai khoan user
        /*if (email != getalluser.email) {
            let index = this.state.listUsers.findIndex((l) => l.email === email);
        }*/


        var lsur = this.state.listUsers;
        if (this.props.isCreateMode) {

            //  Tao thong tin thanh tra moi
            let isChildOf = user_cookies.user.id;
            let userTypeAsRoleType = user_cookies.user.userType;
            if (password === "") {
                password = "A123!@#";
            }
            let params = {
                email: email,
                password: password,
                name: name,
                address: address,
                userType:
                    userTypeAsRoleType === "" ? "SuperAdmin" : userTypeAsRoleType,
                userRole: userType,
                isChildOf: isChildOf,
                owner: isChildOf,
                staffOf: isChildOf
            };
            await callApi("POST", ADDUSERURL, params, token).then((res) => {
                if (res.data.message === "Email da ton tai") {
                    alert("Email này đã tạo tài khoản rồi. Mời bạn nhập lại");
                } else {
                    alert("Tạo thành công");
                    window.location.reload(false);
                    const modal = $("#create-user");
                    modal.modal("hide");
                }
            });


        } else {
            //  Update thong tin thanh tra
            let params1 = {};
            if (password === "") {
                params1 = {
                    target_id: id,
                    name: name,
                    address: address,
                };
            } else {
                params1 = {
                    target_id: id,
                    name: name,
                    new_password: password,
                    address: address,
                };
            }
            await callApi("POST", UPDATEUSERURL, params1, token).then((res) => {
                window.location.reload(false);
            });
        }
        //console.log(user_cookies);
    }
    componentDidMount() {
        console.log(this.props.check, 'fgdf')
    }
    componentWillReceiveProps(nextProps) {
        console.log(this.props.check)
        if (nextProps && nextProps.userEdit && nextProps.listUsers) {
            this.setState({
                email: nextProps.userEdit.email,
                name: nextProps.userEdit.name,
                address: nextProps.userEdit.address,
                id: nextProps.userEdit.id,
                password: ''
            })
        }
        else {
            this.setState({
                email: "",
                name: "",
                address: "",
                password: '',
                // check: true,
            })
        }

    }

    handleErrorEmail = e => {
        let { name, value } = e.target;
        let { newemail } = this.state;
        let message = value === "" ? "Xin Vui lòng nhập vô đây" : "";
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        newemail = message === "" ? true : false;
        if (value === "") {
            message = '';
        }
        else if (!filter.test(email.value)) {
            message = ('định dạng email không đúng và yêu cầu nhập lại.');
            // email.focus;
            document.getElementById("button").disabled = true;
            newemail = false
        }
        else {
            message = ('');
            document.getElementById("button").disabled = false,
                newemail = true;
        }
        this.setState({
            errors: { ...this.state.errors, [name]: message },
            newemail,
        }, () => {
            // this.FormValidation();
        })
    }
    handleErrors = e => {
        let { name, value } = e.target;
        let message = value === "" ? "Xin vui lòng nhập vô đây" : "";
        let { newpassword } = this.state;
        var pattern = new RegExp(
            "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
            "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
            "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
        );
        var number = /^[0-9]+$/;

        newpassword = message === "" ? true : false;
        if (value && (value.length < 6 && value.match(pattern) && value.match(number))) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
            newpassword = false;

        } else if (value && value.match(number)) {

            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

            newpassword = true;

        } else if (value && value.match(pattern)) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

            newpassword = true;
        } else if (value && value.length < 6) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

            newpassword = true;
        }

        this.setState({
            errors: { ...this.state.errors, [name]: message },
            newpassword,

        }, () => {
            this.FormValidation();

        })
    }

    FormValidation = () => {
        this.setState({
            formValid: this.state.newpassword
        })
    }
    render() {
        //console.log(this.props.userEdit);
        let { email, name, address, password } = this.state;
        return (
            <div className="modal fade" id="create-user" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.props.isCreateMode ? "Tạo Mới Người kiểm tra, bảo trì" : "Chỉnh Sửa Thông Tin Người kiểm tra, bảo trì"}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Form ref={c => {
                                this.form = c
                            }}
                                className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="form-group">
                                                <label>Địa chỉ Email </label>
                                                <Input className="form-control"
                                                    disabled={this.props.check}
                                                    type="text" name="email" id="email" onChange={this.onChange}
                                                    value={email}
                                                    validations={[required, isUppercase]}
                                                    onBlur={this.handleErrorEmail}
                                                    onKeyUp={this.handleErrorEmail}
                                                />
                                                {this.state.errors.email === "" ? "" : (<div className="alert alert-danger">{this.state.errors.email}</div>)}

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tên người kiểm tra, bảo trì </label>
                                                <Input className="form-control" type="text" name="name" id="name" onChange={this.onChange}
                                                    value={name} validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Địa chỉ </label>
                                                <Input className="form-control" type="text" name="address" id="address" onChange={this.onChange}
                                                    value={address} validations={[required]} />
                                            </div>
                                        </div>
                                        {this.props.isCreateMode === false
                                            && (
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label>Mật Khẩu </label>
                                                        <Input className="form-control" type="password" name="password" id="password" onChange={this.onChange}
                                                            onBlur={this.handleErrors}
                                                            onKeyUp={this.handleErrors}
                                                            value={password}
                                                        />
                                                        {this.state.errors.password === "" ? "" : (<div className="alert alert-danger">{this.state.errors.password}</div>)}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" id="button">Lưu</Button>
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

export default AddThanhtra;
