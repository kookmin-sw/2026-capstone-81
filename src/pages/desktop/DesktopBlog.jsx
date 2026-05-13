import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { blogs } from '../../data/blogs'
import { db } from '../../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { Search, Heart, Clock, Plus, User as UserIcon, BookOpen } from 'lucide-react'

export default function DesktopBlog() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all') // 'all' | 'mine'
  const [catFilter, setCatFilter] = useState('all')
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    if (!db) return
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setUserPosts(snap.docs.map(doc => ({ id: doc.id, _type: 'user', ...doc.data() })))
    }, err => console.error(err))
    return () => unsub()
  }, [])

  const L = {
    kr: { title: '블로그', sub: '여행자들의 생생한 몽골 여행 이야기를 공유해보세요', all: '전체 글', mine: '내가 쓴 글', write: '+ 글쓰기', search: '블로그 검색...', empty: '글이 없습니다', login_write: '로그인 후 글을 쓸 수 있어요', read: '읽기' },
    en: { title: 'Blog', sub: 'Share your real Mongolia travel stories with fellow travelers', all: 'All Posts', mine: 'My Posts', write: '+ Write', search: 'Search blog...', empty: 'No posts found', login_write: 'Log in to write a post', read: 'Read' },
    mn: { title: 'Блог', sub: 'Монгол аяллын шинэлэг түүхээ хуваалцаарай', all: 'Бүх нийтлэл', mine: 'Миний нийтлэл', write: '+ Бичих', search: 'Блог хайх...', empty: 'Нийтлэл байхгүй', login_write: 'Бичихийн тулд нэвтэрнэ үү', read: 'Унших' },
  }
  const l = L[lang] || L.en

  // All posts combined: static blogs + user posts from Firestore
  const allPosts = [
    ...blogs.map(b => ({ ...b, _type: 'static' })),
    ...userPosts,
  ]

  const myPosts = tab === 'mine'
    ? userPosts.filter(p => p.authorId === user?.uid)
    : null

  const sourceList = tab === 'mine' ? (myPosts || []) : allPosts

  const BLOG_CATS = [
    { key: 'all', label: { kr: '전체', en: 'All', mn: 'Бүгд' } },
    { key: '몽골', label: { kr: '몽골', en: 'Mongolia', mn: 'Монгол' } },
    { key: '자연', label: { kr: '자연', en: 'Nature', mn: 'Байгаль' } },
    { key: '여행팁', label: { kr: '여행 팁', en: 'Travel Tips', mn: 'Зөвлөмж' } },
  ]

  const filtered = sourceList.filter(p => {
    if (!search && catFilter === 'all') return true
    const title = p._type === 'static' ? (p.title[lang] || '') : (p.title || '')
    const excerpt = p._type === 'static' ? (p.excerpt?.[lang] || '') : (p.content || '')
    const cat = p._type === 'static' ? (p.category?.[lang] || p.category?.en || '') : (p.category || '')
    const q = search.toLowerCase()
    const matchQ = !search || title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q)
    const matchCat = catFilter === 'all' || cat.includes(catFilter)
    return matchQ && matchCat
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={22} className="text-primary" />
            <h1 className="text-2xl font-black text-gray-900">{l.title}</h1>
          </div>
          <p className="text-sm text-primary font-medium">{l.sub}</p>
        </div>

        {/* Tabs + Write button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                tab === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {l.all}
            </button>
            <button
              onClick={() => setTab('mine')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                tab === 'mine'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {l.mine}
            </button>
          </div>

          {user ? (
            <button
              onClick={() => navigate('/write')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              <Plus size={15} />
              {lang === 'kr' ? '글쓰기' : lang === 'mn' ? 'Бичих' : 'Write'}
            </button>
          ) : null}
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {BLOG_CATS.map(c => (
            <button
              key={c.key}
              onClick={() => setCatFilter(c.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                catFilter === c.key ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {c.label[lang]}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={l.search}
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Blog cards */}
        {tab === 'mine' && !user ? (
          <div className="text-center py-20 text-gray-400 text-sm">{l.login_write}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">{l.empty}</div>
        ) : (
          <>
            {/* Featured post */}
            {tab === 'all' && catFilter === 'all' && filtered[0]?._type === 'static' && (
              <article
                onClick={() => navigate(`/blog/${filtered[0].id}`)}
                className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mb-6"
              >
                <div className="relative w-2/5 flex-shrink-0" style={{ minHeight: 240 }}>
                  <img
                    src={filtered[0].image}
                    alt={filtered[0].title[lang]}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✨ {lang === 'kr' ? '추천 글' : lang === 'en' ? 'Featured' : 'Онцлох'}
                  </span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                      {filtered[0].category[lang]}
                    </span>
                    <h2 className="text-xl font-black text-gray-900 leading-snug mb-3 line-clamp-2">
                      {filtered[0].title[lang]}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {filtered[0].excerpt[lang]}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-semibold text-gray-600">{filtered[0].author}</span>
                      <span>·</span>
                      <span>{filtered[0].date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {filtered[0].readTime[lang]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-gray-400">
                        <Heart size={10} className="fill-red-400 text-red-400" /> {filtered[0].likes}
                      </span>
                      <span className="text-primary font-bold">{l.read} →</span>
                    </div>
                  </div>
                </div>
              </article>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(tab === 'all' && catFilter === 'all' ? filtered.slice(1) : filtered).map(post =>
                post._type === 'static'
                  ? <StaticCard key={post.id} blog={post} lang={lang} navigate={navigate} label={l.read} />
                  : <UserCard key={post.id} post={post} navigate={navigate} label={l.read} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StaticCard({ blog, lang, navigate, label }) {
  return (
    <article
      onClick={() => navigate(`/blog/${blog.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title[lang]}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {blog.category[lang]}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] bg-black/35 backdrop-blur-sm px-2 py-1 rounded-full">
          <Clock size={9} />
          {blog.readTime[lang]}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5">{blog.title[lang]}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{blog.excerpt[lang]}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-semibold text-gray-600">{blog.author}</span>
            <span>·</span>
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={10} className="fill-red-400 text-red-400" />
              {blog.likes}
            </span>
            <span className="text-primary font-bold">{label} →</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function UserCard({ post, navigate, label }) {
  return (
    <article
      onClick={() => navigate(`/post/${post.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.imageUrl || 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80'}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {post.category}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] bg-black/35 backdrop-blur-sm px-2 py-1 rounded-full">
          <UserIcon size={9} />
          {post.authorName}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5">{post.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{post.content}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={10} className="fill-red-400 text-red-400" />
              {post.likes || 0}
            </span>
            <span className="text-primary font-bold">{label} →</span>
          </div>
        </div>
      </div>
    </article>
  )
}
