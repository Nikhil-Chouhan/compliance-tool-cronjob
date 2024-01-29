import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { stateModel } from "@/prisma/zod/state";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type state = z.infer<typeof stateModel>;

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // console.log("request pathname ----> ", pathname);
  const uuid = pathname.split("/").pop();

  try {
    const stateRow = await prisma.state.findUnique({
      where: { uuid: uuid, deleted: false },
      include: {
        country: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ stateRow }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading state", 500);
  } finally {
    await prisma.$disconnect();
  }
}
