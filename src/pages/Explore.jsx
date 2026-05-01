import { useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import DestinationCard from '../components/DestinationCard'
import { locations } from '../data/locations'

const regions = ['all', 'ub', 'gobi', 'terelj', 'khuvsgul', 'kharkhorin', 'orkhon', 'bayan']
const catFilters = ['all', 'nature', 'culture', 'activity']

export default function Explore() {
  const { tr, lang } = useLang()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [cat, setCat] = useState(searchParams.get('cat') || 'all')

  const filtered = locations.filter(loc => {
    const matchRegion = region === 'all' || loc.region === region
    const matchCat = cat === 'all' || loc.category === cat
    const matchQuery = !query || loc.name[lang].toLowerCase().includes(query.toLowerCase()) ||
      loc.description[lang].toLowerCase().includes(query.toLowerCase())
    return matchRegion && matchCat && matchQuery
  })

  const regionLabel = r => {
    const map = {
      all: tr('region_all'),
      ub: tr('region_ub'),
      gobi: tr('region_gobi'),
      terelj: tr('region_terelj'),
      khuvsgul: tr('region_khuvsgul'),
      kharkhorin: tr('region_kharkhorin'),
      orkhon: tr('region_orkhon'),
      bayan: tr('region_bayan'),
    }
    return map[r] ?? r
  }

  const catLabel = c => {
    const map = {
      all: tr('cat_all'),
      nature: tr('filter_nature'),
      culture: tr('filter_culture'),
      activity: tr('filter_activity'),
      food: tr('filter_food'),
    }
    return map[c] ?? c
  }

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Search */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={tr('search_placeholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Region chips */}
        <div className="bg-white px-4 pt-3 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  region === r
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {regionLabel(r)}
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div className="bg-white px-4 pb-3 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {catFilters.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  cat === c
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {catLabel(c)}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            <span className="font-bold text-gray-800">{filtered.length}</span>
            {lang === 'kr' ? '개의 여행지' : lang === 'en' ? ' destinations' : ' газар'}
          </p>
          {(region !== 'all' || cat !== 'all' || query) && (
            <button
              onClick={() => { setRegion('all'); setCat('all'); setQuery('') }}
              className="text-xs text-primary font-semibold flex items-center gap-1"
            >
              <X size={12} />
              {lang === 'kr' ? '초기화' : lang === 'en' ? 'Reset' : 'Арилгах'}
            </button>
          )}
        </div>

        {/* Results */}
        <div className="px-4 space-y-3 pb-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 text-sm font-medium">{tr('no_results')}</p>
            </div>
          ) : (
            filtered.map(loc => (
              <DestinationCard key={loc.id} location={loc} size="lg" />
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
