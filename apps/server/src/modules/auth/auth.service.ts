import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(data: Prisma.UserCreateInput) {
    const user = await this.userService.create(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user;
    return result;
  }

  async login(username: string, password_raw: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password_raw, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, ...userInfo } = user;

    return { accessToken, user: userInfo };
  }

  logout() {
    return true;
  }
}
