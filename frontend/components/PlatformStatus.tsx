'use client'

import { FiExternalLink, FiRefreshCw } from 'react-icons/fi'

const platforms = [
  {
    name: '起点中文网',
    status: 'connected',
    revenue: '¥25.40',
    published: 8,
    readers: '12.4k',
    color: 'bg-red-100 text-red-800',
    lastSync: '10分钟前'
  },
  {
    name: '晋江文学城',
    status: 'connected',
    revenue: '¥12.60',
    published: 5,
    readers: '8.7k',
    color: 'bg-pink-100 text-pink-800',
    lastSync: '15分钟前'
  },
  {
    name: '番茄小说',
    status: 'connected',
    revenue: '¥7.80',
    published: 2,
    readers: '5.2k',
    color: 'bg-orange-100 text-orange-800',
    lastSync: '5分钟前'
  },
  {
    name: '纵横中文网',
    status: 'pending',
    revenue: '¥0.00',
    published: 0,
    readers: '0',
    color: 'bg-gray-100 text-gray-800',
    lastSync: '待连接'
  }
]

export default function PlatformStatus() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">平台状态</h2>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <FiRefreshCw className="w-4 h-4" />
          <span>刷新状态</span>
        </button>
      </div>

      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${platform.status === 'connected' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <h3 className="font-medium">{platform.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${platform.color}`}>
                  {platform.status === 'connected' ? '已连接' : '待连接'}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <FiExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">收益</p>
                <p className="text-lg font-semibold">{platform.revenue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">发布作品</p>
                <p className="text-lg font-semibold">{platform.published} 篇</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">读者数</p>
                <p className="text-lg font-semibold">{platform.readers}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <span className="text-xs text-gray-500">最后同步: {platform.lastSync}</span>
              {platform.status === 'connected' ? (
                <span className="text-xs text-green-600 font-medium">✓ 自动同步中</span>
              ) : (
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  立即连接
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">平台总收益</p>
            <p className="text-2xl font-bold text-gray-800">¥45.80</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">总发布作品</p>
            <p className="text-2xl font-bold text-gray-800">15 篇</p>
          </div>
        </div>
      </div>
    </div>
  )
}