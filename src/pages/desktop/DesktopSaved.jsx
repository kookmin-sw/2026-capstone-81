import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import { locations } from '../../data/locations'
import { watchTrips, deleteTrip } from '../../utils/trips'
import { Heart, Clock, CalendarDays, Star, Compass, Sparkles, Trash2, MapPin, Calendar } from 'lucide-react'

export default function DesktopSaved() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [savedLocations, setSavedLocations] = useState([])
  const [savedTrips, setSavedTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !db) { setLoading(false); return }
    getDocs(collection(db, 'users', user.uid, 'savedPlaces'))
      .then(snap => {
        const savedIds = snap.docs.map(doc => doc.data().locationId)
        const saved = locations.filter(loc => savedIds.includes(loc.id))
        setSavedLocations(saved)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  // Live subscription to the user's saved AI plans
  useEffect(() => {
    if (!user?.uid) { setSavedTrips([]); return }
    return watchTrips(user.uid, setSavedTrips)
  }, [user?.uid])

  const removeTrip = async (tripId) => {
    if (!user?.uid) return
    const ok = window.confirm(lang === 'kr' ? '이 일정을 삭제할까요?' : 'Delete this trip?')
    if (!ok) return
    try { await deleteTrip(user.uid, tripId) }
    catch (err) { console.error('[Saved] delete trip', err) }
  }

  const L = {
    kr: { title: '저장한 장소', sub: '찜한 여행지 목록', empty: '저장한 장소가 없습니다', emptyDesc: '여행지를 탐색하고 마음에 드는 곳을 저장해보세요', explore: '여행지 탐색하기' },
    en: { title: 'Saved Places', sub: 'Your saved destinations', empty: 'No saved places yet', emptyDesc: 'Explore destinations and save the ones you love', explore: 'Explore Destinations' },
    mn: { title: 'Хадгалсан газрууд', sub: 'Таны хадгалсан газрууд', empty: 'Хадгалсан газар байхгүй', emptyDesc: 'Газруудыг судалж, таалагдсан газрыг хадгалаарай', explore: 'Газрууд хайх' },
  }
  const l = L[lang] || L.en

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={22} className="text-red-500 fill-red-500" />
            <h1 className="text-2xl font-black text-gray-900">{l.title}</h1>
          </div>
          <p className="text-sm text-gray-500">{l.sub}</p>
        </div>

        {/* Saved AI Trip Plans */}
        {savedTrips.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-lg font-black text-gray-900">
                {lang === 'kr' ? '저장된 AI 일정' : lang === 'en' ? 'Saved AI Plans' : 'Хадгалсан AI хуваарь'}
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {savedTrips.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedTrips.map(t => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow group cursor-pointer"
                  onClick={() => navigate(`/trip/${t.id}`)}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900 line-clamp-2">{t.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={11} />
                        {t.departureCity || 'Ulaanbaatar'} · {t.days}{lang === 'kr' ? '일' : 'd'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeTrip(t.id) }}
                      aria-label="Delete"
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.budget && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{t.budget}</span>}
                    {t.pace && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{t.pace}</span>}
                    {t.groupType && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{t.groupType}</span>}
                    {t.accommodation && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{t.accommodation}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Places */}
        <div className="flex items-center gap-2 mb-3">
          <Heart size={18} className="text-red-500" />
          <h2 className="text-lg font-black text-gray-900">
            {lang === 'kr' ? '저장한 여행지' : lang === 'en' ? 'Saved Destinations' : 'Хадгалсан газрууд'}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            {lang === 'kr' ? '불러오는 중...' : lang === 'mn' ? 'Ачааллаж байна...' : 'Loading...'}
          </div>
        ) : savedLocations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={36} className="text-red-300" />
            </div>
            <p className="text-gray-700 font-bold text-lg mb-2">{l.empty}</p>
            <p className="text-gray-400 text-sm mb-8">{l.emptyDesc}</p>
            <button
              onClick={() => navigate('/explore')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-colors"
            >
              <Compass size={16} />
              {l.explore}
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5">
              {lang === 'kr' ? `총 ${savedLocations.length}개` : lang === 'mn' ? `Нийт ${savedLocations.length}` : `${savedLocations.length} places`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedLocations.map(loc => (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={loc.image}
                      alt={loc.name[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{loc.rating}</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Heart size={16} className="fill-red-400 text-red-400 drop-shadow" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      {loc.tags[lang].slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/30">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-gray-900 text-base mb-1 leading-tight">{loc.name[lang]}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{loc.description[lang]}</p>
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex items-center gap-1"><Clock size={11} /><span className="text-xs">{loc.duration[lang]}</span></div>
                      <div className="flex items-center gap-1"><CalendarDays size={11} /><span className="text-xs">{loc.season[lang]}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
