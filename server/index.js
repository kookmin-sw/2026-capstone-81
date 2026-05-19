import express from 'express'
import dotenv from 'dotenv'
import corsMiddleware from './middleware/cors.js'
import { errorHandler } from './middleware/errorHandler.js'
import { validateChat, validatePlan } from './middleware/validate.js'
import { sendChatMessage, generateTravelPlan } from './services/gemini.js'
import config from './config.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(corsMiddleware)
app.use(express.json({ limit: config.MAX_BODY_SIZE }))

// Health check — used by Render and for quick "is the backend up?" tests.
app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.post('/api/chat', validateChat, async (req, res, next) => {
  try {
    const { message, history = [] } = req.body
    const reply = await sendChatMessage(message, history)
    res.json({ reply })
  } catch (err) {
    next(err)
  }
})

app.post('/api/plan', validatePlan, async (req, res, next) => {
  try {
    const { days, interests, language, locations, startDate, departureCity,
            budget, pace, groupType, accommodation } = req.body
    const plan = await generateTravelPlan(days, interests, language, {
      locations, startDate, departureCity, budget, pace, groupType, accommodation,
    })
    res.json({ plan })
  } catch (err) {
    next(err)
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[Nomadiq] Server running on http://localhost:${PORT}`)
})

export default app
