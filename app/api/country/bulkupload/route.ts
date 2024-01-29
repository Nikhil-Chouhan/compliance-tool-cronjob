import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { countryImportType } from "@/app/utils/typesUtils";
import { exportExcelWithHeaders } from "@/app/utils/exportXlHeaders";
import { countryModel } from "@/prisma/zod/country";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type country = z.infer<typeof countryModel>;

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "csv";
  try {
    const headers = [
      "name",
      "short_name",
      "country_code",
      "timezone",
      "uts_offset",
      "status",
    ];

    const buffer = exportExcelWithHeaders(headers, type);
    const res = new NextResponse(buffer);

    let filename;
    if (type == "xlsx") {
      filename = "country-sample.xlsx";
      res.headers.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } else {
      filename = "country-sample.csv";
      res.headers.set("Content-Type", "text/csv");
    }
    res.headers.set("Content-Disposition", "attachment; filename=" + filename);

    return res;
  } catch (e) {
    return handleError(e, "error reading country", 500);
  } finally {
    // Disconnect Prisma client after the request is processed
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
    //   "public/upload/country/importexcel"
    // );

    let destinationDirPath: string;
    if (process.env.APP_ENV && process.env.APP_ENV === "development") {
      destinationDirPath = path.join(process.cwd(), `/tmp/country/`);
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

    // const workbook = XLSX.read(fileArrayBuffer, { type: "buffer" });
    const workbook = XLSX.read(filePath, { type: "file" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: countryImportType[] = XLSX.utils.sheet_to_json(worksheet);

    let saveCnt = 0;
    const errorCnt = 0;

    const updatedJsonData = [];
    for (const record of jsonData) {
      let responseMsg = "";
      const existingcountry = await prisma.country.findFirst({
        where: { short_name: record.short_name },
      });

      if (existingcountry) {
        const updatedCountry = await prisma.country.update({
          where: { id: existingcountry.id },
          data: {
            name: record.name,
            country_code:
              record.country_code !== undefined
                ? record.country_code.toString()
                : null,
            timezone: record.timezone,
            uts_offset: record.uts_offset,
            status: record.status ? 1 : 2,
          },
        });
        if (updatedCountry) {
          responseMsg = "Country Record Updated.";
          saveCnt++;
        }
      } else {
        const recordRes = await prisma.country.create({
          data: {
            name: record.name,
            short_name: record.short_name,

            country_code:
              record.country_code !== undefined
                ? record.country_code.toString()
                : null,
            timezone: record.timezone,
            uts_offset: record.uts_offset,
            status: record.status ? 1 : 2,
          },
        });
        responseMsg = "Country Record Added.";
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
      process.env.APP_URL + "/public/upload/country/importexcel" + filename;
    return NextResponse.json(
      { saveCnt: saveCnt, errorCnt: errorCnt, responseFile: downloadPath },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error uploading country data!", 500);
  } finally {
    await prisma.$disconnect();
  }
}
