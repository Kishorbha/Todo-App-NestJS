import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './utils/local.strategy'
import { RefreshTokenStrategy } from './utils/refresh-token.strategy'
import { AccessTokenStrategy } from './utils/access-token.strategy'
import { TokensRepository } from './repositories/token.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Tokens, TokensSchema } from './entities/token.entity'
import { IsEmailExistsValidation } from './validators/email-exists.validator'

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    TokensRepository,
    IsEmailExistsValidation,
  ],
  exports: [AuthService, TokensRepository],
})
export class AuthModule {}
