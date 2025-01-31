import React from "react";
import { useState, useEffect } from "react";
import getIdDevice from "../../../../../api/getIdDevice";
import sendNotification from "../../../../../api/sendNotification";
import handleProcessOrder from "./handleProcessOrder";
import { SERVERAPI } from "../../../../config/config";
import axios from "axios";
import getUserCookies from "../../../../helpers/getUserCookies";
function ConfirmTPKD({ data }) {
  const {
    isClick,
    setIsClick,
    handleChange,
    cancelClick,
    setCancelClick,
  } = handleProcessOrder(
    data,
    "GUI_DUYET_LAI",
    "KHONG_DUYET",
    "Từ chối đơn hàng thành công"
  );
  const [device, setDevice] = useState("");
  const [note, setNote] = useState("");
  useEffect(() => {
    let getUser = async () => {
      let res = await getIdDevice("Tong_cong_ty", "Ke_toan");
      if (res) {
        setDevice(res.data.data[0].playerID);
      }
    };
    getUser();
  }, []);
  const handleNote = (e) => {
    handleChange(e);
    setNote(e.target.value);
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
  const handleSento = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setIsClick(!isClick);
      let getDevice = await getIdDevice("Tong_cong_ty", "Ke_toan");
      if (getDevice) {
        getDevice.data.data.map((item) => {
          let playId = item.playerID + "," + item.playerIDWeb;
          sendNotification(
            "Đơn hàng cần duyệt lại",
            data.orderCode,
            playId,
            data.id
          );
        });
      }

      if (data.orderType === "COC_VO" || data.orderType === "MUON_VO") {
        let keToanVB = await getIdDevice("Tong_cong_ty", "Ke_toan_vo_binh");
        if (keToanVB) {
          keToanVB.data.data.map((item) => {
            let playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng cần duyệt lại",
              data.orderCode,
              playId,
              data.id
            );
          });
        }
      }
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };
  const handleNotBrowse = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setCancelClick(!cancelClick);
      if (note) {
        let playId = data.customers.playerID + "," + data.customers.playerIDWeb;
        sendNotification(
          "Đơn hàng bị từ chối",
          data.orderCode,
          playId,
          data.id
        );
      }
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };
  return (
    <form className="input-reason__container">
      <label className="input-reason__label">
        <textarea
          className="input-reason-form"
          name="name"
          placeholder="Nhập lý do (*)"
          onChange={(e) => handleNote(e)}
        />
      </label>
      <div className="input-reason__submit">
        <input
          type="button"
          className="orange fontsubmit"
          value="Không duyệt"
          onClick={() => handleNotBrowse()}
        />
        <input
          type="button"
          className="green fontsubmit"
          value="Gửi duyệt lại"
          onClick={() => handleSento()}
        />
      </div>
    </form>
  );
}

export default ConfirmTPKD;
