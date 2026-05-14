const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const SYSTEM_PROMPT = `You are Nomadiq, a Mongolia travel expert chatbot.

RULES:
1. Answer ONLY about Mongolia travel topics: attractions, culture, food, weather, visa, transportation, accommodation, costs, safety, and trip planning.
2. If the user asks something unrelated to Mongolia travel, politely redirect: "저는 몽골 여행 전문 AI입니다. 몽골 여행에 대해 물어보세요! 😊"
3. Detect the user's language and ALWAYS reply in the same language (Korean, English, or Mongolian).
4. STRICT LENGTH RULE: Answer ONLY what was asked. Maximum 3-5 sentences or 3-4 bullet points. No extra context, no background info, no related tips unless asked.
5. Give specific, actionable information: real place names, approximate costs in USD/KRW/MNT, distances, durations.
6. Do NOT repeat the question back. Do NOT add unnecessary filler. Do NOT volunteer information beyond the exact question.
7. If the user asks about one place, answer about THAT ONE PLACE only.

MAP_UPDATE FORMAT (optional):
When you mention specific visitable locations, append this block at the very end:
[MAP_UPDATE]
{"places":[{"name_ko":"한국어","name_en":"English","name_mn":"Монгол","lat":47.0,"lng":106.0,"taxi_phrase":"Энд очно уу"}]}
[/MAP_UPDATE]
- Only use MAP_UPDATE for specific geographic places the user might visit.
- Do NOT use it for general questions about visa, weather, food culture, etc.
- Coordinates must be accurate.
- taxi_phrase = short Mongolian sentence to show a taxi driver.`

// Chat: supports multi-turn conversation history
export async function chatWithGemini(history, userMessage) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 700,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini error: ${res.status}`)
  }
  const data = await res.json()
  // gemini-2.5-flash may return multiple parts (thinking + response), take the last text part
  const parts = data.candidates[0].content.parts
  const textParts = parts.filter(p => p.text !== undefined)
  return textParts[textParts.length - 1].text
}

// Planner: returns parsed day-by-day itinerary JSON
export async function generatePlanWithGemini(days, interestLabels, langLabel, focusLocations = null) {
  const locationHint = focusLocations && focusLocations.length > 0
    ? `\nThe traveler specifically wants to visit these locations: ${focusLocations.join(', ')}. Make sure to include all of them in the itinerary, distributed logically across the days.`
    : ''
  const prompt = `Create a detailed ${days}-day Mongolia travel itinerary.
Focus on: ${interestLabels.join(', ')}.${locationHint}

Respond in ${langLabel}.

Return ONLY a valid JSON object (no markdown, no extra text) in this exact format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Short day theme title (max 8 words)",
      "activities": [
        { "time": "09:00", "text": "Activity description (plain text, no markdown asterisks, no ** bold **)" },
        { "time": "12:00", "text": "Lunch description" },
        { "time": "15:00", "text": "Afternoon activity" },
        { "time": "20:00", "text": "Evening plan" }
      ]
    }
  ],
  "packing": ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8"],
  "tips": ["Local tip 1", "Local tip 2", "Local tip 3"]
}
Rules:
- activity text must be plain text only — NO asterisks, NO markdown, NO ** bold **.
- packing: list 6-10 essential items specifically for this trip.
- tips: list 3 practical local tips.
- Include real Mongolian place names and practical advice.`

  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini error: ${res.status}`)
  }
  const data = await res.json()
  const parts = data.candidates[0].content.parts
  const textParts = parts.filter(p => p.text !== undefined && !p.thought)
  const text = textParts[textParts.length - 1].text

  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // Try object format first { itinerary, packing, tips }
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) {
    const parsed = JSON.parse(objMatch[0])
    if (parsed.itinerary) return parsed
    // Legacy: bare array wrapped in object
  }
  // Fallback: bare array (legacy format)
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrMatch) return { itinerary: JSON.parse(arrMatch[0]), packing: [], tips: [] }
  throw new Error('No JSON in response')
}
