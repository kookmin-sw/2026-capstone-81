import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Calculator } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { generatePlanWithGemini } from '../utils/gemini'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const INTERESTS = [
  { key: 'int_nature', emoji: '🌿' },
  { key: 'int_culture', emoji: '🎭' },
  { key: 'int_food', emoji: '🍖' },
  { key: 'int_adventure', emoji: '⛺' },
  { key: 'int_photo', emoji: '📸' },
  { key: 'int_history', emoji: '📜' },
]
const DAY_OPTIONS = [3, 5, 7, 10, 14]
const langLabels = { kr: '한국어', en: 'English', mn: 'Mongolian' }

const ratesUSD = {
  budget: { flight: 265, hotel: 15, food: 8, activity: 10, transport: 5 },
  mid: { flight: 450, hotel: 50, food: 20, activity: 30, transport: 15 },
  luxury: { flight: 800, hotel: 150, food: 50, activity: 70, transport: 30 },
}
const fx = { en: 1, kr: 1480, mn: 3580 }
const sym = { en: '$', kr: '₩', mn: '₮' }

function calcBudget(days, people, style, lang) {
  const r = ratesUSD[style], rate = fx[lang] || 1, c = (v) => Math.round(v * rate)
  const b = { flight: c(r.flight * people), hotel: c(r.hotel * days * people), food: c(r.food * days * people), activity: c(r.activity * days * people), transport: c(r.transport * days * people) }
  b.total = Object.values(b).reduce((a, v) => a + v, 0)
  return b
}

const fmtMoney = (n, lang) => {
  const s = sym[lang] || '$'
  return lang === 'kr' || lang === 'mn' ? `${n.toLocaleString()}${s}` : `${s}${n.toLocaleString()}`
}

// Format drive time from km using Mongolian unpaved road speed (3–5 min/km)
function formatDriveTime(km, lang) {
  if (!km || km === 0) return null
  const minMin = km * 3
  const maxMin = km * 5
  const timeStr = maxMin < 60
    ? `${minMin}~${maxMin}${lang === 'en' ? 'min' : lang === 'mn' ? 'мин' : '분'}`
    : `${(minMin / 60).toFixed(1)}~${(maxMin / 60).toFixed(1)}${lang === 'en' ? 'h' : lang === 'mn' ? 'цаг' : '시간'}`
  return `${km}km · ${lang === 'en' ? '~' : '약 '}${timeStr}`
}

const DIFFICULTY_STYLES = {
  easy:     'bg-green-100 text-green-700',
  moderate: 'bg-orange-100 text-orange-700',
  hard:     'bg-red-100 text-red-700',
}

export default function AIPlanner() {
  const { tr, lang } = useLang()
  const [tab, setTab] = useState('plan')
  // Planner state
  const [days, setDays] = useState(5)
  const [interests, setInterests] = useState(['int_nature'])
  const [startDate, setStartDate] = useState('')
  const [departureCity, setDepartureCity] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [openDay, setOpenDay] = useState(null)
  // Budget state
  const [bDays, setBDays] = useState(5)
  const [people, setPeople] = useState(2)
  const [style, setStyle] = useState('mid')
  const [budget, setBudget] = useState(null)

  const toggle = (k) => setInterests(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])

  const generate = async () => {
    setLoading(true); setResult(null); setOpenDay(null); setGenError('')
    try {
      const interestLabels = interests.map(k => tr(k))
      const plan = await generatePlanWithGemini(
        days,
        interestLabels,
        langLabels[lang] || 'Korean'
      )
      setResult(plan)
      if (plan.length) setOpenDay(1)
    } catch {
      setGenError(lang === 'kr' ? '일정 생성에 실패했습니다. 다시 시도해주세요.' : 'Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const L = {
    kr: { plan: '🗺️일정', budget: '💰 경비', days: '며칠?', interest: '뭐가 좋아요?', go: '일정 만들기', making: 'AI가 만드는 중..', redo: '다시', people: '인원', style: '스타일', calc: '계산하기', total: '예상 총비용' },
    en: { plan: '🗺️Itinerary', budget: '💰 Budget', days: 'How many days?', interest: 'Interests', go: 'Create', making: 'Creating...', redo: 'Redo', people: 'People', style: 'Style', calc: 'Calculate', total: 'Estimated Total' },
    mn: { plan: '🗺️Хуваари', budget: '💰 Зардал', days: 'Хэдэн өдөр?', interest: 'Сонирхол', go: 'Үүсгэх', making: 'Үүсгэж байна...', redo: 'Дахин', people: 'Хүн', style: 'Хэлбэр', calc: 'Тооцоолох', total: 'Нийт зардал' },
  }
  const l = L[lang] || L.en

  const difficultyLabel = (d) => {
    const map = {
      easy:     tr('difficulty_easy'),
      moderate: tr('difficulty_moderate'),
      hard:     tr('difficulty_hard'),
    }
    return map[d] || d
  }

  const budgetLabels = { flight: tr('budget_flight'), hotel: tr('budget_hotel'), food: tr('budget_food'), activity: tr('budget_activity'), transport: tr('budget_transport') }
  const budgetEmoji = { flight: '✈️', hotel: '🏨', food: '🍽️', activity: '🎯', transport: '🚌' }

  return (
    <div className="flex flex-col h-full bg-white">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Title */}
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-primary" />
            <h1 className="text-xl font-black text-gray-900">
              {lang === 'kr' ? 'AI 여행 플래너' : lang === 'mn' ? 'AI аялалын Төлөвлөгөө' : 'AI Travel Planner'}
            </h1>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 mb-5">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            {['plan', 'budget'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                }`}>
                {t === 'plan' ? l.plan : l.budget}
              </button>
            ))}
          </div>
        </div>

        {/* ===== PLAN TAB — Input ===== */}
        {tab === 'plan' && !result && (
          <div className="px-5 space-y-6">
            {/* Days */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">{l.days}</p>
              <div className="flex gap-2">
                {DAY_OPTIONS.map(d => (
                  <button key={d} onClick={() => setDays(d)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                      days === d ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-gray-100 text-gray-500'
                    }`}>{d}{lang === 'kr' ? '일' : lang === 'mn' ? 'ө' : 'd'}</button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">{l.interest}</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(({ key, emoji }) => (
                  <button key={key} onClick={() => toggle(key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      interests.includes(key) ? 'bg-primary-light text-secondary ring-2 ring-primary' : 'bg-gray-100 text-gray-500'
                    }`}><span>{emoji}</span>{tr(key)}</button>
                ))}
              </div>
            </div>

            {/* Start date */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">{tr('planner_start_date')}</p>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            {/* Departure city */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">{tr('planner_departure')}</p>
              <input
                type="text"
                value={departureCity}
                onChange={e => setDepartureCity(e.target.value)}
                placeholder={tr('planner_departure_placeholder')}
                className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/40 transition placeholder-gray-400"
              />
            </div>

            <button onClick={generate} disabled={loading || !interests.length}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] disabled:opacity-40 transition-all text-sm">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{l.making}</> : <><Sparkles size={16} />{l.go}</>}
            </button>
            {genError && <p className="text-center text-xs text-red-400 pt-1">{genError}</p>}
          </div>
        )}

        {/* ===== PLAN TAB — Results ===== */}
        {tab === 'plan' && result && (
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900">🗺️ {days}{lang === 'kr' ? '일 일정' : lang === 'mn' ? ' өдрийн хуваари' : '-day itinerary'}</h2>
              <button onClick={() => { setResult(null); setOpenDay(null) }} className="text-sm text-primary font-semibold">{l.redo}</button>
            </div>
            <div className="space-y-2">
              {result.map(day => {
                const isOpen = openDay === day.day
                const driveText = formatDriveTime(day.estimated_drive_km, lang)
                return (
                  <div key={day.day} className="bg-gray-50 rounded-2xl overflow-hidden">
                    <button onClick={() => setOpenDay(isOpen ? null : day.day)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                      <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">{day.day}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{day.title}</p>
                        <p className="text-xs text-gray-400">{day.activities?.length ?? 0} {lang === 'kr' ? '활동' : 'activities'}</p>
                      </div>
                      {day.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${DIFFICULTY_STYLES[day.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                          {difficultyLabel(day.difficulty)}
                        </span>
                      )}
                      {isOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        {/* Drive distance + time */}
                        {driveText && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white rounded-xl px-3 py-2">
                            <span>🚗</span>
                            <span className="font-medium">{tr('drive_dist_label')}:</span>
                            <span>{driveText}</span>
                            <span className="text-gray-300 text-[10px] ml-auto">{lang === 'kr' ? '비포장도로 기준' : lang === 'mn' ? 'хайрган замаар' : 'unpaved road'}</span>
                          </div>
                        )}

                        {/* Weather note */}
                        {day.weather_note && (
                          <div className="flex items-start gap-2 bg-sky-50 rounded-xl px-3 py-2.5">
                            <span className="text-sm flex-shrink-0">🌤</span>
                            <div>
                              <p className="text-[10px] font-bold text-sky-600 mb-0.5">{tr('weather_note_label')}</p>
                              <p className="text-xs text-sky-800">{day.weather_note}</p>
                            </div>
                          </div>
                        )}

                        {/* Preparation */}
                        {day.preparation && day.preparation.length > 0 && (
                          <div className="bg-amber-50 rounded-xl px-3 py-2.5">
                            <p className="text-[10px] font-bold text-amber-600 mb-2">🎒 {tr('preparation_label')}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {day.preparation.map((item, i) => (
                                <span key={i} className="px-2 py-1 bg-amber-100 rounded-full text-xs text-amber-700 font-medium">{item}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        <div className="space-y-2">
                          {day.activities?.map((a, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-3 py-2.5">
                              <span className="text-xs text-primary font-bold bg-primary-light px-2 py-0.5 rounded-lg mt-0.5 flex-shrink-0">{a.time}</span>
                              <span className="text-sm text-gray-700">{a.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ===== BUDGET TAB ===== */}
        {tab === 'budget' && (
          <div className="px-5 space-y-5">
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">{l.days}</p>
              <div className="flex gap-2">
                {DAY_OPTIONS.map(d => (
                  <button key={d} onClick={() => setBDays(d)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                      bDays === d ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 text-gray-500'
                    }`}>{d}{lang === 'kr' ? '일' : lang === 'mn' ? 'ө' : 'd'}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">{l.people}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setPeople(p)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                      people === p ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 text-gray-500'
                    }`}>{p}{lang === 'kr' ? '명' : lang === 'mn' ? '' : ''}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">{l.style}</p>
              <div className="flex gap-2">
                {[{ k: 'budget', e: '🎒' }, { k: 'mid', e: '⭐' }, { k: 'luxury', e: '💎' }].map(({ k, e }) => (
                  <button key={k} onClick={() => setStyle(k)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                      style === k ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 text-gray-500'
                    }`}>
                    <span className="text-lg">{e}</span>
                    {k === 'budget' ? tr('budget_type_budget') : k === 'mid' ? tr('budget_type_mid') : tr('budget_type_luxury')}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setBudget(calcBudget(bDays, people, style, lang))}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all text-sm">
              <Calculator size={16} />{l.calc}
            </button>

            {budget && (
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-400 mb-1">{l.total}</p>
                  <p className="text-3xl font-black text-emerald-600">{fmtMoney(budget.total, lang)}</p>
                  <p className="text-xs text-gray-400 mt-1">{bDays}{lang === 'kr' ? '일' : 'd'} · {people}{lang === 'kr' ? '명' : 'p'}</p>
                </div>
                {Object.entries(budgetLabels).map(([k, label]) => {
                  const pct = Math.round((budget[k] / budget.total) * 100)
                  return (
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-lg w-6 text-center">{budgetEmoji[k]}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{label}</span>
                          <span className="font-bold text-gray-900">{fmtMoney(budget[k], lang)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-emerald-400 rounded-full h-1.5" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
