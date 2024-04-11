import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from './mail/mail.module'
import { TestModule } from './test/test.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/nanahouse',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    MailModule,
    TestModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
