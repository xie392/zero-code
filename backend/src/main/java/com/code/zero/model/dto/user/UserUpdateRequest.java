package com.code.zero.model.dto.user;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

@Schema(description = "用户更新请求")
@Data
public class UserUpdateRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "用户ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Long id;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "张三")
    private String userName;

    /**
     * 用户头像
     */
    @Schema(description = "用户头像URL", example = "https://example.com/avatar.jpg")
    private String userAvatar;

    /**
     * 简介
     */
    @Schema(description = "用户简介", example = "这是一个用户简介")
    private String userProfile;

    /**
     * 用户角色：user/admin
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin"})
    private String userRole;

    @Serial
    private static final long serialVersionUID = 1L;
}
