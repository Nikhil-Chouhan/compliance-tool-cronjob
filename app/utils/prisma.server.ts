import { PrismaClient, Prisma } from "@prisma/client";

let prisma: PrismaClient;
if (process.env.APP_ENV === "production") {
  prisma = new PrismaClient();
} else {
  prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

  prisma.$on("query" as never, (event) => {
    const queryEvent = event as Prisma.QueryEvent;

    console.log("Query:", queryEvent.query);
    console.log("Params:", queryEvent.params);
    console.log("Duration:", queryEvent.duration + "ms");
  });
}

const getCount = async <T extends keyof PrismaClient>(
  model: T,
  startOfMonth: Date | undefined,
  endOfMonth: Date | undefined
) => {
  const prisma = new PrismaClient();
  try {
    if (!(model in prisma)) {
      throw new Error(
        `Model '${String(model)}' does not exist in the Prisma schema.`
      );
    }

    // @ts-expect-error unable to find solution for error code works
    return await prisma[model].count({
      where: {
        deleted: false,
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export { prisma, Prisma, getCount };
