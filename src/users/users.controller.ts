import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';

import { RoleGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))

  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<any>> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(
   @Query() query  ): Promise<ApiResponse<any>> {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ApiResponse<any>> {
    return this.usersService.getUserById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)

  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<any>> {
    return this.usersService.updateUser(+id, updateUserDto);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)

  async deleteUser(@Param('id') id: string): Promise<ApiResponse<any>> {
    return this.usersService.deleteUser(+id);
  }
}
