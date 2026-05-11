import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { provinceLocations } from '../../data/provinceLocations'
import { Star, Clock, CalendarDays, MapPin, Search, X, ChevronRight, Sparkles, Layers, CheckCircle2 } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const categoryColors = { nature: '#22c55e', culture: '#3b82f6', activity: '#f97316' }
const categoryEmoji = { nature: '🏔️', culture: '🏛️', activity: '🐎' }

function createCustomIcon(category, isSelected) {
  const color = categoryColors[category] || '#3B6FF0'
  const size = isSelected ? 44 : 36
  const inner = isSelected ? 10 : 7
  const border = isSelected ? `<circle cx="18" cy="18" r="14" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>` : ''
  const shadow = isSelected ? `drop-shadow(0 4px 12px ${color}80)` : ''
  const svg = `<svg width="${size}" height="${Math.round(size*1.25)}" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:${shadow}">
    <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
    <circle cx="18" cy="18" r="11" fill="white"/>
    <circle cx="18" cy="18" r="${inner}" fill="${color}"/>
    ${border}
  </svg>`
  return L.divIcon({ html: svg, iconSize: [size, Math.round(size*1.25)], iconAnchor: [size/2, Math.round(size*1.25)], popupAnchor: [0, -Math.round(size*1.25)], className: '' })
}

function createProvinceIcon(isSelected) {
  const color = isSelected ? '#7c3aed' : '#8b5cf6'
  const size = isSelected ? 30 : 22
  const ring = isSelected ? `<circle cx="11" cy="11" r="9" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.35"/>` : ''
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="11" cy="11" r="4" fill="white"/>
    ${ring}
  </svg>`
  return L.divIcon({ html: svg, iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -(size/2+4)], className: '' })
}

function FlyToLocation({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location) map.flyTo([location.lat, location.lng], 9, { duration: 1.2 })
  }, [location, map])
  return null
}

const CATEGORIES = [
  { key: 'all',      label: { kr: '전체',    en: 'All',      mn: 'Бүгд' } },
  { key: 'nature',   label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль' } },
  { key: 'culture',  label: { kr: '문화',    en: 'Culture',  mn: 'Соёл' } },
  { key: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл ажиллагаа' } },
]

export default function DesktopMap() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showProvince, setShowProvince] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])  // unified multi-select list
  const [lastFly, setLastFly] = useState(null)

  const filtered = locations.filter(loc => {
    const matchCat = filter === 'all' || loc.category === filter
    const matchSearch = !search || loc.name[lang].toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const isSelected = (id) => selectedItems.some(i => i.id === id)

  const toggleItem = (item) => {
    setLastFly({ lat: item.lat, lng: item.lng })
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    )
  }

  const removeItem = (id) => setSelectedItems(prev => prev.filter(i => i.id !== id))

  const goToPlanner = () => {
    const names = selectedItems.map(i => i.name).join(',')
    navigate(`/planner?locations=${encodeURIComponent(names)}`)
  }

  const L_HINT = {
    kr: '마커를 클릭해 여러 장소를 선택하세요',
    en: 'Click markers to select multiple locations',
    mn: 'Маркер дарж олон газар сонгоно уу',
  }

  return (
    <div className="flex h-screen pt-16 overflow-hidden bg-white">
      {/* ── Left panel ── */}
      <aside className="w-96 flex-shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-black text-gray-900 mb-3">{tr('map_title')}</h1>

          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 mb-3">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tr('map_search')}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {search && <button onClick={() => setSearch('')}><X size={14} className="text-gray-400 hover:text-gray-600" /></button>}
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setFilter(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === cat.key ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat.label[lang]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowProvince(p => !p)}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              showProvince ? 'bg-violet-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers size={13} />
            {showProvince
              ? (lang === 'kr' ? '🗺️ 아이막 명소 숨기기' : lang === 'mn' ? 'Аймгийн газрууд нуух' : 'Hide Province Sites')
              : (lang === 'kr' ? '🗺️ 아이막 명소 보기'   : lang === 'mn' ? 'Аймгийн газрууд харах' : 'Show Province Sites')}
          </button>
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10 px-5">
              <p className="text-gray-400 text-sm">검색 결과가 없습니다</p>
            </div>
          ) : filtered.map(loc => {
            const sel = isSelected(loc.id)
            return (
              <div
                key={loc.id}
                onClick={() => toggleItem({ id: loc.id, name: loc.name[lang], lat: loc.lat, lng: loc.lng, province: null })}
                className={`group flex gap-3 p-4 cursor-pointer border-b border-gray-50 transition-all ${
                  sel ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={loc.image} alt={loc.name[lang]} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs"
                    style={{ backgroundColor: categoryColors[loc.category] || '#3B6FF0' }}>
                    {sel
                      ? <CheckCircle2 size={12} className="text-white" />
                      : <span>{categoryEmoji[loc.category] || '📍'}</span>}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <h3 className={`text-sm font-bold leading-tight line-clamp-1 transition-colors ${sel ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                      {loc.name[lang]}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">{loc.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-1.5">{loc.description[lang]}</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="flex items-center gap-0.5"><Clock size={10} /><span className="text-[10px]">{loc.duration[lang]}</span></div>
                    <span className="text-gray-200">·</span>
                    <div className="flex items-center gap-0.5"><CalendarDays size={10} /><span className="text-[10px]">{loc.season[lang]}</span></div>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/explore/${loc.id}`) }}
                  className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            )
          })}
        </div>

        {/* ── Selected items panel ── */}
        {selectedItems.length > 0 && (
          <div className="flex-shrink-0 border-t-2 border-primary/20 bg-white">
            {/* Header row */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="text-xs font-black text-gray-900">
                📍 {lang === 'kr' ? '선택한 장소' : lang === 'mn' ? 'Сонгосон газрууд' : 'Selected'}{' '}
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white rounded-full text-[10px]">{selectedItems.length}</span>
              </span>
              <button onClick={() => setSelectedItems([])} className="text-[10px] text-gray-400 hover:text-red-400 transition-colors">
                {lang === 'kr' ? '전체 해제' : lang === 'mn' ? 'Бүгдийг цуцлах' : 'Clear all'}
              </button>
            </div>

            {/* Chips */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedItems.map(item => (
                <span key={item.id} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                  <span className="truncate max-w-[120px]">{item.name}</span>
                  <button onClick={() => removeItem(item.id)} className="flex-shrink-0 hover:text-red-500 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>

            {/* Generate button */}
            <div className="px-4 pb-4">
              <button
                onClick={goToPlanner}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Sparkles size={15} />
                {lang === 'kr'
                  ? `${selectedItems.length}곳 AI 일정 만들기`
                  : lang === 'mn'
                  ? `${selectedItems.length} газрын AI төлөвлөгөө`
                  : `Plan ${selectedItems.length} locations with AI`}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── Map ── */}
      <div className="flex-1 relative">
        <MapContainer center={[47.5, 103.5]} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {lastFly && <FlyToLocation location={lastFly} />}

          {/* Province markers */}
          {showProvince && provinceLocations.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createProvinceIcon(isSelected(loc.id))}
              eventHandlers={{ click: () => toggleItem({ id: loc.id, name: loc.name, lat: loc.lat, lng: loc.lng, province: loc.province }) }}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0" />
                    <span className="text-[10px] text-violet-600 font-semibold">{loc.province} аймаг</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{loc.name}</h3>
                  <p className="text-[10px] text-gray-400">
                    {isSelected(loc.id)
                      ? (lang === 'kr' ? '✓ 선택됨' : '✓ Сонгогдсон')
                      : (lang === 'kr' ? '클릭하여 선택' : 'Дарж сонгох')}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Main location markers */}
          {filtered.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createCustomIcon(loc.category, isSelected(loc.id))}
              eventHandlers={{ click: () => toggleItem({ id: loc.id, name: loc.name[lang], lat: loc.lat, lng: loc.lng, province: null }) }}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <img src={loc.image} alt={loc.name[lang]} className="w-full h-28 object-cover rounded-lg mb-2" />
                  <h3 className="font-bold text-gray-900 text-sm">{loc.name[lang]}</h3>
                  <div className="flex items-center gap-1 mt-0.5 mb-2">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold">{loc.rating}</span>
                    <span className="text-gray-300 mx-1">·</span>
                    <span className="text-xs text-gray-500">{loc.duration[lang]}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => navigate(`/explore/${loc.id}`)}
                      className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">
                      자세히
                    </button>
                    <button
                      onClick={() => toggleItem({ id: loc.id, name: loc.name[lang], lat: loc.lat, lng: loc.lng, province: null })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        isSelected(loc.id) ? 'bg-red-50 text-red-500' : 'bg-primary text-white'
                      }`}
                    >
                      {isSelected(loc.id) ? (lang === 'kr' ? '선택 해제' : 'Цуцлах') : (lang === 'kr' ? '+ 선택' : '+ Сонгох')}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-8 right-4 bg-white rounded-2xl shadow-lg p-4 z-[400]">
          <p className="text-xs font-bold text-gray-700 mb-2">범례</p>
          {[
            { cat: 'nature',   label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль' } },
            { cat: 'culture',  label: { kr: '문화',    en: 'Culture',  mn: 'Соёл' } },
            { cat: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл' } },
          ].map(({ cat, label }) => (
            <div key={cat} className="flex items-center gap-2 mt-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
              <span className="text-xs text-gray-600">{label[lang]}</span>
            </div>
          ))}
          {showProvince && (
            <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-gray-100">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-xs text-gray-600">{lang === 'kr' ? '아이막 명소' : lang === 'mn' ? 'Аймгийн газрууд' : 'Province Sites'}</span>
            </div>
          )}
        </div>

        {/* Hint */}
        {selectedItems.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm z-[400] pointer-events-none">
            <MapPin size={12} className="inline mr-1.5" />
            {L_HINT[lang] || L_HINT.en}
          </div>
        )}
      </div>
    </div>
  )
}
