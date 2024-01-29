import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { activity_configurationModel } from "@/prisma/zod/activity_configuration";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type activity_configuration = z.infer<
  typeof activity_configurationModel
>;

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const idString = pathname.split("/").pop();
  let id;

  if (idString !== undefined) {
    id = parseInt(idString, 10);
  } else {
    console.error("ID is undefined");
  }

  try {
    const activity_configurationInitialRow =
      await prisma.activity_configuration.findUnique({
        where: { id: id, deleted: false },
      });

    const activity_configurationRow = {
      ...activity_configurationInitialRow,
      // legal_due_date: activity_configurationInitialRow.legal_due_date
      //   .toISOString()
      //   .split("T")[0],
      // unit_head_due_date: activity_configurationInitialRow.unit_head_due_date
      //   .toISOString()
      //   .split("T")[0],
      // function_head_due_date:
      //   activity_configurationInitialRow.function_head_due_date
      //     .toISOString()
      //     .split("T")[0],
      // evaluator_due_date: activity_configurationInitialRow.evaluator_due_date
      //   .toISOString()
      //   .split("T")[0],
      // executor_due_date: activity_configurationInitialRow.executor_due_date
      //   .toISOString()
      //   .split("T")[0],
      // first_alert: activity_configurationInitialRow.first_alert
      //   .toISOString()
      //   .split("T")[0],
      // second_alert: activity_configurationInitialRow.second_alert
      //   .toISOString()
      //   .split("T")[0],
      // third_alert: activity_configurationInitialRow.third_alert
      //   .toISOString()
      //   .split("T")[0],
    };

    return NextResponse.json({ activity_configurationRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading activity_configuration", 500);
  }
}
