import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = '请求失败';
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      exceptionResponse !== null
    ) {
      const typedResponse = exceptionResponse as { message: string | string[] };
      message = Array.isArray(typedResponse.message)
        ? typedResponse.message[0]
        : typedResponse.message;
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
