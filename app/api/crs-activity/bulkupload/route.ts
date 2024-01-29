import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import * as XLSX from "xlsx";
import { exportExcelWithHeaders } from "@/app/utils/exportXlHeaders";
import { z } from "zod";
import { crs_activityModel } from "@/prisma/zod/crs_activity";
import { activityImportType } from "@/app/utils/typesUtils";

import {
  frequency,
  impact,
  getKeyByValue,
  generateUniqueCode,
  frequencyEnum,
  impactEnum,
  imprisonment_forEnum,
  handleError,
} from "@/app/utils/modelUtils";

export type crs_activity = z.infer<typeof crs_activityModel>;
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "csv";
  try {
    const headers = [
      "code",
      "title",
      "legislation",
      "rule",
      "reference",
      "who",
      "when",
      "activity",
      "procedure",
      "description",
      "frequency",
      "form_no",
      "compliance_type",
      "authority",
      "exemption_criteria",
      "event",
      "event_sub",
      "event_question",
      "implications",
      "imprison_duration",
      "imprison_applies_to",
      "currency",
      "fine",
      "fine_per_day",
      "impact",
      "impact_on_unit",
      "impact_on_organization",
      "linked_activity_ids",
      "reference_link",
      "sources",
      "documents",
      "law_category",
      "country",
      "state",
      "legal_due_date",
    ];

    const buffer = exportExcelWithHeaders(headers, type);
    const res = new NextResponse(buffer);

    let filename;
    if (type == "xlsx") {
      filename = "compliance_activity-sample.xlsx";
      res.headers.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } else {
      filename = "compliance_activity-sample.csv";
      res.headers.set("Content-Type", "text/csv");
    }
    res.headers.set("Content-Disposition", "attachment; filename=" + filename);

    return res;
  } catch (e) {
    return handleError(e, "error reading compliance_activity", 500);
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
    const fileArrayBuffer = await file.arrayBuffer();
    console.log("fileArrayBuffer : ", fileArrayBuffer);
    const workbook = XLSX.read(fileArrayBuffer, { type: "buffer" });
    console.log("workbook : ", workbook);

    const sheetName = workbook.SheetNames[0];
    console.log("sheetName : ", sheetName);

    const worksheet = workbook.Sheets[sheetName];
    console.log("worksheet : ", worksheet);

    const jsonData: activityImportType[] = XLSX.utils.sheet_to_json(worksheet);
    console.log("jsonData : ", jsonData);

    const saveCnt = 0;
    const errorCnt = 0;

    const updatedJsonData = [];
    for (const record of jsonData) {
      let responseMsg = "";
      let recordRes;
      let saveCnt = 0,
        errorCnt = 0;

      const requiredFields = [
        "code",
        "title",
        "activity",
        "reference",
        "who",
        "when",
        "procedure",
        "description",
        "form_no",
        "compliance_type",
        "authority",
        "exemption_criteria",
        "implications",
        "imprison_duration",
        "imprison_applies_to",
        "fine",
        "fine_per_day",
        "impact",
        "impact_on_unit",
        "impact_on_organization",
        "reference_link",
        "law_category",
        "country",
      ];
      for (const field of requiredFields) {
        if (!record[field]) {
          errorCnt++;
          responseMsg = `Compliance Activity ${
            field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")
          } is Missing!`;
        }
      }

      if (record.code && record.title) {
        const existingClient_activity = await prisma.crs_activity.findFirst({
          where: { title: record.title },
        });

        if (existingClient_activity)
          errorCnt++, (responseMsg = "Title already exists!");
      }

      if (record.code && record.code.trim() !== "" && !responseMsg) {
        const existingActivityByCode = await prisma.crs_activity.findFirst({
          where: { activity_code: record.code },
        });

        if (existingActivityByCode) {
          recordRes = await prisma.crs_activity.update({
            where: { id: existingActivityByCode.id },
            data: {
              title: record.title,
              legislation: record.legislation,
              rule: record.rule,
              reference: record?.reference,
              who: record?.who,
              when: record?.when,
              activity: record.activity,
              procedure: record?.procedure,
              description: record?.description,
              frequency: record?.frequency
                ? (getKeyByValue(frequency, record.frequency) as frequencyEnum)
                : null,
              form_no: record.form_no,
              compliance_type: record.compliance_type,
              authority: record.authority,
              exemption_criteria: record.exemption_criteria,
              event: record.event,
              event_sub: record.event_sub,
              event_question: record.event_question,
              implications: record.implications,
              imprison_duration: record?.imprison_duration?.toString(),
              imprison_applies_to:
                record?.imprison_applies_to as imprisonment_forEnum,
              currency: (record?.currency || null)?.toString(),
              fine: (record?.fine || null)?.toString(),
              fine_per_day: record?.imprison_applies_to,
              impact: getKeyByValue(impact, record.impact) as impactEnum,
              impact_on_unit: getKeyByValue(
                impact,
                record.impact
              ) as impactEnum,
              impact_on_organization: getKeyByValue(
                impact,
                record.impact
              ) as impactEnum,
              linked_activity_ids: record?.linked_activity_ids
                ? record.linked_activity_ids.toString()
                : null,
              reference_link: record.reference_link,
              sources: record.sources || "",
              documents: record.documents || "",
            },
          });

          responseMsg = "Compliance Activity Record Updated. ";
          if (recordRes && recordRes.id) {
            saveCnt++;
          }
        } else {
          console.log("create record : ", record);
          recordRes = await prisma.crs_activity.create({
            data: {
              activity_code: record.code,
              title: record.title,
              legislation: record?.legislation,
              rule: record?.rule,
              reference: record?.reference,
              who: record?.who,
              when: record?.when,
              activity: record.activity,
              procedure: record?.procedure,
              description: record?.description,
              frequency: record?.frequency
                ? (getKeyByValue(frequency, record.frequency) as frequencyEnum)
                : null,
              form_no: record?.form_no,
              compliance_type: record?.compliance_type,
              authority: record?.authority,
              exemption_criteria: record?.exemption_criteria,
              event: record?.event,
              event_sub: record?.event_sub,
              event_question: record?.event_question,
              implications: record?.implications,
              imprison_duration: record?.imprison_duration?.toString(),
              imprison_applies_to:
                record?.imprison_applies_to as imprisonment_forEnum,
              currency: (record?.currency || null)?.toString(),
              fine: (record?.fine || null)?.toString(),
              fine_per_day: record?.imprison_applies_to,
              impact: getKeyByValue(impact, record.impact) as impactEnum,
              impact_on_unit: getKeyByValue(
                impact,
                record.impact
              ) as impactEnum,
              impact_on_organization: getKeyByValue(
                impact,
                record.impact
              ) as impactEnum,
              linked_activity_ids: record?.linked_activity_ids
                ? record.linked_activity_ids.toString()
                : null,
              reference_link: record?.reference_link,
              sources: record.sources || "",
              documents: record.documents || "",
              country: record.country,
              state: record.state,
              law_category: record.law_category,
              legal_due_date: record.legal_due_date,
            },
          });
          responseMsg = "Compliance Activity Record Added.";
          if (recordRes && recordRes.id) {
            saveCnt++;
          }
        }
        //else {
        //   errorCnt++;
        //   responseMsg =
        //     "Compliance Activity Code does not exist in the database";
        // }
      }

      updatedJsonData.push({
        // ...record,
        activity_code: recordRes?.activity_code || "",
        title: record.title,
        response: responseMsg,
      });
    }
    return NextResponse.json(
      { saveCnt: saveCnt, errorCnt: errorCnt, responseData: updatedJsonData },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error uploading crs data!", 500);
  } finally {
    await prisma.$disconnect();
  }
}
