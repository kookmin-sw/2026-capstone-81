import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { locations } from '../../data/locations'
import { Search, Bell, SlidersHorizontal, Star, MapPin, Navigation, ChevronRight } from 'lucide-react'
import { NomadLogoIcon, NomadLogoText } from '../../components/NomadLogo'
import MobileLayout from './MobileLayout'

const FILTER_CHIPS = [
  { key: 'all',      label: { kr: '전체',    en: 'All',      mn: 'Бүгд'      } },
  { key: 'nature',   label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль'   } },
  { key: 'culture',  label: { kr: '문화',    en: 'Culture',  mn: 'Соёл'      } },
  { key: 'history',  label: { kr: '역사',    en: 'History',  mn: 'Түүх'      } },
  { key: 'activity', label: { kr: '액티비티', en: 'Adventure', mn: 'Адал явдал'} },
]

const CAT_BADGE = {
  nature:   { label: { kr: '자연', en: 'Nature', mn: 'Байгаль'    }, bg: 'bg-emerald-500' },
  culture:  { label: { kr: '문화', en: 'Culture', mn: 'Соёл'      }, bg: 'bg-blue-500'    },
  activity: { label: { kr: '액티비티', en: 'Activity', mn: 'Адал явдал' }, bg: 'bg-orange-500' },
}

const REGION_LABEL = {
  mn: { khuvsgul: 'Хөвсгөл аймаг', gobi: 'Өмнөговь аймаг', terelj: 'Төв аймаг', ub: 'Улаанбаатар', kharkhorin: 'Өвөрхангай аймаг', orkhon: 'Орхон', bayan: 'Баян-Өлгий' },
  kr: { khuvsgul: '홉스골',        gobi: '남고비',           terelj: '투브 아이막', ub: '울란바토르',  kharkhorin: '오브르항가이',       orkhon: '오르홍', bayan: '바얀-울기'  },
  en: { khuvsgul: 'Khuvsgul aimag', gobi: 'Omnogovi aimag', terelj: 'Tuv aimag',  ub: 'Ulaanbaatar', kharkhorin: 'Uvurkhangai',       orkhon: 'Orkhon', bayan: 'Bayan-Ulgii' },
}

const MOCK_DIST    = { 1: 0,   2: 540, 3: 55, 4: 646, 5: 460, 6: 10, 7: 360, 8: 400 }
const MOCK_REVIEWS = { 1: 186, 2: 342, 3: 278, 4: 210, 5: 182, 6: 94, 7: 164, 8: 128 }

const MAP_PINS = [
  { x: '18%', y: '25%', n: 12, c: 'bg-primary'      },
  { x: '52%', y: '40%', n: 8,  c: 'bg-primary'      },
  { x: '35%', y: '62%', n: 3,  c: 'bg-orange-400'   },
  { x: '70%', y: '20%', n: 5,  c: 'bg-blue-500'     },
  { x: '45%', y: '78%', n: 2,  c: 'bg-primary'      },
  { x: '80%', y: '58%', n: 4,  c: 'bg-purple-500'   },
  { x: '60%', y: '55%', n: 6,  c: 'bg-primary'      },
  { x: '25%', y: '48%', n: 1,  c: 'bg-orange-400'   },
]

export default function MobileHome() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  const province = loc => (REGION_LABEL[lang] ?? REGION_LABEL.en)[loc.region] ?? loc.region

  const cards = locations
    .filter(loc => filter === 'all' || loc.category === filter)
    .slice(0, 6)

  const firstName = user?.displayName?.split(' ')[0]

  return (
    <MobileLayout>
      <div className="bg-[#F8F9FB] pb-4">

        {/* ── 헤더 ── */}
        <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            {/* 왼쪽: 햄버거 + 로고 */}
            <div className="flex items-center gap-2.5">
              <button className="flex flex-col gap-1.5 p-1">
                <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
                <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
                <span className="block w-3.5 h-0.5 bg-gray-700 rounded-full" />
              </button>
              <NomadLogoIcon size={26} />
              <NomadLogoText className="text-base" />
            </div>
            {/* 오른쪽: 벨 + 아바타 */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center">
                <Bell size={19} className="text-gray-600" />
              </button>
              <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                {user?.photoURL
                  ? <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                  : <span className="text-primary text-sm font-bold">{user?.displayName?.[0] ?? '?'}</span>
                }
              </button>
            </div>
          </div>

          {/* 인사 */}
          <div className="mb-3">
            <h2 className="text-[17px] font-black text-gray-900">
              {lang === 'mn'
                ? `Сайн уу, ${firstName ?? 'та'}! 👋`
                : lang === 'kr'
                ? `안녕하세요, ${firstName ?? '여행자'}! 👋`
                : `Hello, ${firstName ?? 'Traveler'}! 👋`}
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {lang === 'mn' ? 'Өнөөдөр хаашаа аялах төлөвтэй байна вэ?' :
               lang === 'kr' ? '오늘 어디로 떠나볼까요?' :
               'Where are you planning to go today?'}
            </p>
          </div>

          {/* 검색 + 필터 버튼 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(q.trim() ? `/explore?q=${encodeURIComponent(q)}` : '/explore')}
                placeholder={lang === 'mn' ? 'Хаана аялахыг хүсэж байна вэ?' : lang === 'kr' ? '어디로 가고 싶으세요?' : 'Where to go?'}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/30"
            >
              <SlidersHorizontal size={18} className="text-white" />
            </button>
          </div>

          {/* 카테고리 칩 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_CHIPS.map(chip => (
              <button
                key={chip.key}
                onClick={() => setFilter(chip.key)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  filter === chip.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {chip.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* ── 미니 맵 ── */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div
            className="relative cursor-pointer"
            style={{ height: 185 }}
            onClick={() => navigate('/map')}
          >
            <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 relative">
              {MAP_PINS.map((p, i) => (
                <div key={i} style={{ left: p.x, top: p.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                  <div className={`${p.n >= 8 ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[9px]'} ${p.c} rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white`}>
                    {p.n}
                  </div>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400/40 font-semibold text-xs pointer-events-none">
                Монгол
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Navigation size={14} className="text-primary" />
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-gray-100 py-2.5 px-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <MapPin size={11} className="text-primary" />
                {lang === 'mn' ? 'Ойролцоох газрууд' : lang === 'kr' ? '주변 여행지' : 'Nearby places'}
              </span>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* ── 날씨 위젯 ── */}
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-r from-sky-500 to-blue-400 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white/70">
                  {lang === 'mn' ? 'Улаанбаатар' : lang === 'kr' ? '울란바토르' : 'Ulaanbaatar'}
                </p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-4xl font-black">18°</span>
                  <span className="text-sm text-white/80 mb-1.5">
                    {lang === 'mn' ? 'Цэлмэг' : lang === 'kr' ? '맑음' : 'Sunny'}
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  {lang === 'mn' ? 'Аялахад тохиромжтой цаг' : lang === 'kr' ? '여행하기 좋은 날씨' : 'Great weather for travel'}
                </p>
              </div>
              <div className="text-5xl">☀️</div>
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t border-white/20">
              {[
                { day: lang === 'mn' ? 'Мар' : lang === 'kr' ? '화' : 'Tue', temp: '16°', icon: '⛅' },
                { day: lang === 'mn' ? 'Лха' : lang === 'kr' ? '수' : 'Wed', temp: '13°', icon: '🌧️' },
                { day: lang === 'mn' ? 'Пүр' : lang === 'kr' ? '목' : 'Thu', temp: '20°', icon: '☀️' },
                { day: lang === 'mn' ? 'Баа' : lang === 'kr' ? '금' : 'Fri', temp: '19°', icon: '⛅' },
              ].map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <p className="text-[10px] text-white/60">{d.day}</p>
                  <p className="text-sm">{d.icon}</p>
                  <p className="text-xs font-bold">{d.temp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 추천 여행지 ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'mn' ? 'Танд санал болгох газрууд' : lang === 'kr' ? '추천 여행지' : 'Recommended Places'}
            </h2>
            <button onClick={() => navigate('/explore')} className="text-primary text-xs font-semibold flex items-center gap-0.5">
              {lang === 'mn' ? 'Бүгдийг харах' : lang === 'kr' ? '전체보기' : 'See all'}
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {cards.map(loc => {
              const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
              const dist  = MOCK_DIST[loc.id]
              const rev   = MOCK_REVIEWS[loc.id] ?? 0
              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="relative h-36">
                    <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className={`absolute top-2.5 left-2.5 ${badge.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {badge.label[lang]}
                    </span>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-white font-black text-sm leading-tight">{loc.name[lang]}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-gray-400 text-[11px] flex items-center gap-0.5 mb-1.5">
                      <MapPin size={9} className="text-primary flex-shrink-0" />
                      <span className="truncate">{province(loc)}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Star size={10} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <span className="font-bold text-gray-700">{loc.rating}</span>
                      <span className="text-gray-400">({rev})</span>
                      {dist > 0 && <><span className="text-gray-300 mx-0.5">·</span><span className="text-gray-400">{dist} км</span></>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── AI 플래너 CTA ── */}
        <div
          onClick={() => navigate('/planner')}
          className="mx-4 mt-5 bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-gray-900 text-sm">AI Travel Planner</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">BETA</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {lang === 'mn' ? 'Таны сонирхол, хугацаа, төсөвт тохирсон аяллын төлөвлөгөөг AI гаргана.' :
                 lang === 'kr' ? '관심사, 기간, 예산에 맞춘 AI 여행 일정을 만들어드려요.' :
                 'AI crafts personalized itineraries based on your interests and budget.'}
              </p>
              <button className="mt-3 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-primary/25">
                {lang === 'mn' ? 'Төлөвлөгөө үүсгэх' : lang === 'kr' ? '일정 만들기' : 'Create Itinerary'}
              </button>
            </div>
            <div className="text-4xl flex-shrink-0">🤖</div>
          </div>
        </div>

        {/* ── 지금 인기있는 ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'mn' ? 'Одоо их алдартай' : lang === 'kr' ? '지금 인기있는' : 'Trending Now'}
            </h2>
            <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full">🔥 HOT</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {locations.filter(l => [2, 4, 5].includes(l.id)).map((loc, idx) => {
              const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="flex-shrink-0 w-36 cursor-pointer active:scale-[0.97] transition-transform"
                >
                  <div className="relative h-28 rounded-xl overflow-hidden">
                    <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      🔥 #{idx + 1}
                    </span>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-black text-xs leading-tight truncate">{loc.name[lang]}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star size={9} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[11px] font-bold text-gray-700">{loc.rating}</span>
                    </div>
                    <span className={`${badge.bg} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>
                      {badge.label[lang]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 최근 본 여행지 ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'mn' ? 'Сүүлийн үзсэн газрууд' : lang === 'kr' ? '최근 본 여행지' : 'Recently Viewed'}
            </h2>
            <button onClick={() => navigate('/explore')} className="text-primary text-xs font-semibold">
              {lang === 'mn' ? 'Бүгдийг харах' : lang === 'kr' ? '전체보기' : 'See all'}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {locations.slice(0, 3).map(loc => (
              <div
                key={loc.id}
                onClick={() => navigate(`/explore/${loc.id}`)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                  <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <p className="text-xs font-bold text-gray-800 mt-1.5 w-24 truncate">{loc.name[lang]}</p>
                <p className="text-[10px] text-gray-400 truncate w-24">{province(loc)}</p>
              </div>
            ))}
            <div
              onClick={() => navigate('/explore')}
              className="flex-shrink-0 cursor-pointer"
            >
              <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-black text-gray-400">+8</span>
              </div>
              <p className="text-xs font-bold text-gray-400 mt-1.5">
                {lang === 'mn' ? 'Бүгд' : lang === 'kr' ? '더보기' : 'More'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
