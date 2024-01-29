import { prisma } from "../app/utils/prisma.server";
import { hashPassword } from "../app/utils/authUtils";
import fs from "fs/promises";
import path from "path";

async function main() {
  // all country list creations
  const countryFilePath: string = path.join(
    __dirname,
    "../jsondata/countrylist.json"
  );
  const countryJsonData = await fs.readFile(countryFilePath, "utf-8");
  const countries = JSON.parse(countryJsonData);

  for (const country of countries) {
    // Check if the country already exists by name or code
    const existingCountry = await prisma.country.findFirst({
      where: {
        OR: [{ name: country.name }],
      },
    });

    if (!existingCountry) {
      console.log(`Creating country: ${country.name}`);
      await prisma.country.create({
        data: country,
      });
    } else {
      console.log(`Country already exists: ${country.name}`);
    }
  }
  console.log("Country Seed completed successfully.");

  // india state list creation
  const statefilePath = path.join(__dirname, "../jsondata/statelist.json");
  console.log(statefilePath);
  const stateJsonData = await fs.readFile(statefilePath, "utf-8");
  const states = JSON.parse(stateJsonData);

  const indiaCountry = await prisma.country.findFirst({
    where: {
      name: {
        equals: "India", // Perform case-insensitive comparison
        mode: "insensitive", // Set the mode to 'insensitive'
      },
    },
  });

  const indiaCountryId = indiaCountry?.id || 0;
  if (!indiaCountryId) {
    console.log("Country 'India' not found.");
  } else {
    for (const state of states) {
      // Check if the state already exists by name or code
      const existingState = await prisma.state.findFirst({
        where: {
          AND: [{ name: state.name, country_id: indiaCountryId }],
        },
      });

      if (!existingState) {
        console.log(`Creating state: ${state.name}`);
        await prisma.state.create({
          data: {
            code: state.code,
            name: state.name,
            country_id: indiaCountryId,
            status: 1,
          },
        });
      } else {
        console.log(`State already exists: ${state.name}`);
      }
    }
    console.log("State Seed completed successfully.");
  }

  const role = await prisma.role.upsert({
    where: {
      name_deleted: {
        name: "Super Admin",
        deleted: false,
        deleted_at: "1970-01-01T00:00:00.000Z",
      },
    },
    update: {},
    create: {
      name: "Super Admin",
      description: "Super Admin",
      status: 1,
      deleted: false,
      deleted_at: "1970-01-01T00:00:00.000Z",
    },
  });
  console.log("role found.... ", role);

  const state = await prisma.state.findFirst({
    where: {
      AND: [{ name: "Maharashtra", country_id: indiaCountryId }],
    },
  });
  console.log("state found... ", state);

  const hashedPassword = await hashPassword("Admin@123");
  const user = await prisma.user.upsert({
    where: {
      email_mobile_deleted: {
        email: "nikhil.chouhan@dbtpl.com",
        mobile_no: "9029181220",
        deleted: false,
        deleted_at: "1970-01-01T00:00:00.000Z",
      },
    },
    update: {},
    create: {
      employee_id: "00001",
      first_name: "Nikhil",
      middle_name: "",
      last_name: "Chouhan",
      email: "nikhil.chouhan@dbtpl.com",
      mobile_no: "9029181220",
      password: hashedPassword,
      role_id: role.id,
      status: 1,
    },
  });

  console.log("user", user);

  const comments = await prisma.standard_comments.upsert({
    where: {
      name_deleted: {
        name: "Others",
        deleted: false,
        deleted_at: "1970-01-01T00:00:00.000Z",
      },
    },
    update: {},
    create: {
      name: "Others",
      status: 1,
      deleted: false,
      deleted_at: null, 
    },
  });
  console.log("comments found.... ", comments);
}



main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
