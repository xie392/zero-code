// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 创建用户 管理员创建用户接口 POST /user/add */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLong>('/user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 删除用户 管理员删除用户接口 DELETE /user/delete */
export async function deleteUser(body: API.DeleteRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>('/user/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 根据ID获取用户 管理员根据ID获取用户详细信息 GET /user/get/${param0} */
export async function getUserById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getUserByIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseUser>(`/user/get/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 根据ID获取用户VO 根据ID获取用户包装类信息 GET /user/get/vo/${param0} */
export async function getUserVoById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getUserVOByIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseUserVO>(`/user/get/vo/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 获取当前登录用户 获取当前登录用户信息 GET /user/getLoginUser */
export async function getLoginUser(options?: { [key: string]: any }) {
    return request<API.BaseResponseLoginUserVO>('/user/getLoginUser', {
        method: 'GET',
        ...(options || {})
    })
}

/** 分页获取用户封装列表 管理员分页获取用户封装列表 POST /user/list/page/vo */
export async function listUserVoByPage(body: API.UserQueryRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponsePageUserVO>('/user/list/page/vo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 用户登录 用户登录接口 POST /user/login */
export async function userLogin(body: API.UserLoginRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLoginUserVO>('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 用户注销 用户注销接口 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>('/user/logout', {
        method: 'POST',
        ...(options || {})
    })
}

/** 用户注册 用户注册接口 POST /user/register */
export async function register(body: API.UserRegisterRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLong>('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 更新用户 管理员更新用户信息接口 PUT /user/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>('/user/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 更新个人信息 用户更新个人信息接口 POST /user/update/my */
export async function updateMyUser(body: API.UserUpdateMyRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>('/user/update/my', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
