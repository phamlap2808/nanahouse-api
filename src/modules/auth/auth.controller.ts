import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, ActiveUserDto, LoginDto, ChangePasswordDto, EditUserDto } from './dto/index.dto'
import { User } from './user.schema'
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
  getProfile(@GetUser() user: User): IResponse<any> {
    return {
      code: 200,
      status: true,
      message: 'Success',
      data: user
    }
  }

  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User
  ): Promise<IResponse<string>> {
    return await this.authService.changePassword(changePasswordDto, user)
  }

  @Delete('/:id')
  deleteAccount(@Param('id') id: string): Promise<IResponse<string>> {
    return this.authService.deleteUser(id)
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() editUserDto: EditUserDto): Promise<IResponse<string>> {
    return this.authService.editUser(id, editUserDto)
  }
}
