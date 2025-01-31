import React from 'react';
import { Table, Button, Row, Col,Modal,Input,Tooltip,Switch} from 'antd';
import moment from "moment";
const defaultPageSize = {
	defaultPageSize: 5,
  };
class NumberOfCylinder extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = 
        {
        }
    }
    setOkNumberOfCylinder=()=>{
        this.props.onClickNumberOfCylinder(false);
     }
     setCancelNumberOfCylinder=()=>{
         this.props.onClickNumberOfCylinder(false);
     }
    render(){
        console.log("this.props.visibleNumberOfCylinder",this.props.visibleNumberOfCylinder);
        console.log("this.props.visibleNumberOfCylinder",this.props.indexCylinders);
        const columns=[
            { 
                title: 'Loại',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.type==="B"?"Bình":"Vỏ"}       
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Loại bình',
                render:(record,index)=>{
                    return(
                        <div>
                            {record.cylinderType}    
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Loại van',
                render:(record,index)=>{
                    return(
                        <div>
                            {record.valve}    
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Màu sắc',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.color}       
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Thương hiệu',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.manufacturers}       
                        </div>
                    )                   
                }
            },
            { 
                title: 'Ngày giao',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {this.props.noteOfCylinder.expected_DeliveryDate}    
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Số lượng đặt',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.numberCylinders}    
                        </div>
                    )
                    
                }
            },
            
        ];
        return(
            <div className="row">
                    <Modal
                        title="Chi Tiết bình"
                        centered
                         visible={this.props.visibleNumberOfCylinder}
                        onOk={(e) => this.setOkNumberOfCylinder(e)}
                        onCancel={(e) => this.setCancelNumberOfCylinder(e)}
                        width={1000}
                    >
                    {this.props.noteOfCylinder.status==="CANCELLED" &&(
                            <div className="row col-12">
                            <h6 style={{ color: "rgb(255,99,71)" }}>*Lý do hủy :{this.props.noteOfCylinder?this.props.noteOfCylinder.note:""}</h6>
                          </div>
                    )}
                        <Table 
                        dataSource={this.props.indexCylinders} 
                        columns={columns}
                        bordered={true}
						pagination={defaultPageSize}
                         />
                    </Modal>
            </div>
        )
    }
}
export default NumberOfCylinder;     