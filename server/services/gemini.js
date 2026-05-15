import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../config.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);

export async function sendChatMessage(message, history = []) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: config.SYSTEM_PROMPT 
  });

  const chat = model.startChat({
    history: history.slice(-config.MAX_HISTORY_MESSAGES).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    generationConfig: {
      maxOutputTokens: config.MAX_TOKENS_CHAT,
      temperature: config.TEMPERATURE_CHAT,
    },
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

export async function generateTravelPlan(days, interests, language, locations = null, startDate = null, departureCity = null) {
  const locationHint = locations?.length > 0
    ? `\nThe traveler specifically wants to visit these locations: ${locations.join(', ')}. Make sure to include all of them in the itinerary, distributed logically across the days.`
    : ''
  const dateHint = startDate ? `\nTrip start date: ${startDate}. Adjust weather_note based on the season.` : ''
  const departureHint = departureCity ? `\nTraveler departs from: ${departureCity}. Account for travel time on Day 1 and last day.` : ''

  // --- 추가 데이터 조회 및 프롬프트 삽입 (개념적) ---
  let specificRoadConditions = '';
  if (locations && locations.length > 0) {
    // 가상의 함수: locations 배열을 기반으로 도로 조건 데이터를 조회
    // 실제 구현에서는 DB 쿼리 또는 정적 데이터 조회 로직이 들어감
    const roadData = await getMongolianRoadConditions(locations); // 이 함수는 별도로 구현 필요
    if (roadData) {
      specificRoadConditions = `\n<specific_road_conditions>\n${roadData}\n</specific_road_conditions>`;
    }
  }
  // --- 추가 데이터 조회 및 프롬프트 삽입 끝 ---

  const prompt = `You are a professional Mongolian tour operator. Create a realistic and highly detailed ${days}-day Mongolia travel itinerary.
<context>
Focus on these interests: ${interests.join(', ')}.${locationHint}${dateHint}${departureHint}${specificRoadConditions}
</context>

<logistics_rules>
- GEOGRAPHY: Group activities by region (e.g., Central, Gobi, North). Avoid impossible long-distance travel within a single day.
- ROAD CONDITIONS: Assume average speed of 40-50 km/h for off-road segments. Ensure "estimated_drive_km" is realistic.
- SEASONALITY: If the trip is in winter (Oct-Apr), focus on winter activities and accessible locations.
</logistics_rules>

<response_instructions>
Respond in ${language}. 
Return ONLY a valid JSON array (no markdown, no extra text) in the format below.
</response_instructions>

<json_schema>
[
  {
    "day": 1,
    "title": "Short day theme title",
    "difficulty": "easy",
    "weather_note": "Specific weather/temp note for this region/season.",
    "preparation": ["item1", "item2", "item3"],
    "estimated_drive_km": 55,
    "activities": [
      { 
        "time": "09:00", 
        "location_name": "Exact landmark or place name in English",
        "text": "Rich, sensory description of the place and activity (30-50 words). Describe visuals vividly." 
      },
      { "time": "12:00", "text": "Lunch and next activity" },
      { "time": "15:00", "text": "Afternoon activity" },
      { "time": "19:00", "text": "Evening plan" }
    ]
  }
]
</json_schema>

<field_rules>
- difficulty: always use English lowercase "easy", "moderate", or "hard" based on physical demand and road conditions.
- location_name: The most recognizable English name of the specific tourist attraction or landmark.
- preparation: 3-5 essential items to bring for that day (strings array).
- estimated_drive_km: total km of driving for the day (integer).
</field_rules>

Include real Mongolian place names (with English or Mongolian script), local hidden gems, and practical survival tips.`

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
  // but the model occasionally wraps the array in an object like
  // { itinerary: [...] } or appends a stray code-fence. Try the whole string
  // first, then peel off the inner array if that fails.
  let plan
  try {
    const parsed = JSON.parse(cleaned)
    plan = Array.isArray(parsed) ? parsed : (parsed.itinerary ?? parsed.plan ?? parsed.days)
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array in response')
    plan = JSON.parse(match[0])
  }
  if (!Array.isArray(plan)) throw new Error('Plan is not an array')

  // --- 사진 데이터 매칭 로직 ---
  const enrichedPlan = await Promise.all(plan.map(async (day) => {
    const enrichedActivities = await Promise.all(day.activities.map(async (activity) => {
      if (activity.location_name) {
        const photoUrl = await fetchGooglePlacePhoto(activity.location_name);
        return { ...activity, photo_url: photoUrl };
      }
      return activity;
    }));
    return { ...day, activities: enrichedActivities };
  }));

  return enrichedPlan;
}

/**
 * Google Places API를 통해 장소 사진 URL을 가져오는 함수 (개념적 구현)
 */
async function fetchGooglePlacePhoto(query) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    // 1. 장소 검색 (Place Search)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query + ' Mongolia')}&inputtype=textquery&fields=photos,place_id&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const photoReference = searchData.candidates?.[0]?.photos?.[0]?.photo_reference;
    if (!photoReference) return null;

    // 2. 사진 URL 생성 (실제 이미지를 다운로드하는 것이 아니라 URL을 반환)
    // maxWidth를 지정하여 적절한 크기의 이미지를 가져옵니다.
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`;
  } catch (error) {
    console.error(`Photo fetch error for ${query}:`, error);
    return null;
  }
}
