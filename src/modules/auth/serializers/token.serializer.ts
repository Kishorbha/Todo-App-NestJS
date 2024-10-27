import { Expose, Type } from 'class-transformer'
import { UserSerializer } from '../../users/serializers/user.serializer'
import { components } from 'src/types/oas.type'

type OASTokenSerializer = components['schemas']['token.response']

export class TokenSerializer
  extends UserSerializer
  implements OASTokenSerializer
{
  @Expose() refreshToken: string
  @Expose() @Type(() => Date) refreshTokenExpiry: string
  @Expose() accessToken: string
  @Expose() @Type(() => Date) accessTokenExpiry: string
  @Expose() @Type(() => UserSerializer) user: UserSerializer
}
