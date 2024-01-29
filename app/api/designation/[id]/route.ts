import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { designationModel } from "@/prisma/zod/designation";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type designation = z.infer<typeof designationModel>;

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
    const designationRow = await prisma.designation.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ designationRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading designation", 500);
  }
}
