import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { roleModel } from "@/prisma/zod/role";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type role = z.infer<typeof roleModel>;

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

  const prismaWhereClause: Prisma.roleWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.roleWhereInput["AND"])
        : undefined,
  };
  console.log("Role uuid hceck here =====>>", prismaWhereClause);

  try {
    const roleList = await prisma.role.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        created_at: "desc", // or 'asc' for ascending order
      },
    });
    console.log("role data consoled here =====>>", roleList);

    const totalCount = await prisma.role.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ roleList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading role", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: role = await request.json();

  console.log("request body: ", body);

  const result = roleModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.role.findFirst({
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
        { response: "Location name already exists!" },
        { status: 400 }
      );
    }
    const user = await prisma.role.create({
      data: body as Prisma.roleCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating role", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: role = await request.json();
  console.log("request body: ", body);

  const result = roleModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: body.id || undefined },
    });
    if (role && role.id) {
      const updatedrole = await prisma.role.update({
        where: { id: role.id },
        data: body as Prisma.roleUpdateInput,
      });

      return NextResponse.json(updatedrole, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "role details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating role", 500);
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
