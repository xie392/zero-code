package com.code.zero.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import com.code.zero.constant.AppConstant;
import com.code.zero.core.AiCodeGeneratorFacade;
import com.code.zero.exception.BusinessException;
import com.code.zero.exception.ErrorCode;
import com.code.zero.exception.ThrowUtils;
import com.code.zero.model.dto.app.AppAddRequest;
import com.code.zero.model.dto.app.AppQueryRequest;
import com.code.zero.model.dto.app.AppUpdateByAdminRequest;
import com.code.zero.model.dto.app.AppUpdateRequest;
import com.code.zero.model.entity.User;
import com.code.zero.model.enums.CodeGenTypeEnum;
import com.code.zero.model.enums.UserRoleEnum;
import com.code.zero.model.vo.AppVO;
import com.code.zero.model.vo.UserVO;
import com.code.zero.service.UserService;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import com.code.zero.model.entity.App;
import com.code.zero.mapper.AppMapper;
import com.code.zero.service.AppService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import reactor.core.publisher.Flux;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 应用 服务层实现。
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Service
public class AppServiceImpl extends ServiceImpl<AppMapper, App> implements AppService {

    @Resource
    private UserService userService;

    @Resource
    private AiCodeGeneratorFacade aiCodeGeneratorFacade;

    @Override
    public long addApp(AppAddRequest appAddRequest, HttpServletRequest request) {
        // 1. 校验参数
        if (appAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String appName = appAddRequest.getAppName();
        String initPrompt = appAddRequest.getInitPrompt();
        if (StrUtil.hasBlank(appName, initPrompt)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "应用名称和初始化提示词不能为空");
        }

        // 2. 获取当前登录用户
        User loginUser = userService.getLoginUser(request);

        // 3. 创建应用对象
        App app = new App();
        BeanUtil.copyProperties(appAddRequest, app);
        app.setUserId(loginUser.getId());
//        app.setCreateTime(LocalDateTime.now());
//        app.setUpdateTime(LocalDateTime.now());
        // 暂时默认多文件模式
        app.setCodeGenType(CodeGenTypeEnum.MULTI_FILE.getValue());


        // 4. 校验应用参数
        validApp(app, true);

        // 5. 保存应用
        boolean result = this.save(app);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "创建应用失败");
        }
        return app.getId();
    }

    @Override
    public boolean deleteApp(long id, HttpServletRequest request) {
        // 1. 校验参数
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 2. 获取当前登录用户
        User loginUser = userService.getLoginUser(request);

        // 3. 判断应用是否存在
        App app = this.getById(id);
        ThrowUtils.throwIf(app == null, ErrorCode.NOT_FOUND_ERROR);

        // 4. 仅本人或管理员可删除
        if (!app.getUserId().equals(loginUser.getId()) && !UserRoleEnum.ADMIN.getValue().equals(loginUser.getUserRole())) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }

        // 5. 删除应用
        return this.removeById(id);
    }

    @Override
    public boolean deleteAppByAdmin(long id) {
        // 1. 校验参数
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 2. 判断应用是否存在
        App app = this.getById(id);
        if (app == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        // 3. 删除应用
        return this.removeById(id);
    }

    @Override
    public boolean updateApp(AppUpdateRequest appUpdateRequest, HttpServletRequest request) {
        // 1. 校验参数
        if (appUpdateRequest == null || appUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 2. 获取当前登录用户
        User loginUser = userService.getLoginUser(request);

        // 3. 判断应用是否存在
        long id = appUpdateRequest.getId();
        App oldApp = this.getById(id);
        ThrowUtils.throwIf(oldApp == null, ErrorCode.NOT_FOUND_ERROR);

        // 4. 仅本人或管理员可修改
        if (!oldApp.getUserId().equals(loginUser.getId()) && !UserRoleEnum.ADMIN.getValue().equals(loginUser.getUserRole())) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }

        // 5. 创建更新对象
        App updateApp = new App();
        BeanUtil.copyProperties(appUpdateRequest, updateApp);
        // 区分用户主动编辑和系统自动更新的时间
        updateApp.setEditTime(LocalDateTime.now());
        // 6. 校验应用参数
        validApp(updateApp, false);

        // 7. 更新应用
        return this.updateById(updateApp);
    }

    @Override
    public boolean updateAppByAdmin(AppUpdateByAdminRequest appUpdateByAdminRequest) {
        // 1. 校验参数
        if (appUpdateByAdminRequest == null || appUpdateByAdminRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 2. 判断应用是否存在
        long id = appUpdateByAdminRequest.getId();
        App oldApp = this.getById(id);
        if (oldApp == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        // 3. 创建更新对象
        App updateApp = new App();
        BeanUtil.copyProperties(appUpdateByAdminRequest, updateApp);
        updateApp.setUpdateTime(LocalDateTime.now());

        // 4. 校验应用参数
        validApp(updateApp, false);

        // 5. 更新应用
        return this.updateById(updateApp);
    }

    @Override
    public AppVO getAppVO(long id) {
        App app = this.getById(id);
        ThrowUtils.throwIf(app == null, ErrorCode.NOT_FOUND_ERROR);
        return getAppVO(app);
    }

    @Override
    public Page<AppVO> listAppVOByPage(AppQueryRequest appQueryRequest, HttpServletRequest request) {
        // 1. 获取当前登录用户
        User loginUser = userService.getLoginUser(request);

        // 2. 构建查询条件
        long current = appQueryRequest.getPageNum();
        long size = Math.min(appQueryRequest.getPageSize(), 20); // 限制每页最多20个
        
        // 3. 只查询当前用户的应用
        appQueryRequest.setUserId(loginUser.getId());
        QueryWrapper queryWrapper = getQueryWrapper(appQueryRequest);

        // 4. 分页查询
        Page<App> appPage = this.page(new Page<>(current, size), queryWrapper);

        // 5. 转换为 VO
        Page<AppVO> appVOPage = new Page<>(current, size, appPage.getTotalRow());
        List<AppVO> appVOList = getAppVOList(appPage.getRecords());
        appVOPage.setRecords(appVOList);

        return appVOPage;
    }

    @Override
    public Page<AppVO> listFeaturedAppVOByPage(AppQueryRequest appQueryRequest) {
        long current = appQueryRequest.getPageNum();
        long size = Math.min(appQueryRequest.getPageSize(), 20); // 限制每页最多20个

        // 构建查询条件 - 只查询精选应用（优先级大于0）
        QueryWrapper queryWrapper = getQueryWrapper(appQueryRequest);
        queryWrapper.gt("priority", AppConstant.DEFAULT_APP_PRIORITY);
        queryWrapper.orderBy("priority", false); // 按优先级降序排列

        // 分页查询
        Page<App> appPage = this.page(new Page<>(current, size), queryWrapper);

        // 转换为 VO
        Page<AppVO> appVOPage = new Page<>(current, size, appPage.getTotalRow());
        List<AppVO> appVOList = getAppVOList(appPage.getRecords());
        appVOPage.setRecords(appVOList);
        return appVOPage;
    }

    @Override
    public Page<AppVO> listAppVOByPageAdmin(AppQueryRequest appQueryRequest) {
        long current = appQueryRequest.getPageNum();
        long size = appQueryRequest.getPageSize();

        // 构建查询条件
        QueryWrapper queryWrapper = getQueryWrapper(appQueryRequest);

        // 分页查询
        Page<App> appPage = this.page(new Page<>(current, size), queryWrapper);

        // 转换为 VO
        Page<AppVO> appVOPage = new Page<>(current, size, appPage.getTotalRow());
        List<AppVO> appVOList = getAppVOList(appPage.getRecords());
        appVOPage.setRecords(appVOList);
        return appVOPage;
    }

    @Override
    public AppVO getAppVO(App app) {
        if (app == null) {
            return null;
        }
        AppVO appVO = new AppVO();
        BeanUtil.copyProperties(app, appVO);
        // 关联查询创建用户信息
        Long userId = app.getUserId();
        if (userId != null) {
            User user = userService.getById(userId);
            UserVO userVO = userService.getUserVO(user);
            appVO.setUser(userVO);
        }
        return appVO;
    }

    @Override
    public List<AppVO> getAppVOList(List<App> appList) {
        if (CollUtil.isEmpty(appList)) {
            return new ArrayList<>();
        }
        return appList.stream().map(this::getAppVO).collect(Collectors.toList());
    }

    @Override
    public QueryWrapper getQueryWrapper(AppQueryRequest appQueryRequest) {
        if (appQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        Long id = appQueryRequest.getId();
        String appName = appQueryRequest.getAppName();
        String cover = appQueryRequest.getCover();
        String initPrompt = appQueryRequest.getInitPrompt();
        String codeGenType = appQueryRequest.getCodeGenType();
        String deployKey = appQueryRequest.getDeployKey();
        Integer priority = appQueryRequest.getPriority();
        Long userId = appQueryRequest.getUserId();
        String sortField = appQueryRequest.getSortField();
        String sortOrder = appQueryRequest.getSortOrder();

        return QueryWrapper.create()
                .eq("id", id)
                .eq("userId", userId)
                .eq("codeGenType", codeGenType)
                .eq("deployKey", deployKey)
                .eq("priority", priority)
                .like("appName", appName)
                .like("cover", cover)
                .like("initPrompt", initPrompt)
                .orderBy(sortField, "ascend".equals(sortOrder));
    }

    @Override
    public void validApp(App app, boolean add) {
        if (app == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String appName = app.getAppName();
        String initPrompt = app.getInitPrompt();

        // 创建时，参数不能为空
        if (add) {
            if (StrUtil.hasBlank(appName, initPrompt)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "应用名称和初始化提示词不能为空");
            }
        }
        // 有参数则校验
        if (StrUtil.isNotBlank(appName) && appName.length() > 80) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "应用名称过长");
        }
        if (StrUtil.isNotBlank(initPrompt) && initPrompt.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "初始化提示词过长");
        }
    }

    @Override
    public Flux<String> chatToGenCode(Long appId, String message, User loginUser) {
        // 1. 参数校验
        ThrowUtils.throwIf(appId == null || appId <= 0, ErrorCode.PARAMS_ERROR, "应用 ID 不能为空");
        ThrowUtils.throwIf(StrUtil.isBlank(message), ErrorCode.PARAMS_ERROR, "用户消息不能为空");
        // 2. 查询应用信息
        App app = this.getById(appId);
        ThrowUtils.throwIf(app == null, ErrorCode.NOT_FOUND_ERROR, "应用不存在");
        // 3. 验证用户是否有权限访问该应用，仅本人可以生成代码
        if (!app.getUserId().equals(loginUser.getId())) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限访问该应用");
        }
        // 4. 获取应用的代码生成类型
        String codeGenTypeStr = app.getCodeGenType();
        CodeGenTypeEnum codeGenTypeEnum = CodeGenTypeEnum.getEnumByValue(codeGenTypeStr);
        if (codeGenTypeEnum == null) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "不支持的代码生成类型");
        }
        // 5. 调用 AI 生成代码
        return aiCodeGeneratorFacade.generateAndSaveCodeStream(message, codeGenTypeEnum, appId);
    }

    @Override
    public String deployApp(Long appId, User loginUser) {
        // 1. 参数校验
        ThrowUtils.throwIf(appId == null || appId <= 0, ErrorCode.PARAMS_ERROR, "应用 ID 不能为空");
        ThrowUtils.throwIf(loginUser == null, ErrorCode.NOT_LOGIN_ERROR, "用户未登录");
        // 2. 查询应用信息
        App app = this.getById(appId);
        ThrowUtils.throwIf(app == null, ErrorCode.NOT_FOUND_ERROR, "应用不存在");
        // 3. 验证用户是否有权限部署该应用，仅本人可以部署
        if (!app.getUserId().equals(loginUser.getId())) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限部署该应用");
        }
        // 4. 检查是否已有 deployKey
        String deployKey = app.getDeployKey();
        // 没有则生成 6 位 deployKey（大小写字母 + 数字）
        if (StrUtil.isBlank(deployKey)) {
            deployKey = RandomUtil.randomString(6);
        }
        // 5. 获取代码生成类型，构建源目录路径
        String codeGenType = app.getCodeGenType();
        String sourceDirName = codeGenType + "_" + appId;
        String sourceDirPath = AppConstant.CODE_OUTPUT_ROOT_DIR + File.separator + sourceDirName;
        // 6. 检查源目录是否存在
        File sourceDir = new File(sourceDirPath);
        if (!sourceDir.exists() || !sourceDir.isDirectory()) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "应用代码不存在，请先生成代码");
        }
        // 7. 复制文件到部署目录
        String deployDirPath = AppConstant.CODE_DEPLOY_ROOT_DIR + File.separator + deployKey;
        try {
            FileUtil.copyContent(sourceDir, new File(deployDirPath), true);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "部署失败：" + e.getMessage());
        }
        // 8. 更新应用的 deployKey 和部署时间
        App updateApp = new App();
        updateApp.setId(appId);
        updateApp.setDeployKey(deployKey);
        updateApp.setDeployedTime(LocalDateTime.now());
        boolean updateResult = this.updateById(updateApp);
        ThrowUtils.throwIf(!updateResult, ErrorCode.OPERATION_ERROR, "更新应用部署信息失败");
        // 9. 返回可访问的 URL
        return String.format("%s/%s/", AppConstant.CODE_DEPLOY_HOST, deployKey);
    }


}
