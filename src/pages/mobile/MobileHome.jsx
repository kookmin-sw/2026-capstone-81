import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { locations } from '../../data/locations'
import { Search, Bell, SlidersHorizontal, Star, MapPin, Navigation, ChevronRight, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Droplets, Wind, ArrowUp, ArrowDown } from 'lucide-react'
import { NomadLogoIcon, NomadLogoText } from '../../components/NomadLogo'
import MobileLayout from './MobileLayout'

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const CAT_COLORS = { nature: '#22c55e', culture: '#3b82f6', activity: '#f97316' }

const MINI_MAP_OPTIONS = {
  disableDefaultUI: true,
  gestureHandling: 'none',
  clickableIcons: false,
  zoomControl: false,
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  ],
}

function makeMiniMarker(color) {
  const svg = `<svg width="20" height="25" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${color}"/>
    <circle cx="18" cy="18" r="9" fill="white"/>
  </svg>`
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` }
}

function wxCondMobile(code, lang) {
  const c = code === 0 ? 'clear' : code <= 3 ? 'cloudy' : code <= 48 ? 'fog' :
    code <= 67 ? 'rain' : code <= 77 ? 'snow' : code <= 82 ? 'showers' : 'storm'
  return ({ clear: { kr: '맑음', en: 'Sunny', mn: 'Цэлмэг' }, cloudy: { kr: '구름', en: 'Cloudy', mn: 'Үүлтэй' },
    fog: { kr: '안개', en: 'Foggy', mn: 'Манантай' }, rain: { kr: '비', en: 'Rainy', mn: 'Бороотой' },
    snow: { kr: '눈', en: 'Snowy', mn: 'Цастай' }, showers: { kr: '소나기', en: 'Showers', mn: 'Бороо' },
    storm: { kr: '천둥', en: 'Storm', mn: 'Аянга' } })[c]?.[lang] ?? 'Sunny'
}

function wxDayMobile(dateStr, lang) {
  const d = { kr: ['일','월','화','수','목','금','토'], en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], mn: ['Ням','Дав','Мяг','Лха','Пүр','Баа','Бям'] }
  return (d[lang] ?? d.en)[new Date(dateStr).getDay()]
}

function wxWindDirMobile(deg, lang) {
  const idx = Math.round(deg / 45) % 8
  return ([{ kr:'북',en:'N',mn:'Х'},{kr:'북동',en:'NE',mn:'ХЗ'},{kr:'동',en:'E',mn:'З'},{kr:'남동',en:'SE',mn:'ӨЗ'},
    {kr:'남',en:'S',mn:'Ө'},{kr:'남서',en:'SW',mn:'ӨБ'},{kr:'서',en:'W',mn:'Б'},{kr:'북서',en:'NW',mn:'ХБ'}])[idx]?.[lang] ?? 'N'
}

function WxIcon({ code, size = 32 }) {
  const yellow = 'text-yellow-300', blue = 'text-blue-200', gray = 'text-gray-300', rain = 'text-blue-300', snow = 'text-sky-100'
  const s = { size, strokeWidth: 1.5 }
  if (code === 0) return <Sun {...s} className={yellow} />
  if (code <= 3) return <Cloud {...s} className={blue} />
  if (code <= 48) return <Cloud {...s} className={gray} />
  if (code <= 67) return <CloudRain {...s} className={rain} />
  if (code <= 77) return <CloudSnow {...s} className={snow} />
  if (code <= 82) return <CloudRain {...s} className={rain} />
  if (code <= 86) return <CloudSnow {...s} className={snow} />
  return <CloudLightning {...s} className="text-yellow-200" />
}


const CAT_BADGE = {
  nature:   { label: { kr: '자연', en: 'Nature', mn: 'Байгаль'    }, bg: 'bg-emerald-500' },
  culture:  { label: { kr: '문화', en: 'Culture', mn: 'Соёл'      }, bg: 'bg-blue-500'    },
  activity: { label: { kr: '액티비티', en: 'Activity', mn: 'Адал явдал' }, bg: 'bg-orange-500' },
}

const REGION_LABEL = {
  mn: { khuvsgul: 'Хөвсгөл аймаг', gobi: 'Өмнөговь аймаг', terelj: 'Төв аймаг', ub: 'Улаанбаатар', kharkhorin: 'Өвөрхангай аймаг', orkhon: 'Орхон', bayan: 'Баян-Өлгий' },
  kr: { khuvsgul: '홉스골',        gobi: '남고비',           terelj: '투브 아이막', ub: '울란바토르',  kharkhorin: '오브르항가이',       orkhon: '오르홍', bayan: '바얀-울기'  },
  en: { khuvsgul: 'Khuvsgul aimag', gobi: 'Omnogovi aimag', terelj: 'Tuv aimag',  ub: 'Ulaanbaatar', kharkhorin: 'Uvurkhangai',       orkhon: 'Orkhon', bayan: 'Bayan-Ulgii' },
}

const MOCK_DIST    = { 1: 0,   2: 540, 3: 55, 4: 646, 5: 460, 6: 10, 7: 360, 8: 400 }
const MOCK_REVIEWS = { 1: 186, 2: 342, 3: 278, 4: 210, 5: 182, 6: 94, 7: 164, 8: 128 }


export default function MobileHome() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [weather, setWeather] = useState(null)

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GMAPS_KEY })

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=47.9077&longitude=106.9230' +
      '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code' +
      '&daily=temperature_2m_max,temperature_2m_min,weather_code' +
      '&timezone=Asia%2FUlaanbaatar&forecast_days=5'
    ).then(r => r.json()).then(d => {
      const c = d.current, day = d.daily
      setWeather({
        code: c.weather_code,
        temp: Math.round(c.temperature_2m),
        high: Math.round(day.temperature_2m_max[0]),
        low: Math.round(day.temperature_2m_min[0]),
        cond: wxCondMobile(c.weather_code, lang),
        windDir: wxWindDirMobile(c.wind_direction_10m, lang),
        windSpeed: Math.round(c.wind_speed_10m),
        humidity: c.relative_humidity_2m,
        forecast: day.time.slice(1, 5).map((t, i) => ({
          day: wxDayMobile(t, lang),
          code: day.weather_code[i + 1],
          high: Math.round(day.temperature_2m_max[i + 1]),
        })),
      })
    }).catch(() => {})
  }, [])

  const province = loc => (REGION_LABEL[lang] ?? REGION_LABEL.en)[loc.region] ?? loc.region

  const cards = locations.slice(0, 6)

  const firstName = user?.displayName?.split(' ')[0]

  return (
    <MobileLayout>
      <div className="bg-[#F8F9FB] pb-4">

        {/* ── 헤더 ── */}
        <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            {/* 중앙: 로고만 */}
            <button onClick={() => navigate('/home')} className="flex items-center gap-2">
              <NomadLogoIcon size={28} />
              <NomadLogoText className="text-lg" />
            </button>
          </div>

          {/* 인사 */}
          <div className="mb-3">
            <h2 className="text-[17px] font-black text-gray-900">
              {lang === 'mn'
                ? `Сайн уу, ${firstName ?? 'та'}! 👋`
                : lang === 'kr'
                ? `안녕하세요, ${firstName ?? '여행자'}! 👋`
                : `Hello, ${firstName ?? 'Traveler'}! 👋`}
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {lang === 'mn' ? 'Өнөөдөр хаашаа аялах төлөвтэй байна вэ?' :
               lang === 'kr' ? '오늘 어디로 떠나볼까요?' :
               'Where are you planning to go today?'}
            </p>
          </div>

          {/* 검색 + 필터 버튼 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(q.trim() ? `/explore?q=${encodeURIComponent(q)}` : '/explore')}
                placeholder={lang === 'mn' ? 'Хаана аялахыг хүсэж байна вэ?' : lang === 'kr' ? '어디로 가고 싶으세요?' : 'Where to go?'}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/30"
            >
              <SlidersHorizontal size={18} className="text-white" />
            </button>
          </div>

          {/* 빠른 진입: AI 일정 | 교통 찾기 | 몽골 필수 앱 */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => navigate('/planner')}
              className="bg-gradient-to-br from-primary to-emerald-400 rounded-2xl p-2.5 text-left active:scale-[0.97] transition-transform shadow-md shadow-primary/20"
            >
              <div className="text-xl mb-1">🤖</div>
              <p className="text-white font-black text-[11px] leading-tight">
                {lang === 'kr' ? 'AI 일정' : lang === 'en' ? 'AI Planner' : 'AI Төлөвлөгөө'}
              </p>
              <p className="text-white/75 text-[9px] leading-tight mt-0.5">
                {lang === 'kr' ? '맞춤 일정' : lang === 'en' ? 'Itinerary' : 'Хуваарь'}
              </p>
            </button>

            <button
              onClick={() => navigate('/transport')}
              className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-2.5 text-left active:scale-[0.97] transition-transform shadow-md shadow-blue-500/20"
            >
              <div className="text-xl mb-1">🚌</div>
              <p className="text-white font-black text-[11px] leading-tight">
                {lang === 'kr' ? '교통 찾기' : lang === 'en' ? 'Transport' : 'Тээвэр'}
              </p>
              <p className="text-white/75 text-[9px] leading-tight mt-0.5">
                {lang === 'kr' ? '버스·항공' : lang === 'en' ? 'Bus · Flight' : 'Автобус · Нислэг'}
              </p>
            </button>

            <button
              onClick={() => navigate('/apps')}
              className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-2.5 text-left active:scale-[0.97] transition-transform shadow-md shadow-indigo-500/20"
            >
              <div className="text-xl mb-1">📱</div>
              <p className="text-white font-black text-[11px] leading-tight">
                {lang === 'kr' ? '필수 앱' : lang === 'en' ? 'Apps' : 'Апп'}
              </p>
              <p className="text-white/75 text-[9px] leading-tight mt-0.5">
                {lang === 'kr' ? 'UBcab · QPay' : lang === 'en' ? 'UBcab · QPay' : 'UBcab · QPay'}
              </p>
            </button>
          </div>
        </div>

        {/* ── 미니 맵 (Google Maps) ── */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-md" style={{ height: 190 }}>
          {!isLoaded ? (
            <div className="w-full h-full bg-emerald-50 animate-pulse flex items-center justify-center">
              <MapPin size={24} className="text-primary/30" />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: 47.5, lng: 103.5 }}
                zoom={4}
                options={MINI_MAP_OPTIONS}
              >
                {locations.slice(0, 8).map(loc => (
                  <Marker
                    key={loc.id}
                    position={{ lat: loc.lat, lng: loc.lng }}
                    icon={makeMiniMarker(CAT_COLORS[loc.category] || '#2F855A')}
                  />
                ))}
              </GoogleMap>
              {/* Tap overlay → full map */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => navigate('/map')}
              />
              {/* Bottom label */}
              <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 py-2.5 px-4 flex items-center justify-between pointer-events-none">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin size={11} className="text-primary" />
                  {lang === 'mn' ? 'Газрын зурагийг харах' : lang === 'kr' ? '지도 탐색하기' : 'Explore Map'}
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* ── 날씨 위젯 ── */}
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-br from-[#0f1f3d] via-[#162d55] to-[#1a3a6b] rounded-2xl overflow-hidden text-white shadow-lg">
            {!weather ? (
              <div className="p-4 animate-pulse flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-20 h-7 bg-white/10 rounded-lg" />
                  <div className="w-32 h-4 bg-white/10 rounded-lg" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 pb-3">
                  <WxIcon code={weather.code} size={52} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                      {lang === 'mn' ? 'Улаанбаатар' : lang === 'kr' ? '울란바토르' : 'Ulaanbaatar'}
                    </p>
                    <div className="flex items-end gap-2 leading-none">
                      <span className="text-5xl font-black tracking-tight">{weather.temp}°</span>
                      <span className="text-sm text-white/60 mb-1">C</span>
                    </div>
                    <p className="text-sm font-semibold text-white/80 mt-0.5">{weather.cond}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 text-right flex-shrink-0">
                    <span className="flex items-center justify-end gap-1 text-xs text-white/60">
                      <ArrowUp size={10} className="text-red-400" />{weather.high}°
                      <ArrowDown size={10} className="text-blue-400 ml-1" />{weather.low}°
                    </span>
                    <span className="flex items-center justify-end gap-1 text-xs text-white/50">
                      <Wind size={10} />{weather.windDir} {weather.windSpeed}
                    </span>
                    <span className="flex items-center justify-end gap-1 text-xs text-white/50">
                      <Droplets size={10} className="text-blue-300" />{weather.humidity}%
                    </span>
                  </div>
                </div>
                {/* Forecast */}
                <div className="flex border-t border-white/10 divide-x divide-white/10">
                  {weather.forecast.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center py-3 gap-1.5">
                      <p className="text-[10px] text-white/40 font-bold uppercase">{d.day}</p>
                      <WxIcon code={d.code} size={18} />
                      <p className="text-xs font-bold">{d.high}°</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── 추천 여행지 ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'mn' ? 'Танд санал болгох газрууд' : lang === 'kr' ? '추천 여행지' : 'Recommended Places'}
            </h2>
            <button onClick={() => navigate('/explore')} className="text-primary text-xs font-semibold flex items-center gap-0.5">
              {lang === 'mn' ? 'Бүгдийг харах' : lang === 'kr' ? '전체보기' : 'See all'}
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {cards.map(loc => {
              const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
              const dist  = MOCK_DIST[loc.id]
              const rev   = MOCK_REVIEWS[loc.id] ?? 0
              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="relative h-36">
                    <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className={`absolute top-2.5 left-2.5 ${badge.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {badge.label[lang]}
                    </span>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-white font-black text-sm leading-tight">{loc.name[lang]}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-gray-400 text-[11px] flex items-center gap-0.5 mb-1.5">
                      <MapPin size={9} className="text-primary flex-shrink-0" />
                      <span className="truncate">{province(loc)}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Star size={10} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <span className="font-bold text-gray-700">{loc.rating}</span>
                      <span className="text-gray-400">({rev})</span>
                      {dist > 0 && <><span className="text-gray-300 mx-0.5">·</span><span className="text-gray-400">{dist} км</span></>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── AI 플래너 CTA ── */}
        <div
          onClick={() => navigate('/planner')}
          className="mx-4 mt-5 bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-gray-900 text-sm">AI Travel Planner</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">BETA</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {lang === 'mn' ? 'Таны сонирхол, хугацаа, төсөвт тохирсон аяллын төлөвлөгөөг AI гаргана.' :
                 lang === 'kr' ? '관심사, 기간, 예산에 맞춘 AI 여행 일정을 만들어드려요.' :
                 'AI crafts personalized itineraries based on your interests and budget.'}
              </p>
              <button className="mt-3 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-primary/25">
                {lang === 'mn' ? 'Төлөвлөгөө үүсгэх' : lang === 'kr' ? '일정 만들기' : 'Create Itinerary'}
              </button>
            </div>
            <div className="text-4xl flex-shrink-0">🤖</div>
          </div>
        </div>


        {/* ── 지금 인기있는 ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'mn' ? 'Одоо их алдартай' : lang === 'kr' ? '지금 인기있는' : 'Trending Now'}
            </h2>
            <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full">🔥 HOT</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {locations.filter(l => [2, 4, 5].includes(l.id)).map((loc, idx) => {
              const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="flex-shrink-0 w-36 cursor-pointer active:scale-[0.97] transition-transform"
                >
                  <div className="relative h-28 rounded-xl overflow-hidden">
                    <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      🔥 #{idx + 1}
                    </span>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-black text-xs leading-tight truncate">{loc.name[lang]}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star size={9} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[11px] font-bold text-gray-700">{loc.rating}</span>
                    </div>
                    <span className={`${badge.bg} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>
                      {badge.label[lang]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 최근 본 여행지 ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {lang === 'mn' ? 'Сүүлийн үзсэн газрууд' : lang === 'kr' ? '최근 본 여행지' : 'Recently Viewed'}
            </h2>
            <button onClick={() => navigate('/explore')} className="text-primary text-xs font-semibold">
              {lang === 'mn' ? 'Бүгдийг харах' : lang === 'kr' ? '전체보기' : 'See all'}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {locations.slice(0, 3).map(loc => (
              <div
                key={loc.id}
                onClick={() => navigate(`/explore/${loc.id}`)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                  <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <p className="text-xs font-bold text-gray-800 mt-1.5 w-24 truncate">{loc.name[lang]}</p>
                <p className="text-[10px] text-gray-400 truncate w-24">{province(loc)}</p>
              </div>
            ))}
            <div
              onClick={() => navigate('/explore')}
              className="flex-shrink-0 cursor-pointer"
            >
              <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-black text-gray-400">+8</span>
              </div>
              <p className="text-xs font-bold text-gray-400 mt-1.5">
                {lang === 'mn' ? 'Бүгд' : lang === 'kr' ? '더보기' : 'More'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
