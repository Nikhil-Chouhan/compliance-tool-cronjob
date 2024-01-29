import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { crs_activityModel } from "@/prisma/zod/crs_activity";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type crs_activity = z.infer<typeof crs_activityModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    filterlegislation: request.nextUrl.searchParams.get("filterLegislation"),
    filterrule: request.nextUrl.searchParams.get("filterRule"),
    columns: request.nextUrl.searchParams.get("columnName"), //columns parameter
  };

  const { page, pageSize, columns } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = [
    "filtername",
    "filterid",
    "filterlegislation",
    "filterrule",
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

  const columnsToSelect = columns ? columns.split(",") : undefined;

  const prismaWhereClause: Prisma.crs_activityWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.crs_activityWhereInput["AND"])
        : undefined,
  };

  try {
    const crs_activityList = await prisma.crs_activity.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      select: {
        ...(columnsToSelect
          ? {
              ...(columnsToSelect &&
                columnsToSelect.reduce((acc, column) => {
                  acc[column] = true;
                  return acc;
                }, {} as Record<string, true>)),
            }
          : {
              id: true,
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
              country: true,
              state: true,
              law_category: true,
            }), // Fetch all columns as a default
      },

      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
    });

    const totalCount = await prisma.crs_activity.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ crs_activityList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading crs activity", 500);
  } finally {
    await prisma.$disconnect();
  }
}
