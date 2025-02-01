import { Fragment, useEffect, useState } from "react";
import "./NoteTable.scss";
import moment from "moment";
import getUserCookies from "../../../helpers/getUserCookies";
import orderManagement from "../../../../api/orderManagementApi";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
function NoteTable({ data }) {
  const [dataNote, setDataNote] = useState([]);
  const [showList, SetShowList] = useState(true);
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const getHistory = async () => {
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserType(user_cookie.user.userType);
        setUserRole(user_cookie.user.userRole);
        // console.log("Thằng điên" + user_cookie.user.userRole);
        try {
          const dataHistory = await orderManagement.getHistoryComfirm(data.id);
          if (dataHistory.success) {
            console.clear();
            
            if (
              user_cookie.user.userRole === "SuperAdmin" ||
              user_cookie.user.userRole === "KH"
            ) {
              const _data = dataHistory.data.filter(
                (item) =>
                  (item.updatedBy.userRole === "To_nhan_lenh" &&
                    (item.action === "TNLGUI_XACNHAN" ||
                      item.action === "KHONG_DUYET")) ||
                  item.action === "DDTRAMGUI_XACNHAN"
              );
              setDataNote(_data);
            } else {
              console.log("dataa", dataHistory.data);
              setDataNote(dataHistory.data);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    getHistory();
  }, []);
  
  const handleShowList = () => {
    SetShowList(!showList);
  };

  return (
    <Fragment>
      {((userType === "General" || userType === "Agency") &&
        !(userRole === "KH" || userRole === "SuperAdmin")) ||
      userType === "Tram" ? (
        ""
      ) : (
        <div className="note-table">
          <div className="d-flex align-center justify-content-between">
            <h4>Danh sách ghi chú</h4>
            <div onClick={() => handleShowList()} style={{ cursor: "pointer" }}>
              {showList ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
          {showList ? (
            <table class="table table-bordered">
              <thead className="head">
                <tr>
                  <th scope="col">Tài khoản thực hiện</th>
                  <th scope="col">Vai trò</th>
                  <th scope="col">Hành động</th>
                  <th scope="col">Ngày thực hiện</th>

                  <th scope="col">Nội dung</th>
                </tr>
              </thead>
              <tbody className="body">
                {dataNote &&
                  dataNote.length > 0 &&
                  dataNote.map((item, index) => {
                    const date = moment(item.createdAt).format(
                      "DD/MM/YYYY hh:mm"
                    );

                    const role = `${
                      item.updatedBy.userRole === "To_nhan_lenh"
                        ? "Tổ nhận lệnh"
                        : item.updatedBy.userRole === "Ke_toan_vo_binh"
                        ? "Kế toán vỏ bình"
                        : item.updatedBy.userRole === "Ke_toan"
                        ? "Kế toán"
                        : item.updatedBy.userRole === "Truong_phongKD"
                        ? "Trưởng phòng kinh doanh"
                        : item.updatedBy.userRole === "Pho_giam_docKD"
                        ? "Phó giám đốc kinh doanh"
                        : item.updatedBy.userRole === "Tong_dai_ly"
                        ? "Tổng đại lý"
                        : item.updatedBy.userRole === "Cua_hang_thuoc_tram"
                        ? "Cửa hàng thuộc trạm"
                        : item.updatedBy.userRole === "Dieu_do_tram"
                        ? "Điều độ trạm"
                        : item.updatedBy.userRole === "SuperAdmin"
                        ? "Khách hàng"
                        : ""
                    }`;
                    return (
                      <tr key={index}>
                        <td>{item.updatedBy.email}</td>
                        <td>{role}</td>

                        <td>
                          {item.action === "TO_NHAN_LENH_DA_DUYET"
                            ? "Tổ nhận lệnh đã duyệt"
                            : item.action === "TU_CHOI_LAN_1"
                            ? "Từ chối lần 1"
                            : item.action === "TU_CHOI_LAN_2"
                            ? "Từ chối lần 2"
                            : item.action === "DA_DUYET"
                            ? "Đã duyệt"
                            : item.action === "DANG_GIAO"
                            ? "Đang giao"
                            : item.action === "DANG_DUYET"
                            ? "Đang duyệt"
                            : item.action === "GUI_DUYET_LAI"
                            ? "Gửi duyệt lại"
                            : item.action === "KHONG_DUYET"
                            ? "Không duyệt"
                            : item.action === "DA_GIAO"
                            ? "Đã giao"
                            : item.action === "KHKHONG_DUYET"
                            ? "Khách hàng không duyệt đơn"
                            : item.action === "DDTRAM_DUYET"
                            ? "Điều độ trạm đã duyệt"
                            : item.action === "DDTRAMGUI_XACNHAN"
                            ? "Gửi lại cho khách hàng"
                            : item.action === "TNLGUI_XACNHAN"
                            ? "Gửi lại cho khách hàng"
                            : item.action === "KHDDTRAM_DUYET"
                            ? "Khách hàng đã duyệt"
                            : item.action === "DIEU_DO_TRAM_XACNHAN_HOANTHANH"
                            ? "Xác nhận hoàn thành"
                            : item.action === "KHOI_TAO_DON_HANG" 
                            ? "Tạo đơn hàng"
                            : ""}
                        </td>

                        <td>{date}</td>

                        <td style={{ width: "250px" }}>
                          <p style={{whiteSpace: "pre-line"}}>{item.note}</p>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : (
            ""
          )}
        </div>
      )}
    </Fragment>
  );
}

export default NoteTable;
