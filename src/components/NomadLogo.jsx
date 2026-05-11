// Shared logo SVG component — Mongolian ger with sunrise
export function NomadLogoIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun — large half circle behind ger */}
      <circle cx="30" cy="28" r="14" fill="#e5b829"/>
      {/* Sun rays */}
      <g stroke="#e5b829" strokeWidth="2" strokeLinecap="round">
        <line x1="30" y1="8" x2="30" y2="12"/>
        <line x1="20" y1="10" x2="22" y2="13"/>
        <line x1="40" y1="10" x2="38" y2="13"/>
        <line x1="13" y1="16" x2="16" y2="18"/>
        <line x1="47" y1="16" x2="44" y2="18"/>
        <line x1="10" y1="24" x2="13" y2="24"/>
        <line x1="50" y1="24" x2="47" y2="24"/>
        <line x1="12" y1="32" x2="15" y2="31"/>
        <line x1="48" y1="32" x2="45" y2="31"/>
      </g>
      {/* Clouds */}
      <g fill="none" stroke="#e5b829" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 30 Q8 29 10 30 Q12 29 14 30"/>
        <path d="M46 30 Q48 29 50 30 Q52 29 54 30"/>
      </g>
      {/* Ger body — cream colored dome */}
      <path d="M15 48 Q18 36 30 30 Q42 36 45 48 Z" fill="#f5f0dc" stroke="#1a6b3c" strokeWidth="1.5"/>
      {/* Ger base band */}
      <rect x="16" y="44" width="28" height="5" rx="1" fill="#f5f0dc" stroke="#1a6b3c" strokeWidth="1"/>
      {/* Roof ribs */}
      <line x1="30" y1="30" x2="20" y2="42" stroke="#1a6b3c" strokeWidth="0.8"/>
      <line x1="30" y1="30" x2="40" y2="42" stroke="#1a6b3c" strokeWidth="0.8"/>
      <line x1="30" y1="30" x2="30" y2="44" stroke="#1a6b3c" strokeWidth="0.8"/>
      {/* Crown/toono */}
      <circle cx="30" cy="30" r="2.5" fill="#f5f0dc" stroke="#1a6b3c" strokeWidth="1"/>
      {/* Door with pattern */}
      <rect x="25" y="40" width="10" height="9" rx="1.5" fill="#1a6b3c"/>
      <rect x="27" y="42" width="6" height="5" rx="1" fill="none" stroke="#f5f0dc" strokeWidth="0.8"/>
      <line x1="30" y1="42" x2="30" y2="47" stroke="#f5f0dc" strokeWidth="0.6"/>
      <line x1="27" y1="44.5" x2="33" y2="44.5" stroke="#f5f0dc" strokeWidth="0.6"/>
      {/* Grass tufts */}
      <g stroke="#7cb342" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M8 50 Q9 47 10 50"/>
        <path d="M10 50 Q11 46 12 50"/>
        <path d="M48 50 Q49 47 50 50"/>
        <path d="M50 50 Q51 46 52 50"/>
      </g>
      {/* Ground curve */}
      <path d="M4 52 Q30 48 56 52" stroke="#f5f0dc" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

export function NomadLogoText({ className = '' }) {
  return (
    <span className={`font-black tracking-tight text-gray-900 ${className}`}>
      Nomad<span className="text-primary">iq</span>
    </span>
  )
}

