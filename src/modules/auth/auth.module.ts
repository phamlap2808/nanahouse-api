import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from '@/modules/auth/auth.service'
import { AuthController } from '@/modules/auth/auth.controller'
import { User } from '@/modules/auth/user.entity'
import { IsUniqueConstraint } from '@/common/validator/unique.validator'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: 'secretKey',
        signOptions: {
          expiresIn: 3600
        }
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, IsUniqueConstraint, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
