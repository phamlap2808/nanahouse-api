import { IsString, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
  @IsString({ message: 'Số điện thoại phải có kiểu dữ liệu là chuỗi' })
  phone_number: string

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string
}
