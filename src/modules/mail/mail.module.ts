import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailController } from './mail.controller'
import { mailerConfig } from './mailer.config'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [MailerModule.forRoot(mailerConfig)],
  exports: [MailModule]
})
export class MailModule {}
