import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { industryModel } from "@/prisma/zod/industry";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type industry = z.infer<typeof industryModel>;

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
    const industryRow = await prisma.industry.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ industryRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading industry", 500);
  } finally {
    await prisma.$disconnect();
  }
}
