import './SearchForm.css'
import {useState} from 'react';

export default function SearchForm(props) {
  const [query, setQuery] = useState("")
  const [searchYear, setSearchYear] = useState("")
  const [searchCollection, setSearchCollection] = useState("")
  const [searchSourceArchive, setSearchSourceArchive] = useState("")
  const [searchRecordType, setSearchRecordType] = useState("")

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  const show = showAdvancedSearch ? "show" : "" 
  const advancedSearchClassName = `advancedSearchOptions uk-grid-small ${show}`
  return (
    <form className="uk-margin-top" onSubmit={(e) => {
      e.preventDefault()
      const params = {query, searchYear, searchCollection, searchSourceArchive, searchRecordType}
      props.onSubmit(params)
    }}>
        <div className="searchBar uk-grid-small" uk-grid="true">
          <div className="uk-width-expand@s">
            <input className="uk-input" type="text" placeholder="Search" onChange={(e) => {
              setQuery(e.target.value)
            }} />
          </div>
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={(e) => {
              setSearchYear(e.target.value)
            }}>
              <option value="">Year</option>
              { props.years.map(year => <option key={year} value={year}> {year} </option>)}
            </select>
          </div>
          <div className="advancedSearchButton uk-width-auto@s uk-grid-small" uk-grid="true">
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
                className="uk-button uk-button-primary searchButton"
                type="submit"
                uk-icon="search"
                uk-tooltip="Search">
              </button>
            </div>   
          </div>
        </div>
        
      <div className={advancedSearchClassName} uk-grid="true"> 
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={(e) => {
              setSearchRecordType(e.target.value)
            }}>
              <option value=""> Type </option>
              { props.recordTypes.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
            </select>
          </div>
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={(e) => {
              setSearchSourceArchive(e.target.value) 
            }}>
              <option value=""> Source Archive </option>
              { props.sourceArchives.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
            </select>
          </div>
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={(e) => {
              setSearchCollection(e.target.value)
            }}>
              <option value=""> Collection </option>
              { props.collections.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
            </select>
          </div>
        </div>
      </form>
  );
}
