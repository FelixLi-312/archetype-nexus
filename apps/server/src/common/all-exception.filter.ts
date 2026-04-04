import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 打印错误详情到控制台
    console.error('Exception caught by filter:', exception);

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const messageStr =
      typeof message === 'object' && message !== null
        ? String(
            (message as Record<string, any>).message || JSON.stringify(message),
          )
        : String(message);

    const responseBody = {
      code: httpStatus,
      data: null,
      message: messageStr,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest<any>()) as string,
    };

    httpAdapter.reply(ctx.getResponse<any>(), responseBody, httpStatus);
  }
}
