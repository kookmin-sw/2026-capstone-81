import { Search, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import AIBanner from '../components/AIBanner'
import CategoryGrid from '../components/CategoryGrid'
import BlogCard from '../components/BlogCard'
import DestinationCard from '../components/DestinationCard'
import RestaurantCard from '../components/RestaurantCard'
import { blogs } from '../data/blogs'
import { locations } from '../data/locations'
import { restaurants } from '../data/restaurants'

export default function Home() {
  const navigate = useNavigate()
  const { tr, lang } = useLang()

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <Header />

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Search bar */}
        <div className="bg-white px-4 pt-4 pb-4">
          <button
            onClick={() => navigate('/explore')}
            className="w-full flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 text-left"
          >
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400 flex-1">{tr('search_placeholder')}</span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin size={13} className="text-primary" />
            </div>
          </button>
        </div>

        {/* AI Banner */}
        <div className="pt-3 pb-1">
          <AIBanner />
        </div>

        {/* Categories */}
        <div className="bg-white mt-3 pt-4 pb-4">
          <CategoryGrid />
        </div>

        {/* Blog section */}
        <div className="mt-3 bg-white pt-4 pb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-sm font-bold text-gray-900">{tr('today_blog')}</h3>
            <button onClick={() => navigate('/blog')} className="text-xs text-primary font-semibold">
              {tr('view_all')}
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {blogs.slice(0, 3).map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mt-3 bg-white pt-4 pb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-sm font-bold text-gray-900">{tr('popular_dest')}</h3>
            <button onClick={() => navigate('/explore')} className="text-xs text-primary font-semibold">
              {tr('view_all')}
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-1">
            {locations.slice(0, 6).map(loc => (
              <DestinationCard key={loc.id} location={loc} size="sm" />
            ))}
          </div>
        </div>

        {/* 맛집 섹션 */}
        <div className="mt-3 bg-white pt-4 pb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🍽</span>
              <h3 className="text-sm font-bold text-gray-900">
                {lang === 'kr' ? '울란바토르 맛집' : lang === 'en' ? 'UB Restaurants' : 'УБ-ын рестораны'}
              </h3>
            </div>
            <button onClick={() => navigate('/restaurants')} className="text-xs text-primary font-semibold">
              {tr('view_all')}
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-1">
            {restaurants.slice(0, 5).map(r => (
              <RestaurantCard key={r.id} restaurant={r} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
