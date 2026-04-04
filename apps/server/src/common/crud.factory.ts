import { Injectable, Controller, Type, Inject } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';

/**
 * Creates a generic CRUD service class for a given Prisma model name.
 * @param modelName The name of the Prisma model (e.g., 'user')
 */
export function CreateCrudService<T, CreateInput, UpdateInput>(
  modelName: string,
): Type<BaseService<T, CreateInput, UpdateInput>> {
  @Injectable()
  class CrudService extends BaseService<T, CreateInput, UpdateInput> {
    constructor(prisma: PrismaService) {
      super(prisma, modelName);
    }
  }

  // Define name for better debugging and NestJS identification
  Object.defineProperty(CrudService, 'name', { value: `${modelName}Service` });

  return CrudService;
}

/**
 * Creates a generic CRUD controller class for a given path and service class.
 * @param path The route path for this controller (e.g., 'users')
 * @param serviceType The service class to inject
 */
export function CreateCrudController<T, CreateInput, UpdateInput>(
  path: string,
  serviceType: Type<BaseService<T, CreateInput, UpdateInput>>,
  tagName?: string,
): Type<BaseController<T, CreateInput, UpdateInput>> {
  @ApiTags(tagName || path)
  @Controller(path)
  class CrudController extends BaseController<T, CreateInput, UpdateInput> {
    constructor(@Inject(serviceType) service: any) {
      super(service);
    }
  }

  // Define constructor manually to satisfy NestJS DI
  Object.defineProperty(CrudController, 'name', { value: `${path}Controller` });

  return CrudController;
}
