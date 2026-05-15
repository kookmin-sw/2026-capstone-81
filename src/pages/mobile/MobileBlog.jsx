import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { blogs } from '../../data/blogs'
import { db } from '../../firebase'
import { collection, query as fbQuery, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { Heart, MessageCircle, Bookmark, Clock, PenSquare, Trash2 } from 'lucide-react'
import MobileLayout from './MobileLayout'

const TABS = [
  { key: 'latest',    label: { kr: '최신',    en: 'Latest',    mn: 'Шинэ'     } },
  { key: 'popular',   label: { kr: '인기',    en: 'Popular',   mn: 'Алдартай' } },
  { key: 'following', label: { kr: '팔로잉',  en: 'Following', mn: 'Дагагчид' } },
]

// Estimate read time from content length (~400 chars/min for mixed CJK)
function estimateReadTime(content, lang) {
  const text = typeof content === 'string' ? content : ''
  const mins = Math.max(1, Math.round(text.length / 400))
  return lang === 'kr' ? `${mins}분` : lang === 'mn' ? `${mins} мин` : `${mins} min`
}

// "X minutes/hours/days ago" relative time
function timeAgo(date, lang) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  const diffMs = Date.now() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  if (diffMin < 1) return lang === 'kr' ? '방금' : lang === 'mn' ? 'дөнгөж' : 'just now'
  if (diffMin < 60) return lang === 'kr' ? `${diffMin}분 전` : lang === 'mn' ? `${diffMin} мин өмнө` : `${diffMin}m ago`
  if (diffHr < 24) return lang === 'kr' ? `${diffHr}시간 전` : lang === 'mn' ? `${diffHr} цагийн өмнө` : `${diffHr}h ago`
  if (diffDay < 30) return lang === 'kr' ? `${diffDay}일 전` : lang === 'mn' ? `${diffDay} өдрийн өмнө` : `${diffDay}d ago`
  return d.toLocaleDateString(lang === 'kr' ? 'ko' : lang === 'mn' ? 'mn' : 'en')
}

export default function MobileBlog() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [tab, setTab] = useState('latest')
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    if (!db) return
    const q = fbQuery(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setUserPosts(snap.docs.map(doc => ({ id: doc.id, isUser: true, ...doc.data() })))
    }, () => {})
    return () => unsub()
  }, [])

  const allPosts = [
    ...userPosts,
    ...blogs.map(b => ({ ...b, isUser: false })),
  ]

  const displayed = tab === 'popular'
    ? [...allPosts].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    : allPosts

  return (
    <MobileLayout>
      <div className="bg-[#F8F9FB] min-h-screen">

        {/* 헤더 */}
        <div className="bg-white px-4 pt-12 pb-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-gray-900">
              {lang === 'kr' ? '블로그' : lang === 'en' ? 'Blog' : 'Блог'}
            </h1>
            <button
              onClick={() => navigate('/write')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform"
            >
              <PenSquare size={13} />
              {lang === 'kr' ? '글 쓰기' : lang === 'en' ? 'Write' : 'Бичих'}
            </button>
          </div>

          {/* 탭 */}
          <div className="flex border-b border-gray-100">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all relative ${
                  tab === t.key ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {t.label[lang]}
                {tab === t.key && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 블로그 목록 */}
        <div className="px-4 pt-4 space-y-3 pb-4">
          {displayed.map((post, i) => {
            const isUser = post.isUser
            const title = isUser ? post.title : (post.title?.[lang] ?? post.title?.kr ?? '')
            const excerpt = isUser ? post.content?.slice(0, 80) : (post.excerpt?.[lang] ?? '')
            const image = post.image ?? ''
            const author = post.author ?? post.authorName ?? ''
            const createdDate = isUser ? post.createdAt?.toDate?.() : null
            const date = isUser
              ? (createdDate ? timeAgo(createdDate, lang) : '')
              : post.date ?? ''
            const likes = post.likes ?? 0
            const comments = isUser ? (post.comments ?? 0) : (post.comments ?? 0)
            const bookmarks = isUser ? (post.bookmarks ?? 0) : (post.bookmarks ?? 0)
            const readTime = isUser
              ? estimateReadTime(post.content, lang)
              : (post.readTime?.[lang] ?? post.readTime?.kr ?? '5분')

            const canDelete = isUser && user && (post.authorId === user.uid)

            const handleDelete = async (e) => {
              e.stopPropagation()
              if (!db || !post.id) return
              const ok = window.confirm(lang === 'kr' ? '이 글을 삭제할까요?' : 'Delete this post?')
              if (!ok) return
              try {
                await deleteDoc(doc(db, 'blogs', post.id))
              } catch (err) {
                console.error('[Blog] delete failed', err)
                alert(lang === 'kr' ? '삭제 실패' : 'Delete failed')
              }
            }

            return (
              <div
                key={`${isUser ? 'u' : 'b'}-${post.id ?? i}`}
                onClick={() => navigate(isUser ? `/post/${post.id}` : `/blog/${post.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer flex gap-3 p-3 relative"
              >
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 mb-0.5">{author} · {date}</p>
                  <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug mb-1">{title}</h3>
                  {excerpt && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock size={10} /> {readTime}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Heart size={10} /> {likes}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MessageCircle size={10} /> {comments}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Bookmark size={10} /> {bookmarks}
                    </span>
                  </div>
                </div>
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    aria-label="Delete"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </MobileLayout>
  )
}
