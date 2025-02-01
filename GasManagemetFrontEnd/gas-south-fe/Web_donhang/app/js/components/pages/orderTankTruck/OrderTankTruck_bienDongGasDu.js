import React, { Component, Fragment } from "react";
import { Row, Col, DatePicker, Button } from "antd";
import getUserCookies from "getUserCookies";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import showToast from "showToast";
import getImportExportOrderTankTruck from "../../../../api/getImportExportOrderTankTruck";
import "./OrderTankTruck_bienDongGasDu.scss";
import { object } from "prop-types";

export default class OrderTankTruck_bienDongGasDu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromdeliveryDate: "",
      todeliveryDate: "",
      listImportExportOrderTankTruck: [],
      dataRender: "",
    };
  }
  data = [
    {
      name: "1/9",
      "Cần Thơ": 55,
      "VT-Gas": 101,
      "Dung Quất": 100,
      "Gò Dầu": 55,
    },
    { name: "2/9", "Cần Thơ": 15, "VT-Gas": 91, "Dung Quất": 80, "Gò Dầu": 62 },
    {
      name: "3/9",
      "Cần Thơ": 25,
      "VT-Gas": 85,
      "Dung Quất": 111,
      "Gò Dầu": 70,
    },
    { name: "4/9", "Cần Thơ": 35, "VT-Gas": 86, "Dung Quất": 50, "Gò Dầu": 85 },
    { name: "5/9", "Cần Thơ": 30, "VT-Gas": 70, "Dung Quất": 10, "Gò Dầu": 55 },
    {
      name: "6/9",
      "Cần Thơ": 40,
      "VT-Gas": 55,
      "Dung Quất": 100,
      "Gò Dầu": 75,
    },
    {
      name: "7/9",
      "Cần Thơ": 70,
      "VT-Gas": 20,
      "Dung Quất": 105,
      "Gò Dầu": 124,
    },
  ];

  data2 = () => {
    return this.state.dataRender === undefined ? "" : this.state.dataRender;
  };

  // Onchange ngày tháng : từ ngày
  onchangeDatePickerFrom = (date, dateString) => {
    let dateFormat = new Date(dateString);
    let dateFromFormat = dateFormat.toISOString();
    this.setState({
      fromdeliveryDate: dateFromFormat,
    });
  };
  //Tới ngày
  onchangeDatePickerTo = (date, dateString) => {
    let dateFormat = new Date(dateString);
    let dateToFormat = dateFormat.toISOString();
    this.setState({
      todeliveryDate: dateToFormat,
    });
  };

  //Xem thống kê
  seeStatistics = async () => {
    let dataArr = [];
    let fromdeliveryDate = this.state.fromdeliveryDate;
    let todeliveryDate = this.state.todeliveryDate;
    console.log(fromdeliveryDate);
    if (fromdeliveryDate === "" || todeliveryDate === "") {
      showToast("Vui lòng chọn ngày");
    } else {
      const data = await getImportExportOrderTankTruck(
        this.state.fromdeliveryDate,
        this.state.todeliveryDate
      );
      console.log(data);
      if (data.status === 200 && data.data.status === true) {
        await this.setState({
          listImportExportOrderTankTruck: data.data.Result,
        });
      } else {
        showToast(data.data.message);
      }
      let arrList = this.state.listImportExportOrderTankTruck;
      for (let importExportOrderTankTruck of arrList) {
        // console.log(importExportOrderTankTruck);
        let object = { name: importExportOrderTankTruck.date };
        let arrWareHouseName = importExportOrderTankTruck.WareHouseName;
        let arrAfterImportExport = importExportOrderTankTruck.AfterImportExport;
        for (const key in arrWareHouseName) {
          let object2 = {
            ...object,
            [arrWareHouseName[key]]: arrAfterImportExport[key],
          };
          object = object2;
          if (parseInt(key) === arrWareHouseName.length - 1) {
            dataArr.push(object2);
          }
        }

        // console.log(object);
      }
    }
    this.setState({ dataRender: dataArr });
  };
  renderLineCharts = () => {
    console.log(this.state.dataRender);
    let i = 0;
    return this.state.dataRender.map((lines, index) => {
      let lenghtObject = Object.getOwnPropertyNames(lines).length;
      if (i > lenghtObject) {
        return;
      } else {
        for (const line in lines) {
          i++;
          console.log(i);
          if (i > 1 && i <= lenghtObject) {
            console.log(line, "", lines[line]);
            return (
              <Line
                dataKey={line}
                stroke="red"
                activeDot={{ r: 5 }}
                strokeWidth="2"
              >
                <LabelList
                  dataKey={line}
                  position="top"
                  style={{ color: "red" }}
                  fill={"red"}
                  fontSize={"20px"}
                />
              </Line>
            );
          }
          if (i > lenghtObject) return;
        }
      }
    });
  };

  render() {
    const dateFormat = "DD/MM/YYYY";
    return (
      <Fragment>
        <Row>
          <Col span={1}></Col>
          <Col span={22}>
            <h3 className="mt-2">Thông tin thống kê biến động số Gas dư</h3>
            <Row gutter={16}>
              <Col span={3}>
                <DatePicker
                  onChange={this.onchangeDatePickerFrom}
                  placeholder="Từ ngày"
                  name="từ ngày"
                  format={dateFormat}
                  required
                />
              </Col>
              <Col span={3}>
                <DatePicker
                  onChange={this.onchangeDatePickerTo}
                  placeholder="Đến ngày"
                  format={dateFormat}
                />
              </Col>
              <Col span={3}>
                <Button
                  style={{
                    backgroundColor: "#009347",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  onClick={this.seeStatistics}
                >
                  Xem thống kê
                </Button>
              </Col>
              <Col span={15}></Col>
            </Row>
            <LineChart
              width={1500}
              height={700}
              data={this.data2()}
              // data={this.data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis tickCount={10} />
              <Tooltip />
              <Legend iconType="square" width="500px" />
              {this.state.dataRender === "" ? (
                <h3>Chọn khoảng thời gian để xem thống kê</h3>
              ) : (
                this.renderLineCharts()
              )}
            </LineChart>
          </Col>
          <Col span={1}></Col>
        </Row>
      </Fragment>
    );
  }
}
