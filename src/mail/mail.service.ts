import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // replace with your SMTP server host
      port: 587, // replace with your SMTP server port
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'user@example.com', // replace with your SMTP server username
        pass: 'password' // replace with your SMTP server password
      }
    })
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: '"NestJS Mailer" <no-reply@example.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text // plain text body
    })

    console.log('Message sent: %s', info.messageId)
  }
}
