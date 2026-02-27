export function Header({ activeType, onTypeChange }) {
  return (
    <header className="app-header">
      <h1>Global Search</h1>
      <div className="type-toggle">
        <button
          type="button"
          className={activeType === 'lead' ? 'active' : ''}
          onClick={() => onTypeChange('lead')}
        >
          Lead
        </button>
        <button
          type="button"
          className={activeType === 'opportunity' ? 'active' : ''}
          onClick={() => onTypeChange('opportunity')}
        >
          Opportunity
        </button>
      </div>
    </header>
  )
}
