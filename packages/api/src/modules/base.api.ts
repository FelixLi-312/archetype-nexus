import { request, type RequestInstance } from '../core/request' 

export class BaseApi<T, CreateDto, UpdateDto> { 
  protected request: RequestInstance 
  protected resource: string 

  constructor(resource: string, req: RequestInstance = request) { 
    this.resource = resource 
    this.request = req 
  } 

  create(data: CreateDto): Promise<T> { 
    return this.request.post(`/${this.resource}`, data) 
  } 

  findPage(params: any): Promise<{ items: T[]; total: number }> { 
    return this.request.get(`/${this.resource}/page`, { params }) 
  } 

  findAll(): Promise<T[]> { 
    return this.request.get(`/${this.resource}/list`) 
  } 

  findOne(id: number | string): Promise<T> { 
    return this.request.get(`/${this.resource}/${id}`) 
  } 

  update(id: number | string, data: UpdateDto): Promise<T> { 
    return this.request.patch(`/${this.resource}/${id}`, data) 
  } 

  remove(id: number | string) { 
    return this.request.delete(`/${this.resource}/${id}`) 
  } 
} 
