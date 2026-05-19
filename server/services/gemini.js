import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../config.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);

export async function sendChatMessage(message, history = []) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: config.SYSTEM_PROMPT 
  });

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
  });

  const result = await chat.sendMessage(message);
  const reply = result.response.text();
  if (!reply || !reply.trim()) throw new Error('Empty response from model')
  return reply;
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
- SEASONALITY: if winter (Oct-Apr), prefer accessible winter activities; if summer, include outdoor festivals/Naadam if relevant to the date.
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
          "transport": "walk | private car | shared van | bus | flight"
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
</field_rules>

Include practical survival tips and at least one hidden gem per day. Be specific — name actual restaurants, ger camps, and viewpoints whenever possible.`

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: config.SYSTEM_PROMPT 
  });

  const result = await model.generateContent({
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
  });

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
