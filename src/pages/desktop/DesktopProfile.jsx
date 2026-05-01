import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { User, MapPin, BookOpen, Heart, Settings, Globe, LogOut, ChevronRight, Sparkles, Map } from 'lucide-react'

const LANGS = [
  { code: 'kr', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'mn', label: 'Монгол', flag: '🇲🇳' },
]

export default function DesktopProfile() {
  const navigate = useNavigate()
  const { lang, setLang, tr } = useLang()

  const stats = [
    { icon: MapPin, label: '방문한 여행지', value: '3', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Heart, label: '저장한 장소', value: '12', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: BookOpen, label: '읽은 블로그', value: '8', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Sparkles, label: 'AI 플래너 사용', value: '5', color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  const menuItems = [
    { icon: MapPin, label: '내 여행 기록', desc: '방문한 장소 및 여행 일정', path: '/explore' },
    { icon: Heart, label: '저장한 장소', desc: '찜한 여행지 목록', path: '/explore' },
    { icon: Map, label: '지도로 탐색', desc: '인터랙티브 지도', path: '/map' },
    { icon: Sparkles, label: 'AI 여행 플래너', desc: '맞춤 여행 일정 생성', path: '/planner' },
    { icon: Settings, label: '설정', desc: '계정 및 앱 설정', path: '/profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-navy to-primary rounded-3xl p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-white/30">
              <User size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white mb-1">여행자 님</h1>
              <p className="text-white/60 text-sm flex items-center gap-1">
                <MapPin size={13} />
                몽골 여행 준비 중
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                  🏆 여행 탐험가
                </span>
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                  ✨ AI 친구
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Menu */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-black text-gray-900">메뉴</h2>
              </div>
              {menuItems.map(({ icon: Icon, label, desc, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group text-left"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    <p className="text-xs text-gray-400 truncate">{desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-red-200 text-red-500 font-semibold rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all text-sm"
            >
              <LogOut size={16} />
              {tr('profile_logout')}
            </button>
          </div>

          {/* Language & Settings sidebar */}
          <div className="space-y-4">
            {/* Language */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={16} className="text-primary" />
                <h3 className="font-black text-gray-900 text-sm">{tr('profile_lang')}</h3>
              </div>
              <div className="space-y-2">
                {LANGS.map(({ code, label, flag }) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      lang === code
                        ? 'bg-primary/10 text-primary border-2 border-primary/30'
                        : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-lg">{flag}</span>
                    {label}
                    {lang === code && <span className="ml-auto text-xs bg-primary text-white px-2 py-0.5 rounded-full">선택됨</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Chat CTA */}
            <div className="bg-gradient-to-br from-purple-500 to-primary rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="font-black text-sm">AI 채팅 상담</span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed mb-3">
                몽골 여행에 대해 궁금한 점을 AI에게 물어보세요.
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="w-full py-2 bg-white/20 text-white text-xs font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
              >
                AI와 대화하기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
