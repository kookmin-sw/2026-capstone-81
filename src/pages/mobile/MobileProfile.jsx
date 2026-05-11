import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { User, Settings, Heart, Calendar, LogOut, ChevronRight, Globe } from 'lucide-react'
import MobileLayout from './MobileLayout'

export default function MobileProfile() {
  const navigate = useNavigate()
  const { lang, setLang } = useLang()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      icon: Heart,
      label: { kr: '저장된 여행지', en: 'Saved Places', mn: 'Хадгалсан газрууд' },
      onClick: () => navigate('/saved'),
    },
    {
      icon: Calendar,
      label: { kr: '내 일정', en: 'My Itineraries', mn: 'Миний хуваарь' },
      onClick: () => navigate('/planner'),
    },
    {
      icon: Settings,
      label: { kr: '설정', en: 'Settings', mn: 'Тохиргоо' },
      onClick: () => {},
    },
  ]

  const languages = [
    { key: 'kr', label: '한국어', flag: '🇰🇷' },
    { key: 'en', label: 'English', flag: '🇺🇸' },
    { key: 'mn', label: 'Монгол', flag: '🇲🇳' },
  ]

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">

        {/* 프로필 헤더 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-black text-white">
                  {user.name?.[0] || user.email?.[0] || 'N'}
                </span>
              </div>
              <div>
                <h2 className="font-black text-gray-900 text-lg">{user.name || 'Nomadiq User'}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <User size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-4">
                {lang === 'kr' ? '로그인하고 여행을 계획해보세요!' : lang === 'en' ? 'Login to plan your trip!' : 'Нэвтэрч аяллаа төлөвлөөрэй!'}
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-2.5 bg-primary text-white font-black rounded-xl text-sm"
                >
                  {lang === 'kr' ? '로그인' : lang === 'en' ? 'Login' : 'Нэвтрэх'}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="flex-1 py-2.5 border border-primary text-primary font-black rounded-xl text-sm"
                >
                  {lang === 'kr' ? '회원가입' : lang === 'en' ? 'Sign Up' : 'Бүртгүүлэх'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 언어 선택 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-primary" />
            <p className="text-sm font-black text-gray-900">
              {lang === 'kr' ? '언어 설정' : lang === 'en' ? 'Language' : 'Хэл тохиргоо'}
            </p>
          </div>
          <div className="flex gap-2">
            {languages.map(l => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all ${
                  lang === l.key
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <span className="text-xl">{l.flag}</span>
                <span className={`text-[10px] font-bold ${lang === l.key ? 'text-primary' : 'text-gray-500'}`}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 메뉴 */}
        {user && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                    idx < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Icon size={18} className="text-primary" />
                  <span className="flex-1 text-left text-sm font-semibold text-gray-700">
                    {item.label[lang]}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              )
            })}
          </div>
        )}

        {/* 로그아웃 */}
        {user && (
          <button
            onClick={() => { logout(); navigate('/home') }}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 border border-red-200 text-red-500 font-black rounded-2xl text-sm"
          >
            <LogOut size={16} />
            {lang === 'kr' ? '로그아웃' : lang === 'en' ? 'Logout' : 'Гарах'}
          </button>
        )}

        {/* 앱 정보 */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">Nomadiq v1.0.0</p>
          <p className="text-xs text-gray-300 mt-1">© 2026 Nomadiq. All rights reserved.</p>
        </div>
      </div>
    </MobileLayout>
  )
}