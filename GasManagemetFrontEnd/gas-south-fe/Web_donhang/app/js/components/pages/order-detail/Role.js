import React, { useState, useEffect } from "react";
import Index from "./Index";
import orderManagement from "../../../../api/orderManagementApi";

function Role({ role, status, data, handleOpenModalEditOrder, handleClose }) {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataH, setDataH] = useState([]);
  const [confirmHistory, setConfirmHistory] = useState([]);

  useEffect(() => {
    const getRole = async () => {
      const dataOrderDetail = await orderManagement.detailOrder(data.id);
      setDataOrder(dataOrderDetail.data);
    };
    getRole();
  }, [data.id]);

  useEffect(() => {
    const getHistory = async () => {
      const dataHistory = await orderManagement.detailHistoryOrder(data.id);
      setDataH(dataHistory.data);
    };
    getHistory();
  }, [data.id]);

  useEffect(() => {
    const getConfirmHistory = async () => {
      const orderConfirmHistory = await orderManagement.getOrderConfirmHistory(
        data.id
      );
      setConfirmHistory(orderConfirmHistory.data);
    };
    getConfirmHistory();
  }, [data.id]);

  console.log("BE", handleClose);
  return (
    <div>
      {role == "KH" ? (
        <Index
          handleOpenModalEditOrder={handleOpenModalEditOrder}
          handleClose={handleClose}
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role == "phongKD" ? (
        <Index
          handleOpenModalEditOrder={handleOpenModalEditOrder}
          handleClose={handleClose}
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role == "Truong-Tram" ? (
        <Index
          status={status}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role === "TPKDCT" ? (
        <Index
          status={status}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role === "TO_NHAN_LENH" ? (
        <Index
          handleOpenModalEditOrder={handleOpenModalEditOrder}
          handleClose={handleClose}
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role === "Truong_phongKD" ? (
        <Index
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role === "KE_TOAN" ? (
        <Index
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
      {role === "DIEU_DO_TRAM" ? (
        <Index
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          setDataOrder={setDataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
          handleClose={handleClose}
        />
      ) : (
        ""
      )}
      {role === "Pho_giam_docKD" ? (
        <Index
          status={status}
          role={role}
          data={data}
          datadetail={dataOrder}
          datahistory={dataH}
          confirmHistory={confirmHistory}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Role;
