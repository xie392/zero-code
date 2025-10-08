package com.code.zero.common;

import lombok.Data;

/**
 * 分页请求参数
 * 包含分页信息和排序字段的请求参数
 */

@Data
public class PageRequest {

    /**
     * 当前页号
     */
    private int pageNum = 1;

    /**
     * 页面大小
     */
    private int pageSize = 10;

    /**
     * 排序字段
     */
    private String sortField;

    /**
     * 排序顺序（默认降序）
     */
    private String sortOrder = "descend";
}
