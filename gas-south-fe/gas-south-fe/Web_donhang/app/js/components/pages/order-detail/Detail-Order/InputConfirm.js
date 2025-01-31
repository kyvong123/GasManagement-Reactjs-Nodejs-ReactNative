import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import orderManagement from "../../../../../api/orderManagementApi";
import ToastMessage from "../../../../helpers/ToastMessage";
import getIdDevice from "../../../../../api/getIdDevice";
import sendNotification from "../../../../../api/sendNotification";
import "./InputReason.css";
import handleProcessOrder from "./handleProcessOrder";
import getUserCookies from "../../../../helpers/getUserCookies";
import { SERVERAPI } from "../../../../config/config";
import axios from "axios";

function InputConfirm({ role, data, handleOpenModalEditOrder, handleClose }) {
  const [note, setNote] = useState("");
  const [device, setDevice] = useState("");
  const [devicePlayId, setDevicePlayId] = useState("");

  useEffect(() => {
    let getUser = async () => {
      let res = await getIdDevice("Tong_cong_ty", "Ke_toan");
      if (res) {
        setDevice(res.data.data[0].playerID);
      }
      const dataHistory = await orderManagement.getHistoryComfirm(data.id);
      if (dataHistory.success) {
        dataHistory.data.map((item) => {
          if (item.action === data.status) {
            setDevicePlayId(item.updatedBy.playerID + "," + item.updatedBy.playerIDWeb)
          }
        })
      }
    };
    getUser();
  }, []);
  const {
    isClick,
    setIsClick,
    handleChange,
    cancelClick,
    setCancelClick,
    confirmCustomer,
    setConfirmCustomer,
    cancelClickCustomer,
    setCancelClickCustomer,
  } = handleProcessOrder(data, "TO_NHAN_LENH_DA_DUYET", "KHONG_DUYET", "Từ chối đơn hàng thành công");
  const handleEditOrderClick = (e) => {
    e.preventDefault();
    handleClose();
    handleOpenModalEditOrder();
  };
  const handleNote = (e) => {
    handleChange(e);
    setNote(e.currentTarget.value);
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
  const btnAcess = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setIsClick(!isClick);
      let getDevice = await getIdDevice("Tong_cong_ty", "Ke_toan");
      if (getDevice) {
        getDevice.data.data.map((item) => {
          let playId = item.playerID + "," + item.playerIDWeb;
          sendNotification(
            "Đơn hàng mới",
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
              "Đơn hàng mới",
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
  // handle click  order customer
  const handleDelOrderCustomer = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setCancelClickCustomer(!cancelClickCustomer);
      if (note) {
        let toNhanLenh = await getIdDevice("Tong_cong_ty", "To_nhan_lenh");
        if (toNhanLenh) {
          toNhanLenh.data.data.map((item) => {
            let playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng bị hủy",
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

  const handleRefuseCustomer = async () => {
    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setCancelClickCustomer(!cancelClickCustomer);
      if (note) {
        sendNotification(
          "Đơn hàng bị từ chối",
          data.orderCode,
          devicePlayId,
          data.id
        );
      }
    } else {
      ToastMessage("error", "Trạng thái đơn hàng đã hay đổi");
      location.reload();
    }
  };

  const handleConfirmCustomer = async () => {


    let isCheckVersion = await checkVersion().then((value) => { return value });
    if (isCheckVersion == data.updatedAt) {
      setConfirmCustomer(!confirmCustomer);
      let keToan = await getIdDevice("Tong_cong_ty", "Ke_toan");
      if (keToan) {
        keToan.data.data.map((item) => {
          let playId = item.playerID + "," + item.playerIDWeb;
          sendNotification(
            "Đơn hàng được khách xác nhận",
            data.orderCode,
            playId,
            data.id
          );
        });
      }
      let toNhanLenh = await getIdDevice("Tong_cong_ty", "To_nhan_lenh");
      if (toNhanLenh) {
        toNhanLenh.data.data.map((item) => {
          let playId = item.playerID + "," + item.playerIDWeb;
          sendNotification(
            "Đơn hàng được khách xác nhận",
            data.orderCode,
            playId,
            data.id
          );
        });
      }
      let dieuDoTram = await getIdDevice("Tram", "Dieu_do_tram");
      if (dieuDoTram) {
        dieuDoTram.data.data.map((item) => {
          if (item.isChildOf === data.customers.isChildOf) {
            let playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng được khách xác nhận",
              data.orderCode,
              playId,
              data.id
            );
          }
        });
      }
      let keToanTram = await getIdDevice("Tram", "Ke_toan_tram");
      if (keToanTram) {
        keToanTram.data.data.map((item) => {
          if (item.isChildOf === data.customers.isChildOf) {
            let playId = item.playerID + "," + item.playerIDWeb;
            sendNotification(
              "Đơn hàng được khách xác nhận",
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
    <form className="input-reason">
      {data.status === "DA_DUYET" ||
        data.status === "KHONG_DUYET" ||
        (data.status === "GUI_DUYET_LAI" && role === "TO_NHAN_LENH") ||
        (data.status === "TO_NHAN_LENH_DA_DUYET" && role === "TO_NHAN_LENH") ||
        role === "Pho_giam_docKD" ||
        role === "Truong_phongKD" ||
        role === "KE_TOAN" ||
        (role === "DIEU_DO_TRAM" && data.status === "DON_HANG_MOI") ||
        (role === "TO_NHAN_LENH" && data.status === "TU_CHOI_LAN_1") ||
        (role === "TO_NHAN_LENH" && data.status === "TU_CHOI_LAN_2") ||
        (role === "TO_NHAN_LENH" && data.status === "DDTRAM_DUYET") ||
        (role === "TO_NHAN_LENH" && data.status === "DDTRAMGUI_XACNHAN") ||
        (role === "TO_NHAN_LENH" && data.status === "TNLGUI_XACNHAN") ||
        data.status === "DA_HOAN_THANH" ? (
        ""
      ) : (
        <div className="input-reason__container">
          <label className="input-reason__label">
            <textarea
              className="input-reason-form"
              name="name"
              placeholder="Ghi Chú"
              value={note}
              onChange={(e) => handleNote(e)}
              rows={4}
            />
          </label>
          <div className="input-reason__submit">
            {(data.status === "DDTRAMGUI_XACNHAN" && role === "KH") ||
              (data.status === "TNLGUI_XACNHAN" && role === "KH") ? (
              <Fragment>
                <input
                  onClick={() => handleRefuseCustomer()}
                  type="button"
                  className="redinput fontsubmit"
                  value="Từ chối đơn"
                />
                <input
                  onClick={() => handleConfirmCustomer()}
                  type="button"
                  className="green fontsubmit"
                  value="Xác nhận đơn "
                />
              </Fragment>
            ) : (
              ""
            )}
            {data.status !== "DDTRAMGUI_XACNHAN" &&
              data.status !== "TNLGUI_XACNHAN" ? (
              <input
                onClick={(e) => handleEditOrderClick(e)}
                type="button"
                className="orange fontsubmit"
                value="Chỉnh Sửa Đơn"
              />
            ) : (
              ""
            )}
            {data.status !== "DDTRAMGUI_XACNHAN" &&
              data.status !== "TNLGUI_XACNHAN" &&
              role === "KH" ? (
              <input
                onClick={() => handleDelOrderCustomer()}
                type="button"
                className="redinput fontsubmit"
                value="Hủy đơn hàng"
              />
            ) : (
              ""
            )}

            {role === "Truong_phongKD" ? (
              <input
                type="button"
                className="orange fontsubmit"
                value="Không duyệt"
                onClick={() => handleNotBrowse()}
              />
            ) : (
              ""
            )}

            {role === "TO_NHAN_LENH" ? (
              <Fragment>
                <input
                  type="button"
                  className="green fontsubmit"
                  value="Xác nhận đơn hàng"
                  onClick={() => btnAcess()}
                />
                <input
                  type="button"
                  className="redinput fontsubmit"
                  value="Từ chối đơn hàng"
                  onClick={() => handleNotBrowse()}
                ></input>
              </Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default InputConfirm;
