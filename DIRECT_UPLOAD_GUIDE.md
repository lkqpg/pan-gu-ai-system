# 🚀 直接上传到Railway - 简单指南

## ⏱️ 预计时间：12分钟

## 🎯 目标：跳过GitHub，直接部署

## 📋 步骤：

### 步骤1：在Railway页面
1. 你应该在 https://railway.app 并已登录
2. 看到Railway控制台

### 步骤2：开始新项目
1. 点击 **"Start a New Project"**（绿色大按钮）
2. 你会看到几个选项

### 步骤3：选择部署方式
**选项A（如果有）：**
- 直接看到 **"Deploy from a directory"** 选项
- 点击它
- 选择 `deploy_temp/backend` 文件夹

**选项B（如果没有）：**
1. 点击 **"Deploy from a GitHub repo"**
2. 在GitHub配置旁边，点击 **"..."**（三个点）
3. 选择 **"Deploy from a directory"**
4. 选择 `deploy_temp/backend` 文件夹

### 步骤4：上传代码
1. Railway会扫描你的文件夹
2. 自动识别为Node.js项目
3. 点击 **"Deploy"**

### 步骤5：配置环境变量
部署开始后，立即添加环境变量：

在Railway项目设置中，找到 **"Variables"** 标签，添加：

```
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/pan-gu-ai-mock
QVERIS_API_KEY=sk-3wKsq7KwHPYU8CjwkznECR3iYbE9fN5S2NcaTfXuda0
CORS_ORIGIN=*
USE_MOCK_DATA=true
```

### 步骤6：等待部署
1. 看到部署进度
2. 等待3-5分钟
3. 部署完成

### 步骤7：获取URL
1. 部署完成后
2. 找到你的 **服务URL**
3. 格式：`https://xxx.up.railway.app`

## 🔍 找不到选项怎么办？

### 情况1：只看到GitHub选项
- 点击 **"Deploy from a GitHub repo"**
- 然后找 **"..."** 按钮
- 选择 **"Deploy from a directory"**

### 情况2：没有"..."按钮
- 尝试刷新页面
- 或者先连接GitHub，然后断开
- 或者使用GitHub创建空仓库再上传

### 情况3：无法选择文件夹
- 确保 `deploy_temp/backend` 文件夹存在
- 文件夹内有 `package.json` 文件
- Railway需要这个来识别项目类型

## 💡 备用方案：使用GitHub

### 如果直接上传不行：
1. 访问 https://github.com
2. 创建新仓库：`pan-gu-ai-system`
3. 上传 `deploy_temp` 内容
4. 回到Railway选择这个仓库

## 🎯 成功标志

### 部署成功：
1. ✅ 看到部署进度条
2. ✅ 看到日志输出
3. ✅ 部署状态变为"Deployed"
4. ✅ 获得服务URL

### 功能验证：
1. 访问 `你的URL/health`
2. 返回：`{"status":"healthy"}`
3. 系统准备就绪

## 📞 实时支持

### 如果你卡住：
1. **描述**当前在哪个页面
2. **截图**或描述看到的选项
3. **告诉我**错误信息

### 我会告诉你：
1. 下一步点击哪里
2. 如何找到选项
3. 解决问题

## ⏱️ 时间线

### 当前时间：22:25
### 预计完成：
- 找到选项：2分钟
- 上传代码：1分钟
- 配置变量：2分钟
- 等待部署：5分钟
- 验证：2分钟
- **总计**：12分钟
- **完成**：22:37

## 🚀 立即开始

### 请立即：
1. 在Railway页面
2. 找 **"Deploy from a directory"** 选项
3. 或者点击 **"..."** 按钮

### 然后告诉我：
1. 看到了什么选项
2. 是否找到直接上传
3. 是否需要帮助

**我在线等待，实时指导！**