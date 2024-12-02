import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResponse } from 'src/types/pagination-response.type';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse<User>> {
    return await this.userService.getAllUsers(page, limit);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      console.error('Error al obtener el usuario', error.message);
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userService.updateUser(id, updateUserDto);
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        throw new HttpException(
          'Usuario no encontrado o ya eliminado',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: `Usuario con ID ${id} eliminado correctamente` };
    } catch (error) {
      console.error('Error al intentar eliminar el usuario:', error.message);
      throw new HttpException(
        'Error interno al eliminar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
