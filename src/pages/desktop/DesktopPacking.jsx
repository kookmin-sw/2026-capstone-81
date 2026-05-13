import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { CheckSquare, Square, Shirt, FileText, HeartPulse, Laptop, Tent, Utensils } from 'lucide-react'

const packingData = [
  {
    icon: FileText,
    title: { kr: '서류 & 금전', en: 'Documents & Money', mn: 'Бичиг баримт & Мөнгө' },
    items: [
      { kr: '여권 (유효기간 6개월 이상)', en: 'Passport (6+ months validity)', mn: 'Паспорт (6+ сарын хугацаатай)' },
      { kr: '몽골 비자 / e-비자 출력본', en: 'Mongolia visa / e-visa printout', mn: 'Монголын виз / э-виз хэвлэмэл' },
      { kr: '여행자 보험 증서', en: 'Travel insurance certificate', mn: 'Аяллын даатгалын гэрчилгээ' },
      { kr: '국제 신용카드', en: 'International credit card', mn: 'Олон улсын кредит карт' },
      { kr: '현금 USD / MNT', en: 'Cash USD / MNT', mn: 'Бэлэн мөнгө USD / MNT' },
      { kr: '항공권 예약 확인서', en: 'Flight booking confirmation', mn: 'Нислэгийн захиалгын баталгаа' },
    ]
  },
  {
    icon: Shirt,
    title: { kr: '의류', en: 'Clothing', mn: 'Хувцас' },
    items: [
      { kr: '방풍 재킷 / 경량 패딩', en: 'Windproof jacket / light down jacket', mn: 'Салхи нэвтрэхгүй хүрэм / хөнгөн пуховик' },
      { kr: '레이어링용 긴팔 상의', en: 'Long-sleeve layering tops', mn: 'Давхарлах урт ханцуйт цамц' },
      { kr: '방수 바지 / 트레킹 팬츠', en: 'Waterproof / trekking pants', mn: 'Усны тэсвэртэй / трекингийн өмд' },
      { kr: '두꺼운 양말 (울 소재 권장)', en: 'Thick socks (wool recommended)', mn: 'Зузаан оймс (ноос зөвлөмжтэй)' },
      { kr: '트레킹화 / 방수 신발', en: 'Trekking / waterproof boots', mn: 'Треккингийн / усны тэсвэртэй гутал' },
      { kr: '모자 & 장갑 & 선글라스', en: 'Hat, gloves & sunglasses', mn: 'Малгай, бээлий & нарны шил' },
      { kr: '속건 티셔츠 2–3장', en: '2–3 quick-dry t-shirts', mn: '2–3 хурдан хатдаг футболк' },
      { kr: '따뜻한 수면복 / 내복', en: 'Warm sleepwear / thermal underwear', mn: 'Дулаан унтлагын хувцас / термо доторлогоо' },
    ]
  },
  {
    icon: HeartPulse,
    title: { kr: '건강 & 위생', en: 'Health & Hygiene', mn: 'Эрүүл мэнд & Ариун цэвэр' },
    items: [
      { kr: '개인 상비약 (두통약, 소화제, 지사제)', en: 'Personal meds (headache, digestion, diarrhea)', mn: 'Хувийн эм (толгой өвдөх, хоол боловсруулах, суулгалтын)' },
      { kr: '자외선 차단제 SPF 50+', en: 'Sunscreen SPF 50+', mn: 'Нарны хамгаалалт SPF 50+' },
      { kr: '모기 기피제', en: 'Mosquito repellent', mn: 'Шумуулаас хамгаалах бодис' },
      { kr: '항균 손 소독제', en: 'Antibacterial hand sanitizer', mn: 'Антибактерийн гар цэвэрлэгч' },
      { kr: '구급 밴드 & 압박 붕대', en: 'Band-aids & compression bandage', mn: 'Наалдаас боолт & хавчуур баглаа' },
      { kr: '물 정수 정제 / 필터', en: 'Water purification tablets / filter', mn: 'Усны цэвэршүүлэлтийн таблет / шүүлтүүр' },
      { kr: '고산병 약 (다이아목스)', en: 'Altitude sickness pills (Diamox)', mn: 'Уулын өвчний эм (Диамокс)' },
    ]
  },
  {
    icon: Laptop,
    title: { kr: '전자기기', en: 'Electronics', mn: 'Электрон төхөөрөмж' },
    items: [
      { kr: '유니버설 어댑터 (Type C/E)', en: 'Universal adapter (Type C/E)', mn: 'Универсал адаптер (Type C/E)' },
      { kr: '보조 배터리 (20,000mAh+)', en: 'Power bank (20,000mAh+)', mn: 'Нөөц цэнэглэгч (20,000mAh+)' },
      { kr: '카메라 & 여분 배터리', en: 'Camera & spare batteries', mn: 'Камер & нөөц батарей' },
      { kr: '오프라인 지도 앱 다운로드 (Maps.me)', en: 'Offline map app downloaded (Maps.me)', mn: 'Оффлайн газрын зураг апп татаж авах (Maps.me)' },
      { kr: '심카드 또는 포켓 와이파이', en: 'SIM card or pocket WiFi', mn: 'Сим карт эсвэл гар утасны wifi' },
      { kr: '이어폰 & 블루투스 스피커', en: 'Earphones & bluetooth speaker', mn: 'Чихэвч & блютүүт чанга яригч' },
    ]
  },
  {
    icon: Tent,
    title: { kr: '캠핑 & 야외', en: 'Camping & Outdoors', mn: 'Кемпинг & Гадаа' },
    items: [
      { kr: '침낭 (영하 5도 이상 등급)', en: 'Sleeping bag (rated -5°C or below)', mn: 'Унтлагын уут (-5°C ба доош үнэлгээтэй)' },
      { kr: '등산용 스틱', en: 'Trekking poles', mn: 'Треккингийн таяг' },
      { kr: '헤드 랜턴 & 여분 배터리', en: 'Headlamp & spare batteries', mn: 'Толгойн дэнлүү & нөөц батарей' },
      { kr: '다용도 칼 / 멀티툴', en: 'Multi-purpose knife / multi-tool', mn: 'Олон зориулалтын хутга / мульти хэрэгсэл' },
      { kr: '방수 배낭 커버', en: 'Waterproof backpack cover', mn: 'Усны тэсвэртэй нуруун дэвсгэр' },
      { kr: '빠른 건조 수건', en: 'Quick-dry towel', mn: 'Хурдан хатдаг алчуур' },
    ]
  },
  {
    icon: Utensils,
    title: { kr: '식품 & 간식', en: 'Food & Snacks', mn: 'Хоол & Зуушны зүйл' },
    items: [
      { kr: '에너지 바 / 견과류', en: 'Energy bars / nuts', mn: 'Эрчим хүчний баар / самар' },
      { kr: '전해질 파우더 (포카리 등)', en: 'Electrolyte powder (Pocari etc.)', mn: 'Электролит нунтаг (Pokari гэх мэт)' },
      { kr: '인스턴트 라면 (야외용)', en: 'Instant noodles (for outdoors)', mn: 'Агаарт шуурхай гоймон' },
      { kr: '재사용 물통 1L', en: 'Reusable 1L water bottle', mn: 'Дахин ашиглах боломжтой 1L усны сав' },
    ]
  },
]

export default function DesktopPacking() {
  const { lang } = useLang()
  const [checked, setChecked] = useState({})

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems = packingData.reduce((acc, cat) => acc + cat.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="px-8 py-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">
          {lang === 'kr' ? '몽골 여행 준비물 체크리스트' :
           lang === 'en' ? 'Mongolia Travel Packing Checklist' :
           'Монголын аяллын бэлтгэлийн жагсаалт'}
        </h1>
        <p className="text-gray-400 text-sm">
          {lang === 'kr' ? '출발 전 빠짐없이 챙겨보세요' :
           lang === 'en' ? 'Make sure you have everything before you go' :
           'Явахаасаа өмнө бүгдийг шалгаарай'}
        </p>

        {/* Progress bar */}
        <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>{lang === 'kr' ? '준비 완료' : lang === 'en' ? 'Packed' : 'Бэлэн'}</span>
              <span className="font-bold text-primary">{checkedCount} / {totalItems}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / totalItems) * 100}%` }}
              />
            </div>
          </div>
          {checkedCount === totalItems && totalItems > 0 && (
            <span className="text-sm font-bold text-primary">
              {lang === 'kr' ? '완료! 🎉' : lang === 'en' ? 'Done! 🎉' : 'Дууслаа! 🎉'}
            </span>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {packingData.map((cat, catIdx) => {
          const Icon = cat.icon
          const catChecked = cat.items.filter((_, i) => checked[`${catIdx}-${i}`]).length
          return (
            <div key={catIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <h2 className="font-black text-gray-900 text-sm flex-1">{cat.title[lang]}</h2>
                <span className="text-xs text-gray-400 font-semibold">{catChecked}/{cat.items.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`
                  const done = !!checked[key]
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => toggle(catIdx, itemIdx)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      {done
                        ? <CheckSquare size={16} className="text-primary flex-shrink-0" />
                        : <Square size={16} className="text-gray-300 flex-shrink-0" />
                      }
                      <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {item[lang]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pb-6" />
    </div>
  )
}
