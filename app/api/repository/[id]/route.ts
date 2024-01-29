import { prisma } from "@/app/utils/prisma.server";
import { NextResponse, NextRequest } from "next/server";
import { activity_configurationModel } from "@/prisma/zod/activity_configuration";
import { z } from "zod";
import { handleError } from "@/app/utils/modelUtils";

export type activity_configuration = z.infer<
  typeof activity_configurationModel
>;

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const idString = pathname.split("/").pop();
  let id;

  if (idString !== undefined) {
    id = parseInt(idString, 10);
  } else {
    console.error("ID is undefined");
  }

  try {
    const repositoryRow = await prisma.activity_configuration.findUnique({
      where: { id: id, deleted: false },
      include: {
        activity_mapping: {
          select: {
            crs_activity: {
              select: {
                id: true,
                activity_code: true,
                title: true,
                legislation: true,
                rule: true,
                reference: true,
                who: true,
                when: true,
                activity: true,
                procedure: true,
                frequency: true,
                compliance_type: true,
                impact: true,
                event: true,
                event_sub: true,
              },
            },
            business_unit: {
              select: { entity: { select: { name: true } }, name: true },
            },
            function: {
              select: { name: true },
            },
            unit_activity_id: true,
            executor: {
              select: {
                id: true,
                first_name: true,
              },
            },
            evaluator: {
              select: {
                id: true,
                first_name: true,
              },
            },
            function_head: {
              select: {
                id: true,
                first_name: true,
              },
            },
          },
        },
      },
    });

    function flattenObject(obj, parentKey = "") {
      const flattened = {};
      for (const key in obj) {
        // const newKey = parentKey ? `${parentKey}_${key}` : key;
        const newKey = parentKey ? `${key}` : key;

        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !(obj[key] instanceof Date)
        ) {
          const nestedFlatten = flattenObject(obj[key], newKey);
          Object.assign(flattened, nestedFlatten);
        } else if (obj[key] instanceof Date) {
          const options = { day: "2-digit", month: "short", year: "numeric" };

          flattened[newKey] = obj[key].toLocaleDateString("en-US", options); // Convert date to ISO string
        } else {
          flattened[newKey] = obj[key];
        }
      }
      return flattened;
    }

    const outputData = {
      ...repositoryRow,
      activity_mapping: {
        ...repositoryRow.activity_mapping,
        function_name: repositoryRow.activity_mapping.function.name,
        executor_id: repositoryRow.activity_mapping.executor.id,
        executor_name: repositoryRow.activity_mapping.executor.first_name,
        evaluator_id: repositoryRow.activity_mapping.evaluator.id,
        evaluator_name: repositoryRow.activity_mapping.evaluator.first_name,
        function_head_id: repositoryRow.activity_mapping.function_head.id,
        function_head_name:
          repositoryRow.activity_mapping.function_head.first_name,
        function_name: repositoryRow.activity_mapping.function.name,
        entity_name: repositoryRow.activity_mapping.business_unit.entity.name,
        business_unit_name: repositoryRow.activity_mapping.business_unit.name,
      },
    };

    const flattenedData = flattenObject(outputData);
    console.log("flattenedData", flattenedData);
    return NextResponse.json({ flattenedData }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading activity_configuration", 500);
  }
}
