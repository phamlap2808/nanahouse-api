import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from '@/modules/mail/mail.module'
import { TestModule } from '@/modules/test/test.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { SettingsModule } from './modules/settings/settings.module'
import { GroupModule } from './modules/group/group.module'
// import { GroupService } from '@/modules/group/group.service'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from '@/modules/auth/jwt.guard'
import { CheckPermissions } from '@/modules/group/permissions.guard'
import { Group } from '@/modules/group/group.entity'
import { CategoryModule } from '@/modules/category/category.module'
import { ProductModule } from './modules/product/product.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    MailModule,
    TestModule,
    AuthModule,
    SettingsModule,
    GroupModule,
    TypeOrmModule.forFeature([Group]),
    CategoryModule,
    ProductModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    {
      provide: APP_GUARD,
      useClass: CheckPermissions
    }
    // GroupService,
    // {
    //   provide: 'APP_INITIALIZER',
    //   useFactory: (groupService: GroupService) => async () => {
    //     await groupService.createInitialGroups()
    //   },
    //   inject: [GroupService]
    // }
  ]
})
export class AppModule {}
