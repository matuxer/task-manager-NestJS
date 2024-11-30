import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationResponse } from 'src/types/pagination-response.type';

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

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResponse<User>> {
    try {
      //return this.userModel.findAll({
      //  limit,
      //  offset: (page - 1) * limit,
      //});

      const { count, rows } = await this.userModel.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
      });

      const next =
        page * limit < count ? `/users?page=${page + 1}&limit=${limit}` : null;
      const previous =
        page > 1 ? `/users?page=${page - 1}&limit=${limit}` : null;

      return {
        count,
        next,
        previous,
        results: rows,
      };
    } catch (error) {
      throw new Error('Error al obtener los usuarios: ' + error.message);
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.getUserById(id);

      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.password) {
        user.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      user.name = updateUserDto.name ?? user.name;
      user.email = updateUserDto.email ?? user.email;

      await user.save();
      return user;
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el usuario: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ where: { id } });
      if (!user) {
        throw new Error('Usuario no econtrado');
      }

      await user.destroy();
      return true;
    } catch (error) {
      throw new Error(
        'Error al intentar eliminar al usuario: ' + error.message,
      );
    }
  }
}
