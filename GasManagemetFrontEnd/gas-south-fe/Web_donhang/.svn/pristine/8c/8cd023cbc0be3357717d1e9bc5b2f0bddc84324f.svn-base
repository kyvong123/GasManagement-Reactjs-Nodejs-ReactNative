import React, { Fragment } from "react";
import showToast from "showToast";
import moment from "moment";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { Table, Icon, Button, Input, Form } from "antd";
import {
    ADDCYLINDERCANCEL,
} from "../../../config/config";

class CancelCylinder extends React.Component {
    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            listRequest: [],
            tempListRequest: [],
            listCylinderCancel: [],
            txtidCancel: "",
            txtuserId: "",
            count: 0,
            task: "",
            serial: "",
            tasks: [],
        };

        this.handleClickIndex = this.handleClickIndex.bind(this);
    }

    handleClick = (event) => {
        event.preventDefault();
        this.onChangeSerial();
        if (!this.state.task) return;
        if (this.state.task.length > 100) {
            showToast("Vui lòng nhập số serial từ 1 đến 100 số");
        } else {
            const tasks = this.state.tasks || [];
            tasks.push(this.state.task);
            this.setState({ tasks: tasks, task: "" });
        }
    };
    handleClickIndex(index, event) {
        eval(this[event.target.name]).bind(this)(index, event);
    }
    handleChange = (e) => {
        this.setState({ task: e.target.value });
    };
    onChangeSerial = (e) => {
        // console.log('madonhang', e.target.value)
        let date = new Date();
        let formattedDate = moment(date).format("DDMMYYYY");
        let dateString = formattedDate.toString().slice(0, 6);
        let dateNowString = Date.now()
            .toString()
            .slice(7, 13);
        let serial = (dateString + dateNowString).toString();
        this.setState({ serial: serial });
    };
    handleSubmit = async (event) => {
        event.preventDefault();
        const user_cookies = await getUserCookies();
        let params = {
            idCancel: Date.now(),
            cylinders: this.state.tasks,
            userId: user_cookies.user.id,
        };
        let token = "Bearer " + user_cookies.token;
        await callApi("POST", ADDCYLINDERCANCEL, params, token).then((res) => {
            if (res.data.status == false) {
                showToast("Quá trình thanh lý bình gas thất bại");
            } else {
                const modal = $("#cancel-cylinder");
                modal.modal('hide');
                this.setState({
                    tasks: []
                })
                showToast("Quá trình thanh lý bình gas thành công");
            }
        });
    };
    task(event) {
        this.setState({ task: event.target.value });
    }

    removeTask(index, event) {
        const tasks = this.state.tasks;
        tasks.splice(index, 1);
        this.setState({ tasks });
    }

    //cmt
    render() {
        const tasks = (this.state.tasks || []).map((task, index) => (
            <tr style={{ textAlign: "center" }}>
                <td>{index + 1}</td>
                <td>{task}</td>
                <td>
                    <button
                        className="btn btn-danger"
                        data-toggle="modal"
                        data-target={"#modelDelete" + index}
                        data-dismiss="modal"
                    >
                        Xóa
                    </button>
                </td>
            </tr>
        ));
        return (
            <div>
                {(this.state.tasks || []).map((task, index) => (
                    <div
                        className="modal fade"
                        tabIndex={-1}
                        role="dialog"
                        aria-labelledby="modelTitleId"
                        aria-hidden="true"
                        id={"modelDelete" + index}
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xoá bình thanh lí theo serial</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    Bạn có muốn xoá bình thanh lí có số serial : {task}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-dismiss="modal"
                                    >
                                        Huỷ
                                    </button>
                                    <button
                                        type="button"
                                        name="removeTask"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        onClick={(event) => this.handleClickIndex(index, event)}
                                        data-toggle="modal"
                                        data-target="#cancel-cylinder"
                                    >
                                        Xoá
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="modal fade" id="cancel-cylinder" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tạo thanh lý bình</h5>
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="row">
                                                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                                    Số biên bản
                                                </div>
                                                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <input
                                                        type="number"
                                                        value={this.state.serial}
                                                        class="form-control"
                                                        disabled
                                                        placeholder="Nhập số biên bản"
                                                    />
                                                </div>
                                                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                                    Số serial
                                                </div>
                                                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <input
                                                        type="text"
                                                        value={this.state.task}
                                                        class="form-control"
                                                        onChange={this.handleChange}
                                                        placeholder="Nhập số serial"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                className="btn btn-xl btn-create float-right mt-3"
                                                style={{ float: "right" }}
                                                onClick={this.handleSubmit}
                                                type="submit"
                                            >
                                                Thanh lý
                                            </button>
                                            <button
                                                className="btn btn-xl btn-create float-right mt-3 mr-1"
                                                style={{ float: "right" }}
                                                onClick={this.handleClick}
                                            >
                                                Lưu
                                            </button>
                                            <table
                                                className="table table-striped table-bordered seednet-table-keep-column-width"
                                                cellSpacing="0"
                                            >
                                                <thead className="table__head">
                                                    <tr>
                                                        <th className="text-center w-70px align-middle">
                                                            #STT
                                                    </th>
                                                        <th className="text-center w-70px align-middle">
                                                            Số Serial
                                                    </th>
                                                        <th className="text-center w-70px align-middle">
                                                            Chức năng
                                                    </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tasks}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CancelCylinder;
