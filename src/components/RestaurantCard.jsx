import { Star, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const priceColor = { '$': 'text-emerald-600', '$$': 'text-blue-600', '$$$': 'text-purple-600' }

export default function RestaurantCard({ restaurant, size = 'sm' }) {
  const { lang } = useLang()
  const navigate = useNavigate()
  const r = restaurant

  if (size === 'lg') {
    return (
      <div onClick={() => navigate('/restaurants')} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-all">
        <div className="relative h-44">
          <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {r.category[lang]}
          </span>
          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{r.rating}</span>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-black text-gray-900 leading-snug">{r.name[lang]}</h3>
            <span className={`text-xs font-black flex-shrink-0 ${priceColor[r.price]}`}>{r.price}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{r.description[lang]}</p>
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={10} className="text-gray-400 flex-shrink-0" />
            <span className="text-[10px] text-gray-400 truncate">{r.area[lang]}</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
              {lang === 'kr' ? '추천: ' : lang === 'mn' ? 'Санал: ' : 'Try: '}{r.mustTry[lang]}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={() => navigate('/restaurants')} className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100/80 cursor-pointer active:scale-[0.98] transition-all">
      <div className="relative h-28">
        <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
          <Star size={9} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-bold text-white">{r.rating}</span>
        </div>
      </div>
      <div className="p-2.5">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-black text-gray-900 truncate">{r.name[lang]}</p>
          <span className={`text-[10px] font-black flex-shrink-0 ${priceColor[r.price]}`}>{r.price}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{r.category[lang]}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={9} className="text-gray-400 flex-shrink-0" />
          <span className="text-[10px] text-gray-400 truncate">{r.area[lang]}</span>
        </div>
      </div>
    </div>
  )
}
