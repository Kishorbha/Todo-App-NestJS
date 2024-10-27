import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance as basePlainToInstance,
} from 'class-transformer'
import { PaginateSerializer } from 'src/serializers/paginate.serializer'

export function plainToInstance(
  cls: ClassConstructor<unknown>,
  plain: any,
  query?: any,
  queryCls: ClassConstructor<unknown> = PaginateSerializer,
) {
  if (!plain) return plain
  let { results, ...rest } = plain
  const options: ClassTransformOptions = {
    strategy: 'excludeAll',
    excludeExtraneousValues: true,
  }
  if (results) {
    rest = basePlainToInstance(queryCls, rest, options)
    results = basePlainToInstance(cls, results, options)
    const { page, limit } = query
    rest = Object.assign(rest, { page, limit })
    return { ...rest, results }
  }
  return basePlainToInstance(cls, plain, options)
}
