import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const PLAN_MODELS  = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
const CHAT_MODELS  = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']

const SYSTEM_PROMPT = `You are Nomadiq, an expert Mongolia travel guide AI assistant.
Help users plan their Mongolia trips and answer questions about Mongolian culture, food, attractions, weather, visa, transportation, and travel tips.
Always be friendly, concise, and practical. Use emojis occasionally to make responses engaging.
Detect the language of the user's message and always respond in the same language (Korean, English, or Mongolian).

When your response mentions one or more specific named places in Mongolia, append exactly ONE map update block at the very end of your response (after all text), using this format:
[MAP_UPDATE]{"places":[{"name_ko":"한국어 장소명","name_en":"English Place Name","name_mn":"Монгол нэр","lat":47.9,"lng":106.9,"taxi_phrase":"Монгол нэр рүү явна уу?"}]}[/MAP_UPDATE]
Rules:
- List all mentioned specific places in logical visit order.
- taxi_phrase must be in Mongolian Cyrillic: "[name_mn] руу явна уу?"
- Use accurate GPS coordinates for each place.
- Omit this block entirely for general questions that do not reference specific named locations.`

function getGenAI() {
  if (!GEMINI_KEY) throw new Error('VITE_GEMINI_API_KEY is not set')
  return new GoogleGenerativeAI(GEMINI_KEY)
}

async function withModelFallback(models, createRequest) {
  let lastError
  for (const modelId of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await createRequest(modelId)
      } catch (err) {
        lastError = err
        const msg = err?.message || ''
        const retryable = /429|500|502|503|quota|rate limit|unavailable|high demand/i.test(msg)
        const skip = /400|404|not found|not supported|invalid.*model|does not exist/i.test(msg)
        if (skip) break
        if (retryable && attempt < 2) await new Promise(r => setTimeout(r, 1000 * attempt))
        else if (!retryable) throw err
      }
    }
  }
  throw lastError
}

export async function chatWithAI(history, userMessage) {
  const genAI = getGenAI()
  const normHistory = history.slice(-20).map(m => ({
    role: m.role === 'assistant' ? 'model' : (m.role === 'model' ? 'model' : 'user'),
    parts: [{ text: m.parts?.[0]?.text ?? m.content ?? '' }],
  })).filter(m => m.parts[0].text)

  const result = await withModelFallback(CHAT_MODELS, async (modelId) => {
    const model = genAI.getGenerativeModel({ model: modelId, systemInstruction: SYSTEM_PROMPT })
    const chat = model.startChat({
      history: normHistory,
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
    return chat.sendMessage(userMessage)
  })

  const reply = result.response.text()
  if (!reply?.trim()) throw new Error('Empty response from model')
  return reply
}

export async function generatePlanWithAI(days, interestLabels, langLabel, focusLocations = null, startDate = null, departureCity = null, extra = {}) {
  const genAI = getGenAI()
  const { budget = null, pace = null, groupType = null, accommodation = null } = extra

  const hint = (label, val) => val ? `\n- ${label}: ${val}` : ''
  const profileBlock =
    hint('Focus interests', interestLabels.join(', ')) +
    hint('Locations to include', focusLocations?.join(', ')) +
    hint('Start date', startDate) +
    hint('Departing from', departureCity) +
    hint('Budget level', budget) +
    hint('Pace', pace) +
    hint('Group', groupType) +
    hint('Accommodation preference', accommodation)

  const prompt = `You are a professional Mongolian tour operator. Create a realistic, highly detailed ${days}-day Mongolia itinerary tuned to the traveller's profile below.

<traveller_profile>${profileBlock}
</traveller_profile>

<logistics_rules>
- GEOGRAPHY: group activities by region (Central, Gobi, North, West). No impossible long-distance hops within a single day.
- ROAD CONDITIONS: assume 40-50 km/h average on off-road segments; estimated_drive_km must be realistic.
- TIMING: produce 5-7 activities per day spread from morning to evening (07:00-22:00), each with a real clock time. Always include breakfast, lunch, dinner.
- BUDGET: scale restaurant, accommodation, and activity choices to the budget level. budget=cheap street food + ger/guesthouse, mid=local restaurants + 3-star, premium=top restaurants + 4-5 star hotels.
- PACE: relaxed=fewer stops + longer rests, normal=balanced, packed=more activities + earlier start.
- GROUP: family=more breaks + kid-friendly; couple=romantic spots; friends=group-friendly food; solo=safety + meeting people.
- SEASONALITY: if winter (Oct-Apr), prefer accessible winter activities; if summer (Jul), include Naadam Festival (Jul 11-13) if relevant to the date.
- TRANSPORT REFERENCE (use real departure times in transit activities):
  Dragon Bus (dragonbus.mn): UB→Kharkhorin 07:00/09:00 ~5h; UB→Dalanzadgad (Gobi) 07:00 ~8-9h; UB→Erdenet 07:00 ~5h; UB→Darkhan multiple ~3h.
  Flights (Hunnu Air/Aero Mongolia): UB→Mörön (for Khuvsgul) ~1.5h; UB→Bayan-Olgii ~2h; UB→Dalanzadgad ~1.5h.
  Terelj: shared jeep from UB Central Market, 07:00-15:00 continuous, ~1.5-2h.
  Special events: Naadam Jul 11-13 in UB/Kharkhorin; Eagle Festival Bayan-Olgii early Oct; Khuvsgul Ice Festival late Feb.
</logistics_rules>

<response_instructions>
Respond entirely in ${langLabel}. Return ONLY a valid JSON OBJECT (no markdown fences, no leading prose) matching the schema below.
</response_instructions>

<json_schema>
{
  "itinerary": [
    {
      "day": 1,
      "title": "Short, evocative day title (6-10 words)",
      "region": "Central | Gobi | North | West | UB",
      "difficulty": "easy | moderate | hard",
      "weather_note": "Concrete temperature range and condition for the date/season.",
      "preparation": ["item1", "item2", "item3", "item4"],
      "estimated_drive_km": 55,
      "estimated_cost_usd": { "low": 60, "high": 110 },
      "accommodation": { "type": "ger camp | hotel | guesthouse | tent", "name": "Specific place name", "price_usd": 45 },
      "activities": [
        {
          "time": "07:30",
          "type": "breakfast | sightseeing | meal | transit | activity | rest | dinner",
          "location_name": "Exact landmark or place name in English",
          "text": "Rich, sensory 25-40 word description.",
          "duration_min": 60,
          "cost_usd": 8,
          "transport": "walk | private car | shared van | bus | flight",
          "transit_km": 0,
          "road_type": "none | paved | dirt | off-road | mixed"
        }
      ]
    }
  ],
  "packing": ["6-10 trip-specific items"],
  "tips": ["3-5 practical local tips"]
}
</json_schema>`

  const result = await withModelFallback(PLAN_MODELS, async (modelId) => {
    const model = genAI.getGenerativeModel({ model: modelId, systemInstruction: SYSTEM_PROMPT })
    return model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
  })

  const text = result.response.text()
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const objMatch = cleaned.match(/\{[\s\S]*\}/)
    const arrMatch = cleaned.match(/\[[\s\S]*\]/)
    if (objMatch) parsed = JSON.parse(objMatch[0])
    else if (arrMatch) parsed = { itinerary: JSON.parse(arrMatch[0]) }
    else throw new Error('No JSON in response')
  }

  const itinerary = Array.isArray(parsed) ? parsed : (parsed.itinerary ?? parsed.plan ?? [])
  if (!Array.isArray(itinerary)) throw new Error('Itinerary is not an array')
  return {
    itinerary,
    packing: Array.isArray(parsed?.packing) ? parsed.packing : [],
    tips: Array.isArray(parsed?.tips) ? parsed.tips : [],
  }
}

export async function getRecommendations(month, season, temp, events, groupType, budget, interests, language) {
  const genAI = getGenAI()
  const eventsText = events.map(e => e.en).join('; ') || 'none'

  const prompt = `You are a professional Mongolia travel advisor. Recommend exactly 3 Mongolia destinations for this traveller.

<traveller_profile>
- Travel month: ${month} (${season}) — typical weather: ${temp}
- Key events this month: ${eventsText}
- Group type: ${groupType || 'unspecified'}
- Budget: ${budget || 'mid'}
- Interests: ${interests.join(', ')}
</traveller_profile>

Respond entirely in ${language}. Return ONLY a valid JSON ARRAY of exactly 3 objects with fields: name, name_en, region, emoji, vibe, season_reason, activities, weather, tips, highlight.`

  const result = await withModelFallback(PLAN_MODELS, async (modelId) => {
    const model = genAI.getGenerativeModel({ model: modelId })
    return model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.75, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
    })
  })

  const text = result.response.text()
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  let parsed
  try { parsed = JSON.parse(cleaned) } catch {
    const arr = cleaned.match(/\[[\s\S]*\]/)
    if (arr) parsed = JSON.parse(arr[0])
    else throw new Error('No JSON array in response')
  }
  if (!Array.isArray(parsed)) throw new Error('Not an array')
  return parsed
}
