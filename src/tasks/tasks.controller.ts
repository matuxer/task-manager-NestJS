import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { Task } from './tasks.model';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Promise<Task> {
    return this.taskService.createTask(title, description);
  }

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('completed') completed: boolean,
  ): Promise<Task> {
    return this.taskService.updateTask(id, title, description, completed);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
