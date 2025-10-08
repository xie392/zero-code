package com.code.zero.model.dto.app;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

/**
 * 管理员更新应用请求
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Schema(description = "管理员更新应用请求")
@Data
public class AppUpdateByAdminRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "应用ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Long id;

    /**
     * 应用名称
     */
    @Schema(description = "应用名称", example = "我的智能助手")
    private String appName;

    /**
     * 应用封面
     */
    @Schema(description = "应用封面URL", example = "https://example.com/cover.jpg")
    private String cover;

    /**
     * 优先级
     */
    @Schema(description = "优先级（数值越大优先级越高）", example = "1")
    private Integer priority;

    @Serial
    private static final long serialVersionUID = 1L;
}