import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Search, Star, Clock, CalendarDays } from 'lucide-react'
import MobileLayout from './MobileLayout'

const CATEGORIES = [
  { key: 'all', emoji: '🌍' },
  { key: 'nature', emoji: '🏔️' },
  { key: 'culture', emoji: '🏛️' },
  { key: 'activity', emoji: '🐎' },
]

const catLabels = {
  all: { kr: '전체', en: 'All', mn: 'Бүгд' },
  nature: { kr: '자연', en: 'Nature', mn: 'Байгаль' },
  culture: { kr: '문화', en: 'Culture', mn: 'Соёл' },
  activity: { kr: '액티비티', en: 'Activity', mn: 'Үйл' },
}

export default function MobileExplore() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = locations.filter(l => {
    const matchCat = activeCategory === 'all' || l.category === activeCategory
    if (!searchQuery) return matchCat
    const q = searchQuery.toLowerCase()
    return matchCat && (
      Object.values(l.name).some(n => n.toLowerCase().includes(q)) ||
      Object.values(l.description).some(d => d.toLowerCase().includes(q))
    )
  })

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">
        {/* 헤더 */}
        <h1 className="text-2xl font-black text-gray-900 mb-1">
          {lang === 'kr' ? '탐색' : lang === 'en' ? 'Explore' : 'Хайх'}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {lang === 'kr' ? `몽골의 모든 여행지를 탐색해보세요 — ${locations.length}개의 목적지` : lang === 'en' ? `Explore all destinations in Mongolia — ${locations.length} places` : `Монголын бүх газрыг хайж олоорой — ${locations.length} газар`}
        </p>

        {/* 검색 */}
        <div className="flex items-center gap-2 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-4">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'kr' ? '여행지 검색...' : lang === 'en' ? 'Search destinations...' : 'Газар хайх...'}
            className="flex-1 text-gray-600 placeholder-gray-400 outline-none text-sm bg-transparent"
          />
        </div>

        {/* 카테고리 */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span>{cat.emoji}</span>
              {catLabels[cat.key][lang]}
            </button>
          ))}
        </div>

        {/* 여행지 목록 */}
        <div className="space-y-3">
          {filteredLocations.map(loc => (
            <div
              key={loc.id}
              onClick={() => navigate(`/explore/${loc.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer flex gap-3 p-3"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                  <Star size={9} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-bold text-white">{loc.rating}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-900 text-sm mb-1">{loc.name[lang]}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-2">{loc.description[lang]}</p>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span className="text-[10px]">{loc.duration[lang]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays size={10} />
                    <span className="text-[10px]">{loc.season[lang]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}