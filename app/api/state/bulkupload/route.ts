import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { exportExcelWithHeaders } from "@/app/utils/exportXlHeaders";
import { stateModel } from "@/prisma/zod/state";
import { z } from "zod";
import { stateImportType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type state = z.infer<typeof stateModel>;

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "csv";
  try {
    const headers = ["code", "country", "name", "status"]; // Define your headers here

    const buffer = exportExcelWithHeaders(headers, type);
    const res = new NextResponse(buffer);

    let filename;
    if (type == "xlsx") {
      filename = "state-sample.xlsx";
      res.headers.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } else {
      filename = "state-sample.csv";
      res.headers.set("Content-Type", "text/csv");
    }
    res.headers.set("Content-Disposition", "attachment; filename=" + filename);

    return res;
  } catch (e) {
    return handleError(e, "error reading state", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const f = formData.get("file");

  if (!f) {
    return NextResponse.json(
      { response: "Invalid file uploaded." },
      { status: 400 }
    );
  }

  try {
    const file = f as File;

    // const destinationDirPath = path.join(
    //   process.cwd(),
    //   "public/upload/state/importexcel"
    // );

    let destinationDirPath: string;
    if (process.env.APP_ENV && process.env.APP_ENV === "development") {
      destinationDirPath = path.join(process.cwd(), `/tmp/state/`);
    } else {
      destinationDirPath = "/tmp/";
    }
    console.log("DESTINATION PATH =============>", destinationDirPath);

    const fileArrayBuffer = await file.arrayBuffer();

    if (!existsSync(destinationDirPath)) {
      await fs.mkdir(destinationDirPath, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name}`; // moment().format('YYYYMMDD-HHmmss') + "-" + file.name;
    const filePath = path.join(destinationDirPath, filename);
    await fs.writeFile(filePath, Buffer.from(fileArrayBuffer));

    const workbook = XLSX.read(filePath, { type: "file" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: stateImportType[] = XLSX.utils.sheet_to_json(worksheet);

    const uniqueCountries = [
      ...new Set(jsonData.map((record) => record.country)),
    ];
    const countries = await prisma.country.findMany({
      where: { name: { in: uniqueCountries, mode: "insensitive" } },
    });

    let saveCnt = 0,
      errorCnt = 0;

    const updatedJsonData = [];
    for (const record of jsonData) {
      let responseMsg = "";

      const country = countries.find(
        (c) => c.name.toLowerCase() === record.country.toLowerCase()
      );
      if (!country) errorCnt++, (responseMsg = "Country Missing!");

      const existingstate = await prisma.state.findFirst({
        where: { code: record.code },
      });
      if (existingstate) {
        const updatedState = await prisma.state.update({
          where: { id: existingstate.id },
          data: {
            code: record.code,
            country_id: country?.id,
            name: record.name,
            status: record.status ? 1 : 2,
          },
        });
        responseMsg = "State Record Updated.";
        if (updatedState) {
          saveCnt++;
        }
      } else {
        const recordRes = await prisma.state.create({
          data: {
            code: record.code,
            country_id: country?.id,
            name: record.name,
            status: record.status ? 1 : 2,
          },
        });
        responseMsg = "Record Added.";
        if (recordRes && recordRes.id) {
          saveCnt++;
        }
      }

      updatedJsonData.push({
        ...record,
        response: responseMsg,
      });
    }
    // Exporting to Excel
    const ws = XLSX.utils.json_to_sheet(updatedJsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, filePath);

    const downloadPath =
      process.env.APP_URL + "/public/upload/state/importexcel" + filename;
    return NextResponse.json(
      { saveCnt: saveCnt, errorCnt: errorCnt, responseFile: downloadPath },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error uploading state data!", 500);
  } finally {
    await prisma.$disconnect();
  }
}
