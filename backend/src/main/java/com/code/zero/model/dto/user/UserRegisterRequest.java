package com.code.zero.model.dto.user;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

@Schema(description = "用户注册请求")
@Data
public class UserRegisterRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 3191241716373120793L;

    /**
     * 账号
     */
    @Schema(description = "用户账号", example = "testuser", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userAccount;

    /**
     * 密码
     */
    @Schema(description = "用户密码", example = "password123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userPassword;

    /**
     * 确认密码
     */
    @Schema(description = "确认密码", example = "password123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String checkPassword;
}
