import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ArrowLeft, Link as LinkIcon, Send, X } from 'lucide-react'

const CATS = {
  kr: ['몽골', '여행팁', '음식', '문화', '자연'],
  en: ['Mongolia', 'Tips', 'Food', 'Culture', 'Nature'],
  mn: ['Монгол', 'Зөвлөмж', 'Хоол', 'Соёл', 'Байгаль'],
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80'

export default function WriteBlog() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [catIdx, setCatIdx] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cats = CATS[lang] || CATS.en
  const t = {
    kr: { titlePh: '제목', contentPh: '여행 이야기를 작성하세요...', photoUrl: '이미지 URL (선택사항)', urlPh: 'https://...', submit: '게시하기', pub: '게시 중...' },
    en: { titlePh: 'Title', contentPh: 'Write your travel story...', photoUrl: 'Image URL (optional)', urlPh: 'https://...', submit: 'Publish', pub: 'Publishing...' },
    mn: { titlePh: 'Гарчиг', contentPh: 'Аяллын түүхээ бичнэ үү...', photoUrl: 'Зургийн URL (заавал биш)', urlPh: 'https://...', submit: 'Нийтлэх', pub: 'Нийтэлж байна...' },
  }[lang] || { titlePh: 'Title', contentPh: 'Write your story...', photoUrl: 'Image URL (optional)', urlPh: 'https://...', submit: 'Publish', pub: 'Publishing...' }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!title.trim() || !content.trim()) { setError(lang === 'kr' ? '제목과 내용을 입력하세요' : 'Title and content required'); return }
    if (!db) { setError('DB not connected'); return }
    try {
      setLoading(true)
      await addDoc(collection(db, 'blogs'), {
        title: title.trim(), content: content.trim(), category: cats[catIdx],
        imageUrl: imageUrl.trim() || DEFAULT_IMG,
        authorName: user.displayName || 'Traveler',
        authorEmail: user.email, authorId: user.uid, lang,
        createdAt: serverTimestamp(), likes: 0,
      })
      navigate('/blog')
    } catch (err) {
      console.error(err)
      setError(lang === 'kr' ? '게시 실패' : 'Failed to publish')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Top bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <button onClick={handleSubmit} disabled={loading || !title.trim() || !content.trim()}
            className="flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <Send size={14} />
            {loading ? t.pub : t.submit}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center bg-red-50 rounded-xl px-4 py-2">{error}</div>
        )}

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {cats.map((c, i) => (
            <button key={c} type="button" onClick={() => setCatIdx(i)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                catIdx === i ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>{c}</button>
          ))}
        </div>

        {/* Title */}
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder={t.titlePh} maxLength={100}
          className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 outline-none mb-4 border-none bg-transparent" />

        {/* Photo URL */}
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
            <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder={t.urlPh}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none min-w-0"
            />
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl('')} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 px-2">{t.photoUrl}</p>
          {imageUrl && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-52 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder={t.contentPh} rows={14}
          className="w-full text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none border-none bg-transparent" />
      </div>
    </div>
  )
}


