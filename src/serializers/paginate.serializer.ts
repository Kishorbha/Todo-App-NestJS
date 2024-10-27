import { Expose } from 'class-transformer'

export class PaginateSerializer {
  @Expose()
  total: number

  @Expose()
  limit: number

  @Expose()
  page: number
}
