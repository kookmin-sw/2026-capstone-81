import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { Sparkles, ChevronRight, Clock, DollarSign, Heart } from 'lucide-react'

const interestKeys = ['int_nature', 'int_culture', 'int_food', 'int_adventure', 'int_photo', 'int_history']

const interestEmojis = {
  int_nature: '🏔️',
  int_culture: '🏛️',
  int_food: '🍖',
  int_adventure: '🐎',
  int_photo: '📸',
  int_history: '📜',
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

export default function DesktopPlanner() {
  const { tr } = useLang()
  const [days, setDays] = useState(5)
  const [budget, setBudget] = useState(150)
  const [interests, setInterests] = useState(['int_nature', 'int_culture'])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleInterest = (key) => {
    setInterests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const generate = async () => {
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 1800))
    setResult(generateItinerary(days, budget, interests))
    setLoading(false)
  }

  const budgetBreakdown = [
    { label: '항공권', key: 'budget_flight', pct: 0.35 },
    { label: '숙박', key: 'budget_hotel', pct: 0.25 },
    { label: '식비', key: 'budget_food', pct: 0.20 },
    { label: '액티비티', key: 'budget_activity', pct: 0.15 },
    { label: '교통·기타', key: 'budget_transport', pct: 0.05 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
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
          {/* Input panel */}
          <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
            <h2 className="text-lg font-black text-gray-900">여행 조건 설정</h2>

            {/* Days */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  {tr('planner_days')}
                </label>
                <span className="text-primary font-black text-lg">{days} {tr('planner_days_unit')}</span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full accent-primary h-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>1일</span>
                <span>7일</span>
                <span>14일</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign size={16} className="text-primary" />
                  {tr('planner_budget')}
                </label>
                <span className="text-primary font-black text-lg">{budget}만원</span>
              </div>
              <input
                type="range"
                min={30}
                max={500}
                step={10}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-primary h-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>30만원</span>
                <span>200만원</span>
                <span>500만원</span>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Heart size={16} className="text-primary" />
                {tr('planner_interests')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {interestKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => toggleInterest(key)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                      interests.includes(key)
                        ? 'bg-primary/5 border-primary text-primary'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{interestEmojis[key]}</span>
                    {tr(key)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate}
              disabled={loading || interests.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 text-base"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {tr('planner_generating')}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {tr('planner_generate')}
                </>
              )}
            </button>
          </div>

          {/* Result panel */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-500 text-base mb-2">여행 조건을 설정하고</p>
                <p className="text-gray-400 text-sm">AI가 최적의 일정을 만들어드립니다</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">{tr('planner_generating')}</p>
              </div>
            )}

            {result && (
              <>
                {/* Itinerary */}
                <div className="bg-white rounded-3xl shadow-sm p-6">
                  <h2 className="text-lg font-black text-gray-900 mb-4">
                    🗓️ {days}일 맞춤 여행 일정
                  </h2>
                  <div className="space-y-3">
                    {result.map(day => (
                      <div key={day.day} className="border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                            {day.day}
                          </span>
                          <span className="font-bold text-gray-800">{day.title}</span>
                        </div>
                        <div className="space-y-1 pl-11">
                          {day.activities.map((act, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                              {act}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget breakdown */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-6 border border-primary/20">
                  <h3 className="font-black text-gray-900 mb-4">💰 예산 분석 ({budget}만원)</h3>
                  <div className="space-y-3">
                    {budgetBreakdown.map(({ label, pct }) => {
                      const amount = Math.round(budget * pct)
                      const width = pct * 100
                      return (
                        <div key={label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">{label}</span>
                            <span className="font-bold text-gray-800">{amount}만원</span>
                          </div>
                          <div className="w-full bg-white rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary/20">
                    <span className="font-black text-gray-900">총 예산</span>
                    <span className="text-xl font-black text-primary">{budget}만원</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
