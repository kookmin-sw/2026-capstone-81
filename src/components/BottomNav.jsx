import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Grid3X3, MapPin, BookOpen, MessageCircle, User } from 'lucide-react'
import { useLang } from '../context/LangContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLang()

  const tabs = [
    { path: '/explore', icon: Grid3X3, label: lang === 'kr' ? '카테고리' : lang === 'mn' ? 'Ангилал' : 'Category' },
    { path: '/map', icon: MapPin, label: lang === 'kr' ? '내 주변' : lang === 'mn' ? 'Ойролцоо' : 'Nearby' },
    { path: '/home', icon: Home, label: lang === 'kr' ? '홈' : lang === 'mn' ? 'Нүүр' : 'Home' },
    { path: '/blog', icon: BookOpen, label: lang === 'kr' ? '블로그' : lang === 'mn' ? 'Блог' : 'Blog' },
    { path: '/chat', icon: MessageCircle, label: lang === 'kr' ? 'AI챗' : lang === 'mn' ? 'AI чат' : 'AI Chat' },
    { path: '/profile', icon: User, label: lang === 'kr' ? '마이페이지' : lang === 'mn' ? 'Миний хуудас' : 'My Page' },
  ]

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button key={path} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-3 py-1 relative">
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-primary' : 'text-gray-400'} />
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
