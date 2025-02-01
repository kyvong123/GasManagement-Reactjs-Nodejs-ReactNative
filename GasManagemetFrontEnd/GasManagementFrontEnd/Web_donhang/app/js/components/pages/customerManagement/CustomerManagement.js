import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import deleteUserAPI from "deleteUserAPI";
import getUserCookies from "getUserCookies";
import getAllListCustomer from "../../../../api/getAllListCustomer";
import ReactCustomLoading from "ReactCustomLoading";
import deleteUserByIdAPI from "../../../../api/deleteUserByIdAPI";
class CustomerManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      userRole: [],
      user_type: "",
      userEdit: {},
      userView: {},
      isCreateMode: true,
      isCreateThanhtra: true,
      isLoading: false
    };
  }
  refresh() {
    this.forceUpdate(async () => {
      await this.componentDidMount();
      // this.setState({ userEdit: {} });
    });
  }
  async deleteUser(id) {
    var answer = window.confirm("Bạn có chắc chắn muốn xóa");
    if (answer) {
      this.setState({ isLoading: true })
      const user = await deleteUserByIdAPI(id);
      this.setState({ isLoading: false })
      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast("Xóa Thành Công!", 3000);
          window.location.reload();
          // this.refresh();
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
    await this.setState({ userView: null });
    await this.setState({
      isCreateMode: false
    });
  }
  async viewUser(userView) {
    await this.setState({ userView });
    await this.setState({ userEdit: null });
    await this.setState({
      isCreateMode: false
    });
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();

    this.setState({ user_type: user_cookies.user.userType, userRole: user_cookies.user.personRole });
    this.getAllUser();
  }
  async getAllUser() {
    //const jobMetaData = await this.getJobMetaData();
    // let user_cookies = await getUserCookies();
    const dataUsers = await getAllListCustomer();
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
      userView: null,
    });
    await this.setState({
      isCreateMode: true,
    });
  };
  render() {
    return (
      <div className="main-content">
        <ReactCustomLoading isLoading={this.state.isLoading} />
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Khách Hàng</h4>
              <div className="row">
                <button
                  onClick={
                    // this.setState({ userEdit: {}, isCreateMode: true })
                    this.newTable
                  }
                  style={this.state.userRole.includes('create') ? { marginLeft: "20px" } : { pointerEvents: 'none', opacity: 0.6, marginLeft: "20px", backgroundColor: '#ccc' }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-user"
                >
                  Tạo Khách Hàng
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
                      <thead className="table__head_cus">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          {/*<th className="w-120px text-center">Mã </th>*/}
                          <th className="w-120px text-center align-middle">Tài khoản </th>
                          <th className="w-120px text-center align-middle">Tên khách hàng</th>
                          <th className="w-120px text-center align-middle">Loại khách hàng</th>
                          <th className="w-120px text-center align-middle">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listUsers.length !== 0 ? this.state.listUsers.map((store, index) => {
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
                                {store.userRole === 'SuperAdmin' && store.userType === 'Agency' ?
                                  'Đại lý' : store.userRole === 'SuperAdmin' && store.userType === 'General' && store.customerType === 'Industry' ?
                                    'Khách hàng Công nghiệp' : 'Tổng đại lý'}
                              </td>
                              <td className="text-center table-actions">

                                <a
                                  className="table-action hover-primary mx-2"
                                  data-toggle="modal"
                                  data-target="#create-user"
                                  onClick={() => {
                                    this.viewUser(store);
                                  }}
                                >
                                  <i className="ti-eye view-icon"></i>
                                </a>
                                <a
                                  style={this.state.userRole.includes('edit') ? {} : { pointerEvents: 'none', opacity: 0.4 }}
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#create-user"
                                  onClick={() => {
                                    this.editUser(store);
                                  }}
                                >
                                  <i className="ti-pencil"></i>
                                </a>
                                <a
                                  style={this.state.userRole.includes('remove') ? {} : { pointerEvents: 'none', opacity: 0.4 }}
                                  className="table-action hover-primary mx-2"
                                  data-toggle="modal"
                                  data-target="#view-report"
                                  onClick={() => {
                                    this.deleteUser(store.id);
                                  }}
                                >
                                  <i className="ti-trash"></i>
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
                        }) : ""}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddUserPopupContainer isCreateMode={this.state.isCreateMode} isViewForm={this.state.userView} isEditForm={this.state.userEdit} isCustomerManagement={true} refresh={this.refresh.bind(this)} />
      </div>
    );
  }
}

export default CustomerManagement;
