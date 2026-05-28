import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Calendar, Heart, Share2, MapPin, Sparkles, Plus } from 'lucide-react'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, query as fbQuery, orderBy, onSnapshot } from 'firebase/firestore'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { locations } from '../data/locations'
import { museums } from '../data/museums'
import { getTransportForLoc } from '../data/transportData'
import { useWikiImage } from '../hooks/useWikiImage'
import BottomNav from '../components/BottomNav'

// Cheap relative-time formatter for the review row.
function reviewTimeAgo(date, lang) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const m = Math.floor((Date.now() - d.getTime()) / 60000)
  if (m < 1) return lang === 'kr' ? '방금' : lang === 'mn' ? 'дөнгөж' : 'just now'
  if (m < 60) return lang === 'kr' ? `${m}분 전` : lang === 'mn' ? `${m} мин өмнө` : `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return lang === 'kr' ? `${h}시간 전` : lang === 'mn' ? `${h} цагийн өмнө` : `${h}h ago`
  const day = Math.floor(h / 24)
  if (day < 30) return lang === 'kr' ? `${day}일 전` : lang === 'mn' ? `${day} өдрийн өмнө` : `${day}d ago`
  return d.toLocaleDateString(lang === 'kr' ? 'ko' : lang === 'mn' ? 'mn' : 'en')
}

// Does this Firestore blog post mention any of the destination's names?
// We do case-insensitive substring matching in title + content against the
// destination's KR/EN/MN names (and EN fallback for province if present).
function blogMentionsLocation(blog, loc) {
  const names = [
    loc?.name?.kr, loc?.name?.en, loc?.name?.mn,
    typeof loc?.name === 'string' ? loc.name : null,
    loc?.province,
  ].filter(Boolean).map(s => s.toLowerCase())
  if (names.length === 0) return false
  const haystack = `${blog.title ?? ''} ${blog.content ?? ''}`.toLowerCase()
  return names.some(n => n.length >= 2 && haystack.includes(n))
}

export default function ExploreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [allBlogs, setAllBlogs] = useState([])

  useEffect(() => {
    if (!user || !db) return
    getDoc(doc(db, 'users', user.uid, 'savedPlaces', id))
      .then(snap => setLiked(snap.exists()))
      .catch(() => {})
  }, [user, id])

  // Subscribe to all Firestore blog posts so we can show ones that mention
  // THIS destination as "Traveler Reviews". Firestore can't do substring
  // queries, so we fetch + filter client-side; fine for tens-to-hundreds
  // of posts which is the realistic capstone scale.
  useEffect(() => {
    if (!db) return
    const q = fbQuery(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      snap => setAllBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      () => {}
    )
    return () => unsub()
  }, [])

  const toggleLike = async () => {
    if (!user || !db) { setLiked(p => !p); return }
    const ref = doc(db, 'users', user.uid, 'savedPlaces', id)
    if (liked) {
      await deleteDoc(ref).catch(() => {})
    } else {
      await setDoc(ref, { locationId: id, savedAt: serverTimestamp() }).catch(() => {})
    }
    setLiked(p => !p)
  }

  const [activeTab, setActiveTab] = useState('intro')

  // Find in main locations (numeric ID) OR museums (string ID like 'mus-arkhangai' / 'ub-3')
  const numericId = Number(id)
  const loc =
    locations.find(l => l.id === numericId) ||
    museums.find(m => m.id === id)
  if (!loc) return <div className="p-8 text-center text-gray-400">{tr('no_results')}</div>

  // Related: same category, exclude self. For museums, show other museums.
  const pool = loc.type === 'museum' ? museums : locations
  const related = pool.filter(l => l.id !== loc.id && l.category === loc.category).slice(0, 3)

  // Real Wikipedia photo (fallback: loc.image placeholder while loading or if no Wiki page)
  const heroImage = useWikiImage(loc.wikiTitle, loc.image)

  const TABS = [
    { key: 'intro',     label: { kr: '소개',   en: 'About',      mn: 'Тойм'     } },
    { key: 'transport', label: { kr: '교통',   en: 'Transport',  mn: 'Тээвэр'   } },
    { key: 'info',      label: { kr: '정보',   en: 'Info',       mn: 'Мэдээлэл' } },
    { key: 'review',    label: { kr: '후기',   en: 'Reviews',    mn: 'Сэтгэгдэл'} },
  ]

  const transport = getTransportForLoc(loc)

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      {/* Hero */}
      <div className="relative h-64 flex-shrink-0">
        <img src={heroImage} alt={loc.name[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={toggleLike}
              className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${
                liked ? 'bg-red-500' : 'bg-black/30'
              }`}
            >
              <Heart size={16} className={`${liked ? 'fill-white text-white' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {loc.tags[lang].map(tag => (
              <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/25 font-medium">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-white text-xl font-black leading-tight mb-1 drop-shadow">{loc.name[lang]}</h1>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white text-sm font-bold">{loc.rating}</span>
            <span className="text-white/50 text-xs ml-1">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* 탭 */}
        <div className="bg-white border-b border-gray-100 flex">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-xs font-semibold relative transition-all ${
                activeTab === t.key ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {t.label[lang]}
              {activeTab === t.key && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 소개 탭 */}
        {activeTab === 'intro' && (
          <>
            {/* 여행 정보 3개 */}
            <div className="bg-white mt-2 px-4 py-3 flex justify-around">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-0.5">
                  {lang === 'kr' ? '최적 여행 시기' : lang === 'en' ? 'Best Season' : 'Хамгийн сайн цаг'}
                </p>
                <p className="text-xs font-bold text-gray-800">{loc.season[lang]}</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-0.5">
                  {lang === 'kr' ? '여행 기간' : lang === 'en' ? 'Duration' : 'Хугацаа'}
                </p>
                <p className="text-xs font-bold text-gray-800">{loc.duration[lang]}</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-0.5">
                  {lang === 'kr' ? '난이도' : lang === 'en' ? 'Difficulty' : 'Хүнд хэцүү'}
                </p>
                <p className="text-xs font-bold text-primary">
                  {loc.difficulty?.[lang] ?? (lang === 'kr' ? '쉬움' : lang === 'en' ? 'Easy' : 'Хялбар')}
                </p>
              </div>
            </div>

            {/* 설명 */}
            <div className="bg-white mt-2 px-4 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">{loc.description[lang]}</p>
            </div>

            {/* Traveler Reviews — pulled from Firestore blog posts that mention this destination */}
            {(() => {
              const matchedBlogs = allBlogs.filter(b => blogMentionsLocation(b, loc))
              return (
                <div className="bg-white mt-2 px-4 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-black text-gray-900">
                      {lang === 'kr' ? '다른 여행자 후기' : lang === 'en' ? 'Traveler Reviews' : 'Аялагчдын сэтгэгдэл'}
                    </h2>
                    {matchedBlogs.length > 0 && (
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {matchedBlogs.length}{lang === 'kr' ? '개' : ''}
                      </span>
                    )}
                  </div>

                  {matchedBlogs.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <div className="text-3xl mb-2">💬</div>
                      <p className="text-xs font-semibold">
                        {lang === 'kr' ? '아직 작성된 후기가 없어요' : lang === 'en' ? 'No reviews yet' : 'Одоогоор сэтгэгдэл байхгүй'}
                      </p>
                      <button
                        onClick={() => navigate('/write')}
                        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full active:scale-95 transition-transform"
                      >
                        {lang === 'kr' ? '첫 후기 쓰기' : lang === 'en' ? 'Write the first review' : 'Эхний сэтгэгдэл үлдээх'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {matchedBlogs.slice(0, 6).map(b => {
                        const created = b.createdAt?.toDate?.()
                        const initial = (b.authorName || b.authorEmail || '?').trim()[0]?.toUpperCase() || '?'
                        return (
                          <button
                            key={b.id}
                            onClick={() => navigate(`/post/${b.id}`)}
                            className="w-full text-left bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all rounded-2xl p-3 flex gap-3"
                          >
                            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-black text-primary">{initial}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-bold text-gray-800 truncate">
                                  {b.authorName || 'Traveler'}
                                </span>
                                <span className="text-[10px] text-gray-400 flex-shrink-0">
                                  {reviewTimeAgo(created, lang)}
                                </span>
                              </div>
                              {b.title && (
                                <p className="text-xs font-bold text-gray-900 line-clamp-1">{b.title}</p>
                              )}
                              {b.content && (
                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                                  {b.content}
                                </p>
                              )}
                            </div>
                          </button>
                        )
                      })}
                      {matchedBlogs.length > 6 && (
                        <button
                          onClick={() => navigate('/blog')}
                          className="w-full text-center text-[11px] text-primary font-semibold py-2"
                        >
                          {lang === 'kr' ? `+ ${matchedBlogs.length - 6}개 더 보기` : lang === 'en' ? `+ ${matchedBlogs.length - 6} more` : `+ ${matchedBlogs.length - 6} ширхэг`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}
          </>
        )}

        {/* 교통 탭 */}
        {activeTab === 'transport' && (
          <div className="mt-2 px-4 py-4 space-y-3">
            {/* UB 기준 안내 */}
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={13} className="text-primary flex-shrink-0" />
              <p className="text-[11px] text-gray-400">
                {lang === 'kr' ? '울란바토르(UB) 기준 이동 방법' : lang === 'en' ? 'How to get there from Ulaanbaatar' : 'Улаанбаатараас хэрхэн очих'}
              </p>
            </div>

            {transport ? transport.options.map((opt, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                {/* 헤더 */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900">{opt.mode[lang] ?? opt.mode.en}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock size={11} className="text-primary" />
                        {opt.time[lang] ?? opt.time.en}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <span className="text-primary font-bold text-[11px]">₮</span>
                        {opt.cost[lang] ?? opt.cost.en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 메모 */}
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  {opt.note[lang] ?? opt.note.en}
                </p>

                {/* 관련 사이트 링크 */}
                {opt.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {opt.links.map(link => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary text-[11px] font-bold rounded-full border border-primary/20 active:scale-95 transition-transform"
                      >
                        🔗 {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400">
                <p className="text-2xl mb-2">🚧</p>
                <p className="text-xs">
                  {lang === 'kr' ? '교통 정보 준비 중' : lang === 'en' ? 'Transport info coming soon' : 'Тээврийн мэдээлэл удахгүй'}
                </p>
              </div>
            )}

            {/* 일반 팁 */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
              <p className="text-xs font-black text-amber-800 mb-2">
                {lang === 'kr' ? '💡 몽골 교통 팁' : lang === 'en' ? '💡 Mongolia Travel Tips' : '💡 Монголын тээврийн зөвлөмж'}
              </p>
              <ul className="space-y-1.5">
                {(lang === 'kr' ? [
                  '지방 이동 시 4WD(포르곤) 지프가 표준 교통수단입니다.',
                  '몽골 도로 70%는 비포장 — 이동 시간 여유 있게 잡으세요.',
                  '항공권은 성수기(6~9월) 최소 2주 전 예약 권장.',
                  '현금(투그릭) 준비 필수 — 지방 지역 카드 불가.',
                ] : lang === 'en' ? [
                  '4WD jeeps (Furgon) are the standard vehicle for rural travel.',
                  '70% of Mongolian roads are unpaved — allow extra travel time.',
                  'Book flights 2+ weeks ahead in peak season (Jun–Sep).',
                  'Carry cash (Tögrög) — card payment unavailable in remote areas.',
                ] : [
                  'Хөдөөд явахдаа 4WD (Фургон) жип стандарт тээвэр.',
                  'Монголын замын 70% нь хайрган — нэмэлт цаг тооцоорой.',
                  'Онгоцны тийз оргил улиралд (6–9 сар) 2 долоо хоногийн өмнө захиалаарай.',
                  'Бэлэн мөнгө (Төгрөг) авч явах шаардлагатай — хөдөөд карт хүлээж авдаггүй.',
                ]).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-amber-700">
                    <span className="text-amber-400 mt-0.5 flex-shrink-0">✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 정보 탭 */}
        {activeTab === 'info' && (
          <div className="bg-white mt-2 px-4 py-4 space-y-3">
            {[
              { icon: Calendar, label: lang === 'kr' ? '최적 시기' : 'Best Season', value: loc.season[lang] },
              { icon: Clock, label: lang === 'kr' ? '여행 기간' : 'Duration', value: loc.duration[lang] },
              { icon: MapPin, label: lang === 'kr' ? '위치' : 'Location', value: `${loc.lat.toFixed(2)}°N, ${loc.lng.toFixed(2)}°E` },
              { icon: Star, label: lang === 'kr' ? '평점' : 'Rating', value: `${loc.rating} / 5.0` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <Icon size={16} className="text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400">{label}</p>
                  <p className="text-xs font-bold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 블로거/후기 탭 placeholder */}
        {(activeTab === 'blogger' || activeTab === 'review') && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">{lang === 'kr' ? '준비 중입니다' : lang === 'en' ? 'Coming soon' : 'Удахгүй'}</p>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-2 bg-white px-4 pt-4 pb-4">
            <h2 className="text-sm font-black text-gray-900 mb-3">{tr('detail_related')}</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {related.map(r => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/explore/${r.id}`)}
                  className="flex-shrink-0 w-32 cursor-pointer"
                >
                  <div className="relative h-20 rounded-xl overflow-hidden mb-1.5">
                    <img src={r.image} alt={r.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded-full">
                      <Star size={8} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-[9px] font-bold">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{r.name[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 고정 하단 버튼 */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
        <button
          onClick={() => navigate('/planner')}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 active:scale-95 transition-all"
        >
          <Plus size={16} />
          {lang === 'kr' ? '여행 계획에 추가' : lang === 'en' ? 'Add to Travel Plan' : 'Аяллын төлөвлөгөөнд нэмэх'}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
