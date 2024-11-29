import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El mail ya esta en uso');
    }

    return this.userModel.create({ name, email, password });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    user.name = updateUserDto.name ?? user.name;
    user.email = updateUserDto.email ?? user.email;
    user.password = updateUserDto.password ?? user.password;

    await user.save();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userModel.findOne({ where: { id } });
    if (user) {
      await user.destroy();
      return true;
    }

    return false;
  }
}
