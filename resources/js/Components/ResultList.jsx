import { ResultCard } from './ResultCard'

export function ResultList({ items }) {
  if (!items.length) {
    return (
      <div className="result-list empty">
        No results match your filters.
      </div>
    )
  }

  return (
    <div className="result-list">
      {items.map((item) => (
        <ResultCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  )
}
