import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationResponse } from 'src/types/pagination-response.type';
import { Task } from 'src/tasks/tasks.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

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
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResponse<User>> {
    if (isNaN(limit) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new HttpException(
        'Parámetros de paginación inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });

    const next =
      page * limit < count ? `/users?page=${page + 1}&limit=${limit}` : null;
    const previous = page > 1 ? `/users?page=${page - 1}&limit=${limit}` : null;

    return {
      count,
      next,
      previous,
      results: rows,
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
      include: [
        {
          model: Task,
          required: false,
        },
      ],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    user.name = updateUserDto.name ?? user.name;
    user.email = updateUserDto.email ?? user.email;

    await user.save();
    return user;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await user.destroy();
    return {
      message: `Usuario con ID ${id} eliminado correctamente`,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        `No se encontró un usuario con el email: ${email}`,
      );
    }

    return user;
  }
}
