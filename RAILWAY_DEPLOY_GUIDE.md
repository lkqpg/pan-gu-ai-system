# 🚂 Railway 后端部署指南

## 📋 准备部署后端到Railway

### 前提条件：
1. ✅ 已获取MongoDB Atlas连接字符串
2. ✅ 有GitHub账号
3. ✅ 有Railway账号（可用GitHub登录）

## 🚀 部署步骤

### 步骤1：访问Railway
1. **打开**: https://railway.app
2. **点击** "Start a New Project"
3. **选择** "Deploy from GitHub repo"

### 步骤2：连接GitHub
1. **授权** Railway访问你的GitHub仓库
2. **选择仓库**:
   - 如果已有包含 `deploy_temp/backend` 的仓库，选择它
   - 如果没有，需要先上传到GitHub

### 步骤3：配置项目
1. **项目名称**: `pan-gu-ai-backend`（自动生成）
2. **根目录**: 选择 `backend` 目录
3. **Railway会自动检测**为Node.js项目

### 步骤4：配置环境变量
**这是最关键的一步！**

在Railway项目面板中：
1. 点击项目名称进入详情
2. 点击 "Variables" 标签
3. 添加以下环境变量：

#### 必需变量：
```
PORT=3001
NODE_ENV=production
MONGODB_URI=你的MongoDB连接字符串
QVERIS_API_KEY=sk-3wKsq7KwHPYU8CjwkznECR3iYbE9fN5S2NcaTfXuda0
```

#### 可选变量（建议设置）：
```
CORS_ORIGIN=你的前端URL（部署前端后设置）
LOG_LEVEL=info
AI_MODEL=pan-gu-ai-mock
```

### 步骤5：开始部署
1. 环境变量设置完成后，Railway会自动开始部署
2. 可以在 "Deployments" 标签查看部署进度
3. 部署完成后，在 "Settings" → "Domains" 查看你的后端URL

### 步骤6：验证部署
部署完成后，测试以下端点：
1. **健康检查**: `https://你的域名.railway.app/health`
2. **系统状态**: `https://你的域名.railway.app/api/status`

## 🔧 故障排除

### 常见问题1：部署失败
**症状**: Railway显示部署失败（红色状态）
**解决**:
1. 点击失败的部署，查看日志
2. 常见原因：
   - 缺少 package.json
   - Node.js版本不兼容
   - 环境变量错误
   - 代码语法错误

### 常见问题2：数据库连接失败
**症状**: 健康检查返回数据库错误
**解决**:
1. 检查 `MONGODB_URI` 环境变量
2. 确认MongoDB Atlas网络访问设置
3. 验证数据库用户权限

### 常见问题3：应用启动失败
**症状**: 应用无法启动，端口被占用
**解决**:
1. 确认 `PORT=3001` 已设置
2. Railway会自动分配端口，3001是内部使用

## 📊 Railway免费额度

### 包含资源：
- **$5/月免费额度**（足够运行多个项目）
- **512MB RAM**（默认）
- **1vCPU**（共享）
- **无限部署**
- **自定义域名**

### 用量监控：
1. 在Railway仪表板查看用量
2. 接近额度时会收到通知
3. 可以随时升级到付费计划

## 🎯 部署成功标志

### 技术验证：
1. ✅ 部署状态显示"成功"（绿色）
2. ✅ 健康检查端点返回 `{"status":"healthy"}`
3. ✅ 日志无错误信息
4. ✅ 自定义域名可访问

### 业务验证：
1. ✅ API端点正常响应
2. ✅ 数据库连接成功
3. ✅ 系统监控运行
4. ✅ 准备接收前端请求

## 💡 提示和最佳实践

### 安全性：
- 不要将敏感信息提交到GitHub
- 使用Railway环境变量存储密钥
- 定期轮换API密钥
- 监控访问日志

### 性能：
- Railway会自动扩展资源
- 使用连接池优化数据库连接
- 启用缓存提高性能
- 监控内存和CPU使用

### 维护：
- 定期更新依赖包
- 监控Railway用量
- 设置自动部署（可选）
- 备份重要配置

## 📞 Railway支持

### 官方文档：
- Railway文档: https://docs.railway.app
- 部署指南: https://docs.railway.app/deploy/nodejs
- 环境变量: https://docs.railway.app/deploy/variables

### 社区支持：
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/railwayapp/railway

### 遇到问题：
1. 查看部署日志
2. 检查环境变量
3. 参考官方文档
4. 联系社区支持

## 🚀 下一步

### 后端部署完成后：
1. **记录后端URL**（格式: `https://xxx.up.railway.app`）
2. **测试API端点**确认功能正常
3. **准备部署前端**，需要后端URL
4. **配置CORS**允许前端访问

### 重要提醒：
- 后端URL需要提供给前端配置
- 保持Railway项目运行
- 监控免费额度使用
- 准备扩展功能

---

**⏱️ 预计部署时间：5-10分钟**
**💰 成本：免费（$5/月额度内）**
**🎯 目标：获取可访问的后端API URL**

**💡 提示：一次部署，永久运行，自动扩展！**