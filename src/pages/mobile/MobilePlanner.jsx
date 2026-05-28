import { useState, useEffect } from 'react'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { generatePlanWithAI } from '../../utils/api'
import { saveTrip, defaultTripTitle } from '../../utils/trips'
import { Sparkles, Backpack, Lightbulb, Sunrise, Sun, Moon, Loader,
  Users, Calendar, MapPin, BookmarkPlus, Check, ChevronDown } from 'lucide-react'
import MobileLayout from './MobileLayout'
import { SEASONAL_INFO, MONTH_NAMES } from '../../data/seasonalInfo'

const INTERESTS = [
  { key: 'nature',      label: { kr: '자연',     en: 'Nature',     mn: 'Байгаль'   }, emoji: '🏔️' },
  { key: 'culture',     label: { kr: '문화',     en: 'Culture',    mn: 'Соёл'      }, emoji: '🏛️' },
  { key: 'adventure',   label: { kr: '어드벤처', en: 'Adventure',  mn: 'Адал явдал'}, emoji: '🐎' },
  { key: 'food',        label: { kr: '음식',     en: 'Food',       mn: 'Хоол'      }, emoji: '🍖' },
  { key: 'photography', label: { kr: '사진',     en: 'Photo',      mn: 'Зураг'     }, emoji: '📸' },
  { key: 'history',     label: { kr: '역사',     en: 'History',    mn: 'Түүх'      }, emoji: '📜' },
]

const BUDGETS = [
  { key: 'budget',  label: { kr: '저예산', en: 'Budget',  mn: 'Хямд'   }, emoji: '💵' },
  { key: 'mid',     label: { kr: '중간',   en: 'Mid',     mn: 'Дунд'   }, emoji: '💳' },
  { key: 'premium', label: { kr: '프리미엄', en: 'Premium', mn: 'Зэрэглэлтэй' }, emoji: '💎' },
]
const PACES = [
  { key: 'relaxed', label: { kr: '느긋',  en: 'Relaxed', mn: 'Тайван' }, emoji: '🐢' },
  { key: 'normal',  label: { kr: '보통',  en: 'Normal',  mn: 'Дундаж' }, emoji: '🚶' },
  { key: 'packed',  label: { kr: '빡빡',  en: 'Packed',  mn: 'Эрчтэй' }, emoji: '🏃' },
]
const GROUPS = [
  { key: 'solo',    label: { kr: '혼자',    en: 'Solo',    mn: 'Ганцаараа' }, emoji: '🧍' },
  { key: 'couple',  label: { kr: '커플',    en: 'Couple',  mn: 'Хосоор'   }, emoji: '💑' },
  { key: 'family',  label: { kr: '가족',    en: 'Family',  mn: 'Гэр бүл'  }, emoji: '👨‍👩‍👧' },
  { key: 'friends', label: { kr: '친구',    en: 'Friends', mn: 'Найзууд'  }, emoji: '👯' },
]
const STAYS = [
  { key: 'hotel',       label: { kr: '호텔',     en: 'Hotel',      mn: 'Зочид буудал' }, emoji: '🏨' },
  { key: 'guesthouse',  label: { kr: '게스트하우스', en: 'Guesthouse', mn: 'Гэстэйз' }, emoji: '🏠' },
  { key: 'ger',         label: { kr: '게르',     en: 'Ger Camp',   mn: 'Гэр бааз' }, emoji: '⛺' },
  { key: 'mixed',       label: { kr: '혼합',     en: 'Mixed',      mn: 'Холимог'  }, emoji: '🎒' },
]

function timeIcon(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return <Sunrise size={13} className="text-amber-400" />
  if (h < 18) return <Sun size={13} className="text-orange-400" />
  return <Moon size={13} className="text-indigo-400" />
}

function timeBg(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return 'bg-amber-50 text-amber-600 border-amber-200'
  if (h < 18) return 'bg-orange-50 text-orange-600 border-orange-200'
  return 'bg-indigo-50 text-indigo-600 border-indigo-200'
}

const SEASONS = {
  spring: { kr: '봄', en: 'Spring', mn: 'Хавар', emoji: '🌸', color: 'text-pink-600 bg-pink-50 border-pink-200' },
  summer: { kr: '여름', en: 'Summer', mn: 'Зун',   emoji: '☀️', color: 'text-orange-500 bg-orange-50 border-orange-200' },
  fall:   { kr: '가을', en: 'Autumn', mn: 'Намар', emoji: '🍂', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  winter: { kr: '겨울', en: 'Winter', mn: 'Өвөл',  emoji: '❄️', color: 'text-blue-500 bg-blue-50 border-blue-200' },
}

const TRANSPORT_MAP = {
  walk:          { emoji: '🚶', kr: '도보',    en: 'Walk',        mn: 'Явган'          },
  'private car': { emoji: '🚗', kr: '전용차',  en: 'Private Car', mn: 'Хувийн машин'   },
  'shared van':  { emoji: '🚐', kr: '합승밴',  en: 'Shared Van',  mn: 'Нийтийн фургон' },
  bus:           { emoji: '🚌', kr: '버스',    en: 'Bus',         mn: 'Автобус'        },
  flight:        { emoji: '✈️', kr: '항공',    en: 'Flight',      mn: 'Нислэг'         },
}

const ROAD_TYPE_LABEL = {
  paved:    { kr: '포장도로', en: 'Paved road',  mn: 'Хатуу зам'    },
  dirt:     { kr: '비포장',   en: 'Dirt road',   mn: 'Хайрган зам'  },
  'off-road':{ kr: '오프로드', en: 'Off-road',   mn: 'Замгүй газар' },
  mixed:    { kr: '혼합',     en: 'Mixed road',  mn: 'Холимог зам'  },
}


function getDaySeason(startDate, dayNum) {
  if (!startDate) return null
  const d = new Date(startDate)
  d.setDate(d.getDate() + dayNum - 1)
  const m = d.getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'fall'
  return 'winter'
}

export default function MobilePlanner() {
  const { lang } = useLang()
  const { user } = useAuth()
  const [days, setDays] = useState(3)
  const [selectedInterests, setSelectedInterests] = useState(['nature'])
  const [budget, setBudget] = useState('mid')
  const [pace, setPace] = useState('normal')
  const [groupType, setGroupType] = useState('couple')
  const [accommodation, setAccommodation] = useState('mixed')
  const [startDate, setStartDate] = useState('')
  const [departureCity, setDepartureCity] = useState('Ulaanbaatar')
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)
  const [expandedDays, setExpandedDays] = useState(new Set())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)

  // Re-generating clears any previous "Saved" badge so the user can save the
  // new plan separately.
  const resetSavedState = () => setSavedId(null)

  useEffect(() => {
    if (selectedMonth === null) { setStartDate(''); return }
    const now = new Date()
    const year = (selectedMonth - 1) < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear()
    const d = selectedDay ?? 1
    setStartDate(`${year}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }, [selectedMonth, selectedDay])

  const handleSaveTrip = async () => {
    if (!plan || !user?.uid || saving || savedId) return
    setSaving(true)
    try {
      const id = await saveTrip(user.uid, {
        title: defaultTripTitle(plan, days, lang),
        days,
        interests: selectedInterests,
        budget, pace, groupType, accommodation,
        startDate: startDate || null,
        departureCity: departureCity.trim() || null,
        plan,
      })
      setSavedId(id)
    } catch (err) {
      console.error('[Planner] save failed', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleInterest = (key) => {
    setSelectedInterests(prev =>
      prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
    )
  }

  const handleGenerate = async () => {
    if (selectedInterests.length === 0) return
    setLoading(true)
    setError(null)
    setPlan(null)
    resetSavedState()
    try {
      const langLabel = lang === 'kr' ? 'Korean' : lang === 'en' ? 'English' : 'Mongolian'
      const interestLabels = selectedInterests.map(k => INTERESTS.find(i => i.key === k)?.label.en || k)
      const result = await generatePlanWithAI(
        days, interestLabels, langLabel,
        null,                                // focusLocations
        startDate || null,                   // startDate
        departureCity.trim() || null,        // departureCity
        { budget, pace, groupType, accommodation }
      )
      setPlan(result)
      // Open day 1 by default
      setExpandedDays(new Set([1]))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-primary" />
          <h1 className="text-2xl font-black text-gray-900">
            {lang === 'kr' ? 'AI 플래너' : lang === 'en' ? 'AI Planner' : 'AI Төлөвлөгч'}
          </h1>
        </div>
        <p className="text-gray-500 text-xs mb-4">
          {lang === 'kr' ? 'AI가 최적의 몽골 여행 일정을 만들어드려요'
            : lang === 'en' ? 'AI creates your perfect Mongolia itinerary'
            : 'AI танд хамгийн тохиромжтой аяллын хуваарийг гаргаж өгнө'}
        </p>

        {/* Days */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 mb-3">
            {lang === 'kr' ? '여행 일수' : lang === 'en' ? 'Trip Duration' : 'Аяллын хугацаа'}
          </p>
          <div className="flex items-center justify-between">
            <button onClick={() => setDays(d => Math.max(1, d - 1))} className="w-10 h-10 rounded-full bg-gray-100 font-black text-gray-700 text-lg">-</button>
            <span className="text-3xl font-black text-primary">{days}</span>
            <button onClick={() => setDays(d => Math.min(14, d + 1))} className="w-10 h-10 rounded-full bg-primary text-white font-black text-lg">+</button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-1">
            {lang === 'kr' ? `${days}일` : lang === 'en' ? `${days} days` : `${days} өдөр`}
          </p>
        </div>

        {/* Group */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
            <Users size={15} className="text-primary" />
            {lang === 'kr' ? '동행' : lang === 'en' ? 'Group' : 'Хэн нартай'}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {GROUPS.map(g => (
              <button key={g.key} onClick={() => setGroupType(g.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${groupType === g.key ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                <span className="text-lg">{g.emoji}</span>
                <span className={`text-[9px] font-bold ${groupType === g.key ? 'text-primary' : 'text-gray-600'}`}>{g.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Month selector + Departure */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 space-y-4">
          {/* Month grid */}
          <div>
            <label className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
              <Calendar size={15} className="text-primary" />
              {lang === 'kr' ? '여행 월 선택 (선택)' : lang === 'en' ? 'Travel Month (optional)' : 'Аяллын сар (сонгох)'}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                const seInfo = SEASONAL_INFO[m]
                const sData = SEASONS[seInfo.season]
                const isSelected = selectedMonth === m
                return (
                  <button
                    key={m}
                    onClick={() => { setSelectedMonth(prev => prev === m ? null : m); setSelectedDay(null) }}
                    className={`flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${
                      isSelected ? sData.color : 'border-gray-100 bg-gray-50 text-gray-500'
                    }`}
                  >
                    <span className="text-sm leading-none">{sData.emoji}</span>
                    <span className="text-[10px] font-black mt-0.5">{MONTH_NAMES[lang]?.[m - 1]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Seasonal info card */}
          {selectedMonth && (() => {
            const info = SEASONAL_INFO[selectedMonth]
            const s = SEASONS[info.season]
            return (
              <div className={`rounded-xl border p-3 space-y-2 ${s.color}`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.emoji}</span>
                  <span className="text-xs font-black">{s[lang] ?? s.en}</span>
                  <span className="text-[10px] font-semibold opacity-70 ml-auto">{info.temp}</span>
                </div>
                <div className="space-y-1">
                  {info.events.map((ev, i) => (
                    <p key={i} className="text-[11px] font-bold">{ev[lang] ?? ev.en}</p>
                  ))}
                </div>
                {info.topRoutes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black opacity-60 mb-1">
                      {lang === 'kr' ? '추천 루트' : lang === 'en' ? 'Top Routes' : 'Санал болгосон маршрут'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {info.topRoutes.map((r, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded-full">
                          {r[lang] ?? r.en}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {info.buses.length > 0 && (
                  <div className="border-t border-current/20 pt-2">
                    <p className="text-[10px] font-black opacity-60 mb-1.5">
                      {lang === 'kr' ? '주요 교통편' : lang === 'en' ? 'Key Transport' : 'Гол тээвэр'}
                    </p>
                    {info.buses.map((b, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 mb-1 text-[10px]">
                        <span className="font-bold leading-tight">{b.label[lang] ?? b.label.en}</span>
                        <span className="opacity-75 text-right whitespace-nowrap">{b.departs} · {b.dur[lang] ?? b.dur.en}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Day picker — shown only after month is selected */}
          {selectedMonth && (() => {
            const now = new Date()
            const year = (selectedMonth - 1) < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear()
            const daysInMonth = new Date(year, selectedMonth, 0).getDate()
            return (
              <div>
                <p className="text-sm font-black text-gray-900 mb-2">
                  {lang === 'kr' ? '날짜 선택 (선택)' : lang === 'en' ? 'Pick a Day (optional)' : 'Өдөр сонгох'}
                  {selectedDay && (
                    <span className="ml-2 text-primary text-xs font-black">
                      {year}/{String(selectedMonth).padStart(2,'0')}/{String(selectedDay).padStart(2,'0')}
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(prev => prev === d ? null : d)}
                      className={`aspect-square rounded-lg text-[11px] font-black flex items-center justify-center transition-all ${
                        selectedDay === d
                          ? 'bg-primary text-white shadow-sm shadow-primary/30'
                          : 'bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Departure city */}
          <div>
            <label className="text-sm font-black text-gray-900 flex items-center gap-2 mb-2">
              <MapPin size={15} className="text-primary" />
              {lang === 'kr' ? '출발 도시' : lang === 'en' ? 'Departure City' : 'Гарах хот'}
            </label>
            <input type="text" value={departureCity} onChange={e => setDepartureCity(e.target.value)}
              placeholder="Ulaanbaatar"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary" />
          </div>
        </div>

        {/* Differentiator callout */}
        <div className="bg-gradient-to-br from-violet-50 to-primary/5 border border-primary/20 rounded-2xl p-4 mb-5">
          <p className="text-xs font-black text-gray-800 mb-2.5">
            {lang === 'kr' ? '✨ AI 플래너 vs 일반 여행사' : lang === 'en' ? '✨ AI Planner vs. Travel Agency' : '✨ AI Төлөвлөгч vs Аялал жуулчлал'}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { emoji: '🆓', kr: '완전 무료', en: 'Completely free', mn: 'Үнэгүй' },
              { emoji: '⚡', kr: '30초 즉시 생성', en: 'Ready in 30 sec', mn: '30 секундэд' },
              { emoji: '🎯', kr: '100% 맞춤 일정', en: '100% personalized', mn: '100% тохируулсан' },
              { emoji: '🗺', kr: '계절 최적화 루트', en: 'Season-smart routes', mn: 'Улирлын маршрут' },
              { emoji: '🚌', kr: '실제 교통 정보 포함', en: 'Real transport info', mn: 'Бодит тээвэр' },
              { emoji: '♾️', kr: '무제한 재생성', en: 'Unlimited retries', mn: 'Хязгааргүй' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/70 rounded-xl px-2.5 py-1.5">
                <span className="text-sm">{item.emoji}</span>
                <span className="text-[10px] font-bold text-gray-700">{item[lang] ?? item.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || selectedInterests.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-black rounded-2xl text-base shadow-lg shadow-primary/30 disabled:opacity-50 mb-5"
        >
          {loading ? (
            <><Loader size={18} className="animate-spin" /> {lang === 'kr' ? '생성 중...' : lang === 'en' ? 'Generating...' : 'Үүсгэж байна...'}</>
          ) : (
            <><Sparkles size={18} /> {lang === 'kr' ? 'AI 일정 만들기' : lang === 'en' ? 'Generate Itinerary' : 'Хуваарь гаргах'}</>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-sm">
              {lang === 'kr' ? '일정 생성 중...' : lang === 'en' ? 'Generating your plan...' : 'Хуваарь гаргаж байна...'}
            </p>
          </div>
        )}

        {/* Result */}
        {plan && (
          <div className="space-y-3">
            {/* Save trip button — only when signed in */}
            {user && (
              <button
                onClick={handleSaveTrip}
                disabled={saving || !!savedId}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border transition-all ${
                  savedId
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : saving
                      ? 'bg-gray-100 border-gray-200 text-gray-400'
                      : 'bg-white border-primary/30 text-primary hover:bg-primary/5 active:scale-[0.99]'
                }`}
              >
                {savedId ? (
                  <><Check size={16} /> {lang === 'kr' ? '저장됨' : lang === 'en' ? 'Saved' : 'Хадгалсан'}</>
                ) : saving ? (
                  <><Loader size={16} className="animate-spin" /> {lang === 'kr' ? '저장 중...' : 'Saving...'}</>
                ) : (
                  <><BookmarkPlus size={16} /> {lang === 'kr' ? '이 일정 저장하기' : lang === 'en' ? 'Save this plan' : 'Хадгалах'}</>
                )}
              </button>
            )}
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-black text-gray-900">
                🗓️ {days}{lang === 'kr' ? '일' : lang === 'mn' ? ' өдөр' : ' day'} {lang === 'kr' ? '일정' : lang === 'en' ? 'Itinerary' : 'Хуваарь'}
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {plan.itinerary?.length ?? 0} {lang === 'kr' ? '일' : lang === 'mn' ? 'өдөр' : 'days'}
              </span>
            </div>

            {/* Day cards */}
            {(plan.itinerary ?? []).map(day => {
              const seasonKey = getDaySeason(startDate, day.day)
              const season = seasonKey ? SEASONS[seasonKey] : null
              const isOpen = expandedDays.has(day.day)
              const toggleDay = () => setExpandedDays(prev => {
                const next = new Set(prev)
                isOpen ? next.delete(day.day) : next.add(day.day)
                return next
              })
              return (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Day header — tap to expand/collapse */}
                <button
                  onClick={toggleDay}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/8 to-transparent border-b border-gray-100 text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                    {day.day}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {lang === 'kr' ? `${day.day}일차` : lang === 'mn' ? `${day.day} өдөр` : `Day ${day.day}`}
                      </p>
                      {season && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${season.color}`}>
                          {season.emoji} {season[lang] ?? season.en}
                        </span>
                      )}
                      {day.estimated_drive_km > 0 && (
                        <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          🚗 {day.estimated_drive_km}km
                        </span>
                      )}
                    </div>
                    <p className="font-black text-gray-900 text-sm leading-tight truncate">{day.title}</p>
                  </div>
                  <ChevronDown
                    size={15}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Activities timeline — only when expanded */}
                {isOpen && (
                  <div className="px-4 py-3 space-y-0">
                    {(day.activities ?? []).map((act, i) => {
                      const isTransit = act.type === 'transit'
                      const roadLabel = act.road_type && act.road_type !== 'none'
                        ? (ROAD_TYPE_LABEL[act.road_type]?.[lang] ?? act.road_type)
                        : null
                      const transportInfo = act.transport && TRANSPORT_MAP[act.transport]
                        ? TRANSPORT_MAP[act.transport]
                        : null

                      if (isTransit) {
                        return (
                          <div key={i} className="mb-3">
                            <div className="flex items-stretch gap-2">
                              <div className="flex flex-col items-center flex-shrink-0 w-9">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-base">
                                  {transportInfo ? transportInfo.emoji : '🚙'}
                                </div>
                              </div>
                              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">
                                    {transportInfo ? (transportInfo[lang] ?? transportInfo.en) : 'Transit'}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                                    {act.time} 출발
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed mb-1.5">
                                  {act.text.replace(/\*\*/g, '')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {act.transit_km > 0 && (
                                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                      📍 {act.transit_km}km
                                    </span>
                                  )}
                                  {roadLabel && (
                                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                      🛣 {roadLabel}
                                    </span>
                                  )}
                                  {act.duration_min > 0 && (
                                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                      ⏱ {act.duration_min >= 60
                                        ? `${Math.floor(act.duration_min / 60)}${lang === 'mn' ? 'ц' : lang === 'kr' ? '시간' : 'h'}${act.duration_min % 60 ? ` ${act.duration_min % 60}${lang === 'mn' ? 'мин' : lang === 'kr' ? '분' : 'm'}` : ''}`
                                        : `${act.duration_min}${lang === 'mn' ? 'мин' : lang === 'kr' ? '분' : 'm'}`}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div key={i} className="flex gap-3 relative">
                          {i < day.activities.length - 1 && (
                            <div className="absolute left-[18px] top-9 bottom-0 w-px bg-gray-100" />
                          )}
                          <div className="flex flex-col items-center gap-1 flex-shrink-0 w-9">
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 bg-white ${timeBg(act.time)}`}>
                              {timeIcon(act.time)}
                            </div>
                            <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${timeBg(act.time)}`}>
                              {act.time}
                            </span>
                          </div>
                          <div className={`flex-1 ${i < day.activities.length - 1 ? 'pb-4' : 'pb-1'}`}>
                            <p className="text-xs text-gray-700 leading-relaxed pt-1.5">
                              {act.text.replace(/\*\*/g, '')}
                            </p>
                            {transportInfo && (
                              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {transportInfo.emoji} {transportInfo[lang] ?? transportInfo.en}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              )
            })}

            {/* Packing list */}
            {plan.packing && plan.packing.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Backpack size={14} className="text-emerald-600" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">
                    {lang === 'kr' ? '준비물 체크리스트' : lang === 'mn' ? 'Бэлтгэх зүйлс' : 'Packing Checklist'}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {plan.packing.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 flex-shrink-0" />
                      <span className="text-[11px] text-gray-700 font-medium leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {plan.tips && plan.tips.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={15} className="text-amber-500" />
                  <h3 className="font-black text-gray-900 text-sm">
                    {lang === 'kr' ? '현지 꿀팁' : lang === 'mn' ? 'Орон нутгийн зөвлөмж' : 'Local Tips'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {plan.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-800 leading-relaxed">
                      <span className="text-amber-400 font-black mt-0.5">✦</span>
                      <span>{tip.replace(/\*\*/g, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
