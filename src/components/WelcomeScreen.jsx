import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { NomadLogoIcon } from './NomadLogo'
import { Sparkles, MapPin, Compass } from 'lucide-react'

// First-visit welcome overlay. Shown once per browser (localStorage flag),
// dismissed by the "Get Started" button. Lets the visitor pick a language
// up front since the whole app is multilingual.

const STORAGE_KEY = 'nomadiq.welcomed'

export function hasWelcomed() {
  try { return window.localStorage?.getItem(STORAGE_KEY) === '1' } catch { return false }
}
export function markWelcomed() {
  try { window.localStorage?.setItem(STORAGE_KEY, '1') } catch {}
}

const COPY = {
  kr: {
    title: 'Nomadiq에 오신 것을\n환영합니다',
    sub: '몽골 여행의 모든 것, 한 곳에서',
    pickLang: '언어를 선택하세요',
    cta: '시작하기',
    f1: 'AI 여행 플래너',
    f2: '명소 · 박물관 탐색',
    f3: '현지 꿀팁 & 필수 앱',
  },
  en: {
    title: 'Welcome to\nNomadiq',
    sub: 'Everything for your Mongolia trip, in one place',
    pickLang: 'Choose your language',
    cta: 'Get Started',
    f1: 'AI Trip Planner',
    f2: 'Explore sights & museums',
    f3: 'Local tips & essential apps',
  },
  mn: {
    title: 'Nomadiq-д\nтавтай морил',
    sub: 'Монгол аяллын бүх зүйл нэг дор',
    pickLang: 'Хэлээ сонгоно уу',
    cta: 'Эхлэх',
    f1: 'AI аялал төлөвлөгч',
    f2: 'Үзвэр газар, музей',
    f3: 'Орон нутгийн зөвлөгөө, апп',
  },
}

const LANGS = [
  { key: 'kr', label: '한국어', flag: '🇰🇷' },
  { key: 'en', label: 'English', flag: '🇺🇸' },
  { key: 'mn', label: 'Монгол', flag: '🇲🇳' },
]

export default function WelcomeScreen({ onClose }) {
  const { lang, setLang } = useLang()
  const [closing, setClosing] = useState(false)
  const c = COPY[lang] ?? COPY.kr

  const start = () => {
    markWelcomed()
    setClosing(true)
    setTimeout(() => onClose?.(), 320)
  }

  const features = [
    { icon: Sparkles, text: c.f1 },
    { icon: Compass,  text: c.f2 },
    { icon: MapPin,   text: c.f3 },
  ]

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #1A4D2E 0%, #143d24 45%, #0d2a19 100%)',
      }}
    >
      {/* Soft glow accents */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-[#F6BC1A]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-12%] right-[-8%] w-80 h-80 rounded-full bg-[#E8851C]/15 blur-3xl pointer-events-none" />

      <div
        className={`relative w-full max-w-sm flex flex-col items-center text-center transition-all duration-500 ${
          closing ? 'scale-95' : 'scale-100'
        }`}
      >
        {/* Logo */}
        <div className="bg-white rounded-3xl p-3 shadow-2xl shadow-black/40 mb-5">
          <NomadLogoIcon size={72} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-white leading-tight whitespace-pre-line">
          {c.title}
        </h1>
        <p className="mt-3 text-sm text-emerald-100/80 font-medium">{c.sub}</p>

        {/* Feature highlights */}
        <div className="mt-6 w-full space-y-2">
          {features.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/10"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F6BC1A] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#1A4D2E]" />
              </div>
              <span className="text-sm font-semibold text-white text-left">{text}</span>
            </div>
          ))}
        </div>

        {/* Language picker */}
        <p className="mt-7 mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-200/60">
          {c.pickLang}
        </p>
        <div className="flex gap-2 w-full">
          {LANGS.map(l => (
            <button
              key={l.key}
              onClick={() => setLang(l.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 transition-all ${
                lang === l.key
                  ? 'border-[#F6BC1A] bg-[#F6BC1A]/15'
                  : 'border-white/15 bg-white/5'
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className={`text-[10px] font-bold ${lang === l.key ? 'text-[#F6BC1A]' : 'text-emerald-100/70'}`}>
                {l.label}
              </span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={start}
          className="mt-6 w-full py-4 rounded-2xl bg-[#F6BC1A] text-[#1A4D2E] font-black text-base shadow-xl shadow-[#F6BC1A]/25 active:scale-[0.98] transition-transform"
        >
          {c.cta}
        </button>
      </div>
    </div>
  )
}
