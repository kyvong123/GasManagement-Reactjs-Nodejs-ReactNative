import moment from "moment";
import { logoInBase64 } from "../base64logo/logoExcel";
import font from "./font";
import jsPDF from "jspdf";

import style from "./temp.scss";

export const renderPdf = async (data) => {
  render(data);
  const pdf = new jsPDF("p", "px", [774, 880]);
  const pdfcontent = document.getElementById('table-pdf');
  
  pdf.addFileToVFS("Calibri Bold Italic.ttf", font.bold);
  pdf.addFileToVFS("Calibri Light.ttf", font.light);
  pdf.addFileToVFS("Calibri Regular.ttf", font.regular);

  pdf.addFont("Calibri Bold Italic.ttf", "Calibri", "bold");
  pdf.addFont("Calibri Light.ttf", "Calibri", "normal");
  pdf.addFont("Calibri Regular.ttf", "Calibri", "regular");
  await pdf.html(pdfcontent);
  pdf.save("testpdf.pdf");
}

export const render = (data) => {
  const orderDetail = data.orderDetail;
  let innerHTML = "";
  let total = 0;
  orderDetail.forEach((element) => {
    total += element.quantity * element.categoryMass;
  });
  if (orderDetail.length > 15) {
    const cloneDetail = [...orderDetail];
    let count = 1;
    const max = Math.ceil(cloneDetail.length / 15);
    while (cloneDetail.length > 15) {
      const _splitList = cloneDetail.splice(0, 15);
      innerHTML += renderInnerHTML(data, _splitList, "", count, max);
      count++;
    }
    innerHTML += renderInnerHTML(data, cloneDetail, total, count, max);
  } else {
    innerHTML = renderInnerHTML(data, orderDetail, total, 1, 1);
  }

  const _div = document.getElementById("table-pdf");
  let value = document.getElementById("pdf_preview");
  if(value === null) {
    value = document.createElement("div");
    value.style = style;
    value.style.display = 'none';
  }
  if (_div === null) {
    const buf = document.createElement('div');
    buf.innerHTML = innerHTML;
    value.appendChild(buf)
    document.body.append(value);
    return buf;
  } else {
    _div.innerHTML = innerHTML;
    return _div;
  }
};

const renderInnerHTML = (data, orderDetail, total, count, max) => {
  return `
  <table id="table-pdf" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;table-layout:fixed;padding: 10px;width: 756px">
   <colgroup><col width="108" style="mso-width-source:userset;mso-width-alt:3840;width:81pt">
   <col width="114" style="mso-width-source:userset;mso-width-alt:4039;width:85pt">
   <col width="108" style="mso-width-source:userset;mso-width-alt:3840;width:81pt">
   <col width="32" style="mso-width-source:userset;mso-width-alt:1137;width:24pt">
   <col width="104" style="mso-width-source:userset;mso-width-alt:3697;width:78pt">
   <col width="132" style="mso-width-source:userset;mso-width-alt:4693;width:99pt">
   <col width="64" style="width:48pt">
   <col width="94" style="mso-width-source:userset;mso-width-alt:3328;width:70pt">
   </colgroup><tbody><tr height="19" style="height:14.4pt">
    <td rowspan="3" style="border:.5pt solid black; padding: 0px" height="57" style="padding: 0" width="108" align="left" valign="top"><span style="mso-ignore:vglayout;
    position:absolute;z-index:1;"><img width="106" height="72" src=${logoInBase64} v:shapes="Picture_x0020_1"></span><span style="mso-ignore:vglayout2">
    <table cellpadding="0" cellspacing="0">
     <tbody><tr>
      <td rowspan="3" height="74" class="xl12811199" width="108">&nbsp;</td>
     </tr>
    </tbody></table>
    </span></td>
    <td colspan="5" class="xl23411199" width="490" style="width:367pt">CÔNG TY TNHH KHÍ
    HÓA LỎNG VIỆT NAM - VT GAS</td>
    <td colspan="2" class="xl24811199" width="158" style="border-right:.5pt solid black;
    width:118pt">Ký hiệu: 2.QTKD-oH-01</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="5" height="19" class="xl23511199" style="height:14.4pt">Phòng
    606,Tầng 6,Tòa nhà Waseco,số 10 Phố Quang,P.2,Q.Tân
    Bình,HCM<span style="mso-spacerun:yes">&nbsp;</span></td>
    <td colspan="2" class="xl25011199" style="border-right:.5pt solid black">Ngày ban
    hành: 02/2021</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="5" height="19" class="xl23611199" style="height:14.4pt">Điện
    thoại: (028) 39976821 / 39976822 - Fax: (028) 39976823</td>
    <td colspan="2" class="xl25211199" style="border-right:.5pt solid black">Trang: ${count +
      "/" +
      max}</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="8" height="19" class="xl32211199" style="border-right:.5pt solid black;
    height:14.4pt">LỆNH XUẤT HÀNG</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="8" height="19" class="xl32811199" style="border-right:.5pt solid black;
    height:14.4pt">KIỂM PHIẾU XUẤT KHO</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td height="19" class="xl6311199" style="height:14.4pt">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl24511199" style="border-top:none">Số LXH</td>
    <td colspan="2" class="xl24611199" style="border-right:.5pt solid black">${
      data.orderCode
    }</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td height="19" class="xl6311199" style="height:14.4pt">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6411199">&nbsp;</td>
    <td class="xl6511199" style="border-top:none">Ngày</td>
    <td colspan="2" class="xl33611199" style="border-right:.5pt solid black">${moment(
      data.delivery[0].deliveryDate
    ).format("DD/MM/YYYY")}</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="8" height="19" class="xl23711199" style="border-right:.5pt solid black;
    height:14.4pt">XUẤT CHO</td>
   </tr>
   <tr height="19" style="height:14.4pt">
  <td colspan="2" height="19" class="xl22511199" style="border-right:.5pt solid black;border-bottom: .5pt dashed windowtext;
    height:14.4pt">Khách hàng</td>
    <td rowspan="4" class="xl22211199" width="108" style="border-bottom:.5pt solid black;
    border-top:none;width:81pt">Tên người nhận</td>
    <td colspan="5" rowspan="4" class="xl21011199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black">&nbsp;</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="2" rowspan="3" height="57" class="xl13111199" width="222" style="border-right:.5pt solid black;border-bottom:.5pt solid black;
    height:43.2pt;width:166pt">${data.customers.name.toLocaleUpperCase()}</td>
   </tr>
   <tr height="19" style="height:14.4pt">
   </tr>
   <tr height="19" style="height:14.4pt">
   </tr>
   <tr height="19" style="height:14.4pt">
    <td height="19" class="xl23211199" style="height:14.4pt">Code KH</td>
    <td class="xl22911199" style="border-left:none">02923.668.789</td>
    <td rowspan="3" class="xl9411199" style="border-bottom:.5pt solid black;
    border-top:none">Số xe</td>
    <td colspan="5" rowspan="3" class="xl19911199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black">&nbsp;</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td height="19" class="xl7711199" style="height:14.4pt">NVTT</td>
    <td class="xl23011199" style="border-left:none">&nbsp;</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td height="19" class="xl23311199" style="height:14.4pt">Kho xuất</td>
    <td class="xl23111199" style="border-left:none">${data.supplier.name}</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="2" height="19" class="xl28411199" style="border-right:.5pt solid black;
    height:14.4pt">Tên hàng</td>
    <td colspan="2" class="xl28611199" style="border-right:.5pt solid black">Đơn
    vị tính</td>
    <td class="xl28811199" style="border-left:none">Số lượng</td>
    <td class="xl6611199" style="border-left:none">LPG (Kg)</td>
    <td colspan="2" class="xl18111199" style="border-right:.5pt solid black">Ghi chú</td>
   </tr>
   ${`<tr height="19" style="height:14.4pt">
    <td colspan="2" height="19" class="xl26811199" style="border-right:.5pt solid black;
    height:14.4pt">${orderDetail[0].categoryName}</td>
    <td colspan="2" class="xl26611199" style="border-right:.5pt solid black;
    border-left:none">Bình</td>
    <td class="xl26511199" style="border-left:none">${
      orderDetail[0].quantity
    }</td>
    <td class="xl17911199" style="border-left:none">${orderDetail[0].quantity *
      orderDetail[0].categoryMass}</td>
    <td colspan="2" rowspan="15" class="xl28311199" width="158" style="border-right:.5pt solid black;
    width:118pt">${data.note}</td>
   </tr>`}
   ${Array(15)
     .fill()
     .map((i, index) => {
       if (index === 0 || index === 14) return "";
       if (!orderDetail[index]) {
         return `<tr height="19" style="height:14.4pt">
            <td colspan="2" height="19" class="xl8911199" style="border-right:.5pt solid black;
            height:14.4pt">&nbsp;</td>
            <td colspan="2" class="xl35211199" style="border-right:.5pt solid black;
            border-left:none">&nbsp;</td>
            <td class="xl33811199" style="border-top:none;border-left:none">&nbsp;</td>
            <td class="xl33811199" style="border-top:none;border-left:none">&nbsp;</td>
          </tr>`;
       }
       return `<tr height="19" style="height:14.4pt">
          <td colspan="2" height="19" class="xl8911199" style="border-right:.5pt solid black;
          height:14.4pt">${orderDetail[index].categoryName}</td>
          <td colspan="2" class="xl35211199" style="border-right:.5pt solid black;
          border-left:none">Bình</td>
          <td class="xl33811199" style="border-top:none;border-left:none">${
            orderDetail[index].quantity
          }</td>
          <td class="xl33811199" style="border-top:none;border-left:none">${orderDetail[
            index
          ].quantity * orderDetail[index].categoryMass}</td>
        </tr>`;
     })
     .join("")}
   ${
     orderDetail[14]
       ? `<tr height="19" style="height:14.4pt">
    <td colspan="2" height="19" class="xl8011199" style="border-right:.5pt solid black;
    height:14.4pt">${orderDetail[14].categoryName}</td>
    <td colspan="2" class="xl17511199" style="border-right:.5pt solid black;
    border-left:none">Bình</td>
    <td class="xl17811199" style="border-left:none">${
      orderDetail[14].quantity
    }</td>
    <td class="xl18011199" style="border-left:none">${orderDetail[14].quantity *
      orderDetail[14].categoryMass}</td>
   </tr>`
       : `<tr height="19" style="height:14.4pt">
    <td colspan="2" height="19" class="xl8011199" style="border-right:.5pt solid black;
    height:14.4pt">&nbsp;</td>
    <td colspan="2" class="xl17511199" style="border-right:.5pt solid black;
    border-left:none">&nbsp;</td>
    <td class="xl17811199" style="border-left:none">&nbsp;</td>
    <td class="xl18011199" style="border-left:none">&nbsp;</td>
   </tr>`
   }
   <tr height="19" style="height:14.4pt">
    <td height="19" class="xl29211199" style="height:14.4pt">Tổng
    lượng gas</td>
    <td class="xl6711199">&nbsp;</td>
    <td colspan="2" class="xl29311199" style="border-right:.5pt solid black">&nbsp;</td>
    <td class="xl6811199" style="border-left:none">&nbsp;</td>
    <td class="xl6911199" style="border-left:none">${total}</td>
    <td colspan="2" class="xl35611199" style="border-right:.5pt solid black">&nbsp;</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="2" height="19" class="xl25611199" style="border-right:.5pt solid black;
    height:14.4pt">Phòng Kế Toán</td>
    <td colspan="3" class="xl29011199" style="border-right:.5pt solid black;
    border-left:none">Phòng Kinh Doanh</td>
    <td colspan="3" class="xl35811199" style="border-right:.5pt solid black;
    border-left:none">KT. Giám Đốc</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="2" rowspan="2" height="38" class="xl15111199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black;height:28.8pt">${
      data.status === "DA_DUYET" || data.status === "DDTRAM_DUYET"
        ? "Đã duyệt"
        : ""
    }</td>
    <td colspan="3" rowspan="2" class="xl15911199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black">${
      data.status === "DDTRAM_DUYET" ? "Đã duyệt" : ""
    }</td>
    <td colspan="3" rowspan="2" class="xl15511199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black">${
      data.status === "DDTRAM_DUYET" ? "Đã duyệt" : ""
    }</td>
   </tr>
   <tr height="19" style="height:14.4pt">
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="2" height="19" class="xl26011199" style="border-right:.5pt solid black;
    height:14.4pt">Thủ Kho</td>
    <td colspan="3" class="xl26211199" style="border-right:.5pt solid black">Điều
    Độ Trạm</td>
    <td colspan="3" class="xl25711199" style="border-right:.5pt solid black">Người
    Nhận Hàng</td>
   </tr>
   <tr height="19" style="height:14.4pt">
    <td colspan="2" rowspan="2" height="38" class="xl12211199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black;height:28.8pt">${
      data.status === "DDTRAM_DUYET" ? "Đã duyệt" : ""
    }</td>
    <td colspan="3" rowspan="2" class="xl16911199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black">${
      data.status === "DDTRAM_DUYET" ? "Đã duyệt" : ""
    }</td>
    <td colspan="3" rowspan="2" class="xl15311199" style="border-right:.5pt solid black;
    border-bottom:.5pt solid black">&nbsp;</td>
   </tr>
   <tr height="19" style="height:14.4pt">
   </tr>
  </tbody></table>`;
};

