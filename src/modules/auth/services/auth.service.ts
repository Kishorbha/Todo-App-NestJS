import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { compareHash } from 'src/utils/helpers'
import { UsersDocument } from 'src/modules/users/entities/user.entity'
import { CookieOptions, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import * as ms from 'ms'
import { UsersRepository } from 'src/modules/users/repositories/users.repository'
import { CreateUserDto } from '../dtos/create-user.dto'
import { USER } from 'src/constants/user.constant'
import { Types } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { TokensRepository } from '../repositories/token.repository'
import { hashPassword } from 'src/utils/helpers'
import { LoginDto } from '../dtos/login.dto'
import { COMMON } from 'src/constants/common.constant'

@Injectable()
export class AuthService {
  private accessCookieOptions: CookieOptions
  private refreshCookieOptions: CookieOptions
  constructor(
    private config: ConfigService,
    private userRepo: UsersRepository,
    private tokenRepo: TokensRepository,
    private jwtService: JwtService,
  ) {
    this.accessCookieOptions = {
      domain: this.config.getOrThrow('app.cookieDomain'),
      httpOnly: true,
      path: '/',
      sameSite: true,
      maxAge: ms(this.config.getOrThrow('app.accessExpiry')),
      secure: /stage|prod/.test(process.env.NODE_ENV),
    }
    this.refreshCookieOptions = {
      domain: this.config.getOrThrow('app.cookieDomain'),
      httpOnly: true,
      path: '/',
      maxAge: ms(this.config.getOrThrow('app.refreshExpiry')),
      secure: /stage|prod/.test(process.env.NODE_ENV),
    }
  }

  async validateUser(payload: LoginDto) {
    const { email, password } = payload

    const user = await this.userRepo.findOne({ email: email.toLowerCase() })
    if (!user) {
      throw new UnauthorizedException(COMMON.invalidCredentials)
    }

    const isPasswordValid = await compareHash(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException(COMMON.invalidPassword)
    }

    return user
  }

  async createMockUsers(userDetails: CreateUserDto) {
    return await this.userRepo.findOneAndUpdate(
      {
        email: userDetails.email,
      },
      {
        $setOnInsert: {
          ...userDetails,
          password: await hashPassword(userDetails.password),
        },
      },
      { upsert: true, new: true },
    )
  }

  async registerUser(userDetails: CreateUserDto) {
    const user = await this.userRepo
      .new({
        ...userDetails,
        password: await hashPassword(userDetails.password),
      })
      .save()

    if (!user)
      throw new HttpException(
        USER.systemError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )

    return { message: COMMON.success }
  }

  async login(user: UsersDocument, res: Response) {
    const token = await this.generateAccessAndRefreshTokens(user)
    const tokenSchema = this.tokenRepo.new({
      userId: user._id,
      token: token.refreshToken,
      expireAt: token.refreshTokenExpiry,
    })
    await tokenSchema.save()

    this.setRefreshAndRefreshCookies(res, token)
    return { token, user }
  }

  async logoutUser(userId: Types.ObjectId, token: string, res: Response) {
    await this.tokenRepo.deleteOne({ userId, token })
    return this.setRefreshAndRefreshCookies(res, {})
  }

  async generateAccessAndRefreshTokens(user: UsersDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.config.getOrThrow('app.accessSecret'),
          expiresIn: this.config.getOrThrow('app.accessExpiry'),
        },
      ),
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.config.getOrThrow('app.refreshSecret'),
          expiresIn: this.config.getOrThrow('app.refreshExpiry'),
        },
      ),
    ])
    return {
      accessToken,
      refreshToken,
      accessTokenExpiry: new Date(
        Date.now() + ms(this.config.getOrThrow('app.accessExpiry')),
      ),
      refreshTokenExpiry: new Date(
        Date.now() + ms(this.config.getOrThrow('app.refreshExpiry')),
      ),
    }
  }

  setRefreshAndRefreshCookies(res: Response, token: any) {
    res.cookie('accessToken', token.accessToken, this.accessCookieOptions)
    res.cookie(
      'accessTokenExpiry',
      token?.accessTokenExpiry?.toISOString(),
      this.accessCookieOptions,
    )
    res.cookie('refreshToken', token.refreshToken, this.refreshCookieOptions)
    res.cookie(
      'refreshTokenExpiry',
      token?.refreshTokenExpiry?.toISOString(),
      this.refreshCookieOptions,
    )
  }

  async getAccessToken(
    user: UsersDocument,
    refreshToken: string,
    res: Response,
  ) {
    const token = await this.generateAccessAndRefreshTokens(user)
    const tokenSchema = this.tokenRepo.new({
      userId: user._id,
      token: token.refreshToken,
      expireAt: token.refreshTokenExpiry,
    })

    Promise.all([
      tokenSchema.save(),
      this.tokenRepo.deleteOne({ userId: user._id, token: refreshToken }),
    ])
    this.setRefreshAndRefreshCookies(res, token)

    return { token, user }
  }
}
