import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //  @Post()
  //  async createTask(
  //    @Body('title') title: string,
  //    @Body('description') description: string,
  //  ): Promise<Task> {
  //    return this.taskService.createTask(title, description);
  //  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskService.createTask(createTaskDto);
    } catch (error) {
      console.error('Error al crear la tarea', error.message);

      throw new HttpException(
        'Error al crear la tarea',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  //  @Put(':id')
  //  async updateTask(
  //    @Param('id') id: string,
  //    @Body('title') title: string,
  //    @Body('description') description: string,
  //    @Body('completed') completed: boolean,
  //  ): Promise<Task> {
  //    return this.taskService.updateTask(id, title, description, completed);
  //  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskService.updateTask(id, updateTaskDto);
    if (!task) {
      throw new HttpException(
        'No se pudo actualizar la tarea',
        HttpStatus.NOT_FOUND,
      );
    }
    return task;
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    const deleted = await this.taskService.deleteTask(id);
    if (!deleted) {
      throw new HttpException(
        'Tarea no encontrada o ya eliminada',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
