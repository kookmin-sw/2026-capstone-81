import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { generatePlanWithGemini } from '../../utils/gemini'
import { Sparkles, ChevronDown, ChevronUp, Clock, MapPin, Loader } from 'lucide-react'
import MobileLayout from './MobileLayout'

const INTERESTS = [
  { key: 'nature', label: { kr: '자연', en: 'Nature', mn: 'Байгаль' }, emoji: '🏔️' },
  { key: 'culture', label: { kr: '문화', en: 'Culture', mn: 'Соёл' }, emoji: '🏛️' },
  { key: 'adventure', label: { kr: '어드벤처', en: 'Adventure', mn: 'Адал явдал' }, emoji: '🐎' },
  { key: 'food', label: { kr: '음식', en: 'Food', mn: 'Хоол' }, emoji: '🍖' },
  { key: 'photography', label: { kr: '사진', en: 'Photo', mn: 'Зураг' }, emoji: '📸' },
  { key: 'history', label: { kr: '역사', en: 'History', mn: 'Түүх' }, emoji: '📜' },
]

export default function MobilePlanner() {
  const { lang } = useLang()
  const [days, setDays] = useState(3)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [startDate, setStartDate] = useState('')
  const [departureCity, setDepartureCity] = useState('')
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedDay, setExpandedDay] = useState(0)

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
    try {
      const langLabel = lang === 'kr' ? 'Korean' : lang === 'en' ? 'English' : 'Mongolian'
      const interestLabels = selectedInterests.map(k => INTERESTS.find(i => i.key === k)?.label.en || k)
      const result = await generatePlanWithGemini(days, interestLabels, langLabel)
      setPlan(result)
      setExpandedDay(0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const difficultyColor = {
    easy: 'bg-emerald-100 text-emerald-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-primary" />
          <h1 className="text-2xl font-black text-gray-900">
            {lang === 'kr' ? 'AI 플래너' : lang === 'en' ? 'AI Planner' : 'AI Төлөвлөгч'}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-5">
          {lang === 'kr' ? 'AI가 최적의 몽골 여행 일정을 만들어드려요' : lang === 'en' ? 'AI creates your perfect Mongolia itinerary' : 'AI танд хамгийн тохиромжтой аяллын хуваарийг гаргаж өгнө'}
        </p>

        {/* 여행 일수 */}
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

        {/* 관심사 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 mb-3">
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

        {/* 출발 도시 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-black text-gray-900 mb-2">
            {lang === 'kr' ? '출발 도시 (선택)' : lang === 'en' ? 'Departure City (optional)' : 'Хөдлөх хот (заавал биш)'}
          </p>
          <input
            type="text"
            value={departureCity}
            onChange={e => setDepartureCity(e.target.value)}
            placeholder={lang === 'kr' ? '예: 서울' : lang === 'en' ? 'e.g. Seoul' : 'Жш: Улаанбаатар'}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* 시작 날짜 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
          <p className="text-sm font-black text-gray-900 mb-2">
            {lang === 'kr' ? '시작 날짜 (선택)' : lang === 'en' ? 'Start Date (optional)' : 'Эхлэх огноо (заавал биш)'}
          </p>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={loading || selectedInterests.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-black rounded-2xl text-base shadow-lg disabled:opacity-50 mb-5"
        >
          {loading ? (
            <><Loader size={18} className="animate-spin" /> {lang === 'kr' ? '생성 중...' : lang === 'en' ? 'Generating...' : 'Үүсгэж байна...'}</>
          ) : (
            <><Sparkles size={18} /> {lang === 'kr' ? 'AI 일정 만들기' : lang === 'en' ? 'Generate Itinerary' : 'Хуваарь гаргах'}</>
          )}
        </button>

        {/* 오류 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 결과 */}
        {plan && (
          <div className="space-y-3">
            <h2 className="text-lg font-black text-gray-900">
              {lang === 'kr' ? '여행 일정' : lang === 'en' ? 'Your Itinerary' : 'Аяллын хуваарь'}
            </h2>
            {plan.map((day, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center">
                      {day.day}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-gray-900 text-sm">{day.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColor[day.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                          {day.difficulty}
                        </span>
                        {day.estimated_drive_km > 0 && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <MapPin size={9} />{day.estimated_drive_km}km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedDay === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {expandedDay === idx && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    {day.weather_note && (
                      <p className="text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2 mt-3 mb-3">🌤️ {day.weather_note}</p>
                    )}
                    <div className="space-y-3">
                      {day.activities.map((act, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-primary w-12 text-center">{act.time}</span>
                            {i < day.activities.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed flex-1 pb-3">{act.text}</p>
                        </div>
                      ))}
                    </div>
                    {day.preparation?.length > 0 && (
                      <div className="mt-3 bg-amber-50 rounded-xl p-3">
                        <p className="text-xs font-black text-amber-700 mb-2">
                          {lang === 'kr' ? '준비물' : lang === 'en' ? 'What to bring' : 'Авч явах зүйлс'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {day.preparation.map((item, i) => (
                            <span key={i} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}