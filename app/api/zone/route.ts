import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { zoneModel } from "@/prisma/zod/zone";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type zone = z.infer<typeof zoneModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filtername: request.nextUrl.searchParams.get("filterName"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    filterentity_id: request.nextUrl.searchParams.get("filterentityId"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filterid", "filterentity_id"];

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

  const prismaWhereClause: Prisma.zoneWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.zoneWhereInput["AND"])
        : undefined,
  };

  try {
    const zoneList = await prisma.zone.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
      include: {
        entity: {
          select: {
            id: true,
            name: true,
          },
        },
        business_vertical: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.zone.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ zoneList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading zone", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: zone = await request.json();

  const result = zoneModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.zone.findFirst({
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
    const zoneData = await prisma.zone.create({
      data: body as Prisma.zoneCreateInput,
    });
    return NextResponse.json({ response: zoneData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating zone", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: zone = await request.json();
  console.log("request body: ", body);

  const result = zoneModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const zone = await prisma.zone.findUnique({
      where: { id: body?.id || undefined },
    });
    if (zone && zone.id) {
      const updatedzone = await prisma.zone.update({
        where: { id: zone.id },
        data: body as Prisma.zoneUpdateInput,
      });

      return NextResponse.json(updatedzone, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "zone details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating zone", 500);
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
    const zoneData = await prisma.zone.findUnique({
      where: {
        id: body.id,
      },
    });

    if (zoneData && zoneData.id) {
      let updatedzone = null;
      if (body.type == "delete") {
        updatedzone = await prisma.zone.update({
          where: { id: zoneData.id },
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

      return NextResponse.json(updatedzone, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "zone details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating zone", 500);
  } finally {
    await prisma.$disconnect();
  }
}
