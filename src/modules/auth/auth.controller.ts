import { Controller, Post, Body, Logger, UseGuards, Get, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, ActiveUserDto, LoginDto } from './dto/index.dto'
import { User } from './user.entity'
import { IResponse, IGetUser } from '@define/response'
import { GetUser } from '@/common/decorator/get-user.decorator'
import { Public } from '@/common/decorator/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<IResponse<User>> {
    return await this.authService.register(registerDto)
  }

  @Public()
  @Post('active')
  async activeUser(@Body() activeUser: ActiveUserDto): Promise<IResponse<string>> {
    return await this.authService.activeUser(activeUser)
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<IResponse<IGetUser>> {
    return await this.authService.login(loginDto)
  }

  @Get('profile')
  getProfile(@GetUser() user): IResponse<any> {
    return {
      code: 200,
      status: true,
      message: 'Success',
      data: user
    }
  }
}
