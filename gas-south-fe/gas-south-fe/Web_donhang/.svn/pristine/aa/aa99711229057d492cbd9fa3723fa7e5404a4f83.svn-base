import React, { Component } from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import { Select } from "antd";
import Constant from "Constants";

import getInformationFromCylinders from '../../../../api/getInformationFromCylinders'
import returnShippingOrder from "../../../../api/returnShippingOrder"
var fileReader;
import getUserCookies from "getUserCookies";
class PopupEnterTurn extends Component {
    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: [],
            error: "",
            listShipping: [],
        };
    }

    async handleOnclick(event, idCustomer) {
        event.preventDefault();
        console.log("idCustomer123", idCustomer)
        var user_cookies = await getUserCookies();
        let userId = user_cookies.user.id
        let cylinders = this.state.listShipping.join()

        let data = await returnShippingOrder(userId, idCustomer, cylinders)
        console.log("hoiluubinh", data)

    }
    async handleFileUpload(event) {
        let that = this;
        let file = event.target.files[0];

        fileReader = new FileReader();
        fileReader.onload = async function (event) {
            // The file's text will be printed here
            let result = event.target.result;
            let array_id = result.split("\n");
            let cylinders_list = [];

            for (let i = 0; i < array_id.length; i++) {
                if (array_id[i].trim() !== '') {
                    array_id[i].replace('\r', '').replace('\n', '')
                    cylinders_list.push(array_id[i].trim());

                }
            }

            console.log("cylinders_list", cylinders_list)

            that.setState({
                listShipping: cylinders_list
            })
            console.log("listShipping", that.state.listShipping)


        };
        fileReader.readAsText(file);

    }

    render() {
        return (
            <div className="modal fade" id="enter-return-modal" tabIndex="-1" style={{ overflowY: "auto" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nhập hồi lưu</h5>
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
                            >
                                <h5
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        const modals = $("#enter-return-modal");
                                        modals.modal('hide');
                                    }}
                                    data-toggle="modal"
                                    data-target="#shipping-edit-modal"
                                >
                                    <i class="fa fa-angle-left"></i> Trở lại
                                </h5>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Hãy nhập tin từ đầu đọc</label>
                                            <div className="form-group d-flex">
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    name="upload_file"
                                                    accept='.txt'
                                                    onChange={(event) => this.handleFileUpload(event)}
                                                    ref={(input) => {
                                                        this.fileInput = input
                                                    }}
                                                    validations={[required]}
                                                />
                                                <input type="reset" value="Đặt lại" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <table
                                                    className="table table-hover text-center table-striped table-bordered seednet-table-keep-column-width"
                                                    cellSpacing="0"
                                                >
                                                    <thead className="table__head">
                                                        <tr>
                                                            <th scope="col">STT</th>
                                                            <th scope="col">Mã bình</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.listShipping.map((store, index) => {

                                                            return (<tr>
                                                                <td scope="row" className="text-center">{index + 1}</td>


                                                                <td scope="row" className="text-center">{store}</td>

                                                            </tr>)


                                                        })}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group text-center">
                                                <button className="btn btn-primary btn-xl"
                                                    onClick={(event) => this.handleOnclick(event, this.props.idCustomer)}
                                                >
                                                    Lưu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default (PopupEnterTurn);