import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { unit_function_mappingModel } from "@/prisma/zod/unit_function_mapping";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type unit_function_mapping = z.infer<typeof unit_function_mappingModel>;

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
    const unit_function_mappingRow =
      await prisma.unit_function_mapping.findUnique({
        where: { id: id, deleted: false },
        include: {
          business_unit: {
            select: {
              id: true,
              name: true,
            },
          },
          function: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    return NextResponse.json({ unit_function_mappingRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading unit function mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}
