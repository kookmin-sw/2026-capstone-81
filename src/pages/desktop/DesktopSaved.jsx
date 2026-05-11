import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import { locations } from '../../data/locations'
import { Heart, Clock, CalendarDays, Star, Compass } from 'lucide-react'

export default function DesktopSaved() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [savedLocations, setSavedLocations] = useState([])
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
