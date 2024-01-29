import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { user_function_mappingModel } from "@/prisma/zod/user_function_mapping";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type user_function_mapping = z.infer<typeof user_function_mappingModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    filteruser_id: request.nextUrl.searchParams.get("filteruserId"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filterid", "filteruser_id"];

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

  const prismaWhereClause: Prisma.user_function_mappingWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.user_function_mappingWhereInput["AND"])
        : undefined,
  };

  try {
    const user_function_mappingList =
      await prisma.user_function_mapping.findMany({
        where: prismaWhereClause,
        skip: offset,
        take: take,
        orderBy: {
          created_at: "desc", // or 'asc' for ascending order
        },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
            },
          },
          entity: {
            select: {
              id: true,
              name: true,
            },
          },
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

    const totalCount = await prisma.user_function_mapping.count({
      where: prismaWhereClause,
    });

    function flattenObject(obj, parentKey = "") {
      const flattened = {};
      for (const key in obj) {
        // const newKey = parentKey ? `${parentKey}_${key}` : key;
        const newKey = parentKey ? `${key}` : key;

        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !(obj[key] instanceof Date)
        ) {
          const nestedFlatten = flattenObject(obj[key], newKey);
          Object.assign(flattened, nestedFlatten);
        } else if (obj[key] instanceof Date) {
          const options = { day: "2-digit", month: "short", year: "numeric" };

          flattened[newKey] = obj[key].toLocaleDateString("en-US", options); // Convert date to ISO string
        } else {
          flattened[newKey] = obj[key];
        }
      }
      return flattened;
    }

    const user_function_mappingFlatList = user_function_mappingList.map(
      (item) => {
        const flattenedItem = flattenObject(item.activity_mapping); // Flatten activity_mapping fields

        return {
          ...flattenObject(item), // Flatten top-level fields
          ...flattenedItem, // Add flattened activity_mapping fields outside the nested structure
          user_name: item.user.first_name,
          entity_name: item.entity.name,
          business_unit_name: item.business_unit.name,
          function_name: item.function.name,
        };
      }
    );

    return NextResponse.json(
      { user_function_mappingFlatList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading user_function_mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: user_function_mapping = await request.json();

  // const result = user_function_mappingModel.safeParse(body);
  // if (!result.success) {
  //   const { errors } = result.error;

  //   return NextResponse.json(
  //     { response: "Invalid request", errors },
  //     { status: 400 }
  //   );
  // }
  const { function_department_ids, ...otherData } = body;

  try {
    // const existRecord = await prisma.user_function_mapping.findFirst({
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
    let user_function_mappingData;

    for (const departmentId of function_department_ids) {
      try {
        user_function_mappingData = await prisma.user_function_mapping.create({
          data: {
            ...otherData,
            function_department_id: departmentId,
          } as Prisma.user_function_mappingCreateInput,
        });
      } catch (e) {
        // Handle individual errors if needed
        console.log("Error creating activity_mapping:", e);
      }
    }
    return NextResponse.json(
      { response: user_function_mappingData },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error creating user_function_mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: user_function_mapping = await request.json();
  console.log("request body: ", body);

  const result = user_function_mappingModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const user_function_mapping = await prisma.user_function_mapping.findUnique(
      {
        where: { id: body?.id || undefined },
      }
    );
    if (user_function_mapping && user_function_mapping.id) {
      const updateduser_function_mapping =
        await prisma.user_function_mapping.update({
          where: { id: user_function_mapping.id },
          data: body as Prisma.user_function_mappingUpdateInput,
        });

      return NextResponse.json(updateduser_function_mapping, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "user_function_mapping details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating user_function_mapping", 500);
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
    const user_function_mappingData =
      await prisma.user_function_mapping.findUnique({
        where: {
          id: body.id,
        },
      });

    if (user_function_mappingData && user_function_mappingData.id) {
      let updateduser_function_mapping = null;
      if (body.type == "delete") {
        updateduser_function_mapping =
          await prisma.user_function_mapping.update({
            where: { id: user_function_mappingData.id },
            data: {
              deleted_at: new Date(),
              deleted: true,
            },
          });
      }
      // else if (body.type == "patch") {
      //   updateduser_function_mapping = await prisma.user_function_mapping.update({
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

      return NextResponse.json(updateduser_function_mapping, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "user_function_mapping details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating user_function_mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}
