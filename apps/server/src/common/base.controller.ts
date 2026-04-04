/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PrismaQueryWrapper } from './prisma-query.wrapper';

export class BaseController<T, CreateInput, UpdateInput> {
  constructor(protected readonly service: any) {}

  @Post()
  @ApiOperation({ summary: 'Create a new record' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  create(@Body() createDto: CreateInput): Promise<T> {
    return this.service.create(createDto);
  }

  @Get('page')
  @ApiOperation({ summary: 'Get records with pagination' })
  findPage(
    @Query('current', new ParseIntPipe({ optional: true })) current = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('keyword') keyword?: string,
  ): Promise<{ items: T[]; total: number }> {
    const skip = (current - 1) * pageSize;
    const take = pageSize;

    // 使用 QueryWrapper 构建动态查询逻辑
    const wrapper = new PrismaQueryWrapper<T>();
    if (keyword) {
      wrapper.or((q) => {
        // 尝试匹配通用字段（根据业务扩展）
        q.like('title' as keyof T, keyword);
        q.like('name' as keyof T, keyword);
        q.like('username' as keyof T, keyword);
      });
    }
    wrapper.orderByDesc('createdAt' as keyof T);

    const query = wrapper.build();
    return this.service.findPage({
      skip,
      take,
      where: query.where,
      orderBy: query.orderBy as any,
    }) as Promise<{ items: T[]; total: number }>;
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all records without pagination' })
  findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get record by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return this.service.findOne(id);
  }

  @Patch('batch')
  @ApiOperation({ summary: 'Update records in batch' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'number' } },
        data: { type: 'object' },
      },
    },
  })
  updateBatch(@Body() body: { ids: number[]; data: UpdateInput }) {
    return this.service.updateBatch(body.ids, body.data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update record by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateInput,
  ): Promise<T> {
    return this.service.update(id, updateDto);
  }

  @Delete('batch')
  @ApiOperation({ summary: 'Delete records in batch' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { ids: { type: 'array', items: { type: 'number' } } },
    },
  })
  removeBatch(@Body() body: { ids: number[] }) {
    return this.service.removeBatch(body.ids);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete record by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return this.service.remove(id);
  }
}
