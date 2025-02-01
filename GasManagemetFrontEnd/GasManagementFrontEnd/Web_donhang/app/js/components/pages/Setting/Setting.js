import React, { Component } from "react";
import {
  Input,
  Button,
  Form,
  Col,
  Row,
  Table,
  Modal,
  Icon,
  Popconfirm,
} from "antd";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import "./style.scss";
import showToast from "showToast";
import { GET_ALL_SETTING } from "../../../config/config";
import { GET_CREATE_SETTING } from "../../../config/config";
import { GET_DELETE_SETTING } from "../../../config/config";
import { GET_UPDATE_SETTING } from "../../../config/config";
class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSearch: "",
      dataTable: [""],
      dataRender: [""],
      visible: false,
      nameSubmit: "",
      valueSubmit: "",
      scriptSubmit: "",
      ListDataSetting: [],
      idUsers: "",
      open: false,
      searchKey: "",
      filterTable: null,
    };
  }
  async getListSetting(token) {
    await callApi("GET", GET_ALL_SETTING, token)
      .then((res) => {
        console.log(res, "check response");
        this.setState({
          ListDataSetting: res.data.GetSystemSetting,
        });
      })
      .catch((err) => console.log(err, "errr"));
  }
  async newOk(token) {
    const {
      newValueName,
      newValue,
      newValueScript,
      newValueCode,
      idUsers,
    } = this.state;
    let params = {
      UserId: idUsers,
      Key: newValueName,
      Value: newValue,
      Node: newValueScript,
      Code: newValueCode,
    };
    if ($.trim($("#myInput").val()) == "") {
      this.setState({
        newValueName: "",
        newValue: "",
        newValueScript: "",
        newValueCode: "",
      });
      showToast("Điền Đầy Đủ Thông Tin");
    } else if (
      this.state.newValueName &&
      this.state.newValue &&
      this.state.newValueScript &&
      this.state.newValueCode
    ) {
      await callApi("POST", GET_CREATE_SETTING, params, token).then((res) => {
        this.getListSetting();
        showToast("Thêm thành công", 5000);
        this.setState({
          open: false,
        });
      });
    } else {
      showToast("Vui lòng nhập đầy đủ thông tin", 3000);
    }
    await this.setState({
      newValueName: "",
      newValue: "",
      newValueScript: "",
      newValueCode: "",
    });
  }

  async handleOk() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    console.log(token, "token");
    const { nameSubmit, valueSubmit, scriptSubmit, idEdit } = this.state;
    let params = {
      SettingId: idEdit,
      Key: nameSubmit,
      Value: valueSubmit,
      Node: scriptSubmit,
    };
    if (
      this.state.nameSubmit &&
      this.state.valueSubmit &&
      this.state.scriptSubmit
    ) {
      callApi("POST", GET_UPDATE_SETTING, params, token).then((res) => {
        location.reload();
        showToast("Cập nhật thành công", 5000);
      });
    } else {
      showToast("Thông tin chưa được chỉnh sửa", 3000);
      location.reload();
    }
    this.setState({
      visible: false,
    });
  }

  async deleteSetting(id) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = { SystemSettingId: id };
    return callApi("POST", GET_DELETE_SETTING, params, token).then((res) => {
      showToast("Xóa thành công", 5000);
    });
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      idUsers: id,
    });
    this.getListSetting(token);
  }

  handleSubmit = (e) => {
    const temp = this.state.data.filter((item) => {
      return item.toLowerCase().includes(this.state.valueSearch.toLowerCase());
    });

    this.setState({ dataSearch: temp });
    e.preventDefault();
  };

  handleChange = (e) => {
    this.setState({ valueSearch: e.target.value });
  };

  handleReset = () => {
    this.setState({ valueSearch: "" });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleDelete = (item) => {
    let deleteItem = item.id;
    this.deleteSetting(deleteItem);
    this.setState((prevState) => ({
      ListDataSetting: prevState.ListDataSetting.filter(
        (elm) => elm.id !== deleteItem
      ),
    }));
  };

  openModel = (name, value, script, id) => {
    this.setState({
      visible: true,
      nameSubmit: name,
      valueSubmit: value,
      scriptSubmit: script,
      idEdit: id,
    });
  };

  listChangeName = (e) => {
    this.setState({ nameSubmit: e.target.value });
  };

  listChangeValue = (e) => {
    this.setState({ valueSubmit: e.target.value });
  };

  listChangeScript = (e) => {
    this.setState({ scriptSubmit: e.target.value });
  };

  newSubmit = () => {
    this.setState({
      open: true,
    });
  };

  newCancel = (e) => {
    this.setState({
      open: false,
    });
  };

  newChangeName = (e) => {
    this.setState({ newValueName: e.target.value });
  };

  newChangeValue = (e) => {
    this.setState({ newValue: e.target.value });
  };

  newChangeScript = (e) => {
    this.setState({ newValueScript: e.target.value });
  };

  newChangeCode = (e) => {
    this.setState({ newValueCode: e.target.value });
  };

  onChangeSearch = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmitSearch = () => {
    console.log("Từ Khóa", this.state.searchKey);
    const value = this.state.searchKey;
    if (value) {
      let ListDataSetting = this.state.ListDataSetting;
      let _filter = [];
      const filterTable = ListDataSetting.filter((o) => {
        Object.keys(o).some((k) => {
          if (k === "Key") {
            let check = String(o[k])
              .toLowerCase()
              .includes(value.toLowerCase());
            if (check) {
              let checkDuplicate = _filter.some((item) => o.id === item.id);
              if (!checkDuplicate) {
                _filter.push(o);
              }
            }
          }
        });
      });
      this.setState({ filterTable: _filter });
    } else {
      showToast("Vui lòng nhập từ khóa!");
    }
  };

  onReset = () => {
    this.setState({ filterTable: null, searchKey: null });
    $(".search_input").val("");
  };

  render() {
    const columns = [
      {
        title: "Từ Khóa",
        dataIndex: "name",
        align: "center",
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Giá Trị",
        dataIndex: "value",
        align: "center",
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Ghi Chú",
        dataIndex: "script",
        align: "center",
        render: (text) => <div style={{ color: "black" }}>{text}</div>,
      },
      {
        title: "Hoạt Động",
        align: "center",
        render: (item) => (
          <Popconfirm
            title={"Xác nhận xóa ?"}
            onConfirm={() => this.handleDelete(item)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <a className="delete_link">
              <i className="fa fa-trash delete_icon"></i>
            </a>
          </Popconfirm>
        ),
      },
    ];

    let dataTemp =
      this.state.filterTable == null
        ? this.state.ListDataSetting
        : this.state.filterTable;
    let dataSetting = dataTemp.map((item) => {
      return {
        id: item.id,
        key: item.Code,
        name: (
          <a
            onClick={() =>
              this.openModel(
                `${item.Key}`,
                `${item.Value}`,
                `${item.Node}`,
                `${item.id}`
              )
            }
          >
            {item.Key}
          </a>
        ),
        value: item.Value,
        script: item.Node,
      };
    });

    return (
      <div
        className="main-content"
        id="ContainerSetting"
        style={{ backgroundColor: "white" }}
      >
        <h3 className="TitlePage">Danh Sách Cài Đặt</h3>
        {/* <div>
            <Form className='FormSetting' onSubmit={this.handleSubmit} >
              <Row className='settingRowSearch' >   
                <Col span={6} className='settingColSearch'> 
                  <Input  
                    onChange={this.handleChange} 
                    type='text' placeholder='Từ khóa'
                    value={this.state.valueSearch}>
                  </Input> 
                </Col> 
              </Row>
              <Button className='settingSearch ' type='button' onClick={this.handleSubmit}   >
                Tìm Kiếm <Icon type="search" />
              </Button>
              <Button className='settingRetype' onClick={this.handleReset} type='button'>
                Nhập Lại <Icon type="sync" />
              </Button> 
            </Form>
          </div> */}
        <div className="card-body">
          <div className="table-responsive-xl">
            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
              <div className="row">
                <div className="col-sm-12" style={{ display: "flex" }}>
                  <Input
                    name="searchKey"
                    className="search_input"
                    placeholder="Từ khóa"
                    style={{ width: 300 }}
                    onChange={this.onChangeSearch}
                  />
                  <Button
                    className="search_btn"
                    type="primary"
                    icon="search"
                    onClick={this.onSubmitSearch}
                    value=""
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    className="reset_btn"
                    icon="redo"
                    onClick={this.onReset}
                  >
                    Nhập lại
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Table
            rowKey={(record) => record.id}
            dataSource={dataSetting}
            columns={columns}
            mountNode
            pagination={false}
            style={{ padding: "20px" }}
            bordered
          />
        </div>
        {/* <p>{this.state.dataSearch}</p> */}
        <Modal
          title="Chỉnh Sửa"
          visible={this.state.visible}
          onOk={() => this.handleOk()}
          onCancel={this.handleCancel}
        >
          <div style={{ padding: "10px 0" }}>
            <Input
              type="text"
              onChange={this.listChangeName}
              value={this.state.nameSubmit}
              style={{ color: "black" }}
            />
          </div>
          <div style={{ padding: "10px 0" }}>
            <Input
              type="text"
              onChange={this.listChangeValue}
              value={`${this.state.valueSubmit}`}
              style={{ color: "black" }}
            />
          </div>
          <div style={{ padding: "10px 0" }}>
            <Input
              type="text"
              onChange={this.listChangeScript}
              value={`${this.state.scriptSubmit}`}
              style={{ color: "black" }}
            />
          </div>
        </Modal>
        <div>
          <div style={{ paddingLeft: "20px" }}>
            <Button className="newList" type="text" onClick={this.newSubmit}>
              <Icon type="plus-circle" />
              Tạo mới
            </Button>
          </div>
          <Modal
            title="Tạo Mới "
            visible={this.state.open}
            onOk={() => this.newOk(event)}
            onCancel={this.newCancel}
          >
            <div>
              <h6>Từ Khóa</h6>
              <Input
                id="myInput"
                type="text"
                onChange={this.newChangeName}
                value={this.state.newValueName}
                style={{ color: "black" }}
              />
            </div>
            <div>
              <h6>Giá Trị</h6>
              <Input
                id="myInput"
                type="text"
                onChange={this.newChangeValue}
                value={this.state.newValue}
                style={{ color: "black" }}
              />
            </div>
            <div>
              <h6>Code</h6>
              <Input
                id="myInput"
                type="text"
                onChange={this.newChangeCode}
                value={this.state.newValueCode}
                style={{ color: "black" }}
              />
            </div>
            <div>
              <h6>Ghi Chú</h6>
              <Input
                id="myInput"
                type="text"
                onChange={this.newChangeScript}
                value={this.state.newValueScript}
                style={{ color: "black" }}
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Setting;
