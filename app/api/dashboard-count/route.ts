import { convertToISODate, handleError } from "@/app/utils/modelUtils";
import { prisma } from "@/app/utils/prisma.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const filterStartDate = request.nextUrl.searchParams.get("filterStartDate")
  const filterEndDate = request.nextUrl.searchParams.get("filterEndDate")

  

  try {
    const legalStatusList = [
      "Complied",
      "Escalated",
      "Non_Complied",
      "Delayed",
      "Delayed_Reported",
      "Approval_Pending",
      "Re_Assigned",
    ];

    const impactList = [
      "Super_Critical",
      "Critical",
      "High",
      "Moderate",
      "Low",
    ];

    

    const legalStatusCountPromises = legalStatusList.map(async (status) => {
      let whereClause = {
        activity_history_status: {
          equals: status,
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
      
      const count = await prisma.activity_history.count({
        where: whereClause,
      });
      return { [`${status}Count`]: count };
    });
    const legalStatusCounts = await Promise.all(legalStatusCountPromises);

    const activityHistoryLegalStatusCount = legalStatusCounts.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    const impactCountPromises = impactList.map(async (status) => {
      let whereClause = {
        activity_history_status: {
          equals: 'Non_Complied',
        },
        activity_mapping : {
          crs_activity :{
            impact: {
              equals: status,
            },
          }
        }
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
      const count = await prisma.activity_history.count({
        where: whereClause,
      });
      return { [`${status}Count`]: count };
    });

    const impactCounts = await Promise.all(impactCountPromises);
    const impactResult = impactCounts.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    return NextResponse.json(
      { activityHistoryLegalStatusCount, impactResult },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "error counting data", 500);
  } finally {
    await prisma.$disconnect();
  }
}
