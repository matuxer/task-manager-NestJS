import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationResponse } from 'src/types/pagination-response.type';

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
  async getAllTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse<Task>> {
    if (isNaN(limit) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new HttpException(
        'Parámetros de paginación inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.taskService.getAllTasks(page, limit);
    } catch (error) {
      console.error('Error al obtener la tareas', error.message);
      throw new HttpException(
        'Error al obtener las tareas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    try {
      return await this.taskService.getTaskById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Error al obtener la tarea',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    try {
      const task = await this.taskService.updateTask(id, updateTaskDto);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al actualizar la tarea',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
