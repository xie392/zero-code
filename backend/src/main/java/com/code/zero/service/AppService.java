package com.code.zero.service;

import com.code.zero.model.dto.app.AppAddRequest;
import com.code.zero.model.dto.app.AppQueryRequest;
import com.code.zero.model.dto.app.AppUpdateByAdminRequest;
import com.code.zero.model.dto.app.AppUpdateRequest;
import com.code.zero.model.vo.AppVO;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.service.IService;
import com.code.zero.model.entity.App;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

/**
 * 应用 服务层。
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
public interface AppService extends IService<App> {

    /**
     * 创建应用
     *
     * @param appAddRequest 创建应用请求
     * @param request       请求对象
     * @return 新应用 id
     */
    long addApp(AppAddRequest appAddRequest, HttpServletRequest request);

    /**
     * 删除应用（用户）
     *
     * @param id      应用 id
     * @param request 请求对象
     * @return 是否删除成功
     */
    boolean deleteApp(long id, HttpServletRequest request);

    /**
     * 删除应用（管理员）
     *
     * @param id 应用 id
     * @return 是否删除成功
     */
    boolean deleteAppByAdmin(long id);

    /**
     * 更新应用（用户）
     *
     * @param appUpdateRequest 更新应用请求
     * @param request          请求对象
     * @return 是否更新成功
     */
    boolean updateApp(AppUpdateRequest appUpdateRequest, HttpServletRequest request);

    /**
     * 更新应用（管理员）
     *
     * @param appUpdateByAdminRequest 管理员更新应用请求
     * @return 是否更新成功
     */
    boolean updateAppByAdmin(AppUpdateByAdminRequest appUpdateByAdminRequest);

    /**
     * 根据 id 获取应用详情
     *
     * @param id 应用 id
     * @return 应用详情
     */
    AppVO getAppVO(long id);

    /**
     * 分页获取应用列表（用户）
     *
     * @param appQueryRequest 查询请求
     * @param request         请求对象
     * @return 应用列表
     */
    Page<AppVO> listAppVOByPage(AppQueryRequest appQueryRequest, HttpServletRequest request);

    /**
     * 分页获取精选应用列表
     *
     * @param appQueryRequest 查询请求
     * @return 精选应用列表
     */
    Page<AppVO> listFeaturedAppVOByPage(AppQueryRequest appQueryRequest);

    /**
     * 分页获取应用列表（管理员）
     *
     * @param appQueryRequest 查询请求
     * @return 应用列表
     */
    Page<AppVO> listAppVOByPageAdmin(AppQueryRequest appQueryRequest);

    /**
     * 获取脱敏的应用信息
     *
     * @param app 应用
     * @return 脱敏后的应用信息
     */
    AppVO getAppVO(App app);

    /**
     * 获取脱敏的应用信息列表
     *
     * @param appList 应用列表
     * @return 脱敏后的应用信息列表
     */
    List<AppVO> getAppVOList(List<App> appList);

    /**
     * 获取查询包装器
     *
     * @param appQueryRequest 应用查询请求
     * @return 查询包装器
     */
    QueryWrapper getQueryWrapper(AppQueryRequest appQueryRequest);

    /**
     * 校验应用参数
     *
     * @param app 应用
     * @param add 是否为创建校验
     */
    void validApp(App app, boolean add);
}
