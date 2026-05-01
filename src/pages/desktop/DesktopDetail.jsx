import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Star, Clock, CalendarDays, ArrowLeft, Heart, MapPin, Share2, Sparkles, ChevronRight } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function DesktopDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
  const [liked, setLiked] = useState(false)

  const loc = locations.find(l => l.id === Number(id))
  const related = locations.filter(l => l.id !== Number(id) && l.category === loc?.category).slice(0, 3)

  if (!loc) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl">여행지를 찾을 수 없습니다</p>
          <button onClick={() => navigate('/explore')} className="mt-4 text-primary hover:underline">탐색으로 돌아가기</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative h-[500px]">
        <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">뒤로</span>
        </button>

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
            <Share2 size={16} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center border transition-all ${liked ? 'bg-red-500 border-red-500 text-white' : 'bg-white/20 border-white/30 text-white hover:bg-white/30'}`}
          >
            <Heart size={16} className={liked ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {loc.tags[lang].map(tag => (
                <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">{loc.name[lang]}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(loc.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30 fill-white/30'} />
                ))}
                <span className="text-sm font-bold ml-1">{loc.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span className="text-sm">{loc.duration[lang]}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays size={14} />
                <span className="text-sm">{loc.season[lang]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          {/* Main content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-3">소개</h2>
              <p className="text-gray-600 leading-relaxed text-base">{loc.description[lang]}</p>
            </div>

            {/* Mini Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                위치
              </h2>
              <div className="rounded-xl overflow-hidden h-64">
                <MapContainer
                  center={[loc.lat, loc.lng]}
                  zoom={9}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[loc.lat, loc.lng]} />
                </MapContainer>
              </div>
              <button
                onClick={() => navigate('/map')}
                className="mt-3 flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
              >
                전체 지도에서 보기 <ChevronRight size={14} />
              </button>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 mb-4">비슷한 여행지</h2>
                <div className="grid grid-cols-3 gap-4">
                  {related.map(r => (
                    <div
                      key={r.id}
                      onClick={() => navigate(`/explore/${r.id}`)}
                      className="cursor-pointer group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="h-28 overflow-hidden">
                        <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{r.name[lang]}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-600">{r.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">여행 정보</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">권장 기간</p>
                    <p className="text-sm font-semibold text-gray-800">{loc.duration[lang]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                    <CalendarDays size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">최적 시기</p>
                    <p className="text-sm font-semibold text-gray-800">{loc.season[lang]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Star size={16} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">평점</p>
                    <p className="text-sm font-semibold text-gray-800">{loc.rating} / 5.0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Planner CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-sm font-bold">AI 여행 플래너</span>
              </div>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                이 여행지를 포함한 나만의 맞춤 일정을 AI가 만들어드려요.
              </p>
              <button
                onClick={() => navigate('/planner')}
                className="w-full py-2.5 bg-white text-primary font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
              >
                일정 만들기 →
              </button>
            </div>

            {/* Budget CTA */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-2">여행 경비 계산</h3>
              <p className="text-gray-500 text-xs mb-3">이 여행지까지의 예상 비용을 계산해보세요.</p>
              <button
                onClick={() => navigate('/budget')}
                className="w-full py-2.5 border-2 border-primary text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white transition-all"
              >
                경비 계산하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
