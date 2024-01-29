// Import necessary modules and configurations
import { convertToISODate, handleError } from "@/app/utils/modelUtils";
import { prisma } from "@/app/utils/prisma.server";
import { NextRequest, NextResponse } from "next/server";

interface Condition {
  [key: string]: string | number | { contains: string; mode: string };
}
export async function GET(request: NextRequest) {
  const filterEntity = request.nextUrl.searchParams.get("filterEntity")
  const filterStartDate = request.nextUrl.searchParams.get("filterStartDate")
  const filterEndDate = request.nextUrl.searchParams.get("filterEndDate")
  
  try {
    const businessUnit = await prisma.business_unit.findMany({
      where : {
        entity : {
          name : {
            equals : filterEntity
          }
        },
        deleted : false
      },
      select: {
        id: true,
        name: true,
      },
    });

    const businessUnitStatusCounts = [];

    for (const unit of businessUnit) {
      let whereClause = {
        activity_mapping: {
          business_unit: {
              id: unit.id,
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

      businessUnitStatusCounts.push({
        businessUnitName: unit.name,
        statusCounts,
      });
    }

    return NextResponse.json(
      { businessUnit, businessUnitStatusCounts },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error counting legal status by entity", 500);
  } finally {
    await prisma.$disconnect();
  }
}
