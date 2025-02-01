import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Table, Icon } from "antd";
//import './index.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import { GETORDERFACTORY, UPDATEORDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
//import firebase from './../../../util/firebase';

const { Option } = Select;

export default class UpdateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAllOrder: [],
      idAPI: "",
      tokenAPI: "",
    };
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      idAPI: id,
      tokenAPI: token,
    });
    await this.getAllOrder(id, token);
    // const messaging=firebase.messaging();
    // messaging.requestPermission().then(()=>{
    //   console.log("Have Permission");
    //   return messaging.getToken();
    // }).then((tokenFirebase)=>{
    //   console.log(tokenFirebase);
    // })
  }

  getAllOrder = async (id, token) => {
    let parmas = {
      factoryId: id,
    };
    await callApi("POST", GETORDERFACTORY, parmas, token).then((res) => {
      console.log(res.data);
      let temp = [];
      let i = 0;
      for (let item of res.data.orderFactory) {
        temp.push({
          key: i,
          id: item.id,
          orderId: item.orderId,
          numberCylinders: item.numberCylinders,
          orderDate: moment(item.orderDate).format("DD/MM/YYYY"),
          status: item.status === "INIT" ? "Khởi tạo" : item.status,
        });
        i++;
      }
      this.setState({
        listAllOrder: temp,
      });
    });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  onChangeStatusOK = async (id, status) => {
    let updateOrderStatus = {
      updatedBy: this.state.idAPI,
      orderStatus: status,
      orderId: id,
    }
    let parmas = {
      updateOrderStatus
    };
    await callApi("POST", UPDATEORDER, parmas, this.state.tokenAPI).then(
      async (res) => {
        //console.log(res.data.changedOrder);
        alert("Cập nhật thành công");
        await this.getAllOrder(this.state.idAPI, this.state.tokenAPI);
      }
    );
  };
  render() {
    let { maDH, countOrder, listAllOrder, selectedRowKeys } = this.state;
    const columns = [
      {
        title: "Mã đơn đặt hàng",
        dataIndex: "orderId",
        key: "orderId",
        ...this.getColumnSearchProps("orderId"),
      },
      {
        title: "Số lượng",
        dataIndex: "numberCylinders",
        key: "numberCylinders",
        ...this.getColumnSearchProps("numberCylinders"),
      },
      {
        title: "Thời gian tạo",
        dataIndex: "orderDate",
        key: "orderDate",
        ...this.getColumnSearchProps("orderDate"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
      },
      {
        title: "Cập nhật trạng thái",

        key: "listAllOrder",
        render: (listAllOrder) => (
          <div>
            <Button
              type="primary"
              onClick={() => this.onChangeStatusOK(listAllOrder.id, "Đã nhận")}
            >
              Đã nhận
            </Button>
            <Button
              type="danger"
              style={{ marginLeft: 5 }}
              onClick={() =>
                this.onChangeStatusOK(listAllOrder.id, "Đang vận chuyển")
              }
            >
              Đang vận chuyển
            </Button>
            <Button
              type="danger"
              style={{ marginLeft: 5 }}
              onClick={() => this.onChangeStatusOK(listAllOrder.id, "Đã hủy")}
            >
              Hủy bỏ
            </Button>
          </div>
        ),
      },
    ];
    //console.log(this.state.valueCompany);
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col xs={8}></Col>
          <Col xs={8}>
            <h5>Xem đơn hàng được nhận</h5>
          </Col>
          <Col xs={8}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={22}>
            <Table columns={columns} dataSource={listAllOrder} />
          </Col>
          <Col xs={1}></Col>
        </Row>
      </div>
    );
  }
}
