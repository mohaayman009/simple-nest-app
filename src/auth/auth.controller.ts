import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    UseGuards,
    BadRequestException,
    Req
} from '@nestjs/common';
import {  JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import { SmsService } from './sms.service';
import { CreateUserDto } from './DTO/CreateUserDto';
import { UpdateUserDto } from './DTO/UpdateUserDto';
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) { }
  

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const { email, phone, password, name } = userData;
    return this.authService.register(email, phone, password, name);
  }


  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    return this.authService.login(email, password);
  }



  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUserDto) {
    if (!data.email && !data.phone && !data.name) {
      throw new BadRequestException('At least one field must be provided for update');
    }
    return this.authService.updateUser(id, data);
  }

  
  
  @Get('forget-password/')
  async forgotPassword(@Body() body: { email?: string; phone?: string }) {

    if (!body.email && !body.phone) {
      throw new BadRequestException('Email or phone number must be provided');
    }

    if (body.email) {
      const token = await this.authService.forgetPassword(body.email);
      await this.mailService.sendEmailWithOtp(body.email, token);      
    }

    if (body.phone) {
      const otp = await this.authService.forgetPassword(body.phone);
      await this.smsService.sendResetCode(body.phone, otp);
    }

     return { message: 'Reset instructions sent.' };
  }



  @Patch('reset-password')
  async resetPassword(@Body() body: { Otp: string; email: string; newPassword: string }) {
    return this.authService.resetPassword(body.Otp, body.newPassword, body.email);
  };



}

