// 本地API测试脚本
const http = require('http');

console.log('🧪 测试本地后端API...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应数据:', data);
    
    try {
      const json = JSON.parse(data);
      if (json.status === 'healthy') {
        console.log('✅ 后端API健康检查通过！');
        console.log('🎯 可以开始部署到Railway。');
        process.exit(0);
      } else {
        console.log('❌ 健康检查状态不正确:', json);
        process.exit(1);
      }
    } catch (error) {
      console.log('❌ 响应不是有效的JSON:', error.message);
      console.log('原始响应:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ 请求失败:', error.message);
  console.log('💡 可能原因:');
  console.log('   1. 后端服务未启动');
  console.log('   2. 端口3001被占用');
  console.log('   3. 网络问题');
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ 请求超时');
  console.log('💡 后端服务可能未启动或启动缓慢');
  req.destroy();
  process.exit(1);
});

req.end();