import { NextResponse, NextRequest } from "next/server";
import { download, upload } from "@/app/utils/s3Utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const buffer = await file.arrayBuffer();
    await upload("crs-bucket", file.name, buffer);

    return NextResponse.json(
      { message: "uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ message: "upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const str = await download("crs-bucket", "comments");

    return NextResponse.json(
      { message: "read successfully", content: str },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ message: "read failed" }, { status: 500 });
  }
}
