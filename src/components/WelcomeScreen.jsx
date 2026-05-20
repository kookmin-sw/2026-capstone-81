import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { NomadLogoIcon } from './NomadLogo'
import { Sparkles, MapPin, Compass, ArrowRight } from 'lucide-react'

// Welcome overlay shown on every site entry, dismissed by the "Get Started"
// button. Lets the visitor pick a language up front since the whole app is
// multilingual.

const HERO = '/images/khuvsgul-lake-luxury.jpg'

const COPY = {
  kr: {
    badge: '몽골 여행 가이드',
    title: 'Nomadiq에 오신 것을\n환영합니다',
    sub: '명소부터 AI 일정까지 — 몽골 여행의 모든 것을 한 곳에서.',
    pickLang: '언어 선택',
    cta: '시작하기',
    team: '팀 소개 보기',
    f1: 'AI 맞춤 여행 플래너',
    f2: '명소 · 박물관 탐색',
    f3: '현지 꿀팁 & 필수 앱',
  },
  en: {
    badge: 'Your Mongolia travel guide',
    title: 'Welcome to\nNomadiq',
    sub: 'From hidden gems to AI itineraries — everything for Mongolia in one place.',
    pickLang: 'Language',
    cta: 'Get Started',
    team: 'Meet the team',
    f1: 'AI-powered trip planner',
    f2: 'Explore sights & museums',
    f3: 'Local tips & essential apps',
  },
  mn: {
    badge: 'Монгол аяллын хөтөч',
    title: 'Nomadiq-д\nтавтай морил',
    sub: 'Үзвэр газраас AI хуваарь хүртэл — Монгол аяллын бүхэн нэг дор.',
    pickLang: 'Хэл',
    cta: 'Эхлэх',
    team: 'Багийн танилцуулга',
    f1: 'AI аялал төлөвлөгч',
    f2: 'Үзвэр газар, музей',
    f3: 'Орон нутгийн зөвлөгөө, апп',
  },
}

const TEAM_URL = 'https://kookmin-sw.github.io/2026-capstone-81/'

const LANGS = [
  { key: 'kr', label: '한국어', flag: '🇰🇷' },
  { key: 'en', label: 'EN', flag: '🇺🇸' },
  { key: 'mn', label: 'Монгол', flag: '🇲🇳' },
]

export default function WelcomeScreen({ onClose }) {
  const { lang, setLang } = useLang()
  const [closing, setClosing] = useState(false)
  const [shown, setShown] = useState(false)
  const c = COPY[lang] ?? COPY.kr

  // Trigger the entrance animation one frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const start = () => {
    setClosing(true)
    setTimeout(() => onClose?.(), 380)
  }

  const features = [
    { icon: Sparkles, text: c.f1 },
    { icon: Compass,  text: c.f2 },
    { icon: MapPin,   text: c.f3 },
  ]

  // Staggered reveal helper — items slide up + fade as `shown` flips.
  const reveal = (i = 0) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
    transitionDelay: `${0.1 + i * 0.08}s`,
  })

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Hero photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO})`,
          transform: shown && !closing ? 'scale(1)' : 'scale(1.12)',
          transition: 'transform 7s ease-out',
        }}
      />
      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-[#0d2a19]/95" />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col items-center justify-end px-6 pb-9 pt-12">
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* Logo + brand */}
          <div style={reveal(0)} className="flex flex-col items-center">
            <div className="bg-white rounded-3xl p-2.5 shadow-2xl shadow-black/50">
              <NomadLogoIcon size={60} />
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#F6BC1A]">
              <span className="w-5 h-px bg-[#F6BC1A]/60" />
              {c.badge}
              <span className="w-5 h-px bg-[#F6BC1A]/60" />
            </span>
          </div>

          {/* Title */}
          <h1
            style={reveal(1)}
            className="mt-3 text-[34px] leading-[1.1] font-black text-white whitespace-pre-line drop-shadow-lg"
          >
            {c.title}
          </h1>
          <p style={reveal(2)} className="mt-3 text-sm text-white/75 font-medium leading-relaxed">
            {c.sub}
          </p>

          {/* Feature highlights */}
          <div className="mt-6 w-full space-y-2">
            {features.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                style={reveal(3 + i)}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F6BC1A] flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#1A4D2E]" />
                </div>
                <span className="text-sm font-semibold text-white text-left">{text}</span>
              </div>
            ))}
          </div>

          {/* Language picker */}
          <div style={reveal(6)} className="mt-6 w-full">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
              {c.pickLang}
            </p>
            <div className="flex gap-2">
              {LANGS.map(l => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all ${
                    lang === l.key
                      ? 'border-[#F6BC1A] bg-[#F6BC1A]/20 text-[#F6BC1A]'
                      : 'border-white/15 bg-white/5 text-white/70'
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
            style={reveal(7)}
            className="group mt-5 w-full py-4 rounded-2xl bg-[#F6BC1A] text-[#1A4D2E] font-black text-base shadow-xl shadow-black/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {c.cta}
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Team intro — opens the project's GitHub Pages page in a new tab */}
          <a
            href={TEAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={reveal(8)}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70 hover:text-[#F6BC1A] underline-offset-4 hover:underline transition-colors"
          >
            {c.team} →
          </a>
        </div>
      </div>
    </div>
  )
}
