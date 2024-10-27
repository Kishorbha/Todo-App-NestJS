import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { TaskService } from '../services/task.service'
import { Request } from 'express'
import { AccessTokenGuard } from 'src/guard/access-token.guard'
import { plainToInstance } from 'src/utils/class-validator'
import { TaskSerializer } from '../serializers/task.serializer'
import { UpdateTaskDto } from '../dtos/update-task.dto'
import { TaskIdDto } from '../dtos/task-id.dto'
import { TankListDto } from '../dtos/tank-list.dto'
import { CreateTaskDto } from '../dtos/create-task.dto'

@Controller('tasks')
@UseGuards(AccessTokenGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async list(@Query() query: TankListDto, @Req() req: Request) {
    const data = await this.taskService.getAll(query, req.user)
    return plainToInstance(TaskSerializer, data, query)
  }

  @Post()
  async create(@Req() req: Request, @Body() body: CreateTaskDto) {
    const data = await this.taskService.create(req.user, body)
    return plainToInstance(TaskSerializer, data)
  }

  @Patch(':taskId')
  async update(@Body() body: UpdateTaskDto, @Param() { taskId }: TaskIdDto) {
    const data = await this.taskService.update(taskId, body)
    return plainToInstance(TaskSerializer, data)
  }

  @Delete(':taskId')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param() { taskId }: TaskIdDto) {
    await this.taskService.delete(taskId, req.user)
  }
}
