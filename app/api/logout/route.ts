import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    request.cookies.delete("next-auth.csrf-token");

    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
    response.cookies.set("next-auth.csrf-token", "");
    response.cookies.set({
      name: "next-auth.csrf-token",
      value: "",
      path: "/",
      httpOnly: true,
    });
    // const cookie = response.cookies.getAll();
    const cookie = request.cookies.getAll();
    console.log(cookie);

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
