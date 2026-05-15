// Full-detail museum entries. IDs match provinceLocations.js so the map markers
// and the Explore/Detail pages share the same source of truth.

// Picsum returns a consistent random photo per seed → each museum gets its own
// unique-looking image without depending on flaky external URLs. To use a real
// museum photo, either drop a file in /public/images/museums/{id}.jpg and set
// image: '/images/museums/{id}.jpg', or paste a verified Wikimedia/Unsplash URL.
const pic = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`

const IMG = {
  GENERIC:   'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80',
  MONASTERY: pic('monastery-mn'),
  GOBI:      pic('gobi-mn'),
  STEPPE:    pic('steppe-mn'),
  MOUNTAIN:  pic('mountain-mn'),
  LAKE:      pic('lake-mn'),
  CHINGGIS:  pic('chinggis-mn'),
}

// Map province name → English Wikipedia article title (used to fetch real photo)
const PROVINCE_TO_WIKI = {
  'Архангай':     'Arkhangai Province',
  'Баян-Өлгий':   'Bayan-Ölgii Province',
  'Баянхонгор':   'Bayankhongor Province',
  'Булган':       'Bulgan Province',
  'Говь-Алтай':   'Govi-Altai Province',
  'Говьсүмбэр':   'Govisümber Province',
  'Дархан-Уул':   'Darkhan-Uul Province',
  'Дорноговь':    'Dornogovi Province',
  'Дорнод':       'Dornod Province',
  'Дундговь':     'Dundgovi Province',
  'Завхан':       'Zavkhan Province',
  'Орхон':        'Erdenet',
  'Өвөрхангай':   'Övörkhangai Province',
  'Өмнөговь':     'Ömnögovi Province',
  'Сэлэнгэ':      'Selenge Province',
  'Сүхбаатар':    'Sükhbaatar Province',
  'Төв':          'Töv Province',
  'Увс':          'Uvs Province',
  'Ховд':         'Khovd Province',
  'Хөвсгөл':      'Khövsgöl Province',
  'Хэнтий':       'Khentii Province',
  'Улаанбаатар':  'Ulaanbaatar',
}

// Standard duration/season/difficulty defaults for aimag museums
const DEFAULTS = {
  duration:   { kr: '반나절', en: 'Half day',   mn: 'Хагас өдөр' },
  season:     { kr: '연중',   en: 'Year-round', mn: 'Жилийн турш' },
  difficulty: { kr: '쉬움',   en: 'Easy',       mn: 'Хялбар' },
  tags: {
    kr: ['박물관', '역사', '문화'],
    en: ['Museum', 'History', 'Culture'],
    mn: ['Музей', 'Түүх', 'Соёл'],
  },
}

// Helper: build a full museum entry from compact aimag config.
// Default image is a unique-per-museum picsum seed (so each card looks distinct).
// wikiTitle defaults to the province Wikipedia article so useWikiImage can fetch a real photo.
function aimag(cfg) {
  return {
    id: cfg.id,
    type: 'museum',
    region: 'museum',
    category: 'culture',
    lat: cfg.lat,
    lng: cfg.lng,
    province: cfg.province,
    name: cfg.name,
    description: cfg.description,
    image: cfg.image ?? pic(cfg.id),
    wikiTitle: cfg.wikiTitle ?? PROVINCE_TO_WIKI[cfg.province],
    rating: cfg.rating ?? 4.4,
    duration:   cfg.duration   ?? DEFAULTS.duration,
    season:     cfg.season     ?? DEFAULTS.season,
    difficulty: cfg.difficulty ?? DEFAULTS.difficulty,
    tags:       cfg.tags       ?? DEFAULTS.tags,
  }
}

export const museums = [
  // ─── UB-ийн гол музей ───
  {
    id: 'ub-3', type: 'museum', region: 'ub', category: 'culture',
    province: 'Улаанбаатар', lat: 47.9241, lng: 106.9197,
    name: {
      kr: '칭기스칸 국립박물관',
      en: 'Chinggis Khaan National Museum',
      mn: 'Чингис хааны Үндэсний музей',
    },
    description: {
      kr: '2022년 개관한 몽골 최대 규모의 국립 박물관. 흉노에서 현대까지 이어지는 몽골 역사와 칭기스칸 시대 유물을 8개 층에 걸쳐 전시합니다.',
      en: 'Opened in 2022, the largest national museum in Mongolia. It traces Mongolian history from the Xiongnu era to the modern day, with an entire wing devoted to Chinggis Khan and the Mongol Empire.',
      mn: '2022 онд нээгдсэн Монгол улсын хамгийн том Үндэсний музей. Хүннүгээс өнөөг хүртэлх Монголын түүхийг 8 давхар үзмэр, Чингис хаан болон Монголын эзэнт гүрэнд зориулсан тусгай танхимтай.',
    },
    image: pic('ub-3-chinggis'),
    wikiTitle: 'Chinggis Khaan National Museum',
    rating: 4.8,
    duration:   { kr: '반나절', en: 'Half day',   mn: 'Хагас өдөр' },
    season:     { kr: '연중',   en: 'Year-round', mn: 'Жилийн турш' },
    difficulty: { kr: '쉬움',   en: 'Easy',       mn: 'Хялбар' },
    tags: {
      kr: ['박물관', '역사', '문화'],
      en: ['Museum', 'History', 'Culture'],
      mn: ['Музей', 'Түүх', 'Соёл'],
    },
  },
  {
    id: 'ub-4', type: 'museum', region: 'ub', category: 'culture',
    province: 'Улаанбаатар', lat: 47.8907, lng: 106.9056,
    name: {
      kr: '복드 칸 궁전 박물관',
      en: 'Bogd Khan Winter Palace Museum',
      mn: 'Богд хааны ордон-музей',
    },
    description: {
      kr: '몽골의 마지막 황제 복드 칸이 1893–1924년 거주했던 겨울 궁전. 불교 미술, 외국 사절의 선물, 황실 의복을 그대로 보존한 살아있는 박물관입니다.',
      en: "The winter residence of Mongolia's last theocratic ruler, Bogd Khan, from 1893 to 1924. The complex preserves Buddhist art, royal robes, and gifts received from foreign envoys exactly as they were.",
      mn: 'Монголын сүүлчийн хаан Богд Жавзандамба 1893–1924 онд амьдарч байсан өвлийн ордон. Бурханы шашны урлаг, гадаад элчээс өргөсөн бэлэг, хааны хувцасыг анхных нь хадгалсан амьд музей.',
    },
    image: pic('ub-4-bogd-khan'),
    wikiTitle: 'Bogd Khan Palace Museum',
    rating: 4.6,
    duration:   { kr: '2-3시간', en: '2–3 hours', mn: '2-3 цаг' },
    season:     { kr: '연중',    en: 'Year-round', mn: 'Жилийн турш' },
    difficulty: { kr: '쉬움',    en: 'Easy',       mn: 'Хялбар' },
    tags: {
      kr: ['박물관', '궁전', '불교'],
      en: ['Museum', 'Palace', 'Buddhism'],
      mn: ['Музей', 'Ордон', 'Бурханы шашин'],
    },
  },
  {
    id: 'ub-5', type: 'museum', region: 'ub', category: 'culture',
    province: 'Улаанбаатар', lat: 47.9163, lng: 106.9167,
    name: {
      kr: '초이진 라마 사원 박물관',
      en: 'Choijin Lama Temple Museum',
      mn: 'Чойжин ламын сүм-музей',
    },
    description: {
      kr: '울란바토르 도심에 자리한 20세기 초 라마교 사원. 5개의 본당과 정교한 신상, 종교 의식 도구가 보존되어 있어 도시 속 평온한 명상 공간이 됩니다.',
      en: 'A 20th-century Buddhist temple complex nestled in central Ulaanbaatar. Its five halls preserve elaborate religious masks, statues, and ritual objects — a calm refuge within the city.',
      mn: '20-р зууны эхэн үед баригдсан Бурханы шашны сүм цогцолбор Улаанбаатарын төвд. 5 дуганд лам нарын зан үйлийн маск, шүтээн, эд хэрэглэлүүд хадгалагдан үлдсэн.',
    },
    image: pic('ub-5-choijin-lama'),
    wikiTitle: 'Choijin Lama Temple',
    rating: 4.5,
    duration:   { kr: '1-2시간', en: '1–2 hours', mn: '1-2 цаг' },
    season:     { kr: '연중',    en: 'Year-round', mn: 'Жилийн турш' },
    difficulty: { kr: '쉬움',    en: 'Easy',       mn: 'Хялбар' },
    tags: {
      kr: ['박물관', '사원', '불교'],
      en: ['Museum', 'Temple', 'Buddhism'],
      mn: ['Музей', 'Сүм', 'Бурханы шашин'],
    },
  },
  {
    id: 'ub-6', type: 'museum', region: 'ub', category: 'culture',
    province: 'Улаанбаатар', lat: 47.9216, lng: 106.9176,
    name: {
      kr: '자나바자르 미술관',
      en: 'Zanabazar Museum of Fine Arts',
      mn: 'Занабазарын дүрслэх урлагийн музей',
    },
    description: {
      kr: '17세기 위대한 조각가이자 종교 지도자였던 자나바자르의 작품을 중심으로, 몽골 전통 회화, 청동 불상, 탱화를 모은 미술 박물관입니다.',
      en: "Mongolia's leading fine arts museum, featuring sacred bronze sculptures, paintings, and thangkas by the 17th-century master Zanabazar, alongside traditional Mongol art across the centuries.",
      mn: '17-р зууны их урлаач, шашны зүтгэлтэн Занабазарын зэс шүтээн, зураг, маань (тангат)-ыг төвлөн харуулсан Монголын тэргүүлэх дүрслэх урлагийн музей.',
    },
    image: pic('ub-6-zanabazar'),
    wikiTitle: 'Zanabazar Museum of Fine Arts',
    rating: 4.7,
    duration:   { kr: '1-2시간', en: '1–2 hours', mn: '1-2 цаг' },
    season:     { kr: '연중',    en: 'Year-round', mn: 'Жилийн турш' },
    difficulty: { kr: '쉬움',    en: 'Easy',       mn: 'Хялбар' },
    tags: {
      kr: ['박물관', '미술', '불교'],
      en: ['Museum', 'Fine Arts', 'Buddhism'],
      mn: ['Музей', 'Урлаг', 'Бурханы шашин'],
    },
  },

  // ─── Спец. музей ───
  aimag({
    id: 'mus-dorngov',
    province: 'Дорноговь', lat: 44.8983, lng: 110.1369,
    name: {
      kr: '단잔라브자 박물관 (사인샨드)',
      en: 'Danzanravjaa Museum (Sainshand)',
      mn: 'Данзанравжаагийн музей',
    },
    description: {
      kr: '19세기 시인이자 5대 노용 후툭투인 단잔라브자의 유산을 보존하는 사인샨드의 박물관. 1500여 점의 종교 의식 도구와 친필 원고를 전시합니다.',
      en: 'Dedicated to the 19th-century Mongolian poet, monk, and 5th Noyon Khutughtu Danzanravjaa. The Sainshand museum holds 1,500+ artifacts of his life — ritual instruments, robes, and original manuscripts.',
      mn: '19-р зууны яруу найрагч, лам, V Ноён хутагт Данзанравжаагийн өвийг хадгалсан Сайншандын музей. 1500 гаруй шашны зан үйлийн эд хэрэгсэл, гар бичмэл, өвөг бунхан хэрэгсэл бүхий цуглуулгатай.',
    },
    wikiTitle: 'Danzanravjaa',
    rating: 4.4,
    tags: { kr: ['박물관', '문학', '불교'], en: ['Museum', 'Literature', 'Buddhism'], mn: ['Музей', 'Уран зохиол', 'Бурханы шашин'] },
  }),
  aimag({
    id: 'mus-ovorkh-2',
    province: 'Өвөрхангай', lat: 47.2018, lng: 102.8442,
    name: {
      kr: '에르덴 주 사원-박물관 (카라코룸)',
      en: 'Erdene Zuu Monastery Museum (Karakorum)',
      mn: 'Эрдэнэ зуу хийдийн музей',
    },
    description: {
      kr: '1585년 옛 카라코룸 자리에 세워진 몽골 최초의 라마 사원 박물관. 108개의 탑(스투파) 담장에 둘러싸인 신성한 유적지로 유네스코 세계유산이기도 합니다.',
      en: "Built in 1585 on the ruins of ancient Karakorum, this was Mongolia's first Buddhist monastery. The 108-stupa wall surrounding the complex makes it a UNESCO World Heritage site.",
      mn: '1585 онд Хархорум хотын туурин дээр баригдсан Монголын анхны бурханы шашны хийд. Цогцолборыг тойрсон 108 суварга бүхий хана нь ЮНЕСКО-гийн өвт зүйлд бүртгэгдсэн.',
    },
    wikiTitle: 'Erdene Zuu Monastery',
    rating: 4.8,
    season: { kr: '5월~10월', en: 'May–Oct', mn: '5-10 сар' },
    tags: { kr: ['박물관', '사원', '유네스코'], en: ['Museum', 'Monastery', 'UNESCO'], mn: ['Музей', 'Хийд', 'ЮНЕСКО'] },
  }),
  aimag({
    id: 'mus-orkhon',
    province: 'Орхон', lat: 49.0344, lng: 104.0808,
    name: {
      kr: '에르데넷 광산 박물관',
      en: 'Erdenet Mining Museum',
      mn: 'Эрдэнэтийн уул уурхайн музей',
    },
    description: {
      kr: '아시아 최대의 구리 광산이 있는 에르데넷 시의 박물관. 광물 표본, 채굴 기술 발전사, 도시 건설 이야기를 전시합니다.',
      en: 'The city museum of Erdenet, home to one of the largest copper mines in Asia. Exhibits cover mineral samples, mining technology, and the founding history of this industrial city.',
      mn: 'Азид томд орох зэсийн уурхайн нийслэл Эрдэнэт хотын музей. Эрдсийн дээж, олборлох техник технологийн хөгжил, хотын байгуулалтын түүхийг харуулдаг.',
    },
    rating: 4.2,
    tags: { kr: ['박물관', '광업', '산업'], en: ['Museum', 'Mining', 'Industry'], mn: ['Музей', 'Уул уурхай', 'Үйлдвэрлэл'] },
  }),

  // ─── 19 аймгийн нэгдсэн музей (тус тусын тайлбар, бүс нутгийн зурагтай) ───
  aimag({
    id: 'mus-arkhangai',
    province: 'Архангай', lat: 47.4742, lng: 101.4538,
    name: { kr: '아르항가이 박물관', en: 'Arkhangai Provincial Museum', mn: 'Архангай аймгийн нэгдсэн музей' },
    description: {
      kr: '체체를레그 시에 위치하며 17세기 사원 건물에 자리한 박물관. 흉노·튀르크·위구르 시대 유물, 할흐 민족 의복과 민속 자료를 전시합니다.',
      en: 'Housed in a 17th-century Buddhist temple in Tsetserleg. Displays Xiongnu, Turkic, and Uighur era artifacts alongside Khalkh ethnographic items.',
      mn: 'Цэцэрлэг хотод 17-р зууны Зая бандидын хүрээний өвлийн өргөөнд байрладаг. Хүннү, түрэг, уйгурын үеийн дурсгал, Архангайн нутгийн ёс заншил, угсаатан зүйн үзмэрүүдтэй.',
    },
    rating: 4.5,
  }),
  aimag({
    id: 'mus-bayanolgii',
    province: 'Баян-Өлгий', lat: 48.9683, lng: 89.9622,
    name: { kr: '바얀-울기 카자흐 박물관', en: 'Bayan-Ölgii Kazakh Museum', mn: 'Баян-Өлгий аймгийн нэгдсэн музей' },
    description: {
      kr: '몽골 카자흐 민족의 유산 — 독수리 사냥 도구, 정교한 자수, 전통 의복과 알타이 산악 문화를 전시합니다.',
      en: "Showcases the Kazakh heritage of Mongolia: eagle-hunting equipment, intricate embroidery, traditional costumes, and Altai mountain history.",
      mn: 'Монгол улсын казах ястны соёл, бүргэдчдийн уламжлал, гар хатгамал, үндэсний хувцасыг харуулсан Өлгий хотын музей. Алтай нурууны түүхэн дурсгалтай.',
    },
    rating: 4.6,
    tags: { kr: ['박물관', '카자흐', '문화'], en: ['Museum', 'Kazakh', 'Culture'], mn: ['Музей', 'Казах', 'Соёл'] },
  }),
  aimag({
    id: 'mus-bayankh',
    province: 'Баянхонгор', lat: 46.1944, lng: 100.7178,
    name: { kr: '바얀홍고르 박물관', en: 'Bayankhongor Provincial Museum', mn: 'Баянхонгор аймгийн нэгдсэн музей' },
    description: {
      kr: '현지에서 발굴된 공룡 화석, 고대 암각화, 청동기 시대 유물과 지역 자연사 자료를 전시합니다.',
      en: 'Exhibits dinosaur fossils from local digs, ancient petroglyphs, and Bronze-Age artifacts unearthed across Bayankhongor province.',
      mn: 'Баянхонгор аймгийн нутгаас олдсон динозаврын олдвор, хадны зурагт дурсгал, хүрэл зэвсгийн үеийн эртний хүмүүсийн зэвсэг хэрэглэлийг танилцуулсан музей.',
    },
    rating: 4.3,
    tags: { kr: ['박물관', '공룡', '고고학'], en: ['Museum', 'Dinosaur', 'Archaeology'], mn: ['Музей', 'Динозавр', 'Археологи'] },
  }),
  aimag({
    id: 'mus-bulgan',
    province: 'Булган', lat: 48.8125, lng: 103.5358,
    name: { kr: '불간 박물관', en: 'Bulgan Provincial Museum', mn: 'Булган аймгийн нэгдсэн музей' },
    description: {
      kr: '불간 지역의 산림-스텝 자연사, 유목 문화, 차량 시대 러시아-중국 교역로의 역사를 전시합니다.',
      en: 'Covers the forest-steppe ecology of Bulgan, livestock culture, and the historic Russian-Chinese tea-trade route passing through the region.',
      mn: 'Булган аймгийн ой-хээрийн бэлийн нутгийн түүх, угсаатан зүй, мал аж ахуй, орос-Хятадын цайны худалдааны замтай холбоотой түүхэн дурсгалуудыг харуулна.',
    },
    rating: 4.3,
  }),
  aimag({
    id: 'mus-govaltai',
    province: 'Говь-Алтай', lat: 46.3683, lng: 96.2628,
    name: { kr: '고비-알타이 박물관', en: 'Govi-Altai Provincial Museum', mn: 'Говь-Алтай аймгийн нэгдсэн музей' },
    description: {
      kr: '고비-알타이 산맥의 자연사, 준가르 칸국 시대의 역사, 그리고 서몽골 부족 문화를 전시하는 박물관.',
      en: 'Devoted to the Altai mountain range, its rich flora and fauna, the historic Dzungar Khanate, and the cultures of western Mongolia.',
      mn: 'Говь-Алтайн уулс, тэдгээрийн ой амьтан, Зүүнгарын хаант улсын үеийн түүх, баруун Монголын ястны соёлыг харуулсан музей.',
    },
    rating: 4.3,
  }),
  aimag({
    id: 'mus-govsumb',
    province: 'Говьсүмбэр', lat: 46.3622, lng: 108.3636,
    name: { kr: '고비숨버르 박물관', en: 'Govisümber Provincial Museum', mn: 'Говьсүмбэр аймгийн нэгдсэн музей' },
    description: {
      kr: '1994년 신설된 몽골 최소 아이막의 박물관. 소련 시대 초이르 공군 기지의 역사와 스텝 생태를 전시합니다.',
      en: 'Located in the smallest aimag (formed 1994), the museum covers the history of the Soviet-era Choir Air Base and the steppe ecology of the region.',
      mn: '1994 онд байгуулагдсан Монгол улсын хамгийн жижиг аймагт Чойр хотын музей. Зөвлөлтийн нисэх онгоцны баазын түүх, Дундговийн хээр талын экологитой холбоотой үзмэртэй.',
    },
    rating: 4.0,
  }),
  aimag({
    id: 'mus-darkhan',
    province: 'Дархан-Уул', lat: 49.4825, lng: 105.9747,
    name: { kr: '다르항-올 박물관', en: 'Darkhan-Uul Provincial Museum', mn: 'Дархан-Уул аймгийн нэгдсэн музей' },
    description: {
      kr: '몽골 제2도시 다르항의 산업사, 1961–70년 소련 지원 하에 건설된 도시 형성 역사, 지역 문화를 다루는 박물관.',
      en: "Documents the founding of Mongolia's second-largest city Darkhan (built 1961–70 with Soviet support), its industries, and local heritage.",
      mn: 'Монгол улсын хоёр дахь том хот Дарханы үйлдвэр аж үйлдвэрлэлийн түүх, ЗХУ-ын тусламжаар 1961-1970 онд барьсан хотын байгуулалт, орон нутгийн соёлыг харуулсан музей.',
    },
    rating: 4.2,
  }),
  aimag({
    id: 'mus-dornod',
    province: 'Дорнод', lat: 48.0728, lng: 114.5417,
    name: { kr: '도르노드 박물관', en: 'Dornod Provincial Museum', mn: 'Дорнод аймгийн нэгдсэн музей' },
    description: {
      kr: '동부 스텝, 1939년 할힌골 전투 역사, 부랴트 민족 문화 유산을 전시하는 박물관.',
      en: 'Showcases the eastern Mongolian steppe, the Battle of Khalkhin Gol (1939), and the Buryat ethnic heritage of the region.',
      mn: 'Монгол улсын зүүн талын хээр тал, Халхын голын байлдааны түүх (1939), Буриад угсаатны соёлыг харуулсан Чойбалсан хотын музей.',
    },
    rating: 4.4,
    tags: { kr: ['박물관', '전쟁사', '부랴트'], en: ['Museum', 'War History', 'Buryat'], mn: ['Музей', 'Цэргийн түүх', 'Буриад'] },
  }),
  aimag({
    id: 'mus-dundgov',
    province: 'Дундговь', lat: 45.7625, lng: 106.2611,
    name: { kr: '둔드고비 박물관', en: 'Dundgovi Provincial Museum', mn: 'Дундговь аймгийн нэгдсэн музей' },
    description: {
      kr: '고비-스텝 전이대, 신성한 송긴달라이 호수, 그리고 에르덴달라이 등 중앙 몽골의 역사 사원들을 다룹니다.',
      en: 'Featuring the Gobi-steppe transition zone, sacred lakes like Sangiin Dalai, and historic monasteries of central Mongolia.',
      mn: 'Дундговь аймгийн говь-хээр шилжилтийн бүс нутаг, Сангийн далайн нуур, Эрдэнэдалай зэрэг түүхэн хийдийн дурсгалыг танилцуулна.',
    },
    rating: 4.2,
  }),
  aimag({
    id: 'mus-zavkhan',
    province: 'Завхан', lat: 47.7411, lng: 96.8478,
    name: { kr: '자브항 박물관', en: 'Zavkhan Provincial Museum', mn: 'Завхан аймгийн нэгдсэн музей' },
    description: {
      kr: '17-19세기 청나라 서부 군영의 본부였던 울리아스타이 시의 박물관. 만주 시대 유물과 자브항 지역 문화를 전시합니다.',
      en: 'Located in the historic Manchu-Qing western military headquarters of Uliastai. Exhibits Manchu-era artifacts and Zavkhan regional heritage.',
      mn: '17-19-р зууны үед Манж-Чин гүрний баруун хязгаарын армийн төв байсан Улиастай хотын музей. Манжийн үеийн дурсгалт зүйл, Завхан нутгийн соёлыг агуулсан.',
    },
    rating: 4.3,
  }),
  aimag({
    id: 'mus-ovorkh-1',
    province: 'Өвөрхангай', lat: 46.2719, lng: 102.7758,
    name: { kr: '우브르항가이 박물관', en: 'Övörkhangai Provincial Museum', mn: 'Өвөрхангай аймгийн нэгдсэн музей' },
    description: {
      kr: '고대 수도 카라코룸, 에르덴 주 사원, 그리고 유네스코 세계유산 오르콘 계곡 문화유산을 다루는 박물관.',
      en: 'Covers the ancient capital Karakorum, Erdene Zuu Monastery, and the cultural heritage of the Orkhon Valley UNESCO World Heritage site.',
      mn: 'Эртний нийслэл Хархорум хот, Эрдэнэ зуу хийд, Орхоны хөндийн соёл иргэншлийг харуулсан Өвөрхангай аймгийн нэгдсэн музей.',
    },
    rating: 4.5,
    tags: { kr: ['박물관', '카라코룸', '유네스코'], en: ['Museum', 'Karakorum', 'UNESCO'], mn: ['Музей', 'Хархорум', 'ЮНЕСКО'] },
  }),
  aimag({
    id: 'mus-omngov',
    province: 'Өмнөговь', lat: 43.5719, lng: 104.4253,
    name: { kr: '엄너고비 박물관', en: 'Ömnögovi Provincial Museum', mn: 'Өмнөговь аймгийн нэгдсэн музей' },
    description: {
      kr: '고비 사막, 구르반사이한 산맥 보호구역, 고비곰(마잘라이), 그리고 남부 몽골에서만 발견되는 공룡 화석을 전시합니다.',
      en: 'Dedicated to the Gobi Desert, the Gurvansaikhan Mountains protected area, Gobi bears, and dinosaur fossils unique to southern Mongolia.',
      mn: 'Говийн цөл, Гурван сайханы нурууны байгалийн нөөц газар, мазаалай баавгай, говийн динозаврын олдвор зэрэг өмнөд Монголын онцлогийг харуулсан музей.',
    },
    rating: 4.5,
    tags: { kr: ['박물관', '사막', '공룡'], en: ['Museum', 'Desert', 'Dinosaur'], mn: ['Музей', 'Цөл', 'Динозавр'] },
  }),
  aimag({
    id: 'mus-selenge',
    province: 'Сэлэнгэ', lat: 50.2400, lng: 106.2078,
    name: { kr: '셀렝게 박물관', en: 'Selenge Provincial Museum', mn: 'Сэлэнгэ аймгийн нэгдсэн музей' },
    description: {
      kr: '러시아-몽골 국경 도시 수흐바타르에 위치한 박물관. 셀렝게 강 문화, 농업 전통, 러시아-몽골 교역사를 다룹니다.',
      en: 'Located in Sühbaatar city on the Russian border. The museum covers Selenge River culture, agricultural traditions, and historic Russian-Mongolian trade.',
      mn: 'Орос-Монголын хилийн Сүхбаатар хотод байх Сэлэнгэ аймгийн музей. Сэлэнгэ мөрөн, газар тариалангийн уламжлал, орос-монголын худалдааны түүхтэй.',
    },
    rating: 4.2,
  }),
  aimag({
    id: 'mus-sukhbaatar',
    province: 'Сүхбаатар', lat: 46.6797, lng: 113.2792,
    name: { kr: '수흐바타르 박물관', en: 'Sükhbaatar Provincial Museum', mn: 'Сүхбаатар аймгийн нэгдсэн музей' },
    description: {
      kr: '다리강가 민족의 문화, 신성한 실린 복드 산, 그리고 고대 석상 등을 전시하는 동부 몽골의 박물관.',
      en: 'Features the Dariganga ethnic culture of eastern Mongolia, Shiliin Bogd sacred mountain, and ancient stone monuments scattered across the steppe.',
      mn: 'Зүүн Монголын Дариганга ястны соёл, Шилийн богд уул, эртний чулуун хөшөөдийг танилцуулсан Барон-Уртын музей.',
    },
    rating: 4.3,
  }),
  aimag({
    id: 'mus-tuv',
    province: 'Төв', lat: 47.7042, lng: 106.9492,
    name: { kr: '투브 박물관', en: 'Töv Provincial Museum', mn: 'Төв аймгийн нэгдсэн музей' },
    description: {
      kr: '주운모드에 위치한 박물관. 복드 칸 산, 만쥬쉬르 사원 유적, 그리고 울란바토르 인근 날라이흐의 고고학 유적을 전시합니다.',
      en: 'Located in Zuunmod, displays artifacts from Bogd Khan Mountain, the ruined Manzushir Monastery, and Nalaikh archaeological sites near Ulaanbaatar.',
      mn: 'Зуунмод хотод байх Төв аймгийн музей. Богд хан уул, Манзушир хийдийн туурь, Налайхын малталтын дурсгалуудыг харуулна.',
    },
    rating: 4.4,
  }),
  aimag({
    id: 'mus-uvs',
    province: 'Увс', lat: 49.9819, lng: 92.0667,
    name: { kr: '우브스 박물관', en: 'Uvs Provincial Museum', mn: 'Увс аймгийн нэгдсэн музей' },
    description: {
      kr: '유네스코 세계유산으로 지정된 우브스 호수 분지와 그 주변에 사는 바야드·호톤·되르뵈드 등 다민족 문화를 전시합니다.',
      en: 'Showcasing the UNESCO-listed Uvs Lake basin and the multi-ethnic culture of Bayad, Khoton, and Dörvöd peoples living around the lake.',
      mn: 'ЮНЕСКО-ийн өвт зүйлд бичигдсэн Увс нуурын хотгорын байгаль, Баяд, Хотон, Дөрвөд зэрэг тус нутгийн олон ястны соёлыг харуулсан Улаангом хотын музей.',
    },
    rating: 4.4,
    tags: { kr: ['박물관', '유네스코', '민족'], en: ['Museum', 'UNESCO', 'Ethnic'], mn: ['Музей', 'ЮНЕСКО', 'Ястан'] },
  }),
  aimag({
    id: 'mus-khovd',
    province: 'Ховд', lat: 48.0056, lng: 91.6419,
    name: { kr: '호브드 박물관', en: 'Khovd Provincial Museum', mn: 'Ховд аймгийн нэгдсэн музей' },
    description: {
      kr: '서몽골의 다민족(우랑하이·작친·토르구드·먕가드 등) 문화, 만주 시대 교역, 알타이 산악 문화를 전시합니다.',
      en: 'Devoted to the multi-ethnic peoples of western Mongolia (Uriankhai, Zakhchin, Torguud, Myangad), Manchu-era trade, and Altai mountain heritage.',
      mn: 'Баруун Монголын олон ястны соёлыг (Урианхай, Захчин, Торгууд, Мянгад зэрэг), Манжийн үеийн худалдаа, чанадын Алтайн дурсгалыг харуулсан музей.',
    },
    rating: 4.4,
  }),
  aimag({
    id: 'mus-khuvsgul',
    province: 'Хөвсгөл', lat: 49.6342, lng: 100.1547,
    name: { kr: '홉스골 박물관', en: 'Khövsgöl Provincial Museum', mn: 'Хөвсгөл аймгийн нэгдсэн музей' },
    description: {
      kr: '몽골의 "푸른 진주" 홉스골 호수, 차탄(순록 유목민), 다르하드 민족의 고유한 문화를 전시하는 무렌 시의 박물관.',
      en: "Centred on Lake Khövsgöl (Mongolia's 'Blue Pearl'), the unique Tsaatan reindeer herders, and the Darkhad ethnic culture of the region.",
      mn: 'Монголын "Хөх сувд" Хөвсгөл нуур, Цаатан, Дархад угсаатны соёл, цаа буга маллаж амьдрах уламжлалыг харуулсан Мөрөн хотын музей.',
    },
    rating: 4.6,
    tags: { kr: ['박물관', '호수', '차탄'], en: ['Museum', 'Lake', 'Tsaatan'], mn: ['Музей', 'Нуур', 'Цаатан'] },
  }),
  aimag({
    id: 'mus-khentii',
    province: 'Хэнтий', lat: 47.3194, lng: 110.6358,
    name: { kr: '헨티 박물관', en: 'Khentii Provincial Museum', mn: 'Хэнтий аймгийн нэгдсэн музей' },
    description: {
      kr: '칭기스칸 출생지 헨티 산맥 기슭의 박물관. 부르한 할둔 성산과 초기 몽골 제국 시대 고고학 유물을 전시합니다.',
      en: 'Located in the birthplace region of Chinggis Khan, near sacred Burkhan Khaldun mountain. Exhibits linked to early Mongol Empire archaeological sites.',
      mn: 'Чингис хааны төрсөн нутаг Хэнтий нурууны бэлд буй Чингис хотын музей. Дэлүүн болдогийн ариун газар, Бурхан халдун уулын соёл, эртний Монгол улсын дурсгалтай.',
    },
    rating: 4.5,
    tags: { kr: ['박물관', '칭기스칸', '고고학'], en: ['Museum', 'Chinggis Khan', 'Archaeology'], mn: ['Музей', 'Чингис хаан', 'Археологи'] },
  }),
]

// Helper for ID lookup
export function findMuseum(id) {
  return museums.find(m => m.id === id)
}
