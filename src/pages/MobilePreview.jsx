import { useRef, useState } from 'react'
import { RotateCw, Home, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react'

// Phone preview wrapper — opens the mobile site inside a realistic phone
// frame for demo recordings. Open this page on desktop and screen-record
// the phone area. The iframe loads the same Vite origin.

const DEVICES = [
  // iPhone 15 Pro — titanium body, Dynamic Island
  { key: 'iphone',     label: 'iPhone 15 Pro', w: 393, h: 852, frame: 'iphone' },
  // Pixel 8 — punch-hole front camera, flat sides
  { key: 'pixel',      label: 'Pixel 8',       w: 412, h: 892, frame: 'pixel' },
]

function StatusBar({ device }) {
  // Faux iOS status bar that always reads "9:41" — looks correct in screenshots
  // and never overlaps actual app UI because it sits in the safe-area inset
  // the app already accounts for (pt-12 on most pages).
  if (device.frame === 'iphone') {
    return (
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-7 pt-2 pb-1 text-[11px] font-bold text-black select-none pointer-events-none">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px]">●●●●</span>
          <span className="text-[10px]">📶</span>
          <span className="text-[10px]">🔋</span>
        </div>
      </div>
    )
  }
  return (
    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 pt-1.5 pb-1 text-[11px] font-medium text-black select-none pointer-events-none">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">5G</span>
        <span className="text-[10px]">●●●</span>
        <span className="text-[10px]">●●</span>
      </div>
    </div>
  )
}

function IPhoneFrame({ children, w, h }) {
  // Outer titanium body with edge highlight + heavy drop shadow
  const bodyW = w + 24
  const bodyH = h + 24
  return (
    <div className="relative" style={{ width: bodyW, height: bodyH }}>
      {/* Drop shadow plate (large soft shadow + small contact shadow) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            '0 60px 80px -30px rgba(0,0,0,0.45), 0 30px 30px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05) inset',
          borderRadius: 56,
        }}
      />
      {/* Phone body — brushed titanium look */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #444 0%, #1a1a1c 22%, #0e0e10 50%, #1a1a1c 78%, #555 100%)',
          borderRadius: 56,
          padding: 12,
        }}
      >
        {/* Inner bezel */}
        <div
          className="relative w-full h-full bg-black overflow-hidden"
          style={{ borderRadius: 46 }}
        >
          {children}
        </div>
      </div>

      {/* Side buttons */}
      {/* Silent toggle (top-left) */}
      <div className="absolute left-[-3px] top-[88px] w-1.5 h-7 bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-l-sm" />
      {/* Volume up */}
      <div className="absolute left-[-3px] top-[130px] w-1.5 h-14 bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-l-sm" />
      {/* Volume down */}
      <div className="absolute left-[-3px] top-[200px] w-1.5 h-14 bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-l-sm" />
      {/* Power / side button */}
      <div className="absolute right-[-3px] top-[150px] w-1.5 h-20 bg-gradient-to-l from-zinc-900 to-zinc-700 rounded-r-sm" />

      {/* Highlight edge */}
      <div
        className="absolute inset-[2px] pointer-events-none"
        style={{
          borderRadius: 54,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.05) 100%)',
        }}
      />
    </div>
  )
}

function PixelFrame({ children, w, h }) {
  const bodyW = w + 22
  const bodyH = h + 22
  return (
    <div className="relative" style={{ width: bodyW, height: bodyH }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            '0 60px 80px -30px rgba(0,0,0,0.45), 0 30px 30px -20px rgba(0,0,0,0.25)',
          borderRadius: 44,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 50%, #2a2a2a 100%)',
          borderRadius: 44,
          padding: 11,
        }}
      >
        <div
          className="relative w-full h-full bg-black overflow-hidden"
          style={{ borderRadius: 34 }}
        >
          {children}
        </div>
      </div>
      {/* Volume rocker */}
      <div className="absolute right-[-2.5px] top-[180px] w-1.5 h-20 bg-zinc-700 rounded-r-sm" />
      {/* Power */}
      <div className="absolute right-[-2.5px] top-[120px] w-1.5 h-10 bg-zinc-600 rounded-r-sm" />
    </div>
  )
}

export default function MobilePreview() {
  const iframeRef = useRef(null)
  const [device, setDevice] = useState(DEVICES[0])
  const [startUrl, setStartUrl] = useState('/home')
  const [navKey, setNavKey] = useState(0)

  const reload = () => setNavKey(k => k + 1)
  const goHome = () => { setStartUrl('/home'); setNavKey(k => k + 1) }
  const back = () => iframeRef.current?.contentWindow?.history.back()
  const forward = () => iframeRef.current?.contentWindow?.history.forward()

  const Frame = device.frame === 'iphone' ? IPhoneFrame : PixelFrame

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 overflow-y-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-3 mb-8 flex flex-wrap items-center gap-2 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mr-2">
            <Smartphone size={18} className="text-primary" />
            <h1 className="font-black text-gray-900 text-sm">Mobile Preview</h1>
            <span className="text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">DEMO</span>
          </div>

          <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
            <button onClick={back} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center" title="Back">
              <ArrowLeft size={13} className="text-gray-700" />
            </button>
            <button onClick={forward} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center" title="Forward">
              <ArrowRight size={13} className="text-gray-700" />
            </button>
            <button onClick={reload} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center" title="Reload">
              <RotateCw size={12} className="text-gray-700" />
            </button>
            <button onClick={goHome} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center" title="Home">
              <Home size={13} className="text-gray-700" />
            </button>
          </div>

          <input
            type="text"
            value={startUrl}
            onChange={e => setStartUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && reload()}
            placeholder="/home"
            className="flex-1 min-w-[140px] bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-primary"
          />

          <select
            value={device.key}
            onChange={e => setDevice(DEVICES.find(d => d.key === e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700 outline-none cursor-pointer"
          >
            {DEVICES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>

        {/* Phone frame */}
        <div className="flex justify-center pb-8">
          <Frame w={device.w} h={device.h}>
            {/* Screen content area */}
            <div className="relative w-full h-full bg-white">
              {/* Faux status bar */}
              <StatusBar device={device} />

              {/* Dynamic Island (iPhone) */}
              {device.frame === 'iphone' && (
                <div
                  className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-black z-30 flex items-center justify-end px-3"
                  style={{ width: 122, height: 36, borderRadius: 999 }}
                >
                  {/* Tiny camera dot inside the island */}
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
                </div>
              )}

              {/* Punch-hole camera (Pixel) */}
              {device.frame === 'pixel' && (
                <div
                  className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-black z-30 rounded-full"
                  style={{ width: 12, height: 12 }}
                >
                  <div className="absolute inset-[2px] rounded-full bg-zinc-800" />
                </div>
              )}

              {/* Actual mobile site */}
              <iframe
                key={navKey}
                ref={iframeRef}
                src={startUrl}
                title="Nomadiq Mobile Preview"
                className="w-full h-full border-0 bg-white"
                allow="geolocation; camera; microphone"
              />

              {/* Home indicator bar (iPhone gesture pill) */}
              {device.frame === 'iphone' && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/85 rounded-full z-30 pointer-events-none" />
              )}
            </div>
          </Frame>
        </div>

        {/* Tips */}
        <div className="max-w-2xl mx-auto text-center text-xs text-gray-600 leading-relaxed">
          <p>📹 화면 녹화 시 폰 프레임 부분만 캡처하세요. URL 입력 후 Enter 또는 ⟳ 버튼으로 새로고침.</p>
          <p className="mt-1">⌨️ 백버튼/홈/새로고침은 위 툴바를 사용하세요. iframe 내부 클릭은 정상 작동합니다.</p>
        </div>
      </div>
    </div>
  )
}
