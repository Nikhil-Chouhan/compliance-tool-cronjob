import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { industryModel } from "@/prisma/zod/industry";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type industry = z.infer<typeof industryModel>;

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

  const prismaWhereClause: Prisma.industryWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.industryWhereInput["AND"])
        : undefined,
  };

  try {
    const industryList = await prisma.industry.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
    });

    const totalCount = await prisma.industry.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ industryList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading industry", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: industry = await request.json();

  const result = industryModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.industry.findFirst({
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
        { response: "Name already exists!" },
        { status: 400 }
      );
    }
    const industryData = await prisma.industry.create({
      data: body as Prisma.industryCreateInput,
    });
    return NextResponse.json({ response: industryData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating industry", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: industry = await request.json();
  console.log("request body: ", body);

  const result = industryModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const industry = await prisma.industry.findUnique({
      where: { id: body?.id || undefined },
    });
    if (industry && industry.id) {
      const updatedindustry = await prisma.industry.update({
        where: { id: industry.id },
        data: body as Prisma.industryUpdateInput,
      });

      return NextResponse.json(updatedindustry, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "industry details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating industry", 500);
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
    const industryData = await prisma.industry.findUnique({
      where: {
        id: body.id,
      },
    });

    if (industryData && industryData.id) {
      let updatedindustry = null;
      if (body.type == "delete") {
        updatedindustry = await prisma.industry.update({
          where: { id: industryData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      }
      // else if (body.type == "patch") {
      //   updatedorganization = await prisma.organization.update({
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

      return NextResponse.json(updatedindustry, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "industry details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating industry", 500);
  } finally {
    await prisma.$disconnect();
  }
}
