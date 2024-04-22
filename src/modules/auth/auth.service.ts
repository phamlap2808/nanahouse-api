import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { User } from './user.entity'
import { ActiveUserDto, LoginDto, RegisterDto, ChangePasswordDto } from '@/modules/auth/dto/index.dto'
import { IGetUser, IResponse } from '@define/response'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'
import { ObjectId } from 'mongodb'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService
  ) {}
  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user: User = await this.userRepository.findOne({ where: { phone_number: payload.phone_number } })
    if (!user) {
      throw new NotFoundException('Tài khoản và mật khẩu không chính xác')
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
    } else if (user.deleted_at) {
      return {
        code: HttpStatus.FORBIDDEN,
        status: false,
        message: 'Tài khoản đã bị xóa',
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
    if (!user.auth_status) {
      return {
        code: HttpStatus.FORBIDDEN,
        status: false,
        message: 'Tài khoản và mật khẩu không chính xác',
        data: null
      }
    }
    if (user.deleted_at) {
      return {
        code: HttpStatus.FORBIDDEN,
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
        id: user.id.toString(),
        name: user.name,
        phone_number: user.phone_number,
        token
      }
    }
  }
  async changePassword(changePassword: ChangePasswordDto, user: User): Promise<IResponse<string>> {
    const { old_password, new_password } = changePassword
    const isMatch = await bcrypt.compare(old_password, user.password)
    if (!isMatch) {
      return {
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        status: false,
        message: 'Mật khẩu cũ không chính xác',
        data: null
      }
    }
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(new_password, salt)
    await this.userRepository.save(user)
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: 'Đổi mật khẩu thành công'
    }
  }
  async deleteUser(id: string): Promise<IResponse<string>> {
    const _id = new ObjectId(id)
    const user = await this.userRepository.findOne({ where: { _id } })
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Không tìm thấy người dùng cần xóa',
        data: null
      }
    }
    user.deleted_at = new Date()
    await this.userRepository.save(user)
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: 'Xóa người dùng thành công'
    }
  }
}
