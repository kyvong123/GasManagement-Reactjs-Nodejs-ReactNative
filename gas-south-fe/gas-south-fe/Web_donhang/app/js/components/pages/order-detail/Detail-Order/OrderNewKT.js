import React from "react";
import { useState, useEffect } from "react";
import getIdDevice from "../../../../../api/getIdDevice";
import sendNotification from "../../../../../api/sendNotification";
import handleProcessOrder from "./handleProcessOrder";
import { SERVERAPI } from "../../../../config/config";
import axios from "axios";
import getUserCookies from "../../../../helpers/getUserCookies";

function OrderNewKT({ data }) {
  const {
    isClick,
    setIsClick,
    handleChange,
    cancelClick,
    setCancelClick,
  } = handleProcessOrder(
    data,
    "DA_DUYET",
    "TU_CHOI_LAN_1",
    "Từ chối đơn hàng lần 1 thành công"
  );
  const [device, setDevice] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    let getUser = async () => {
      let res = await getIdDevice("Tong_cong_ty", "Truong_phongKD");
      if (res) {
        setDevice(res.data.data[1].playerID);
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
  const handleAcess = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setCancelClick(!cancelClick);
      if (note) {
        let getDevice = await getIdDevice("Tong_cong_ty", "Truong_phongKD");
        if (getDevice) {
          getDevice.data.data.map((item) => {
            let playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng cần duyệt",
              data.orderCode,
              playId,
              data.id
            );
          });
        }
      } else {
        console.log("thất bại");
      }
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };
  const handleBrowser = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setIsClick(!isClick);
      let getDevice1 = await getIdDevice("Tram", "Dieu_do_tram");
      let getDevice2 = await getIdDevice("Tram", "Truong_tram");
      let playId;
      if (getDevice1) {
        getDevice1.data.data.map((item) => {
          if (item.isChildOf === data.customers.isChildOf) {
            playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng mới",
              data.orderCode,
              playId,
              data.id
            );
          }
        });
      }
      if (getDevice2) {
        getDevice2.data.data.map((item) => {
          if (item.isChildOf === data.customers.isChildOf) {
            playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng mới",
              data.orderCode,
              playId,
              data.id
            );
          }
        });
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
          placeholder="Nhập lý do"
          onChange={(e) => handleNote(e)}
        />
      </label>
      <div className="input-reason__submit">
        <input
          type="button"
          className="orange fontsubmit"
          value="Từ chối lần một"
          onClick={() => handleAcess()}
        />
        <input
          type="button"
          className="green fontsubmit"
          value="Duyệt đơn hàng"
          onClick={() => handleBrowser()}
        />
      </div>
    </form>
  );
}

export default OrderNewKT;
