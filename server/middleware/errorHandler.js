/**
 * Express error handling middleware
 * Maps error types to HTTP status codes and standardized error responses
 */
export function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('[ErrorHandler]', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack
  })

  const { status, code, message } = classifyError(err)

  res.status(status).json({
    error: message,
    code
  })
}

/**
 * Classify an error into HTTP status, error code, and user-friendly message
 */
function classifyError(err) {
  // AWS credential errors
  if (isCredentialError(err)) {
    return {
      status: 500,
      code: 'AUTH_ERROR',
      message: '서비스 설정 오류입니다'
    }
  }

  // Throttling / rate limit errors
  if (isThrottlingError(err)) {
    return {
      status: 429,
      code: 'RATE_LIMIT',
      message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요'
    }
  }

  // Timeout errors
  if (isTimeoutError(err)) {
    return {
      status: 504,
      code: 'TIMEOUT',
      message: '응답 시간이 초과되었습니다'
    }
  }

  // Bedrock / model errors
  if (isBedrockError(err)) {
    return {
      status: 502,
      code: 'BEDROCK_ERROR',
      message: 'AI 서비스에 일시적 문제가 있습니다'
    }
  }

  // Validation errors (passed from validate middleware or route handlers)
  if (isValidationError(err)) {
    return {
      status: 400,
      code: 'VALIDATION',
      message: err.message || '입력이 올바르지 않습니다'
    }
  }

  // CORS errors
  if (isCorsError(err)) {
    return {
      status: 403,
      code: 'CORS_ERROR',
      message: '허용되지 않은 요청입니다'
    }
  }

  // Default / unknown errors
  return {
    status: 500,
    code: 'INTERNAL',
    message: '오류가 발생했습니다'
  }
}

function isCredentialError(err) {
  const credentialNames = [
    'CredentialsProviderError',
    'InvalidIdentityToken',
    'ExpiredTokenException',
    'UnrecognizedClientException'
  ]
  return credentialNames.includes(err.name) ||
    err.code === 'CREDENTIALS_ERROR' ||
    (err.message && err.message.includes('credentials'))
}

function isThrottlingError(err) {
  return err.name === 'ThrottlingException' ||
    err.code === 'ThrottlingException' ||
    err.$metadata?.httpStatusCode === 429
}

function isTimeoutError(err) {
  return err.name === 'TimeoutError' ||
    err.code === 'TIMEOUT' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'ESOCKETTIMEDOUT' ||
    (err.message && err.message.includes('timeout'))
}

function isBedrockError(err) {
  const bedrockNames = [
    'ModelTimeoutException',
    'ModelNotReadyException',
    'ModelErrorException',
    'ServiceUnavailableException',
    'InternalServerException',
    'ValidationException'
  ]
  return bedrockNames.includes(err.name) ||
    (err.$metadata?.httpStatusCode >= 500 && !isCredentialError(err))
}

function isValidationError(err) {
  return err.code === 'VALIDATION' ||
    err.name === 'ValidationError' ||
    err.status === 400
}

function isCorsError(err) {
  return err.code === 'CORS_ERROR' ||
    (err.message && err.message.includes('CORS')) ||
    (err.message && err.message.includes('Not allowed by CORS'))
}
