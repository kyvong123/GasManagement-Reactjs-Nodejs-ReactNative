// import "./Table.scss";
// import { RiFileExcel2Fill } from "react-icons/ri";
// import * as xlsx from "xlsx";
// // import FileSaver from 'file-saver'
// import moment from "moment";
// function TableExcel({ header, title, colum, data }) {
//   const HandleExportExcel = () => {
//     let table_elt = document.getElementById("my-table-id");
//     let workbook = xlsx.utils.table_to_book(table_elt);
//     xlsx.writeFile(workbook, "Report.xlsx");
//   };

//   return (
//     <div className="table-container col mt-4">
//       {header ? (
//         <h4>{header}</h4>
//       ) : colum.length === 2 ? (
//         <div style={{ marginTop: "35px" }}></div>
//       ) : (
//         <div style={{ marginTop: "60px" }}></div>
//       )}
//       <table class="table table-bordered" id="my-table-id">
//         <thead>
//           {title && colum.length === 2 ? (
//             <tr
//               className="table-title"
//               style={{ textTransform: "uppercase", fontWeight: "700" }}
//             >
//               <th className="col-title">{title}</th>
//               <th
//                 className="col-title"
//                 style={{ textAlign: "end", fontSize: "16px" }}
//               >
//                 <RiFileExcel2Fill
//                   onClick={() => HandleExportExcel()}
//                   className="icon"
//                 />
//               </th>
//             </tr>
//           ) : title && colum.length === 3 ? (
//             <tr
//               className="table-title"
//               style={{ textTransform: "uppercase", fontWeight: "700" }}
//             >
//               <th className="col-title">{title}</th>
//               <th className="col-title"></th>
//               <th
//                 className="col-title"
//                 style={{ textAlign: "end", fontSize: "16px" }}
//               >
//                 <RiFileExcel2Fill
//                   onClick={() => HandleExportExcel()}
//                   className="icon"
//                 />
//               </th>
//             </tr>
//           ) : (
//             ""
//           )}

//           <tr>
//             {colum &&
//               colum.map((item, index) => {
//                 return (
//                   <th key={index} scope="col">
//                     {item}
//                   </th>
//                 );
//               })}
//           </tr>
//         </thead>
//         <tbody>
//           {colum.length === 2
//             ? data.map((item, index) => {
//                 return (
//                   <tr key={index}>
//                     <td>{item.title}</td>
//                     <td>{item.amount}</td>
//                   </tr>
//                 );
//               })
//             : data.map((item, index) => {
//                 return (
//                   <tr key={index}>
//                     <td>{item.title}</td>
//                     <td>{item.amount}</td>
//                     <td>{item.kg}</td>
//                   </tr>
//                 );
//               })}
//           {data && colum.length !== 2 ? (
//             <tr>
//               <td>Tổng số</td>
//               <td>
//                 {data.reduce((total, curent) => total + curent.amount, 0)}
//               </td>
//               <td>{data.reduce((total, curent) => total + curent.kg, 0)}</td>
//             </tr>
//           ) : (
//             <tr>
//               <td>Tổng số</td>
//               <td>
//                 {data.reduce((total, curent) => total + curent.amount, 0)}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default TableExcel;
