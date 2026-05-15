import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { museums } from '../../data/museums'
import { useWikiImage } from '../../hooks/useWikiImage'
import { Search, SlidersHorizontal, Star, MapPin, Heart, ChevronRight, Navigation } from 'lucide-react'
import MobileLayout from './MobileLayout'

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const CAT_COLORS = { nature: '#22c55e', culture: '#3b82f6', activity: '#f97316', history: '#a855f7' }

const MINI_MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  gestureHandling: 'none',
  clickableIcons: false,
  draggable: false,
  keyboardShortcuts: false,
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ],
}

function miniMarker(color) {
  const svg = `<svg width="22" height="28" viewBox="0 0 36 47" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.059 0 0 8.059 0 18C0 32 18 47 18 47C18 47 36 32 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
    <circle cx="18" cy="18" r="8" fill="white"/>
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

const CATS = [
  { key: 'all',      label: { kr: '전체',  en: 'All',      mn: 'Бүгд'    } },
  { key: 'nature',   label: { kr: '자연',  en: 'Nature',   mn: 'Байгаль' } },
  { key: 'festival', label: { kr: '축제',  en: 'Festival', mn: 'Наадам'  } }, // 기존 문화·액티비티 → 축제로 통합
  { key: 'history',  label: { kr: '역사',  en: 'History',  mn: 'Түүх'    } },
  { key: 'museum',   label: { kr: '박물관', en: 'Museum',   mn: 'Музей'  } },
]

const CAT_BADGE = {
  nature:   { label: { kr: '자연', en: 'Nature',   mn: 'Байгаль'    }, bg: 'bg-emerald-500' },
  festival: { label: { kr: '축제', en: 'Festival', mn: 'Наадам'     }, bg: 'bg-pink-500'    },
  culture:  { label: { kr: '축제', en: 'Festival', mn: 'Наадам'     }, bg: 'bg-pink-500'    },
  activity: { label: { kr: '축제', en: 'Festival', mn: 'Наадам'     }, bg: 'bg-pink-500'    },
  history:  { label: { kr: '역사', en: 'History',  mn: 'Түүх'       }, bg: 'bg-purple-500'  },
  museum:   { label: { kr: '박물관', en: 'Museum',  mn: 'Музей'     }, bg: 'bg-amber-500'   },
}

const REGION_LABEL = {
  mn: { khuvsgul: 'Хөвсгөл аймаг', gobi: 'Өмнөговь аймаг', terelj: 'Төв аймаг', ub: 'Улаанбаатар', kharkhorin: 'Өвөрхангай аймаг', orkhon: 'Орхон', bayan: 'Баян-Өлгий' },
  kr: { khuvsgul: '홉스골',        gobi: '남고비',           terelj: '투브 아이막', ub: '울란바토르',  kharkhorin: '오브르항가이',       orkhon: '오르홍', bayan: '바얀-울기'  },
  en: { khuvsgul: 'Khuvsgul aimag', gobi: 'Omnogovi aimag', terelj: 'Tuv aimag',  ub: 'Ulaanbaatar', kharkhorin: 'Uvurkhangai',       orkhon: 'Orkhon', bayan: 'Bayan-Ulgii' },
}

const MOCK_DIST    = { 1: 0,   2: 540, 3: 55, 4: 646, 5: 460, 6: 10, 7: 360, 8: 400 }
const MOCK_REVIEWS = { 1: 186, 2: 342, 3: 278, 4: 210, 5: 182, 6: 94, 7: 164, 8: 128 }

function ListingCard({ loc, lang, liked, province, dist, rev, onClick, onToggleLike }) {
  const badgeKey = loc.type === 'museum' ? 'museum' : loc.category
  const badge = CAT_BADGE[badgeKey] ?? CAT_BADGE.nature
  const img = useWikiImage(loc.wikiTitle, loc.image)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm flex cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <img src={img} alt={loc.name[lang]} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 px-3 py-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
              {loc.name[lang]}
            </h3>
            <button
              onClick={onToggleLike}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
            </button>
          </div>
          <span className={`inline-block ${badge.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1`}>
            {badge.label[lang]}
          </span>
        </div>
        <div>
          <p className="text-gray-400 text-xs flex items-center gap-0.5 mb-1">
            <MapPin size={9} className="text-primary flex-shrink-0" />
            <span className="truncate">{province}</span>
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
}

export default function MobileExplore() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [searchParams] = useSearchParams()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [liked, setLiked] = useState({})
  const miniMapRef = useRef(null)

  const { isLoaded: mapLoaded } = useJsApiLoader({ googleMapsApiKey: GMAPS_KEY })

  useEffect(() => {
    setQ(searchParams.get('q') || '')
  }, [searchParams])

  const province = loc => {
    if (loc.type === 'museum') return loc.province ?? ''
    return (REGION_LABEL[lang] ?? REGION_LABEL.en)[loc.region] ?? loc.region
  }

  // Combined list: main destinations + museums (treated as first-class entries)
  const combined = [...locations, ...museums]

  const filtered = combined.filter(loc => {
    const matchCat =
      cat === 'all' ||
      loc.category === cat ||
      (cat === 'museum' && loc.type === 'museum') ||
      (cat === 'festival' && (loc.category === 'culture' || loc.category === 'activity'))
    const matchQ =
      !q ||
      Object.values(loc.name).some(n => typeof n === 'string' && n.toLowerCase().includes(q.toLowerCase())) ||
      (loc.province && loc.province.toLowerCase().includes(q.toLowerCase()))
    return matchCat && matchQ
  })

  const fitToMarkers = useCallback((map) => {
    if (!map || filtered.length === 0) return
    if (filtered.length === 1) {
      map.setCenter({ lat: filtered[0].lat, lng: filtered[0].lng })
      map.setZoom(6)
      return
    }
    const bounds = new window.google.maps.LatLngBounds()
    filtered.forEach(l => bounds.extend({ lat: l.lat, lng: l.lng }))
    map.fitBounds(bounds, { top: 16, right: 16, bottom: 16, left: 16 })
  }, [filtered])

  useEffect(() => {
    if (mapLoaded && miniMapRef.current) fitToMarkers(miniMapRef.current)
  }, [mapLoaded, fitToMarkers])

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
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm relative" style={{ height: 200 }}>
          {!mapLoaded ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 46.8625, lng: 103.8467 }}
              zoom={5}
              options={MINI_MAP_OPTIONS}
              onLoad={(map) => { miniMapRef.current = map; fitToMarkers(map) }}
              onClick={() => navigate('/map')}
            >
              {filtered.map(loc => (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  icon={miniMarker(CAT_COLORS[loc.category] ?? '#2F855A')}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                />
              ))}
            </GoogleMap>
          )}

          {/* Tap-to-fullmap overlay (excludes marker clicks via pointer-events) */}
          <button
            onClick={() => navigate('/map')}
            className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-white/95 rounded-lg px-2.5 py-1 shadow-sm z-10 active:scale-95 transition-transform"
          >
            <MapPin size={11} className="text-primary" />
            <span className="text-xs font-bold text-gray-700">
              {lang === 'mn' ? 'Бүтэн зураг' : lang === 'kr' ? '지도 보기' : 'View Full Map'}
            </span>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="absolute top-2.5 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm z-10 active:scale-95 transition-transform"
          >
            <Navigation size={12} className="text-primary" />
          </button>
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
          ) : filtered.map(loc => (
            <ListingCard
              key={loc.id}
              loc={loc}
              lang={lang}
              liked={!!liked[loc.id]}
              province={province(loc)}
              dist={MOCK_DIST[loc.id]}
              rev={MOCK_REVIEWS[loc.id] ?? 0}
              onClick={() => navigate(`/explore/${loc.id}`)}
              onToggleLike={(e) => toggleLike(e, loc.id)}
            />
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}
