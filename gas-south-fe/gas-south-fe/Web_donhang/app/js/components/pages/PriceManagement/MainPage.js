import React, { Fragment, useContext, useEffect, useState } from "react";
import "./MainPage.scss";
import Select from "react-select";
import TableExcel from "./component/TableExcel";
import ModalImportFile from "./component/ModalImportFile";
import ModalCreatePrice from "./component/ModalCreatePrice";
import { themeContext } from "./context/Provider";
import priceManagement from "../../../../api/PriceManagementAPI";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { Spin } from "antd";
export default function MainPage({ type }) {
  const {
    manufacture,
    station,
    categoryCylinder,
    userID,
    listPrice,
    filterData,
    setIsRefresh,
    isRefresh,
    loading,
    resetItemCheck,
  } = useContext(themeContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showModalImport, setShowModalImport] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [typeOpenModal, setTypeOpenModal] = useState("");

  const [valueStation, setValueStation] = useState("");
  const [valueTypeCustomer, setValueTypeCustomer] = useState("");
  const [valueManufacture, setValueManufacture] = useState("");
  const [valueCustomer, setValueCustomer] = useState("");
  const [listData, setListData] = useState([]);

  const [idBinh6, setIdBinh6] = useState("");
  const [idBinh12, setIdBinh12] = useState("");
  const [idBinh20, setIdBinh20] = useState("");
  const [idBinh45, setIdBinh45] = useState("");

  const [customer, setCustomer] = useState([]);
  //#region logic
  const handlesSetActive = (index, type) => {
    setActiveIndex(index);
    if (index === activeIndex) {
      setActiveIndex(0);
    }
    if ((type && index === 2) || index === 3) {
      setTypeOpenModal(type);
      setShowModalImport(!showModalImport);
    }
    if (index === 1) {
      handleShowModalCreate();
    }
  };

  useEffect(() => {
    filterTable();

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
  }, [listPrice, manufacture]);

  useEffect(() => {
    // if (type === 'Gas') {
    //     let dataBinh = listPrice.filter(i => i.LoaiGia === 'BINH')
    //     convertData(dataBinh)
    // } else {
    //     let dataVo = listPrice.filter(i => i.LoaiGia === 'VO')
    //     convertData(dataVo)
    // }
    filterTable();
  }, [isRefresh]);

  useEffect(() => {
    const getCustomer = async (id, type) => {
      let res = await priceManagement.getCustomer(id, type);
      if (res && res.data) {
        setCustomer(res.data);
      }
    };
    if (valueTypeCustomer !== "") {
      getCustomer(valueStation, valueTypeCustomer);
    }
  }, [valueTypeCustomer]);

  const convertData = (data) => {
    const filteredArr = data.reduce((acc, current) => {
      const x = acc.find(
        (item) =>
          item.NgayBatDau === current.NgayBatDau &&
          item.NgayKetThuc === current.NgayKetThuc &&
          item.idThuongHieu === current.idThuongHieu &&
          item.idTram === current.idTram &&
          item.idKhachHang === current.idKhachHang
      );

      if (!x) {
        let obj = {};
        obj.TenLoaiBinh = current.TenLoaiBinh;
        obj.Gia = current.Gia;
        obj.idLoaiBinh = current.idLoaiBinh;
        const newCurr = {
          NgayBatDau: current.NgayBatDau,
          NgayKetThuc: current.NgayKetThuc,

          LoaiGia: current.LoaiGia,
          MaKhachHang: current.MaKhachHang,
          TenTram: current.TenTram,
          TenThuongHieu: current.TenThuongHieu,
          TenKhachHang: current.TenKhachHang,

          typePriceId: current.typePriceId,
          idKhachHang: current.idKhachHang,
          idThuongHieu: current.idThuongHieu,
          idTram: current.idTram,
          data: [obj],
        };
        return acc.concat([newCurr]);
      } else {
        const currData = x.data.filter(
          (d) => d.idLoaiBinh === current.idLoaiBinh && d.Gia === current.Gia
        );
        if (!currData.length) {
          let obj = {};
          obj.TenLoaiBinh = current.TenLoaiBinh;
          obj.Gia = current.Gia;
          obj.idLoaiBinh = current.idLoaiBinh;

          const newData = x.data.push(obj);
          const newCurr = {
            NgayBatDau: current.NgayBatDau,
            NgayKetThuc: current.NgayKetThuc,

            LoaiGia: current.LoaiGia,
            MaKhachHang: current.MaKhachHang,
            TenTram: current.TenTram,
            TenThuongHieu: current.TenThuongHieu,
            TenKhachHang: current.TenKhachHang,

            typePriceId: current.typePriceId,
            idKhachHang: current.idKhachHang,
            idThuongHieu: current.idThuongHieu,
            idTram: current.idTram,
            data: newData,
          };
          return acc;
        } else {
          return acc;
        }
      }
    }, []);

    reChangeData(filteredArr);
  };
  const reChangeData = (data) => {
    let newData = [];
    let cloneData = [...data];
    cloneData.forEach(function(i) {
      i.nameStation = i.TenTram;
      i.customerCode = i.MaKhachHang;
      i.customerName = i.TenKhachHang;
      i.date_start = moment(i.NgayBatDau).format("DD/MM/YYYY");
      i.date_end = moment(i.NgayKetThuc).format("DD/MM/YYYY");
      i.NameManafacture = i.TenThuongHieu;

      if (i.data.length > 0) {
        const filterPriceMass6 = i.data.find((m) => m.idLoaiBinh === idBinh6);
        const filterPriceMass12 = i.data.find((m) => m.idLoaiBinh === idBinh12);
        const filterPriceMass20 = i.data.find((m) => m.idLoaiBinh === idBinh20);
        const filterPriceMass45 = i.data.find((m) => m.idLoaiBinh === idBinh45);

        if (filterPriceMass6) {
          i.mass6 = filterPriceMass6.Gia;
        } else {
          i.mass6 = 0;
        }

        if (filterPriceMass12) {
          i.mass12 = filterPriceMass12.Gia;
        } else {
          i.mass12 = 0;
        }

        if (filterPriceMass20) {
          i.mass20 = filterPriceMass20.Gia;
        } else {
          i.mass20 = 0;
        }
        if (filterPriceMass45) {
          i.mass45 = filterPriceMass45.Gia;
        } else {
          i.mass45 = 0;
        }
      }
      delete i.TenTram;
      delete i.MaKhachHang;
      delete i.TenKhachHang;
      delete i.NgayBatDau;
      delete i.NgayKetThuc;
      delete i.TenThuongHieu;
    });

    for (let i of manufacture) {
      const csm = cloneData.filter((o) => o.idThuongHieu === i.id);
      if (csm.length > 0) {
        newData.push(csm);
      }
    }
    setListData(newData);
  };

  const handleShowModalImport = () => {
    setShowModalImport(!showModalImport);
  };
  const handleShowModalCreate = () => {
    setShowModalCreate(!showModalCreate);
    if(showModalCreate)
      resetItemCheck();
  };
  //#endregion
  //#region
  const onChangeStation = (e) => {
    setValueStation(e.target.value);
    setValueTypeCustomer("");
    setValueManufacture("");
    setValueCustomer("");
    setCustomer([]);
  };
  const onChangeTypeCustomer = (e) => {
    setValueTypeCustomer(e.target.value);
    setValueManufacture("");
    setValueCustomer("");
  };
  const onChangeManafacture = (e) => {
    setValueManufacture(e.target.value);
  };
  const onChangeCustomer = (e) => {
    setValueCustomer(e.value);
  };

  const dataByType = (data) => {
    //trạm
    if (
      valueStation !== "" &&
      valueCustomer === "" &&
      valueManufacture === ""
    ) {
      let filter = data.filter((i) => i.idTram === valueStation);
      convertData(filter);
    }
    //trạm-thương hiệu
    else if (
      valueStation !== "" &&
      valueCustomer === "" &&
      valueManufacture !== ""
    ) {
      let filter = data.filter(
        (i) => i.idTram === valueStation && i.idThuongHieu === valueManufacture
      );
      convertData(filter);
    }
    //trạm-khách hàng
    else if (
      valueStation !== "" &&
      valueCustomer !== "" &&
      valueManufacture === ""
    ) {
      let filter = data.filter(
        (i) => i.idTram === valueStation && i.idKhachHang === valueCustomer
      );
      convertData(filter);
    }
    //trạm-khách hàng-thương hiệu
    else if (
      valueStation !== "" &&
      valueCustomer !== "" &&
      valueManufacture !== ""
    ) {
      let filter = data.filter(
        (i) =>
          i.idTram === valueStation &&
          i.idKhachHang === valueCustomer &&
          i.idThuongHieu === valueManufacture
      );
      convertData(filter);
    }
    //thương hiệu
    else if (
      valueStation === "" &&
      valueCustomer === "" &&
      valueManufacture !== ""
    ) {
      let filter = data.filter((i) => i.idThuongHieu === valueManufacture);
      convertData(filter);
    } else {
      convertData(data);
    }
  };
  const filterTable = () => {
    if (type === "Gas") {
      let data = listPrice.filter((i) => i.LoaiGia === "BINH");
      dataByType(data);
    } else {
      let data = listPrice.filter((i) => i.LoaiGia === "VO");
      dataByType(data);
    }
  };

  //#endregion
  return (
    <Fragment>
      {showModalCreate && (
        <ModalCreatePrice
          setIsRefresh={setIsRefresh}
          userID={userID}
          categoryCylinder={categoryCylinder}
          manufacture={manufacture}
          station={station}
          type={type}
          handleShowModal={handleShowModalCreate}
        />
      )}
      {showModalImport && (
        <ModalImportFile
          setIsRefresh={setIsRefresh}
          typeCylinder={type}
          userID={userID}
          station={station}
          manufacture={manufacture}
          type={typeOpenModal}
          handleShowModal={handleShowModalImport}
        />
      )}
      <div className="main-page-container">
        <ToastContainer />
        <div className="main-page-content">
          <div className="content-header">
            <div className="group-button">
              <div className="group-item">
                <h3 className="title">
                  {type === "Gas" ? "Thông tin giá gas" : "Thông tin giá vỏ"}
                </h3>
              </div>
              <div className="group-item d-flex align-content-center">
                <div
                  className={`item button-import`}
                  onClick={() => handlesSetActive(3, "update")}
                >
                  <div className="btn-item">Cập nhật bằng file excel</div>
                </div>
                <div
                  className={`item button-import`}
                  onClick={() => handlesSetActive(1)}
                >
                  <div className="btn-item">Khai báo thủ công</div>
                </div>
                <div
                  className={`item button-import`}
                  onClick={() => handlesSetActive(2, "create")}
                >
                  <div className="btn-item">Khai báo bằng file excel</div>
                </div>
              </div>
            </div>
            <div className="group-select"></div>
          </div>
          <div className="content-body">
            <div className="select-group">
              <div
                style={{ gap: "30px" }}
                className="d-flex align-content-center justify-content-between"
              >
                <div className="select-item col-2">
                  <div className="item-group">
                    <label>Trạm</label>
                    <select onChange={onChangeStation} value={valueStation}>
                      <option value="">Tất cả</option>

                      {station &&
                        station.length > 0 &&
                        station.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="select-item col-2">
                  <div className="item-group">
                    <label>Loại khách hàng</label>
                    <select
                      onChange={onChangeTypeCustomer}
                      value={valueTypeCustomer}
                    >
                      <option value="">Chọn đối tượng</option>
                      <option value="Industry">
                        Khách hàng công nghiệp bình
                      </option>
                      <option value="Distribution">Tổng đại lý</option>
                      <option value="Agency">Đại lý</option>
                    </select>
                  </div>
                </div>
                <div className="select-item col-2">
                  <div className="item-group">
                    <label>Tên khách hàng</label>
                    <form style={{ width: "250px", position: "relative" }}>
                      <Select
                        isClearable={false}
                        // key={`my_unique_select_key__${customerValue}`}
                        defaultValue={""}
                        value={valueCustomer}
                        placeholder={"Chọn khách hàng"}
                        onChange={onChangeCustomer}
                        id="name-customer"
                        options={
                          customer &&
                          customer.length > 0 &&
                          customer.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))
                        }
                        // menuPortalTarget={document.body}
                      ></Select>
                      {/* {customerValue !== "" ? <span className="clear_select" onClick={handleClearCustomer}>x</span> : null} */}
                    </form>
                  </div>
                </div>
                <div className="select-item col-2">
                  <div className="item-group">
                    <label>Thương hiệu</label>
                    <select
                      value={valueManufacture}
                      onChange={onChangeManafacture}
                    >
                      <option value="">Tất cả</option>
                      {manufacture &&
                        manufacture.length > 0 &&
                        manufacture.map((i, index) => {
                          return (
                            <option key={index} value={i.id}>
                              {i.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="search-btn" onClick={filterTable}>
                <span>xem</span>
              </div>
            </div>
            <div
              className="excel-table-container"
              style={{ textAlign: "center" }}
            >
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Spin
                    style={{ marginTop: "30px" }}
                    tip="Đang tải dữ liệu..."
                    size="large"
                  />
                </div>
              ) : (
                <div>
                  {listData && listData.length > 0 ? (
                    listData.map((item, key) => {
                      return (
                        <TableExcel
                          setIsRefresh={setIsRefresh}
                          categoryCylinder={categoryCylinder}
                          key={key}
                          manufacture={manufacture}
                          data={item}
                          type={type}
                        />
                      );
                    })
                  ) : (
                    <h3>Không có bảng giá</h3>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
