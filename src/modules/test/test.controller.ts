import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { TestService } from './test.service'
import { IResponse } from '@/utils/define/response'
import { TransformInterceptor } from '@transformers/response.transformer'

@Controller('test')
@UseInterceptors(TransformInterceptor)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  getHello(): IResponse<string> {
    return this.testService.getHello()
  }
}
