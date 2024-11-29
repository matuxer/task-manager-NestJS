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
      console.error('Error al crear el usuario', error.message);

      throw new HttpException(
        'Error al crear el usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
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
