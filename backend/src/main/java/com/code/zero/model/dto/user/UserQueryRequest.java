package com.code.zero.model.dto.user;

import com.code.zero.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

@Schema(description = "用户查询请求")
@EqualsAndHashCode(callSuper = true)
@Data
public class UserQueryRequest extends PageRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "用户ID", example = "1")
    private Long id;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "张三")
    private String userName;

    /**
     * 账号
     */
    @Schema(description = "用户账号", example = "testuser")
    private String userAccount;

    /**
     * 简介
     */
    @Schema(description = "用户简介", example = "这是一个用户简介")
    private String userProfile;

    /**
     * 用户角色：user/admin/ban
     */
    @Schema(description = "用户角色", example = "user", allowableValues = {"user", "admin", "ban"})
    private String userRole;

    @Serial
    private static final long serialVersionUID = 1L;
}
