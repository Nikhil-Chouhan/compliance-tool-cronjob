// Import necessary modules and configurations
import { prisma } from "@/app/utils/prisma.server";
import { NextRequest, NextResponse } from "next/server";
import { convertToISODate, handleError } from "@/app/utils/modelUtils";

// Define the new logic to get legal status counts for each entity
export async function GET(request: NextRequest) {
  
  const filterStartDate = request.nextUrl.searchParams.get("filterStartDate")
  const filterEndDate = request.nextUrl.searchParams.get("filterEndDate")

  try {
    // Fetch the dynamic list of entities from the database
    const entities = await prisma.entity.findMany({
      where : {
        deleted : false
      },
      select: {
        id: true,
        name: true,
      },
    });

    const entityLegalStatusCounts = [];

    for (const entity of entities) {
      let whereClause = {
        activity_mapping: {
          business_unit: {
            entity: {
              id: entity.id,
            },
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

      entityLegalStatusCounts.push({ entityName: entity.name, statusCounts });
    }

    return NextResponse.json(
      { entities, entityLegalStatusCounts },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error counting legal status by entity", 500);
  } finally {
    await prisma.$disconnect();
  }
}
