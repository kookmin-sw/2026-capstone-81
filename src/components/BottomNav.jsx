import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Compass, Map, Sparkles, BookOpen, User } from 'lucide-react'
import { useLang } from '../context/LangContext'

// Same tab list as MobileLayout so the bottom nav stays consistent across the
// app — AIChat (which uses this component) was showing the older 5-tab layout
// (Category / Nearby / Home / Blog / My Page) and that confused users.
const tabs = [
  { icon: Home,     path: '/home',    label: { kr: '홈',        en: 'Home',    mn: 'Нүүр'    } },
  { icon: Compass,  path: '/explore', label: { kr: '탐색',      en: 'Explore', mn: 'Хайлт'   } },
  { icon: Map,      path: '/map',     label: { kr: '지도',      en: 'Map',     mn: 'Зураг'   } },
  { icon: Sparkles, path: '/planner', label: { kr: 'AI 플래너', en: 'AI',      mn: 'AI'      } },
  { icon: BookOpen, path: '/blog',    label: { kr: '블로그',    en: 'Blog',    mn: 'Блог'    } },
  { icon: User,     path: '/profile', label: { kr: '프로필',    en: 'Profile', mn: 'Профайл' } },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLang()

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          const isAI = path === '/planner'
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 relative"
            >
              {isAI ? (
                <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
                  active ? 'bg-primary shadow-md shadow-primary/30' : 'bg-primary/10'
                }`}>
                  <Icon size={18} className={active ? 'text-white' : 'text-primary'} />
                </div>
              ) : (
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-primary' : 'text-gray-400'}
                />
              )}
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-gray-400'}`}>
                {label[lang] ?? label.kr}
              </span>
              {active && !isAI && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
