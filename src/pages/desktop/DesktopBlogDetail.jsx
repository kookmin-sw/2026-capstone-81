import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { blogs } from '../../data/blogs'
import { ArrowLeft, Heart, Clock, Share2, BookOpen } from 'lucide-react'

export default function DesktopBlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(null)

  const blog = blogs.find(b => b.id === Number(id))
  const related = blogs.filter(b => b.id !== Number(id)).slice(0, 3)

  if (!blog) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl">블로그를 찾을 수 없습니다</p>
          <button onClick={() => navigate('/blog')} className="mt-4 text-primary hover:underline">블로그로 돌아가기</button>
        </div>
      </div>
    )
  }

  const count = likeCount ?? blog.likes

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? count - 1 : count + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative h-96">
        <img src={blog.image} alt={blog.title[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              블로그로 돌아가기
            </button>
            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              {blog.category[lang]}
            </span>
            <h1 className="text-3xl font-black text-white mb-3 leading-tight">{blog.title[lang]}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="font-semibold text-white/80">{blog.author}</span>
              <div className="flex items-center gap-1"><Clock size={13} />{blog.readTime[lang]}</div>
              <span>{blog.date}</span>
              <div className="flex items-center gap-1"><Heart size={13} />{count}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          {/* Article */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
              <p className="text-gray-500 text-base leading-relaxed italic border-l-4 border-primary pl-4 mb-6">
                {blog.excerpt[lang]}
              </p>
              <div className="prose prose-gray max-w-none">
                {blog.content[lang].split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-black text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>
                  }
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-2xl font-black text-gray-900 mt-6 mb-3">{line.slice(2)}</h1>
                  }
                  if (line.startsWith('- ') || line.match(/^\d+\. /)) {
                    return <li key={i} className="text-gray-600 text-base leading-relaxed ml-4 mb-1">{line.replace(/^-\s|^\d+\.\s/, '')}</li>
                  }
                  if (line.trim() === '') return <br key={i} />
                  return <p key={i} className="text-gray-600 text-base leading-relaxed mb-3">{line}</p>
                })}
              </div>
            </div>

            {/* Like & Share */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <Heart size={16} className={liked ? 'fill-white' : ''} />
                {count}
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary transition-all">
                <Share2 size={16} />
                공유
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-primary" />
                다른 블로그
              </h3>
              <div className="space-y-3">
                {related.map(b => (
                  <button
                    key={b.id}
                    onClick={() => navigate(`/blog/${b.id}`)}
                    className="flex gap-3 w-full text-left group"
                  >
                    <img src={b.image} alt={b.title[lang]} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {b.title[lang]}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={9} />
                        {b.readTime[lang]}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
