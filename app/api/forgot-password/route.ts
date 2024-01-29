import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import {
  User,
  findUserByEmail,
  generateAndStoreOTP,
} from "@/app/utils/authUtils";
import { prisma } from "@/app/utils/prisma.server";
import { getPasswordResetEmailTemplate } from "@/mail_templates/forgotpassTemplates";
import { handleError } from "@/app/utils/modelUtils";
export async function POST(request: NextRequest) {
  const body: User = await request.json();
  try {
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { response: "Email not Found" },
        { status: 400 }
      );
    }

    const user: User | null = await findUserByEmail(email);
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { response: "user Not Found!" },
        { status: 404 }
      );
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS,
        },
      });

      const email_otp: string = generateAndStoreOTP(email);
      const emailContent = getPasswordResetEmailTemplate(email_otp);

      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Password Reset OTP",
        html: emailContent,
      };

      // subject: "Password Reset OTP",
      // text: `Your OTP for password reset is: ${email_otp}`,
      await prisma.user_otp.deleteMany({
        where: {
          user_id: user.id,
        },
      });

      await prisma.user_otp.create({
        data: {
          otp: email_otp,
          user_id: user?.id || 0,
        },
      });

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json(
      { response: "OTP sent successfully." },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "An error occurred while sending the OTP.", 500);
  } finally {
    await prisma.$disconnect();
  }
}
