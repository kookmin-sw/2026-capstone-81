import { Star, Clock, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function DestinationCard({ location, size = 'sm' }) {
  const navigate = useNavigate()
  const { lang } = useLang()

  if (size === 'lg') {
    return (
      <div
        className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100/80 cursor-pointer active:scale-[0.99] transition-all"
        onClick={() => navigate(`/explore/${location.id}`)}
      >
        <div className="relative h-48">
          <img src={location.image} alt={location.name[lang]} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs font-bold">{location.rating}</span>
          </div>
          <div className="absolute bottom-3 left-3">
            <h3 className="text-white font-black text-lg leading-tight drop-shadow">{location.name[lang]}</h3>
          </div>
        </div>
        <div className="p-3.5">
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{location.description[lang]}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {location.tags[lang].slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock size={11} />
              <span className="text-[11px] font-medium">{location.duration[lang]}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-shrink-0 w-36 rounded-2xl overflow-hidden shadow-sm border border-gray-100/80 cursor-pointer active:scale-[0.98] transition-all bg-white"
      onClick={() => navigate(`/explore/${location.id}`)}
    >
      <div className="relative h-24 overflow-hidden">
        <img src={location.image} alt={location.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
          <Star size={9} className="fill-yellow-400 text-yellow-400" />
          <span className="text-white text-[10px] font-bold">{location.rating}</span>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-bold text-gray-900 truncate leading-tight">{location.name[lang]}</p>
        <div className="flex items-center gap-1 mt-1">
          <CalendarDays size={9} className="text-gray-400" />
          <span className="text-[10px] text-gray-400 truncate">{location.season[lang]}</span>
        </div>
      </div>
    </div>
  )
}
