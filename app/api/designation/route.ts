import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { designationModel } from "@/prisma/zod/designation";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type designation = z.infer<typeof designationModel>;

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

  const prismaWhereClause: Prisma.designationWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.designationWhereInput["AND"])
        : undefined,
  };

  try {
    const designationList = await prisma.designation.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
    });

    const totalCount = await prisma.designation.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ designationList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading designation", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: designation = await request.json();

  const result = designationModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.designation.findFirst({
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
        { response: "Designation name already exists!" },
        { status: 400 }
      );
    }
    const designationData = await prisma.designation.create({
      data: body as Prisma.designationCreateInput,
    });
    return NextResponse.json({ response: designationData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating designation", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: designation = await request.json();
  console.log("request body: ", body);

  const result = designationModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const designation = await prisma.designation.findUnique({
      where: { id: body?.id || undefined },
    });
    if (designation && designation.id) {
      const updateddesignation = await prisma.designation.update({
        where: { id: designation.id },
        data: body as Prisma.designationUpdateInput,
      });

      return NextResponse.json(updateddesignation, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "designation details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating designation", 500);
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
    const designationData = await prisma.designation.findUnique({
      where: {
        id: body.id,
      },
    });

    if (designationData && designationData.id) {
      let updateddesignation = null;
      if (body.type == "delete") {
        updateddesignation = await prisma.designation.update({
          where: { id: designationData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      }
      //else if (body.type == "patch") {
      //   updateddesignation = await prisma.designation.update({
      //     where: { id: designationData.id },
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

      return NextResponse.json(updateddesignation, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "Designation details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating designation", 500);
  } finally {
    await prisma.$disconnect();
  }
}
