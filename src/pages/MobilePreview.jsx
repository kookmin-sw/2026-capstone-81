import { useRef, useState } from 'react'
import { RotateCw, Home, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react'

// Phone preview wrapper — opens the mobile site inside an iPhone-shaped iframe
// for demo recordings. Open this page on desktop and screen-record the phone
// area. The iframe loads the same Vite origin so routes work normally.

const DEVICES = [
  { key: 'iphone',  label: 'iPhone 14',     w: 390, h: 844, notch: true,  radius: 48 },
  { key: 'iphone-mini', label: 'iPhone Mini', w: 360, h: 780, notch: true, radius: 44 },
  { key: 'pixel',   label: 'Pixel 7',       w: 412, h: 892, notch: false, radius: 36 },
  { key: 'galaxy',  label: 'Galaxy S23',    w: 360, h: 800, notch: false, radius: 40 },
]

export default function MobilePreview() {
  const iframeRef = useRef(null)
  const [device, setDevice] = useState(DEVICES[0])
  const [startUrl, setStartUrl] = useState('/home')
  const [navKey, setNavKey] = useState(0)  // force remount to reload

  const reload = () => setNavKey(k => k + 1)
  const goHome = () => { setStartUrl('/home'); setNavKey(k => k + 1) }
  const back = () => iframeRef.current?.contentWindow?.history.back()
  const forward = () => iframeRef.current?.contentWindow?.history.forward()

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-100 to-slate-200 overflow-y-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <Smartphone size={20} className="text-primary" />
            <h1 className="font-black text-gray-900 text-lg">Mobile Preview</h1>
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">DEMO</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button onClick={back} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center" title="Back">
              <ArrowLeft size={14} className="text-gray-700" />
            </button>
            <button onClick={forward} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center" title="Forward">
              <ArrowRight size={14} className="text-gray-700" />
            </button>
            <button onClick={reload} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center" title="Reload">
              <RotateCw size={13} className="text-gray-700" />
            </button>
            <button onClick={goHome} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center" title="Home">
              <Home size={14} className="text-gray-700" />
            </button>
          </div>

          {/* URL input */}
          <input
            type="text"
            value={startUrl}
            onChange={e => setStartUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && reload()}
            placeholder="/home"
            className="flex-1 min-w-[160px] bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 outline-none focus:border-primary"
          />

          {/* Device picker */}
          <select
            value={device.key}
            onChange={e => setDevice(DEVICES.find(d => d.key === e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer"
          >
            {DEVICES.map(d => <option key={d.key} value={d.key}>{d.label} ({d.w}×{d.h})</option>)}
          </select>
        </div>

        {/* Phone frame */}
        <div className="flex justify-center">
          <div
            className="relative bg-black p-3 shadow-2xl"
            style={{
              width: device.w + 24,
              height: device.h + 24,
              borderRadius: device.radius + 6,
            }}
          >
            {/* Side buttons (decorative) */}
            <div className="absolute -left-1 top-24 w-1 h-8 bg-zinc-700 rounded-l-sm" />
            <div className="absolute -left-1 top-40 w-1 h-14 bg-zinc-700 rounded-l-sm" />
            <div className="absolute -left-1 top-60 w-1 h-14 bg-zinc-700 rounded-l-sm" />
            <div className="absolute -right-1 top-32 w-1 h-20 bg-zinc-700 rounded-r-sm" />

            {/* Screen */}
            <div
              className="relative overflow-hidden bg-white"
              style={{
                width: device.w,
                height: device.h,
                borderRadius: device.radius,
              }}
            >
              {/* Dynamic island / notch (iPhone style) */}
              {device.notch && (
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 bg-black z-10 flex items-center justify-center gap-1.5"
                  style={{ width: 110, height: 28, borderRadius: 999 }}
                >
                  <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                </div>
              )}

              {/* Pixel/Galaxy front camera dot */}
              {!device.notch && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-800 z-10" />
              )}

              {/* The actual mobile site */}
              <iframe
                key={navKey}
                ref={iframeRef}
                src={startUrl}
                title="Nomadiq Mobile Preview"
                className="w-full h-full border-0"
                style={{ borderRadius: device.radius }}
              />
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="max-w-2xl mx-auto mt-6 text-center text-xs text-gray-500 leading-relaxed">
          <p>📹 화면 녹화 시 폰 프레임 부분만 캡처하세요. URL 입력 후 Enter 또는 ⟳ 버튼으로 새로고침.</p>
          <p className="mt-1">⌨️ 백버튼/홈/새로고침은 위 툴바를 사용하세요. iframe 내부 클릭은 정상 작동합니다.</p>
        </div>
      </div>
    </div>
  )
}
