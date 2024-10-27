import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class PaginateQueries implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET') {
      let { page, limit } = req.query

      limit = +limit ? limit : '20'
      page = ((+page || 1) - 1).toFixed(1)
      const skip = Math.trunc(+limit * +page) + ''

      req.query.page = `${+page + 1}`
      req.query.limit = limit
      req.query.skip = skip
      req.query.sortBy ||= '_id'
      req.query.sortOrder ||= 'asc'
    }
    next()
  }
}
