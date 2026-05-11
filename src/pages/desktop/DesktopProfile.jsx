import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { db, storage } from '../../firebase'
import {
  User, MapPin, BookOpen, Heart, Settings, Globe, LogOut,
  ChevronRight, Sparkles, Map, Camera, Edit2, Check, X
} from 'lucide-react'

const LANGS = [
  { code: 'kr', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'mn', label: 'Монгол', flag: '🇲🇳' },
]

const DAY_SHORT = {
  kr: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  mn: ['Ня', 'Да', 'Мя', 'Лха', 'Пүр', 'Ба', 'Бя'],
}

function weatherIcon(code) {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

function conditionText(code, lang) {
  if (code === 0) return lang === 'kr' ? '맑음' : lang === 'mn' ? 'Тунгалаг' : 'Clear'
  if (code <= 2) return lang === 'kr' ? '대체로 맑음' : lang === 'mn' ? 'Ихэвчлэн тунгалаг' : 'Mostly Clear'
  if (code === 3) return lang === 'kr' ? '흐림' : lang === 'mn' ? 'Үүлэрхэг' : 'Cloudy'
  if (code <= 48) return lang === 'kr' ? '안개' : lang === 'mn' ? 'Манан' : 'Foggy'
  if (code <= 67) return lang === 'kr' ? '비' : lang === 'mn' ? 'Бороо' : 'Rain'
  if (code <= 77) return lang === 'kr' ? '눈' : lang === 'mn' ? 'Цас' : 'Snow'
  if (code <= 82) return lang === 'kr' ? '소나기' : lang === 'mn' ? 'Аадар бороо' : 'Showers'
  return lang === 'kr' ? '천둥번개' : lang === 'mn' ? 'Аянга' : 'Thunderstorm'
}

function WeatherWidget({ weather, lang }) {
  const daily = weather?.daily
  if (!daily?.time?.length) return null

  const mins = daily.temperature_2m_min
  const maxs = daily.temperature_2m_max
  const weekMin = Math.min(...mins)
  const weekMax = Math.max(...maxs)
  const weekRange = weekMax - weekMin || 1
  const code = weather.current?.weathercode ?? 0
  const dayNames = DAY_SHORT[lang] || DAY_SHORT.en

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a5fb4 0%, #1c4f9e 45%, #0e2d6b 100%)' }}>
      <div className="px-5 pt-5 pb-4">
        <p className="text-white/60 text-xs font-semibold tracking-wide mb-1">
          {lang === 'kr' ? '울란바토르' : lang === 'mn' ? 'Улаанбаатар' : 'Ulaanbaatar'}
        </p>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-thin leading-none" style={{ fontSize: '3.5rem' }}>
              {Math.round(weather.current?.temperature_2m ?? 0)}°
            </p>
            <p className="text-white/70 text-sm mt-1">{conditionText(code, lang)}</p>
            <p className="text-white/50 text-xs mt-0.5">
              {lang === 'kr' ? '최고' : 'H'}:{Math.round(maxs[0])}° &nbsp;
              {lang === 'kr' ? '최저' : 'L'}:{Math.round(mins[0])}°
            </p>
          </div>
          <span className="text-5xl leading-none">{weatherIcon(code)}</span>
        </div>
      </div>

      <div className="mx-4 border-t border-white/15" />

      <div className="px-4 py-3 space-y-2.5">
        {daily.time.map((dateStr, i) => {
          const d = new Date(dateStr)
          const dayLabel = i === 0
            ? (lang === 'kr' ? '오늘' : lang === 'mn' ? 'Өнөөдөр' : 'Today')
            : dayNames[d.getDay()]
          const tMin = mins[i]
          const tMax = maxs[i]
          const barLeft = ((tMin - weekMin) / weekRange) * 100
          const barWidth = Math.max(((tMax - tMin) / weekRange) * 100, 8)
          return (
            <div key={dateStr} className="flex items-center gap-2">
              <span className="text-white text-xs font-semibold w-12 shrink-0">{dayLabel}</span>
              <span className="text-base w-5 text-center shrink-0">{weatherIcon(daily.weathercode[i])}</span>
              <span className="text-white/60 text-xs w-7 text-right shrink-0">{Math.round(tMin)}°</span>
              <div className="flex-1 relative h-1.5 bg-white/15 rounded-full">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${barLeft}%`,
                    width: `${barWidth}%`,
                    background: 'linear-gradient(90deg, #60c8f5, #f97316)',
                  }}
                />
              </div>
              <span className="text-white text-xs font-bold w-7 shrink-0">{Math.round(tMax)}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DesktopProfile() {
  const navigate = useNavigate()
  const { lang, setLang, tr } = useLang()
  const { user, logout } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [nickname, setNickname] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedCount, setSavedCount] = useState(0)
  const [weather, setWeather] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=47.9077&longitude=106.8832&daily=temperature_2m_max,temperature_2m_min,weathercode&current=temperature_2m,weathercode&timezone=Asia%2FUlaanbaatar&forecast_days=7')
      .then(r => r.json()).then(setWeather).catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) return
    setDisplayName(user.displayName || '')
    setPhotoPreview(user.photoURL || null)
    if (!db) return
    getDoc(doc(db, 'users', user.uid))
      .then(snap => { if (snap.exists()) setNickname(snap.data().nickname || '') })
      .catch(() => {})
    getDocs(collection(db, 'users', user.uid, 'savedPlaces'))
      .then(snap => setSavedCount(snap.size))
      .catch(() => {})
  }, [user])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaveError('')
    try {
      let photoURL = user.photoURL

      if (photoFile && storage) {
        const storageRef = ref(storage, `profile-photos/${user.uid}`)
        await uploadBytes(storageRef, photoFile)
        photoURL = await getDownloadURL(storageRef)
      }

      await updateProfile(user, { displayName: displayName.trim(), photoURL })

      if (db) {
        await setDoc(
          doc(db, 'users', user.uid),
          { nickname: nickname.trim(), displayName: displayName.trim(), photoURL },
          { merge: true }
        )
      }

      setPhotoFile(null)
      setIsEditing(false)
    } catch (err) {
      console.error('Profile update failed:', err)
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setDisplayName(user?.displayName || '')
    setPhotoPreview(user?.photoURL || null)
    setPhotoFile(null)
    setSaveError('')
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const stats = [
    { icon: MapPin, label: '방문한 여행지', value: '0', color: 'text-primary', bg: 'bg-primary-light' },
    { icon: Heart, label: '저장한 장소', value: String(savedCount), color: 'text-red-500', bg: 'bg-red-50' },
    { icon: BookOpen, label: '읽은 블로그', value: '0', color: 'text-primary', bg: 'bg-primary-light' },
    { icon: Sparkles, label: 'AI 플래너 사용', value: '0', color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  const menuItems = [
    { icon: MapPin, label: '내 여행 기록', desc: '방문한 장소 및 여행 일정', path: '/explore' },
    { icon: Heart, label: '저장한 장소', desc: '찜한 여행지 목록', path: '/saved' },
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
            {/* 프로필 사진 */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl border-2 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center">
                {photoPreview
                  ? <img src={photoPreview} alt="profile" className="w-full h-full object-cover" />
                  : <User size={36} className="text-white" />
                }
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera size={14} className="text-gray-700" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* 이름 / 닉네임 */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">이름</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">닉네임</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      placeholder="닉네임을 입력하세요"
                      className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/60"
                    />
                  </div>
                  {saveError && <p className="text-red-300 text-xs">{saveError}</p>}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-primary font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Check size={13} />
                      {saving ? '저장 중...' : '저장'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/30 transition-colors border border-white/30"
                    >
                      <X size={13} />
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-2xl font-black text-white">
                      {displayName || '여행자'} 님
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
                    >
                      <Edit2 size={13} className="text-white" />
                    </button>
                  </div>
                  {nickname && (
                    <p className="text-white/70 text-sm mb-1">@{nickname}</p>
                  )}
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
              )}
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

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-red-200 text-red-500 font-semibold rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all text-sm"
            >
              <LogOut size={16} />
              {tr('profile_logout')}
            </button>
          </div>

          {/* Language & Settings sidebar */}
          <div className="space-y-4">

            {/* Apple Weather widget */}
            <WeatherWidget weather={weather} lang={lang} />

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
