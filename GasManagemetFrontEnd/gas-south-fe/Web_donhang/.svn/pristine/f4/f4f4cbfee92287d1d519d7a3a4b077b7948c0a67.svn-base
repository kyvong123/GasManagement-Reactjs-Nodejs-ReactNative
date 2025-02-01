import React, { Component } from "react";
import { Row, Col } from "antd";
const dataSource = [
  {
    id:1,
    name:'CYLINDER BANK AREA(KHU VỰC CHỨA BÌNH GAS)',
    description1:'Combustive meterial (Các vật dễ cháy)',
    description2:'Warning signs (Biển cảnh báo)',
    description3:'Fire extinguisher (Bình chữa cháy)'
  },
  {
    id:2,
    name:'CYLINDER (CÁC BÌNH CHỨA GAS)',
    description1:'Appearance (Tình trạng bên ngoài)',
    description2:'Others (Các lí do khác)',
    description3:''
  },
  {
    id:3,
    name:'PIG TAILS (CÁC ỐNG MỀM TỪ BÌNH GAS VÀO ỐNG GÓP)',
    description1:'Type (Chủng loại)',
    description2:'Appearance (Tình trạng bên ngoài)',
    description3:''
  },
  {
    id:4,
    name:'PIPING (ỐNG GÓP TRƯỚC VAN ĐIỀU ÁP CẤP 1)',
    description1:'Leakage (Rò rỉ)',
    description2:'Others (Các lí do khác)',
    description3:''
  },
  {
    id:5,
    name:'PIPING AFTER 1st REGULATOR (ỐNG GÓP SAU VAN ĐIỀU ÁP CẤP 1)',
    description1:'Leakage (Rò rỉ)',
    description2:'Others (Các lí do khác)',
    description3:''
  },
  {
    id:6,
    name:'ALL THE VALSE ON PIPING (HỆ THỐNG VAN TRÊN ỐNG GÓP)',
    description1:'Leakage (Rò rỉ)',
    description2:'Others (Các lí do khác)',
    description3:''
  },
  {
    id:7,
    name:'HOSE CONNECT TO APPLIANCES (CÁC ỐNG MỀM TỪ ỐNG GÓP VÀO THIẾT BỊ ĐỐT)',
    description1:'Leakage (Rò rỉ)',
    description2:'Others (Các lí do khác)',
    description3:''
  },
  {
    id:8,
    name:'PERIODICAL INSPECTION DEVICES WHICH LAW REQUIRED TO INSPECT (CÁC THIẾT BỊ CÓ YÊU CẦU KIỂM ĐỊNH THEO DỊNH KY THEO QUY ĐỊNH)',
    description1:'Type (Chủng loại)',
    description2:'Appearance (Tình trạng bên ngoài)',
    description3:''
  },
];
export default class TableBinhGas extends Component {
  render() {
    return (
      <Row>
        <Col xs={1}></Col>
        <Col xs={22}>
          <table className="table table-bordered seednet-table-keep-column-width">
            <tbody>
            {dataSource.map((data,index)=>{
                return <tr className="table-light">
                <td>{data.id}</td>
                <td><h6>{data.name}</h6><br/></td>
                <td>
                  <ul>
                    <li style={{listStyleType:'none'}}>{data.description1}</li>
                    <li style={{listStyleType:'none'}}>{data.description2}</li>
                    <li style={{listStyleType:'none'}}>{data.description3}</li>
                  </ul>
                </td>
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
