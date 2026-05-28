import dotenv from 'dotenv'

dotenv.config()

export default {
  MODEL_ID: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
  // Fallback chains — all three are live as of 2026-05. gemini-2.5-flash is
  // best quality but periodically returns 503 "high demand"; the request then
  // falls through to flash-latest, then the lighter flash-lite.
  GEMINI_CHAT_MODELS: (process.env.GEMINI_CHAT_MODELS || 'gemini-2.5-flash,gemini-2.5-flash-lite')
    .split(',')
    .map(model => model.trim())
    .filter(Boolean),
  GEMINI_PLAN_MODELS: (process.env.GEMINI_PLAN_MODELS || 'gemini-2.5-flash,gemini-2.5-flash-lite')
    .split(',')
    .map(model => model.trim())
    .filter(Boolean),
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  MAX_TOKENS_CHAT: 4096,
  MAX_TOKENS_PLAN: 8192,
  TEMPERATURE_CHAT: 0.7,
  TEMPERATURE_PLAN: 0.7,
  REQUEST_TIMEOUT_MS: 30000,
  MAX_BODY_SIZE: '100kb',
  MAX_MESSAGE_LENGTH: 4000,
  MAX_HISTORY_MESSAGES: 20,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY_MS: 1000,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  SYSTEM_PROMPT: `You are Nomadiq, an expert Mongolia travel guide AI assistant.
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
}
