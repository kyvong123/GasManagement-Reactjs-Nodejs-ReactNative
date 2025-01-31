import React from 'react';
import createCustomerAPI from "../../../../api/createCustomer";
import updateCustomerAPI from "../../../../api/updateCustomerAPI";
import getAllCustomerReceive from "../../../../api/getAllCustomerReceive";
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Checkbox, Select, Card } from "antd";
const { Option } = Select;
const { TextArea } = Input;
const initialState = {
    id: "",
    code: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    taxcode: "",
    contactname: "",
    note: "",
    branchname: "",
    userID: "",
    LAT: "",
    LNG: "",
};

class AddCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listCustomerReceive: [],
            listStation: [],
            object: {
                id: "",
                code: "",
                name: "",
                phone: "",
                email: "",
                address: "",
                taxcode: "",
                contactname: "",
                note: "",
                branchname: "",
                userID: "",
                LAT: "",
                LNG: "",
            },
            errors: {
                code: "",
                name: "",
                phone: "",
                email: "",
                address: "",
                taxcode: "",
                contactname: "",
                note: "",
                branchname: "",
                userID: "",
                LAT: "",
                LNG: "",
            },
        }

        this.createCustomerGas = this.createCustomerGas.bind(this);
        this.updateCustomerGas = this.updateCustomerGas.bind(this);
        this.onCheckCreate = this.onCheckCreate.bind(this);
    }

    async componentDidMount() {
    }


    async componentWillReceiveProps(nextProps) {
        // if(nextProps && nextProps.customerReceive){
        //     this.setState({
        //         listCustomerReceive: nextProps.customerReceive
        //     })
        // }
        if(nextProps && nextProps.listStation){
            this.setState({
                listStation: nextProps.listStation
            })
        }
        if (nextProps && nextProps.customerEdit) {
            this.setState({
                object: {
                    id: nextProps.customerEdit.id ? nextProps.customerEdit.id : '',
                    name: nextProps.customerEdit.name ? nextProps.customerEdit.name : '',
                    contactname: nextProps.customerEdit.contactname ? nextProps.customerEdit.contactname : '',
                    email: nextProps.customerEdit.email ? nextProps.customerEdit.email : '',
                    code: nextProps.customerEdit.code ? nextProps.customerEdit.code : '',
                    address: nextProps.customerEdit.address ? nextProps.customerEdit.address : '',
                    userId: nextProps.customerEdit.userId ? nextProps.customerEdit.userId : '',
                    phone: nextProps.customerEdit.phone ? nextProps.customerEdit.phone : '',
                    taxcode: nextProps.customerEdit.taxcode ? nextProps.customerEdit.taxcode : '',
                    note: nextProps.customerEdit.note ? nextProps.customerEdit.note : '',
                    branchname: nextProps.customerEdit.branchname ? nextProps.customerEdit.branchname : '',
                    userID: nextProps.customerEdit.userID ? nextProps.customerEdit.userID : '',
                    LAT: nextProps.customerEdit.LAT ? nextProps.customerEdit.LAT : '',
                    LNG: nextProps.customerEdit.LNG ? nextProps.customerEdit.LNG : '',
                },
                errors: initialState
            });
        }else {
            this.setState({
                object: initialState,
                errors: initialState
            })
        }
    }
    /* ==================================================== API =============================================*/

    async createCustomerGas(name, phone, address, taxcode, code, note, email, contactname, branchname, userID, LAT, LNG) {
        const createCustomerGas = await createCustomerAPI(name, phone, address, taxcode, code, note, email, contactname, branchname, userID, LAT, LNG);
        if (createCustomerGas) {
            console.log("createCustomerGas",createCustomerGas)
            if (createCustomerGas.data.success === true) {
                showToast('Tạo mới thành công!', 2000);
                let modal = $("#create-customer-gas");
                modal.modal("hide");
                this.onCheckCreate(true);
            }
            else {
                if( createCustomerGas.data.message === "code đã tồn tại . Vui lòng lựa chọn code khác"){
                    showToast("Mã khách hàng đã tồn tại. Vui lòng lựa chọn mã khác!");
                }else{
                showToast(
                    createCustomerGas.data.message
                        ? createCustomerGas.data.message
                        : createCustomerGas.data.err_msg,
                    2000
                );
                }
            }
        } else {
            this.onCheckCreate(false);
        }
    }

    async updateCustomerGas(id, name, phone, address, taxcode, note, email, contactname, branchname, userID, LAT, LNG) {
        const updateCustomerGas = await updateCustomerAPI(id, name, phone, address, taxcode, note, email, contactname, branchname, userID, LAT, LNG);
        if (updateCustomerGas) {
            console.log("updateCustomerGas",updateCustomerGas)
            if (updateCustomerGas.data.success === true) {
                showToast('Cập nhật thành công!', 3000);
                let modal = $("#create-customer-gas");
                modal.modal("hide");
                this.onCheckCreate(true);
            }
            else {
                showToast(
                    updateCustomerGas.data.message
                        ? updateCustomerGas.data.message
                        : updateCustomerGas.data.err_msg,
                    2000
                );
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình cập nhật dữ liệu!");
        }
    }

    /* ==================================================== /API =============================================*/

    /* ==================================================== /Another Functions =============================================*/

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };

    OnChangeOption = (e) => {
        let option = JSON.parse(e)
        console.log("option",option)
        this.setState(prevState => ({
            object: { ...prevState.object, userID: option.id, branchname: option.name }
        }));
    };

    validate = (name, value) => {
        if (name === "name") {
            if (!value) {
                return "Tên khách hàng không được để trống!"
            }
        }

        if (name === "code") {
            if (!value) {
                return "Mã khách hàng không được để trống!"
            }
        }

        if (name === "address") {
            if (!value) {
                return "Địa chỉ không được để trống!"
            }
        }

        // if (name === "contactname") {
        //     if (!value) {
        //         return "Tên liên hệ không được để trống!"
        //     }
        // }

        if (name === "userID") {
            if (!value || value === "Chọn chi nhánh") {
                return "Chi nhánh không được để trống!"
            }
        }

        // if (name === "branchname") {
        //     if (!value) {
        //         return "Chi nhánh không được để trống!"
        //     }
        // }

        if (name === "taxcode") {
            if(value && String(value).search(/^([0-9])*$/)){
                return "Mã số thuế không hợp lệ!"
            } 
        }

        // if (name === "note") {
        //     if (!value) {
        //         return "Ghi chú không được để trống!"
        //     }
        // }

        if (name === "phone") {
            // if (value && value.search(/(03|07|08|09|01[2|6|8|9])+([0-9]{4,38})\b/)) {
            //     return "Số điện thoại không hợp lệ!";
            // }
            if(value && value.search(/^([0-9])*$/)){
                return "Số điện thoại không hợp lệ!"
            }else if ( value && value.length > 40 ) {
                return "Số điện thoại quá dài!";
            }else if ( value && value.length < 6) {
                return "Số điện thoại quá ngắn!";
            }
        }

        if (name === "email") {
            if (value && value.search(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)) {
                return "Email không hợp lệ!";
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
            }
        );
    };

    handleBlurOption = (value) => {
        const name = "userID"
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    userID: error,
                },
            },
            () => { }
        );
    }

    onSubmit = async (e) => {
        e.preventDefault();
        let { id, name, phone, address, taxcode, code, note, email, contactname, branchname, userID, LAT, LNG } = this.state.object;

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
            let result;
            if (id) {
                this.updateCustomerGas(id, name, phone, address, taxcode, note, email, contactname, branchname, userID, LAT, LNG);
            } else {
                this.createCustomerGas(name, phone, address, taxcode, code, note, email, contactname, branchname, userID, LAT, LNG);
            }
        }
    }

    resetForm() {
        this.setState({ object: initialState, errors: initialState })
    }

    onCheckCreate = (checked) => {
        this.props.onChecked(checked);
    }

    /* /////////////////////////////////////////////////////// /Another Functions =============================================*/

    render() {
        let { id, code, name, phone, address, taxcode, contactname, branchname, note, email, userID, LAT, LNG } = this.state.object;
        return (
            <div className="modal fade" id="create-customer-gas" role="dialog" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">
                                {this.props.isCreateMode ? "Tạo mới khách hàng" : "Chỉnh sửa thông tin khách hàng"}
                            </h6>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <form
                            onSubmit={this.onSubmit}
                            ref={(c) => {
                                this.form = c;
                            }}>
                            <div className="modal-body" id="form_body">
                                <div className="site-card-border-less-wrapper">
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <Card title="Thông tin khách hàng" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Mã khách hàng {this.props.checkCreateMode ? <label style={{visibility:'hidden'}}>*</label> : <label style={{ color: 'red' }}>*</label>}</label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            name="code"
                                                            type="text"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={code}
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            disabled={this.props.checkCreateMode}
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
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Tên khách hàng <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={name}
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
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
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Địa chỉ <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="text"
                                                            name="address"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={address}
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                        ></Input>
                                                        {
                                                            this.state.errors.address ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.address}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Mã số thuế <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="text"
                                                            name="taxcode"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={taxcode}
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                        ></Input>
                                                        {
                                                            this.state.errors.taxcode ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.taxcode}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Chi nhánh <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Select
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            placeholder="Chọn chi nhánh"
                                                            name="userID"
                                                            onChange={this.OnChangeOption}
                                                            onBlur={this.handleBlurOption}
                                                            value={branchname}
                                                        // value={userID}
                                                        >
                                                            <Option value="empty" disabled>Chọn chi nhánh</Option>
                                                            {this.state.listStation.map((option, index) => (
                                                                <Option key={option.id} value={JSON.stringify(option)}>{option.name}</Option>
                                                                // <Option key={option.id} value={{id : option.id , name : option.name}}>{option.name}</Option>
                                                            ))}
                                                        </Select>
                                                        {this.state.errors.userID ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.userID}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>

                                            </Card>
                                        </div>
                                        <div className="col-md-6 ">
                                            <Card title="Thông tin liên hệ" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Tên <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="text"
                                                            name="contactname"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={contactname}
                                                            // onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                        ></Input>
                                                        {
                                                            this.state.errors.contactname ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.contactname}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Điện thoại <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="number"
                                                            name="phone"
                                                            className="form-control"
                                                            // id="inpu_value"
                                                            style={{ color: "black" }}
                                                            value={phone}
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                        />
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
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Email <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="text"
                                                            name="email"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={email}
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
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
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">Ghi chú <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input.TextArea
                                                            type="text"
                                                            name="note"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={note}
                                                            // onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            rows={1}
                                                        ></Input.TextArea>
                                                        {
                                                            this.state.errors.note ?
                                                                (
                                                                    <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                        <span>{this.state.errors.note}</span>
                                                                    </div>
                                                                ) : ("")
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">LAT <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="number"
                                                            name="LAT"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={LAT}
                                                            // onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_value" className="col-sm-5 col-form-label">LNG <label style={{visibility:'hidden'}}>*</label></label>
                                                    <div className="col-sm-7">
                                                        <Input
                                                            type="number"
                                                            name="LNG"
                                                            className="form-control"
                                                            // id="input_value"
                                                            style={{ color: "black" }}
                                                            value={LNG}
                                                            // onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                        ></Input>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="form-group row " id="form_footer">
                                    <footer className="card-footer text-center footer_form">
                                        <Button type="primary" htmlType="submit">
                                            <Icon type="save" /> Lưu
                                            </Button>
                                        <Button
                                            type="danger"
                                            data-dismiss="modal"
                                            style={{ marginLeft: "10px" }}
                                            onClick={(e) => { this.resetForm(); }}
                                        >Đóng
                                        </Button>
                                    </footer>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddCustomer;