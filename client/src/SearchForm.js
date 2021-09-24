import './SearchForm.css'
import {useState} from 'react';

export default function SearchForm(props) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  const show = showAdvancedSearch ? "show" : "" 
  const advancedSearchClassName = `advancedSearchOptions uk-grid-small ${show}`
  return (
    <form className="uk-margin-top" onSubmit={props.onSubmit}>
        <div className="searchBar uk-grid-small" uk-grid>
          <div className="uk-width-expand@s">
            <input className="uk-input" type="text" placeholder="Search" onChange={props.changeQuery} />
          </div>
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={props.changeYear}>
              <option value="">Year</option>
              { props.years.map(year => <option key={year} value={year}> {year} </option>)}
            </select>
          </div>
          <div className="advancedSearchButton uk-width-auto@s uk-grid-small" uk-grid>
            <div class="uk-width-auto">
              <button 
                className="uk-button uk-button-default"
                uk-icon="more"
                uk-tooltip="Advanced Search Options"
                onClick={() => {
                  setShowAdvancedSearch(!showAdvancedSearch)
                }}
              ></button>
            </div>
            <div class="uk-width-auto">
              <button 
                class="uk-button uk-button-primary searchButton"
                type="submit"
                uk-icon="search"
                uk-tooltip="Search">
              </button>
            </div>   
          </div>
        </div>
        
      <div className={advancedSearchClassName} uk-grid> 
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={props.changeRecordType}>
              <option value=""> Type </option>
              { props.recordTypes.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
            </select>
          </div>
          <div className="uk-width-1-3@s">
            <select className="uk-select" onChange={props.changeSourceArchive}>
              <option value=""> Source Archive </option>
              { props.sourceArchives.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
            </select>
          </div>
          <div class="uk-width-1-3@s">
            <select className="uk-select" onChange={props.changeCollection}>
              <option value=""> Collection </option>
              { props.collections.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
            </select>
          </div>
        </div>
      </form>
  );
}
