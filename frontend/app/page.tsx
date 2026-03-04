'use client'

import { useState, useEffect } from 'react'
import {
  FiFileText,
  FiUpload,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'
import RevenueChart from '@/components/RevenueChart'
import PlatformStatus from '@/components/PlatformStatus'
import RecentActivity from '@/components/RecentActivity'

const stats = [
  {
    title: '今日创作',
    value: '8,542',
    change: '+12%',
    icon: FiFileText,
    color: 'bg-blue-500',
    description: '字数'
  },
  {
    title: '发布作品',
    value: '15',
    change: '+3',
    icon: FiUpload,
    color: 'bg-green-500',
    description: '篇数'
  },
  {
    title: '今日收益',
    value: '¥15.00',
    change: '+12.5%',
    icon: FiDollarSign,
    color: 'bg-purple-500',
    description: '人民币'
  },
  {
    title: '读者增长',
    value: '1,234',
    change: '+8%',
    icon: FiUsers,
    color: 'bg-orange-500',
    description: '今日新增'
  }
]

const systemHealth = [
  { label: 'AI写作引擎', status: 'healthy', icon: FiCheckCircle },
  { label: '发布系统', status: 'healthy', icon: FiCheckCircle },
  { label: '数据库', status: 'healthy', icon: FiCheckCircle },
  { label: '监控服务', status: 'warning', icon: FiAlertCircle },
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载系统数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">欢迎使用盘古AI创世系统</h1>
            <p className="mt-2 opacity-90">完全自主的AI写作和自动发布系统，7x24小时为您创造收益</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiClock className="w-4 h-4" />
                <span className="text-sm">运行时间: 48小时</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-sm">累计收益: ¥45.80</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm">零成本运营</p>
              <p className="text-2xl font-bold mt-1">100% 自动化</p>
            </div>
          </div>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-500 text-sm ml-2">较昨日</span>
            </div>
          </div>
        ))}
      </div>

      {/* 图表和状态区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 收益图表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">收益趋势</h2>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>最近7天</option>
                <option>最近30天</option>
                <option>最近90天</option>
              </select>
            </div>
            <RevenueChart />
          </div>
        </div>

        {/* 系统健康状态 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">系统健康状态</h2>
          <div className="space-y-4">
            {systemHealth.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${
                    item.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.status === 'healthy'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status === 'healthy' ? '正常' : '需关注'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">整体健康度</span>
              <span className="text-2xl font-bold text-green-600">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 平台状态和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformStatus />
        <RecentActivity />
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg p-4 text-center transition-colors">
            <FiFileText className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">开始创作</span>
          </button>
          <button className="bg-green-50 text-green-600 hover:bg-green-100 rounded-lg p-4 text-center transition-colors">
            <FiUpload className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">批量发布</span>
          </button>
          <button className="bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg p-4 text-center transition-colors">
            <FiDollarSign className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">收益提现</span>
          </button>
          <button className="bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg p-4 text-center transition-colors">
            <FiTrendingUp className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">数据分析</span>
          </button>
        </div>
      </div>
    </div>
  )
}