import { describe, it, expect, vi } from 'vitest'
import { errorHandler } from '../middleware/errorHandler.js'

function mockReqRes() {
  const req = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
  const next = vi.fn()
  return { req, res, next }
}

describe('errorHandler', () => {
  it('returns 500 INTERNAL for generic errors', () => {
    const { req, res, next } = mockReqRes()
    errorHandler(new Error('boom'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'INTERNAL' }))
  })

  it('returns 500 AUTH_ERROR for CredentialsProviderError', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('no credentials'), { name: 'CredentialsProviderError' })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'AUTH_ERROR' }))
  })

  it('returns 500 AUTH_ERROR for ExpiredTokenException', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('token expired'), { name: 'ExpiredTokenException' })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'AUTH_ERROR' }))
  })

  it('returns 429 RATE_LIMIT for ThrottlingException', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('throttled'), { name: 'ThrottlingException' })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'RATE_LIMIT' }))
  })

  it('returns 429 RATE_LIMIT when httpStatusCode is 429', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('too many'), { $metadata: { httpStatusCode: 429 } })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'RATE_LIMIT' }))
  })

  it('returns 504 TIMEOUT for ETIMEDOUT', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('timed out'), { code: 'ETIMEDOUT' })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(504)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'TIMEOUT' }))
  })

  it('returns 504 TIMEOUT when message contains "timeout"', () => {
    const { req, res, next } = mockReqRes()
    errorHandler(new Error('request timeout exceeded'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(504)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'TIMEOUT' }))
  })

  it('returns 502 BEDROCK_ERROR for ModelErrorException', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('model error'), { name: 'ModelErrorException' })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'BEDROCK_ERROR' }))
  })

  it('returns 502 BEDROCK_ERROR when httpStatusCode >= 500', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('server error'), { $metadata: { httpStatusCode: 503 } })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'BEDROCK_ERROR' }))
  })

  it('returns 400 VALIDATION for validation errors', () => {
    const { req, res, next } = mockReqRes()
    const err = Object.assign(new Error('bad input'), { code: 'VALIDATION' })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'VALIDATION' }))
  })

  it('returns 403 CORS_ERROR for CORS rejection', () => {
    const { req, res, next } = mockReqRes()
    errorHandler(new Error('Not allowed by CORS'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'CORS_ERROR' }))
  })
})
