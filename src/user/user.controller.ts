import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Patch,
    Delete,
    HttpException,

} from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly prisma: PrismaService) { }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        id = Number(id);
        return this.userService.getUserById(id);
    }
    @Get()
    async getAllUsers() {
        // return this.userService.getAllUsers();
        throw new HttpException('Forbidden', 403);
    }

    @Post()
    async createUser(@Body() userData: { email: string; phone: string; password: string; name: string }) {
        return this.userService.createUser(userData);
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<{ email: string; phone: string; name: string }>) {
        return this.userService.updateUser(id, data);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }
}
