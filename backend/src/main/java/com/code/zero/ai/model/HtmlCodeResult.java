package com.code.zero.ai.model;

import dev.langchain4j.model.output.structured.Description;
import lombok.Data;

@Description("生成HTML代码文件结果")
@Data
public class HtmlCodeResult {

    @Description("HTML代码")
    private String htmlCode;

    @Description("代码描述")
    private String description;
}
