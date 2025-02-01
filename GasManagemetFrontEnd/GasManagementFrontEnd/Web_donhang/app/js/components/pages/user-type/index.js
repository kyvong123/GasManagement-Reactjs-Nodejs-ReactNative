import React from "react";
import { Popconfirm, Table, Space, Icon, Button, message, Modal } from "antd";
import "./index.scss";
import Constants from "Constants";
import AddUserTypePopup from "./add-user-type";
import EditUserTypePopup from "./edit-user-type";
import getAllUserTypeAPI from "./../../../../api/getAllUserTypeAPI";
import deleteUserType from "./../../../../api/deleteUserTypeAPI";
import showToast from "showToast";

class UserType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      listUserType: [],
      dataFromParent: {},
      userTypeEdit: {
        name: "",
        orderNo: "",
        note: "",
      },
      isLoading: false,
    };
    this.getDataRow = this.getDataRow.bind(this);
    this.getAllUserType = this.getAllUserType.bind(this);
    this.deleteMultiUser = this.deleteMultiUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentWillMount() {
    this.getAllUserType();
  }

  componentDidMount() {}

  async getDataRow(data) {
    await this.setState({
      dataFromParent: data,
    });
  }

  async getAllUserType() {
    this.setState({ isLoading: true });
    const listusertype = await getAllUserTypeAPI();
    if (listusertype) {
      if (listusertype.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({
          listUserType: listusertype.data.userType,
          isLoading: false,
        });
      } else {
        showToast(
          listusertype.data.message
            ? listusertype.data.message
            : listusertype.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
  }

  async deleteUser(value) {
    const userType = await deleteUserType(value.id);
    if (userType) {
      if (userType.data.success === true) {
        showToast("Xóa Thành Công!", 3000);
        this.getAllUserType();
        return true;
      } else {
        showToast(
          userType.data.message ? userType.data.message : userType.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình xóa dữ liệu!");
      return false;
    }
  }

  async deleteMultiUser() {
    let selectedUser = this.state.selectedRows;
    if (selectedUser.length > 0) {
      // const userType = await deleteUserType(value.id);
      // if (userType) {
      //   if (userType.data.success === true) {
      // showToast('Xóa Thành Công!', 3000);
      //     window.location.reload();
      //     return true;
      //   }
      //   else {
      // showToast(userType.data.message
      //       ? userType.data.message
      //       : userType.data.err_msg, 2000);
      //     return false;
      //   }
      // }
      // else {
      // showToast("Xảy ra lỗi trong quá trình xóa dữ liệu");
      //   return false;
      // }
    } else {
      showToast("Không có dữ liệu nào được chọn!");
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowsKeys changed: ", selectedRowKeys, selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onCheckCreate = (checked) => {
    if (checked) {
      this.getAllUserType();
    }
  };

  onCheckUpdate = (checked) => {
    if (checked) {
      this.getAllUserType();
    }
  };

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: "STT",
        align: "center",
        dataIndex: "orderNo",
        width: 50,
        sorter: (a, b) => a.orderNo - b.orderNo,
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Loại người dùng",
        dataIndex: "name",
        align: "center",
        width: 200,
        render: (text, record) => (
          <a
            className="edit-user-link"
            data-toggle="modal"
            data-target="#edit-user-type"
            onClick={this.getDataRow.bind(null, record)}
          >
            {text}
          </a>
        ),
      },
      {
        title: "Ghi chú",
        align: "center",
        dataIndex: "note",
        width: 200,
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Thao tác",
        align: "center",
        key: "thaotac",
        width: 100,
        render: (text, record) => (
          <Popconfirm
            title={'Xác nhận xóa "' + record.name + '" ?'}
            onConfirm={this.deleteUser.bind(null, record)}
            okText="Xóa"
            cancelText="Hủy"
            placement="leftBottom"
          >
            <a className="delete_link">
              <i className="fa fa-trash delete_icon"></i>
            </a>
          </Popconfirm>
        ),
      },
    ];
    return (
      <div className="main-content" id="userType">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>
                Danh sách loại người dùng
                <a style={{ visibility: "hidden" }}>
                  <Icon type="left" />
                </a>
              </h4>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <Table
                      rowKey={(record) => record.name}
                      size="s-small"
                      loading={this.state.isLoading}
                      // rowSelection={rowSelection}
                      columns={columns}
                      dataSource={this.state.listUserType}
                      bordered
                      pagination={{
                        defaultPageSize: 10,
                        hideOnSinglePage: true,
                      }}
                      /*scroll={{ x: 1000 }}*/
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <button
                className="btn btn-success"
                data-toggle="modal"
                data-target="#add-user-type"
              >
                <i className="fa fa-plus"></i>
                <span style={{ paddingLeft: "5px" }}>Tạo mới</span>
              </button>
              {/* <button
                className="btn btn-danger delete_btn"
                onClick={this.deleteMultiUser}
              >
                <i className="fa fa-trash"></i>
                <span style={{ paddingLeft: "5px" }}>Xóa</span>
              </button> */}
            </div>
          </div>
        </div>
        <AddUserTypePopup
          userTypeEdit={this.state.userTypeEdit}
          listUserType={this.state.listUserType}
          onChecked={this.onCheckCreate}
        ></AddUserTypePopup>
        <EditUserTypePopup
          dataFromParent={this.state.dataFromParent}
          onChecked={this.onCheckUpdate}
        ></EditUserTypePopup>
      </div>
    );
  }
}

export default UserType;
