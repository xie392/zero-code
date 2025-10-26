import { request } from '@/lib/http'

/**
 * 获取当前登录用户 获取当前登录用户信息
 * @param {API.UserLoginRequest} data 登录用户请求体
 * @returns 登录用户信息
 */
export async function loginUserApi(data: API.UserLoginRequest) {
  return request<API.Response<API.UserLoginUserVO>>({
    url: '/users/login',
    method: 'POST',
    data,
  })
}

/**
 * 获取当前登录用户 获取当前登录用户信息
 * @returns 当前登录用户信息
 */
export async function loginUserInfoApi() {
  return request<API.Response<API.UserLoginUserVO>>({
    url: '/users/me',
    method: 'GET',
  })
}
