import { IResponse } from '@/utils/define/response'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data: IResponse<T>) => ({
        code: context.switchToHttp().getResponse().statusCode,
        status: data.status,
        message: data.message,
        data: data.data
      }))
    )
  }
}
