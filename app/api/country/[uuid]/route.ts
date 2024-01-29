import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { countryModel } from "@/prisma/zod/country";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type country = z.infer<typeof countryModel>;

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // console.log("request pathname ----> ", pathname);
  const uuid = pathname.split("/").pop();

  try {
    const countryRow = await prisma.country.findUnique({
      where: { uuid: uuid, deleted: false },
    });
    return NextResponse.json({ countryRow }, { status: 200 });
  }catch (e) {
    return handleError(e, "error reading country", 500);
  }finally {
    // Disconnect Prisma client after the request is processed    
    await prisma.$disconnect();
  }
}
