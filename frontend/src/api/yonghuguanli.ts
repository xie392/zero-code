// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页获取用户封装列表 管理员分页获取用户封装列表 GET /users */
export async function listUserVoByPage(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.listUserVOByPageParams,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponsePageUserVO>('/users', {
        method: 'GET',
        params: {
            ...params,
            userQueryRequest: undefined,
            ...params['userQueryRequest']
        },
        ...(options || {})
    })
}

/** 用户注册 用户注册接口 POST /users */
export async function register(body: API.UserRegisterRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLong>('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 根据ID获取用户 管理员根据ID获取用户详细信息 GET /users/${param0} */
export async function getUserById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getUserByIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseUser>(`/users/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 更新用户 管理员更新用户信息接口 PUT /users/${param0} */
export async function updateUser(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.updateUserParams,
    body: API.UserUpdateRequest,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseBoolean>(`/users/${param0}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}

/** 删除用户 管理员删除用户接口 DELETE /users/${param0} */
export async function deleteUser(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.deleteUserParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseBoolean>(`/users/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 根据ID获取用户VO 根据ID获取用户包装类信息 GET /users/${param0}/vo */
export async function getUserVoById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getUserVOByIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseUserVO>(`/users/${param0}/vo`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 创建用户 管理员创建用户接口 POST /users/admin */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLong>('/users/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 用户登录 用户登录接口 POST /users/login */
export async function userLogin(body: API.UserLoginRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLoginUserVO>('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 用户注销 用户注销接口 POST /users/logout */
export async function userLogout(options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>('/users/logout', {
        method: 'POST',
        ...(options || {})
    })
}

/** 获取当前登录用户 获取当前登录用户信息 GET /users/me */
export async function getLoginUser(options?: { [key: string]: any }) {
    return request<API.BaseResponseLoginUserVO>('/users/me', {
        method: 'GET',
        ...(options || {})
    })
}

/** 更新个人信息 用户更新个人信息接口 PUT /users/me */
export async function updateMyUser(body: API.UserUpdateMyRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>('/users/me', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
