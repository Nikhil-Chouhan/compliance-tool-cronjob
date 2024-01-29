import { Prisma, prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { stateModel } from "@/prisma/zod/state";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type State = z.infer<typeof stateModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    country_id: request.nextUrl.searchParams.get("country_id"),
  };
  const { page, pageSize } = queryParams;

  let offset = 0;
  let take = undefined;
  if (pageSize != "-1") {
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
      acc.push(condition);
    }
    return acc;
  }, [] as Condition[]);

  const prismaWhereClause: Prisma.stateWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.stateWhereInput["AND"])
        : undefined,
    country_id: queryParams.country_id
      ? parseInt(queryParams.country_id, 10)
      : undefined,
  };

  try {
    const stateList = await prisma.state.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        name: "asc", // or 'asc' for ascending order
      },
      include: {
        country: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.state.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ stateList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating state", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: State = await request.json();

  console.log("request body: ", body);

  const result = stateModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.state.findFirst({
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
        { response: "State name already exists!" },
        { status: 400 }
      );
    }
    const stateData = await prisma.state.create({
      data: body as Prisma.stateCreateInput,
    });
    return NextResponse.json({ response: stateData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating state", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: State = await request.json();

  const result = stateModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const stateData = await prisma.state.findUnique({
      where: { id: body.id || undefined },
    });

    if (stateData && stateData.id) {
      const updatedState = await prisma.state.update({
        where: { id: stateData.id },
        data: body as Prisma.stateUpdateInput,
      });

      return NextResponse.json(updatedState, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "State details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating state", 500);
  } finally {
    await prisma.$disconnect();
  }
}

// export async function DELETE(request: NextRequest)
export async function PATCH(request: NextRequest) {
  const body: patchType = await request.json();
  console.log("request body: ", body);
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
    const stateData = await prisma.state.findUnique({
      where: {
        id: body.id,
      },
    });
    console.log("users are", stateData);
    if (stateData && stateData.id) {
      let updatedstate = null;
      if (body.type == "delete") {
        updatedstate = await prisma.state.update({
          where: { id: stateData.id },
          data: {
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
            deleted: true,
          },
        });
      } else if (body.type == "patch") {
        updatedstate = await prisma.state.update({
          where: { id: stateData.id },
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

      return NextResponse.json(updatedstate, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "State details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating state", 500);
  } finally {
    await prisma.$disconnect();
  }
}
