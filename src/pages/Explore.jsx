import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { BookOpen, Sparkles, ScrollText, Map, Mountain, UtensilsCrossed, Wallet, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

export default function Explore() {
  const navigate = useNavigate()
  const { lang } = useLang()

  const categories = [
    {
      icon: Mountain,
      color: 'bg-blue-50 text-blue-600',
      label: lang === 'kr' ? '여행지 탐색' : lang === 'mn' ? 'Газрууд хайх' : 'Destinations',
      desc: lang === 'kr' ? '몽골 전체 여행지 보기' : lang === 'mn' ? 'Монголын бүх газрууд' : 'Browse all Mongolia destinations',
      path: '/explore',
    },
    {
      icon: Map,
      color: 'bg-emerald-50 text-emerald-600',
      label: lang === 'kr' ? '지도' : lang === 'mn' ? 'Газрын зураг' : 'Map',
      desc: lang === 'kr' ? '인터랙티브 지도 탐색' : lang === 'mn' ? 'Интерактив газрын зураг' : 'Interactive map view',
      path: '/map',
    },
    {
      icon: ScrollText,
      color: 'bg-purple-50 text-purple-600',
      label: lang === 'kr' ? '문화 가이드' : lang === 'mn' ? 'Соёлын гарын авлага' : 'Culture Guide',
      desc: lang === 'kr' ? '몽골 문화 & 역사' : lang === 'mn' ? 'Монгол соёл & түүх' : 'Mongolia culture & history',
      path: '/culture',
    },
    {
      icon: UtensilsCrossed,
      color: 'bg-orange-50 text-orange-600',
      label: lang === 'kr' ? '맛집' : lang === 'mn' ? 'Рестораны' : 'Restaurants',
      desc: lang === 'kr' ? '울란바토르 맛집 추천' : lang === 'mn' ? 'УБ-ын шилдэг рестораны' : 'Best restaurants in UB',
      path: '/restaurants',
    },
    {
      icon: Wallet,
      color: 'bg-yellow-50 text-yellow-600',
      label: lang === 'kr' ? '경비 계산' : lang === 'mn' ? 'Зардал тооцоо' : 'Budget',
      desc: lang === 'kr' ? '여행 예산 계산기' : lang === 'mn' ? 'Аяллын зардал тооцоолол' : 'Travel cost estimator',
      path: '/budget',
    },
    {
      icon: BookOpen,
      color: 'bg-primary-light text-secondary',
      label: lang === 'kr' ? '블로그' : lang === 'mn' ? 'Блог' : 'Blog',
      desc: lang === 'kr' ? '여행자들의 이야기' : lang === 'mn' ? 'Аялагчдын түүх' : 'Traveler stories',
      path: '/blog',
    },
    {
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-600',
      label: lang === 'kr' ? 'AI 플래너' : lang === 'mn' ? 'AI Төлөвлөгч' : 'AI Planner',
      desc: lang === 'kr' ? 'AI가 만드는 여행 일정' : lang === 'mn' ? 'AI аялалын хуваарь' : 'AI-powered itinerary',
      path: '/planner',
    },
    {
      icon: MessageCircle,
      color: 'bg-teal-50 text-teal-600',
      label: lang === 'kr' ? 'AI 채팅' : lang === 'mn' ? 'AI Чат' : 'AI Chat',
      desc: lang === 'kr' ? 'AI와 여행 상담하기' : lang === 'mn' ? 'AI-тай аяллын зөвлөлгөө' : 'Chat with travel AI',
      path: '/chat',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-5 pt-6 pb-2">
          <h1 className="text-xl font-black text-gray-900 mb-1">
            {lang === 'kr' ? '카테고리' : lang === 'mn' ? 'Ангилал' : 'Category'}
          </h1>
          <p className="text-sm text-gray-400">
            {lang === 'kr' ? '원하는 정보를 선택하세요' : lang === 'mn' ? 'Хүссэн мэдээллээ сонгоно уу' : 'Choose what you want to explore'}
          </p>
        </div>

        <div className="px-5 pt-3 space-y-3">
          {categories.map(({ icon: Icon, color, label, desc, path }) => (
            <button key={label} onClick={() => navigate(path)}
              className="w-full flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-all active:scale-[0.99] text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <span className="text-gray-300 text-lg">&rsaquo;</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

