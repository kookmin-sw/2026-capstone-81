// Demo blog seed data — shown alongside real user posts from Firestore.
// Once Firestore is enabled and real posts come in, these still show up so
// the Blog tab never looks empty during demos. Remove or empty this array
// when you no longer need the seeded examples.

export const blogs = [
  {
    id: 'seed-1',
    category: { kr: '몽골', en: 'Mongolia', mn: 'Монгол' },
    title: {
      kr: '몽골 여행 가이드: 광활한 초원과 유목민의 나라',
      en: 'Mongolia Travel Guide: Land of Vast Steppes and Nomads',
      mn: 'Монгол аяллын гарын авлага: Тал нутаг, нүүдэлчдийн орон',
    },
    excerpt: {
      kr: '끝없이 펼쳐진 초원, 푸른 하늘, 유목민의 삶을 경험할 수 있는 몽골의 매력과 여행 팁을 소개합니다.',
      en: 'Discover the endless steppes, blue skies, and nomadic life of Mongolia with our complete travel tips.',
      mn: 'Монголын тал нутаг, цэнхэр тэнгэр, нүүдэлчдийн амьдралыг туршиж үзэх аяллын зөвлөмж.',
    },
    image: 'https://images.unsplash.com/photo-1609766418204-d5b86012896d?auto=format&fit=crop&w=600&q=80',
    date: '2026.05.10',
    likes: 128,
    comments: 14,
    bookmarks: 32,
    author: 'TravelMongo',
    readTime: { kr: '5분', en: '5 min', mn: '5 мин' },
    content: {
      kr: '몽골은 아시아 중부에 위치한 내륙 국가로, 광활한 초원과 사막, 산악 지형이 공존합니다. 여름철(6–8월)이 가장 좋고, 7월의 나담 축제 기간에는 전통 스포츠를 관람할 수 있습니다.',
      en: "Mongolia is a landlocked country in central Asia where vast steppes, deserts, and mountains coexist. The best time to visit is summer (June–August); during the Naadam festival in July you can watch traditional sports.",
      mn: 'Монгол улс нь Ази тивийн төв хэсэгт оршдог далайд гарцгүй улс юм. Зуны улирал (6-8 сар) аяллын хамгийн тохиромжтой үе бөгөөд 7-р сард болдог Үндэсний их баяр Наадмаар үндэсний спортыг үзэх боломжтой.',
    },
  },
  {
    id: 'seed-2',
    category: { kr: '역사', en: 'History', mn: 'Түүх' },
    title: {
      kr: '칭기스칸의 발자취를 따라: 몽골 역사 투어',
      en: 'Following the Footsteps of Chinggis Khan',
      mn: 'Чингис хааны мөрөөр',
    },
    excerpt: {
      kr: '카라코룸과 헨티의 신성한 산을 따라 칭기스칸 시대의 유산을 탐방하는 4박 5일 코스.',
      en: 'A 4-night route through Karakorum and the sacred mountains of Khentii to trace the era of Chinggis Khan.',
      mn: 'Хархорум, Хэнтийн нурууг туулсан 4 хоногийн түүхэн аялалын маршрут.',
    },
    image: 'https://images.unsplash.com/photo-1591001244189-cb8c1f1f5dcf?auto=format&fit=crop&w=600&q=80',
    date: '2026.05.06',
    likes: 96,
    comments: 7,
    bookmarks: 21,
    author: 'HistoryWalker',
    readTime: { kr: '7분', en: '7 min', mn: '7 мин' },
    content: {
      kr: '칭기스칸 국립박물관(울란바토르), 카라코룸의 에르덴 주 사원, 헨티의 부르한 할둔 성산을 순서대로 방문하는 코스입니다.',
      en: 'A route that visits the Chinggis Khaan National Museum, Erdene Zuu Monastery in Karakorum, and sacred Burkhan Khaldun in Khentii.',
      mn: 'Чингис хааны Үндэсний музей, Хархорумын Эрдэнэ зуу хийд, Хэнтийн Бурхан халдун уулыг тойрсон маршрут.',
    },
  },
  {
    id: 'seed-3',
    category: { kr: '음식', en: 'Food', mn: 'Хоол' },
    title: {
      kr: '꼭 먹어봐야 할 몽골 전통 음식 7가지',
      en: 'Top 7 Traditional Mongolian Foods You Must Try',
      mn: 'Заавал амтлах ёстой Монголын уламжлалт 7 хоол',
    },
    excerpt: {
      kr: '호르헉, 보쯔, 차강사르 음식 등 몽골에서만 맛볼 수 있는 전통 요리들을 소개합니다.',
      en: 'Khorkhog, buuz, Tsagaan Sar dishes, and other Mongolian classics you can only taste here.',
      mn: 'Хорхог, бууз, Цагаан сарын идээ зэрэг Монголд л амтлах ёстой уламжлалт хоолнууд.',
    },
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=600&q=80',
    date: '2026.05.03',
    likes: 74,
    comments: 9,
    bookmarks: 18,
    author: 'FoodNomad',
    readTime: { kr: '4분', en: '4 min', mn: '4 мин' },
    content: {
      kr: '1) 호르헉 (뜨거운 돌로 익힌 양고기), 2) 보쯔 (찐 만두), 3) 차강사르 음식, 4) 아이락(말젖술), 5) 후스르 (튀긴 만두), 6) 차강이데 (유제품), 7) 츠이반 (볶음국수)',
      en: '1) Khorkhog (lamb cooked with hot stones), 2) Buuz (steamed dumplings), 3) Tsagaan Sar foods, 4) Airag (fermented mare\'s milk), 5) Khuushuur (fried dumplings), 6) Tsagaan idee (dairy), 7) Tsuivan (stir-fried noodles).',
      mn: '1) Хорхог, 2) Бууз, 3) Цагаан сарын идээ, 4) Айраг, 5) Хуушуур, 6) Цагаан идээ, 7) Цуйван.',
    },
  },
  {
    id: 'seed-4',
    category: { kr: '준비물', en: 'Packing', mn: 'Бэлдэх' },
    title: {
      kr: '몽골 여행 짐 싸기 체크리스트',
      en: 'Mongolia Travel Packing Checklist',
      mn: 'Монгол аяллын бэлтгэлийн жагсаалт',
    },
    excerpt: {
      kr: '낮과 밤의 기온차가 큰 몽골 여행에 꼭 챙겨야 할 필수 아이템.',
      en: 'Essentials for Mongolia where the day-night temperature swing is huge.',
      mn: 'Өдөр шөнийн температурын зөрөө их Монголын аяллын зайлшгүй авах зүйлс.',
    },
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    date: '2026.04.28',
    likes: 89,
    comments: 4,
    bookmarks: 27,
    author: 'PackerPro',
    readTime: { kr: '3분', en: '3 min', mn: '3 мин' },
    content: {
      kr: '얇은 다운 재킷, 침낭, 자외선 차단제, 모자, 충전용 보조배터리, 멀티 어댑터, 멀미약/감기약, 손전등, 물티슈, 현금(투그릭)',
      en: 'Light down jacket, sleeping bag, sunscreen, hat, power bank, multi-adapter, motion-sickness pills, flashlight, wet wipes, cash (MNT).',
      mn: 'Нимгэн өдтэй цамц, унтлагын уут, нарны тос, малгай, нөөц цэнэгчин, мульти-адаптер, дотор муухайралын эм, гар чийдэн, мокор салфетка, бэлэн мөнгө (төгрөг).',
    },
  },
]
