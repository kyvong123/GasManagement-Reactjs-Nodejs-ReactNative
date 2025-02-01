import React, { Fragment, useContext, useState } from "react";
import "./TableExcel.scss";
import ModalUpdate from "./ModalUpdate";
import { AiTwotoneEdit } from "react-icons/ai";
import { themeContext } from "../context/Provider";
function TableExcel({
  data,
  tenThuongHieu,
  type,
  component,
  categoryCylinder,
}) {
  const { addItemCheck, resetItemCheck } = useContext(themeContext);
  const [showModal, setShowModal] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const handleShowModalUpdate = (data) => {
    setShowModal(!showModal);
    if (!showModal) {
      setDataItem(data);
      console.log(data);
      addItemCheck(
        {
          nameStation: data.nameStation,
          idCustomer: data.idKhachHang,
        },
        data.LoaiGia,
        data.idThuongHieu
      );
    } else {
      resetItemCheck();
    }
  };
  return (
    <Fragment>
      {showModal && (
        <ModalUpdate
          categoryCylinder={categoryCylinder}
          data={dataItem}
          type={type}
          showModalUpdate={() => handleShowModalUpdate()}
        />
      )}
      <div className="table-container" style={{ marginTop: "20px" }}>
        <div className="table-content">
          <div className="header-title" style={{ textAlign: "start" }}>
            <h4>{data[0].NameManafacture || tenThuongHieu}</h4>
          </div>
          <div className="table-content">
            <table
              style={{ textAlign: "center" }}
              className="table table-bordered"
            >
              <thead style={{ backgroundColor: "#459348" }}>
                <tr>
                  <th rowSpan={2} scope="col">
                    Trạm
                  </th>
                  <th rowSpan={2} scope="col">
                    Mã khách hàng{" "}
                  </th>
                  <th rowSpan={2} scope="col">
                    Tên khách hàng
                  </th>
                  <th colSpan={4} scope="col">
                    Giá bán (VND)
                  </th>
                  <th rowSpan={2} scope="col">
                    Ngày bắt đầu
                  </th>
                  <th rowSpan={2} scope="col">
                    Ngày kết thúc
                  </th>
                  {component === "modal" ? (
                    ""
                  ) : (
                    <th rowSpan={2} scope="col">
                      thao tác
                    </th>
                  )}
                </tr>
                <tr>
                  <th scope="col">
                    {type === "Cylinders" ? "Vỏ bình 6kg" : "Bình 6kg"}
                  </th>
                  <th scope="col">
                    {type === "Cylinders" ? "Vỏ bình 12kg" : "Bình 12kg"}
                  </th>
                  <th scope="col">
                    {type === "Cylinders" ? "Vỏ bình 20kg" : "Bình 20kg"}
                  </th>
                  <th scope="col">
                    {type === "Cylinders" ? "Vỏ bình 45kg" : "Bình 45kg"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((item, key) => {
                    return (
                      <tr key={key}>
                        <th className="left">{item.nameStation}</th>
                        <td className="left">{item.customerCode}</td>
                        <td className="left">{item.customerName}</td>
                        <td className="right">
                          {new Intl.NumberFormat({
                            maximumSignificantDigits: 3,
                          }).format(item.mass6)}
                        </td>
                        <td className="right">
                          {new Intl.NumberFormat({
                            maximumSignificantDigits: 3,
                          }).format(item.mass12)}
                        </td>
                        <td className="right">
                          {new Intl.NumberFormat({
                            maximumSignificantDigits: 3,
                          }).format(item.mass20)}
                        </td>
                        <td className="right">
                          {new Intl.NumberFormat({
                            maximumSignificantDigits: 3,
                          }).format(item.mass45)}
                        </td>
                        <td className="right">{item.date_start}</td>
                        <td className="right">{item.date_end}</td>
                        {component !== "modal" ? (
                          <td>
                            <AiTwotoneEdit
                              onClick={() => handleShowModalUpdate(item)}
                              className="icon"
                            />
                          </td>
                        ) : (
                          ""
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TableExcel;
