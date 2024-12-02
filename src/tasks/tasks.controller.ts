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

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Get()
  async getAllTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse<Task>> {
    return await this.taskService.getAllTasks(page, limit);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getTaskById(id);
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
  async deleteTask(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deleted = await this.taskService.deleteTask(id);
      if (!deleted) {
        throw new HttpException(
          'Tarea no encontrado o ya eliminado',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: `Tarea con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Error al eliminar la tarea',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
