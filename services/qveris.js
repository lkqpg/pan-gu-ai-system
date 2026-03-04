const axios = require('axios');
const winston = require('winston');

// 配置日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

class QVerisClient {
  constructor() {
    this.apiKey = process.env.QVERIS_API_KEY;
    this.baseURL = process.env.QVERIS_API_URL || 'https://api.qveris.ai/v1';
    this.isInitialized = false;
    this.availableTools = [];
    
    // 创建axios实例
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PanGu-AI-System/1.0.0'
      }
    });
    
    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        logger.debug(`QVeris请求: ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('QVeris请求配置错误:', error);
        return Promise.reject(error);
      }
    );
    
    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        logger.debug(`QVeris响应: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          logger.error(`QVeris API错误: ${error.response.status}`, {
            url: error.config.url,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          logger.error('QVeris请求无响应:', error.message);
        } else {
          logger.error('QVeris请求配置错误:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }
  
  // 初始化客户端
  async initialize() {
    if (!this.apiKey) {
      logger.warn('QVeris API密钥未配置，QVeris功能将不可用');
      return false;
    }
    
    try {
      logger.info('初始化QVeris客户端...');
      
      // 测试API连接
      await this.testConnection();
      
      // 加载可用工具
      await this.loadAvailableTools();
      
      this.isInitialized = true;
      logger.info('✅ QVeris客户端初始化完成');
      return true;
      
    } catch (error) {
      logger.error('QVeris客户端初始化失败:', error);
      return false;
    }
  }
  
  // 测试API连接
  async testConnection() {
    try {
      logger.info('测试QVeris API连接...');
      
      // 尝试不同的端点
      const endpoints = [
        '/health',
        '/status',
        '/tools',
        '/categories'
      ];
      
      let connected = false;
      
      for (const endpoint of endpoints) {
        try {
          const response = await this.api.get(endpoint, { timeout: 5000 });
          if (response.status === 200) {
            logger.info(`✅ QVeris API连接成功: ${endpoint}`);
            connected = true;
            break;
          }
        } catch (error) {
          // 继续尝试下一个端点
          continue;
        }
      }
      
      if (!connected) {
        throw new Error('无法连接到任何QVeris API端点');
      }
      
      return true;
    } catch (error) {
      logger.warn('QVeris API连接测试失败，但客户端仍可运行（可能端点不同）');
      return false;
    }
  }
  
  // 加载可用工具
  async loadAvailableTools() {
    try {
      logger.info('加载QVeris可用工具...');
      
      // 尝试获取工具列表
      const response = await this.api.get('/tools');
      this.availableTools = response.data.tools || [];
      
      logger.info(`加载了 ${this.availableTools.length} 个可用工具`);
      return this.availableTools;
      
    } catch (error) {
      logger.warn('无法加载QVeris工具列表，使用默认工具集');
      
      // 默认工具集（模拟）
      this.availableTools = [
        {
          id: 'weather_forecast',
          name: '天气预报',
          description: '获取城市天气预报',
          category: 'weather',
          parameters: ['city', 'days']
        },
        {
          id: 'web_search',
          name: '网页搜索',
          description: '执行网页搜索',
          category: 'search',
          parameters: ['query', 'limit']
        },
        {
          id: 'stock_price',
          name: '股票价格',
          description: '获取股票实时价格',
          category: 'finance',
          parameters: ['symbol', 'interval']
        },
        {
          id: 'currency_exchange',
          name: '货币兑换',
          description: '货币汇率转换',
          category: 'finance',
          parameters: ['from', 'to', 'amount']
        },
        {
          id: 'text_summarize',
          name: '文本摘要',
          description: '生成文本摘要',
          category: 'text',
          parameters: ['text', 'length']
        }
      ];
      
      return this.availableTools;
    }
  }
  
  // 搜索工具
  async searchTools(query, category = null) {
    try {
      logger.info(`搜索工具: "${query}"${category ? ` (类别: ${category})` : ''}`);
      
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // 如果API可用，使用API搜索
      try {
        const response = await this.api.post('/tools/search', {
          query,
          category
        });
        
        return {
          success: true,
          query,
          results: response.data.tools || [],
          total: response.data.total || 0
        };
      } catch (apiError) {
        // API失败时使用本地搜索
        logger.warn('QVeris API搜索失败，使用本地搜索');
        return this.localSearchTools(query, category);
      }
      
    } catch (error) {
      logger.error('搜索工具失败:', error);
      return {
        success: false,
        error: error.message,
        query,
        results: [],
        total: 0
      };
    }
  }
  
  // 本地工具搜索（模拟）
  localSearchTools(query, category = null) {
    const searchTerms = query.toLowerCase().split(' ');
    
    const results = this.availableTools.filter(tool => {
      // 按类别过滤
      if (category && tool.category !== category) {
        return false;
      }
      
      // 按搜索词过滤
      const toolText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
      return searchTerms.some(term => toolText.includes(term));
    });
    
    return {
      success: true,
      query,
      results: results.map(tool => ({
        ...tool,
        score: Math.random() // 模拟相关性分数
      })),
      total: results.length
    };
  }
  
  // 执行工具
  async executeTool(toolId, params = {}) {
    try {
      logger.info(`执行工具: ${toolId}`, { params });
      
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // 检查工具是否存在
      const tool = this.availableTools.find(t => t.id === toolId);
      if (!tool) {
        throw new Error(`工具未找到: ${toolId}`);
      }
      
      // 如果API可用，使用API执行
      try {
        const response = await this.api.post(`/tools/${toolId}/execute`, params);
        
        return {
          success: true,
          toolId,
          toolName: tool.name,
          result: response.data.result || response.data,
          metadata: {
            executionTime: response.data.executionTime,
            creditsUsed: response.data.creditsUsed,
            timestamp: new Date().toISOString()
          }
        };
      } catch (apiError) {
        // API失败时使用模拟执行
        logger.warn('QVeris API执行失败，使用模拟执行');
        return this.mockExecuteTool(toolId, params);
      }
      
    } catch (error) {
      logger.error('执行工具失败:', error);
      return {
        success: false,
        toolId,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // 模拟工具执行
  mockExecuteTool(toolId, params) {
    logger.info(`模拟执行工具: ${toolId}`);
    
    // 模拟不同工具的执行结果
    const mockResults = {
      'weather_forecast': () => ({
        city: params.city || '北京',
        forecast: {
          today: { high: 25, low: 15, condition: '晴朗', humidity: '45%' },
          tomorrow: { high: 23, low: 16, condition: '多云', humidity: '55%' },
          dayAfter: { high: 22, low: 14, condition: '小雨', humidity: '75%' }
        },
        unit: 'celsius',
        updatedAt: new Date().toISOString()
      }),
      
      'web_search': () => ({
        query: params.query || '人工智能',
        results: Array.from({ length: params.limit || 5 }, (_, i) => ({
          title: `关于${params.query || '人工智能'}的第${i + 1}个结果`,
          url: `https://example.com/result-${i + 1}`,
          snippet: `这是关于${params.query || '人工智能'}的摘要内容...`,
          relevance: 0.9 - (i * 0.1)
        })),
        totalResults: 1000,
        searchTime: '0.45秒'
      }),
      
      'stock_price': () => ({
        symbol: params.symbol || 'AAPL',
        price: 175.25 + (Math.random() * 10 - 5),
        change: (Math.random() * 5 - 2.5).toFixed(2),
        changePercent: ((Math.random() * 3 - 1.5).toFixed(2)) + '%',
        volume: Math.floor(Math.random() * 10000000),
        marketCap: '2.8T',
        timestamp: new Date().toISOString()
      }),
      
      'currency_exchange': () => ({
        from: params.from || 'USD',
        to: params.to || 'CNY',
        amount: params.amount || 1,
        rate: 7.25 + (Math.random() * 0.1 - 0.05),
        converted: (params.amount || 1) * (7.25 + (Math.random() * 0.1 - 0.05)),
        timestamp: new Date().toISOString()
      }),
      
      'text_summarize': () => ({
        originalLength: params.text?.length || 0,
        summary: params.text ? 
          `摘要：${params.text.substring(0, Math.min(200, params.text.length))}...` :
          '请输入要摘要的文本',
        summaryLength: Math.min(200, params.text?.length || 0),
        reduction: params.text ? 
          ((1 - Math.min(200, params.text.length) / params.text.length) * 100).toFixed(1) + '%' :
          '0%'
      })
    };
    
    const resultFunction = mockResults[toolId];
    if (!resultFunction) {
      throw new Error(`未知工具: ${toolId}`);
    }
    
    return {
      success: true,
      toolId,
      toolName: this.availableTools.find(t => t.id === toolId)?.name || toolId,
      result: resultFunction(),
      metadata: {
        executionTime: Math.random() * 100 + 50, // 50-150ms
        creditsUsed: 1,
        timestamp: new Date().toISOString(),
        simulated: true
      }
    };
  }
  
  // AI内容生成（使用QVeris）
  async generateContent(options = {}) {
    try {
      const { prompt, maxLength = 2000, style = 'creative' } = options;
      
      logger.info(`生成AI内容: "${prompt.substring(0, 50)}..."`);
      
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // 尝试使用文本生成工具
      try {
        const result = await this.executeTool('text_generation', {
          prompt,
          max_length: maxLength,
          style,
          temperature: 0.7
        });
        
        return {
          success: true,
          content: result.result.text || result.result,
          length: result.result.length || (result.result.text?.length || 0),
          model: 'qveris-ai',
          prompt,
          timestamp: new Date().toISOString()
        };
      } catch (toolError) {
        // 如果没有文本生成工具，使用模拟
        logger.warn('文本生成工具不可用，使用模拟生成');
        return this.mockGenerateContent(options);
      }
      
    } catch (error) {
      logger.error('生成AI内容失败:', error);
      return this.mockGenerateContent(options);
    }
  }
  
  // 模拟AI内容生成
  mockGenerateContent(options = {}) {
    const { prompt, maxLength = 2000, style = 'creative' } = options;
    
    const styles = {
      creative: '文笔优美，富有想象力',
      formal: '正式严谨，逻辑清晰',
      casual: '轻松随意，口语化',
      poetic: '富有诗意，语言优美'
    };
    
    const styleDesc = styles[style] || styles.creative;
    
    const content = `这是根据提示"${prompt}"生成的内容（${styleDesc}）：\n\n` +
      `在一个充满无限可能的世界里，${prompt}的故事正在展开。人工智能与人类共同创造着未来，` +
      `每一个选择都影响着世界的走向。在这个故事中，我们将探索${prompt}的深层含义，` +
      `以及它对人类社会的深远影响。\n\n` +
      `（这是由盘古AI系统生成的模拟内容，实际系统将使用QVeris AI生成更高质量的内容）`;
    
    // 确保内容长度
    const finalContent = content.length > maxLength ? 
      content.substring(0, maxLength) + '...' : content;
    
    return {
      success: true,
      content: finalContent,
      length: finalContent.length,
      model: 'pan-gu-ai-mock',
      prompt,
      style,
      timestamp: new Date().toISOString(),
      simulated: true
    };
  }
  
  // 获取客户端状态
  getStatus() {
    return {
      initialized: this.isInitialized,
      apiKeyConfigured: !!this.apiKey,
      availableTools: this.availableTools.length,
      baseURL: this.baseURL,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { QVerisClient };