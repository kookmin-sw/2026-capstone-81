import { useState } from 'react'
import { useLang } from '../../context/LangContext'

const sections = {
  history: {
    icon: '📜',
    title: { kr: '역사', en: 'History', mn: 'Түүх' },
    content: {
      kr: `몽골의 역사는 수천 년에 걸쳐 있습니다. 13세기 칭기즈칸이 세운 몽골 제국은 역사상 최대의 연속 영토를 가진 제국이었습니다.

**주요 역사**
• 석기 시대부터 유목 민족이 거주
• 흉노, 돌궐 등 여러 유목 국가 흥망
• 1206년 칭기즈칸이 몽골 통일 및 제국 건설
• 16세기 청나라에 복속
• 1921년 몽골 인민공화국 수립
• 1990년 민주화 혁명, 현재의 몽골국 성립`,
      en: `Mongolia's history spans thousands of years. The Mongol Empire founded by Genghis Khan in the 13th century was the largest contiguous empire in history.

**Key History**
• Nomadic peoples inhabiting the region since the Stone Age
• Rise and fall of various nomadic states including the Xiongnu and Göktürks
• 1206: Genghis Khan unifies Mongolia and establishes the empire
• 16th century: Subjugation under the Qing Dynasty
• 1921: Mongolian People's Republic established
• 1990: Democratic revolution, establishment of modern Mongolia`,
      mn: `Монголын түүх олон мянган жилийг хамардаг. 13-р зуунд Чингис хааны байгуулсан Монголын эзэнт гүрэн түүхэн дэх хамгийн том тасралтгүй нутаг дэвсгэртэй эзэнт гүрэн байв.

**Үндсэн түүх**
• Чулуун зэвсгийн үеэс нүүдэлчид амьдарч ирсэн
• Хүннү, Түрэгүүд гэх мэт олон нүүдэлчдийн улсуудын өргөж, унаж
• 1206 он: Чингис хаан Монголыг нэгтгэж эзэнт гүрэн байгуулав
• 16-р зуун: Манж Чин гүрэнд захирагдав
• 1921 он: Монгол Ардын Бүгд Найрамдах Улс байгуулагдав
• 1990 он: Ардчилсан хувьсгал, орчин үеийн Монгол Улс`,
    },
  },
  customs: {
    icon: '🏠',
    title: { kr: '풍습', en: 'Customs', mn: 'Ёс заншил' },
    content: {
      kr: `몽골 유목 문화에는 독특한 풍습과 예절이 있습니다.

**게르 예절**
• 게르에 들어갈 때는 왼발부터
• 문지방을 밟지 않기
• 어른에게는 두 손으로 물건 전달
• 음식은 거절하지 않기

**하닥 (Hadag)**
• 파란색 비단 스카프
• 경의와 존중의 표시

**나담 축제**
• 매년 7월 11~13일
• 씨름, 말 경주, 궁술 3개 경기`,
      en: `Mongolia's nomadic culture has unique customs and etiquette.

**Ger Etiquette**
• Enter the ger with your left foot first
• Never step on the threshold
• Pass items to elders with both hands
• Never refuse food offered

**Khadag (Hadag)**
• Blue silk scarf
• Symbol of respect and reverence

**Naadam Festival**
• Annually July 11-13
• Three games: wrestling, horse racing, archery`,
      mn: `Монгол нүүдэлчдийн соёлд өвөрмөц ёс заншил, этгээд дэглэм байдаг.

**Гэрийн ёс**
• Гэрт зүүн хөлөөрөө ороорой
• Босгыг гишгэхгүй
• Ахмадуудад хоёр гараар юм дамжуулах
• Санал болгосон хоолыг татгалзахгүй

**Хадаг**
• Цэнхэр торгон дэвсгэр
• Хүндэтгэл, пошоогийн тэмдэг

**Наадам**
• Жил бүрийн 7 дугаар сарын 11-13
• Гурван наадам: бөх, морь урлах, сур харвах`,
    },
  },
  food: {
    icon: '🍖',
    title: { kr: '음식', en: 'Food', mn: 'Хоол' },
    content: {
      kr: `몽골 음식은 주로 고기(양고기, 소고기)와 유제품으로 구성됩니다.

**주요 음식**
• 허르헉 (Khorkhog): 달군 돌로 요리한 양고기
• 보즈 (Buuz): 쪄서 먹는 고기 만두
• 호쇼르 (Khuushuur): 튀긴 고기 만두
• 차이 (Tsai): 소금이 들어간 밀크티
• 아이락 (Airag): 발효 말젖

**식사 예절**
• 음식은 오른손 또는 두 손으로 받기
• 어른이 먼저 식사 시작`,
      en: `Mongolian cuisine mainly consists of meat (lamb, beef) and dairy products.

**Main Foods**
• Khorkhog: Lamb cooked with hot stones
• Buuz: Steamed meat dumplings
• Khuushuur: Fried meat pastries
• Tsai: Salted milk tea
• Airag: Fermented mare's milk

**Dining Etiquette**
• Receive food with your right hand or both hands
• Elders begin eating first`,
      mn: `Монгол хоол гол төлөв мах (хонины, үхрийн) болон сүүн бүтээгдэхүүнээс бүрддэг.

**Үндсэн хоолнууд**
• Хорхог: Халуун чулуугаар хийсэн хонины мах
• Бууз: Уурт хийсэн мах дүүрэн гурилтай
• Хуушуур: Шарсан мах дүүрэн гурилтай
• Цай: Давстай сүүтэй цай
• Айраг: Гүүний сүүнээс хийсэн ундаа`,
    },
  },
  nomad: {
    icon: '⛺',
    title: { kr: '유목 생활', en: 'Nomadic Life', mn: 'Нүүдэлчдийн амьдрал' },
    content: {
      kr: `몽골인의 전통적인 유목 생활은 수천 년간 이어져 왔습니다.

**게르 (Ger)**
• 몽골의 전통 천막 집
• 2~3시간 안에 설치 및 해체 가능
• 원형 구조로 바람에 강함
• 중앙의 화덕으로 난방과 조리

**계절 이동**
• 봄: 남쪽 온난한 지역으로 이동
• 여름: 풀이 많은 초원
• 가을: 겨울 준비
• 겨울: 바람을 피하는 장소

**가축 5종**
말, 소, 낙타, 양, 염소`,
      en: `The traditional nomadic life of Mongolians has continued for thousands of years.

**Ger**
• Traditional Mongolian tent home
• Can be assembled/disassembled in 2-3 hours
• Circular structure resistant to wind
• Central stove for heating and cooking

**Seasonal Migration**
• Spring: Move to warmer southern areas
• Summer: Rich grasslands
• Autumn: Preparing for winter
• Winter: Sheltered locations

**Five Animals (Tavan Khoshuu Mal)**
Horse, Cattle, Camel, Sheep, Goat`,
      mn: `Монголчуудын уламжлалт нүүдэлчдийн амьдрал олон мянган жилийн турш үргэлжилж ирсэн.

**Гэр**
• Монголын уламжлалт майхан гэр
• 2-3 цагийн дотор барьж, буулгаж болно
• Дугуй бүтэц нь салхинд тэсвэртэй
• Дунд талхийн зуухаар дулааццаг, хоол хийдэг

**Улирлын нүүдэл**
• Хавар: Дулаан урд нутагт нүүх
• Зун: Өвс ихтэй тал нутагт
• Намар: Өвлийн бэлтгэл
• Өвөл: Салхи саалийн газарт

**Тавн хошуу мал**
Морь, үхэр, тэмээ, хонь, ямаа`,
    },
  },
}

export default function DesktopCulture() {
  const { lang, tr } = useLang()
  const [active, setActive] = useState('history')
  const sec = sections[active]

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-16">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=1800&q=85"
          alt="Mongolia culture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6">
          <h1 className="text-white font-black text-3xl">{tr('culture_title')}</h1>
          <p className="text-white/60 text-sm mt-1">
            {lang === 'kr' ? '몽골의 풍부한 역사와 문화를 알아보세요' : lang === 'en' ? "Discover Mongolia's rich history and culture" : 'Монголын баялаг түүх, соёлыг судлаарай'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <div className="w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-24">
              {Object.entries(sections).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                    active === key ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  {s.title[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{sec.icon}</span>
                <h2 className="text-xl font-black text-gray-900">{sec.title[lang]}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                {sec.content[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
