import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AccessTokenGuard } from 'src/guard/access-token.guard'
import { Request } from 'express'
import { plainToInstance } from 'src/utils/class-validator'
import { UserSerializer } from '../serializers/user.serializer'

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor() {}

  @Get('me')
  getMe(@Req() req: Request) {
    return plainToInstance(UserSerializer, req.user)
  }
}
