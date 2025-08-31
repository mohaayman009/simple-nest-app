import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
  import nodemailer from "nodemailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

async  sendEmailWithOtp(email: string, token: string) {
  // 1. إعداد transporter
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,           // أو 587 لو هتستخدم TLS
    secure: true,        // true للـ 465
    auth: {
        user: "mohaayman001@gmail.com",      // ايميلك
      pass: "hhvu jqsu wbby cili",     // App Password اللي عملته من جوجل
    },
  });

  // 2. إرسال الإيميل
  let info = await transporter.sendMail({
    from: '"Dr. Mohamed 👨‍💻" <your_email@gmail.com>',  // المرسل
    to: email,                           // المستلم
    subject: "Verify your email",                 // الموضوع
    text: "This is a plain text message",               // النص العادي
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Hello, Friend 👋</h2>
      <p>Welcome to our platform. We're excited to have you!</p>
      <p>Your verification code is: <strong>${token}</strong></p>
    </div>
  ` ,              // نسخة HTML
  });

}
  
}
