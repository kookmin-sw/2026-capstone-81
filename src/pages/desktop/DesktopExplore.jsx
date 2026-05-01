import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Search, Star, Clock, CalendarDays, SlidersHorizontal, MapPin, X } from 'lucide-react'

const REGIONS = [
  { key: 'all', label: { kr: '전체', en: 'All', mn: 'Бүгд' } },
  { key: 'ub', label: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' } },
  { key: 'gobi', label: { kr: '고비', en: 'Gobi', mn: 'Говь' } },
  { key: 'terelj', label: { kr: '테를지', en: 'Terelj', mn: 'Тэрэлж' } },
  { key: 'khuvsgul', label: { kr: '홉스골', en: 'Khuvsgul', mn: 'Хөвсгөл' } },
  { key: 'kharkhorin', label: { kr: '카라코룸', en: 'Karakorum', mn: 'Хархорум' } },
  { key: 'orkhon', label: { kr: '오르콘', en: 'Orkhon', mn: 'Орхон' } },
  { key: 'bayan', label: { kr: '바얀-울기', en: 'Bayan-Ulgii', mn: 'Баян-Өлгий' } },
]

const CATEGORIES = [
  { key: 'all', label: { kr: '전체', en: 'All', mn: 'Бүгд' }, emoji: '🌍' },
  { key: 'nature', label: { kr: '자연', en: 'Nature', mn: 'Байгаль' }, emoji: '🏔️' },
  { key: 'culture', label: { kr: '문화', en: 'Culture', mn: 'Соёл' }, emoji: '🏛️' },
  { key: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл ажиллагаа' }, emoji: '🐎' },
]

const SORT_OPTIONS = [
  { key: 'rating', label: { kr: '평점 높은순', en: 'Top Rated', mn: 'Үнэлгээ' } },
  { key: 'name', label: { kr: '이름순', en: 'Alphabetical', mn: 'Нэр' } },
]

export default function DesktopExplore() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('rating')

  const filtered = locations
    .filter(loc => {
      const matchRegion = region === 'all' || loc.region === region
      const matchCat = category === 'all' || loc.category === category
      const matchSearch = !search ||
        loc.name[lang].toLowerCase().includes(search.toLowerCase()) ||
        loc.description[lang].toLowerCase().includes(search.toLowerCase())
      return matchRegion && matchCat && matchSearch
    })
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : a.name[lang].localeCompare(b.name[lang]))

  const hasFilters = region !== 'all' || category !== 'all' || search

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">{tr('explore_title')}</h1>
          <p className="text-gray-500">몽골의 모든 여행지를 탐색해보세요 — {locations.length}개의 목적지</p>

          {/* Search bar */}
          <div className="flex items-center gap-3 mt-5 max-w-2xl">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tr('search_placeholder')}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label[lang]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-60 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Region filter */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  지역
                </h3>
                <div className="space-y-1">
                  {REGIONS.map(r => (
                    <button
                      key={r.key}
                      onClick={() => setRegion(r.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        region === r.key
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {r.label[lang]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-3">카테고리</h3>
                <div className="space-y-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        category === c.key
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{c.emoji}</span>
                      {c.label[lang]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {hasFilters && (
                <button
                  onClick={() => { setRegion('all'); setCategory('all'); setSearch('') }}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-primary hover:text-primary transition-all"
                >
                  필터 초기화
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm">
                <span className="font-bold text-gray-900">{filtered.length}</span>개의 여행지
              </p>
              {hasFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  {region !== 'all' && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      {REGIONS.find(r => r.key === region)?.label[lang]}
                      <button onClick={() => setRegion('all')}><X size={12} /></button>
                    </span>
                  )}
                  {category !== 'all' && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      {CATEGORIES.find(c => c.key === category)?.label[lang]}
                      <button onClick={() => setCategory('all')}><X size={12} /></button>
                    </span>
                  )}
                  {search && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      "{search}"
                      <button onClick={() => setSearch('')}><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg font-medium mb-2">검색 결과가 없습니다</p>
                <p className="text-gray-400 text-sm">다른 키워드나 필터를 사용해보세요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => navigate(`/explore/${loc.id}`)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={loc.image}
                        alt={loc.name[lang]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-800">{loc.rating}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                        {loc.tags[lang].slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{loc.name[lang]}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{loc.description[lang]}</p>
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span className="text-xs">{loc.duration[lang]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          <span className="text-xs">{loc.season[lang]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
