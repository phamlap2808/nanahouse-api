import { IsNotEmpty, IsString } from 'class-validator'
import { DTOVerification } from '@/common/dto/output-validation'

export class ActiveUserDto extends DTOVerification<ActiveUserDto>() {
  @IsNotEmpty({ message: 'Mã xác thực không được bỏ trống' })
  @IsString({ message: 'Mã xác thực phải có kiểu dữ liệu là chuỗi' })
  token: string
}
