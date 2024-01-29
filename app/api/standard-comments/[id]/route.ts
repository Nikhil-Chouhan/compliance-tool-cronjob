import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { standard_commentsModel } from "@/prisma/zod/standard_comments";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type standard_comments = z.infer<typeof standard_commentsModel>;

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
    const standard_commentsRow = await prisma.standard_comments.findUnique({
      where: { id: id, deleted: false },
    });
    return NextResponse.json({ standard_commentsRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading standard_comments", 500);
  } finally {
    await prisma.$disconnect();
  }
}
