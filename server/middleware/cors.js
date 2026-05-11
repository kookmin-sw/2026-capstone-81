import cors from 'cors'
import config from '../config.js'

const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow requests with no origin (e.g., server-to-server, curl)
    if (!origin) {
      return callback(null, true)
    }

    if (config.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})

export default corsMiddleware
