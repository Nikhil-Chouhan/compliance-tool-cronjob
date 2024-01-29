import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { organizationModel } from "@/prisma/zod/organization";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type organization = z.infer<typeof organizationModel>;

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

  const prismaWhereClause: Prisma.organizationWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.organizationWhereInput["AND"])
        : undefined,
  };

  try {
    const organizationList = await prisma.organization.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
      include: {
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.organization.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ organizationList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading organization", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: organization = await request.json();

  const result = organizationModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.organization.findFirst({
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
    const organizationData = await prisma.organization.create({
      data: body as Prisma.organizationCreateInput,
    });
    return NextResponse.json({ response: organizationData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating organization", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: organization = await request.json();
  console.log("request body: ", body);

  const result = organizationModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: body?.id || undefined },
    });
    if (organization && organization.id) {
      const updatedorganization = await prisma.organization.update({
        where: { id: organization.id },
        data: body as Prisma.organizationUpdateInput,
      });

      return NextResponse.json(updatedorganization, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "organization details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating organization", 500);
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
    const organizationData = await prisma.organization.findUnique({
      where: {
        id: body.id,
      },
    });

    if (organizationData && organizationData.id) {
      let updatedorganization = null;
      if (body.type == "delete") {
        updatedorganization = await prisma.organization.update({
          where: { id: organizationData.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      }
      else if (body.type == "patch") {
        updatedorganization = await prisma.organization.update({
          where: { id: organizationData.id },
          data: {
            status: body.status,
          },
        });
      }
      else {
        return NextResponse.json(
          { response: "Invalid request" },
          { status: 400 }
        );
      }

      return NextResponse.json(updatedorganization, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "organization details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating organization", 500);
  } finally {
    await prisma.$disconnect();
  }
}
