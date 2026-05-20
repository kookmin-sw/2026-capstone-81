import { useEffect, useMemo, useState } from 'react'
import { useLang } from '../context/LangContext'
import { NomadLogoIcon } from './NomadLogo'
import { Sparkles, MapPin, Compass, ArrowRight } from 'lucide-react'

// Welcome overlay shown on every site entry, dismissed by the "Get Started"
// button. Lets the visitor pick a language up front since the whole app is
// multilingual.

// Cycle through a few Mongolian landscape photos so the hero never feels
// static. Each one ken-burns-zooms while the next crossfades over it.
const HEROES = [
  '/images/khuvsgul-lake-luxury.jpg',
  '/images/Khongoryn-Els-scaled.jpg',
  '/images/terelj.jpg',
  '/images/kharkhorum.jpg',
]

const COPY = {
  kr: {
    badge: '몽골 여행 가이드',
    title: 'Nomadiq에 오신 것을\n환영합니다',
    sub: '명소부터 AI 일정까지 — 몽골 여행의 모든 것을 한 곳에서.',
    pickLang: '언어 선택',
    cta: '시작하기',
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
    f1: 'AI аялал төлөвлөгч',
    f2: 'Үзвэр газар, музей',
    f3: 'Орон нутгийн зөвлөгөө, апп',
  },
}

const LANGS = [
  { key: 'kr', label: '한국어', flag: '🇰🇷' },
  { key: 'en', label: 'EN', flag: '🇺🇸' },
  { key: 'mn', label: 'Монгол', flag: '🇲🇳' },
]

// Decorative floating dots — pre-randomised once per mount so the layout
// stays stable across re-renders.
function useParticles(count = 14) {
  return useMemo(
    () => Array.from({ length: count }, () => ({
      left: Math.random() * 100,                  // %
      size: 2 + Math.random() * 3,                // px
      delay: Math.random() * 12,                  // s
      duration: 14 + Math.random() * 12,          // s
      drift: -20 + Math.random() * 40,            // px sideways
      opacity: 0.25 + Math.random() * 0.5,
    })),
    [count],
  )
}

export default function WelcomeScreen({ onClose }) {
  const { lang, setLang } = useLang()
  const [closing, setClosing] = useState(false)
  const [shown, setShown] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const c = COPY[lang] ?? COPY.kr
  const particles = useParticles(14)

  // Entrance animation one frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Crossfade through the hero images.
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HEROES.length), 6000)
    return () => clearInterval(id)
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

  // Staggered slide-up reveal helper.
  const reveal = (i = 0) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(18px)',
    transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
    transitionDelay: `${0.08 + i * 0.07}s`,
  })

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Local keyframes — defined inline so the component is self-contained
          and we don't have to edit the global tailwind config for one screen. */}
      <style>{`
        @keyframes nomadiq-float {
          0%   { transform: translate3d(0, 110vh, 0); opacity: 0; }
          15%  { opacity: var(--op, 0.5); }
          85%  { opacity: var(--op, 0.5); }
          100% { transform: translate3d(var(--drift, 0), -10vh, 0); opacity: 0; }
        }
        @keyframes nomadiq-kenburns {
          from { transform: scale(1.04); }
          to   { transform: scale(1.16); }
        }
      `}</style>

      {/* Hero crossfade stack */}
      {HEROES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === heroIdx ? 1 : 0,
            transition: 'opacity 1.4s ease-in-out',
            animation: i === heroIdx ? 'nomadiq-kenburns 12s ease-out forwards' : 'none',
          }}
        />
      ))}

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-[#0d2a19]/95" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-white"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              '--op': p.opacity,
              '--drift': `${p.drift}px`,
              animation: `nomadiq-float ${p.duration}s linear ${p.delay}s infinite`,
              boxShadow: '0 0 6px rgba(255,255,255,0.55)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full w-full flex flex-col items-center justify-end px-6 pb-9 pt-12">
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* Logo + brand */}
          <div style={reveal(0)} className="flex flex-col items-center">
            <div className="bg-white rounded-3xl p-2.5 shadow-2xl shadow-black/50 ring-1 ring-white/20">
              <NomadLogoIcon size={64} />
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F6BC1A]">
              <span className="w-5 h-px bg-[#F6BC1A]/60" />
              {c.badge}
              <span className="w-5 h-px bg-[#F6BC1A]/60" />
            </span>
          </div>

          {/* Title */}
          <h1
            style={reveal(1)}
            className="mt-4 text-[36px] leading-[1.05] font-black text-white whitespace-pre-line drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
          >
            {c.title}
          </h1>
          <p style={reveal(2)} className="mt-3 text-sm text-white/80 font-medium leading-relaxed">
            {c.sub}
          </p>

          {/* Feature highlights */}
          <div className="mt-6 w-full space-y-2">
            {features.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                style={reveal(3 + i)}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15 shadow-lg shadow-black/10"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F6BC1A] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#F6BC1A]/30">
                  <Icon size={16} className="text-[#1A4D2E]" />
                </div>
                <span className="text-sm font-semibold text-white text-left">{text}</span>
              </div>
            ))}
          </div>

          {/* Language picker */}
          <div style={reveal(6)} className="mt-6 w-full">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
              {c.pickLang}
            </p>
            <div className="flex gap-2">
              {LANGS.map(l => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all ${
                    lang === l.key
                      ? 'border-[#F6BC1A] bg-[#F6BC1A]/20 text-[#F6BC1A] shadow-md shadow-[#F6BC1A]/10'
                      : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
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
            className="group mt-6 w-full py-4 rounded-2xl bg-[#F6BC1A] text-[#1A4D2E] font-black text-base shadow-xl shadow-[#F6BC1A]/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {c.cta}
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
