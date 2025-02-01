import React from 'react';
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Upload, message } from "antd";
import "./index.scss";
import createCarrierAPI from "./../../../../api/createCarrierAPI";

const initialState = {
    email: "",
    password: "",
    address: "",
    phone: "",
    code: "",
    name: "",
    driverNumber: ""
};


class CreateCarrier extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.options = [];
        this.state = {
            avtBase64: "",
            isShowPass: false,
            object: {
                email: "",
                password: "",
                address: "",
                phone: "",
                code: "",
                name: "",
                driverNumber: "",
            },
            errors: {
                email: "",
                password: "",
                address: "",
                phone: "",
                code: "",
                name: "",
                driverNumber: "",
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createCarrierAPI = this.createCarrierAPI.bind(this);
    }

    async componentDidMount() {
        this.setState({ object: initialState, errors: initialState })
    }

    /* ==================================================== API =============================================*/
    async createCarrierAPI(email, password, address, phone, code, name, driverNumber, avtBase64) {
        const createCarrier = await createCarrierAPI(email, password, address, phone, code, name, driverNumber, avtBase64);
        if (createCarrier) {
            console.log(createCarrier)
            if (createCarrier.status === Constants.HTTP_SUCCESS_CREATED) {
                showToast('Tạo mới thành công!', 3000);
                this.onCheckCreate(true);
                this.resetForm();
                let modal = $("#create-carrier");
                modal.modal("hide")
                return true;
            }
            else {
                showToast(
                    createCarrier.data.message
                        ? createCarrier.data.message
                        : createCarrier.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình thêm dữ liệu!");
            this.onCheckCreate(false)
            return false;
        }
    }
    /* ==================================================== /API =============================================*/







    /* ==================================================== /Another Function =============================================*/

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };

    validate = (name, value) => {
        if (name === "name") {
            if (!value) {
                return "Tên tài xế không được để trống!"
            }
        }

        if (name === "code") {
            if (!value) {
                return "Mã tài xế không được để trống!"
            }
        }

        if (name === "phone") {
            if (!value) {
                return "Số điện thoại không được để trống!"
            }
            if (value && value.search(/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)) {
                return "Số điện thoại không hợp lệ!";
            }
        }

        if (name === "email") {
            let parts = value.split("@");
            let domainPart = parts[1] ? parts[1].split(".") : ""
            if (!value) {
                return "Email không được để trống!"
            } else if (value && value.search(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)) {
                return "Email không hợp lệ!";
            } else if (value && parts[0].length > 64) {
                return "Email không hợp lệ!";
            } else if (value && domainPart[0].length > 63 || domainPart[1].length > 63) {
                return "Email không hợp lệ!";
            }
        }

        if (name === "password") {
            if (!value) {
                return "Mật khẩu không được để trống!"
            } else if (value && value.length < 6) {
                return "Mật khẩu quá ngắn!";
            } else if (value && value.length > 24) {
                return "Mật khẩu quá dài!";
            } else if (value && value.search(/\d/) == -1) {
                return "Mật khẩu phải chứa ít nhất một số!";
            } else if (value && value.search(/[a-zA-Z]/) == -1) {
                return "Mật khẩu phải chứa ít nhất một chữ cái!";
            } else if (value && value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
                return "Mật khẩu chứa ký tự không hợp lệ!";
            }
        }
    };

    handleBlur = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    [name]: error,
                },
            }
        );
    };

    handleSubmit = e => {
        e.preventDefault()
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     if (!err) {
        //         let address = values.address ? values.address : "";
        //         let driverNumber = values.driverNumber ? values.driverNumber : "";
        //         let avtBase64 = this.state.avtBase64
        //         this.createCarrierAPI(values.email, values.password, address, values.phone, values.code, values.name, driverNumber, avtBase64)
        //     }
        // })
        let { email, password, address, phone, code, name, driverNumber } = this.state.object;
        let _address = address ? address : "";
        let _driverNumber = driverNumber ? driverNumber : "";
        let avtBase64 = this.state.avtBase64;
        let hasError = false;
        for (let key in this.state.object) {
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
        } else {
            this.createCarrierAPI(email, password, _address, phone, code, name, _driverNumber, avtBase64);
        }
    }

    onCheckCreate = (checked) => {
        this.props.onChecked(checked);
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result);
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
        };
    }

    fileChangedHandler = (event) => {
        let avtBase64 = "";
        this.getBase64(event.target.files[0], (result) => {
            avtBase64 = result;
            this.setState({ avtBase64 });
        });
    };

    resetForm() {
        this.setState({ object: initialState, errors: initialState })
    }

    /* ==================================================== /Another Function =============================================*/




    render() {
        let { email, password, address, phone, code, name, driverNumber } = this.state.object;
        let hide = <i className="fa fa-eye-slash" />;
        let show = <i class="fa fa-eye" />
        return (
            <div className="modal fade" id="create-carrier" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon className="icon_star" theme="filled" />Tạo mới tài xế</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {/* <div className="modal-body">
                            <div className="container">
                                <Form
                                    form='form'
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Input
                                                type="file"
                                                name="avatar"
                                                data-provide="dropify"
                                                onChange={(event) => this.fileChangedHandler(event)}
                                                className="avt_input"
                                            // validations={[required]}
                                            />

                                            <Form.Item className="phone_input">
                                                <label style={{ color: 'black' }}>Số điện thoại</label><label style={{ color: 'red' }}>*</label>
                                                {getFieldDecorator('phone', {
                                                    rules: [{ required: true, message: "Số điện thoại không được để trống!" },
                                                    { validator: this.phoneValidator }],
                                                })(
                                                    <Input length="10" type="number" placeholder="Vui lòng nhập Số điện thoại" />
                                                )}
                                            </Form.Item>

                                            <Form.Item className="driverNumber_input">
                                                <label style={{ color: 'black' }}>Biển số xe</label>
                                                {getFieldDecorator('driverNumber', {
                                                    rules: [{ validator: this.driverNumberValidator }]
                                                })(
                                                    <Input placeholder="Vui lòng nhập Biển số xe" type="text" />
                                                )}
                                            </Form.Item>


                                        </div>
                                        <div className="col-sm-6">
                                            <Form.Item
                                                className="code_input"
                                            >
                                                <label style={{ color: 'black' }}>Mã tài xế</label><label style={{ color: 'red' }}>*</label>
                                                {getFieldDecorator('code', {
                                                    rules: [{ required: true, message: "Mã tài xế không được để trống!" }],
                                                })(
                                                    <Input type="text" placeholder="Vui lòng nhập Mã tài xế" />
                                                )}
                                            </Form.Item>
                                            <Form.Item className="name_input">
                                                <label style={{ color: 'black' }}>Tên tài xế</label><label style={{ color: 'red' }}>*</label>
                                                {getFieldDecorator('name', {
                                                    rules: [{ required: true, message: "Tên tài xế không được để trống!" }]
                                                })(
                                                    <Input placeholder="Vui lòng nhập Tên tài xế" type="text" />
                                                )}
                                            </Form.Item>

                                            <div className="child_form">

                                                <Form.Item className="email_input">
                                                    <label style={{ color: 'black' }}>Email</label><label style={{ color: 'red' }}>*</label>
                                                    {getFieldDecorator('email', {
                                                        rules: [{ required: true, message: "Email không được để trống!" },
                                                        { validator: this.emailValidator }],
                                                    })(
                                                        <Input placeholder="Vui lòng nhập Email"
                                                            type="text"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item className="password_input">
                                                    <label style={{ color: 'black' }}>Mật khẩu</label><label style={{ color: 'red' }}>*</label>
                                                    {getFieldDecorator('password', {
                                                        rules: [{ required: true, message: "Mật khẩu không được để trống!" },
                                                        { validator: this.passwordValidator }],

                                                    })(
                                                        <div>
                                                            <Input
                                                                placeholder="Vui lòng nhập mật khẩu!"
                                                                autoComplete="new-password"
                                                                type={this.state.isShowPass ? "text" : "password"}></Input>
                                                            <span
                                                                className="eye-show"
                                                                onClick={() => {
                                                                    this.setState({ isShowPass: !this.state.isShowPass });
                                                                }}>{this.state.isShowPass ? show : hide} </span>
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form.Item className="address_input">
                                                <label style={{ color: 'black' }}>Địa chỉ</label>
                                                {getFieldDecorator('address', {
                                                })(
                                                    <Input.TextArea
                                                        placeholder="Vui lòng nhập Địa chỉ"
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <footer className="card-footer text-center">
                                        <Button type="primary" htmlType="submit">
                                            <Icon type="save" /> Lưu
                                            </Button>
                                        <Button
                                            type="danger"
                                            data-dismiss="modal"
                                            style={{ marginLeft: "10px" }}
                                            onClick={() => { this.props.form.resetFields() }}
                                        >Đóng
                                            </Button>
                                    </footer>
                                </Form>
                            </div>
                        </div> */}
                        <form
                            onSubmit={this.handleSubmit}
                            ref={(c) => {
                                this.form = c;
                            }}>
                            <div className="modal-body" id="form_body">
                                <div className="site-card-border-less-wrapper container">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group row">
                                                <div className="col-sm-12">
                                                    <Input
                                                        type="file"
                                                        name="avatar"
                                                        data-provide="dropify"
                                                        onChange={(event) => this.fileChangedHandler(event)}
                                                        className="avt_input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Số điện thoại <label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-12">
                                                    <Input
                                                        type="text"
                                                        name="phone"
                                                        className="form-control input_value"

                                                        style={{ color: "black" }}
                                                        placeholder="Vui lòng nhập Số điện thoại"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                        value={phone}
                                                    ></Input>
                                                    {
                                                        this.state.errors.phone ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.phone}</span>
                                                                </div>
                                                            ) : ("")
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Biển số xe <label style={{ color: 'white' }}>*</label></label>
                                                <div className="col-sm-12">
                                                    <Input
                                                        type="text"
                                                        name="driverNumber"
                                                        className="form-control input_value"

                                                        style={{ color: "black" }}
                                                        placeholder="Nhập vào Biển số xe"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                        value={driverNumber}
                                                    ></Input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6" style={{ marginTop: "auto" }}>
                                            <div className="form-group row">
                                                <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Mã tài xế <label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-12">
                                                    <Input
                                                        type="text"
                                                        name="code"
                                                        className="form-control input_value"

                                                        style={{ color: "black" }}
                                                        placeholder="Vui lòng nhập Mã tài xế"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                        value={code}
                                                    ></Input>
                                                    {
                                                        this.state.errors.code ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.code}</span>
                                                                </div>
                                                            ) : ("")
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Tên tài xế <label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-12">
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        className="form-control input_value"

                                                        style={{ color: "black" }}
                                                        placeholder="Vui lòng nhập Tên tài xế"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                        value={name}
                                                    ></Input>
                                                    {
                                                        this.state.errors.name ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.name}</span>
                                                                </div>
                                                            ) : ("")
                                                    }
                                                </div>
                                            </div>
                                            <div className="child_form">
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Email <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="email"
                                                            className="form-control input_value"

                                                            style={{ color: "black" }}
                                                            placeholder="Vui lòng nhập Email"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={email}
                                                        ></Input>
                                                        {
                                                            this.state.errors.email ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.email}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Mật khẩu <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-12">
                                                        <Input
                                                            type="text"
                                                            name="password"
                                                            className="form-control input_value"

                                                            style={{ color: "black", paddingRight: "40px" }}
                                                            placeholder="Vui lòng nhập Mật khẩu"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            autoComplete="new-password"
                                                            value={password}
                                                            type={this.state.isShowPass ? "text" : "password"}>
                                                        </Input>
                                                        {
                                                            this.state.errors.password ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.password}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                        <span
                                                            className="eye-show-create"
                                                            onClick={() => {
                                                                this.setState({ isShowPass: !this.state.isShowPass });
                                                            }}>{this.state.isShowPass ? show : hide} </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group row">
                                                <label id="input_name" htmlFor="input_value" className="col-sm-5 col-form-label">Địa chỉ <label style={{ color: 'white' }}>*</label></label>
                                                <div className="col-sm-12">
                                                    <Input.TextArea
                                                        type="text"
                                                        name="address"
                                                        className="form-control input_value"

                                                        style={{ color: "black" }}
                                                        place="Nhập vào địa chỉ"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                        value={address}
                                                    ></Input.TextArea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div id="form_footer">
                                    <footer className="card-footer text-center footer_form">
                                        <Button type="primary" htmlType="submit">
                                            <Icon type="save" /> Lưu
                                            </Button>
                                        <Button
                                            type="danger"
                                            data-dismiss="modal"
                                            style={{ marginLeft: "10px" }}
                                            onClick={(e) => { this.resetForm() }}
                                        >Đóng
                                        </Button>
                                    </footer>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateCarrier;
