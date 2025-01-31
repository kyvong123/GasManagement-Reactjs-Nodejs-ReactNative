import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";
import Constant from "Constants";
import ReactCustomLoading from "ReactCustomLoading";
import getCylinderDuplicate from "../../../../api/getCylinderDuplicate";
import autoCreateCylinder from "../../../../api/autoCreateCylinder"
import getUserCookies from "getUserCookies";
import { Select, Tabs, Progress, Button, Icon, Modal } from "antd";
import { DownloadOutline } from "@ant-design/icons";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import axios from 'axios';




import * as FaIcon from "react-icons/fa";
import styles from './ExportFactoryPopup2.module.scss';
import classNames from "classnames/bind";
import { GETLISTSTATION } from "../../../config/config";
import { EXPORTWITHOUTCODE } from "../../../config/config";
import callApi from "../../../util/apiCaller";


const ExportFactoryPopup2a = ({ visible, onCancel, sum, newOrder, typeExportCylinder }) => {
  // const listOrder = []
  const [listoder, setListOrder] = useState('');
  const [shiper, setShiper] = useState('');
  const [bienso, setBienso] = useState('');
  const [listFixer, setListFixer] = useState([]);
  const [click, setClick] = useState(false);

  const handleFixOnchange = (e) => {
    setListOrder(e.target.value)
  }
  const handleShiper = (e) => {
    setShiper(e.target.value)
  }
  const handleBienSo = (e) => {
    setBienso(e.target.value)
  }
  const getFixer = async () => {
    let user_cookies = await getUserCookies();
    let id = `${user_cookies.user.id}`;
    let userType = 'Fixer';
    let token = "Bearer " + user_cookies.token;
    await callApi("GET", GETLISTSTATION + `?id=${id}&userType=${userType}`, '', token).then((res) => {
      if (res.data) {
        setListFixer(res.data.data);
      } else {
        console.log("Xảy ra lỗi khi lấy dữ liệu");
      }
    })
  }
  useEffect(() => {
    getFixer();
  }, [])

  const handleSave = async () => {
    setClick(true);
    let user_cookies = await getUserCookies();

    let params = {
      from: user_cookies.user.id,
      to: listoder,
      quantity: sum,
      driverName: shiper,
      vehicleLicensePlate: bienso,
      details: newOrder

    }
    await axios.post(
      EXPORTWITHOUTCODE,
      params, {
      headers: {
        "Authorization": "Bearer " + user_cookies.token
      }
    })
      .then(function (response) {
        if ((response.status == 200 || response.status == 201) && response.data.success) {
          alert("Lưu thành công")
          onCancel();
          return
        }
        alert("Lưu thất bại")
      })
      .catch(function (err) {
        console.log(err);

      });

  }
  return (
    <Modal id="export-modal2a" className="modal-popup2" visible={visible} onCancel={onCancel}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Bước 2 - Nơi sửa chữa</h5>
          <button type="button" className="close" onClick={onCancel}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-body__popup2a">
            <div>
              <h5>Nơi sửa chữa</h5>
              <select className={listoder == "" && click == true ? "input-form-popup2a err" : "input-form-popup2a"} onChange={(e) => handleFixOnchange(e)}>
                <option value=''>chọn...</option>
                {listFixer.map((item, idx) => (
                  <option value={item.id} key={idx}>{item.name}</option>
                ))}
              </select>
              <p className={listoder == "" && click == true ? "mess error" : "mess"}>Vui lòng chọn trạm sửa chữa</p>
            </div>
            <div>
              <h5>Tên tài xế</h5>
              <input className={shiper == "" && click == true ? "input-form-popup2a err" : "input-form-popup2a"} onChange={(e) => handleShiper(e)} />
              <p className={shiper == "" && click == true ? "mess error" : "mess"}>Vui lòng thêm tài xế</p>
            </div>
          </div>
          <div className="modal-body__popup2a">
            <div>
              <h5>Biển số xe</h5>
              <input className={bienso == "" && click == true ? "input-form-popup2a err" : "input-form-popup2a"} onChange={(e) => handleBienSo(e)} />
              <p className={bienso == "" && click == true ? "mess error" : "mess"}>Vui lòng thêm biển số xe</p>
            </div>
            <div>
              <h5>Tổng số lượng bình</h5>
              <input value={sum} className="input-form-popup2a" disabled></input>
            </div>
          </div>
          <div className="action-popup2">
            <Button
              className="btn-tieptuc btn-action"
              onClick={() => handleSave()}
            >
              Lưu

            </Button>
            <Button className="btn-dong btn-action" onClick={onCancel}>Đóng</Button>
          </div>

        </div>
      </div>
    </Modal>
  )
}

export default ExportFactoryPopup2a