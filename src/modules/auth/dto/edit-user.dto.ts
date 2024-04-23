import { IsEmail, IsOptional, IsString } from 'class-validator'
import { DTOVerification } from '@/common/dto/output-validation'

export class EditUserDto extends DTOVerification<EditUserDto>() {
  @IsOptional()
  @IsString({ message: 'Tên phải có kiểu dữ liệu là chuỗi' })
  name: string

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải có kiểu dữ liệu là chuỗi' })
  address: string

  @IsOptional()
  @IsString({ message: 'Nhóm phải có kiểu dữ liệu là chuỗi' })
  group_id: string
}
