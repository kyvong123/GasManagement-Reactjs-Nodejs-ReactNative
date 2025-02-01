import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import * as ExcelJS from "exceljs";


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
  
    const wb = new ExcelJS.Workbook();  
   
     

        // excelJS

        const sheet2 = wb.addWorksheet();
     
        sheet2.getCell("A1").value = "Thương hiệu";
        sheet2.getCell("B1").value ="Loại bình";
        sheet2.getCell("C1").value ="Số lượng";
        sheet2.getCell("D1").value ="LPG(Kg)";
        data.map((item,i)=>{
            sheet2.getCell(`A${i+2}`).value = item._id.manufactureName;
            sheet2.getCell(`B${i+2}`).value =item._id.name;
            sheet2.getCell(`C${i+2}`).value =item.count;
            sheet2.getCell(`D${i+2}`).value =item._id.mass*item.count;
        })

    

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
