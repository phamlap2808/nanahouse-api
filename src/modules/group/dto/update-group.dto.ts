import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'
import { DTOVerification } from '@/common/dto/output-validation'

export class UpdateGroupDto extends DTOVerification<UpdateGroupDto>() {
  @IsOptional()
  @IsString({ message: 'Tên nhóm phải có kiểu dữ liệu là chuỗi' })
  name?: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải có kiểu dữ liệu là chuỗi' })
  description?: string

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  permissions?: string[]
}
