import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db, storage } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ArrowLeft, ImagePlus, Send, X } from 'lucide-react'

const CATS = {
  kr: ['몽골', '여행팁', '음식', '문화', '자연'],
  en: ['Mongolia', 'Tips', 'Food', 'Culture', 'Nature'],
  mn: ['Монгол', 'Зөвлөмж', 'Хоол', 'Соёл', 'Байгаль'],
}

export default function WriteBlog() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const fileRef = useRef(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [catIdx, setCatIdx] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [error, setError] = useState('')

  const cats = CATS[lang] || CATS.en
  const t = {
    kr: { titlePh: '제목', contentPh: '여행 이야기를 작성하세요...', photo: '사진 추가', submit: '게시하기', pub: '게시 중...', uploading: '사진 업로드 중...', saving: '저장 중...' },
    en: { titlePh: 'Title', contentPh: 'Write your travel story...', photo: 'Add photo', submit: 'Publish', pub: 'Publishing...', uploading: 'Uploading photo...', saving: 'Saving...' },
    mn: { titlePh: 'Гарчиг', contentPh: 'Аяллын түүхээ бичнэ үү...', photo: 'Зураг нэмэх', submit: 'Нийтлэх', pub: 'Нийтэлж байна...', uploading: 'Зураг байршуулж байна...', saving: 'Хадгалж байна...' },
  }[lang] || { titlePh: 'Title', contentPh: 'Write your story...', photo: 'Add photo', submit: 'Publish', pub: 'Publishing...', uploading: 'Uploading...', saving: 'Saving...' }

  const handleImage = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError('Max 5MB'); return }
    setImageFile(f); setPreview(URL.createObjectURL(f)); setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!title.trim() || !content.trim()) { setError(lang === 'kr' ? '제목과 내용을 입력하세요' : 'Title and content required'); return }
    if (!db) { setError('DB not connected'); return }
    try {
      setLoading(true)
      let imageUrl = 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80'
      if (imageFile && storage) {
        try {
          setUploadStatus(t.uploading)
          const sRef = ref(storage, `blog-images/${Date.now()}_${imageFile.name}`)
          await uploadBytes(sRef, imageFile)
          imageUrl = await getDownloadURL(sRef)
        } catch {
          // Storage unavailable — post with default image
        }
      }
      setUploadStatus(t.saving)
      await addDoc(collection(db, 'blogs'), {
        title: title.trim(), content: content.trim(), category: cats[catIdx],
        imageUrl, authorName: user.displayName || 'Traveler',
        authorEmail: user.email, authorId: user.uid, lang,
        createdAt: serverTimestamp(), likes: 0,
      })
      navigate('/blog')
    } catch (err) {
      console.error(err)
      setError(lang === 'kr' ? '게시 실패' : 'Failed to publish')
    } finally { setLoading(false); setUploadStatus('') }
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
            {loading ? (uploadStatus || t.pub) : t.submit}
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

        {/* Photo */}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        {preview ? (
          <div className="relative mb-4 rounded-2xl overflow-hidden">
            <img src={preview} alt="" className="w-full h-52 object-cover" />
            <button onClick={() => { setImageFile(null); setPreview(''); if(fileRef.current) fileRef.current.value='' }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full mb-4 border border-dashed border-gray-200 rounded-2xl py-6 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all">
            <ImagePlus size={18} />
            <span className="text-sm">{t.photo}</span>
          </button>
        )}

        {/* Content */}
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder={t.contentPh} rows={14}
          className="w-full text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none border-none bg-transparent" />
      </div>
    </div>
  )
}


