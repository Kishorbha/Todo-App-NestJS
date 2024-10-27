import { Module } from '@nestjs/common'
import { Tasks, TasksSchema } from './entities/task.entity'
import { MongooseModule } from '@nestjs/mongoose'
import { TaskRepository } from './repositories/task.repository'
import { TaskController } from './controllers/task.controller'
import { TaskService } from './services/task.service'

const providers = [TaskRepository, TaskService]

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tasks.name,
        schema: TasksSchema,
      },
    ]),
  ],
  providers,
  controllers: [TaskController],
})
export class TaskModule {}
