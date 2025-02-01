import React from 'react';
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Image, Upload } from "antd";
import "./index.scss";
import changePasswordAPI from "./../../../../api/changePasswordAPI";

const initialState = {
    /* etc */
};

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            initialState: {},
            object:
            {
                email: "",
                oldPassword: "",
                newPassword: "",
                confirmNewPass: "",
            },
            errors: {
                email: "",
                oldPassword: "",
                newPassword: "",
                confirmNewPass: "",
            },
            isShowNewPass: false,
            isShowOldPass: false,
            isShowConfirmPass: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changePasswordAPI = this.changePasswordAPI.bind(this);
    }

    componentDidMount() { }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.dataFromParent) {
            this.setState({
                object: {
                    email: nextProps.dataFromParent.email ? nextProps.dataFromParent.email : "",
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPass: "",
                }
            })
        }
    }

    /* ==================================================== API =============================================*/
    async changePasswordAPI(email, password, new_password, new_password_confirm) {
        const changePassword = await changePasswordAPI(email, password, new_password, new_password_confirm);
        if (changePassword) {
            console.log(changePassword)
            if (changePassword.status === Constants.HTTP_SUCCESS_BODY) {
                this.onCheckUpdate(true);
                showToast('Đổi mật khẩu thành công!', 3000);
                let modal = $("#changePass-carrier");
                modal.modal("hide");
                return true;
            } else if (changePassword.status == 400) {
                showToast('Dữ liệu nhập vào không hợp lệ!', 3000);

            } else {
                showToast(
                    changePassword.data.message
                        ? changePassword.data.message
                        : changePassword.data.err_msg,
                    2000
                );
                this.onCheckUpdate(false)
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình cập nhật dữ liệu!");
            this.onCheckUpdate(false)
            return false;
        }
    }
    /* ==================================================== /API =============================================*/

    /* ==================================================== /Another Function =============================================*/

    reset() {
        this.setState({ errors: initialState });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };


    onCheckUpdate = (checked) => {
        this.props.onChecked(checked);
    }

    validate = (name, value) => {
        if (name === "newPassword" || name === "oldPassword" || name === "confirmNewPass") {
            if (!value) {
                return "Mật khẩu không được để trống!";
            } else if (value && value.length < 6) {
                return "Mật khẩu quá ngắn!";
            } else if (value && value.length > 50) {
                return "Mật khẩu quá dài!";
            } else if (value && value.search(/\d/) == -1) {
                return "Mật khẩu phải chứa ít nhất một số!";
            } else if (value && value.search(/[a-zA-Z]/) == -1) {
                return "Mật khẩu phải chứa ít nhất một chữ cái!";
            } else if (value && value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
                return "Mật khẩu chứa ký tự không hợp lệ!";
            }
        }
        if (name === "confirmNewPass") {
            if (this.state.object.confirmNewPass !== this.state.object.newPassword) {
                return "Mật khẩu nhập lại không trùng khớp!";
            }
        }
    };

    handleBlur = (e) => {
        const { name, value } = e.target;
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    [name]: error,
                },
            },
            () => { }
        );
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let { email, oldPassword, newPassword, confirmNewPass } = this.state.object;
        let hasError = false;
        for (let key in this.state.object) {
            console.log(key)
            const erorr = this.validate(key, this.state.object[key]);
            if (erorr) {
                const state = this.state;
                this.setState((state) => {
                    return {
                        errors: {
                            ...state.errors,
                            [key]: erorr,
                        },
                    };
                });
                hasError = true;
            }
        }
        if (hasError) {
            showToast("Vui lòng kiểm tra lại thông tin!");
        }
        else {
            this.changePasswordAPI(email, oldPassword, newPassword, confirmNewPass)
        }
    };

    /* ==================================================== /Another Function =============================================*/


    render() {
        const { getFieldDecorator } = this.props.form;
        let { email, oldPassword, newPassword, confirmNewPass } = this.state.object;
        let hide = <i className="fa fa-eye-slash" />;
        let show = <i class="fa fa-eye" />
        return (
            <div className="modal fade" id="changePass-carrier" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon className="icon_star" theme="filled" />Đổi mật khẩu</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <Form
                                    form='form'
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Item>
                                                <label style={{ color: 'black' }}>Email</label>
                                                <Input defaultValue={email} readOnly />
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Item className="newPassword_input">
                                                <label style={{ color: 'black' }}>Mật khẩu mới</label><label style={{ color: 'red' }}> *</label>
                                                <Input
                                                    placeholder="Vui lòng nhập mật khẩu mới"
                                                    autoComplete="new-password"
                                                    value={newPassword}
                                                    type="password"
                                                    name="newPassword"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type={this.state.isShowNewPass ? "text" : "password"}
                                                />
                                                <span
                                                    className="eye-show"
                                                    onClick={() => {
                                                        this.setState({ isShowNewPass: !this.state.isShowNewPass });
                                                    }}>
                                                    {this.state.isShowNewPass ? show : hide}
                                                </span>
                                                {this.state.errors.newPassword ?
                                                    (
                                                        <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                            <span>{this.state.errors.newPassword}</span>
                                                        </div>
                                                    ) : ("")}
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Item className="oldPassword_input">
                                                <label style={{ color: 'black' }}>Mật khẩu cũ</label><label style={{ color: 'red' }}> *</label>
                                                <Input
                                                    placeholder="Vui lòng nhập mật khẩu cũ"
                                                    autoComplete="new-password"
                                                    value={oldPassword}
                                                    type="password"
                                                    name="oldPassword"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type={this.state.isShowOldPass ? "text" : "password"}
                                                />
                                                <span
                                                    className="eye-show"
                                                    onClick={() => {
                                                        this.setState({ isShowOldPass: !this.state.isShowOldPass });
                                                    }}>
                                                    {this.state.isShowOldPass ? show : hide}
                                                </span>
                                                {this.state.errors.oldPassword ?
                                                    (
                                                        <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                            <span>{this.state.errors.oldPassword}</span>
                                                        </div>
                                                    ) : ("")}
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Item className="confirmNewPass_input">
                                                <label style={{ color: 'black' }}>Nhập lại mật khẩu mới</label><label style={{ color: 'red' }}>*</label>
                                                <Input
                                                    placeholder="Vui lòng nhập lại mật khẩu mới"
                                                    autoComplete="new-password"
                                                    value={confirmNewPass}
                                                    name="confirmNewPass"
                                                    type="password"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type={this.state.isShowConfirmPass ? "text" : "password"}
                                                />
                                                <span
                                                    className="eye-show"
                                                    onClick={() => {
                                                        this.setState({ isShowConfirmPass: !this.state.isShowConfirmPass });
                                                    }}>
                                                    {this.state.isShowConfirmPass ? show : hide}
                                                </span>
                                                {this.state.errors.confirmNewPass ?
                                                    (
                                                        <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                            <span>{this.state.errors.confirmNewPass}</span>
                                                        </div>
                                                    ) : ("")}
                                            </Form.Item>

                                        </div>
                                    </div>
                                    <footer className="card-footer text-center">
                                        <Button type="primary" htmlType="submit">
                                            <Icon type="save" /> Lưu
                                            </Button>
                                        <Button type="danger" data-dismiss="modal" onClick={(e) => { this.props.form.resetFields(); this.reset(); }}
                                            style={{ marginLeft: "10px" }}>Đóng
                                            </Button>
                                    </footer>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const HorizontalForm = Form.create({ name: 'change-carrier' })(ChangePassword)
export default HorizontalForm;
