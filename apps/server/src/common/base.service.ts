/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class BaseService<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get model() {
    const propertyName =
      this.modelName.charAt(0).toLowerCase() + this.modelName.slice(1);
    return (this.prisma as any)[propertyName];
  }

  /**
   * 分页查询
   */
  async findPage(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<{ items: T[]; total: number }> {
    const { skip, take, where, orderBy } = params;
    const [items, total] = await Promise.all([
      this.model.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      this.model.count({ where }),
    ]);
    return { items, total };
  }

  /**
   * 全量查询
   */
  async findAll(params?: { where?: any; orderBy?: any }): Promise<T[]> {
    return await this.model.findMany(params);
  }

  /**
   * 根据 ID 查询详情
   */
  async findOne(id: number): Promise<T> {
    const item = await this.model.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`${this.modelName} with id ${id} not found`);
    }
    return item;
  }

  /**
   * 创建
   */
  async create(data: CreateInput): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  /**
   * 修改
   */
  async update(id: number, data: UpdateInput): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`${this.modelName} with id ${id} not found`);
    }
  }

  /**
   * 批量修改
   */
  async updateBatch(
    ids: number[],
    data: UpdateInput,
  ): Promise<{ count: number }> {
    return await this.model.updateMany({
      where: { id: { in: ids } },
      data,
    });
  }

  /**
   * 物理删除
   */
  async remove(id: number): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`${this.modelName} with id ${id} not found`);
    }
  }

  /**
   * 批量物理删除
   */
  async removeBatch(ids: number[]): Promise<{ count: number }> {
    return await this.model.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
