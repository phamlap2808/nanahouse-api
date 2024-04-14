import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from '@/modules/mail/mail.module'
import { TestModule } from '@/modules/test/test.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { SettingsModule } from './modules/settings/settings.module'
import { GroupModule } from './modules/group/group.module'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from '@/modules/auth/jwt.guard'
import { PermissionsGuard } from '@/modules/group/permissions.guard'
import { GroupService } from '@/modules/group/group.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/nanahouse',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    MailModule,
    TestModule,
    AuthModule,
    SettingsModule,
    GroupModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ]
})
export class AppModule {}
