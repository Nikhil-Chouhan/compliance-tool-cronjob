import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { entityModel } from "@/prisma/zod/entity";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type entity = z.infer<typeof entityModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
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

  const prismaWhereClause: Prisma.entityWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.entityWhereInput["AND"])
        : undefined,
  };

  try {
    const entityList = await prisma.entity.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.entity.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ entityList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading entity", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: entity = await request.json();
  console.log("result", body);

  const result = entityModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.entity.findFirst({
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
        { response: "Entity already exists!" },
        { status: 400 }
      );
    }
    const entityData = await prisma.entity.create({
      data: body as Prisma.entityCreateInput,
    });
    return NextResponse.json({ response: entityData }, { status: 200 });
  } catch (e) {
    return handleError(e, "Error creating Entity", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: entity = await request.json();
  console.log("request body: ", body);

  const result = entityModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const entity = await prisma.entity.findUnique({
      where: { id: body?.id || undefined },
    });
    if (entity && entity.id) {
      const updatedentity = await prisma.entity.update({
        where: { id: entity.id },
        data: body as Prisma.entityUpdateInput,
      });

      return NextResponse.json(updatedentity, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "entity details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating entity", 500);
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
    const entityData = await prisma.entity.findUnique({
      where: {
        id: body.id,
      },
    });

    if (entityData && entityData.id) {
      let updatedentity = null;
      if (body.type == "delete") {
        updatedentity = await prisma.entity.update({
          where: { id: entityData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      } else if (body.type == "patch") {
        updatedentity = await prisma.entity.update({
          where: { id: entityData.id },
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

      return NextResponse.json(updatedentity, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "entity details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating entity", 500);
  } finally {
    await prisma.$disconnect();
  }
}
