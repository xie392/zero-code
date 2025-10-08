package com.code.zero.model.dto.app;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;

/**
 * 创建应用请求
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Schema(description = "创建应用请求")
@Data
public class AppAddRequest implements Serializable {

    /**
     * 应用名称
     */
    @Schema(description = "应用名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "我的智能助手")
    private String appName;

    /**
     * 应用初始化的 prompt
     */
    @Schema(description = "应用初始化的 prompt", requiredMode = Schema.RequiredMode.REQUIRED, example = "你是一个智能助手，请帮助用户解决问题")
    private String initPrompt;

    @Serial
    private static final long serialVersionUID = 1L;
}