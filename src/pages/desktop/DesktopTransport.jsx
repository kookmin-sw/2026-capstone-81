import { useState } from 'react'
import { useLang } from '../../context/LangContext'
import { Bus, Search, MapPin, ExternalLink, ChevronRight, Clock, Wallet } from 'lucide-react'
import { DESTINATIONS, findRoute } from '../../data/routeData'

const TYPE_COLOR = {
  bus:    'bg-green-50 text-green-700 border-green-200',
  flight: 'bg-blue-50 text-blue-700 border-blue-200',
  jeep:   'bg-amber-50 text-amber-700 border-amber-200',
  taxi:   'bg-amber-50 text-amber-700 border-amber-200',
  train:  'bg-violet-50 text-violet-700 border-violet-200',
}

function OptionCard({ opt, lang }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{opt.emoji}</span>
          <div>
            <p className="font-black text-gray-900 text-sm leading-tight">{opt.label[lang] ?? opt.label.en}</p>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${TYPE_COLOR[opt.type] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {opt.type === 'bus' ? (lang === 'kr' ? '버스' : lang === 'mn' ? 'Автобус' : 'Bus')
                : opt.type === 'flight' ? (lang === 'kr' ? '항공' : lang === 'mn' ? 'Нислэг' : 'Flight')
                : opt.type === 'jeep' ? (lang === 'kr' ? '지프' : lang === 'mn' ? 'Жийп' : 'Jeep')
                : opt.type === 'taxi' ? (lang === 'kr' ? '택시' : lang === 'mn' ? 'Такси' : 'Taxi')
                : opt.type === 'train' ? (lang === 'kr' ? '기차' : lang === 'mn' ? 'Галт тэрэг' : 'Train')
                : opt.type}
            </span>
          </div>
        </div>
        {opt.link && (
          <a href={opt.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0">
            {opt.linkLabel ?? (lang === 'kr' ? '예약' : lang === 'mn' ? 'Захиал' : 'Book')}
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {opt.departs && (
          <div className="flex items-start gap-1.5">
            <Clock size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">
                {lang === 'kr' ? '출발' : lang === 'mn' ? 'Гарах цаг' : 'Departs'}
              </p>
              <p className="font-black text-gray-800">{opt.departs}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-1.5">
          <Clock size={12} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              {lang === 'kr' ? '소요 시간' : lang === 'mn' ? 'Зарцуулах хугацаа' : 'Duration'}
            </p>
            <p className="font-black text-gray-800">{opt.duration[lang] ?? opt.duration.en}</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5">
          <Wallet size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              {lang === 'kr' ? '요금' : lang === 'mn' ? 'Тариф' : 'Cost'}
            </p>
            <p className="font-black text-gray-800">{opt.cost[lang] ?? opt.cost.en}</p>
          </div>
        </div>
        {opt.pickup && (
          <div className="flex items-start gap-1.5">
            <MapPin size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">
                {lang === 'kr' ? '승차 위치' : lang === 'mn' ? 'Суудаг газар' : 'Pick-up'}
              </p>
              <p className="font-black text-gray-800 text-[11px] leading-tight">{opt.pickup[lang] ?? opt.pickup.en}</p>
            </div>
          </div>
        )}
      </div>

      {opt.note && (
        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-[11px] text-amber-800 font-semibold">
          💡 {opt.note[lang] ?? opt.note.en}
        </div>
      )}
    </div>
  )
}

function RouteSection({ title, badge, route, lang }) {
  if (!route) return null
  return (
    <div>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {badge && (
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">
              {badge}
            </span>
          )}
          <p className="text-sm font-black text-gray-800">{title}</p>
        </div>
      )}
      <p className="text-xs text-gray-400 mb-3">
        📍 {lang === 'kr' ? `이동 거리 약 ${route.dist_km} km` : lang === 'mn' ? `Зай ойролцоогоор ${route.dist_km} км` : `Distance ~${route.dist_km} km`}
      </p>
      <div className="space-y-3">
        {route.options.map((opt, i) => (
          <OptionCard key={i} opt={opt} lang={lang} />
        ))}
      </div>
    </div>
  )
}

export default function DesktopTransport() {
  const { lang } = useLang()
  const [toKey, setToKey] = useState('kharkhorin')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  const search = () => {
    const r = findRoute('ub', toKey)
    setResult(r)
    setSearched(true)
  }

  const toDest = DESTINATIONS.find(d => d.key === toKey)

  const hasResult = result && result.step2

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy via-primary-dark to-primary py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Bus size={22} className="text-yellow-300" />
            <h1 className="text-2xl font-black text-white">
              {lang === 'kr' ? '교통편 찾기' : lang === 'en' ? 'Find Transport' : 'Тээврийн хэрэгсэл хайх'}
            </h1>
          </div>
          <p className="text-white/70 text-base">
            {lang === 'kr' ? '울란바토르에서 몽골 각지로 이동하는 버스·항공·기차 정보'
              : lang === 'en' ? 'Buses, flights & trains from Ulaanbaatar to destinations across Mongolia'
              : 'Улаанбаатараас Монголын янз бүрийн газруудад хүрэх тээврийн мэдээлэл'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 gap-8 items-start">

          {/* Left: Search form */}
          <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900">
              {lang === 'kr' ? '목적지 선택' : lang === 'en' ? 'Select Destination' : 'Очих газар сонгох'}
            </h2>

            {/* Static departure label */}
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
              <span className="text-xl">🇲🇳</span>
              <div>
                <p className="font-black text-sm text-primary">
                  {lang === 'kr' ? '울란바토르 (출발지)' : lang === 'en' ? 'Ulaanbaatar (departure)' : 'Улаанбаатар (гарах газар)'}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold">
                  {lang === 'kr' ? '몽골 내 교통편 기준' : lang === 'en' ? 'Domestic Mongolia routes' : 'Монгол доторх маршрут'}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-primary" />
                {lang === 'kr' ? '목적지 (몽골 내)' : lang === 'en' ? 'Destination (in Mongolia)' : 'Очих газар (Монгол доторх)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DESTINATIONS.map(dest => (
                  <button
                    key={dest.key}
                    onClick={() => setToKey(dest.key)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-2xl border-2 text-left transition-all ${
                      toKey === dest.key
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{dest.emoji}</span>
                    <span className="font-bold text-xs leading-tight">{dest[lang] ?? dest.en}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={search}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl transition-all hover:-translate-y-0.5 text-base"
            >
              <Search size={18} />
              {lang === 'kr' ? '교통편 찾기' : lang === 'en' ? 'Find Routes' : 'Маршрут хайх'}
            </button>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-black text-blue-800 mb-2">
                {lang === 'kr' ? '💡 이용 팁' : lang === 'en' ? '💡 Tips' : '💡 Зөвлөмж'}
              </p>
              <div className="space-y-1.5 text-[11px] text-blue-700">
                {[
                  { kr: '장거리 버스 티켓은 바얀주르흐 텡게르 플라자 또는 드래곤버스 터미널에서 구매 가능', en: 'Intercity bus tickets available at Bayanzurkh Tenger Plaza or Dragon Bus Terminal', mn: 'Хот хоорондын автобусны тасалбарыг Баянзүрх Тэнгэр Плаза эсвэл Дрэгон Бусны буудлаас авна' },
                  { kr: 'UBCab 앱으로 울란바토르 내/주변 택시 이용 가능', en: 'Use UBCab app for taxis in/around Ulaanbaatar', mn: 'УБ болон орчин тойронд UBCab аппыг ашиглаарай' },
                  { kr: '고비·허브스골 등 장거리는 항공이 훨씬 편리', en: 'For Gobi / Khuvsgul, flights save many hours vs bus', mn: 'Говь, Хөвсгөл зэрэг алслагдсан газарт нислэг хамаагүй тохиромжтой' },
                ].map((t, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">·</span>
                    {t[lang] ?? t.en}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {!searched && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-500 text-base mb-2">
                  {lang === 'kr' ? '출발지와 목적지를 선택하세요' : lang === 'en' ? 'Select departure and destination' : 'Гарах болон очих газраа сонгоорой'}
                </p>
                <p className="text-gray-400 text-sm">
                  {lang === 'kr' ? '버스·항공·기차 옵션을 모두 보여드립니다' : lang === 'en' ? 'We\'ll show bus, flight, and train options' : 'Автобус, нислэг, галт тэрэгний сонголтыг харуулна'}
                </p>
              </div>
            )}

            {searched && !hasResult && (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <div className="text-5xl mb-4">😕</div>
                <p className="text-gray-500 text-base">
                  {lang === 'kr' ? '해당 노선 정보가 없습니다' : lang === 'en' ? 'No route data found' : 'Энэ маршрутын мэдээлэл олдсонгүй'}
                </p>
              </div>
            )}

            {hasResult && (
              <div className="space-y-6">
                {/* Journey header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">🇲🇳</span>
                    <span className="font-black text-gray-900 text-sm">
                      {lang === 'kr' ? '울란바토르' : lang === 'mn' ? 'Улаанбаатар' : 'Ulaanbaatar'}
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                    <span className="text-lg">{toDest?.emoji}</span>
                    <span className="font-black text-gray-900 text-sm">{toDest?.[lang] ?? toDest?.en}</span>
                  </div>
                </div>

                {/* Direct route */}
                {result.step2 && (
                  <RouteSection
                    title={null}
                    badge={null}
                    route={result.step2}
                    lang={lang}
                  />
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
