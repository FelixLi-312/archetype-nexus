import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response as ExpressResponse } from 'express';

export interface Response<T> {
  code: number;
  data: T | null;
  message: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();
    const statusCode = response?.statusCode || 200;
    return next.handle().pipe(
      map(
        (data: T): Response<T> => ({
          code: statusCode,
          data: data ?? null,
          message: 'Success',
        }),
      ),
    );
  }
}
