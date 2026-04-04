/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export class PrismaQueryWrapper<T = any> {
  private where: any = {};
  private orderBy: any[] = [];

  /**
   * 等于 =
   */
  eq(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.where[column] = value;
    }
    return this;
  }

  /**
   * 不等于 <>
   */
  ne(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.where[column] = { not: value };
    }
    return this;
  }

  /**
   * 模糊查询 LIKE %value%
   */
  like(column: keyof T | string, value: string): this {
    if (value) {
      this.where[column] = { contains: value };
    }
    return this;
  }

  /**
   * 大于 >
   */
  gt(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.where[column] = { gt: value };
    }
    return this;
  }

  /**
   * 大于等于 >=
   */
  ge(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.where[column] = { gte: value };
    }
    return this;
  }

  /**
   * 小于 <
   */
  lt(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.where[column] = { lt: value };
    }
    return this;
  }

  /**
   * 小于等于 <=
   */
  le(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.where[column] = { lte: value };
    }
    return this;
  }

  /**
   * 包含 IN
   */
  in(column: keyof T | string, values: any[]): this {
    if (values && values.length > 0) {
      this.where[column] = { in: values };
    }
    return this;
  }

  /**
   * 排序
   */
  orderByAsc(column: keyof T | string): this {
    this.orderBy.push({ [column]: 'asc' });
    return this;
  }

  orderByDesc(column: keyof T | string): this {
    this.orderBy.push({ [column]: 'desc' });
    return this;
  }

  /**
   * 复合 OR 逻辑
   */
  or(callback: (wrapper: PrismaQueryWrapper<T>) => void): this {
    const subWrapper = new PrismaQueryWrapper<T>();
    callback(subWrapper);
    if (!this.where.OR) {
      this.where.OR = [];
    }
    this.where.OR.push(subWrapper.build().where);
    return this;
  }

  build() {
    return {
      where: this.where,
      orderBy: this.orderBy.length > 0 ? this.orderBy : undefined,
    };
  }
}
