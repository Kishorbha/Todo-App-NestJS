import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  Delete,
  Get,
  HttpCode,
} from '@nestjs/common'
import { CreateUserDto } from '../dtos/create-user.dto'
import { LocalAuthGuard } from 'src/guard/local.guard'
import { Response, Request } from 'express'
import { plainToInstance } from 'src/utils/class-validator'
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard'
import { AuthService } from '../services/auth.service'
import { TokenSerializer } from '../serializers/token.serializer'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() body: CreateUserDto) {
    return this.authService.registerUser(body)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const { token, user } = await this.authService.login(req.user, res)
    return plainToInstance(TokenSerializer, { ...token, user })
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutUser(
      req.user._id,
      req.headers.authorization?.split(' ')[1] || req.cookies.refreshToken,
      res,
    )
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async getAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { token, user } = await this.authService.getAccessToken(
      req.user,
      req.headers.authorization?.split(' ')[1] || req.cookies.refreshToken,
      res,
    )
    return plainToInstance(TokenSerializer, { user, ...token })
  }
}
