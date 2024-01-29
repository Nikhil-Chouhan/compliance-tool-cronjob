import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { zoneModel } from "@/prisma/zod/zone";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type zone = z.infer<typeof zoneModel>;

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
    const zoneRow = await prisma.zone.findUnique({
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
      },
    });
    return NextResponse.json({ zoneRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading zone", 500);
  } finally {
    await prisma.$disconnect();
  }
}
