import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddUserPopupContainer from "./AddUserPopupContainer";
import deleteUserAPI from "deleteUserAPI";

const USERTYPE_ENUM = [
  {
    key: "SuperAdmin",
    value: "Quản trị viên",
  },
  {
    key: "Government",
    value: "Chính phủ",
  },
  {
    key: "Factory",
    value: "Thương nhân sở hữu",
  },
  {
    key: "General",
    value: "Tổng đại lý",
  },
  {
    key: "Agency",
    value: "Hệ Thống Đại lý",
  },
  {
    key: "Station",
    value: "Trạm chiết nạp",
  },
  {
    key: "Normal",
    value: "Người dân",
  },
];
class User extends React.Component {
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

    const dataUsers = await getAllUserApi();
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
              <h4>Người dùng</h4>
              <div className="row">
                <button
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-primary"
                  data-toggle="modal"
                  data-target="#create-user"
                >
                  Tạo mới người dùng
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
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          {/*<th className="w-120px text-center align-middle">Mã</th>*/}
                          <th className="w-120px text-center align-middle">Email</th>
                          <th className="w-120px text-center align-middle">Tên</th>
                          <th className="w-240px text-center align-middle">Địa chỉ</th>
                          <th className="w-120px text-center align-middle">Loại</th>
                          <th className="w-120px text-center align-middle">Tình trạng</th>
                          <th className="w-100px text-center align-middle">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listUsers.map((store, index) => {
                          return (
                            <tr>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>

                              {/*<td scope="row" className="text-center">{store.id}</td>*/}
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
                                {USERTYPE_ENUM.find(
                                  (o) => o.key === store.userType
                                ) !== undefined
                                  ? USERTYPE_ENUM.find(
                                      (o) => o.key === store.userType
                                    ).value
                                  : ""}
                              </td>
                              <td scope="row" className="text-center">
                                {store.locked ? "Bị khóa" : "Bình thường"}
                              </td>

                              {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                              <td className="text-center table-actions">
                                <a
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#view-report"
                                  onClick={() => {
                                    this.deleteUser(store.id);
                                  }}
                                >
                                  <i className="ti-trash"></i>
                                </a>
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
        <AddUserPopupContainer refresh={this.refresh.bind(this)} />
      </div>
    );
  }
}

export default User;
