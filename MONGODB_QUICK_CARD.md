# 🃏 MongoDB Atlas 快速参考卡

## 🔑 关键信息
- **网址**: https://www.mongodb.com/cloud/atlas
- **套餐**: M0 Sandbox (FREE)
- **用户名**: pan-gu-ai-user
- **集群名**: pan-gu-ai-cluster
- **网络**: 0.0.0.0/0
- **数据库**: pan-gu-ai

## 🚀 5分钟快速步骤

### 1. 登录 (1分钟)
```
点击: Sign in with GitHub
```

### 2. 创建集群 (2分钟)
```
点击: Build a Database
选择: M0 Sandbox (FREE)
配置: AWS, Singapore/Tokyo
名称: pan-gu-ai-cluster
点击: Create Cluster
```

### 3. 创建用户 (1分钟)
```
菜单: Database Access
点击: Add New Database User
用户: pan-gu-ai-user
密码: [设置并记住]
权限: Read and write to any database
点击: Add User
```

### 4. 网络配置 (30秒)
```
菜单: Network Access
点击: Add IP Address
选择: Allow Access from Anywhere
IP: 0.0.0.0/0
点击: Confirm
```

### 5. 获取连接 (30秒)
```
返回: 集群页面
点击: Connect 按钮
选择: Connect your application
驱动: Node.js (最新)
点击: Copy 按钮
```

## 📋 检查清单
- [ ] 集群状态: ● Active
- [ ] 数据库用户: 1个 (pan-gu-ai-user)
- [ ] 网络访问: 0.0.0.0/0 (Active)
- [ ] 连接字符串: 已复制

## 🧪 连接测试命令
```bash
cd deploy_temp
node test-mongodb.js "你的连接字符串"
```

## ⚠️ 紧急提醒
- ❌ 不要选付费套餐！
- ❌ 不要用简单密码！
- ❌ 不要限制IP！
- ✅ 必须复制完整字符串！

## 📞 卡住了？
**描述**: 当前界面 + 错误信息
**我会**: 提供针对性解决方案

## 🎯 目标字符串格式
```
mongodb+srv://pan-gu-ai-user:密码@pan-gu-ai-cluster.xxxxx.mongodb.net/pan-gu-ai?retryWrites=true&w=majority
```

## 💡 提示
- 一次设置，永久使用
- 免费套餐足够初期
- 妥善保管连接字符串
- 准备下一步部署

---

**时间**: 5-10分钟  
**成本**: 0元  
**状态**: 等待你的连接字符串