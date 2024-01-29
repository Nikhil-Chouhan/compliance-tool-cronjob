import { handleError } from "@/app/utils/modelUtils";
import { prisma, getCount } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const year = Number(request.nextUrl.searchParams.get("year"));
  console.log("year =========> ", year);

  // Create a list of months for the given year (from January to December)
  const months = [];
  for (let month = 0; month < 12; month++) {
    months.push(new Date(year, month, 1));
  }

  console.log("Months list =========> ", months);

  try {
    const legislationData = [];
    const ruleData = [];
    const complianceActivityData = [];
    for (const month of months) {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      // console.log("start of month =========> ", startOfMonth);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const countLegislation = await getCount(
        "legislation",
        startOfMonth,
        endOfMonth
      );
      legislationData[month.getMonth()] = countLegislation;

      const countRule = await getCount("rule", startOfMonth, endOfMonth);
      ruleData[month.getMonth()] = countRule;

      const countComplianceActivity = await getCount(
        "compliance_activity",
        startOfMonth,
        endOfMonth
      );
      complianceActivityData[month.getMonth()] = countComplianceActivity;
    }

    const chartData = {
      series: [
        {
          name: "Legislation",
          data: legislationData,
          type: "column",
        },
        {
          name: "Rule",
          data: ruleData,
          type: "column",
        },
        {
          name: "Compliance Activity",
          data: complianceActivityData,
          type: "column",
        },
      ],
    };

    return NextResponse.json(
      {
        year,
        chartData,
      },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error counting data", 500);
  } finally {
    // Disconnect Prisma client after the request is processed
    await prisma.$disconnect();
  }
}
