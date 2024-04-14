import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(receiverEmail: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to: receiverEmail,
        subject: subject,
        html: content
      })
      return true
    } catch (error) {
      console.error('Error sending email', error)
      return false
    }
  }
}
