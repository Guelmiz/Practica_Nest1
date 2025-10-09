import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module'; 
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: '12345', // Remplazar por tu clave secreta
      signOptions:{expiresIn: '1h'} // Tiempo de expiracion del token
    }),
  ],

  

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
