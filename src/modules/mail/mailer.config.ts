import { MailerOptions } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

export const mailerConfig: MailerOptions = {
  transport: {
    service: 'gmail',
    auth: {
      user: 'lappg2808@gmail.com',
      pass: 'wbncnqgoekwnebwk'
    }
  },
  defaults: {
    from: '"NestJS Mailer" <no-reply@localhost>'
  },
  preview: true,
  template: {
    dir: process.cwd() + '/templates/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true
    }
  }
}
