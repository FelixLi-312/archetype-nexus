import { DynamicModule, Module } from '@nestjs/common';
import { CreateCrudService, CreateCrudController } from './crud.factory';

@Module({})
export class CrudModule {
  /**
   * Generates a dynamic module with a generic service and controller for a given model.
   * @param modelName The Prisma model name (e.g., 'user')
   * @param options Configuration for path and tag
   */
  static forFeature<T, CreateInput, UpdateInput>(
    modelName: string,
    options?: {
      path?: string;
      tag?: string;
    },
  ): DynamicModule {
    const path = options?.path || modelName.toLowerCase();
    const tag = options?.tag || modelName;

    const ServiceClass = CreateCrudService<T, CreateInput, UpdateInput>(
      modelName,
    );
    const ControllerClass = CreateCrudController<T, CreateInput, UpdateInput>(
      path,
      ServiceClass,
      tag,
    );

    return {
      module: CrudModule,
      providers: [ServiceClass],
      controllers: [ControllerClass],
      exports: [ServiceClass],
    };
  }
}
