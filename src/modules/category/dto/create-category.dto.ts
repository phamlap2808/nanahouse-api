import { IsString, IsOptional, IsNotEmpty } from 'class-validator'
import { DTOVerification } from '@/common/dto/index.dto'

export class CreateCategoryDto extends DTOVerification<CreateCategoryDto>() {
  @IsNotEmpty({ message: 'Tên danh mục không được bỏ trống' })
  @IsString({ message: 'Tên danh mục phải có kiểu dữ liệu là chuỗi' })
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  parent_id: string
}
