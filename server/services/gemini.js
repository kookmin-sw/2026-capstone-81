import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../config.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function isRetryableModelError(err) {
  const msg = err?.message || ''
  return err?.status === 429 ||
    err?.status === 500 ||
    err?.status === 502 ||
    err?.status === 503 ||
    /429|500|502|503|quota|rate limit|service unavailable|high demand|temporar/i.test(msg)
}

// Model-level errors: the model doesn't exist or isn't accessible with this key.
// Skip to the next model in the fallback chain instead of retrying or throwing.
function isModelSkipError(err) {
  const msg = err?.message || ''
  return err?.status === 400 ||
    err?.status === 404 ||
    /not found|not supported|invalid.*model|model.*invalid|does not exist|is not supported/i.test(msg)
}

async function withModelFallback(modelIds, createRequest, attemptsPerModel = config.RETRY_ATTEMPTS) {
  let lastError
  for (const modelId of modelIds) {
    for (let attempt = 1; attempt <= attemptsPerModel; attempt += 1) {
      try {
        return await createRequest(modelId)
      } catch (err) {
        lastError = err
        if (isRetryableModelError(err)) {
          console.warn(`[Gemini] ${modelId} attempt ${attempt} failed (retryable): ${err.message}`)
          if (attempt < attemptsPerModel) await sleep(config.RETRY_DELAY_MS * attempt)
        } else if (isModelSkipError(err)) {
          console.warn(`[Gemini] ${modelId} unavailable, trying next: ${err.message}`)
          break // skip remaining attempts for this model, try next
        } else {
          throw err // fatal error (auth, etc.) — don't try other models
        }
      }
    }
  }
  throw lastError
}

export async function sendChatMessage(message, history = []) {
  // Accept both shapes from the frontend:
  //   { role, content: "..." }                   (legacy / OpenAI-style)
  //   { role, parts: [{ text: "..." }] }         (Gemini native — what AIChat sends)
  // If we strip parts and read m.content here, every message after the first
  // ends up with text:undefined and the SDK rejects the request.
  const normalisedHistory = history.slice(-config.MAX_HISTORY_MESSAGES).map(m => {
    const text = m.parts?.[0]?.text ?? m.content ?? ''
    return {
      role: m.role === 'assistant' ? 'model' : (m.role === 'model' ? 'model' : 'user'),
      parts: [{ text }],
    }
  }).filter(m => m.parts[0].text)

  // Try each model in turn — if gemini-2.5-flash is overloaded (503), fall
  // through to flash-latest / flash-lite so the chatbot keeps working.
  const result = await withModelFallback(config.GEMINI_CHAT_MODELS, async (modelId) => {
    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: config.SYSTEM_PROMPT,
    })
    const chat = model.startChat({
      history: normalisedHistory,
      generationConfig: {
        maxOutputTokens: config.MAX_TOKENS_CHAT,
        temperature: config.TEMPERATURE_CHAT,
        // Gemini 2.5 Flash burns output tokens on a hidden "thinking" pass
        // before replying. With the small chat budget that can leave nothing
        // for the actual answer (finishReason MAX_TOKENS, empty text) — which
        // makes .text() throw. Disable thinking so every token is the reply.
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
    return chat.sendMessage(message)
  })

  const reply = result.response.text();
  if (!reply || !reply.trim()) throw new Error('Empty response from model')
  return reply;
}

export async function generateRecommendations(month, season, temp, events, groupType, budget, interests, language) {
  const eventsText = events.map(e => e.en).join('; ') || 'none'
  const interestsText = interests.join(', ')

  const prompt = `You are a professional Mongolia travel advisor. Recommend exactly 3 Mongolia destinations for this traveller.

<traveller_profile>
- Travel month: ${month} (${season}) — typical weather: ${temp}
- Key events this month: ${eventsText}
- Group type: ${groupType || 'unspecified'}
- Budget: ${budget || 'mid'}
- Interests: ${interestsText}
</traveller_profile>

<selection_criteria>
- Prioritize experiential value for this SPECIFIC season/month above all else
- Match destinations to group type and interests
- Rank by uniqueness and seasonal fit, not just popularity
- Include at least one less-touristy choice
- Consider special events happening this month (if any)
- Budget level should influence accommodation and activity recommendations
</selection_criteria>

<response_instructions>
Respond entirely in ${language}. Return ONLY a valid JSON ARRAY (no markdown fences, no prose) of exactly 3 objects.
</response_instructions>

<json_schema>
[
  {
    "name": "Destination name in ${language}",
    "name_en": "Destination name in English (always English regardless of language setting)",
    "region": "Central | Gobi | North | West | UB",
    "emoji": "one relevant emoji",
    "vibe": "single evocative word in ${language} (e.g. 어드벤처 / Adventure / Адал явдал)",
    "season_reason": "2-3 sentences: why THIS destination is ideal THIS month specifically",
    "activities": ["3-4 concrete seasonal activities with specific location names"],
    "weather": "Actual temp range + conditions (e.g. -5~5°C, crisp blue skies)",
    "tips": ["2 practical tips specific to this destination this month"],
    "highlight": "ONE iconic must-do experience this season — one vivid sentence"
  }
]
</json_schema>`

  const result = await withModelFallback(config.GEMINI_PLAN_MODELS, async (modelId) => {
    const model = genAI.getGenerativeModel({ model: modelId })
    return model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.75,
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
    const arrMatch = cleaned.match(/\[[\s\S]*\]/)
    if (arrMatch) parsed = JSON.parse(arrMatch[0])
    else throw new Error('No JSON array in response')
  }

  if (!Array.isArray(parsed)) throw new Error('Recommendations is not an array')
  return parsed
}

export async function generateTravelPlan(days, interests, language, opts = {}) {
  // Accept the rich options object the new UI sends, but stay backwards
  // compatible with the legacy positional call (locations, startDate, ...).
  const {
    locations = null,
    startDate = null,
    departureCity = null,
    budget = null,        // 'budget' | 'mid' | 'premium'
    pace = null,          // 'relaxed' | 'normal' | 'packed'
    groupType = null,     // 'solo' | 'couple' | 'family' | 'friends'
    accommodation = null, // 'hotel' | 'guesthouse' | 'ger' | 'camping' | 'mixed'
  } = opts

  const hint = (label, val) => val ? `\n- ${label}: ${val}` : ''
  const profileBlock =
    hint('Focus interests', interests.join(', ')) +
    hint('Locations to include', locations?.join(', ')) +
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
Respond entirely in ${language}. Return ONLY a valid JSON OBJECT (no markdown fences, no leading prose) matching the schema below.
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
          "text": "Rich, sensory 25-40 word description: what they see/do/eat, why it matters.",
          "duration_min": 60,
          "cost_usd": 8,
          "transport": "walk | private car | shared van | bus | flight",
          "transit_km": 0,
          "road_type": "none | paved | dirt | off-road | mixed"
        }
      ]
    }
  ],
  "packing": ["6-10 trip-specific items (not generic passport): e.g. 'thermal layer for Gobi nights'"],
  "tips": ["3-5 practical local tips: e.g. 'tip drivers ~10% in cash MNT'"]
}
</json_schema>

<field_rules>
- All activities have time (HH:MM 24h), type, text. type "meal"/"breakfast"/"dinner" must include a restaurant or food name in location_name.
- difficulty / type / region / accommodation.type / transport: ALWAYS English lowercase (or capitalised region) — exact tokens from the schema.
- estimated_cost_usd: realistic ranges in USD for the day's total (food + transport + entry fees + accommodation).
- preparation: 3-6 trip-specific items (not generic "passport").
- Use real Mongolian place names (English transliteration is fine: Erdene Zuu, Tsenkher Hot Spring, etc.).
- Every day must contain at least one meal-type activity for lunch and one for dinner.
- transit_km: for "transit" type activities set the realistic km driven; set 0 for all other activity types.
- road_type: for "transit" activities specify the road surface ("paved" for city/highway, "dirt" for rural gravel, "off-road" for trackless steppe/desert, "mixed" for both); set "none" for non-transit activities.
- For long driving days always include a dedicated "transit" activity at the start showing departure time, vehicle, route, km, and road type.
</field_rules>

Include practical survival tips and at least one hidden gem per day. Be specific — name actual restaurants, ger camps, and viewpoints whenever possible.`

  const result = await withModelFallback(config.GEMINI_PLAN_MODELS, async (modelId) => {
    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: config.SYSTEM_PROMPT
    })
    return model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: config.MAX_TOKENS_PLAN,
        temperature: config.TEMPERATURE_PLAN,
        responseMimeType: "application/json",
        // Gemini 2.5 spends output tokens on a hidden "thinking" pass before
        // emitting the JSON, which truncates multi-day plans. Disable thinking
        // so the entire token budget goes to the actual answer.
        thinkingConfig: { thinkingBudget: 0 }
      }
    })
  })

  const text = result.response.text();

  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // responseMimeType=application/json should hand us valid JSON directly,
  // but the model occasionally appends a stray code-fence. Try parsing the
  // whole string, then peel out the inner object if that fails.
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

  // Normalise: backend always returns { itinerary, packing, tips }.
  const itinerary = Array.isArray(parsed)
    ? parsed
    : (parsed.itinerary ?? parsed.plan ?? parsed.days ?? [])
  if (!Array.isArray(itinerary)) throw new Error('Itinerary is not an array')
  const plan = {
    itinerary,
    packing: Array.isArray(parsed?.packing) ? parsed.packing : [],
    tips: Array.isArray(parsed?.tips) ? parsed.tips : [],
  }

  return plan
}
