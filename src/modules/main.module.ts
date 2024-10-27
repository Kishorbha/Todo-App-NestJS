import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TaskModule } from './tasks/task.module'

@Module({
  imports: [AuthModule, UsersModule, TaskModule],
})
export class MainModule {}
