import './SearchForm.css'
import { useState } from 'react'

export default function SearchForm(props) {
  const [query, setQuery] = useState('')
  const [searchYear, setSearchYear] = useState('')
  const [searchCollection, setSearchCollection] = useState('')
  const [searchSourceArchive, setSearchSourceArchive] = useState('')
  const [searchRecordType, setSearchRecordType] = useState('')
  const [searchStatus, setSearchStatus] = useState('')

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const performSearch = () => {
    const params = {
      query,
      searchYear,
      searchCollection,
      searchSourceArchive,
      searchRecordType,
      searchStatus,
    }
    props.onSubmit(params)
  }
  const clearSearchFields = () => {
    setQuery('')
    setSearchYear('')
    setSearchCollection('')
    setSearchSourceArchive('')
    setSearchRecordType('')
    setSearchStatus('')
  }
  const show = showAdvancedSearch ? 'show' : ''
  const advancedSearchClassName = `advancedSearchOptions uk-grid-small ${show}`

  // If logged in
  const advancedSearchOptionsClass = !props.isLoggedIn
    ? 'uk-width-1-3@s'
    : 'uk-width-1-4@s'

  return (
    <form
      className="uk-margin-large-top"
      onSubmit={(e) => {
        e.preventDefault()
        performSearch()
      }}
    >
      <div className="searchBar uk-grid-small" uk-grid="true">
        <div className="uk-width-expand@s">
          <input
            className="uk-input"
            value={query}
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setQuery(e.target.value)
            }}
          />
        </div>
        <div className="uk-width-1-3@s">
          <select
            className="uk-select"
            value={searchYear}
            onChange={(e) => {
              setSearchYear(e.target.value)
            }}
          >
            <option value="">Year</option>
            {props.years.map((year) => (
              <option key={year} value={year}>
                {' '}
                {year}{' '}
              </option>
            ))}
          </select>
        </div>
        <div
          className="advancedSearchButton uk-width-auto@s uk-grid-small"
          uk-grid="true"
        >
          <div className="uk-width-auto">
            <button
              className="uk-button uk-button-default"
              uk-icon="more"
              uk-tooltip="Advanced Search Options"
              onClick={() => {
                setShowAdvancedSearch(!showAdvancedSearch)
              }}
            ></button>
          </div>
          <div className="uk-width-auto">
            <button
              className="uk-button uk-button-default"
              type="submit"
              uk-icon="refresh"
              uk-tooltip="Clear Search"
              onClick={() => {
                clearSearchFields()
              }}
            ></button>
          </div>
          <div className="uk-width-auto">
            <button
              className="uk-button uk-button-primary searchButton"
              type="submit"
              uk-icon="search"
              uk-tooltip="Search"
            ></button>
          </div>
        </div>
      </div>

      <div className={advancedSearchClassName} uk-grid="true">
        <div className={advancedSearchOptionsClass}>
          <select
            className="uk-select"
            value={searchRecordType}
            onChange={(e) => {
              setSearchRecordType(e.target.value)
            }}
          >
            <option value=""> Type </option>
            {props.recordTypes.map(({ id, name }) => (
              <option key={id} value={id}>
                {' '}
                {name}{' '}
              </option>
            ))}
          </select>
        </div>
        <div className={advancedSearchOptionsClass}>
          <select
            className="uk-select"
            value={searchSourceArchive}
            onChange={(e) => {
              setSearchSourceArchive(e.target.value)
            }}
          >
            <option value=""> Source Archive </option>
            {props.sourceArchives.map(({ id, name }) => (
              <option key={id} value={id}>
                {' '}
                {name}{' '}
              </option>
            ))}
          </select>
        </div>
        <div className={advancedSearchOptionsClass}>
          <select
            className="uk-select"
            value={searchCollection}
            onChange={(e) => {
              setSearchCollection(e.target.value)
            }}
          >
            <option value=""> Collection </option>
            {props.collections.map(({ id, name }) => (
              <option key={id} value={id}>
                {' '}
                {name}{' '}
              </option>
            ))}
          </select>
        </div>
        {props.isLoggedIn && (
          <div className={advancedSearchOptionsClass}>
            <select
              className="uk-select"
              value={searchStatus}
              onChange={(e) => {
                setSearchStatus(e.target.value)
              }}
            >
              <option value="">Status</option>
              {props.status.map(({ id, name }) => (
                <option key={id} value={id}>
                  {' '}
                  {name}{' '}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </form>
  )
}
