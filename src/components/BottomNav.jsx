import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, BookOpen, Briefcase, User } from 'lucide-react'
import { useLang } from '../context/LangContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tr } = useLang()

  const tabs = [
    { path: '/home', icon: Home, label: 'nav_home' },
    { path: '/explore', icon: Search, label: 'nav_explore' },
    { path: '/planner', icon: Briefcase, label: 'nav_trip' },
    { path: '/blog', icon: BookOpen, label: 'nav_blog' },
    { path: '/profile', icon: User, label: 'nav_profile' },
  ]

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || (path === '/blog' && location.pathname.startsWith('/blog'))
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-3 py-1 relative"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-primary' : 'text-gray-400'}
              />
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-gray-400'}`}>
                {tr(label)}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
