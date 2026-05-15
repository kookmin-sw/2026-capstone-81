import { createContext, useContext, useState, useEffect } from 'react'
import { t } from '../data/translations'

const LangContext = createContext(null)

const STORAGE_KEY = 'nomadiq.lang'

function initialLang() {
  // 1. 사용자가 명시적으로 바꾼 적이 있으면 그걸 따른다.
  if (typeof window !== 'undefined') {
    const saved = window.localStorage?.getItem(STORAGE_KEY)
    if (saved === 'kr' || saved === 'en' || saved === 'mn') return saved
  }
  // 2. 아니면 항상 한국어로 시작 (서비스 기본 언어).
  return 'kr'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  // setLang 호출은 사용자가 명시적으로 언어를 바꾼 것 — 저장해서 새로고침해도 유지.
  useEffect(() => {
    try { window.localStorage?.setItem(STORAGE_KEY, lang) } catch {}
  }, [lang])

  const tr = (key) => t[lang]?.[key] ?? t['kr']?.[key] ?? t['en']?.[key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
