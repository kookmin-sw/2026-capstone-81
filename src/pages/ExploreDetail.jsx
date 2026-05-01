import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Calendar, Heart, Share2, MapPin, Sparkles } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { locations } from '../data/locations'
import BottomNav from '../components/BottomNav'

export default function ExploreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [liked, setLiked] = useState(false)

  const loc = locations.find(l => l.id === Number(id))
  if (!loc) return <div className="p-8 text-center text-gray-400">{tr('no_results')}</div>

  const related = locations.filter(l => l.id !== loc.id && l.category === loc.category).slice(0, 3)

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      {/* Hero */}
      <div className="relative h-64 flex-shrink-0">
        <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${
                liked ? 'bg-red-500' : 'bg-black/30'
              }`}
            >
              <Heart size={16} className={`${liked ? 'fill-white text-white' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {loc.tags[lang].map(tag => (
              <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/25 font-medium">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-white text-xl font-black leading-tight mb-1 drop-shadow">{loc.name[lang]}</h1>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white text-sm font-bold">{loc.rating}</span>
            <span className="text-white/50 text-xs ml-1">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Info strip */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" />
            <div>
              <p className="text-[10px] text-gray-400">{tr('detail_recommended_duration')}</p>
              <p className="text-xs font-bold text-gray-800">{loc.duration[lang]}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary" />
            <div>
              <p className="text-[10px] text-gray-400">{tr('detail_best_season')}</p>
              <p className="text-xs font-bold text-gray-800">{loc.season[lang]}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-primary" />
            <div>
              <p className="text-[10px] text-gray-400">GPS</p>
              <p className="text-xs font-bold text-gray-800">{loc.lat.toFixed(1)}°N</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="text-sm font-black text-gray-900 mb-2">{tr('detail_intro')}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{loc.description[lang]}</p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-2 bg-white px-4 pt-4 pb-4">
            <h2 className="text-sm font-black text-gray-900 mb-3">{tr('detail_related')}</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {related.map(r => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/explore/${r.id}`)}
                  className="flex-shrink-0 w-32 cursor-pointer"
                >
                  <div className="relative h-20 rounded-xl overflow-hidden mb-1.5">
                    <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded-full">
                      <Star size={8} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-[9px] font-bold">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{r.name[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-4 mt-3 flex gap-3">
          <button
            onClick={() => navigate('/planner')}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            <Sparkles size={15} />
            AI {lang === 'kr' ? '일정 만들기' : lang === 'en' ? 'Plan Trip' : 'Төлөвлөх'}
          </button>
          <button
            onClick={() => navigate('/map', { state: { locationId: loc.id } })}
            className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
          >
            <MapPin size={20} className="text-primary" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
