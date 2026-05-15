import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { Home, Compass, Map, Sparkles, User, BookOpen, MessageCircle } from 'lucide-react'

const tabs = [
  { icon: Home,     path: '/home',    label: { kr: '홈',     en: 'Home',    mn: 'Нүүр'    } },
  { icon: Compass,  path: '/explore', label: { kr: '탐색',   en: 'Explore', mn: 'Хайлт'   } },
  { icon: Map,      path: '/map',     label: { kr: '지도',   en: 'Map',     mn: 'Зураг'   } },
  { icon: Sparkles, path: '/planner', label: { kr: 'AI 플래너', en: 'AI',   mn: 'AI'      } },
  { icon: BookOpen, path: '/blog',    label: { kr: '블로그', en: 'Blog',    mn: 'Блог'    } },
  { icon: User,     path: '/profile', label: { kr: '프로필', en: 'Profile', mn: 'Профайл' } },
]

export default function MobileLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLang()

  const isChatRoute = location.pathname === '/chat'

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      <div className="flex-1 pb-20">
        {children}
      </div>

      {/* 챗봇 floating 버튼 — chat 화면 자체에서는 숨김 */}
      {!isChatRoute && (
        <button
          onClick={() => navigate('/chat')}
          aria-label="AI Chatbot"
          className="fixed bottom-24 right-4 z-[60] w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
        >
          <MessageCircle size={22} className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles size={9} className="text-yellow-900" />
          </span>
        </button>
      )}

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* 블러 배경 */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-t border-gray-100" />
        <div className="relative flex items-center justify-around px-2 pb-safe pt-1 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = location.pathname === tab.path
            const isAI = tab.path === '/planner'
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 flex-1 py-1 relative"
              >
                {isAI ? (
                  /* AI 플래너 특별 스타일 */
                  <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
                    active
                      ? 'bg-primary shadow-md shadow-primary/30'
                      : 'bg-primary/10'
                  }`}>
                    <Icon size={18} className={active ? 'text-white' : 'text-primary'} />
                  </div>
                ) : (
                  <div className="relative">
                    <Icon
                      size={23}
                      className={`transition-all ${active ? 'text-primary' : 'text-gray-400'}`}
                      strokeWidth={active ? 2.5 : 1.8}
                    />
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                )}
                <span className={`text-[10px] font-semibold transition-all ${
                  active
                    ? isAI ? 'text-primary' : 'text-primary'
                    : 'text-gray-400'
                }`}>
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
