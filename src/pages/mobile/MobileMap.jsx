import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Star, MapPin, Clock, CalendarDays, ChevronRight, Search, Home, Compass, Sparkles, User, Map as MapIcon } from 'lucide-react'

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const CAT_COLORS = { nature: '#22c55e', culture: '#3b82f6', activity: '#f97316' }

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: false,
  gestureHandling: 'greedy',
  styles: [
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ],
}

const CATS = [
  { key: 'all',      label: { kr: '전체',    en: 'All',     mn: 'Бүгд'    } },
  { key: 'nature',   label: { kr: '자연',    en: 'Nature',  mn: 'Байгаль' } },
  { key: 'culture',  label: { kr: '문화',    en: 'Culture', mn: 'Соёл'    } },
  { key: 'activity', label: { kr: '액티비티', en: 'Activity',mn: 'Адал'   } },
]

function makeMarker(color, active) {
  const size = active ? 38 : 28
  const h = Math.round(size * 1.3)
  const svg = `<svg width="${size}" height="${h}" viewBox="0 0 36 47" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.059 0 0 8.059 0 18C0 32 18 47 18 47C18 47 36 32 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
    <circle cx="18" cy="18" r="10" fill="white"/>
    <circle cx="18" cy="18" r="6" fill="${color}"/>
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

const tabs = [
  { icon: Home,     path: '/home',    label: { kr: '홈', en: 'Home', mn: 'Нүүр' } },
  { icon: Compass,  path: '/explore', label: { kr: '탐색', en: 'Explore', mn: 'Хайлт' } },
  { icon: MapIcon,  path: '/map',     label: { kr: '지도', en: 'Map', mn: 'Зураг' }, active: true },
  { icon: Sparkles, path: '/planner', label: { kr: 'AI', en: 'AI', mn: 'AI' } },
  { icon: User,     path: '/profile', label: { kr: '프로필', en: 'Profile', mn: 'Профайл' } },
]

export default function MobileMap() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const mapRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GMAPS_KEY })

  const filtered = filter === 'all' ? locations : locations.filter(l => l.category === filter)

  const handleMarker = useCallback((loc) => {
    setSelected(loc)
    mapRef.current?.panTo({ lat: loc.lat, lng: loc.lng })
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FB]">

      {/* Top filter bar */}
      <div className="absolute top-0 inset-x-0 z-20 pt-12 px-4 pb-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5 mb-3">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-400">
            {lang === 'kr' ? '여행지 검색...' : lang === 'en' ? 'Search places...' : 'Газар хайх...'}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CATS.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === cat.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: 47.5, lng: 103.5 }}
            zoom={5}
            options={MAP_OPTIONS}
            onLoad={map => { mapRef.current = map }}
            onClick={() => setSelected(null)}
          >
            {filtered.map(loc => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                icon={makeMarker(CAT_COLORS[loc.category] || '#2F855A', selected?.id === loc.id)}
                onClick={() => handleMarker(loc)}
                zIndex={selected?.id === loc.id ? 10 : 1}
              />
            ))}
          </GoogleMap>
        )}

        {/* Selected card (bottom sheet) */}
        {selected && (
          <div
            className="absolute inset-x-0 bottom-20 mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{ boxShadow: '0 -2px 30px rgba(0,0,0,0.12)' }}
          >
            <div className="flex gap-3 p-3">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
                <img src={selected.image} alt={selected.name[lang]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 text-white`}
                  style={{ backgroundColor: CAT_COLORS[selected.category] || '#2F855A' }}>
                  {selected.category === 'nature' ? (lang === 'kr' ? '자연' : lang === 'mn' ? 'Байгаль' : 'Nature')
                    : selected.category === 'culture' ? (lang === 'kr' ? '문화' : lang === 'mn' ? 'Соёл' : 'Culture')
                    : (lang === 'kr' ? '액티비티' : lang === 'mn' ? 'Адал явдал' : 'Activity')}
                </span>
                <h3 className="font-black text-gray-900 text-sm leading-tight mb-1">{selected.name[lang]}</h3>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-700">{selected.rating}</span>
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={9} className="text-primary" />
                    {selected.duration[lang]}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-0.5">
                    <CalendarDays size={9} className="text-primary" />
                    {selected.season[lang]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/explore/${selected.id}`)}
                className="self-center w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <ChevronRight size={16} className="text-primary" />
              </button>
            </div>
          </div>
        )}

        {/* Hint */}
        {!selected && isLoaded && (
          <div className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none">
            <div className="bg-black/60 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-1.5">
              <MapPin size={11} />
              {lang === 'kr' ? '마커를 탭해 장소를 확인하세요' : lang === 'en' ? 'Tap a marker to see details' : 'Маркер дарж газрыг харна уу'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="bg-white/90 backdrop-blur-md border-t border-gray-100">
          <div className="flex items-center justify-around px-2 pb-safe pt-1 pb-3">
            {tabs.map(tab => {
              const Icon = tab.icon
              const active = tab.active
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center gap-0.5 flex-1 py-1"
                >
                  <Icon size={22} className={active ? 'text-primary' : 'text-gray-400'} strokeWidth={active ? 2.5 : 1.8} />
                  <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-gray-400'}`}>
                    {tab.label[lang]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
