import React, { Component } from "react";
import { Table } from "antd";
import {Link} from "react-router"
 const data = [
  {
    index: 1,
    soSeri: "DKBX123113",
    color: "Xám",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "Gas Dầu Khí",
    typeVase: "12",
  },
  {
    index: 2,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "Gas Dầu Khí",
    typeVase: "12",
  },
  {
    index: 3,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 4,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 5,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 6,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 7,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 8,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 9,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
  {
    index: 10,
    soSeri: "DKBX123113",
    color: "Đỏ",
    typeVan: "POL",
    weight: "13.2",
    inspection_date: "23/10/2020",
    trademark: "VT-GAS",
    typeVase: "12",
  },
];
export default class urlDetailStatistialBranch extends Component {
  render() {
    const columns = [
      {
        title: "Danh Sách Chi Tiết Bình LPG",
        align: "center",
        children: [
          { title: "STT", dataIndex: "index", align: "center" },
          { title: "Số Seri", dataIndex: "soSeri", align: "center" },
          { title: "Màu sắc", dataIndex: "color", align: "center" },
          { title: "Loại van", dataIndex: "typeVan", align: "center" },
          { title: "Cân nặng", dataIndex: "weight", align: "center" },
          {
            title: "Ngày kiểm định",
            dataIndex: "inspection_date",
            align: "center",
          },
          { title: "Thương hiệu", dataIndex: "trademark", align: "center" },
          { title: "Loại bình", dataIndex: "typeVase", align: "center" },
        ],
      },
    ];
    return (
      <div className="section-statistical__report">
        <h1>
          {" "}
        <Link to="/statistial" >  <i  className="fa fa-angle-left mr-2"></i></Link> Chi tiết bình khí{" "}
        </h1>
        <div className="section-statistical__report__body">
          <div className="container-fluid">
            <Table
              dataSource={data}
              columns={columns}
              pagination={true}
              bordered
            />
            <a href="#">Tải excel</a>
          </div>
        </div>
      </div>
    );
  }
}
