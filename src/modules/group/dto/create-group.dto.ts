import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayMinSize } from 'class-validator'
import { DTOVerification } from '@/common/dto/index.dto'
import { isUnique } from '@/common/validator/unique.validator'

export class CreateGroupDto extends DTOVerification<CreateGroupDto>() {
  @IsNotEmpty({ message: 'Tên nhóm không được bỏ trống' })
  @IsString({ message: 'Tên nhóm phải có kiểu dữ liệu là chuỗi' })
  @isUnique({ tableName: 'group', column: 'name' })
  name: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải có kiểu dữ liệu là chuỗi' })
  description: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  permissions: string[]
}
