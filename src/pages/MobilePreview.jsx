import { useEffect, useRef, useState } from 'react'
import { RotateCw, Home, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react'

// Phone preview wrapper — opens the mobile site inside a clean iPhone-style
// frame for demo recordings. Open this page on desktop and screen-record
// the phone area. The iframe loads the same Vite origin.

const DEVICE = { w: 390, h: 844 }

function useNowHHMM() {
  // Show actual current time in the status bar so demo recordings feel real.
  const [t, setT] = useState(() => fmt(new Date()))
  useEffect(() => {
    const id = setInterval(() => setT(fmt(new Date())), 30 * 1000)
    return () => clearInterval(id)
  }, [])
  return t
}
function fmt(d) {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function StatusBar() {
  const time = useNowHHMM()
  return (
    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-8 pt-2.5 text-[13px] font-semibold text-black select-none pointer-events-none tracking-tight">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0"  y="7" width="3" height="4"  rx="0.5" fill="currentColor"/>
          <rect x="4.5" y="5" width="3" height="6"  rx="0.5" fill="currentColor"/>
          <rect x="9"  y="3" width="3" height="8"  rx="0.5" fill="currentColor"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor"/>
        </svg>
        {/* Wi-Fi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 10.5l-1.2-1.2a1.7 1.7 0 0 1 2.4 0L7.5 10.5z" fill="currentColor"/>
          <path d="M4.3 7.3a4.5 4.5 0 0 1 6.4 0l-1 1a3.1 3.1 0 0 0-4.4 0l-1-1z" fill="currentColor"/>
          <path d="M1.5 4.5a8.5 8.5 0 0 1 12 0l-1 1a7.1 7.1 0 0 0-10 0l-1-1z" fill="currentColor"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="relative w-[24px] h-[11px] rounded-[3px] border border-black/90">
            <div className="absolute inset-[1.5px] bg-black rounded-[1.5px]" style={{ width: '80%' }} />
          </div>
          <div className="w-[1.5px] h-[4px] bg-black/60 rounded-r-sm ml-[1px]" />
        </div>
      </div>
    </div>
  )
}

function IPhoneFrame({ children, w, h }) {
  // Thin matte-black bezel — no titanium gloss, no fake side buttons.
  // Aim: look like a sleek product render at a glance.
  const pad = 10
  const bodyW = w + pad * 2
  const bodyH = h + pad * 2
  return (
    <div className="relative" style={{ width: bodyW, height: bodyH }}>
      {/* Soft floor shadow */}
      <div
        aria-hidden
        className="absolute -inset-x-6 -bottom-6 h-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25), transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      {/* Body */}
      <div
        className="absolute inset-0"
        style={{
          background: '#0b0b0d',
          borderRadius: 54,
          padding: pad,
          boxShadow:
            '0 30px 60px -20px rgba(0,0,0,0.45), 0 10px 20px -10px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Screen */}
        <div className="relative w-full h-full bg-white overflow-hidden" style={{ borderRadius: 44 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Append ?view=mobile to whatever path the user typed so the iframe always
// renders the MobileApp routes (App.jsx detect() respects this).
function withMobileFlag(path) {
  try {
    const u = new URL(path || '/home', window.location.origin)
    u.searchParams.set('view', 'mobile')
    return u.pathname + u.search + u.hash
  } catch {
    return '/home?view=mobile'
  }
}

export default function MobilePreview() {
  const iframeRef = useRef(null)
  const [startUrl, setStartUrl] = useState('/home')
  const [navKey, setNavKey] = useState(0)

  const reload   = () => setNavKey(k => k + 1)
  const goHome   = () => { setStartUrl('/home'); setNavKey(k => k + 1) }
  const back     = () => iframeRef.current?.contentWindow?.history.back()
  const forward  = () => iframeRef.current?.contentWindow?.history.forward()

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-100 to-slate-300 overflow-y-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Slim toolbar */}
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-md py-1.5 px-2 mb-8 flex items-center gap-1.5 max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5 pl-2 pr-1">
            <Smartphone size={14} className="text-primary" />
            <span className="text-[11px] font-black text-gray-900">Preview</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={back}    title="Back"    className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center"><ArrowLeft  size={13} className="text-gray-700" /></button>
            <button onClick={forward} title="Forward" className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center"><ArrowRight size={13} className="text-gray-700" /></button>
            <button onClick={reload}  title="Reload"  className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center"><RotateCw   size={12} className="text-gray-700" /></button>
            <button onClick={goHome}  title="Home"    className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center"><Home       size={13} className="text-gray-700" /></button>
          </div>
          <input
            type="text"
            value={startUrl}
            onChange={e => setStartUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && reload()}
            placeholder="/home"
            className="flex-1 min-w-[120px] bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 outline-none focus:border-primary"
          />
        </div>

        {/* Phone */}
        <div className="flex justify-center pb-10">
          <IPhoneFrame w={DEVICE.w} h={DEVICE.h}>
            {/* Status bar (sits inside the screen, in the safe area) */}
            <StatusBar />

            {/* Dynamic Island */}
            <div
              className="absolute top-[11px] left-1/2 -translate-x-1/2 bg-black z-30"
              style={{ width: 120, height: 35, borderRadius: 999 }}
              aria-hidden
            />

            {/* Mobile site — forced to MobileApp routes via ?view=mobile */}
            <iframe
              key={navKey}
              ref={iframeRef}
              src={withMobileFlag(startUrl)}
              title="Nomadiq Mobile Preview"
              className="w-full h-full border-0 bg-white"
              allow="geolocation; camera; microphone"
            />

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-30 pointer-events-none" />
          </IPhoneFrame>
        </div>

        {/* Tip */}
        <p className="text-center text-[11px] text-gray-500">
          📹 폰 프레임 영역만 캡처해서 화면 녹화하세요.
        </p>
      </div>
    </div>
  )
}
