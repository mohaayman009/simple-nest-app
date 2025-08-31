import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
//import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
  //  AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
