// 简单数据库连接测试
const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = "mongodb+srv://pan-gu-ai-user:Lkq18054900600@pan-gu-ai-user.be2wn9g.mongodb.net/pan-gu-ai?retryWrites=true&w=majority";
    
    console.log('🔍 测试MongoDB Atlas连接...');
    console.log('连接字符串:', uri.replace(/low/, '****'));
    
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    });
    
    try {
        console.log('尝试连接...');
        await client.connect();
        console.log('✅ 连接成功！');
        
        // 测试数据库操作
        const db = client.db('pan-gu-ai');
        const collections = await db.listCollections().toArray();
        console.log(`数据库中有 ${collections.length} 个集合`);
        
        // 创建测试文档
        const testCollection = db.collection('connection_test');
        const result = await testCollection.insertOne({
            test: '盘古AI系统连接测试',
            timestamp: new Date()
        });
        console.log(`✅ 测试文档插入成功，ID: ${result.insertedId}`);
        
        // 清理测试文档
        await testCollection.deleteOne({ _id: result.insertedId });
        console.log('✅ 测试文档清理完成');
        
        return true;
    } catch (error) {
        console.log('❌ 连接失败:');
        console.log('错误类型:', error.name);
        console.log('错误消息:', error.message);
        
        // 常见错误诊断
        if (error.message.includes('authentication failed')) {
            console.log('\n💡 可能原因: 用户名或密码错误');
            console.log('   检查用户名: 373086064');
            console.log('   检查密码: low');
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
            console.log('\n💡 可能原因: 网络访问未配置');
            console.log('   1. 登录MongoDB Atlas');
            console.log('   2. 点击左侧 "Network Access"');
            console.log('   3. 点击 "Add IP Address"');
            console.log('   4. 选择 "Allow Access from Anywhere" (0.0.0.0/0)');
            console.log('   5. 点击 "Confirm"');
        } else if (error.message.includes('getaddrinfo')) {
            console.log('\n💡 可能原因: 集群地址错误');
            console.log('   检查集群地址: pan-gu-ai-user.be2wn9g.mongodb.net');
        }
        
        return false;
    } finally {
        await client.close();
    }
}

// 运行测试
testConnection().then(success => {
    if (success) {
        console.log('\n🎉 数据库连接测试完全成功！');
        console.log('可以继续部署后端到Railway。');
        process.exit(0);
    } else {
        console.log('\n🔧 请根据上述提示解决问题后重试。');
        process.exit(1);
    }
});