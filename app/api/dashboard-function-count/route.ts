// Import necessary modules and configurations
import { convertToISODate, handleError } from "@/app/utils/modelUtils";
import { prisma } from "@/app/utils/prisma.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const filterEntity = request.nextUrl.searchParams.get("filterEntity")
  const filterUnit = request.nextUrl.searchParams.get("filterUnit")
  const filterStartDate = request.nextUrl.searchParams.get("filterStartDate")
  const filterEndDate = request.nextUrl.searchParams.get("filterEndDate")
  
  try {
    const functionDepartment = await prisma.unit_function_mapping.findMany({
      where: {
        business_unit: {
          entity: {
            name: {
              equals: filterEntity,
            },
          },
          name: {
            equals: filterUnit,
          },
        },
        deleted : false
      },
      select: {
        function: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const functionDepartmentList = functionDepartment.map(
      (item) => item.function
    );

    const functionDepartmentStatusCounts = [];

    for (const department of functionDepartment) {
      let whereClause = {
        activity_mapping: {
          business_unit: {
            name: filterUnit,
            entity: {
              name: filterEntity,
            },
          },
          function : {
              id: department.function.id,
          },
        },
      }
      if(filterStartDate && filterEndDate){
        whereClause = {
          ...whereClause,
          created_at: {
            gte: convertToISODate(filterStartDate),
            lte: convertToISODate(filterEndDate),
          },
        }
      }
      const counts = await prisma.activity_history.groupBy({
        by: ['activity_history_status'],
        where: whereClause,
        _count: true,
      });
      const statusCounts = counts.reduce((acc, status) => {
        acc[status.activity_history_status] = status._count;
        return acc;
      }, {});

      functionDepartmentStatusCounts.push({
        functionDepartmentName: department.function.name,
        statusCounts,
      });
    }

    return NextResponse.json(
      { functionDepartmentList, functionDepartmentStatusCounts },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error counting legal status by entity", 500);
  } finally {
    await prisma.$disconnect();
  }
}
