import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ForbiddenException,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class TransformPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    // throw error for extra props in query and body
    if (type !== 'param') {
      const dtoProps = Object.keys(new metatype())
      let notAllowed = Object.keys(value).filter(
        (key) => !dtoProps.includes(key),
      )
      const ignoreList = /page|skip|limit|sortBy|sortOrder/

      // filter out global query params from ignoreList
      notAllowed = notAllowed.filter((v) => !ignoreList.test(v))
      if (notAllowed.length)
        throw new ForbiddenException(
          `Not allowed ${type} fields: ${notAllowed.join()}`,
        )
    }

    const object = plainToInstance(metatype, value)
    return object
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
