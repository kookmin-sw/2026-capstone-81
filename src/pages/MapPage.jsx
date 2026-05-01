import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { locations } from '../data/locations'
import BottomNav from '../components/BottomNav'
import { Star, Clock, CalendarDays, X, ChevronRight } from 'lucide-react'

// Fix Leaflet marker icons for Vite
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

function createCustomIcon(category) {
  const color = categoryColors[category] || '#3B6FF0'
  const svg = `
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <circle cx="16" cy="16" r="5" fill="${color}"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
    className: '',
  })
}

function FlyToLocation({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 8, { duration: 1.2 })
    }
  }, [location, map])
  return null
}

const CATEGORIES = ['all', 'nature', 'culture', 'activity']

export default function MapPage() {
  const navigate = useNavigate()
  const routerLocation = useLocation()
  const { lang, tr } = useLang()
  const [selected, setSelected] = useState(() => {
    const id = routerLocation.state?.locationId
    return id ? locations.find(l => l.id === id) ?? null : null
  })
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? locations : locations.filter(l => l.category === filter)

  const filterLabels = {
    all: tr('map_all'),
    nature: tr('map_nature'),
    culture: tr('map_culture'),
    activity: tr('map_activity'),
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-1 pb-2 bg-white flex-shrink-0 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900">{tr('map_title')}</h1>
        {/* Category filter chips */}
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {filterLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={[47.5, 103.5]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
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
              icon={createCustomIcon(loc.category)}
              eventHandlers={{
                click: () => setSelected(loc),
              }}
            />
          ))}
        </MapContainer>

        {/* Hint text when nothing selected */}
        {!selected && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-[400] whitespace-nowrap pointer-events-none">
            {tr('map_tap_hint')}
          </div>
        )}
      </div>

      {/* Selected location card */}
      {selected && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 shadow-lg z-[500]">
          <div className="p-3">
            <div className="flex gap-3 items-start">
              <img
                src={selected.image}
                alt={selected.name[lang]}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                    {selected.name[lang]}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-shrink-0 p-1 rounded-full bg-gray-100 text-gray-500"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-700">{selected.rating}</span>
                  <span className="text-gray-300 text-xs">·</span>
                  <Clock size={11} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{selected.duration[lang]}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarDays size={11} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{selected.season[lang]}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/explore/${selected.id}`)}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary text-white rounded-xl text-xs font-semibold"
              >
                {tr('map_detail_btn')} <ChevronRight size={13} />
              </button>
              <button
                onClick={() => navigate('/planner')}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary/10 text-primary rounded-xl text-xs font-semibold"
              >
                {tr('map_plan_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
