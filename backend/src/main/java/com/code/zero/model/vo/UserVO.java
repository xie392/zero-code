package com.code.zero.model.vo;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Schema(description = "用户信息")
@Data
public class UserVO implements Serializable {

    /**
     * id
     */
    @Schema(description = "用户ID", example = "1")
    private Long id;

    /**
     * 账号
     */
    @Schema(description = "用户账号", example = "testuser")
    private String userAccount;

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
     * 用户简介
     */
    @Schema(description = "用户简介", example = "这是一个用户简介")
    private String userProfile;

    /**
     * 用户角色：user/admin
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin"})
    private String userRole;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间", example = "2024-01-01T10:00:00")
    private LocalDateTime createTime;

    @Serial
    private static final long serialVersionUID = 1L;
}
