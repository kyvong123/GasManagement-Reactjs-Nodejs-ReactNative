import "./Index.scss";
import { useEffect, useState } from "react";
import * as FaIcon from "react-icons/fa";
import getUserCookies from "getUserCookies";
import moment from "moment";
import ToastMessage from "../../../helpers/ToastMessage";
import updateReasion from "../../../../api/updateReasion";
import { ToastContainer } from "react-toastify";
function ModalErrorItem({
  handleClose,
  name,
  allReason,
  idError,
  handleReason,
}) {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const getUser = async () => {
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserRole(user_cookie.user.userRole);
      }
    };

    getUser();
    handleReason();
  }, []);

  const handleDabosd = (allReason) => {
    return allReason.filter((ele) => ele.reasonReturn === `${idError}`);
  };
  const handleClickXacNhan = async () => {
    console.log(161);

    let user_cookie = await getUserCookies();
    if (user_cookie) {
      for (let i = 0; i < handleDabosd(allReason).length; i++) {
        if (handleDabosd(allReason)[i].acpReturn == null) {
          let idOrder = handleDabosd(allReason)[i].id;
          let res = await updateReasion(idOrder);
          if (res.success) {
            console.log(res);
          } else {
            console.log(res.message);
          }
        }
      }
      ToastMessage("success", "Đã xác nhận");
      setTimeout(() => {
        handleClose();
        handleReason();
      }, 2000);
    }
  };

  return (
    <div className="modale-item">
      <ToastContainer />
      <div className="content-item">
        <div className="header-modale d-flex">
          <h2 className="sub-heading">{name}</h2>
          <FaIcon.FaRegTimesCircle
            className="btn-closeModal"
            onClick={handleClose}
          />
        </div>

        <div className="content-detail_error">
          <table class="table table-bordered table_detail">
            <thead>
              <tr>
                <th className="title-table" scope="col">
                  Mã bình
                </th>
                <th className="title-table" scope="col">
                  Thời gian báo
                </th>
                <th className="title-table" scope="col">
                  Tình trạng
                </th>
              </tr>
            </thead>
            <tbody>
              <th className="content-detail">
                {handleDabosd(allReason).map((item, idx) => (
                  <tr className="item-detail" key={idx}>
                    {item.cylinder.serial}
                  </tr>
                ))}
              </th>
              <th className="content-detail">
                {handleDabosd(allReason).map((item, idx) => (
                  <tr className="item-detail" key={idx}>
                    {moment(item.createdAt).format("HH:mm DD/MM/YYYY")}
                  </tr>
                ))}
              </th>
              <th className="content-detail">
                {handleDabosd(allReason).map((item, idx) => (
                  <tr className="item-detail" key={idx}>
                    {item.acpReturn === null ? "Chưa xác nhận" : "Đã xác nhận"}
                  </tr>
                ))}
              </th>
            </tbody>
          </table>
        </div>
        <button className="btn_dong" onClick={handleClose}>
          Đóng
        </button>
        {userRole === "Truong_tram" ? (
          <button className="btn_xacNhan" onClick={() => handleClickXacNhan()}>
            Xác nhận bình lỗi
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ModalErrorItem;
