/**
 * Filter items by active type (lead | opportunity).
 */
export function filterByType(items, activeType) {
  if (!items?.length) return []
  return items.filter((item) => item.type === activeType)
}

/**
 * Filter items by selected business units. If none selected, show all.
 */
export function filterByBusinessUnits(items, selectedBusinessUnits) {
  if (!items?.length) return []
  if (!selectedBusinessUnits?.length) return items
  return items.filter((item) => selectedBusinessUnits.includes(item.businessUnit))
}

/**
 * Case-insensitive search across name, email, id.
 */
export function filterBySearchQuery(items, query) {
  if (!items?.length) return []
  const q = (query || '').trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (item) =>
      (item.name || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.id || '').toLowerCase().includes(q)
  )
}

/**
 * Apply pipeline: type → business units → search query.
 */
export function applyFilters(items, { activeType, selectedBusinessUnits, searchQuery }) {
  let result = filterByType(items, activeType)
  result = filterByBusinessUnits(result, selectedBusinessUnits)
  result = filterBySearchQuery(result, searchQuery)
  return result
}
