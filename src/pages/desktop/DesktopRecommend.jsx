import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { getRecommendations } from '../../utils/api'
import { SEASONAL_INFO, MONTH_NAMES } from '../../data/seasonalInfo'
import { Sparkles, Loader, Thermometer, Lightbulb, Star } from 'lucide-react'

const SEASONS = {
  spring: { kr: '봄', en: 'Spring', mn: 'Хавар', emoji: '🌸', color: 'text-pink-600 bg-pink-50 border-pink-200' },
  summer: { kr: '여름', en: 'Summer', mn: 'Зун',   emoji: '☀️', color: 'text-orange-500 bg-orange-50 border-orange-200' },
  fall:   { kr: '가을', en: 'Autumn', mn: 'Намар', emoji: '🍂', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  winter: { kr: '겨울', en: 'Winter', mn: 'Өвөл',  emoji: '❄️', color: 'text-blue-500 bg-blue-50 border-blue-200' },
}

const GROUPS = [
  { key: 'solo',    label: { kr: '혼자',  en: 'Solo',    mn: 'Ганцаараа' }, emoji: '🧍' },
  { key: 'couple',  label: { kr: '커플',  en: 'Couple',  mn: 'Хосоор'   }, emoji: '💑' },
  { key: 'family',  label: { kr: '가족',  en: 'Family',  mn: 'Гэр бүл'  }, emoji: '👨‍👩‍👧' },
  { key: 'friends', label: { kr: '친구',  en: 'Friends', mn: 'Найзууд'  }, emoji: '👯' },
]

const BUDGETS = [
  { key: 'budget',  label: { kr: '저예산',   en: 'Budget',  mn: 'Хямд'         }, emoji: '💵' },
  { key: 'mid',     label: { kr: '중간',     en: 'Mid',     mn: 'Дунд'         }, emoji: '💳' },
  { key: 'premium', label: { kr: '프리미엄', en: 'Premium', mn: 'Зэрэглэлтэй'  }, emoji: '💎' },
]

const INTERESTS = [
  { key: 'nature',      label: { kr: '자연',     en: 'Nature',     mn: 'Байгаль'    }, emoji: '🏔️' },
  { key: 'adventure',   label: { kr: '어드벤처', en: 'Adventure',  mn: 'Адал явдал' }, emoji: '🐎' },
  { key: 'culture',     label: { kr: '문화',     en: 'Culture',    mn: 'Соёл'       }, emoji: '🏛️' },
  { key: 'food',        label: { kr: '음식',     en: 'Food',       mn: 'Хоол'       }, emoji: '🍖' },
  { key: 'healing',     label: { kr: '힐링',     en: 'Healing',    mn: 'Амралт'     }, emoji: '🧘' },
  { key: 'photography', label: { kr: '사진',     en: 'Photo',      mn: 'Зураг'      }, emoji: '📸' },
]

const LANG_LABEL = { kr: 'Korean', en: 'English', mn: 'Mongolian' }

const RANK_STYLES = [
  { gradient: 'from-primary to-emerald-600', badge: 'bg-primary/10 text-primary' },
  { gradient: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-600' },
  { gradient: 'from-amber-500 to-orange-500', badge: 'bg-amber-100 text-amber-700' },
]

function RecommendCard({ rec, idx, lang }) {
  const style = RANK_STYLES[idx]
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className={`bg-gradient-to-r ${style.gradient} p-5`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{rec.emoji}</span>
            <div>
              <p className="font-black text-white text-lg leading-tight">{rec.name}</p>
              <p className="text-white/70 text-xs font-semibold mt-0.5">{rec.name_en}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="w-7 h-7 rounded-full bg-white/25 text-white text-sm font-black flex items-center justify-center">
              {idx + 1}
            </span>
            <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
              {rec.region}
            </span>
          </div>
        </div>
        {rec.vibe && (
          <span className="inline-block mt-3 text-[11px] font-bold bg-white/20 text-white px-3 py-1 rounded-full">
            ✨ {rec.vibe}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4 flex-1">
        <p className="text-gray-600 text-sm leading-relaxed italic">{rec.season_reason}</p>

        {rec.weather && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            <Thermometer size={14} className="text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-xs font-semibold">{rec.weather}</p>
          </div>
        )}

        {rec.activities?.length > 0 && (
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase mb-2">
              {lang === 'kr' ? '주요 활동' : lang === 'mn' ? 'Үйл ажиллагаа' : 'Activities'}
            </p>
            <div className="space-y-1.5">
              {rec.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`w-5 h-5 rounded-full ${style.badge} text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5`}>{i + 1}</span>
                  <p className="text-xs text-gray-700 leading-snug">{act}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {rec.highlight && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-start gap-2">
            <Star size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-xs font-semibold leading-snug">{rec.highlight}</p>
          </div>
        )}

        {rec.tips?.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 space-y-1.5">
            {rec.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <Lightbulb size={11} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs font-semibold leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DesktopRecommend() {
  const { lang } = useLang()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [groupType, setGroupType] = useState('solo')
  const [budget, setBudget] = useState('mid')
  const [interests, setInterests] = useState(['nature'])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const info = selectedMonth ? SEASONAL_INFO[selectedMonth] : null
  const sData = info ? SEASONS[info.season] : null

  const toggleInterest = (key) => {
    setInterests(prev =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter(k => k !== key) : prev) : [...prev, key]
    )
  }

  const generate = async () => {
    if (!selectedMonth) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await getRecommendations(
        selectedMonth,
        info.season,
        info.temp,
        info.events,
        groupType,
        budget,
        interests,
        LANG_LABEL[lang]
      )
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-full p-6 overflow-hidden">
      {/* Left: form */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Sparkles size={22} className="text-primary" />
            {lang === 'kr' ? 'AI 여행지 추천' : lang === 'mn' ? 'AI аяллын зөвлөмж' : 'AI Destination Pick'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {lang === 'kr' ? '시기와 스타일에 맞는 몽골 명소 3곳'
              : lang === 'mn' ? 'Таны цаг, хэв маягт тохирсон 3 газар'
              : 'Top 3 Mongolia spots for your season & style'}
          </p>
        </div>

        {/* Month */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-3">
            {lang === 'kr' ? '🗓 여행 월' : lang === 'mn' ? '🗓 Аяллын сар' : '🗓 Travel Month'}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
              const mInfo = SEASONAL_INFO[m]
              const ms = SEASONS[mInfo.season]
              const active = selectedMonth === m
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(prev => prev === m ? null : m)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 text-center transition-all ${
                    active ? `${ms.color} border-current` : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="text-xs">{ms.emoji}</span>
                  <span className={`text-[9px] font-black mt-0.5 ${active ? '' : 'text-gray-600'}`}>
                    {MONTH_NAMES[lang][m - 1]}
                  </span>
                </button>
              )
            })}
          </div>
          {sData && info && (
            <div className={`mt-3 rounded-xl px-3 py-2 border ${sData.color} flex items-center gap-2`}>
              <span>{sData.emoji}</span>
              <div>
                <p className="text-xs font-black">{sData[lang]} · {info.temp}</p>
                {info.events[0] && <p className="text-[10px] opacity-80">{info.events[0][lang]}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Group */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-2.5">
            {lang === 'kr' ? '👥 여행 유형' : lang === 'mn' ? '👥 Аяллын төрөл' : '👥 Group Type'}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {GROUPS.map(g => (
              <button
                key={g.key}
                onClick={() => setGroupType(g.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                  groupType === g.key ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-sm">{g.emoji}</span>
                <span className="text-xs font-bold">{g.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-2.5">
            {lang === 'kr' ? '💰 예산' : lang === 'mn' ? '💰 Төсөв' : '💰 Budget'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {BUDGETS.map(b => (
              <button
                key={b.key}
                onClick={() => setBudget(b.key)}
                className={`flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${
                  budget === b.key ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                <span>{b.emoji}</span>
                <span className="text-[10px] font-bold mt-0.5">{b.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-2.5">
            {lang === 'kr' ? '🎯 여행 스타일' : lang === 'mn' ? '🎯 Аяллын хэв маяг' : '🎯 Travel Style'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {INTERESTS.map(item => {
              const active = interests.includes(item.key)
              return (
                <button
                  key={item.key}
                  onClick={() => toggleInterest(item.key)}
                  className={`flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${
                    active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-600'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span className="text-[10px] font-bold mt-0.5">{item.label[lang]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!selectedMonth || loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-emerald-600 text-white font-black rounded-2xl text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? <><Loader size={16} className="animate-spin" /> {lang === 'kr' ? 'AI 분석 중...' : lang === 'mn' ? 'Шинжилж байна...' : 'Analysing...'}</>
            : <><Sparkles size={16} /> {lang === 'kr' ? 'AI 추천 받기' : lang === 'mn' ? 'AI зөвлөмж авах' : 'Get AI Picks'}</>
          }
        </button>
      </div>

      {/* Right: results */}
      <div className="flex-1 overflow-y-auto">
        {!results && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles size={36} className="text-primary" />
            </div>
            <p className="text-gray-700 font-black text-lg mb-2">
              {lang === 'kr' ? '맞춤 여행지를 찾아드릴게요' : lang === 'mn' ? 'Таны аяллын газрыг олъё' : 'Find your perfect Mongolia'}
            </p>
            <p className="text-gray-400 text-sm max-w-xs">
              {lang === 'kr' ? '여행 월, 그룹 유형, 예산, 관심사를 선택하고 AI 추천을 받아보세요'
                : lang === 'mn' ? 'Сар, бүлгийн төрөл, төсөв, сонирхлоо сонгоод AI зөвлөмж аваарай'
                : 'Select your travel month, group, budget and interests, then let AI pick your top spots'}
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader size={40} className="text-primary animate-spin" />
            <p className="text-gray-500 font-semibold">
              {lang === 'kr' ? '최적의 여행지를 분석하고 있어요...' : lang === 'mn' ? 'Хамгийн тохиромжтой газрыг шинжилж байна...' : 'Finding your best destinations...'}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md">
              <p className="text-red-600 font-semibold text-sm">
                {lang === 'kr' ? '추천을 불러오지 못했습니다. 다시 시도해주세요.' : lang === 'mn' ? 'Зөвлөмж авахад алдаа гарлаа.' : 'Failed to load recommendations. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-3 gap-4 pb-4">
            {results.map((rec, i) => (
              <RecommendCard key={i} rec={rec} idx={i} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
