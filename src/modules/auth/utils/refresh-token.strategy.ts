import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { UsersRepository } from 'src/modules/users/repositories/users.repository'
import { TokensRepository } from '../repositories/token.repository'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly tokenRepo: TokensRepository,
  ) {
    super({
      jwtFromRequest: (req: Request) =>
        req.headers.authorization?.split(' ')[1] || req.cookies.refreshToken,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    })
  }
  async validate(req: Request, payload: JwtPayload) {
    const refreshToken =
      req.headers.authorization?.split(' ')[1] || req.cookies.refreshToken

    const user = await this.userRepo.findById(payload.sub)
    const token = await this.tokenRepo.findOne({
      userId: new Types.ObjectId(payload.sub),
      token: refreshToken,
    })

    if (token && user) return user
    throw new UnauthorizedException('Unauthorized')
  }
}
