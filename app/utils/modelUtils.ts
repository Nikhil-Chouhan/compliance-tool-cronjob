import {
  frequency as frequencyEnum,
  impact as impactEnum,
  imprisonment_for as imprisonment_forEnum,
} from "@prisma/client";
import { NextResponse } from "next/server";


export const law_category = {
  Corporate_Laws: "Corporate Laws",
  Commercial_Laws: "Commercial Laws",
  Human_Resources_Labour_Laws: "Human Resources Labour Laws",
  Environment_Health_Safety_Laws: "EnvironmentHealth && SafetyLaws",
  Regulatory_Laws: "RegulatoryLaws",
  Direct_Taxation_Laws: "Direct Taxation Laws",
  Indirect_Taxation_Laws: "Indirect Taxation Laws",
  Information_Technology_Laws: "Information Technology Laws",
  Intellectual_Property_Laws: "Intellectual Property Laws",
  Import_Export_Laws: "Import Export Laws",
  Local_Laws: "Local Laws",
  Conditions_of_Licenses_Consents: "Conditions of Licenses Consents",
  Cross_Border_Laws: "Cross Border Laws",
  Anti_bribery_Laws: "Anti bribery Laws",
  Internal_Compliances: "Internal Compliances",
  Contractual_Compliances: "Contractual Compliances",
  Product_Compliances: "Product Compliances",
  Transactional_Compliances: "Transactional Compliances",
};


export enum legal_status {
  Complied = "Complied",
  Escalated = "Escalated",
  Delayed = "Delayed",
  Non_Complied = "Non Complied",
  Delayed_Reported = "Delayed Reported",
  Re_Assigned = "Re Assigned",
}

export enum applies {
  Company = "Company",
  Product = "Product",
  Individual = "Individual",
}

export const frequency = {
  Onetime: "Onetime",
  Ongoing: "Ongoing",
  Event_based: "event based",
  yearly10: "10 yearly",
  yearly8: "8 yearly",
  yearly5: "5 yearly",
  yearly4: "4 yearly",
  yearly3: "3 yearly",
  yearly2: "2 yearly",
  yearly: "yearly",
  monthly10: "10 monthly",
  monthly4: "4 monthly",
  Half_yearly: "Half yearly",
  Bi_monthly: "Bi-monthly",
  Quarterly: "Quarterly",
  Monthly: "Monthly",
  Fortnightly: "Fortnightly",
  Weekly: "Weekly",
  event: "event",
};

export const imprisonment_for = {
  Managing_Director: "Managing Director",
  Managerial_Person: "Managerial Person",
  General_Manager: "General Manager",
  Occupier: "Occupier",
  Manager: "Manager",
  Principal_Employer: "Principal Employer",
  Employer: "Employer",
  Contractor: "Contractor",
  Owner: "Owner",
  Officer_in_default: "Officer in default",
};

export const impact = {
  Super_Critical: "Super Critical",
  Critical: "Critical",
  High: "High",
  Moderate: "Moderate",
  Low: "Low",
};

function getKeyByValue(object: Record<string, string>, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

function generateOTP(): string {
  const min = 100000;
  const max = 999999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
}
const otp = generateOTP();

const transformKeys = <T>(obj: T): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let newKey =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

      if (newKey.endsWith(" id")) {
        newKey = newKey.slice(0, -3);
      }

      result[newKey] = String(key);
    }
  }

  return result;
};

function transformFields(fields: Array<string>) {
  return fields.map((field) => {
    if (field.endsWith("_id")) {
      field = field.slice(0, -3); // Remove the trailing "_id"
    }
    return field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });
}

const codeCounters = new Map<string, number>();

const generateUniqueCode = (tableName: string) => {
  if (tableName.length < 2) {
    throw new Error("Table name should have at least two characters");
  }

  const firstChar = tableName[0].toUpperCase();
  const lastChar = tableName[tableName.length - 1].toUpperCase();

  const timestamp = Math.floor(Date.now() / 1000).toString(36);

  let counter = codeCounters.get(tableName) || 0;

  counter++;
  codeCounters.set(tableName, counter);

  return `${firstChar}${lastChar}-${timestamp}-${counter}`;
};

function removeUnderscoreAndCapitalize(inputString: string) {
  return inputString
    .replace(/_./g, (match) => match.charAt(1).toUpperCase())
    .replace(/_/g, " ");
}

function removeUnderscoreAndAddSpace(inputString: string) {
  return inputString
    .replace(/_./g, (match) => ` ${match.charAt(1).toUpperCase()}`)
    .replace(/_/g, " ");
}

export {
  frequencyEnum,
  imprisonment_forEnum,
  impactEnum,
  getKeyByValue,
  transformKeys,
  transformFields,
  generateUniqueCode,
  removeUnderscoreAndCapitalize,
  removeUnderscoreAndAddSpace,
  otp,
};

export const convertToISODate = (date: string | null) => {
  if (!date) return null;
  const isoDate = new Date(date).toISOString().split('T')[0] + 'T00:00:00.000Z';
  return isoDate;
};

export function handleError(error: unknown, response: string, status: number) {
  console.log("exception is", error);

  const errorDetails =
    error instanceof Error
      ? {
          message: error.message,
          name: error.name,
          stack: error.stack,
        }
      : { message: "Unknown error" };
  const errorRes =
    process.env.APP_ENV === "development"
      ? { errorResponse: errorDetails }
      : null;
  console.log("Error Response =======>", errorRes);

  return NextResponse.json(
    {
      error: [
        {
          response,
          status,
        },
      ],
      ...errorRes,
    },
    { status }
  );
}
