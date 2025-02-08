// 'use client'
// import { useState, ChangeEvent } from 'react';
// import * as XLSX from 'xlsx';

// interface ExcelData {
//   [key: string]: any;
// }

// export default function ExcelUploader() {
//   const [fileData, setFileData] = useState<ExcelData[] | null>(null);

//   const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target?.result as ArrayBuffer);
//       const workbook = XLSX.read(data, { type: 'array' });

//       // Assuming the first sheet is what we want
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];

//       // Convert to JSON
//       const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(worksheet);

//       // Set the data to state
//       setFileData(jsonData);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
//       {fileData && (
//         <table border={1} cellPadding={10}>
//           <thead>
//             <tr>
//               {Object.keys(fileData[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {fileData.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, i) => (
//                   <td key={i}>{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
