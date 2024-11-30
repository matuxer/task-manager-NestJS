import {
  Injectable,
  InternalServerErrorException,
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

  //  async createTask(title: string, description: string): Promise<Task> {
  //    return this.taskModel.create({ title, description });
  //  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, userId } = createTaskDto;
    try {
      const task = this.taskModel.create({ title, description, userId });
      return task;
    } catch (error) {
      console.error('Error al crear la tarea:', error.message);
      throw new Error('Error al crear la tarea');
    }
  }

  async getAllTasks(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResponse<Task>> {
    try {
      const { count, rows } = await this.taskModel.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        include: [
          {
            model: User,
            required: true,
            attributes: { exclude: ['password'] },
          },
        ],
      });

      const next =
        page * limit < count ? `/tasks?page=${page + 1}&limit=${limit}` : null;
      const previous =
        page > 1 ? `/tasks?page=${page - 1}&limit=${limit}` : null;

      return {
        count,
        next,
        previous,
        results: rows,
      };
    } catch (error) {
      console.error('Error al obtener las tareas:', error.message);
      throw new Error('No se pudieron obtener la tareas');
    }
  }

  //  async getTaskById(id: string): Promise<Task> {
  //    return this.taskModel.findOne({ where: { id } });
  //  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskModel.findOne({
        where: { id },
        include: [
          {
            model: User,
            required: true,
            attributes: { exclude: ['password'] },
          },
        ],
      });
      if (!task) {
        throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
      }
      return task;
    } catch (error) {
      console.error('Error al obtener la tarea:', error.message);
      throw new InternalServerErrorException('Error al obtener la tarea');
    }
  }

  //  async updateTask(
  //    id: string,
  //    title: string,
  //    description: string,
  //    completed: boolean,
  //  ): Promise<Task> {
  //    const task = await this.taskModel.findOne({ where: { id } });
  //    if (task) {
  //      task.title = title;
  //      task.description = description;
  //      task.completed = completed;
  //      await task.save();
  //      return task;
  //    }
  //    return null;
  //  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.getTaskById(id);

      if (!task) {
        throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
      }

      task.title = updateTaskDto.title ?? task.title;
      task.description = updateTaskDto.description ?? task.description;
      task.completed = updateTaskDto.completed ?? task.completed;

      await task.save();
      return task;
    } catch (error) {
      console.error('Error al actualizar la tarea:', error.message);
      throw new InternalServerErrorException('Error al actualizar la tarea');
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const task = await this.taskModel.findOne({ where: { id } });

      if (!task) {
        throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
      }

      await task.destroy();
      return true;
    } catch (error) {
      console.error('Error al eliminar la tarea:', error.message);
      throw new InternalServerErrorException('No se pudo eliminar la tarea');
    }
  }
}
