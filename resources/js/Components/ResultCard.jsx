export function ResultCard({ item }) {
  const status = (item.status || '').toLowerCase()
  const isLead = item.type === 'lead'
  const ctaLabel = isLead ? 'Open Contact Detail' : 'Open Opportunity Detail'
  const typeLabel = isLead ? 'Lead' : 'Opportunity'

  return (
    <article className="result-card">
      <div className="result-card-left">
        <h3 className="result-card-name">{item.name}</h3>
        <div className="result-card-pills">
          <span className={`status-badge ${status}`}>{item.status}</span>
          <span className="pill">
            {typeLabel} #{item.id} – {item.email}
          </span>
          <span className="pill">Owner {item.owner}</span>
          <span className="pill">BU {item.businessUnit}</span>
          {item.stage && <span className="pill">Stage {item.stage}</span>}
        </div>
      </div>
      <div className="result-card-right">
        <button type="button" className="cta-button">
          {ctaLabel}
        </button>
      </div>
    </article>
  )
}
