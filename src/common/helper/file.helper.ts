import * as fs from 'fs'
import * as path from 'path'
import { ParseFilePipeBuilder } from '@nestjs/common'
import { CustomUploadFileTypeValidator } from '@/common/validator/upload-file-type.validator'

function createSingleFile(thumbnail: Express.Multer.File): string {
  const dirPath = path.join(__dirname, '..', '..', '..', 'uploads', 'images')
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  const randomNumber = Math.floor(Math.random() * 1000000)
  const date = new Date()
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getFullYear()}`
  const newFileName = `${randomNumber}_${formattedDate}.${thumbnail.mimetype.split('/')[1]}`

  const filePath = path.join(dirPath, newFileName)
  fs.writeFile(filePath, thumbnail.buffer, (err) => {
    if (err) {
      console.error(err)
    }
  })

  return `/uploads/images/${newFileName}`
}

function createMultipleFiles(files: Express.Multer.File[]): string[] {
  return files.map((file) => createSingleFile(file))
}

function createFilePipeBuilder() {
  return new ParseFilePipeBuilder()
    .addValidator(
      new CustomUploadFileTypeValidator({
        fileType: ['image/png', 'image/jpeg', 'image/jpg']
      })
    )
    .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
    .build({ fileIsRequired: false })
}

function addDomainToImage(image: string): string {
  return `${process.env.BACKEND_DOMAIN}${image}`
}

export { createSingleFile, createMultipleFiles, createFilePipeBuilder, addDomainToImage }
