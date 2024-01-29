import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { function_departmentModel } from "@/prisma/zod/function_department";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type function_department = z.infer<typeof function_departmentModel>;

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
    const function_departmentRow = await prisma.function_department.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ function_departmentRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading function_department", 500);
  } finally {
    await prisma.$disconnect();
  }
}
