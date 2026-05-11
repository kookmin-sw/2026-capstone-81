import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { locations } from '../../data/locations'
import { provinceLocations } from '../../data/provinceLocations'
import { Search, Star, Clock, CalendarDays, SlidersHorizontal, MapPin, X, ChevronRight } from 'lucide-react'

const PROVINCES = [
  { key: 'all',        label: { kr: '전체',         en: 'All',           mn: 'Бүгд' } },
  { key: 'ub',         label: { kr: '울란바토르',    en: 'Ulaanbaatar',   mn: 'Улаанбаатар' },  emoji: '🏙️' },
  { key: 'arkhangai',  label: { kr: '아르항가이',    en: 'Arkhangai',     mn: 'Архангай' },      emoji: '🏔️' },
  { key: 'bayanolgii', label: { kr: '바얀-울기',     en: 'Bayan-Ulgii',   mn: 'Баян-Өлгий' },   emoji: '🦅' },
  { key: 'bayankh',    label: { kr: '바양홍고르',    en: 'Bayankhongor',  mn: 'Баянхонгор' },   emoji: '🏜️' },
  { key: 'bulgan',     label: { kr: '불간',          en: 'Bulgan',        mn: 'Булган' },        emoji: '🌲' },
  { key: 'govaltai',   label: { kr: '고비-알타이',   en: 'Govi-Altai',    mn: 'Говь-Алтай' },   emoji: '🏔️' },
  { key: 'govsumb',    label: { kr: '고비숨버르',    en: 'Govisumber',    mn: 'Говьсүмбэр' },   emoji: '🌄' },
  { key: 'darkhan',    label: { kr: '다르항-울',     en: 'Darkhan-Uul',   mn: 'Дархан-Уул' },   emoji: '🏭' },
  { key: 'dorngov',    label: { kr: '동고비',        en: 'Dornogovi',     mn: 'Дорноговь' },     emoji: '🌅' },
  { key: 'dornod',     label: { kr: '동부',          en: 'Dornod',        mn: 'Дорнод' },        emoji: '🌊' },
  { key: 'dundgov',    label: { kr: '중앙고비',      en: 'Dundgovi',      mn: 'Дундговь' },      emoji: '🗿' },
  { key: 'zavkhan',    label: { kr: '자브항',        en: 'Zavkhan',       mn: 'Завхан' },        emoji: '❄️' },
  { key: 'orkhon',     label: { kr: '오르홍',        en: 'Orkhon',        mn: 'Орхон' },         emoji: '🏙️' },
  { key: 'ovorkh',     label: { kr: '오브르항가이',  en: 'Uvurkhangai',   mn: 'Өвөрхангай' },   emoji: '🏛️' },
  { key: 'omngov',     label: { kr: '남고비',        en: 'Omnogovi',      mn: 'Өмнөговь' },      emoji: '🦕' },
  { key: 'sukhbaatar', label: { kr: '수흐바타르',    en: 'Sukhbaatar',    mn: 'Сүхбаатар' },    emoji: '🌾' },
  { key: 'selenge',    label: { kr: '셀렝게',        en: 'Selenge',       mn: 'Сэлэнгэ' },       emoji: '💧' },
  { key: 'tuv',        label: { kr: '중부',          en: 'Tuv',           mn: 'Төв' },           emoji: '🏕️' },
  { key: 'uvs',        label: { kr: '우브스',        en: 'Uvs',           mn: 'Увс' },           emoji: '🌊' },
  { key: 'khovd',      label: { kr: '호브드',        en: 'Khovd',         mn: 'Ховд' },          emoji: '🏔️' },
  { key: 'khuvsgul',   label: { kr: '홉스골',        en: 'Khuvsgul',      mn: 'Хөвсгөл' },       emoji: '💙' },
  { key: 'khentii',    label: { kr: '헨티',          en: 'Khentii',       mn: 'Хэнтий' },        emoji: '🌿' },
]

// Mongolian province name → province key
const PROVINCE_MN_TO_KEY = {
  'Архангай': 'arkhangai', 'Баян-Өлгий': 'bayanolgii', 'Баянхонгор': 'bayankh',
  'Булган': 'bulgan', 'Говь-Алтай': 'govaltai', 'Говьсүмбэр': 'govsumb',
  'Дархан-Уул': 'darkhan', 'Дорноговь': 'dorngov', 'Дорнод': 'dornod',
  'Дундговь': 'dundgov', 'Завхан': 'zavkhan', 'Орхон': 'orkhon',
  'Өвөрхангай': 'ovorkh', 'Өмнөговь': 'omngov', 'Сүхбаатар': 'sukhbaatar',
  'Сэлэнгэ': 'selenge', 'Төв': 'tuv', 'Увс': 'uvs',
  'Ховд': 'khovd', 'Хөвсгөл': 'khuvsgul', 'Хэнтий': 'khentii',
}

// Main location id → province key
const LOCATION_PROVINCE = {
  1: 'ub', 2: 'omngov', 3: 'tuv', 4: 'khuvsgul', 5: 'omngov',
  6: 'ub', 7: 'ovorkh', 8: 'ovorkh', 9: 'bayanolgii', 10: 'tuv',
  11: 'ub', 12: 'uvs',
}

const CATEGORIES = [
  { key: 'all',      label: { kr: '전체',         en: 'All',               mn: 'Бүгд' },        emoji: '🌍' },
  { key: 'nature',   label: { kr: '자연',         en: 'Nature',            mn: 'Байгаль' },      emoji: '🏔️' },
  { key: 'culture',  label: { kr: '문화',         en: 'Culture',           mn: 'Соёл' },         emoji: '🏛️' },
  { key: 'activity', label: { kr: '액티비티·축제', en: 'Activity & Festival', mn: 'Үйл & Наадам' }, emoji: '🎉' },
]

const FESTIVALS = {
  summer: {
    label: { kr: '여름', en: 'Summer', mn: 'Зун' },
    months: { kr: '6–8월', en: 'Jun–Aug', mn: '6–8 сар' },
    emoji: '☀️',
    gradient: 'from-amber-400 to-orange-500',
    active: 'bg-amber-500',
    list: [
      {
        name: { kr: '나담 축제', en: 'Naadam Festival', mn: 'Наадам баяр' },
        date: { kr: '7월 11–13일', en: 'Jul 11–13', mn: '7/11–13' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '몽골 최대 전통 축제. 씨름·양궁·말 경주의 3대 종목으로 수백 년 역사를 자랑합니다.', en: "Mongolia's greatest festival — wrestling, archery, and horse racing over hundreds of years.", mn: 'Монголын хамгийн том уламжлалт баяр. Бөх, сур харваа, морин уралдаан.' },
        emoji: '🏆',
        img: 'https://images.unsplash.com/photo-1695553920809-b16de74e1306?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: 'Playtime 페스티벌', en: 'Playtime Festival', mn: 'Плэйтайм Фестиваль' },
        date: { kr: '7월 중순', en: 'Mid July', mn: '7 сарын дунд' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '몽골 최대 야외 음악 페스티벌. 국내외 아티스트들의 라이브 공연이 펼쳐집니다.', en: "Mongolia's biggest outdoor music festival with local and international live acts.", mn: 'Монголын хамгийн том задгай хөгжмийн фестиваль.' },
        emoji: '🎵',
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: 'XMF 페스티벌', en: 'XMF Festival', mn: 'XMF Фестиваль' },
        date: { kr: '8월', en: 'August', mn: '8 сар' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '몽골 청소년 음악·문화 축제. EDM, 팝, 힙합 등 다양한 장르의 무대가 열립니다.', en: "Youth music & culture festival featuring EDM, pop, and hip-hop stages.", mn: 'Залуучуудын хөгжим, соёлын фестиваль. EDM, поп, хип-хоп.' },
        emoji: '🎤',
        img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: '마린 호르 (Khuur) 축제', en: 'Morin Khuur Festival', mn: 'Морин хуурын наадам' },
        date: { kr: '8월 초', en: 'Early August', mn: '8 сарын эхэн' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '몽골 전통 마두금 연주 경연. 전국 최고의 연주자들이 모여 실력을 겨룹니다.', en: 'Traditional horse-head fiddle competition gathering the finest players nationwide.', mn: 'Улсын шилдэг морин хуурчдын уралдаан, тоглолт.' },
        emoji: '🎻',
        img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  autumn: {
    label: { kr: '가을', en: 'Autumn', mn: 'Намар' },
    months: { kr: '9–10월', en: 'Sep–Oct', mn: '9–10 сар' },
    emoji: '🍂',
    gradient: 'from-orange-400 to-red-500',
    active: 'bg-orange-500',
    list: [
      {
        name: { kr: '독수리 축제', en: 'Eagle Festival', mn: 'Бүргэдийн наадам' },
        date: { kr: '10월 초', en: 'Early October', mn: '10 сарын эхэн' },
        location: { kr: '바얀-울기', en: 'Bayan-Ulgii', mn: 'Баян-Өлгий' },
        desc: { kr: '카자흐족 독수리 사냥꾼들의 전통 경연. 황금 독수리와 함께하는 장관이 펼쳐집니다.', en: 'Kazakh eagle hunters compete with golden eagles in a spectacular traditional contest.', mn: 'Казахын бүргэдийн ан агнуурын уламжлалт наадам.' },
        emoji: '🦅',
        img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: '카라코룸 문화 축제', en: 'Karakorum Cultural Festival', mn: 'Хархорумын соёлын баяр' },
        date: { kr: '9월', en: 'September', mn: '9 сар' },
        location: { kr: '카라코룸', en: 'Karakorum', mn: 'Хархорум' },
        desc: { kr: '칭기즈칸 제국의 수도 카라코룸에서 열리는 역사·문화 축제. 전통 공연과 유적 탐방.', en: 'History and culture festival at the ancient Mongol Empire capital with performances and ruins.', mn: 'Монголын эзэнт гүрний нийслэлд болдог соёл, түүхийн баяр.' },
        emoji: '🏛️',
        img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: '울란바토르 국제 마라톤', en: 'UB International Marathon', mn: 'УБ олон улсын марафон' },
        date: { kr: '9월 중순', en: 'Mid September', mn: '9 сарын дунд' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '몽골 수도를 달리는 국제 마라톤. 풀코스(42km) 및 단거리 코스 운영.', en: 'International marathon through Mongolia\'s capital. Full (42km) and short course options.', mn: 'УБ хотоор дамжих олон улсын марафон. 42 км болон богино зай.' },
        emoji: '🏃',
        img: 'https://images.unsplash.com/photo-1600751267958-5bb0d08beb41?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  winter: {
    label: { kr: '겨울', en: 'Winter', mn: 'Өвөл' },
    months: { kr: '11–2월', en: 'Nov–Feb', mn: '11–2 сар' },
    emoji: '❄️',
    gradient: 'from-blue-400 to-indigo-600',
    active: 'bg-blue-500',
    list: [
      {
        name: { kr: '차강사르 (음력 설날)', en: 'Tsagaan Sar', mn: 'Цагаан сар' },
        date: { kr: '음력 1월 (1–2월)', en: 'Lunar Jan (Jan–Feb)', mn: '1–2 сар' },
        location: { kr: '전국', en: 'Nationwide', mn: 'Улс даяар' },
        desc: { kr: '몽골 최대 명절. 가족이 모여 전통 음식을 나누고 어른께 덕담을 드리는 귀한 문화.', en: "Mongolia's greatest holiday. Families share traditional food and pay respects to elders.", mn: 'Монголын хамгийн том баяр. Гэр бүл цугларч, хоол хуваалцаж, ахмадыг хүндэлнэ.' },
        emoji: '🎊',
        img: 'https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: '홉스골 얼음 축제', en: 'Khuvsgul Ice Festival', mn: 'Хөвсгөлийн мөсний наадам' },
        date: { kr: '2월 말 – 3월 초', en: 'Late Feb – Early Mar', mn: '2–3 сарын эхэн' },
        location: { kr: '홉스골 호수', en: 'Khuvsgul Lake', mn: 'Хөвсгөл нуур' },
        desc: { kr: '얼어붙은 홉스골 호수 위에서 개 썰매·스케이팅·얼음 조각 등 다양한 체험 진행.', en: 'Dog sledding, skating, and ice sculpture on the frozen Khuvsgul Lake.', mn: 'Хөлдсөн нуур дээр нохойн чарга, гулгаа, мөсний урлал.' },
        emoji: '🛷',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: '울란바토르 재즈 페스티벌', en: 'UB Jazz Festival', mn: 'УБ Жазын фестиваль' },
        date: { kr: '12월', en: 'December', mn: '12 сар' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '겨울 울란바토르에서 열리는 재즈 축제. 국내외 재즈 뮤지션들이 무대를 꾸밉니다.', en: 'Jazz festival in winter Ulaanbaatar featuring local and international musicians.', mn: 'УБ хотод өвлийн улиралд болдог жазын фестиваль.' },
        emoji: '🎷',
        img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  spring: {
    label: { kr: '봄', en: 'Spring', mn: 'Хавар' },
    months: { kr: '3–5월', en: 'Mar–May', mn: '3–5 сар' },
    emoji: '🌸',
    gradient: 'from-green-400 to-emerald-500',
    active: 'bg-emerald-500',
    list: [
      {
        name: { kr: '유목민 이동 축제', en: 'Nomad Migration Festival', mn: 'Нүүдлийн баяр' },
        date: { kr: '5월', en: 'May', mn: '5 сар' },
        location: { kr: '테를지 / 전국', en: 'Terelj / Nationwide', mn: 'Тэрэлж / Улс даяар' },
        desc: { kr: '봄을 맞아 유목민이 여름 캠프로 이동하는 전통 행사. 직접 이동에 참여할 수 있습니다.', en: "Traditional nomad spring migration to summer camps — visitors can join.", mn: 'Нүүдэлчид хаврын нүүдлийг хийх уламжлалт арга хэмжээ.' },
        emoji: '🐎',
        img: 'https://images.unsplash.com/photo-1535728534313-e206f59bed23?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: { kr: '봄 마두금 공연', en: 'Spring Morin Khuur Concert', mn: 'Хаврын морин хуурын тоглолт' },
        date: { kr: '4월', en: 'April', mn: '4 сар' },
        location: { kr: '울란바토르', en: 'Ulaanbaatar', mn: 'Улаанбаатар' },
        desc: { kr: '전통 마두금 연주와 함께 봄을 여는 문화 공연. 몽골 전통 음악의 정수를 느낄 수 있습니다.', en: 'Spring cultural concert with traditional Morin Khuur — the soul of Mongolian music.', mn: 'Хаврыг угтсан морин хуурын тоглолт, соёлын арга хэмжээ.' },
        emoji: '🎻',
        img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
}

const SORT_OPTIONS = [
  { key: 'rating', label: { kr: '평점 높은순', en: 'Top Rated', mn: 'Үнэлгээ' } },
  { key: 'name', label: { kr: '이름순', en: 'Alphabetical', mn: 'Нэр' } },
]

const BASE_PREP = {
  kr: ['여권 & 비자 확인', '현금 (투그릭)', '방풍 재킷', '자외선차단제 SPF50+', '개인 상비약', '보조 배터리'],
  en: ['Passport & visa', 'Cash (MNT)', 'Windproof jacket', 'Sunscreen SPF50+', 'Personal medication', 'Power bank'],
  mn: ['Паспорт, виз', 'Мөнгөн тугрик', 'Салхины куртка', 'Нарны тос SPF50+', 'Хувийн эм', 'Гадаад зарядны'],
}

const EXTRA_PREP = {
  omngov: {
    emoji: '🏜️',
    kr: ['모래 방진 마스크', '식수 충분히 (2L+)', '긴팔 · 긴바지', '선글라스', '낙타 투어 사전 예약'],
    en: ['Dust/sand mask', 'Plenty of water (2L+)', 'Long sleeves & pants', 'Sunglasses', 'Book camel tour in advance'],
    mn: ['Элсний маск', 'Ус хангалттай (2L+)', 'Урт ханцуйт хувцас', 'Нарны шил', 'Тэмээний аялал урьдчилан захиалах'],
  },
  dorngov: {
    emoji: '🌅',
    kr: ['모래 방진 마스크', '식수 충분히', '선글라스', '긴팔 · 긴바지'],
    en: ['Dust mask', 'Plenty of water', 'Sunglasses', 'Long sleeves & pants'],
    mn: ['Элсний маск', 'Ус хангалттай', 'Нарны шил', 'Урт ханцуйт хувцас'],
  },
  dundgov: {
    emoji: '🗿',
    kr: ['모래 방진 마스크', '식수 충분히', '선글라스', '유적 입장료 현금'],
    en: ['Dust mask', 'Plenty of water', 'Sunglasses', 'Cash for site fees'],
    mn: ['Элсний маск', 'Ус хангалттай', 'Нарны шил', 'Орох төлбөр мөнгөн'],
  },
  khuvsgul: {
    emoji: '💙',
    kr: ['방한복 (여름에도 필요)', '방수 등산화', '벌레 기피제', '낚싯대 (선택)', '캠핑 장비 (선택)'],
    en: ['Warm clothing (even in summer)', 'Waterproof boots', 'Insect repellent', 'Fishing gear (optional)', 'Camping gear (optional)'],
    mn: ['Дулаан хувцас (зун ч гэсэн)', 'Усны гутал', 'Шавьж зайлуулагч', 'Загас агнах хэрэгсэл', 'Тент, унтлагын уут'],
  },
  bayanolgii: {
    emoji: '🦅',
    kr: ['방한 장갑', '망원경', '카메라 (줌 렌즈)', '독수리 축제 일정 확인', '카자흐 문화 가이드북'],
    en: ['Warm gloves', 'Binoculars', 'Camera (zoom lens)', 'Check Eagle Festival dates', 'Kazakh culture guidebook'],
    mn: ['Гар бээлий', 'Дуран', 'Камер (зум)', 'Бүргэдийн наадмын хуваарь шалгах', 'Казахын соёлын лавлах'],
  },
  arkhangai: {
    emoji: '🏔️',
    kr: ['캠핑 장비 또는 게르 예약', '승마 복장 & 헬멧', '벌레 기피제', '등산화'],
    en: ['Camping gear or book ger stay', 'Horse riding clothes & helmet', 'Insect repellent', 'Hiking boots'],
    mn: ['Тент эсвэл гэр баазын захиалга', 'Морь унах хувцас, дуулга', 'Шавьж зайлуулагч', 'Уулын гутал'],
  },
  govaltai: {
    emoji: '🏔️',
    kr: ['방한복', '등산화', '고산병 예방약', '식수 충분히'],
    en: ['Warm clothing', 'Hiking boots', 'Altitude sickness pills', 'Plenty of water'],
    mn: ['Дулаан хувцас', 'Уулын гутал', 'Өндрийн өвчний эм', 'Ус хангалттай'],
  },
  ub: {
    emoji: '🏙️',
    kr: ['대기 오염 마스크', '로컬 유심 구매', '환전 (달러→투그릭)', '교통카드'],
    en: ['Air pollution mask', 'Buy local SIM card', 'Currency exchange', 'Transit card'],
    mn: ['Агаарын маск', 'Дотоодын SIM карт', 'Валют солих', 'Тээврийн карт'],
  },
}

export default function DesktopExplore() {
  const navigate = useNavigate()
  const { lang, tr } = useLang()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [region, setRegion] = useState('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('rating')
  const [selectedSeason, setSelectedSeason] = useState('summer')

  const filtered = locations
    .filter(loc => {
      const matchRegion = region === 'all' || LOCATION_PROVINCE[loc.id] === region
      const matchCat = category === 'all' || loc.category === category
      const q = search.toLowerCase()
      const matchSearch = !search ||
        Object.values(loc.name).some(n => n.toLowerCase().includes(q)) ||
        Object.values(loc.description).some(d => d.toLowerCase().includes(q))
      return matchRegion && matchCat && matchSearch
    })
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : a.name[lang].localeCompare(b.name[lang]))

  const hasFilters = region !== 'all' || category !== 'all' || search

  const filteredProvinces = (search || region !== 'all')
    ? provinceLocations.filter(loc => {
        const provKey = PROVINCE_MN_TO_KEY[loc.province]
        const matchRegion = region === 'all' || provKey === region
        const matchSearch = !search ||
          loc.name.toLowerCase().includes(search.toLowerCase()) ||
          loc.province.toLowerCase().includes(search.toLowerCase())
        return matchRegion && matchSearch
      }).slice(0, region !== 'all' ? 50 : 12)
    : []

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">{tr('explore_title')}</h1>
          <p className="text-gray-500">몽골의 모든 여행지를 탐색해보세요 — {locations.length}개의 목적지</p>

          {/* Search bar */}
          <div className="flex items-center gap-3 mt-5 max-w-2xl">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tr('search_placeholder')}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label[lang]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-5">

              {/* Region filter — 21 aimags */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  {lang === 'kr' ? '지역 (아이막)' : lang === 'en' ? 'Region (Aimag)' : 'Аймаг'}
                  <span className="ml-auto text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">21</span>
                </h3>
                <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
                  {PROVINCES.map(p => (
                    <button
                      key={p.key}
                      onClick={() => setRegion(p.key)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        region === p.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p.emoji && <span className="text-base leading-none">{p.emoji}</span>}
                      <span className={p.key === 'all' ? 'font-bold' : ''}>{p.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-3">
                  {lang === 'kr' ? '카테고리' : lang === 'en' ? 'Category' : 'Ангилал'}
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        category === c.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{c.emoji}</span>
                      {c.label[lang]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 준비물 카드 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <span className="text-base">🎒</span>
                  {lang === 'kr' ? '준비물' : lang === 'en' ? 'Packing List' : 'Бэлтгэх зүйлс'}
                  {region !== 'all' && EXTRA_PREP[region] && (
                    <span className="ml-auto text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      {EXTRA_PREP[region].emoji}
                    </span>
                  )}
                </h3>
                <div className="space-y-1.5">
                  {/* Base items */}
                  {BASE_PREP[lang].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">✓</span>
                      {item}
                    </div>
                  ))}
                  {/* Region-specific extras */}
                  {region !== 'all' && EXTRA_PREP[region] && (
                    <>
                      <div className="border-t border-dashed border-gray-200 pt-1.5 mt-1.5">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
                          {lang === 'kr' ? '지역 추가 준비물' : lang === 'en' ? 'Region extras' : 'Нэмэлт бэлтгэл'}
                        </p>
                        {EXTRA_PREP[region][lang].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-orange-700 mb-1">
                            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 text-[9px]">+</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Reset */}
              {hasFilters && (
                <button
                  onClick={() => { setRegion('all'); setCategory('all'); setSearch('') }}
                  className="w-full py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:border-primary hover:text-primary transition-all"
                >
                  {lang === 'kr' ? '필터 초기화' : lang === 'en' ? 'Reset Filters' : 'Шүүлт арилгах'}
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm">
                <span className="font-bold text-gray-900">{filtered.length}</span>개의 여행지
              </p>
              {hasFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  {region !== 'all' && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      {PROVINCES.find(p => p.key === region)?.emoji} {PROVINCES.find(p => p.key === region)?.label[lang]}
                      <button onClick={() => setRegion('all')}><X size={12} /></button>
                    </span>
                  )}
                  {category !== 'all' && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      {CATEGORIES.find(c => c.key === category)?.label[lang]}
                      <button onClick={() => setCategory('all')}><X size={12} /></button>
                    </span>
                  )}
                  {search && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      "{search}"
                      <button onClick={() => setSearch('')}><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 액티비티·축제 통합 뷰 */}
            {category === 'activity' ? (
              <div className="space-y-10">
                {/* 축제 섹션 */}
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-1">🎉 {lang === 'kr' ? '계절 축제' : lang === 'en' ? 'Seasonal Festivals' : 'Улирлын наадам'}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {lang === 'kr' ? '계절별 몽골 축제 & 여행 하이라이트' : lang === 'en' ? 'Mongolia festivals & highlights by season' : 'Улирлаар Монголын наадам & онцлох зүйлс'}
                  </p>
                  {/* Season tabs */}
                  <div className="flex gap-2 mb-5">
                    {Object.entries(FESTIVALS).map(([key, s]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedSeason(key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                          selectedSeason === key
                            ? `bg-gradient-to-r ${s.gradient} text-white shadow-md`
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label[lang]}</span>
                        <span className={`text-xs font-normal ${selectedSeason === key ? 'text-white/80' : 'text-gray-400'}`}>
                          {s.months[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* Festival cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {FESTIVALS[selectedSeason].list.map((fest, i) => (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-gray-100">
                        <div className="relative h-44 overflow-hidden">
                          <img src={fest.img} alt={fest.name[lang]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-white font-black text-base leading-tight">
                              {fest.emoji} {fest.name[lang]}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center gap-1 text-xs text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
                              <CalendarDays size={11} />
                              {fest.date[lang]}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} />
                              {fest.location[lang]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{fest.desc[lang]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 액티비티 여행지 섹션 */}
                {filtered.length > 0 && (
                  <div>
                    <h2 className="text-lg font-black text-gray-900 mb-4">🐎 {lang === 'kr' ? '액티비티 여행지' : lang === 'en' ? 'Activity Destinations' : 'Үйл ажиллагааны газрууд'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filtered.map(loc => (
                        <div
                          key={loc.id}
                          onClick={() => navigate(`/explore/${loc.id}`)}
                          className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative h-52 overflow-hidden">
                            <img src={loc.image} alt={loc.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              <Star size={11} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-bold text-gray-800">{loc.rating}</span>
                            </div>
                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                              {loc.tags[lang].slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/30">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{loc.name[lang]}</h3>
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{loc.description[lang]}</p>
                            <div className="flex items-center gap-3 text-gray-400">
                              <div className="flex items-center gap-1"><Clock size={11} /><span className="text-xs">{loc.duration[lang]}</span></div>
                              <div className="flex items-center gap-1"><CalendarDays size={11} /><span className="text-xs">{loc.season[lang]}</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Main destination cards */}
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(loc => (
                      <div
                        key={loc.id}
                        onClick={() => navigate(`/explore/${loc.id}`)}
                        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={loc.image}
                            alt={loc.name[lang]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Star size={11} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-gray-800">{loc.rating}</span>
                          </div>
                          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                            {loc.tags[lang].slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{loc.name[lang]}</h3>
                          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{loc.description[lang]}</p>
                          <div className="flex items-center gap-3 text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock size={11} />
                              <span className="text-xs">{loc.duration[lang]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDays size={11} />
                              <span className="text-xs">{loc.season[lang]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProvinces.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg font-medium mb-2">검색 결과가 없습니다</p>
                    <p className="text-gray-400 text-sm">다른 키워드나 필터를 사용해보세요</p>
                  </div>
                ) : null}

                {/* Province / map locations */}
                {filteredProvinces.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} className="text-purple-500" />
                      <h2 className="text-base font-black text-gray-800">
                        {lang === 'kr' ? '지도 명소' : lang === 'mn' ? 'Газрын зургийн газрууд' : 'Map Attractions'}
                      </h2>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filteredProvinces.length}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {filteredProvinces.map(loc => (
                        <div
                          key={loc.id}
                          onClick={() => navigate('/map')}
                          className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all group"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                            <MapPin size={14} className="text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{loc.name}</p>
                            <p className="text-xs text-gray-400">{loc.province}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-purple-500 flex-shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
