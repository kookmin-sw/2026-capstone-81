// Real Mongolia multi-day itinerary templates by interest
// Each day has: morning, afternoon, evening activities with time slots
// Organized by geographic logic (nearby locations grouped together)

export const itineraryTemplates = {
  int_nature: {
    days: [
      {
        title: { kr: '울란바토르 → 테를지', en: 'Ulaanbaatar → Terelj', mn: 'Улаанбаатар → Тэрэлж' },
        activities: [
          { time: '09:00', text: { kr: '🚌 테를지 국립공원으로 이동 (1시간)', en: '🚌 Drive to Terelj National Park (1hr)', mn: '🚌 Тэрэлж рүү явах (1 цаг)' } },
          { time: '10:30', text: { kr: '🏔️ 거북 바위 하이킹', en: '🏔️ Turtle Rock hiking', mn: '🏔️ Мэлхий хадад авирах' } },
          { time: '12:00', text: { kr: '🍖 게르 캠프에서 점심', en: '🍖 Lunch at ger camp', mn: '🍖 Гэр буудалд өдрийн хоол' } },
          { time: '14:00', text: { kr: '🐎 초원 승마 체험 (2시간)', en: '🐎 Horse riding on the steppe (2hrs)', mn: '🐎 Тал нутгаар морь унах (2 цаг)' } },
          { time: '17:00', text: { kr: '🌅 아리야발 사원 산책', en: '🌅 Aryabal Meditation Temple walk', mn: '🌅 Арьяабалын хийдэд алхах' } },
          { time: '19:00', text: { kr: '⛺ 게르 캠프 저녁 & 별 관찰', en: '⛺ Ger camp dinner & stargazing', mn: '⛺ Гэр буудалд орой & одон харах' } },
        ],
      },
      {
        title: { kr: '테를지 → 허스타이', en: 'Terelj → Hustai', mn: 'Тэрэлж → Хустай' },
        activities: [
          { time: '07:00', text: { kr: '🌄 일출 감상 & 아침 산책', en: '🌄 Sunrise & morning walk', mn: '🌄 Нар мандалт & өглөөний алхалт' } },
          { time: '09:00', text: { kr: '🚌 허스타이 국립공원 이동 (3시간)', en: '🚌 Drive to Hustai National Park (3hrs)', mn: '🚌 Хустай руу явах (3 цаг)' } },
          { time: '12:30', text: { kr: '🍲 현지 식당에서 점심', en: '🍲 Lunch at local restaurant', mn: '🍲 Орон нутгийн зоогийн газарт өдрийн хоол' } },
          { time: '14:00', text: { kr: '🐴 타히 (야생마) 관찰 투어', en: '🐴 Takhi (wild horse) watching tour', mn: '🐴 Тахь үзэх аялал' } },
          { time: '16:30', text: { kr: '🦌 사슴돌 유적지 방문', en: '🦌 Deer stone monument visit', mn: '🦌 Буган чулууны дурсгал үзэх' } },
          { time: '19:00', text: { kr: '🏕️ 캠프 저녁식사', en: '🏕️ Camp dinner', mn: '🏕️ Буудлын оройн хоол' } },
        ],
      },
      {
        title: { kr: '엘스타사르카이 모래언덕', en: 'Elsen Tasarkhai Sand Dunes', mn: 'Элсэн тасархай' },
        activities: [
          { time: '08:00', text: { kr: '🚌 엘스타사르카이 이동 (4시간)', en: '🚌 Drive to Elsen Tasarkhai (4hrs)', mn: '🚌 Элсэн тасархай руу явах (4 цаг)' } },
          { time: '12:30', text: { kr: '🍖 유목민 게르에서 점심', en: '🍖 Lunch at nomad ger', mn: '🍖 Нүүдэлчдийн гэрт өдрийн хоол' } },
          { time: '14:00', text: { kr: '🏜️ 모래언덕 트레킹', en: '🏜️ Sand dune trekking', mn: '🏜️ Элсэн манханд авирах' } },
          { time: '16:00', text: { kr: '🐪 낙타 타기 체험', en: '🐪 Camel riding experience', mn: '🐪 Тэмээ унах' } },
          { time: '18:30', text: { kr: '🌅 모래언덕 일몰 감상', en: '🌅 Sand dune sunset viewing', mn: '🌅 Элсэн манхан дээрх нар жаргалт' } },
        ],
      },
      {
        title: { kr: '오르콘 계곡 & 폭포', en: 'Orkhon Valley & Waterfall', mn: 'Орхоны хөндий & Хүрхрээ' },
        activities: [
          { time: '08:00', text: { kr: '🚌 오르콘 계곡 이동', en: '🚌 Drive to Orkhon Valley', mn: '🚌 Орхоны хөндий рүү явах' } },
          { time: '12:00', text: { kr: '🍲 계곡 캠프에서 점심', en: '🍲 Lunch at valley camp', mn: '🍲 Хөндийн буудалд өдрийн хоол' } },
          { time: '13:30', text: { kr: '🏞️ 오르콘 폭포 트레킹 (3시간)', en: '🏞️ Orkhon Waterfall trek (3hrs)', mn: '🏞️ Орхоны хүрхрээ рүү явган аялал (3 цаг)' } },
          { time: '17:00', text: { kr: '🌿 계곡 야생화 산책', en: '🌿 Valley wildflower walk', mn: '🌿 Хөндийн зэрлэг цэцгийн алхалт' } },
          { time: '19:00', text: { kr: '🔥 캠프파이어 & 별 관찰', en: '🔥 Campfire & stargazing', mn: '🔥 Галын дэргэд & одон харах' } },
        ],
      },
      {
        title: { kr: '홉스골 호수', en: 'Khuvsgul Lake', mn: 'Хөвсгөл нуур' },
        activities: [
          { time: '07:00', text: { kr: '✈️ 홉스골 국내선 이동', en: '✈️ Domestic flight to Khuvsgul', mn: '✈️ Хөвсгөл рүү дотоодын нислэг' } },
          { time: '11:00', text: { kr: '🌿 호수 도착 & 산책', en: '🌿 Arrive at lake & walk', mn: '🌿 Нуурт ирэх & алхах' } },
          { time: '12:30', text: { kr: '🍖 호숫가 점심', en: '🍖 Lakeside lunch', mn: '🍖 Нуурын эрэг дээр өдрийн хоол' } },
          { time: '14:00', text: { kr: '🚣 카약 체험', en: '🚣 Kayaking', mn: '🚣 Каяк' } },
          { time: '16:00', text: { kr: '🏊 호수 수영', en: '🏊 Lake swimming', mn: '🏊 Нуурт сэлэх' } },
          { time: '18:00', text: { kr: '🌅 호수 일몰 감상', en: '🌅 Lake sunset viewing', mn: '🌅 Нуурын нар жаргалт' } },
        ],
      },
      {
        title: { kr: '홉스골 숲 & 순록', en: 'Khuvsgul Forest & Reindeer', mn: 'Хөвсгөлийн ой & Цаатан' },
        activities: [
          { time: '08:00', text: { kr: '🌲 타이가 숲 트레킹', en: '🌲 Taiga forest trekking', mn: '🌲 Тайгын ойгоор аялах' } },
          { time: '11:00', text: { kr: '🦌 차탄 순록 유목민 방문', en: '🦌 Tsaatan reindeer herder visit', mn: '🦌 Цаатан айлд зочлох' } },
          { time: '13:00', text: { kr: '🍵 유목민과 함께 점심', en: '🍵 Lunch with nomads', mn: '🍵 Нүүдэлчидтэй хамт хоол идэх' } },
          { time: '15:00', text: { kr: '🎣 호수 낚시 체험', en: '🎣 Lake fishing', mn: '🎣 Нуурт загас барих' } },
          { time: '17:30', text: { kr: '🏔️ 호숫가 언덕 하이킹', en: '🏔️ Lakeside hill hiking', mn: '🏔️ Нуурын эргийн толгодод авирах' } },
        ],
      },
      {
        title: { kr: '보그드 칸 산 & 귀환', en: 'Bogd Khan Mountain & Return', mn: 'Богд хан уул & Буцах' },
        activities: [
          { time: '08:00', text: { kr: '✈️ 울란바토르 귀환', en: '✈️ Return to Ulaanbaatar', mn: '✈️ Улаанбаатар руу буцах' } },
          { time: '11:00', text: { kr: '🌲 보그드 칸 산 등반', en: '🌲 Bogd Khan Mountain hike', mn: '🌲 Богд хан уулд авирах' } },
          { time: '13:30', text: { kr: '🍲 현지 식당 점심', en: '🍲 Local restaurant lunch', mn: '🍲 Орон нутгийн зоогийн газарт хоол' } },
          { time: '15:00', text: { kr: '🛍️ 기념품 쇼핑', en: '🛍️ Souvenir shopping', mn: '🛍️ Бэлэг дурсгал худалдаж авах' } },
          { time: '17:00', text: { kr: '🌆 수흐바타르 광장 산책', en: '🌆 Sukhbaatar Square walk', mn: '🌆 Сүхбаатарын талбайд алхах' } },
        ],
      },
      { title: { kr: '고비 사막 1일차', en: 'Gobi Desert Day 1', mn: 'Говь цөл 1-р өдөр' }, activities: [
        { time: '07:00', text: { kr: '✈️ 달란자드가드 비행', en: '✈️ Fly to Dalanzadgad', mn: '✈️ Даланзадгад руу нисэх' } },
        { time: '11:00', text: { kr: '🏜️ 홍고린 엘스 도착', en: '🏜️ Arrive at Khongoryn Els', mn: '🏜️ Хонгорын элсэнд ирэх' } },
        { time: '13:00', text: { kr: '🍖 게르 캠프 점심', en: '🍖 Ger camp lunch', mn: '🍖 Гэр буудалд өдрийн хоол' } },
        { time: '14:30', text: { kr: '🐪 낙타 트레킹 (2시간)', en: '🐪 Camel trekking (2hrs)', mn: '🐪 Тэмээ унах аялал (2 цаг)' } },
        { time: '17:30', text: { kr: '🌅 모래 언덕 일몰 촬영', en: '🌅 Sand dune sunset photography', mn: '🌅 Элсэн манхан дээрх нар жаргалт' } },
      ]},
      { title: { kr: '고비 사막 2일차', en: 'Gobi Desert Day 2', mn: 'Говь цөл 2-р өдөр' }, activities: [
        { time: '06:00', text: { kr: '🌄 사막 일출 감상', en: '🌄 Desert sunrise', mn: '🌄 Цөлийн нар мандалт' } },
        { time: '09:00', text: { kr: '🦎 욜링암 협곡 탐방', en: '🦎 Yolyn Am Canyon exploration', mn: '🦎 Ёлын амаар аялах' } },
        { time: '12:00', text: { kr: '🍲 현지 점심', en: '🍲 Local lunch', mn: '🍲 Орон нутгийн хоол' } },
        { time: '14:00', text: { kr: '🦕 바얀작 공룡 화석지', en: '🦕 Bayanzag dinosaur fossil site', mn: '🦕 Баянзагийн үлэг гүрвэлийн ул мөр' } },
        { time: '17:00', text: { kr: '🌌 사막 별 관찰', en: '🌌 Desert stargazing', mn: '🌌 Цөлийн одон харах' } },
      ]},
      { title: { kr: '차강 소브라가 & 귀환', en: 'Tsagaan Suvarga & Return', mn: 'Цагаан суварга & Буцах' }, activities: [
        { time: '08:00', text: { kr: '🚌 차강 소브라가 이동', en: '🚌 Drive to Tsagaan Suvarga', mn: '🚌 Цагаан суварга руу явах' } },
        { time: '11:00', text: { kr: '⛰️ 화이트 클리프 트레킹', en: '⛰️ White cliff trekking', mn: '⛰️ Цагаан хадны аялал' } },
        { time: '13:00', text: { kr: '🍖 점심 & 휴식', en: '🍖 Lunch & rest', mn: '🍖 Өдрийн хоол & амралт' } },
        { time: '15:00', text: { kr: '✈️ 울란바토르 귀환', en: '✈️ Return to Ulaanbaatar', mn: '✈️ Улаанбаатар руу буцах' } },
      ]},
    ],
  },
  int_culture: {
    days: [
      { title: { kr: '울란바토르 문화 탐방', en: 'Ulaanbaatar Cultural Tour', mn: 'Улаанбаатарын соёлын аялал' }, activities: [
        { time: '09:00', text: { kr: '🏛️ 간단 사원 방문', en: '🏛️ Gandantegchinlen Monastery', mn: '🏛️ Гандан хийд зочлох' } },
        { time: '11:00', text: { kr: '📜 칭기즈칸 박물관', en: '📜 Genghis Khan Museum', mn: '📜 Чингис хааны музей' } },
        { time: '13:00', text: { kr: '🍖 전통 음식 점심', en: '🍖 Traditional food lunch', mn: '🍖 Уламжлалт хоолоор өдрийн хоол' } },
        { time: '14:30', text: { kr: '🏺 국립 역사 박물관', en: '🏺 National History Museum', mn: '🏺 Үндэсний түүхийн музей' } },
        { time: '16:30', text: { kr: '🖼️ 자나바자르 미술관', en: '🖼️ Zanabazar Fine Art Museum', mn: '🖼️ Занабазарын урлагийн музей' } },
        { time: '19:00', text: { kr: '🎭 투멘 에흐 전통 공연', en: '🎭 Tumen Ekh traditional show', mn: '🎭 Түмэн эхийн уламжлалт тоглолт' } },
      ]},
      { title: { kr: '전통 체험의 날', en: 'Traditional Experience Day', mn: 'Уламжлалт туршлагын өдөр' }, activities: [
        { time: '09:00', text: { kr: '👘 전통 의상 델 입어보기', en: '👘 Try traditional Deel costume', mn: '👘 Дээл өмсөж үзэх' } },
        { time: '10:30', text: { kr: '🏹 전통 활쏘기 체험', en: '🏹 Traditional archery experience', mn: '🏹 Уламжлалт сур харвах' } },
        { time: '12:00', text: { kr: '🥟 보즈 만들기 체험', en: '🥟 Buuz making class', mn: '🥟 Бууз хийж сурах' } },
        { time: '14:00', text: { kr: '🎵 마두금 연주 배우기', en: '🎵 Morin khuur lesson', mn: '🎵 Морин хуур сурах' } },
        { time: '16:00', text: { kr: '📖 몽골 서예 체험', en: '📖 Mongolian calligraphy', mn: '📖 Монгол бичиг сурах' } },
        { time: '18:00', text: { kr: '🧘 불교 명상 체험', en: '🧘 Buddhist meditation', mn: '🧘 Бурхан шашны бясалгал' } },
      ]},
      { title: { kr: '칭기즈칸의 발자취', en: 'Footsteps of Genghis Khan', mn: 'Чингис хааны мөрөөр' }, activities: [
        { time: '08:00', text: { kr: '🚌 칭기즈칸 기마상 이동 (1시간)', en: '🚌 Drive to Genghis Khan Statue (1hr)', mn: '🚌 Чингис хааны хөшөө рүү явах (1 цаг)' } },
        { time: '09:30', text: { kr: '📜 40m 기마상 관람 & 박물관', en: '📜 40m equestrian statue & museum', mn: '📜 40м морьт хөшөө & музей' } },
        { time: '12:00', text: { kr: '🍲 기마상 레스토랑 점심', en: '🍲 Statue complex restaurant lunch', mn: '🍲 Хөшөөний цогцолборт өдрийн хоол' } },
        { time: '14:00', text: { kr: '⛩️ 복드 칸 겨울 궁전', en: '⛩️ Bogd Khan Winter Palace', mn: '⛩️ Богд хааны өвлийн ордон' } },
        { time: '16:00', text: { kr: '🌆 수흐바타르 광장 & 정부 청사', en: '🌆 Sukhbaatar Square & Parliament', mn: '🌆 Сүхбаатарын талбай & Засгийн газар' } },
      ]},
      { title: { kr: '카라코룸 역사 투어', en: 'Karakorum History Tour', mn: 'Хархорумын түүхийн аялал' }, activities: [
        { time: '07:00', text: { kr: '🚌 카라코룸 이동 (5시간)', en: '🚌 Drive to Karakorum (5hrs)', mn: '🚌 Хархорум руу явах (5 цаг)' } },
        { time: '12:30', text: { kr: '🍖 현지 점심', en: '🍖 Local lunch', mn: '🍖 Орон нутгийн хоол' } },
        { time: '14:00', text: { kr: '🕌 에르덴조 사원 관람', en: '🕌 Erdene Zuu Monastery tour', mn: '🕌 Эрдэнэ зуу хийд үзэх' } },
        { time: '16:00', text: { kr: '🏛️ 카라코룸 박물관', en: '🏛️ Karakorum Museum', mn: '🏛️ Хархорумын музей' } },
        { time: '17:30', text: { kr: '🗿 투르크 석인상 유적', en: '🗿 Turkic stone monuments', mn: '🗿 Түрэгийн хөшөө чулуу' } },
      ]},
      { title: { kr: '유목민 문화 체험', en: 'Nomadic Culture Experience', mn: 'Нүүдэлчдийн соёл' }, activities: [
        { time: '08:00', text: { kr: '🏕️ 유목민 가족 방문', en: '🏕️ Visit nomad family', mn: '🏕️ Нүүдэлчин гэр бүлд зочлох' } },
        { time: '10:00', text: { kr: '🥛 아이락 만들기 체험', en: '🥛 Airag making experience', mn: '🥛 Айраг хийж сурах' } },
        { time: '12:00', text: { kr: '🍖 유목민과 함께 점심', en: '🍖 Lunch with nomads', mn: '🍖 Нүүдэлчидтэй хамт хоол' } },
        { time: '14:00', text: { kr: '🐎 말 젖 짜기 & 가축 돌보기', en: '🐎 Horse milking & herding', mn: '🐎 Гүү саах & мал маллах' } },
        { time: '16:00', text: { kr: '🎪 나담 스타일 미니 게임', en: '🎪 Naadam-style mini games', mn: '🎪 Наадам маягийн тоглоом' } },
        { time: '18:00', text: { kr: '🌙 게르에서 저녁 & 이야기', en: '🌙 Ger dinner & stories', mn: '🌙 Гэрт оройн хоол & яриа' } },
      ]},
      { title: { kr: '아마르바야스갈란트 사원', en: 'Amarbayasgalant Monastery', mn: 'Амарбаясгалант хийд' }, activities: [
        { time: '07:00', text: { kr: '🚌 아마르바야스갈란트 이동', en: '🚌 Drive to Amarbayasgalant', mn: '🚌 Амарбаясгалант руу явах' } },
        { time: '12:00', text: { kr: '🍲 현지 점심', en: '🍲 Local lunch', mn: '🍲 Орон нутгийн хоол' } },
        { time: '13:30', text: { kr: '🔔 사원 관람 & 승려 만남', en: '🔔 Monastery tour & meet monks', mn: '🔔 Хийд үзэх & лам нартай уулзах' } },
        { time: '16:00', text: { kr: '🧘 명상 체험', en: '🧘 Meditation experience', mn: '🧘 Бясалгал хийх' } },
        { time: '17:30', text: { kr: '🌅 사원 주변 산책', en: '🌅 Walk around monastery', mn: '🌅 Хийдийн орчинд алхах' } },
      ]},
      { title: { kr: '문화 정리 & 귀환', en: 'Cultural Wrap-up & Return', mn: 'Соёлын дүгнэлт & Буцах' }, activities: [
        { time: '09:00', text: { kr: '🛍️ 전통 공예품 쇼핑', en: '🛍️ Traditional craft shopping', mn: '🛍️ Уламжлалт гар урлалын дэлгүүр' } },
        { time: '11:00', text: { kr: '📚 몽골 문자 역사 전시', en: '📚 Mongolian script exhibit', mn: '📚 Монгол бичгийн үзэсгэлэн' } },
        { time: '13:00', text: { kr: '🍖 마지막 전통 식사', en: '🍖 Final traditional meal', mn: '🍖 Сүүлийн уламжлалт хоол' } },
        { time: '15:00', text: { kr: '🌆 울란바토르 자유 시간', en: '🌆 Free time in Ulaanbaatar', mn: '🌆 Улаанбаатарт чөлөөт цаг' } },
      ]},
    ],
  },
  int_food: {
    days: [
      { title: { kr: '울란바토르 미식 투어', en: 'Ulaanbaatar Food Tour', mn: 'Улаанбаатарын хоолны аялал' }, activities: [
        { time: '09:00', text: { kr: '🫖 수테차이 & 보르츠 아침', en: '🫖 Suutei tsai & borts breakfast', mn: '🫖 Сүүтэй цай & борцтой өглөөний цай' } },
        { time: '10:30', text: { kr: '🥟 보즈 만들기 체험', en: '🥟 Buuz making class', mn: '🥟 Бууз хийж сурах' } },
        { time: '12:30', text: { kr: '🍖 허르헉 전문점 점심', en: '🍖 Khorkhog restaurant lunch', mn: '🍖 Хорхогны зоогийн газарт хоол' } },
        { time: '14:30', text: { kr: '🔥 호쇼르 요리 체험', en: '🔥 Khuushuur cooking class', mn: '🔥 Хуушуур шарж сурах' } },
        { time: '16:30', text: { kr: '🍜 현지 시장 투어 & 시식', en: '🍜 Local market tour & tasting', mn: '🍜 Орон нутгийн зах & амталгаа' } },
        { time: '19:00', text: { kr: '🍲 초이완 저녁 식사', en: '🍲 Tsuivan dinner', mn: '🍲 Цуйван оройн хоол' } },
      ]},
      { title: { kr: '유제품 & 유목민 음식', en: 'Dairy & Nomad Cuisine', mn: 'Цагаан идээ & Нүүдэлчдийн хоол' }, activities: [
        { time: '08:00', text: { kr: '🚌 유목민 가족 방문', en: '🚌 Visit nomad family', mn: '🚌 Нүүдэлчин гэр бүлд зочлох' } },
        { time: '10:00', text: { kr: '🧀 아룰 (건조치즈) 만들기', en: '🧀 Aaruul (dried curd) making', mn: '🧀 Аарууль хийх' } },
        { time: '11:30', text: { kr: '🥛 아이락 만들기 & 시음', en: '🥛 Airag making & tasting', mn: '🥛 Айраг хийж амсах' } },
        { time: '13:00', text: { kr: '🍖 유목민 게르에서 점심', en: '🍖 Lunch in nomad ger', mn: '🍖 Нүүдэлчдийн гэрт хоол' } },
        { time: '15:00', text: { kr: '🧈 전통 버터 & 크림 만들기', en: '🧈 Traditional butter & cream making', mn: '🧈 Уламжлалт масло & зөөхий хийх' } },
        { time: '17:00', text: { kr: '🍵 수테차이 만들기 체험', en: '🍵 Suutei tsai making', mn: '🍵 Сүүтэй цай хийж сурах' } },
      ]},
      { title: { kr: '전통 고기 요리', en: 'Traditional Meat Dishes', mn: 'Уламжлалт махан хоол' }, activities: [
        { time: '09:00', text: { kr: '🍖 허르헉 (돌구이) 직접 만들기', en: '🍖 Make Khorkhog (stone BBQ)', mn: '🍖 Хорхог хийх' } },
        { time: '12:00', text: { kr: '🍲 허르헉 점심 & 시식', en: '🍲 Khorkhog lunch & tasting', mn: '🍲 Хорхог амтлах' } },
        { time: '14:00', text: { kr: '🥩 보르츠 (건조고기) 만들기', en: '🥩 Borts (dried meat) making', mn: '🥩 Борц хийх' } },
        { time: '16:00', text: { kr: '🫕 반시 (수프만두) 요리', en: '🫕 Bansh (soup dumplings) cooking', mn: '🫕 Банш хийх' } },
        { time: '18:00', text: { kr: '🔥 캠프파이어 바베큐', en: '🔥 Campfire barbecue', mn: '🔥 Галын дэргэд шарсан мах' } },
      ]},
      { title: { kr: '시장 & 길거리 음식', en: 'Markets & Street Food', mn: 'Зах & Гудамжны хоол' }, activities: [
        { time: '09:00', text: { kr: '🏪 나란툴 시장 투어', en: '🏪 Narantuul Market tour', mn: '🏪 Нарантуул захаар аялах' } },
        { time: '11:00', text: { kr: '🍜 시장 길거리 음식 시식', en: '🍜 Market street food tasting', mn: '🍜 Захын гудамжны хоол амсах' } },
        { time: '13:00', text: { kr: '🍖 현지인 추천 맛집', en: '🍖 Local recommended restaurant', mn: '🍖 Орон нутгийн шилдэг зоогийн газар' } },
        { time: '15:00', text: { kr: '🧀 유제품 전문점 방문', en: '🧀 Dairy specialty shop visit', mn: '🧀 Цагаан идээний дэлгүүр' } },
        { time: '17:00', text: { kr: '🍵 몽골 전통 찻집', en: '🍵 Mongolian traditional tea house', mn: '🍵 Монгол уламжлалт цайны газар' } },
      ]},
    ],
  },
  int_adventure: {
    days: [
      { title: { kr: '승마 & 초원 모험', en: 'Horse Riding & Steppe Adventure', mn: 'Морь унах & Тал нутгийн адал явдал' }, activities: [
        { time: '08:00', text: { kr: '🚌 승마 캠프 이동', en: '🚌 Drive to horse riding camp', mn: '🚌 Морины буудал руу явах' } },
        { time: '09:30', text: { kr: '🐎 승마 기초 교육', en: '🐎 Horse riding basics training', mn: '🐎 Морь унах сургалт' } },
        { time: '11:00', text: { kr: '🐎 초원 승마 투어 (3시간)', en: '🐎 Steppe horse riding tour (3hrs)', mn: '🐎 Тал нутгаар морь унах (3 цаг)' } },
        { time: '14:00', text: { kr: '🍖 캠프 점심', en: '🍖 Camp lunch', mn: '🍖 Буудлын хоол' } },
        { time: '15:30', text: { kr: '🏹 기마 활쏘기 체험', en: '🏹 Mounted archery', mn: '🏹 Морин дээрээс сур харвах' } },
        { time: '18:00', text: { kr: '🌅 초원 일몰 승마', en: '🌅 Sunset horse ride', mn: '🌅 Нар жаргалтын морь унах' } },
      ]},
      { title: { kr: '암벽 등반 & 래프팅', en: 'Rock Climbing & Rafting', mn: 'Хад авирах & Рафтинг' }, activities: [
        { time: '08:00', text: { kr: '🧗 테를지 암벽 등반', en: '🧗 Terelj rock climbing', mn: '🧗 Тэрэлжид хад авирах' } },
        { time: '11:00', text: { kr: '🌊 투울 강 래프팅 (2시간)', en: '🌊 Tuul River rafting (2hrs)', mn: '🌊 Туул голд рафтинг (2 цаг)' } },
        { time: '13:30', text: { kr: '🍖 강변 점심', en: '🍖 Riverside lunch', mn: '🍖 Голын эрэг дээр хоол' } },
        { time: '15:00', text: { kr: '🚵 산악 자전거', en: '🚵 Mountain biking', mn: '🚵 Уулын дугуй' } },
        { time: '17:30', text: { kr: '🏕️ 캠프 & 모닥불', en: '🏕️ Camp & bonfire', mn: '🏕️ Буудал & гал түлэх' } },
      ]},
      { title: { kr: '고비 사막 극한 체험', en: 'Gobi Desert Extreme', mn: 'Говийн экстрим аялал' }, activities: [
        { time: '07:00', text: { kr: '✈️ 고비 사막 이동', en: '✈️ Fly to Gobi Desert', mn: '✈️ Говь руу нисэх' } },
        { time: '11:00', text: { kr: '🐪 낙타 트레킹 (3시간)', en: '🐪 Camel trekking (3hrs)', mn: '🐪 Тэмээ унах аялал (3 цаг)' } },
        { time: '14:30', text: { kr: '🏜️ 모래언덕 보드 타기', en: '🏜️ Sand dune boarding', mn: '🏜️ Элсэн манхан дээр гулгах' } },
        { time: '17:00', text: { kr: '🌅 사막 일몰 & 캠프', en: '🌅 Desert sunset & camp', mn: '🌅 Цөлийн нар жаргалт & буудал' } },
      ]},
      { title: { kr: '알타이 산맥 트레킹', en: 'Altai Mountain Trekking', mn: 'Алтай уулсын аялал' }, activities: [
        { time: '06:00', text: { kr: '🏂 알타이 산맥 트레킹 시작', en: '🏂 Start Altai Mountain trek', mn: '🏂 Алтай уулсаар аялал эхлэх' } },
        { time: '10:00', text: { kr: '⛰️ 빙하 호수 도착', en: '⛰️ Reach glacier lake', mn: '⛰️ Мөсөн нуурт хүрэх' } },
        { time: '12:00', text: { kr: '🍲 산 위 점심', en: '🍲 Mountain top lunch', mn: '🍲 Уулын оройд хоол' } },
        { time: '14:00', text: { kr: '🦅 독수리 사냥꾼 방문', en: '🦅 Eagle hunter visit', mn: '🦅 Бүргэдчинд зочлох' } },
        { time: '17:00', text: { kr: '🏕️ 산악 캠프', en: '🏕️ Mountain camp', mn: '🏕️ Уулын буудал' } },
      ]},
      { title: { kr: '수상 스포츠 & 낚시', en: 'Water Sports & Fishing', mn: 'Усан спорт & Загас барих' }, activities: [
        { time: '08:00', text: { kr: '🚣 홉스골 호수 카약', en: '🚣 Khuvsgul Lake kayaking', mn: '🚣 Хөвсгөл нуурт каяк' } },
        { time: '10:30', text: { kr: '🏊 호수 수영', en: '🏊 Lake swimming', mn: '🏊 Нуурт сэлэх' } },
        { time: '12:00', text: { kr: '🍖 호숫가 점심', en: '🍖 Lakeside lunch', mn: '🍖 Нуурын эрэг дээр хоол' } },
        { time: '14:00', text: { kr: '🎣 플라이 낚시 체험', en: '🎣 Fly fishing experience', mn: '🎣 Загас барих' } },
        { time: '16:30', text: { kr: '🌊 보트 투어', en: '🌊 Boat tour', mn: '🌊 Завиар аялах' } },
        { time: '18:30', text: { kr: '🌅 호수 일몰', en: '🌅 Lake sunset', mn: '🌅 Нуурын нар жаргалт' } },
      ]},
    ],
  },
  int_photo: {
    days: [
      { title: { kr: '울란바토르 포토 투어', en: 'Ulaanbaatar Photo Tour', mn: 'Улаанбаатарын зураг авалт' }, activities: [
        { time: '06:00', text: { kr: '🌅 수흐바타르 광장 일출', en: '🌅 Sukhbaatar Square sunrise', mn: '🌅 Сүхбаатарын талбайн нар мандалт' } },
        { time: '09:00', text: { kr: '🏛️ 간단 사원 건축 촬영', en: '🏛️ Gandantegchinlen architecture shoot', mn: '🏛️ Гандан хийдийн архитектур зураг' } },
        { time: '11:00', text: { kr: '👘 전통 의상 포토 촬영', en: '👘 Traditional costume photoshoot', mn: '👘 Дээлтэй зураг авахуулах' } },
        { time: '13:00', text: { kr: '🍖 포토제닉 레스토랑 점심', en: '🍖 Photogenic restaurant lunch', mn: '🍖 Зурагт тохирсон зоогийн газарт хоол' } },
        { time: '15:00', text: { kr: '🌆 도시 스트리트 포토', en: '🌆 City street photography', mn: '🌆 Хотын гудамжны зураг' } },
        { time: '19:00', text: { kr: '🌃 야경 촬영', en: '🌃 Night photography', mn: '🌃 Шөнийн зураг авалт' } },
      ]},
      { title: { kr: '테를지 풍경 촬영', en: 'Terelj Landscape Shoot', mn: 'Тэрэлжийн байгалийн зураг' }, activities: [
        { time: '06:00', text: { kr: '🌄 거북바위 일출 촬영', en: '🌄 Turtle Rock sunrise shoot', mn: '🌄 Мэлхий хадны нар мандалт' } },
        { time: '09:00', text: { kr: '🏔️ 파노라마 풍경 촬영', en: '🏔️ Panorama landscape shoot', mn: '🏔️ Панорама зураг авалт' } },
        { time: '12:00', text: { kr: '🐎 말과 함께 포토', en: '🐎 Horse portrait photos', mn: '🐎 Морьтой зураг' } },
        { time: '14:00', text: { kr: '⛺ 게르 캠프 라이프 촬영', en: '⛺ Ger camp lifestyle shoot', mn: '⛺ Гэр буудлын амьдрал зураг' } },
        { time: '17:00', text: { kr: '🌅 골든아워 촬영', en: '🌅 Golden hour shoot', mn: '🌅 Алтан цагийн зураг авалт' } },
        { time: '20:00', text: { kr: '⭐ 별 궤적 촬영', en: '⭐ Star trail photography', mn: '⭐ Одны мөрний зураг' } },
      ]},
      { title: { kr: '고비 사막 촬영', en: 'Gobi Desert Photography', mn: 'Говийн зураг авалт' }, activities: [
        { time: '05:30', text: { kr: '📸 홍고린 엘스 일출', en: '📸 Khongoryn Els sunrise', mn: '📸 Хонгорын элсний нар мандалт' } },
        { time: '09:00', text: { kr: '🐪 낙타 실루엣 촬영', en: '🐪 Camel silhouette shoot', mn: '🐪 Тэмээний сүүдрийн зураг' } },
        { time: '12:00', text: { kr: '🏜️ 사막 텍스처 매크로', en: '🏜️ Desert texture macro shots', mn: '🏜️ Цөлийн бүтэцийн ойрын зураг' } },
        { time: '15:00', text: { kr: '🦅 독수리 사냥꾼 포트레이트', en: '🦅 Eagle hunter portrait', mn: '🦅 Бүргэдчний хөрөг зураг' } },
        { time: '18:00', text: { kr: '🌅 사막 일몰 파노라마', en: '🌅 Desert sunset panorama', mn: '🌅 Цөлийн нар жаргалтын панорама' } },
        { time: '21:00', text: { kr: '🌌 은하수 촬영', en: '🌌 Milky Way photography', mn: '🌌 Сүүн замын зураг авалт' } },
      ]},
    ],
  },
  int_history: {
    days: [
      { title: { kr: '몽골 제국의 역사', en: 'History of the Mongol Empire', mn: 'Монголын эзэнт гүрний түүх' }, activities: [
        { time: '09:00', text: { kr: '📜 칭기즈칸 박물관', en: '📜 Genghis Khan Museum', mn: '📜 Чингис хааны музей' } },
        { time: '11:30', text: { kr: '🏺 국립 역사 박물관', en: '🏺 National History Museum', mn: '🏺 Үндэсний түүхийн музей' } },
        { time: '13:00', text: { kr: '🍖 전통 점심', en: '🍖 Traditional lunch', mn: '🍖 Уламжлалт хоол' } },
        { time: '14:30', text: { kr: '⛩️ 복드 칸 겨울 궁전', en: '⛩️ Bogd Khan Winter Palace', mn: '⛩️ Богд хааны өвлийн ордон' } },
        { time: '16:30', text: { kr: '🌆 수흐바타르 광장 역사 해설', en: '🌆 Sukhbaatar Square history tour', mn: '🌆 Сүхбаатарын талбайн түүхийн тайлбар' } },
      ]},
      { title: { kr: '칭기즈칸 기마상 & 유적', en: 'Genghis Khan Statue & Ruins', mn: 'Чингис хааны хөшөө & Туурь' }, activities: [
        { time: '08:00', text: { kr: '🚌 칭기즈칸 기마상 이동', en: '🚌 Drive to Genghis Khan Statue', mn: '🚌 Чингис хааны хөшөө рүү явах' } },
        { time: '10:00', text: { kr: '📜 기마상 & 박물관 관람', en: '📜 Statue & museum tour', mn: '📜 Хөшөө & музей үзэх' } },
        { time: '12:30', text: { kr: '🍲 점심', en: '🍲 Lunch', mn: '🍲 Өдрийн хоол' } },
        { time: '14:00', text: { kr: '🗿 13세기 몽골 테마파크', en: '🗿 13th Century Mongolia theme park', mn: '🗿 13-р зууны Монгол паркт зочлох' } },
        { time: '16:30', text: { kr: '🏰 만주 시대 유적', en: '🏰 Manchu-era ruins', mn: '🏰 Манжийн үеийн туурь' } },
      ]},
      { title: { kr: '카라코룸 고대 수도', en: 'Karakorum Ancient Capital', mn: 'Хархорум эртний нийслэл' }, activities: [
        { time: '07:00', text: { kr: '🚌 카라코룸 이동 (5시간)', en: '🚌 Drive to Karakorum (5hrs)', mn: '🚌 Хархорум руу явах (5 цаг)' } },
        { time: '12:30', text: { kr: '🍖 현지 점심', en: '🍖 Local lunch', mn: '🍖 Орон нутгийн хоол' } },
        { time: '14:00', text: { kr: '🕌 에르덴조 사원', en: '🕌 Erdene Zuu Monastery', mn: '🕌 Эрдэнэ зуу хийд' } },
        { time: '16:00', text: { kr: '🏛️ 카라코룸 박물관', en: '🏛️ Karakorum Museum', mn: '🏛️ Хархорумын музей' } },
        { time: '17:30', text: { kr: '🗿 투르크 석인상', en: '🗿 Turkic stone monuments', mn: '🗿 Түрэгийн хөшөө чулуу' } },
      ]},
      { title: { kr: '고비 공룡 화석 탐험', en: 'Gobi Dinosaur Fossil Expedition', mn: 'Говийн палеонтологийн аялал' }, activities: [
        { time: '07:00', text: { kr: '✈️ 고비 이동', en: '✈️ Fly to Gobi', mn: '✈️ Говь руу нисэх' } },
        { time: '11:00', text: { kr: '🦕 바얀작 공룡 화석지', en: '🦕 Bayanzag dinosaur fossil site', mn: '🦕 Баянзагийн үлэг гүрвэлийн ул мөр' } },
        { time: '13:00', text: { kr: '🍲 현지 점심', en: '🍲 Local lunch', mn: '🍲 Орон нутгийн хоол' } },
        { time: '14:30', text: { kr: '📖 화석 발굴 역사 해설', en: '📖 Fossil excavation history tour', mn: '📖 Палеонтологийн малтлагын түүх' } },
        { time: '16:30', text: { kr: '🏜️ 불타는 절벽 일몰', en: '🏜️ Flaming Cliffs sunset', mn: '🏜️ Баянзагийн нар жаргалт' } },
      ]},
    ],
  },
}
