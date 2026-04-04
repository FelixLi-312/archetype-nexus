import { BaseApi } from './base.api' 
import type { User } from '../types/user' 

class UserApi extends BaseApi<User, Partial<User>, Partial<User>> { 
  constructor() { 
    super('user') 
  } 

  getProfile() { 
    return this.request.get<User>('/user/profile') 
  } 
} 

export const userApi = new UserApi() 
