import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import isUppercase from "isUppercase";
import getUserCookies from "../../../helpers/getUserCookies";
import callApi from "../../../util/apiCaller";
import { ADDUSERURL, UPDATEUSERURL } from "../../../config/config";
const USERTYPE_ENUM = [
    {
        key: "SuperAdmin",
        value: "Quản trị viên",
    },
    {
        key: "Staff",
        value: "Nhân viên",
    },
];

class AddStaff extends React.Component {
    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            email: "",
            name: "",
            address: "",
            password: "Abc123",
            userType: "Staff",
            email: "",
            name: "",
            address: "",
            id: "",
            listUsers: [],
            value: {
                password: ""
            },
            errors: {
                password: ""
            },
            formValid: false,
            newpassword: false,
        };
    }
    onChange = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value,
        });
    };
    //cmt
    async submit(event) {
        event.preventDefault();
        var user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let { email, name, address, password, userType, id } = this.state;
        let index = this.state.listUsers.findIndex((l) => l.email === email);
        if (this.props.isCreateMode) {
            if (index === -1) {
                let isChildOf = user_cookies.user.id;
                let userTypeAsRoleType = user_cookies.user.userType;
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
                };
                await callApi("POST", ADDUSERURL, params, token).then((res) => {
                    window.location.reload(false);
                    const modal = $("#create-user");
                    modal.modal("hide");
                });
            }
            else {
                alert("Email này đã tạo tài khoản rồi. Mời bạn nhập lại");
            }

        } else {
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
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.userEdit && nextProps.listUsers) {
            this.setState({
                email: nextProps.userEdit.email,
                name: nextProps.userEdit.name,
                address: nextProps.userEdit.address,
                id: nextProps.userEdit.id,
                listUsers: nextProps.listUsers,
            });
        } else {
            this.setState({
                email: "",
                name: "",
                address: "",
            });
        }
    }

    handleErrors = (e) => {
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
            messgae = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
            newpassword = false;
        } else if (value && value.match(number)) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gòm cả chữ và số hoặc kí tự đặc biệt"
            newpassword = true
        } else if (value && value.match(pattern)) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
            newpassword = true
        } else if (value && value.length < 6) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
            newpassword = true
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
        //console.log(this.state.listUsers);
        let { email, name, address } = this.state;
        let passEmpty = "";
        return (
            <div className="modal fade" id="create-user" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.props.isCreateMode
                                    ? "Tạo Mới Người Dùng"
                                    : "Chỉnh Sửa Người Dùng"}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form
                                ref={(c) => {
                                    this.form = c;
                                }}
                                className="card"
                                onSubmit={(event) => this.submit(event)}
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Địa chỉ Email </label>
                                                <Input
                                                    //  disabled={this.props.isEditForm}
                                                    disabled={this.props.check}
                                                    className="form-control"
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    onChange={this.onChange}
                                                    value={email}
                                                    validations={[required, isUppercase]}

                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tên người dùng </label>
                                                <Input
                                                    className="form-control"
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    onChange={this.onChange}
                                                    value={name}
                                                    validations={[required]}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Địa chỉ </label>
                                                <Input
                                                    className="form-control"
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    onChange={this.onChange}
                                                    value={address}
                                                    validations={[required]}
                                                />
                                            </div>
                                        </div>
                                        {this.props.isCreateMode === false && (
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Mật Khẩu </label>
                                                    <Input
                                                        className="form-control"
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        onChange={this.onChange}
                                                        onBlur={this.handleErrors}
                                                        onKeyUp={this.handleErrors}
                                                    />
                                                    {this.state.errors.password === "" ? "" : (<div className="alert alert-danger">{this.state.errors.password}</div>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary">Lưu</Button>
                                    <button
                                        className="btn btn-secondary"
                                        type="reset"
                                        data-dismiss="modal"
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Đóng
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

export default AddStaff;
