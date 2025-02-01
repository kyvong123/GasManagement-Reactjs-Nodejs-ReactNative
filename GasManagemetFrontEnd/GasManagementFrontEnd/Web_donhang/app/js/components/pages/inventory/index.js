import React, { Component } from "react";
import Constants from "Constants";
import showToast from "showToast";
import {
  Avatar,
  Image,
  Button,
  Input,
  Icon,
  Popconfirm,
  Table,
  Card,
  Tooltip,
  Checkbox,
} from "antd";
import "./index.scss";
import CreateInventory from "./create-inventory_2";
import CreatePlan from "./create-plan";
import UpdateInventory from "./update-inventory_2";
import ViewInventory from "./view-inventory";
import GetAllWareHouseAPI from "./../../../../api/getAllWareHouseAPI";
import GetStationByIdAPI from "./../../../../api/getStationByIdAPI";
import DeleteWareHouseAPI from "./../../../../api/deleteWareHouseAPI";
import moment from "moment";
import getAllCustomerReceiveAPI from "../../../../api/getAllCustomerReceive";

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wareHouse: [],
      isLoading: false,
      dataFromParent: {},
      searchKey: "",
      filterTable: null,
      listRegion: [],
    };
    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.getDataRowView = this.getDataRowView.bind(this);
    this.getDataRowUpdate = this.getDataRowUpdate.bind(this);
    this.getStationByIdAPI = this.getStationByIdAPI.bind(this);
    this.deleteWareHouseAPI = this.deleteWareHouseAPI.bind(this);
    this.getAllWareHouseAPI = this.getAllWareHouseAPI.bind(this);
    this.getDataRowCreatePlan = this.getDataRowCreatePlan.bind(this);
    this.getAllCustomerReceive = this.getAllCustomerReceive.bind(this);
  }

  componentWillMount() {
    this.getAllWareHouseAPI();
    this.getAllCustomerReceive()
  }

  componentDidMount() {}

  /* --------------------------------------------------------- API ---------------------------------------------------------------*/

  async getAllCustomerReceive() {
    let listRegion = [];
    const listCustomerReceive = await getAllCustomerReceiveAPI();
    if (listCustomerReceive) {
        if (listCustomerReceive.data.success === true) {
            listCustomerReceive.data.data.forEach(item => {
                if(item.userType === "Region"){
                    listRegion = [...listRegion, { label: item.name, value: item.id }]
                }
            });
            this.setState({ listRegion });
            console.log(listRegion)
        } else {
            showToast(
                listCustomerReceive.data.message
                    ? listCustomerReceive.data.message
                    : listCustomerReceive.data.err_msg
            );
        }
    } else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
        this.setState({ isLoading: false });
    }
}

  async getStationByIdAPI(id) {
    // this.setState({ isLoading: true });
    const stationInfo = await GetStationByIdAPI(id);
    if (stationInfo) {
      if (stationInfo.data.status === true) {
        // this.setState({ isLoading: false });
        return stationInfo.data.data.name;
      } else {
        showToast(
          stationInfo.data.message
            ? stationInfo.data.message
            : stationInfo.data.err_msg
        );
      }
      // this.setState({ isLoading: false });
    } else {
      // this.setState({ isLoading: false });
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
    return false;
  }

  async getAllWareHouseAPI() {
    let temp = [];
    this.setState({ isLoading: true });
    console.time("test");
    const wareHouse = await GetAllWareHouseAPI();
    if (wareHouse) {
      if (wareHouse.data.status === true) {
        for (const element of wareHouse.data.WareHouse) {
          let _stationName = await this.getStationByIdAPI(element.userId);
          element.stationName = _stationName;
          temp.push(element);
          // this.setState(prevState => ({
          //   wareHouse: [...prevState.wareHouse, element]
          // }));
        }
        this.setState({ wareHouse: temp.reverse(), isLoading: false });
        console.timeEnd("test");
      } else {
        this.setState({ isLoading: false });
        showToast(
          wareHouse.data.message
            ? wareHouse.data.message
            : wareHouse.data.err_msg
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
      this.setState({ isLoading: false });
    }
  }

  async deleteWareHouseAPI(warehouseID) {
    this.setState({ isLoading: true });
    const deleteWareHouse = await DeleteWareHouseAPI(warehouseID);
    if (deleteWareHouse) {
      if (deleteWareHouse.data.status === true) {
        showToast("Kho đã được hủy thành công!");
        this.onCheckDelete(true);
        this.setState({ isLoading: false });
      } else {
        showToast(
          deleteWareHouse.data.message
            ? deleteWareHouse.data.message
            : deleteWareHouse.data.err_msg
        );
        this.setState({ isLoading: false });
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình xóa dữ liệu!");
      this.setState({ isLoading: false });
    }
  }

  /*///////////////////////////////////////////////////////////API ---------------------------------------------------------------*/

  /* --------------------------------------------------------- Another Function --------------------------------------------------*/

  getDataRowView(data) {
    this.setState({
      dataFromParent: data,
    });
  }

  getDataRowUpdate(data) {
    this.setState({
      dataFromParent: data,
    });
  }

  getDataRowCreatePlan(data) {
    this.setState({
      dataFromParent: data,
    });
  }

  onCheckCreate = (checked) => {
    if (checked) {
      this.setState({ wareHouse: [] });
      this.getAllWareHouseAPI();
    }
  };

  onCheckDelete = (checked) => {
    if (checked) {
      this.setState({ wareHouse: [] });
      this.getAllWareHouseAPI();
    }
  };

  onCheckUpdate = (checked) => {
    if (checked) {
      this.setState({ wareHouse: [] });
      this.getAllWareHouseAPI();
    }
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  onSearch() {
    console.log("Từ Khóa", this.state.searchKey);
    const value = this.state.searchKey;
    if (value) {
      let wareHouse = this.state.wareHouse;
      let _filter = [];
      const filterTable = wareHouse.filter((o) => {
        Object.keys(o).some((k) => {
          if (k === "name" || k === "stationName") {
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
  }

  onSearch_test() {
    console.log("Từ Khóa", this.state.searchKey);
    const value = this.state.searchKey;
    if (value) {
      let wareHouse = this.state.wareHouse;
      const filterTable = wareHouse.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k])
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
      this.setState({ filterTable });
    } else {
      showToast("Vui lòng nhập từ khóa!");
    }
  }

  onReset() {
    this.setState({ filterTable: null, searchKey: null });
    $(".search_input").val("");
  }

  /*///////////////////////////////////////////////////////////Another Function --------------------------------------------------*/

  render() {
    const columns = [
      {
        title: "STT",
        key: "index",
        align: "center",
        width: 100,
        render: (text, record, index) => (
          <div style={{ color: "black" }}>{index + 1}</div>
        ),
        // fixed: 'left'
      },
      {
        title: "Mã",
        dataIndex: "code",
        align: "center",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "11px", fontWeight: "400" }}>
            {text}
          </div>
        ),
        // sorter: (a, b) => a.code.localeCompare(b.code),
        // fixed: 'left'
      },
      {
        title: "Tên kho",
        align: "center",
        dataIndex: "name",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "11px", fontWeight: "400" }}>
            {text}
          </div>
        ),
        // fixed: 'left'
      },
      {
        title: "Chi nhánh",
        align: "center",
        dataIndex: "stationName",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "11px", fontWeight: "400" }}>
            {text}
          </div>
        ),
        sorter: (a, b) => a.stationName.localeCompare(b.stationName),
        // fixed: 'left'
      },
      {
        title: "Kho thuộc Nhà cung cấp",
        align: "center",
        dataIndex: "isSupplier",
        width: 200,
        render: (text, record) => (
          <Checkbox checked={record.isSupplier}></Checkbox>
        ),
        // fixed: 'left'
      },
      {
        title: "Khối lượng",
        align: "center",
        dataIndex: "mininventory",
        width: 150,
        render: (text) => (
          <div style={{ color: "black", fontSize: "11px", fontWeight: "400" }}>
            {text}
          </div>
        ),
        // fixed: 'left'
      },
      {
        title: "Ngày tạo",
        align: "center",
        dataIndex: "createdAt",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "11px", fontWeight: "400" }}>
            {moment(text).format("L LTS A")}
          </div>
        ),
        // fixed: 'left'
      },
      {
        title: "Ngày cập nhật",
        align: "center",
        dataIndex: "updatedAt",
        width: 200,
        render: (text) => (
          <div style={{ color: "black", fontSize: "11px", fontWeight: "400" }}>
            {text !== "" ? moment(text, "x").format("L LTS A") : ""}
          </div>
        ),
        // fixed: 'left'
      },
      {
        title: "Thao tác",
        align: "center",
        key: "thaotac",
        width: 250,
        // fixed: 'right',
        render: (text, record) => (
          <div className="action_columns">
            <Tooltip placement="top" title="Xem chi tiết">
              <a
                className="view_link"
                data-toggle="modal"
                data-target="#view-inventory"
                onClick={this.getDataRowView.bind(null, record)}
              >
                <i className="ti-eye view-icon"></i>
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Chỉnh sửa">
              <a
                className="update_link"
                data-toggle="modal"
                data-target="#update-inventory"
                onClick={this.getDataRowUpdate.bind(null, record)}
              >
                <i className="fa fa-edit update_icon"></i>
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Hủy">
              <Popconfirm
                title={'Xác nhận hủy kho "' + record.name + '"?'}
                onConfirm={this.deleteWareHouseAPI.bind(null, record.id)}
                okText="Xác nhận"
                cancelText="Từ chối"
                placement="leftBottom"
              >
                <a className="delete_link">
                  <i className="fa fa-trash delete_icon"></i>
                </a>
              </Popconfirm>
            </Tooltip>
            <Tooltip placement="top" title="Kế hoạch nhập hàng">
              <a
                className="createPlan_link"
                data-toggle="modal"
                data-target="#create-plan"
                onClick={this.getDataRowCreatePlan.bind(null, record.id)}
              >
                <i className="fa fa-line-chart createPlan_icon"></i>
              </a>
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <div className="main-content" id="Inventory">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>
                Danh sách kho
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
                  <div className="col-sm-12" style={{ display: "flex" }}>
                    <Input
                      name="searchKey"
                      className="search_input"
                      placeholder="Tên/ Chi nhánh"
                      style={{ width: 300 }}
                      onChange={this.onChange}
                    />
                    <Button
                      className="search_btn"
                      type="primary"
                      icon="search"
                      onClick={this.onSearch}
                      value=""
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
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <Table
                      rowKey={(record) => record.id}
                      loading={this.state.isLoading}
                      columns={columns}
                      dataSource={
                        this.state.filterTable == null
                          ? this.state.wareHouse
                          : this.state.filterTable
                      }
                      bordered
                      // pagination={{
                      //   defaultCurrent: 1,
                      //   defaultPageSize: 10,
                      //   showSizeChanger: true,
                      //   pageSizeOptions: ["10", "20", "30"],
                      // }}
                      scroll={{ x: 1600 }}
                      sticky={true}
                    ></Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-success"
              data-toggle="modal"
              data-target="#create-inventory"
            >
              <i className="fa fa-plus"></i>
              <span style={{ paddingLeft: "5px" }}>Tạo mới kho</span>
            </button>
          </div>
        </div>
        <CreateInventory 
          onChecked={this.onCheckCreate}
          listRegion={this.state.listRegion}
        ></CreateInventory>
        <CreatePlan
          onChecked={this.onCheckCreate}
          dataFromParent={this.state.dataFromParent}
        ></CreatePlan>
        <UpdateInventory
          listRegion={this.state.listRegion}
          onChecked={this.onCheckUpdate}
          dataFromParent={this.state.dataFromParent}
        ></UpdateInventory>
        <ViewInventory
          listRegion={this.state.listRegion}
          dataFromParent={this.state.dataFromParent}
        ></ViewInventory>
      </div>
    );
  }
}

export default Inventory;
