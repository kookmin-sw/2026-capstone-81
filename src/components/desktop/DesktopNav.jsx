import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, User } from 'lucide-react'
import { NomadLogoIcon, NomadLogoText } from '../NomadLogo'

const LANGS = [
  { code: 'kr', label: 'KR' },
  { code: 'en', label: 'EN' },
  { code: 'mn', label: 'MN' },
]

export default function DesktopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, setLang, tr } = useLang()
  const { user } = useAuth()

  const navLinks = [
    { path: '/explore', label: lang === 'kr' ? '카테고리' : lang === 'mn' ? 'Ангилал' : 'Category' },
    { path: '/map', label: lang === 'kr' ? '지도' : lang === 'mn' ? 'Газрын зураг' : 'Map' },
    { path: '/home', label: lang === 'kr' ? '홈' : lang === 'mn' ? 'Нүүр' : 'Home' },
    { path: '/blog', label: lang === 'kr' ? '블로그' : lang === 'mn' ? 'Блог' : 'Blog' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('/home')} className="flex items-center gap-2.5 group flex-shrink-0">
          <NomadLogoIcon size={38} />
          <NomadLogoText className="text-xl" />
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                isActive(path)
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
              {isActive(path) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-1">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  lang === code
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* AI CTA */}
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-primary/25 hover:bg-primary-dark transition-all hover:-translate-y-0.5"
          >
            <Sparkles size={14} />
            {lang === 'kr' ? 'AI 플래너' : lang === 'en' ? 'AI Planner' : 'AI Төлөвлөгч'}
          </button>

          {/* Profile / Login */}
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/profile')
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={16} />
              )}
              {lang === 'kr' ? '마이페이지' : lang === 'mn' ? 'Миний хуудас' : 'My Page'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/login')
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <User size={16} />
              {tr('btn_login')}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
