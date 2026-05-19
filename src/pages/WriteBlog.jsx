import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, addDoc, updateDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ArrowLeft, ImagePlus, Send, X } from 'lucide-react'

const CATS = {
  kr: ['몽골', '여행팁', '음식', '문화', '자연'],
  en: ['Mongolia', 'Tips', 'Food', 'Culture', 'Nature'],
  mn: ['Монгол', 'Зөвлөмж', 'Хоол', 'Соёл', 'Байгаль'],
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80'

// Resize + JPEG-recompress the image entirely in the browser and return it as
// a base64 data URL. We store it directly inside the Firestore blog document
// (no Firebase Storage) — this removes the whole upload failure surface
// (Storage rules / billing / CORS). Compression steps down until the data URL
// fits comfortably inside Firestore's 1 MB document cap.
function compressToDataURL(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const steps = [[1200, 0.82], [1000, 0.74], [800, 0.66], [600, 0.6]]
      let out = ''
      for (const [maxPx, quality] of steps) {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        out = canvas.toDataURL('image/jpeg', quality)
        if (out.length < 720 * 1024) break
      }
      resolve(out)
    }
    img.onerror = () => reject(new Error('Could not read image'))
    img.src = url
  })
}

export default function WriteBlog() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { lang } = useLang()
  const { user } = useAuth()
  const fileRef = useRef(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [catIdx, setCatIdx] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [existingImage, setExistingImage] = useState('') // image kept when editing
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [error, setError] = useState('')
  const [loadingPost, setLoadingPost] = useState(!!editId)

  const cats = CATS[lang] || CATS.en
  const isEdit = !!editId

  // Edit mode — load the existing post and prefill the form.
  useEffect(() => {
    if (!editId || !db) return
    let cancelled = false
    ;(async () => {
      try {
        const snap = await getDoc(doc(db, 'blogs', editId))
        if (cancelled) return
        if (!snap.exists()) { setError('Post not found'); setLoadingPost(false); return }
        const p = snap.data()
        setTitle(p.title || '')
        setContent(p.content || '')
        setExistingImage(p.imageUrl || '')
        setPreview(p.imageUrl || '')
        // Map the stored category string back to an index across all langs.
        const idx = Object.values(CATS).map(arr => arr.indexOf(p.category)).find(i => i >= 0)
        if (idx >= 0) setCatIdx(idx)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoadingPost(false)
      }
    })()
    return () => { cancelled = true }
  }, [editId])

  const t = {
    kr: { titlePh: '제목', contentPh: '여행 이야기를 작성하세요...', photo: '사진 추가', submit: isEdit ? '수정하기' : '게시하기', pub: isEdit ? '수정 중...' : '게시 중...', processing: '사진 처리 중...', saving: '저장 중...' },
    en: { titlePh: 'Title', contentPh: 'Write your travel story...', photo: 'Add photo', submit: isEdit ? 'Update' : 'Publish', pub: isEdit ? 'Updating...' : 'Publishing...', processing: 'Processing photo...', saving: 'Saving...' },
    mn: { titlePh: 'Гарчиг', contentPh: 'Аяллын түүхээ бичнэ үү...', photo: 'Зураг нэмэх', submit: isEdit ? 'Засах' : 'Нийтлэх', pub: isEdit ? 'Засаж байна...' : 'Нийтэлж байна...', processing: 'Зураг боловсруулж байна...', saving: 'Хадгалж байна...' },
  }[lang] || { titlePh: 'Title', contentPh: 'Write your story...', photo: 'Add photo', submit: 'Publish', pub: 'Publishing...', processing: 'Processing...', saving: 'Saving...' }

  const handleImage = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 25 * 1024 * 1024) { setError('Max 25MB'); return }
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  const removeImage = () => {
    setImageFile(null)
    setPreview('')
    setExistingImage('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!title.trim() || !content.trim()) {
      setError(lang === 'kr' ? '제목과 내용을 입력하세요' : 'Title and content required')
      return
    }
    if (!db) { setError('DB not connected'); return }
    try {
      setLoading(true)

      // Decide the image to save: a freshly picked file → compress; otherwise
      // keep whatever was already there (editing), else the default image.
      let imageUrl = existingImage || DEFAULT_IMG
      if (imageFile) {
        try {
          setUploadStatus(t.processing)
          imageUrl = await compressToDataURL(imageFile)
        } catch (imgErr) {
          console.error('[WriteBlog] image processing failed:', imgErr)
          setError(lang === 'kr'
            ? `사진 처리 실패: ${imgErr.message}. 기본 이미지로 저장합니다.`
            : `Photo failed: ${imgErr.message}. Saving with default image.`)
          imageUrl = existingImage || DEFAULT_IMG
        }
      }

      setUploadStatus(t.saving)
      if (isEdit) {
        await updateDoc(doc(db, 'blogs', editId), {
          title: title.trim(),
          content: content.trim(),
          category: cats[catIdx],
          imageUrl,
          updatedAt: serverTimestamp(),
        })
        navigate(`/post/${editId}`)
      } else {
        await addDoc(collection(db, 'blogs'), {
          title: title.trim(),
          content: content.trim(),
          category: cats[catIdx],
          imageUrl,
          authorName: user?.displayName || 'Traveler',
          authorEmail: user?.email ?? null,
          authorId: user?.uid ?? null,
          lang,
          createdAt: serverTimestamp(),
          likes: 0,
        })
        navigate('/blog')
      }
    } catch (err) {
      console.error(err)
      setError((lang === 'kr' ? '저장 실패: ' : 'Failed to save: ') + (err.message || err.code))
    } finally {
      setLoading(false)
      setUploadStatus('')
    }
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
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
          <div className="mb-4 text-red-500 text-sm text-center bg-red-50 rounded-xl px-4 py-2 whitespace-pre-line">{error}</div>
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

        {/* Photo (file upload) */}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        {preview ? (
          <div className="relative mb-4 rounded-2xl overflow-hidden">
            <img src={preview} alt="" className="w-full h-52 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full mb-4 border border-dashed border-gray-200 rounded-2xl py-6 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
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
