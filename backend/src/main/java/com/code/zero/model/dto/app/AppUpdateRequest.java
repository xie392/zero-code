package com.code.zero.model.dto.app;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

/**
 * 更新应用请求
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Schema(description = "更新应用请求")
@Data
public class AppUpdateRequest implements Serializable {

    /**
     * id
     */
    @Schema(description = "应用ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Long id;

    /**
     * 应用名称
     */
    @Schema(description = "应用名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "我的智能助手")
    private String appName;

    @Serial
    private static final long serialVersionUID = 1L;
}