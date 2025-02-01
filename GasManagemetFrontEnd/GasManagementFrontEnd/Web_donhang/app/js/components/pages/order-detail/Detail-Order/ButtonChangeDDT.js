import React, { Fragment, useEffect, useState } from "react";
import "./InputReason.css";
import getUserCookies from "getUserCookies";
import accessOrder from "../../../../../api/accessOrder";
import ToastMessage from "../../../../helpers/ToastMessage";
import handleProcessOrder from "../Detail-Order/handleProcessOrder";
import orderManagement from "../../../../../api/orderManagementApi";
import sendNotification from "../../../../../api/sendNotification";
import { SERVERAPI } from "../../../../config/config";
import axios from "axios";
function ButtonChangeDDT({
  setIsUpdate,
  isUpdate,
  setDropdown,
  data,
  handleClose,
}) {
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [devicePlayId, setDevicePlayId] = useState("");
  const [note, setNote] = useState("");
  const { isClick, setIsClick, handleChange } = handleProcessOrder(
    data,
    "DA_HOAN_THANH"
    // "DA_HOAN_THANH"
  );
  useEffect(() => {
    setDevicePlayId(data.customers.playerID + "," + data.customers.playerIDWeb);
    const getUser = async () => {
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserRole(user_cookie.user.userRole);
        setUserId(user_cookie.user.id);
      }
    };
    getUser();
  }, []);
  const handleUpdate = () => {
    setIsUpdate(true);
    setDropdown(true);
  };
  const checkVersion = async () => {
    let token = await getUserCookies();
    let res = await axios.get(SERVERAPI + "orderGS/status", {
      headers: {
        Authorization: "Bearer " + token.token,
      },
      params: {
        orderId: data.id,
      },
    });
    return res.data.data.updatedAt;
  }
  const handleAcess = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setIsClick(!isClick);
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };

  const handleSure = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      const res = await orderManagement.sureOrder(data.id, {
        note: "Điều độ trạm xác nhận đơn hàng\n" + note,
      });
      if (res && res.success) {
        sendNotification(
          "Đơn Hàng Đã Được Duyệt ",
          data.orderCode,
          devicePlayId,
          data.id
        );
        ToastMessage("success", "Xác nhận đơn hàng thành công");
        location.reload();
      } else {
        ToastMessage("error", "Xác nhận đơn hàng thất bại");
      }
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };
  const changeNote = (e) => {
    setNote(e.target.value);
    handleChange(e);
  }
  return (
    <Fragment>
      {userRole === "Dieu_do_tram" ? (
        <form className="input-reason__container">
          <textarea
            id="_note-text"
            className="input-reason-form"
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => changeNote(e)}
          />
          {!isUpdate && (
            <div className="input-reason__submit">
              {data.status === "DA_DUYET" ? (
                <div>
                  <input
                    type="button"
                    className="orange fontsubmit"
                    value="Chỉnh sửa"
                    onClick={handleUpdate}
                  />

                  <input
                    type="button"
                    className="green fontsubmit-access"
                    onClick={() => handleSure()}
                    value="Xác nhận đơn hàng"
                  />
                </div>
              ) : (
                <button
                  className="green fontsubmit-access"
                  onClick={() => handleAcess()}
                >
                  Xác nhận hoàn thành
                </button>
              )}
              {/* <input
                type="button"
                className="orange fontsubmit"
                value="Chỉnh sửa"
                onClick={handleUpdate}
              />
                         
              <button
                className="green fontsubmit-access"
                onClick={() => handleSure()}
              >
                Xác nhận đơn hàng             
              </button>    */}

              {/* <button
                className="green fontsubmit-access"
                onClick={() => handleAcess()}
              >
                Xác nhận hoàn thành
              </button> */}
            </div>
          )}
          {isUpdate && (
            <div className="update-button-wrap">
              <div
                style={isUpdate ? { margin: "300px 0 0" } : {}}
                className="input-reason__submit margin-top300"
                onClick={() => setIsUpdate(false)}
              >
                <input
                  type="button"
                  className="orange fontsubmit"
                  value="Hủy"
                />
              </div>
              <div
                style={isUpdate ? { margin: "300px 0 0" } : {}}
                className="input-reason__submit margin-top300"
              >
                <input
                  type="submit"
                  className="green fontsubmit"
                  value="Gửi KH xác nhận"
                  form="formDDT"
                />
              </div>
            </div>
          )}
        </form>
      ) : (
        ""
      )}
    </Fragment>
  );
}

export default ButtonChangeDDT;
