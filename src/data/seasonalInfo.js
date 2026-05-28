export const MONTH_NAMES = {
  kr: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  mn: ['1-р','2-р','3-р','4-р','5-р','6-р','7-р','8-р','9-р','10-р','11-р','12-р'],
}

// Per-month season highlights, popular routes, and real transport options.
// season key must match the SEASONS constant in each planner component.
export const SEASONAL_INFO = {
  1: {
    season: 'winter', temp: '-30 ~ -15°C',
    events: [
      { kr: '🎣 얼음 낚시 & 개썰매', en: '🎣 Ice fishing & dog sledding', mn: '🎣 Мөсний загасчлал' },
    ],
    topRoutes: [
      { kr: 'UB → 테를지 (빙판 체험)', en: 'UB → Terelj (ice activities)', mn: 'УБ → Тэрэлж (мөс)' },
    ],
    buses: [
      { label: { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' }, departs: '07:00 ~ 15:00', dur: { kr: '약 1.5시간', en: '~1.5 h', mn: '~1.5 ц' }, note: { kr: '공용 지프·미니버스', en: 'Shared jeep / minibus', mn: 'Жийп / автобус' } },
    ],
  },
  2: {
    season: 'winter', temp: '-25 ~ -10°C',
    events: [
      { kr: '🧊 허브스골 얼음 축제 (2월 말)', en: '🧊 Khuvsgul Ice Festival (late Feb)', mn: '🧊 Хөвсгөлийн мөсний наадам' },
    ],
    topRoutes: [
      { kr: 'UB → 허브스골 (항공)', en: 'UB → Khuvsgul (flight)', mn: 'УБ → Хөвсгөл (нислэг)' },
    ],
    buses: [
      { label: { kr: 'UB → 무룬 (항공)', en: 'UB → Mörön (flight)', mn: 'УБ → Мөрөн (нислэг)' }, departs: '07:30~', dur: { kr: '약 1.5시간', en: '~1.5 h', mn: '~1.5 ц' }, note: { kr: 'Hunnu Air / Aero Mongolia', en: 'Hunnu Air / Aero Mongolia', mn: 'Хуннү / Аэро Монгол' } },
    ],
  },
  3: {
    season: 'spring', temp: '-10 ~ +8°C',
    events: [
      { kr: '🌱 초원 해빙기 — 트레킹 시즌 시작', en: '🌱 Steppe thaws — trekking begins', mn: '🌱 Хаврын хэрийн эхлэл' },
    ],
    topRoutes: [
      { kr: 'UB → 고비 사막', en: 'UB → Gobi Desert', mn: 'УБ → Говь' },
      { kr: 'UB → 카라코룸', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' },
    ],
    buses: [
      { label: { kr: 'UB → 하르호린', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '🚌 드래곤버스 매일 운행', en: '🚌 Dragon Bus daily', mn: '🚌 Дрэгон Бус өдөр бүр' } },
      { label: { kr: 'UB → 달란자드가드 (고비)', en: 'UB → Dalanzadgad (Gobi)', mn: 'УБ → Даланзадгад' }, departs: '07:00', dur: { kr: '약 8-9시간', en: '~8-9 h', mn: '~8-9 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
    ],
  },
  4: {
    season: 'spring', temp: '0 ~ +15°C',
    events: [
      { kr: '🌸 봄 초원 & 트레킹 시즌', en: '🌸 Green steppe & trekking season', mn: '🌸 Хаврын аяллын улирал' },
    ],
    topRoutes: [
      { kr: 'UB → 카라코룸', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' },
      { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' },
    ],
    buses: [
      { label: { kr: 'UB → 하르호린', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '🚌 드래곤버스 매일', en: '🚌 Dragon Bus daily', mn: '🚌 Дрэгон Бус өдөр бүр' } },
    ],
  },
  5: {
    season: 'spring', temp: '+5 ~ +20°C',
    events: [
      { kr: '🟢 초록 초원 시즌 시작!', en: '🟢 Lush green steppe season!', mn: '🟢 Ногоон хэрийн улирал!' },
    ],
    topRoutes: [
      { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' },
      { kr: 'UB → 카라코룸', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' },
      { kr: 'UB → 고비 사막', en: 'UB → Gobi Desert', mn: 'УБ → Говь' },
    ],
    buses: [
      { label: { kr: 'UB → 하르호린', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
      { label: { kr: 'UB → 달란자드가드 (고비)', en: 'UB → Dalanzadgad (Gobi)', mn: 'УБ → Даланзадгад' }, departs: '07:00', dur: { kr: '약 8-9시간', en: '~8-9 h', mn: '~8-9 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
    ],
  },
  6: {
    season: 'summer', temp: '+15 ~ +25°C',
    events: [
      { kr: '💧 허브스골 호수 하이킹 시즌', en: '💧 Khuvsgul Lake hiking season', mn: '💧 Хөвсгөл нуурын хайкинг' },
    ],
    topRoutes: [
      { kr: 'UB → 허브스골', en: 'UB → Khuvsgul', mn: 'УБ → Хөвсгөл' },
      { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' },
    ],
    buses: [
      { label: { kr: 'UB → 하르호린', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
      { label: { kr: 'UB → 무룬 (항공)', en: 'UB → Mörön (flight)', mn: 'УБ → Мөрөн (нислэг)' }, departs: '07:30~', dur: { kr: '약 1.5시간', en: '~1.5 h', mn: '~1.5 ц' }, note: { kr: 'Hunnu Air / Aero Mongolia', en: 'Hunnu Air / Aero Mongolia', mn: 'Хуннү / Аэро Монгол' } },
    ],
  },
  7: {
    season: 'summer', temp: '+20 ~ +30°C',
    events: [
      { kr: '🎉 나담 축제 7월 11-13일', en: '🎉 Naadam Festival Jul 11-13', mn: '🎉 Наадам баяр 7/11-13' },
      { kr: '☀️ 최고의 여행 시즌', en: '☀️ Best travel season', mn: '☀️ Оргил аяллын улирал' },
    ],
    topRoutes: [
      { kr: 'UB → 카라코룸 (나담)', en: 'UB → Kharkhorin (Naadam)', mn: 'УБ → Хархорин (Наадам)' },
      { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' },
      { kr: 'UB → 허브스골', en: 'UB → Khuvsgul', mn: 'УБ → Хөвсгөл' },
    ],
    buses: [
      { label: { kr: 'UB → 하르호린 (나담)', en: 'UB → Kharkhorin (Naadam)', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '⚠️ 성수기 사전예약 필수', en: '⚠️ Book early — peak season', mn: '⚠️ Урьдчилж захиал' } },
      { label: { kr: 'UB → 달란자드가드 (고비)', en: 'UB → Dalanzadgad (Gobi)', mn: 'УБ → Даланзадгад' }, departs: '07:00', dur: { kr: '약 9시간', en: '~9 h', mn: '~9 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
    ],
  },
  8: {
    season: 'summer', temp: '+18 ~ +28°C',
    events: [
      { kr: '🐎 승마·게르 캠프 최성수기', en: '🐎 Peak horseback & ger camp season', mn: '🐎 Морьт аялал ба гэр бааз' },
    ],
    topRoutes: [
      { kr: 'UB → 고비 사막', en: 'UB → Gobi Desert', mn: 'УБ → Говь' },
      { kr: 'UB → 허브스골', en: 'UB → Khuvsgul', mn: 'УБ → Хөвсгөл' },
    ],
    buses: [
      { label: { kr: 'UB → 달란자드가드', en: 'UB → Dalanzadgad', mn: 'УБ → Даланзадгад' }, departs: '07:00', dur: { kr: '약 9시간', en: '~9 h', mn: '~9 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
      { label: { kr: 'UB → 하르호린', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
    ],
  },
  9: {
    season: 'fall', temp: '+5 ~ +20°C',
    events: [
      { kr: '🍂 단풍 시즌 & 비수기 (저렴)', en: '🍂 Autumn colours & off-peak (great value)', mn: '🍂 Намрын улирал · хямд' },
    ],
    topRoutes: [
      { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' },
      { kr: 'UB → 카라코룸', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' },
    ],
    buses: [
      { label: { kr: 'UB → 하르호린', en: 'UB → Kharkhorin', mn: 'УБ → Хархорин' }, departs: '07:00 / 09:00', dur: { kr: '약 5시간', en: '~5 h', mn: '~5 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
    ],
  },
  10: {
    season: 'fall', temp: '-5 ~ +10°C',
    events: [
      { kr: '🦅 독수리 축제 (바얀울기, 10월 초)', en: '🦅 Eagle Festival (Bayan-Olgii, early Oct)', mn: '🦅 Бүргэдийн наадам (Баян-Өлгий)' },
    ],
    topRoutes: [
      { kr: 'UB → 바얀울기 (항공)', en: 'UB → Bayan-Olgii (flight)', mn: 'УБ → Баян-Өлгий (нислэг)' },
      { kr: 'UB → 고비 사막', en: 'UB → Gobi Desert', mn: 'УБ → Говь' },
    ],
    buses: [
      { label: { kr: 'UB → 바얀울기 (항공)', en: 'UB → Bayan-Olgii (flight)', mn: 'УБ → Баян-Өлгий' }, departs: '08:00~', dur: { kr: '약 2시간', en: '~2 h', mn: '~2 ц' }, note: { kr: 'Hunnu Air / Aero Mongolia', en: 'Hunnu Air / Aero Mongolia', mn: 'Хуннү / Аэро Монгол' } },
      { label: { kr: 'UB → 달란자드가드 (고비)', en: 'UB → Dalanzadgad', mn: 'УБ → Даланзадгад' }, departs: '07:00', dur: { kr: '약 9시간', en: '~9 h', mn: '~9 ц' }, note: { kr: '🚌 드래곤버스', en: '🚌 Dragon Bus', mn: '🚌 Дрэгон Бус' } },
    ],
  },
  11: {
    season: 'winter', temp: '-15 ~ 0°C',
    events: [
      { kr: '❄️ 초겨울 설경 & 조용한 스텝', en: '❄️ Early winter snowscape', mn: '❄️ Өвлийн эхлэл · цас' },
    ],
    topRoutes: [
      { kr: 'UB → 테를지 (설경)', en: 'UB → Terelj (snow)', mn: 'УБ → Тэрэлж (цас)' },
    ],
    buses: [
      { label: { kr: 'UB → 테를지', en: 'UB → Terelj', mn: 'УБ → Тэрэлж' }, departs: '07:00 ~ 15:00', dur: { kr: '약 1.5시간', en: '~1.5 h', mn: '~1.5 ц' }, note: { kr: '공용 지프·미니버스', en: 'Shared jeep / minibus', mn: 'Жийп / автобус' } },
    ],
  },
  12: {
    season: 'winter', temp: '-25 ~ -10°C',
    events: [
      { kr: '🎄 겨울 게르 체험 & 혹한기', en: '🎄 Winter ger experience & extreme cold', mn: '🎄 Өвлийн гэр туршлага' },
    ],
    topRoutes: [
      { kr: 'UB → 테를지 (설원)', en: 'UB → Terelj (snowfield)', mn: 'УБ → Тэрэлж (цастай)' },
    ],
    buses: [],
  },
}
