import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import config from '../config.js'

const clientConfig = {
  region: config.AWS_REGION,
  requestTimeout: config.REQUEST_TIMEOUT_MS
}

if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
  clientConfig.token = async () => ({ token: process.env.AWS_BEARER_TOKEN_BEDROCK })
}

const client = new BedrockRuntimeClient(clientConfig)

async function invokeWithRetry(command, attempts = config.RETRY_ATTEMPTS) {
  for (let i = 0; i <= attempts; i++) {
    try {
      const response = await client.send(command)
      const result = JSON.parse(new TextDecoder().decode(response.body))
      return result.content[0].text
    } catch (err) {
      const isRetryable = err.name === 'ThrottlingException' ||
        err.name === 'ServiceUnavailableException' ||
        err.name === 'InternalServerException'
      if (i === attempts || !isRetryable) throw err
      await new Promise(r => setTimeout(r, config.RETRY_DELAY_MS * (i + 1)))
    }
  }
}

function buildCommand(messages, maxTokens, temperature) {
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    system: config.SYSTEM_PROMPT,
    messages
  }
  return new InvokeModelCommand({
    modelId: config.MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  })
}

export async function sendChatMessage(message, history = []) {
  const trimmedHistory = history.slice(-config.MAX_HISTORY_MESSAGES)
  const messages = [...trimmedHistory, { role: 'user', content: message }]
  const command = buildCommand(messages, config.MAX_TOKENS_CHAT, config.TEMPERATURE_CHAT)
  return invokeWithRetry(command)
}

export async function generateTravelPlan(days, interests, language, locations = null, startDate = null, departureCity = null) {
  const locationHint = locations?.length > 0
    ? `\nThe traveler specifically wants to visit these locations: ${locations.join(', ')}. Make sure to include all of them in the itinerary, distributed logically across the days.`
    : ''
  const dateHint = startDate ? `\nTrip start date: ${startDate}. Adjust weather_note based on the season.` : ''
  const departureHint = departureCity ? `\nTraveler departs from: ${departureCity}. Account for travel time on Day 1 and last day.` : ''

  const prompt = `Create a detailed ${days}-day Mongolia travel itinerary.
Focus on: ${interests.join(', ')}.${locationHint}${dateHint}${departureHint}

Respond in ${language}.

Return ONLY a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "day": 1,
    "title": "Short day theme title",
    "difficulty": "easy",
    "weather_note": "Brief weather and climate note for this day's region",
    "preparation": ["item1", "item2", "item3"],
    "estimated_drive_km": 55,
    "activities": [
      { "time": "09:00", "text": "Detailed activity description" },
      { "time": "12:00", "text": "Lunch and next activity" },
      { "time": "15:00", "text": "Afternoon activity" },
      { "time": "19:00", "text": "Evening plan" }
    ]
  }
]
Field rules:
- difficulty: always use English lowercase "easy", "moderate", or "hard" based on physical demand and road conditions.
- weather_note: 1 sentence about weather/temperature for that region and season.
- preparation: 3-5 essential items to bring for that day (strings array).
- estimated_drive_km: total km of driving for the day on Mongolian roads (integer, 0 if no driving).
Include real Mongolian place names, local tips, and practical advice.`

  const command = buildCommand(
    [{ role: 'user', content: prompt }],
    config.MAX_TOKENS_PLAN,
    config.TEMPERATURE_PLAN
  )
  const text = await invokeWithRetry(command)

  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const match = cleaned.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array in response')
  return JSON.parse(match[0])
}
