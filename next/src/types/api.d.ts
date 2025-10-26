declare namespace API {
  /**
   * 响应体
   */
  interface Response<T = any> {
    code: number
    data: T
    message: string
  }

  /**
   * 登录用户信息
   */
  interface UserLoginUserVO {
    /** 用户ID */
    id?: number
    /** 用户账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin'
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  }

  /**
   * 登录用户请求体
   */
  interface UserLoginRequest {
    /** 用户账号 */
    userAccount: string
    /** 用户密码 */
    userPassword: string
  }
}
