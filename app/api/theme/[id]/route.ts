import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { themeModel } from "@/prisma/zod/theme";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type theme = z.infer<typeof themeModel>;

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
    const themeRow = await prisma.theme.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ themeRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading theme", 500);
  } finally {
    await prisma.$disconnect();
  }
}
