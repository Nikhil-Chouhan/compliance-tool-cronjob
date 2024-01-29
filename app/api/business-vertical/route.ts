import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { business_verticalModel } from "@/prisma/zod/business_vertical";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type business_vertical = z.infer<typeof business_verticalModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    filterentity_id: request.nextUrl.searchParams.get("filterentityId"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filterid", "filterentity_id"];

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

  const prismaWhereClause: Prisma.business_verticalWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.business_verticalWhereInput["AND"])
        : undefined,
  };

  try {
    const business_verticalList = await prisma.business_vertical.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.business_vertical.count({
      where: prismaWhereClause,
    });

    return NextResponse.json(
      { business_verticalList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading business vertical", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: business_vertical = await request.json();

  const result = business_verticalModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.business_vertical.findFirst({
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
        { response: "Name already exists!" },
        { status: 400 }
      );
    }
    const business_verticalData = await prisma.business_vertical.create({
      data: body as Prisma.business_verticalCreateInput,
    });
    return NextResponse.json(
      { response: business_verticalData },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error creating business vertical", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: business_vertical = await request.json();
  console.log("request body: ", body);

  const result = business_verticalModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const business_vertical = await prisma.business_vertical.findUnique({
      where: { id: body?.id || undefined },
    });
    if (business_vertical && business_vertical.id) {
      const updatedbusiness_vertical = await prisma.business_vertical.update({
        where: { id: business_vertical.id },
        data: body as Prisma.business_verticalUpdateInput,
      });

      return NextResponse.json(updatedbusiness_vertical, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "business vertical details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating business vertical", 500);
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
    const business_verticalData = await prisma.business_vertical.findUnique({
      where: {
        id: body.id,
      },
    });

    if (business_verticalData && business_verticalData.id) {
      let updatedbusiness_vertical = null;
      if (body.type == "delete") {
        updatedbusiness_vertical = await prisma.business_vertical.update({
          where: { id: business_verticalData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      }
      // else if (body.type == "patch") {
      //   updatedorganization = await prisma.organization.update({
      //     where: { id: organisationData.id },
      //     data: {
      //       status: body.status,
      //     },
      //   });
      // }
      else {
        return NextResponse.json(
          { response: "Invalid request" },
          { status: 400 }
        );
      }

      return NextResponse.json(updatedbusiness_vertical, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "business vertical details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating business vertical", 500);
  } finally {
    await prisma.$disconnect();
  }
}
