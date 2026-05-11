import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Star, ChevronRight } from 'lucide-react'
import MobileLayout from './MobileLayout'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MobileMap() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [selectedLoc, setSelectedLoc] = useState(null)

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* 헤더 */}
        <div className="px-4 pt-6 pb-3">
          <h1 className="text-2xl font-black text-gray-900">
            {lang === 'kr' ? '지도' : lang === 'en' ? 'Map' : 'Газрын зураг'}
          </h1>
          <p className="text-gray-500 text-sm">
            {lang === 'kr' ? '몽골 여행지를 지도에서 확인하세요' : lang === 'en' ? 'Explore Mongolia destinations on map' : 'Монголын газруудыг газрын зурагт харах'}
          </p>
        </div>

        {/* 지도 */}
        <div className="flex-1 mx-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ height: '400px' }}>
          <MapContainer
            center={[46.8625, 103.8467]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {locations.filter(l => l.lat && l.lng).map(loc => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                eventHandlers={{ click: () => setSelectedLoc(loc) }}
              >
                <Popup>{loc.name[lang]}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* 선택된 장소 */}
        {selectedLoc && (
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex gap-3">
            <img src={selectedLoc.image} alt={selectedLoc.name[lang]} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-gray-900 text-sm">{selectedLoc.name[lang]}</h3>
              <p className="text-gray-500 text-xs line-clamp-2 mb-1">{selectedLoc.description[lang]}</p>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-gray-700">{selectedLoc.rating}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/explore/${selectedLoc.id}`)}
              className="flex-shrink-0 self-center"
            >
              <ChevronRight size={20} className="text-primary" />
            </button>
          </div>
        )}

        {/* 여행지 목록 */}
        <div className="px-4 mt-3 mb-2">
          <h2 className="text-sm font-black text-gray-900 mb-2">
            {lang === 'kr' ? '전체 여행지' : lang === 'en' ? 'All Destinations' : 'Бүх газрууд'}
          </h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {locations.map(loc => (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                  selectedLoc?.id === loc.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                <span>{loc.name[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}