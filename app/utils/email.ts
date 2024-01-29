import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs/promises";

export interface EmailOptions {
  template: string;
  data?: unknown;
  to: string;
  subject: string;
  message?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: { filename: string; content: string }[];
}

const emailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
};

export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
    console.log("template----> ", options.template);
    const template = await fs.readFile(
      `./mail_templates/${options.template}.hbs`,
      "utf-8"
    );
    const compiledTemplate = handlebars.compile(template);

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html: compiledTemplate(options.data),
      attachments: options.attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
