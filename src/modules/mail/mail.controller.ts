import { Controller, Get } from '@nestjs/common'
import { MailService } from './mail.service'

@Controller()
export class MailController {
  constructor(private readonly mailerService: MailService) {}

  @Get('send-mail')
  async sendMail() {
    await this.mailerService.sendMail('recipient@example.com', 'Hello', 'Hello from NestJS!')
    return 'Mail sent'
  }
}
