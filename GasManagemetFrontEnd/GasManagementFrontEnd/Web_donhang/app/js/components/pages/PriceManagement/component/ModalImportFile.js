import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./ModalImportFile.scss";
import moment from "moment";
import TableExcel from "./TableExcel";
import { ToastContainer, toast } from "react-toastify";
import priceManage from "../../../../../api/PriceManagerAPI";
import priceManagement from "../../../../../api/PriceManagementAPI";
import { createDownLoadData } from "./DowloadFileExcel";

function ModalImportFile({
  handleShowModal,
  setIsRefresh,
  typeCylinder,
  manufacture,
  userID,
  station,
  type,
}) {
  const [dataExcel, setDataExcel] = useState([]);
  const [valueSelect, setValueSelect] = useState("");
  const [nameManafacture, setNameManafacture] = useState("");
  const [idBinh6, setIdBinh6] = useState("");
  const [idBinh12, setIdBinh12] = useState("");
  const [idBinh20, setIdBinh20] = useState("");
  const [idBinh45, setIdBinh45] = useState("");
  const hanldeFile = async (e) => {
    const file = e.target.files[0];
    // const data = await file.arrayBuffer();

    let extension = file.name.match(/(?<=\.)\w+$/g)[0].toLowerCase(); // assuming that this file has any extension

    if (extension === "xlsx") {
      const reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, { type: "binary" });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, { header: "A" });
        const slicedata = dataParse.slice(2);
        const arrayObj = slicedata.map((item) => {
          return {
            customerCode: item.A,
            customerName: item.B,
            mass6: item.C,
            mass12: item.D,
            mass20: item.E,
            mass45: item.F,
            date_start: moment
              .unix((item.G - 25569) * 24 * 60 * 60)
              .format("MM/DD/YYYY"),
            date_end: moment
              .unix((item.H - 25569) * 24 * 60 * 60)
              .format("MM/DD/YYYY"),
          };
        });
        const getCustomer = async (code, name) => {
          let idStation;
          let res = await priceManagement.getCustomerByCode(code, name);
          if (res && res.data) {
            return (idStation = res.data[0]);
          } else {
            return null;
          }
        };
        for (let i of arrayObj) {
          let obj = i;
          getCustomer(i.customerCode, i.customerName).then((i) => {
            obj.idStation = i.isChildOf;
            obj.idCustomer = i.id;
            let getNameStation = station.find((e) => e.id === i.isChildOf);
            obj.nameStation = getNameStation.name;
            arrayObj.push(obj);
          });
        }

        setDataExcel([...arrayObj]);
      };
      reader.readAsBinaryString(file);
    } else {
      toast.warning(
        `Nhập file sai định dạng, xin nhập file có định dạng là '.xlsx'`
      );
      event.target.value = "";
    }
  };
  useEffect(() => {
    const getIdCylinder = async () => {
      let res = await priceManage.getCategoryCylinder();
      if (res && res.data) {
        for (let i of res.data) {
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
      }
    };
    getIdCylinder();
  }, []);
  const onChangeSelect = (e) => {
    let findNameManafacture = manufacture.find((f) => f.id === e);
    setNameManafacture(findNameManafacture.name);
    setValueSelect(e);
  };
  const onChangeInput = () => {
    document.getElementById("input").value = "";
  };
  const handleSaveClick = async () => {
    let typePrices = [];
    let customerList = [];

    if(type === "update") {
        const typePricesRes = await priceManage.getAllPrice();

        if(typePricesRes.success) {
            typePrices = typePricesRes.data
        }

        console.log(typePrices);
    }
    for (let i = 0; i < dataExcel.length; i++) {
      const element = dataExcel[i];
      let dataPush = {};
      let cylinder = [];
      let arrPush = [];
      let obj6 = {};
      let obj12 = {};
      let obj20 = {};
      let obj45 = {};
      obj6.price = element.mass6;
      obj6.categoryCylinder = idBinh6;
      cylinder.push(obj6);

      obj12.price = element.mass12;
      obj12.categoryCylinder = idBinh12;
      cylinder.push(obj12);

      obj20.price = element.mass20;
      obj20.categoryCylinder = idBinh20;
      cylinder.push(obj20);

      obj45.price = element.mass45;
      obj45.categoryCylinder = idBinh45;
      cylinder.push(obj45);

      dataPush.userId = userID;
      dataPush.cylinderType = typeCylinder === "Gas" ? "BINH" : "VO";
      dataPush.note = `tạo bảng giá từ Excel`;
      dataPush.manufacture = valueSelect;
      dataPush.fromDate = moment(element.date_start).toISOString();
      dataPush.toDate = moment(element.date_end).toISOString();
      dataPush.customer = element.idCustomer;
      dataPush.priceDetails = cylinder;
      if (type === "create") {
        createPriceByExcel(dataPush);
      }
      if (type === "update" && element.customerCode) {
        let dataUpdate = {
          manufacture: dataPush.manufacture,
          fromDate: dataPush.fromDate,
          toDate: dataPush.toDate,
          priceDetails: dataPush.priceDetails
        };

        const result = typePrices.find(
          (item) =>
            item.idThuongHieu === dataPush.manufacture &&
            item.NgayBatDau === dataPush.fromDate &&
            item.NgayKetThuc === dataPush.toDate &&
            item.MaKhachHang == element.customerCode &&
            item.LoaiGia === dataPush.cylinderType
        );
        if(result) {
            dataUpdate.typePriceId = result.typePriceId;
            if(dataPush.customer){
                const res = await priceManage.updatePriceDetail(dataUpdate)
                console.log(res);
                if(res.success) {
                    toast(res.message)
                    setIsRefresh(true);
                    handleShowModal();
                }
                else {
                    toast(res.message);
                }
            }
        }
      }
    }
  };
  const createPriceByExcel = async (data) => {
    try {
      let res = priceManage.createPriceByExcel(data);
      res.then((i) => {
        if (i.success) {
          toast(i.message);
          setIsRefresh(true);
          handleShowModal();
        } else {
          toast(i.message);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="modal-import-file">
      <ToastContainer />
      <div className="overlay" onClick={() => handleShowModal()}></div>
      <div className="modal-import-file-content">
        <h3>Nhập file</h3>
        <div className="import-form">
          <span>Chọn file excel</span>
          <div className="form-content">
            <div>
              <input id="input" type={"file"} onChange={(e) => hanldeFile(e)} />
            </div>
            <div className="reset-btn" onClick={() => onChangeInput()}>
              Đặt lại
            </div>
            <div className="download-btn" onClick={() => createDownLoadData()}>
              Download file mẫu
            </div>
          </div>
        </div>
        {valueSelect !== "" && dataExcel && dataExcel.length > 0 ? (
          ""
        ) : (
          <div className="select-form col-3">
            <label>Thương hiệu</label>
            <select
              onChange={(e) => onChangeSelect(e.target.value)}
              value={valueSelect}
            >
              <option value={""}>Tất cả</option>
              {manufacture &&
                manufacture &&
                manufacture.map((item, key) => {
                  return (
                    <option key={key} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
        )}

        {dataExcel && dataExcel.length > 0 && valueSelect !== "" && (
          <div className="grid-table">
            <TableExcel
              data={dataExcel}
              tenThuongHieu={nameManafacture}
              component={"modal"}
            />
          </div>
        )}
        <div className="button-group d-flex align-content-center justify-content-center">
          <div className="save-btn btn-item" onClick={() => handleSaveClick()}>
            Lưu
          </div>
          <div className="close-btn btn-item" onClick={() => handleShowModal()}>
            Đóng
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalImportFile;
