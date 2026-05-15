import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { mongolianApps, APP_CATEGORIES } from '../data/mongolianApps'
import { ArrowLeft, ExternalLink, Smartphone, Apple, Globe } from 'lucide-react'

const TITLE = { kr: '몽골 필수 앱', en: 'Essential Mongolian Apps', mn: 'Зайлшгүй апп-ууд' }
const SUB = {
  kr: '여행 중 꼭 알아두면 좋은 현지 앱 모음',
  en: 'Useful local apps you should install before your trip',
  mn: 'Аяллын үеэр заавал мэдэх ёстой орон нутгийн апп-ууд',
}

export default function MongolianApps() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [cat, setCat] = useState('all')

  const filtered = cat === 'all'
    ? mongolianApps
    : mongolianApps.filter(a => a.category === cat)

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-black text-gray-900 truncate">{TITLE[lang] ?? TITLE.kr}</h1>
          <p className="text-[11px] text-gray-500 truncate">{SUB[lang] ?? SUB.kr}</p>
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {APP_CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                cat === c.key ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-sm">{c.emoji}</span>
              {c.label[lang] ?? c.label.kr}
            </button>
          ))}
        </div>
      </div>

      {/* App grid */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm font-semibold">
              {lang === 'kr' ? '해당 카테고리에 앱이 없어요' : lang === 'en' ? 'No apps in this category' : 'Энэ ангилалд апп байхгүй'}
            </p>
          </div>
        )}

        {filtered.map(app => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Top row: icon + name + category */}
            <div className="flex items-start gap-3 p-4">
              <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center flex-shrink-0 text-2xl shadow-md`}>
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-900 text-base leading-tight">{app.name[lang] ?? app.name.en}</h3>
                <p className="text-xs text-primary font-semibold mt-0.5">
                  {app.tagline[lang] ?? app.tagline.kr}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="px-4 text-xs text-gray-600 leading-relaxed pb-3">
              {app.description[lang] ?? app.description.kr}
            </p>

            {/* Download / link buttons */}
            <div className="flex border-t border-gray-100 divide-x divide-gray-100">
              {app.androidUrl && (
                <a
                  href={app.androidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Smartphone size={13} /> Android
                </a>
              )}
              {app.iosUrl && (
                <a
                  href={app.iosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Apple size={13} /> iOS
                </a>
              )}
              {app.website && (
                <a
                  href={app.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Globe size={13} />
                  {lang === 'kr' ? '웹사이트' : lang === 'en' ? 'Website' : 'Вэб'}
                </a>
              )}
              {!app.androidUrl && !app.iosUrl && !app.website && (
                <span className="flex-1 text-center py-2.5 text-[11px] text-gray-400">
                  {lang === 'kr' ? '앱스토어에서 검색' : 'Search in app store'}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <p className="text-center text-[10px] text-gray-400 mt-6 px-4 leading-relaxed">
          {lang === 'kr' && '* 앱 다운로드는 외부 스토어로 연결됩니다. 일부 기능은 몽골 SIM 또는 현지 계좌가 필요할 수 있습니다.'}
          {lang === 'en' && '* Download links open in the official app stores. Some features may require a Mongolian SIM or local bank account.'}
          {lang === 'mn' && '* Татах холбоосууд гадаад дэлгүүр рүү шилжинэ. Зарим үйлчилгээ Монгол SIM эсвэл орон нутгийн данс шаардаж болзошгүй.'}
        </p>
      </div>
    </div>
  )
}
