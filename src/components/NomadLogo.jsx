export function NomadLogoIcon({ size = 40 }) {
  const SX = 60, SY = 42, SR = 21;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun rays — 12 chunky pill shapes */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30;
        const r = (a - 90) * Math.PI / 180;
        const d = 26;
        return (
          <rect key={i} x="-3.5" y="-7" width="7" height="14" rx="3.5" fill="#F6BC1A"
            transform={`translate(${SX + d * Math.cos(r)},${SY + d * Math.sin(r)}) rotate(${a})`}/>
        );
      })}

      {/* Sun */}
      <circle cx={SX} cy={SY} r={SR} fill="#F6BC1A"/>

      {/* Wind curls — left */}
      <path d="M22 63 C15 56 12 65 19 71" stroke="#F6BC1A" strokeWidth="5"   strokeLinecap="round" fill="none"/>
      <path d="M17 75 C10 68  7 77 14 83" stroke="#F6BC1A" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* Wind curls — right */}
      <path d="M98 63 C105 56 108 65 101 71"  stroke="#F6BC1A" strokeWidth="5"   strokeLinecap="round" fill="none"/>
      <path d="M103 75 C110 68 113 77 106 83" stroke="#F6BC1A" strokeWidth="4.5" strokeLinecap="round" fill="none"/>

      {/* ── GER (round yurt style) ── */}

      {/* Dome fill — wide, flat dome */}
      <path d="M 18 78 C 18 48 102 48 102 78 Z" fill="#F0EEE8"/>

      {/* Dome outline */}
      <path d="M 18 78 C 18 48 102 48 102 78"
        fill="none" stroke="#1A4D2E" strokeWidth="3.5" strokeLinecap="round"/>

      {/* Toono ring at dome apex */}
      <ellipse cx="60" cy="56" rx="11" ry="4.5" fill="#F0EEE8" stroke="#1A4D2E" strokeWidth="2.5"/>
      {/* Toono cross */}
      <line x1="60" y1="51.5" x2="60" y2="60.5" stroke="#1A4D2E" strokeWidth="2"/>
      <line x1="49" y1="56"   x2="71" y2="56"   stroke="#1A4D2E" strokeWidth="2"/>
      {/* Chimney pole */}
      <rect x="58.5" y="42" width="3" height="16" rx="1.5" fill="#8A8A8A" stroke="#666" strokeWidth="0.5"/>

      {/* Cylindrical wall */}
      <rect x="18" y="77" width="84" height="22" rx="1" fill="#F0EEE8" stroke="#1A4D2E" strokeWidth="3.5"/>

      {/* Wall horizontal bands */}
      <line x1="19" y1="83" x2="101" y2="83" stroke="#1A4D2E" strokeWidth="1.5"/>
      <line x1="19" y1="89" x2="101" y2="89" stroke="#1A4D2E" strokeWidth="1.5"/>
      <line x1="19" y1="94" x2="101" y2="94" stroke="#1A4D2E" strokeWidth="1.5"/>

      {/* Door — orange, centered */}
      <rect x="47" y="77" width="26" height="23" rx="2" fill="#E8851C"/>
      <rect x="49.5" y="79.5" width="21" height="18" rx="1.5" fill="none" stroke="#F5A94A" strokeWidth="1.8"/>
      <line x1="60"   y1="79.5" x2="60"   y2="97.5" stroke="#F5A94A" strokeWidth="1.8"/>
      <line x1="49.5" y1="88"   x2="70.5" y2="88"   stroke="#F5A94A" strokeWidth="1.8"/>

      {/* Left bush */}
      <circle cx="11" cy="100" r="8"   fill="#4CAF50"/>
      <circle cx="18" cy="97"  r="7"   fill="#388E3C"/>
      <circle cx="6"  cy="97"  r="5.5" fill="#43A047"/>

      {/* Right bush */}
      <circle cx="109" cy="100" r="8"   fill="#4CAF50"/>
      <circle cx="102" cy="97"  r="7"   fill="#388E3C"/>
      <circle cx="114" cy="97"  r="5.5" fill="#43A047"/>
    </svg>
  );
}

export function NomadLogoText({ className = '' }) {
  return (
    <span className={`font-black tracking-tight text-gray-900 ${className}`}>
      Nomad<span className="text-primary">iq</span>
    </span>
  )
}

