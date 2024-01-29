import {
  frequency,
  impact,
  applies,
  imprisonment_for,
  handleError,
  legal_status,
} from "@/app/utils/modelUtils";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("request pathname ----> ", pathname);
  const slug = pathname.split("/").pop();
  console.log("request slug ----> ", slug);

  try {
    let responseEnum = null;
    if (slug == "legal_status") {
      responseEnum = legal_status;
    } else if (slug == "frequency") {
      responseEnum = frequency;
    } else if (slug == "impact") {
      responseEnum = impact;
    } else if (slug == "imprisonment_for") {
      responseEnum = imprisonment_for;
    } else if (slug == "applies") {
      responseEnum = applies;
    } else {
      return NextResponse.json(
        { response: "slug type not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: responseEnum }, { status: 200 });
  } catch (e) {
    return handleError(e, "error reading event_question", 500);
  }
}
