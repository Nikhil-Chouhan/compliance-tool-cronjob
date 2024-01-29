import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { business_unitModel } from "@/prisma/zod/business_unit";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type business_unit = z.infer<typeof business_unitModel>;

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
    const business_unitRow = await prisma.business_unit.findUnique({
      where: { id: id, deleted: false },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
        business_vertical: {
          select: {
            id: true,
            name: true,
          },
        },
        zone: {
          select: {
            id: true,
            name: true,
          },
        },
        unit_type: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ business_unitRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading unit", 500);
  } finally {
    await prisma.$disconnect();
  }
}
