import React, { Component } from "react";
import Constants from "Constants";
import showToast from "showToast";
import { Form, Input, Icon, Button, Checkbox, Select, DatePicker } from "antd";
import UpdateWareHousePlanAPI from "./../../../../api/updateWareHousePlanAPI";
import "./index.scss";
import getUserCookies from "getUserCookies";
import moment from "moment";
const Option = Select.Option;

const initialState = {
    month: "",
    year: "",
    quantity: "",
    note: "",
};

const initialState01 = {};

class UpdatePlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                warehouseId: "",
                month: "",
                year: "",
                quantity: "",
                note: "",
            },
            errors: {
                warehouseId: "",
                month: "",
                year: "",
                quantity: "",
                note: "",
            }
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onCheckUpdatePlan = this.onCheckUpdatePlan.bind(this);
        this.updateWareHousePlanAPI = this.updateWareHousePlanAPI.bind(this);
        this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.dataFromPlan) {
            this.setState({
                object: {
                    id: nextProps.dataFromPlan.id ? nextProps.dataFromPlan.id : "",
                    warehouseId: nextProps.dataFromPlan.warehouseId ? nextProps.dataFromPlan.warehouseId : "",
                    month: nextProps.dataFromPlan.month ? nextProps.dataFromPlan.month : "",
                    year: nextProps.dataFromPlan.year ? nextProps.dataFromPlan.year : "",
                    quantity: nextProps.dataFromPlan.quantity ? nextProps.dataFromPlan.quantity : "",
                    note: nextProps.dataFromPlan.note ? nextProps.dataFromPlan.note : "",
                }
            })
        }
    }


    /* ==================================================== API =============================================*/


    async updateWareHousePlanAPI(id, warehouseId, month, year, quantity, note) {
        const updateWareHouse = await UpdateWareHousePlanAPI(id, warehouseId, month, year, quantity, note);
        if (updateWareHouse) {
            if (updateWareHouse.data.status === true) {
                showToast("Cập nhật thành công!");
                this.onCheckUpdatePlan(true);
                let modal = $("#update-plan");
                modal.modal("hide");
            }
            else {
                this.onCheckUpdatePlan(false);
                showToast(
                    updateWareHouse.data.message
                        ? updateWareHouse.data.message
                        : updateWareHouse.data.err_msg,
                    2000
                );
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình cập nhật dữ liệu!");
            this.onCheckUpdatePlan(false);
        }
    }

    /* ==================================================== /API =============================================*/



    /* ==================================================== Another Function =============================================*/
    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            object: { ...prevState.object, [name]: value }
        }));
    };

    onChangeDatePicker(date, dateString) {
        const month_year = dateString.split("-");
        this.setState(prevState => ({
            object: { ...prevState.object, month: month_year[0], year: month_year[1] }
        }));
    }

    validate = (name, value) => {
        if (name === "quantity") {
            if (!value) {
                return "Khối lượng không được để trống!"
            }
        }
        if (name === "month") {
            if (!value) {
                return "Tháng - năm không được để trống!"
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

    handleBlurPicker = (e) => {
        let value = this.state.object.month;
        const error = this.validate(name = "month", value);
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

    handleSubmit = e => {
        e.preventDefault();
        let { id, warehouseId, month, year, quantity, note } = this.state.object;
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
            this.updateWareHousePlanAPI(id, warehouseId, month, year, quantity, note)
        }
    }

    onCheckUpdatePlan = (checked) => {
        this.props.onChecked(checked);
    }

    reset() {
        this.setState({ errors: initialState01, object: initialState });
    }



    /* ==================================================== /Another Function =============================================*/


    render() {
        let { id, warehouseId, month, year, quantity, note } = this.state.object;
        const monthFormat = "MM-YYYY";
        let month_data = month ? month.concat("-", year) : "";
        return (
            <div className="modal fade" id="update-plan" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><Icon type="" className="icon_star" theme="filled" />Cập nhật kế hoạch nhập hàng</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <form
                                    onSubmit={this.handleSubmit}>
                                    <div className="form-group row">
                                        <div className="col-md-5">
                                            <div className="form-group row">
                                                <label htmlFor="input_month" className="col-sm-4 col-form-label">Tháng - năm<label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-8">
                                                    <DatePicker.MonthPicker
                                                        allowClear={true}
                                                        onChange={this.onChangeDatePicker}
                                                        placeholder="Chọn tháng - năm"
                                                        format={monthFormat}
                                                        value={month_data !== "" ? moment(month_data, monthFormat) : null}
                                                        onBlur={this.handleBlurPicker}
                                                        style={{width:'100%', color: "black"}}
                                                        disabled
                                                    />
                                                    {this.state.errors.month ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.month}</span>
                                                            </div>
                                                        ) : ("")}
                                                    {/* <Select defaultValue="Chọn Tháng">
                                                        <Option value="disabled" disabled>Chọn tháng</Option>
                                                        {this.state.monthArr.map((value,i) => (
                                                        <Option key={i} value={i}>{value.value}</Option>
                                                        ))}
                                                    </Select> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group row">
                                                <label htmlFor="input_quantity" className="col-sm-4 col-form-label">Khối lượng (tấn)<label style={{ color: 'red' }}>*</label></label>
                                                <div className="col-sm-8">
                                                    <Input
                                                        type="number"
                                                        name="quantity"
                                                        className="form-control"
                                                        placeholder="Nhập vào khối lượng (tấn)"
                                                        onBlur={this.handleBlur}
                                                        onChange={this.onChange}
                                                        value={quantity}
                                                        style={{color:"black"}}
                                                    ></Input>
                                                    {this.state.errors.quantity ?
                                                        (
                                                            <div className="alert alert-danger alert alert-danger--custom ant-form-explain">
                                                                <span>{this.state.errors.quantity}</span>
                                                            </div>
                                                        ) : ("")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">

                                        <label htmlFor="input_note" className="col-sm-2 col-form-label">Ghi chú</label>
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <Input.TextArea
                                                    name="note"
                                                    placeholder="Nhập vào ghi chú"
                                                    rows={2}
                                                    onChange={this.onChange}
                                                    value={note}
                                                    style={{color:"black"}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <footer className="card-footer text-center footer_form">
                                            <Button type="primary" htmlType="submit">
                                                <Icon type="save" /> Lưu
                                            </Button>
                                            <Button
                                                type="danger"
                                                data-dismiss="modal"
                                                style={{ marginLeft: "10px" }}
                                                onClick={(e) => { this.reset(); }}
                                            >Đóng
                                            </Button>
                                        </footer>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default UpdatePlan;
