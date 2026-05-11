import { describe, it, expect } from 'vitest'
import { getAuthErrorMessage } from '../utils/authErrors'

describe('getAuthErrorMessage', () => {
  // Mock tr function that returns the key prefixed with language
  const makeTr = (lang) => (key) => `${lang}:${key}`

  it('maps auth/email-already-in-use to auth_error_email_in_use', () => {
    const tr = makeTr('en')
    expect(getAuthErrorMessage('auth/email-already-in-use', 'en', tr)).toBe('en:auth_error_email_in_use')
  })

  it('maps auth/wrong-password to auth_error_wrong_password', () => {
    const tr = makeTr('kr')
    expect(getAuthErrorMessage('auth/wrong-password', 'kr', tr)).toBe('kr:auth_error_wrong_password')
  })

  it('maps auth/user-not-found to auth_error_user_not_found', () => {
    const tr = makeTr('mn')
    expect(getAuthErrorMessage('auth/user-not-found', 'mn', tr)).toBe('mn:auth_error_user_not_found')
  })

  it('maps auth/invalid-email to auth_error_invalid_email', () => {
    const tr = makeTr('en')
    expect(getAuthErrorMessage('auth/invalid-email', 'en', tr)).toBe('en:auth_error_invalid_email')
  })

  it('maps auth/weak-password to auth_error_weak_password', () => {
    const tr = makeTr('kr')
    expect(getAuthErrorMessage('auth/weak-password', 'kr', tr)).toBe('kr:auth_error_weak_password')
  })

  it('maps auth/popup-closed-by-user to auth_error_popup_closed', () => {
    const tr = makeTr('en')
    expect(getAuthErrorMessage('auth/popup-closed-by-user', 'en', tr)).toBe('en:auth_error_popup_closed')
  })

  it('maps auth/network-request-failed to auth_error_network', () => {
    const tr = makeTr('mn')
    expect(getAuthErrorMessage('auth/network-request-failed', 'mn', tr)).toBe('mn:auth_error_network')
  })

  it('maps auth/too-many-requests to auth_error_too_many_requests', () => {
    const tr = makeTr('kr')
    expect(getAuthErrorMessage('auth/too-many-requests', 'kr', tr)).toBe('kr:auth_error_too_many_requests')
  })

  it('falls back to auth_error_generic for unknown error codes', () => {
    const tr = makeTr('en')
    expect(getAuthErrorMessage('auth/unknown-error', 'en', tr)).toBe('en:auth_error_generic')
  })

  it('falls back to auth_error_generic for undefined error code', () => {
    const tr = makeTr('kr')
    expect(getAuthErrorMessage(undefined, 'kr', tr)).toBe('kr:auth_error_generic')
  })

  it('falls back to auth_error_generic for empty string error code', () => {
    const tr = makeTr('mn')
    expect(getAuthErrorMessage('', 'mn', tr)).toBe('mn:auth_error_generic')
  })

  it('always returns a non-empty string when tr returns non-empty', () => {
    const tr = (key) => `translated_${key}`
    const codes = [
      'auth/email-already-in-use',
      'auth/wrong-password',
      'auth/user-not-found',
      'auth/invalid-email',
      'auth/weak-password',
      'auth/popup-closed-by-user',
      'auth/network-request-failed',
      'auth/too-many-requests',
      'auth/some-random-code',
    ]
    for (const code of codes) {
      const result = getAuthErrorMessage(code, 'en', tr)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    }
  })
})
