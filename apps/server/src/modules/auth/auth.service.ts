import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return { token };
  }
}
