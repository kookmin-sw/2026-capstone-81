import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { restaurants } from '../../data/restaurants'
import { Search, Star, ArrowRight, MapPin, Flame, Wind, CalendarDays, Clock, Utensils } from 'lucide-react'

const CATEGORY_CHIPS = [
  { emoji: '🌿', label: { kr: '자연',      en: 'Nature',      mn: 'Байгаль'       }, count: 215, filter: 'nature'   },
  { emoji: '🐎', label: { kr: '액티비티',  en: 'Adventure',   mn: 'Адал явдал'    }, count: 98,  filter: 'activity' },
  { emoji: '🏯', label: { kr: '문화·역사', en: 'Culture',     mn: 'Соёл, түүх'    }, count: 132, filter: 'culture'  },
  { emoji: '⛺', label: { kr: '게르 캠프', en: 'Ger Camp',    mn: 'Гэр булд'      }, count: 64,  filter: 'ger'      },
  { emoji: '📸', label: { kr: '사진 여행', en: 'Photo Trip',  mn: 'Фото аялал'    }, count: 87,  filter: 'photo'    },
  { emoji: '🌊', label: { kr: '휴양·온천', en: 'Hot Springs', mn: 'Амралт, рашаан'}, count: 53,  filter: 'wellness' },
]

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

const WEATHER = {
  city:   { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
  temp: 18, high: 22, low: 8,
  icon: '☀️',
  cond:   { kr: '맑음', en: 'Sunny', mn: 'Цэлмэг' },
  wind:   { kr: '북서 12km/h', en: 'NW 12 km/h', mn: 'ХХ 12км/ц' },
  humidity: 35,
  forecast: [
    { day: { kr: '화', en: 'Tue', mn: 'Мар' }, icon: '⛅', t: '16°' },
    { day: { kr: '수', en: 'Wed', mn: 'Лха' }, icon: '🌧️', t: '13°' },
    { day: { kr: '목', en: 'Thu', mn: 'Пүр' }, icon: '☀️', t: '20°' },
    { day: { kr: '금', en: 'Fri', mn: 'Баа' }, icon: '⛅', t: '19°' },
  ],
}

const FESTIVAL_HIGHLIGHTS = [
  { emoji: '🏆', name: { kr: '나담 축제', en: 'Naadam Festival', mn: 'Наадам баяр' }, date: { kr: '7월 11-13일', en: 'Jul 11–13', mn: '7/11–13' }, loc: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' }, season: { kr: '여름', en: 'Summer', mn: 'Зун' }, color: 'from-amber-400 to-orange-500', img: 'https://images.unsplash.com/photo-1695553920809-b16de74e1306?auto=format&fit=crop&w=600&q=80', desc: { kr: '씨름·양궁·말 경주, 몽골 최대 전통 축제', en: 'Wrestling, archery & horse racing — Mongolia\'s greatest festival', mn: 'Бөх, сур харваа, морин уралдаан — Монголын хамгийн том баяр' } },
  { emoji: '🦅', name: { kr: '독수리 축제', en: 'Eagle Festival', mn: 'Бүргэдийн наадам' }, date: { kr: '10월 초', en: 'Early October', mn: '10 сарын эхэн' }, loc: { kr: '바얀-울기', en: 'Bayan-Ulgii', mn: 'Баян-Өлгий' }, season: { kr: '가을', en: 'Autumn', mn: 'Намар' }, color: 'from-orange-400 to-red-500', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', desc: { kr: '카자흐족 독수리 사냥꾼의 전통 경연대회', en: 'Kazakh eagle hunters in a spectacular traditional competition', mn: 'Казах бүргэдчдийн уламжлалт тэмцээн' } },
  { emoji: '🛷', name: { kr: '홉스골 얼음 축제', en: 'Khuvsgul Ice Festival', mn: 'Хөвсгөлийн мөсний наадам' }, date: { kr: '2-3월', en: 'Feb–Mar', mn: '2–3 сар' }, loc: { kr: '홉스골 호수', en: 'Khuvsgul Lake', mn: 'Хөвсгөл нуур' }, season: { kr: '겨울', en: 'Winter', mn: 'Өвөл' }, color: 'from-blue-400 to-indigo-600', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', desc: { kr: '얼어붙은 호수 위 개 썰매·스케이팅·얼음 조각', en: 'Dog sledding, ice skating & sculpture on a frozen lake', mn: 'Хөлдсөн нуур дээр нохойн чарга, гулгаа, мөсний урлал' } },
  { emoji: '🎊', name: { kr: '차강사르 (설날)', en: 'Tsagaan Sar', mn: 'Цагаан сар' }, date: { kr: '음력 1월 (1-2월)', en: 'Lunar Jan (Jan–Feb)', mn: '1–2 сар' }, loc: { kr: '전국', en: 'Nationwide', mn: 'Улс даяар' }, season: { kr: '겨울', en: 'Winter', mn: 'Өвөл' }, color: 'from-purple-400 to-blue-500', img: 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80', desc: { kr: '몽골 음력 설날 — 가족이 모여 전통 음식을 나누는 날', en: 'Mongolian Lunar New Year — families gather to share traditional food', mn: 'Монголын шинэ жил — гэр бүл цугларч уламжлалт хоол хуваалцана' } },
  { emoji: '🎵', name: { kr: 'Playtime 페스티벌', en: 'Playtime Festival', mn: 'Плэйтайм фестиваль' }, date: { kr: '7월 중순', en: 'Mid July', mn: '7 сарын дунд' }, loc: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' }, season: { kr: '여름', en: 'Summer', mn: 'Зун' }, color: 'from-pink-400 to-rose-500', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80', desc: { kr: '몽골 최대 야외 음악 페스티벌', en: 'Mongolia\'s biggest outdoor music festival', mn: 'Монголын хамгийн том задгай хөгжмийн фестиваль' } },
  { emoji: '🐎', name: { kr: '유목민 이동 축제', en: 'Nomad Migration', mn: 'Нүүдлийн баяр' }, date: { kr: '5월', en: 'May', mn: '5 сар' }, loc: { kr: '테를지 / 전국', en: 'Terelj / Nationwide', mn: 'Тэрэлж / Улс даяар' }, season: { kr: '봄', en: 'Spring', mn: 'Хавар' }, color: 'from-green-400 to-emerald-500', img: 'https://images.unsplash.com/photo-1535728534313-e206f59bed23?auto=format&fit=crop&w=600&q=80', desc: { kr: '봄 유목민 이동 — 직접 참여 가능한 특별한 체험', en: 'Nomad spring migration — visitors can join the journey', mn: 'Хаврын нүүдэл — зочид оролцож болно' } },
]

const CULTURE_HIGHLIGHTS = [
  { emoji: '🏛️', name: { kr: '카라코룸 & 에르덴 조', en: 'Karakorum & Erdene Zuu', mn: 'Хархорум & Эрдэнэ зуу' }, year: { kr: '13세기', en: '13th Century', mn: '13-р зуун' }, desc: { kr: '몽골 제국 고대 수도. 몽골 최초의 불교 사원 에르덴 조가 인근에 위치합니다.', en: 'Ancient capital of the Mongol Empire. Home to Erdene Zuu, Mongolia\'s first Buddhist monastery.', mn: 'Монголын эзэнт гүрний эртний нийслэл. Монголын анхны Буддын хийд Эрдэнэ зуу энд байдаг.' }, img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80' },
  { emoji: '⚔️', name: { kr: '칭기즈칸 기마상', en: 'Chinggis Khan Statue', mn: 'Чингис хааны хөшөө' }, year: { kr: '2008년', en: 'Built 2008', mn: '2008 он' }, desc: { kr: '세계 최대 기마상 (40m). 테를지 인근에 위치하며 내부에 박물관·전망대가 있습니다.', en: 'World\'s largest equestrian statue (40m) near Terelj, with a museum and observation deck inside.', mn: 'Дэлхийн хамгийн том морьт хөшөө (40м). Дотор музей, харвалтын тавцан.' }, img: 'https://images.unsplash.com/photo-1573318012497-a5e98a95fd5f?auto=format&fit=crop&w=600&q=80' },
  { emoji: '🕌', name: { kr: '간단 사원 (울란바토르)', en: 'Gandan Monastery', mn: 'Гандантэгчинлэн хийд' }, year: { kr: '1838년 설립', en: 'Founded 1838', mn: '1838 он' }, desc: { kr: 'UB 최대 불교 사원. 26.5m 황금 불상이 안치되어 있고 매일 아침 승려 기도 의식을 관람할 수 있습니다.', en: 'UB\'s most important monastery. Houses a 26.5m golden Buddha; daily morning prayer ceremonies.', mn: 'УБ-ын хамгийн чухал хийд. 26.5м алтан Будда хөшөөтэй. Өдөр бүр ламнар залбирна.' }, img: 'https://images.unsplash.com/photo-1585503418537-88331351ad99?auto=format&fit=crop&w=600&q=80' },
  { emoji: '⛺', name: { kr: '전통 유목 문화', en: 'Nomadic Heritage', mn: 'Нүүдлийн соёл' }, year: { kr: '수천 년의 역사', en: 'Millennia old', mn: 'Мянган жилийн түүх' }, desc: { kr: '게르·마두금·씨름·전통 의상 등 살아있는 유목 문화. 게르 캠프 투숙 체험을 강력 추천합니다.', en: 'Ger homes, Morin Khuur, wrestling, and traditional costumes — living nomadic culture. Stay in a ger camp.', mn: 'Гэр, морин хуур, бөх, уламжлалт хувцас. Гэрт хоноод нүүдэлчдийн амьдралыг мэдрэхийг зөвлөнө.' }, img: 'https://images.unsplash.com/photo-1535728534313-e206f59bed23?auto=format&fit=crop&w=600&q=80' },
]


export default function DesktopHome() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [activeCat, setActiveCat] = useState('all')
  const [q, setQ] = useState('')
  const [tripType, setTripType] = useState('')
  const [date, setDate] = useState('')

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

      {/* ── 카테고리 칩 (3D 스타일) ── */}
      <div className="bg-white border-b border-gray-100 px-8 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORY_CHIPS.map(chip => (
            <button
              key={chip.filter}
              onClick={() => setActiveCat(activeCat === chip.filter ? 'all' : chip.filter)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 flex-shrink-0 transition-all border-2 ${
                activeCat === chip.filter
                  ? 'bg-primary border-primary shadow-lg shadow-primary/20'
                  : 'bg-white border-gray-100 hover:border-primary/30 hover:shadow-md shadow-sm'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-md ${
                activeCat === chip.filter
                  ? 'bg-white/20 shadow-white/20'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 shadow-gray-200'
              }`}>
                {chip.emoji}
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold whitespace-nowrap ${activeCat === chip.filter ? 'text-white' : 'text-gray-800'}`}>
                  {chip.label[lang]}
                </p>
                <p className={`text-xs ${activeCat === chip.filter ? 'text-white/70' : 'text-gray-400'}`}>
                  {chip.count} {lang === 'mn' ? 'газар' : lang === 'kr' ? '곳' : 'places'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">

        {/* ── 날씨 위젯 ── */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-400 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-6">
            {/* 현재 날씨 */}
            <div className="flex items-center gap-4 flex-1">
              <span className="text-5xl">{WEATHER.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white/70">{WEATHER.city[lang]}</p>
                <div className="flex items-end gap-2 mt-0.5">
                  <span className="text-4xl font-black leading-none">{WEATHER.temp}°</span>
                  <span className="text-sm text-white/80 mb-1">{WEATHER.cond[lang]}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                  <span>↑{WEATHER.high}° ↓{WEATHER.low}°</span>
                  <span className="flex items-center gap-1"><Wind size={11} />{WEATHER.wind[lang]}</span>
                  <span>💧 {WEATHER.humidity}%</span>
                </div>
              </div>
            </div>
            {/* 4일 예보 */}
            <div className="flex gap-4 border-l border-white/20 pl-6">
              {WEATHER.forecast.map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-[11px] text-white/60">{d.day[lang]}</p>
                  <p className="text-xl my-0.5">{d.icon}</p>
                  <p className="text-sm font-bold">{d.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 축제 패널 (액티비티 선택 시) ── */}
        {activeCat === 'activity' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  🎉 {lang === 'kr' ? '몽골 축제 일정' : lang === 'en' ? 'Mongolia Festivals' : 'Монголын наадам, баярууд'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {lang === 'kr' ? '계절별 몽골의 특별한 축제들을 만나보세요' : lang === 'en' ? 'Discover Mongolia\'s unique seasonal festivals' : 'Монголын улирлын онцлох баяруудтай танилц'}
                </p>
              </div>
              <button onClick={() => navigate('/explore?cat=activity')} className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
                {lang === 'kr' ? '전체보기' : lang === 'en' ? 'See all' : 'Бүгдийг харах'} <ArrowRight size={14} />
              </button>
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
        )}

        {/* ── 문화·역사 패널 (문화 선택 시) ── */}
        {activeCat === 'culture' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  🏛️ {lang === 'kr' ? '몽골 문화·역사 하이라이트' : lang === 'en' ? 'Culture & History' : 'Соёл, Түүх'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {lang === 'kr' ? '몽골 제국부터 현대까지 살아있는 역사를 탐험하세요' : lang === 'en' ? 'Explore Mongolia\'s living history from the empire to today' : 'Монголын эзэнт гүрнээс өнөөг хүртэлх амьд түүхийг судлаарай'}
                </p>
              </div>
              <button onClick={() => navigate('/explore?cat=culture')} className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
                {lang === 'kr' ? '전체보기' : lang === 'en' ? 'See all' : 'Бүгдийг харах'} <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {CULTURE_HIGHLIGHTS.map((item, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-40 flex-shrink-0 overflow-hidden">
                    <img src={item.img} alt={item.name[lang]} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1">
                    <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">
                      {item.year[lang]}
                    </span>
                    <h3 className="font-black text-gray-900 text-sm mb-1.5 leading-tight">{item.emoji} {item.name[lang]}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.desc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Planner CTA ── */}
        <div
          className="bg-gradient-to-r from-primary to-emerald-400 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20 group"
          onClick={() => navigate('/planner')}
        >
          <div className="flex items-center gap-5">
            <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">🤖</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-black text-lg">AI Travel Planner</h3>
                <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BETA</span>
              </div>
              <p className="text-white/85 text-sm leading-relaxed">
                {lang === 'kr' ? '관심사, 기간, 예산에 맞춘 맞춤형 몽골 여행 일정을 AI가 만들어드려요.' :
                 lang === 'en' ? 'AI crafts a personalized Mongolia itinerary based on your interests, duration, and budget.' :
                 'Таны сонирхол, хугацаа, төсөвт тохирсон аяллын төлөвлөгөөг AI гаргана.'}
              </p>
            </div>
            <button className="bg-white text-primary font-black text-sm px-6 py-3 rounded-xl flex-shrink-0 shadow-md group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all">
              {lang === 'kr' ? '일정 만들기' : lang === 'en' ? 'Create Itinerary' : 'Төлөвлөгөө үүсгэх'}
            </button>
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
            {locations.filter(loc => activeCat === 'all' || loc.category === activeCat).slice(0, 6).map(loc => {
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
