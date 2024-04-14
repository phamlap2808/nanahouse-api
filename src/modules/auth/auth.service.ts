import { HttpStatus, Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { User } from './user.entity'
import { RegisterDto, ActiveUserDto, LoginDto } from '@/modules/auth/dto/index.dto'
import { IResponse, IGetUser } from '@define/response'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService
  ) {}
  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user: User = await this.userRepository.findOne({ where: { phone_number: payload.phone_number } })
    if (!user) {
      throw new BadRequestException('Tài khoản và mật khẩu không chính xác')
    }
    return user
  }
  async register(registerDto: RegisterDto): Promise<IResponse<User>> {
    const { phone_number, address, email, name, password } = registerDto
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const token = this.jwtService.sign({ phone_number } as JwtPayload)
    const user = this.userRepository.create({ phone_number, address, email, name, password: hashedPassword, token })
    try {
      await this.userRepository.save(user)
      return {
        code: HttpStatus.CREATED,
        status: true,
        message: 'Success',
        data: user
      }
    } catch (error) {
      return {
        code: HttpStatus.BAD_REQUEST,
        status: false,
        message: error.message,
        data: null
      }
    }
  }
  async activeUser(activeUser: ActiveUserDto): Promise<IResponse<string>> {
    const { token } = activeUser
    const user = await this.userRepository.findOne({ where: { token } })
    if (!user) {
      return {
        code: HttpStatus.FORBIDDEN,
        status: false,
        message: 'Token không hợp lệ',
        data: null
      }
    } else {
      user.auth_status = true
      user.token = null
      await this.userRepository.save(user)
      return {
        code: HttpStatus.OK,
        status: true,
        message: 'Success',
        data: 'Kích hoạt tài khoản thành công'
      }
    }
  }
  async login(loginDto: LoginDto): Promise<IResponse<IGetUser>> {
    const { phone_number, password } = loginDto
    const user = await this.userRepository.findOne({ where: { phone_number } })
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Tài khoản và mật khẩu không chính xác',
        data: null
      }
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return {
        code: HttpStatus.BAD_REQUEST,
        status: false,
        message: 'Tài khoản và mật khẩu không chính xác',
        data: null
      }
    }
    const token = this.jwtService.sign({ phone_number } as JwtPayload)
    user.token = token
    await this.userRepository.save(user)
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: {
        address: user.address,
        email: user.email,
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        token
      }
    }
  }
}
