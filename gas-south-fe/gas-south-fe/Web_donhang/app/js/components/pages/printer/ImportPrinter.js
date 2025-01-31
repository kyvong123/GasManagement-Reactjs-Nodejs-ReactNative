import React, { Component } from 'react';
import moment from 'moment'; 
import { Row, Col, Input, Button, Table, Icon, Dropdown, Badge, Menu, Switch, Radio, Form, DatePicker, } from "antd";
import './style.scss';

export default class ImportPrinter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataForPrint: [],
            dataPrint: [],
            groupCYL50: [],
            groupCYL45: [],
            groupCYL12: [],
        }
    }

    componentDidUpdate = async (prevProps) => {
        // Typical usage (don't forget to compare props):
        if (this.props.dataPrint !== prevProps.dataPrint) {
            this.setState({ dataPrint: this.props.dataPrint }, () => this.classifyCylinder())            
        }
    }

    classifyCylinder = async () => {
        const {
            dataPrint
        } = this.state

        console.log('classifyCylinder', dataPrint)

        if (dataPrint.length > 0) {
            let _data = []

            dataPrint.map(data => {
                const cylinders = data.cylinders
                const length = cylinders.length

                const dateFormat = moment(data.date).format('DD/MM/YYYY, h:mm:ss a');

                let groupCYL50 = []
                let groupCYL45 = []
                let groupCYL12 = []

                for (let i = 0; i < length; i++) {
                    if (cylinders[i].typeCylinder === 'CYL50KG') {
                        groupCYL50.push(cylinders[i])
                    }
                    else if (cylinders[i].typeCylinder === 'CYL45KG') {
                        groupCYL45.push(cylinders[i])
                    }
                    else {
                        groupCYL12.push(cylinders[i])
                    }
                }

                _data.push({
                    orderCode: data.orderCode,
                    customerCode: data.customerCode,
                    customerName: data.customerName,
                    agencyCode: data.agencyCode,
                    agencyName: data.agencyName,
                    address: data.address,
                    driverName: data.driverName,
                    licensePlate: data.licensePlate,
                    dateFormat,
                    signature: data.signature,
                    groupCYL50,
                    groupCYL45,
                    groupCYL12,
                })
            })

            this.setState({ dataForPrint: _data })
        }        
    }

    render() {
        const {
            dataForPrint,
            dataPrint,
            groupCYL50,
            groupCYL45,
            groupCYL12,
        } = this.state
        
        // console.log('groupCYL', groupCYL50, groupCYL45, groupCYL12)
        console.log('dataPrint', dataPrint)
        // let dateFormat = "";

        // if(dataPrint.length > 0) {
        //     dateFormat = moment(dataPrint[0].date).format('DD/MM/YYYY, h:mm:ss a');
        // }

        return (
            <div /* className="print-container"  style={{margin: "0", padding: "0"}} */>
                {
                    dataForPrint.length > 0
                        ? dataForPrint.map(data => (                                                       
                            <div>
                                {/* {dataForPrint.length > 0
                                    ? <div className="title-print">{data.orderCode}</div>
                                    : ''
                                } */}
                                <div className='print-source'>
                                    {dataForPrint.length > 0
                                        ? (<div>
                                            <div>
                                                <span style={{ float: "left" }}><img style={{ height: 60, width: 60 }} src="./../../../assets/img/printer/sopet-logo.jpg" /></span>
                                                <span style={{ float: "left" }}>
                                                    <div className="title">SOPET Gas One COMPANY LIMITED</div>
                                                    <div className="header-content">Hamlet 2, Phuoc Khanh Com., Nhon Trach Dist., Dong Nai, Vietnam</div>
                                                    <div >Office: 8rd Floor, Paragon Sai Gon, 3 Nguyen Luong Bang, Phu My Hung, Dist.7, HCM City, Vietnam</div>
                                                </span>
                                                <span><img style={{ height: 60, width: 80 }} src="./../../../assets/img/printer/right_image.png" /></span>
                                                <div style={{ clear: "both" }}></div>
                                            </div>
                                            <div className="sub-title">BIEN BAN GIAO NHAN HANG</div>
                                            <div>
                                                <Row>
                                                    <Col xs={6}><div>Mã KH: </div></Col>
                                                    <Col xs={6}><div>{data.customerCode}</div></Col>
                                                    <Col xs={6}><div>Địa chỉ: </div></Col>
                                                    <Col xs={6}><div>{data.address}</div></Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6}><div>Tên KH: </div></Col>
                                                    <Col xs={6}><div>{data.customerName}</div></Col>
                                                    <Col xs={6}><div>Ngày/Giờ: </div></Col>
                                                    <Col xs={6}><div>{data.dateFormat}</div></Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6}><div>Mã CN: </div></Col>
                                                    <Col xs={6}><div>{data.agencyCode}</div></Col>
                                                    <Col xs={6}><div>NV Giao Hàng: </div></Col>
                                                    <Col xs={6}><div>{data.driverName}</div></Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6}><div>Tên CN: </div></Col>
                                                    <Col xs={6}><div>{data.agencyName}</div></Col>
                                                    <Col xs={6}><div>Số xe: </div></Col>
                                                    <Col xs={6}><div>{data.licensePlate}</div></Col>
                                                </Row>
                                            </div></div>
                                        ) : ''
                                    }

                                    <div className="sub-title">---------------------------------------------------------------</div>
                                    <div className="sub-title">GIAO BINH DAY (FULL CYLINDER) </div>
                                    <div>
                                        <Row>
                                            <Col xs={5}><span>Bình đầy - 50Kg</span></Col>
                                            <Col xs={14}></Col>
                                            <Col xs={5}><span>Số lượng: {data.groupCYL50 ? data.groupCYL50.length : 0}</span></Col>
                                        </Row>
                                    </div>
                                    <div>
                                        {
                                            data.groupCYL50.length > 0
                                                ? data.groupCYL50.map((cylinder, index) => {
                                                    return (
                                                        <Row>
                                                            <Col xs={6}><span>{index + 1}. 50Kg</span></Col>
                                                            <Col xs={12}>{cylinder.serialCylinder}</Col>
                                                            <Col xs={3}><span>{ cylinder.weightCylinder % 1  ===0 ? cylinder.weightCylinder +",0 Kg":cylinder.weightCylinder+" Kg" }</span></Col>
                                                            <Col xs={3}><span>{ cylinder.weightImport % 1  ===0 ? cylinder.weightImport+",0 Kg":cylinder.weightImport+" Kg"}+</span></Col>
                                                        </Row>
                                                    )
                                                })
                                                : ''
                                        }
                                    </div>
                                    <div>
                                        <Row>
                                            <Col xs={5}><span>Bình đầy - 45Kg</span></Col>
                                            <Col xs={14}></Col>
                                            <Col xs={5}><span>Số lượng: {data.groupCYL45 ? data.groupCYL45.length : 0}</span></Col>
                                        </Row>
                                    </div>
                                    <div>
                                        {
                                            data.groupCYL45.length > 0
                                                ? data.groupCYL45.map((cylinder, index) => {
                                                    return (
                                                        <Row>
                                                            <Col xs={6}><span>{index + 1}. 45Kg</span></Col>
                                                            <Col xs={12}>{cylinder.serialCylinder}</Col>
                                                            <Col xs={3}><span>{ cylinder.weightCylinder % 1  ===0?cylinder.weightCylinder+",0 Kg":cylinder.weightCylinder+" Kg"}</span></Col>
                                                            <Col xs={3}><span>{ cylinder.weightImport % 1  ===0?cylinder.weightImport+"0 Kg":cylinder.weightImport+" Kg"}</span></Col>
                                                        </Row>
                                                    )
                                                })
                                                : ''
                                        }
                                    </div>
                                    <div>
                                        <Row>
                                            <Col xs={5}><span>Bình đầy - 12Kg</span></Col>
                                            <Col xs={14}></Col>
                                            <Col xs={5}><span>Số lượng: {data.groupCYL12 ? data.groupCYL12.length : 0}</span></Col>
                                        </Row>
                                    </div>
                                    <div>
                                        {
                                            data.groupCYL12.length > 0
                                                ? data.groupCYL12.map((cylinder, index) => {
                                                    return (
                                                        <Row>
                                                            <Col xs={6}><span>{index + 1}. 12Kg</span></Col>
                                                            <Col xs={12}>{cylinder.serialCylinder}</Col>
                                                            <Col xs={3}><span>{( cylinder.weightCylinder) % 1  ===0?cylinder.weightCylinder+",0 Kg":cylinder.weightCylinder+" Kg"}</span></Col>
                                                            <Col xs={3}><span>{( cylinder.weightImport) % 1  ===0 ?cylinder.weightImport+",0 Kg":cylinder.weightImport+" Kg"}</span></Col>
                                                        </Row>
                                                    )
                                                })
                                                : ''
                                        }
                                    </div>
                                    <div className="sub-title">---------------------------------------------------------------</div>
                                    <div className="sub-title">Da kiem tra an toan va thu [  ] bang binh xit xa phong</div>
                                    <div className="signature">
                                        <Row>
                                            <Col xs={6}><div>Cong Ty Sopet Gas One</div></Col>
                                            <Col xs={12} />
                                            <Col xs={6}><div>Dai Dien Khach Hang</div></Col>
                                        </Row>
                                    </div>
                                    <div className="signature">
                                        <Row>
                                            <Col xs={6}><div>(Ky & Ghi Ro Ho Ten)</div></Col>
                                            <Col xs={12} />
                                            <Col xs={6}><div>(Ky & Ghi Ro Ho Ten)</div></Col>
                                        </Row>
                                        {
                                            dataForPrint.length > 0
                                                ?
                                                <Row>
                                                    <Col xs={6}></Col>
                                                    <Col xs={12} />
                                                    <Col xs={6}><img src={"data:image/png;base64," + data.signature} /> </Col>
                                                </Row>
                                                : ''
                                        }

                                    </div>
                                </div>
                            </div>
                        )) 
                    : <div></div>
            }
            </div>
            // <div>
            //     {dataPrint.length > 0
            //         ? <div className="title-print">{dataPrint[0].orderCode}</div>
            //         : ''
            //     }
            //     <div className='print-source'>
            //     {dataPrint.length > 0
            //         ? (<div>
            //             <div>
            //                 <span style={{float: "left"}}><img style={{height: 60, width: 60}} src="./../../../assets/img/printer/sopet-logo.jpg"/></span>
            //                 <span style={{float: "left"}}>
            //                     <div className="title">SOPET Gas One COMPANY LIMITED</div>
            //                     <div className="header-content">Hamlet 2, Phuoc Khanh Com., Nhon Trach Dist., Dong Nai, Vietnam</div>
            //                     <div >Office: 8rd Floor, Paragon Sai Gon, 3 Nguyen Luong Bang, Phu My Hung, Dist.7, HCM City, Vietnam</div>
            //                 </span>
            //                 <span><img style={{height: 60, width: 80}} src="./../../../assets/img/printer/right_image.png"/></span>
            //                 <div style={{clear: "both"}}></div>
            //             </div>
            //             <div className="sub-title">BIEN BAN GIAO NHAN HANG</div>
            //             <div>
            //                 <Row>
            //                     <Col xs={6}><div>Mã KH: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].customerCode}</div></Col>
            //                     <Col xs={6}><div>Địa chỉ: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].address}</div></Col>
            //                 </Row>
            //                 <Row>
            //                     <Col xs={6}><div>Tên KH: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].customerName}</div></Col>
            //                     <Col xs={6}><div>Ngày/Giờ: </div></Col>
            //                     <Col xs={6}><div>{dateFormat}</div></Col>
            //                 </Row>
            //                 <Row>
            //                     <Col xs={6}><div>Mã CN: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].agencyCode}</div></Col>
            //                     <Col xs={6}><div>NV Giao Hàng: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].driverName}</div></Col>
            //                 </Row>
            //                 <Row>
            //                     <Col xs={6}><div>Tên CN: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].agencyName}</div></Col>
            //                     <Col xs={6}><div>Số xe: </div></Col>
            //                     <Col xs={6}><div>{dataPrint[0].licensePlate}</div></Col>
            //                 </Row>
            //             </div></div>
            //         ) : ''
            //     }
                
            //     <div className="sub-title">---------------------------------------------------------------</div>
            //     <div className="sub-title">GIAO BINH DAY (FULL CYLINDER) </div>
            //     <div>
            //         <Row>
            //             <Col xs={5}><span>Bình đầy - 50Kg</span></Col>
            //             <Col xs={14}></Col>
            //             <Col xs={5}><span>Số lượng: {groupCYL50.length}</span></Col>
            //         </Row>
            //     </div>
            //     <div>
            //         {
            //             groupCYL50.length > 0
            //                 ? groupCYL50.map( (cylinder, index)=> {
            //                     return (
            //                         <Row>
            //                             <Col xs={6}><span>{index+1}. 50Kg</span></Col>
            //                             <Col xs={12}>{cylinder.serialCylinder}</Col>
            //                             <Col xs={3}><span>{cylinder.weightCylinder}</span></Col>
            //                             <Col xs={3}><span>{cylinder.weightImport}</span></Col>
            //                         </Row> 
            //                     )
            //                 })                            
            //                 : ''
            //         }
            //     </div>
            //     <div>
            //         <Row>
            //             <Col xs={5}><span>Bình đầy - 45Kg</span></Col>
            //             <Col xs={14}></Col>
            //             <Col xs={5}><span>Số lượng: {groupCYL45.length}</span></Col>
            //         </Row>
            //     </div>
            //     <div>
            //         {
            //             groupCYL45.length > 0
            //                 ? groupCYL45.map( (cylinder, index)=> {
            //                     return (
            //                         <Row>
            //                             <Col xs={6}><span>{index+1}. 45Kg</span></Col>
            //                             <Col xs={12}>{cylinder.serialCylinder}</Col>
            //                             <Col xs={3}><span>{cylinder.weightCylinder}</span></Col>
            //                             <Col xs={3}><span>{cylinder.weightImport}</span></Col>
            //                         </Row> 
            //                     )
            //                 })                            
            //                 : ''
            //         }
            //     </div>
            //     <div>
            //         <Row>
            //             <Col xs={5}><span>Bình đầy - 12Kg</span></Col>
            //             <Col xs={14}></Col>
            //             <Col xs={5}><span>Số lượng: {groupCYL12.length}</span></Col>
            //         </Row>
            //     </div>
            //     <div>
            //         {
            //             groupCYL12.length > 0
            //                 ? groupCYL12.map( (cylinder, index)=> {
            //                     return (
            //                         <Row>
            //                             <Col xs={6}><span>{index+1}. 12Kg</span></Col>
            //                             <Col xs={12}>{cylinder.serialCylinder}</Col>
            //                             <Col xs={3}><span>{cylinder.weightCylinder}</span></Col>
            //                             <Col xs={3}><span>{cylinder.weightImport}</span></Col>
            //                         </Row> 
            //                     )
            //                 })                            
            //                 : ''
            //         }
            //     </div>
            //     <div className="sub-title">---------------------------------------------------------------</div>
            //     <div className="sub-title">Da kiem tra an toan va thu [  ] bang binh xit xa phong</div>
            //     <div className="signature">
            //         <Row>
            //             <Col xs={6}><div>Cong Ty Sopet Gas One</div></Col>
            //             <Col xs={12} />
            //             <Col xs={6}><div>Dai Dien Khach Hang</div></Col>
            //         </Row>
            //     </div>
            //     <div className="signature">
            //         <Row>
            //             <Col xs={6}><div>(Ky & Ghi Ro Ho Ten)</div></Col>
            //             <Col xs={12} />
            //             <Col xs={6}><div>(Ky & Ghi Ro Ho Ten)</div></Col>
            //         </Row>
            //         {
            //             dataPrint.length > 0
            //                 ?
            //                 <Row>
            //                     <Col xs={6}></Col>
            //                     <Col xs={12} />
            //                     <Col xs={6}><img src={"data:image/png;base64," + dataPrint[0].signature} /> </Col>
            //                 </Row>
            //                 : ''
            //         }
                    
            //     </div>
            // </div>
            // </div>
            
        );
    }
}