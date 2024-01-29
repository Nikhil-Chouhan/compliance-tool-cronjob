import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { unit_function_mappingModel } from "@/prisma/zod/unit_function_mapping";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type unit_function_mapping = z.infer<typeof unit_function_mappingModel>;

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

  const prismaWhereClause: Prisma.unit_function_mappingWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.unit_function_mappingWhereInput["AND"])
        : undefined,
  };

  try {
    const unit_function_mappingList =
      await prisma.unit_function_mapping.findMany({
        where: prismaWhereClause,
        skip: offset,
        take: take,
        orderBy: {
          created_at: "desc", // or 'asc' for ascending order
        },
        include: {
          business_unit: {
            select: {
              id: true,
              name: true,
            },
          },
          function: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    const totalCount = await prisma.unit_function_mapping.count({
      where: prismaWhereClause,
    });

    return NextResponse.json(
      { unit_function_mappingList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading unit_function_mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: unit_function_mapping = await request.json();

  // const result = unit_function_mappingModel.safeParse(body);
  // if (!result.success) {
  //   const { errors } = result.error;

  //   return NextResponse.json(
  //     { response: "Invalid request", errors },
  //     { status: 400 }
  //   );
  // }

  try {
    // const existRecord = await prisma.unit_function_mapping.findFirst({
    //     where: {
    //       deleted: false,
    //       name: {
    //         equals: body.name,
    //         mode: "insensitive",
    //       },
    //     },
    // });
    // if (existRecord) {
    //   return NextResponse.json(
    //     { response: "Name already exists!" },
    //     { status: 400 }
    //   );
    // }
    const { function_department_ids, ...otherData } = body;

    let unit_function_mappingData;

    for (const departmentId of function_department_ids) {
      try {
        user_function_mappingData = await prisma.unit_function_mapping.create({
          data: {
            ...otherData,
            function_department_id: departmentId,
          } as Prisma.unit_function_mappingCreateInput,
        });
      } catch (e) {
        // Handle individual errors if needed
        console.log("Error creating unit_function_mapping:", e);
      }
    }
    return NextResponse.json(
      { response: unit_function_mappingData },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error creating unit_function_mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: unit_function_mapping = await request.json();
  console.log("request body: ", body);

  const result = unit_function_mappingModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const unit_function_mapping = await prisma.unit_function_mapping.findUnique(
      {
        where: { id: body?.id || undefined },
      }
    );
    if (unit_function_mapping && unit_function_mapping.id) {
      const updatedunit_function_mapping =
        await prisma.unit_function_mapping.update({
          where: { id: unit_function_mapping.id },
          data: body as Prisma.unit_function_mappingUpdateInput,
        });

      return NextResponse.json(updatedunit_function_mapping, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "unit_function_mapping details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating unit_function_mapping", 500);
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
    const unit_function_mappingData =
      await prisma.unit_function_mapping.findUnique({
        where: {
          id: body.id,
        },
      });

    if (unit_function_mappingData && unit_function_mappingData.id) {
      let updatedunit_function_mapping = null;
      if (body.type == "delete") {
        updatedunit_function_mapping =
          await prisma.unit_function_mapping.update({
            where: { id: unit_function_mappingData.id },
            data: {
              deleted_at: new Date(),
              deleted: true,
            },
          });
      }
      // else if (body.type == "patch") {
      //   updatedunit_function_mapping = await prisma.unit_function_mapping.update({
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

      return NextResponse.json(updatedunit_function_mapping, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "unit_function_mapping details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating unit_function_mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}
