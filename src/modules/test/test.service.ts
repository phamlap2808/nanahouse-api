import { IResponse } from '@define/response'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TestService {
  getHello(): IResponse<string> {
    return {
      status: true,
      message: 'Success',
      data: 'Hello World'
    }
  }
}
