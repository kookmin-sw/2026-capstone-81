import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { Bus, MapPin, Search, ExternalLink, Clock, Wallet, ChevronRight } from 'lucide-react'
import MobileLayout from './MobileLayout'
import { DESTINATIONS, findRoute } from '../../data/routeData'

const TYPE_COLOR = {
  bus:    'bg-green-50 text-green-700 border-green-200',
  flight: 'bg-blue-50 text-blue-700 border-blue-200',
  jeep:   'bg-amber-50 text-amber-700 border-amber-200',
  taxi:   'bg-amber-50 text-amber-700 border-amber-200',
  train:  'bg-violet-50 text-violet-700 border-violet-200',
}

function OptionCard({ opt, lang }) {
  const typeLabel = {
    bus:    { kr: '버스', en: 'Bus', mn: 'Автобус' },
    flight: { kr: '항공', en: 'Flight', mn: 'Нислэг' },
    jeep:   { kr: '지프', en: 'Jeep', mn: 'Жийп' },
    taxi:   { kr: '택시', en: 'Taxi', mn: 'Такси' },
    train:  { kr: '기차', en: 'Train', mn: 'Галт тэрэг' },
  }
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{opt.emoji}</span>
          <div>
            <p className="font-black text-gray-900 text-xs leading-tight">{opt.label[lang] ?? opt.label.en}</p>
            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full border mt-0.5 ${TYPE_COLOR[opt.type] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {typeLabel[opt.type]?.[lang] ?? opt.type}
            </span>
          </div>
        </div>
        {opt.link && (
          <a href={opt.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            {opt.linkLabel ?? (lang === 'kr' ? '예약' : lang === 'mn' ? 'Захиал' : 'Book')}
            <ExternalLink size={9} />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
        {opt.departs && (
          <div>
            <p className="text-[9px] text-gray-400 font-semibold uppercase flex items-center gap-1">
              <Clock size={9} /> {lang === 'kr' ? '출발' : lang === 'mn' ? 'Гарах цаг' : 'Departs'}
            </p>
            <p className="font-black text-gray-800">{opt.departs}</p>
          </div>
        )}
        <div>
          <p className="text-[9px] text-gray-400 font-semibold uppercase flex items-center gap-1">
            <Clock size={9} /> {lang === 'kr' ? '소요' : lang === 'mn' ? 'Хугацаа' : 'Duration'}
          </p>
          <p className="font-black text-gray-800">{opt.duration[lang] ?? opt.duration.en}</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 font-semibold uppercase flex items-center gap-1">
            <Wallet size={9} /> {lang === 'kr' ? '요금' : lang === 'mn' ? 'Тариф' : 'Cost'}
          </p>
          <p className="font-black text-gray-800">{opt.cost[lang] ?? opt.cost.en}</p>
        </div>
        {opt.pickup && (
          <div>
            <p className="text-[9px] text-gray-400 font-semibold uppercase flex items-center gap-1">
              <MapPin size={9} /> {lang === 'kr' ? '승차' : lang === 'mn' ? 'Суудаг газар' : 'Pick-up'}
            </p>
            <p className="font-black text-gray-800 text-[10px] leading-tight">{opt.pickup[lang] ?? opt.pickup.en}</p>
          </div>
        )}
      </div>

      {opt.note && (
        <div className="mt-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-[10px] text-amber-800 font-semibold">
          💡 {opt.note[lang] ?? opt.note.en}
        </div>
      )}
    </div>
  )
}

export default function MobileTransport() {
  const { lang } = useLang()
  const [toKey, setToKey] = useState('kharkhorin')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  const [showForm, setShowForm] = useState(true)

  const search = () => {
    const r = findRoute('ub', toKey)
    setResult(r)
    setSearched(true)
    setShowForm(false)
  }

  const toDest = DESTINATIONS.find(d => d.key === toKey)
  const hasResult = result && result.step2

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Bus size={20} className="text-primary" />
          <h1 className="text-2xl font-black text-gray-900">
            {lang === 'kr' ? '교통편 찾기' : lang === 'en' ? 'Find Transport' : 'Тээврийн хэрэгсэл'}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-5">
          {lang === 'kr' ? '울란바토르에서 몽골 각지로 이동하는 교통편'
            : lang === 'en' ? 'Buses, flights & trains from Ulaanbaatar across Mongolia'
            : 'Улаанбаатараас Монголын бусад газруудад хүрэх тээврийн мэдээлэл'}
        </p>

        {/* Search form toggle */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm mb-4"
          >
            <div className="flex items-center gap-2 text-sm font-black text-gray-700">
              <span>🇲🇳</span>
              <span>{lang === 'kr' ? '울란바토르' : lang === 'mn' ? 'Улаанбаатар' : 'Ulaanbaatar'}</span>
              <ChevronRight size={14} className="text-gray-400" />
              <span>{toDest?.emoji}</span>
              <span>{toDest?.[lang] ?? toDest?.en}</span>
            </div>
            <span className="text-xs text-primary font-bold">
              {lang === 'kr' ? '변경' : lang === 'mn' ? 'Өөрчлөх' : 'Change'}
            </span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 space-y-4">
            {/* Static departure */}
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5">
              <span className="text-base">🇲🇳</span>
              <div>
                <p className="font-black text-xs text-primary">
                  {lang === 'kr' ? '울란바토르 (출발지)' : lang === 'en' ? 'Ulaanbaatar (departure)' : 'Улаанбаатар (гарах газар)'}
                </p>
                <p className="text-[9px] text-gray-400 font-semibold">
                  {lang === 'kr' ? '몽골 내 교통편 기준' : lang === 'en' ? 'Domestic routes' : 'Монгол доторх маршрут'}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="text-sm font-black text-gray-900 flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-primary" />
                {lang === 'kr' ? '목적지 (몽골 내)' : lang === 'en' ? 'Destination' : 'Очих газар'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DESTINATIONS.map(dest => (
                  <button
                    key={dest.key}
                    onClick={() => setToKey(dest.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                      toKey === dest.key ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{dest.emoji}</span>
                    <span className={`font-bold text-[10px] leading-tight ${toKey === dest.key ? 'text-primary' : 'text-gray-700'}`}>
                      {dest[lang] ?? dest.en}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={search}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-black rounded-2xl text-base shadow-lg shadow-primary/30"
            >
              <Search size={18} />
              {lang === 'kr' ? '교통편 찾기' : lang === 'en' ? 'Find Routes' : 'Маршрут хайх'}
            </button>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 space-y-1.5">
              {[
                { kr: '🎫 티켓 구매: 바얀주르흐 텡게르 플라자 또는 드래곤버스 터미널', en: '🎫 Tickets: Bayanzurkh Tenger Plaza or Dragon Bus Terminal', mn: '🎫 Тасалбар: Баянзүрх Тэнгэр Плаза эсвэл Дрэгон Бусны буудал' },
                { kr: '🚕 택시: UBCab 앱 사용 권장', en: '🚕 Taxi: Use UBCab app', mn: '🚕 Такси: UBCab аппыг ашиглаарай' },
                { kr: '✈️ 고비·허브스골 장거리는 항공 추천', en: '✈️ Gobi / Khuvsgul: flight recommended', mn: '✈️ Говь, Хөвсгөл: нислэг илүү тохиромжтой' },
              ].map((t, i) => (
                <p key={i} className="text-[11px] text-blue-700 font-semibold">{t[lang] ?? t.en}</p>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searched && !hasResult && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-gray-500 text-sm">
              {lang === 'kr' ? '해당 노선 정보가 없습니다' : lang === 'en' ? 'No route data found' : 'Маршрутын мэдээлэл олдсонгүй'}
            </p>
          </div>
        )}

        {hasResult && (
          <div className="space-y-5">
            {/* Journey badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base">🇲🇳</span>
              <span className="font-black text-gray-800 text-sm">
                {lang === 'kr' ? '울란바토르' : lang === 'mn' ? 'Улаанбаатар' : 'Ulaanbaatar'}
              </span>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-base">{toDest?.emoji}</span>
              <span className="font-black text-gray-800 text-sm">{toDest?.[lang] ?? toDest?.en}</span>
            </div>

            {/* Route options */}
            {result.step2 && (
              <div>
                <p className="text-[10px] text-gray-400 mb-2">📍 ~{result.step2.dist_km} km</p>
                <div className="space-y-2.5">
                  {result.step2.options.map((opt, i) => <OptionCard key={i} opt={opt} lang={lang} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
