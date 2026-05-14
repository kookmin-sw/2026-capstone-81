import { useState, useRef, useCallback } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'
import { Search, Star, MapPin, Clock, UtensilsCrossed } from 'lucide-react'
import { useLang } from '../../context/LangContext'
import { restaurants } from '../../data/restaurants'

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const FILTERS = [
  { key: 'all', kr: '전체', en: 'All', mn: 'Бүгд' },
  { key: '$', kr: '저렴', en: 'Budget', mn: 'Хямд' },
  { key: '$$', kr: '중간', en: 'Mid', mn: 'Дунд' },
  { key: '$$$', kr: '고급', en: 'Fine', mn: 'Тансаг' },
]

const priceColor = {
  '$': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '$$': 'text-blue-600 bg-blue-50 border-blue-200',
  '$$$': 'text-purple-600 bg-purple-50 border-purple-200',
}

const MAP_CENTER = { lat: 47.9077, lng: 106.9230 }

const MAP_OPTIONS = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ],
}

function makeMarkerIcon(active) {
  const color = active ? '#ea580c' : '#f97316'
  const size = active ? 42 : 32
  const h = Math.round(size * 1.25)
  const svg = `<svg width="${size}" height="${h}" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
    <circle cx="18" cy="18" r="11" fill="white"/>
    <text x="18" y="23" font-size="12" text-anchor="middle" fill="${color}" font-family="sans-serif">🍽</text>
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

export default function DesktopRestaurants() {
  const { lang } = useLang()
  const mapRef = useRef(null)
  const cardRefs = useRef({})

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GMAPS_KEY })

  const filtered = restaurants.filter(r => {
    const matchQuery =
      r.name[lang].toLowerCase().includes(query.toLowerCase()) ||
      r.category[lang].toLowerCase().includes(query.toLowerCase())
    const matchPrice = filter === 'all' || r.price === filter
    return matchQuery && matchPrice
  })

  const handleCardClick = useCallback((r) => {
    setActiveId(r.id)
    if (mapRef.current) {
      mapRef.current.panTo({ lat: r.lat, lng: r.lng })
      mapRef.current.setZoom(15)
    }
  }, [])

  const handleMarkerClick = useCallback((r) => {
    setActiveId(r.id)
    const el = cardRefs.current[r.id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const activeRestaurant = restaurants.find(r => r.id === activeId)

  return (
    <div className="h-screen pt-16 flex flex-col bg-[#F8F9FB]">
      {/* Compact header */}
      <div className="relative h-36 flex-shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85"
          alt="Ulaanbaatar restaurants"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1 uppercase tracking-wider">
              <UtensilsCrossed size={12} />
              {lang === 'kr' ? '울란바토르' : lang === 'en' ? 'Ulaanbaatar' : 'Улаанбаатар'}
            </div>
            <h1 className="text-white font-black text-2xl">
              {lang === 'kr' ? '울란바토르 맛집 가이드' : lang === 'en' ? 'Restaurant Guide' : 'Рестораны'}
            </h1>
          </div>
          <p className="text-white/60 text-xs">
            {lang === 'kr' ? `${restaurants.length}개 맛집` : lang === 'en' ? `${restaurants.length} restaurants` : `${restaurants.length} ресторан`}
          </p>
        </div>
      </div>

      {/* Split body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: list */}
        <div className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden border-r border-gray-200 bg-[#F8F9FB]">
          {/* Search + filter */}
          <div className="px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0 space-y-2">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={lang === 'kr' ? '식당 이름 또는 카테고리...' : lang === 'en' ? 'Search restaurants...' : 'Хайх...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="flex gap-1.5">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === f.key
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.key === 'all' ? f[lang] : `${f.key} ${f[lang]}`}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <span className="text-4xl">🍽</span>
                <p className="text-gray-400 mt-3 text-sm">
                  {lang === 'kr' ? '검색 결과가 없습니다' : lang === 'en' ? 'No results found' : 'Үр дүн олдсонгүй'}
                </p>
              </div>
            )}
            {filtered.map(r => (
              <div
                key={r.id}
                ref={el => { cardRefs.current[r.id] = el }}
                onClick={() => handleCardClick(r)}
                onMouseEnter={() => setHoveredId(r.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group bg-white rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                  activeId === r.id
                    ? 'border-orange-400 shadow-lg shadow-orange-100 ring-1 ring-orange-300'
                    : 'border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200'
                }`}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.name[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className={`absolute bottom-1 right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full border ${priceColor[r.price]}`}>
                      {r.price}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="font-black text-gray-900 text-sm leading-tight">{r.name[lang]}</h3>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{r.rating}</span>
                      </div>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-1.5">
                      {r.category[lang]}
                    </span>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-2">{r.description[lang]}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-orange-400" />
                        {r.area[lang]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} className="text-orange-400" />
                        {r.open}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-500">
                    <span className="font-semibold text-orange-500">
                      🍽 {lang === 'kr' ? '추천' : lang === 'en' ? 'Must try' : 'Санал болгох'}:
                    </span>{' '}
                    {r.mustTry[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Google Map */}
        <div className="flex-1 relative bg-gray-100">
          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-3 border-orange-500 border-t-transparent animate-spin" />
                <p className="text-gray-500 text-sm">Loading map…</p>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={MAP_CENTER}
              zoom={13}
              options={MAP_OPTIONS}
              onLoad={map => { mapRef.current = map }}
            >
              {restaurants.map(r => (
                <Marker
                  key={r.id}
                  position={{ lat: r.lat, lng: r.lng }}
                  icon={makeMarkerIcon(activeId === r.id || hoveredId === r.id)}
                  onClick={() => handleMarkerClick(r)}
                  zIndex={activeId === r.id ? 10 : hoveredId === r.id ? 5 : 1}
                />
              ))}

              {activeId && activeRestaurant && (
                <InfoWindow
                  position={{ lat: activeRestaurant.lat, lng: activeRestaurant.lng }}
                  onCloseClick={() => setActiveId(null)}
                >
                  <div className="p-1 min-w-[180px]">
                    <img
                      src={activeRestaurant.image}
                      alt={activeRestaurant.name[lang]}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <p className="font-black text-gray-900 text-sm leading-tight mb-0.5">
                      {activeRestaurant.name[lang]}
                    </p>
                    <p className="text-orange-500 text-xs font-semibold mb-1">
                      {activeRestaurant.category[lang]}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        {activeRestaurant.rating}
                      </span>
                      <span className="font-bold text-gray-700">{activeRestaurant.price}</span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-1 flex items-center gap-1">
                      <MapPin size={9} />
                      {activeRestaurant.area[lang]}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}

          {/* Map legend */}
          {isLoaded && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
              <span className="text-base">🍽</span>
              {lang === 'kr' ? '식당 클릭 시 상세 정보' : lang === 'en' ? 'Click a pin to see details' : 'Дэлгэрэнгүй мэдэх тогших'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
