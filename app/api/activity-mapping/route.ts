import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { activity_mappingModel } from "@/prisma/zod/activity_mapping";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError, generateUniqueCode } from "@/app/utils/modelUtils";

export type activity_mapping = z.infer<typeof activity_mappingModel>;

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

  const prismaWhereClause: Prisma.activity_mappingWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.activity_mappingWhereInput["AND"])
        : undefined,
  };
  console.log("Activity Mapping uuid hceck here =====>>", prismaWhereClause);

  try {
    const activity_mappingRawList = await prisma.activity_mapping.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
      include: {
        crs_activity: {
          select: {
            activity_code: true,
            title: true,
            legislation: true,
            rule: true,
            reference: true,
            who: true,
            when: true,
            activity: true,
            procedure: true,
            frequency: true,
            compliance_type: true,
            imprison_duration: true,
            imprison_applies_to: true,
            impact_on_unit: true,
            impact_on_organization: true,
            country: true,
            state: true,
            law_category: true,
          },
        },
        executor: {
          select: {
            first_name: true,
          },
        },
        evaluator: {
          select: {
            first_name: true,
          },
        },
        function_head: {
          select: {
            first_name: true,
          },
        },
        function: {
          select: {
            name: true,
          },
        },
        business_unit: {
          select: { entity: { select: { name: true } }, name: true },
        },
      },
    });
    console.log(
      "activity_mapping data consoled here =====>>",
      activity_mappingRawList
    );

    const totalCount = await prisma.activity_mapping.count({
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

    const activity_mappingFlatList = activity_mappingRawList.map((item) => {
      const flattenedItem = flattenObject(item); // Flatten fields

      return {
        ...flattenObject(item), // Flatten top-level fields
        ...flattenedItem, // Add flattened fields outside the nested structure
        executor_name: item.executor.first_name,
        evaluator_name: item.evaluator.first_name,
        function_head_name: item.function_head.first_name,
        business_unit_name: item.business_unit.name,
        entity_name: item.business_unit.entity.name,
        function_name: item.function.name,
      };
    });
    return NextResponse.json(
      { activity_mappingFlatList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading activity mapping", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("request body: ", body);

  //   const result = activity_mappingModel.safeParse(body);
  //   if (!result.success) {
  //     const { errors } = result.error;

  //     return NextResponse.json(
  //       { response: "Invalid request", errors },
  //       { status: 400 }
  //     );
  //   }

  const { crs_activity_ids, ...otherData } = body;
  const autoGeneratedCode = generateUniqueCode("compliance_activity");

  try {
    let activity_mappingData;
    for (const crs_activity_id of crs_activity_ids) {
      try {
        activity_mappingData = await prisma.activity_mapping.create({
          data: {
            ...otherData,
            unit_activity_id: autoGeneratedCode,
            crs_activity_id: crs_activity_id,
          } as Prisma.activity_mappingCreateInput,
        });
      } catch (e) {
        // Handle individual errors if needed
        console.log("Error creating activity_mapping:", e);
      }
    }
    return NextResponse.json(
      { response: activity_mappingData },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error creating organization", 500);
  } finally {
    await prisma.$disconnect();
  }
  //   crs_activity_ids.map(async (crs_activity_id) => {
  //     console.log("crs id:", crs_activity_id);
  //     try {
  //       const activity_mapping = await prisma.activity_mapping.create({
  //         data: {
  //           ...otherData,
  //           unit_activity_id: autoGeneratedCode,
  //           crs_activity_id,
  //         } as Prisma.activity_mappingCreateInput,
  //       });

  //       return activity_mapping;
  //     } catch (e) {
  //       console.error("Error creating activity_mapping:", e);
  //       return null;
  //     }
  //   });
}

export async function PUT(request: NextRequest) {
  const body: activity_mapping = await request.json();
  console.log("request body: ", body);

  const result = activity_mappingModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const activity_mapping = await prisma.activity_mapping.findUnique({
      where: { id: body.id || undefined },
    });
    if (activity_mapping && activity_mapping.id) {
      const updatedactivity_mapping = await prisma.activity_mapping.update({
        where: { id: activity_mapping.id },
        data: body as Prisma.activity_mappingUpdateInput,
      });

      return NextResponse.json(updatedactivity_mapping, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "activity_mapping details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating activity_mapping", 500);
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
    const roleData = await prisma.role.findUnique({
      where: {
        id: body.id,
      },
    });

    if (roleData && roleData.id) {
      let updatedrole = null;
      if (body.type == "delete") {
        updatedrole = await prisma.role.update({
          where: { id: roleData.id },
          data: {
            deleted: true,
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
          },
        });
      } else if (body.type == "patch") {
        updatedrole = await prisma.role.update({
          where: { id: roleData.id },
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

      return NextResponse.json(updatedrole, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "role details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating role", 500);
  } finally {
    await prisma.$disconnect();
  }
}
