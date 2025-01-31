import React from "react";
import InforOrder from "./InforOrder";
import "./font.css";
import StatusDeliveried from "./Status/StatusDeliveried";
import StatusDelivery from "./Status/StatusDelivery";
import StatusNewOrder from "./Status/StatusNewOrder";
import StatusHalfDeli from "./Status/StatusHalfDeli";
import StatusApproved from "./Status/StatusApproved";
import StatusRefure2 from "./Status/StatusRefure2";
import StatusRefure1 from "./Status/StatusRefure1";
import StatusShipping from "./Status-Shipping/StatusShipping";
import StatusWaitOrder from "./Status/StatusWaitOrder";
import StatusReview from "./Status/StatusReview";
import StatusNotBrowse from "./Status/StatusNotBrowse";
import "./index.css";
function Index({
  status,
  data,
  datadetail,
  datahistory,
  role,
  confirmHistory,
  handleOpenModalEditOrder,
  handleClose,
  setDataOrder
}) {
  return (
    <div className="detail__container">
      <InforOrder
        status={status}
        data={data}
        datadetail={datadetail}
        role={role}
        handleOpenModalEditOrder={handleOpenModalEditOrder}
        handleClose={handleClose}
        setDataOrder={setDataOrder}
      />
      {/* <StatusShipping
        status={status}
        data={data}
        datadetail={datadetail}
        datahistory={datahistory}
        role={role}
      /> */}
      {status === "DON_HANG_MOI" ? (
        <StatusNewOrder datahistory={datahistory} />
      ) : status === "TU_CHOI_LAN_1" ? (
        <StatusRefure1 />
      ) : status === "TU_CHOI_LAN_2" ? (
        <StatusRefure2 />
      ) : status === "GUI DUYET LAI" ? (
        <StatusReview />
      ) : status === "DANG_GIAO" ? (
        <StatusDelivery
          status_1={status}
          data={data}
          datahistory={datahistory}
        />
      ) : status === "DA_GIAO" ? (
        <StatusDeliveried status_1={status} datahistory={datahistory} />
      ) : status === "DA_HOAN_THANH" ? (
        <StatusDeliveried status_1={status} datahistory={datahistory} />
      ) : status === "KHONG_DUYET" ? (
        <StatusNotBrowse confirmHistory={confirmHistory} role={role} status={status} />
      ) : status === "KHONG_DUYET" ? (
        <StatusNotBrowse
          status={status}
          data={data}
          datadetail={datadetail}
          datahistory={datahistory}

          confirmHistory={confirmHistory}
        />
      ) : status === "DANG_DUYET" ? (
        ""
      ) : status === "DA_DUYET" ? (
        ""
      ) : (
        ""
      )}
    </div>
  );
}

export default Index;
