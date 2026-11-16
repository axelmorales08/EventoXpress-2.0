// Funciones de formato usadas en varias pantallas

// "2026-09-15" -> "15/09/2026" (sin problemas de zona horaria)
export function formatDate(value) {
  if (!value) return '-'
  const [y, m, d] = String(value).slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function formatPrice(value) {
  return Number(value).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

// Rango de precios de un evento según sus entradas
export function priceRange(tickets = []) {
  if (!tickets.length) return 'Sin entradas cargadas'
  const prices = tickets.map((t) => Number(t.price))
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === 0 && max === 0) return 'Gratis'
  return min === max ? formatPrice(min) : `Desde ${formatPrice(min)}`
}

// "finalizado" | "en curso" | "próximo"
export function eventSituation(event) {
  const today = new Date().toISOString().slice(0, 10)
  if (event.ending < today) return 'finalizado'
  if (event.beginning > today) return 'próximo'
  return 'en curso'
}
