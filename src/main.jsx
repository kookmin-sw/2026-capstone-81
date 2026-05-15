import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { App as CapApp } from '@capacitor/app'

// Capacitor 하드웨어 뒤로가기 버튼 처리
CapApp.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back()
  } else {
    CapApp.exitApp()
  }
})

// Skip Service Worker registration inside the Capacitor native shell — the
// app is bundled offline-first already and the SW's caching layer caused
// "Response body is already used" errors that prevented the React root from
// rendering on Android (white screen on launch).
const isCapacitor = typeof window !== 'undefined' && (
  window.Capacitor != null ||
  /capacitor:\/\//.test(window.location.protocol) ||
  window.location.hostname === 'localhost' && window.location.protocol === 'https:'
)
if ('serviceWorker' in navigator && !isCapacitor) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
