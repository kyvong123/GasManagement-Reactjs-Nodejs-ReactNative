import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getListCustomerByType from "getListCustomerByType";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import deleteUserAPI from "deleteUserAPI";
import getUserCookies from "getUserCookies";

class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      user_type: "",
      userEdit: {},
      isCreateMode: true,
      isCreateThanhtra: true,
    };
  }
  refresh() {
    this.forceUpdate(async () => {
      await this.getAllUser();
      //this.setState({userEdit:{}});
    });
  }
  async deleteUser(id) {
    var answer = window.confirm("Bạn có chắc chắn muốn xóa");
    if (answer) {
      const user = await deleteUserAPI(id);

      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast("Xóa Thành Công!", 3000);
          this.refresh();
          return true;
        } else {
          showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
        return false;
      }
    }
  }
  async editUser(userEdit) {
    await this.setState({ userEdit });
    await this.setState({
      isCreateMode: false,
    });
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();

    this.setState({ user_type: user_cookies.user.userType });
    this.getAllUser();
  }
  async getAllUser() {
    //const jobMetaData = await this.getJobMetaData();
    let user_cookies = await getUserCookies();
    const dataUsers = await getListCustomerByType(user_cookies.user.id, "Distribution");
    if (dataUsers) {
      if (dataUsers.data.success === true) {
        this.setState({ listUsers: dataUsers.data.data });
      } else {
        showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
      }
      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  newTable = async () => {
    await this.setState({
      userEdit: null,
    });
    await this.setState({
      isCreateMode: true,
    });
  };
  render() {
    console.log("list", this.state.listUsers);
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Hệ Thống Phân Phối</h4>
              <div className="row">
                <button
                  onClick={
                    // this.setState({ userEdit: {}, isCreateMode: true })
                    this.newTable
                  }
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-user"
                >
                  Tạo Hệ Thống Phân Phối
                </button>
                {/*   <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#create-location-store">Tạo mới
                                </button>*/}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <table className="table table-striped table-bordered seednet-table-keep-column-width" cellSpacing="0">
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          {/*<th className="w-120px text-center">Mã </th>*/}
                          <th className="w-120px text-center align-middle">Email </th>
                          <th className="w-120px text-center align-middle">Tên Hệ Thống Phân Phối</th>
                          <th className="w-100px text-center align-middle">Địa Chỉ</th>
                          <th className="w-100px text-center align-middle">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listUsers.length !==0 ?this.state.listUsers.map((store, index) => {
                          return (
                            <tr key={index}>
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
                              <td className="text-center table-actions">
                                {this.state.user_type === "SuperAdmin" && (
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
                                )}
                                <a
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#create-user"
                                  onClick={() => {
                                    this.editUser(store);
                                  }}
                                >
                                  <i className="ti-pencil"></i>
                                </a>
                              </td>

                              {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                              {/*     <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
                            </tr>
                          );
                        }):""}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddUserPopupContainer isCreateMode={this.state.isCreateMode} isEditForm={this.state.userEdit} isGeneralPage={true} refresh={this.refresh.bind(this)} />
      </div>
    );
  }
}

export default General;
