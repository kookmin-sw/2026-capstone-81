import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Calendar, Heart, Share2, MapPin, Sparkles, Plus } from 'lucide-react'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { locations } from '../data/locations'
import BottomNav from '../components/BottomNav'

export default function ExploreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!user || !db) return
    getDoc(doc(db, 'users', user.uid, 'savedPlaces', id))
      .then(snap => setLiked(snap.exists()))
      .catch(() => {})
  }, [user, id])

  const toggleLike = async () => {
    if (!user || !db) { setLiked(p => !p); return }
    const ref = doc(db, 'users', user.uid, 'savedPlaces', id)
    if (liked) {
      await deleteDoc(ref).catch(() => {})
    } else {
      await setDoc(ref, { locationId: Number(id), savedAt: serverTimestamp() }).catch(() => {})
    }
    setLiked(p => !p)
  }

  const [activeTab, setActiveTab] = useState('intro')

  const loc = locations.find(l => l.id === Number(id))
  if (!loc) return <div className="p-8 text-center text-gray-400">{tr('no_results')}</div>

  const related = locations.filter(l => l.id !== loc.id && l.category === loc.category).slice(0, 3)

  const TABS = [
    { key: 'intro',    label: { kr: '소개',   en: 'About',   mn: 'Тойм'   } },
    { key: 'blogger',  label: { kr: '블로거', en: 'Bloggers',mn: 'Блогер' } },
    { key: 'info',     label: { kr: '정보',   en: 'Info',    mn: 'Мэдээлэл'} },
    { key: 'review',   label: { kr: '후기',   en: 'Reviews', mn: 'Сэтгэгдэл'} },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      {/* Hero */}
      <div className="relative h-64 flex-shrink-0">
        <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
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
                  {lang === 'kr' ? '쉬움' : lang === 'en' ? 'Easy' : 'Хялбар'}
                </p>
              </div>
            </div>

            {/* 설명 */}
            <div className="bg-white mt-2 px-4 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">{loc.description[lang]}</p>
            </div>

            {/* 다른 여행자 후기 */}
            <div className="bg-white mt-2 px-4 py-4">
              <h2 className="text-sm font-black text-gray-900 mb-3">
                {lang === 'kr' ? '다른 여행자 후기' : lang === 'en' ? 'Traveler Reviews' : 'Аялагчдын сэтгэгдэл'}
              </h2>
              {[
                { name: 'Traveler_J', time: lang === 'kr' ? '3일 전' : '3d ago', text: lang === 'kr' ? '정말 아름다운 곳이에요! 꼭 다시 오고 싶어요.' : 'Absolutely beautiful! Would love to visit again.' },
                { name: 'NomadMN', time: lang === 'kr' ? '1주일 전' : '1w ago', text: lang === 'kr' ? '몽골에서 가장 인상 깊었던 장소입니다.' : 'The most impressive place in Mongolia.' },
              ].map((r, i) => (
                <div key={i} className="flex gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-gray-800">{r.name}</span>
                      <span className="text-[10px] text-gray-400">{r.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
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
