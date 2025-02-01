import React, { Component } from "react";
import { Row, Col } from "antd";
const dataSource = [
  {
    id:1,
    hangmuc:'Kiểm tra tổng quát bằng mắt',
    hangmucEnlinsh:'General visual checking'
  },
  {
    id:2,
    hangmuc:'Kiểm tra các dấu hiệu ăn mòn bên ngoài của bồn và khu vực bồn,chân móng bồn đường ống',
    hangmucEnlinsh:'External corrosion on the tank or tank foundation'
  },
  {
    id:3,
    hangmuc:'Kiểm tra các các vật liệu dễ gây cháy nổ trong khu vực bồn chứa Gas',
    hangmucEnlinsh:'Is there combustive materials in the tank area'
  },
  
];
export default class TableBonGas extends Component {
  render() {
    return (
      <Row>
        <Col xs={1}></Col>
        <Col xs={22}>
          
          <table class="table table-bordered seednet-table-keep-column-width">
            <thead className="table__head">
              <tr>
              <th style={{textAlign:'center',alignItems:'center'}}><p>STT</p><i>No</i></th>
                <th style={{textAlign:'center',alignItems:'center'}}><p>Hạng mục kiểm tra</p><i>Item</i></th>
                <th style={{textAlign:'center',alignItems:'center'}}><p>Tình trạng trước khi bảo trì</p><i>Status before maitenance</i></th>
                <th style={{textAlign:'center',alignItems:'center'}}><p>Công việc bảo trì</p><i>Works being carried by maintenance</i></th>
                <th style={{textAlign:'center',alignItems:'center'}}><p>Kết quả công việc và đề xuất</p><i>Results & Recommendation</i></th>
              </tr>
            </thead>
            <tbody>
            {dataSource.map((data,index)=>{
              return <tr className="table-light">
              <td style={{textAlign:'center',alignItems:'center'}}>{data.id}</td>
              <td style={{textAlign:'center',alignItems:'center'}}><p>{data.hangmuc}</p><i>{data.hangmucEnlinsh}</i></td>
              <td style={{textAlign:'center',alignItems:'center'}}></td>
              <td style={{textAlign:'center',alignItems:'center'}}></td>
              <td style={{textAlign:'center',alignItems:'center'}}></td>
            </tr>
            })}
             
            </tbody>
          </table>
          
        </Col>
        <Col xs={1}></Col>
      </Row>
    );
  }
}
