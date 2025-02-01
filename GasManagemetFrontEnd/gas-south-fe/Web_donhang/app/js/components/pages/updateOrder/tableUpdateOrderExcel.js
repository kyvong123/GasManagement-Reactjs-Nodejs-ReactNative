import React, { Component } from 'react';


class TableUpdateOrderExcel extends Component {
    render() {
        return (
            <div hidden={true}>
                <table id="emp" class="table">
                    <thead>
                        <tr>
                            <th colSpan="11">
                                <h1>LỆNH GIAO HÀNG</h1>
                            </th>
                        </tr>
                        <tr><th></th></tr>
                        <tr><th></th></tr>
                        <tr><th></th></tr>
                        <tr><th></th></tr>
                        <tr>
                            <th colSpan="8"></th>
                            <th colSpan="3">
                                D.O. No.:
                            </th>
                        </tr>
                        <tr>
                            <th colSpan="8"></th>
                            <th colSpan="3">
                                Date: 
                            </th>
                            {/* {this.props.excelToday} */}
                        </tr>
                        <tr>
                            <th colSpan="8">
                                <h5>
                                    Quý công ty vui lòng giao hàng lên phương tiện Vận tải được chỉ định bời Công ty TNHH GAS SOPET
                                    với các chi tiết sau:
                                </h5>
                            </th>
                        </tr>
                        <tr>
                            <th rowSpan="2" colSpan="1">No.</th>
                            <th rowSpan="2" colSpan="1">Ngày tạo đơn hàng</th>
                            <th rowSpan="2" colSpan="1">Mã đơn hàng</th>
                            <th rowSpan="2" colSpan="1">Provine</th>
                            <th rowSpan="2">Khách hàng</th>
                            <th rowSpan="2">Số xe</th>
                            <th rowSpan="2">Thời gian giao hàng</th>
                            <th colSpan="3" rowSpan="1">Số lượng bình</th>
                            <th rowSpan="2">Trạng thái</th>
                            <th rowSpan="2">Ghi chú</th>
                        </tr>
                        <tr>
                            <th colSpan="1" rowSpan="1">Loại 50kg</th>
                            <th colSpan="1" rowSpan="1">Loại 45kg</th>
                            <th colSpan="1" rowSpan="1">Loại 12kg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.listTableExcel.map((p, index) => {
                            return <tr key={index}>
                                <td>{index +1}</td>
                                <td>{p.createdAt}</td>
                                <td>{p.maKH}</td>
                                <td>{p.Provine}</td>
                                <td>{p.ten}</td>
                                <td></td>
                                <td>{p.thoiGianGH}</td>
                                <td>{p.binh50 !== 0 ? p.binh50 : ''}</td>
                                <td>{p.binh45 !== 0 ? p.binh45 : ''}</td>
                                <td>{p.binh12 !== 0 ? p.binh12 : ''}</td>
                                <td>{p.trangThai}</td>
                                <td>{p.ghiChu}</td>
                            </tr>
                        })}
                    </tbody>
                    <tr><td></td></tr>
                    <tr><td></td></tr>
                    <tr>
                        <td colSpan="8">
                            <h5>
                                Quý công ty vui lòng xác nhận Số phương tiện vận tải và thông báo với chúng tôi Ngay trong
                                trường hợp không thể giao hàng
                                <br></br>
                                Mọi thông tin xin vui lòng liên hệ: Ms. Nguyen Thi My Linh (0907 278 499) hoặc                            
                            </h5>
                        </td>
                    </tr>
                </table>
            </div>
            // <table id={this.props.id} className={this.props.class}>
            //     <thead>
            //         <tr>
            //             <th colSpan="11">
            //                 <h1>LỆNH GIAO HÀNG</h1>
            //             </th>
            //         </tr>
            //         <tr><th></th></tr>
            //         <tr><th></th></tr>
            //         <tr><th></th></tr>
            //         <tr><th></th></tr>
            //         <tr>
            //             <th colSpan="8"></th>
            //             <th colSpan="3">
            //                 D.O. No.:
            //             </th>
            //         </tr>
            //         <tr>
            //             <th colSpan="8"></th>
            //             <th colSpan="3">
            //                 Date: {this.props.excelToday}
            //             </th>
            //         </tr>
            //         <tr>
            //             <th colSpan="8">
            //                 <h5>
            //                     Quý công ty vui lòng giao hàng lên phương tiện Vận tải được chỉ định bời Công ty TNHH GAS SOPET
            //                     với các chi tiết sau:
            //                 </h5>
            //             </th>
            //         </tr>
            //         <tr>
            //             <th rowSpan="2" colSpan="1">No.</th>
            //             <th rowSpan="2" colSpan="1">Ngày nhận hàng</th>
            //             <th rowSpan="2" colSpan="1">Mã đơn hàng</th>
            //             <th rowSpan="2" colSpan="1">Provine</th>
            //             <th rowSpan="2">Khách hàng</th>
            //             <th rowSpan="2">Số xe</th>
            //             <th rowSpan="2">Thời gian giao hàng</th>
            //             <th colSpan="3" rowSpan="1">Số lượng bình</th>
            //             <th rowSpan="2">Trạng thái</th>
            //             <th rowSpan="2">Ghi chú</th>
            //         </tr>
            //         <tr>
            //             <th colSpan="1" rowSpan="1">Loại 50kg</th>
            //             <th colSpan="1" rowSpan="1">Loại 45kg</th>
            //             <th colSpan="1" rowSpan="1">Loại 12kg</th>
            //         </tr>
            //     </thead>
            //     <tbody>
            //         {this.props.listTableExcel.map((p, index) => {
            //             return <tr key={index}>
            //                 <td>{index}</td>
            //                 <td></td>
            //                 <td>{p.maDH}</td>
            //                 <td>{p.Provine}</td>
            //                 <td>{p.ten}</td>
            //                 <td></td>
            //                 <td>{p.thoiGianGH}</td>
            //                 <td>{p.binh50 !== 0 ? p.binh50 : ''}</td>
            //                 <td>{p.binh45 !== 0 ? p.binh45 : ''}</td>
            //                 <td>{p.binh12 !== 0 ? p.binh12 : ''}</td>
            //                 <td>{p.status}</td>
            //                 <td>{p.note}</td>
            //             </tr>
            //         })}
            //     </tbody>
            //     <tr><td></td></tr>
            //     <tr><td></td></tr>
            //     <tr>
            //         <td colSpan="8">
            //             <h5>
            //                 Quý công ty vui lòng xác nhận Số phương tiện vận tải và thông báo với chúng tôi Ngay trong
            //                 trường hợp không thể giao hàng
            //                 Mọi thông tin xin vui lòng liên hệ: Ms. Nguyen Thi My Linh 0907 278 499) hoặc                            
            //             </h5>
            //         </td>
            //     </tr>
            // </table>
        )
    }
}

export default (TableUpdateOrderExcel);