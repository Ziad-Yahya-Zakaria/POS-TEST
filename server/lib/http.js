export function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next)
  }
}

export function requireFields(payload, fields) {
  const missing = fields.filter((field) => {
    const value = payload?.[field]
    return value === undefined || value === null || value === ''
  })

  return missing
}

export function databaseConfigured(response) {
  if (process.env.DATABASE_URL) {
    return true
  }

  response.status(503).json({
    message: 'SQL Server is not configured. Please set DATABASE_URL first.',
  })

  return false
}
