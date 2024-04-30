import { DTOVerification } from '@/common/dto/index.dto'
import { IsNumberString, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProductDto extends DTOVerification<UpdateProductDto>() {
  @IsOptional()
  @IsString({ message: 'Danh mục phải có kiểu dữ liệu là chuỗi' })
  category_id: string

  @IsOptional()
  @IsString({ message: 'biến thể phải có kiểu dữ liệu là chuỗi' })
  variant_id: string

  @IsOptional()
  @IsString({ message: 'Tên sản phẩm phải có kiểu dữ liệu là chuỗi' })
  title: string

  @IsOptional()
  @IsString({ message: 'SKU phải có kiểu dữ liệu là chuỗi' })
  sku: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải có kiểu dữ liệu là chuỗi' })
  description: string

  @IsOptional()
  @IsNumberString()
  origin_price: number

  @IsOptional()
  @IsNumberString()
  friendly_price: number

  @IsOptional()
  @IsNumberString()
  quantity: number

  @IsOptional()
  @IsNumberString()
  availability: number

  @IsOptional()
  @IsString({ message: 'Tiêu đề phải có kiểu dữ liệu là chuỗi' })
  og_title: string

  @IsOptional()
  @IsString({ message: 'Mô tả không được bỏ trống' })
  og_description: string

  @IsOptional()
  @IsString({ message: 'URL không được bỏ trống' })
  og_url: string

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString({ message: 'Ảnh phải có kiểu dữ liệu là chuỗi' })
  thumbnail: string

  @ApiProperty({ type: 'array', format: 'binary' })
  @IsOptional()
  @IsString({ message: 'Ảnh phải có kiểu dữ liệu là chuỗi' })
  images: string[]
}
