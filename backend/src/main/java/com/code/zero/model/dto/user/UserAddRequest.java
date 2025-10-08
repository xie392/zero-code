package com.code.zero.model.dto.user;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

@Schema(description = "用户创建请求")
@Data
public class UserAddRequest implements Serializable {

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "张三")
    private String userName;

    /**
     * 账号
     */
    @Schema(description = "用户账号", example = "testuser", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userAccount;

    /**
     * 用户头像
     */
    @Schema(description = "用户头像URL", example = "https://picsum.photos/100")
    private String userAvatar;

    /**
     * 用户简介
     */
    @Schema(description = "用户简介", example = "这是一个用户简介")
    private String userProfile;

    /**
     * 用户角色: user, admin
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin"})
    private String userRole;

    @Serial
    private static final long serialVersionUID = 1L;
}
