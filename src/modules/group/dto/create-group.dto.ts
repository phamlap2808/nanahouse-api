import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayMinSize, IsBoolean } from 'class-validator'
import { DTOVerification } from '@/common/dto/index.dto'
import { isUnique } from '@/common/validator/unique.validator'

export class CreateGroupDto extends DTOVerification<CreateGroupDto>() {
  @IsNotEmpty({ message: 'Tên nhóm không được bỏ trống' })
  @IsString({ message: 'Tên nhóm phải có kiểu dữ liệu là chuỗi' })
  @isUnique('groups', 'name', { message: 'Tên nhóm đã tồn tại' })
  name: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải có kiểu dữ liệu là chuỗi' })
  description: string

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  permissions: string[]
}
