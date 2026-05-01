import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { blogs } from '../../data/blogs'
import { Search, Heart, Clock, X, BookOpen } from 'lucide-react'

export default function DesktopBlog() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [search, setSearch] = useState('')

  const filtered = blogs.filter(b =>
    !search ||
    b.title[lang].toLowerCase().includes(search.toLowerCase()) ||
    b.excerpt[lang].toLowerCase().includes(search.toLowerCase())
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={24} className="text-primary" />
            <h1 className="text-3xl font-black text-gray-900">{tr('blog_title')}</h1>
          </div>
          <p className="text-gray-500 mb-5">여행자들의 생생한 몽골 여행 이야기를 만나보세요</p>
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 max-w-md">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tr('blog_search')}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <div
                onClick={() => navigate(`/blog/${featured.id}`)}
                className="cursor-pointer group mb-10"
              >
                <div className="relative rounded-3xl overflow-hidden h-80">
                  <img
                    src={featured.image}
                    alt={featured.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
                      {featured.category[lang]}
                    </span>
                    <h2 className="text-3xl font-black text-white mb-2 max-w-xl leading-tight">
                      {featured.title[lang]}
                    </h2>
                    <p className="text-white/70 text-sm line-clamp-2 max-w-lg mb-4">
                      {featured.excerpt[lang]}
                    </p>
                    <div className="flex items-center gap-4 text-white/60 text-xs">
                      <span className="font-semibold text-white/80">{featured.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{featured.readTime[lang]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{featured.likes}</span>
                      </div>
                      <span>{featured.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest in grid */}
            {rest.length > 0 && (
              <>
                <h2 className="text-xl font-black text-gray-900 mb-5">더 많은 이야기</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(blog => (
                    <div
                      key={blog.id}
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      className="cursor-pointer group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title[lang]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {blog.category[lang]}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-black text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title[lang]}
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                          {blog.excerpt[lang]}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-600">{blog.author}</span>
                            <div className="flex items-center gap-1">
                              <Clock size={11} />
                              <span>{blog.readTime[lang]}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={11} className="text-red-400" />
                            <span>{blog.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
