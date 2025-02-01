import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddStaffPopupContainer from "./AddStaffPopupContainer";
import deleteUserAPI from "deleteUserAPI";
import { Popconfirm } from "antd";
const USERROLE_ENUM = [
    {
        key: "Owner",
        value: "Chủ cửa hàng",
    },
    {
        key: "Staff",
        value: "Nhân viên",
    },
    {
        key: "Deliver",
        value: "Giao hàng",
    },
];
class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
        };
    }
    componentDidMount() {
        this.getAllUser();
    }
    refresh() {
        this.forceUpdate(() => {
            this.getAllUser();
        });
    }
    async deleteUser(id) {
        const user = await deleteUserAPI(id);

        //console.log('register',user);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                showToast("Xóa Thành Công!", 3000);
                this.refresh();
                return true;
            } else {
                showToast(
                    user.data.message ? user.data.message : user.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
            return false;
        }
    }

    async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi(Constants.AGENCY);

        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listUsers: dataUsers.data });
            } else {
                showToast(
                    dataUsers.data.message
                        ? dataUsers.data.message
                        : dataUsers.data.err_msg,
                    2000
                );
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    render() {
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>Nhân Viên</h4>
                            <div className="row">
                                <button
                                    style={{ marginLeft: "20px" }}
                                    className="btn btn-sm btn-primary"
                                    data-toggle="modal"
                                    data-target="#create-staff"
                                >
                                    Tạo mới nhân viên
                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive-xl">
                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <table
                                            className="table table-striped table-bordered"
                                            cellSpacing="0"
                                        >
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-70px align-middle">#STT</th>
                                                    <th className="w-200px text-center align-middle">Email</th>
                                                    <th className="w-150px text-center align-middle">Tên</th>
                                                    <th className="w-200px text-center align-middle">Địa chỉ</th>
                                                    <th className="w-120px text-center align-middle">Loại</th>
                                                    <th className="w-50px text-center align-middle">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listUsers.map((store, index) => {
                                                    return (
                                                        <tr>
                                                            <td scope="row" className="text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.email}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.name}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.address}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {USERROLE_ENUM.find(
                                                                    (o) => o.key === store.userRole
                                                                ) !== undefined
                                                                    ? USERROLE_ENUM.find(
                                                                        (o) => o.key === store.userRole
                                                                    ).value
                                                                    : ""}
                                                            </td>

                                                            {/*<td>{this.props.itemStore.name}</td>
                                                        <td>{this.props.itemStore.address}</td>
                                                        <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                        <td>{this.props.itemStore.job_title_names.map((title) => {
                                                        return title + " ";
                                                        })}</td>*/}
                                                            <td className="text-center table-actions">
                                                                <Popconfirm
                                                                    title={"Xác nhận xóa nhân viên ?"}
                                                                    onConfirm={() => {
                                                                        this.deleteUser(store.id);
                                                                    }}
                                                                    okText="Xóa"
                                                                    cancelText="Hủy"
                                                                >
                                                                    <a
                                                                        className="table-action hover-primary"
                                                                        data-toggle="modal"
                                                                        data-target="#view-report"
                                                                    >
                                                                        <i className="ti-trash"></i>
                                                                    </a>
                                                                </Popconfirm>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddStaffPopupContainer refresh={this.refresh.bind(this)} />
            </div>
        );
    }
}

export default Staff;
