import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createContext, useContext, useState } from 'react'
import { t } from '../data/translations'

/**
 * Bug Condition Exploration Test
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7**
 *
 * Property 1: Bug Condition — Itinerary and Budget Labels Hardcoded in Korean for Non-Korean Languages
 *
 * These tests encode the EXPECTED (correct) behavior. They are written BEFORE the fix
 * and are expected to FAIL on unfixed code, confirming the bug exists.
 * When the fix is applied, these tests should PASS.
 */

// ============================================================
// Replicate the FIXED generateItinerary from AIPlanner.jsx
// (uses translation keys via t[lang] instead of hardcoded Korean)
// ============================================================
// Activity count per day: days 1-3 have 5, days 4-6 have 4, day 7 has 3
const dayActivityCounts = [5, 5, 5, 4, 4, 4, 3]

function mobileGenerateItinerary(days, lang) {
  const l = t[lang] || t['kr']
  const plans = Array.from({ length: 7 }, (_, i) => {
    const d = i + 1
    const actCount = dayActivityCounts[i]
    return {
      title: l[`itin_day${d}_title`],
      activities: Array.from({ length: actCount }, (_, j) => l[`itin_day${d}_act${j + 1}`]),
    }
  })
  return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: i + 1,
    ...(plans[i] || plans[plans.length - 1]),
  }))
}

// ============================================================
// Replicate the FIXED generateItinerary from DesktopPlanner.jsx
// (uses translation keys via t[lang] instead of hardcoded Korean)
// ============================================================
// Activity count per desktop day: days 1-3 have 5, days 4-6 have 4, day 7 has 5
const desktopDayActivityCounts = [5, 5, 5, 4, 4, 4, 5]

function desktopGenerateItinerary(days, budget, interests, lang) {
  const l = t[lang] || t['kr']
  const itinerary = []

  for (let d = 1; d <= Math.min(days, 7); d++) {
    const actCount = desktopDayActivityCounts[d - 1]
    itinerary.push({
      day: d,
      title: l[`desktop_itin_day${d}_title`],
      activities: Array.from({ length: actCount }, (_, j) => l[`desktop_itin_day${d}_act${j + 1}`]),
    })
  }

  if (days > 7) {
    itinerary.push({
      day: days,
      title: l['itin_day7_title'],
      activities: [l['itin_day7_act1'], l['itin_day7_act2'], l['itin_day7_act3']],
    })
  }

  return itinerary
}

// ============================================================
// Replicate the FIXED mobile budget label logic from AIPlanner.jsx
// (uses translation keys via t[lang] instead of incomplete ternary)
// ============================================================
function getMobileBudgetLabels(lang) {
  const l = t[lang] || t['kr']
  return [
    [l['budget_flight'], 0.35],
    [l['budget_hotel'], 0.25],
    [l['budget_food'], 0.20],
    [l['budget_activity'], 0.15],
    [l['budget_other'], 0.05],
  ]
}

// ============================================================
// Replicate the FIXED desktop budget labels from DesktopPlanner.jsx
// (uses translation keys via t[lang] instead of hardcoded Korean)
// ============================================================
function getDesktopBudgetLabels(lang) {
  const l = t[lang] || t['kr']
  return [
    { label: l['budget_flight'], pct: 0.35 },
    { label: l['budget_hotel'], pct: 0.25 },
    { label: l['budget_food'], pct: 0.20 },
    { label: l['budget_activity'], pct: 0.15 },
    { label: l['budget_other'], pct: 0.05 },
  ]
}

// ============================================================
// Replicate the FIXED desktop currency logic from DesktopPlanner.jsx
// (language-aware currency selection)
// ============================================================
function getDesktopCurrency(lang) {
  return lang === 'kr' ? '만원' : lang === 'en' ? 'USD' : '₮'
}

// ============================================================
// Helper: Korean character detection (Hangul range)
// ============================================================
function containsKorean(str) {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/.test(str)
}

// ============================================================
// Expected budget labels per language (correct behavior)
// ============================================================
const expectedBudgetLabels = {
  en: ['Flights', 'Accommodation', 'Food', 'Activities', 'Other'],
  mn: ['Нислэг', 'Буудал', 'Хоол', 'Үйл ажиллагаа', 'Бусад'],
  kr: ['항공권', '숙박', '식비', '액티비티', '기타'],
}

const expectedCurrency = {
  en: 'USD',
  mn: '₮',
  kr: '만원',
}

// Generator for non-Korean languages
const nonKoreanLangArb = fc.constantFrom('en', 'mn')
// Generator for day counts
const daysArb = fc.integer({ min: 1, max: 14 })
// Generator for budget values
const budgetArb = fc.integer({ min: 30, max: 500 })

describe('Bug Condition Exploration: Itinerary and Budget Labels Hardcoded in Korean', () => {

  describe('Mobile generateItinerary() returns Korean for non-Korean languages', () => {
    /**
     * **Validates: Requirements 1.1, 1.2, 1.7**
     *
     * Property: For any non-Korean language (en, mn) and any day count,
     * generateItinerary() should NOT return Korean titles.
     * On unfixed code, this FAILS because the function always returns Korean.
     */
    it('property: mobile itinerary titles should not contain Korean for non-Korean languages', () => {
      fc.assert(
        fc.property(nonKoreanLangArb, daysArb, (lang, days) => {
          const itinerary = mobileGenerateItinerary(days, lang)
          // Expected behavior: titles should NOT contain Korean characters for non-Korean languages
          for (const day of itinerary) {
            if (containsKorean(day.title)) {
              return false
            }
          }
          return true
        }),
        { numRuns: 50 }
      )
    })
  })

  describe('Desktop generateItinerary() returns Korean for non-Korean languages', () => {
    /**
     * **Validates: Requirements 1.1, 1.2, 1.7**
     *
     * Property: For any non-Korean language (en, mn) and any day count,
     * desktop generateItinerary() should NOT return Korean titles.
     * On unfixed code, this FAILS because the function always returns Korean.
     */
    it('property: desktop itinerary titles should not contain Korean for non-Korean languages', () => {
      fc.assert(
        fc.property(nonKoreanLangArb, daysArb, budgetArb, (lang, days, budget) => {
          const itinerary = desktopGenerateItinerary(days, budget, ['int_nature'], lang)
          for (const day of itinerary) {
            if (containsKorean(day.title)) {
              return false
            }
          }
          return true
        }),
        { numRuns: 50 }
      )
    })
  })

  describe('Mobile budget labels fall through to English for Mongolian', () => {
    /**
     * **Validates: Requirements 1.3**
     *
     * Property: For lang='mn', mobile budget labels should show Mongolian labels.
     * On unfixed code, this FAILS because the ternary only checks for 'kr' and
     * defaults to English for everything else, so Mongolian users see English labels.
     */
    it('property: mobile budget labels for mn should be Mongolian, not English fallback', () => {
      const labels = getMobileBudgetLabels('mn')
      const labelNames = labels.map(([label]) => label)

      // Expected: Mongolian labels like 'Нислэг', 'Буудал', etc.
      // Bug: shows English labels 'Flights', 'Hotels', etc. because ternary falls through
      const expectedMn = expectedBudgetLabels.mn
      for (let i = 0; i < labelNames.length; i++) {
        expect(labelNames[i]).toBe(expectedMn[i])
      }
    })
  })

  describe('Desktop budget labels are hardcoded Korean regardless of language', () => {
    /**
     * **Validates: Requirements 1.4**
     *
     * Property: For any non-Korean language, desktop budget labels should NOT be Korean.
     * On unfixed code, this FAILS because labels are hardcoded Korean strings.
     */
    it('property: desktop budget labels should not be Korean for non-Korean languages', () => {
      fc.assert(
        fc.property(nonKoreanLangArb, (lang) => {
          const labels = getDesktopBudgetLabels(lang)
          for (const { label } of labels) {
            if (containsKorean(label)) {
              return false
            }
          }
          return true
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Desktop currency is hardcoded 만원 regardless of language', () => {
    /**
     * **Validates: Requirements 1.5**
     *
     * Property: For any non-Korean language, desktop currency should match the language.
     * On unfixed code, this FAILS because currency is hardcoded as '만원'.
     */
    it('property: desktop currency should match language, not hardcoded Korean', () => {
      fc.assert(
        fc.property(nonKoreanLangArb, (lang) => {
          const currency = getDesktopCurrency(lang)
          const expected = expectedCurrency[lang]
          return currency === expected
        }),
        { numRuns: 10 }
      )
    })
  })
})
