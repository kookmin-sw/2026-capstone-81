import { useState } from 'react'
import { Search, Star, MapPin, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { restaurants } from '../data/restaurants'

const FILTERS = [
  { key: 'all', kr: '전체', en: 'All', mn: 'Бүгд' },
  { key: '$', kr: '저렴', en: 'Budget', mn: 'Хямд' },
  { key: '$$', kr: '중간', en: 'Mid', mn: 'Дунд' },
  { key: '$$$', kr: '고급', en: 'Fine', mn: 'Тансаг' },
]

const priceColor = { '$': 'text-emerald-600 bg-emerald-50', '$$': 'text-blue-600 bg-blue-50', '$$$': 'text-purple-600 bg-purple-50' }

export default function Restaurants() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = restaurants.filter(r => {
    const matchQuery = r.name[lang].toLowerCase().includes(query.toLowerCase()) ||
      r.category[lang].toLowerCase().includes(query.toLowerCase())
    const matchPrice = filter === 'all' || r.price === filter
    return matchQuery && matchPrice
  })

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
        {/* Hero */}
        <div className="relative h-32">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
            alt="Restaurants"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h1 className="text-white font-black text-lg">
              {lang === 'kr' ? '울란바토르 맛집' : lang === 'en' ? 'UB Restaurants' : 'УБ-ын рестораны'}
            </h1>
            <p className="text-white/70 text-xs mt-0.5">
              {lang === 'kr' ? `${restaurants.length}개 식당` : lang === 'en' ? `${restaurants.length} restaurants` : `${restaurants.length} ресторан`}
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2.5">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'kr' ? '식당 검색...' : lang === 'en' ? 'Search restaurants...' : 'Ресторан хайх...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant list */}
        <div className="px-4 pt-3 space-y-3">
          {filtered.map(r => (
            <div
              key={r.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="relative h-40">
                <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {r.category[lang]}
                </span>
                <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{r.rating}</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-black text-gray-900">{r.name[lang]}</h3>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 ${priceColor[r.price]}`}>
                    {r.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{r.description[lang]}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-500">{r.area[lang]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-500">{r.open}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-primary">
                    {lang === 'kr' ? '🍽 추천 메뉴: ' : lang === 'mn' ? '🍽 Санал болгох: ' : '🍽 Must try: '}
                  </span>
                  <span className="text-[10px] text-gray-600">{r.mustTry[lang]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
