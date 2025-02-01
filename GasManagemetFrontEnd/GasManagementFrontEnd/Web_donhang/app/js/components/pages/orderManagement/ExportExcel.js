import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import orderManagement from "../../../../api/orderManagementApi";
import * as ExcelJS from "exceljs";
import { logoInBase64 } from "./base64logo/logoExcel";
import moment from "moment";

export const createDownLoadData = async (data) => {
  if(data.length === 0) return;
  const url = await handleExport(data);
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", "xuat_hang.xlsx");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const handleExport = async (data) => {
  try {
    const wb = new ExcelJS.Workbook();

    console.log("data", data);

    for(let i = 0; i < data.length; i++) {
        // const res = await orderManagement.detailOrder(data[i].id);

        // excelJS

        const sheet2 = wb.addWorksheet(data[i].orderCode);

        const imageId1 = wb.addImage({
          base64: logoInBase64,
          extension: "png",
        });

        sheet2.addImage(imageId1, "A1:A3");

        sheet2.getCell("B1").value =
          "CÔNG TY TNHH KHÍ HÓA LỎNG VIỆT NAM - VT GAS";
        sheet2.getCell("B2").value =
          "Phòng 606,Tầng 6,Tòa nhà Waseco,số 10 Phố Quang,P.2,Q.Tân Bình,HCM ";
        sheet2.getCell("B3").value =
          "Điện thoại: (028) 39976821 / 39976822 - Fax: (028) 39976823";
        sheet2.getCell("G1").value = "Ký hiệu: 2.QTKD-oH-01";
        sheet2.getCell("G2").value = "Ngày ban hành: 02/2021";
        sheet2.getCell("G3").value = "Trang: 1/1";
        sheet2.getCell("A4").value = "LỆNH XUẤT HÀNG";
        sheet2.getCell("A5").value = "KIỂM PHIẾU XUẤT KHO";
        sheet2.getCell("F6").value = "Số LXH";
        sheet2.getCell("G6").value = data[i].orderCode;
        sheet2.getCell("F7").value = "Ngày";
        sheet2.getCell("G7").value = moment(data[i].delivery[0].deliveryDate).format("DD/MM/YYYY");
        sheet2.getCell("A8").value = "XUẤT CHO";
        sheet2.getCell("A9").value = "Khách hàng";
        sheet2.getCell(
          "A10"
        ).value = data[i].customers.name.toLocaleUpperCase();
        sheet2.getCell("C9").value = "Tên người nhận";
        sheet2.getCell("A13").value = "Code KH";
        sheet2.getCell("B13").value = data[i].customers.code;
        sheet2.getCell("C13").value = "Số xe";
        sheet2.getCell("A14").value = "NVTT";
        sheet2.getCell("A15").value = "Kho xuất";
        sheet2.getCell("B15").value = data[i].supplier.name;
        sheet2.getCell("A16").value = "Tên hàng";
        sheet2.getCell("C16").value = "Đơn vị tính";
        sheet2.getCell("E16").value = "Số lượng";
        sheet2.getCell("F16").value = "LPG (Kg)";
        sheet2.getCell("G16").value = "Ghi chú";
        sheet2.getCell("A32").value = "Tổng lượng gas";
        sheet2.getCell("A33").value = "Phòng Kế Toán";
        sheet2.getCell("A34").value =
          data[i].status === "DA_DUYET" || data[i].status === "DDTRAM_DUYET"
            ? "Đã duyệt"
            : "";
        sheet2.getCell("C33").value = "Phòng Kinh Doanh";
        sheet2.getCell("C34").value =
          data[i].status === "DDTRAM_DUYET"
            ? "Đã duyệt"
            : "";
        sheet2.getCell("F33").value = "KT. Giám Đốc";
        sheet2.getCell("F34").value =
          data[i].status === "DDTRAM_DUYET"
            ? "Đã duyệt"
            : "";
        sheet2.getCell("A36").value = "Thủ Kho";
        sheet2.getCell("A37").value =
          data[i].status === "DDTRAM_DUYET"
            ? "Đã duyệt"
            : "";
        sheet2.getCell("C36").value = "Điều Độ Trạm";
        sheet2.getCell("C37").value =
          data[i].status === "DDTRAM_DUYET"
            ? "Đã duyệt"
            : "";
        sheet2.getCell("F36").value = "Người Nhận Hàng";
        sheet2.getCell("G17").value = data[i].note;
        // sheet2.getCell("E32").value = { formula: "SUM(E17:E31)" };
        sheet2.getCell("F32").value = { formula: "SUM(F17:F31)" };

        // table
        const start = 17;
        const isDonBinh = data[i].orderType === "DON_BINH";

        data[i].orderDetail.map((item, i) => {
          const c = start + i;
          console.log(item);
          const name = item.categoryName;
          sheet2.getCell(`A${c}`).value = name;
          sheet2.getCell(`C${c}`).value = "Bình";
          sheet2.getCell(`E${c}`).value = item.quantity;
          sheet2.getCell(`F${c}`).value = isDonBinh
            ? item.quantity * item.categoryMass
            : 0;
        });
    }

    const workbookBlob = await wb.xlsx.writeBuffer();

    const dataInfo = {
      logo: "A1:A3",
      tenCty: "B1:F1",
      diachiCty: "B2:F2",
      sodienthoai: "B3:F3",
      kyhieu: "G1:H1",
      ngaybanhanh: "G2:H2",
      trang: "G3:H3",
      lenhxuathang: "A4:H4",
      kiemphieuxuatkho: "A5:H5",
      xuatcho: "A8:H8",
      solxh: "F6",
      gtsolxh: "G6:H6",
      ngay: "F7",
      gtngay: "G7:H7",
      khachhang: "A9:B9",
      gtkhachhang: "A10:B12",
      tennguoinhan: "C9:C12",
      soxe: "C13:C15",
      gttennguoinhan: "D9:H12",
      gtsoxe: "D13:H15",
      tenhang: "A16:B16",
      donvitinh: "C16:D16",
      ghichu: "G16:H16",
      soluong: "E16",
      lpg: "F16",
      phongketoan: "A33:B33",
      dphongketoan: "A34:B35",
      phongkinhdoanh: "C33:E33",
      dphongkinhdoanh: "C34:E35",
      ktgiamdoc: "F33:H33",
      dktgiamdoc: "F34:H35",
      quandockho: "A36:B36",
      dquandockho: "A37:B38",
      thukho: "C36:E36",
      dthukho: "C37:E38",
      nguoinhanhang: "F36:H36",
      dnguoinhanhang: "F37:H38",
    };

    const blob = new Blob([workbookBlob], {
      type: "application/octet-stream",
    });
    return addStyles(blob, dataInfo);
  } catch (e) {
  }
};

const addStyles = (workbookBlob, dataInfo) => {
  return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
    workbook.sheets().forEach((sheet) => {
      sheet.column("A").width(15);
      sheet.column("B").width(15);
      sheet.column("C").width(15);
      sheet.column("D").width(4.5);
      sheet.column("E").width(14.5);
      sheet.column("F").width(18.3);
      sheet.column("H").width(13);

      sheet
        .range(dataInfo.logo)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          bottomBorder: true,
        });
      sheet
        .range(dataInfo.tenCty)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
      sheet
        .range(dataInfo.diachiCty)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
      sheet
        .range(dataInfo.sodienthoai)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          bottomBorder: true,
        });
      sheet
        .range(dataInfo.kyhieu)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "left",
          verticalAlignment: "center",
          border: true,
        });
      sheet
        .range(dataInfo.ngaybanhanh)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "left",
          verticalAlignment: "center",
          border: true,
        });
      sheet
        .range(dataInfo.trang)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "left",
          verticalAlignment: "center",
          border: true,
        });
      sheet
        .range(dataInfo.lenhxuathang)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          rightBorder: true,
        });
      sheet
        .range(dataInfo.kiemphieuxuatkho)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          rightBorder: true,
        });
      sheet
        .range(dataInfo.xuatcho)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });
      sheet.cell("F6").style({
        horizontalAlignment: "left",
        verticalAlignment: "center",
        border: true,
      });
      sheet.cell("F7").style({
        horizontalAlignment: "left",
        verticalAlignment: "center",
        border: true,
      });
      sheet
        .range(dataInfo.gtngay)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontColor: "FF0000",
          border: true,
        });
      sheet
        .range(dataInfo.gtsolxh)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });
      sheet.cell("B13").style({
        horizontalAlignment: "left",
        fontColor: "2892D5",
      });
      sheet.cell("B14").style({
        horizontalAlignment: "left",
        fontColor: "2892D5",
      });
      sheet.cell("B15").style({
        horizontalAlignment: "left",
        fontColor: "2892D5",
      });
      sheet
        .range(dataInfo.khachhang)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
      sheet
        .range(dataInfo.gtkhachhang)
        .merged(true)
        .style({
          wrapText: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          bottomBorder: true,
          fontColor: "2892D5",
        });
      sheet
        .range(dataInfo.tennguoinhan)
        .merged(true)
        .style({
          wrapText: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          bottomBorder: true,
          leftBorder: true,
        });
      sheet
        .range(dataInfo.soxe)
        .merged(true)
        .style({
          leftBorder: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
      sheet
        .range(dataInfo.gttennguoinhan)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          leftBorder: false,
        });
      sheet
        .range(dataInfo.gtsoxe)
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          leftBorder: false,
        });
      sheet
        .range(dataInfo.tenhang)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });
      sheet
        .range(dataInfo.donvitinh)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });
      sheet
        .range(dataInfo.ghichu)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });

      sheet.cell(dataInfo.soluong).style({
        bold: true,
        horizontalAlignment: "center",
        verticalAlignment: "center",
        border: true,
      });
      sheet.cell(dataInfo.lpg).style({
        bold: true,
        horizontalAlignment: "center",
        verticalAlignment: "center",
        border: true,
      });

      for (let i = 17; i < 32; i++) {
        const r1 = `A${i}:B${i}`;
        sheet
          .range(r1)
          .merged(true)
          .style({
            horizontalAlignment: "left",
            verticalAlignment: "center",
            leftBorder: true,
          });
        const r2 = `C${i}:D${i}`;
        sheet
          .range(r2)
          .merged(true)
          .style({
            horizontalAlignment: "center",
            verticalAlignment: "center",
            leftBorder: true,
          });
        sheet.cell(`E${i}`).style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontColor: "2892d5",
          leftBorder: true,
          rightBorder: true,
        });
        sheet.cell(`F${i}`).style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          leftBorder: true,
        });
      }

      sheet.cell("A32").style({
        bold: true,
        horizontalAlignment: "center",
        verticalAlignment: "center",
        border: true,
      });
      sheet.cell("B32").style({
        horizontalAlignment: "center",
        verticalAlignment: "center",
        border: true,
      });

      sheet
        .range("C32:D32")
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });

      sheet.cell("E32").style({
        horizontalAlignment: "center",
        verticalAlignment: "center",
        bold: true,
        border: true,
      });

      sheet.cell("F32").style({
        horizontalAlignment: "center",
        verticalAlignment: "center",
        bold: true,
        border: true,
      });

      sheet
        .range("G32:H32")
        .merged(true)
        .style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });

      sheet
        .range(dataInfo.phongketoan)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "top",
          border: true,
          bottomBorder: false,
        });

      sheet
        .range(dataInfo.phongkinhdoanh)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "top",
          border: true,
          bottomBorder: false,
        });

      sheet
        .range(dataInfo.ktgiamdoc)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "top",
          border: true,
          bottomBorder: false,
        });

      sheet
        .range(dataInfo.quandockho)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "top",
          border: true,
          bottomBorder: false,
        });

      sheet
        .range(dataInfo.thukho)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "top",
          border: true,
          bottomBorder: false,
        });

      sheet
        .range(dataInfo.nguoinhanhang)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "top",
          border: true,
          bottomBorder: false,
        });

      sheet
        .range(dataInfo.dphongketoan)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          topBorder: false,
          fontColor: "ff0000",
        });

      sheet
        .range(dataInfo.dphongkinhdoanh)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          topBorder: false,
          fontColor: "ff0000",
        });

      sheet
        .range(dataInfo.dktgiamdoc)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          topBorder: false,
          fontColor: "ff0000",
        });

      sheet
        .range(dataInfo.dquandockho)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          topBorder: false,
          fontColor: "ff0000",
        });

      sheet
        .range(dataInfo.dthukho)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          topBorder: false,
          fontColor: "ff0000",
        });

      sheet
        .range(dataInfo.dnguoinhanhang)
        .merged(true)
        .style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
          topBorder: false,
          fontColor: "ff0000",
        });

      sheet
        .range("G17:H31")
        .merged(true)
        .style({
          wrapText: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          border: true,
        });
    });
    return workbook
      .outputAsync()
      .then((workbookBlob) => URL.createObjectURL(workbookBlob));
  });
};
