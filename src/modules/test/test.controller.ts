import { Controller, Get } from '@nestjs/common'
import { TestService } from './test.service'
import { IResponse } from '@define/response'
import { Connection } from 'typeorm'
import { Public } from '@/common/decorator/public.decorator'

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private connection: Connection
  ) {}

  @Get()
  @Public()
  getHello(): IResponse<string> {
    return this.testService.getHello()
  }

  @Get('db')
  @Public()
  checkDbConnection(): IResponse<string> {
    if (this.connection.isConnected) {
      return {
        status: true,
        message: 'Success',
        data: 'Database connected'
      }
    } else {
      return {
        status: false,
        message: 'Failed',
        data: 'Database not connected'
      }
    }
  }
}
