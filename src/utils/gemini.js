const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

const SYSTEM_PROMPT = `You are Nomadiq, an expert Mongolia travel guide AI assistant.
Help users plan their Mongolia trips and answer questions about Mongolian culture, food, attractions, weather, visa, transportation, and travel tips.
Always be friendly, concise, and practical. Use emojis occasionally to make responses engaging.
Detect the language of the user's message and always respond in the same language (Korean, English, or Mongolian).`

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
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini error: ${res.status}`)
  }
  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

// Planner: returns parsed day-by-day itinerary JSON
export async function generatePlanWithGemini(days, interestLabels, langLabel, focusLocations = null) {
  const locationHint = focusLocations && focusLocations.length > 0
    ? `\nThe traveler specifically wants to visit these locations: ${focusLocations.join(', ')}. Make sure to include all of them in the itinerary, distributed logically across the days.`
    : ''
  const prompt = `Create a detailed ${days}-day Mongolia travel itinerary.
Focus on: ${interestLabels.join(', ')}.${locationHint}

Respond in ${langLabel}.

Return ONLY a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "day": 1,
    "title": "Short day theme title",
    "activities": [
      { "time": "09:00", "text": "Detailed activity description" },
      { "time": "12:00", "text": "Lunch and next activity" },
      { "time": "15:00", "text": "Afternoon activity" },
      { "time": "19:00", "text": "Evening plan" }
    ]
  }
]
Include real Mongolian place names, local tips, and practical advice.`

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
  const text = data.candidates[0].content.parts[0].text

  // Strip any residual markdown fences and extract the JSON array
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // Extract the first JSON array found in case the model adds surrounding text
  const match = cleaned.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array in response')
  return JSON.parse(match[0])
}
