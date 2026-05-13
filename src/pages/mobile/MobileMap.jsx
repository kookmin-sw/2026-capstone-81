import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Star, MapPin, Clock } from 'lucide-react'
import MobileLayout from './MobileLayout'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const BG = '#0A3320'
const CARD = '#123D27'

const CATS = [
  { key: 'all', label: { kr: '전체', en: 'All', mn: 'Бүгд' } },
  { key: 'nature', label: { kr: '자연', en: 'Nature', mn: 'Байгаль' } },
  { key: 'culture', label: { kr: '문화', en: 'Culture', mn: 'Соёл' } },
  { key: 'activity', label: { kr: '음식', en: 'Food', mn: 'Хоол' } },
]

function makeIcon(isSelected) {
  const color = isSelected ? '#22C55E' : '#4A7A5E'
  const inner = isSelected ? '#22C55E' : '#6BAD87'
  const svg = `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="12" fill="${color}" fill-opacity="${isSelected ? 1 : 0.75}"/>
    <circle cx="14" cy="14" r="6" fill="white" fill-opacity="0.9"/>
    <circle cx="14" cy="14" r="3" fill="${inner}"/>
  </svg>`
  return L.divIcon({
    html: svg,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: '',
  })
}

export default function MobileMap() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(locations.find(l => l.id === 3))

  const filtered = filter === 'all' ? locations : locations.filter(l => l.category === filter)

  const regionLabel = (loc) => {
    if (!loc) return ''
    const map = { terelj: '울란바토르', ub: '울란바토르', gobi: '고비', khuvsgul: '홉스골', kharkhorin: '하르호린' }
    return map[loc.region] ?? loc.region
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: BG }}>

      {/* 상단 검색 + 필터 */}
      <div className="px-4 pt-12 pb-3 flex-shrink-0" style={{ background: BG }}>
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-3"
          style={{ background: CARD }}
        >
          <span className="text-[#7DB89A] text-base">🔍</span>
          <span className="text-[#7DB89A] text-sm">
            {lang === 'kr' ? '여행지 검색...' : lang === 'en' ? 'Search destinations...' : 'Газар хайх...'}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATS.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                filter === cat.key
                  ? { background: '#22C55E', color: '#fff' }
                  : { background: 'transparent', color: '#7DB89A', border: '1px solid rgba(125,184,154,0.3)' }
              }
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={[46.8625, 103.8467]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {filtered.filter(l => l.lat && l.lng).map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={makeIcon(selected?.id === loc.id)}
              eventHandlers={{ click: () => setSelected(loc) }}
            />
          ))}
        </MapContainer>
      </div>

      {/* 선택된 장소 카드 */}
      {selected && (
        <div
          className="flex-shrink-0 px-4 pt-4 pb-4 rounded-t-3xl"
          style={{ background: CARD, boxShadow: '0 -4px 24px rgba(0,0,0,0.3)' }}
        >
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <h3 className="text-white font-black text-base mb-1">{selected.name[lang]}</h3>
          <p className="text-[#22C55E] text-xs mb-3">
            🌿 {lang === 'kr' ? '자연 명소' : lang === 'en' ? 'Nature spot' : 'Байгалийн газар'} · {regionLabel(selected)}
          </p>
          <div className="flex gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-bold">{selected.rating}</span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <MapPin size={11} className="text-[#7DB89A]" />
              <span className="text-white text-xs">
                {selected.region === 'terelj' ? '70km' : selected.region === 'gobi' ? '500km' : '–'}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Clock size={11} className="text-[#7DB89A]" />
              <span className="text-white text-xs">{selected.duration[lang]}</span>
            </div>
          </div>
        </div>
      )}

      {/* 하단 탭바 */}
      <div
        className="flex-shrink-0 border-t"
        style={{ background: BG, borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-stretch justify-around">
          {[
            { path: '/home', label: { kr: '홈 화면', en: 'Home', mn: 'Нүүр' } },
            { path: '/explore', label: { kr: '추천 여행지 탐색', en: 'Explore', mn: 'Судлах' } },
            { path: '/map', label: { kr: '지도 탐색', en: 'Map', mn: 'Газар' }, active: true },
            { path: '/profile', label: { kr: '내 계정', en: 'My', mn: 'Миний' } },
          ].map(tab => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 py-3 flex-1"
            >
              <span
                className="text-[9px] font-semibold leading-tight text-center px-1"
                style={{ color: tab.active ? '#22C55E' : '#5A8A70' }}
              >
                {tab.label[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
