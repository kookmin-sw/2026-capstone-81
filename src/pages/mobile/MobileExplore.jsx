import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Search, SlidersHorizontal, Star, MapPin, Heart, ChevronRight, Navigation } from 'lucide-react'
import MobileLayout from './MobileLayout'

const CATS = [
  { key: 'all',      label: { kr: '전체',    en: 'All',      mn: 'Бүгд'      } },
  { key: 'nature',   label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль'   } },
  { key: 'culture',  label: { kr: '문화',    en: 'Culture',  mn: 'Соёл'      } },
  { key: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Адал явдал'} },
  { key: 'history',  label: { kr: '역사',    en: 'History',  mn: 'Түүх'      } },
]

const CAT_BADGE = {
  nature:   { label: { kr: '자연', en: 'Nature', mn: 'Байгаль'    }, bg: 'bg-emerald-500' },
  culture:  { label: { kr: '문화', en: 'Culture', mn: 'Соёл'      }, bg: 'bg-blue-500'    },
  activity: { label: { kr: '액티비티', en: 'Activity', mn: 'Адал явдал' }, bg: 'bg-orange-500' },
  history:  { label: { kr: '역사', en: 'History', mn: 'Түүх'      }, bg: 'bg-purple-500'  },
}

const REGION_LABEL = {
  mn: { khuvsgul: 'Хөвсгөл аймаг', gobi: 'Өмнөговь аймаг', terelj: 'Төв аймаг', ub: 'Улаанбаатар', kharkhorin: 'Өвөрхангай аймаг', orkhon: 'Орхон', bayan: 'Баян-Өлгий' },
  kr: { khuvsgul: '홉스골',        gobi: '남고비',           terelj: '투브 아이막', ub: '울란바토르',  kharkhorin: '오브르항가이',       orkhon: '오르홍', bayan: '바얀-울기'  },
  en: { khuvsgul: 'Khuvsgul aimag', gobi: 'Omnogovi aimag', terelj: 'Tuv aimag',  ub: 'Ulaanbaatar', kharkhorin: 'Uvurkhangai',       orkhon: 'Orkhon', bayan: 'Bayan-Ulgii' },
}

const MOCK_DIST    = { 1: 0,   2: 540, 3: 55, 4: 646, 5: 460, 6: 10, 7: 360, 8: 400 }
const MOCK_REVIEWS = { 1: 186, 2: 342, 3: 278, 4: 210, 5: 182, 6: 94, 7: 164, 8: 128 }

const MAP_PINS = [
  { x: '20%', y: '30%', n: 12, c: 'bg-primary'    },
  { x: '55%', y: '42%', n: 8,  c: 'bg-primary'    },
  { x: '38%', y: '65%', n: 3,  c: 'bg-orange-400' },
  { x: '72%', y: '22%', n: 5,  c: 'bg-blue-500'   },
  { x: '48%', y: '78%', n: 2,  c: 'bg-primary'    },
  { x: '82%', y: '60%', n: 4,  c: 'bg-purple-500' },
]

export default function MobileExplore() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [searchParams] = useSearchParams()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [liked, setLiked] = useState({})

  useEffect(() => {
    setQ(searchParams.get('q') || '')
  }, [searchParams])

  const province = loc => (REGION_LABEL[lang] ?? REGION_LABEL.en)[loc.region] ?? loc.region

  const filtered = locations.filter(loc => {
    const matchCat = cat === 'all' || loc.category === cat
    const matchQ = !q || Object.values(loc.name).some(n => n.toLowerCase().includes(q.toLowerCase()))
    return matchCat && matchQ
  })

  const toggleLike = (e, id) => {
    e.stopPropagation()
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <MobileLayout>
      <div className="bg-[#F8F9FB] min-h-screen">

        {/* ── 헤더 + 검색 ── */}
        <div className="bg-white px-4 pt-12 pb-3 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={lang === 'mn' ? 'Хаана аялахыг хүсэж байна вэ?' : lang === 'kr' ? '어디로 가고 싶으세요?' : 'Where to go?'}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              {q ? (
                <button onClick={() => setQ('')} className="text-gray-400 text-xs">✕</button>
              ) : null}
            </div>
            <button
              onClick={() => {}}
              className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/30"
            >
              <SlidersHorizontal size={17} className="text-white" />
            </button>
          </div>

          {/* 카테고리 칩 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATS.map(c => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  cat === c.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* ── 미니 맵 ── */}
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm">
          <div
            className="relative cursor-pointer"
            style={{ height: 130 }}
            onClick={() => navigate('/map')}
          >
            <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 relative">
              {MAP_PINS.map((p, i) => (
                <div key={i} style={{ left: p.x, top: p.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                  <div className={`${p.n >= 8 ? 'w-7 h-7 text-[10px]' : 'w-5 h-5 text-[9px]'} ${p.c} rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white`}>
                    {p.n}
                  </div>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400/40 font-semibold text-xs">Монгол</div>
              <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-white/90 rounded-lg px-2.5 py-1">
                <MapPin size={11} className="text-primary" />
                <span className="text-xs font-bold text-gray-600">
                  {lang === 'mn' ? 'Газрын зураг' : lang === 'kr' ? '지도 보기' : 'View Map'}
                </span>
              </div>
              <button className="absolute top-2.5 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Navigation size={12} className="text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 결과 카운트 ── */}
        <div className="flex items-center justify-between px-4 mt-4 mb-3">
          <p className="text-sm font-bold text-gray-800">
            {lang === 'mn' ? `Үр дүн (${filtered.length})` :
             lang === 'kr' ? `결과 ${filtered.length}개` :
             `${filtered.length} Results`}
          </p>
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm">
            <SlidersHorizontal size={12} />
            {lang === 'mn' ? 'Шүүлтүүр' : lang === 'kr' ? '필터' : 'Filter'}
          </button>
        </div>

        {/* ── 여행지 목록 (가로 카드) ── */}
        <div className="px-4 space-y-3 pb-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm font-semibold">
                {lang === 'mn' ? 'Үр дүн олдсонгүй' : lang === 'kr' ? '검색 결과가 없어요' : 'No results found'}
              </p>
            </div>
          ) : filtered.map(loc => {
            const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
            const dist  = MOCK_DIST[loc.id]
            const rev   = MOCK_REVIEWS[loc.id] ?? 0
            return (
              <div
                key={loc.id}
                onClick={() => navigate(`/explore/${loc.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm flex cursor-pointer active:scale-[0.99] transition-transform"
              >
                {/* 썸네일 */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                </div>

                {/* 정보 */}
                <div className="flex-1 px-3 py-3 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
                        {loc.name[lang]}
                      </h3>
                      <button
                        onClick={e => toggleLike(e, loc.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Heart size={16} className={liked[loc.id] ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
                      </button>
                    </div>
                    <span className={`inline-block ${badge.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1`}>
                      {badge.label[lang]}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs flex items-center gap-0.5 mb-1">
                      <MapPin size={9} className="text-primary flex-shrink-0" />
                      <span className="truncate">{province(loc)}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-700">{loc.rating}</span>
                      <span className="text-gray-400">({rev})</span>
                      {dist > 0 && <><span className="text-gray-200 mx-0.5">·</span><span className="text-gray-400">{dist} км</span></>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </MobileLayout>
  )
}
