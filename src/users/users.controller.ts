import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      if (error instanceof InternalServerErrorException) {
        throw new HttpException(
          'Error interno en el servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      console.error('Error al crear el usuario', error.message);
      throw new HttpException(
        'Error al crear el usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<User[]> {
    try {
      return this.userService.getAllUsers(page, limit);
    } catch (error) {
      console.error('Error al obtener los usuarios', error.message);
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = this.userService.updateUser(id, updateUserDto);
    if (!user) {
      throw new HttpException(
        'No se pudo actualizar el usuario',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const deleted = await this.userService.deleteUser(id);
    if (!deleted) {
      throw new HttpException(
        'Tarea no encontrada o ya eliminada',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
