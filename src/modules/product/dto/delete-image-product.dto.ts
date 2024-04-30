import { DTOVerification } from '@/common/dto/index.dto'
import { IsNotEmpty } from 'class-validator'

export class DeleteProductImageDto extends DTOVerification<DeleteProductImageDto>() {
  @IsNotEmpty({ message: 'Ảnh không được bỏ trống' })
  image: string
}
