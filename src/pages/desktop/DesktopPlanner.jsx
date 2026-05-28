import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { generatePlanWithAI } from '../../utils/api'
import { saveTrip, defaultTripTitle } from '../../utils/trips'
import { Sparkles, Clock, MapPin, X, Backpack, Lightbulb, Sunrise, Sun, Moon, BookmarkPlus, Check, Loader, Users, Calendar, ChevronDown } from 'lucide-react'
import { SEASONAL_INFO, MONTH_NAMES } from '../../data/seasonalInfo'

function timeIcon(time) {
  const h = parseInt(time?.split(':')[0] ?? '9', 10)
  if (h < 12) return <Sunrise size={14} className="text-amber-400" />
  if (h < 18) return <Sun size={14} className="text-orange-400" />
  return <Moon size={14} className="text-indigo-400" />
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

const interestKeys = ['int_nature', 'int_culture', 'int_food', 'int_adventure', 'int_photo', 'int_history']
const interestEmojis = {
  int_nature: '🏔️', int_culture: '🏛️', int_food: '🍖',
  int_adventure: '🐎', int_photo: '📸', int_history: '📜',
}
const langLabels = { kr: '한국어', en: 'English', mn: 'Mongolian' }

const BUDGETS = [
  { key: 'budget',  label: { kr: '저예산',   en: 'Budget',  mn: 'Хямд'        }, emoji: '💵' },
  { key: 'mid',     label: { kr: '중간',     en: 'Mid',     mn: 'Дунд'        }, emoji: '💳' },
  { key: 'premium', label: { kr: '프리미엄', en: 'Premium', mn: 'Зэрэглэлтэй' }, emoji: '💎' },
]
const PACES = [
  { key: 'relaxed', label: { kr: '느긋', en: 'Relaxed', mn: 'Тайван' }, emoji: '🐢' },
  { key: 'normal',  label: { kr: '보통', en: 'Normal',  mn: 'Дундаж' }, emoji: '🚶' },
  { key: 'packed',  label: { kr: '빡빡', en: 'Packed',  mn: 'Эрчтэй' }, emoji: '🏃' },
]
const GROUPS = [
  { key: 'solo',    label: { kr: '혼자', en: 'Solo',    mn: 'Ганцаараа' }, emoji: '🧍' },
  { key: 'couple',  label: { kr: '커플', en: 'Couple',  mn: 'Хосоор'    }, emoji: '💑' },
  { key: 'family',  label: { kr: '가족', en: 'Family',  mn: 'Гэр бүл'   }, emoji: '👨‍👩‍👧' },
  { key: 'friends', label: { kr: '친구', en: 'Friends', mn: 'Найзууд'   }, emoji: '👯' },
]
const STAYS = [
  { key: 'hotel',      label: { kr: '호텔',         en: 'Hotel',      mn: 'Зочид буудал' }, emoji: '🏨' },
  { key: 'guesthouse', label: { kr: '게스트하우스', en: 'Guesthouse', mn: 'Гэстэйз'      }, emoji: '🏠' },
  { key: 'ger',        label: { kr: '게르',         en: 'Ger Camp',   mn: 'Гэр бааз'     }, emoji: '⛺' },
  { key: 'mixed',      label: { kr: '혼합',         en: 'Mixed',      mn: 'Холимог'      }, emoji: '🎒' },
]

// Single-select option grid used for budget / pace / group / accommodation.
function OptionGrid({ icon: Icon, title, options, value, onChange, lang, cols = 3 }) {
  return (
    <div>
      <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
        <Icon size={16} className="text-primary" />
        {title}
      </label>
      <div className={`grid gap-2 ${cols === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {options.map(o => (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
              value === o.key
                ? 'bg-primary/5 border-primary text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="text-xl">{o.emoji}</span>
            <span className="text-xs font-semibold">{o.label[lang] ?? o.label.en}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DesktopPlanner() {
  const { tr, lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  // support both ?locations=A,B,C (multi) and legacy ?location=X
  const rawLocations = searchParams.get('locations') || searchParams.get('location') || ''
  const focusLocations = rawLocations ? rawLocations.split(',').map(s => s.trim()).filter(Boolean) : []

  const [days, setDays] = useState(5)
  const [interests, setInterests] = useState(['int_nature'])
  const [budget, setBudget] = useState('mid')
  const [pace, setPace] = useState('normal')
  const [groupType, setGroupType] = useState('couple')
  const [accommodation, setAccommodation] = useState('mixed')
  const [startDate, setStartDate] = useState('')
  const [departureCity, setDepartureCity] = useState('Ulaanbaatar')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [savingTrip, setSavingTrip] = useState(false)
  const [savedTripId, setSavedTripId] = useState(null)
  const [expandedDays, setExpandedDays] = useState(new Set())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const { user } = useAuth()


  useEffect(() => {
    if (selectedMonth === null) { setStartDate(''); return }
    const now = new Date()
    const year = (selectedMonth - 1) < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear()
    const d = selectedDay ?? 1
    setStartDate(`${year}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }, [selectedMonth, selectedDay])

  const handleSaveTrip = async () => {
    if (!result || !user?.uid || savingTrip || savedTripId) return
    setSavingTrip(true)
    try {
      const id = await saveTrip(user.uid, {
        title: defaultTripTitle(result, days, lang),
        days,
        interests,
        locations: focusLocations,
        plan: result,
      })
      setSavedTripId(id)
    } catch (err) {
      console.error('[Planner] save failed', err)
      setGenError(err.message)
    } finally {
      setSavingTrip(false)
    }
  }

  const clearLocations = () => setSearchParams({})

  const toggleInterest = (key) => {
    setInterests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setGenError('')
    setSavedTripId(null)
    try {
      const interestLabels = interests.map(k => tr(k))
      const plan = await generatePlanWithAI(
        days, interestLabels, langLabels[lang] || 'Korean',
        focusLocations.length ? focusLocations : null,
        startDate || null,
        departureCity.trim() || null,
        { budget, pace, groupType, accommodation },
      )
      setResult(plan)
      setExpandedDays(new Set([1]))
    } catch (err) {
      console.error('[Planner] generate failed', err)
      const base =
        lang === 'mn' ? 'Хуваарь гаргах амжилтгүй боллоо. Дахин оролдоно уу.' :
        lang === 'en' ? 'Failed to generate. Please try again.' :
        '일정 생성에 실패했습니다. 다시 시도해주세요.'
      setGenError(err?.message ? `${base}\n(${err.message})` : base)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy via-primary-dark to-primary py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={22} className="text-yellow-300" />
            <h1 className="text-2xl font-black text-white">{tr('planner_title')}</h1>
          </div>
          <p className="text-white/70 text-base">{tr('planner_sub')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
            <h2 className="text-lg font-black text-gray-900">{tr('planner_settings_title')}</h2>

            {/* Selected locations from map */}
            {focusLocations.length > 0 && (
              <div className="bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-violet-600" />
                    <p className="text-[11px] text-violet-500 font-semibold">
                      {lang === 'kr' ? '지도에서 선택한 장소' : lang === 'mn' ? 'Газрын зургаас сонгосон' : 'Selected from map'}
                    </p>
                  </div>
                  <button onClick={clearLocations} className="text-violet-300 hover:text-violet-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {focusLocations.map((name, i) => (
                    <span key={i} className="text-xs font-bold text-violet-800 bg-violet-100 px-2.5 py-1 rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Days */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  {tr('planner_days')}
                </label>
                <span className="text-primary font-black text-lg">{days} {tr('planner_days_unit')}</span>
              </div>
              <input type="range" min={1} max={14} value={days} onChange={e => setDays(Number(e.target.value))} className="w-full accent-primary h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{tr('range_day_1')}</span><span>{tr('range_day_7')}</span><span>{tr('range_day_14')}</span>
              </div>
            </div>

            {/* Group */}
            <OptionGrid
              icon={Users} lang={lang} options={GROUPS} value={groupType} onChange={setGroupType} cols={4}
              title={lang === 'kr' ? '동행' : lang === 'en' ? 'Group' : 'Хэн нартай'}
            />

            {/* Month selector */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-primary" />
                  {lang === 'kr' ? '여행 월 선택 (선택)' : lang === 'en' ? 'Travel Month (optional)' : 'Аяллын сар'}
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
                          isSelected ? sData.color : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
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
                  <div className={`rounded-xl border p-3.5 space-y-2.5 ${s.color}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{s.emoji}</span>
                      <span className="text-sm font-black">{s[lang] ?? s.en}</span>
                      <span className="text-xs font-semibold opacity-60 ml-auto">{info.temp}</span>
                    </div>
                    <div className="space-y-1">
                      {info.events.map((ev, i) => (
                        <p key={i} className="text-xs font-bold">{ev[lang] ?? ev.en}</p>
                      ))}
                    </div>
                    {info.topRoutes.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black opacity-60 mb-1.5">
                          {lang === 'kr' ? '추천 루트' : lang === 'en' ? 'Top Routes' : 'Санал болгосон маршрут'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {info.topRoutes.map((r, i) => (
                            <span key={i} className="text-[11px] font-bold bg-white/60 px-2.5 py-0.5 rounded-full">
                              {r[lang] ?? r.en}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {info.buses.length > 0 && (
                      <div className="border-t border-current/20 pt-2.5">
                        <p className="text-[10px] font-black opacity-60 mb-2">
                          {lang === 'kr' ? '주요 교통편' : lang === 'en' ? 'Key Transport' : 'Гол тээвэр'}
                        </p>
                        {info.buses.map((b, i) => (
                          <div key={i} className="flex items-start justify-between gap-2 mb-1.5 text-[11px]">
                            <span className="font-bold leading-tight">{b.label[lang] ?? b.label.en}</span>
                            <span className="opacity-70 text-right whitespace-nowrap">{b.departs} · {b.dur[lang] ?? b.dur.en}</span>
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
                    <p className="font-semibold text-gray-700 mb-2">
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
                          className={`aspect-square rounded-lg text-xs font-black flex items-center justify-center transition-all ${
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
                <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  {lang === 'kr' ? '출발 도시' : lang === 'en' ? 'Departure City' : 'Гарах хот'}
                </label>
                <input
                  type="text" value={departureCity} onChange={e => setDepartureCity(e.target.value)}
                  placeholder="Ulaanbaatar"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Differentiator callout */}
            <div className="bg-gradient-to-br from-violet-50 to-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs font-black text-gray-800 mb-3">
                {lang === 'kr' ? '✨ AI 플래너 vs 일반 여행사' : lang === 'en' ? '✨ AI Planner vs. Travel Agency' : '✨ AI Төлөвлөгч vs Аялал жуулчлал'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: '🆓', kr: '완전 무료', en: 'Completely free', mn: 'Үнэгүй' },
                  { emoji: '⚡', kr: '30초 즉시 생성', en: 'Ready in 30 sec', mn: '30 секундэд' },
                  { emoji: '🎯', kr: '100% 맞춤 일정', en: '100% personalized', mn: '100% тохируулсан' },
                  { emoji: '🗺', kr: '계절 최적화 루트', en: 'Season-smart routes', mn: 'Улирлын маршрут' },
                  { emoji: '🚌', kr: '실제 교통 정보 포함', en: 'Real transport info', mn: 'Бодит тээвэр' },
                  { emoji: '♾️', kr: '무제한 재생성', en: 'Unlimited retries', mn: 'Хязгааргүй' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2">
                    <span className="text-sm">{item.emoji}</span>
                    <span className="text-xs font-bold text-gray-700">{item[lang] ?? item.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading || interests.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 text-base"
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{tr('planner_generating')}</>
              ) : (
                <><Sparkles size={18} />{tr('planner_generate')}</>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {!result && !loading && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-500 text-base mb-2">{tr('planner_placeholder_line1')}</p>
                <p className="text-gray-400 text-sm">{tr('planner_placeholder_line2')}</p>
                {genError && <p className="text-red-400 text-sm mt-4 whitespace-pre-line">{genError}</p>}
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">{tr('planner_generating')}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-gray-900">
                    🗓️ {days}{tr('planner_days_unit')} {tr('custom_itinerary')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {result.itinerary?.length ?? 0} {lang === 'kr' ? '일' : lang === 'mn' ? 'өдөр' : 'days'}
                    </span>
                    {user && (
                      <button
                        onClick={handleSaveTrip}
                        disabled={savingTrip || !!savedTripId}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          savedTripId
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : savingTrip
                              ? 'bg-gray-100 border-gray-200 text-gray-400'
                              : 'bg-primary text-white border-primary hover:bg-primary-dark active:scale-95'
                        }`}
                      >
                        {savedTripId ? <><Check size={13} /> {lang === 'kr' ? '저장됨' : 'Saved'}</>
                          : savingTrip ? <><Loader size={13} className="animate-spin" /> {lang === 'kr' ? '저장 중' : 'Saving'}</>
                          : <><BookmarkPlus size={13} /> {lang === 'kr' ? '저장' : 'Save'}</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* Day cards */}
                {(result.itinerary ?? []).map(day => {
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
                    {/* Day header — click to expand/collapse */}
                    <button
                      onClick={toggleDay}
                      className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary/8 to-transparent border-b border-gray-100 text-left hover:bg-primary/5 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-black flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                        {day.day}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                            {lang === 'kr' ? `${day.day}일차` : lang === 'mn' ? `${day.day} өдөр` : `Day ${day.day}`}
                          </p>
                          {season && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${season.color}`}>
                              {season.emoji} {season[lang] ?? season.en}
                            </span>
                          )}
                          {day.estimated_drive_km > 0 && (
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              🚗 {day.estimated_drive_km}km
                            </span>
                          )}
                        </div>
                        <p className="font-black text-gray-900 text-sm leading-tight truncate">{day.title}</p>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Activities timeline — only when expanded */}
                    {isOpen && (
                      <div className="px-5 py-4 space-y-0">
                        {day.activities.map((act, i) => {
                          const isTransit = act.type === 'transit'
                          const roadLabel = act.road_type && act.road_type !== 'none'
                            ? (ROAD_TYPE_LABEL[act.road_type]?.[lang] ?? act.road_type)
                            : null
                          const transportInfo = act.transport && TRANSPORT_MAP[act.transport]
                            ? TRANSPORT_MAP[act.transport]
                            : null

                          if (isTransit) {
                            return (
                              <div key={i} className="mb-4">
                                <div className="flex items-stretch gap-3">
                                  <div className="flex flex-col items-center flex-shrink-0 w-11">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                                      {transportInfo ? transportInfo.emoji : '🚙'}
                                    </div>
                                  </div>
                                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                      <span className="text-xs font-black text-slate-600 uppercase tracking-wide">
                                        {transportInfo ? (transportInfo[lang] ?? transportInfo.en) : 'Transit'}
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                                        {act.time} {lang === 'kr' ? '출발' : lang === 'mn' ? 'гарна' : 'departs'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                                      {act.text.replace(/\*\*/g, '')}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {act.transit_km > 0 && (
                                        <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                                          📍 {act.transit_km}km
                                        </span>
                                      )}
                                      {roadLabel && (
                                        <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                                          🛣 {roadLabel}
                                        </span>
                                      )}
                                      {act.duration_min > 0 && (
                                        <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
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
                            <div key={i} className="flex gap-4 relative">
                              {i < day.activities.length - 1 && (
                                <div className="absolute left-[22px] top-10 bottom-0 w-px bg-gray-100" />
                              )}
                              <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-11">
                                <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 bg-white ${timeBg(act.time)}`}>
                                  {timeIcon(act.time)}
                                </div>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${timeBg(act.time)}`}>
                                  {act.time}
                                </span>
                              </div>
                              <div className={`flex-1 ${i < day.activities.length - 1 ? 'pb-5' : 'pb-1'}`}>
                                <p className="text-sm text-gray-700 leading-relaxed pt-1.5">
                                  {act.text.replace(/\*\*/g, '')}
                                </p>
                                {transportInfo && (
                                  <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
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
                {result.packing && result.packing.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Backpack size={16} className="text-emerald-600" />
                      </div>
                      <h3 className="font-black text-gray-900 text-sm">
                        {lang === 'kr' ? '준비물 체크리스트' : lang === 'mn' ? 'Бэлтгэх зүйлс' : 'Packing Checklist'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {result.packing.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                          <span className="w-4 h-4 rounded-full border-2 border-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-gray-700 font-medium leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-amber-500" />
                      <h3 className="font-black text-gray-900 text-sm">
                        {lang === 'kr' ? '현지 꿀팁' : lang === 'mn' ? 'Орон нутгийн зөвлөмж' : 'Local Tips'}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {result.tips.map((tip, i) => (
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
        </div>
      </div>
    </div>
  )
}
