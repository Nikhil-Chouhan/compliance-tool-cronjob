import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword } from "../../utils/authUtils";
import { userModel } from "@/prisma/zod/user";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type user = z.infer<typeof userModel>;

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}

export async function GET(request: NextRequest) {
  const queryParams = {
    page: request.nextUrl.searchParams.get("page"),
    pageSize: request.nextUrl.searchParams.get("pageSize"),
    filterid: request.nextUrl.searchParams.get("filterId"),
    employee_id: request.nextUrl.searchParams.get("employee_id"),
    filterfirst_name: request.nextUrl.searchParams.get("filterFirstName"),
    filtermiddle_name: request.nextUrl.searchParams.get("filterMiddleName"),
    filterlast_name: request.nextUrl.searchParams.get("filterLastName"),
    filtermobile_no:
      request.nextUrl.searchParams.get("filterMobileNumber".toString()) || "",
    filterrole_id: request.nextUrl.searchParams.get("filterRole"),
    filterentity_id: request.nextUrl.searchParams.get("filterEntityId"),
    filterfunction_department_id: request.nextUrl.searchParams.get(
      "filterFunctionDepartmentId"
    ),
    columns: request.nextUrl.searchParams.get("columnName"), //columns parameter
  };
  const { page, pageSize, columns } = queryParams;
  console.log("query param =============> ", queryParams);

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize != "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }
  const filterProperties = [
    "filterid",
    "employee_id",
    "filterfirst_name",
    "filtermiddle_name",
    "filterlast_name",
    "filtermobile_no",
    "filterrole_id",
    "filterentity_id",
    "filterfunction_department_id",
  ];

  const conditions: Condition[] = filterProperties.reduce((acc, property) => {
    const paramValue = queryParams[property as keyof typeof queryParams];
    if (paramValue) {
      const condition: Condition = {};

      if (property === "filtermobile_no") {
        condition[property.substring(6)] = {
          contains: paramValue,
          mode: "insensitive",
        };
      } else if (!isNaN(Number(paramValue))) {
        condition[property.substring(6)] = parseInt(paramValue);
      } else {
        condition[property.substring(6)] = {
          contains: paramValue,
          mode: "insensitive",
        };
      }
      acc.push(condition);
    }
    return acc;
  }, [] as Condition[]);

  const columnsToSelect = columns ? columns.split(",") : undefined;

  const prismaWhereClause: Prisma.userWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.userWhereInput["AND"])
        : undefined,
  };

  try {
    const userList = await prisma.user.findMany({
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
        function_department: {
          select: {
            id: true,
            name: true,
          },
        },
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const modifiedUserList = userList.map((user) => ({
      ...user,
      name: `${user.first_name} ${
        user.middle_name ? user.middle_name + " " : ""
      }${user.last_name}`,
    }));

    console.log(modifiedUserList);
    const totalCount = await prisma.user.count({
      where: prismaWhereClause,
    });

    console.log(userList);
    return NextResponse.json(
      { userList: modifiedUserList, totalCount },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error reading users", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: user = await request.json();
  console.log("request body: ", body);

  const result = userModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  // encrypt password
  const hashedPassword = await hashPassword(body.password);
  body.password = hashedPassword;

  try {
    const existRecord = await prisma.user.findFirst({
      where: {
        deleted: false,
        OR: [
          {
            email: {
              contains: body.email,
              mode: "insensitive",
            },
          },
          {
            mobile_no: {
              contains: body.mobile_no,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (existRecord) {
      return NextResponse.json(
        { response: "Email or mobile number already exists!" },
        { status: 400 }
      );
    }

    const userData = await prisma.user.create({
      data: body as Prisma.userCreateInput,
    });
    return NextResponse.json({ response: userData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating user", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: user = await request.json();
  console.log("request body: ", body);

  const result = userModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: body.id || undefined },
    });

    if (userData && userData.id) {
      // encrypt password
      if (body && typeof body === "object" && "password" in body) {
        if (
          body.password?.length === 0 ||
          typeof body.password === "undefined" ||
          body.password === null
        ) {
          delete body.password;
        } else {
          const hashedPassword = await hashPassword(body.password);
          body.password = hashedPassword;
          body.password_changed_at = new Date();
        }
      }

      const userUpdated = await prisma.user.update({
        where: { id: userData.id },
        data: body as Prisma.userUpdateInput,
      });

      return NextResponse.json(userUpdated, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "user details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating user", 500);
  } finally {
    await prisma.$disconnect();
  }
}

// export async function DELETE(request: NextRequest)
export async function PATCH(request: NextRequest) {
  const body: patchType = await request.json();
  console.log("request body: ", body);
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
    const userData = await prisma.user.findUnique({
      where: {
        id: body.id,
      },
    });
    console.log("users are", userData);
    if (userData && userData.id) {
      let userUpdated = null;
      if (body.type == "delete") {
        userUpdated = await prisma.user.update({
          where: { id: body.id },
          data: {
            deleted_at: new Date(), // Soft delete by setting isDeleted to true
            deleted: true,
          },
        });
      } else if (body.type == "patch") {
        userUpdated = await prisma.user.update({
          where: { id: body.id },
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

      return NextResponse.json(userUpdated, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "User details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error updating user", 500);
  } finally {
    await prisma.$disconnect();
  }
}
