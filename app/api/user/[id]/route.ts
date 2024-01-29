import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { userModel } from "@/prisma/zod/user";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type user = z.infer<typeof userModel>;

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
    const userRow = await prisma.user.findUnique({
      where: { id: id, deleted: false },
      include: {
        business_unit: {
          select: {
            id: true,
            name: true,
          },
        },
        function_department: {
          select: {
            id: true,
            name: true,
          },
        },
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ userRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading user", 500);
  } finally {
    await prisma.$disconnect();
  }
}
