import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  //  async createTask(title: string, description: string): Promise<Task> {
  //    return this.taskModel.create({ title, description });
  //  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    return this.taskModel.create({ title, description });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.findAll();
  }

  //  async getTaskById(id: string): Promise<Task> {
  //    return this.taskModel.findOne({ where: { id } });
  //  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`No se encontró la tarea con ID: ${id}`);
    }
    return task;
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
    const task = await this.getTaskById(id);

    task.title = updateTaskDto.title ?? task.title;
    task.description = updateTaskDto.description ?? task.description;
    task.completed = updateTaskDto.completed ?? task.completed;

    await task.save();
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await this.taskModel.findOne({ where: { id } });
    if (task) {
      await task.destroy();
      return true;
    }

    return false;
  }
}
