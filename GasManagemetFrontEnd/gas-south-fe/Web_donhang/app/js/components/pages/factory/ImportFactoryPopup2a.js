import React from "react";

import getUserCookies from "getUserCookies";
import { Select, Tabs, Progress, Button, Icon, Modal } from "antd";
import { useState, useEffect } from "react";
import axios from 'axios';


import { GETLISTSTATION } from "../../../config/config";
import { IMPORTWITHOUTCODE } from "../../../config/config";
import callApi from "../../../util/apiCaller";
import "./ImportFactoryPopup2.scss"



const ImportFactoryPopup2a = ({ visible, onCancel, sum, newOrder, typeImport }) => {
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
    let userType = 'Factory';
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
    (async () => {
      if (typeImport) {
        const user_cookies = await getUserCookies();
        setListOrder(user_cookies.user.id)
      } else {
        getFixer();
      }
    })()
  }, [])

  const handleSave = async () => {
    setClick(true);
    const user_cookies = await getUserCookies();

    let params = {
      from: listoder,
      to: user_cookies.user.id,
      quantity: sum,
      driverName: shiper,
      vehicleLicensePlate: bienso,
      details: newOrder

    }

    await axios.post(
      IMPORTWITHOUTCODE,
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

    return onCancel;
  }
  return (
    <Modal id="import-modal2a" className="modal-popup2" visible={visible} onCancel={onCancel}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{`Bước 2 - Thông tin ${typeImport ? 'hồi lưu' : 'nhập vỏ'}`}</h5>
          <button type="button" className="close" onClick={onCancel}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-body__popup2a">
            {!typeImport && <div>
              <h5>Nhập từ</h5>
              <select className={listoder == "" && click == true ? "input-form-popup2a err" : "input-form-popup2a"} onChange={(e) => handleFixOnchange(e)}>
                <option value=''>chọn...</option>
                {listFixer.map((item, idx) => (
                  <option value={item.id} key={idx}>{item.name}</option>
                ))}
              </select>
              <p className={listoder == "" && click == true ? "mess error" : "mess"}>Vui lòng chọn nơi nhập</p>
            </div>}
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

export default ImportFactoryPopup2a