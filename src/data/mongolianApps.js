// Curated list of Mongolian everyday-life apps a traveller would actually need.
// Categories: transport, food, payment, government, health, map, shopping, travel
// Add/remove freely — the UI auto-builds chips from the categories used here.

export const APP_CATEGORIES = [
  { key: 'all',        label: { kr: '전체',     en: 'All',          mn: 'Бүгд'          }, emoji: '🗂️' },
  { key: 'transport',  label: { kr: '교통',     en: 'Transport',    mn: 'Тээвэр'        }, emoji: '🚕' },
  { key: 'food',       label: { kr: '음식',     en: 'Food',         mn: 'Хоол'          }, emoji: '🍔' },
  { key: 'payment',    label: { kr: '결제',     en: 'Payment',      mn: 'Төлбөр'        }, emoji: '💳' },
  { key: 'government', label: { kr: '정부',     en: 'Government',   mn: 'Төр'           }, emoji: '🏛️' },
  { key: 'health',     label: { kr: '의료',     en: 'Health',       mn: 'Эрүүл мэнд'    }, emoji: '🏥' },
  { key: 'map',        label: { kr: '지도',     en: 'Maps',         mn: 'Газрын зураг'  }, emoji: '🗺️' },
  { key: 'travel',     label: { kr: '여행',     en: 'Travel',       mn: 'Аялал'         }, emoji: '✈️' },
  { key: 'shopping',   label: { kr: '쇼핑',     en: 'Shopping',     mn: 'Худалдаа'      }, emoji: '🛒' },
]

export const mongolianApps = [
  // ─── TRANSPORT ───
  {
    id: 'ubcab',
    name: { kr: 'UBcab', en: 'UBcab', mn: 'UBcab' },
    tagline: { kr: '울란바토르 대표 택시 앱', en: 'Most popular taxi app in UB', mn: 'УБ хотын дугуй такси апп' },
    description: {
      kr: '울란바토르에서 가장 많이 쓰는 택시 호출 앱. 영어 지원, 카드/현금 결제.',
      en: 'The taxi-hailing app of choice in Ulaanbaatar. English interface, card or cash payment.',
      mn: 'Улаанбаатарт хамгийн өргөн хэрэглэгддэг такси дуудах апп. Англи хэлтэй, банкны карт болон бэлэн мөнгөөр төлж болно.',
    },
    category: 'transport',
    icon: '🚕', color: 'bg-yellow-400',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.ubcab.ubcab',
    iosUrl: 'https://apps.apple.com/mn/app/ubcab-mongolia/id977330519',
    website: 'https://ubcab.mn',
  },
  {
    id: 'toki',
    name: { kr: 'Toki', en: 'Toki', mn: 'Toki' },
    tagline: { kr: '슈퍼앱 (택시·배달·결제)', en: 'Super-app (rides + delivery + pay)', mn: 'Супер апп (такси, хүргэлт, төлбөр)' },
    description: {
      kr: '택시, 음식 배달, 결제, 충전을 한 앱에서. 가장 많은 기능을 가진 종합 앱.',
      en: 'Rides, food delivery, payments, bill top-up — all in one. The most feature-packed local app.',
      mn: 'Такси, хоол захиалга, төлбөр, цэнэглэх — нэг апп дотор. Хамгийн их функцтэй орон нутгийн апп.',
    },
    category: 'transport',
    icon: '⚡', color: 'bg-purple-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.toki.app',
    iosUrl: 'https://apps.apple.com/mn/app/toki/id1547089497',
    website: 'https://toki.mn',
  },
  {
    id: 'yandex-go',
    name: { kr: 'Yandex Go', en: 'Yandex Go', mn: 'Yandex Go' },
    tagline: { kr: '러시아발 글로벌 택시·배달', en: 'Global ride-hail + delivery', mn: 'Олон улсын такси, хүргэлт' },
    description: {
      kr: '러시아 글로벌 앱. 울란바토르에서도 택시·배달·물건 픽업 모두 가능. 카드 결제 편리.',
      en: 'Russian global super-app. Active in UB for taxis, food, and parcel pickup. Card payments work seamlessly.',
      mn: 'Орос улсын олон улсын апп. УБ-д такси, хоол, илгээмж хүргэх боломжтой. Карт төлбөртэй.',
    },
    category: 'transport',
    icon: '🟠', color: 'bg-red-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=ru.yandex.taxi',
    iosUrl: 'https://apps.apple.com/app/yandex-go-taxi-delivery/id510855646',
    website: 'https://yandex.com/go',
  },
  {
    id: 'ubcard',
    name: { kr: 'UBcard', en: 'UBcard', mn: 'UB карт' },
    tagline: { kr: '대중교통 카드 충전·관리', en: 'Public transport card recharge', mn: 'Нийтийн тээврийн карт цэнэглэх' },
    description: {
      kr: '울란바토르 버스·트롤리 카드(U Money) 잔액 확인과 충전. 정류장 정보 포함.',
      en: 'Manage and top-up the Ulaanbaatar bus/trolley smart card. Includes route and stop info.',
      mn: 'УБ хотын автобусны цахим картаа цэнэглэх, үлдэгдэл шалгах. Чиглэлийн мэдээлэлтэй.',
    },
    category: 'transport',
    icon: '🚌', color: 'bg-green-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.ubsmartcard',
    website: 'https://ubsmartcard.mn',
  },

  // ─── FOOD ───
  {
    id: 'toktok',
    name: { kr: 'TokTok', en: 'TokTok', mn: 'TokTok' },
    tagline: { kr: '몽골 최대 음식 배달', en: "Mongolia's #1 food delivery", mn: 'Хүргэлтийн тэргүүлэх апп' },
    description: {
      kr: '레스토랑·카페·편의점·약국까지 1-2시간 내 배달. 외국인도 카드 등록 후 사용 가능.',
      en: 'Delivers from restaurants, cafés, convenience stores and pharmacies in 1-2h. Foreign cards accepted.',
      mn: 'Ресторан, кафе, дэлгүүр, эмийн сангаас 1-2 цагт хүргэдэг. Гадаад картыг хүлээн авдаг.',
    },
    category: 'food',
    icon: '🛵', color: 'bg-orange-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.toktok.client',
    iosUrl: 'https://apps.apple.com/mn/app/toktok-delivery/id1486148935',
    website: 'https://toktok.mn',
  },
  {
    id: 'shoppy',
    name: { kr: 'Shoppy', en: 'Shoppy', mn: 'Shoppy' },
    tagline: { kr: '식료품·생필품 배달', en: 'Grocery + essentials delivery', mn: 'Хүнсний бүтээгдэхүүн хүргэлт' },
    description: {
      kr: '대형마트(Nomin, GS, CU)에서 식료품을 30분-2시간 내 배달.',
      en: 'Grocery delivery from big supermarkets (Nomin, GS, CU) in 30 min – 2 h.',
      mn: 'Том дэлгүүрүүдээс (Номин, GS, CU) хүнс 30 мин-2 цагт хүргэдэг.',
    },
    category: 'food',
    icon: '🛒', color: 'bg-pink-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.shoppy',
    website: 'https://shoppy.mn',
  },

  // ─── PAYMENT ───
  {
    id: 'qpay',
    name: { kr: 'QPay', en: 'QPay', mn: 'QPay' },
    tagline: { kr: 'QR 통합 결제', en: 'Universal QR payment', mn: 'QR кодоор төлбөр' },
    description: {
      kr: '몽골 어디서든 통하는 QR 결제 시스템. 거의 모든 식당·상점에서 받음. 은행앱들이 모두 호환.',
      en: 'Universal QR payment. Accepted nearly everywhere — restaurants, taxis, shops. All Mongolian bank apps support it.',
      mn: 'QR кодоор хаана ч төлбөр төлөх систем. Бараг бүх рестораны, дэлгүүрт ажилладаг.',
    },
    category: 'payment',
    icon: '📱', color: 'bg-blue-500',
    website: 'https://qpay.mn',
  },
  {
    id: 'socialpay',
    name: { kr: 'SocialPay', en: 'SocialPay', mn: 'SocialPay' },
    tagline: { kr: 'Golomt 은행 전자지갑', en: 'Golomt Bank e-wallet', mn: 'Голомт банкны цахим хэтэвч' },
    description: {
      kr: 'Golomt Bank의 디지털 지갑. QPay 결제, 송금, 충전 등. 은행 계좌가 없어도 게스트 카드로 사용 가능.',
      en: 'Golomt Bank wallet. QPay payments, transfers, top-ups. Has a guest mode even without a local bank account.',
      mn: 'Голомт банкны цахим хэтэвч. QPay, шилжүүлэг, цэнэглэх. Дансгүй ч зочны горим ашиглаж болно.',
    },
    category: 'payment',
    icon: '💜', color: 'bg-purple-600',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.golomtbank.socialpay',
    iosUrl: 'https://apps.apple.com/mn/app/social-pay/id1062695533',
  },
  {
    id: 'mkhan',
    name: { kr: 'Khan Bank App', en: 'Khan Bank', mn: 'Хаан Банк' },
    tagline: { kr: '최대 은행 모바일뱅킹', en: "Mongolia's largest bank", mn: 'Хамгийн том банкны апп' },
    description: {
      kr: '몽골 최대 은행 칸뱅크 모바일 앱. 외국인도 계좌 개설 시 사용. QPay 결제.',
      en: "Mongolia's biggest bank. After opening an account (foreigners can with passport), you get QPay, transfers, exchange.",
      mn: 'Монголын хамгийн том банк. Гадаад иргэд паспортоор данс нээлгэж, QPay болон шилжүүлэг хэрэглэнэ.',
    },
    category: 'payment',
    icon: '🟢', color: 'bg-emerald-600',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.khanbank.retail',
    iosUrl: 'https://apps.apple.com/mn/app/khan-bank/id1107037048',
  },
  {
    id: 'umoney',
    name: { kr: 'UMoney', en: 'UMoney', mn: 'UMoney' },
    tagline: { kr: '모바일 지갑·송금', en: 'Mobile wallet + remittance', mn: 'Гар утасны цахим хэтэвч' },
    description: {
      kr: '은행 계좌 없이 사용 가능한 디지털 지갑. 충전·송금·청구서 결제·해외 송금.',
      en: 'Wallet you can use without opening a bank account — top-up, transfer, pay bills, send abroad.',
      mn: 'Дансгүй хэрэглэдэг цахим хэтэвч. Цэнэглэх, шилжүүлэг, нэхэмжлэх төлөх.',
    },
    category: 'payment',
    icon: '💎', color: 'bg-cyan-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.umoney',
  },
  {
    id: 'storepay',
    name: { kr: 'StorePay', en: 'StorePay', mn: 'StorePay' },
    tagline: { kr: '후불 결제(BNPL)', en: 'Buy Now Pay Later', mn: 'Дараа төлөх' },
    description: {
      kr: '온·오프라인에서 분할 결제 가능. 마트·전자제품·옷가게에서 4회 분할.',
      en: 'Buy now, pay later in 4 installments — works at supermarkets, electronics, fashion stores.',
      mn: 'Дэлгүүр, цахилгаан хэрэгсэл, хувцасны дэлгүүрт 4 удаа хувааж төлөх боломж.',
    },
    category: 'payment',
    icon: '💰', color: 'bg-amber-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.storepay',
    website: 'https://storepay.mn',
  },

  // ─── GOVERNMENT ───
  {
    id: 'emongolia',
    name: { kr: 'E-Mongolia', en: 'E-Mongolia', mn: 'E-Mongolia' },
    tagline: { kr: '정부 서비스 통합', en: 'All-in-one e-gov portal', mn: 'Төрийн нэгдсэн үйлчилгээ' },
    description: {
      kr: '비자 연장, 등록, 세무, 의료 등 950+ 정부 서비스를 한 앱에서. 외국인은 등록 후 사용.',
      en: 'Visa extension, registration, taxes, health — 950+ government services in one app. Foreigners can use it after registering.',
      mn: 'Виз сунгах, бүртгэл, татвар, эрүүл мэнд — 950+ төрийн үйлчилгээг нэг апп дотор.',
    },
    category: 'government',
    icon: '🏛️', color: 'bg-blue-700',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.gov.emongolia',
    iosUrl: 'https://apps.apple.com/mn/app/e-mongolia/id1577799683',
    website: 'https://e-mongolia.mn',
  },

  // ─── HEALTH ───
  {
    id: 'monos',
    name: { kr: 'Monos Pharmacy', en: 'Monos', mn: 'Монос эмийн сан' },
    tagline: { kr: '약국 검색·배달', en: 'Pharmacy finder + delivery', mn: 'Эмийн сангийн апп' },
    description: {
      kr: '몽골 최대 약국 체인. 약 검색, 가까운 지점 찾기, 약 배달 주문. 영어 약품 정보 포함.',
      en: "Mongolia's largest pharmacy chain. Search medicine, find nearest branch, order home delivery. Some English drug info.",
      mn: 'Монголын хамгийн том эмийн сангийн сүлжээ. Эм хайх, ойрхон салбар, гэрт хүргүүлэх.',
    },
    category: 'health',
    icon: '💊', color: 'bg-red-400',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.monos',
    website: 'https://monos.mn',
  },

  // ─── MAPS ───
  {
    id: '2gis',
    name: { kr: '2GIS', en: '2GIS', mn: '2ГИС' },
    tagline: { kr: '울란바토르 상세 지도', en: 'Detailed UB city map', mn: 'УБ хотын дэлгэрэнгүй газрын зураг' },
    description: {
      kr: '구글맵보다 몽골 정보가 정확함. 모든 식당·약국·상점 영업시간, 전화번호, 평점 검색 가능. 오프라인 가능.',
      en: 'More accurate than Google Maps for Mongolia. Find restaurants, pharmacies, shops with hours, phones, ratings. Works offline.',
      mn: 'Google Maps-аас илүү нарийвчлалтай. Ресторан, эмийн сан, дэлгүүрийн цаг, утас, үнэлгээ. Офлайн ажиллана.',
    },
    category: 'map',
    icon: '🗺️', color: 'bg-lime-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=ru.dublgis.dgismobile',
    iosUrl: 'https://apps.apple.com/app/2gis/id481627348',
    website: 'https://2gis.mn',
  },

  // ─── TRAVEL ───
  {
    id: 'iairport',
    name: { kr: 'iAirport', en: 'iAirport', mn: 'iAirport' },
    tagline: { kr: '울란바토르 공항 정보', en: 'UB airport info', mn: 'УБ онгоцны буудал' },
    description: {
      kr: '칭기스칸 공항(UBN) 도착·출발 정보, 셔틀버스 시간표, 면세점.',
      en: 'Chinggis Khaan Airport (UBN) arrivals/departures, shuttle bus schedule, duty-free.',
      mn: 'Чингис хаан нисэх онгоцны буудлын мэдээлэл, маршрутын автобусны цагийн хуваарь.',
    },
    category: 'travel',
    icon: '✈️', color: 'bg-sky-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.airport',
  },

  // ─── SHOPPING ───
  {
    id: 'unimall',
    name: { kr: 'Unimall', en: 'Unimall', mn: 'Unimall' },
    tagline: { kr: '온라인 쇼핑몰', en: 'Online marketplace', mn: 'Онлайн худалдааны төв' },
    description: {
      kr: '몽골 최대 온라인 쇼핑몰. 의류·전자제품·생활용품 즉시 배송.',
      en: "Mongolia's largest online marketplace. Clothing, electronics, household items with quick delivery.",
      mn: 'Монголын хамгийн том онлайн дэлгүүр. Хувцас, цахилгаан хэрэгсэл, ахуйн бараа.',
    },
    category: 'shopping',
    icon: '🛍️', color: 'bg-fuchsia-500',
    androidUrl: 'https://play.google.com/store/apps/details?id=mn.unimall',
    website: 'https://unimall.mn',
  },
]
