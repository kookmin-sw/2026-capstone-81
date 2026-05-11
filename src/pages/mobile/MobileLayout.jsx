import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { Home, Search, Map, BookOpen, User, MessageCircle, Sparkles } from 'lucide-react'

export default function MobileLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLang()

  const tabs = [
    { icon: Home, label: { kr: '홈', en: 'Home', mn: 'Нүүр' }, path: '/home' },
    { icon: Search, label: { kr: '검색', en: 'Search', mn: 'Хайх' }, path: '/explore' },
    { icon: BookOpen, label: { kr: '블로그', en: 'Blog', mn: 'Блог' }, path: '/blog' },
    { icon: Map, label: { kr: '지도', en: 'Map', mn: 'Газар' }, path: '/map' },
    { icon: User, label: { kr: '내 계정', en: 'My', mn: 'Миний' }, path: '/profile' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      <div className="flex-1 pb-20">
        {children}
      </div>

      {/* 플로팅 챗봇 버튼 */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-24 right-4 z-[60] w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
      >
        <MessageCircle size={22} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <Sparkles size={9} className="text-yellow-900" />
        </span>
      </button>

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 px-3 py-1"
              >
                <Icon
                  size={22}
                  className={isActive ? 'text-primary' : 'text-gray-400'}
                  fill={isActive && tab.icon === Home ? 'currentColor' : 'none'}
                />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {tab.label[lang]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
