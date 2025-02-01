import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import "./ModalUpdate.scss";
import priceManagement from "../../../../../api/PriceManagerAPI";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker } from "antd";
import { themeContext } from "../context/Provider";
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));
function ModalUpdate({ showModalUpdate, data, type, categoryCylinder }) {
  const [priceMass6, setPriceMass6] = useState(0);
  const [priceMass12, setPriceMass12] = useState(0);
  const [priceMass20, setPriceMass20] = useState(0);
  const [priceMass45, setPriceMass45] = useState(0);

  const { setIsRefresh, checkTimeUpdate } = useContext(themeContext);

  const [idBinh6, setIdBinh6] = useState("");
  const [idBinh12, setIdBinh12] = useState("");
  const [idBinh20, setIdBinh20] = useState("");
  const [idBinh45, setIdBinh45] = useState("");

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  useEffect(() => {
    setPriceMass6(data.mass6);
    setPriceMass12(data.mass12);
    setPriceMass20(data.mass20);
    setPriceMass45(data.mass45);
    setDateStart(moment(data.date_start, "DD/MM/YYYY"));
    setDateEnd(moment(data.date_end, "DD/MM/YYYY"));
  }, [data]);

  useEffect(() => {
    for (let i of categoryCylinder) {
      if (i.mass === 6) {
        setIdBinh6(i.id);
      }
      if (i.mass === 12) {
        setIdBinh12(i.id);
      }
      if (i.mass === 20) {
        setIdBinh20(i.id);
      }
      if (i.mass === 45) {
        setIdBinh45(i.id);
      }
    }
  }, []);
  const onChangeUpdatePrice = (value, id) => {
    if (id === "6") {
      setPriceMass6(value);
    }
    if (id === "12") {
      setPriceMass12(value);
    }
    if (id === "20") {
      setPriceMass20(value);
    }
    if (id === "45") {
      setPriceMass45(value);
    }
  };
  const onChangedateStart = (date) => {
    const value = checkTimeUpdate(date.startOf("day"), data)
    if (value) setDateStart(date);
  };
  const onChangedateEnd = (date) => {
    const value = checkTimeUpdate(date.endOf("day"), data);
    if (value) setDateEnd(date);
  };
  const postRequest = async (obj) => {
    try {
      let res = await priceManagement.updatePriceDetail(obj);
      if (res.success) {
        toast.success(res.message);
        setIsRefresh(true);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const updateButton = async () => {
    let obj = {};
    let dataPrice = [];

    let objPrice6 = {};
    let objPrice12 = {};
    let objPrice20 = {};
    let objPrice45 = {};
    obj.typePriceId = data.typePriceId;
    obj.manufacture = data.idThuongHieu;
    obj.fromDate = dateStart.toISOString();
    obj.toDate = dateEnd.toISOString();
    obj.priceDetails = dataPrice;

    if (priceMass6 !== null || priceMass6 !== "" || priceMass6 !== 0) {
      objPrice6.price = Number(priceMass6);
      objPrice6.categoryCylinder = idBinh6;
      dataPrice.push(objPrice6);
    }
    if (priceMass12 !== null || priceMass12 !== "" || priceMass12 !== 0) {
      objPrice12.price = Number(priceMass12);
      objPrice12.categoryCylinder = idBinh12;
      dataPrice.push(objPrice12);
    }
    if (priceMass20 !== null || priceMass20 !== "" || priceMass20 !== 0) {
      objPrice20.price = Number(priceMass20);
      objPrice20.categoryCylinder = idBinh20;
      dataPrice.push(objPrice20);
    }
    if (priceMass45 !== null || priceMass45 !== "" || priceMass45 !== 0) {
      objPrice45.price = Number(priceMass45);
      objPrice45.categoryCylinder = idBinh45;
      dataPrice.push(objPrice45);
    }

    if (
      objPrice6.price !== data.mass6 ||
      objPrice12.price !== data.mass12 ||
      objPrice20.price !== data.mass20 ||
      objPrice45.price !== data.mass45 ||
      obj.fromDate !== data.date_start ||
      obj.toDate !== data.date_end
    ) {
      console.log(obj);
      await postRequest(obj);
      setIsRefresh(true);
    }

    showModalUpdate();
  };
  return (
    <div className="modal-update">
      <ToastContainer />
      <div className="overlay" onClick={() => showModalUpdate()}></div>
      <div className="modal-update-content">
        <h3>Chỉnh sửa thông tin</h3>
        <div className="content-update">
          <div className="info-price">
            <h4>Giá bán</h4>
            <div className="price-group d-flex justify-content-between align-content-center">
              <div className="d-flex item">
                <span>{type === "Cylinders" ? "Vỏ bình 6kg" : "Bình 6kg"}</span>
                <input
                  className="form-control"
                  value={priceMass6}
                  onChange={(e) => onChangeUpdatePrice(e.target.value, "6")}
                  type={"number"}
                />
              </div>
              <div className="d-flex item">
                <span>
                  {type === "Cylinders" ? "Vỏ bình 12kg" : "Bình 12kg"}
                </span>
                <input
                  className="form-control"
                  value={priceMass12}
                  onChange={(e) => onChangeUpdatePrice(e.target.value, "12")}
                  type={"number"}
                />
              </div>
              <div className="d-flex item">
                <span>
                  {type === "Cylinders" ? "Vỏ bình 20kg" : "Bình 20kg"}
                </span>
                <input
                  className="form-control"
                  value={priceMass20}
                  onChange={(e) => onChangeUpdatePrice(e.target.value, "20")}
                  type={"number"}
                />
              </div>
              <div className="d-flex item">
                <span>
                  {type === "Cylinders" ? "Vỏ bình 45kg" : "Bình 45kg"}
                </span>
                <input
                  className="form-control"
                  value={priceMass45}
                  onChange={(e) => onChangeUpdatePrice(e.target.value, "45")}
                  type={"number"}
                />
              </div>
            </div>
          </div>
          <div className="date-select">
            <h4>Thời gian áp dụng</h4>
            <div className="select-date-group">
              <div className="d-flex align-content-between item">
                <span style={{ width: "100px", fontWeight: "600" }}>
                  Ngày bắt đầu
                </span>
                <DatePicker
                  value={dateStart}
                  // className={classes.textField}
                  format="DD/MM/YYYY"
                  onChange={onChangedateStart}
                />
              </div>
              <div className="d-flex align-content-between item">
                <span style={{ width: "100px", fontWeight: "600" }}>
                  Ngày kết thúc
                </span>
                <DatePicker
                  value={dateEnd}
                  format="DD/MM/YYYY"
                  // className={classes.textField}
                  onChange={onChangedateEnd}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="button-group d-flex align-content-center justify-content-center">
          <div className="save-btn btn-item" onClick={() => updateButton()}>
            Lưu
          </div>
          <div className="close-btn btn-item" onClick={() => showModalUpdate()}>
            Đóng
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalUpdate;
