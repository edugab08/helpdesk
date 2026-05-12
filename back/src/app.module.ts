import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from './prisma/prisma.module';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

import { TicketsController } from './tickets/tickets.controller';
import { TicketsService } from './tickets/tickets.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nexsupport-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AuthController,
    UsersController,
    TicketsController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    TicketsService,
  ],
})
export class AppModule {}
