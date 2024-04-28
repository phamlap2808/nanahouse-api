import { Controller, Get } from '@nestjs/common'
import { TestService } from './test.service'
import { IResponse } from '@define/response'
import { Public } from '@/common/decorator/public.decorator'

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  @Public()
  getHello(): IResponse<string> {
    return this.testService.getHello()
  }
}
