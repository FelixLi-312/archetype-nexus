import { BaseApi, logout as baseLogout, type User } from '@nexus/api';

/**
 * 登录返回类型
 */
export interface LoginResponse {
  accessToken: string;
  user: User;
}

/**
 * 扩展 UserApi 以包含特定的业务逻辑
 */
class ExtendedUserApi extends BaseApi<User, any, any> {
  constructor() {
    super('user');
  }

  /**
   * 注册
   */
  register(data: any): Promise<User> {
    return this.request.post('/auth/register', data);
  }

  /**
   * 登录
   */
  async login(data: any): Promise<LoginResponse> {
    const res = await this.request.post<any>('/auth/login', data);
    return {
      accessToken: res.accessToken,
      user: res.user || {}
    };
  }

  /**
   * 获取当前用户信息
   */
  getInfo(): Promise<User> {
    // 这里的 getProfile 是 baseUserApi 独有的，但我们现在是在扩展 BaseApi
    // 如果要用 getProfile，我们可以直接调用 get
    return this.request.get('/user/profile');
  }

  /**
   * 登出
   */
  async logout(): Promise<any> {
    baseLogout();
    return Promise.resolve();
  }
}

// 导出单例
export const userApi = new ExtendedUserApi();

// 导出类型
export type { User };

// 为了兼容之前的用法
export const getUserInfoApi = (id: number) => userApi.findOne(id);
export const updateUserInfoApi = (id: number, data: any) => userApi.update(id, data);
