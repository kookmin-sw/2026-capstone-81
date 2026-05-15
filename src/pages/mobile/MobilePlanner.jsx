import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { generatePlanWithAI } from '../../utils/api'
import { saveTrip, defaultTripTitle } from '../../utils/trips'
import { Sparkles, Heart, Backpack, Lightbulb, Sunrise, Sun, Moon, Loader,
  Wallet, Gauge, Users, Bed, Calendar, MapPin, BookmarkPlus, Check } from 'lucide-react'
import MobileLayout from './MobileLayout'

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

export default function MobilePlanner() {
  const { lang } = useLang()
  const { user } = useAuth()
  const [days, setDays] = useState(3)
  const [selectedInterests, setSelectedInterests] = useState([])
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

  // Re-generating clears any previous "Saved" badge so the user can save the
  // new plan separately.
  const resetSavedState = () => setSavedId(null)

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
        <p className="text-gray-500 text-sm mb-5">
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

        {/* Interests */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
          <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
            <Heart size={15} className="text-primary" />
            {lang === 'kr' ? '관심사 선택' : lang === 'en' ? 'Select Interests' : 'Сонирхол сонгох'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest.key}
                onClick={() => toggleInterest(interest.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  selectedInterests.includes(interest.key)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <span className="text-xl">{interest.emoji}</span>
                <span className={`text-[10px] font-bold ${selectedInterests.includes(interest.key) ? 'text-primary' : 'text-gray-600'}`}>
                  {interest.label[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
            <Wallet size={15} className="text-primary" />
            {lang === 'kr' ? '예산 수준' : lang === 'en' ? 'Budget Level' : 'Төсөв'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {BUDGETS.map(b => (
              <button key={b.key} onClick={() => setBudget(b.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${budget === b.key ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                <span className="text-lg">{b.emoji}</span>
                <span className={`text-[10px] font-bold ${budget === b.key ? 'text-primary' : 'text-gray-600'}`}>{b.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pace */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
            <Gauge size={15} className="text-primary" />
            {lang === 'kr' ? '여행 페이스' : lang === 'en' ? 'Pace' : 'Хурд'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PACES.map(p => (
              <button key={p.key} onClick={() => setPace(p.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${pace === p.key ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                <span className="text-lg">{p.emoji}</span>
                <span className={`text-[10px] font-bold ${pace === p.key ? 'text-primary' : 'text-gray-600'}`}>{p.label[lang]}</span>
              </button>
            ))}
          </div>
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

        {/* Accommodation */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 flex items-center gap-2 mb-3">
            <Bed size={15} className="text-primary" />
            {lang === 'kr' ? '숙소 선호' : lang === 'en' ? 'Stay Type' : 'Байр'}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {STAYS.map(s => (
              <button key={s.key} onClick={() => setAccommodation(s.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${accommodation === s.key ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                <span className="text-lg">{s.emoji}</span>
                <span className={`text-[9px] font-bold ${accommodation === s.key ? 'text-primary' : 'text-gray-600'}`}>{s.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date + Departure */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 space-y-3">
          <div>
            <label className="text-sm font-black text-gray-900 flex items-center gap-2 mb-2">
              <Calendar size={15} className="text-primary" />
              {lang === 'kr' ? '시작 날짜 (선택)' : lang === 'en' ? 'Start Date (optional)' : 'Эхлэх огноо'}
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary" />
          </div>
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
            {(plan.itinerary ?? []).map(day => (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Day header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/8 to-transparent border-b border-gray-100">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                    {day.day}
                  </span>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {lang === 'kr' ? `${day.day}일차` : lang === 'mn' ? `${day.day} өдөр` : `Day ${day.day}`}
                    </p>
                    <p className="font-black text-gray-900 text-sm leading-tight">{day.title}</p>
                  </div>
                </div>

                {/* Activities timeline */}
                <div className="px-4 py-3 space-y-0">
                  {(day.activities ?? []).map((act, i) => (
                    <div key={i} className="flex gap-3 relative">
                      {i < day.activities.length - 1 && (
                        <div className="absolute left-[18px] top-9 bottom-0 w-px bg-gray-100" />
                      )}
                      {/* Time + icon column */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 w-9">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 bg-white ${timeBg(act.time)}`}>
                          {timeIcon(act.time)}
                        </div>
                        <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${timeBg(act.time)}`}>
                          {act.time}
                        </span>
                      </div>
                      {/* Activity text */}
                      <div className={`flex-1 ${i < day.activities.length - 1 ? 'pb-4' : 'pb-1'}`}>
                        <p className="text-xs text-gray-700 leading-relaxed pt-1.5">
                          {act.text.replace(/\*\*/g, '')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

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
