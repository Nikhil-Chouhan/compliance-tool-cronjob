import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { roleModel } from "@/prisma/zod/role";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type role = z.infer<typeof roleModel>;

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
    const roleRow = await prisma.role.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ roleRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading role", 500);
  } finally {
    await prisma.$disconnect();
  }
}
