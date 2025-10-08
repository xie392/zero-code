package com.code.zero.ai.model;

import dev.langchain4j.model.output.structured.Description;
import lombok.Data;

@Description("生成多文件代码文件结果")
@Data
public class MultiFileCodeResult {

    @Description("HTML代码")
    private String htmlCode;

    @Description("CSS代码")
    private String cssCode;

    @Description("JS代码")
    private String jsCode;

    @Description("代码描述")
    private String description;
}
