import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { NomadLogoIcon } from './NomadLogo'
import { ArrowRight } from 'lucide-react'

// Welcome overlay shown on every site entry, dismissed by the "Get Started"
// button. Lets the visitor pick a language up front since the whole app is
// multilingual.

const COPY = {
  kr: {
    badge: '국민대학교 2026 캡스톤 디자인 · 팀 81',
    titleStart: 'AI와 떠나는\n',
    titleHighlight: '몽골 여행',
    titleEnd: '의 새로운 방식',
    sub: 'Google Gemini 기반 AI 챗봇 · 맞춤형 일정 자동 생성 · 인터랙티브 지도 · 커뮤니티 블로그를 하나의 앱에서.',
    pickLang: '언어 선택',
    cta: '시작하기',
  },
  en: {
    badge: 'Kookmin University 2026 Capstone · Team 81',
    titleStart: 'A new way to travel\n',
    titleHighlight: 'Mongolia',
    titleEnd: ' with AI',
    sub: 'AI chatbot, auto-generated itineraries, an interactive map and a community blog — all in one app.',
    pickLang: 'Language',
    cta: 'Get Started',
  },
  mn: {
    badge: 'Күнмин Их Сургууль · 2026 Capstone · Баг 81',
    titleStart: '',
    titleHighlight: 'Монгол',
    titleEnd: 'д аялах\nшинэ арга AI-тай',
    sub: 'AI чатбот, автомат хуваарь үүсгэгч, интерактив газрын зураг, нийтийн блог — бүгд нэг апп дотор.',
    pickLang: 'Хэл',
    cta: 'Эхлэх',
  },
}

const LANGS = [
  { key: 'kr', label: '한국어', flag: '🇰🇷' },
  { key: 'en', label: 'EN',     flag: '🇺🇸' },
  { key: 'mn', label: 'Монгол', flag: '🇲🇳' },
]

export default function WelcomeScreen({ onClose }) {
  const { lang, setLang } = useLang()
  const [closing, setClosing] = useState(false)
  const [shown, setShown] = useState(false)
  const c = COPY[lang] ?? COPY.kr

  // Entrance animation one frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const start = () => {
    setClosing(true)
    setTimeout(() => onClose?.(), 380)
  }

  // Staggered slide-up reveal helper.
  const reveal = (i = 0) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(18px)',
    transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
    transitionDelay: `${0.08 + i * 0.07}s`,
  })

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-y-auto transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          'linear-gradient(135deg, #ecfdf5 0%, #fef9c3 45%, #e0f2fe 100%)',
      }}
    >
      {/* Soft decorative blobs — pure CSS, no animation library. */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 w-[420px] h-[420px] rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md flex flex-col items-center text-center">

          {/* Team badge */}
          <div
            style={reveal(0)}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-emerald-100 shadow-sm rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-bold text-emerald-700">{c.badge}</span>
          </div>

          {/* Logo with yellow glow */}
          <div style={reveal(1)} className="relative mb-6">
            <div className="absolute inset-0 -m-6 bg-yellow-300/60 blur-3xl rounded-full" />
            <div className="relative bg-white rounded-[28px] p-3 shadow-xl shadow-emerald-200/50 ring-1 ring-emerald-100">
              <NomadLogoIcon size={88} />
            </div>
          </div>

          {/* Title */}
          <h1
            style={reveal(2)}
            className="text-[40px] md:text-[44px] leading-[1.05] font-black text-gray-900 whitespace-pre-line tracking-tight"
          >
            {c.titleStart}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              {c.titleHighlight}
            </span>
            {c.titleEnd}
          </h1>

          {/* Subtitle */}
          <p style={reveal(3)} className="mt-5 max-w-md text-[15px] text-gray-500 leading-relaxed">
            {c.sub}
          </p>

          {/* Language picker */}
          <div style={reveal(4)} className="mt-8 w-full max-w-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              {c.pickLang}
            </p>
            <div className="flex gap-2">
              {LANGS.map(l => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all ${
                    lang === l.key
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-gray-200 bg-white/70 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/40'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="text-[11px] font-bold">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={start}
            style={reveal(5)}
            className="group mt-6 w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {c.cta}
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
