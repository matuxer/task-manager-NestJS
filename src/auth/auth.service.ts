import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthResponse } from 'src/types/authentication-response.type';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user.toJSON();
    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse<User>> {
    const { email, password } = loginUserDto;

    const user = await this.validateUser(email, password);

    return {
      message: 'Inicio de sesión exitoso',
      user,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse<User>> {
    const user = await this.usersService.createUser(createUserDto);

    return {
      message: 'Registro de usuario exitoso',
      user,
    };
  }
}
