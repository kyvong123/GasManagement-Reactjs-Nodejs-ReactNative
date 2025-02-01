import React from 'react'
import { handleShowDate } from '../../../../helpers/handleDate'
import { FaCircle } from "react-icons/fa";
import './status.css'

function StatusNotBrowse({ confirmHistory, status, role }) {
  // console.log("roleeee",role)
  // console.log("statusssss",status)
  if (role === "KH" && status === "KHONG_DUYET") {
    // console.log("day la kh dung")
    return <div></div>;
  }
  
  return (
    <div className="detail-shipping__container ">
      <div className="detail-reason-cancel">
        <div>
          <ul className="reason-cancel-items">
            <li >
              <FaCircle className="Circle-icon" />
              <span style={{ color: "red", fontWeight: "600" }}>Không duyệt</span>
            </li>
          </ul>
        </div>
        {confirmHistory && confirmHistory.map(product => {
          return (
            <div>
              <ul className="reason-cancel-items">
                <div className="reason-cacel--item">
                  <li >
                    <FaCircle className="Circle-icon" />
                    <span>{product.action === "TU_CHOI_LAN_1" ? "Gửi duyệt lần 1" : ""}</span>
                    <span>{product.action === "TU_CHOI_LAN_2" ? "Gửi duyệt lần 2" : ""}</span>
                  </li>
                  <li>
                    <FaCircle className="Circle-icon" />

                    <span>{product.action === "TU_CHOI_LAN_1" ? "Từ chối lần 1" : ""}</span>
                    <span>{product.action === "TU_CHOI_LAN_2" ? "Từ chối lần 2" : ""}</span>
                    <ul className="reason-cancel-item">
                      <img src="/icon/arrowlevel.png" alt="image" />
                      <li>{product.action && product.note}</li>
                    </ul>
                  </li>
                </div>
                <div className="date-time-reason">
                  <span>{handleShowDate(product.createdAt)}</span>
                </div>
              </ul>
            </div>
          )
        })
        }
      </div>
    </div>
  )
}

export default StatusNotBrowse