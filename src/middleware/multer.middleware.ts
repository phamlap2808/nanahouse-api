import { Injectable } from '@nestjs/common'
import * as multer from 'multer'
import * as path from 'path'

@Injectable()
export class MulterMiddleware {
  private readonly upload: multer.Multer

  constructor() {
    this.upload = multer({
      dest: path.join(__dirname, '../../uploads'), // Replace with your image storage path
      limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit (adjust as needed)
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true)
        } else {
          cb(null, false)
        }
      }
    })
  }

  singleFile() {
    return this.upload.single('thumbnail' || 'image') // Adapt field names as needed
  }

  multipleFiles() {
    return this.upload.array('images') // Adapt field name if needed
  }
}
