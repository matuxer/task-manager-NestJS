import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async createTask(title: string, description: string): Promise<Task> {
    return this.taskModel.create({ title, description });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.findAll();
  }

  async getTaskById(id: string): Promise<Task> {
    return this.taskModel.findOne({ where: { id } });
  }

  async updateTask(
    id: string,
    title: string,
    description: string,
    completed: boolean,
  ): Promise<Task> {
    const task = await this.taskModel.findOne({ where: { id } });
    if (task) {
      task.title = title;
      task.description = description;
      task.completed = completed;
      await task.save();
      return task;
    }

    return null;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskModel.findOne({ where: { id } });
    if (task) {
      await task.destroy();
    }
  }
}
