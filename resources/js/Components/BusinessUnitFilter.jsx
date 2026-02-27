const BUSINESS_UNITS = ['Retail', 'Alliance', 'Enterprise']

export function BusinessUnitFilter({ selected, onChange }) {
  const toggle = (bu) => {
    if (selected.includes(bu)) {
      onChange(selected.filter((s) => s !== bu))
    } else {
      onChange([...selected, bu])
    }
  }

  return (
    <div className="bu-buttons">
      {BUSINESS_UNITS.map((bu) => (
        <button
          key={bu}
          type="button"
          className={selected.includes(bu) ? 'selected' : ''}
          onClick={() => toggle(bu)}
        >
          {bu}
        </button>
      ))}
    </div>
  )
}
