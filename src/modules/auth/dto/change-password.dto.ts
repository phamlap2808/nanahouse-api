import { IsNotEmpty, IsString } from 'class-validator'
import { DTOVerification } from '@/common/dto/output-validation'

export class ChangePasswordDto extends DTOVerification<ChangePasswordDto>() {
  @IsNotEmpty({ message: 'Mật khẩu cũ không được bỏ trống' })
  @IsString({ message: 'Mật khẩu cũ phải có kiểu dữ liệu là chuỗi' })
  old_password: string

  @IsNotEmpty({ message: 'Mật khẩu mới không được bỏ trống' })
  @IsString({ message: 'Mật khẩu mới phải có kiểu dữ liệu là chuỗi' })
  new_password: string
}
