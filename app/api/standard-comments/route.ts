import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { standard_commentsModel } from "@/prisma/zod/standard_comments";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type standard_comments = z.infer<typeof standard_commentsModel>;

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
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filterid"];

  const conditions: Condition[] = filterProperties.reduce((acc, property) => {
    const paramValue = queryParams[property as keyof typeof queryParams];
    if (paramValue) {
      const condition: Condition = {};

      if (!isNaN(Number(paramValue))) {
        condition[property.substring(6)] = parseInt(paramValue, 10);
      } else {
        condition[property.substring(6)] = {
          contains: paramValue,
          mode: "insensitive",
        };
      }
      console.log("condition---> ", condition);
      acc.push(condition);
    }
    return acc;
  }, [] as Condition[]);

  const prismaWhereClause: Prisma.standard_commentsWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.standard_commentsWhereInput["AND"])
        : undefined,
  };
  console.log("standard_comments uuid check here =====>>", prismaWhereClause);

  try {
    const standard_commentsList = await prisma.standard_comments.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "asc", // or 'asc' for ascending order
      },
    });
    console.log(
      "standard_comments data consoled here =====>>",
      standard_commentsList
    );

    const totalCount = await prisma.standard_comments.count({
      where: prismaWhereClause,
    });

    return NextResponse.json(
      { standard_commentsList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading standard_comments", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: standard_comments = await request.json();

  console.log("request body: ", body);

  const result = standard_commentsModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.standard_comments.findFirst({
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
        { response: "Location name already exists!" },
        { status: 400 }
      );
    }
    const user = await prisma.standard_comments.create({
      data: body as Prisma.standard_commentsCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating standard_comments", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: standard_comments = await request.json();
  console.log("request body: ", body);

  const result = standard_commentsModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const standard_comments = await prisma.standard_comments.findUnique({
      where: { id: body.id || undefined },
    });
    if (standard_comments && standard_comments.id) {
      const updatedstandard_comments = await prisma.standard_comments.update({
        where: { id: standard_comments.id },
        data: body as Prisma.standard_commentsUpdateInput,
      });

      return NextResponse.json(updatedstandard_comments, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "standard_comments details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating standard_comments", 500);
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
    const standard_commentsData = await prisma.standard_comments.findUnique({
      where: {
        id: body.id,
      },
    });

    if (standard_commentsData && standard_commentsData.id) {
      let updatedstandard_comments = null;
      if (body.type == "delete") {
        updatedstandard_comments = await prisma.standard_comments.update({
          where: { id: standard_commentsData.id },
          data: {
            deleted: true,
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
          },
        });
      } else if (body.type == "patch") {
        updatedstandard_comments = await prisma.standard_comments.update({
          where: { id: standard_commentsData.id },
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

      return NextResponse.json(updatedstandard_comments, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "standard_comments details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating standard_comments", 500);
  } finally {
    await prisma.$disconnect();
  }
}
