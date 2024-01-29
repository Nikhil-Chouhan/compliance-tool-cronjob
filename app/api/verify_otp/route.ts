import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/app/utils/authUtils";
import { prisma } from "@/app/utils/prisma.server";
import { handleError } from "@/app/utils/modelUtils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, otp, password, confirmPassword } = body;

  try {
    const storedOTPData = await prisma.user_otp.findFirst({
      where: { otp },
    });
    console.log("stored OTP data ", storedOTPData);

    if (!storedOTPData) {
      return NextResponse.json(
        { response: "Invalid OTP or email." },
        { status: 400 }
      );
    }

    if (storedOTPData.otp !== otp) {
      return NextResponse.json({ response: "Invalid OTP. " }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { response: "Password and confirmPassword do not match." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      // return res.status(400).json({ response: 'User not found.' });
      return NextResponse.json({ response: "User not found" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.user_otp.deleteMany({
      where: {
        user_id: user.id,
      },
    });
    console.log("OTP is deleted");
    console.log("Password reset succesfully");
    return NextResponse.json(
      { response: "Password reset successfully." },
      { status: 200 }
    );
  } catch (e) {
    return handleError(
      e,
      "An error occurred while verifying OTP and resetting password.",
      500
    );
  } finally {
    await prisma.$disconnect();
  }
}
