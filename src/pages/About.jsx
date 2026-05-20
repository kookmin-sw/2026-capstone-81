import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTilt } from '../hooks/useTilt'
import { NomadLogoIcon } from '../components/NomadLogo'

// Project intro page — the in-app version of the GitHub Pages site, but with
// everything implementation-related stripped (no GitHub, no tech stack, no
// "how it was built"). Just the project pitch, features, and team.

const HERO = '/images/khuvsgul-lake-luxury.jpg'

const COPY = {
  kr: {
    tagline: 'AI와 떠나는\n몽골 여행의 새로운 방식',
    sub: 'AI 챗봇 · 맞춤형 일정 자동 생성 · 인터랙티브 지도 · 커뮤니티 블로그를 하나의 앱에서.',
    featuresTitle: '주요 기능',
    featuresSub: 'Nomadiq가 제공하는 6가지 핵심 기능',
    teamTitle: '팀 소개',
    teamSub: '국민대학교 2026 캡스톤 디자인 · 팀 81',
    footer: '© 2026 Nomadiq · 국민대학교 캡스톤 디자인 팀 81',
  },
  en: {
    tagline: 'A new way\nto travel Mongolia with AI',
    sub: 'AI chatbot, auto-generated itineraries, an interactive map and a community blog — all in one app.',
    featuresTitle: 'Key Features',
    featuresSub: 'Six core features Nomadiq offers',
    teamTitle: 'The Team',
    teamSub: 'Kookmin University 2026 Capstone · Team 81',
    footer: '© 2026 Nomadiq · Kookmin University Capstone Team 81',
  },
  mn: {
    tagline: 'AI-тай хамт Монголд\nаялах шинэ арга',
    sub: 'AI чатбот, автомат хуваарь үүсгэгч, интерактив газрын зураг, нийтийн блог — бүгд нэг апп дотор.',
    featuresTitle: 'Гол боломжууд',
    featuresSub: 'Nomadiq-ийн 6 үндсэн боломж',
    teamTitle: 'Багийн танилцуулга',
    teamSub: 'Күнмин Их Сургууль · 2026 Capstone · Баг 81',
    footer: '© 2026 Nomadiq · Күнмин Их Сургууль · Capstone Баг 81',
  },
}

const FEATURES = [
  {
    emoji: '🤖',
    title: { kr: 'AI 챗봇 "Nomadiq"', en: 'AI Chatbot "Nomadiq"', mn: '"Nomadiq" AI чатбот' },
    desc: {
      kr: '몽골 전문 AI 챗봇. 대화 중 언급된 장소를 지도에 실시간으로 표시해줍니다.',
      en: 'Mongolia-expert AI chatbot. Places mentioned in chat appear on the map in real time.',
      mn: 'Монголд мэргэшсэн AI чатбот. Ярианд дурдсан газрууд газрын зурагт шууд гарна.',
    },
  },
  {
    emoji: '🗓️',
    title: { kr: 'AI 여행 플래너', en: 'AI Trip Planner', mn: 'AI аяллын төлөвлөгч' },
    desc: {
      kr: '여행 기간, 관심사, 예산, 페이스를 선택하면 일별 상세 일정이 자동으로 생성됩니다.',
      en: 'Pick your dates, interests, budget and pace — get a fully detailed day-by-day itinerary instantly.',
      mn: 'Хугацаа, сонирхол, төсөв, хурдаа сонгоход өдөр тутмын дэлгэрэнгүй хуваарь автоматаар гарна.',
    },
  },
  {
    emoji: '🗺️',
    title: { kr: '인터랙티브 지도', en: 'Interactive Map', mn: 'Интерактив газрын зураг' },
    desc: {
      kr: '여행지 마커를 한눈에. 챗봇과 실시간 연동되어 언급된 장소가 자동으로 표시됩니다.',
      en: 'Every destination at a glance, synced live with the chatbot so mentioned places appear instantly.',
      mn: 'Бүх үзвэр газар нэг дор. Чатботтой шууд холбогдсон тул дурдсан газар тэр даруй гарна.',
    },
  },
  {
    emoji: '🏔️',
    title: { kr: '여행지 탐색', en: 'Destination Explorer', mn: 'Аяллын газар хайх' },
    desc: {
      kr: '울란바토르, 고비 사막, 테를지, 홉스골 등 12개 이상 지역과 박물관을 카테고리별로 탐색하세요.',
      en: 'Explore 12+ destinations and museums — UB, Gobi, Terelj, Khuvsgul — filtered by category.',
      mn: 'Улаанбаатар, Говь, Тэрэлж, Хөвсгөл — 12+ газар, музейг ангиллаар нь үзнэ.',
    },
  },
  {
    emoji: '📝',
    title: { kr: '블로그 커뮤니티', en: 'Blog Community', mn: 'Блог нийгэмлэг' },
    desc: {
      kr: '여행 후기를 직접 작성하고 다른 여행자의 글과 사진을 둘러보세요.',
      en: 'Write your own travel story and browse posts, photos and tips from other travelers.',
      mn: 'Аяллын тэмдэглэлээ бичиж, бусад аялагчдын зураг, зөвлөгөөг үзээрэй.',
    },
  },
  {
    emoji: '🛠️',
    title: { kr: '여행 유틸리티', en: 'Travel Utilities', mn: 'Аяллын хэрэгслүүд' },
    desc: {
      kr: '예산 계산기, 패킹 리스트, 문화 가이드, 레스토랑, 현지 필수 앱까지 한 곳에서.',
      en: 'Budget calculator, packing list, culture guide, restaurants, and essential local apps — all in one.',
      mn: 'Төсөв тооцоолуур, бэлтгэх жагсаалт, соёлын хөтөч, ресторан, орон нутгийн апп — бүгд нэг дор.',
    },
  },
]

const TEAM = [
  { name: '노민 에르덴',   id: '20223579', role: { kr: '팀장 · Full-stack',  en: 'Lead · Full-stack',  mn: 'Багийн ахлагч · Full-stack' }, gradient: 'from-emerald-300 to-emerald-500' },
  { name: '빌랙자르갈',     id: '20213003', role: { kr: 'Frontend',           en: 'Frontend',           mn: 'Frontend'                  }, gradient: 'from-amber-300 to-amber-500'    },
  { name: '체벡수랭홀랑',   id: '20223582', role: { kr: 'Frontend',           en: 'Frontend',           mn: 'Frontend'                  }, gradient: 'from-violet-300 to-violet-500'  },
  { name: '오토공체체그',   id: '20233064', role: { kr: 'Backend',            en: 'Backend',            mn: 'Backend'                   }, gradient: 'from-sky-300 to-sky-500'        },
  { name: '헝거르졸',       id: '20233121', role: { kr: 'Design · Frontend',  en: 'Design · Frontend',  mn: 'Дизайн · Frontend'         }, gradient: 'from-rose-300 to-rose-500'      },
]

function FeatureCard({ feature, lang }) {
  const tilt = useTilt(6)
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl p-7"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center text-2xl mb-5 shadow-sm">
        {feature.emoji}
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2">{feature.title[lang] ?? feature.title.kr}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{feature.desc[lang] ?? feature.desc.kr}</p>
    </div>
  )
}

function TeamCard({ member, lang }) {
  const tilt = useTilt(5)
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl p-6 text-center"
    >
      <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-2xl font-black text-white shadow-md mb-4`}>
        {member.name[0]}
      </div>
      <h3 className="font-black text-gray-900 text-sm mb-1">{member.name}</h3>
      <p className="font-mono text-[11px] text-gray-400 mb-3">{member.id}</p>
      <span className="inline-block text-[11px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
        {member.role[lang] ?? member.role.kr}
      </span>
    </div>
  )
}

export default function About() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const c = COPY[lang] ?? COPY.kr

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-[#0d2a19]/95" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/30 transition-colors text-white"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <div className="bg-white rounded-3xl p-3 shadow-2xl shadow-black/40 mb-6">
            <NomadLogoIcon size={70} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight whitespace-pre-line drop-shadow-lg max-w-3xl">
            {c.tagline}
          </h1>
          <p className="mt-5 text-sm md:text-lg text-white/75 max-w-2xl">{c.sub}</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900">{c.featuresTitle}</h2>
            <p className="text-sm text-gray-500 mt-3">{c.featuresSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} lang={lang} />)}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900">{c.teamTitle}</h2>
            <p className="text-sm text-gray-500 mt-3">{c.teamSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {TEAM.map(m => <TeamCard key={m.id} member={m} lang={lang} />)}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-gray-400 bg-gray-50">
        {c.footer}
      </footer>
    </div>
  )
}
