/**
 * Firebase 오류 코드를 translations.js 키로 매핑하는 유틸리티
 */

const ERROR_CODE_MAP = {
  'auth/email-already-in-use': 'auth_error_email_in_use',
  'auth/wrong-password': 'auth_error_wrong_password',
  'auth/user-not-found': 'auth_error_user_not_found',
  'auth/invalid-credential': 'auth_error_wrong_password',
  'auth/invalid-email': 'auth_error_invalid_email',
  'auth/weak-password': 'auth_error_weak_password',
  'auth/popup-closed-by-user': 'auth_error_popup_closed',
  'auth/network-request-failed': 'auth_error_network',
  'auth/too-many-requests': 'auth_error_too_many_requests',
  'auth/operation-not-allowed': 'auth_error_generic',
  'auth/unauthorized-domain': 'auth_error_generic',
}

/**
 * Firebase 오류 코드를 translations.js 키로 매핑하여 번역된 메시지를 반환
 * @param {string} errorCode - Firebase 오류 코드 (예: 'auth/wrong-password')
 * @param {string} lang - 현재 언어 코드 ('kr', 'en', 'mn')
 * @param {Function} tr - translations 조회 함수 (key => translated string)
 * @returns {string} 다국어 오류 메시지
 */
export function getAuthErrorMessage(errorCode, lang, tr) {
  const translationKey = ERROR_CODE_MAP[errorCode] || 'auth_error_generic'
  return tr(translationKey)
}
