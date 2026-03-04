const mongoose = require('mongoose');
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

// 连接选项
const connectionOptions = {
  maxPoolSize: 10, // 连接池大小
  serverSelectionTimeoutMS: 5000, // 服务器选择超时
  socketTimeoutMS: 45000, // socket超时
  family: 4, // 使用IPv4
  retryWrites: true,
  w: 'majority'
};

// 重试配置
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1秒
  currentRetry: 0
};

class Database {
  constructor() {
    this.isConnected = false;
    this.connection = null;
    this.models = {};
  }

  // 连接到MongoDB
  async connect(uri = process.env.MONGODB_URI) {
    if (!uri) {
      logger.error('MongoDB连接URI未设置，请检查环境变量MONGODB_URI');
      throw new Error('MongoDB URI is required');
    }

    // 隐藏密码的URI用于日志
    const safeUri = uri.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    logger.info(`正在连接到MongoDB: ${safeUri}`);

    try {
      // 设置Mongoose配置
      mongoose.set('strictQuery', true);
      
      // 连接事件监听
      mongoose.connection.on('connected', () => {
        logger.info('✅ MongoDB连接成功');
        this.isConnected = true;
      });

      mongoose.connection.on('error', (err) => {
        logger.error('❌ MongoDB连接错误:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️ MongoDB连接断开');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('🔄 MongoDB重新连接成功');
        this.isConnected = true;
      });

      // 进程退出时关闭连接
      process.on('SIGINT', this.close.bind(this));
      process.on('SIGTERM', this.close.bind(this));

      // 尝试连接
      this.connection = await mongoose.connect(uri, connectionOptions);
      
      logger.info('🎉 MongoDB已就绪');
      return this.connection;

    } catch (error) {
      logger.error('连接MongoDB失败:', error);
      
      // 重试逻辑
      if (retryConfig.currentRetry < retryConfig.maxRetries) {
        retryConfig.currentRetry++;
        logger.info(`第${retryConfig.currentRetry}次重试连接...`);
        
        await new Promise(resolve => 
          setTimeout(resolve, retryConfig.retryDelay * retryConfig.currentRetry)
        );
        
        return this.connect(uri);
      }
      
      throw error;
    }
  }

  // 关闭连接
  async close() {
    if (this.connection) {
      try {
        await mongoose.disconnect();
        logger.info('MongoDB连接已关闭');
        this.isConnected = false;
        this.connection = null;
      } catch (error) {
        logger.error('关闭MongoDB连接时出错:', error);
      }
    }
  }

  // 检查连接状态
  async healthCheck() {
    if (!this.isConnected) {
      return {
        status: 'disconnected',
        timestamp: new Date().toISOString(),
        message: '数据库未连接'
      };
    }

    try {
      // 执行简单的ping命令
      const startTime = Date.now();
      await mongoose.connection.db.command({ ping: 1 });
      const responseTime = Date.now() - startTime;

      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        database: mongoose.connection.db.databaseName,
        collections: await mongoose.connection.db.listCollections().toArray(),
        stats: await this.getStats()
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }

  // 获取数据库统计信息
  async getStats() {
    try {
      const db = mongoose.connection.db;
      const adminDb = db.admin();
      
      const serverStatus = await adminDb.serverStatus();
      const dbStats = await db.stats();
      
      return {
        host: serverStatus.host,
        version: serverStatus.version,
        connections: serverStatus.connections,
        uptime: serverStatus.uptime,
        memory: serverStatus.mem,
        network: serverStatus.network,
        storage: {
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexSize: dbStats.indexSize,
          fileSize: dbStats.fileSize
        },
        collections: dbStats.collections,
        objects: dbStats.objects,
        indexes: dbStats.indexes
      };
    } catch (error) {
      logger.warn('获取数据库统计信息失败:', error);
      return { error: '无法获取统计信息' };
    }
  }

  // 初始化数据库（创建索引等）
  async initialize() {
    logger.info('初始化数据库...');
    
    try {
      // 这里可以添加数据库初始化逻辑
      // 例如：创建索引、初始化数据等
      
      logger.info('数据库初始化完成');
      return { success: true, message: 'Database initialized' };
    } catch (error) {
      logger.error('数据库初始化失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 备份数据库（模拟）
  async backup() {
    logger.info('开始数据库备份...');
    
    try {
      // 在实际应用中，这里会执行备份命令
      // 例如：mongodump或云数据库的备份API
      
      const backupInfo = {
        timestamp: new Date().toISOString(),
        database: mongoose.connection.db.databaseName,
        status: 'backup_initiated',
        estimatedSize: 'unknown',
        location: 'cloud_backup_service'
      };
      
      logger.info('数据库备份已启动:', backupInfo);
      return backupInfo;
    } catch (error) {
      logger.error('数据库备份失败:', error);
      throw error;
    }
  }

  // 清理旧数据
  async cleanupOldData(daysToKeep = 30) {
    logger.info(`清理${daysToKeep}天前的旧数据...`);
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      // 这里可以添加具体的清理逻辑
      // 例如：删除过期的会话、日志等
      
      const result = {
        timestamp: new Date().toISOString(),
        cutoffDate: cutoffDate.toISOString(),
        daysToKeep,
        cleanedCollections: [],
        totalDeleted: 0
      };
      
      logger.info('数据清理完成:', result);
      return result;
    } catch (error) {
      logger.error('数据清理失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
const database = new Database();

module.exports = database;