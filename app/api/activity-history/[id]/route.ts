import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { activity_historyModel } from "@/prisma/zod/activity_history";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type activity_history = z.infer<typeof activity_historyModel>;

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
    const activity_historyInitialRow = await prisma.activity_history.findUnique(
      {
        where: { id: id, deleted: false },
      }
    );

    const activity_historyRow = {
      ...activity_historyInitialRow,
      legal_due_date: activity_historyInitialRow.legal_due_date
        .toISOString()
        .split("T")[0],
      unit_head_due_date: activity_historyInitialRow.unit_head_due_date
        .toISOString()
        .split("T")[0],
      function_head_due_date: activity_historyInitialRow.function_head_due_date
        .toISOString()
        .split("T")[0],
      evaluator_due_date: activity_historyInitialRow.evaluator_due_date
        .toISOString()
        .split("T")[0],
      executor_due_date: activity_historyInitialRow.executor_due_date
        .toISOString()
        .split("T")[0],
      completion_date: activity_historyInitialRow.completion_date
        .toISOString()
        .split("T")[0],
    };

    return NextResponse.json({ activity_historyRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading activity_history", 500);
  }
}
