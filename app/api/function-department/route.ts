import { Prisma, prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { function_departmentModel } from "@/prisma/zod/function_department";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type function_department = z.infer<typeof function_departmentModel>;

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

  const prismaWhereClause: Prisma.function_departmentWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.function_departmentWhereInput["AND"])
        : undefined,
  };

  try {
    const function_departmentList = await prisma.function_department.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
    });

    const totalCount = await prisma.function_department.count({
      where: prismaWhereClause,
    });

    return NextResponse.json(
      { function_departmentList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading function_department", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: function_department = await request.json();

  console.log("request body: ", body);

  const result = function_departmentModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.function_department.findFirst({
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
        { response: "Function Department name already exists!" },
        { status: 400 }
      );
    }
    const user = await prisma.function_department.create({
      data: body as Prisma.function_departmentCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating function_department", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: function_department = await request.json();
  console.log("request body: ", body);

  const result = function_departmentModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const function_department = await prisma.function_department.findUnique({
      where: { id: body?.id || undefined },
    });
    if (function_department && function_department.id) {
      const updatedfunction_department =
        await prisma.function_department.update({
          where: { id: function_department.id },
          data: body as Prisma.function_departmentUpdateInput,
        });

      return NextResponse.json(updatedfunction_department, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "function_department details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating function_department", 500);
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
    const function_departmentData = await prisma.function_department.findUnique(
      {
        where: {
          id: body.id,
        },
      }
    );

    if (function_departmentData && function_departmentData.id) {
      let updatedfunction_department = null;
      if (body.type == "delete") {
        updatedfunction_department = await prisma.function_department.update({
          where: { id: function_departmentData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      }
      // else if (body.type == "patch") {
      //   updatedfunction_department = await prisma.function_department.update({
      //     where: { id: function_departmentData.id },
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

      return NextResponse.json(updatedfunction_department, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "function_department details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating function_department", 500);
  } finally {
    await prisma.$disconnect();
  }
}
