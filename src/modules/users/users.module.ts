import { Global, Module, OnModuleInit } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Users, UsersSchema } from 'src/modules/users/entities/user.entity'
import { UsersRepository } from 'src/modules/users/repositories/users.repository'
import { UsersController } from 'src/modules/users/controllers/users.controller'
import { UsersService } from 'src/modules/users/services/users.service'
import { JwtModule } from '@nestjs/jwt'
import { users } from 'src/_mocks_/users'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/services/auth.service'

const providers = [UsersService, UsersRepository]

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    JwtModule.register({}),
    AuthModule,
  ],
  controllers: [UsersController],
  providers,
  exports: providers,
})
export class UsersModule implements OnModuleInit {
  constructor(private authService: AuthService) {}
  async onModuleInit() {
    if (process.env.NODE_ENV !== 'prod') {
      users.forEach((element: any) => this.authService.createMockUsers(element))
    }
  }
}
