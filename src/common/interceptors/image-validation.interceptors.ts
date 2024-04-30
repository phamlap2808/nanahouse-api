import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class ImagesValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const files: Express.Multer.File[] = context.switchToHttp().getRequest().files

    files.forEach((file) => {
      if (['image/png', 'image/jpeg', 'image/jpg'].indexOf(file.mimetype) === -1) {
        throw new BadRequestException(`Invalid file type: ${file.originalname}`)
      }

      if (file.size > 1024 * 1024 * 5) {
        throw new BadRequestException(`File too large: ${file.originalname}`)
      }
    })

    return next.handle()
  }
}

@Injectable()
export class ImageValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const file: Express.Multer.File = context.switchToHttp().getRequest().file

    if (['image/png', 'image/jpeg', 'image/jpg'].indexOf(file.mimetype) === -1) {
      throw new BadRequestException(`Invalid file type: ${file.originalname}`)
    }

    if (file.size > 1024 * 1024 * 5) {
      throw new BadRequestException(`File too large: ${file.originalname}`)
    }

    return next.handle()
  }
}

@Injectable()
export class FilesFieldsValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const files: { [fieldname: string]: Express.Multer.File[] } = context.switchToHttp().getRequest().files
    if (!files) {
      return next.handle()
    }
    Object.values(files)
      .flat()
      .forEach((file) => {
        if (['image/png', 'image/jpeg', 'image/jpg'].indexOf(file.mimetype) === -1) {
          throw new BadRequestException(`Invalid file type: ${file.originalname}`)
        }

        if (file.size > 1024 * 1024 * 5) {
          throw new BadRequestException(`File too large: ${file.originalname}`)
        }
      })

    return next.handle()
  }
}
