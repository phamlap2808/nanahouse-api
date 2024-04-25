import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { extname, join } from 'path'
import * as multer from 'multer'
import * as sharp from 'sharp'
import path from 'node:path'

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    const originalFileExt = extname(value.originalname).substring(1)
    const validImageExtensions = ['png', 'jpg', 'jpeg', 'gif']

    if (!validImageExtensions.includes(originalFileExt)) {
      throw new BadRequestException('Invalid file type')
    }

    try {
      await sharp(value.buffer).metadata()
    } catch (error) {
      throw new BadRequestException('Invalid image file')
    }

    return value
  }
}

// Multer configuration
const storage = multer.diskStorage({
  destination: join(__dirname, '../../../nanahouse/upload'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})
export const multerOptions = {
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    const imageFileValidationPipe = new ImageFileValidationPipe()
    imageFileValidationPipe
      .transform(file)
      .then(() => cb(null, true))
      .catch(() => {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file), false)
      })
  }
}
