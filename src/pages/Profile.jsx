import { useState } from 'react'
import { ChevronRight, MapPin, Heart, Settings, LogOut, Globe, MessageCircle, Compass, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const flags = { kr: '🇰🇷', en: '🇺🇸', mn: '🇲🇳' }
const langNames = { kr: '한국어', en: 'English', mn: 'Монгол' }

export default function Profile() {
  const navigate = useNavigate()
  const { tr, lang, setLang } = useLang()
  const [showLangPicker, setShowLangPicker] = useState(false)

  const stats = [
    { label: lang === 'kr' ? '방문 국가' : lang === 'en' ? 'Countries' : 'Улс', value: '1', color: 'text-primary' },
    { label: lang === 'kr' ? '저장 장소' : lang === 'en' ? 'Saved' : 'Хадгалсан', value: '12', color: 'text-pink-500' },
    { label: lang === 'kr' ? 'AI 일정' : lang === 'en' ? 'AI Plans' : 'AI төлөвлөгч', value: '3', color: 'text-purple-500' },
  ]

  const menuItems = [
    { icon: MapPin, label: tr('profile_trips'), action: () => navigate('/planner'), color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Heart, label: tr('profile_saved'), action: () => navigate('/explore'), color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Map, label: tr('map_title'), action: () => navigate('/map'), color: 'text-teal-500', bg: 'bg-teal-50' },
    { icon: MessageCircle, label: tr('chat_title'), action: () => navigate('/chat'), color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Compass, label: tr('culture_title'), action: () => navigate('/culture'), color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Settings, label: tr('budget_title'), action: () => navigate('/budget'), color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile hero */}
        <div className="bg-gradient-to-br from-navy to-primary px-4 pt-5 pb-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="flex items-center gap-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl border-2 border-white/30">
              🧳
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight">
                {lang === 'kr' ? '여행자' : lang === 'en' ? 'Traveler' : 'Аялагч'}
              </p>
              <p className="text-white/60 text-xs mt-0.5">traveler@nomadai.com</p>
              <span className="inline-block mt-1.5 text-[10px] bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20 font-semibold">
                🌍 {lang === 'kr' ? '자유여행러' : lang === 'en' ? 'Free Explorer' : 'Чөлөөт аялагч'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 grid grid-cols-3 divide-x divide-gray-100">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="text-center px-2">
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="px-4 mt-4 space-y-2">
          {menuItems.map(({ icon: Icon, label, action, color, bg }) => (
            <button
              key={label}
              onClick={action}
              className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-gray-100/80 active:scale-[0.99] transition-all"
            >
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={17} className={color} />
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-800 text-left">{label}</span>
              <ChevronRight size={15} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Language picker */}
        <div className="px-4 mt-2">
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-gray-100/80"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
              {flags[lang]}
            </div>
            <span className="flex-1 text-sm font-semibold text-gray-800 text-left">{tr('profile_lang')}</span>
            <span className="text-xs text-gray-400 font-medium">{langNames[lang]}</span>
            <ChevronRight size={15} className={`text-gray-300 transition-transform ${showLangPicker ? 'rotate-90' : ''}`} />
          </button>
          {showLangPicker && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-1.5 overflow-hidden">
              {Object.entries(langNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => { setLang(code); setShowLangPicker(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${lang === code ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                >
                  <span className="text-xl">{flags[code]}</span>
                  <span className={`text-sm font-semibold flex-1 text-left ${lang === code ? 'text-primary' : 'text-gray-700'}`}>{name}</span>
                  {lang === code && <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="px-4 mt-2 mb-2">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-gray-100/80 active:scale-[0.99] transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut size={17} className="text-red-400" />
            </div>
            <span className="flex-1 text-sm font-semibold text-red-400 text-left">{tr('profile_logout')}</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
