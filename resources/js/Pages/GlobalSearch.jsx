import { useState, useMemo } from 'react'
import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchBar'
import { BusinessUnitFilter } from '../components/BusinessUnitFilter'
import { ResultList } from '../components/ResultList'
import { mockData } from '../data/mockData'
import { applyFilters } from '../utils/filterUtils'

import '../../css/global-search.css'

export default function GlobalSearch() {
  const [activeType, setActiveType] = useState('lead')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([])

  const filteredItems = useMemo(
    () =>
      applyFilters(mockData.all, {
        activeType,
        selectedBusinessUnits,
        searchQuery,
      }),
    [activeType, selectedBusinessUnits, searchQuery]
  )

  return (
    <div className="main-container">
      <Header activeType={activeType} onTypeChange={setActiveType} />
      <div className="search-filter-row">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <BusinessUnitFilter
          selected={selectedBusinessUnits}
          onChange={setSelectedBusinessUnits}
        />
      </div>
      <ResultList items={filteredItems} />
    </div>
  )
}