import { useState, useEffect, useRef } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { provinceLocations } from '../../data/provinceLocations'
import { getProvinceImage } from '../../data/provinceImages'
import { Star, Clock, CalendarDays, MapPin, Search, X, ChevronRight, Sparkles, Layers, CheckCircle2 } from 'lucide-react'

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const categoryColors = { nature: '#22c55e', culture: '#3b82f6', activity: '#f97316' }
const categoryEmoji = { nature: '🏔️', culture: '🏛️', activity: '🐎' }
const chipEmoji = { all: '🌍', nature: '🏔️', culture: '🏛️', activity: '🐎' }

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  clickableIcons: false,
  styles: [
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ],
}

function makeIcon(color, size, ring = false) {
  const h = Math.round(size * 1.25)
  const r = ring ? `<circle cx="18" cy="18" r="14" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>` : ''
  const svg = `<svg width="${size}" height="${h}" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
    <circle cx="18" cy="18" r="11" fill="white"/>
    <circle cx="18" cy="18" r="7" fill="${color}"/>
    ${r}
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

function makeProvinceIcon(selected) {
  const color = selected ? '#7c3aed' : '#8b5cf6'
  const size = selected ? 28 : 20
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="11" cy="11" r="4" fill="white"/>
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

function makeMuseumIcon(selected) {
  const color = selected ? '#b45309' : '#f59e0b'
  const size = selected ? 28 : 22
  // Square shape with rounded corners to differentiate from circular province dots
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="18" height="16" rx="2" fill="${color}" stroke="white" stroke-width="2"/>
    <rect x="6" y="9" width="2" height="6" fill="white"/>
    <rect x="10" y="9" width="2" height="6" fill="white"/>
    <rect x="14" y="9" width="2" height="6" fill="white"/>
    <polygon points="2,5 11,1 20,5" fill="${color}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

const CATEGORIES = [
  { key: 'all',      label: { kr: '전체',    en: 'All',      mn: 'Бүгд' } },
  { key: 'nature',   label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль' } },
  { key: 'culture',  label: { kr: '문화',    en: 'Culture',  mn: 'Соёл' } },
  { key: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл ажиллагаа' } },
]

export default function DesktopMap() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const mapRef = useRef(null)

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [showProvince, setShowProvince] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [activeMarkerId, setActiveMarkerId] = useState(null)
  const [hoverMarkerId, setHoverMarkerId] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [userLocation, setUserLocation] = useState(null)

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GMAPS_KEY })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [])

  const REGION_MAP = {
    ub: 'ub', gobi: 'omngov', terelj: 'tuv', khuvsgul: 'khuvsgul',
    kharkhorin: 'ovorkh', orkhon: 'ovorkh', bayan: 'bayanolgii',
  }

  const PROVINCE_TO_REGION = {
    'Архангай': 'arkhangai', 'Баян-Өлгий': 'bayanolgii', 'Баянхонгор': 'bayankh',
    'Булган': 'bulgan', 'Говь-Алтай': 'govaltai', 'Говьсүмбэр': 'govsumb',
    'Дархан-Уул': 'darkhan', 'Дорноговь': 'dorngov', 'Дорнод': 'dornod',
    'Дундговь': 'dundgov', 'Завхан': 'zavkhan', 'Орхон': 'orkhon',
    'Өвөрхангай': 'ovorkh', 'Өмнөговь': 'omngov', 'Ховд': 'khovd',
    'Увс': 'uvs', 'Хөвсгөл': 'khuvsgul', 'Сэлэнгэ': 'selenge',
    'Сүхбаатар': 'sukhbaatar', 'Хэнтий': 'khentii', 'Төв': 'tuv',
  }

  const REGIONS = [
    { key: 'all',        label: { kr: '전체',          en: 'All',              mn: 'Бүгд'         }, emoji: '🌍' },
    { key: 'ub',         label: { kr: '울란바토르',     en: 'Ulaanbaatar',      mn: 'Улаанбаатар'  }, emoji: '🏙️' },
    { key: 'khuvsgul',   label: { kr: '홉스골',         en: 'Khuvsgul',         mn: 'Хөвсгөл'      }, emoji: '💙' },
    { key: 'omngov',     label: { kr: '남고비',          en: 'Omnogovi',        mn: 'Өмнөговь'     }, emoji: '🏜️' },
    { key: 'tuv',        label: { kr: '중부 (테를지)',   en: 'Tuv (Terelj)',     mn: 'Төв'          }, emoji: '🏕️' },
    { key: 'ovorkh',     label: { kr: '오브르항가이',    en: 'Uvurkhangai',     mn: 'Өвөрхангай'   }, emoji: '🏛️' },
    { key: 'bayanolgii', label: { kr: '바얀-울기',       en: 'Bayan-Ulgii',     mn: 'Баян-Өлгий'   }, emoji: '🦅' },
    { key: 'arkhangai',  label: { kr: '아르항가이',      en: 'Arkhangai',       mn: 'Архангай'     }, emoji: '🏔️' },
    { key: 'orkhon',     label: { kr: '오르홍',          en: 'Orkhon',          mn: 'Орхон'        }, emoji: '🏭' },
    { key: 'uvs',        label: { kr: '우브스',          en: 'Uvs',             mn: 'Увс'          }, emoji: '🌊' },
    { key: 'bayankh',    label: { kr: '바양홍고르',      en: 'Bayankhongor',    mn: 'Баянхонгор'   }, emoji: '🏜️' },
    { key: 'bulgan',     label: { kr: '불간',            en: 'Bulgan',          mn: 'Булган'       }, emoji: '🌲' },
    { key: 'govaltai',   label: { kr: '고비-알타이',     en: 'Govi-Altai',      mn: 'Говь-Алтай'   }, emoji: '🏔️' },
    { key: 'govsumb',    label: { kr: '고비숨버르',      en: 'Govisumber',      mn: 'Говьсүмбэр'   }, emoji: '🌄' },
    { key: 'darkhan',    label: { kr: '다르항-울',       en: 'Darkhan-Uul',     mn: 'Дархан-Уул'   }, emoji: '🏭' },
    { key: 'dorngov',    label: { kr: '동고비',          en: 'Dornogovi',       mn: 'Дорноговь'    }, emoji: '🌅' },
    { key: 'dornod',     label: { kr: '동부',            en: 'Dornod',          mn: 'Дорнод'       }, emoji: '🌅' },
    { key: 'dundgov',    label: { kr: '중앙고비',        en: 'Dundgovi',        mn: 'Дундговь'     }, emoji: '🗿' },
    { key: 'zavkhan',    label: { kr: '자브항',          en: 'Zavkhan',         mn: 'Завхан'       }, emoji: '❄️' },
    { key: 'sukhbaatar', label: { kr: '수흐바타르',      en: 'Sukhbaatar',      mn: 'Сүхбаатар'   }, emoji: '🌾' },
    { key: 'selenge',    label: { kr: '셀렝게',          en: 'Selenge',         mn: 'Сэлэнгэ'      }, emoji: '💧' },
    { key: 'khovd',      label: { kr: '호브드',          en: 'Khovd',           mn: 'Ховд'         }, emoji: '🏔️' },
    { key: 'khentii',    label: { kr: '헨티',            en: 'Khentii',         mn: 'Хэнтий'       }, emoji: '🌿' },
  ]

  const filtered = locations.filter(loc => {
    const matchCat = filter === 'all' || loc.category === filter
    const matchRegion = region === 'all' || REGION_MAP[loc.region] === region
    const matchSearch = !search ||
      loc.name.kr.toLowerCase().includes(search.toLowerCase()) ||
      loc.name.en.toLowerCase().includes(search.toLowerCase()) ||
      loc.name.mn.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchRegion && matchSearch
  })

  const filteredProvinceLocations = region === 'all'
    ? []
    : provinceLocations.filter(loc => PROVINCE_TO_REGION[loc.province] === region)

  const isSelected = id => selectedItems.some(i => i.id === id)

  const toggleItem = item => {
    mapRef.current?.panTo({ lat: item.lat, lng: item.lng })
    mapRef.current?.setZoom(9)
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    )
  }

  const removeItem = id => setSelectedItems(prev => prev.filter(i => i.id !== id))

  const goToPlanner = () => {
    const names = selectedItems.map(i => i.name).join(',')
    navigate(`/planner?locations=${encodeURIComponent(names)}`)
  }

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-white">

      {/* ── Left panel ── */}
      <aside className="w-96 flex-shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-hidden">

        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-black text-gray-900 mb-4">{tr('map_title')}</h1>

          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 mb-3">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tr('map_search')}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {search && <button onClick={() => setSearch('')}><X size={14} className="text-gray-400 hover:text-gray-600" /></button>}
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setFilter(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === cat.key ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat.label[lang]}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                <MapPin size={12} className="text-primary" />
                {lang === 'kr' ? '지역 (아이막)' : lang === 'en' ? 'Region (Aimag)' : 'Аймаг'}
              </p>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">
                {REGIONS.filter(r => r.key !== 'all').length}
              </span>
            </div>
            <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
              {REGIONS.map(r => (
                <button
                  key={r.key}
                  onClick={() => setRegion(r.key)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    region === r.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-white hover:text-primary'
                  }`}
                >
                  <span className="text-sm leading-none">{r.emoji}</span>
                  <span className={r.key === 'all' ? 'font-black' : ''}>{r.label[lang]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowProvince(p => !p)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              showProvince ? 'bg-violet-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers size={13} />
            {showProvince
              ? (lang === 'kr' ? '🗺️ 아이막 명소 숨기기' : lang === 'mn' ? 'Аймгийн газрууд нуух' : 'Hide Province Sites')
              : (lang === 'kr' ? '🗺️ 아이막 명소 보기'   : lang === 'mn' ? 'Аймгийн газрууд харах' : 'Show Province Sites')}
          </button>
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && filteredProvinceLocations.length === 0 ? (
            <div className="text-center py-10 px-5">
              <p className="text-gray-400 text-sm">{lang === 'kr' ? '검색 결과가 없습니다' : lang === 'en' ? 'No results found' : 'Үр дүн олдсонгүй'}</p>
            </div>
          ) : (
            <>
              {filtered.map(loc => {
                const sel = isSelected(loc.id)
                return (
                  <div
                    key={loc.id}
                    onClick={() => { toggleItem({ id: loc.id, name: loc.name[lang], lat: loc.lat, lng: loc.lng, province: null }); setActiveMarkerId(`loc-${loc.id}`) }}
                    className={`group flex gap-3 p-4 cursor-pointer border-b border-gray-50 transition-all ${
                      sel ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={loc.image} alt={loc.name[lang]} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs"
                        style={{ backgroundColor: categoryColors[loc.category] || '#3B6FF0' }}>
                        {sel ? <CheckCircle2 size={12} className="text-white" /> : <span>{categoryEmoji[loc.category] || '📍'}</span>}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <h3 className={`text-sm font-bold leading-tight line-clamp-1 transition-colors ${sel ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                          {loc.name[lang]}
                        </h3>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">{loc.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-1.5">{loc.description[lang]}</p>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="flex items-center gap-0.5"><Clock size={10} /><span className="text-[10px]">{loc.duration[lang]}</span></div>
                        <span className="text-gray-200">·</span>
                        <div className="flex items-center gap-0.5"><CalendarDays size={10} /><span className="text-[10px]">{loc.season[lang]}</span></div>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/explore/${loc.id}`) }}
                      className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                )
              })}

              {filteredProvinceLocations.length > 0 && (
                <>
                  {filtered.length > 0 && (
                    <div className="px-4 py-2 bg-violet-50 border-y border-violet-100">
                      <p className="text-[11px] font-bold text-violet-600">
                        🗺️ {lang === 'kr' ? '아이막 명소' : lang === 'mn' ? 'Аймгийн газрууд' : 'Province Sites'}
                      </p>
                    </div>
                  )}
                  {filteredProvinceLocations.map(loc => {
                    const sel = isSelected(loc.id)
                    return (
                      <div
                        key={loc.id}
                        onClick={() => { toggleItem({ id: loc.id, name: loc.name, lat: loc.lat, lng: loc.lng, province: loc.province }); setActiveMarkerId(`prov-${loc.id}`) }}
                        className={`group flex gap-3 p-4 cursor-pointer border-b border-gray-50 transition-all ${
                          sel ? 'bg-violet-50 border-l-2 border-l-violet-500' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img src={getProvinceImage(loc)} alt={loc.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs bg-violet-500">
                            {sel ? <CheckCircle2 size={12} className="text-white" /> : <span className="text-white text-[8px]">📍</span>}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-bold leading-tight line-clamp-1 transition-colors ${sel ? 'text-violet-600' : 'text-gray-900 group-hover:text-violet-600'}`}>
                            {loc.name}
                          </h3>
                          <p className="text-[10px] text-violet-500 font-medium mt-0.5">{loc.province} аймаг</p>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </>
          )}
        </div>

        {/* Selected panel */}
        {selectedItems.length > 0 && (
          <div className="flex-shrink-0 border-t-2 border-primary/20 bg-white">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="text-xs font-black text-gray-900">
                📍 {lang === 'kr' ? '선택한 장소' : lang === 'mn' ? 'Сонгосон газрууд' : 'Selected'}{' '}
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white rounded-full text-[10px]">{selectedItems.length}</span>
              </span>
              <button onClick={() => setSelectedItems([])} className="text-[10px] text-gray-400 hover:text-red-400 transition-colors">
                {lang === 'kr' ? '전체 해제' : lang === 'mn' ? 'Бүгдийг цуцлах' : 'Clear all'}
              </button>
            </div>
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedItems.map(item => (
                <span key={item.id} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                  <span className="truncate max-w-[120px]">{item.name}</span>
                  <button onClick={() => removeItem(item.id)} className="flex-shrink-0 hover:text-red-500 transition-colors"><X size={11} /></button>
                </span>
              ))}
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={goToPlanner}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Sparkles size={15} />
                {lang === 'kr' ? `${selectedItems.length}곳 AI 일정 만들기` : lang === 'mn' ? `${selectedItems.length} газрын AI төлөвлөгөө` : `Plan ${selectedItems.length} locations with AI`}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── Google Map ── */}
      <div
        className="flex-1 relative"
        onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setHoverMarkerId(null)}
      >
        {/* Floating category quick-filter chips (Google Maps style) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-100 px-2 py-1.5">
          {CATEGORIES.map(c => {
            const active = filter === c.key
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm leading-none">{chipEmoji[c.key]}</span>
                {c.label[lang]}
              </button>
            )
          })}
        </div>

        {/* Custom hover tooltip — pointerEvents:none so it never blocks map clicks */}
        {hoverMarkerId && (() => {
          const isLoc = hoverMarkerId.startsWith('loc-')
          const isProv = hoverMarkerId.startsWith('prov-')
          const locData = isLoc ? filtered.find(l => `loc-${l.id}` === hoverMarkerId) : null
          const provData = isProv ? provinceLocations.find(l => `prov-${l.id}` === hoverMarkerId) : null
          if (!locData && !provData) return null
          const imgSrc = locData ? locData.image : getProvinceImage(provData)
          return (
            <div
              className="fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
              style={{
                left: mousePos.x + 18,
                top: Math.max(80, mousePos.y - 140),
                width: '220px',
                pointerEvents: 'none',
              }}
            >
              <img src={imgSrc} alt="" className="w-full h-28 object-cover" style={{ display: 'block' }} />
              <div className="p-2.5">
                {locData && (
                  <>
                    <p className="text-[10px] font-bold mb-0.5" style={{ color: categoryColors[locData.category] || '#3B6FF0' }}>
                      {categoryEmoji[locData.category]}{' '}
                      {locData.category === 'nature' ? (lang === 'kr' ? '자연' : lang === 'mn' ? 'Байгаль' : 'Nature')
                        : locData.category === 'culture' ? (lang === 'kr' ? '문화' : lang === 'mn' ? 'Соёл' : 'Culture')
                        : (lang === 'kr' ? '액티비티' : lang === 'mn' ? 'Үйл ажиллагаа' : 'Activity')}
                    </p>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{locData.name[lang]}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-700">{locData.rating}</span>
                      <span className="text-gray-300">·</span>
                      <span>{locData.duration[lang]}</span>
                    </div>
                  </>
                )}
                {provData && (
                  <>
                    <p className="text-[10px] text-violet-500 font-bold mb-0.5">{provData.province} аймаг</p>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{provData.name}</h3>
                  </>
                )}
                <p className="text-[10px] text-gray-400 mt-1.5">
                  👆 {lang === 'kr' ? '클릭하여 선택' : lang === 'en' ? 'Click to select' : 'Дарж сонгоно уу'}
                </p>
              </div>
            </div>
          )
        })()}

        {!isLoaded ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={{ lat: 47.5, lng: 103.5 }}
            zoom={5}
            options={MAP_OPTIONS}
            onLoad={map => { mapRef.current = map }}
            onClick={() => { setActiveMarkerId(null); setHoverMarkerId(null) }}
          >
            {/* User location */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
              />
            )}

            {/* Province markers */}
            {showProvince && provinceLocations.map(loc => (
              <Marker
                key={`prov-${loc.id}`}
                position={{ lat: loc.lat, lng: loc.lng }}
                icon={loc.type === 'museum' ? makeMuseumIcon(isSelected(loc.id)) : makeProvinceIcon(isSelected(loc.id))}
                onClick={() => { toggleItem({ id: loc.id, name: loc.name, lat: loc.lat, lng: loc.lng, province: loc.province }); setActiveMarkerId(`prov-${loc.id}`); setHoverMarkerId(null) }}
                onMouseOver={() => setHoverMarkerId(`prov-${loc.id}`)}
                onMouseOut={() => setHoverMarkerId(null)}
              >
                {activeMarkerId === `prov-${loc.id}` && (
                  <InfoWindow onCloseClick={() => setActiveMarkerId(null)}>
                    <div className="min-w-[180px] font-sans">
                      <img src={getProvinceImage(loc)} alt={loc.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <p className="text-[10px] text-violet-600 font-semibold mb-0.5">{loc.province} аймаг</p>
                      <h3 className="font-bold text-gray-900 text-sm">{loc.name}</h3>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}

            {/* Main location markers */}
            {filtered.map(loc => (
              <Marker
                key={`loc-${loc.id}`}
                position={{ lat: loc.lat, lng: loc.lng }}
                icon={makeIcon(categoryColors[loc.category] || '#3B6FF0', isSelected(loc.id) ? 44 : 36, isSelected(loc.id))}
                onClick={() => { toggleItem({ id: loc.id, name: loc.name[lang], lat: loc.lat, lng: loc.lng, province: null }); setActiveMarkerId(`loc-${loc.id}`); setHoverMarkerId(null) }}
                onMouseOver={() => setHoverMarkerId(`loc-${loc.id}`)}
                onMouseOut={() => setHoverMarkerId(null)}
              >
                {activeMarkerId === `loc-${loc.id}` && (
                  <InfoWindow onCloseClick={() => setActiveMarkerId(null)}>
                    <div className="min-w-[200px] font-sans">
                      <img src={loc.image} alt={loc.name[lang]} className="w-full h-28 object-cover rounded-lg mb-2" />
                      <h3 className="font-bold text-gray-900 text-sm">{loc.name[lang]}</h3>
                      <div className="flex items-center gap-1 mt-0.5 mb-2">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold">{loc.rating}</span>
                        <span className="text-gray-300 mx-1">·</span>
                        <span className="text-xs text-gray-500">{loc.duration[lang]}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => navigate(`/explore/${loc.id}`)}
                          className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">
                          {lang === 'kr' ? '자세히' : lang === 'en' ? 'Details' : 'Дэлгэрэнгүй'}
                        </button>
                        <button
                          onClick={() => toggleItem({ id: loc.id, name: loc.name[lang], lat: loc.lat, lng: loc.lng, province: null })}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isSelected(loc.id) ? 'bg-red-50 text-red-500' : 'bg-primary text-white'
                          }`}
                        >
                          {isSelected(loc.id) ? (lang === 'kr' ? '해제' : 'Remove') : (lang === 'kr' ? '+ 선택' : '+ Select')}
                        </button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        )}

        {/* Legend */}
        <div className="absolute bottom-8 right-4 bg-white rounded-2xl shadow-lg p-4 z-10">
          <p className="text-xs font-bold text-gray-700 mb-2">{lang === 'kr' ? '범례' : lang === 'en' ? 'Legend' : 'Тайлбар'}</p>
          {[
            { cat: 'nature',   label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль' } },
            { cat: 'culture',  label: { kr: '문화',    en: 'Culture',  mn: 'Соёл' } },
            { cat: 'activity', label: { kr: '액티비티', en: 'Activity', mn: 'Үйл' } },
          ].map(({ cat, label }) => (
            <div key={cat} className="flex items-center gap-2 mt-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
              <span className="text-xs text-gray-600">{label[lang]}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#8b5cf6' }} />
            <span className="text-xs text-gray-600">{lang === 'kr' ? '명소' : lang === 'en' ? 'Sites' : 'Дурсгал'}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-xs text-gray-600">{lang === 'kr' ? '박물관' : lang === 'en' ? 'Museum' : 'Музей'}</span>
          </div>
        </div>

        {/* Hint */}
        {selectedItems.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm z-10 pointer-events-none">
            <MapPin size={12} className="inline mr-1.5" />
            {lang === 'kr' ? '마커를 클릭해 여러 장소를 선택하세요' : lang === 'en' ? 'Click markers to select locations' : 'Маркер дарж газар сонгоно уу'}
          </div>
        )}
      </div>
    </div>
  )
}
