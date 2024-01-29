import { NextResponse, NextRequest } from "next/server";
import {
  upload,
  download,
  view,
  download_without_client,
} from "@/app/utils/s3Utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("document") as File;

    const buffer = await file.arrayBuffer();

    const fileName = `document_${Date.now()}_${file.name}`;
    await upload("crs-compliance-bucket", fileName, buffer);

    return NextResponse.json(
      { message: "success", response: fileName },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get("filename") || "";
    const type = request.nextUrl.searchParams.get("type") ?? "download";
    if (type == "view") {
      const signedurl = await view("crs-compliance-bucket", filename as string);
      return NextResponse.json(
        { response: "success", url: signedurl },
        { status: 200 }
      );
    } else {
      const signedurl = await download_without_client(
        "crs-compliance-bucket",
        filename as string
      );
      return NextResponse.json(
        { response: "success", url: signedurl },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
    return NextResponse.json(
      { response: "Error generating pre-signed URL" + error },
      { status: 500 }
    );
  }
}
