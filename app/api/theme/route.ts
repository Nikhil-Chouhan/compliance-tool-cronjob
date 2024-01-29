import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { themeModel } from "@/prisma/zod/theme";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type theme = z.infer<typeof themeModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  console.log(
    "request query--->",
    request.nextUrl.searchParams.get("filterName")
  );
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  try {
    const themeList = await prisma.theme.findMany({
      where: {
        deleted :  false
      },
      skip: offset,
      // take: take,
      orderBy: {
        created_at: "desc",
      },
    });

    const totalCount = await prisma.theme.count({
      where: {
        deleted : false
      },
    });

    return NextResponse.json({ themeList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading theme", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: theme = await request.json();

  console.log("request body: ", body);

  const result = themeModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.theme.findFirst({
      where: {
        deleted: false,
        name: {
          equals: body.name,
          mode: "insensitive",
        },
      },
    });
    if (existRecord) {
      return NextResponse.json(
        { response: "Theme name already exists!" },
        { status: 400 }
      );
    
    }

    const user = await prisma.theme.create({
      data: body as Prisma.themeCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating role", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: theme = await request.json();
  console.log("request body: ", body);

  const result = themeModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const theme = await prisma.theme.findUnique({
      where: { id: body.id || undefined },
    });
    if (theme && theme.id) {
      const updatedtheme = await prisma.theme.update({
        where: { id: theme.id },
        data: body as Prisma.themeUpdateInput,
      });

      return NextResponse.json(updatedtheme, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "theme details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating theme", 500);
  } finally {
    await prisma.$disconnect();
  }
}

// export async function DELETE(request: NextRequest)
export async function PATCH(request: NextRequest) {
  const body: patchType = await request.json();
  console.log("request body: ", body);
  console.log("request body: ", body.type); // patch | delete
  if (!body.id || !body.type) {
    return NextResponse.json(
      { response: "Invalid request, kindly check your request!" },
      { status: 400 }
    );
  }

  if (body.type == "patch" && !body.status) {
    return NextResponse.json(
      { response: "Invalid request, kindly check your request!" },
      { status: 400 }
    );
  }

  try {
    const themeData = await prisma.theme.findUnique({
      where: {
        id: body.id,
      },
    });

    if (themeData && themeData.id) {
      let updatedtheme = null;
      if (body.type == "delete") {
        updatedtheme = await prisma.theme.update({
          where: { id: themeData.id },
          data: {
            deleted: true,
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
          },
        });
      } else if (body.type == "patch") {
        updatedtheme = await prisma.theme.update({
          where: { id: themeData.id },
          data: {
            status: body.status,
          },
        });
      } else {
        return NextResponse.json(
          { response: "Invalid request" },
          { status: 400 }
        );
      }

      return NextResponse.json(updatedtheme, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "theme details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating theme", 500);
  } finally {
    await prisma.$disconnect();
  }
}
