import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone_number',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey'
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new UnauthorizedException('Tài khoản và mật khẩu không chính xác')
    }
    return user
  }
}
