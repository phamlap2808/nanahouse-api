import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator'
import { DTOVerification } from '@/common/dto/index.dto'
import { isUnique } from '@/common/validator/unique.validator'

export class RegisterDto extends DTOVerification<RegisterDto>() {
  @IsNotEmpty({ message: 'Tên không được bỏ trống' })
  @IsString({ message: 'Tên phải có kiểu dữ liệu là chuỗi' })
  name: string

  @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
  @IsString({ message: 'Số điện thoại phải có kiểu dữ liệu là chuỗi' })
  @isUnique('users', 'phone_number', { message: 'Số điện thoại đã tồn tại' })
  phone_number: string

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải có kiểu dữ liệu là chuỗi' })
  address: string

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string
}
