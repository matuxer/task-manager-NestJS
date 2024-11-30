import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    try {
      const existingUser = await this.userModel.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('El mail ya esta en uso');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      user.setDataValue('password', undefined);

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        console.error('Error al crear el usuario:', error);
        throw new InternalServerErrorException(
          'Error al procesar la solicitud. Intentelo de nuevo más tarde.',
        );
      }
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<User[]> {
    try {
      return this.userModel.findAll({
        limit,
        offset: (page - 1) * limit,
      });
    } catch (error) {
      throw new Error('Error al obtener los usuarios: ' + error.message);
    }
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
