import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { blogs } from '../../data/blogs'
import { restaurants } from '../../data/restaurants'
import { Search, Star, Clock, CalendarDays, Sparkles, MapPin, ArrowRight, ChevronRight, UtensilsCrossed } from 'lucide-react'

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

export default function DesktopHome() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredLocations = activeCategory === 'all'
    ? locations
    : locations.filter(l => l.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Hero */}
      <section className="relative h-[580px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1535728534313-e206f59bed23?auto=format&fit=crop&w=1800&q=85"
          alt="Mongolia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/75" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-8">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
            <MapPin size={12} />
            {lang === 'kr' ? '몽골 여행 AI 가이드' : lang === 'en' ? 'Mongolia AI Travel Guide' : 'Монгол аяллын AI хөтөч'}
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {lang === 'kr' ? (
              <>광활한<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">몽골</span>을 만나다</>
            ) : lang === 'en' ? (
              <>Discover<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Mongolia</span></>
            ) : (
              <><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Монгол</span>оо нээ</>
            )}
          </h1>
          <p className="text-white/75 text-lg mb-10 max-w-md leading-relaxed">
            {lang === 'kr'
              ? 'AI가 당신만을 위한 최적의 몽골 여행을 설계해드립니다'
              : lang === 'en'
              ? 'AI designs the perfect Mongolia trip just for you'
              : 'AI танд зориулсан хамгийн тохиромжтой аяллыг зохиож өгнө'}
          </p>

          {/* Search */}
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={tr('search_placeholder')}
                  readOnly
                  onClick={() => navigate('/explore')}
                  className="flex-1 text-gray-600 placeholder-gray-400 outline-none text-sm bg-transparent cursor-pointer"
                />
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md hover:bg-primary-dark transition-all"
              >
                {lang === 'kr' ? '탐색' : lang === 'en' ? 'Search' : 'Хайх'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/15">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-around">
            {[
              { num: '9+', label: lang === 'kr' ? '여행지' : lang === 'en' ? 'Destinations' : 'Газрууд' },
              { num: '3', label: lang === 'kr' ? '언어 지원' : lang === 'en' ? 'Languages' : 'Хэл' },
              { num: 'AI', label: lang === 'kr' ? '맞춤 설계' : lang === 'en' ? 'Powered' : 'Тусгай' },
              { num: '4.8★', label: lang === 'kr' ? '평균 평점' : lang === 'en' ? 'Avg. Rating' : 'Үнэлгээ' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center text-white">
                <div className="text-xl font-black">{num}</div>
                <div className="text-xs text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer group"
          onClick={() => navigate('/planner')}
          style={{ background: 'linear-gradient(135deg, #060A1A 0%, #1e3a8a 40%, #3B6FF0 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">AI-Powered</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                {lang === 'kr' ? '나만의 완벽한 몽골 여행 일정' : lang === 'en' ? 'Your Perfect Mongolia Itinerary' : 'Таны хувийн аяллын хуваарь'}
              </h2>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                {lang === 'kr'
                  ? '여행 기간, 예산, 관심사를 입력하면 AI가 최적의 일정을 만들어드려요'
                  : lang === 'en'
                  ? 'Enter your duration, budget, and interests — AI crafts the perfect itinerary'
                  : 'Хугацаа, төсөв, сонирхлоо оруулахад AI хамгийн сайн хуваарийг гаргаж өгнө'}
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 group-hover:shadow-white/30 text-sm">
                <Sparkles size={16} />
                {lang === 'kr' ? 'AI 일정 만들기' : lang === 'en' ? 'Create Itinerary' : 'Хуваарь гаргах'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{tr('popular_dest')}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {lang === 'kr' ? '몽골 최고의 여행지를 만나보세요' : lang === 'en' ? "Mongolia's finest destinations" : 'Монголын шилдэг газрууд'}
            </p>
          </div>
          <button onClick={() => navigate('/explore')} className="flex items-center gap-1 text-primary text-sm font-bold hover:gap-2 transition-all">
            {tr('view_all')} <ArrowRight size={15} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/40 hover:text-primary'
              }`}
            >
              <span>{cat.emoji}</span>
              {catLabels[cat.key][lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocations.slice(0, 6).map(loc => (
            <div
              key={loc.id}
              onClick={() => navigate(`/explore/${loc.id}`)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{loc.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  {loc.tags[lang].slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/25">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-900 text-base mb-1">{loc.name[lang]}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{loc.description[lang]}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center gap-1"><Clock size={11} /><span className="text-xs">{loc.duration[lang]}</span></div>
                    <div className="flex items-center gap-1"><CalendarDays size={11} /><span className="text-xs">{loc.season[lang]}</span></div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-primary flex items-center justify-center transition-colors">
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group" onClick={() => navigate('/map')}>
          <img src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1600&q=80" alt="Map" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <div className="flex items-center gap-2 text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider">
              <MapPin size={14} />{lang === 'kr' ? '인터랙티브 지도' : lang === 'en' ? 'Interactive Map' : 'Интерактив газрын зураг'}
            </div>
            <h2 className="text-3xl font-black text-white mb-2">
              {lang === 'kr' ? '지도로 탐험하기' : lang === 'en' ? 'Explore on Map' : 'Газрын зургаар хайх'}
            </h2>
            <p className="text-white/65 text-sm mb-5 max-w-sm">
              {lang === 'kr' ? '모든 여행지를 지도에서 확인하고 클릭 한 번으로 상세 정보를 확인하세요' : lang === 'en' ? 'View all destinations on map and get details with a single click' : 'Бүх газрыг газрын зурагт харж, нэг дарснаар дэлгэрэнгүй мэдээлэл авна уу'}
            </p>
            <button className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm w-fit hover:bg-gray-50 transition-colors">
              <MapPin size={15} className="text-primary" />
              {lang === 'kr' ? '지도 열기' : lang === 'en' ? 'Open Map' : 'Газрын зураг нээх'}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 맛집 section */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UtensilsCrossed size={18} className="text-primary" />
              <h2 className="text-2xl font-black text-gray-900">
                {lang === 'kr' ? '울란바토르 맛집' : lang === 'en' ? 'Top Restaurants in UB' : 'УБ-ын шилдэг рестораны'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm">
              {lang === 'kr' ? '현지인이 추천하는 울란바토르 맛집' : lang === 'en' ? 'Local-recommended restaurants in Ulaanbaatar' : 'Орон нутгийнхны санал болгосон рестораны'}
            </p>
          </div>
          <button onClick={() => navigate('/restaurants')} className="flex items-center gap-1 text-primary text-sm font-bold hover:gap-2 transition-all">
            {lang === 'kr' ? '전체보기 >' : lang === 'en' ? 'View All >' : 'Бүгдийг үзэх >'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {restaurants.slice(0, 4).map(r => (
            <div
              key={r.id}
              onClick={() => navigate('/restaurants')}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{r.rating}</span>
                </div>
                <span className={`absolute bottom-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  r.price === '$' ? 'bg-emerald-100 text-emerald-700' :
                  r.price === '$$' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>{r.price}</span>
              </div>
              <div className="p-3">
                <h3 className="font-black text-gray-900 text-sm mb-0.5">{r.name[lang]}</h3>
                <p className="text-gray-500 text-[11px] mb-1.5">{r.category[lang]}</p>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <MapPin size={10} className="text-primary" />
                  <span className="truncate">{r.area[lang]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{tr('today_blog')}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {lang === 'kr' ? '여행자들의 생생한 몽골 이야기' : lang === 'en' ? "Real stories from Mongolia travelers" : 'Монголоор аялагчдын тэмдэглэл'}
            </p>
          </div>
          <button onClick={() => navigate('/blog')} className="flex items-center gap-1 text-primary text-sm font-bold hover:gap-2 transition-all">
            {tr('view_all')} <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blogs.slice(0, 3).map(blog => (
            <div key={blog.id} onClick={() => navigate(`/blog/${blog.id}`)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-44 overflow-hidden">
                <img src={blog.image} alt={blog.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{blog.category[lang]}</span>
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">{blog.title[lang]}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{blog.excerpt[lang]}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">{blog.author}</span>
                  <span>{blog.readTime[lang]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <MapPin size={13} className="text-white" />
              </div>
              <span className="text-xl font-black text-white">NOMAD<span className="text-primary">AI</span></span>
            </div>
            <p className="text-white/40 text-xs">
              {lang === 'kr' ? 'AI와 함께하는 몽골 여행 플래너' : lang === 'en' ? 'AI-powered Mongolia travel planner' : 'AI-тай монгол аяллын төлөвлөгч'}
            </p>
          </div>
          <p className="text-white/25 text-xs">© 2026 NOMAD AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
