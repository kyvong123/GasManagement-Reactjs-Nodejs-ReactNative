import React from 'react'
import { FaShippingFast, FaHandPaper } from "react-icons/fa";
import "../Status/status.css"
function StatusShipping({ status, datadetail, datahistory, role }) {
    const totalValue = () => {
        let total = 0;
        if (datadetail) {

            for (let i = 0; i < datadetail.length; i++) {

                total = total + datadetail[i].quantity
            }
        }
        return total
    }
    const totalValueHistory = () => {
        let total = 0;
        for (let i = 0; i < datahistory.length; i++) {

            total = total + datahistory[i].quantity

        }
        return total
    }
    return (
        <div className="history-order__container">
            <div className='history-order'>
                {status === "GUI_DUYET_LAI" || status === "TU_CHOI_LAN_2" || status === "DA_DUYET" || status === "DON_HANG_MOI"
                    || status === "DANG_DUYET" || status === "KHONG_DUYET" || status === "TO_NHAN_LENH_DA_DUYET" || status === "TU_CHOI_LAN_1"
                    ? "" : <div><FaShippingFast className="shipping-icon" />
                        <span className=" font-20 text-[22px] font-semibold text-black font-size18">
                            Lịch sử giao nhận
                        </span></div>}
                {status === "KHONG_DUYET" && role !== "KH" ? <div><FaHandPaper className="shipping-icon" />
                    <span className="text-[22px] font-semibold text-black font-size18">
                        Lý do hủy
                    </span></div> : ""}

            </div>
            {
                status == "GUI_DUYET_LAI" ? "" : <div>
                    <span className="status-text">

                    </span>
                </div>
            }
            {/* DON HANG MOI */}
            {(status === "DON_HANG_MOI" && role === "KH") ? <div className="status-order  ">
                <span className="status-text ">Chờ xác nhận</span></div> : ""}
            {(status === "DA_DUYET" && role === "Truong_phongKD") ? <div className="status-order  ">
                <span className="status-text delivered">Đã Duyệt</span></div> : ""}

            {/* TU CHOI */}
            {status === "TU_CHOI_LAN_1" && role !== "Truong_phongKD" && role !== "KH" ? <div className="status-order  ">
                <span className="status-text yellow">Từ chối lần 1</span></div> : ""}
            {status === "TU_CHOI_LAN_1" && role === "Truong_phongKD" ? <div className="status-order  ">
                <span className="status-text "></span></div> : ""}
            {status === "TU_CHOI_LAN_1" && role === "KH" ? <div className="status-order">
                <span className="status-text ">Chờ xác nhận</span></div> : ""}
            {/* TU_CHOI_LAN 2 */}
            {status === "TU_CHOI_LAN_2" && role !== "KH" ? <div className="status-order  ">
                <span className="status-text yellow">Từ chối lần 2</span></div> : ""}
            {status === "TU_CHOI_LAN_2" && role === "KH" ? <div className="status-order">
                <span className="status-text ">Chờ xác nhận</span></div> : ""}
            {/* DA_DUYET */}
            {status === "DA_DUYET" && role === "TO_NHAN_LENH" ? <div className="status-order  ">
                <span className="status-text delivered">Đã Duyệt</span></div> : ""}
            {status === "DA_DUYET" && role === "KH" ? <div className="status-order  ">
                <span className="status-text blue">Đã xác nhận</span></div> : ""}

            {status === "DANG_GIAO" ? <div className="status-order  ">
                <span className="status-text yellow">Đang Giao</span></div> : ""}

            {status === "DANG_DUYET" ? <div className="status-order  ">
                <span className="status-text delivering">Đang duyệt</span></div> : ""}
            {/* DON HANG DUYET TU TO NHAN LENH */}
            {status === "TO_NHAN_LENH_DA_DUYET" && role === "KH" ? <div className="status-order  ">
                <span className="status-text ">Chờ xác nhận</span></div> : ""}
            {status === "TO_NHAN_LENH_DA_DUYET" && role === "TO_NHAN_LENH" ? <div className="status-order">
                <span className="status-text delivering"> Đang duyệt</span></div> : ""}

            {status === "DA_DUYET" && role === "KE_TOAN" ? <div className="status-order">
                <span className="status-text delivered"> Đã duyệt</span></div> : ""}

            {status === "DA_GIAO" ? <div className="status-order  ">
                <span className="status-text delivered">Đã giao</span></div> : ""}

            {status === "DA_HOAN_THANH" ? <div className="status-order  ">
                <span className="status-text delivered">Đã giao {totalValueHistory()}/{totalValue()}</span></div> : ""}

            {status === "KHONG_DUYET" ? <div className="status-order  ">
                <span className="status-text red">Không duyệt</span></div> : ""}
            {/* GUI_DUYET_LAI */}
            {status === "GUI_DUYET_LAI" && role !== "KH" ? <div className="status-order  ">
                <span className="status-text delivering">Gửi duyệt lại</span></div> : ""}
            {status === "GUI_DUYET_LAI" && role === "KH" && role !== "Truong_phongKD" ? <div className="status-order  ">
                <span className="status-text">Chờ xác nhận</span></div> : ""}
        </div>
    )
}

export default StatusShipping