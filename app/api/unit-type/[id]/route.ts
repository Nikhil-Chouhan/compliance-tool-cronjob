import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { unit_typeModel } from "@/prisma/zod/unit_type";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type unit_type = z.infer<typeof unit_typeModel>;

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
    const unit_typeRow = await prisma.unit_type.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ unit_typeRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading unit_type", 500);
  } finally {
    await prisma.$disconnect();
  }
}
