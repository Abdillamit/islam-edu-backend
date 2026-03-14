import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionResponse = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as ExceptionResponse | string)
        : 'Internal server error';

    const message = this.extractMessage(exceptionResponse, statusCode);
    const errors = this.extractErrors(exceptionResponse);

    response.status(statusCode).json({
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: response.getHeader('x-request-id') ?? null,
    });
  }

  private extractMessage(
    response: ExceptionResponse | string,
    statusCode: number,
  ): string {
    if (typeof response === 'string') {
      return response;
    }

    if (Array.isArray(response.message)) {
      return response.message[0] ?? HttpStatus[statusCode];
    }

    return response.message ?? HttpStatus[statusCode] ?? 'Unknown error';
  }

  private extractErrors(response: ExceptionResponse | string): string[] {
    if (typeof response === 'string') {
      return [response];
    }

    if (Array.isArray(response.message)) {
      return response.message;
    }

    return response.message ? [response.message] : [];
  }
}
