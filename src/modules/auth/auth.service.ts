import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { ActiveUserDto, ChangePasswordDto, EditUserDto, LoginDto, RegisterDto } from '@/modules/auth/dto/index.dto'
import { IGetUser, IResponse } from '@define/response'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'
import { ObjectId } from 'mongodb'
import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('users') private readonly userModel: Model<User>
  ) {}
  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user: User = await this.userModel.findOne({ phone_number: payload.phone_number })
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
    const user = new this.userModel({ phone_number, address, email, name, password: hashedPassword, token })
    try {
      await user.save()
      return {
        code: HttpStatus.CREATED,
        status: true,
        message: 'Success',
        data: user.toObject()
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
    const user = await this.userModel.findOne({ token })
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
      await user.save()
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
    const user = await this.userModel.findOne({ phone_number }).populate('group', 'name isAdmin permissions').exec()
    if (!user || !user.auth_status || user.deleted_at) {
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
    user.token = this.jwtService.sign({ phone_number } as JwtPayload)
    await user.save()
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: {
        id: user.toObject().id,
        name: user.toObject().name,
        phone_number: user.toObject().phone_number,
        email: user.toObject().email,
        address: user.toObject().address,
        token: user.toObject().token,
        group: user.toObject().group
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
    const newUser = new this.userModel(user)
    await newUser.save()
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: 'Đổi mật khẩu thành công'
    }
  }
  async deleteUser(id: string): Promise<IResponse<string>> {
    const _id = new ObjectId(id)
    const user = await this.userModel.findOne({ _id })
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Không tìm thấy người dùng cần xóa',
        data: null
      }
    }
    user.deleted_at = new Date()
    await user.save()
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: 'Xóa người dùng thành công'
    }
  }
  async editUser(id: string, editUser: EditUserDto): Promise<IResponse<string>> {
    const _id = new ObjectId(id)
    const user = await this.userModel.findOne({ _id })
    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Không tìm thấy người dùng',
        data: null
      }
    }
    if (user.deleted_at) {
      return {
        code: HttpStatus.FORBIDDEN,
        status: false,
        message: 'Người dùng đã bị xóa',
        data: null
      }
    }
    const { address, email, name } = editUser
    user.address = address || user.address
    user.email = email || user.email
    user.name = name || user.name
    user.updated_at = new Date()
    await user.save()
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Success',
      data: 'Cập nhật thành công'
    }
  }
}
