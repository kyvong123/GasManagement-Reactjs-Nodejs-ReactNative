import React from 'react';
import showToast from "showToast";
import Constants from "Constants";
import { Form, Input, Icon, Button, Checkbox, Select, Card } from "antd";
import getAllStation from "./../../../../api/getAllStation";
import createWareHouseAPI from "./../../../../api/createWareHouseAPI"
import "./index.scss";
import getUserCookies from 'getUserCookies'


const Option = Select.Option;
const initialState = {
};
class CreateInventory extends React.Component {

    constructor(props) {
        super(props);
        this.options = [];
        this.state = {
            options: [],
            object: {
                name: "",
                code: "",
                stationId: "Chọn chi nhánh",
                address: "",
                isSupplier: false,
                mininventory: "",
                namecontact: "",
                mobilecontact: "",
                emailcontact: "",
                note: ""
            },
            errors: {
                name: "",
                code: "",
                stationId: "",
                address: "",
                isSupplier: false,
                mininventory: "",
                namecontact: "",
                mobilecontact: "",
                emailcontact: "",
                note: ""
            },
            listRegion: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getAllStationAPI = this.getAllStationAPI.bind(this);
        this.onCheckCreate = this.onCheckCreate.bind(this);
        
    }

    async componentDidMount() {
        
    }

    async componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.listRegion){
            console.log("nextPropps",nextProps.listRegion)
            this.setState({
                listRegion: nextProps.listRegion
            })
        }
    }

    /* ==================================================== API =============================================*/

    async getAllStationAPI() {
        let options = [];
        var user_cookies = await getUserCookies();

        const listStation = await getAllStation(user_cookies.user.id);
        if (listStation) {
            if (listStation.data.success === true) {
                listStation.data.data.forEach(item => {
                    options = [...options, { label: item.name, value: item.id }]
                });
                this.setState({ options })
            } else {
                showToast(
                    listStation.data.message
                        ? listStation.data.message
                        : listStation.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            return false;
        }
    }

    async createWareHouseAPI(target, name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note) {
        const createWareHouse = await createWareHouseAPI(name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note);
        if (createWareHouse) {
            console.log(createWareHouse)
            if (createWareHouse.data.status === true) {
                showToast('Tạo mới thành công!', 3000);
                let modal = $("#create-inventory");
                modal.modal("hide");
                this.reset();
                target.reset();
                this.onCheckCreate(true);
            }
            else {
                this.onCheckCreate(false);
                if (createWareHouse.data.message === "Code đã tồn tại") {
                    showToast("Mã kho đã tồn tại!")
                } else {
                    showToast(
                        createWareHouse.data.message
                            ? createWareHouse.data.message
                            : createWareHouse.data.err_msg,
                        2000
                    );
                }
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình thêm dữ liệu!");
            this.onCheckCreate(false);
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

    onChangeChecked = (e) => {
        const { name, checked } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: checked }
        }));
    }

    OnChangeOption = (value) => {
        this.setState(prevState => ({
            object: { ...prevState.object, stationId: value }
        }));
    };

    validate = (name, value) => {
        if (name === "name") {
            if (!value) {
                return "Tên kho không được để trống!"
            }
        }
        if (name === "code") {
            if (!value) {
                return "Mã kho không được để trống!"
            }
        }
        if (name === "stationId") {
            if (!value || value === "Chọn chi nhánh") {
                return "Chi nhánh không được để trống!"
            }
        }
        // if (name === "mininventory") {
        //     if (!value) {
        //         return "Khối lượng không được để trống!"
        //     }
        // }
        // if (name === "address") {
        //     if (!value) {
        //         return "Địa chỉ không được để trống!"
        //     }
        // }
        if (name === "mobilecontact") {
            if(value && value.search(/^([0-9])*$/)){
                return "Số điện thoại không hợp lệ!"
            }else if ( value && value.length > 40 ) {
                return "Số điện thoại quá dài!";
            }else if ( value && value.length < 6) {
                return "Số điện thoại quá ngắn!";
            }
        }
        if (name === "emailcontact") {
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
            },
            () => { }
        );
    };


    handleBlurOption = (value) => {
        const name = "stationId"
        const error = this.validate(name, value);
        const state = this.state;
        this.setState(
            {
                errors: {
                    ...state.errors,
                    stationId: error,
                },
            },
            () => { }
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        let { name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note } = this.state.object;
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
        }
        else {
            this.createWareHouseAPI(e.target, name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note)
        }
    }

    onCheckCreate = (checked) => {
        this.props.onChecked(checked);
    }

    reset() {
        this.setState({
            errors: {},
            object: {
                name: "",
                code: "",
                stationId: "Chọn chi nhánh",
                address: "",
                isSupplier: false,
                mininventory: "",
                namecontact: "",
                mobilecontact: "",
                emailcontact: "",
                note: ""
            }
        });
    }

    /* ==================================================== /Another Function =============================================*/


    render() {
        let { name, code, address, stationId, mininventory, namecontact, mobilecontact, emailcontact, isSupplier, note } = this.state.object
        return (
            <div className="modal fade" id="create-inventory" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon className="icon_star" theme="filled" />Tạo mới kho</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="modal-body" id="form_body">
                                {/* <div className="container"> */}
                                <div className="site-card-border-less-wrapper">
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <Card title="Thông tin kho" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                                <div className="form-group row">
                                                    <label htmlFor="input_name" className="col-sm-4 col-form-label">Tên kho <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            className="form-control"
                                                            placeholder="Nhập vào tên kho"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={name}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.name ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.name}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_code" className="col-sm-4 col-form-label">Mã kho <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="text"
                                                            name="code"
                                                            className="form-control"
                                                            placeholder="Nhập vào mã kho"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={code}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.code ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.code}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_station" className="col-sm-4 col-form-label">Thuộc <label style={{ color: 'red' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Select
                                                            id="input_station"
                                                            placeholder="Chọn chi nhánh"
                                                            onChange={this.OnChangeOption}
                                                            onBlur={this.handleBlurOption}
                                                            value={stationId}
                                                            style={{color:"black"}}
                                                        // defaultValue={this.state.object.stationId}
                                                        >
                                                            <Option value="empty" disabled>Chọn chi nhánh</Option>
                                                            {this.state.listRegion.map((option) => (
                                                                <Option key={option.value} value={option.value}>{option.label}</Option>
                                                            ))}
                                                        </Select>
                                                        {this.state.errors.stationId ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.stationId}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_mininventory" className="col-sm-4 col-form-label">Khối lượng chứa của kho (tấn)</label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="number"
                                                            name="mininventory"
                                                            className="form-control"
                                                            id="input_mininventory"
                                                            placeholder="Nhập vào Khối lượng chứa của kho (tấn)"
                                                            // onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={mininventory}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.mininventory ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.mininventory}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_address" className="col-sm-4 col-form-label">Địa chỉ</label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="text"
                                                            name="address"
                                                            className="form-control"
                                                            placeholder="Nhập vào địa chỉ"
                                                            // onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={address}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.address ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.address}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="check_isSupplier" className="col-sm-4 col-form-label" style={{ paddingRight: '0px' }}>Kho nhà cung cấp</label>
                                                    <div className="col-sm-8">
                                                        <Checkbox
                                                            name="isSupplier"
                                                            className="form-check-input"
                                                            onChange={this.onChangeChecked}
                                                            checked={this.state.object.isSupplier}
                                                            style={{ paddingTop: '6px', color:"black"}}
                                                        ></Checkbox>
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                        <div className="col-md-6 ">
                                            <Card title="Thông tin liên hệ" bordered={false} headStyle={{ fontWeight: 'bold' }}>
                                                <div className="form-group row">
                                                    <label htmlFor="input_namecontact" className="col-sm-4 col-form-label">Tên <label style={{ visibility: 'hidden' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="text"
                                                            name="namecontact"
                                                            className="form-control"
                                                            placeholder="Nhập vào tên"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={namecontact}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.namecontact ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.namecontact}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_mobilecontact" className="col-sm-4 col-form-label">Điện thoại <label style={{ visibility: 'hidden' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="text"
                                                            name="mobilecontact"
                                                            className="form-control"
                                                            placeholder="Nhập vào số điện thoại"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={mobilecontact}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.mobilecontact ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.mobilecontact}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_emailcontact" className="col-sm-4 col-form-label">Email <label style={{ visibility: 'hidden' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Input
                                                            type="text"
                                                            name="emailcontact"
                                                            className="form-control"
                                                            placeholder="Nhập vào email"
                                                            onBlur={this.handleBlur}
                                                            onChange={this.onChange}
                                                            value={emailcontact}
                                                            style={{color:"black"}}
                                                        ></Input>
                                                        {this.state.errors.emailcontact ?
                                                            (
                                                                <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                    <span>{this.state.errors.emailcontact}</span>
                                                                </div>
                                                            ) : ("")}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="input_note" className="col-sm-4 col-form-label">Ghi chú <label style={{ visibility: 'hidden' }}>*</label></label>
                                                    <div className="col-sm-8">
                                                        <Input.TextArea
                                                            name="note"
                                                            placeholder="Nhập vào ghi chú"
                                                            rows={7}
                                                            onChange={this.onChange}
                                                            value={note}
                                                            style={{color:"black"}}
                                                        />
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
                                            onClick={(e) => { this.reset(); }}>Đóng
                                        </Button>
                                    </footer>
                                </div>
                            </div>
                        </form>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateInventory;
