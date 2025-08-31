import {
  Injectable, BadRequestException, UnauthorizedException,
  ExecutionContext
 } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }

  async register(email: string, phone: string, password: string, name: string) {

    
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });
    if (userExists) throw new BadRequestException('User already exists');
    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, phone, password: hashed, name },
    });

    
    const payload = { sub: user.id, email };
    const accessToken = await this.jwt.signAsync(payload);
    
    const userId = user.id;
    return { accessToken, userId };
  }
  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    let access_token = await this.generateTokens(user.id, user.email);
    return access_token;
  }  
  async updateUser(id: number, data: { email?: string; phone?: string; password?: string; name?: string }) {
  
    id = Number(id);
    const email = data.email?.trim();
    const phone = data.phone?.trim();
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');


    if (email) {
      const userWithSameEmail = await this.prisma.user.findUnique({ where: { email } });
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (phone) {
      const userWithSamePhone = await this.prisma.user.findUnique({ where: { phone } });
      if (userWithSamePhone && userWithSamePhone.id !== id) {
        throw new BadRequestException('Phone already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email ?? user.email,
        phone: data.phone ?? user.phone,
        name: data.name ?? user.name,
        password: data.password ? await bcrypt.hash(data.password, 10) : user.password,
      },
    }); return updatedUser;
  };
  
  async forgetPassword(email?: string, phone?: string) {

    const user = await this.prisma.user.findFirst({
       where: {
            OR: [
      { email: email },
      { phone: phone },
            ],
               },
             });
    if (!user) throw new BadRequestException('User not found');

    const token = await this.generateOtp(user.id);
    return token;
    

   // return { message: 'Password reset link sent to your email' };
  };

  async resetPassword(Otp: string, newPassword: string, email: string) {

    const userId = await this.verifyOtp(Otp);
    if (!userId) {
      throw new BadRequestException ('Invalid OTP');
    }
    const userEmail = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    if (!userEmail || userEmail.email !== email) {
      throw new BadRequestException('Email does not match the user');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password:newPassword,
      }
    });

    return { success: true, message: 'Password updated!',user: updatedUser };

  }
  
   async generateOtp(userId: number) {
     const generatedOtp : string = Math.floor(100000 + Math.random() * 900000).toString();
     const otp = await this.prisma.generatedOtp.create({
       data: {
         userId: userId,
         otp: generatedOtp,
         expiresAt: new Date(Date.now() + 5 * 60 * 1000) // OTP valid for 10 minutes
       }
     });
    return generatedOtp;
  }

  async verifyOtp(otp: string) {
    const storedOtp = await this.prisma.generatedOtp.findFirst({
      where: {
        otp,
      },
    });
    if (storedOtp  && storedOtp.expiresAt < new Date()) {
      await this.prisma.generatedOtp.delete({
        where: {
          id: storedOtp.id,
        },
      });
      return storedOtp.userId; // Return userId if OTP is valid
    }
    return false;
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload);
    return accessToken;
  };

}