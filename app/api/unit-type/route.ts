import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { unit_typeModel } from "@/prisma/zod/unit_type";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type unit_type = z.infer<typeof unit_typeModel>;

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
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filterid", "filterdescription"];

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

  const prismaWhereClause: Prisma.unit_typeWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.unit_typeWhereInput["AND"])
        : undefined,
  };
  console.log("Unit Type uuid hceck here =====>>", prismaWhereClause);

  try {
    const unit_typeList = await prisma.unit_type.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
    });
    console.log("unit_type data consoled here =====>>", unit_typeList);

    const totalCount = await prisma.unit_type.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ unit_typeList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading unit_type", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: unit_type = await request.json();

  console.log("request body: ", body);

  const result = unit_typeModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.unit_type.findFirst({
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
    const user = await prisma.unit_type.create({
      data: body as Prisma.unit_typeCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating role", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: unit_type = await request.json();
  console.log("request body: ", body);

  const result = unit_typeModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const unit_type = await prisma.unit_type.findUnique({
      where: { id: body.id || undefined },
    });
    if (unit_type && unit_type.id) {
      const updatedunit_type = await prisma.unit_type.update({
        where: { id: unit_type.id },
        data: body as Prisma.unit_typeUpdateInput,
      });

      return NextResponse.json(updatedunit_type, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "unit_type details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating unit_type", 500);
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
    const unit_typeData = await prisma.unit_type.findUnique({
      where: {
        id: body.id,
      },
    });

    if (unit_typeData && unit_typeData.id) {
      let updatedunit_type = null;
      if (body.type == "delete") {
        updatedunit_type = await prisma.unit_type.update({
          where: { id: unit_typeData.id },
          data: {
            deleted: true,
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
          },
        });
      } else if (body.type == "patch") {
        updatedunit_type = await prisma.unit_type.update({
          where: { id: unit_typeData.id },
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

      return NextResponse.json(updatedunit_type, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "unit_type details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating unit_type", 500);
  } finally {
    await prisma.$disconnect();
  }
}
