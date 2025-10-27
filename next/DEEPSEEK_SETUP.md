# 🤖 DeepSeek API 配置指南

本项目默认使用 **DeepSeek API**，它提供高性价比的 AI 能力，完全兼容 OpenAI API 接口。

---

## 📝 获取 DeepSeek API Key

### 1. 注册账号
访问 [DeepSeek 开放平台](https://platform.deepseek.com/)

### 2. 创建 API Key
- 登录后进入控制台
- 创建新的 API Key
- 复制保存（只显示一次）

### 3. 充值
- 最低充值 10 元
- 支持支付宝、微信支付
- 按量计费，成本远低于 OpenAI

---

## ⚙️ 环境配置

在 `.env` 文件中配置：

```bash
# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

---

## 🎯 可用模型

### 1. deepseek-chat（推荐）
- **用途**：通用对话、代码生成
- **价格**：¥1/百万 tokens（输入），¥2/百万 tokens（输出）
- **特点**：性价比高，适合大部分场景

### 2. deepseek-coder
- **用途**：专业代码生成、代码优化
- **价格**：同 deepseek-chat
- **特点**：专注于代码任务，生成质量更高

**切换方法：**
```bash
# .env 文件
DEEPSEEK_MODEL=deepseek-coder
```

---

## 💰 价格对比

| 服务商 | 模型 | 输入价格 | 输出价格 |
|--------|------|----------|----------|
| DeepSeek | deepseek-chat | ¥1/百万 tokens | ¥2/百万 tokens |
| OpenAI | gpt-4o-mini | ~¥1/百万 tokens | ~¥4/百万 tokens |
| OpenAI | gpt-4o | ~¥30/百万 tokens | ~¥60/百万 tokens |

**生成一个 HTML 应用预估成本：** 约 ¥0.01-0.05

---

## 🔧 切换到其他 LLM

本项目支持任何兼容 OpenAI API 的服务，只需修改环境变量：

### 切换到 OpenAI
```bash
DEEPSEEK_API_KEY=sk-your-openai-key
DEEPSEEK_BASE_URL=https://api.openai.com/v1
DEEPSEEK_MODEL=gpt-4o-mini
```

### 切换到通义千问
```bash
DEEPSEEK_API_KEY=sk-your-qwen-key
DEEPSEEK_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
DEEPSEEK_MODEL=qwen-turbo
```

### 切换到智谱 AI
```bash
DEEPSEEK_API_KEY=your-zhipu-key
DEEPSEEK_BASE_URL=https://open.bigmodel.cn/api/paas/v4
DEEPSEEK_MODEL=glm-4-flash
```

---

## 🚀 优化建议

### 1. 使用 deepseek-coder 提升代码质量
```bash
# .env
DEEPSEEK_MODEL=deepseek-coder
```

### 2. 调整 temperature 参数
在 `src/lib/langgraph/agent.ts` 中：
```typescript
const model = new ChatOpenAI({
  temperature: 0.3,  // 降低随机性，提高稳定性
  // ... 其他配置
})
```

### 3. 优化 Prompt
编辑 `src/lib/langgraph/prompts.ts`，添加更多示例和约束。

---

## 📊 使用监控

### 查看 API 用量
登录 DeepSeek 控制台查看：
- 调用次数
- Token 消耗
- 费用统计

### 设置预算提醒
在控制台设置每日/每月预算上限，避免超支。

---

## 🐛 常见问题

### 1. API Key 无效
- 检查是否正确复制了完整的 Key
- 确认 Key 没有过期
- 重新生成新的 Key

### 2. 余额不足
- 登录控制台充值
- 检查余额是否充足

### 3. 请求速率限制
- DeepSeek 有 QPM（每分钟请求数）限制
- 免费用户：60 QPM
- 付费用户：根据充值额度提升

### 4. 网络连接问题
- 检查是否能访问 `https://api.deepseek.com`
- 如需代理，配置 HTTP_PROXY 环境变量

---

## 🔐 安全建议

1. **不要提交 API Key 到 Git**
   - `.env` 文件已在 `.gitignore` 中
   - 使用 `.env.example` 作为模板

2. **定期轮换 API Key**
   - 每月更换一次
   - 如有泄露立即撤销

3. **限制 Key 权限**
   - 只授予必要的权限
   - 设置 IP 白名单（如支持）

---

## 📚 相关资源

- [DeepSeek 官方文档](https://platform.deepseek.com/docs)
- [API 参考](https://platform.deepseek.com/api-docs)
- [价格说明](https://platform.deepseek.com/pricing)
- [GitHub 示例](https://github.com/deepseek-ai)

---

**享受高性价比的 AI 代码生成体验！** 🎉
