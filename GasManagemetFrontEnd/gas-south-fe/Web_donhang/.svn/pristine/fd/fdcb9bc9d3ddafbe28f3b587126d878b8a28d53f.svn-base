import React, { Component } from "react";
import { Icon, Table, Button, Space} from "antd";
import "./systemPage.scss";
import axios from "axios";
import {GETALL_SYSTEMPAGES} from "./../../../config/config";
import FormAddNew from "./formAddNew";

export default class SystemPage extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    listSystemPage: "",
  };
  //------Function Antd--------//

  handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: "descend",
        columnKey: "age",
      },
    });
  };

  //-----Call Api-------//

  getAllSystemPage = () => {
    return axios({
      method: "GET",
      url: GETALL_SYSTEMPAGES,
    })
      .then((res) => {
        this.setState({
          listSystemPage: res.data.systemPage,
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //--------Other Func--------//

  componentDidMount = () => {
    this.getAllSystemPage();
  };

  render() {
    console.log(this.state.listSystemPage);
    let { sortedInfo, filteredInfo } = this.state; //Antd Sort and Fillter Table More: https://ant.design/components/table/
    sortedInfo = sortedInfo || {}; //Antd Sort and Fillter Table
    filteredInfo = filteredInfo || {}; //Antd Sort and Fillter Table

    const columns = [
      {
        title: "Tên Trang",
        dataIndex: "name",
        key: "name",
        width:400,
        // filters: [{ text: "Joe", value: "Joe" }, { text: "Jim", value: "Jim" }],
        // filteredValue: filteredInfo.name || null,
        // onFilter: (value, record) => record.name.includes(value),
        // sorter: (a, b) => a.name.length - b.name.length,
        // sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        // ellipsis: true,
      },
      {
        title: "Level",
        dataIndex: "level",
        key: "level",
        // sorter: (a, b) => a.age - b.age,
        // sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
        // ellipsis: true,
      },
      {
        title: "Order No",
        dataIndex: "orderNo",
        key: "orderNo",
        // filters: [
        //   { text: "London", value: "London" },
        //   { text: "New York", value: "New York" },
        // ],
        // filteredValue: filteredInfo.address || null,
        // onFilter: (value, record) => record.address.includes(value),
        // sorter: (a, b) => a.address.length - b.address.length,
        // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
        // ellipsis: true,
      },
    ];
    return (
      <div className="main-content" id="SysTemPage-css">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>
                Quản Lý Trang
                <a style={{ visibility: "hidden" }}>
                  <Icon type="left" />
                </a>
                <button
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#create-controll"
                >
                  Tạo Mới
                </button>
              </h4>
            </div>
          </div>
          <div className="card-body">
            {/* <Space style={{ marginBottom: 16 }}> */}
              {/* <Button onClick={this.setAgeSort}>Sort age</Button>
              <Button onClick={this.clearFilters}>Clear filters</Button>
              <Button onClick={this.clearAll}>Clear filters and sorters</Button> */}
            {/* </Space> */}
            <Table
              columns={columns}
              dataSource={this.state.listSystemPage}
              onChange={this.handleChange}
            //   pagination={false}
              bordered
            />
          </div>
        </div>
        <FormAddNew />
      </div>
    );
  }
}
