import config from '../config.js'

const { MAX_MESSAGE_LENGTH } = config

/**
 * Validation middleware for POST /api/chat
 * Validates message (required, non-empty string, ≤ MAX_MESSAGE_LENGTH)
 * and history (optional, must be array if provided)
 */
export function validateChat(req, res, next) {
  const { message, history } = req.body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Message is required and must be a non-empty string',
      code: 'VALIDATION'
    })
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`,
      code: 'VALIDATION'
    })
  }

  if (history !== undefined && !Array.isArray(history)) {
    return res.status(400).json({
      error: 'History must be an array',
      code: 'VALIDATION'
    })
  }

  next()
}

/**
 * Validation middleware for POST /api/plan
 * Validates days (required, positive integer), interests (required, non-empty array of strings),
 * language (required, non-empty string), and locations (optional, must be array if provided)
 */
export function validatePlan(req, res, next) {
  const { days, interests, language, locations } = req.body

  if (days === undefined || days === null || !Number.isInteger(days) || days <= 0) {
    return res.status(400).json({
      error: 'Days is required and must be a positive integer',
      code: 'VALIDATION'
    })
  }

  if (!interests || !Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({
      error: 'Interests is required and must be a non-empty array',
      code: 'VALIDATION'
    })
  }

  if (!interests.every(item => typeof item === 'string')) {
    return res.status(400).json({
      error: 'All interests must be strings',
      code: 'VALIDATION'
    })
  }

  if (!language || typeof language !== 'string' || language.trim().length === 0) {
    return res.status(400).json({
      error: 'Language is required and must be a non-empty string',
      code: 'VALIDATION'
    })
  }

  if (locations !== undefined && !Array.isArray(locations)) {
    return res.status(400).json({
      error: 'Locations must be an array if provided',
      code: 'VALIDATION'
    })
  }

  next()
}
