'use client'

import { FiFileText, FiUpload, FiDollarSign, FiUserPlus, FiMessageSquare } from 'react-icons/fi'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const activities = [
  {
    type: 'publish',
    icon: FiUpload,
    title: '新作品发布成功',
    description: '《AI创世记》已发布到起点中文网',
    platform: '起点中文网',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
    color: 'bg-green-100 text-green-800'
  },
  {
    type: 'revenue',
    icon: FiDollarSign,
    title: '收益到账',
    description: '收到读者打赏 ¥8.50',
    platform: '晋江文学城',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    color: 'bg-purple-100 text-purple-800'
  },
  {
    type: 'creation',
    icon: FiFileText,
    title: 'AI创作完成',
    description: '生成新章节《未来之战》，字数 3,542',
    platform: 'AI写作引擎',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3小时前
    color: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'reader',
    icon: FiUserPlus,
    title: '读者增长',
    description: '新增 234 位读者关注',
    platform: '番茄小说',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
    color: 'bg-orange-100 text-orange-800'
  },
  {
    type: 'comment',
    icon: FiMessageSquare,
    title: '新评论',
    description: '收到读者评论："故事很精彩，期待更新！"',
    platform: '起点中文网',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
    color: 'bg-indigo-100 text-indigo-800'
  }
]

export default function RecentActivity() {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins}分钟前`
    } else if (diffHours < 24) {
      return `${diffHours}小时前`
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return format(date, 'MM/dd HH:mm', { locale: zhCN })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">最近活动</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          查看全部
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800 truncate">{activity.title}</h4>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatTime(activity.time)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {activity.platform}
                </span>
                {activity.type === 'revenue' && (
                  <span className="ml-2 text-xs font-medium text-green-600">
                    +¥8.50
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">今日活动总数</p>
            <p className="text-2xl font-bold text-gray-800">24 次</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">系统活跃度</p>
            <p className="text-2xl font-bold text-green-600">98%</p>
          </div>
        </div>
      </div>
    </div>
  )
}