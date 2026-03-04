const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 数据库
const database = require('./db/connect');
const Content = require('./models/Content');

// QVeris API集成
const { QVerisClient } = require('./services/qveris');

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 初始化服务
async function initializeServices() {
  try {
    // 连接数据库
    await database.connect();
    await database.initialize();
    
    // 初始化QVeris客户端
    const qverisClient = new QVerisClient();
    await qverisClient.initialize();
    
    console.log('✅ 所有服务初始化完成');
  } catch (error) {
    console.error('❌ 服务初始化失败:', error);
    process.exit(1);
  }
}

// 健康检查端点
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'PanGu AI Backend',
      version: '1.0.0',
      database: dbHealth,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API路由
app.get('/api/status', (req, res) => {
  res.json({
    system: 'PanGu AI Creation System',
    status: 'operational',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    node: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 内容管理API
const contentRouter = express.Router();

// 获取所有内容
contentRouter.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (genre) query.genre = genre;
    
    const contents = await Content.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Content.countDocuments(query);
    
    res.json({
      success: true,
      data: contents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建新内容
contentRouter.post('/', async (req, res) => {
  try {
    const { title, content, genre, tags, aiModel, prompt } = req.body;
    
    const wordCount = content.length;
    
    const newContent = new Content({
      title,
      content,
      genre: genre || '玄幻',
      wordCount,
      tags: tags || [],
      aiModel: aiModel || 'pan-gu-ai',
      prompt,
      generationParams: req.body.generationParams
    });
    
    await newContent.save();
    
    res.status(201).json({
      success: true,
      data: newContent,
      message: '内容创建成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI写作端点
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, genre, length, useQVeris = false } = req.body;
    
    let generatedContent;
    
    if (useQVeris && process.env.QVERIS_API_KEY) {
      // 使用QVeris AI生成内容
      const qverisClient = new QVerisClient();
      const result = await qverisClient.generateContent({
        prompt: `创作${genre}题材小说：${prompt}`,
        maxLength: length || 2000
      });
      
      generatedContent = result.content;
    } else {
      // 模拟AI生成
      generatedContent = `这是根据提示"${prompt}"生成的${genre}类型小说片段，长度约${length}字...\n\n` +
        `在一个遥远的未来，人工智能已经渗透到人类生活的每一个角落。${prompt}的故事就此展开...\n\n` +
        `（这是模拟内容，实际系统将调用真正的AI模型）`;
    }
    
    // 保存到数据库
    const content = new Content({
      title: `AI生成：${prompt.substring(0, 50)}...`,
      content: generatedContent,
      genre: genre || '玄幻',
      wordCount: generatedContent.length,
      aiModel: useQVeris ? 'qveris-ai' : 'pan-gu-ai-mock',
      prompt,
      tags: ['ai-generated', genre]
    });
    
    await content.save();
    
    res.json({
      success: true,
      data: content,
      length: generatedContent.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 发布管理API
const publishRouter = express.Router();

// 获取发布状态
publishRouter.get('/status', async (req, res) => {
  try {
    const publishedContents = await Content.find({ published: true })
      .sort({ publishDate: -1 })
      .limit(20);
    
    const stats = await Content.aggregate([
      { $match: { published: true } },
      {
        $group: {
          _id: null,
          totalPublished: { $sum: 1 },
          totalWords: { $sum: '$wordCount' },
          totalRevenue: { $sum: '$revenue.total' },
          platforms: { $addToSet: '$platforms.name' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        recentPublications: publishedContents,
        stats: stats[0] || {
          totalPublished: 0,
          totalWords: 0,
          totalRevenue: 0,
          platforms: []
        },
        platforms: [
          { name: '起点中文网', status: 'connected', lastPublish: '2026-03-03T22:30:00Z' },
          { name: '晋江文学城', status: 'connected', lastPublish: '2026-03-03T21:45:00Z' },
          { name: '番茄小说', status: 'connected', lastPublish: '2026-03-03T23:15:00Z' },
          { name: '纵横中文网', status: 'pending', lastPublish: null }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 收益统计端点
app.get('/api/revenue/stats', async (req, res) => {
  try {
    // 获取最近7天的收益
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyRevenue = await Content.aggregate([
      {
        $match: {
          'revenue.breakdown.date': { $gte: sevenDaysAgo },
          'revenue.total': { $gt: 0 }
        }
      },
      { $unwind: '$revenue.breakdown' },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$revenue.breakdown.date' }
          },
          revenue: { $sum: '$revenue.breakdown.amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // 平台收益分布
    const platformRevenue = await Content.aggregate([
      { $unwind: '$revenue.breakdown' },
      {
        $group: {
          _id: '$revenue.breakdown.platform',
          revenue: { $sum: '$revenue.breakdown.amount' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
    
    // 总收益
    const totalStats = await Content.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue.total' },
          contentCount: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        daily: dailyRevenue.map(item => ({
          date: item._id,
          revenue: item.revenue
        })),
        platforms: platformRevenue.map(item => ({
          name: item._id,
          revenue: item.revenue
        })),
        total: totalStats[0]?.totalRevenue || 0,
        contentCount: totalStats[0]?.contentCount || 0,
        currency: 'CNY'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// QVeris工具API
const qverisRouter = express.Router();

// 搜索工具
qverisRouter.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!process.env.QVERIS_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'QVERIS_API_KEY未配置'
      });
    }
    
    const qverisClient = new QVerisClient();
    const results = await qverisClient.searchTools(query);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 执行工具
qverisRouter.post('/execute/:toolId', async (req, res) => {
  try {
    const { toolId } = req.params;
    const params = req.body;
    
    if (!process.env.QVERIS_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'QVERIS_API_KEY未配置'
      });
    }
    
    const qverisClient = new QVerisClient();
    const result = await qverisClient.executeTool(toolId, params);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 注册路由
app.use('/api/contents', contentRouter);
app.use('/api/publishing', publishRouter);
app.use('/api/qveris', qverisRouter);

// 系统管理端点
app.get('/api/system/stats', async (req, res) => {
  try {
    const dbStats = await database.getStats();
    
    res.json({
      success: true,
      data: {
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          platform: process.platform,
          node: process.version
        },
        database: dbStats,
        services: {
          database: database.isConnected ? 'connected' : 'disconnected',
          qveris: process.env.QVERIS_API_KEY ? 'configured' : 'not_configured'
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 错误处理
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found',
    path: req.url,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 启动服务器
async function startServer() {
  try {
    // 初始化服务
    await initializeServices();
    
    app.listen(PORT, () => {
      console.log(`🚀 PanGu AI Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 API Status: http://localhost:${PORT}/api/status`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${database.isConnected ? 'Connected' : 'Disconnected'}`);
      console.log(`🤖 QVeris: ${process.env.QVERIS_API_KEY ? 'Configured' : 'Not configured'}`);
    });
    
    // 优雅关闭
    process.on('SIGTERM', async () => {
      console.log('收到SIGTERM信号，正在关闭服务器...');
      await database.close();
      process.exit(0);
    });
    
    process.on('SIGINT', async () => {
      console.log('收到SIGINT信号，正在关闭服务器...');
      await database.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();