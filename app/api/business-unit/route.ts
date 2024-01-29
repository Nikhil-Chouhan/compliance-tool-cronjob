import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { business_unitModel } from "@/prisma/zod/business_unit";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type business_unit = z.infer<typeof business_unitModel>;

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
    filterdescription: request.nextUrl.searchParams.get("filterDescription"),
    filterentity_id: request.nextUrl.searchParams.get("filterentityId"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = [
    "filtername",
    "filterid",
    "filterdescription",
    "filterentity_id",
  ];

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

  const prismaWhereClause: Prisma.business_unitWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.business_unitWhereInput["AND"])
        : undefined,
  };

  try {
    const business_unitList = await prisma.business_unit.findMany({
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
        business_vertical: {
          select: {
            id: true,
            name: true,
          },
        },
        zone: {
          select: {
            id: true,
            name: true,
          },
        },
        unit_type: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.business_unit.count({
      where: prismaWhereClause,
    });

    return NextResponse.json(
      { business_unitList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading business_unit", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: business_unit = await request.json();

  console.log("request body: ", body);

  const result = business_unitModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.business_unit.findFirst({
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
        { response: "business unit name already exists!" },
        { status: 400 }
      );
    }
    const user = await prisma.business_unit.create({
      data: body as Prisma.business_unitCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating business unit", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: business_unit = await request.json();
  console.log("request body: ", body);

  const result = business_unitModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const business_unit = await prisma.business_unit.findUnique({
      where: { id: body.id || undefined },
    });
    if (business_unit && business_unit.id) {
      const updatedbusiness_unit = await prisma.business_unit.update({
        where: { id: business_unit.id },
        data: body as Prisma.business_unitUpdateInput,
      });

      return NextResponse.json(updatedbusiness_unit, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "business unit details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating business unit", 500);
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
    const business_unitData = await prisma.business_unit.findUnique({
      where: {
        id: body.id,
      },
    });

    if (business_unitData && business_unitData.id) {
      let updatedbusiness_unit = null;
      if (body.type == "delete") {
        updatedbusiness_unit = await prisma.business_unit.update({
          where: { id: business_unitData.id },
          data: {
            deleted: true,
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
          },
        });
      } else {
        return NextResponse.json(
          { response: "Invalid request" },
          { status: 400 }
        );
      }

      return NextResponse.json(business_unitData, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "business unit details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating business unit", 500);
  } finally {
    await prisma.$disconnect();
  }
}
