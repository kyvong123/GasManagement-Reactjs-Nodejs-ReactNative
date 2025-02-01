import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Table, Icon } from "antd";
import "./index.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import { CREATEORDER, GETALLORDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";

const { Option } = Select;

export default class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      listUsersGeneral: [],
      listUsersAgency: [],
      listCompany: [],
      listUserFixer: [],
      valueCompany: "",
      maDH: "",
      countOrder: 0,
      tokenAPI: "",
      statusOrder: "init",
      idAccount: "",
      searchText: "",
      searchedColumn: "",
      listAllOrder: [],
    };
  }
  async componentDidMount() {
    await this.getAllUserGeneral();
    await this.getAllUserAGENCY();
    await this.getListFixer();
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      listCompany: [
        ...this.state.listUsersGeneral,
        ...this.state.listUsersAgency,
        ...this.state.listUserFixer,
      ],
      tokenAPI: token,
      idAccount: id,
    });
    await this.getAllOrder(id, token);
  }
  async getAllUserGeneral() {
    const dataUsers = await getAllUserApi(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listUsersGeneral: dataUsers.data });
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
  async getAllUserAGENCY() {
    const dataUsers = await getAllUserApi(Constants.AGENCY);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listUsersAgency: dataUsers.data });
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
  async getListFixer() {
    const dataUsers = await getDestinationUserAPI(
      Constants.FACTORY,
      "",
      Constants.OWNER
    );
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listUserFixer: dataUsers.data });
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
  getAllOrder = async (id, token) => {
    let parmas = {
      orderCreatedBy: id,
    };
    await callApi("POST", GETALLORDER, parmas, token).then((res) => {
      let temp = [];
      console.log("data order", res.data);
      let i = 0;
      for (let item of res.data.order) {
        temp.push({
          key: i,
          orderId: item.orderId,
          numberCylinders: item.numberCylinders,
          nameCopany: item.factoryId ? item.factoryId.name : 'no name',
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
  onChangeCompany = async (value) => {
    this.setState(
      {
        valueCompany: value,
      },
      () => {
        let index = this.state.listCompany.findIndex(
          (company) => company.id === this.state.valueCompany
        );
        this.setState({
          address: this.state.listCompany[index].address,
        });
      }
    );
  };

  // handleChangeDate = (date) => {
  //   this.setState({
  //     startDate: date,
  //   });
  // };

  onChangeTitle = (e) => {
    this.setState({
      maDH: e.target.value,
    });
  };

  onChangeCountOrder = (e) => {
    this.setState({
      countOrder: e.target.value,
    });
  };

  onCreate = async (e) => {
    e.preventDefault();
    let {
      maDH,
      valueCompany,
      countOrder,
      startDate,
      idAccount,
      listAllOrder,
    } = this.state;
    if (!maDH || !valueCompany || !countOrder) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else if (maDH && valueCompany && countOrder) {
      let index = await listAllOrder.findIndex(
        (order) => order.orderId === maDH
      );
      if (index === -1) {
        let createOrder = {
          orderId: maDH,
          factoryId: valueCompany,
          numberCylinders: countOrder,
          orderDate: startDate,
          createdBy: idAccount,
        }
        console.log('creatde', createOrder)
        let parmas = {
          createOrder
        };
     
        console.log('ca;;',callApi)
        await callApi("POST", CREATEORDER, parmas, this.state.tokenAPI).then(
          console.log('ca;;',callApi),
          (res) => {
            alert("Tạo thành công");
            this.getAllOrder(this.state.idAccount, this.state.tokenAPI);
            window.location.reload()
          }
        );
      } else {
        alert("Mã đơn hàng đã bị trùng vui lòng nhập lại");
      }
    }
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

  render() {
    let { maDH, countOrder, listAllOrder, selectedRowKeys } = this.state;
    const defaultPageSize = {
      defaultPageSize: 10
    }
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
        title: "Tên công ty",
        dataIndex: "nameCopany",
        key: "nameCopany",
        ...this.getColumnSearchProps("nameCopany"),
      },
      // {
      //   title: "Thời gian tạo",
      //   dataIndex: "orderDate",
      //   key: "orderDate",
      //   ...this.getColumnSearchProps("orderDate"),
      // },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
      },
    ];
    //console.log(this.state.valueCompany);
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <h4 style={{marginLeft:'32px'}}>Tạo mới đơn hàng</h4>
          </div>
          <div>
            <Row>
              <Col xs={1}></Col>
              <Col xs={22}>
                <Form >
                  <Row style={{ marginTop: 20 }}>
                    <Col>

                    </Col>
                  </Row>
                  <Row>
                    <Col xs={14} md={5}>
                      <Form.Item label="Mã đơn hàng" style={{ display: "block" }}>
                        <Input onChange={this.onChangeTitle} value={maDH} />
                      </Form.Item>
                    </Col>
                    <Col xs={4}></Col>
                    <Col xs={14} md={5}>
                      <Form.Item label="Chọn công ty">
                        <Select
                          showSearch
                          optionFilterProp="children"
                          onChange={this.onChangeCompany}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listCompany.map((company, index) => {
                            return (
                              <Option key={index} value={company.id}>
                                {company.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={4}></Col>
                    <Col xs={14} md={5}>
                      <Form.Item label="Nhập số lượng">
                        <Input
                          type="number"
                          value={countOrder}
                          onChange={this.onChangeCountOrder}
                        />
                      </Form.Item>
                    </Col>
                  </Row>


                  {/* <Col xs={2}></Col> */}
                  {/* <Col xs={24} md={11}> */}
                  {/* <Form.Item label="Ngày tạo" style={{ display: "block" }}>
                    <DatePicker
                      selected={moment(this.state.startDate)}
                      onChange={this.handleChangeDate}
                      dateFormat="DD/MM/YYYY"
                      readOnly={true}
                    />
                  </Form.Item> */}
                  {/* </Col> */}
                  {/* </Row> */}
                </Form>
              </Col>
              <Col xs={1}></Col>
            </Row>

            <Row>
              <Col xs={1} md={8}></Col>
              <Col xs={22} md={8}>
                <Form.Item>
                  <Button
                    style={{ width: "100%", backgroundColor: '#f6921e' }}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={this.onCreate}
                  >
                    Tạo đơn hàng
              </Button>
                </Form.Item>
              </Col>
              <Col xs={1} md={8}></Col>
            </Row>
            <Row>
              <Col xs={1}></Col>
              <Col xs={22}>
                <Table columns={columns} dataSource={listAllOrder} pagination={defaultPageSize} />
              </Col>
              <Col xs={1}></Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
