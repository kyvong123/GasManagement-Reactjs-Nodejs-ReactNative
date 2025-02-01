import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import "./ModalCreatePrice.scss";
import priceManagement from "../../../../../api/PriceManagerAPI";
import { toast, ToastContainer } from "react-toastify";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { compareDate } from "../../../../helpers/handleDate";
import ToastMessage from "../../../../helpers/ToastMessage";
import { themeContext } from "../context/Provider";

function ModalCreatePrice({
  categoryCylinder,
  manufacture,
  handleShowModal,
  type,
  station,
  userID,
  setIsRefresh,
}) {
  const {
    checkTimeCreate,
    addItemCheck,
    removeItemCheck,
    sortItemCheck,
    resetItemCheck,
  } = useContext(themeContext);

  const [addItem, setAddItem] = useState([]);

  const [customer, setCustomer] = useState([]);

  const [isNext, setIsNext] = useState(false);

  const [stationValue, setStationValue] = useState("");
  const [customerValue, setCustomerValue] = useState("");
  const [manufactureID, setManufactureID] = useState("");

  const [typeCustomer, setTypeCustomer] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [priceBinh6, setPriceBinh6] = useState(0);
  const [priceBinh12, setPriceBinh12] = useState(0);
  const [priceBinh20, setPriceBinh20] = useState(0);
  const [priceBinh45, setPriceBinh45] = useState(0);

  const [idBinh6, setIdBinh6] = useState("");
  const [idBinh12, setIdBinh12] = useState("");
  const [idBinh20, setIdBinh20] = useState("");
  const [idBinh45, setIdBinh45] = useState("");

  //#region fist step
  //select header first step

  //select header
  const onChangeSelectStation = (e) => {
    setStationValue(e.target.value);
    setTypeCustomer("");
    setCustomerValue("");
  };
  const onChangeSelectCustomer = (e) => {
    if (e.value !== null) {
      setCustomerValue(e.value);
    } else {
      setCustomerValue("");
    }
  };
  const onChangeSelectType = (e) => {
    setTypeCustomer(e.target.value);
    setCustomerValue("");
  };

  //logic
  //lấy danh sách khách hàng
  useEffect(() => {
    if (typeCustomer !== "" && stationValue !== "") {
      const getCustomer = async () => {
        let params = {
          customerType: typeCustomer,
          isChildOf: stationValue,
        };
        const res = await priceManagement.getCustomer(
          stationValue,
          typeCustomer
        );
        if (res && res.data) {
          setCustomer(res.data);
        } else {
          setCustomer([]);
        }
      };
      getCustomer();
    } else {
      setCustomer([]);
    }
  }, [typeCustomer, stationValue]);
  useEffect(() => {
    if (!checkTimeCreate(toDate, addItem)) setToDate();
    if (!checkTimeCreate(fromDate, addItem)) setFromDate();
  }, [manufactureID])
  //sự kiện thêm khách hàng vào hàng chờ
  const handleOnClickAdd = () => {
    if (stationValue === "" || customerValue === "") {
      toast.warning("Chưa chọn khách hàng");
    } else {
      if (addItem.length === 0) {
        const newArr = [...addItem];
        let obj = {};

        let filterCustomer = customer.filter((item) => {
          return item.isChildOf === stationValue && item.id === customerValue;
        });
        let filterStation = station.filter((item) => {
          return item.id === stationValue;
        });
        for (let i of filterCustomer) {
          for (let i of filterStation) {
            obj.nameStation = i.name;
          }
          obj.idCustomer = i.id;
          obj.idManafacture = i.isChildOf;
          obj.nameCustomer = i.name;
          obj.userType =
            i.userType === "Agency"
              ? "Đại lý"
              : i.userType === "Industry"
              ? "Khách hàng công nghiệp bình"
              : "Tổng đại lý";
          newArr.push(obj);
        }
        addItemCheck(obj, type === "Gas" ? "BINH" : "VO");
        setAddItem([...newArr]);
      } else {
        let check = addItem.find(
          (i) =>
            i.idManafacture === stationValue && i.idCustomer === customerValue
        );
        if (check) {
          toast.warning("Dữ liệu bì trùng!");
        } else {
          const newArr = [];
          let obj = {};

          let filterCustomer = customer.filter((item) => {
            return item.isChildOf === stationValue && item.id === customerValue;
          });

          let filterStation = station.filter((item) => {
            return item.id === stationValue;
          });
          for (let i of filterCustomer) {
            for (let i of filterStation) {
              obj.nameStation = i.name;
            }
            obj.idCustomer = i.id;
            obj.idManafacture = i.isChildOf;
            obj.nameCustomer = i.name;
            obj.userType =
              i.userType === "Agency"
                ? "Đại lý"
                : i.userType === "Industry"
                ? "Khách hàng công nghiệp bình"
                : "Tổng đại lý";
            newArr.push(obj);
          }
          addItemCheck(obj, type === "Gas" ? "BINH" : "VO");
          setAddItem(addItem.concat([...newArr]));
        }
      }
    }
  };
  //sự kiện xóa khách hàng trong hàng chờ
  const handleDelete = (i) => {
    const newArr = [...addItem];
    const value = { ...newArr[i] };
    newArr.splice(i, 1);
    removeItemCheck(value);
    setAddItem([...newArr]);
  };
  //#endregion first step

  //#region last step
  // thương hiệu
  const handleOnChangeManafacture = (e) => {
    setManufactureID(e);
    sortItemCheck(e);
  };
  // Ngày
  const onChangeFromDate = (date) => {
    if (checkTimeCreate(date.startOf("day"), addItem)) setFromDate(date);
    // setfromDate(e)
  };
  const onChangeToDate = (date) => {
    if (compareDate(date, fromDate) != -1) {
      if (checkTimeCreate(date.endOf("day"), addItem)) setToDate(date);
    } else {
      ToastMessage("error", "Vui lòng chọn ngày lớn hơn trước đó");
    }

    // setToDate(e)
  };
  const onChangeInputPrice6 = (e) => {
    setPriceBinh6(e);
  };
  const onChangeInputPrice12 = (e) => {
    setPriceBinh12(e);
  };
  const onChangeInputPrice20 = (e) => {
    setPriceBinh20(e);
  };
  const onChangeInputPrice45 = (e) => {
    setPriceBinh45(e);
  };

  const CreatePrice = async (body) => {
    const res = await priceManagement.CreatePrice(body);
    if (res && res.success) {
      setIsRefresh(true);
      return res.success;
    } else return res.success;
  };

  const handleClearCustomer = () => {
    setCustomerValue("");
  };

  //sự kiện tạo đơn giá

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const CreatePriceValue = {};
    let customerlst = [];
    let cylinderPrice = [];

    for (let i of addItem) {
      let objCustomer = {};
      objCustomer.customer = i.idCustomer;
      customerlst.push(objCustomer);
    }
    let uniqueChars = [...new Set(customerlst)];

    let objCylinder6 = {};
    let objCylinder12 = {};
    let objCylinder20 = {};
    let objCylinder45 = {};
    if (priceBinh6 !== null) {
      objCylinder6.price = priceBinh6;
      objCylinder6.categoryCylinder = idBinh6;

      cylinderPrice.push(objCylinder6);
    }
    if (priceBinh12 !== null) {
      objCylinder12.price = priceBinh12;
      objCylinder12.categoryCylinder = idBinh12;

      cylinderPrice.push(objCylinder12);
    }
    if (priceBinh20 !== null) {
      objCylinder20.price = priceBinh20;
      objCylinder20.categoryCylinder = idBinh20;

      cylinderPrice.push(objCylinder20);
    }
    if (priceBinh45 !== null) {
      objCylinder45.price = priceBinh45;
      objCylinder45.categoryCylinder = idBinh45;

      cylinderPrice.push(objCylinder45);
    }

    if (
      (priceBinh6 == 0 &&
        priceBinh12 == 0 &&
        priceBinh20 == 0 &&
        priceBinh45 == 0) ||
      manufactureID === "" ||
      !fromDate ||
      !toDate ||
      userID === "" ||
      customerlst.length === 0
    ) {
      const frdate = document.getElementById("from-date");
      const todate = document.getElementById("to-date");
      const errth = document.getElementById("thuong-hieu");
      const err6 = document.getElementById("price6");
      const err12 = document.getElementById("price12");
      const err20 = document.getElementById("price20");
      const err45 = document.getElementById("price45");
      if (priceBinh6 === null) {
        $(err6).addClass("error");
      } else {
        $(err6).removeClass("error");
      }
      if (manufactureID === "") {
        $(errth).addClass("error");
      } else {
        $(errth).removeClass("error");
      }
      if (priceBinh12 === null) {
        $(err12).addClass("error");
      } else {
        $(err12).removeClass("error");
      }

      if (priceBinh20 === null) {
        $(err20).addClass("error");
      } else {
        $(err20).removeClass("error");
      }

      if (priceBinh45 === null) {
        $(err45).addClass("error");
      } else {
        $(err45).removeClass("error");
      }

      if (!fromDate) {
        $(frdate).addClass("error");
      } else {
        $(frdate).removeClass("error");
      }
      if (!toDate) {
        $(todate).addClass("error");
      } else {
        $(todate).removeClass("error");
      }
      toast.error("vui lòng nhập đủ thông tin!");
    } else {
      CreatePriceValue.userId = userID;
      CreatePriceValue.cylinderType = type === "Gas" ? "BINH" : "VO";
      CreatePriceValue.note = `tạo đơn cho ${CreatePriceValue.cylinderType}`;
      CreatePriceValue.fromDate = moment(fromDate).toISOString();
      CreatePriceValue.toDate = moment(toDate).toISOString();
      CreatePriceValue.manufacture = manufactureID;
      CreatePriceValue.customerlst = customerlst;
      CreatePriceValue.typeCylinderDetail = cylinderPrice;

      const res = await CreatePrice(CreatePriceValue);
      if (res) {
        toast.success("Tạo đơn thành công");
        setIsRefresh(true);
        handleShowModal();
      } else {
        toast.error("Tạo đơn thất bại");
        handleShowModal();
      }
    }
  };
  //#endregion last step
  const handleNextStep = () => {
    if (addItem.length !== 0) {
      setIsNext(true);
    }
  };
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

  return (
    <div className="modal-create">
      <ToastContainer />
      <div className="overlay" onClick={() => handleShowModal()}></div>
      {!isNext && (
        <div className="modal-create-content">
          <h3>Bước 1 - Nhập thông tin khách hàng</h3>
          <div className="select-form-group">
            <div className="select-form-item col-3">
              <label>Trạm</label>
              <select onChange={(e) => onChangeSelectStation(e)}>
                <option value="">Chọn trạm</option>
                {station &&
                  station.length > 0 &&
                  station.map((item, key) => {
                    return (
                      <option key={key} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="select-form-item col-3">
              <label>Đối tượng khách hàng</label>
              <select
                value={typeCustomer}
                onChange={(e) => onChangeSelectType(e)}
              >
                <option value="">Chọn đối tượng</option>
                <option value="Industry">Khách hàng công nghiệp bình</option>
                <option value="Distribution">Tổng đại lý</option>
                <option value="Agency">Đại lý</option>
              </select>
            </div>
            <div className="select-form-item col-3">
              <label>Tên khách hàng</label>
              <form style={{ width: "350px", position: "relative" }}>
                <Select
                  isClearable={false}
                  key={`my_unique_select_key__${customerValue}`}
                  defaultValue={""}
                  value={customerValue}
                  placeholder={"Chọn khách hàng"}
                  onChange={(e) => onChangeSelectCustomer(e)}
                  id="name-customer"
                  options={
                    customer &&
                    customer.length > 0 &&
                    customer.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  }
                  menuPortalTarget={document.body}
                ></Select>
                {customerValue !== "" ? (
                  <span className="clear_select" onClick={handleClearCustomer}>
                    x
                  </span>
                ) : null}
              </form>
            </div>
            <div
              className="select-form-item add-btn col-2"
              onClick={() => handleOnClickAdd()}
            >
              <span>Thêm</span>
            </div>
          </div>
          <div className="group-item-create">
            <div className="header-title group-item">
              <div className="header-item col">
                <span>Trạm</span>
              </div>
              <div className="header-item col">
                <span>Đối tượng khách hàng</span>
              </div>
              <div className="header-item col">
                <span>Tên khách hàng</span>
              </div>
              <div className="header-item col-2">
                <span>Thao tác</span>
              </div>
            </div>
            {addItem &&
              addItem.length > 0 &&
              addItem.map((item, index) => {
                return (
                  <div className="content-group" key={index}>
                    <div className="content-item col">
                      <span>{item.nameStation}</span>
                    </div>
                    <div className="content-item col">
                      <span>{item.userType}</span>
                    </div>
                    <div className="content-item col">
                      <span>{item.nameCustomer}</span>
                    </div>
                    <div
                      className="content-item delete-btn col-2"
                      onClick={() => handleDelete(index)}
                    >
                      <span>Xóa</span>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="button-group d-flex align-content-center justify-content-center">
            <div
              className="next-btn btn-item col-2"
              onClick={() => handleNextStep()}
            >
              Tiếp tục
            </div>
            <div
              className="close-btn btn-item col-2"
              onClick={() => handleShowModal()}
            >
              Đóng
            </div>
          </div>
        </div>
      )}
      {isNext && (
        <div className="modal-create-content">
          <h3>Bước 2 - Nhập giá bán</h3>
          <form onSubmit={(e) => handleSaveClick(e)}>
            <div className="main-content-container">
              <div className="form-content">
                <div className="form-item title-group">
                  <h4>Thương hiệu</h4>
                  <div>
                    <h4>{type === "Gas" ? "Loại bình" : "Loại vỏ bình"}</h4>
                    <div
                      className="type-cylinder d-flex align-start flex-column"
                      style={{ gap: "3px" }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          padding: "5px",
                          marginLeft: "15px",
                        }}
                      >
                        {type === "Gas" ? `Bình 6Kg` : `Vỏ bình 6Kg`}
                      </span>
                      <span
                        style={{
                          fontWeight: "600",
                          padding: "5px",
                          marginLeft: "15px",
                        }}
                      >
                        {type === "Gas" ? `Bình 12Kg` : `Vỏ bình 12Kg`}
                      </span>
                      <span
                        style={{
                          fontWeight: "600",
                          padding: "5px",
                          marginLeft: "15px",
                        }}
                      >
                        {type === "Gas" ? `Bình 20Kg` : `Vỏ bình 20Kg`}
                      </span>
                      <span
                        style={{
                          fontWeight: "600",
                          padding: "5px",
                          marginLeft: "15px",
                        }}
                      >
                        {type === "Gas" ? `Bình 45Kg` : `Vỏ bình 45Kg`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-item form-input-group">
                  <select
                    id="thuong-hieu"
                    onChange={(e) => handleOnChangeManafacture(e.target.value)}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {manufacture &&
                      manufacture.length > 0 &&
                      manufacture.map((item, key) => {
                        return (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                  <div style={{ marginTop: "10px" }}>
                    <h4>Giá bán</h4>
                    <div
                      style={{ gap: "2px" }}
                      className="type-cylinder d-flex align-start flex-column"
                    >
                      <div className="price-sell">
                        <input
                          id="price6"
                          onChange={(e) => onChangeInputPrice6(e.target.value)}
                          className="form-control"
                          type={"number"}
                        ></input>
                        <div className="price-sell-show">
                          {priceBinh6 > 0
                            ? priceBinh6
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""}
                        </div>
                      </div>
                      <div className="price-sell">
                        <input
                          id="price12"
                          onChange={(e) => onChangeInputPrice12(e.target.value)}
                          className="form-control"
                          type={"number"}
                        ></input>
                        <div className="price-sell-show">
                          {priceBinh12 > 0
                            ? priceBinh12
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""}
                        </div>
                      </div>
                      <div className="price-sell">
                        <input
                          id="price20"
                          onChange={(e) => onChangeInputPrice20(e.target.value)}
                          className="form-control"
                          type={"number"}
                        ></input>
                        <div className="price-sell-show">
                          {priceBinh20 > 0
                            ? priceBinh20
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""}
                        </div>
                      </div>
                      <div className="price-sell">
                        <input
                          id="price45"
                          onChange={(e) => onChangeInputPrice45(e.target.value)}
                          className="form-control"
                          type={"number"}
                        ></input>
                        <div className="price-sell-show">
                          {priceBinh45 > 0
                            ? priceBinh45
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-item date-picker-group">
                  <DatePicker
                    id={"from-date"}
                    placeholder="Từ ngày"
                    format="DD/MM/YYYY"
                    onChange={onChangeFromDate}
                    value={fromDate}
                  />
                  <DatePicker
                    id={"to-date"}
                    placeholder="Đến ngày"
                    format="DD/MM/YYYY"
                    onChange={onChangeToDate}
                    value={toDate}
                  />
                </div>
              </div>
            </div>
            <div
              style={{ marginTop: "20px" }}
              className="button-group d-flex align-content-center justify-content-center"
            >
              <button className="save-btn btn-item col-2">Lưu</button>
              <div
                className="close-btn btn-item col-2"
                onClick={() => handleShowModal()}
              >
                Đóng
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ModalCreatePrice;
