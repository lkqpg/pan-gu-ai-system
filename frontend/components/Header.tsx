'use client'

import { useState } from 'react'
import { FiMenu, FiBell, FiSettings, FiActivity } from 'react-icons/fi'

export default function Header() {
  const [notifications, setNotifications] = useState(3)

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <FiActivity className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800">盘古AI创世系统</h1>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              运行中
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <FiBell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">系统状态</p>
              <p className="text-xs text-gray-500">7x24小时自动化运行</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <FiSettings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}