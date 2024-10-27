import { Expose, Transform, Type } from 'class-transformer'
import { components } from 'src/types/oas.type'

type OASUserSerializer = components['schemas']['user.response']

export class UserSerializer implements OASUserSerializer {
  @Expose() @Transform(({ obj }) => obj._id) id: string
  @Expose() fullName: string
  @Expose() email: string
  @Expose() @Type(() => Number) createdAt: number
  @Expose() @Type(() => Number) updatedAt: number
}
