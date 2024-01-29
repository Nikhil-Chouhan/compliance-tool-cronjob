import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { entityModel } from "@/prisma/zod/entity";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type entity = z.infer<typeof entityModel>;

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
    const entityRow = await prisma.entity.findUnique({
      where: { id: id, deleted: false },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ entityRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading entity", 500);
  }
}
