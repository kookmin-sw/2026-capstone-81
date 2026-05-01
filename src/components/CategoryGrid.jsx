import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const categories = [
  { key: 'beach', label: 'cat_beach', emoji: '🌴', gradient: 'from-pink-400 to-rose-500', filter: 'beach' },
  { key: 'romantic', label: 'cat_romantic', emoji: '❤️', gradient: 'from-rose-400 to-pink-600', filter: 'romantic' },
  { key: 'culture', label: 'cat_culture', emoji: '🏛️', gradient: 'from-amber-400 to-orange-500', filter: 'culture' },
  { key: 'nature', label: 'cat_nature', emoji: '⛰️', gradient: 'from-emerald-400 to-teal-500', filter: 'nature' },
  { key: 'all', label: 'cat_all', emoji: '⊞', gradient: 'from-purple-400 to-violet-500', filter: 'all' },
]

export default function CategoryGrid() {
  const navigate = useNavigate()
  const { tr } = useLang()

  return (
    <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-1">
      {categories.map(cat => (
        <button
          key={cat.key}
          onClick={() => navigate(`/explore?cat=${cat.filter}`)}
          className="flex flex-col items-center gap-2 min-w-[58px] group"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md group-active:scale-95 transition-transform`}>
            <span className="text-2xl">{cat.emoji}</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-600 whitespace-nowrap">
            {tr(cat.label)}
          </span>
        </button>
      ))}
    </div>
  )
}
