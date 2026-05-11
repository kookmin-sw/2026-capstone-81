const BASE_URL = import.meta.env.VITE_API_URL || ''

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || `API error: ${res.status}`)
  }
  return res.json()
}

// history: [{ role: 'user'|'assistant', content: string }, ...]
export async function chatWithAI(history, userMessage) {
  const data = await post('/api/chat', { message: userMessage, history })
  return data.reply
}

export async function generatePlanWithAI(days, interestLabels, langLabel, focusLocations = null, startDate = null, departureCity = null) {
  const body = { days, interests: interestLabels, language: langLabel }
  if (focusLocations?.length) body.locations = focusLocations
  if (startDate) body.startDate = startDate
  if (departureCity) body.departureCity = departureCity
  const data = await post('/api/plan', body)
  return data.plan
}
