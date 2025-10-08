package com.code.zero.controller;

import com.code.zero.annotation.AuthCheck;
import com.code.zero.common.BaseResponse;
import com.code.zero.common.ResultUtils;
import com.code.zero.exception.BusinessException;
import com.code.zero.exception.ErrorCode;
import com.code.zero.exception.ThrowUtils;
import com.code.zero.model.dto.app.AppAddRequest;
import com.code.zero.model.dto.app.AppQueryRequest;
import com.code.zero.model.dto.app.AppUpdateByAdminRequest;
import com.code.zero.model.dto.app.AppUpdateRequest;
import com.code.zero.model.vo.AppVO;
import com.mybatisflex.core.paginate.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.code.zero.service.AppService;
import jakarta.servlet.http.HttpServletRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 应用 控制层 - RESTful API 设计
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Tag(name = "应用管理", description = "应用相关的增删改查操作")
@RestController
@RequestMapping("/api/v1/apps")
public class AppController {

    @Autowired
    private AppService appService;

    // region CRUD Operations

    /**
     * 创建应用
     *
     * @param appAddRequest 创建应用请求
     * @param request       请求对象
     * @return 新应用 id
     */
    @Operation(summary = "创建应用", description = "创建一个新的应用，需要提供应用名称和初始化提示")
    @PostMapping
    public BaseResponse<Long> createApp(@RequestBody AppAddRequest appAddRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(appAddRequest == null, ErrorCode.PARAMS_ERROR);
        Long newAppId = appService.addApp(appAddRequest, request);
        return ResultUtils.success(newAppId);
    }

    /**
     * 根据 id 获取应用详情
     *
     * @param id 应用 id
     * @return 应用详情
     */
    @Operation(summary = "获取应用详情", description = "根据应用ID获取应用的详细信息")
    @GetMapping("/{id}")
    public BaseResponse<AppVO> getApp(@Parameter(description = "应用ID", required = true, example = "1") @PathVariable Long id) {
        ThrowUtils.throwIf(id == null || id <= 0, ErrorCode.PARAMS_ERROR);
        // 查询应用详情
        AppVO appVO = appService.getAppVO(id);
        // 检查应用是否存在
        ThrowUtils.throwIf(appVO == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(appVO);
    }

    /**
     * 更新应用（仅本人）
     *
     * @param id               应用 id
     * @param appUpdateRequest 更新应用请求
     * @param request          请求对象
     * @return 是否更新成功
     */
    @Operation(summary = "更新应用", description = "更新指定应用的信息，只能更新自己创建的应用")
    @PutMapping("/{id}")
    public BaseResponse<Boolean> updateApp(@Parameter(description = "应用ID", required = true, example = "1") @PathVariable Long id,
                                          @RequestBody AppUpdateRequest appUpdateRequest,
                                          HttpServletRequest request) {
        if (appUpdateRequest == null || id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        appUpdateRequest.setId(id);
        boolean result = appService.updateApp(appUpdateRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 删除应用
     *
     * @param id      应用 id
     * @param request 请求对象
     * @return 是否删除成功
     */
    @Operation(summary = "删除应用", description = "删除指定的应用，只能删除自己创建的应用")
    @DeleteMapping("/{id}")
    public BaseResponse<Boolean> deleteApp(@Parameter(description = "应用ID", required = true, example = "1") @PathVariable Long id,
                                          HttpServletRequest request) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = appService.deleteApp(id, request);
        return ResultUtils.success(result);
    }

    // region Query Operations

    /**
     * 分页获取应用列表（仅本人）
     *
     * @param pageNum  页码
     * @param pageSize 页面大小
     * @param appName  应用名称（可选）
     * @param request  请求对象
     * @return 应用列表
     */
    @Operation(summary = "获取我的应用列表", description = "分页获取当前用户创建的应用列表，支持按应用名称搜索")
    @GetMapping("/my")
    public BaseResponse<Page<AppVO>> getMyApps(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") int pageNum,
            @Parameter(description = "每页大小", example = "10") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "应用名称（可选）", example = "我的助手") @RequestParam(required = false) String appName,
            HttpServletRequest request) {
        AppQueryRequest appQueryRequest = new AppQueryRequest();
        appQueryRequest.setPageNum(pageNum);
        appQueryRequest.setPageSize(pageSize);
        appQueryRequest.setAppName(appName);
        
        Page<AppVO> appVOPage = appService.listAppVOByPage(appQueryRequest, request);
        return ResultUtils.success(appVOPage);
    }

    /**
     * 分页获取精选应用列表（公开）
     *
     * @param pageNum  页码
     * @param pageSize 页面大小
     * @param appName  应用名称（可选）
     * @return 精选应用列表
     */
    @Operation(summary = "获取精选应用列表", description = "分页获取公开的精选应用列表，支持按应用名称搜索")
    @GetMapping("/featured")
    public BaseResponse<Page<AppVO>> getFeaturedApps(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") int pageNum,
            @Parameter(description = "每页大小", example = "10") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "应用名称（可选）", example = "智能助手") @RequestParam(required = false) String appName) {
        
        AppQueryRequest appQueryRequest = new AppQueryRequest();
        appQueryRequest.setPageNum(pageNum);
        appQueryRequest.setPageSize(pageSize);
        appQueryRequest.setAppName(appName);
        
        Page<AppVO> appVOPage = appService.listFeaturedAppVOByPage(appQueryRequest);
        return ResultUtils.success(appVOPage);
    }

    // endregion

    // region Admin Operations

    /**
     * 删除应用（管理员）
     *
     * @param id 应用 id
     * @return 是否删除成功
     */
    @Operation(summary = "管理员删除应用", description = "管理员删除指定应用，需要管理员权限")
    @DeleteMapping("/{id}/admin")
    @AuthCheck(mustRole = "admin")
    public BaseResponse<Boolean> deleteAppByAdmin(@Parameter(description = "应用ID", required = true, example = "1") @PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = appService.deleteAppByAdmin(id);
        return ResultUtils.success(result);
    }

    /**
     * 更新应用（管理员）
     *
     * @param id                      应用 id
     * @param appUpdateByAdminRequest 管理员更新应用请求
     * @return 是否更新成功
     */
    @Operation(summary = "管理员更新应用", description = "管理员更新指定应用信息，需要管理员权限")
    @PutMapping("/{id}/admin")
    @AuthCheck(mustRole = "admin")
    public BaseResponse<Boolean> updateAppByAdmin(@Parameter(description = "应用ID", required = true, example = "1") @PathVariable Long id,
                                                  @Parameter(description = "管理员更新应用请求体", required = true) @RequestBody AppUpdateByAdminRequest appUpdateByAdminRequest) {
        if (id == null || id <= 0 || appUpdateByAdminRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        appUpdateByAdminRequest.setId(id);
        boolean result = appService.updateAppByAdmin(appUpdateByAdminRequest);
        return ResultUtils.success(result);
    }

    /**
     * 分页获取应用列表（管理员）
     *
     * @param pageNum  页码
     * @param pageSize 页面大小
     * @param appName  应用名称（可选）
     * @return 应用列表
     */
    @Operation(summary = "管理员获取应用列表", description = "管理员分页获取所有应用列表，需要管理员权限")
    @GetMapping("/admin")
    @AuthCheck(mustRole = "admin")
    public BaseResponse<Page<AppVO>> getAppsForAdmin(@Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
                                                     @Parameter(description = "每页大小", example = "10") @RequestParam(defaultValue = "10") Integer pageSize,
                                                     @Parameter(description = "应用名称（模糊搜索）", required = false) @RequestParam(required = false) String appName) {
        AppQueryRequest appQueryRequest = new AppQueryRequest();
        appQueryRequest.setPageNum(pageNum);
        appQueryRequest.setPageSize(pageSize);
        appQueryRequest.setAppName(appName);
        
        Page<AppVO> appVOPage = appService.listAppVOByPageAdmin(appQueryRequest);
        return ResultUtils.success(appVOPage);
    }

    // endregion
}
