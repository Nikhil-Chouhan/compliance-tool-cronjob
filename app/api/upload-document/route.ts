import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { handleError } from "@/app/utils/modelUtils";

export async function POST(request: NextRequest) {
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const upload = multer({
      storage: multerS3({
        s3,
        bucket: "your-s3-bucket-name",
        acl: "public-read", // Set permissions as needed
        key: (req, file, cb) => {
          cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
      }),
    });

    // const formData = await request.formData();
    // const f = formData.get("file");

    // if (!f) {
    //   return NextResponse.json(
    //     { response: "Invalid file uploaded." },
    //     { status: 400 }
    //   );
    // }

    // const file = f as File;

    // const destinationDirPath = path.join(
    //   process.cwd(),
    //   "public/upload/compliance_activity/importexcel"
    // );

    // const fileArrayBuffer = await file.arrayBuffer();

    // if (!existsSync(destinationDirPath)) {
    //   await fs.mkdir(destinationDirPath, { recursive: true });
    // }

    // const filename = `${Date.now()}-${file.name}`; // moment().format('YYYYMMDD-HHmmss') + "-" + file.name;
    // const filePath = path.join(destinationDirPath, filename);
    // await fs.writeFile(filePath, Buffer.from(fileArrayBuffer));

    // return NextResponse.json({ response: "Teat" }, { status: 200 });
  } catch (e) {
    return handleError(e, "error uploading compliance_activity data!", 500);
  }
}
