// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 创建应用 创建一个新的应用，需要提供应用名称和初始化提示 POST /api/v1/apps */
export async function createApp(body: API.AppAddRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseLong>('/api/v1/apps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取应用详情 根据应用ID获取应用的详细信息 GET /api/v1/apps/${param0} */
export async function getApp(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getAppParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseAppVO>(`/api/v1/apps/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 更新应用 更新指定应用的信息，只能更新自己创建的应用 PUT /api/v1/apps/${param0} */
export async function updateApp(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.updateAppParams,
    body: API.AppUpdateRequest,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseBoolean>(`/api/v1/apps/${param0}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}

/** 删除应用 删除指定的应用，只能删除自己创建的应用 DELETE /api/v1/apps/${param0} */
export async function deleteApp(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.deleteAppParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseBoolean>(`/api/v1/apps/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 管理员更新应用 管理员更新指定应用信息，需要管理员权限 PUT /api/v1/apps/${param0}/admin */
export async function updateAppByAdmin(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.updateAppByAdminParams,
    body: API.AppUpdateByAdminRequest,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseBoolean>(`/api/v1/apps/${param0}/admin`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}

/** 管理员删除应用 管理员删除指定应用，需要管理员权限 DELETE /api/v1/apps/${param0}/admin */
export async function deleteAppByAdmin(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.deleteAppByAdminParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseBoolean>(`/api/v1/apps/${param0}/admin`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 管理员获取应用列表 管理员分页获取所有应用列表，需要管理员权限 GET /api/v1/apps/admin */
export async function getAppsForAdmin(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getAppsForAdminParams,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponsePageAppVO>('/api/v1/apps/admin', {
        method: 'GET',
        params: {
            // pageNum has a default value: 1
            pageNum: '1',
            // pageSize has a default value: 10
            pageSize: '10',
            ...params
        },
        ...(options || {})
    })
}

/** 获取精选应用列表 分页获取公开的精选应用列表，支持按应用名称搜索 GET /api/v1/apps/featured */
export async function getFeaturedApps(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getFeaturedAppsParams,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponsePageAppVO>('/api/v1/apps/featured', {
        method: 'GET',
        params: {
            // pageNum has a default value: 1
            pageNum: '1',
            // pageSize has a default value: 10
            pageSize: '10',
            ...params
        },
        ...(options || {})
    })
}

/** 获取我的应用列表 分页获取当前用户创建的应用列表，支持按应用名称搜索 GET /api/v1/apps/my */
export async function getMyApps(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getMyAppsParams,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponsePageAppVO>('/api/v1/apps/my', {
        method: 'GET',
        params: {
            // pageNum has a default value: 1
            pageNum: '1',
            // pageSize has a default value: 10
            pageSize: '10',
            ...params
        },
        ...(options || {})
    })
}
