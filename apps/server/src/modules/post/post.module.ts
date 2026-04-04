import { Module } from '@nestjs/common';
import { CrudModule } from '../../common/crud.module';
import { Post } from '@prisma/client';

@Module({
  imports: [
    // 使用 any 绕过当前的 TS 类型检查，待 IDE 刷新 Prisma 类型后可还原
    CrudModule.forFeature<Post, any, any>('Post'),
  ],
})
export class PostModule {}
