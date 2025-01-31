import React, { Component } from "react";
import { Table, Button, Input, InputNumber, Popconfirm, Form, Icon,Select } from "antd";
import AddMenu from "./addMenu";
import UpdateMenu from "./updateMenu";
import callApi from "./../../../util/apiCaller";
import { DELETE_SYSTEM_MENU } from "./../../../config/config";
import { UPDATE_SYSTEM_MENU } from "./../../../config/config";
import getUserCookies from "getUserCookies";
import showToast from "showToast";
import getAllMenuSystem from "./../../../../api/getAllMenuSystem";
import deleteSystemMenu from "./../../../../api/deleteSystemMenuAPI";
import updateSystemMenu from "./../../../../api/updateSystemMenu";
import getAllSystemPage from "../../../../api/getAllSystemPages";
import "./management-menu.scss";
// const form = Form.useForm();

const { Option } = Select;

class ManagementMenu extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      isDelete: false,
      ischeck: "",
      listMenu: [],
      dataUpdate: {},
      values_update: {
        orderNo: "",
        clas: "",
        name: ""
      },
    };
    this.getAllMenu = this.getAllMenu.bind(this);
    this.OnChecked = this.OnChecked.bind(this);
    this.deleteMeunu = this.deleteMeunu.bind(this);
    this.handleOnchange_OrderNo = this.handleOnchange_OrderNo.bind(this);
    this.Update = this.Update.bind(this);
    this.handleOnchange_name = this.handleOnchange_name.bind(this);
  }

  componentDidMount() {
    this.getAllMenu();
  }

  /*-----------------------------------------------------/API Function------------------------------------------------------------*/


  async getAllMenu() {
    this.setState({
      isloading: true,
    });
    const dataMenu = await getAllMenuSystem();
    const listSystemPage = await getAllSystemPage();
    if (dataMenu) {
      this.setState({
        listMenu: dataMenu.data.getAll,
        isloading: false,
      });
    }
  }

  async deleteMeunu(menuId) {
    this.setState({ isloading: true });
    const deleted = await deleteSystemMenu(menuId);
    console.log("deleted", deleted);
    if (deleted) {
      if (deleted.data.success === true) {
        showToast("Xóa menu thành công!");
        this.getAllMenu();
      } else {
        showToast(deleted.message);
      }
      this.setState({ isloading: false });
    }
  }

  async Update(values) {
    // this.setState({ isloading: true });
    let { orderNo, clas, name } = this.state.values_update;
    let params = {
      systemPageMenuId: values.id,
      orderNo: this.state.values_update.orderNo ? orderNo : values.orderNo,
      pageId: values.pageId,
      name: this.state.values_update.name ? name : values.name,
      url: values.url,
      clas: this.state.values_update.clas ? clas : values.clas,
    };

    const updated = await updateSystemMenu(params);
    if (updated) {
      // this.setState({
      //   ischeck : true
      // })

      if (updated.data.success === true) {
        showToast("Cập nhật thành công!");
        this.getAllMenu();
        form.resetFields();
      } else {
        showToast(updated.message);
      }
      this.setState({ isloading: false });
    }
  }

  /*-----------------------------------------------------/API Function------------------------------------------------------------*/

  /*-----------------------------------------------------/Another Function------------------------------------------------------------*/

  OnChecked = (e) => {
    if (e) {
      this.getAllMenu();
    }
  };

  handleOnchange_name = e => {
    // console.log("handleOnchange_name" ,e);
    this.setState({
      values_update: {
        ...this.state.values_update,
        name: e.target.value,
      },
    });
  }

  handleOnchange_OrderNo = (e) => {
    this.setState({
      values_update: {
        ...this.state.values_update,
        orderNo: e,
      },
    });
  };

  handleOnchange_Class = (e) => {
    this.setState({
      values_update: {
        ...this.state.values_update,
        clas: e.target.value,
      },
    });
  };

  

  getUpdate = (value) => {
    // console.log(value);
    this.setState({
      dataUpdate: value,
    });
  };


  /*-----------------------------------------------------/Another Function------------------------------------------------------------*/

  render() {
    // console.log("Lisst menu", this.state.listMenu);
    // console.log("params " , this.state.values_update);
    const columns = [
      {
        title: "Tên chức năng ",
        dataIndex: "name",
        width: 300,
        key: "name",
        render: text => <div style={{ color: 'black' }}>{text}</div>,
      },
      {
        title: "Chỉnh sửa",
        // dataIndex: "name",
        width: 1000,
        render: (text, record) => (
          <div className="row">
            <div className="colums-content__btn">
              <Button
                type="primary"
                className="mr-2"
                data-toggle="modal"
                data-target="#updateMenu"
                onClick={this.getUpdate.bind(null, record)}
              >
                <i className="fa fa-edit mr-1"></i>Sửa
              </Button>
              <Popconfirm
                title={"Bạn có chắc muốn xóa " + record.name + "?"}
                onConfirm={this.deleteMeunu.bind(null, record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger">
                  <i className="fa fa-trash mr-1"></i> Xóa
                </Button>
              </Popconfirm>
            </div>
            <div className="colums-content__input ml-3">
              <InputNumber
                // placeholder
                defaultValue={record.orderNo}
                onChange={this.handleOnchange_OrderNo}
                style={{ width: "50px", marginRight: "10px" }}
                min={1}
              />

              <Input name="name" defaultValue={record.name} onChange={this.handleOnchange_name} style={{ width: "200px", color: "black" }} />
            </div>

            <div className="colums-content-icon ml-3">
              <i className={record.clas} style={{ marginRight: "10px" }}></i>
              <Input
                defaultValue={record.clas}
                style={{ width: "150px", float:"right"   }}
                onChange={this.handleOnchange_Class}
              />
            </div>
            
            <div className="colums-content__save ml-3" onClick={this.Update.bind(null, record)}>
              <button style={{ width: "100%"}} className="btn btn-primary"> Lưu </button>
            </div>

            <div className="collums-content__url ml-3">
              <p>{"/"+record.url}</p>
            </div>
          </div>
        ),
      },
    ];
    let parentID = [];
    let childID = [];
    let resultData = [];
    for (let key of this.state.listMenu) {
      if (key.parentId === "0" || key.parentId === "") {
        parentID.push(key);
      } else {
        childID.push(key);
      }
    }

    for (let i = 0; i < parentID.length; i++) {
      let children1 = [];
      for (let j = 0; j < childID.length; j++) {
        if (parentID[i]["id"] === childID[j]["parentId"]) {
          children1.push(childID[j]);
        }
      }
      resultData.push({ ...parentID[i], children: children1 });
    }


    return (
      <div id="management-menu" className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4> Quản lý menu<a style={{ visibility: "hidden" }}><Icon type="left" /></a></h4>
            </div>
          </div>
          <div className="card-body">
                <div className="row">
                  <div className="col-sm-12">
                    <Table
                      rowKey={record => record.id}
                      columns={columns}
                      dataSource={resultData}
                      loading={this.state.isloading}
                      scroll={{ x: 1300 }}
                    />
                  </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addMenu"
            >
              <i className="fa fa-plus mr-2"></i>Tạo mới
            </button>
          </div>
        </div>
        <AddMenu OnChecked={this.OnChecked} />
        <UpdateMenu
          OnChecked={this.OnChecked}
          dataUpdate={this.state.dataUpdate}
        />
      </div>
    );
  }
}
export default ManagementMenu;
