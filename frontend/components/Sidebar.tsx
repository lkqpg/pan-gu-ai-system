'use client'

import { useState } from 'react'
import {
  FiHome,
  FiFileText,
  FiUpload,
  FiDollarSign,
  FiBarChart2,
  FiCpu,
  FiGlobe,
  FiUsers
} from 'react-icons/fi'

const menuItems = [
  { icon: FiHome, label: '仪表盘', active: true },
  { icon: FiFileText, label: 'AI写作', badge: '新' },
  { icon: FiUpload, label: '发布管理', badge: '15' },
  { icon: FiDollarSign, label: '收益统计' },
  { icon: FiBarChart2, label: '数据分析' },
  { icon: FiCpu, label: 'AI模型' },
  { icon: FiGlobe, label: '平台集成' },
  { icon: FiUsers, label: '读者分析' },
]

const platformStatus = [
  { name: '起点中文网', status: 'connected', color: 'bg-green-500' },
  { name: '晋江文学城', status: 'connected', color: 'bg-green-500' },
  { name: '番茄小说', status: 'connected', color: 'bg-green-500' },
  { name: '纵横中文网', status: 'pending', color: 'bg-yellow-500' },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('仪表盘')

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            主要功能
          </h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => setActiveItem(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.label
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            平台状态
          </h2>
          <div className="space-y-3">
            {platformStatus.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                  <span className="text-sm text-gray-700">{platform.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  platform.status === 'connected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {platform.status === 'connected' ? '已连接' : '待连接'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">今日收益</h3>
          <p className="text-2xl font-bold text-blue-600">¥15.00</p>
          <p className="text-xs text-blue-700 mt-1">较昨日 +12.5%</p>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700">累计收益: ¥45.80</p>
          </div>
        </div>
      </nav>
    </aside>
  )
}