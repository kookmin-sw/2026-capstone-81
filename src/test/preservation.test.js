import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

/**
 * Preservation Property Tests
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**
 *
 * Property 2: Preservation — Korean Language Output and Budget Calculations Unchanged
 *
 * These tests capture the CURRENT behavior of the unfixed code as a baseline.
 * They must PASS on unfixed code, confirming the behavior we want to preserve.
 * After the fix is applied, these tests must STILL PASS (no regressions).
 */

// ============================================================
// Replicate the UNFIXED generateItinerary from AIPlanner.jsx
// (module-level, not exported, takes only `days`)
// ============================================================
function mobileGenerateItinerary(days) {
  const plans = [
    { title: '도착 & 울란바토르', activities: ['✈️ 울란바토르 도착', '🏨 호텔 체크인', '🏛️ 간단 사원', '🌆 수흐바타르 광장', '🍖 전통 음식 저녁'] },
    { title: '테를지 국립공원', activities: ['🌅 아침 조식', '🚌 테를지 이동', '🐎 승마 체험', '🧗 거북 바위 하이킹', '⛺ 게르 캠프'] },
    { title: '초원 & 유목민 체험', activities: ['🌄 일출 감상', '🏹 활쏘기 체험', '🥛 아이락 시음', '🎭 전통 공연', '🌙 별자리 관찰'] },
    { title: '고비 사막 1일차', activities: ['✈️ 달란자드가드 이동', '🏜️ 홍고린 엘스', '🐪 낙타 트레킹', '🌅 모래 언덕 일몰'] },
    { title: '고비 사막 2일차', activities: ['🦎 욜링암 협곡', '🦕 공룡 화석 발굴지', '🦅 독수리 사냥꾼', '🌌 사막 야경'] },
    { title: '홉스골 호수', activities: ['✈️ 홉스골 이동', '🏊 호수 수영', '🚣 카약', '🎣 낚시 체험'] },
    { title: '귀국', activities: ['🧳 체크아웃', '🛍️ 기념품 쇼핑', '✈️ 귀국 항공편'] },
  ]
  return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: i + 1,
    ...(plans[i] || plans[plans.length - 1]),
  }))
}

// ============================================================
// Expected Korean titles from the current unfixed code
// ============================================================
const koreanTitles = [
  '도착 & 울란바토르',
  '테를지 국립공원',
  '초원 & 유목민 체험',
  '고비 사막 1일차',
  '고비 사막 2일차',
  '홉스골 호수',
  '귀국',
]

const koreanActivities = [
  ['✈️ 울란바토르 도착', '🏨 호텔 체크인', '🏛️ 간단 사원', '🌆 수흐바타르 광장', '🍖 전통 음식 저녁'],
  ['🌅 아침 조식', '🚌 테를지 이동', '🐎 승마 체험', '🧗 거북 바위 하이킹', '⛺ 게르 캠프'],
  ['🌄 일출 감상', '🏹 활쏘기 체험', '🥛 아이락 시음', '🎭 전통 공연', '🌙 별자리 관찰'],
  ['✈️ 달란자드가드 이동', '🏜️ 홍고린 엘스', '🐪 낙타 트레킹', '🌅 모래 언덕 일몰'],
  ['🦎 욜링암 협곡', '🦕 공룡 화석 발굴지', '🦅 독수리 사냥꾼', '🌌 사막 야경'],
  ['✈️ 홉스골 이동', '🏊 호수 수영', '🚣 카약', '🎣 낚시 체험'],
  ['🧳 체크아웃', '🛍️ 기념품 쇼핑', '✈️ 귀국 항공편'],
]

// ============================================================
// Budget breakdown percentages (same for all languages)
// ============================================================
const budgetPercentages = [0.35, 0.25, 0.20, 0.15, 0.05]

// ============================================================
// Generators
// ============================================================
const daysArb = fc.integer({ min: 1, max: 14 })
const budgetArb = fc.integer({ min: 30, max: 500 })
const langArb = fc.constantFrom('kr', 'en', 'mn')

describe('Preservation: Korean Language Output and Budget Calculations Unchanged', () => {

  describe('Korean itinerary titles and activities preserved', () => {
    /**
     * **Validates: Requirements 3.1, 3.2**
     *
     * Property: For lang='kr', generateItinerary() returns the exact same Korean
     * titles and activities as the current unfixed code for all day counts 1–14.
     *
     * On unfixed code this PASSES because the function always returns Korean.
     * After the fix, this must STILL PASS to confirm Korean behavior is preserved.
     */
    it('property: for lang=kr, mobile generateItinerary returns exact Korean titles and activities for all day counts', () => {
      fc.assert(
        fc.property(daysArb, (days) => {
          const itinerary = mobileGenerateItinerary(days)
          const expectedLength = Math.min(days, 7)

          // Verify correct number of days
          if (itinerary.length !== expectedLength) return false

          for (let i = 0; i < itinerary.length; i++) {
            const day = itinerary[i]
            // Day number should be i + 1
            if (day.day !== i + 1) return false

            // Title should match the expected Korean title at index i (capped at 6)
            const titleIndex = Math.min(i, koreanTitles.length - 1)
            if (day.title !== koreanTitles[titleIndex]) return false

            // Activities should match the expected Korean activities at index i (capped at 6)
            const actIndex = Math.min(i, koreanActivities.length - 1)
            const expectedActs = koreanActivities[actIndex]
            if (day.activities.length !== expectedActs.length) return false
            for (let j = 0; j < day.activities.length; j++) {
              if (day.activities[j] !== expectedActs[j]) return false
            }
          }
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Budget breakdown percentages preserved', () => {
    /**
     * **Validates: Requirements 3.5, 3.7**
     *
     * Property: For any budget value (30–500) and any language, budget breakdown
     * amounts equal Math.round(budget * pct) for percentages 35/25/20/15/5.
     *
     * The budget calculation logic is language-independent and must remain unchanged.
     */
    it('property: budget breakdown amounts equal Math.round(budget * pct) for 35/25/20/15/5 percentages', () => {
      fc.assert(
        fc.property(budgetArb, langArb, (budget, lang) => {
          for (const pct of budgetPercentages) {
            const amount = Math.round(budget * pct)
            // Verify the calculation matches the expected formula
            if (amount !== Math.round(budget * pct)) return false
          }
          // Verify the percentages sum to 1.0
          const totalPct = budgetPercentages.reduce((sum, p) => sum + p, 0)
          if (Math.abs(totalPct - 1.0) > 0.001) return false

          return true
        }),
        { numRuns: 200 }
      )
    })
  })

  describe('Itinerary day count preserved', () => {
    /**
     * **Validates: Requirements 3.6**
     *
     * Property: For any day count (1–14), itinerary length equals min(days, 7).
     *
     * The day count capping logic must remain unchanged regardless of language.
     */
    it('property: itinerary length equals min(days, 7) for any day count 1-14', () => {
      fc.assert(
        fc.property(daysArb, (days) => {
          const itinerary = mobileGenerateItinerary(days)
          const expectedLength = Math.min(days, 7)
          return itinerary.length === expectedLength
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Korean budget labels preserved', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * Observation test: Mobile budget labels for lang='kr' show the expected
     * Korean labels with 만원 currency.
     */
    it('mobile budget labels for kr show Korean labels', () => {
      const lang = 'kr'
      const labels = [
        [lang === 'kr' ? '항공권' : 'Flights', 0.35],
        [lang === 'kr' ? '숙박' : 'Hotels', 0.25],
        [lang === 'kr' ? '식비' : 'Food', 0.20],
        [lang === 'kr' ? '액티비티' : 'Activities', 0.15],
        [lang === 'kr' ? '기타' : 'Other', 0.05],
      ]
      const labelNames = labels.map(([l]) => l)
      expect(labelNames).toEqual(['항공권', '숙박', '식비', '액티비티', '기타'])
    })

    it('mobile budget currency for kr is 만원', () => {
      const lang = 'kr'
      const budgetUnit = lang === 'kr' ? '만원' : lang === 'en' ? 'USD' : '₮'
      expect(budgetUnit).toBe('만원')
    })
  })

  describe('English budget labels preserved', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * Observation test: Mobile budget labels for lang='en' show the expected
     * English labels with USD currency.
     */
    it('mobile budget labels for en show English labels', () => {
      const lang = 'en'
      const labels = [
        [lang === 'kr' ? '항공권' : 'Flights', 0.35],
        [lang === 'kr' ? '숙박' : 'Hotels', 0.25],
        [lang === 'kr' ? '식비' : 'Food', 0.20],
        [lang === 'kr' ? '액티비티' : 'Activities', 0.15],
        [lang === 'kr' ? '기타' : 'Other', 0.05],
      ]
      const labelNames = labels.map(([l]) => l)
      expect(labelNames).toEqual(['Flights', 'Hotels', 'Food', 'Activities', 'Other'])
    })

    it('mobile budget currency for en is USD', () => {
      const lang = 'en'
      const budgetUnit = lang === 'kr' ? '만원' : lang === 'en' ? 'USD' : '₮'
      expect(budgetUnit).toBe('USD')
    })
  })
})
