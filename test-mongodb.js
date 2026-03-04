#!/usr/bin/env node

/**
 * MongoDB Atlas连接测试脚本
 * 用于验证数据库连接是否成功
 */

const mongoose = require('mongoose');

console.log('🔍 MongoDB Atlas连接测试');
console.log('========================================\n');

async function testMongoDBConnection(connectionString) {
    if (!connectionString) {
        console.log('❌ 错误：未提供连接字符串');
        console.log('💡 请提供MongoDB Atlas连接字符串，格式：');
        console.log('   mongodb+srv://用户名:密码@集群地址/数据库名?retryWrites=true&w=majority');
        process.exit(1);
    }
    
    // 隐藏密码的安全显示
    const safeDisplayString = connectionString.replace(/:[^@]+@/, ':****@');
    console.log(`📡 测试连接: ${safeDisplayString}`);
    console.log('');
    
    try {
        console.log('1. 测试数据库连接...');
        
        // 设置连接选项（新版本MongoDB驱动简化了选项）
        const options = {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        };
        
        // 连接数据库
        console.log('   正在连接...');
        const startTime = Date.now();
        
        await mongoose.connect(connectionString, options);
        const connectionTime = Date.now() - startTime;
        
        console.log(`   ✅ 连接成功 (${connectionTime}ms)`);
        
        // 检查连接状态
        const connectionState = mongoose.connection.readyState;
        const stateMap = {
            0: '断开',
            1: '已连接',
            2: '连接中',
            3: '断开中'
        };
        
        console.log(`   连接状态: ${stateMap[connectionState] || '未知'}`);
        
        // 测试数据库操作
        console.log('\n2. 测试数据库操作...');
        
        // 创建测试模型
        const TestSchema = new mongoose.Schema({
            test: String,
            timestamp: { type: Date, default: Date.now }
        });
        
        const TestModel = mongoose.model('ConnectionTest', TestSchema);
        
        // 写入测试数据
        console.log('   写入测试数据...');
        const testDoc = new TestModel({ test: '盘古AI系统连接测试' });
        await testDoc.save();
        console.log(`   ✅ 数据写入成功 (ID: ${testDoc._id})`);
        
        // 读取测试数据
        console.log('   读取测试数据...');
        const foundDoc = await TestModel.findById(testDoc._id);
        if (foundDoc) {
            console.log(`   ✅ 数据读取成功: "${foundDoc.test}"`);
        }
        
        // 清理测试数据
        console.log('   清理测试数据...');
        await TestModel.deleteMany({ test: '盘古AI系统连接测试' });
        console.log('   ✅ 测试数据清理完成');
        
        // 获取数据库信息
        console.log('\n3. 获取数据库信息...');
        const db = mongoose.connection.db;
        
        try {
            const adminDb = db.admin();
            const serverStatus = await adminDb.serverStatus();
            console.log(`   ✅ 服务器版本: ${serverStatus.version}`);
            console.log(`   ✅ 运行时间: ${Math.floor(serverStatus.uptime / 3600)}小时`);
            console.log(`   ✅ 连接数: ${serverStatus.connections.current}`);
        } catch (infoError) {
            console.log('   ℹ️  无法获取服务器状态（权限限制）');
        }
        
        // 断开连接
        console.log('\n4. 断开数据库连接...');
        await mongoose.disconnect();
        console.log('   ✅ 连接已安全断开');
        
        console.log('\n========================================');
        console.log('🎉 MongoDB Atlas连接测试完全成功！');
        console.log('========================================');
        console.log('');
        console.log('💡 数据库已准备好用于盘古AI系统');
        console.log('   可以继续部署后端和前端');
        console.log('');
        console.log('🚀 下一步：将连接字符串添加到Railway环境变量');
        console.log('   变量名: MONGODB_URI');
        console.log(`   值: ${safeDisplayString}`);
        
        process.exit(0);
        
    } catch (error) {
        console.log('\n❌ 数据库连接测试失败！');
        console.log('');
        console.log('🔍 错误信息:');
        console.log(`   类型: ${error.name}`);
        console.log(`   消息: ${error.message}`);
        console.log('');
        
        // 常见错误诊断
        console.log('💡 常见问题排查:');
        
        if (error.message.includes('authentication failed')) {
            console.log('   1. 用户名或密码错误');
            console.log('   2. 检查Database Access中的用户配置');
            console.log('   3. 确认密码正确');
        } else if (error.message.includes('getaddrinfo')) {
            console.log('   1. 网络连接问题');
            console.log('   2. 检查网络访问设置');
            console.log('   3. 确认集群地址正确');
        } else if (error.message.includes('timed out')) {
            console.log('   1. 连接超时');
            console.log('   2. 检查网络防火墙');
            console.log('   3. 确认IP白名单设置');
        } else if (error.message.includes('bad auth')) {
            console.log('   1. 认证失败');
            console.log('   2. 检查数据库用户权限');
            console.log('   3. 确认数据库名称正确');
        } else {
            console.log('   1. 检查连接字符串格式');
            console.log('   2. 确认集群状态正常');
            console.log('   3. 检查网络访问权限');
        }
        
        console.log('');
        console.log('🔧 连接字符串格式参考:');
        console.log('   mongodb+srv://用户名:密码@集群地址/数据库名?retryWrites=true&w=majority');
        console.log('');
        console.log('🌐 需要帮助:');
        console.log('   1. 检查MongoDB Atlas控制台');
        console.log('   2. 确认网络访问设置为0.0.0.0/0');
        console.log('   3. 验证数据库用户存在且有权限');
        
        process.exit(1);
    }
}

// 从命令行参数获取连接字符串
const connectionString = process.argv[2];

// 如果没有参数，提示用户输入
if (!connectionString) {
    console.log('📝 请输入MongoDB Atlas连接字符串:');
    console.log('（或作为参数运行: node test-mongodb.js "你的连接字符串"）');
    console.log('');
    
    // 模拟等待输入（实际需要用户交互）
    console.log('💡 连接字符串格式:');
    console.log('   mongodb+srv://用户名:密码@集群地址/pan-gu-ai?retryWrites=true&w=majority');
    console.log('');
    console.log('🔑 获取位置: MongoDB Atlas → Connect → Connect your application');
    console.log('');
    
    process.exit(0);
} else {
    // 运行测试
    testMongoDBConnection(connectionString).catch(error => {
        console.error('测试过程出错:', error);
        process.exit(1);
    });
}