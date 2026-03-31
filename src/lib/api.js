export async function fetchJson(url, options) {
  const response = await fetch(url, options)

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.')
  }

  return data
}
