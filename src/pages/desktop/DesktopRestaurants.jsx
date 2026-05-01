import { useState } from 'react'
import { Search, Star, MapPin, Clock, UtensilsCrossed } from 'lucide-react'
import { useLang } from '../../context/LangContext'
import { restaurants } from '../../data/restaurants'

const FILTERS = [
  { key: 'all', kr: '전체', en: 'All', mn: 'Бүгд' },
  { key: '$', kr: '저렴 ($)', en: 'Budget ($)', mn: 'Хямд ($)' },
  { key: '$$', kr: '중간 ($$)', en: 'Mid-range ($$)', mn: 'Дунд ($$)' },
  { key: '$$$', kr: '고급 ($$$)', en: 'Fine Dining ($$$)', mn: 'Тансаг ($$$)' },
]

const priceColor = {
  '$': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '$$': 'text-blue-600 bg-blue-50 border-blue-200',
  '$$$': 'text-purple-600 bg-purple-50 border-purple-200',
}

export default function DesktopRestaurants() {
  const { lang } = useLang()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = restaurants.filter(r => {
    const matchQuery = r.name[lang].toLowerCase().includes(query.toLowerCase()) ||
      r.category[lang].toLowerCase().includes(query.toLowerCase())
    const matchPrice = filter === 'all' || r.price === filter
    return matchQuery && matchPrice
  })

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-16">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85"
          alt="Ulaanbaatar restaurants"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/60 text-xs font-semibold mb-2 uppercase tracking-wider">
            <UtensilsCrossed size={13} />
            {lang === 'kr' ? '울란바토르' : lang === 'en' ? 'Ulaanbaatar' : 'Улаанбаатар'}
          </div>
          <h1 className="text-white font-black text-3xl">
            {lang === 'kr' ? '울란바토르 맛집 가이드' : lang === 'en' ? 'Ulaanbaatar Restaurant Guide' : 'Улаанбаатарын рестораны'}
          </h1>
          <p className="text-white/65 text-sm mt-1">
            {lang === 'kr' ? `현지인이 추천하는 ${restaurants.length}개 맛집` : lang === 'en' ? `${restaurants.length} local-recommended restaurants` : `Орон нутгийнхны санал болгосон ${restaurants.length} ресторан`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex-1">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'kr' ? '식당 이름 또는 카테고리 검색...' : lang === 'en' ? 'Search by name or category...' : 'Нэр эсвэл ангиллаар хайх...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filter === f.key
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {f[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(r => (
            <div
              key={r.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name[lang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {r.category[lang]}
                </span>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{r.rating}</span>
                </div>
                <span className={`absolute bottom-3 right-3 text-xs font-black px-2.5 py-1 rounded-full border ${priceColor[r.price]}`}>
                  {r.price}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-900 text-base mb-1">{r.name[lang]}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{r.description[lang]}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="text-primary flex-shrink-0" />
                    {r.area[lang]}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} className="text-primary flex-shrink-0" />
                    {r.open}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-primary">🍽 {lang === 'kr' ? '추천 메뉴' : lang === 'en' ? 'Must Try' : 'Санал болгох'}:</span>{' '}
                    {r.mustTry[lang]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl">🍽</span>
            <p className="text-gray-400 mt-4">
              {lang === 'kr' ? '검색 결과가 없습니다' : lang === 'en' ? 'No results found' : 'Үр дүн олдсонгүй'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
