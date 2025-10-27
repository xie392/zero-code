# 🚀 Zero Code MVP 使用指南

## 项目简介

这是一个基于 **LangGraph.js** 的 AI 网页生成平台，用户只需输入需求描述，AI 就能自动生成完整的 HTML 应用。

**核心特性：**
- ✅ 纯 HTML + Tailwind CSS + JavaScript
- ✅ 实时对话式生成
- ✅ 左侧预览，右侧对话
- ✅ 支持迭代优化
- ✅ 项目历史保存

---

## 📋 环境要求

- Node.js 18+
- PostgreSQL 数据库
- DeepSeek API Key (或其他兼容 OpenAI 的 API)

---

## 🔧 快速开始

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```bash
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/zero_code"

# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-xxx
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# Better Auth 配置
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=http://localhost:3000
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
pnpm db:generate

# 推送数据库 schema
pnpm db:push
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

---

## 🎯 使用流程

### 1️⃣ 创建应用

在首页输入框中描述你想要的应用，例如：

```
创建一个待办事项应用，包含添加、删除、标记完成功能，使用现代化设计
```

点击发送后，系统会：
1. 创建项目记录
2. 立即跳转到工作区页面
3. 开始流式生成代码

### 2️⃣ 工作区界面

**左侧：预览区**
- 实时显示生成的 HTML 页面
- 支持刷新
- 支持在新标签页打开

**右侧：对话区**
- 显示完整的对话历史
- 输入修改需求继续优化
- 支持多轮对话

### 3️⃣ 迭代优化

在对话框中输入修改需求，例如：

```
把背景色改成深色主题
```

```
添加一个搜索功能
```

```
把按钮改成圆角的
```

### 4️⃣ 查看历史

返回首页，查看所有创建的应用列表。

---

## 📁 项目结构

```
next/
├── prisma/
│   └── schema.prisma              # 数据库模型
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── page.tsx          # 首页
│   │   │   └── workspace/[id]/   # 工作区页面
│   │   └── api/
│   │       ├── generate/         # 生成 API
│   │       └── projects/         # 项目管理 API
│   ├── components/
│   │   ├── workspace/
│   │   │   ├── chat-panel.tsx    # 对话组件
│   │   │   └── preview-panel.tsx # 预览组件
│   │   ├── app-list/             # 应用列表
│   │   └── chat/input/           # 首页输入框
│   ├── lib/
│   │   └── langgraph/
│   │       ├── agent.ts          # LangGraph Agent 核心
│   │       └── prompts.ts        # Prompt 模板
│   └── types/
│       └── project.ts            # 类型定义
```

---

## 🛠️ 技术栈

### 后端
- **Next.js 15** - 全栈框架
- **Prisma** - ORM
- **PostgreSQL** - 数据库
- **Better Auth** - 身份认证

### AI 相关
- **LangGraph.js** - Agent 编排框架
- **LangChain** - LLM 集成
- **DeepSeek** - 代码生成（兼容 OpenAI API）

### 前端
- **React 19** - UI 框架
- **Tailwind CSS** - 样式
- **Radix UI** - 组件库

---

## 📊 数据库设计

### 核心表

**project** - 项目表
- `id` - 项目 ID
- `name` - 项目名称
- `userId` - 用户 ID
- `prompt` - 用户原始输入
- `htmlContent` - 生成的 HTML 代码
- `status` - 状态（GENERATING/COMPLETED/ERROR）

**chat_message** - 对话消息表
- `id` - 消息 ID
- `projectId` - 项目 ID
- `role` - 角色（user/assistant）
- `content` - 消息内容

---

## 🔌 API 接口

### POST /api/generate
生成或修改应用

**请求体：**
```json
{
  "prompt": "创建一个计时器应用",
  "projectId": "可选，用于修改现有项目"
}
```

**响应：** Server-Sent Events 流式响应
```
data: {"type":"project_id","projectId":"xxx"}
data: {"type":"chunk","content":"..."}
data: {"type":"html","htmlContent":"..."}
data: {"type":"complete","projectId":"xxx","htmlContent":"..."}
```

### GET /api/projects
获取项目列表

**响应：**
```json
{
  "projects": [
    {
      "id": "xxx",
      "name": "待办事项",
      "prompt": "...",
      "status": "COMPLETED",
      "createdAt": "..."
    }
  ]
}
```

### GET /api/projects/[id]
获取项目详情（包含对话历史）

---

## 🎨 生成的 HTML 规范

所有生成的 HTML 都遵循以下规范：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>应用标题</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- 应用内容 -->
    <script>
        // JavaScript 代码（如需要）
    </script>
</body>
</html>
```

---

## ⚙️ 配置说明

### LangGraph Agent 配置

在 `src/lib/langgraph/agent.ts` 中：

```typescript
const model = new ChatOpenAI({
  modelName: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: 0.7,           // 创造性，0-1
  streaming: true,            // 流式输出
  configuration: {
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  },
})
```

**支持的模型：**
- `deepseek-chat` - 默认对话模型
- `deepseek-coder` - 专注于代码生成

**切换其他 LLM：**
如需使用其他兼容 OpenAI API 的服务（如 OpenAI、Azure OpenAI、通义千问等），只需修改环境变量即可：
```bash
DEEPSEEK_API_KEY=your-api-key
DEEPSEEK_BASE_URL=https://your-api-endpoint.com
DEEPSEEK_MODEL=your-model-name
```

### Prompt 模板

在 `src/lib/langgraph/prompts.ts` 中自定义系统提示词。

---

## 🐛 常见问题

### 1. 数据库连接失败
- 确保 PostgreSQL 正在运行
- 检查 `DATABASE_URL` 是否正确
- 运行 `pnpm db:push` 初始化表

### 2. DeepSeek API 调用失败
- 检查 `DEEPSEEK_API_KEY` 是否正确
- 确保账户有额度
- 检查网络连接
- 验证 `DEEPSEEK_BASE_URL` 配置正确

### 3. 生成的代码不完整
- 调整 `temperature` 参数
- 优化 Prompt 模板
- 使用专门的代码模型（如 `deepseek-coder`）

### 4. 预览页面空白
- 检查浏览器控制台错误
- 确认 HTML 代码是否完整
- 检查 iframe sandbox 权限

---

## 🚀 下一步计划

### 短期优化
- [ ] 添加代码高亮显示
- [ ] 支持导出 HTML 文件
- [ ] 添加项目分享功能
- [ ] 支持暗色主题

### 中期功能
- [ ] 支持多技术栈（React、Vue）
- [ ] 添加模板库
- [ ] 支持组件复用
- [ ] 集成部署功能

### 长期规划
- [ ] 可视化编辑器
- [ ] 团队协作
- [ ] 插件系统
- [ ] AI 设计建议

---

## 📝 开发建议

### 优化生成质量
1. **优化 Prompt**：在 `prompts.ts` 中调整系统提示词
2. **添加示例**：提供优质的 HTML 模板作为 few-shot learning
3. **后处理**：在 `agent.ts` 中添加代码清理逻辑

### 提升用户体验
1. **加载动画**：添加更友好的加载提示
2. **错误处理**：完善错误提示和重试机制
3. **快捷操作**：添加键盘快捷键支持

### 性能优化
1. **缓存策略**：缓存常见的生成结果
2. **流式优化**：优化 SSE 传输效率
3. **数据库索引**：添加适当的数据库索引

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Happy Coding! 🎉**
