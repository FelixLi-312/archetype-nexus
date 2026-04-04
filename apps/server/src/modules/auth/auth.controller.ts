import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;
}

export class RegisterDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  nickname?: string;

  @ApiProperty({ required: false })
  avatar?: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  logout() {
    return this.authService.logout();
  }
}
