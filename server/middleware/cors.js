import cors from 'cors'
import config from '../config.js'

// An origin is allowed if it is explicitly listed in ALLOWED_ORIGINS, OR it is
// any AWS Amplify host (*.amplifyapp.com) / localhost — so the deployed
// frontend keeps working even if its exact subdomain changes.
function isAllowed(origin) {
  if (config.ALLOWED_ORIGINS.includes(origin)) return true
  try {
    const { hostname } = new URL(origin)
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true
    if (hostname.endsWith('.amplifyapp.com')) return true
  } catch {
    // malformed origin → not allowed
  }
  return false
}

const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow requests with no origin (e.g., server-to-server, curl).
    if (!origin) return callback(null, true)
    if (isAllowed(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
})

export default corsMiddleware
