// 快速连接测试
const { MongoClient } = require('mongodb');

async function test() {
    console.log('🚀 快速数据库连接测试');
    
    // 测试两种连接方式
    const connections = [
        {
            name: 'SRV连接',
            uri: 'mongodb+srv://pan-gu-ai-user:Lkq18054900600@pan-gu-ai-user.be2wn9g.mongodb.net/pan-gu-ai?retryWrites=true&w=majority'
        },
        {
            name: '标准连接',
            uri: 'mongodb://pan-gu-ai-user:Lkq18054900600@pan-gu-ai-user.be2wn9g.mongodb.net:27017/pan-gu-ai?retryWrites=true&w=majority'
        }
    ];
    
    for (const conn of connections) {
        console.log(`\n🔍 测试: ${conn.name}`);
        console.log(`   连接: ${conn.uri.replace(/Lkq18054900600/, '****')}`);
        
        const client = new MongoClient(conn.uri, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000,
        });
        
        try {
            await client.connect();
            console.log(`   ✅ ${conn.name} 成功！`);
            await client.close();
            return true;
        } catch (error) {
            console.log(`   ❌ ${conn.name} 失败: ${error.message}`);
            if (error.message.includes('authentication')) {
                console.log('      可能密码错误或用户不存在');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.log('      网络访问未配置');
            }
        }
    }
    
    console.log('\n🔧 解决方案:');
    console.log('1. 配置网络访问: MongoDB Atlas → Network Access');
    console.log('2. 添加IP地址: 0.0.0.0/0');
    console.log('3. 等待2分钟生效');
    console.log('4. 重新测试');
    
    return false;
}

test().then(success => {
    process.exit(success ? 0 : 1);
});