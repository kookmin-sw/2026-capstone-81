import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Star, Clock, CalendarDays, MapPin, Search, X, ChevronRight, Sparkles } from 'lucide-react'

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const categoryColors = {
  nature: '#22c55e',
  culture: '#3b82f6',
  activity: '#f97316',
}

const categoryEmoji = {
  nature: '🏔️',
  culture: '🏛️',
  activity: '🐎',
}

function createCustomIcon(category, isSelected) {
  const color = categoryColors[category] || '#3B6FF0'
  const size = isSelected ? 44 : 36
  const inner = isSelected ? 10 : 7
  const shadow = isSelected ? `drop-shadow(0 4px 12px ${color}80)` : ''
  const svg = `
    <svg width="${size}" height="${Math.round(size * 1.25)}" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:${shadow}">
      <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
      <circle cx="18" cy="18" r="11" fill="white"/>
      <circle cx="18" cy="18" r="${inner}" fill="${color}"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    iconSize: [size, Math.round(size * 1.25)],
    iconAnchor: [size / 2, Math.round(size * 1.25)],
    popupAnchor: [0, -Math.round(size * 1.25)],
    className: '',
  })
}

function FlyToLocation({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 9, { duration: 1.5 })
    }
  }, [location, map])
  return null
}

const CATEGORIES = [
  { key: 'all', label: { kr: '전체', en: 'All', mn: 'Бүгд' } },
  { key: 'nature', label: { kr: '자연', en: 'Nature', mn: 'Байгаль' }, color: 'green' },
  { key: 'culture', label: { kr: '문화', en: 'Culture', mn: 'Соёл' }, color: 'blue' },
  { key: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл ажиллагаа' }, color: 'orange' },
]

export default function DesktopMap() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = locations.filter(loc => {
    const matchCat = filter === 'all' || loc.category === filter
    const matchSearch = !search || loc.name[lang].toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex h-screen pt-16 overflow-hidden bg-white">
      {/* Left panel */}
      <aside className="w-96 flex-shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-hidden">
        {/* Panel header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-black text-gray-900 mb-3">{tr('map_title')}</h1>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 mb-3">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tr('map_search')}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === cat.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10 px-5">
              <p className="text-gray-400 text-sm">검색 결과가 없습니다</p>
            </div>
          ) : (
            filtered.map(loc => (
              <div
                key={loc.id}
                onClick={() => setSelected(loc === selected ? null : loc)}
                className={`group flex gap-3 p-4 cursor-pointer border-b border-gray-50 transition-all ${
                  selected?.id === loc.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={loc.image}
                    alt={loc.name[lang]}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs"
                    style={{ backgroundColor: categoryColors[loc.category] || '#3B6FF0' }}
                  >
                    <span>{categoryEmoji[loc.category] || '📍'}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <h3 className={`text-sm font-bold leading-tight line-clamp-1 transition-colors ${selected?.id === loc.id ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                      {loc.name[lang]}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">{loc.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-1.5">{loc.description[lang]}</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="flex items-center gap-0.5">
                      <Clock size={10} />
                      <span className="text-[10px]">{loc.duration[lang]}</span>
                    </div>
                    <span className="text-gray-200">·</span>
                    <div className="flex items-center gap-0.5">
                      <CalendarDays size={10} />
                      <span className="text-[10px]">{loc.season[lang]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail panel when selected */}
        {selected && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4 shadow-lg">
            <div className="flex gap-3 mb-3">
              <img
                src={selected.image}
                alt={selected.name[lang]}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="font-black text-gray-900 text-sm leading-tight mb-1">{selected.name[lang]}</h2>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={i < Math.floor(selected.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                    />
                  ))}
                  <span className="text-xs font-semibold text-gray-700 ml-1">{selected.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.tags[lang].map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/explore/${selected.id}`)}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold"
              >
                {tr('map_detail_btn')} <ChevronRight size={13} />
              </button>
              <button
                onClick={() => navigate('/planner')}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold"
              >
                <Sparkles size={13} />
                {tr('map_plan_btn')}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[47.5, 103.5]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {selected && <FlyToLocation location={selected} />}
          {filtered.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createCustomIcon(loc.category, selected?.id === loc.id)}
              eventHandlers={{
                click: () => setSelected(loc === selected ? null : loc),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <img src={loc.image} alt={loc.name[lang]} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <h3 className="font-bold text-gray-900 text-sm">{loc.name[lang]}</h3>
                  <div className="flex items-center gap-1 mt-0.5 mb-2">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold">{loc.rating}</span>
                    <span className="text-gray-300 mx-1">·</span>
                    <span className="text-xs text-gray-500">{loc.duration[lang]}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/explore/${loc.id}`)}
                    className="w-full py-1.5 bg-primary text-white text-xs font-bold rounded-lg"
                  >
                    자세히 보기
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <div className="absolute bottom-8 right-4 bg-white rounded-2xl shadow-lg p-4 z-[400]">
          <p className="text-xs font-bold text-gray-700 mb-2">범례</p>
          {[
            { cat: 'nature', label: { kr: '자연', en: 'Nature', mn: 'Байгаль' } },
            { cat: 'culture', label: { kr: '문화', en: 'Culture', mn: 'Соёл' } },
            { cat: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл' } },
          ].map(({ cat, label }) => (
            <div key={cat} className="flex items-center gap-2 mt-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
              <span className="text-xs text-gray-600">{label[lang]}</span>
            </div>
          ))}
        </div>

        {/* Hint when nothing selected */}
        {!selected && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm z-[400] pointer-events-none">
            <MapPin size={12} className="inline mr-1.5" />
            {tr('map_tap_hint')}
          </div>
        )}
      </div>
    </div>
  )
}
