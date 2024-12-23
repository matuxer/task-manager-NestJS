import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/users.model';
import { PaginationResponse } from 'src/types/pagination-response.type';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, userId } = createTaskDto;

    const task = this.taskModel.create({ title, description, userId });
    return task;
  }

  async getAllTasks(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResponse<Task>> {
    if (isNaN(limit) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new HttpException(
        'Parámetros de paginación inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { count, rows } = await this.taskModel.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          required: true,
          attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    const next =
      page * limit < count ? `/tasks?page=${page + 1}&limit=${limit}` : null;
    const previous = page > 1 ? `/tasks?page=${page - 1}&limit=${limit}` : null;

    return {
      count,
      next,
      previous,
      results: rows,
    };
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          required: true,
          attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
        },
      ],
    });
    if (!task) {
      throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          required: true,
          attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    if (!task) {
      throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
    }

    task.title = updateTaskDto.title ?? task.title;
    task.description = updateTaskDto.description ?? task.description;
    task.completed = updateTaskDto.completed ?? task.completed;

    await task.save();
    return task;
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    const task = await this.taskModel.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
    }

    await task.destroy();
    return { message: `Tarea con ID ${id} eliminada correctamente` };
  }
}
