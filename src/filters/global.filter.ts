import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { mongoDuplicateValueError } from './helpers'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const request = http.getRequest<Request>()
    const response = http.getResponse<Response>()
    let statusCode: number, message: string, reason: string, data: object

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      reason = exception.name
      const exceptionRes = exception.getResponse() as Record<string, any>
      if (exceptionRes.message) message = exceptionRes.message
      else {
        message = exception['options'].description
        data = exceptionRes
      }
    } else if (exception instanceof Error) {
      mongoDuplicateValueError(exception)

      statusCode = 400
      reason = exception.name
      message = exception.message
    }

    Logger.error(request.originalUrl)
    console.error(exception)

    statusCode ||= 500
    if (Array.isArray(message)) message = message.join(';')
    message ||= 'Internal Sever Error'
    reason ||= 'unknown'
    response.status(statusCode).json({ statusCode, reason, message, data })
  }
}
