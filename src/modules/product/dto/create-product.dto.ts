import { DTOVerification } from '@/common/dto/index.dto'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto extends DTOVerification<CreateProductDto>() {
  @IsNotEmpty({ message: 'Tên sản phẩm không được bỏ trống' })
  @IsString({ message: 'Tên sản phẩm phải có kiểu dữ liệu là chuỗi' })
  title: string

  @IsNotEmpty({ message: 'SKU không được bỏ trống' })
  @IsString({ message: 'SKU phải có kiểu dữ liệu là chuỗi' })
  sku: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải có kiểu dữ liệu là chuỗi' })
  description: string

  @IsNotEmpty({ message: 'Giá gốc không được bỏ trống' })
  @IsNumber()
  origin_price: number

  @IsNotEmpty({ message: 'Giá thành viên không được bỏ trống' })
  @IsNumber()
  friendly_price: number

  @IsNotEmpty({ message: 'Số lượng không được bỏ trống' })
  @IsNumber()
  quantity: number

  @IsNotEmpty({ message: 'Tình trạng không được bỏ trống' })
  @IsNumber()
  availability: number

  @IsNotEmpty({ message: 'Tiêu đề không được bỏ trống' })
  @IsString({ message: 'Tiêu đề phải có kiểu dữ liệu là chuỗi' })
  og_title: string

  @IsOptional()
  @IsString({ message: 'Mô tả không được bỏ trống' })
  og_description: string

  @IsNotEmpty({ message: 'URL không được bỏ trống' })
  @IsString({ message: 'phải có kiểu dữ liệu là chuỗi' })
  og_url: string

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty({ message: 'Ảnh không được bỏ trống' })
  @IsString({ message: 'Ảnh phải có kiểu dữ liệu là chuỗi' })
  thumbnail: string

  @ApiProperty({ type: 'array', format: 'binary' })
  @IsOptional()
  @IsString({ message: 'Ảnh phải có kiểu dữ liệu là chuỗi' })
  images: string[]
}
