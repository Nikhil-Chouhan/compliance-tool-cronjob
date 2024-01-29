// Import necessary modules and configurations
import { convertToISODate, handleError } from "@/app/utils/modelUtils";
import { prisma } from "@/app/utils/prisma.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const gridLegalStatusActivity = request.nextUrl.searchParams.get(
    "gridLegalStatusActivity"
  );
  const gridEntity = request.nextUrl.searchParams.get("gridEntity");
  const gridUnit = request.nextUrl.searchParams.get("gridUnit");
  const gridFunction = request.nextUrl.searchParams.get("gridFunction");
  
  const filterStartDate = request.nextUrl.searchParams.get("filterStartDate")
  const filterEndDate = request.nextUrl.searchParams.get("filterEndDate")

  try {
    let whereClause = {
      activity_history_status: {
        equals: gridLegalStatusActivity,
      },
    };

    if(filterStartDate && filterEndDate){
      whereClause = {
        ...whereClause,
        created_at: {
          gte: convertToISODate(filterStartDate),
          lte: convertToISODate(filterEndDate),
        },
      }
    }
    

    if (gridEntity){
      whereClause["activity_mapping"] = {
        business_unit : {
          entity : {
            "name" : gridEntity
          }
        }
      }
    }
    if (gridUnit){
      if(gridFunction){
        whereClause["activity_mapping"] = {
          business_unit : {
              "name" : gridUnit
          },
          function : {
            "name" : gridFunction
          }
        }
      } else {
        whereClause["activity_mapping"] = {
          business_unit : {
              "name" : gridUnit
          }
        }
      }
    }

    
    const allCrsActivity = await prisma.activity_history.findMany({
      where: whereClause,
      select: {
        activity_mapping: {
          select: {
            crs_activity: true,
          },
        },
      },
    });
    const formattedCrsActivity = allCrsActivity.map(
      (item) => item.activity_mapping.crs_activity
    );

    let count = 0;
    for (const item of allCrsActivity) {
      if (item) {
        count++;
      }
    }

    return NextResponse.json({ count, formattedCrsActivity }, { status: 200 });
  } catch (e) {
    return handleError(e, "error counting legal status for aggrid", 500);
  } finally {
    await prisma.$disconnect();
  }
}
