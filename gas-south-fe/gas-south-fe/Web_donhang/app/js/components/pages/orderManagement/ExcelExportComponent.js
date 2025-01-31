import React, { Fragment, useState } from "react";
import "./ExcelExportComponent.scss";
import { Modal, Button } from 'antd';
import { createDownLoadData } from "./ExportExcel";
import { renderPdf } from "./pdf/renderPDF";

const ExcelExportComponent = ({ data }) => {
  const [show, setShow] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleExcel = async () => {
    setLoadingExcel(true);
    await createDownLoadData([data]);
    handleCancel();
  };

  const handlePDF = async () => {
    setLoadingPDF(true);
    await renderPdf(data);
    handleCancel();
  }

  const handleCancel = () => {
    setLoadingExcel(false);
    setLoadingPDF(false);
    setShow(false);
  };

  return (
    <Fragment>
      <img
        src="icon/download.png"
        className="export-button"
        onClick={() => {
          console.log("click?");
          setShow(true);
        }}
      />
      <Modal centered visible={show} onCancel={handleCancel}>
        <div style={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <h3>Bạn muốn xuất file Excel hay PDF</h3>
        </div>
        <div
          style={{
            justifyContent: "end",
            display: "flex",
            padding: "10px",
            paddingTop: "0px",
            gap: "10px",
          }}
        >
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            loading={loadingExcel}
            key="excel"
            type="primary"
            onClick={handleExcel}
          >
            Excel
          </Button>
          <Button
            loading={loadingPDF}
            key="pdf"
            type="primary"
            onClick={handlePDF}
          >
            PDF
          </Button>
        </div>
      </Modal>
    </Fragment>
  );
};
export default ExcelExportComponent;
