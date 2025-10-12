package com.code.zero.model.vo;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 应用视图
 *
 * @author <a href="https://github.com/xie392">xie392</a>
 */
@Schema(description = "应用信息视图对象")
@Data
public class AppVO implements Serializable {

    /**
     * id
     */
    @Schema(description = "应用ID", example = "1")
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
     * 应用初始化的 prompt
     */
    @Schema(description = "应用初始化的 prompt", example = "你是一个智能助手，请帮助用户解决问题")
    private String initPrompt;

    /**
     * 代码生成类型（枚举）
     */
    @Schema(description = "代码生成类型", example = "html")
    private String codeGenType;

    /**
     * 部署标识
     */
    @Schema(description = "部署标识", example = "app-123456")
    private String deployKey;

    /**
     * 部署时间
     */
    @Schema(description = "部署时间", example = "2024-01-01T10:00:00")
    private LocalDateTime deployedTime;

    /**
     * 优先级
     */
    @Schema(description = "优先级（数值越大优先级越高）", example = "1")
    private Integer priority;

    /**
     * 创建用户id
     */
    @Schema(description = "创建用户ID", example = "1001")
    private Long userId;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间", example = "2024-01-01T10:00:00")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间", example = "2024-01-01T10:00:00")
    private LocalDateTime updateTime;

    /**
     * 创建用户信息
     */
     @Schema(description = "创建用户信息")
    private UserVO user;

    @Serial
    private static final long serialVersionUID = 1L;
}