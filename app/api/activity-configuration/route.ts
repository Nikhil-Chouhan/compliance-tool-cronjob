import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { activity_configurationModel } from "@/prisma/zod/activity_configuration";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError, generateUniqueCode } from "@/app/utils/modelUtils";

export type activity_configuration = z.infer<
  typeof activity_configurationModel
>;

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
    filterstatus: request.nextUrl.searchParams.get("filterStatus"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filterid", "filterstatus"];

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

  const prismaWhereClause: Prisma.activity_configurationWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.activity_configurationWhereInput["AND"])
        : undefined,
  };
  console.log(
    "Activity Configuration uuid hceck here =====>>",
    prismaWhereClause
  );

  try {
    const activity_configurationRawList =
      await prisma.activity_configuration.findMany({
        where: prismaWhereClause,
        skip: offset,
        take: take,
        orderBy: {
          created_at: "desc", // or 'asc' for ascending order
        },
        include: {
          activity_mapping: {
            select: {
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
                  impact: true,
                  event: true,
                  event_sub: true,
                },
              },
              business_unit: {
                select: { entity: { select: { name: true } }, name: true },
              },
              function: {
                select: { name: true },
              },
              unit_activity_id: true,
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
            },
          },
        },
      });

    console.log(
      "activity_configuration data consoled here =====>>",
      activity_configurationRawList
    );

    const totalCount = await prisma.activity_configuration.count({
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

    const activity_configurationFlatList = activity_configurationRawList.map(
      (item) => {
        const flattenedItem = flattenObject(item.activity_mapping); // Flatten activity_mapping fields

        return {
          ...flattenObject(item), // Flatten top-level fields
          ...flattenedItem, // Add flattened activity_mapping fields outside the nested structure
          function_name: item.activity_mapping.function.name,
          executor_name: item.activity_mapping.executor.first_name,
          evaluator_name: item.activity_mapping.evaluator.first_name,
          function_head_name: item.activity_mapping.function_head.first_name,
          entity_name: item.activity_mapping.business_unit.entity.name,
          business_unit_name: item.activity_mapping.business_unit.name,
        };
      }
    );

    console.log(
      "Flattened data consoled here =====>>",
      activity_configurationFlatList
    );
    return NextResponse.json(
      { activity_configurationFlatList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading activity_configuration", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("request body: ", body);

  //   const result = activity_configurationModel.safeParse(body);
  //   if (!result.success) {
  //     const { errors } = result.error;

  //     return NextResponse.json(
  //       { response: "Invalid request", errors },
  //       { status: 400 }
  //     );
  //   }

  const { activity_mapping_ids, ...otherData } = body;

  try {
    let activity_configurationData;
    const activity_configurationDataArray = [];

    for (const activity_mapping_id of activity_mapping_ids) {
      try {
        activity_configurationData = await prisma.activity_configuration.create(
          {
            data: {
              ...otherData,
              activity_mapping_id: activity_mapping_id,
            } as Prisma.activity_configurationCreateInput,
          }
        );
        activity_configurationDataArray.push(activity_configurationData);
      } catch (e) {
        // Handle individual errors if needed
        console.log("Error creating activity_configuration:", e);
      }
    }
    return NextResponse.json(
      { response: activity_configurationDataArray },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error creating organization", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: activity_configuration = await request.json();
  console.log("request body: ", body);

  const formattedBody = {
    ...body,
    legal_due_date: new Date(body.legal_due_date),
    unit_head_due_date: new Date(body.unit_head_due_date),
    function_head_due_date: new Date(body.function_head_due_date),
    evaluator_due_date: new Date(body.evaluator_due_date),
    executor_due_date: new Date(body.executor_due_date),
    first_alert: body.first_alert ? new Date(body.first_alert) : null,
    second_alert: body.second_alert ? new Date(body.second_alert) : null,
    third_alert: body.third_alert ? new Date(body.third_alert) : null,
  };

  const result = activity_configurationModel.safeParse(formattedBody);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const activity_configuration =
      await prisma.activity_configuration.findUnique({
        where: { id: formattedBody.id || undefined },
      });
    if (activity_configuration && activity_configuration.id) {
      const updatedactivity_configuration =
        await prisma.activity_configuration.update({
          where: { id: activity_configuration.id },
          data: formattedBody as Prisma.activity_configurationUpdateInput,
        });

      return NextResponse.json(
        { response: updatedactivity_configuration },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { response: "activity_configuration details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating activity_configuration", 500);
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
      { response: "Invalid data, kindly check your request!" },
      { status: 400 }
    );
  }

  if (
    body.type == "patch" &&
    (body.status === undefined || body.status === null)
  ) {
    return NextResponse.json(
      { response: "Invalid status, kindly check your request!" },
      { status: 400 }
    );
  }

  try {
    let dataExists;
    if (Array.isArray(body.id) && body.id.length > 1) {
      // Find many for an array of IDs
      dataExists = await prisma.activity_configuration.findMany({
        where: {
          id: {
            in: body.id as Prisma.IntFilter["in"],
          },
        },
      });
    } else {
      // Find unique for a single ID
      dataExists = await prisma.activity_configuration.findUnique({
        where: {
          id: body.id,
        },
      });
    }

    if (dataExists) {
      let updateStatus = null;
      if (body.type == "delete") {
        updateStatus = await prisma.role.update({
          where: { id: body.id },
          data: {
            deleted: true,
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
          },
        });
      } else if (body.type === "patch") {
        if (Array.isArray(body.id)) {
          // Update status for multiple IDs
          updateStatus = await prisma.activity_configuration.updateMany({
            where: {
              id: {
                in: body.id as Prisma.IntFilter["in"],
              },
            },
            data: {
              status: body.status,
            },
          });
          if (body.status == 1) {
            await createActivityHistoryEntries(body.id);
          }
        } else {
          // Update status for a single ID
          updateStatus = await prisma.activity_configuration.update({
            where: { id: body.id },
            data: {
              status: body.status,
            },
          });
          if (body.status == 1) {
            await createActivityHistoryEntries([body.id]);
          }
        }
      } else {
        return NextResponse.json(
          { response: "Invalid request" },
          { status: 400 }
        );
      }
      return NextResponse.json(updateStatus, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "Activity Details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error occured while updating", 500);
  } finally {
    await prisma.$disconnect();
  }
}

async function createActivityHistoryEntries(ids) {
  const existsInHistory = await prisma.activity_history.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (!existsInHistory.length) {
    const data = await prisma.activity_configuration.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        activity_mapping: {
          select: {
            executor_id: true,
            evaluator_id: true,
            function_head_id: true,
          },
        },
        id: true,
        activity_mapping_id: true,
        legal_due_date: true,
        unit_head_due_date: true,
        function_head_due_date: true,
        evaluator_due_date: true,
        executor_due_date: true,
      },
    });
    const promises = data.map(async (activity_config) => {
      try {
        const activity_historyData = await prisma.activity_history.create({
          data: {
            activity_mapping_id: activity_config.activity_mapping_id,
            activity_configuration_id: activity_config.id,
            executor_id: activity_config.activity_mapping.executor_id,
            evaluator_id: activity_config.activity_mapping.evaluator_id,
            function_head_id: activity_config.activity_mapping.function_head_id,
            legal_due_date: activity_config.legal_due_date,
            unit_head_due_date: activity_config.unit_head_due_date,
            function_head_due_date: activity_config.function_head_due_date,
            evaluator_due_date: activity_config.evaluator_due_date,
            executor_due_date: activity_config.executor_due_date,
          },
        });

        return activity_historyData;
      } catch (e) {
        // Handle individual errors if needed
        console.log("Error creating activity_history:", e);
      }
    });
    const activity_historyDataArray = await Promise.all(promises);

    return activity_historyDataArray.filter(Boolean);
  } else {
    return null; // Return null for items where no history entry is created
  }
}
