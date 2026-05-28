import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { getRecommendations } from '../../utils/api'
import { SEASONAL_INFO, MONTH_NAMES } from '../../data/seasonalInfo'
import { Sparkles, MapPin, Loader, ChevronRight, Thermometer, Lightbulb, Star } from 'lucide-react'
import MobileLayout from './MobileLayout'

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
  { key: 'budget',  label: { kr: '저예산',    en: 'Budget',  mn: 'Хямд'     }, emoji: '💵' },
  { key: 'mid',     label: { kr: '중간',      en: 'Mid',     mn: 'Дунд'     }, emoji: '💳' },
  { key: 'premium', label: { kr: '프리미엄',  en: 'Premium', mn: 'Зэрэглэлтэй' }, emoji: '💎' },
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

function RecommendCard({ rec, idx, lang }) {
  const rankColors = ['from-primary to-emerald-600', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-500']
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${rankColors[idx]} p-4`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rec.emoji}</span>
            <div>
              <p className="font-black text-white text-base leading-tight">{rec.name}</p>
              <p className="text-white/70 text-[10px] font-semibold">{rec.name_en}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">
              {idx + 1}
            </span>
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              {rec.region}
            </span>
          </div>
        </div>
        {rec.vibe && (
          <span className="inline-block mt-2 text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
            ✨ {rec.vibe}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Season reason */}
        <p className="text-gray-700 text-xs leading-relaxed italic">{rec.season_reason}</p>

        {/* Weather */}
        {rec.weather && (
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            <Thermometer size={12} className="text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-[11px] font-semibold">{rec.weather}</p>
          </div>
        )}

        {/* Activities */}
        {rec.activities?.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase mb-1.5">
              {lang === 'kr' ? '주요 활동' : lang === 'mn' ? 'Үйл ажиллагаа' : 'Activities'}
            </p>
            <div className="space-y-1">
              {rec.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-[11px] text-gray-700 leading-snug">{act}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlight */}
        {rec.highlight && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 flex items-start gap-2">
            <Star size={12} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-[11px] font-semibold leading-snug">{rec.highlight}</p>
          </div>
        )}

        {/* Tips */}
        {rec.tips?.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 space-y-1">
            {rec.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <Lightbulb size={10} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-[10px] font-semibold leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileRecommend() {
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
    <MobileLayout>
      <div className="px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-primary" />
          <h1 className="text-2xl font-black text-gray-900">
            {lang === 'kr' ? 'AI 여행지 추천' : lang === 'mn' ? 'AI аялалын зөвлөмж' : 'AI Destination Pick'}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-5">
          {lang === 'kr' ? '여행 시기와 스타일에 맞는 몽골 여행지 3곳을 추천해 드려요'
            : lang === 'mn' ? 'Таны аяллын цаг хугацаа, хэв маягт тохирсон 3 газрыг санал болгоно'
            : 'We pick 3 Mongolia destinations perfectly matched to your season & style'}
        </p>

        {/* Month selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
          <p className="text-sm font-black text-gray-900 mb-3">
            {lang === 'kr' ? '🗓 여행 월 선택' : lang === 'mn' ? '🗓 Аяллын сар' : '🗓 Travel Month'}
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
                    active
                      ? `${ms.color} border-current`
                      : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="text-sm">{ms.emoji}</span>
                  <span className={`text-[10px] font-black mt-0.5 ${active ? '' : 'text-gray-600'}`}>
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
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
          <p className="text-sm font-black text-gray-900 mb-2.5">
            {lang === 'kr' ? '👥 여행 유형' : lang === 'mn' ? '👥 Аяллын төрөл' : '👥 Group Type'}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {GROUPS.map(g => (
              <button
                key={g.key}
                onClick={() => setGroupType(g.key)}
                className={`flex flex-col items-center py-2 rounded-xl border-2 text-center transition-all ${
                  groupType === g.key ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500'
                }`}
              >
                <span className="text-base">{g.emoji}</span>
                <span className="text-[9px] font-black mt-0.5">{g.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
          <p className="text-sm font-black text-gray-900 mb-2.5">
            {lang === 'kr' ? '💰 예산' : lang === 'mn' ? '💰 Төсөв' : '💰 Budget'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {BUDGETS.map(b => (
              <button
                key={b.key}
                onClick={() => setBudget(b.key)}
                className={`flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${
                  budget === b.key ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500'
                }`}
              >
                <span className="text-base">{b.emoji}</span>
                <span className="text-[9px] font-black mt-0.5">{b.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
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
                    active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-[9px] font-black mt-0.5">{item.label[lang]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={!selectedMonth || loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-emerald-600 text-white font-black rounded-2xl text-base shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading
            ? <><Loader size={18} className="animate-spin" /> {lang === 'kr' ? 'AI 분석 중...' : lang === 'mn' ? 'Шинжилж байна...' : 'Analysing...'}</>
            : <><Sparkles size={18} /> {lang === 'kr' ? 'AI 추천 받기' : lang === 'mn' ? 'AI зөвлөмж авах' : 'Get AI Picks'}</>
          }
        </button>

        {!selectedMonth && !loading && (
          <div className="text-center text-gray-400 text-sm py-4">
            {lang === 'kr' ? '여행 월을 먼저 선택하세요' : lang === 'mn' ? 'Эхлээд аяллын сараа сонгоно уу' : 'Select a travel month to begin'}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center text-red-600 text-sm mb-4">
            {lang === 'kr' ? '추천을 불러오지 못했습니다. 다시 시도해주세요.' : lang === 'mn' ? 'Зөвлөмж авахад алдаа гарлаа.' : 'Failed to load recommendations. Please try again.'}
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-black text-gray-500 px-2">
                {lang === 'kr' ? '🌟 AI 추천 여행지' : lang === 'mn' ? '🌟 AI зөвлөмж' : '🌟 AI Picks'}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {results.map((rec, i) => (
              <RecommendCard key={i} rec={rec} idx={i} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
