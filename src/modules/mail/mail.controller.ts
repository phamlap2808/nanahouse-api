import { Body, Controller, Post } from '@nestjs/common'
import { MailService } from './mail.service'

@Controller('email')
export class MailController {
  constructor(private readonly mailerService: MailService) {}

  @Post('send')
  async sendMail(@Body() emailData: { to: string; subject: string; content: string }) {
    const { to, subject, content } = emailData
    const emailSent = await this.mailerService.sendMail(to, subject, content)

    if (emailSent) {
      return {
        success: true,
        message: 'Email sent successfully'
      }
    } else {
      return {
        success: false,
        message: 'Error sending email'
      }
    }
  }
}
