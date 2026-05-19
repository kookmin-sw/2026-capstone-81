import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, deleteDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ArrowLeft, Heart, MessageCircle, Send, User, Pencil, Trash2 } from 'lucide-react'

export default function UserBlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!db || !id) return
    const fetchPost = async () => {
      const snap = await getDoc(doc(db, 'blogs', id))
      if (snap.exists()) setPost({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    fetchPost()
  }, [id])

  useEffect(() => {
    if (!db || !id) return
    const q = query(collection(db, 'blogs', id, 'comments'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [id])

  const isAuthor = !!user && !!post && post.authorId === user.uid

  const handleDelete = async () => {
    if (!db || !post) return
    const ok = window.confirm(lang === 'kr' ? '이 글을 삭제할까요?' : lang === 'mn' ? 'Энэ нийтлэлийг устгах уу?' : 'Delete this post?')
    if (!ok) return
    try {
      await deleteDoc(doc(db, 'blogs', post.id))
      navigate('/blog')
    } catch (err) {
      console.error('[UserBlogDetail] delete failed', err)
      alert(lang === 'kr' ? '삭제 실패' : 'Delete failed')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !user || !db) return
    try {
      setSending(true)
      await addDoc(collection(db, 'blogs', id, 'comments'), {
        text: commentText.trim(),
        authorName: user.displayName || (lang === 'kr' ? '여행자' : 'Traveler'),
        authorId: user.uid,
        authorPhoto: user.photoURL || null,
        createdAt: serverTimestamp(),
      })
      setCommentText('')
    } catch (err) {
      console.error('Comment error:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
    </div>
  )

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400">Not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero image */}
      <div className="relative h-72 md:h-96">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/30 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </button>

        {/* Author-only actions */}
        {isAuthor && (
          <div className="absolute top-6 right-6 flex gap-2">
            <button onClick={() => navigate(`/write?edit=${post.id}`)}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/30 transition-colors"
              aria-label="Edit">
              <Pencil size={18} className="text-white" />
            </button>
            <button onClick={handleDelete}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 hover:bg-red-500/70 transition-colors"
              aria-label="Delete">
              <Trash2 size={18} className="text-white" />
            </button>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="inline-block bg-gradient-to-r from-purple-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            {post.category}
          </span>
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-3xl">{post.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="font-semibold text-white/90">{post.authorName}</span>
            <span>{post.createdAt?.toDate?.().toLocaleDateString() || ''}</span>
            <div className="flex items-center gap-1"><Heart size={14} />{post.likes || 0}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {post.content}
          </div>
        </div>

        {/* Comments section */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-gray-900 text-lg flex items-center gap-2 mb-5">
            <MessageCircle size={20} className="text-purple-500" />
            {lang === 'kr' ? '댓글' : lang === 'mn' ? 'Сэтгэгдэл' : 'Comments'}
            <span className="text-sm font-normal text-gray-400 ml-1">({comments.length})</span>
          </h3>

          {/* Comment list */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 && (
              <p className="text-center text-gray-300 text-sm py-6">
                {lang === 'kr' ? '첫 번째 댓글을 남겨보세요!' : lang === 'mn' ? 'Эхний сэтгэгдлээ үлдээгээрэй!' : 'Be the first to comment!'}
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  {c.authorPhoto ? (
                    <img src={c.authorPhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-green-100 flex items-center justify-center">
                      <User size={14} className="text-purple-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-700">{c.authorName}</span>
                    <span className="text-[10px] text-gray-300">
                      {c.createdAt?.toDate?.().toLocaleDateString() || ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          {user ? (
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus-within:border-purple-300 transition-colors">
                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  placeholder={lang === 'kr' ? '댓글을 입력하세요...' : lang === 'mn' ? 'Сэтгэгдэл бичнэ үү...' : 'Write a comment...'}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-300" />
              </div>
              <button type="submit" disabled={sending || !commentText.trim()}
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Send size={16} />
              </button>
            </form>
          ) : (
            <button onClick={() => navigate('/login')}
              className="w-full py-3 text-center text-sm font-semibold text-purple-500 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors">
              {lang === 'kr' ? '댓글을 남기려면 로그인하세요' : lang === 'mn' ? 'Сэтгэгдэл бичихийн тулд нэвтэрнэ үү' : 'Log in to comment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

