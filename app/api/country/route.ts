import { prisma, Prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { countryModel } from "@/prisma/zod/country";
import { z } from "zod";
import { patchType } from "@/app/utils/typesUtils";
import { handleError } from "@/app/utils/modelUtils";

export type country = z.infer<typeof countryModel>;

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
    filtercountry_code: request.nextUrl.searchParams.get("filterCountryCode"),
    filterid: request.nextUrl.searchParams.get("filterId"),
  };

  const { page, pageSize } = queryParams;

  let offset = 0;
  let take: number | undefined = undefined;
  if (pageSize !== "-1") {
    take = Number(pageSize);
    offset = (Number(page) - 1) * Number(pageSize);
  }

  const filterProperties = ["filtername", "filtercountry_code", "filterid"];

  const conditions: Condition[] = filterProperties.reduce((acc, property) => {
    const paramValue = queryParams[property as keyof typeof queryParams];
    if (paramValue) {
      const condition: Condition = {};

      if (property === "filtercountry_code") {
        condition[property.substring(6)] = {
          contains: paramValue,
          mode: "insensitive",
        };
      } else if (!isNaN(Number(paramValue))) {
        condition[property.substring(6)] = parseInt(paramValue, 10);
      } else {
        condition[property.substring(6)] = {
          contains: paramValue,
          mode: "insensitive",
        };
        console.log(paramValue);
      }
      acc.push(condition);
    }

    return acc;
  }, [] as Condition[]);

  const prismaWhereClause: Prisma.countryWhereInput = {
    deleted: false,
    AND:
      conditions.length > 0
        ? (conditions as Prisma.countryWhereInput["AND"])
        : undefined,
  };

  try {
    const countriesList = await prisma.country.findMany({
      where: prismaWhereClause,
      skip: offset,
      take: take,
      orderBy: {
        name: "asc", // or 'asc' for ascending order
      },
    });

    const totalCount = await prisma.country.count({
      where: prismaWhereClause,
    });

    return NextResponse.json({ countriesList, totalCount }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating state", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const body: country = await request.json();

  console.log("request body: ", body);

  const result = countryModel.safeParse(body);

  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const existRecord = await prisma.country.findFirst({
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
        { response: "Country name already exists!" },
        { status: 400 }
      );
    }
    const user = await prisma.country.create({
      data: body as Prisma.countryCreateInput,
    });
    return NextResponse.json({ response: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "error creating country", 500);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const body: country = await request.json();
  console.log("request body: ", body);

  const result = countryModel.safeParse(body);
  if (!result.success) {
    const { errors } = result.error;

    return NextResponse.json(
      { response: "Invalid request", errors },
      { status: 400 }
    );
  }

  try {
    const country = await prisma.country.findUnique({
      where: { id: body.id || undefined },
    });
    if (country && country.id) {
      const updatedCountry = await prisma.country.update({
        where: { id: country.id },
        data: body as Prisma.countryUpdateInput,
      });

      return NextResponse.json(updatedCountry, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "Country details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating country", 500);
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
    const countryData = await prisma.country.findUnique({
      where: {
        id: body.id,
      },
    });

    if (countryData && countryData.id) {
      let updatedCountry = null;
      if (body.type == "delete") {
        updatedCountry = await prisma.country.update({
          where: { id: body.id },
          data: {
            deleted_at: new Date(),
            deleted: true,
          },
        });
      } else if (body.type == "patch") {
        updatedCountry = await prisma.country.update({
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

      return NextResponse.json(updatedCountry, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "Country details not found!" },
        { status: 404 }
      );
    }
  } catch (e) {
    return handleError(e, "error creating country", 500);
  } finally {
    await prisma.$disconnect();
  }
}
