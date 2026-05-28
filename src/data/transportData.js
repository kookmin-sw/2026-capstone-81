// Transportation info per location (keyed by location id).
// Each entry lists how to reach the destination from Ulaanbaatar.
export const transportData = {
  // ── Ulaanbaatar (id 1, 6, 10, 11 + all UB museums) ──────────────
  ub: {
    options: [
      {
        emoji: '🚕',
        mode: { kr: '택시 (InDriver)', en: 'Taxi (InDriver)', mn: 'Такси (InDriver)' },
        time: { kr: '시내 어디서나', en: 'Anywhere in city', mn: 'Хот доторх' },
        cost: { kr: '3,000–10,000₮', en: '3,000–10,000₮', mn: '3,000–10,000₮' },
        note: { kr: '앱으로 미리 가격 확인 가능. 가장 편리한 이동 수단.', en: 'Check fare in-app before booking. Most convenient option.', mn: 'Аппаар урьдчилан үнэ харах боломжтой.' },
        links: [
          { label: 'InDriver', url: 'https://indriver.com/en/city/ulan-bator/' },
        ],
      },
      {
        emoji: '🚌',
        mode: { kr: '시내버스', en: 'City Bus', mn: 'Хотын автобус' },
        time: { kr: '노선에 따라 상이', en: 'Varies by route', mn: 'Чиглэлээс хамаарна' },
        cost: { kr: '500₮', en: '500₮', mn: '500₮' },
        note: { kr: '교통카드(iTicket) 사용 권장. 주요 관광지 근처 정류장 다수.', en: 'iTicket card recommended. Many stops near major attractions.', mn: 'iTicket карт ашиглахыг зөвлөж байна.' },
        links: [
          { label: 'UB Автобус', url: 'https://www.ubtransport.mn' },
        ],
      },
    ],
  },

  // ── Terelj National Park (id 3) ──────────────────────────────────
  terelj: {
    options: [
      {
        emoji: '🚕',
        mode: { kr: '택시 / 렌터카', en: 'Taxi / Car Rental', mn: 'Такси / Машин түрээс' },
        time: { kr: 'UB에서 약 1~1.5시간', en: '~1–1.5 hrs from UB', mn: 'УБ-аас ~1–1.5 цаг' },
        cost: { kr: '편도 약 50,000–80,000₮', en: '~50,000–80,000₮ one way', mn: 'Нэг тал ~50,000–80,000₮' },
        note: { kr: 'InDriver로 예약 가능. 공원 내부는 4WD 권장.', en: 'Book via InDriver. 4WD recommended inside the park.', mn: 'InDriver ашиглан захиалж болно. Парк дотор 4WD зөвлөнө.' },
        links: [
          { label: 'InDriver', url: 'https://indriver.com/en/city/ulan-bator/' },
        ],
      },
      {
        emoji: '🚌',
        mode: { kr: '공유 미니버스', en: 'Shared Minibus', mn: 'Хамтарсан микроавтобус' },
        time: { kr: 'UB에서 약 1.5시간', en: '~1.5 hrs from UB', mn: 'УБ-аас ~1.5 цаг' },
        cost: { kr: '약 10,000₮', en: '~10,000₮', mn: '~10,000₮' },
        note: { kr: '나란버스 터미널(Narantuul)에서 출발.', en: 'Departs from Narantuul bus terminal.', mn: 'Нарантуул буудлаас гарна.' },
        links: [],
      },
    ],
  },

  // ── Gobi Desert (id 2, 5) ─────────────────────────────────────────
  gobi: {
    options: [
      {
        emoji: '✈️',
        mode: { kr: '국내선 항공 (달란자드가드)', en: 'Domestic Flight (Dalanzadgad)', mn: 'Дотоод нислэг (Даланзадгад)' },
        time: { kr: 'UB에서 약 1.5시간', en: '~1.5 hrs from UB', mn: 'УБ-аас ~1.5 цаг' },
        cost: { kr: '80,000–150,000₮', en: '80,000–150,000₮', mn: '80,000–150,000₮' },
        note: { kr: '훈누에어·에로몽골 운항. 시즌 중 조기 예약 필수.', en: 'Hunnu Air & Aero Mongolia operate. Book early in peak season.', mn: 'Хунну Эйр, Аэро Монгол нислэг хийдэг. Урьдчилан захиалах шаардлагатай.' },
        links: [
          { label: 'Hunnu Air', url: 'https://www.hunnuair.com' },
          { label: 'Aero Mongolia', url: 'https://aeromongolia.mn' },
        ],
      },
      {
        emoji: '🚙',
        mode: { kr: '지프 투어 (UB 출발)', en: 'Jeep Tour from UB', mn: 'УБ-аас Жип тур' },
        time: { kr: 'UB에서 약 8~10시간', en: '~8–10 hrs from UB', mn: 'УБ-аас ~8–10 цаг' },
        cost: { kr: '투어 패키지 별도 문의', en: 'Varies by tour package', mn: 'Туристын багцаас хамаарна' },
        note: { kr: '비포장도로로 4WD 필수. 현지 투어사 이용 권장.', en: 'Off-road requires 4WD. Local tour operator recommended.', mn: 'Замгүй газар 4WD шаардлагатай. Орон нутгийн туристын компани зөвлөнө.' },
        links: [
          { label: 'Gobi Nomads Tour', url: 'https://www.gobinomads.com' },
        ],
      },
    ],
  },

  // ── Lake Khuvsgul (id 4) ─────────────────────────────────────────
  khuvsgul: {
    options: [
      {
        emoji: '✈️',
        mode: { kr: '국내선 항공 (무룬)', en: 'Domestic Flight (Mörön)', mn: 'Дотоод нислэг (Мөрөн)' },
        time: { kr: 'UB → 무룬 약 1.5시간 + 지프 1.5시간', en: '~1.5 hrs UB→Mörön + 1.5 hrs jeep', mn: 'УБ→Мөрөн ~1.5 цаг + Жип 1.5 цаг' },
        cost: { kr: '80,000–160,000₮', en: '80,000–160,000₮', mn: '80,000–160,000₮' },
        note: { kr: '훈누에어 운항. 무룬 공항에서 홉스골까지 지프 이동.', en: 'Hunnu Air operates. Jeep from Mörön airport to Khuvsgul.', mn: 'Хунну Эйр нислэг хийдэг. Мөрөн нисэх онгоцны буудлаас Жипээр явна.' },
        links: [
          { label: 'Hunnu Air', url: 'https://www.hunnuair.com' },
        ],
      },
      {
        emoji: '🚌',
        mode: { kr: '장거리 버스 (무룬 경유)', en: 'Long-distance Bus via Mörön', mn: 'Мөрөн чиглэлийн автобус' },
        time: { kr: 'UB에서 약 18~20시간', en: '~18–20 hrs from UB', mn: 'УБ-аас ~18–20 цаг' },
        cost: { kr: '약 50,000₮', en: '~50,000₮', mn: '~50,000₮' },
        note: { kr: '나란버스 터미널 출발. 시간 여유가 있을 때 이용.', en: 'Departs Narantuul terminal. Best when time is not an issue.', mn: 'Нарантуул буудлаас гарна.' },
        links: [],
      },
    ],
  },

  // ── Karakorum / Kharkhorin (id 7) ────────────────────────────────
  kharkhorin: {
    options: [
      {
        emoji: '🚌',
        mode: { kr: '드래곤 버스 (장거리)', en: 'Dragon Bus (Long-distance)', mn: 'Драгон автобус' },
        time: { kr: 'UB에서 약 5시간', en: '~5 hrs from UB', mn: 'УБ-аас ~5 цаг' },
        cost: { kr: '15,000–20,000₮', en: '15,000–20,000₮', mn: '15,000–20,000₮' },
        note: { kr: '드래곤 버스 터미널(Dragon Bus Terminal) 출발. 하루 여러 편 운행.', en: 'Departs Dragon Bus Terminal. Multiple departures per day.', mn: 'Драгон автобусны буудлаас хэд хэдэн удаа явдаг.' },
        links: [
          { label: 'Dragon Bus', url: 'https://dragonbus.mn' },
        ],
      },
      {
        emoji: '🚗',
        mode: { kr: '렌터카 / 택시', en: 'Car Rental / Taxi', mn: 'Машин түрээс / Такси' },
        time: { kr: 'UB에서 약 4시간', en: '~4 hrs from UB', mn: 'УБ-аас ~4 цаг' },
        cost: { kr: '편도 약 150,000₮~', en: '~150,000₮+ one way', mn: 'Нэг тал ~150,000₮+' },
        note: { kr: '비포장 구간 있음. 에르덴조 사원까지 직접 이동 가능.', en: 'Some unpaved sections. Can drive directly to Erdene Zuu Monastery.', mn: 'Хайрган зам байна. Эрдэнэ зуу хийд рүү шууд явж болно.' },
        links: [],
      },
    ],
  },

  // ── Orkhon Valley (id 8) ─────────────────────────────────────────
  orkhon: {
    options: [
      {
        emoji: '🚙',
        mode: { kr: '지프 투어 (UB 출발)', en: 'Jeep Tour from UB', mn: 'УБ-аас Жип тур' },
        time: { kr: 'UB에서 약 5~6시간', en: '~5–6 hrs from UB', mn: 'УБ-аас ~5–6 цаг' },
        cost: { kr: '투어 패키지 포함', en: 'Included in tour package', mn: 'Туристын багцад багтсан' },
        note: { kr: '오르콘 폭포 근처는 오프로드. 지프 및 현지 가이드 필수.', en: 'Near the waterfall is off-road. 4WD and local guide essential.', mn: 'Хүрхрээний орчим замгүй газар. Жип, орон нутгийн гид шаардлагатай.' },
        links: [
          { label: 'Orkhon Tours', url: 'https://www.mongoliatourism.gov.mn' },
        ],
      },
      {
        emoji: '🚌',
        mode: { kr: '하르호린 버스 + 지프', en: 'Kharkhorin Bus + Jeep', mn: 'Хархорум автобус + Жип' },
        time: { kr: '버스 5h + 지프 1~2h', en: 'Bus 5h + Jeep 1–2h', mn: 'Автобус 5ц + Жип 1–2ц' },
        cost: { kr: '버스 15,000₮ + 지프 별도', en: 'Bus 15,000₮ + jeep extra', mn: 'Автобус 15,000₮ + Жип тусдаа' },
        note: { kr: '하르호린까지 버스, 그 이후 지프 현지 섭외.', en: 'Take bus to Kharkhorin, then arrange local jeep.', mn: 'Хархорум хүртэл автобус, тэндээс орон нутгийн Жип.' },
        links: [
          { label: 'Dragon Bus', url: 'https://dragonbus.mn' },
        ],
      },
    ],
  },

  // ── Bayan-Ulgii / Western Mongolia (id 9, 12) ────────────────────
  bayan: {
    options: [
      {
        emoji: '✈️',
        mode: { kr: '국내선 항공 (올기)', en: 'Domestic Flight (Ulgii)', mn: 'Дотоод нислэг (Өлгий)' },
        time: { kr: 'UB에서 약 2시간', en: '~2 hrs from UB', mn: 'УБ-аас ~2 цаг' },
        cost: { kr: '120,000–200,000₮', en: '120,000–200,000₮', mn: '120,000–200,000₮' },
        note: { kr: '훈누에어·에로몽골 운항. 독수리 축제(10월) 시즌에 조기 매진.', en: 'Hunnu Air & Aero Mongolia. Sells out fast during Eagle Festival (Oct).', mn: 'Хунну Эйр, Аэро Монгол. Бүргэдийн наадмын үеэр (10-р сар) эрт дуусдаг.' },
        links: [
          { label: 'Hunnu Air', url: 'https://www.hunnuair.com' },
          { label: 'Aero Mongolia', url: 'https://aeromongolia.mn' },
        ],
      },
      {
        emoji: '🚌',
        mode: { kr: '장거리 버스', en: 'Long-distance Bus', mn: 'Явган автобус' },
        time: { kr: 'UB에서 약 2~3일', en: '~2–3 days from UB', mn: 'УБ-аас ~2–3 өдөр' },
        cost: { kr: '약 60,000₮', en: '~60,000₮', mn: '~60,000₮' },
        note: { kr: '매우 장거리. 항공 이용을 강력 권장.', en: 'Very long trip. Flight strongly recommended.', mn: 'Маш урт зам. Нислэг ашиглахыг хүчтэй зөвлөж байна.' },
        links: [],
      },
    ],
  },
}

// Look up transport data for a location object.
export function getTransportForLoc(loc) {
  if (!loc) return null
  const region = loc.region
  if (region === 'ub') return transportData.ub
  if (region === 'terelj') return transportData.terelj
  if (region === 'gobi') return transportData.gobi
  if (region === 'khuvsgul') return transportData.khuvsgul
  if (region === 'kharkhorin') return transportData.kharkhorin
  if (region === 'orkhon') return transportData.orkhon
  if (region === 'bayan') return transportData.bayan
  return null
}
