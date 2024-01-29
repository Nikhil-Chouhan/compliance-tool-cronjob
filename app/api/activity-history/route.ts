import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { activity_historyModel } from "@/prisma/zod/activity_history";
import { number, object, z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type activity_history = z.infer<typeof activity_historyModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    filteractivity_configuration_id:
      request.nextUrl.searchParams.get("filterConfigID"),
    filteractivity_row_type: request.nextUrl.searchParams.get(
      "filteractivityRowType"
    ),
  };

  const { page, pageSize, filteractivity_row_type } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = [
    "filtername",
    "filterid",
    "filteractivity_configuration_id",
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

  const prismaWhereClause: Prisma.activity_historyWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.activity_historyWhereInput["AND"])
        : undefined,
  };

  try {
    const activity_historyRawList = await prisma.activity_history.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
      include: {
        user: { select: { first_name: true } },
      },
    });
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    const activity_historyFormattedList = activity_historyRawList.map(
      (activity) => {
        return {
          ...activity,
          legal_due_date: activity.legal_due_date.toLocaleDateString(
            "en-US",
            options
          ),
          unit_head_due_date: activity.unit_head_due_date.toLocaleDateString(
            "en-US",
            options
          ),
          function_head_due_date:
            activity.function_head_due_date.toLocaleDateString(
              "en-US",
              options
            ),
          evaluator_due_date: activity.evaluator_due_date.toLocaleDateString(
            "en-US",
            options
          ),
          executor_due_date: activity.executor_due_date.toLocaleDateString(
            "en-US",
            options
          ),
          completion_date: activity.completion_date?.toLocaleDateString(
            "en-US",
            options
          ),
        };
      }
    );

    const totalCount = await prisma.activity_history.count({
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

    const activity_historyFlatList = activity_historyFormattedList.map(
      (item) => {
        const { document, ...restItem } = item;
        return {
          document,
          ...flattenObject(restItem), // Flatten top-level fields
        };
      }
    );

    if (filteractivity_row_type) {
      return NextResponse.json(
        { activity_historyRow: activity_historyFlatList[0], totalCount },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { activity_historyFlatList, totalCount },
        { status: 200 }
      );
    }
  } catch (e) {
    return handleError(e, "error reading activity_history", 500);
  } finally {
    await prisma.$disconnect();
  }
}

// export async function POST(request: NextRequest) {
//   const body: activity_history = await request.json();

//   const result = activity_historyModel.safeParse(body);
//   if (!result.success) {
//     const { errors } = result.error;

//     return NextResponse.json(
//       { response: "Invalid request", errors },
//       { status: 400 }
//     );
//   }

//   try {
//     const existRecord = await prisma.activity_history.findFirst({
//       where: {
//         deleted: false,
//         name: {
//           equals: body.name,
//           mode: "insensitive",
//         },
//       },
//     });
//     if (existRecord) {
//       return NextResponse.json(
//         { response: "Name already exists!" },
//         { status: 400 }
//       );
//     }
//     const activity_historyData = await prisma.activity_history.create({
//       data: body as Prisma.activity_historyCreateInput,
//     });
//     return NextResponse.json(
//       { response: activity_historyData },
//       { status: 200 }
//     );
//   } catch (e) {
//     return handleError(e, "error creating activity_history", 500);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function PUT(request: NextRequest) {
  const body: activity_history = await request.json();

  try {
    let updatedactivity_history;
    let formattedBody;
    const activity_history = await prisma.activity_history.findUnique({
      where: { id: body?.id || undefined },
      include: {
        activity_configuration: { select: { activity_maker_checker: true } },
      },
    });
    console.log("activity_history : ", activity_history);

    if (activity_history && activity_history.id) {
      if (body.type === "complete") {
        let activity_status;
        if (
          activity_history.activity_configuration.activity_maker_checker != 0
        ) {
          activity_status = "Approval_Pending";
        } else if (body.completion_date < activity_history.legal_due_date) {
          activity_status = "Complied";
        } else if (
          body.completion_date > activity_history.executor_due_date &&
          body.completion_date < activity_history.legal_due_date
        ) {
          activity_status = "Delayed";
        }
        // else {
        //   activity_status = "Non_Complied";
        // }

        formattedBody = {
          ...activity_history,
          ...body,
          completion_date: new Date(body.completion_date),
          activity_history_status: activity_status,
        };
      } else if (body.type === "update") {
        formattedBody = {
          ...activity_history,
          ...body,
          completion_date: new Date(body.completion_date),
        };
      } else if (body.type === "noncompliance") {
        formattedBody = {
          ...activity_history,
          ...body,
        };
      }
      const { type, activity_configuration, ...updatedBody } = formattedBody; // Remove 'id' from the body

      console.log("updatedBody : ", updatedBody);

      const result = activity_historyModel.safeParse(updatedBody);
      console.log("result", result);
      if (!result.success) {
        const { errors } = result.error;

        return NextResponse.json(
          { response: "Invalid request", errors, updatedBody },
          { status: 400 }
        );
      } else {
        updatedactivity_history = await prisma.activity_history.update({
          where: { id: updatedBody.id },
          data: updatedBody as Prisma.activity_historyUpdateInput,
        });
      }

      return NextResponse.json(
        { response: updatedactivity_history },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { response: "activity_history details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating activity_history", 500);
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
    const activity_historyData = await prisma.activity_history.findUnique({
      where: {
        id: body.id,
      },
    });

    if (activity_historyData && activity_historyData.id) {
      let updatedactivity_history = null;
      if (body.type == "delete") {
        updatedactivity_history = await prisma.activity_history.update({
          where: { id: activity_historyData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      }
      // else if (body.type == "patch") {
      //   updatedactivity_history = await prisma.activity_history.update({
      //     where: { id: activity_historyData.id },
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

      return NextResponse.json(updatedactivity_history, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "activity_history details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating activity_history", 500);
  } finally {
    await prisma.$disconnect();
  }
}
function datetime(): any {
  throw new Error("Function not implemented.");
}
