export const sessionStorageKey = 'nawa-pos-session'

export function readSession() {
  const raw = sessionStorage.getItem(sessionStorageKey)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(sessionStorageKey)
    return null
  }
}

export function saveSession(session) {
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(sessionStorageKey)
}
