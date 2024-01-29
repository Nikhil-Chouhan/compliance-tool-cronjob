import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { business_verticalModel } from "@/prisma/zod/business_vertical";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type business_vertical = z.infer<typeof business_verticalModel>;

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
    const business_verticalRow = await prisma.business_vertical.findUnique({
      where: { id: id, deleted: false },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ business_verticalRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading business vertical", 500);
  } finally {
    await prisma.$disconnect();
  }
}
