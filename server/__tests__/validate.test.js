import { describe, it, expect, vi } from 'vitest'
import { validateChat, validatePlan } from '../middleware/validate.js'

function createMockReqRes(body = {}) {
  const req = { body }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
  const next = vi.fn()
  return { req, res, next }
}

describe('validateChat', () => {
  it('should call next() for valid chat request', () => {
    const { req, res, next } = createMockReqRes({
      message: 'Hello',
      history: []
    })
    validateChat(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next() when history is not provided', () => {
    const { req, res, next } = createMockReqRes({ message: 'Hello' })
    validateChat(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should return 400 when message is missing', () => {
    const { req, res, next } = createMockReqRes({})
    validateChat(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'VALIDATION' })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 400 when message is empty string', () => {
    const { req, res, next } = createMockReqRes({ message: '   ' })
    validateChat(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'VALIDATION' })
    )
  })

  it('should return 400 when message is not a string', () => {
    const { req, res, next } = createMockReqRes({ message: 123 })
    validateChat(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when message exceeds MAX_MESSAGE_LENGTH', () => {
    const { req, res, next } = createMockReqRes({
      message: 'a'.repeat(4001)
    })
    validateChat(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'VALIDATION' })
    )
  })

  it('should pass when message is exactly MAX_MESSAGE_LENGTH', () => {
    const { req, res, next } = createMockReqRes({
      message: 'a'.repeat(4000)
    })
    validateChat(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should return 400 when history is not an array', () => {
    const { req, res, next } = createMockReqRes({
      message: 'Hello',
      history: 'not an array'
    })
    validateChat(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'VALIDATION' })
    )
  })
})

describe('validatePlan', () => {
  const validBody = {
    days: 3,
    interests: ['nature', 'culture'],
    language: 'English'
  }

  it('should call next() for valid plan request', () => {
    const { req, res, next } = createMockReqRes(validBody)
    validatePlan(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should call next() when locations is provided as array', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      locations: ['Gobi Desert']
    })
    validatePlan(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should return 400 when days is missing', () => {
    const { req, res, next } = createMockReqRes({
      interests: ['nature'],
      language: 'English'
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'VALIDATION' })
    )
  })

  it('should return 400 when days is not a positive integer', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      days: 0
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when days is a float', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      days: 2.5
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when days is negative', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      days: -1
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when interests is missing', () => {
    const { req, res, next } = createMockReqRes({
      days: 3,
      language: 'English'
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when interests is empty array', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      interests: []
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when interests contains non-strings', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      interests: ['nature', 123]
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when language is missing', () => {
    const { req, res, next } = createMockReqRes({
      days: 3,
      interests: ['nature']
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when language is empty string', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      language: '  '
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 when locations is not an array', () => {
    const { req, res, next } = createMockReqRes({
      ...validBody,
      locations: 'Gobi Desert'
    })
    validatePlan(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should pass when locations is undefined', () => {
    const { req, res, next } = createMockReqRes(validBody)
    validatePlan(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
