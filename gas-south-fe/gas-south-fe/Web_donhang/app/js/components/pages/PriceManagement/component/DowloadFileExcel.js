import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import * as ExcelJS from "exceljs";

export const createDownLoadData = async () => {
  const url = await handleExport();
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", "xuat_hang.xlsx");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const handleExport = async () => {
  const wb = new ExcelJS.Workbook();

  // excelJS

  const sheet2 = wb.addWorksheet();

  sheet2.getCell("A1").value = "Mã khách hàng";
  sheet2.mergeCells("A1:A2");
  sheet2.getCell("B1").value = "Tên khách hàng";
  sheet2.mergeCells("B1:B2");
  sheet2.getCell("C1").value = "Giá bán(VND)";
  sheet2.mergeCells("C1:F1");
  sheet2.getCell("C2").value = "bình 6kg";
  sheet2.getCell("D2").value = "bình 12kg";
  sheet2.getCell("E2").value = "bình 20kg";
  sheet2.getCell("F2").value = "bình 45kg";
  sheet2.getCell("G1").value = "Ngày bắt đầu ";
  sheet2.mergeCells("G1:G2");
  sheet2.getCell("H1").value = "Ngày kết thúc";
  sheet2.mergeCells("H1:H2");
  sheet2.getCell("A3").value = "2282";
  sheet2.getCell("B3").value = "An Đại Phát";
  sheet2.getCell("C3").value = 100000;
  sheet2.getCell("D3").value = 200000;
  sheet2.getCell("E3").value = 300000;
  sheet2.getCell("F3").value = 400000;
  sheet2.getCell("G3").value = new Date("10 06 2014");
  sheet2.getCell("H3").value = new Date("10 06 2014");
  sheet2.getCell("A4").value = "00008864";
  sheet2.getCell("B4").value = "An Đại Phát";
  sheet2.getCell("C4").value = 100000;
  sheet2.getCell("D4").value = 200000;
  sheet2.getCell("E4").value = 300000;
  sheet2.getCell("F4").value = 400000;
  sheet2.getCell("G4").value = new Date("10 06 2014");
  sheet2.getCell("H4").value = new Date("10 06 2014");

  const workbookBlob = await wb.xlsx.writeBuffer();

  const blob = new Blob([workbookBlob], {
    type: "application/octet-stream",
  });
  return addStyles(blob);
};

const addStyles = (workbookBlob) => {
  return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
    return workbook
      .outputAsync()
      .then((workbookBlob) => URL.createObjectURL(workbookBlob));
  });
};
