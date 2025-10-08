package com.code.zero.ai;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AI 代码生成服务工厂
 */
@Configuration
@Slf4j
public class AiCodeGeneratorServiceFactory {

    private final ChatModel chatModel;
    private final StreamingChatModel streamingChatModel;

    @Autowired
    public AiCodeGeneratorServiceFactory(ChatModel chatModel, StreamingChatModel streamingChatModel) {
        log.info("Creating AiCodeGeneratorServiceFactory with ChatModel: {}, StreamingChatModel: {}",
                chatModel != null ? chatModel.getClass().getSimpleName() : "null",
                streamingChatModel != null ? streamingChatModel.getClass().getSimpleName() : "null");
        this.chatModel = chatModel;
        this.streamingChatModel = streamingChatModel;
    }

    @PostConstruct
    public void init() {
        log.info("AiCodeGeneratorServiceFactory initialized successfully");
    }

    /**
     * AI 代码生成服务
     * @return AI 代码生成服务
     */
    @Bean
    public AiCodeGeneratorService aiCodeGeneratorService() {
        log.info("Creating AiCodeGeneratorService bean");
        return AiServices.builder(AiCodeGeneratorService.class)
                .chatModel(chatModel)
                .streamingChatModel(streamingChatModel)
                .build();
    }
}
