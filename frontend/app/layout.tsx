import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '盘古AI创世系统',
  description: '完全自主的AI写作和自动发布系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
          <footer className="bg-white border-t py-4 px-6 text-center text-gray-500 text-sm">
            <p>盘古AI创世系统 © 2026 - 零成本运营，收益自动化</p>
          </footer>
        </div>
      </body>
    </html>
  )
}