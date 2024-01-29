import * as XLSX from "xlsx";

export const exportExcelWithHeaders = (headers: string[], type: string) => {
  const ws = XLSX.utils.aoa_to_sheet([headers]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  let workBookOutput;
  if (type == "xlsx") {
    workBookOutput = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  } else {
    workBookOutput = XLSX.write(wb, { bookType: "csv", type: "buffer" });
  }
  const buffer = Buffer.from(workBookOutput);
  // const buffer = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  return buffer;
};
