import React, { Component } from "react";
import { Row, Col, Icon } from "antd";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Sector,
    Cell,
    Text,
    ResponsiveContainer,
    Line,
  } from "recharts";
export default class ShowBarChart extends Component {
  render() {
    return (
      <Col className="container">
        <Col className="modal fade" id="show-barchart" tabIndex="-1">
          <Col className="modal-dialog modal-lg">
            <Col className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Biểu đồ xuất hàng</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <Col className="modal-body">
              <ResponsiveContainer width="100%" height={600}>
              <BarChart
                height={500}
                data={this.props.dataBarChart}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={<Text width={30} />} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bình" barSize={15} fill="#1890FF" />
              </BarChart>
            </ResponsiveContainer>
              </Col>
            </Col>
          </Col>
        </Col>
      </Col>
    );
  }
}
