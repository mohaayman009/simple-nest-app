import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { use } from 'passport';
@Injectable()
export class UserService {

    // This service can be used to manage user-related operations
    // For example, fetching user profiles, updating user information, etc.
    // Currently, it is empty and can be implemented as needed.

    constructor(private prisma: PrismaService) { }


    async getAllUsers() {
        return this.prisma.user.findMany();
    }


    async createUser(data: { email: string; phone: string; password: string; name: string }) {
        const userExists = await this.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });
        if (userExists) throw new BadRequestException('User already exists');

        return this.prisma.user.create({ data });
    }
    



    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');
        return user;
    }

    async updateUser(userId: number, data: Partial<{ email: string; phone: string; name: string }>) {
       userId = Number(userId);
        const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new BadRequestException('User not found');
   
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        return user;
    }

    async deleteUser(userId: number) {
        const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new BadRequestException('User not found');
        const user = await this.prisma.user.delete({ where: { id: userId } });
        return user;
    }





}
