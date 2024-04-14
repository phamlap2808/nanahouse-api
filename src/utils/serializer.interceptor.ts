import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import deepResolvePromises from './deep-resolver'
import { IResponse } from '@define/response'

@Injectable()
export class ResolvePromisesInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data: IResponse<T>) =>
        deepResolvePromises({
          code: context.switchToHttp().getResponse().statusCode,
          status: data.status,
          message: data.message,
          data: data.data
        })
      )
    )
  }
}
