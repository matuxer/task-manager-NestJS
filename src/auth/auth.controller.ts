import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthResponse } from 'src/types/authentication-response.type';
import { User } from 'src/users/users.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse<User>> {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponse<User>> {
    return await this.authService.register(createUserDto);
  }
}
