import { useState } from 'react'
import { Sparkles, ChevronRight, Clock, DollarSign, Heart } from 'lucide-react'
import { useLang } from '../context/LangContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const interestKeys = ['int_nature', 'int_culture', 'int_food', 'int_adventure', 'int_photo', 'int_history']
const interestEmojis = {
  int_nature: '🏔️', int_culture: '🏛️', int_food: '🍖',
  int_adventure: '🐎', int_photo: '📸', int_history: '📜',
}

function generateItinerary(days, budget, interests) {
  const tier = budget < 100 ? 'budget' : budget <= 250 ? 'mid' : 'luxury'

  const hotel = { budget: '🏕️ 게스트하우스 / 게르 캠프 숙박', mid: '🏨 호텔 체크인', luxury: '🏰 럭셔리 게르 리조트 숙박' }[tier]
  const move = { budget: '🚌 대중버스 이동', mid: '🚗 전용 차량 이동', luxury: '✈️ 경비행기 / VIP 차량 이동' }[tier]
  const dinner = { budget: '🍖 현지 식당 저녁', mid: '🍖 전통 음식 레스토랑', luxury: '🍽️ 파인다이닝 몽골 요리' }[tier]

  const pools = {
    int_culture: [
      { title: '울란바토르 문화 탐방', activities: ['🏛️ 간단 사원 (Gandantegchinlen)', '🏛️ 국립 역사 박물관', '🎭 전통 공연 관람', '🛍️ 나란툴 시장'] },
      { title: '나담 & 전통 문화', activities: ['🎯 전통 활쏘기 체험', '🎺 마두금 전통 악기 연주', '🍖 전통 음식 코스', '🎭 민속 공연 관람'] },
      { title: '유목민 문화 체험', activities: ['🏕️ 게르 방문 & 문화 교류', '🥛 아이락 시음', '🎭 전통 의상 체험', '🌙 유목 생활 이야기'] },
    ],
    int_nature: [
      { title: '테를지 국립공원', activities: [move + ' 테를지 이동 (55km)', '🐎 승마 체험', '🧗 거북 바위 하이킹', hotel] },
      { title: '홉스골 호수', activities: [move + ' 홉스골 이동', '🏊 호수 수영', '🚣 카약 체험', '🎣 낚시 & 🌲 삼림욕'] },
      { title: '끝없는 초원', activities: ['🌄 일출 감상', '🌾 초원 드라이브', '🦅 독수리 관찰', '⭐ 별자리 관찰'] },
    ],
    int_adventure: [
      { title: '고비 사막 어드벤처', activities: [move + ' 달란자드가드 이동', '🐪 낙타 트레킹', '🏜️ 홍고린 엘스 모래 언덕', '🌅 모래 언덕 일몰'] },
      { title: '승마 & 트레킹', activities: ['🐎 전일 승마 트레킹', '🧗 암벽 하이킹', '🏹 활쏘기 체험', '🏕️ 야영 캠핑'] },
      { title: '협곡 & 사막 2일차', activities: ['🦎 욜링암 협곡 탐방', '🧗 협곡 트레킹', '🦅 독수리 사냥꾼 만남', '🔥 모닥불 바베큐'] },
    ],
    int_food: [
      { title: '몽골 음식 투어', activities: ['🍖 호르헉 전통 양고기 체험', '🥟 보즈 만두 직접 만들기', '🍵 수테차 시음', '🛍️ 재래시장 식재료 투어'] },
      { title: '유목민 식문화', activities: ['🥛 아이락 발효주 체험', '🧈 아롤 전통 치즈 만들기', '🍖 유목민 오픈 BBQ', '🌾 전통 방식 조리 체험'] },
    ],
    int_photo: [
      { title: '일출 & 풍경 촬영', activities: ['🌄 테를지 일출 촬영 (새벽 출발)', '📸 거북 바위 포토스팟', '🌅 초원 황금빛 석양', '🌙 은하수 장노출 촬영'] },
      { title: '고비 포토 투어', activities: ['📸 모래 언덕 실루엣 촬영', '🌅 사막 일몰 포토존', '🐪 낙타 & 사막 풍경', '🌌 사막 별하늘 촬영'] },
      { title: '도시 스냅 촬영', activities: ['🏛️ 수흐바타르 광장 스냅', '🌆 도시 파노라마 뷰포인트', '🕌 사원 건축 디테일 촬영', '🌃 울란바토르 야경'] },
    ],
    int_history: [
      { title: '역사 & 유적 탐방', activities: ['🏛️ 국립 역사 박물관', '⚔️ 칭기즈칸 기마상', '📜 몽골 제국 역사관', '🎖️ 복드 궁전 박물관'] },
      { title: '고비 화석 투어', activities: [move + ' 고비 화석 발굴지 이동', '🦕 공룡 화석 발굴 체험', '🏛️ 자연사 박물관', '📜 선사시대 역사 해설'] },
      { title: '고대 문명 탐방', activities: ['🏰 카라코룸 고도 방문', '⚔️ 오르혼 계곡 세계유산', '📜 돌궐 비문 유적', '🌾 고대 유목 문명 전시'] },
    ],
  }

  const activeInterests = interests.length > 0 ? interests : ['int_nature']
  const poolIdx = {}
  activeInterests.forEach(k => { poolIdx[k] = 0 })

  const itinerary = []

  // Day 1: Arrival
  itinerary.push({
    day: 1,
    title: '도착 & 울란바토르',
    activities: ['✈️ 울란바토르 도착', hotel, '🌆 수흐바타르 광장 산책', dinner],
  })

  if (days === 1) return itinerary

  // Middle days: rotate through selected interest pools
  const middleCount = Math.max(0, days - 2)
  for (let i = 0; i < middleCount; i++) {
    const key = activeInterests[i % activeInterests.length]
    const pool = pools[key]
    const plan = pool[poolIdx[key] % pool.length]
    poolIdx[key]++
    itinerary.push({ day: i + 2, ...plan })
  }

  // Last day: Departure
  const shopping = tier === 'luxury' ? '🛍️ 면세점 & 기념품 쇼핑' : '🛍️ 기념품 쇼핑'
  itinerary.push({ day: days, title: '귀국', activities: ['🧳 체크아웃', shopping, '✈️ 귀국 항공편'] })

  return itinerary
}

export default function AIPlanner() {
  const { tr, lang } = useLang()
  const [days, setDays] = useState(5)
  const [budget, setBudget] = useState(150)
  const [interests, setInterests] = useState(['int_nature', 'int_culture'])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleInterest = key => setInterests(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  )

  const generate = async () => {
    setLoading(true); setResult(null)
    await new Promise(r => setTimeout(r, 1800))
    setResult(generateItinerary(days, budget, interests))
    setLoading(false)
  }

  const budgetUnit = lang === 'kr' ? '만원' : lang === 'en' ? 'USD' : '₮'

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden px-4 pt-5 pb-8"
          style={{ background: 'linear-gradient(135deg, #0A0E2A 0%, #1e3a8a 50%, #3B6FF0 100%)' }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles size={15} className="text-yellow-300" />
            </div>
            <span className="text-white font-black text-base">{tr('planner_title')}</span>
          </div>
          <p className="text-white/60 text-xs relative">{tr('planner_sub')}</p>
        </div>

        <div className="px-4 -mt-4">
          <div className="bg-white rounded-3xl shadow-sm p-5 space-y-5">
            {/* Days */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" />{tr('planner_days')}
                </label>
                <span className="text-primary font-black text-sm bg-primary/8 px-3 py-0.5 rounded-full">
                  {days} {tr('planner_days_unit')}
                </span>
              </div>
              <input type="range" min={1} max={14} value={days} onChange={e => setDays(Number(e.target.value))}
                className="w-full accent-primary h-1.5" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1</span><span>7</span><span>14</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-primary" />{tr('planner_budget')}
                </label>
                <span className="text-primary font-black text-sm bg-primary/8 px-3 py-0.5 rounded-full">
                  {budget}{budgetUnit}
                </span>
              </div>
              <input type="range" min={30} max={500} step={10} value={budget} onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-primary h-1.5" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>30</span><span>200</span><span>500</span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mb-3">
                <Heart size={14} className="text-primary" />{tr('planner_interests')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {interestKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => toggleInterest(key)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${
                      interests.includes(key)
                        ? 'bg-primary/8 border-primary text-primary'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <span className="text-xl">{interestEmojis[key]}</span>
                    {tr(key)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading || interests.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/25 active:scale-95 disabled:opacity-60 transition-all text-sm"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{tr('planner_generating')}</>
              ) : (
                <><Sparkles size={15} />{tr('planner_generate')}</>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="px-4 mt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-gray-900">
                🗓️ {days}{tr('planner_days_unit')} {lang === 'kr' ? '맞춤 일정' : lang === 'en' ? 'Custom Itinerary' : 'Хувийн хуваарь'}
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {budget < 100 ? '🎒 배낭여행' : budget <= 250 ? '✈️ 일반여행' : '💎 럭셔리'}
              </span>
            </div>
            <div className="space-y-2.5">
              {result.map(day => (
                <div key={day.day} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      {day.day}
                    </div>
                    <span className="text-sm font-black text-gray-900">{day.title}</span>
                  </div>
                  <div className="space-y-1.5 pl-10">
                    {day.activities.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <ChevronRight size={10} className="text-gray-300 flex-shrink-0" />
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Budget breakdown */}
            <div className="mt-3 bg-primary/5 rounded-2xl p-4 border border-primary/15">
              <p className="text-xs font-black text-primary mb-3">💰 {lang === 'kr' ? '예산 분석' : lang === 'en' ? 'Budget Analysis' : 'Төсвийн шинжилгээ'}</p>
              {[
                [lang === 'kr' ? '항공권' : 'Flights', 0.35],
                [lang === 'kr' ? '숙박' : 'Hotels', 0.25],
                [lang === 'kr' ? '식비' : 'Food', 0.20],
                [lang === 'kr' ? '액티비티' : 'Activities', 0.15],
                [lang === 'kr' ? '기타' : 'Other', 0.05],
              ].map(([label, pct]) => (
                <div key={label} className="flex justify-between text-xs text-gray-600 mb-1.5">
                  <span>{label}</span>
                  <span className="font-bold text-gray-800">{Math.round(budget * pct)}{budgetUnit}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-black text-primary pt-2 border-t border-primary/20 mt-1">
                <span>{lang === 'kr' ? '총 예산' : lang === 'en' ? 'Total' : 'Нийт'}</span>
                <span>{budget}{budgetUnit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
