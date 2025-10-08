package com.code.zero.model.dto.user;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

@Schema(description = "用户登录请求")
@Data
public class UserLoginRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "用户账号", example = "test", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userAccount;
    
    @Schema(description = "用户密码", example = "12345678", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userPassword;
}
