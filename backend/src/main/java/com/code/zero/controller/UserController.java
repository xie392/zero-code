package com.code.zero.controller;

import cn.hutool.core.bean.BeanUtil;
import com.code.zero.annotation.AuthCheck;
import com.code.zero.common.BaseResponse;
import com.code.zero.common.DeleteRequest;
import com.code.zero.common.ResultUtils;
import com.code.zero.constant.UserConstant;
import com.code.zero.exception.BusinessException;
import com.code.zero.exception.ErrorCode;
import com.code.zero.exception.ThrowUtils;
import com.code.zero.model.dto.user.*;
import com.code.zero.model.vo.LoginUserVO;
import com.code.zero.model.vo.UserVO;
import com.mybatisflex.core.paginate.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.code.zero.model.entity.User;
import com.code.zero.service.UserService;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * 用户 控制层。
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Tag(name = "用户管理", description = "用户相关的注册、登录、注销和管理操作")
@RestController
@RequestMapping("/users")
public class UserController {

    @Resource
    private UserService userService;

    /**
     * 注册用户 - RESTful: POST /users
     *
     * @param userRegisterRequest 用户注册请求参数
     * @return 用户主键
     */
    @Operation(summary = "用户注册", description = "用户注册接口")
    @PostMapping
    public BaseResponse<Long> register(@Parameter(description = "用户注册请求参数") @RequestBody UserRegisterRequest userRegisterRequest) {
        ThrowUtils.throwIf(userRegisterRequest == null, ErrorCode.PARAMS_ERROR);
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        long result = userService.userRegister(userAccount, userPassword, checkPassword);
        return ResultUtils.success(result);
     }

     /**
      * 用户登录 - RESTful: POST /users/login
      *
      * @param userLoginRequest 用户登录请求参数
      * @return 用户登录态
      */
     @Operation(summary = "用户登录", description = "用户登录接口")
     @PostMapping("/login")
     public BaseResponse<LoginUserVO> userLogin(@Parameter(description = "用户登录请求参数") @RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
         ThrowUtils.throwIf(userLoginRequest == null, ErrorCode.PARAMS_ERROR);
         String userAccount = userLoginRequest.getUserAccount();
         String userPassword = userLoginRequest.getUserPassword();
         LoginUserVO loginUserVO = userService.userLogin(userAccount, userPassword, request);
         return ResultUtils.success(loginUserVO);
     }

    /**
     * 用户注销 - RESTful: POST /users/logout
     *
     * @param request HTTP 请求
     * @return 是否注销成功
     */
    @Operation(summary = "用户注销", description = "用户注销接口")
    @PostMapping("/logout")
    public BaseResponse<Boolean> userLogout(HttpServletRequest request) {
        ThrowUtils.throwIf(request == null, ErrorCode.PARAMS_ERROR);
        boolean result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    /**
     * 获取当前登录用户 - RESTful: GET /users/me
     *
     * @param request HTTP 请求
     * @return 当前登录用户
     */
     @Operation(summary = "获取当前登录用户", description = "获取当前登录用户信息")
     @GetMapping("/me")
     public BaseResponse<LoginUserVO> getLoginUser(HttpServletRequest request) {
         ThrowUtils.throwIf(request == null, ErrorCode.PARAMS_ERROR);
         User loginUserVO = userService.getLoginUser(request);
         return ResultUtils.success(userService.getLoginUserVO(loginUserVO));
     }

    /**
     * 创建用户（管理员） - RESTful: POST /users（管理员创建其他用户）
     *
     * @param userAddRequest 用户创建请求
     * @return {@link BaseResponse}<{@link Long}>
     */
    @Operation(summary = "创建用户", description = "管理员创建用户接口")
    @PostMapping("/admin")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Long> addUser(@Parameter(description = "用户创建请求参数") @RequestBody UserAddRequest userAddRequest) {
        ThrowUtils.throwIf(userAddRequest == null, ErrorCode.PARAMS_ERROR);
        User user = new User();
        BeanUtil.copyProperties(userAddRequest, user);
        // 默认密码 12345678
        final String DEFAULT_PASSWORD = "12345678";
        String encryptPassword = userService.getEncryptPassword(DEFAULT_PASSWORD);
        user.setUserPassword(encryptPassword);
        boolean result = userService.save(user);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(user.getId());
    }

    /**
     * 根据 id 获取用户（仅管理员） - RESTful: GET /users/{id}
     *
     * @param id 用户id
     * @return {@link BaseResponse}<{@link User}>
     */
    @Operation(summary = "根据ID获取用户", description = "管理员根据ID获取用户详细信息")
    @GetMapping("/{id}")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<User> getUserById(@Parameter(description = "用户ID") @PathVariable long id) {
        ThrowUtils.throwIf(id <= 0, ErrorCode.PARAMS_ERROR);
        User user = userService.getById(id);
        ThrowUtils.throwIf(user == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(user);
    }

    /**
     * 根据 id 获取包装类 - RESTful: GET /users/{id}/vo
     *
     * @param id 用户id
     * @return {@link BaseResponse}<{@link UserVO}>
     */
    @Operation(summary = "根据ID获取用户VO", description = "根据ID获取用户包装类信息")
    @GetMapping("/{id}/vo")
    public BaseResponse<UserVO> getUserVOById(@Parameter(description = "用户ID") @PathVariable long id) {
        BaseResponse<User> response = getUserById(id);
        User user = response.getData();
        return ResultUtils.success(userService.getUserVO(user));
    }

    /**
     * 删除用户 - RESTful: DELETE /users/{id}
     *
     * @param id 用户ID
     * @return {@link BaseResponse}<{@link Boolean}>
     */
    @Operation(summary = "删除用户", description = "管理员删除用户接口")
    @DeleteMapping("/{id}")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Boolean> deleteUser(@Parameter(description = "用户ID") @PathVariable long id) {
        ThrowUtils.throwIf(id <= 0, ErrorCode.PARAMS_ERROR);
        boolean result = userService.removeById(id);
        return ResultUtils.success(result);
    }

    /**
     * 更新用户 - RESTful: PUT /users/{id}
     *
     * @param id 用户ID
     * @param userUpdateRequest 用户更新请求
     * @return {@link BaseResponse}<{@link Boolean}>
     */
    @Operation(summary = "更新用户", description = "管理员更新用户信息接口")
    @PutMapping("/{id}")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Boolean> updateUser(@Parameter(description = "用户ID") @PathVariable long id,
                                          @Parameter(description = "用户更新请求参数") @RequestBody UserUpdateRequest userUpdateRequest) {
        ThrowUtils.throwIf(id <= 0, ErrorCode.PARAMS_ERROR);
        ThrowUtils.throwIf(userUpdateRequest == null, ErrorCode.PARAMS_ERROR);
        User user = new User();
        BeanUtil.copyProperties(userUpdateRequest, user);
        user.setId(id);
        boolean result = userService.updateById(user);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(true);
    }

    /**
     * 分页获取用户封装列表 - RESTful: GET /users
     *
     * @param userQueryRequest 用户查询请求
     * @return {@link BaseResponse}<{@link Page}<{@link UserVO}>>
     */
    @Operation(summary = "分页获取用户封装列表", description = "管理员分页获取用户封装列表")
    @GetMapping
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Page<UserVO>> listUserVOByPage(@Parameter(description = "用户查询请求参数") UserQueryRequest userQueryRequest) {
        if (userQueryRequest == null) {
            userQueryRequest = new UserQueryRequest();
        }
        long pageNum = userQueryRequest.getPageNum();
        long pageSize = userQueryRequest.getPageSize();
        Page<User> userPage = userService.page(Page.of(pageNum, pageSize),
                userService.getQueryWrapper(userQueryRequest));
        // 数据脱敏
        Page<UserVO> userVOPage = new Page<>(pageNum, pageSize, userPage.getTotalRow());
        List<UserVO> userVOList = userService.getUserVOList(userPage.getRecords());
        userVOPage.setRecords(userVOList);
        return ResultUtils.success(userVOPage);
    }

    /**
     * 更新个人信息 - RESTful: PUT /users/me
     *
     * @param userUpdateMyRequest 用户更新个人信息请求
     * @param request             请求
     * @return {@link BaseResponse}<{@link Boolean}>
     */
    @Operation(summary = "更新个人信息", description = "用户更新个人信息接口")
    @PutMapping("/me")
    public BaseResponse<Boolean> updateMyUser(@Parameter(description = "用户更新个人信息请求参数") @RequestBody UserUpdateMyRequest userUpdateMyRequest,
                                              HttpServletRequest request) {
        if (userUpdateMyRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        User user = new User();
        BeanUtil.copyProperties(userUpdateMyRequest, user);
        user.setId(loginUser.getId());
        boolean result = userService.updateById(user);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(true);
    }


}
