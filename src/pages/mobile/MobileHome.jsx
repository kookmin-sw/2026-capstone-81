import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { restaurants } from '../../data/restaurants'
import { blogs } from '../../data/blogs'
import { Search, Star, Clock, Sparkles, MapPin, ArrowRight, ChevronRight } from 'lucide-react'
import MobileLayout from './MobileLayout'

export default function MobileHome() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [searchQuery, setSearchQuery] = useState('')
  const [exchange, setExchange] = useState(null)

  useEffect(() => {
    fetch('https://api.frankfurter.app/latest?from=USD&to=MNT,KRW')
      .then(r => r.json()).then(setExchange).catch(() => {})
  }, [])

  return (
    <MobileLayout>
      <div className="bg-[#F8F9FB]">

        {/* Hero */}
        <section className="relative h-64 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1575415868394-e3b78f3e9b3f?auto=format&fit=crop&w=800&q=85"
            alt="Mongolia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1.5 rounded-full mb-3 border border-white/20">
              <MapPin size={10} />
              {lang === 'kr' ? '몽골 여행 AI 가이드' : lang === 'en' ? 'Mongolia AI Travel Guide' : 'Монгол аяллын AI хөтөч'}
            </div>
            <h1 className="text-3xl font-black text-white leading-tight mb-2">
              {lang === 'kr' ? (
                <><span className="text-emerald-300">몽골</span>을 만나다</>
              ) : lang === 'en' ? (
                <>Discover <span className="text-emerald-300">Mongolia</span></>
              ) : (
                <><span className="text-emerald-300">Монгол</span>оо нээ</>
              )}
            </h1>
          </div>
        </section>

        {/* Search */}
        <div className="px-4 -mt-5 relative z-10 mb-4">
          <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-xl">
            <div className="flex-1 flex items-center gap-2 px-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'kr' ? '어디로 떠나고 싶으세요?' : lang === 'en' ? 'Where do you want to go?' : 'Хаашаа явахыг хүсэж байна вэ?'}
                className="flex-1 text-gray-600 placeholder-gray-400 outline-none text-sm bg-transparent"
              />
            </div>
            <button
              onClick={() => navigate(searchQuery.trim() ? `/explore?q=${encodeURIComponent(searchQuery.trim())}` : '/explore')}
              className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm"
            >
              {lang === 'kr' ? '검색' : lang === 'en' ? 'Search' : 'Хайх'}
            </button>
          </div>
        </div>

        {/* AI Banner */}
        <div className="px-4 mb-5">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer p-5"
            onClick={() => navigate('/planner')}
            style={{ background: 'linear-gradient(135deg, #060A1A 0%, #1e3a8a 40%, #3B6FF0 100%)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-yellow-300" />
              <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-wider">AI-Powered</span>
            </div>
            <h2 className="text-lg font-black text-white mb-1">
              {lang === 'kr' ? '나만의 몽골 여행 일정' : lang === 'en' ? 'Your Mongolia Itinerary' : 'Таны аяллын хуваарь'}
            </h2>
            <p className="text-white/60 text-xs mb-4">
              {lang === 'kr' ? 'AI가 최적의 일정을 만들어드려요' : lang === 'en' ? 'AI crafts the perfect itinerary' : 'AI хамгийн сайн хуваарийг гаргаж өгнө'}
            </p>
            <button className="flex items-center gap-2 bg-white text-primary font-black rounded-xl px-4 py-2 text-sm">
              <Sparkles size={14} />
              {lang === 'kr' ? 'AI 일정 만들기' : lang === 'en' ? 'Create Itinerary' : 'Хуваарь гаргах'}
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* 인기 여행지 */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'kr' ? '인기 여행지' : lang === 'en' ? 'Popular Destinations' : 'Алдартай газрууд'}
            </h2>
            <button onClick={() => navigate('/explore')} className="text-primary text-xs font-bold flex items-center gap-1">
              {lang === 'kr' ? '전체보기' : lang === 'en' ? 'View All' : 'Бүгдийг үзэх'} <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {locations.slice(0, 6).map(loc => (
              <div
                key={loc.id}
                onClick={() => navigate(`/explore/${loc.id}`)}
                className="flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
              >
                <div className="relative h-28 overflow-hidden">
                  <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    <Star size={9} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-bold text-white">{loc.rating}</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="font-black text-gray-900 text-xs mb-0.5 truncate">{loc.name[lang]}</h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock size={9} />
                    <span className="text-[10px]">{loc.duration[lang]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 환율 */}
        {exchange && (
          <div className="px-4 mb-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
                {lang === 'kr' ? '환율' : lang === 'mn' ? 'Ханш' : 'Exchange Rate'}
              </p>
              <div className="flex justify-between">
                <div className="text-center">
                  <span className="text-lg">🇺🇸</span>
                  <p className="text-xs font-black text-gray-900">{(exchange.rates?.MNT ?? 0).toLocaleString()}₮</p>
                  <p className="text-[10px] text-gray-400">1 USD</p>
                </div>
                <div className="text-center">
                  <span className="text-lg">🇰🇷</span>
                  <p className="text-xs font-black text-gray-900">{(exchange.rates?.MNT / (exchange.rates?.KRW ?? 1) * 100).toFixed(1)}₮</p>
                  <p className="text-[10px] text-gray-400">100 KRW</p>
                </div>
                <div className="text-center">
                  <span className="text-lg">🇲🇳</span>
                  <p className="text-xs font-black text-gray-900">${(1 / (exchange.rates?.MNT ?? 1) * 100).toFixed(4)}</p>
                  <p className="text-[10px] text-gray-400">100 MNT</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 맛집 */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'kr' ? '울란바토르 맛집' : lang === 'en' ? 'Top Restaurants' : 'Шилдэг рестораны'}
            </h2>
            <button onClick={() => navigate('/restaurants')} className="text-primary text-xs font-bold flex items-center gap-1">
              {lang === 'kr' ? '전체보기' : lang === 'en' ? 'View All' : 'Бүгдийг үзэх'} <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {restaurants.slice(0, 3).map(r => (
              <div
                key={r.id}
                onClick={() => navigate('/restaurants')}
                className="flex gap-3 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer p-3"
              >
                <img src={r.image} alt={r.name[lang]} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-sm truncate">{r.name[lang]}</h3>
                  <p className="text-gray-500 text-xs mb-1">{r.category[lang]}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{r.rating}</span>
                    </div>
                    <span className="text-xs font-black text-primary">{r.price}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0 self-center" />
              </div>
            ))}
          </div>
        </div>

        {/* 블로그 */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'kr' ? '오늘의 블로그' : lang === 'en' ? 'Travel Blog' : 'Аяллын блог'}
            </h2>
            <button onClick={() => navigate('/blog')} className="text-primary text-xs font-bold flex items-center gap-1">
              {lang === 'kr' ? '전체보기' : lang === 'en' ? 'View All' : 'Бүгдийг үзэх'} <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {blogs.slice(0, 2).map(blog => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
              >
                <img src={blog.image} alt={blog.title[lang]} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-black text-gray-900 text-sm line-clamp-2 mb-1">{blog.title[lang]}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2">{blog.excerpt[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileLayout>
  )
}