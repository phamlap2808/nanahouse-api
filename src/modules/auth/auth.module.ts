import { Module } from '@nestjs/common'
import { AuthService } from '@/modules/auth/auth.service'
import { AuthController } from '@/modules/auth/auth.controller'
import { IsUniqueConstraint } from '@/common/validator/unique.validator'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserSchema } from './user.schema'

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
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])
  ],
  providers: [AuthService, IsUniqueConstraint, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
