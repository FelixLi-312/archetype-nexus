import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      console.log('UserService.create - data:', data);
      const existingUser = await this.findByUsername(data.username);
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }

      if (data.email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (existingEmail) {
          throw new ConflictException('邮箱已存在');
        }
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      console.log('UserService.create - success');
      return user;
    } catch (error) {
      console.error('UserService.create - error:', error);
      throw error;
    }
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
