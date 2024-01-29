import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { organizationModel } from "@/prisma/zod/organization";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type organization = z.infer<typeof organizationModel>;

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
    const organizationRow = await prisma.organization.findUnique({
      where: { id: id, deleted: false },
      include: {
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ organizationRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading organization", 500);
  } finally {
    await prisma.$disconnect();
  }
}
