package com.code.zero.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 配置类
 * 配置 Swagger/Knife4j 文档信息
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Zero Code AI API")
                        .description("零代码AI平台接口文档")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("xie392")
                                .url("https://github.com/xie392")
                                .email("ymzdjiang@qq.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8123/api")
                                .description("本地开发环境"),
                        new Server()
                                .url("https://api.zerocode.com/api")
                                .description("生产环境")
                ));
    }
}
