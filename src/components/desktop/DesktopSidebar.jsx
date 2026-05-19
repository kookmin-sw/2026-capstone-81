import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { Home, Map, BookOpen, Heart, CalendarDays, Briefcase, User } from 'lucide-react'
import { NomadLogoIcon, NomadLogoText } from '../NomadLogo'

const navItems = [
  { icon: Home,         path: '/home',    label: { kr: '홈',        en: 'Home',       mn: 'Нүүр'         } },
  { icon: Map,          path: '/map',     label: { kr: '지도',      en: 'Map',        mn: 'Газрын зураг' } },
  { icon: CalendarDays, path: '/planner', label: { kr: 'AI 플래너', en: 'AI Planner', mn: 'Төлөвлөгч'    } },
  { icon: Heart,        path: '/saved',   label: { kr: '저장',      en: 'Saved',      mn: 'Хадгалсан'    } },
  { icon: Briefcase,    path: '/saved',   label: { kr: '내 여행',   en: 'My Trips',   mn: 'Миний аяллууд'} },
  { icon: BookOpen,     path: '/blog',    label: { kr: '블로그',    en: 'Blog',       mn: 'Тэмдэглэл'    } },
  { icon: User,         path: '/profile', label: { kr: '프로필',    en: 'Profile',    mn: 'Профайл'      } },
]

export default function DesktopSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLang()
  const { user } = useAuth()

  const isActive = path => location.pathname === path

  return (
    <div className="w-56 flex-shrink-0 flex flex-col bg-white border-r border-gray-100 h-screen overflow-y-auto">

      {/* 로고 */}
      <button
        onClick={() => navigate('/home')}
        className="flex items-center gap-2.5 px-5 py-5 hover:opacity-80 transition-opacity"
      >
        <NomadLogoIcon size={32} />
        <NomadLogoText className="text-lg" />
      </button>

      {/* 메인 네비 */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, path, label }) => {
          const active = isActive(path) && !(path === '/home' && location.pathname !== '/home')
          return (
            <button
              key={path + label.kr}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all rounded-xl ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={active ? { borderLeft: '3px solid #2F855A', paddingLeft: 'calc(0.75rem - 3px)' } : {}}
            >
              <Icon size={17} className={active ? 'text-primary' : 'text-gray-400'} />
              <span className="truncate">{label[lang]}</span>
            </button>
          )
        })}
      </nav>

      {/* 유저 */}
      {user && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
              : <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {user.displayName?.[0] ?? 'U'}
                </div>
            }
            <span className="text-xs font-semibold text-gray-700 truncate">{user.displayName ?? user.email}</span>
          </div>
        </div>
      )}

    </div>
  )
}
