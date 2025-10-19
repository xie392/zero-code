declare namespace API {
    type AppAddRequest = {
        /** 应用名称 */
        appName: string
        /** 应用初始化的 prompt */
        initPrompt: string
    }

    type AppDeployRequest = {
        /** 应用ID */
        appId: string
    }

    type AppUpdateByAdminRequest = {
        /** 应用ID */
        id: string
        /** 应用名称 */
        appName?: string
        /** 应用封面URL */
        cover?: string
        /** 优先级（数值越大优先级越高） */
        priority?: number
    }

    type AppUpdateRequest = {
        /** 应用ID */
        id: string
        /** 应用名称 */
        appName: string
    }

    type AppVO = {
        /** 应用ID */
        id?: string
        /** 应用名称 */
        appName?: string
        /** 应用封面URL */
        cover?: string
        /** 应用初始化的 prompt */
        initPrompt?: string
        /** 代码生成类型 */
        codeGenType?: string
        /** 部署标识 */
        deployKey?: string
        /** 部署时间 */
        deployedTime?: string
        /** 优先级（数值越大优先级越高） */
        priority?: number
        /** 创建用户ID */
        userId?: number
        /** 创建时间 */
        createTime?: string
        /** 更新时间 */
        updateTime?: string
        user?: UserVO
    }

    type BaseResponseAppVO = {
        code?: number
        data?: AppVO
        message?: string
    }

    type BaseResponseBoolean = {
        code?: number
        data?: boolean
        message?: string
    }

    type BaseResponseLoginUserVO = {
        code?: number
        data?: LoginUserVO
        message?: string
    }

    type BaseResponseLong = {
        code?: number
        data?: number
        message?: string
    }

    type BaseResponsePageAppVO = {
        code?: number
        data?: PageAppVO
        message?: string
    }

    type BaseResponsePageUserVO = {
        code?: number
        data?: PageUserVO
        message?: string
    }

    type BaseResponseString = {
        code?: number
        data?: string
        message?: string
    }

    type BaseResponseUser = {
        code?: number
        data?: User
        message?: string
    }

    type BaseResponseUserVO = {
        code?: number
        data?: UserVO
        message?: string
    }

    type chatToGenCodeParams = {
        /** 应用ID */
        appId: string
        /** 用户消息 */
        message: string
    }

    type deleteAppByAdminParams = {
        /** 应用ID */
        id: string
    }

    type deleteAppParams = {
        /** 应用ID */
        id: string
    }

    type DeleteRequest = {
        id?: string
    }

    type getAppParams = {
        /** 应用ID */
        id: string
    }

    type getAppsForAdminParams = {
        /** 页码 */
        pageNum?: number
        /** 每页大小 */
        pageSize?: number
        /** 应用名称（模糊搜索） */
        appName?: string
    }

    type getFeaturedAppsParams = {
        /** 页码 */
        pageNum?: number
        /** 每页大小 */
        pageSize?: number
        /** 应用名称（可选） */
        appName?: string
    }

    type getMyAppsParams = {
        /** 页码 */
        pageNum?: number
        /** 每页大小 */
        pageSize?: number
        /** 应用名称（可选） */
        appName?: string
    }

    type getUserByIdParams = {
        /** 用户ID */
        id: number
    }

    type getUserVOByIdParams = {
        /** 用户ID */
        id: number
    }

    type LoginUserVO = {
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

    type PageAppVO = {
        records?: AppVO[]
        pageNumber?: number
        pageSize?: number
        totalPage?: number
        totalRow?: number
        optimizeCountQuery?: boolean
    }

    type PageUserVO = {
        records?: UserVO[]
        pageNumber?: number
        pageSize?: number
        totalPage?: number
        totalRow?: number
        optimizeCountQuery?: boolean
    }

    type ServerSentEventString = true

    type serveStaticResourceParams = {
        /** 应用部署标识 */
        deployKey: string
    }

    type updateAppByAdminParams = {
        /** 应用ID */
        id: string
    }

    type updateAppParams = {
        /** 应用ID */
        id: string
    }

    type User = {
        id?: number
        userAccount?: string
        userPassword?: string
        userName?: string
        userAvatar?: string
        userProfile?: string
        userRole?: string
        editTime?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type UserAddRequest = {
        /** 用户昵称 */
        userName?: string
        /** 用户账号 */
        userAccount: string
        /** 用户头像URL */
        userAvatar?: string
        /** 用户简介 */
        userProfile?: string
        /** 用户角色 */
        userRole?: 'user' | 'admin'
    }

    type UserLoginRequest = {
        /** 用户账号 */
        userAccount: string
        /** 用户密码 */
        userPassword: string
    }

    type UserQueryRequest = {
        pageNum?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        /** 用户ID */
        id?: number
        /** 用户昵称 */
        userName?: string
        /** 用户账号 */
        userAccount?: string
        /** 用户简介 */
        userProfile?: string
        /** 用户角色 */
        userRole?: 'user' | 'admin' | 'ban'
    }

    type UserRegisterRequest = {
        /** 用户账号 */
        userAccount: string
        /** 用户密码 */
        userPassword: string
        /** 确认密码 */
        checkPassword: string
    }

    type UserUpdateMyRequest = {
        /** 用户昵称 */
        userName?: string
        /** 用户头像URL */
        userAvatar?: string
        /** 用户简介 */
        userProfile?: string
    }

    type UserUpdateRequest = {
        /** 用户ID */
        id: number
        /** 用户昵称 */
        userName?: string
        /** 用户头像URL */
        userAvatar?: string
        /** 用户简介 */
        userProfile?: string
        /** 用户角色 */
        userRole?: 'user' | 'admin'
    }

    type UserVO = {
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
    }
}
