// Transport route data for Mongolia — real schedules and booking links.
// Departures from international cities route via UB first (2-step journey).

export const DEPARTURE_CITIES = [
  { key: 'ub',      kr: '울란바토르 (몽골)',  en: 'Ulaanbaatar (Mongolia)', mn: 'Улаанбаатар',  flag: '🇲🇳', intl: false },
  { key: 'seoul',   kr: '서울 / 인천',        en: 'Seoul / Incheon',        mn: 'Сөүл / Инчоон', flag: '🇰🇷', intl: true  },
  { key: 'tokyo',   kr: '도쿄',               en: 'Tokyo',                  mn: 'Токио',          flag: '🇯🇵', intl: true  },
  { key: 'beijing', kr: '베이징',             en: 'Beijing',                mn: 'Бээжин',         flag: '🇨🇳', intl: true  },
  { key: 'moscow',  kr: '모스크바',           en: 'Moscow',                 mn: 'Москва',         flag: '🇷🇺', intl: true  },
]

export const DESTINATIONS = [
  { key: 'terelj',     kr: '테를지 국립공원',          en: 'Terelj National Park',      mn: 'Тэрэлж',           emoji: '⛺' },
  { key: 'kharkhorin', kr: '카라코룸 (하르호린)',       en: 'Kharkhorin (Karakorum)',     mn: 'Хархорин',         emoji: '🏛️' },
  { key: 'gobi',       kr: '고비 사막 (달란자드가드)',  en: 'Gobi Desert (Dalanzadgad)', mn: 'Говь (Даланзадгад)', emoji: '🏜️' },
  { key: 'khuvsgul',   kr: '허브스골 호수 (무룬)',      en: 'Khuvsgul Lake (Mörön)',      mn: 'Хөвсгөл (Мөрөн)',  emoji: '🏔️' },
  { key: 'bayan',      kr: '바얀울기 (독수리 축제)',    en: 'Bayan-Olgii (Eagle Festival)', mn: 'Баян-Өлгий',      emoji: '🦅' },
  { key: 'erdenet',    kr: '에르데넷',                 en: 'Erdenet',                    mn: 'Эрдэнэт',          emoji: '🏙️' },
  { key: 'darkhan',    kr: '다르항',                   en: 'Darkhan',                    mn: 'Дархан',           emoji: '🌆' },
]

// Each option:
//   type         — 'bus' | 'flight' | 'jeep' | 'train' | 'taxi'
//   emoji, label — display
//   departs      — string or null
//   duration     — { kr, en, mn }
//   cost         — { kr, en, mn }
//   pickup       — { kr, en, mn } or null
//   link / linkLabel — booking URL and display name
//   note         — { kr, en, mn } or null

const T = {
  // ─── UB departures ───────────────────────────────────────────────────────
  'ub→terelj': {
    dist_km: 80,
    options: [
      { type: 'jeep', emoji: '🚐',
        label: { kr: '공용 지프·미니버스', en: 'Shared jeep / minibus', mn: 'Нийтийн жийп' },
        departs: '07:00 ~ 15:00',
        duration: { kr: '약 1.5~2시간', en: '~1.5-2 h', mn: '~1.5-2 ц' },
        cost: { kr: '10,000~15,000 MNT', en: '10,000-15,000 MNT (~$3-4)', mn: '10,000-15,000 ₮' },
        pickup: { kr: 'UB 중앙 버스터미널 (나란툴)', en: 'UB Narantuul / Dragon Bus Terminal', mn: 'УБ Нарантуул / Дрэгон Бусны буудал' },
        link: null, linkLabel: null,
        note: { kr: '수시 출발 — 예약 불필요', en: 'Runs throughout the day — no reservation needed', mn: 'Өдөрт олон удаа, урьдчилж захиалах шаардлагагүй' } },
      { type: 'taxi', emoji: '🚗',
        label: { kr: '전용 차량 (UBCab)', en: 'Private car (UBCab)', mn: 'Хувийн машин (UBCab)' },
        departs: null,
        duration: { kr: '약 1.5시간', en: '~1.5 h', mn: '~1.5 ц' },
        cost: { kr: '약 60,000~80,000 MNT', en: '~$18-25 USD', mn: '~60,000-80,000 ₮' },
        pickup: { kr: 'UB 시내 어디서나', en: 'Anywhere in UB', mn: 'УБ хаанаас ч' },
        link: 'https://ubcab.mn', linkLabel: 'UBCab',
        note: { kr: 'UBCab 앱에서 즉시 예약 가능', en: 'Book instantly via UBCab app', mn: 'UBCab аппаар шуурхай захиалах' } },
    ],
  },

  'ub→kharkhorin': {
    dist_km: 365,
    options: [
      { type: 'bus', emoji: '🚌',
        label: { kr: '드래곤버스', en: 'Dragon Bus', mn: 'Дрэгон Бус' },
        departs: '07:00 / 09:00',
        duration: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' },
        cost: { kr: '약 25,000 MNT', en: '~25,000 MNT (~$7)', mn: '~25,000 ₮' },
        pickup: { kr: '바얀주르흐 텡게르 플라자 / 드래곤버스 터미널', en: 'Bayanzurkh Tenger Plaza / Dragon Bus Terminal', mn: 'Баянзүрх Тэнгэр Плаза / Дрэгон Бусны буудал' },
        link: 'https://dragonbus.mn', linkLabel: 'dragonbus.mn',
        note: { kr: '성수기(7-8월) 사전 예약 필수', en: 'Advance booking required Jul-Aug peak season', mn: '7-8 сард урьдчилж захиал' } },
      { type: 'jeep', emoji: '🚗',
        label: { kr: '전용 차량 (투어 에이전시)', en: 'Private car / tour agency', mn: 'Хувийн машин / аялал компани' },
        departs: null,
        duration: { kr: '약 4시간', en: '~4 h', mn: '~4 ц' },
        cost: { kr: '약 150,000~250,000 MNT ($45-75)', en: '~$45-75 USD (whole car)', mn: '~150,000-250,000 ₮' },
        pickup: { kr: 'UB 호텔 픽업 가능', en: 'UB hotel pick-up available', mn: 'УБ-ийн зочид буудлаас авна' },
        link: 'https://ubcab.mn', linkLabel: 'UBCab',
        note: { kr: '투어 에이전시 또는 UBCab 앱', en: 'Book via UBCab app or local tour agency', mn: 'UBCab эсвэл аялал компани' } },
    ],
  },

  'ub→gobi': {
    dist_km: 550,
    options: [
      { type: 'bus', emoji: '🚌',
        label: { kr: '드래곤버스', en: 'Dragon Bus', mn: 'Дрэгон Бус' },
        departs: '07:00',
        duration: { kr: '약 8~9시간', en: '~8-9 h', mn: '~8-9 ц' },
        cost: { kr: '약 35,000 MNT', en: '~35,000 MNT (~$10)', mn: '~35,000 ₮' },
        pickup: { kr: '바얀주르흐 텡게르 플라자 / 드래곤버스 터미널', en: 'Bayanzurkh Tenger Plaza / Dragon Bus Terminal', mn: 'Баянзүрх Тэнгэр Плаза / Дрэгон Бусны буудал' },
        link: 'https://dragonbus.mn', linkLabel: 'dragonbus.mn',
        note: { kr: '목적지: 달란자드가드 (고비 입구)', en: 'Arrives at Dalanzadgad (Gobi gateway)', mn: 'Даланзадгад хүрч ирнэ' } },
      { type: 'flight', emoji: '✈️',
        label: { kr: '국내선 항공', en: 'Domestic flight', mn: 'Дотоодын нислэг' },
        departs: '07:30~ (복수)',
        duration: { kr: '약 1.5시간', en: '~1.5 h', mn: '~1.5 ц' },
        cost: { kr: '약 $80~150 USD', en: '~$80-150 USD', mn: '~$80-150 USD' },
        pickup: { kr: 'UB 징기스칸 국제공항', en: 'Chinggis Khaan Int\'l Airport (UBN)', mn: 'Чингис хааны нисэх буудал (UBN)' },
        link: 'https://www.hunnuair.com', linkLabel: 'Hunnu Air',
        note: { kr: 'Hunnu Air 또는 Aero Mongolia 운항', en: 'Hunnu Air or Aero Mongolia', mn: 'Хуннү эсвэл Аэро Монгол' } },
    ],
  },

  'ub→khuvsgul': {
    dist_km: 671,
    options: [
      { type: 'flight', emoji: '✈️',
        label: { kr: '국내선 (무룬행)', en: 'Domestic flight → Mörön', mn: 'Дотоодын нислэг → Мөрөн' },
        departs: '07:30~',
        duration: { kr: '약 1.5시간 + 지프 2시간', en: '~1.5 h flight + 2 h jeep to lake', mn: '~1.5 ц нислэг + 2 ц жийп' },
        cost: { kr: '$100~180 항공 + 지프 약 30,000 MNT', en: '~$100-180 flight + $9 jeep to lake', mn: '~$100-180 нислэг + жийп 30,000 ₮' },
        pickup: { kr: 'UB 징기스칸 국제공항', en: 'Chinggis Khaan Int\'l Airport (UBN)', mn: 'Чингис хааны нисэх буудал' },
        link: 'https://aeromongolia.mn', linkLabel: 'Aero Mongolia',
        note: { kr: '무룬 도착 → 지프로 허브스골 (약 100km, 2시간)', en: 'Mörön arrival → shared jeep to Khuvsgul ~100km 2h', mn: 'Мөрөн → жийпээр Хөвсгөл ~100км 2ц' } },
      { type: 'bus', emoji: '🚌',
        label: { kr: '장거리 버스 (비추천)', en: 'Long-distance bus (not recommended)', mn: 'Хол зайн автобус (санал болгохгүй)' },
        departs: '07:00',
        duration: { kr: '약 12~15시간', en: '~12-15 h', mn: '~12-15 ц' },
        cost: { kr: '약 40,000 MNT', en: '~40,000 MNT (~$12)', mn: '~40,000 ₮' },
        pickup: { kr: 'UB 중앙 버스터미널', en: 'UB Central Bus Terminal', mn: 'УБ Төв автовокзал' },
        link: null, linkLabel: null,
        note: { kr: '매우 긴 비포장 도로 — 항공 강력 추천', en: 'Very long dirt-road journey — flight strongly recommended', mn: 'Маш урт хайрган зам — нислэгийг зөвлөж байна' } },
    ],
  },

  'ub→bayan': {
    dist_km: 1700,
    options: [
      { type: 'flight', emoji: '✈️',
        label: { kr: '국내선 항공 (유일한 현실적 옵션)', en: 'Domestic flight (only realistic option)', mn: 'Дотоодын нислэг (цорын ганц сонголт)' },
        departs: '08:00~',
        duration: { kr: '약 2시간', en: '~2 h', mn: '~2 ц' },
        cost: { kr: '$150~250 USD', en: '~$150-250 USD', mn: '~$150-250 USD' },
        pickup: { kr: 'UB 징기스칸 국제공항', en: 'Chinggis Khaan Int\'l Airport (UBN)', mn: 'Чингис хааны нисэх буудал' },
        link: 'https://www.hunnuair.com', linkLabel: 'Hunnu Air',
        note: { kr: '독수리 축제(10월 초) 기간 예약 매우 빠름', en: 'Books up fast during Eagle Festival (early Oct)', mn: '10 сарын наадам үеэр захиалга хурдан дуусдаг' } },
    ],
  },

  'ub→erdenet': {
    dist_km: 374,
    options: [
      { type: 'bus', emoji: '🚌',
        label: { kr: '드래곤버스', en: 'Dragon Bus', mn: 'Дрэгон Бус' },
        departs: '07:00',
        duration: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' },
        cost: { kr: '약 20,000 MNT', en: '~20,000 MNT (~$6)', mn: '~20,000 ₮' },
        pickup: { kr: '바얀주르흐 텡게르 플라자 / 드래곤버스 터미널', en: 'Bayanzurkh Tenger Plaza / Dragon Bus Terminal', mn: 'Баянзүрх Тэнгэр Плаза / Дрэгон Бусны буудал' },
        link: 'https://dragonbus.mn', linkLabel: 'dragonbus.mn',
        note: null },
    ],
  },

  'ub→darkhan': {
    dist_km: 220,
    options: [
      { type: 'bus', emoji: '🚌',
        label: { kr: '드래곤버스', en: 'Dragon Bus', mn: 'Дрэгон Бус' },
        departs: '07:00 / 10:00 / 14:00',
        duration: { kr: '약 3시간', en: '~3 h', mn: '~3 ц' },
        cost: { kr: '약 12,000 MNT', en: '~12,000 MNT (~$3.5)', mn: '~12,000 ₮' },
        pickup: { kr: '바얀주르흐 텡게르 플라자 / 드래곤버스 터미널', en: 'Bayanzurkh Tenger Plaza / Dragon Bus Terminal', mn: 'Баянзүрх Тэнгэр Плаза / Дрэгон Бусны буудал' },
        link: 'https://dragonbus.mn', linkLabel: 'dragonbus.mn',
        note: null },
      { type: 'train', emoji: '🚂',
        label: { kr: '기차 (УБТЗ)', en: 'Train (Trans-Mongolian)', mn: 'Галт тэрэг (УБТЗ)' },
        departs: '복수 운행',
        duration: { kr: '약 3.5시간', en: '~3.5 h', mn: '~3.5 ц' },
        cost: { kr: '약 8,000~15,000 MNT', en: '~8,000-15,000 MNT', mn: '~8,000-15,000 ₮' },
        pickup: { kr: 'UB 중앙역', en: 'Ulaanbaatar Central Train Station', mn: 'Улаанбаатар галт тэрэгний буудал' },
        link: null, linkLabel: null,
        note: { kr: '트란스-몽골리안 철도 (베이징-모스크바 라인)', en: 'Trans-Mongolian railway (Beijing-Moscow line)', mn: 'Транс-Монгол төмөр зам (Бээжин-Москва шугам)' } },
    ],
  },

  // ─── International → UB ──────────────────────────────────────────────────
  'seoul→ub': {
    dist_km: 2100,
    options: [
      { type: 'flight', emoji: '✈️',
        label: { kr: '인천 → 울란바토르 직항', en: 'Incheon (ICN) → Ulaanbaatar direct', mn: 'Инчоон → Улаанбаатар шууд нислэг' },
        departs: '복수 운항 (매일)',
        duration: { kr: '약 3시간 30분', en: '~3 h 30 m', mn: '~3 ц 30 мин' },
        cost: { kr: '왕복 약 $300~600', en: '~$300-600 round trip', mn: '~$300-600 (очих, ирэх)' },
        pickup: { kr: '인천국제공항 (ICN)', en: 'Incheon International Airport (ICN)', mn: 'Инчоон олон улсын нисэх буудал' },
        link: 'https://www.hunnuair.com', linkLabel: 'Hunnu Air / MIAT / Korean Air',
        note: { kr: 'Hunnu Air, MIAT 몽골항공, 대한항공 운항', en: 'Hunnu Air, MIAT Mongolian Airlines, Korean Air', mn: 'Хуннү, МИАТ, Korean Air' } },
    ],
  },

  'tokyo→ub': {
    dist_km: 3000,
    options: [
      { type: 'flight', emoji: '✈️',
        label: { kr: '도쿄 → 울란바토르 직항', en: 'Tokyo → Ulaanbaatar direct', mn: 'Токио → Улаанбаатар шууд нислэг' },
        departs: '복수 운항',
        duration: { kr: '약 4시간', en: '~4 h', mn: '~4 ц' },
        cost: { kr: '왕복 약 $400~700', en: '~$400-700 round trip', mn: '~$400-700' },
        pickup: { kr: '나리타 / 하네다 공항', en: 'Narita (NRT) / Haneda (HND)', mn: 'Нарита / Ханеда нисэх буудал' },
        link: 'https://www.hunnuair.com', linkLabel: 'Hunnu Air / MIAT',
        note: { kr: 'MIAT 몽골항공, Hunnu Air 운항', en: 'MIAT Mongolian Airlines, Hunnu Air', mn: 'МИАТ, Хуннү' } },
    ],
  },

  'beijing→ub': {
    dist_km: 1520,
    options: [
      { type: 'flight', emoji: '✈️',
        label: { kr: '베이징 → 울란바토르 직항', en: 'Beijing → Ulaanbaatar direct', mn: 'Бээжин → Улаанбаатар шууд нислэг' },
        departs: '복수 운항',
        duration: { kr: '약 2시간', en: '~2 h', mn: '~2 ц' },
        cost: { kr: '왕복 약 $200~400', en: '~$200-400 round trip', mn: '~$200-400' },
        pickup: { kr: '수도 공항 (PEK / PKX)', en: 'Beijing Capital (PEK) / Daxing (PKX)', mn: 'Бээжингийн нисэх буудал' },
        link: null, linkLabel: 'MIAT / Air China',
        note: { kr: 'MIAT 몽골항공, 에어차이나 운항', en: 'MIAT Mongolian Airlines, Air China', mn: 'МИАТ, Air China' } },
      { type: 'train', emoji: '🚂',
        label: { kr: '트란스-몽골리안 열차', en: 'Trans-Mongolian Railway', mn: 'Транс-Монгол галт тэрэг' },
        departs: '주 1~2회',
        duration: { kr: '약 30시간', en: '~30 h', mn: '~30 ц' },
        cost: { kr: '약 $80~200 (클래스별)', en: '~$80-200 USD (by class)', mn: '~$80-200 USD' },
        pickup: { kr: '베이징역 (Beijing Station)', en: 'Beijing Railway Station', mn: 'Бээжингийн галт тэрэгний буудал' },
        link: null, linkLabel: null,
        note: { kr: '고비 사막 통과 — 아이코닉 여행 경험', en: 'Crosses the Gobi Desert — iconic experience', mn: 'Говийн цөлийг дайрна — домогт туршлага' } },
    ],
  },

  'moscow→ub': {
    dist_km: 5700,
    options: [
      { type: 'flight', emoji: '✈️',
        label: { kr: '모스크바 → 울란바토르 직항', en: 'Moscow → Ulaanbaatar direct', mn: 'Москва → Улаанбаатар шууд нислэг' },
        departs: '복수 운항',
        duration: { kr: '약 6~7시간', en: '~6-7 h', mn: '~6-7 ц' },
        cost: { kr: '왕복 약 $400~700', en: '~$400-700 round trip', mn: '~$400-700' },
        pickup: { kr: '셰레메티예보 공항 (SVO)', en: 'Sheremetyevo Airport (SVO)', mn: 'Шереметьево нисэх буудал (SVO)' },
        link: null, linkLabel: 'MIAT / Aeroflot',
        note: { kr: 'MIAT 몽골항공, 아에로플로트 운항', en: 'MIAT Mongolian Airlines, Aeroflot', mn: 'МИАТ, Аэрофлот' } },
      { type: 'train', emoji: '🚂',
        label: { kr: '트란스-시베리아 / 몽골 열차', en: 'Trans-Siberian / Trans-Mongolian train', mn: 'Транс-Сибирийн галт тэрэг' },
        departs: '주 1회',
        duration: { kr: '약 4~5일', en: '~4-5 days', mn: '~4-5 өдөр' },
        cost: { kr: '$150~400 (클래스별)', en: '$150-400 by class', mn: '$150-400' },
        pickup: { kr: '야로슬라블역 (모스크바)', en: 'Yaroslavsky Station, Moscow', mn: 'Ярославский буудал, Москва' },
        link: null, linkLabel: null,
        note: { kr: '세계 최장 철도 여행 — 버킷리스트 경험', en: 'World\'s longest railway journey — bucket-list experience', mn: 'Дэлхийн хамгийн урт төмөр зам' } },
    ],
  },
}

export { T as ROUTES }

// Returns { international: bool, step1: route|null, step2: route|null }
export function findRoute(fromKey, toKey) {
  const departure = DEPARTURE_CITIES.find(d => d.key === fromKey)
  if (!departure) return null

  if (!departure.intl) {
    // domestic — direct route
    const route = T[`${fromKey}→${toKey}`] || null
    return { international: false, step1: null, step2: route }
  } else {
    // international — two steps: city→UB, then UB→dest
    const step1 = T[`${fromKey}→ub`] || null
    const step2 = toKey === 'ub' ? null : (T[`ub→${toKey}`] || null)
    return { international: true, step1, step2 }
  }
}
