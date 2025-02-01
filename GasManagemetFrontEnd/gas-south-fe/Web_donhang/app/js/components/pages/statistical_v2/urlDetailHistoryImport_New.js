import React, { Component } from "react";
import { Table } from "antd";
const data = [
  {
    key: "1",
    name: "Bình Khí ",
    age: "20/10/2020 13:00",
    address: "20",

  },
  {
    key: "1",
    name: "Bình Khí ",
    age: "20/10/2020 13:00",
    address: "20",

  },
  {
    key: "1",
    name: "Bình Khí ",
    age: "20/10/2020 13:00",
    address: "20",

  },
  {
    key: "1",
    name: "Bình Khí ",
    age: "20/10/2020 13:00",
    address: "20",

  },
  {
    key: "1",
    name: "Bình Khí ",
    age: "20/10/2020 13:00",
    address: "20",

  },
  {
    key: "1",
    name: "Bình Khí ",
    age: "20/10/2020 13:00",
    address: "20",

  },
];
class urlDetailHistoryImport_New extends Component {
  render() {
    const columns = [
      {
        title: "Nhập từ",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Ngày giờ",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Số lượng",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Thao tác",
        key: "tags",
        dataIndex: "tags",
        render : () => (
            <a>Tải excel</a>
        )
      },
     
    ];

    return (
      <div className="container">
        <div className="row">
         <div className="col-12">
         <h1>Lịch sử nhập hàng</h1>
          <Table columns={columns} dataSource={data} />
         </div>
        </div>
      </div>
    );
  }
}

export default urlDetailHistoryImport_New;
