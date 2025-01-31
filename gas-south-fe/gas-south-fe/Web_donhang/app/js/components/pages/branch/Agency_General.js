import React from 'react';
import getUserCookies from "getUserCookies";
import { Table, Button, Row, Col, Modal, Input, Tooltip, Switch, Tabs } from 'antd';
import required from 'required';
import showToast from 'showToast';
import { data } from 'jquery';
import { isUndefined } from 'lodash';

const { TabPane } = Tabs;
const { TextArea } = Input;
class Agency_General extends React.Component {

    constructor(props) {
        super(props);
        this.state = {


        }
    }
    async componentDidMount() {

    }
    async componentWillReceiveProps(nextProps) {

    }

    handleCancel = async () => {

    }
    render() {
        console.log("this.props.agency", this.props.listAgency)
        return (
            <div className="main-content">
                <div className="modal fade" id="agency_general" tabIndex="-1" >
                    <div className="modal-dialog modal-lg" >
                        <div className="modal-content" >
                            <div className="modal-header">
                                <h4>Danh sách chi tiết</h4>
                                <button type="button" className="close" data-dismiss="modal"
                                    onClick={this.reloadPopup}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Tabs defaultActiveKey="1" >
                                    <TabPane tab="Tổng đại lý" key="1">
                                        <div className="table-responsive-xl">
                                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <table
                                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                                            cellSpacing="0"
                                                        >
                                                            <thead className="table__head">
                                                                <tr>
                                                                    <th className="text-center w-70px align-middle">#STT</th>
                                                                    {/*<th className="w-120px text-center">Mã </th>*/}
                                                                    <th className="w-120px text-center align-middle">Email </th>
                                                                    <th className="w-120px text-center align-middle">
                                                                        Tên Tổng Đại Lý
                                                                    </th>
                                                                    <th className="w-100px text-center align-middle">Địa Chỉ</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.props.listGeneral?this.props.listGeneral.map((v, i) => {
                                                                    console.log("vvvvvv", v)
                                                                    return (
                                                                        <tr key={v.id}>
                                                                            <td className="text-center w-70px align-middle">{i + 1}</td>
                                                                            <td className="w-120px text-center align-middle">{v.email} </td>
                                                                            <td className="w-120px text-center align-middle">{v.name}</td>
                                                                            <td className="w-100px text-center align-middle">{v.address}</td>
                                                                        </tr>
                                                                    )

                                                                }):""}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Đại lý" key="2">
                                        <div className="table-responsive-xl">
                                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <table
                                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                                            cellSpacing="0"
                                                        >
                                                            <thead className="table__head">
                                                                <tr>
                                                                    <th className="text-center w-70px align-middle">#STT</th>

                                                                    <th className="w-120px text-center align-middle">Email </th>
                                                                    <th className="w-120px text-center align-middle">
                                                                        Tên Đại lý
                                                                    </th>
                                                                    <th className="w-100px text-center align-middle">Địa Chỉ</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.props.listAgency?this.props.listAgency.map((v, i) => {
                                                                    console.log("vvvvvv", v)
                                                                    return (
                                                                        <tr key={v.id}>
                                                                            <td className="text-center w-70px align-middle">{i + 1}</td>
                                                                            <td className="w-120px text-center align-middle">{v.email} </td>
                                                                            <td className="w-120px text-center align-middle">{v.name}</td>
                                                                            <td className="w-100px text-center align-middle">{v.address}</td>
                                                                        </tr>
                                                                    )

                                                                }):""}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Khách hàng công nghiệp bình" key="3">
                                        <div className="table-responsive-xl">
                                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <table
                                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                                            cellSpacing="0"
                                                        >
                                                            <thead className="table__head">
                                                                <tr>
                                                                    <th className="text-center w-70px align-middle">#STT</th>
                                                                    {/*<th className="w-120px text-center">Mã </th>*/}
                                                                    <th className="w-120px text-center align-middle">Email </th>
                                                                    <th className="w-120px text-center align-middle">
                                                                        Tên Khách Hàng Công Nghiệp Bình
                                                                    </th>
                                                                    <th className="w-100px text-center align-middle">Địa Chỉ</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.props.IndustrialCustomers?this.props.IndustrialCustomers.map((v, i) => {
                                                                    return (
                                                                        <tr key={v.id}>
                                                                            <td className="text-center w-70px align-middle">{i + 1}</td>
                                                                            <td className="w-120px text-center align-middle">{v.email} </td>
                                                                            <td className="w-120px text-center align-middle">{v.name}</td>
                                                                            <td className="w-100px text-center align-middle">{v.address}</td>
                                                                        </tr>
                                                                    )

                                                                }):""}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default (Agency_General);        