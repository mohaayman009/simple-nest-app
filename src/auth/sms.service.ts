import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }


  async sendResetCode(phone: string, code: string) {
  
    if (!(phone.match(/^00.*$/) || phone.match(/^\+.*$/)))
    { phone = `+2${phone}`; }
    
    await this.client.messages.create({
      body: `Your password reset code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }
}
