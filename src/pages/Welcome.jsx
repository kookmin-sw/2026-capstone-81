import { useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'
import { useLang } from '../context/LangContext'

export default function Welcome() {
  const navigate = useNavigate()
  const { tr } = useLang()

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-[#060A1A]">
      {/* Background - Mongolian ger/steppe */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1547448161-c56e75b54317?auto=format&fit=crop&w=600&q=80"
          alt="Mongolia ger grassland"
          className="w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060A1A]/50 via-[#0A0E2A]/30 to-[#060A1A]/92" />
      </div>

      {/* Logo + Tagline */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-4">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-4xl">✈️</span>
          <span className="text-white font-black text-2xl tracking-tight">
            NOMAD<span className="text-blue-400">AI</span>
          </span>
        </div>
        <h1 className="text-white text-3xl font-black leading-tight whitespace-pre-line mb-4">
          {tr('welcome_title')}
        </h1>
        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line max-w-xs">
          {tr('welcome_sub')}
        </p>
      </div>

      {/* Ger silhouette */}
      <div className="relative z-10 flex justify-center pb-1 opacity-25">
        <svg viewBox="0 0 300 60" className="w-64 h-12">
          <ellipse cx="150" cy="58" rx="148" ry="14" fill="#1a2550" />
          <path d="M60,58 Q90,18 150,12 Q210,18 240,58 Z" fill="#0d1533" />
          <rect x="133" y="40" width="34" height="18" fill="#080f24" />
          <path d="M133,40 Q150,32 167,40" fill="none" stroke="#1e2d5a" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 px-5 pb-8 space-y-2.5">
        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-[0.97]"
        >
          <Mail size={17} />
          {tr('btn_email')}
        </button>

        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center justify-center gap-2.5 bg-white text-gray-800 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.97]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          {tr('btn_google')}
        </button>

        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.97]"
        >
          <span className="text-base"></span>
          {tr('btn_apple')}
        </button>

        <div className="flex items-center gap-3 py-0.5">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/40 text-xs font-medium">{tr('or')}</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center justify-center gap-2.5 border border-white/20 text-white/80 font-semibold py-3.5 rounded-2xl hover:bg-white/8 transition-all active:scale-[0.97] text-sm"
        >
          <User size={16} />
          {tr('btn_login')}
        </button>

        <p className="text-center text-white/40 text-xs pt-0.5">
          {tr('no_account')}{' '}
          <button onClick={() => navigate('/home')} className="text-primary font-bold">
            {tr('signup')}
          </button>
        </p>
      </div>
    </div>
  )
}
