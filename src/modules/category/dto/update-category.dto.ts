import { IsString, IsOptional } from 'class-validator'
import { DTOVerification } from '@/common/dto/index.dto'

export class UpdateCategoryDto extends DTOVerification<UpdateCategoryDto>() {
  @IsString({ message: 'Tên danh mục phải có kiểu dữ liệu là chuỗi' })
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  parent_id: string
}
