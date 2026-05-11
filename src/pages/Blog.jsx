import { useState, useEffect } from 'react'
import { Search, Heart, Clock, ArrowLeft, PenSquare } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, query as fbQuery, orderBy, onSnapshot } from 'firebase/firestore'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { blogs } from '../data/blogs'

export function BlogList() {
  const navigate = useNavigate()
  const { tr, lang } = useLang()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    if (!db) return
    const q = fbQuery(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setUserPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }, (err) => console.error('Failed to load user posts:', err))
    return () => unsub()
  }, [])

  const filtered = blogs.filter((b) =>
    b.title[lang].toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
        {/* Search + Write */}
        <div className="bg-white px-4 py-3 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder={tr('blog_search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          {user && (
            <button
              onClick={() => navigate('/write')}
              className="flex-shrink-0 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25"
            >
              <PenSquare size={16} className="text-white" />
            </button>
          )}
        </div>

        {/* Blog list */}
        <div className="px-4 pt-3 space-y-3">
          {filtered.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              <div className="relative h-44">
                <img src={blog.image} alt={blog.title[lang]} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {blog.category[lang]}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-900 leading-snug">{blog.title[lang]}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{blog.excerpt[lang]}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-400">{blog.date}</span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={10} />
                      {blog.readTime[lang]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Heart size={10} className="fill-red-400 text-red-400" />
                    {blog.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 사용자 게시물 */}
        {userPosts.length > 0 && (
          <div className="px-4 pt-4">
            <h3 className="text-sm font-black text-gray-900 mb-3">
              {lang === 'kr' ? '✍️ 여행자 게시물' : lang === 'en' ? '✍️ Traveler Posts' : '✍️ Аялагчдын нийтлэл'}
            </h3>
            <div className="space-y-3">
              {userPosts.map((post) => (
                <div key={post.id} onClick={() => navigate(`/post/${post.id}`)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-all">
                  <div className="relative h-36">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{post.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{post.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-400 font-semibold">{post.authorName}</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Heart size={10} className="text-red-400" />
                        {post.likes || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
  const [liked, setLiked] = useState(false)

  const blog = blogs.find((b) => b.id === Number(id))
  if (!blog) return <div className="p-8 text-center text-gray-400">Not found</div>

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero */}
      <div className="relative h-56 flex-shrink-0">
        <img src={blog.image} alt={blog.title[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2"
        >
          <Heart size={18} className={liked ? 'fill-red-400 text-red-400' : 'text-white'} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {blog.category[lang]}
          </span>
          <h1 className="text-lg font-bold text-gray-900 mt-2 leading-tight">{blog.title[lang]}</h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>@{blog.author}</span>
            <span>{blog.date}</span>
            <div className="flex items-center gap-1">
              <Heart size={10} className="fill-red-400 text-red-400" />
              {blog.likes + (liked ? 1 : 0)}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.content[lang]}
          </div>
        </div>
      </div>
    </div>
  )
}
