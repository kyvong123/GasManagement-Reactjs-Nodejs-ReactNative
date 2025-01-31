import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { DatePicker } from "antd";
import orderManagement from "../../../../api/orderManagementApi";
import { createOrderSupplierFetch } from "../../hooks/createOrderSupplierFetch";
import getPriceOder from "../../../../api/getPriceOder";
import ToastMessage from "../../../helpers/ToastMessage";
import moment from "moment";
import Select from 'react-select'
import axiosClient from "../../../../api/axiosClient";
const AdminCreate = ({
  handlePrice,
  cylinderType,
  handleChangeCustomer,
  handleSuplier,
  valueOfUser,
  setValueOfUser,
  valueDate,
  setValueDate,
  handleChangeDate,
  handleChangeAddress,
  isReset,
  orderArray,
  setOrderArray,
  handleAdd,
  handleDelete,
  userRole,
  createOrderDate,
  setCreateOrderDate,
  handleNewPrice,
  placeOfDelivery
}) => {
  const [agency, setAgency] = useState("");
  const [customerType, setCustomerType] = useState([]);
  const [address, setAddress] = useState([]);
  const [customer, setCustomer] = useState("");
  const [ngay, setNgay] = useState();
  const [changeDate, setChangeDate] = useState([{ deliveryDate: "" }]);
  const [check, setCheck] = useState(false);

  // const
  const stationRef = useRef("");
  const areaRef = useRef("");
  const agencyRef = useRef("");
  const { station, area, setValueStation, userCookies, valueStation } = createOrderSupplierFetch();
  const nodeRef1 = useRef(false);
  const nodeRef2 = useRef(false);

  useEffect(() => {
    setOrderArray([1]);
    setValueDate([{ value: "" }]);
    setAgency("");
    setCustomerType([]);
    setAddress([]);
    setCheck(false);
    stationRef.current.value = "";
    areaRef.current.value = "";
    agencyRef.current.value = "";
  }, [isReset]);

  const handleAgency = (e) => {
    setAgency(e.target.value);
  };

  useEffect(() => {
    const loadLocation = async () => {
      if(!valueStation || valueStation === "") return;
      const res = await axiosClient.post(
        "/user/getInforById",
        {
          id: valueStation,
        },
        {
          headers: {
            Authorization: "Bearer " + userCookies.token,
          },
        }
      );
      if(res.status) {
        setAddress([res.data])
      }
    } 
    if(placeOfDelivery === "STATION") {
      loadLocation();
    }
  }, [placeOfDelivery, valueStation])

  useEffect(() => {
    if (cylinderType) {
      const getPrice = async () => {
        const res = await getPriceOder(ngay, customer, cylinderType);
        if (res.data.success) {
          handlePrice(res.data.data);
        } else {
          ToastMessage("error", "Không tìm thấy bảng giá");
          handlePrice([]);
        }
      };
      getPrice();
    } else {
      return;
    }
  }, [cylinderType,handleNewPrice]);

  useEffect(() => {
    console.log(check);
    if(check) {
      setCreateOrderDate(moment().add(1, 'months').startOf('month'))
    }
    else {
      setCreateOrderDate(moment())
    }
  }, [check])

  const disabledDate = (current) => {
  // Can not select days before today and today
    return current && current < moment().add(1, "months").startOf('month');
  };
  // const [classStation, setClassStation] = useState('')
  const handleStation = (e) => {
    setValueOfUser({ ...valueOfUser, supplier: e.target.value });
    setValueStation(e.target.value);
    handleSuplier(e.target.value);
  };
  const handleArea = (e) => {
    setValueOfUser({ ...valueOfUser, area: e.target.value });
  };
  const handleCustomerType = async (e) => {
    setValueOfUser({ ...valueOfUser, customers: e.value });
    setCustomer(e.value);
    handleChangeCustomer(e.value);
    if (changeDate) {
      const res = await getPriceOder(
        changeDate[0].deliveryDate,
        e.value
      );
      console.log(res);
      if (res.data.success) {
        handlePrice(res.data.data.priceDetail);
      }
    }
  };

  useEffect(() => {
    if (!nodeRef1.current) {
      nodeRef1.current = true;
      return;
    }
    const getCustomer = async () => {
      try {
        if (!agency || !valueOfUser.supplier) {
          setCustomerType([]);
          setAddress([]);
          setValueOfUser({ ...valueOfUser, customers: "" });
          return;
        }

        let params = {
          customerType: agency,
          isChildOf: valueOfUser.supplier,
        };
        const res = await orderManagement.getTypeCustomer(params);
        if (res && res.data) {
          setCustomerType(res.data);
        } else {
          setCustomerType([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCustomer();
  }, [agency, valueOfUser.supplier]);

 
  useEffect(() => {
    if (!nodeRef2.current) {
      nodeRef2.current = true;
      return;
    }
    const getAddress = async () => {
      if(placeOfDelivery !== "CUSTOMER") return;
      try {
        const res = await orderManagement.getAddress(valueOfUser.customers);
        if (res && res.data) {
          setAddress(res.data);          
        } else {
          setAddress([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAddress();
  }, [valueOfUser.customers, placeOfDelivery]);

  useEffect(()=>{
    if(address.length>0){
      setValueOfUser({
        ...valueOfUser,
        delivery: [
            { deliveryAddress: address[0].address },
        ],
    });      
    }
  },[address]);

  const handleDate = async (date, index) => {
    handleChangeDate(date, index);
    let arr = [...changeDate];
    arr[index].deliveryDate = date.toISOString();
    setChangeDate([...arr]);
    setNgay(arr[0].deliveryDate);

    if (customer) {
      if (cylinderType) {
        const res = await getPriceOder(
          arr[0].deliveryDate,
          customer,
          cylinderType
        );
        if (res.data.success) {
          handlePrice(res.data);
        } else {
          ToastMessage("error", "KHông tìm thấy bảng giá");
          handlePrice([]);
        }
      } else {
        const res = await getPriceOder(arr[0].deliveryDate, customer, "BINH");
        if (res.data.success) {
          handlePrice(res.data.data);
        } else {
          ToastMessage("error", "Không tìm thấy bảng giá");
          handlePrice([]);
        }
      }
    }
  };
  const handleAddOrder = () => {
    handleAdd();
    let cloneArr = [...changeDate];
    let item = { deliveryDate: "" };
    cloneArr.push(item);
    setChangeDate([...cloneArr]);
  };
  const handleDeleteOrder = (index) => {
    handleDelete(index);
    let cloneArr = [...changeDate];
    cloneArr.splice(index, 1);
    setChangeDate([...cloneArr])
  }

  return (
    <div className="tram_container">
      <div className="tram_title">
        <div>Trạm</div>
        <div>Vùng</div>
        <div>Đối tượng</div>
      </div>
      <div className="tram_content">
        <div>
          <select onChange={handleStation} ref={stationRef}>
            <option value="">Chọn trạm</option>
            {station.map((d, i) => (
              <option key={i} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select onChange={handleArea} ref={areaRef}>
            <option value="">Chọn khu vực</option>
            {area.map((d, i) => (
              <option key={i} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="tram_content_tong_dai_ly">
          <div>
            <select onChange={handleAgency} ref={agencyRef}>
              <option value="">Chọn đối tượng</option>
              <option value="Industry">Khách hàng công nghiệp bình</option>
              <option value="Distribution">Tổng đại lý</option>
              <option value="Agency">Đại lý</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tram_title">
        <div>Khách hàng</div>
        <div>Địa chỉ giao hàng</div>
        <div>Ngày giao hàng</div>
      </div>

      {orderArray.map((data, index) => (
        <div key={index} className="tram_order">
          {index === 0 ? (
            <div id="select-name-customer">
              <form style={{ width: "250px", position: "relative" }}>
                <Select
                  isClearable={false}
                  // key={`my_unique_select_key__${customerValue}`}
                  defaultValue={""}
                  value={customer}
                  placeholder={"Chọn khách hàng"}
                  onChange={(e) => handleCustomerType(e)}
                  id="name-customer"
                  options={
                    customerType &&
                    customerType.length > 0 &&
                    customerType.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  }
                  // menuPortalTarget={document.body}
                />
              </form>
            </div>
          ) : (
            <div
              className="tram_order_detail"
              style={{ opacity: "0", visibility: "hidden" }}
            >
              <select onChange={(e) => handleCustomerType(e)}>
                <option value="">Chọn Khách hàng</option>
                {customerType.map((d, i) => (
                  <option key={i} value={d.id}>
                    {d.code} -{d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="tram_order_detail">
            <select onChange={(e) => handleChangeAddress(e, index)}>
              {address.length >= 1 ? (
                address.map((d) => (
                  <option key={d.id} value={d.address}>
                    {d.address}
                  </option>
                ))
              ) : (
                <option value="">Chọn địa chỉ</option>
              )}
            </select>
          </div>
          <div className="tram_order_detail">
            <div>
              <div>
                <DatePicker
                  value={valueDate[index] ? valueDate[index].value : ""}
                  onChange={(date) => handleDate(date, index)}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                />
                <div
                  className="order_info_address_add"
                  onClick={
                    index === 0
                      ? () => handleAddOrder()
                      : () => handleDeleteOrder(index)
                  }
                >
                  {index === 0 ? <FaPlus /> : <FaMinus />}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {userRole === 2 ? (
        <div>
          <div className="tram_title ngay_tao_don">
            <div>Ngày tạo đơn</div>
          </div>
          <div className="tram_order ngay_tao_don">
            <div className="tram_order_detail">
              <DatePicker
                value={createOrderDate}
                onChange={(date) => setCreateOrderDate(date)}
                disabled={!check}
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
              />
              <div className="checkbox_tao_don">
                <input
                  type="checkbox"
                  // defaultValue={check}
                  checked={check}
                  onChange={() => setCheck((prev) => !prev)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminCreate;
