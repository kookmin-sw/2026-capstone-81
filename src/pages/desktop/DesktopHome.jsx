import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { Search, Star, ArrowRight, MapPin, Flame, Wind, CalendarDays, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Droplets, ArrowUp, ArrowDown, Eye } from 'lucide-react'


const CAT_BADGE = {
  nature:   { label: { kr: '자연',    en: 'Nature',   mn: 'Байгаль'    }, bg: 'bg-emerald-500' },
  culture:  { label: { kr: '문화',    en: 'Culture',  mn: 'Соёл'       }, bg: 'bg-blue-500'    },
  activity: { label: { kr: '액티비티',en: 'Activity', mn: 'Адал явдал' }, bg: 'bg-orange-500'  },
}

const REGION_LABEL = {
  mn: { khuvsgul: 'Хөвсгөл аймаг', gobi: 'Өмнөговь аймаг', terelj: 'Төв аймаг', ub: 'Улаанбаатар', kharkhorin: 'Өвөрхангай аймаг', orkhon: 'Орхон аймаг', bayan: 'Баян-Өлгий аймаг' },
  kr: { khuvsgul: '홉스골 아이막',  gobi: '남고비 아이막',  terelj: '투브 아이막', ub: '울란바토르',  kharkhorin: '오브르항가이',      orkhon: '오르홍',       bayan: '바얀-울기'       },
  en: { khuvsgul: 'Khuvsgul aimag', gobi: 'Omnogovi aimag', terelj: 'Tuv aimag',  ub: 'Ulaanbaatar', kharkhorin: 'Uvurkhangai',       orkhon: 'Orkhon',       bayan: 'Bayan-Ulgii'     },
}

const MOCK_DIST = { 1: 0, 2: 540, 3: 55, 4: 646, 5: 460, 6: 10, 7: 360, 8: 400, 9: 1680, 10: 75, 11: 5, 12: 1200 }
const MOCK_REVIEWS = { 1: 186, 2: 342, 3: 278, 4: 210, 5: 182, 6: 94, 7: 164, 8: 128 }

const TRENDING_IDS = [2, 4, 5, 3, 7, 8]

const SEASONAL = {
  kr: { label: '여름 추천 (6-8월)', tip: '몽골 대초원과 홉스골 호수는 여름이 최고 절정! 나담 축제도 놓치지 마세요.' },
  en: { label: 'Summer Picks (Jun-Aug)', tip: 'The Mongolian steppe and Lake Khuvsgul are at their peak in summer. Don\'t miss the Naadam Festival!' },
  mn: { label: 'Зуны санал (6-8 сар)', tip: 'Монгол тал нутаг, Хөвсгөл нуур зунаа хамгийн гоё. Наадмыг мартаж болохгүй!' },
}

function wxIconColor(code) {
  if (code === 0) return 'text-yellow-300'
  if (code <= 3) return 'text-blue-200'
  if (code <= 48) return 'text-gray-300'
  if (code <= 67) return 'text-blue-300'
  if (code <= 77) return 'text-sky-100'
  if (code <= 82) return 'text-blue-300'
  if (code <= 86) return 'text-sky-100'
  return 'text-yellow-200'
}

function WeatherIcon({ code, size = 48 }) {
  const cls = `${wxIconColor(code)} flex-shrink-0`
  if (code === 0) return <Sun size={size} className={cls} strokeWidth={1.5} />
  if (code <= 3) return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <Sun size={size * 0.65} className="text-yellow-300 absolute top-0 right-0" strokeWidth={1.5} />
      <Cloud size={size * 0.8} className="text-blue-200 absolute bottom-0 left-0" strokeWidth={1.5} />
    </div>
  )
  if (code <= 48) return <Cloud size={size} className={cls} strokeWidth={1.5} />
  if (code <= 67) return <CloudRain size={size} className={cls} strokeWidth={1.5} />
  if (code <= 77) return <CloudSnow size={size} className={cls} strokeWidth={1.5} />
  if (code <= 82) return <CloudRain size={size} className={cls} strokeWidth={1.5} />
  if (code <= 86) return <CloudSnow size={size} className={cls} strokeWidth={1.5} />
  return <CloudLightning size={size} className={cls} strokeWidth={1.5} />
}

function wxCond(code, lang) {
  const c =
    code === 0 ? 'clear' : code <= 3 ? 'cloudy' : code <= 48 ? 'fog' :
    code <= 67 ? 'rain' : code <= 77 ? 'snow' : code <= 82 ? 'showers' : 'storm'
  return ({
    clear:   { kr: '맑음',    en: 'Sunny',          mn: 'Цэлмэг'      },
    cloudy:  { kr: '구름 조금', en: 'Partly Cloudy', mn: 'Үүлтэй'     },
    fog:     { kr: '안개',    en: 'Foggy',           mn: 'Манантай'    },
    rain:    { kr: '비',      en: 'Rainy',           mn: 'Бороотой'    },
    snow:    { kr: '눈',      en: 'Snowy',           mn: 'Цастай'      },
    showers: { kr: '소나기',  en: 'Showers',         mn: 'Жаахан бороо'},
    storm:   { kr: '천둥번개', en: 'Thunderstorm',   mn: 'Аянга'       },
  })[c][lang] ?? 'Sunny'
}

function wxDayName(dateStr, lang) {
  const days = {
    kr: ['일','월','화','수','목','금','토'],
    en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    mn: ['Ням','Дав','Мяг','Лха','Пүр','Баа','Бям'],
  }
  return (days[lang] ?? days.en)[new Date(dateStr).getDay()]
}

function wxWindDir(deg, lang) {
  const idx = Math.round(deg / 45) % 8
  return ([
    { kr: '북', en: 'N', mn: 'Х' }, { kr: '북동', en: 'NE', mn: 'ХЗ' },
    { kr: '동', en: 'E', mn: 'З' }, { kr: '남동', en: 'SE', mn: 'ӨЗ' },
    { kr: '남', en: 'S', mn: 'Ө' }, { kr: '남서', en: 'SW', mn: 'ӨД' },
    { kr: '서', en: 'W', mn: 'Д' }, { kr: '북서', en: 'NW', mn: 'ХД' },
  ])[idx][lang] ?? 'N'
}

const FESTIVAL_HIGHLIGHTS = [
  { emoji: '🏆', name: { kr: '나담 축제', en: 'Naadam Festival', mn: 'Наадам баяр' }, date: { kr: '7월 11-13일', en: 'Jul 11–13', mn: '7/11–13' }, loc: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' }, season: { kr: '여름', en: 'Summer', mn: 'Зун' }, color: 'from-amber-400 to-orange-500', img: 'https://images.unsplash.com/photo-1695553920809-b16de74e1306?auto=format&fit=crop&w=600&q=80', desc: { kr: '씨름·양궁·말 경주, 몽골 최대 전통 축제', en: 'Wrestling, archery & horse racing — Mongolia\'s greatest festival', mn: 'Бөх, сур харваа, морин уралдаан — Монголын хамгийн том баяр' } },
  { emoji: '🦅', name: { kr: '독수리 축제', en: 'Eagle Festival', mn: 'Бүргэдийн наадам' }, date: { kr: '10월 초', en: 'Early October', mn: '10 сарын эхэн' }, loc: { kr: '바얀-울기', en: 'Bayan-Ulgii', mn: 'Баян-Өлгий' }, season: { kr: '가을', en: 'Autumn', mn: 'Намар' }, color: 'from-orange-400 to-red-500', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', desc: { kr: '카자흐족 독수리 사냥꾼의 전통 경연대회', en: 'Kazakh eagle hunters in a spectacular traditional competition', mn: 'Казах бүргэдчдийн уламжлалт тэмцээн' } },
  { emoji: '🛷', name: { kr: '홉스골 얼음 축제', en: 'Khuvsgul Ice Festival', mn: 'Хөвсгөлийн мөсний наадам' }, date: { kr: '2-3월', en: 'Feb–Mar', mn: '2–3 сар' }, loc: { kr: '홉스골 호수', en: 'Khuvsgul Lake', mn: 'Хөвсгөл нуур' }, season: { kr: '겨울', en: 'Winter', mn: 'Өвөл' }, color: 'from-blue-400 to-indigo-600', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', desc: { kr: '얼어붙은 호수 위 개 썰매·스케이팅·얼음 조각', en: 'Dog sledding, ice skating & sculpture on a frozen lake', mn: 'Хөлдсөн нуур дээр нохойн чарга, гулгаа, мөсний урлал' } },
  { emoji: '🎊', name: { kr: '차강사르 (설날)', en: 'Tsagaan Sar', mn: 'Цагаан сар' }, date: { kr: '음력 1월 (1-2월)', en: 'Lunar Jan (Jan–Feb)', mn: '1–2 сар' }, loc: { kr: '전국', en: 'Nationwide', mn: 'Улс даяар' }, season: { kr: '겨울', en: 'Winter', mn: 'Өвөл' }, color: 'from-purple-400 to-blue-500', img: 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80', desc: { kr: '몽골 음력 설날 — 가족이 모여 전통 음식을 나누는 날', en: 'Mongolian Lunar New Year — families gather to share traditional food', mn: 'Монголын шинэ жил — гэр бүл цугларч уламжлалт хоол хуваалцана' } },
  { emoji: '🎵', name: { kr: 'Playtime 페스티벌', en: 'Playtime Festival', mn: 'Плэйтайм фестиваль' }, date: { kr: '7월 중순', en: 'Mid July', mn: '7 сарын дунд' }, loc: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' }, season: { kr: '여름', en: 'Summer', mn: 'Зун' }, color: 'from-pink-400 to-rose-500', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80', desc: { kr: '몽골 최대 야외 음악 페스티벌', en: 'Mongolia\'s biggest outdoor music festival', mn: 'Монголын хамгийн том задгай хөгжмийн фестиваль' } },
  { emoji: '🐎', name: { kr: '유목민 이동 축제', en: 'Nomad Migration', mn: 'Нүүдлийн баяр' }, date: { kr: '5월', en: 'May', mn: '5 сар' }, loc: { kr: '테를지 / 전국', en: 'Terelj / Nationwide', mn: 'Тэрэлж / Улс даяар' }, season: { kr: '봄', en: 'Spring', mn: 'Хавар' }, color: 'from-green-400 to-emerald-500', img: 'https://images.unsplash.com/photo-1535728534313-e206f59bed23?auto=format&fit=crop&w=600&q=80', desc: { kr: '봄 유목민 이동 — 직접 참여 가능한 특별한 체험', en: 'Nomad spring migration — visitors can join the journey', mn: 'Хаврын нүүдэл — зочид оролцож болно' } },
]


export default function DesktopHome() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [q, setQ] = useState('')
  const [tripType, setTripType] = useState('')
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=47.9077&longitude=106.9230' +
      '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code' +
      '&daily=temperature_2m_max,temperature_2m_min,weather_code' +
      '&timezone=Asia%2FUlaanbaatar&forecast_days=5'
    )
      .then(r => r.json())
      .then(d => {
        const c = d.current
        const day = d.daily
        setWeather({
          code: c.weather_code,
          temp: Math.round(c.temperature_2m),
          high: Math.round(day.temperature_2m_max[0]),
          low:  Math.round(day.temperature_2m_min[0]),
          cond: wxCond(c.weather_code, lang),
          windSpeed: Math.round(c.wind_speed_10m),
          windDir: wxWindDir(c.wind_direction_10m, lang),
          humidity: c.relative_humidity_2m,
          forecast: day.time.slice(1, 5).map((t, i) => ({
            day: wxDayName(t, lang),
            code: day.weather_code[i + 1],
            high: Math.round(day.temperature_2m_max[i + 1]),
            low: Math.round(day.temperature_2m_min[i + 1]),
          })),
        })
      })
      .catch(() => {})
  }, [])

  const province = loc => (REGION_LABEL[lang] ?? REGION_LABEL.en)[loc.region] ?? loc.region

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── 히어로 ── */}
      <div className="relative" style={{ height: 380 }}>
        <img
          src="/images/orkhon valley.jpg"
          alt="Mongolia"
          className="w-full h-full object-cover"
          onError={e => { e.target.src = '/images/terelj.jpg' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
          <h1 className="text-4xl font-black text-white text-center leading-tight mb-3">
            {lang === 'kr' ? '다음 여행을 함께 계획해요' :
             lang === 'en' ? 'Plan your next adventure together' :
             'Дараагийн аяллаа хамтдаа төлөвлөө'}
          </h1>
          <p className="text-white/75 text-sm mb-8 text-center max-w-lg leading-relaxed">
            {lang === 'kr' ? '몽골의 아름다운 자연, 문화, 특별한 체험이 당신을 기다립니다.' :
             lang === 'en' ? 'Mongolia\'s stunning nature, culture, and unique experiences await you.' :
             'Монгол орны үзэсгэлэнт байгаль, соёл, өвөрмөц туршлагуд таныг хүлээж байна.'}
          </p>

          {/* 검색 바 */}
          <div className="flex items-center gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
            <div className="flex-1 flex items-center gap-2 px-4 py-3.5">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(q.trim() ? `/explore?q=${encodeURIComponent(q)}` : '/explore')}
                placeholder={lang === 'kr' ? '어디로 가고 싶으세요?' : lang === 'en' ? 'Where to go?' : 'Хаана очих вэ?'}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <select
              value={date}
              onChange={e => setDate(e.target.value)}
              className="text-sm text-gray-500 outline-none cursor-pointer bg-transparent px-4 py-3.5"
            >
              <option value="">{lang === 'kr' ? '언제?' : lang === 'en' ? 'When?' : 'Хэзээ?'}</option>
              <option>{lang === 'kr' ? '6월' : lang === 'en' ? 'June' : '6 сар'}</option>
              <option>{lang === 'kr' ? '7월' : lang === 'en' ? 'July' : '7 сар'}</option>
              <option>{lang === 'kr' ? '8월' : lang === 'en' ? 'August' : '8 сар'}</option>
              <option>{lang === 'kr' ? '9월' : lang === 'en' ? 'September' : '9 сар'}</option>
            </select>
            <div className="w-px h-8 bg-gray-200" />
            <select
              value={tripType}
              onChange={e => setTripType(e.target.value)}
              className="text-sm text-gray-500 outline-none cursor-pointer bg-transparent px-4 py-3.5"
            >
              <option value="">{lang === 'kr' ? '여행 유형' : lang === 'en' ? 'Trip Type' : 'Аяллын төрөл'}</option>
              <option>{lang === 'kr' ? '자연 탐방' : lang === 'en' ? 'Nature' : 'Байгаль'}</option>
              <option>{lang === 'kr' ? '문화 여행' : lang === 'en' ? 'Culture' : 'Соёл'}</option>
              <option>{lang === 'kr' ? '액티비티' : lang === 'en' ? 'Activity' : 'Адал явдал'}</option>
            </select>
            <button
              onClick={() => navigate(q.trim() ? `/explore?q=${encodeURIComponent(q)}` : '/explore')}
              className="bg-primary text-white px-6 py-3.5 text-sm font-bold flex-shrink-0 hover:bg-primary/90 transition-colors"
            >
              {lang === 'kr' ? '검색' : lang === 'en' ? 'Search' : 'Хайх'}
            </button>
          </div>
        </div>
      </div>


      <div className="px-8 py-6 space-y-8">

        {/* ── 날씨 위젯 ── */}
        <div className="bg-gradient-to-br from-[#0f1f3d] via-[#162d55] to-[#1a3a6b] rounded-3xl overflow-hidden text-white shadow-xl">
          {!weather ? (
            <div className="flex items-center gap-6 p-8 animate-pulse">
              <div className="w-20 h-20 bg-white/10 rounded-2xl" />
              <div className="space-y-3 flex-1">
                <div className="w-32 h-10 bg-white/10 rounded-xl" />
                <div className="w-48 h-5 bg-white/10 rounded-lg" />
                <div className="w-64 h-4 bg-white/10 rounded-lg" />
              </div>
              <div className="flex gap-6">
                {[0,1,2,3].map(i => <div key={i} className="w-16 h-20 bg-white/10 rounded-xl" />)}
              </div>
            </div>
          ) : (
            <div className="flex">
              {/* Left: Current weather */}
              <div className="flex-1 p-8 pr-6">
                <div className="flex items-start gap-6">
                  <WeatherIcon code={weather.code} size={72} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
                      {lang === 'kr' ? '울란바토르, 몽골' : lang === 'mn' ? 'Улаанбаатар, Монгол' : 'Ulaanbaatar, Mongolia'}
                    </p>
                    <div className="flex items-end gap-3 leading-none mb-1">
                      <span className="text-7xl font-black tracking-tight">{weather.temp}°</span>
                      <span className="text-xl text-white/60 font-medium mb-2">C</span>
                    </div>
                    <p className="text-lg font-semibold text-white/80">{weather.cond}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-6 flex items-center gap-1">
                  <div className="flex items-center gap-2 bg-white/8 rounded-xl px-4 py-2.5 flex-1">
                    <ArrowUp size={14} className="text-red-400" />
                    <span className="text-sm font-semibold">{weather.high}°</span>
                    <ArrowDown size={14} className="text-blue-400 ml-1" />
                    <span className="text-sm font-semibold">{weather.low}°</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/8 rounded-xl px-4 py-2.5 flex-1">
                    <Wind size={14} className="text-white/50" />
                    <span className="text-sm font-semibold">{weather.windDir} {weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/8 rounded-xl px-4 py-2.5">
                    <Droplets size={14} className="text-blue-300" />
                    <span className="text-sm font-semibold">{weather.humidity}%</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-white/10 my-6" />

              {/* Right: 4-day forecast */}
              <div className="flex items-center px-8 gap-6">
                {weather.forecast.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wide">{d.day}</p>
                    <WeatherIcon code={d.code} size={28} />
                    <div className="text-center">
                      <p className="text-sm font-bold">{d.high}°</p>
                      <p className="text-xs text-white/40">{d.low}°</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 축제 섹션 ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                🎉 {lang === 'kr' ? '몽골 축제' : lang === 'en' ? 'Mongolia Festivals' : 'Монголын наадам, баярууд'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {lang === 'kr' ? '계절별 몽골의 특별한 축제들을 만나보세요' : lang === 'en' ? 'Discover Mongolia\'s unique seasonal festivals' : 'Монголын улирлын онцлох баяруудтай танилц'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {FESTIVAL_HIGHLIGHTS.slice(0, 6).map((fest, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative h-36 overflow-hidden">
                  <img src={fest.img} alt={fest.name[lang]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className={`absolute top-3 left-3 bg-gradient-to-r ${fest.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                    {fest.season[lang]}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-black text-sm leading-tight">{fest.emoji} {fest.name[lang]}</h3>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                      <CalendarDays size={9} />{fest.date[lang]}
                    </span>
                    <span className="text-[10px] text-gray-400">{fest.loc[lang]}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{fest.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Planner + Essential Apps CTAs (side by side) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-gradient-to-r from-primary to-emerald-400 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20 group"
            onClick={() => navigate('/planner')}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">🤖</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-black text-lg">AI Travel Planner</h3>
                  <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BETA</span>
                </div>
                <p className="text-white/85 text-sm leading-relaxed">
                  {lang === 'kr' ? 'AI가 맞춤형 몽골 여행 일정을 만들어드려요.' :
                   lang === 'en' ? 'AI builds a personalized Mongolia itinerary.' :
                   'AI таны аяллын төлөвлөгөөг гаргана.'}
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20 group"
            onClick={() => navigate('/apps')}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">📱</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-black text-lg">
                    {lang === 'kr' ? '몽골 필수 앱' : lang === 'en' ? 'Essential Mongolian Apps' : 'Зайлшгүй апп-ууд'}
                  </h3>
                  <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">GUIDE</span>
                </div>
                <p className="text-white/85 text-sm leading-relaxed">
                  {lang === 'kr' ? '택시, 배달, QPay, 약국 — 현지 생활에 필요한 16개 앱.' :
                   lang === 'en' ? 'Taxi, delivery, QPay, pharmacy — 16 apps you actually need.' :
                   'Такси, хүргэлт, QPay — 16 зайлшгүй апп.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 추천 여행지 (가로 스크롤) ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">
              {lang === 'kr' ? '추천 여행지' : lang === 'en' ? 'Recommended Destinations' : 'Танд санал болгож буй газар'}
            </h2>
            <button onClick={() => navigate('/explore')} className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
              {lang === 'kr' ? '전체보기' : lang === 'en' ? 'See all' : 'Бүгдийг харах'} <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {locations.slice(0, 6).map(loc => {
              const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
              const dist = MOCK_DIST[loc.id]
              const reviews = MOCK_REVIEWS[loc.id] ?? 0
              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="flex-shrink-0 w-60 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48">
                    <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className={`absolute top-3 left-3 ${badge.bg} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {badge.label[lang]}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-black text-lg leading-tight drop-shadow">{loc.name[lang]}</h3>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                      <MapPin size={12} className="text-primary flex-shrink-0" />
                      {province(loc)}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-700">{loc.rating}</span>
                      {reviews > 0 && <span className="text-gray-400">({reviews})</span>}
                      {dist > 0 && <><span className="text-gray-300">·</span><span>{dist} км</span></>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 지금 인기있는 여행지 ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-gray-900">
                {lang === 'kr' ? '지금 인기있는 여행지' : lang === 'en' ? 'Trending Now' : 'Одоо хамгийн их хайгдаж буй'}
              </h2>
              <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
                <Flame size={11} /> HOT
              </span>
            </div>
            <button onClick={() => navigate('/explore')} className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
              {lang === 'kr' ? '전체보기' : lang === 'en' ? 'See all' : 'Бүгдийг харах'} <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {locations.filter(l => TRENDING_IDS.includes(l.id)).slice(0, 3).map((loc, idx) => {
              const badge = CAT_BADGE[loc.category] ?? CAT_BADGE.nature
              const dist = MOCK_DIST[loc.id]
              const reviews = MOCK_REVIEWS[loc.id] ?? 0
              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/explore/${loc.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44">
                    <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className={`absolute top-3 left-3 ${badge.bg} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {badge.label[lang]}
                    </span>
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      🔥 #{idx + 1}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-black text-base leading-tight drop-shadow">{loc.name[lang]}</h3>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-1.5">
                      <MapPin size={12} className="text-primary flex-shrink-0" />
                      {province(loc)}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-700">{loc.rating}</span>
                      {reviews > 0 && <span className="text-gray-400">({reviews})</span>}
                      {dist > 0 && <><span className="text-gray-300">·</span><span>{dist} км</span></>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 시즌 추천 배너 ── */}
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer group"
          style={{ height: 140 }}
          onClick={() => navigate('/explore')}
        >
          <img src="/images/khuvsgul-lake-luxury.jpg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">
                  ☀️ {SEASONAL[lang]?.label}
                </span>
              </div>
              <p className="text-white text-sm font-semibold max-w-md leading-relaxed">
                {SEASONAL[lang]?.tip}
              </p>
            </div>
            <div className="ml-auto">
              <button className="bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                {lang === 'kr' ? '여행지 보기' : lang === 'en' ? 'Explore' : 'Харах'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="pb-6" />
    </div>
  )
}
