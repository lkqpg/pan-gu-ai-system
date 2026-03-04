const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  // 基础信息
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: ['玄幻', '都市', '科幻', '言情', '历史', '其他'],
    default: '玄幻'
  },
  
  // 元数据
  wordCount: {
    type: Number,
    required: true,
    min: 0
  },
  language: {
    type: String,
    default: 'zh-CN'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // AI生成信息
  aiModel: {
    type: String,
    default: 'pan-gu-ai'
  },
  prompt: {
    type: String
  },
  generationParams: {
    temperature: Number,
    maxTokens: Number,
    topP: Number
  },
  
  // 发布状态
  published: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date
  },
  platforms: [{
    name: String,
    platformId: String,
    url: String,
    publishedAt: Date,
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'failed'],
      default: 'draft'
    }
  }],
  
  // 收益信息
  revenue: {
    total: {
      type: Number,
      default: 0
    },
    breakdown: [{
      platform: String,
      amount: Number,
      currency: {
        type: String,
        default: 'CNY'
      },
      date: Date
    }]
  },
  
  // 读者互动
  readers: {
    count: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  
  // 系统字段
  createdBy: {
    type: String,
    default: 'pan-gu-ai-system'
  },
  version: {
    type: Number,
    default: 1
  },
  
  // 时间戳
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
contentSchema.index({ title: 'text', content: 'text' });
contentSchema.index({ genre: 1, createdAt: -1 });
contentSchema.index({ published: 1, publishDate: -1 });
contentSchema.index({ 'revenue.total': -1 });
contentSchema.index({ 'readers.count': -1 });

// 虚拟字段
contentSchema.virtual('estimatedReadingTime').get(function() {
  const wordsPerMinute = 200;
  return Math.ceil(this.wordCount / wordsPerMinute);
});

contentSchema.virtual('revenuePerWord').get(function() {
  if (this.wordCount === 0) return 0;
  return this.revenue.total / this.wordCount;
});

// 中间件：保存时更新updatedAt
contentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 静态方法
contentSchema.statics.findByGenre = function(genre, limit = 10) {
  return this.find({ genre })
    .sort({ createdAt: -1 })
    .limit(limit);
};

contentSchema.statics.getRevenueStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        'revenue.total': { $gt: 0 }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$revenue.total' },
        avgRevenuePerContent: { $avg: '$revenue.total' },
        contentCount: { $sum: 1 },
        totalWords: { $sum: '$wordCount' }
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        avgRevenuePerContent: 1,
        contentCount: 1,
        totalWords: 1,
        revenuePerWord: { $divide: ['$totalRevenue', '$totalWords'] }
      }
    }
  ]);
};

contentSchema.statics.getTopPerformers = function(limit = 5) {
  return this.find({ 'revenue.total': { $gt: 0 } })
    .sort({ 'revenue.total': -1 })
    .limit(limit)
    .select('title genre wordCount revenue.total readers.count');
};

// 实例方法
contentSchema.methods.addRevenue = function(platform, amount, currency = 'CNY') {
  this.revenue.total += amount;
  this.revenue.breakdown.push({
    platform,
    amount,
    currency,
    date: new Date()
  });
  return this.save();
};

contentSchema.methods.publishToPlatform = function(platformName, platformId, url) {
  const platformIndex = this.platforms.findIndex(p => p.name === platformName);
  
  if (platformIndex >= 0) {
    // 更新现有平台
    this.platforms[platformIndex].platformId = platformId;
    this.platforms[platformIndex].url = url;
    this.platforms[platformIndex].publishedAt = new Date();
    this.platforms[platformIndex].status = 'published';
  } else {
    // 添加新平台
    this.platforms.push({
      name: platformName,
      platformId,
      url,
      publishedAt: new Date(),
      status: 'published'
    });
  }
  
  this.published = true;
  this.publishDate = new Date();
  
  return this.save();
};

contentSchema.methods.updateReaderStats = function(likes = 0, comments = 0, shares = 0) {
  this.readers.likes += likes;
  this.readers.comments += comments;
  this.readers.shares += shares;
  return this.save();
};

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;