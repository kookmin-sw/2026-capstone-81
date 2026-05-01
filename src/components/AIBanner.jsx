import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function AIBanner() {
  const navigate = useNavigate()
  const { tr, lang } = useLang()

  const badge = lang === 'kr' ? 'AI 추천' : lang === 'mn' ? 'AI санал' : 'AI Pick'

  return (
    <div
      className="mx-4 rounded-2xl overflow-hidden cursor-pointer relative"
      onClick={() => navigate('/planner')}
      style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #1e40af 50%, #1d4ed8 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
      <div className="absolute top-6 right-16 w-16 h-16 bg-white/5 rounded-full" />

      <div className="relative p-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="inline-block bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
            {badge}
          </div>
          <p className="text-white font-bold text-sm leading-snug whitespace-pre-line">
            {tr('ai_banner_title')}
          </p>
          <div className="mt-3 flex items-center gap-1.5 bg-white text-primary w-fit px-4 py-2 rounded-full shadow-sm">
            <span className="text-xs font-bold">{tr('ai_banner_btn')}</span>
          </div>
        </div>
        <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
          <span className="text-5xl">🤖</span>
        </div>
      </div>
    </div>
  )
}
